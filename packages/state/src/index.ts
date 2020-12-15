import ProxyPolyfillBuilder from "proxy-polyfill/src/proxy";
const ProxyPolyfill: ProxyConstructor = ProxyPolyfillBuilder();

export type Primitive = bigint | boolean | null | number | string | symbol | undefined;
export type PlainObject = {
  [key in string | number | symbol]: PlainObject | Primitive | PlainObject[] | Primitive[];
};
export type StateEvent<T1 extends PlainObject> = (newValue: T1, oldValue: T1) => void;
export type Condition<T1 extends PlainObject> = (newValue: T1, oldValue: T1) => boolean;
export type ObservableState<T1 extends PlainObject> = {
  value: T1;
  get(): T1;
  set(setter: ((oldValue: T1) => Partial<T1>) | Partial<T1>): void;
  subscribe: (event: StateEvent<T1>, condition: Condition<T1>) => () => void;
};

export class State<T1 extends PlainObject> implements ObservableState<T1> {
  private proxy: { state: T1 };
  private observers: { id: symbol; observer: StateEvent<T1>; condition: Condition<T1> }[] = [];

  constructor(initial: T1) {
    const localCopy = State.merge(initial);

    this.proxy = this.observe({ state: localCopy }, ([, ...path], value) => {
      const oldValue = State.merge(this.proxy.state);
      const newValue = State.merge(oldValue, State.createPatch(path, value) as Partial<T1>);
      for (const { observer, condition } of this.observers) {
        if (condition.apply(null, [newValue, oldValue])) {
          observer.apply(null, [newValue, oldValue]);
        }
      }
    });
  }

  public get value(): T1 {
    return this.proxy.state;
  }

  public set value(value: T1) {
    this.proxy.state = State.merge(this.proxy.state, value);
  }

  public get = () => this.value;

  public set = (newValue: ((oldValue: T1) => Partial<T1>) | Partial<T1>) => {
    if (typeof newValue === "function") {
      this.value = (newValue as (oldValue: T1) => T1)(this.value);
    } else {
      this.value = newValue as T1;
    }
  };

  public subscribe = (candidate: StateEvent<T1>, condition: Condition<T1> = () => true) => {
    const id = Symbol(candidate.name || "noName");
    this.observers.push({ id, observer: candidate, condition });

    return () => {
      this.observers = this.observers.filter((observer) => observer.id !== id);
    };
  };

  public unsubscribeAll = () => {
    this.observers = [];
  };

  private observe<T2 extends PlainObject = T1>(
    obj: T2,
    callback: (path: (string | number | symbol)[], value: any) => void
  ) {
    function buildProxy(obj: T2, path: (string | number | symbol)[] = []): T2 {
      const proxy = new ProxyPolyfill(obj, {
        set(target, property, newValue) {
          callback([...path, property], newValue);
          target[property as any] = newValue;
          return true;
        },
        get(target, property) {
          const out = target[property as any];
          if (out instanceof Object && !Array.isArray(out)) {
            return buildProxy(out as T2, [...path, property]);
          }
          return out;
        },
      });

      return proxy;
    }

    return buildProxy(obj);
  }

  static merge<T1 extends PlainObject>(primary: T1, ...objects: Partial<T1>[]): T1 {
    const isObject = (candidate: any): candidate is PlainObject | PlainObject[] | Primitive[] =>
      candidate && typeof candidate === "object";

    return [primary, ...objects].reduce((accumulator: T1, candaidate: PlainObject) => {
      Object.keys(candaidate).forEach((key) => {
        const prevValue = accumulator[key];
        const candidateValue = candaidate[key];

        if (!prevValue && isObject(candidateValue) && !Array.isArray(candidateValue)) {
          accumulator[key as any] = State.merge(candidateValue);
        } else if (
          isObject(prevValue) &&
          isObject(candidateValue) &&
          !Array.isArray(prevValue) &&
          !Array.isArray(candidateValue)
        ) {
          accumulator[key as any] = State.merge(prevValue, candidateValue);
        } else {
          accumulator[key as any] = candidateValue;
        }
      });

      return accumulator;
    }, {} as T1);
  }

  static createPatch([key, ...path]: (string | number | symbol)[], value: any): PlainObject {
    if (!key) {
      return value;
    }

    return { [key]: State.createPatch(path, value) };
  }
}


export type Key = number | string | symbol;
export type StateEvent<T1> = (newValue: T1, oldValue: T1) => void;
export type Condition<T1> = (newValue: T1, oldValue: T1) => boolean;

export class ObjectWithSubscription<T1 extends Record<Key, any> = {}> {
  private state: T1;
  private observers: Set<{ callback: StateEvent<T1>; condition: Condition<T1> }> = new Set([]);

  constructor(value: T1) {
    this.state = { ...value };
    this.get = this.get.bind(this);
    this.set = this.set.bind(this);
    this.subscribe = this.subscribe.bind(this);
  }

  public get value() {
    return { ...this.state };
  }

  public set value(value: T1) {
    const oldValue = this.value;
    const newValue = { ...value };
    this.state = newValue;

    this.observers.forEach(({ callback, condition }) => {
      if (condition.apply(null, [newValue, oldValue])) {
        callback.apply(null, [newValue, oldValue]);
      }
    });
  }

  public get = (key?: keyof T1) => {
    return key ? this.value[key] : this.value;
  };

  public set = (newValue: ((oldValue: T1) => T1) | T1) => {
    if (typeof newValue === 'function') {
      this.value = (newValue as (oldValue: T1) => T1)(this.value);
    } else {
      this.value = { ...newValue };
    }
  };

  public subscribe = (event: StateEvent<T1>, condition: Condition<T1> = () => true) => {
    const observer = { callback: event, condition };
    const subscription = {
      subscribe: () => {
        this.observers.add(observer);
        return subscription;
      },
      unsubscribe: () => {
        this.observers.delete(observer);
        return subscription;
      },
    };

    return subscription.subscribe();
  };

  static create = (value: Record<Key, any>) => {
    return new ObjectWithSubscription(value);
  }
}
import { State } from "./index";

describe("class State", () => {
  describe("constructor", () => {
    test("should create observable from object-like values", () => {
      const initial = { foo: "value1", bar: { sub: "value2" } };
      const state = new State(initial);
      expect(state.value).toEqual(initial);
      expect(state).toBeInstanceOf(State);
    });

    test("initial values should be cloned from ancestor", () => {
      const initial = { foo: "value1", bar: { sub: "value2" } };

      const state = new State(initial);
      expect(state.value).not.toBe(initial);

      initial.foo = "value0";
      state.value.foo = "value7";
      expect(state.value.foo).not.toBe(initial.foo);

      initial.bar.sub = "value1";
      state.value.bar.sub = "value6";
      expect(state.value.bar.sub).not.toBe(initial.bar.sub);
    });

    test("should allow to replace whole value", () => {
      const initial = { foo: "value1", bar: { sub: "value2" } };

      const state = new State(initial);
      const callback = jest.fn();
      state.subscribe(callback);

      state.value = { foo: "value8", bar: { sub: "value9" } };
      expect(callback).toBeCalledTimes(1);
      expect(callback).toBeCalledWith(
        { bar: { sub: "value9" }, foo: "value8" },
        { bar: { sub: "value2" }, foo: "value1" }
      );
    });
  });

  describe(".subscribe", () => {
    test("should call observers on every change", () => {
      const initial = { foo: "value1", bar: { sub: "value2" } };

      const state = new State(initial);
      const callback = jest.fn();
      state.subscribe(callback);

      state.value.foo = "value4";
      expect(callback).toBeCalledTimes(1);
      expect(callback).toBeCalledWith(
        { bar: { sub: "value2" }, foo: "value4" },
        { bar: { sub: "value2" }, foo: "value1" }
      );

      state.value.bar.sub = "value5";
      expect(callback).toBeCalledTimes(2);
      expect(callback).toBeCalledWith(
        { bar: { sub: "value5" }, foo: "value4" },
        { bar: { sub: "value2" }, foo: "value4" }
      );
    });

    test("should call observer only if condition returns true", () => {
      const initial = { foo: "value1", bar: { sub: "value2" } };

      const state = new State(initial);
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      state.subscribe(callback1);
      state.subscribe(
        () => callback2(),
        ({ foo }) => foo === "value0"
      );

      state.value.foo = "value4";
      expect(callback1).toBeCalledTimes(1);
      expect(callback2).toBeCalledTimes(0);

      state.value.foo = "value0";
      expect(callback1).toBeCalledTimes(2);
      expect(callback2).toBeCalledTimes(1);
    });

    test("should return unsubscribe function", () => {
      const initial = { foo: "value1", bar: { sub: "value2" } };

      const state = new State(initial);
      const callback = jest.fn();
      const unsubscribe = state.subscribe(callback);

      state.value.foo = "value4";
      expect(callback).toBeCalledTimes(1);
      unsubscribe();

      state.value.bar.sub = "value5";
      expect(callback).toBeCalledTimes(1);
    });
  });

  describe(".set and .get", () => {
    test(".get should return observable value", () => {
      const initial = { foo: "value1", bar: { sub: "value2" } };
      const state = new State(initial);

      expect(state.get()).toEqual(initial);
      expect(state.get()).toEqual(state.value);
    });

    test(".set should accept plain object as agrument", () => {
      const initial = { foo: "value1", bar: { sub: "value2" } };
      const state = new State(initial);

      state.set({ foo: "value4" });

      expect(state.value).toEqual({ ...initial, foo: "value4" });
    });

    test(".set should accept function as agrument", () => {
      const initial = { foo: "value1", bar: { sub: "value2" } };
      const state = new State(initial);

      state.set((value) => ({
        ...value,
        foo: "value4",
      }));

      expect(state.value).toEqual({ ...initial, foo: "value4" });
    });
  });
});

describe(".merge", () => {
  const initial = { foo: "value1", bar: { sub: "value2" } };

  test("should deep mere given plain object in new one", () => {
    const deepCopy = State.merge(initial, { foo: "value3" });
    expect(deepCopy).toEqual({ ...initial, foo: "value3" });
  });

  test("should accept single argument", () => {
    const deepCopy = State.merge(initial);
    expect(deepCopy).toEqual(initial);
  });

  test("should deep clone objects", () => {
    const deepCopy = State.merge(initial);
    expect(deepCopy).toEqual(initial);

    initial.foo = "value8";
    expect(deepCopy.foo).not.toBe(initial.foo);

    initial.bar.sub = "value9";
    expect(deepCopy.bar.sub).not.toBe(initial.bar.sub);
  });
});

describe(".createPatch", () => {
  test("should create patch-object from path and value", () => {
    expect(State.createPatch(["foo"], "value2")).toEqual({ foo: "value2" });

    expect(State.createPatch(["bar", "sub"], "value5")).toEqual({ bar: { sub: "value5" } });
  });

  test("should accept symbols as indexes", () => {
    const symbolKey = Symbol("key");
    expect(State.createPatch(["bar", symbolKey], "value5")).toEqual({
      bar: { [symbolKey]: "value5" },
    });
  });
});

import { State } from "./index";

describe("class State", () => {
  describe("constructor", () => {
    test("should create observable object-like values", () => {
      const state = new State({ foo: "bar" });
      // expect(state.get()).toEqual({ foo: "bar" });
    });

    // test("object-like values should be cloned from ancestor", () => {
    //   const ancestor = { foo: "bar" };
    //   const state = new State(ancestor);
    //   expect(state.get()).not.toBe(ancestor);

    //   ancestor.foo = "another";
    //   expect(state.get().foo).not.toBe("another");
    // });
  });
});

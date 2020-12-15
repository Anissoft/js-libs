import React from "react";

import { fireEvent, render, act as actDom } from "@testing-library/react";
import { act, renderHook } from "@testing-library/react-hooks";
import { State } from "@anissoft/state";

import useState from ".";

describe("hook useState", () => {
  const initials = { foo: 1, bar: { sub: "string" } };

  test("should return instance of State with passed value", () => {
    const { result } = renderHook(() => useState(initials));

    expect(result.current).toBeInstanceOf(State);
    expect(result.current.value).toEqual(initials);

    act(() => {
      result.current.value.foo = 5;
    });

    expect(result.current.value.foo).toBe(5);
  });

  test("should rerender component when state is updating from the inside of component", async () => {
    const Component = () => {
      const state = useState(initials);
      return (
        <>
          <span>{state.value.foo}</span>
          <button
            onClick={() => {
              act(() => {
                state.value.foo = state.value.foo + 1;
              });
            }}
          />
        </>
      );
    };
    const { container } = render(<Component />);
    const [display, button] = Array.from(container.children);
    expect(display.textContent).toBe("1");
    fireEvent.click(button);
    expect(display.textContent).toBe("2");
    fireEvent.click(button);
    expect(display.textContent).toBe("3");
  });

  test("should rerender component when box is updating from the outside", () => {
    const state = new State(initials);
    const { result } = renderHook(() => useState(state));

    act(() => {
      state.value.bar.sub = "updated string";
    });

    expect(result.current.value.bar.sub).toBe("updated string");
  });

  test("should rerender component only when comparator return true", () => {
    const Component = () => {
      const state = useState(initials, (newValue) => newValue.foo <= 2);
      return (
        <>
          <span>{state.value.foo}</span>
          <button
            onClick={() => {
              act(() => {
                state.value.foo = state.value.foo + 1;
              });
            }}
          />
        </>
      );
    };
    const { container } = render(<Component />);
    const [display, button] = Array.from(container.children);
    expect(display.textContent).toBe("1");
    fireEvent.click(button);
    expect(display.textContent).toBe("2");
    fireEvent.click(button);
    expect(display.textContent).toBe("2");
  });
});

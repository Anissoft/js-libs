import * as React from "react";

import { cleanup, render } from "@testing-library/react";

import { Case, Default, Switch } from "../react-conditions";

describe("Switch component", () => {
  afterEach(cleanup);

  test("Render children without cases", () => {
    const { container } = render(<Switch>Test string;</Switch>);
    expect(container.innerHTML).toBe("Test string;");
  });

  test("Render null as a children", () => {
    const { container } = render(<Switch />);
    expect(container.innerHTML).toBe("");
  });

  test("Should render if case condition === true", () => {
    const { container } = render(
      <Switch>
        Test string;
        <Case condition>Right string;</Case>
        <Case condition={false}>Wrong string;</Case>
      </Switch>
    );
    expect(container.innerHTML).toBe("Test string;Right string;");
  });

  test("Case should accept function as child", () => {
    const { container } = render(
      <Switch>
        Test string;
        <Case condition>{() => "Right string;"}</Case>
        <Case condition={false}>Wrong string;</Case>
      </Switch>
    );
    expect(container.innerHTML).toBe("Test string;Right string;");
  });

  test("Should accept null as child", () => {
    const { container } = render(
      <Switch>
        Test string;
        <Case condition>{() => "Right string;"}</Case>
        {null}
        <Case condition={false}>Wrong string;</Case>
      </Switch>
    );
    expect(container.innerHTML).toBe("Test string;Right string;");
  });

  test("Should render Default if there are no positive cases", () => {
    const { container } = render(
      <Switch>
        <>Test string;</>
        <Case condition={false}>Wrong string;</Case>
        <Default>Right string;</Default>
      </Switch>
    );
    expect(container.innerHTML).toBe("Test string;Right string;");
  });

  test("Should not render Default if there are positive cases", () => {
    const { container } = render(
      <Switch>
        Test string;
        <Case condition>Right string;</Case>
        <Default>Wrong string;</Default>
      </Switch>
    );
    expect(container.innerHTML).toBe("Test string;Right string;");
  });

  test("Should render only one case if condition === true", () => {
    const { container } = render(
      <Switch>
        <>Test string;</>
        <Case condition>Right string;</Case>
        <Case condition>Wrong string;</Case>
      </Switch>
    );
    expect(container.innerHTML).toBe("Test string;Right string;");
  });

  test("Should render only all positive cases, when multiple === true", () => {
    const { container } = render(
      <Switch multiple>
        <>Test string;</>
        <Case condition>Right string;</Case>
        <Case condition={false}>Wrong string;</Case>
        <Case condition>Also right string;</Case>
      </Switch>
    );
    expect(container.innerHTML).toBe("Test string;Right string;Also right string;");
  });

  test("Should render Default if there are no positive cases when multiple === true", () => {
    const { container } = render(
      <Switch multiple>
        <>Test string;</>
        <Case condition={false}>Wrong string;</Case>
        <Default>Right string;</Default>
      </Switch>
    );
    expect(container.innerHTML).toBe("Test string;Right string;");
  });

  test("Should render all positive cases, when multiple === true, but not after case with break === true", () => {
    const { container } = render(
      <Switch multiple>
        <>Test string;</>
        <Case condition break>
          Right string;
        </Case>
        <Case condition={false}>Wrong string;</Case>
        <Case condition>Not right string;</Case>
      </Switch>
    );
    expect(container.innerHTML).toBe("Test string;Right string;");
  });

  test("Should throw error outside", () => {
    const renderWithInvalidCase = () =>
      render(
        <Switch multiple>
          <>Test string;</>
          <Case
            condition={() => {
              throw new Error("💣");
            }}
          >
            Cant see me
          </Case>
        </Switch>
      );
    expect(renderWithInvalidCase).toThrow("💣");
  });

  test("Should render null if Case's children missing", () => {
    const renderCase = jest.fn(() => undefined);
    const { container } = render(
      <Switch multiple>
        <>Test string;</>
        <Case condition break>
          {() => renderCase()}
        </Case>
        <Case condition={false}>Wrong string;</Case>
      </Switch>
    );
    expect(container.innerHTML).toBe("Test string;");
    expect(renderCase).toBeCalled();
  });

  test("Should render null if Default's children missing", () => {
    const renderDefault = jest.fn(() => undefined);
    const { container } = render(
      <Switch multiple>
        <>Test string;</>
        <Case condition={false}>Wrong string;</Case>
        <Default>{() => renderDefault()}</Default>
      </Switch>
    );
    expect(container.innerHTML).toBe("Test string;");
    expect(renderDefault).toBeCalled();
  });
});

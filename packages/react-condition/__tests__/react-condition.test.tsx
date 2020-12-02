import * as React from "react";

import { cleanup, render } from "@testing-library/react";

import { Else, If, Then, ElseIf, ThenIf } from "../src/react-condition";

describe("If component", () => {
  afterEach(cleanup);

  test("Empty render", () => {
    const { container } = render(<If condition={false} />);
    expect(container.innerHTML).toBe("");
  });

  test("Render children if true", () => {
    const { container } = render(
      <If condition>
        <>Test string</>
      </If>
    );
    expect(container.innerHTML).toBe("Test string");
  });

  test("Render children if condition === true when children is function", () => {
    const { container } = render(<If condition>{() => <>Test string</>}</If>);
    expect(container.innerHTML).toBe("Test string");
  });
  test("Render null if condition === false when children is function", () => {
    const { container } = render(
      <If condition={false}>{() => <>Test string</>}</If>
    );
    expect(container.innerHTML).toBe("");
  });

  test("Render array like children", () => {
    const { container } = render(
      <If condition={false}>
        <Else>Test</Else>
        <>String</>
      </If>
    );
    expect(container.textContent).toBe("TestString");
  });

  test("Render Then if true", () => {
    const { container } = render(
      <If condition>
        <Else>Wrong string</Else>
        <Then>Right string</Then>
      </If>
    );
    expect(container.innerHTML).toBe("Right string");
  });

  test("Render function in Then if true", () => {
    const { container } = render(
      <If condition>
        <Else>Wrong string</Else>
        <Then>{() => "Right string"}</Then>
      </If>
    );
    expect(container.innerHTML).toBe("Right string");
  });

  test("Render Thens if true", () => {
    const { container } = render(
      <If condition>
        <Else>Wrong string</Else>
        <Then>Right string</Then>
        <Then>Right string 2</Then>
      </If>
    );
    expect(container.innerHTML).toBe("Right stringRight string 2");
  });

  test("Render Then and Else empty if no children", () => {
    const { container } = render(
      <If condition>
        <Then />
        <Else />
      </If>
    );
    expect(container.innerHTML).toBe("");
  });

  test("Render Else if false", () => {
    const { container } = render(
      <If condition={false}>
        <Then>Wrong string</Then>
        <Else>Right string</Else>
      </If>
    );
    expect(container.innerHTML).toBe("Right string");
    const { container: anotherContainer } = render(
      <If condition={false}>
        <Else>Right string</Else>
      </If>
    );
    expect(anotherContainer.innerHTML).toBe("Right string");
  });

  test("Render function in Else if false", () => {
    const { container } = render(
      <If condition={false}>
        <Then>Wrong string</Then>
        {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
        <Else>{() => {}}</Else>
      </If>
    );
    expect(container.innerHTML).toBe("");
  });

  test("Render nothing if false", () => {
    const { container } = render(
      <If condition={false}>
        <>Test string</>
      </If>
    );
    expect(container.innerHTML).toBe("");
  });

  test("Render ElseIf the same way as If inside Else", () => {
    const { container: container1 } = render(
      <If condition={false}>
        <Else>
          <If condition={true}>
            <>Test string</>
          </If>
        </Else>
      </If>
    );
    const { container: container2 } = render(
      <If condition={false}>
        <ElseIf condition={true}>
          <>Test string</>
        </ElseIf>
      </If>
    );
    expect(container1.innerHTML).toBe("Test string");
    expect(container2.innerHTML).toBe("Test string");
  });

  test("Render ThenIf the same way as If inside Then", () => {
    const { container: container1 } = render(
      <If condition={true}>
        <Then>
          <If condition={true}>
            <>Test string</>
          </If>
        </Then>
      </If>
    );
    const { container: container2 } = render(
      <If condition={true}>
        <ThenIf condition={true}>
          <>Test string</>
        </ThenIf>
      </If>
    );
    expect(container1.innerHTML).toBe("Test string");
    expect(container2.innerHTML).toBe("Test string");
  });
});

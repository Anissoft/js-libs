import * as React from "react";

import { cleanup, render } from "@testing-library/react";

import { Wrapper } from "./Wrapper.component";

describe("Wrapper component", () => {
  afterEach(cleanup);

  test("Empty render", () => {
    const { container } = render(
      <div>
        <Wrapper condition={false}></Wrapper>
      </div>
    );
    expect(container.innerHTML).toBe("<div></div>");
  });

  test("Render children as it is, if condition was false", () => {
    const { container } = render(
      <div>
        <Wrapper condition={false}>Hello there</Wrapper>
      </div>
    );
    expect(container.innerHTML).toBe("<div>Hello there</div>");
  });

  test("Render only children if wrapper are not specified", () => {
    const { container } = render(
      <div>
        <Wrapper condition={true}>Test string</Wrapper>
      </div>
    );
    expect(container.innerHTML).toBe("<div>Test string</div>");
  });

  test("Render wrapper if true", () => {
    const wrapper: React.FC = ({ children }) => <span>{children}</span>;
    const { container } = render(
      <div>
        <Wrapper condition={true} wrapper={wrapper}>
          Test string
        </Wrapper>
      </div>
    );
    expect(container.innerHTML).toBe("<div><span>Test string</span></div>");
  });

  test("Use wrap function if true", () => {
    const wrap = (children: React.ReactNode) => <span>{children}</span>;
    const { container } = render(
      <div>
        <Wrapper condition={true} wrap={wrap}>
          Test string
        </Wrapper>
      </div>
    );
    expect(container.innerHTML).toBe("<div><span>Test string</span></div>");
  });

  test("Don't render wrapper if false", () => {
    const wrapper: React.FC = ({ children }) => <span>{children}</span>;
    const { container } = render(
      <div>
        <Wrapper condition={true} wrapper={wrapper}>
          Test string
        </Wrapper>
      </div>
    );
    expect(container.innerHTML).toBe("<div><span>Test string</span></div>");
  });

  test("Don't use wrap function if false", () => {
    const wrap = (children: React.ReactNode) => <span>{children}</span>;
    const { container } = render(
      <div>
        <Wrapper condition={true} wrap={wrap}>
          Test string
        </Wrapper>
      </div>
    );
    expect(container.innerHTML).toBe("<div><span>Test string</span></div>");
  });

  test("Accept function as child", () => {
    const wrap = (children: React.ReactNode) => <span>{children}</span>;
    const child = () => <>Test string</>;
    const { container } = render(
      <div>
        <Wrapper condition={true} wrap={wrap}>
          {child}
        </Wrapper>
      </div>
    );
    expect(container.innerHTML).toBe("<div><span>Test string</span></div>");
  });

  test("Wrap can return undefined", () => {
    const wrap = () => undefined as any;
    const child = "Test string";
    const { container } = render(
      <div>
        <Wrapper condition={true} wrap={wrap}>
          {child}
        </Wrapper>
      </div>
    );
    expect(container.innerHTML).toBe("<div></div>");
  });
});

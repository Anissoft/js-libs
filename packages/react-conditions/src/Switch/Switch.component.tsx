import * as React from "react";
import { xc } from "../helpers";

export const Case = ({
  children,
}: {
  children?: (() => React.ReactNode) | React.ReactNode;
  condition: (() => any) | any;
  break?: boolean;
}): JSX.Element => {
  return (xc(children) || null) as JSX.Element;
};

export const Default = ({
  children,
}: {
  children?: (() => React.ReactNode) | React.ReactNode;
}): JSX.Element => {
  return (xc(children) || null) as JSX.Element;
};

export function Switch({ children, multiple }: { children?: React.ReactNode; multiple?: boolean }) {
  if (!children || children === null) {
    return null;
  }

  if (
    typeof children === "string" ||
    typeof children === "number" ||
    typeof children === "boolean"
  ) {
    return <>{children}</>;
  }

  const results: { element: React.ReactNode; type: "always" | "condition" | "default" }[] = [];
  const BreakException = {};

  try {
    React.Children.forEach(children, (child) => {
      if (!child || child === null) {
        results.push({
          element: null,
          type: "always",
        });
      } else if (
        typeof child === "string" ||
        typeof child === "number" ||
        typeof child === "boolean"
      ) {
        results.push({
          element: child,
          type: "always",
        });
      } else if ((child as any).type === Case) {
        if (xc((child as any).props.condition)) {
          results.push({
            element: child,
            type: "condition",
          });
        }
        if (xc((child as any).props.break)) {
          throw BreakException;
        }
      } else if ((child as any).type === Default) {
        results.push({
          element: child,
          type: "default",
        });
      } else {
        results.push({
          element: child,
          type: "always",
        });
      }
    });
  } catch (e) {
    if (e !== BreakException) {
      throw e;
    }
  }

  let hasCase = false;
  if (multiple) {
    const result = results.map(({ element, type }) => {
      if (type === "condition") {
        hasCase = true;
      }
      return type !== "default" ? element : null;
    });
    if (result.length === 0 || !hasCase) {
      return <>{results.map(({ element }) => element)}</>;
    }
    return <>{result}</>;
  }

  const result = results.map(({ element, type }) => {
    const candidate = type !== "default" && !hasCase ? element : null;
    if (type === "condition") {
      hasCase = true;
    }
    return candidate;
  });

  if (result.length === 0 || !hasCase) {
    return <>{results.map(({ element }) => element)}</>;
  }
  return <>{result}</>;
}

export default { Switch, Case, Default };

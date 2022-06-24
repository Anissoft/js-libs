import React from "react";
import { xc } from "../helpers";

export const Then = ({
  children,
}: {
  children?: (() => React.ReactNode) | React.ReactNode;
}): JSX.Element => {
  return (xc(children) || null) as JSX.Element;
};

export const Else = ({ children }: { children?: (() => React.ReactNode) | React.ReactNode }) => {
  return (xc(children) || null) as JSX.Element;
};

export const If: React.FunctionComponent<{
  condition: boolean | (() => boolean);
}> = ({ condition, children }) => {
  if (!children || children === null) {
    return null;
  }

  if (typeof children === "function") {
    return xc(condition) ? children() : null;
  }

  const elseTypes = React.useMemo(() => [(<Else />).type, (<ElseIf condition={false} />).type], []);
  const thenTypes = React.useMemo(() => [(<Then />).type, (<ThenIf condition={false} />).type], []);

  if (
    typeof children === "string" ||
    typeof children === "number" ||
    typeof children === "boolean" ||
    (!Array.isArray(children) && !elseTypes.includes((children as any).type))
  ) {
    return xc(condition) ? <>{children}</> : null;
  }
  const options = Array.isArray(children) ? children : [children];
  const thens = options.filter((child: any) => !elseTypes.includes((child || {}).type)) || null;
  const elses = options.filter((child: any) => !thenTypes.includes((child || {}).type)) || null;

  if (xc(condition)) {
    if (thens && thens.length > 1) {
      return <>{thens}</>;
    }
    return thens[0];
  }
  if (elses && elses.length > 1) {
    return <>{elses}</>;
  }
  return elses[0];
};

export const ElseIf: React.FunctionComponent<{
  condition: boolean | (() => boolean);
}> = ({ condition, children }) => (
  <Else>
    <If condition={condition}>{children}</If>
  </Else>
);

export const ThenIf: React.FunctionComponent<{
  condition: boolean | (() => boolean);
}> = ({ condition, children }) => (
  <Then>
    <If condition={condition}>{children}</If>
  </Then>
);

export const Condition: React.FunctionComponent<{
  if: boolean;
  then?: (() => JSX.Element) | JSX.Element;
  else?: (() => JSX.Element) | JSX.Element;
}> = ({ if: $if, then: $then = null, else: $else = null }) => {
  return (
    <If condition={$if}>
      <Then>{$then}</Then>
      <Else>{$else}</Else>
    </If>
  );
};

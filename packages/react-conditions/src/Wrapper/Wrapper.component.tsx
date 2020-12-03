import * as React from "react";
import { xc } from "../helpers";

export const Wrapper: React.FunctionComponent<{
  condition: any | (() => any);
  wrapper?: React.JSXElementConstructor<{ children: React.ReactNode }>;
  wrap?: (children: React.ReactNode) => JSX.Element;
}> = ({ condition, children, wrapper: WrapperComponent, wrap }) => {
  if (xc(condition)) {
    if (WrapperComponent) {
      return <WrapperComponent>{xc(children)}</WrapperComponent>;
    }
    if (wrap) {
      return <>{wrap(xc(children)) || null}</>;
    }
  }
  return <>{xc(children) || null}</>;
};

export default Wrapper;

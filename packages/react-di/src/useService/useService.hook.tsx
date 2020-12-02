import React from "react";
import { InjectIdentificator } from "../types";
import { ContainerContext } from "../provider";

export function useService<T1>(
  identifier: InjectIdentificator
  // deps?: (newValue: T1) => boolean,
) {
  const container = React.useContext(ContainerContext);
  const service: T1 = container.get(identifier);
  // const [, setUpdate] = React.useState(Symbol('-__- '));

  if (!service) {
    throw new Error(`Service with tagname ${String(identifier)} is not registered`);
  }

  return service as T1;
}

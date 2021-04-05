import * as React from "react";

import { PlainObject, State, StateEvent } from "@anissoft/state";

function useState<T1 extends PlainObject>(
  initialValue: T1,
  comparator?: (newValue: T1, oldValue: T1) => boolean
): State<T1>;
function useState<T1 extends PlainObject>(
  initialValue: State<T1>,
  comparator?: (newValue: T1, oldValue: T1) => boolean
): State<T1>;
function useState<T1 extends PlainObject, T2 extends State<T1>>(
  initialValue: T2,
  comparator?: (newValue: T1, oldValue: T1) => boolean
): T2;
function useState<T1 extends PlainObject, T2 extends State<T1>>(
  initialValue: T1 | T2 | State<T1>,
  comparator: (newValue: T1, oldValue: T1) => boolean = () => true
) {
  const [, update] = React.useState(Symbol("(-_-)"));
  const state: State<T1> | T2 = React.useMemo(() => {
    if (initialValue instanceof State) {
      return initialValue;
    }
    return new State(initialValue);
  }, []);

  React.useEffect(() => {
    const listener: StateEvent<T1> = (newValue: T1, oldValue: T1) => {
      if (comparator(newValue, oldValue)) {
        update(Symbol("(ಠ_ಠ)"));
      }
    };
    return state.subscribe(listener);
  }, [comparator]);

  if (initialValue instanceof State) {
    return state as T2;
  }
  return state as State<T1>;
}

export default useState;
export const useStateObject = useState;
export * from '@anissoft/state';

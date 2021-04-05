import React from 'react';
import { ObjectWithSubscription } from './utils/objectWithSubscription';

export type ContainerState = Record<number | string | symbol, any>;

const container = new ObjectWithSubscription<ContainerState>({});
const context = React.createContext(container);

export const SharedStateProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const state = React.useRef(new ObjectWithSubscription<ContainerState>({}));

  return React.createElement(
    context.Provider,
    { value: state.current },
    children,
  );
}

export const useSharedState = <T extends Record<number | string | symbol, any> = {}>(
  key: number | string | symbol,
  defaultState: T
) => {
  const sharedState = React.useContext(context);
  const [state, setState] = React.useState<T>(sharedState.get(key) || defaultState);
  const subscription = React.useRef<{ subscribe: () => void; unsubscribe: () => void }>()

  React.useEffect(() => {
    if (!sharedState.get(key)) {
      sharedState.set({ ...sharedState.value, [key]: state });
    }
    subscription.current = sharedState.subscribe((value) => {
      setState(value[key as string]);
    });

    return () => {
      subscription.current?.unsubscribe();
    }
  }, [key]);

  const updateState: React.Dispatch<React.SetStateAction<T>> = React.useCallback(
    ((candidate: React.SetStateAction<T>) => {
      const newValue = typeof candidate === 'function'
        ? (candidate as (oldState: T) => T)(state)
        : { ...candidate };

      setState(newValue);
      sharedState.set({ ...sharedState.value, [key]: newValue });
    }),
    [key, state, setState],
  );
  return [state, updateState] as const;
}

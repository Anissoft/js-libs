import React from 'react';

type CustomReactEvent = string;
type CustomReactEventListener<T = any> = (event: T) => void;

const eventsContext = React.createContext<{
  events: Record<CustomReactEvent, CustomReactEventListener[]>;
  setEvents: React.Dispatch<React.SetStateAction<Record<string, CustomReactEventListener[]>>>,
}>({
  events: {},
  setEvents: () => undefined,
});
const dispatchDefault = () => undefined;
const dispatchContext = React.createContext<(event: CustomReactEvent, payload: any) => void>(dispatchDefault);
const dispatchGlobal: Set<(event: CustomReactEvent, payload: any) => void> = new Set();

export const CustomEventScope = ({
  stopPropagation = false, // do not call listeners for event in the parent scope, if listeners were called inside current one
  isolate = false, // do not call listeners for event in the parent scope at all
  children
}: React.PropsWithChildren<{ stopPropagation?: boolean; isolate?: boolean }>) => {
  const propagate = React.useContext(dispatchContext);
  const [events, setEvents] = React.useState<Record<CustomReactEvent, CustomReactEventListener[]>>({});

  const dispatch = React.useCallback((event: CustomReactEvent, payload: any) => {
    if (events[event]) {
      events[event].forEach(listener => {
        try {
          listener(payload);
        } catch (error) {
          console.error(error);
        }
      });
      if (!stopPropagation && !isolate) {
        propagate(event, payload);
      }
    } else if (!isolate) {
      propagate(event, payload);
    }
  }, [events, propagate, stopPropagation]);

  React.useEffect(() => {
    if (propagate === dispatchDefault && !isolate) {
      dispatchGlobal.add(dispatch);
      return () => {
        dispatchGlobal.delete(dispatch);
      }
    }
  }, [propagate, dispatch, isolate]);

  return (
    <eventsContext.Provider value={{ events, setEvents }}>
      <dispatchContext.Provider value={dispatch}>
        {children}
      </dispatchContext.Provider>
    </eventsContext.Provider>
  );
}

export const useAddCustomEventListener = () => {
  const currentScope = React.useContext(eventsContext);
  return React.useCallback(function <T = undefined>(event: CustomReactEvent, listener: CustomReactEventListener<T>) {
    currentScope.setEvents(events => {
      const localCopy = { ...events };
      if (!localCopy[event]) {
        localCopy[event] = [];
      }
      localCopy[event].push(listener)
      return localCopy;
    });

    return () => {
      currentScope.setEvents(events => {
        const localCopy = { ...events };
        const listeners = new Set(localCopy[event]);
        listeners.delete(listener);
        if (listeners.size === 0) {
          delete localCopy[event];
        } else {
          localCopy[event] = Array.from(listeners);
        }
        return localCopy;
      });
    }
  }, []);
}

export function useCustomEventListener<T = undefined>(event: CustomReactEvent, listener: CustomReactEventListener<T>) {
  const addCustomEventListener = useAddCustomEventListener()

  React.useEffect(() => {
    return addCustomEventListener(event, listener);
  }, [event, listener]);
}

export const useDispatchCustomEvent = () => {
  return React.useContext(dispatchContext);
}

export const dispatchGlobalCustomEvent = (event: CustomReactEvent, paylaod: any) => {
  dispatchGlobal.forEach(dispatch => {
    try {
      dispatch(event, paylaod);
    } catch (error) {
      console.error(error);
    }
  })
}
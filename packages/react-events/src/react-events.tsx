import React from 'react';

export type CustomEventName = string;
export type CustomEventListener<T = any> = (event: T) => (void | boolean);

const globalEvents: Record<CustomEventName, Set<CustomEventListener>> = {};

export const removeGlobalEventListener = (event: CustomEventName, listener: CustomEventListener) => {
  globalEvents[event]?.delete(listener);
}

export const addGlobalEventListener = (event: CustomEventName, listener: CustomEventListener) => {
  if (!globalEvents[event]) {
    globalEvents[event] = new Set();
  }
  globalEvents[event].add(listener);

  return () => removeGlobalEventListener(event, listener);
}
export const dispatchGlobalEvent = (event: CustomEventName, payload: any) => {
  if (globalEvents[event]) {
    globalEvents[event].forEach(listener => {
      try {
        listener(payload);
      } catch (error) {
        /* istanbul ignore next */
        console.error(error);
      }
    })
  }
}

const addListenerContext = React.createContext(addGlobalEventListener);
const dispatchContext = React.createContext(dispatchGlobalEvent);

export const CustomEventScope = ({
  isolate = false,
  children,
}: React.PropsWithChildren<{ isolate?: boolean }>) => {
  const bubbleUp = React.useContext(dispatchContext);
  const [events, setEvents] = React.useState<Record<CustomEventName, Set<CustomEventListener>>>({});

  const dispatch = React.useCallback((event: CustomEventName, payload: any) => {
    let preventBubbleUp = false;
    if (events[event]) {
      events[event].forEach(listener => {
        try {
          preventBubbleUp = !!listener(payload) || preventBubbleUp;
        } catch (error) {
          /* istanbul ignore next */
          console.error(error);
        }
      });
    }
    if (!isolate && !preventBubbleUp) {
      bubbleUp(event, payload);
    }
  }, [events, bubbleUp, isolate]);

  const addListener = React.useCallback(function <T = any>(event: CustomEventName, listener: CustomEventListener<T>) {
    setEvents(events => {
      const localCopy = { ...events };
      if (!localCopy[event]) {
        localCopy[event] = new Set();
      }
      localCopy[event].add(listener);
      return localCopy;
    });

    return () => {
      setEvents(events => {
        const localCopy = { ...events };
        if (localCopy[event]) {
          localCopy[event].delete(listener);
        }
        if (localCopy[event].size === 0) {
          delete localCopy[event];
        }
        return localCopy;
      });
    };
  }, [setEvents]);

  return (
    <addListenerContext.Provider value={addListener}>
      <dispatchContext.Provider value={dispatch}>
        {children}
      </dispatchContext.Provider>
    </addListenerContext.Provider>
  );
}

export function useAddCustomEventListener<EventName extends string, Payload = any>() {
  return React.useContext(addListenerContext) as (event: EventName, listener: CustomEventListener<Payload>) => () => void;
}

export function useCustomEventListener<EventName extends string, Payload = any>(
  event: EventName,
  listener: CustomEventListener<Payload>,
  deps: React.DependencyList | undefined = [],
) {
  const addCustomEventListener = useAddCustomEventListener();

  React.useEffect(() => {
    return addCustomEventListener(event, listener);
  }, [event, addCustomEventListener, ...deps]);
}

export function useDispatchCustomEvent<EventName extends string, Payload = any>() {
  return React.useContext(dispatchContext) as (event: EventName, payload: Payload) => void;
}

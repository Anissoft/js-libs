import React from 'react';
import './polyfill';
import { _scopeContext } from './context';

interface EventListener {
  (evt: CustomEvent): void;
}

export function useEventScope<T extends Record<string | number, any>>() {
  const scope = React.useContext(_scopeContext);

  const dispatchEvent = React.useCallback((eventName: string, init: EventInit & { detail?: Partial<T> } = {}) => {
    const event = new CustomEvent(eventName, {
      ...init,
      detail: {
        ...init.detail,
        __meta: {
          scopes: init.bubbles ? [scope.name, ...scope.parents] : [scope.name]
        }
      }
    });
    document.dispatchEvent(event);
  }, [scope.name, scope.parents]);

  const addEventListener = React.useCallback((
    eventName: string,
    listener: EventListener,
  ) => {
    document.addEventListener(eventName, (event: Event & { detail?: Partial<T> & { __meta?: { scopes: (string | symbol)[]; } } }) => {
      const { __meta = { scopes: [] } } = event.detail || { __meta: { scopes: [] } };
      if (__meta.scopes.includes(scope.name)) {
        delete event.detail?.__meta;
        listener(event as CustomEvent);
      }
    });
  }, [scope.name, scope.parents]);

  return React.useMemo(() => ({
    dispatchEvent,
    addEventListener,
  }), [dispatchEvent, addEventListener]);
}
import React from "react";
import { act, render } from "@testing-library/react";
import { cleanup, renderHook } from '@testing-library/react-hooks';

import {
  CustomEventListener,
  CustomEventScope,
  addGlobalEventListener,
  dispatchGlobalEvent,
  removeGlobalEventListener,
  useAddCustomEventListener,
  useCustomEventListener,
  useDispatchCustomEvent,
} from './react-events';

const EventButton = ({ event, payload, label = 'click' }: { event: string; payload: any; label?: string }) => {
  const dispatch = useDispatchCustomEvent();
  return <button onClick={() => dispatch(event, payload)}>{label}</button>
}

const EventListener = ({ event, listener, children }: React.PropsWithChildren<{ event: string; listener: CustomEventListener }>) => {
  useCustomEventListener(event, listener);

  return (<div>{children}</div>);
}

const EventListenerOnce = ({ event, listener, children }: React.PropsWithChildren<{ event: string; listener: CustomEventListener }>) => {
  const addEventListener = useAddCustomEventListener();

  React.useEffect(() => {
    const removeEventListener = addEventListener(event, (payload: any) => {
      listener(payload);
      act(() => removeEventListener());
    })

    return removeEventListener;
  }, []);

  return (<div>{children}</div>);
}

describe("react-events", () => {
  it("Check imports", () => {
    expect(CustomEventScope).toBeDefined();
    expect(addGlobalEventListener).toBeDefined();
    expect(dispatchGlobalEvent).toBeDefined();
    expect(useAddCustomEventListener).toBeDefined();
    expect(useCustomEventListener).toBeDefined();
    expect(useDispatchCustomEvent).toBeDefined();
  });

  it("Should exec all listeners for event in current scope", () => {
    const payload = {};
    const event = 'event-name';
    const listener1 = jest.fn(() => { });
    const listener2 = jest.fn(() => { });
    const listener3 = jest.fn(() => { });

    const { container } = render(
      <CustomEventScope>
        <EventButton event={event} payload={payload} />
        <EventListener event={event} listener={listener1} />
        <EventListener event={event} listener={listener2} />
        <EventListener event={`not${event}`} listener={listener3} />
      </CustomEventScope>
    );

    act(() => container.querySelector('button')?.click());
    expect(listener1).toBeCalledWith(payload);
    expect(listener2).toBeCalledWith(payload);
    expect(listener3).not.toBeCalledWith(payload);
  });

  it("Should exec all listeners for event in parent scope", () => {
    const payload = {};
    const event = 'event-name';
    const listener1 = jest.fn(() => { });
    const listener2 = jest.fn(() => { });
    const listener3 = jest.fn(() => { });

    const { container } = render(
      <CustomEventScope>
        <EventListener event={event} listener={listener1} />
        <EventListener event={event} listener={listener2} />
        <EventListener event={`not${event}`} listener={listener3} />
        <CustomEventScope>
          <EventButton event={event} payload={payload} />
        </CustomEventScope>
      </CustomEventScope>
    );

    act(() => container.querySelector('button')?.click());
    expect(listener1).toBeCalledWith(payload);
    expect(listener2).toBeCalledWith(payload);
    expect(listener3).not.toBeCalledWith(payload);
  });

  it("Shouldn't exec listeners for event in parent scope if current scope isolated", () => {
    const payload = {};
    const event = 'event-name';
    const listener1 = jest.fn(() => { });
    const listener2 = jest.fn(() => { });

    const { container } = render(
      <CustomEventScope>
        <EventListener event={event} listener={listener1} />
        <CustomEventScope isolate>
          <EventListener event={event} listener={listener2} />
          <EventButton event={event} payload={payload} />
        </CustomEventScope>
      </CustomEventScope>
    );

    act(() => container.querySelector('button')?.click());
    expect(listener1).not.toBeCalledWith(payload);
    expect(listener2).toBeCalledWith(payload);
  });

  it("Should be able to remove listeners", () => {
    const payload = {};
    const event = 'event-name';
    const listener1 = jest.fn(() => { });
    const listener2 = jest.fn(() => { });

    const { container, rerender } = render(
      <CustomEventScope>
        <EventListener event={event} listener={listener1} />
        <CustomEventScope>
          <EventListenerOnce event={event} listener={listener2} />
          <EventButton event={event} payload={payload} />
        </CustomEventScope>
      </CustomEventScope>
    );

    act(() => container.querySelector('button')?.click());
    expect(listener1).toBeCalledWith(payload);
    expect(listener2).toBeCalledWith(payload);

    listener1.mockClear();
    listener2.mockClear();

    act(() => container.querySelector('button')?.click());
    expect(listener1).toBeCalledWith(payload);
    expect(listener2).not.toBeCalledWith(payload);

    rerender(
      <CustomEventScope>
        <CustomEventScope>
          <EventButton event={event} payload={payload} />
          <EventListenerOnce event={event} listener={listener2} />
        </CustomEventScope>
      </CustomEventScope>
    );
  });

  it(" <CustomEventScope> should be rendered with children", () => {
    const { container, rerender } = render(
      <CustomEventScope>

      </CustomEventScope>
    );

    expect(container.firstChild).toBeNull();
  })

  describe("Global events", () => {
    it("Global event listener can be dispatched outside from Scope", () => {
      const payload = {};
      const globalListener = jest.fn(() => { });
      expect(() => {
        removeGlobalEventListener('global_event', globalListener);
      }).not.toThrow();
      addGlobalEventListener('global_event', globalListener);

      const { container } = render(
        <button onClick={() => dispatchGlobalEvent('global_event', payload)}>click</button>
      );

      act(() => container.querySelector('button')?.click());
      expect(globalListener).toBeCalledWith(payload);
    });

    it("Global listeners should be triggered, if scope is not isolated", () => {
      const payload = {};
      const globalListener = jest.fn(() => { });
      addGlobalEventListener('global_event', globalListener);

      const { container } = render(
        <CustomEventScope>
          <EventButton event="global_event" payload={payload} />
        </CustomEventScope>
      );

      act(() => container.querySelector('button')?.click());
      expect(globalListener).toBeCalledWith(payload);
    });

    it("Global listeners shouldn't be triggered, if scope IS isolated", () => {
      const payload = {};
      const globalListener = jest.fn(() => { });
      addGlobalEventListener('global_event', globalListener);

      const { container } = render(
        <CustomEventScope isolate>
          <EventButton event="global_event" payload={payload} />
        </CustomEventScope>
      );

      act(() => container.querySelector('button')?.click());
      expect(globalListener).not.toBeCalledWith(payload);
    });

    it("Should be able to remove global event listener ", () => {
      const payload = {};
      const globalListener = jest.fn(() => { });
      addGlobalEventListener('global_event', globalListener);

      const { container } = render(
        <CustomEventScope>
          <EventButton event="global_event" payload={payload} />
        </CustomEventScope>
      );

      act(() => container.querySelector('button')?.click());
      expect(globalListener).toBeCalledWith(payload);
      globalListener.mockClear();

      removeGlobalEventListener('global_event', globalListener);
      act(() => container.querySelector('button')?.click());
      expect(globalListener).not.toBeCalledWith(payload);
    });
  });
});

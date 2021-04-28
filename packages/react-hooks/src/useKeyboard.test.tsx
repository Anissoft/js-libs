import React from 'react';
import { fireEvent, render, act, cleanup } from "@testing-library/react";

import { useKeyboard } from './useKeyboard';

describe('hook useKeyboard', () => {
  afterEach(cleanup);

  test('should execute callback on keydown events', () => {
    const callback = jest.fn(() => undefined);
    const Component = () => {
      useKeyboard(callback);
      return (null);
    };
    const { container } = render(<Component />);

    fireEvent.keyDown(container, { key: 'A', code: 'KeyA' });
    expect(callback).toBeCalled();
    expect(callback).toBeCalledWith(['KeyA', 'A'], 1);

    fireEvent.keyUp(container, { key: 'A', code: 'KeyA' });
    expect(callback).toBeCalled();
    expect(callback).toBeCalledWith([], 0);
  });


  test('should resubscribe eventListeners on deps array change', () => {
    const callback1 = jest.fn(() => undefined);
    const callback2 = jest.fn(() => undefined);
    const Component = ({ callback }: { callback: () => void }) => {
      useKeyboard(callback, [callback]);
      return (null);
    };
    const { container, rerender } = render(<Component callback={callback1} />);

    fireEvent.keyDown(container, { key: 'A', code: 'KeyA' });
    expect(callback1).toBeCalled();
    expect(callback1).toBeCalledWith(['KeyA', 'A'], 1);

    rerender(<Component callback={callback2} />)

    fireEvent.keyDown(container, { key: 'Shift', code: 'ShiftLeft' });
    expect(callback2).toBeCalled();
    expect(callback2).toBeCalledWith(['KeyA', 'A', "ShiftLeft", "Shift"], 2);
  });

  test('should compose all currently pressed keys', () => {
    const callback = jest.fn(() => undefined);
    const Component = () => {
      useKeyboard(callback);
      return (null);
    };
    const { container } = render(<Component />);

    fireEvent.keyDown(container, { key: 'A', code: 'KeyA' });
    fireEvent.keyDown(container, { key: 'Shift', code: 'ShiftLeft' });
    expect(callback).toBeCalled();
    expect(callback).toBeCalledWith(['KeyA', 'A', "ShiftLeft", "Shift"], 2);

    fireEvent.keyUp(container, { key: 'A', code: 'KeyA' });
    expect(callback).toBeCalled();
    expect(callback).toBeCalledWith(["ShiftLeft", "Shift"], 1);
  });

  test('should ignore repeat events', () => {
    const callback = jest.fn(() => undefined);
    const Component = () => {
      useKeyboard(callback);
      return (null);
    };
    const { container } = render(<Component />);
    fireEvent.keyDown(container, { key: 'A', code: 'KeyA' });
    fireEvent.keyDown(container, { key: 'A', code: 'KeyA', repeat: true });
    expect(callback).toBeCalledTimes(1);
  });

  test('should clear composition and call callback on blur event', () => {
    const callback = jest.fn(() => undefined);
    const Component = () => {
      useKeyboard(callback);
      return (null);
    };
    const { container } = render(<Component />);
    fireEvent.keyDown(container, { key: 'A', code: 'KeyA' });

    fireEvent.blur(container.ownerDocument);
    expect(callback).toBeCalled();
    expect(callback).toBeCalledWith([], 0);
  });
});
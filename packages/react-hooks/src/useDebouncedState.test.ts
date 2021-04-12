import { act, renderHook, cleanup } from '@testing-library/react-hooks';

import useDebouncedState from './useDebouncedState';

describe('hook useDebouncedState', () => {
  afterEach(cleanup);

  test('should return initial value', () => {
    const { result } = renderHook(() => useDebouncedState(0, 100));
    expect(result.current[0]).toBe(0);
  });

  test('should update value after delay', (finish) => {
    const { result } = renderHook(() => useDebouncedState(0, 100));
    expect(result.current[0]).toBe(0);
    act(() => {
      result.current[1](v => v + 1);
    });
    expect(result.current[0]).toBe(0);
    setTimeout(
      () => {
        expect(result.current[0]).toBe(1);
        finish();
      },
      200,
    );
  });

  test('should not update value meanwile delays', (finish) => {
    const { result } = renderHook(() => useDebouncedState(0, 100));
    expect(result.current[0]).toBe(0);
    const interval = setInterval(() => {
      act(() => {
        result.current[1](v => v + 1);
      })
    }, 10);
    setTimeout(
      () => {
        expect(result.current[0]).toBe(0);
        clearInterval(interval);
        finish();
      },
      200,
    );
  });
});
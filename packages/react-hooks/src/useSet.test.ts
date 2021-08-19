import { cleanup, act, renderHook } from '@testing-library/react-hooks';

import useSet from './useSet';

describe('hook useSet', () => {
  afterEach(cleanup);

  test('should create Set', () => {
    const { result } = renderHook(() => useSet([1, 2, 3]));
    expect(result.current).toEqual(new Set([1, 2, 3]));
  });

  test('should create empty Set if no default state provided', () => {
    const { result } = renderHook(() => useSet());
    expect(result.current).toEqual(new Set([]));
  });

  test('.add should add value to the set', () => {
    const { result } = renderHook(() => useSet([1, 2, 3]));

    act(() => {
      result.current.add(4);
    });

    expect(result.current.has(4)).toBeTruthy();
    expect(Array.from(result.current)).toEqual([1, 2, 3, 4]);
  });

  test('should not change reference between updates', () => {
    const { result } = renderHook(() => useSet());
    const initialRef = result.current;
    act(() => {
      result.current.add(1);
    });

    expect(result.current.has(1)).toBeTruthy();
    expect(result.current).toBe(initialRef);
  });

  test('.add should not trigger state update, if value already in Set', () => {
    const { result } = renderHook(() => useSet([1, 2, 3]));
    const first = result.current;

    act(() => {
      result.current.add(2);
    });

    const second = result.current;
    expect(first).toBe(second);
  });

  test('.delete should remove value from set', () => {
    const { result } = renderHook(() => useSet([1, 2, 3]));

    act(() => {
      result.current.delete(3);
    });

    expect(result.current.has(3)).toBeFalsy();
    expect(Array.from(result.current)).toEqual([1, 2]);
  });

  test('.delete should not trigger state update, if value already was not in the Set', () => {
    const { result } = renderHook(() => useSet([1, 2, 3]));
    const first = result.current;

    act(() => {
      result.current.delete(4);
    });

    const second = result.current;
    expect(first).toBe(second);
  });

  test('.clear should remove all values from set', () => {
    const { result } = renderHook(() => useSet([1, 2, 3]));

    act(() => {
      result.current.clear();
    });

    expect(result.current.has(1)).toBeFalsy();
    expect(Array.from(result.current)).toEqual([]);
  });

  test('.clear should not trigger rerender, if Set was already empty', () => {
    const { result } = renderHook(() => useSet([]));
    const first = result.current;

    act(() => {
      result.current.clear();
    });

    const second = result.current;
    expect(first).toBe(second);
  });
});
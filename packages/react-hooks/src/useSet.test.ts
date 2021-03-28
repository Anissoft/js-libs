import { cleanup, act, renderHook } from '@testing-library/react-hooks';

import useSet from './useSet';

describe('hook useSet', () => {
  afterEach(cleanup);

  test('should create Set', () => {
    const { result } = renderHook(() => useSet([1, 2, 3]));
    expect(result.current).toEqual(new Set([1, 2, 3]));
  });

  test('.add should add value to the set', () => {
    const { result } = renderHook(() => useSet([1, 2, 3]));

    act(() => {
      result.current.add(4);
    });

    expect(result.current.has(4)).toBeTruthy();
    expect(Array.from(result.current)).toEqual([1, 2, 3, 4]);
  });

  test('.delete should remove value from set', () => {
    const { result } = renderHook(() => useSet([1, 2, 3]));

    act(() => {
      result.current.delete(3);
    });

    expect(result.current.has(3)).toBeFalsy();
    expect(Array.from(result.current)).toEqual([1, 2]);
  });

  test('.clear should remove all values from set', () => {
    const { result } = renderHook(() => useSet([1, 2, 3]));

    act(() => {
      result.current.clear();
    });

    expect(result.current.has(1)).toBeFalsy();
    expect(Array.from(result.current)).toEqual([]);
  });
});
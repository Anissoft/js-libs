import React from 'react';
import { renderHook, act, cleanup } from "@testing-library/react-hooks";

import { useLocalStorage, useSessionStorage } from './useStorage';

class StorageMock {
  private store: Record<string, string> = {};

  clear() {
    this.store = {};
  }

  getItem(key: string) {
    return this.store[key] || null;
  }

  setItem(key: string, value: string) {
    this.store[key] = String(value);
    (this as Record<string, any>)[key] = String(value);
  }

  removeItem(key: string) {
    delete this.store[key];
  }

  key(index: number) {
    return Object.keys(this.store)[index];
  }

  get length() {
    return Object.keys(this.store).length;
  }
};

describe.each([{
  hook: useLocalStorage,
  storage: global.localStorage
}, {
  hook: useSessionStorage,
  storage: global.sessionStorage
}])('hook useStorage', ({
  hook,
  storage,
}: {
  hook: (key: string, defaultValue?: string | undefined) => [string | null, React.Dispatch<React.SetStateAction<string | null>>],
  storage: Storage,
}) => {
  afterEach(() => {
    cleanup();
    storage.clear();
    // global.localStorage = new StorageMock();
    // global.sessionStorage = new StorageMock();
  });

  beforeEach(() => {
    cleanup();
    storage.clear();
    // global.localStorage = new StorageMock();
    // global.sessionStorage = new StorageMock();
  })

  test('should return value and setValue function', () => {
    const { result } = renderHook(() => hook('key'));
    expect(result.current[0]).toBe(null);
    expect(storage.getItem('key')).toBe(null);
    expect(typeof result.current[1]).toBe('function');
  });

  test('setValue should update value in storage and in state', () => {
    const { result } = renderHook(() => hook('key', 'default value'));
    act(() => {
      result.current[1]('new value');
    })
    expect(result.current[0]).toBe('new value');
    expect(storage.getItem('key')).toBe('new value');
  });

  test('should set defaultValue as value in Storage', () => {
    const { result } = renderHook(() => hook('key', 'default value'));
    expect(result.current[0]).toBe('default value');
    expect(storage.getItem('key')).toBe('default value');
  });

  test('should ignore defaultValue if value is not empty in Storage', () => {
    act(() => {
      storage.setItem('key', 'old value');
    })

    const { result } = renderHook(() => hook('key', 'default value'));
    expect(result.current[0]).toBe('old value');
    expect(storage.getItem('key')).toBe('old value');
  });

  test('setValue function should accept function as argument', () => {
    const { result } = renderHook(() => hook('key', 'default value'));

    act(() => {
      result.current[1]((oldValue: string | null) => {
        expect(oldValue).toBe('default value');
        return 'new value';
      });
    })

    expect(result.current[0]).toBe('new value');
    expect(storage.getItem('key')).toBe('new value');
  });

  test('should update state if value in Storage was set', () => {
    const { result } = renderHook(() => hook('key', 'default value'));
    expect(result.current[0]).toBe('default value');

    act(() => {
      storage.setItem('key', 'new value');
    });

    expect(result.current[0]).toBe('new value');
    expect(storage.getItem('key')).toBe('new value');
  });

  test('should update state if value in Storage was removed', () => {
    const { result } = renderHook(() => hook('key', 'default value'));
    expect(result.current[0]).toBe('default value');

    act(() => {
      storage.removeItem('key');
    });

    expect(result.current[0]).toBe(null);
    expect(storage.getItem('key')).toBe(null);
  });

  test('should update state if storage was cleared', () => {
    const { result } = renderHook(() => hook('key', 'default value'));
    expect(result.current[0]).toBe('default value');

    act(() => {
      storage.clear();
    });

    expect(result.current[0]).toBe(null);
    expect(storage.getItem('key')).toBe(null);
  });

  test('should update state if StorageEvent was emited', () => {
    const { result } = renderHook(() => hook('key', 'default value'));
    expect(result.current[0]).toBe('default value');

    act(() => {
      storage.setItem('key', 'new value');
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'key',
        newValue: 'new value',
      }));
    });

    expect(result.current[0]).toBe('new value');
    expect(storage.getItem('key')).toBe('new value');
  });

  test('should do nothing if new value is the same', () => {
    const { result } = renderHook(() => hook('key', 'same value'));
    expect(result.current[0]).toBe('same value');

    act(() => {
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'key',
        newValue: 'same value',
      }));
    });

    expect(result.current[0]).toBe('same value');

    act(() => {
      storage.setItem('key', 'same value');
    });

    expect(result.current[0]).toBe('same value');
  });
});

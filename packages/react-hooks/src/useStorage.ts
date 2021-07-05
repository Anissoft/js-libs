import React from 'react';
import { ObjectWithSubscription } from './utils/objectWithSubscription';

const setItem = Storage.prototype.setItem;
const removeItem = Storage.prototype.removeItem;
const clear = Storage.prototype.clear;

const storages = {
  'local': localStorage,
  'session': sessionStorage,
};

const proxies = {
  'local': new ObjectWithSubscription(localStorage as Record<string, any>),
  'session': new ObjectWithSubscription(sessionStorage as Record<string, any>),
}

Storage.prototype.setItem = function (key, value) {
  setItem.apply(this, [key, value]);
  if (this === window.localStorage) {
    proxies['local'].set((state) => ({ ...state, [key]: value }));
  }
  if (this === window.sessionStorage) {
    proxies['session'].set((state) => ({ ...state, [key]: value }));
  }
};

Storage.prototype.removeItem = function (key) {
  removeItem.apply(this, [key]);
  if (this === window.localStorage) {
    proxies['local'].set((state) => {
      delete state[key];
      return { ...state };
    });
  }
  if (this === window.sessionStorage) {
    proxies['session'].set((state) => {
      delete state[key];
      return { ...state };
    });
  }
};

Storage.prototype.clear = function () {
  clear.apply(this);
  if (this === window.localStorage) {
    proxies['local'].set(() => ({}));
  }
  if (this === window.sessionStorage) {
    proxies['session'].set(() => ({}));
  }
};

export function useStorage(storageType: keyof typeof storages, key: string, defaultValue?: string) {
  const [value, setValue] = React.useState(storages[storageType].getItem(key));
  const ref = React.useRef(value);

  ref.current = value;

  React.useEffect(() => {
    const valueFromStorage = storages[storageType].getItem(key);
    if (typeof defaultValue !== 'undefined' && !valueFromStorage && valueFromStorage !== '') {
      storages[storageType].setItem(key, defaultValue);
    }

    const globalListener = (event: StorageEvent) => {
      if (event.key === key && ref.current !== event.newValue) {
        setValue(event.newValue);
      }
    };
    const storageListener = (state: Record<string, string | null>) => {
      if (ref.current !== state[key]) {
        setValue(state[key]);
      }
    };

    window.addEventListener('storage', globalListener);
    const { unsubscribe } = proxies[storageType].subscribe(storageListener);

    return () => {
      window.removeEventListener('storage', globalListener);
      unsubscribe();
    };
  }, [key]);

  React.useEffect(() => {
    if (value !== storages[storageType].getItem(key)) {
      setValue(storages[storageType].getItem(key));
    }
  }, [key, value]);

  return [
    value,
    (newValue: string | ((state: string | null) => string)) => {
      storages[storageType].setItem(key, typeof newValue === 'function' ? newValue(value) : newValue);
    },
  ] as [string | null, React.Dispatch<React.SetStateAction<string | null>>];
}

export const useLocalStorage = useStorage.bind(null, 'local');
export const useSessionStorage = useStorage.bind(null, 'session');
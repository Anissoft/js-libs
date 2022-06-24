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

const globalListener = (event: StorageEvent) => {
  const key = event.key;
  if (key && event.storageArea === storages['local'] && proxies['local'].value[key] !== event.newValue) {
    proxies['local'].set((state) => ({ ...state, [key]: event.newValue }));
  }
};

window.addEventListener('storage', globalListener);

export function useStorage(storageType: keyof typeof storages, key: string, defaultValue?: string) {
  const valueInStorage = storages[storageType].getItem(key);
  const [value, setValue] = React.useState(valueInStorage === null && defaultValue !== undefined ? defaultValue : valueInStorage);
  const ref = React.useRef(value);

  ref.current = value;

  React.useEffect(() => {
    const valueFromStorage = storages[storageType].getItem(key);
    if (typeof defaultValue !== 'undefined' && !valueFromStorage && valueFromStorage !== '') {
      storages[storageType].setItem(key, defaultValue);
    }

    const { unsubscribe } = proxies[storageType].subscribe((state: Record<string, string | null>) => {
      if (ref.current !== state[key]) {
        setValue(state[key]);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [key]);

  React.useEffect(() => {
    if (value !== storages[storageType].getItem(key)) {
      setValue(storages[storageType].getItem(key));
    }
  }, [key, value]);

  return React.useMemo(
    () => [
      value,
      (newValue: string | ((state: string | null) => string)) => {
        storages[storageType].setItem(key, typeof newValue === 'function' ? newValue(value) : newValue);
      },
    ] as [string | null, React.Dispatch<React.SetStateAction<string | null>>],
    [value],
  );
}

export const useLocalStorage = useStorage.bind(null, 'local');
export const useSessionStorage = useStorage.bind(null, 'session');

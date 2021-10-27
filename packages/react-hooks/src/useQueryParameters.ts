import React from 'react';

import { ObjectWithSubscription } from './utils/objectWithSubscription';

const searchParams = new ObjectWithSubscription(getAllParameters(window.location.search));

export function getAllParameters(searchString?: string) {
  if (!searchString && typeof window !== 'undefined') {
    searchString = window.location.search;
  }
  return Array.from(new URLSearchParams(searchString!).entries())
    .reduce((acc, [name, value]) => ({
      ...acc,
      [name]: value,
    }), {} as Record<string, string>);
}

(() => {
  const replaceState = window.history.replaceState;
  const pushState = window.history.pushState;

  window.history.replaceState = function (data, title, url) {
    if (url) {
      searchParams.set(getAllParameters(url.toString().split('?')[1]));
    }
    return replaceState.apply(history, [data, title, url]);
  };
  window.history.pushState = function (data, title, url) {
    if (url) {
      searchParams.set(getAllParameters(url.toString().split('?')[1]));
    }
    return pushState.apply(history, [data, title, url]);
  };
  window.addEventListener('popstate', () => {
    searchParams.set(getAllParameters(window.location.search));
  });
})();

export const updateQueryString = (
  searchString: string,
  patch: Record<string, string | null | undefined>,
  method: 'replace' | 'push' = 'replace',
) => {
  const query = new URLSearchParams(searchString);
  Object.entries(patch).forEach(([key, value]) => {
    query.delete(key);
    if (value) {
      query.append(key, value);
    }
  });

  const newurl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?${query.toString()}`.replace(/\?$/, '');
  window.history[`${method}State`]({ path: newurl }, '', newurl);
};

export function useQueryParameters() {
  const [value, setValue] = React.useState(searchParams.value);

  React.useEffect(() => {
    const { unsubscribe } = searchParams.subscribe((newValue) => {
      setValue(newValue);
    })

    return () => {
      unsubscribe();
    };
  }, []);

  return React.useMemo(
    () =>
      [
        value,
        (name: string, newValue: string | null, method: 'push' | 'replace' = 'replace') => {
          updateQueryString(window.location.search, { [name]: newValue }, method);
        },
      ] as const,
    [value]
  );
}

export function useQueryParameter(key: string, defaultValue?: string) {
  const [value, setValue] = React.useState(searchParams.value[key] || defaultValue);

  React.useEffect(() => {
    if (!searchParams.value[key] && searchParams.value[key] !== '' && defaultValue) {
      updateQueryString(window.location.search, { [key]: defaultValue }, 'replace');
    }

    const { unsubscribe } = searchParams.subscribe((newValue) => {
      setValue(newValue[key]);
    })

    return () => {
      unsubscribe();
    };
  }, [key]);

  return React.useMemo(
    () =>
      [
        value,
        (newValue: string | null, method: 'push' | 'replace' = 'replace') => {
          if (getAllParameters(window.location.search)[key] !== newValue) {
            updateQueryString(window.location.search, { [key]: newValue }, method);
          }
        },
      ] as const,
    [value, key]
  );
}

export const useQueryStringParameter = useQueryParameter;
export default useQueryParameters;

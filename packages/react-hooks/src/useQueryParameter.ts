import React from 'react';

export const patchQueryString = (search: string, patch: Record<string, string | null | undefined>) => {
  const query = new URLSearchParams(search);

  Object.entries(patch).forEach(([key, value]) => {
    query.delete(key);
    if (value) {
      query.append(key, value);
    }
  });

  return query.toString();
};

export const updateQueryString = (patch: Record<string, string | null | undefined>) => {
  const search = patchQueryString(window.location.search, patch);
  const newurl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?${search}`;
  window.history.replaceState({ path: newurl }, '', newurl);
}

export function useQueryParameter(key: string, defaultValue?: string | null) {
  const [value, setValue] = React.useState(new URLSearchParams(window.location.search).get(key) || defaultValue);

  React.useEffect(() => {
    const replaceState = window.history.replaceState;
    window.history.replaceState = function (state, title, url) {
      if (url) {
        setValue(new URLSearchParams(url.split('?')[1]).get(key));
      }
      return replaceState.apply(history, [state, title, url]);
    };

    return () => {
      window.history.replaceState = replaceState;
    }
  }, []);

  React.useEffect(() => {
    if (new URLSearchParams(window.location.search).get(key) === null && defaultValue) {
      updateQueryString({ [key]: defaultValue })
    }

    const listener = function () {
      setValue(new URLSearchParams(document.location.href.split('?')[1]).get(key));
    };

    window.addEventListener('popstate', listener);
    return () => {
      window.removeEventListener('popstate', listener);
    }
  }, []);

  return [
    value,
    (newValue: string | null) => {
      if (new URLSearchParams(window.location.search).get(key) !== newValue) {
        updateQueryString({ [key]: newValue })
      }
    },
  ] as const;
}

export const useQueryStringParameter = useQueryParameter;
export default useQueryParameter;

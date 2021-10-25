import React from "react";

import { ObjectWithSubscription } from './utils/objectWithSubscription';

type CookieOptions = {
  path?: string;
  domain?: string;
  expires?: string | Date;
  'max-age'?: number | string;
  secure?: boolean;
  samesite?: 'strict' | 'lax';
}

function parseDocumentString(cookiesString: string) {
  if (cookiesString.trim() === '') {
    return {};
  }
  return cookiesString.split(/;\s*/).reduce((acc, cookieString) => {
    const [name, value] = cookieString.split(/=(.+)/);
    return {
      ...acc,
      [name]: value,
    }
  }, {} as Record<string, string>)
}

function updateCookie(name: string, value: string | null, options: CookieOptions = {}) {
  if (value === null) {
    options = { 'max-age': '-1' };
  } else {
    options = {
      path: '/',
      ...options,
    };

    if (options.expires instanceof Date) {
      options.expires = options.expires.toUTCString();
    }

    if (options['max-age']) {
      options['max-age'] = `${options['max-age']}`;
    }
  }


  let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value || '');

  Object.entries(options).forEach(([key, value]) => {
    if (value) {
      updatedCookie += "; " + key;
      if (value !== true) {
        updatedCookie += "=" + value;
      }
    }
  });

  document.cookie = updatedCookie;
}

export const cookies = new ObjectWithSubscription(parseDocumentString(document.cookie));

let timer: any;
let prevCookiesString = document.cookie;
const tick = () => {
  if (document.cookie !== prevCookiesString) {
    cookies.set(parseDocumentString(document.cookie));
    prevCookiesString = document.cookie;
  }
  clearTimeout(timer);
  timer = setTimeout(tick, 100);
};
tick();

export function useDocumentCookies() {
  const [state, setState] = React.useState(cookies.value);

  React.useEffect(() => {
    const { unsubscribe } = cookies.subscribe(setState);
    return () => {
      unsubscribe();
    };
  }, []);

  return React.useMemo(() => [
    state,
    updateCookie,
  ] as const, [state]);
}

export function useDocumentCookie(name: string, defaultValue?: string, defaultOptions?: CookieOptions) {
  const [state, setState] = React.useState(cookies.value[name]);

  React.useEffect(() => {
    if (cookies.value[name] === undefined && defaultValue) {
      updateCookie(name, defaultValue, defaultOptions);
    }
  }, []);

  React.useEffect(() => {
    const { unsubscribe } = cookies.subscribe((newState) => {
      if (newState[name] !== state) {
        setState(newState[name]);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return React.useMemo(() => [
    state,
    (value: string, options?: CookieOptions) => {
      updateCookie(name, value, options);
    },
  ] as const, [name, state])
}

import React from 'react';

export const _scopeContext = React.createContext({
  parents: [] as (string | symbol)[],
  name: Symbol('global') as string | symbol,
});

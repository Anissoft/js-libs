import React from 'react';
import { _scopeContext } from './context';

let scopeIndex = 0;

export const EventScopeProvider = React.memo(({
  name,
  stopPropagation = false,
  children
}: React.PropsWithChildren<{
  stopPropagation?: boolean;
  name?: string | Symbol;
}>) => {
  const scope = React.useContext(_scopeContext);
  const scopeName = React.useMemo(() => {
    if (typeof name === 'string') {
      return Symbol(name);
    }
    if (typeof name === 'symbol') {
      return name;
    }
    scopeIndex = scopeIndex + 1;
    return Symbol(`Unnamed scope ${scopeIndex}`)
  }, []);

  return (
    <_scopeContext.Provider value={{ parents: stopPropagation ? [] : [...scope.parents, scope.name], name: scopeName }}>
      {children}
    </_scopeContext.Provider>
  );
});
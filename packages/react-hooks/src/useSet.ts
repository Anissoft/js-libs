import React from 'react';

export function useSet<T>(initial: T[] = []) {
  const [state, setState] = React.useState(Symbol('initial'));
  return React.useMemo(() => {
    const set = new Set(initial);
    const _add = set.add.bind(set);
    const _delete = set.delete.bind(set);
    const _clear = set.clear.bind(set);


    set.add = (value: T) => {
      if (!set.has(value)) {
        _add(value);
        setState(Symbol('add'));
      }
      return set;
    }

    set.delete = (value: T) => {
      if (set.has(value)) {
        _delete(value);
        setState(Symbol('delete'));
        return true;
      }
      return false;
    }

    set.clear = () => {
      if (set.size !== 0) {
        _clear();
        setState(Symbol('clear'));
      }
    }

    return set;
  }, []);
};

export default useSet;
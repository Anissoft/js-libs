import React from 'react';

export function useSet<T>(initial: T[] = []) {
  const [state, setState] = React.useState(initial);
  return React.useMemo(() => {
    const set = new Set(state);
    const _add = set.add.bind(set);
    const _delete = set.delete.bind(set);
    const _clear = set.clear.bind(set);


    set.add = (value: T) => {
      if (!set.has(value)) {
        _add(value);
        setState(Array.from(set));
      }
      return set;
    }

    set.delete = (value: T) => {
      if (set.has(value)) {
        _delete(value);
        setState(Array.from(set));
        return true;
      }
      return false;
    }

    set.clear = () => {
      if (set.size !== 0) {
        _clear();
        setState([]);
      }
    }

    return set;
  }, [state]);
};

export default useSet;
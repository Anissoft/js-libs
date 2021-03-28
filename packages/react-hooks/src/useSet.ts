import React from 'react';

export default function useSet<T>(initial: T[] = []) {
  const [state, setState] = React.useState(initial);
  return React.useMemo(() => {
    const set = new Set(state);
    const _add = set.add.bind(set);
    const _delete = set.delete.bind(set);
    const _clear = set.clear.bind(set);


    set.add = (value: T) => {
      const result = _add(value);
      setState(Array.from(set));
      return result;
    }

    set.delete = (value: T) => {
      const result = _delete(value);
      setState(Array.from(set));
      return result;
    }

    set.clear = () => {
      _clear();
      setState([]);
    }

    return set;
  }, [initial]);
};

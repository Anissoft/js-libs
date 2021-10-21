import React, { useEffect, useRef, useState } from 'react';

export function useMounted() {
  const [mounted, setMounted] = useState(false);
  const unmounted = useRef(true);

  useEffect(
    () => {
      setMounted(true);
      unmounted.current = false;
      return () => { unmounted.current = true; };
    },
    [],
  );

  return React.useMemo(() => ({ mounted, isMounted: () => !unmounted.current }), [mounted, unmounted]);
};

export default useMounted;
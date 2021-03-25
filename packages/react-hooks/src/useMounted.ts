import { useEffect, useState, useRef } from 'react';

export default function useMounted() {
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

  return { mounted, isMounted: () => !unmounted.current };
};
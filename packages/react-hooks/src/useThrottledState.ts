import { useEffect, useRef, useState, useCallback } from 'react';

export default function useThrottledState<T1>(initialValue: T1, delay: number) {
  const timeouts = useRef<number[]>([]);
  const [throttledValue, setThrottledValue] = useState(initialValue);
  const lastRun = useRef(Date.now());

  const setValue = useCallback((candidate) => {
    const timeLeft = delay - (Date.now() - lastRun.current);
    if (timeLeft <= 0) {
      setThrottledValue(candidate);
      lastRun.current = Date.now();
    } else {
      timeouts.current.push(setTimeout(
        () => setValue(candidate),
        timeLeft,
      ) as unknown as number);
    }
  }, [delay]);

  useEffect(() => () => {
    timeouts.current.forEach(timeout => clearTimeout(timeout));
  }, []);

  return [
    throttledValue,
    setValue,
  ] as [T1, React.Dispatch<React.SetStateAction<T1>>];

};
import { useEffect, useRef, useState } from 'react';

export function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef<number | null>(null);

  useEffect(() => {
    const now = Date.now();
    const ran = lastRan.current ?? now;
    if (lastRan.current === null) {
      lastRan.current = now;
    }

    const handler = setTimeout(() => {
      const currentNow = Date.now();
      if (currentNow - (lastRan.current ?? 0) >= limit) {
        setThrottledValue(value);
        lastRan.current = currentNow;
      }
    }, limit - (now - ran));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
}

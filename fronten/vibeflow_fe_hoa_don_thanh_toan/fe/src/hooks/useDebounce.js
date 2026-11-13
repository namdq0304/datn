import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce a value
 * @template T
 * @param {T} value Value to debounce
 * @param {number} delay Delay in milliseconds (default 300ms)
 * @returns {T} Debounced value
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;

import { useState, useEffect } from 'react';

/**
 * Custom hook to sync state with localStorage
 * @template T
 * @param {string} key localStorage key
 * @param {T} initialValue Initial fallback value
 * @returns {[T, (value: T | ((val: T) => T)) => void]}
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`[useLocalStorage] Error reading key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`[useLocalStorage] Error saving key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;

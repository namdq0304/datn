import { useEffect } from 'react';
import { APP_CONFIG } from '../config';

/**
 * Custom hook to dynamically update page title
 * @param {string} title Page title
 * @param {boolean} [includeAppName=true] Whether to append app name suffix
 */
export function useDocumentTitle(title, includeAppName = true) {
  useEffect(() => {
    const prevTitle = document.title;
    if (title) {
      document.title = includeAppName ? `${title} | ${APP_CONFIG.name}` : title;
    }
    return () => {
      document.title = prevTitle;
    };
  }, [title, includeAppName]);
}

export default useDocumentTitle;

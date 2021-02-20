import { useState, useCallback, useEffect, useRef } from 'react';

// https://qiita.com/seya/items/fd8b49e5c79d471d62e4
export function useAutoFocus<RefType extends HTMLInputElement>(deps: any[] = []) {
  const inputRef = useRef<RefType>(null);

  useEffect(() => {
    const node = inputRef.current;
    if (node) {
      node.focus();
      node.select();
    }
  }, deps);

  return inputRef;
}

export function useHash() {
  const [hash, setHash] = useState(() => window.location.hash.replace(/^#/, ''));

  const onHashChange = useCallback(() => {
    setHash(window.location.hash.replace(/^#/, ''));
  }, []);

  useEffect(() => {
    window.addEventListener('hashchange', onHashChange);
    return () => {
      window.removeEventListener('hashchange', onHashChange);
    };
  }, []);

  const _setHash = useCallback(
    (newHash: string) => {
      if (newHash !== hash) {
        window.location.hash = newHash;
      }
    },
    [hash]
  );

  return [hash, _setHash] as const;
}

// https://usehooks.com/useMedia/
function useMedia(queries: string[], values: boolean[], defaultValue: boolean) {
  // Array containing a media query list for each query
  const mediaQueryLists = queries.map((q) => window.matchMedia(q));

  // Function that gets value based on matching media query
  const getValue = () => {
    // Get index of first media query that matches
    const index = mediaQueryLists.findIndex((mql) => mql.matches);
    // Return related value or defaultValue if none
    return typeof values[index] !== 'undefined' ? values[index] : defaultValue;
  };

  // State and setter for matched value
  const [value, setValue] = useState(getValue);

  useEffect(
    () => {
      // Event listener callback
      // Note: By defining getValue outside of useEffect we ensure that it has ...
      // ... current values of hook args (as this hook callback is created once on mount).
      const handler = () => setValue(getValue);
      // Set a listener for each media query with above handler as callback.
      mediaQueryLists.forEach((mql) => mql.addEventListener('change', handler));
      // Remove listeners on cleanup
      return () => mediaQueryLists.forEach((mql) => mql.removeEventListener('change', handler));
    },
    [] // Empty array ensures effect is only run on mount and unmount
  );

  return value;
}

//https://usehooks.com/useDarkMode/
export function usePrefersDarkMode() {
  return useMedia(['(prefers-color-scheme: dark)'], [true], false);
}

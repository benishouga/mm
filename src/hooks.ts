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

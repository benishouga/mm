import * as React from 'react';

// https://qiita.com/seya/items/fd8b49e5c79d471d62e4
export function useAutoFocus<RefType extends HTMLInputElement>(deps: any[] = []) {
  const inputRef = React.useRef<RefType>(null);

  React.useEffect(() => {
    const node = inputRef.current;
    if (node) {
      node.focus();
      node.select();
    }
  }, deps);

  return inputRef;
}

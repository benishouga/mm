import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import NodeElement from './NodeElement';
import { appState, useActions } from './state';

function BulletList() {
  const [state] = useRecoilState(appState);

  const { selectChildNode, selectUnderNode, selectOverNode } = useActions();

  function keyDownHandler(event: KeyboardEvent) {
    const key = event.key;

    if (key === 'ArrowRight') {
      if (state.editingId) {
        return;
      }
      event.preventDefault();
      selectChildNode();
    } else if (key === 'ArrowDown') {
      if (state.editingId) {
        return;
      }
      event.preventDefault();

      selectUnderNode();
    } else if (key === 'ArrowUp') {
      if (state.editingId) {
        return;
      }
      event.preventDefault();

      selectOverNode();
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', keyDownHandler);
    return () => {
      window.removeEventListener('keydown', keyDownHandler);
    };
  }, [state]);

  return (
    <ul>
      <NodeElement nodeId="root" />
    </ul>
  );
}

export default BulletList;

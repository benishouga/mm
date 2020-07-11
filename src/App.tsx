import React, { useEffect } from 'react';
import NodeElement from './NodeElement';
import { RecoilRoot, useRecoilState } from 'recoil';
import { appState, useActions } from './state';

function App() {
  function InnerApp() {
    const [state] = useRecoilState(appState);
    const {
      completeNodeEditing,
      addNewNode,
      addSiblingNode,
      deleteNode,
      cancelNodeEditing,
      editNode,
      selectParentNode,
      selectChildNode,
      selectUnderNode,
    } = useActions();

    function downHandler(event: KeyboardEvent) {
      const key = event.key;

      if (key === 'Enter') {
        event.preventDefault();

        const editingId = state.editingId;

        if (editingId) {
          completeNodeEditing();
        } else {
          addSiblingNode();
        }
      } else if (key === 'Insert' || key === 'Tab') {
        event.preventDefault();
        addNewNode();
      } else if (key === 'Delete') {
        if (state.editingId) {
          return;
        }
        event.preventDefault();
        deleteNode();
      } else if (key === 'Escape') {
        event.preventDefault();
        cancelNodeEditing();
      } else if (key === 'F2') {
        event.preventDefault();
        if (!state.selectingId) {
          return;
        }
        editNode(state.selectingId, state.idMap[state.selectingId].name);
      } else if (key === 'ArrowLeft') {
        if (state.editingId) {
          return;
        }
        event.preventDefault();
        selectParentNode();
      } else if (key === 'ArrowRight') {
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
      }
    }

    useEffect(() => {
      window.addEventListener('keydown', downHandler);
      return () => {
        window.removeEventListener('keydown', downHandler);
      };
    }, [state]);

    return (
      <div className="App">
        <ul>
          <NodeElement nodeId="root" />
        </ul>
      </div>
    );
  }

  return (
    <RecoilRoot>
      <InnerApp />
    </RecoilRoot>
  );
}

export default App;

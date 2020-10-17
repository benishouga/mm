import React, { useEffect } from 'react';
import { RecoilRoot, useRecoilState } from 'recoil';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import './config';
import { appState, useActions } from './state';
import NodeElement from './NodeElement';
import NodeSvgElement from './NodeSvgElement';

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
      selectOverNode,
      undo,
      redo,
      save,
      load,
      switchView,
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
      } else if (key === 'ArrowUp') {
        if (state.editingId) {
          return;
        }
        event.preventDefault();
        selectOverNode();
      } else if (key === 'z' && (event.ctrlKey || event.metaKey)) {
        if (state.editingId) {
          return;
        }
        event.preventDefault();
        undo();
      } else if (key === 'y' && (event.ctrlKey || event.metaKey)) {
        if (state.editingId) {
          return;
        }
        event.preventDefault();
        redo();
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
        <button onClick={() => save()}>save</button>
        <button onClick={() => load()}>load</button>&nbsp;|&nbsp;
        <button onClick={() => switchView()}>switch</button>
        {state.viewMode === 'bulletList' ? (
          <ul>
            <NodeElement nodeId="root" />
          </ul>
        ) : (
          <div>
            <svg viewBox="0 0 500 500" width="500" height="500">
              <NodeSvgElement nodeId="root" />
            </svg>
          </div>
        )}
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <RecoilRoot>
        <InnerApp />
      </RecoilRoot>
    </DndProvider>
  );
}

export default App;

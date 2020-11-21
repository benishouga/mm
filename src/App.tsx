import React, { useEffect, useRef } from 'react';
import { RecoilRoot, useRecoilState } from 'recoil';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { v4 as uuidv4 } from 'uuid';
import './config';
import { appState, useActions } from './state';
import BulletList from './BulletList';
import MindMap from './MindMap';
import { useHash } from './hooks';

function App() {
  function InnerApp() {
    const [state] = useRecoilState(appState);
    const [hash, setHash] = useHash();

    const {
      completeNodeEditing,
      addNewNode,
      addSiblingNode,
      deleteNode,
      cancelNodeEditing,
      editNode,
      selectParentNode,
      undo,
      redo,
      save,
      load,
      switchView,
    } = useActions();

    const headerRef = useRef<HTMLDivElement>(null);

    function keyDownHandler(event: KeyboardEvent) {
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
      window.addEventListener('keydown', keyDownHandler);
      return () => {
        window.removeEventListener('keydown', keyDownHandler);
      };
    }, [state]);

    useEffect(() => {
      let mmid = hash;
      if (mmid) {
        console.log(mmid);
        load(mmid);
      }
    }, [hash]);

    const onSave = () => {
      let mmid = hash;
      if (!mmid) {
        mmid = uuidv4();
        setHash(mmid);
      }
      save(mmid);
    };

    return (
      <div className="App">
        <div ref={headerRef}>
          <button onClick={() => onSave()}>save</button>
          {/* <button onClick={() => load()}>load</button> */}
          &nbsp;|&nbsp;
          <button onClick={() => switchView()}>switch</button>
        </div>
        {state.viewMode === 'bulletList' ? <BulletList /> : <MindMap headerRef={headerRef} />}
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

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
import { convertIdMapToPlainText } from './actions/utils';

function App() {
  function InnerApp() {
    const [state] = useRecoilState(appState);
    const [hash, setHash] = useHash();

    const {
      completeNodeEditing,
      addNewNode,
      addParentNode,
      addYoungerSiblingNode,
      addOlderSiblingNode,
      deleteNode,
      cancelNodeEditing,
      editNode,
      selectParentNode,
      undo,
      redo,
      save,
      load,
      switchView,
      pasteNode,
    } = useActions();

    const headerRef = useRef<HTMLDivElement>(null);

    function copyHandler() {
      if (!state.selectingId) {
        return;
      }

      const plainText = convertIdMapToPlainText(state.selectingId, state.idMap);

      navigator.clipboard.writeText(plainText).then(function () {
        console.log('complete copy');
      });
    }

    async function pasteHandler() {
      if (!state.selectingId) {
        return;
      }

      const plainText = await navigator.clipboard.readText();

      pasteNode(plainText);
    }

    function keyDownHandler(event: KeyboardEvent) {
      const key = event.key;

      if (key === 'Enter') {
        event.preventDefault();

        const editingId = state.editingId;

        if (editingId) {
          completeNodeEditing();
        } else {
          if (event.shiftKey) {
            addOlderSiblingNode();
          } else {
            addYoungerSiblingNode();
          }
        }
      } else if (key === 'Insert' || key === 'Tab') {
        event.preventDefault();
        if (event.shiftKey) {
          addParentNode();
        } else {
          addNewNode();
        }
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
      document.addEventListener('copy', copyHandler);
      document.addEventListener('paste', pasteHandler);
      return () => {
        window.removeEventListener('keydown', keyDownHandler);
        document.removeEventListener('copy', copyHandler);
        document.removeEventListener('paste', pasteHandler);
      };
    }, [state]);

    useEffect(() => {
      // ■パターン
      // 新規ロード(ハッシュなし)
      // 新規ロード(ハッシュあり)
      // リロード（ハッシュなし）
      // リロード（ハッシュあり）
      // ハッシュなし→ハッシュあり
      // ハッシュあり→ハッシュなし
      // ハッシュあり→ハッシュあり（別ページ）
      // ハッシュなし→別ページ
      // ハッシュあり→別ページ
      // History Back(ハッシュなし)
      // History Back(ハッシュあり)
      // History Forward(ハッシュなし)
      // History Forward(ハッシュあり)
      if (state.isDirty && !confirm('今の消えちゃうよ？')) {
        setHash(state.mmid || '');
        return;
      }

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

    useEffect(() => {
      const beforeUnloadHandler = (e: BeforeUnloadEvent) => {
        if (state.isDirty) {
          e.preventDefault();
          e.returnValue = 'Exit?';
          return 'Exit?';
        }
      };
      window.addEventListener('beforeunload', beforeUnloadHandler);
      return () => {
        window.removeEventListener('beforeunload', beforeUnloadHandler);
      };
    }, [state]);

    return (
      <div className="App" style={{ display: 'inline-block' }}>
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

import React, { useEffect, useRef, useState } from 'react';
import { Provider, useAtomValue } from 'jotai';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

import { v4 as uuidv4 } from 'uuid';
import './config';
import { calculatedAppState, ROOT_NODE_ID, useActions } from './state';
import BulletList from './BulletList';
import MindMap from './MindMap';
import { useHash, usePrefersDarkMode } from './hooks';
import { convertIdMapToPlainText } from './actions/utils';

function App() {
  function InnerApp() {
    const state = useAtomValue(calculatedAppState);
    const [hash, setHash] = useHash();
    const [userId, setUserId] = useState<string | null>(null);

    const isDarkMode = usePrefersDarkMode();

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
    const mmSvgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
      firebase
        .auth()
        .signInAnonymously()
        .then((userCredential) => {
          if (userCredential.user) {
            setUserId(userCredential.user.uid);
          } else {
            console.error('wtf userCredential.user');
          }
        })
        .catch((error) => {
          console.error(error.code, error.message);
        });
    }, []);

    function copyHandler() {
      if (!state.selectingId || state.editingId) {
        return;
      }

      const plainText = convertIdMapToPlainText(state.selectingId, state.idMap);

      navigator.clipboard.writeText(plainText);
    }

    async function pasteHandler() {
      if (!state.selectingId || state.editingId) {
        return;
      }

      const plainText = await navigator.clipboard.readText();

      pasteNode(plainText);
    }

    function cutHandler() {
      if (!state.selectingId || state.editingId) {
        return;
      }
      copyHandler();
      deleteNode();
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
      } else if (key === 'Backspace') {
        if (!state.selectingId || state.editingId) {
          return;
        }
        event.preventDefault();
        editNode(state.selectingId, '');
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
      } else if (key === 's' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        onSave();
      }
    }

    useEffect(() => {
      window.addEventListener('keydown', keyDownHandler);
      document.addEventListener('copy', copyHandler);
      document.addEventListener('paste', pasteHandler);
      document.addEventListener('cut', cutHandler);
      return () => {
        window.removeEventListener('keydown', keyDownHandler);
        document.removeEventListener('copy', copyHandler);
        document.removeEventListener('paste', pasteHandler);
        document.removeEventListener('cut', cutHandler);
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
      if (mmid && userId) {
        load(mmid);
      }
    }, [hash, userId]);

    useEffect(() => {
      document.body.style.backgroundColor = isDarkMode ? '#222' : 'white';
    }, [isDarkMode]);

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

    const showManual = () => {
      alert(`操作説明
Enter で 弟ノード を追加
Shift + Enter で 兄ノード を追加
Insert または Tab で 子ノード を追加
Delete で 選択ノード 削除
クリックで ノード を選択
カーソルキー で 選択ノード を移動
ダブルクリック または F2 で選択ノードの編集を開始
編集中に Enter で 編集中ノード の編集を完了
Escape で編集をキャンセル
Ctrl + Z で 編集履歴 を戻る
Ctrl + Y で 編集履歴 を進む
Ctrl + C で コピー
Ctrl + X で 切り取り
Ctrl + V で 貼り付け
Ctrl + S で 保存`);
    };

    const exportImage = () => {
      if (mmSvgRef.current === null) {
        return;
      }

      const svgData = new XMLSerializer().serializeToString(mmSvgRef.current);
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgData, 'application/xml');

      if (doc.firstChild === null) {
        return;
      }

      const firstChild = doc.firstChild as SVGSVGElement;
      const rootNode = state.idMap[ROOT_NODE_ID];
      const height = (rootNode.ephemeral?.geometry.height || 0) + 15;
      const width = rootNode.ephemeral?.geometry.width || 0;
      firstChild.setAttribute('viewBox', `0 0 ${width} ${height}`);
      firstChild.setAttribute('width', `${width}`);
      firstChild.setAttribute('height', `${height}`);

      const modifiedSvgData = new XMLSerializer().serializeToString(doc);

      const canvas = document.createElement('canvas');

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');

      if (ctx === null) {
        return;
      }

      const image = new Image();
      image.onload = function () {
        ctx.drawImage(image, 0, 0);
        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.setAttribute('download', 'image.png');
        a.dispatchEvent(new MouseEvent('click'));
      };
      image.src = 'data:image/svg+xml;charset=utf-8;base64,' + btoa(unescape(encodeURIComponent(modifiedSvgData)));
    };

    return (
      <div className="App">
        <div ref={headerRef}>
          <button onClick={() => onSave()}>save</button>
          {/* <button onClick={() => load()}>load</button> */}
          &nbsp;|&nbsp;
          <button onClick={() => switchView()}>switch</button>
          &nbsp;|&nbsp;
          <button onClick={() => showManual()}>help</button>
          {state.viewMode === 'mindMap' ? (
            <>
              &nbsp;|&nbsp;
              <button onClick={() => exportImage()}>export</button>
            </>
          ) : null}
        </div>
        {state.viewMode === 'bulletList' ? <BulletList /> : <MindMap headerRef={headerRef} mmSvgRef={mmSvgRef} />}
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <Provider>
        <InnerApp />
      </Provider>
    </DndProvider>
  );
}

export default App;

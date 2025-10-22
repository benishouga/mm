import React, { useEffect, useRef } from 'react';
import { Provider, useAtomValue } from 'jotai';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { v4 as uuidv4 } from 'uuid';
import { calculatedAppState, ROOT_NODE_ID, initialIdMap, useActions } from './state';
import BulletList from './BulletList';
import MindMap from './MindMap';
import { usePrefersDarkMode } from './hooks';
import { convertIdMapToPlainText } from './actions/utils';

function App() {
  function InnerApp() {
    const state = useAtomValue(calculatedAppState);
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
    const fileInputRef = useRef<HTMLInputElement>(null);
    const fileHandleRef = useRef<FileSystemFileHandle | null>(null);

    const supportsFileSystemAccess =
      typeof window !== 'undefined' && 'showOpenFilePicker' in window && 'showSaveFilePicker' in window;

    const ensureJsonExtension = (name: string) => {
      const trimmed = name.trim();
      if (!trimmed.toLowerCase().endsWith('.json')) {
        return `${trimmed}.json`;
      }
      return trimmed;
    };

    const downloadIdMap = (fileName: string) => {
      const normalizedName = ensureJsonExtension(fileName);
      const blob = new Blob([JSON.stringify(state.idMap, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = normalizedName;
      anchor.dispatchEvent(new MouseEvent('click'));
      URL.revokeObjectURL(url);
      return normalizedName;
    };

    const writeToHandle = async (handle: FileSystemFileHandle) => {
      const writable = await handle.createWritable();
      await writable.write(JSON.stringify(state.idMap, null, 2));
      await writable.close();
    };

    const onSaveAs = async () => {
      const defaultName = ensureJsonExtension(state.mmid || `mindmap-${uuidv4()}.json`);

      if (supportsFileSystemAccess) {
        try {
          const handle = await (window as Window & typeof globalThis).showSaveFilePicker({
            suggestedName: defaultName,
            types: [
              {
                description: 'Mind Map JSON',
                accept: {
                  'application/json': ['.json'],
                },
              },
            ],
          });
          await writeToHandle(handle);
          fileHandleRef.current = handle;
          save(ensureJsonExtension(handle.name));
        } catch (error) {
          if ((error as DOMException)?.name === 'AbortError') {
            return;
          }
          console.error(error);
          alert('ファイルの保存に失敗しました。');
        }
        return;
      }

      const input = window.prompt('保存するファイル名（.json）を入力してください', defaultName);
      if (!input) {
        return;
      }
      const trimmed = input.trim();
      if (!trimmed) {
        return;
      }
      const savedName = downloadIdMap(trimmed);
      save(savedName);
    };

    const onSave = async () => {
      if (supportsFileSystemAccess) {
        if (!fileHandleRef.current) {
          await onSaveAs();
          return;
        }
        try {
          await writeToHandle(fileHandleRef.current);
          save(ensureJsonExtension(fileHandleRef.current.name));
        } catch (error) {
          if ((error as DOMException)?.name === 'AbortError') {
            return;
          }
          console.error(error);
          alert('ファイルの保存に失敗しました。');
        }
        return;
      }

      if (!state.mmid) {
        await onSaveAs();
        return;
      }
      const savedName = downloadIdMap(state.mmid);
      save(savedName);
    };

    const onCreateNew = () => {
      if (state.isDirty && !confirm('保存されていない変更があります。新規作成しますか？')) {
        return;
      }
      fileHandleRef.current = null;
      load({ idMap: initialIdMap, mmid: '' });
    };

    const onLoadFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
      const input = event.target;
      const file = input.files?.[0];
      if (!file) {
        input.value = '';
        return;
      }

      if (state.isDirty && !confirm('保存されていない変更があります。読み込みますか？')) {
        input.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        try {
          const result = reader.result;
          if (typeof result !== 'string' || result.length === 0) {
            throw new Error('empty file');
          }
          const parsed = JSON.parse(result);
          fileHandleRef.current = null;
          load({ idMap: parsed, mmid: ensureJsonExtension(file.name) });
        } catch (error) {
          console.error(error);
          alert('ファイルの読み込みに失敗しました。JSON 形式か確認してください。');
        } finally {
          input.value = '';
        }
      };
      reader.onerror = () => {
        console.error(reader.error);
        alert('ファイルの読み込みに失敗しました。');
        input.value = '';
      };
      reader.readAsText(file);
    };

    const triggerFilePicker = () => {
      fileInputRef.current?.click();
    };

    const onLoad = async () => {
      if (state.isDirty && !confirm('保存されていない変更があります。読み込みますか？')) {
        return;
      }

      if (supportsFileSystemAccess) {
        try {
          const [handle] = await (window as Window & typeof globalThis).showOpenFilePicker({
            multiple: false,
            types: [
              {
                description: 'Mind Map JSON',
                accept: {
                  'application/json': ['.json'],
                },
              },
            ],
          });
          if (!handle) {
            return;
          }
          const file = await handle.getFile();
          const text = await file.text();
          if (!text) {
            throw new Error('empty file');
          }
          const parsed = JSON.parse(text);
          fileHandleRef.current = handle;
          load({ idMap: parsed, mmid: ensureJsonExtension(handle.name) });
        } catch (error) {
          if ((error as DOMException)?.name === 'AbortError') {
            return;
          }
          console.error(error);
          alert('ファイルの読み込みに失敗しました。JSON 形式か確認してください。');
        }
        return;
      }

      triggerFilePicker();
    };

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
        void onSave();
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
      document.body.style.backgroundColor = isDarkMode ? '#222' : 'white';
    }, [isDarkMode]);

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
          <button onClick={() => onCreateNew()}>new</button>
          &nbsp;|&nbsp;
          <button onClick={() => void onLoad()}>load</button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            style={{ display: 'none' }}
            onChange={onLoadFromFile}
          />
          &nbsp;|&nbsp;
          <button onClick={() => void onSave()}>save</button>
          &nbsp;|&nbsp;
          <button onClick={() => void onSaveAs()}>save as</button>
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

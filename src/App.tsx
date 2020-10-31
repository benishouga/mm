import React, { useEffect, useState, useRef } from 'react';
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
    const [mindMapAreaSize, setMindMapAreaSize] = useState({ width: 500, height: 800 });
    const [isScrolling, setIsScrolling] = useState(false);
    const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });
    const [scrollStartPosition, setScrollStartPosition] = useState({ x: 0, y: 0 });
    const [scrollStartMousePosition, setScrollStartMousePosition] = useState({ x: 0, y: 0 });

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
      selectUnderSameDepthNode,
      selectOverNode,
      selectOverSameDepthNode,
      selectRightMiddleNode,
      undo,
      redo,
      save,
      load,
      switchView,
    } = useActions();

    const mmAreaRef = useRef<HTMLDivElement>(null);
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
      } else if (key === 'ArrowRight') {
        if (state.editingId) {
          return;
        }
        event.preventDefault();
        if (state.viewMode === 'bulletList') {
          selectChildNode();
        } else {
          selectRightMiddleNode();
        }
      } else if (key === 'ArrowDown') {
        if (state.editingId) {
          return;
        }
        event.preventDefault();

        if (state.viewMode === 'bulletList') {
          selectUnderNode();
        } else {
          selectUnderSameDepthNode();
        }
      } else if (key === 'ArrowUp') {
        if (state.editingId) {
          return;
        }
        event.preventDefault();

        if (state.viewMode === 'bulletList') {
          selectOverNode();
        } else {
          selectOverSameDepthNode();
        }
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

    function mouseUpHandler(_: MouseEvent) {
      if (isScrolling) {
        setIsScrolling(false);
      }
    }

    useEffect(() => {
      window.addEventListener('mouseup', mouseUpHandler);
      window.addEventListener('mousemove', mouseMoveHandler);
      return () => {
        window.removeEventListener('mouseup', mouseUpHandler);
        window.removeEventListener('mousemove', mouseMoveHandler);
      };
    }, [isScrolling, scrollStartMousePosition]);

    function mouseMoveHandler(event: MouseEvent) {
      if (!isScrolling) return;
      const x = scrollStartPosition.x + scrollStartMousePosition.x - event.pageX;
      const y = scrollStartPosition.y + scrollStartMousePosition.y - event.pageY;
      setScrollPosition({ x, y });
    }

    useEffect(() => {
      window.addEventListener('keydown', keyDownHandler);
      return () => {
        window.removeEventListener('keydown', keyDownHandler);
      };
    }, [state]);

    useEffect(() => {
      function handleResize() {
        setMindMapAreaSize({
          width: mmAreaRef.current?.clientWidth || 500,
          height: window.innerHeight - (headerRef.current?.clientHeight || 24) - 24,
        });
      }

      window.addEventListener('resize', handleResize);
      handleResize();

      return () => window.removeEventListener('resize', handleResize);
    }, [mmAreaRef.current]);

    const onMouseDown = (event: React.MouseEvent) => {
      setIsScrolling(true);
      setScrollStartPosition(scrollPosition);
      setScrollStartMousePosition({ x: event.pageX, y: event.pageY });
    };

    return (
      <div className="App">
        <div ref={headerRef}>
          <button onClick={() => save()}>save</button>
          <button onClick={() => load()}>load</button>&nbsp;|&nbsp;
          <button onClick={() => switchView()}>switch</button>
        </div>
        {state.viewMode === 'bulletList' ? (
          <ul>
            <NodeElement nodeId="root" />
          </ul>
        ) : (
          <div ref={mmAreaRef}>
            <svg
              onMouseDown={onMouseDown}
              viewBox={`${scrollPosition.x} ${scrollPosition.y} ${mindMapAreaSize.width} ${mindMapAreaSize.height}`}
              width={mindMapAreaSize.width}
              height={mindMapAreaSize.height}
            >
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

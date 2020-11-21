import React, { RefObject, useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import NodeSvgElement from './NodeSvgElement';
import { appState, useActions } from './state';

function MindMap({ headerRef }: { headerRef: RefObject<HTMLElement> }) {
  const [state] = useRecoilState(appState);
  const [mindMapAreaSize, setMindMapAreaSize] = useState({ width: 500, height: 800 });
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });
  const [scrollStartPosition, setScrollStartPosition] = useState({ x: 0, y: 0 });
  const [scrollStartMousePosition, setScrollStartMousePosition] = useState({ x: 0, y: 0 });

  const { selectRightMiddleNode, selectUnderSameDepthNode, selectOverSameDepthNode } = useActions();

  const mmAreaRef = useRef<HTMLDivElement>(null);
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

  function keyDownHandler(event: KeyboardEvent) {
    const key = event.key;

    if (key === 'ArrowRight') {
      if (state.editingId) {
        return;
      }
      event.preventDefault();
      selectRightMiddleNode();
    } else if (key === 'ArrowDown') {
      if (state.editingId) {
        return;
      }
      event.preventDefault();

      selectUnderSameDepthNode();
    } else if (key === 'ArrowUp') {
      if (state.editingId) {
        return;
      }
      event.preventDefault();

      selectOverSameDepthNode();
    }
  }
  useEffect(() => {
    window.addEventListener('keydown', keyDownHandler);
    return () => {
      window.removeEventListener('keydown', keyDownHandler);
    };
  }, [state]);

  function mouseUpHandler(_: MouseEvent) {
    setIsScrolling(false);
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
    const diffX = scrollStartMousePosition.x - event.pageX;
    const diffY = scrollStartMousePosition.y - event.pageY;
    if (diffY ** 2 + diffY ** 2 < 9) return;
    const x = scrollStartPosition.x + diffX;
    const y = scrollStartPosition.y + diffY;
    setScrollPosition({ x, y });
  }

  useEffect(() => {
    window.addEventListener('keydown', keyDownHandler);
    return () => {
      window.removeEventListener('keydown', keyDownHandler);
    };
  }, [state]);

  useEffect(() => {
    if (state.draggingId) setIsScrolling(false);
  }, [state.draggingId]);

  const onMouseDown = (event: React.MouseEvent) => {
    setIsScrolling(true);
    setScrollStartPosition(scrollPosition);
    setScrollStartMousePosition({ x: event.pageX, y: event.pageY });
  };
  return (
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
  );
}

export default MindMap;

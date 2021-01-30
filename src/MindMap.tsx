import React, { RefObject, useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import NodeSvgElement from './NodeSvgElement';
import { useActions, calculatedAppState, ROOT_NODE_ID } from './state';
import { getTextWidth, getTextHeight } from './actions/utils';

function MindMap({ headerRef }: { headerRef: RefObject<HTMLElement> }) {
  const state = useRecoilValue(calculatedAppState);
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

  useEffect(() => {
    const rootNode = state.idMap[ROOT_NODE_ID];
    const nodeHeight = (rootNode.ephemeral?.geometry.height || 0) + 15;
    const scrollY = (nodeHeight - mindMapAreaSize.height) / 2;
    setScrollPosition({ x: 0, y: scrollY });
  }, [state.mmid]);

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

  useEffect(() => {
    if (!state.selectingId) {
      return;
    }
    const selectingNode = state.idMap[state.selectingId];
    const geometry = selectingNode.ephemeral?.geometry;
    if (!geometry) return;

    const viewPort = {
      top: scrollPosition.y,
      left: scrollPosition.x,
      bottom: scrollPosition.y + mindMapAreaSize.height,
      right: scrollPosition.x + mindMapAreaSize.width,
    };

    const scroll = { ...scrollPosition };
    const actualHeight = getTextHeight(selectingNode.name);
    const actualTop = geometry.top - actualHeight / 2;
    if (viewPort.top > actualTop) {
      scroll.y = actualTop;
    }

    const actualBottom = geometry.top + actualHeight / 2;
    if (viewPort.bottom < actualBottom) {
      scroll.y = actualBottom - mindMapAreaSize.height;
    }

    if (viewPort.left > geometry.left) {
      scroll.x = geometry.left;
    }

    const actualWidth = getTextWidth(selectingNode.name);
    if (viewPort.right < geometry.left) {
      scroll.x = geometry.left + actualWidth - mindMapAreaSize.width;
    }
    setScrollPosition(scroll);
  }, [state.selectingId]);

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
        <NodeSvgElement nodeId={ROOT_NODE_ID} />
      </svg>
    </div>
  );
}

export default MindMap;

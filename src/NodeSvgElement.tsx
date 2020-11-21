import React, { ChangeEvent } from 'react';
import { useRecoilValue } from 'recoil';
import { useDrop, useDrag, DragPreviewImage } from 'react-dnd';

import { calculatedAppState, useActions, Geometry } from './state';
import LineSvgElement from './LineSvgElement';

import { getTextWidth } from './actions/utils';

function NodeSvgElement(props: { nodeId: string }) {
  const state = useRecoilValue(calculatedAppState);
  const node = state.idMap[props.nodeId];

  const { editNode, setTmpName, selectNode, dragNode, dropToBefore, dropToChild } = useActions();

  const [{ isBeforeOver }, refDropToBefore] = useDrop({
    accept: 'node',
    drop: () => dropToBefore(node.id),
    collect: (monitor) => ({
      isBeforeOver: monitor.isOver(),
    }),
  });
  const [{ isNodeOver }, refDropToChild] = useDrop({
    accept: 'node',
    drop: () => dropToChild(node.id),
    collect: (monitor) => ({
      isNodeOver: monitor.isOver(),
    }),
  });
  const [, drag, preview] = useDrag({
    item: { type: 'node' },
    begin: () => dragNode(node.id),
    end: (_, monitor) => {
      if (!monitor.didDrop()) {
        dragNode(null);
      }
    },
  });

  const onClick = () => {
    selectNode(props.nodeId);
  };

  const onDoubleClick = () => {
    editNode(props.nodeId, node.name);
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;
    setTmpName(name);
  };

  const textColor = isNodeOver ? 'magenta' : 'black';

  let children: JSX.Element[] | null = null;
  if (node.children.length > 0) {
    children = node.children.map((id) => (
      <React.Fragment key={id}>
        <NodeSvgElement nodeId={id} />
        <LineSvgElement parentNodeId={props.nodeId} childNodeId={id} />
      </React.Fragment>
    ));
  }

  const geometry: Geometry = node.ephemeral?.geometry || {
    calculatingTop: 0,
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  };
  const nodeWidth = getTextWidth(node.name);

  return (
    <>
      {children}
      {props.nodeId === state.editingId ? (
        <foreignObject
          x={geometry.left}
          y={geometry.calculatingTop + geometry.height / 2 - 13}
          width="100%"
          height={geometry.height}
        >
          <input type="text" value={state.tmpName || ''} onChange={onChange} />
        </foreignObject>
      ) : (
        <>
          <text
            style={{ userSelect: 'none' }}
            onClick={onClick}
            onDoubleClick={onDoubleClick}
            fill={props.nodeId === state.selectingId ? 'cyan' : textColor}
            x={geometry.left}
            y={geometry.calculatingTop + geometry.height / 2 + 5}
          >
            {node.name}
          </text>
          <foreignObject
            x={geometry.left}
            y={geometry.calculatingTop + geometry.height / 2 - 10 - 10}
            width={nodeWidth}
            height={geometry.height + 10}
          >
            {state.draggingId ? (
              <>
                <div
                  ref={refDropToBefore}
                  style={{
                    position: 'absolute',
                    backgroundColor: isBeforeOver ? 'black' : 'transparent',
                    opacity: 0.5,
                    width: nodeWidth,
                    height: '10px',
                  }}
                />
                <div
                  ref={refDropToChild}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    opacity: 0.5,
                    width: nodeWidth,
                    height: '20px',
                  }}
                />
              </>
            ) : (
              <>
                <DragPreviewImage connect={preview} src="./dragging.png" />
                <div
                  ref={drag}
                  onClick={onClick}
                  onDoubleClick={onDoubleClick}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    opacity: 0.5,
                    width: nodeWidth,
                    height: '20px',
                  }}
                />
              </>
            )}
          </foreignObject>
        </>
      )}
    </>
  );
}

export default NodeSvgElement;

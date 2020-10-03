import React, { ChangeEvent } from 'react';
import { useRecoilValue } from 'recoil';
import { useDrop, useDrag } from 'react-dnd';

import { calculatedAppState, useActions } from './state';
import LineSvgElement from './LineSvgElement';

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
  const [, drag] = useDrag({
    item: { type: 'node' },
    begin: () => dragNode(node.id),
    end: (_, monitor) => {
      console.log('didDrop=' + monitor.didDrop());
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

  const backgroundBefore = isBeforeOver ? '#eee' : 'white';
  console.log(backgroundBefore);
  const textColor = isNodeOver ? '#eee' : 'black';

  // const onClick = () => {
  //   selectNode(props.nodeId);
  // };

  let children: JSX.Element[] | null = null;
  if (node.children.length > 0) {
    children = node.children.map((id) => (
      <>
        <NodeSvgElement nodeId={id} key={id} />
        <LineSvgElement parentNodeId={props.nodeId} childNodeId={id} />
      </>
    ));
  }

  const geometry = node.ephemeral?.geometry || {
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  };
  return (
    <>
      {children}
      {props.nodeId === state.editingId ? (
        <foreignObject
          x={geometry.left}
          y={geometry.top + geometry.height / 2 - 13}
          width="100%"
          height={geometry.height}
        >
          <input type="text" value={state.tmpName || ''} onChange={onChange} />
        </foreignObject>
      ) : (
        <>
          <text
            onClick={onClick}
            onDoubleClick={onDoubleClick}
            fill={props.nodeId === state.selectingId ? 'cyan' : textColor}
            x={geometry.left}
            y={geometry.top + geometry.height / 2 + 5}
          >
            {node.name}
          </text>
          <foreignObject
            x={geometry.left}
            y={geometry.top + geometry.height / 2 - 10 - 10}
            width="50px"
            height={geometry.height + 10}
          >
            {state.draggingId ? (
              <>
                <div
                  ref={refDropToChild}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    backgroundColor: 'yellow',
                    opacity: 0.5,
                    width: '50px',
                    height: '20px',
                  }}
                />
                <div
                  ref={refDropToBefore}
                  style={{ position: 'absolute', backgroundColor: 'pink', opacity: 0.5, width: '50px', height: '20px' }}
                />
              </>
            ) : (
              <div
                ref={drag}
                style={{
                  position: 'absolute',
                  top: '10px',
                  backgroundColor: 'magenta',
                  opacity: 0.5,
                  width: '50px',
                  height: '20px',
                }}
              />
            )}
          </foreignObject>
        </>
      )}
    </>
  );
}

export default NodeSvgElement;

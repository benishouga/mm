import React, { ChangeEvent } from 'react';
import { useRecoilValue } from 'recoil';

import { calculatedAppState, useActions } from './state';
import LineSvgElement from './LineSvgElement';

function NodeSvgElement(props: { nodeId: string }) {
  const state = useRecoilValue(calculatedAppState);
  const node = state.idMap[props.nodeId];

  const { editNode, setTmpName, selectNode } = useActions();

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

  const backgroundNode = 'white';

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
      {props.nodeId === state.editingId ? (
        <foreignObject x={geometry.left} y={geometry.top} width="100%" height={geometry.height}>
          <input type="text" value={state.tmpName || ''} onChange={onChange} />
        </foreignObject>
      ) : (
        <>
          <rect
            x={geometry.left}
            y={geometry.top}
            width={geometry.width}
            height={geometry.height}
            fill={props.nodeId === state.selectingId ? 'cyan' : backgroundNode}
            // stroke="blue"
            // strokeWidth="2"
          />
          <text
            onClick={onClick}
            onDoubleClick={onDoubleClick}
            x={geometry.left}
            y={geometry.top + geometry.height / 2 + 5}
          >
            {node.name}
          </text>
          {children}
        </>
      )}
    </>
  );
}

export default NodeSvgElement;

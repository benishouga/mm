import React from 'react';
import { useRecoilValue } from 'recoil';

import { calculatedAppState } from './state';
import LineSvgElement from './LineSvgElement';

function NodeSvgElement(props: { nodeId: string }) {
  const state = useRecoilValue(calculatedAppState);
  const node = state.idMap[props.nodeId];

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
      <rect
        x={geometry.left}
        y={geometry.top}
        width={geometry.width}
        height={geometry.height}
        fill="none"
        // stroke="blue"
        // strokeWidth="2"
      />
      <text x={geometry.left} y={geometry.top + geometry.height / 2}>
        {node.name}
      </text>
      {children}
    </>
  );
}

export default NodeSvgElement;

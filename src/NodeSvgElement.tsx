import React from 'react';
import { useRecoilValue } from 'recoil';
// import { useDrop, useDrag } from 'react-dnd';

import { calculatedAppState } from './state';
// import { useAutoFocus } from './hooks';

function NodeSvgElement(props: { nodeId: string }) {
  const state = useRecoilValue(calculatedAppState);
  const node = state.idMap[props.nodeId];

  // const inputRef = useAutoFocus<HTMLInputElement>();

  // const { editNode, selectNode, setTmpName, dropToBefore, dropToChild, dragNode } = useActions();

  // const [{ isBeforeOver }, refDropToBefore] = useDrop({
  //   accept: 'node',
  //   drop: () => dropToBefore(node.id),
  //   collect: (monitor) => ({
  //     isBeforeOver: monitor.isOver(),
  //   }),
  // });
  // const [{ isNodeOver }, refDropToChild] = useDrop({
  //   accept: 'node',
  //   drop: () => dropToChild(node.id),
  //   collect: (monitor) => ({
  //     isNodeOver: monitor.isOver(),
  //   }),
  // });

  // const [, drag] = useDrag({
  //   item: { type: 'node' },
  //   begin: () => dragNode(node.id),
  // });

  // const onDoubleClick = () => {
  //   editNode(props.nodeId, node.name);
  // };

  // const onClick = () => {
  //   selectNode(props.nodeId);
  // };

  // const onChange = (event: ChangeEvent<HTMLInputElement>) => {
  //   const name = event.target.value;
  //   setTmpName(name);
  // };

  let children: JSX.Element[] | null = null;
  if (node.children.length > 0) {
    children = node.children.map((id) => <NodeSvgElement nodeId={id} key={id} />);
  }

  // const backgroundBefore = isBeforeOver ? '#eee' : 'white';
  // const backgroundNode = isNodeOver ? '#eee' : 'white';

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
        stroke="blue"
        strokeWidth="2"
      />
      {children}
    </>
  );
}

export default NodeSvgElement;

import React, { ChangeEvent } from 'react';
import { useRecoilState } from 'recoil';
import { useDrop, useDrag } from 'react-dnd';

import { appState, useActions } from './state';
import { useAutoFocus } from './hooks';

function NodeElement(props: { nodeId: string }) {
  const [state] = useRecoilState(appState);
  const node = state.idMap[props.nodeId];
  const { editNode, selectNode, setTmpName } = useActions();
  const inputRef = useAutoFocus<HTMLInputElement>();

  const { dropNode, dragNode } = useActions();

  const [, drop] = useDrop({
    accept: 'node',
    drop: () => dropNode(node.id),
  });

  const [, drag] = useDrag({
    item: { type: 'node' },
    begin: () => dragNode(node.id),
  });

  const onDoubleClick = () => {
    editNode(props.nodeId, node.name);
  };

  const onClick = () => {
    selectNode(props.nodeId);
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;
    setTmpName(name);
  };

  let children: JSX.Element | null = null;
  if (node.children.length > 0) {
    children = (
      <ul>
        {node.children.map((id) => (
          <NodeElement nodeId={id} key={id} />
        ))}
      </ul>
    );
  }
  return (
    <li>
      {props.nodeId === state.editingId ? (
        <input type="text" value={state.tmpName || ''} onChange={onChange} ref={inputRef} />
      ) : (
        <p
          ref={drop}
          onClick={onClick}
          onDoubleClick={onDoubleClick}
          style={{
            backgroundColor: props.nodeId === state.selectingId ? 'cyan' : '',
          }}
        >
          <span ref={drag}>{node.name}</span>
        </p>
      )}
      {children}
    </li>
  );
}

export default NodeElement;

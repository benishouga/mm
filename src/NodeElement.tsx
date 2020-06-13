import React, { ChangeEvent } from "react";
import { RecoilRoot, useRecoilState } from "recoil";

import { appState } from "./state";
import { Node } from "./state";

function NodeElement(props: { nodeId: string }) {
  const [state, setState] = useRecoilState(appState);
  const node = state.idMap[props.nodeId];

  const editNode = () => {
    setState({
      ...state,
      editingId: props.nodeId,
      tmpName: node.name
    });
  };

  const selectNode = () => {
    setState({
      ...state,
      selectingId: props.nodeId
    });
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      tmpName: event.target.value
    });
  };

  let children: JSX.Element | null = null;
  if (node.children.length > 0) {
    children = (
      <ul>
        {node.children.map(id => (
          <NodeElement nodeId={id} key={id} />
        ))}
      </ul>
    );
  }
  return (
    <li>
      {props.nodeId === state.editingId ? (
        <input type="text" value={state.tmpName || ""} onChange={onChange} />
      ) : (
        <p
          onClick={selectNode}
          onDoubleClick={editNode}
          style={{
            backgroundColor: props.nodeId === state.selectingId ? "cyan" : ""
          }}
        >
          {node.name}
        </p>
      )}
      {children}
    </li>
  );
}

export default NodeElement;

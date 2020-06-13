import React, { ChangeEvent } from "react";
import { RecoilRoot, useRecoilState } from "recoil";

import { appState } from "./state";
import { Node } from "./state";

function NodeElement(props: { node: Node }) {
  const [state, setState] = useRecoilState(appState);

  const editNode = () => {
    setState({
      ...state,
      editingNode: props.node,
      tmpName: props.node.name,
    });
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      tmpName: event.target.value
    });
  };

  let children: JSX.Element | null = null;
  if (props.node.children.length > 0) {
    children = (
      <ul>
        {props.node.children.map((child) => (
          <NodeElement node={child} />
        ))}
      </ul>
    );
  }
  return (
    <li>
      {props.node === state.editingNode ? (
        <input type="text" value={state.tmpName || ""} onChange={onChange} />
      ) : (
        <p onDoubleClick={editNode}>{props.node.name}</p>
      )}
      {children}
    </li>
  );
}

export default NodeElement;

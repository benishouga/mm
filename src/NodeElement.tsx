import React from "react";
import Node from "./Node";

function NodeElement(props: { node: Node }) {
  let children: JSX.Element | null = null;
  if (props.node.children.length > 0) {
    children = (
      <ul>
        {props.node.children.map(child => (
          <NodeElement node={child} />
        ))}
      </ul>
    );
  }
  return (
    <li>
      {props.node.name}
      {children}
    </li>
  );
}

export default NodeElement;

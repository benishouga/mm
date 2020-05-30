import React, { ChangeEvent } from "react";
import NodeElement from "./NodeElement";
import { RecoilRoot, useRecoilState } from "recoil";
import { nodeState } from "./state";

const data = {
  root: {
    name: "hoge",
    children: [
      {
        name: "fuga",
        children: []
      },
      {
        name: "piyo",
        children: []
      },
      {
        name: "foo",
        children: [
          {
            name: "bar",
            children: []
          }
        ]
      }
    ]
  }
};

function App() {

  function InnerApp() {
    const [nodeText, setNode] = useRecoilState(nodeState);

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
      setNode(event.target.value);
    };

    return (
        <div className="App">
          <input type="text" value={nodeText} onChange={onChange} />
          Echo: {nodeText}
          <br />
          <ul>
            <NodeElement node={data.root} />
          </ul>
        </div>
    );
  }

  return (
    <RecoilRoot>
      <InnerApp />
    </RecoilRoot>
  );
}

export default App;

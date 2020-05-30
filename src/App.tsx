import React from "react";
import NodeElement from "./NodeElement";

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
  return (
    <div className="App">
      <ul>
        <NodeElement node={data.root} />
      </ul>
    </div>
  );
}

export default App;

import React, { ChangeEvent, useEffect } from "react";
import NodeElement from "./NodeElement";
import { RecoilRoot, useRecoilState } from "recoil";
import { appState } from "./state";

function App() {
  function InnerApp() {
    const [state, setState] = useRecoilState(appState);

    function downHandler({ key }: { key: string }) {
      if (key === "Enter") {
        setState({
          ...state,
          editingNode: null,
        });
      }
    }

    useEffect(() => {
      window.addEventListener("keydown", downHandler);
      return () => {
        window.removeEventListener("keydown", downHandler);
      };
    }, []);

    return (
      <div className="App">
        <ul>
          <NodeElement node={state.root} />
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

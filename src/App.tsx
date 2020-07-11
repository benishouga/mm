import React, { useEffect } from "react";
import NodeElement from "./NodeElement";
import { RecoilRoot, useRecoilState } from "recoil";
import { appState, Node, useActions } from "./state";

function App() {
  function InnerApp() {
    const [state] = useRecoilState(appState);
    const {
      completeNodeEditing,
      addNewNode,
      addSiblingNode,
      deleteNode,
      cancelNodeEditing,
    } = useActions();

    function downHandler(event: KeyboardEvent) {
      const key = event.key;

      if (key === "Enter") {
        event.preventDefault();

        const editingId = state.editingId;

        if (editingId) {
          completeNodeEditing();
        } else {
          addSiblingNode();
        }
      } else if (key === "Insert" || key === "Tab") {
        event.preventDefault();
        addNewNode();
      } else if (key === "Delete") {
        event.preventDefault();
        deleteNode();
      } else if (key === "Escape") {
        event.preventDefault();
        cancelNodeEditing();
      }
    }

    useEffect(() => {
      window.addEventListener("keydown", downHandler);
      return () => {
        window.removeEventListener("keydown", downHandler);
      };
    }, [state]);

    return (
      <div className="App">
        <ul>
          <NodeElement nodeId="root" />
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

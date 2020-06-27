import React, { useEffect } from "react";
import NodeElement from "./NodeElement";
import { RecoilRoot, useRecoilState } from "recoil";
import { appState, Node, useActions } from "./state";

function App() {
  function InnerApp() {
    const [state] = useRecoilState(appState);
    const { completeNodeEditing, addNewNode } = useActions();

    function downHandler(event: KeyboardEvent) {
      const key = event.key;

      if (key === "Enter") {
        event.preventDefault();
        completeNodeEditing();
      } else if (key === "Insert" || key === "Tab") {
        event.preventDefault();
        addNewNode();
      } else if (key === "Delete") {
        // TODO: 親ノードから自分自身のIDを削除する
        // const selectingId = state.selectingId;
        // if (!selectingId) {
        //   return;
        // }
        // const ids = collectIds(state.idMap[selectingId]);
        // const newIdMap = {
        //   ...state.idMap
        // }
        // ids.forEach(id => {
        //   delete newIdMap[id];
        // });
        // setState({
        //   ...state,
        //   editingId: null,
        //   idMap: newIdMap
        // });
      }
    }

    // TODO: 自分自身のIDを含めて返却
    function collectIds(tree: Node) {
      const ids = [...tree.children];

      tree.children.forEach((id) => {
        ids.concat(collectIds(state.idMap[id]));
      });

      return ids;
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

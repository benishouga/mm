import React, { ChangeEvent, useEffect } from "react";
import NodeElement from "./NodeElement";
import { RecoilRoot, useRecoilState } from "recoil";
import { appState, Node } from "./state";
import { v4 as uuidv4 } from "uuid";

function App() {
  function InnerApp() {
    const [state, setState] = useRecoilState(appState);

    function downHandler({ key }: { key: string }) {
      if (key === "Enter") {
        const editingId = state.editingId;
        const tmpName = state.tmpName || "";

        if (!editingId) {
          return;
        }

        setState({
          ...state,
          editingId: null,
          idMap: {
            ...state.idMap,
            [editingId]: {
              name: tmpName,
              children: state.idMap[editingId].children
            }
          }
        });
      } else if (key === "Insert" || key === "Tab") {
        const selectingId = state.selectingId;

        if (!selectingId) {
          return;
        }

        const newId = uuidv4();

        setState({
          ...state,
          editingId: null,
          idMap: {
            ...state.idMap,
            [selectingId]: {
              ...state.idMap[selectingId],
              children: [...state.idMap[selectingId].children, newId]
            }, [newId]: {
              name: "undefined",
              children: []
            }
          }
        });
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
      
      tree.children.forEach(id => {
        ids.concat(collectIds(state.idMap[id]))
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

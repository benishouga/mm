import { atom, useRecoilState } from "recoil";
import { v4 as uuidv4 } from "uuid";

export type IdMap = {
  root: Node;
  [id: string]: Node;
};

export type Node = {
  name: string;
  children: string[];
  parent: string | null;
};

export type AppState = {
  idMap: IdMap;
  selectingId: string | null;
  editingId: string | null;
  tmpName: string | null;
};

export const appState = atom<AppState>({
  key: "appState",
  default: {
    idMap: {
      root: {
        name: "root",
        children: [],
        parent: null,
      },
    },
    selectingId: null,
    editingId: null,
    tmpName: null,
  },
});

export const useActions = () => {
  const [state, setState] = useRecoilState(appState);
  return {
    completeNodeEditing: () => {
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
            ...state.idMap[editingId],
            name: tmpName,
          },
        },
      });
    },

    addSiblingNode: () => {
      const selectingId = state.selectingId;

      if (!selectingId) {
        return;
      }

      const parentId = state.idMap[selectingId].parent;

      if (!parentId) {
        return;
      }

      const newId = uuidv4();

      const index = state.idMap[parentId].children.indexOf(selectingId);

      if(index == -1){
        console.error('wtf state!')
        return
      }

      const children = [...state.idMap[parentId].children]
      children.splice(index + 1, 0, newId)

      setState({
        ...state,
        editingId: null,
        idMap: {
          ...state.idMap,
          [parentId]: {
            ...state.idMap[parentId],
            children
          },
          [newId]: {
            name: "undefined",
            children: [],
            parent: parentId
          },
        },
      });
    },

    addNewNode: () => {
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
            children: [...state.idMap[selectingId].children, newId],
          },
          [newId]: {
            name: "undefined",
            children: [],
            parent: selectingId,
          },
        },
      });
    },
  };
};

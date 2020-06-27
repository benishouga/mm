import { atom, useRecoilState } from "recoil";
import { v4 as uuidv4 } from "uuid";

export type IdMap = {
  root: Node;
  [id: string]: Node;
};

export type Node = {
  name: string;
  children: string[];
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
            name: tmpName,
            children: state.idMap[editingId].children,
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
          },
        },
      });
    },
  };
};

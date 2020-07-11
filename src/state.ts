import { atom, useRecoilState } from 'recoil';
import { v4 as uuidv4 } from 'uuid';

export type IdMap = {
  root: Node;
  [id: string]: Node;
};

export type Node = {
  name: string;
  children: string[];
  parent: string | null;
  id: string;
};

export type AppState = {
  idMap: IdMap;
  selectingId: string | null;
  editingId: string | null;
  tmpName: string | null;
};

export const appState = atom<AppState>({
  key: 'appState',
  default: {
    idMap: {
      root: {
        name: 'root',
        children: [],
        parent: null,
        id: 'root',
      },
    },
    selectingId: null,
    editingId: null,
    tmpName: null,
  },
});

const completeNodeEditing = (state: AppState) => {
  const editingId = state.editingId;
  const tmpName = state.tmpName || '';

  if (!editingId) {
    return state;
  }

  return {
    ...state,
    editingId: null,
    idMap: {
      ...state.idMap,
      [editingId]: {
        ...state.idMap[editingId],
        name: tmpName,
      },
    },
  };
};

const defaultName = 'undefined';
export const useActions = () => {
  const [state, setState] = useRecoilState(appState);
  return {
    completeNodeEditing: () => {
      setState(completeNodeEditing(state));
    },

    cancelNodeEditing: () => {
      setState({ ...state, editingId: null });
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

      if (index == -1) {
        console.error('wtf state!');
        return;
      }

      const children = [...state.idMap[parentId].children];
      children.splice(index + 1, 0, newId);

      setState({
        ...state,
        selectingId: newId,
        editingId: newId,
        tmpName: defaultName,
        idMap: {
          ...state.idMap,
          [parentId]: {
            ...state.idMap[parentId],
            children,
          },
          [newId]: {
            name: defaultName,
            children: [],
            parent: parentId,
            id: newId,
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
        selectingId: newId,
        editingId: newId,
        tmpName: defaultName,
        idMap: {
          ...state.idMap,
          [selectingId]: {
            ...state.idMap[selectingId],
            children: [...state.idMap[selectingId].children, newId],
          },
          [newId]: {
            name: defaultName,
            children: [],
            parent: selectingId,
            id: newId,
          },
        },
      });
    },

    deleteNode: () => {
      // TODO: 親ノードから自分自身のIDを削除する
      const selectingId = state.selectingId;
      if (!selectingId) {
        return;
      }
      const ids = collectIds(state.idMap[selectingId], state);
      const newIdMap = {
        ...state.idMap,
      };
      ids.forEach((id) => {
        delete newIdMap[id];
      });

      const parentId = state.idMap[selectingId].parent;

      if (!parentId) {
        return;
      }

      const index = state.idMap[parentId].children.indexOf(selectingId);
      const children = [...state.idMap[parentId].children];
      children.splice(index, 1);

      newIdMap[parentId] = { ...newIdMap[parentId], children };

      setState({
        ...state,
        editingId: null,
        idMap: newIdMap,
      });
    },

    editNode: (nodeId: string, name: string) => {
      setState({
        ...state,
        editingId: nodeId,
        tmpName: name,
      });
    },

    selectNode: (nodeId: string) => {
      const newState = completeNodeEditing(state);
      setState({
        ...newState,
        selectingId: nodeId,
      });
    },

    setTmpName: (name: string) => {
      setState({
        ...state,
        tmpName: name,
      });
    },
  };
};

function collectIds(tree: Node, state: AppState) {
  const ids = [tree.id];

  tree.children.forEach((id) => {
    ids.concat(collectIds(state.idMap[id], state));
  });

  return ids;
}

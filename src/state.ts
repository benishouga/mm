import { atom, useRecoilState } from 'recoil';
import { completeNodeEditing } from './actions/completeNodeEditing';
import { cancelNodeEditing } from './actions/cancelNodeEditing';
import { addSiblingNode } from './actions/addSiblingNode';
import { addNewNode } from './actions/addNewNode';
import { deleteNode } from './actions/deleteNode';
import { editNode } from './actions/editNode';
import { selectNode } from './actions/selectNode';
import { setTmpName } from './actions/setTmpName';
import { selectParentNode } from './actions/selectParentNode';
import { selectChildNode } from './actions/selectChildNode';
import { selectUnderNode } from './actions/selectUnderNode';
import { selectOverNode } from './actions/selectOverNode';

export type IdMap = {
  root: MmNode;
  [id: string]: MmNode;
};

export type MmNode = {
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

const DEFAULT_NAME = 'undefined';

export const useActions = () => {
  const [state, setState] = useRecoilState(appState);
  return {
    completeNodeEditing: () => {
      setState(completeNodeEditing(state));
    },

    cancelNodeEditing: () => {
      setState(cancelNodeEditing(state));
    },

    addSiblingNode: () => {
      setState(addSiblingNode(state, DEFAULT_NAME));
    },

    addNewNode: () => {
      setState(addNewNode(state, DEFAULT_NAME));
    },

    deleteNode: () => {
      setState(deleteNode(state));
    },

    editNode: (nodeId: string, name: string) => {
      setState(editNode(state, nodeId, name));
    },

    selectNode: (nodeId: string) => {
      setState(selectNode(state, nodeId));
    },

    selectParentNode: () => {
      setState(selectParentNode(state));
    },

    selectChildNode: () => {
      setState(selectChildNode(state));
    },

    selectUnderNode: () => {
      setState(selectUnderNode(state));
    },
    
    selectOverNode: () => {
      setState(selectOverNode(state));
    },

    setTmpName: (name: string) => {
      setState(setTmpName(state, name));
    },
  };
};

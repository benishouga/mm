import { atom, useRecoilState, selector, useRecoilValue } from 'recoil';
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
import { selectRightMiddleNode } from './actions/selectRightMiddleNode';
import { undo } from './actions/undo';
import { redo } from './actions/redo';
import { dropToBefore } from './actions/dropToBefore';
import { dropToChild } from './actions/dropToChild';
import { dragNode } from './actions/dragNode';
import { save } from './actions/save';
import { load } from './actions/load';
import { calculateNodeGeometry } from './actions/utils';
import produce from 'immer';
import { switchView } from './actions/switchView';
import { selectOverSameDepthNode } from './actions/selectOverSameDepthNode';
import { selectUnderSameDepthNode } from './actions/selectUnderSameDepthNode';

export type IdMap = {
  root: MmNode;
  [id: string]: MmNode;
};

export type MmNode = {
  name: string;
  children: string[];
  parent: string | null;
  id: string;
  ephemeral?: {
    geometry: Geometry;
  };
};

export type Geometry = {
  calculatingTop: number;
  left: number;
  top: number;
  width: number;
  height: number;
};

export type IdMapHistory = {
  history: IdMap[];
  currentIndex: number;
};

export type AppState = {
  mmid: string;
  idMap: IdMap;
  idMapHistory: IdMapHistory;
  selectingId: string | null;
  editingId: string | null;
  draggingId: string | null;
  tmpName: string | null;
  cacheMap: IdMap | null;
  viewMode: 'bulletList' | 'mindMap';
  isDirty: boolean;
};

export const initialIdMap = {
  root: {
    name: 'root',
    children: [],
    parent: null,
    id: 'root',
  },
};

export const appState = atom<AppState>({
  key: 'appState',
  default: {
    idMapHistory: {
      history: [initialIdMap],
      currentIndex: 0,
    },
    mmid: '',
    idMap: initialIdMap,
    selectingId: 'root',
    editingId: null,
    draggingId: null,
    tmpName: null,
    cacheMap: null,
    viewMode: 'mindMap',
    isDirty: false,
  },
});

export const calculatedAppState = selector({
  key: 'calculatedAppState',
  get: ({ get }) => {
    const state = produce(get(appState), (draft) => {
      calculateNodeGeometry(draft.idMap['root'], draft);
    });
    return state;
  },
});

const DEFAULT_NAME = 'undefined';

export const useActions = () => {
  const [state, setState] = useRecoilState(appState);
  const calculatedNodeState = useRecoilValue(calculatedAppState);
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

    selectUnderSameDepthNode: () => {
      setState(selectUnderSameDepthNode(state));
    },

    selectOverNode: () => {
      setState(selectOverNode(state));
    },

    selectOverSameDepthNode: () => {
      setState(selectOverSameDepthNode(state));
    },

    selectRightMiddleNode: () => {
      setState(selectRightMiddleNode(calculatedNodeState));
    },

    setTmpName: (name: string) => {
      setState(setTmpName(state, name));
    },

    undo: () => {
      setState(undo(state));
    },

    redo: () => {
      setState(redo(state));
    },

    dropToBefore: (nodeId: string) => {
      setState(dropToBefore(state, nodeId));
    },

    dropToChild: (nodeId: string) => {
      setState(dropToChild(state, nodeId));
    },

    dragNode: (nodeId: string | null) => {
      setState(dragNode(state, nodeId));
    },

    save: (mmid: string) => {
      setState(save(state, mmid));
    },

    load: async (mmid: string) => {
      setState(await load(state, mmid));
    },

    switchView: () => {
      setState(switchView(state));
    },
  };
};

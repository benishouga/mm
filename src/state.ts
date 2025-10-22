import { atom, useAtom, useAtomValue } from 'jotai';
import { completeNodeEditing } from './actions/completeNodeEditing';
import { cancelNodeEditing } from './actions/cancelNodeEditing';
import { addYoungerSiblingNode } from './actions/addYoungerSiblingNode';
import { addOlderSiblingNode } from './actions/addOlderSiblingNode';
import { addNewNode } from './actions/addNewNode';
import { addParentNode } from './actions/addParentNode';
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
import { LoadPayload, load } from './actions/load';
import { calculateNodeGeometry } from './actions/utils';
import { produce } from 'immer';
import { switchView } from './actions/switchView';
import { selectOverSameDepthNode } from './actions/selectOverSameDepthNode';
import { selectUnderSameDepthNode } from './actions/selectUnderSameDepthNode';
import { pasteNode } from './actions/pasteNode';

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
  history: { idMap: IdMap; selectingId: string | null }[];
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
  cacheSelectingId: string | null;
  viewMode: 'bulletList' | 'mindMap';
  isDirty: boolean;
};

export const ROOT_NODE_ID = 'root';

export const initialIdMap = {
  root: {
    name: 'root',
    children: [],
    parent: null,
    id: ROOT_NODE_ID,
  },
};

export const appState = atom<AppState>({
  idMapHistory: {
    history: [{ idMap: initialIdMap, selectingId: ROOT_NODE_ID }],
    currentIndex: 0,
  },
  mmid: '',
  idMap: initialIdMap,
  selectingId: ROOT_NODE_ID,
  editingId: null,
  draggingId: null,
  tmpName: null,
  cacheMap: null,
  cacheSelectingId: null,
  viewMode: 'mindMap',
  isDirty: false,
});

export const calculatedAppState = atom<AppState>((get) => {
  const state = produce(get(appState), (draft) => {
    calculateNodeGeometry(draft.idMap[ROOT_NODE_ID], draft);
  });
  return state;
});

const DEFAULT_NAME = 'undefined';

export const useActions = () => {
  const [, setState] = useAtom(appState);
  const calculatedNodeState = useAtomValue(calculatedAppState);
  return {
    completeNodeEditing: () => {
      setState((prev) => completeNodeEditing(prev));
    },

    cancelNodeEditing: () => {
      setState((prev) => cancelNodeEditing(prev));
    },

    addYoungerSiblingNode: () => {
      setState((prev) => addYoungerSiblingNode(prev, DEFAULT_NAME));
    },

    addOlderSiblingNode: () => {
      setState((prev) => addOlderSiblingNode(prev, DEFAULT_NAME));
    },

    addNewNode: () => {
      setState((prev) => addNewNode(prev, DEFAULT_NAME));
    },

    addParentNode: () => {
      setState((prev) => addParentNode(prev, DEFAULT_NAME));
    },

    deleteNode: () => {
      setState((prev) => deleteNode(prev));
    },

    editNode: (nodeId: string, name: string) => {
      setState((prev) => editNode(prev, nodeId, name));
    },

    selectNode: (nodeId: string) => {
      setState((prev) => selectNode(prev, nodeId));
    },

    selectParentNode: () => {
      setState((prev) => selectParentNode(prev));
    },

    selectChildNode: () => {
      setState((prev) => selectChildNode(prev));
    },

    selectUnderNode: () => {
      setState((prev) => selectUnderNode(prev));
    },

    selectUnderSameDepthNode: () => {
      setState((prev) => selectUnderSameDepthNode(prev));
    },

    selectOverNode: () => {
      setState((prev) => selectOverNode(prev));
    },

    selectOverSameDepthNode: () => {
      setState((prev) => selectOverSameDepthNode(prev));
    },

    selectRightMiddleNode: () => {
      setState(selectRightMiddleNode(calculatedNodeState));
    },

    setTmpName: (name: string) => {
      setState((prev) => setTmpName(prev, name));
    },

    undo: () => {
      setState((prev) => undo(prev));
    },

    redo: () => {
      setState((prev) => redo(prev));
    },

    dropToBefore: (nodeId: string) => {
      setState((prev) => dropToBefore(prev, nodeId));
    },

    dropToChild: (nodeId: string) => {
      setState((prev) => dropToChild(prev, nodeId));
    },

    dragNode: (nodeId: string | null) => {
      setState((prev) => dragNode(prev, nodeId));
    },

    save: (mmid: string) => {
      setState((prev) => save(prev, mmid));
    },

    load: (payload: LoadPayload) => {
      setState((prev) => load(prev, payload));
    },

    switchView: () => {
      setState((prev) => switchView(prev));
    },

    pasteNode: (plainText: string) => {
      setState((prev) => pasteNode(prev, plainText));
    },
  };
};

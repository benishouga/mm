import { produce } from 'immer';
import { AppState, IdMap, MmNode, ROOT_NODE_ID, initialIdMap } from '../state';

export type LoadPayload = {
  idMap: IdMap | null | undefined;
  mmid: string;
};

const cloneNode = (node: MmNode): MmNode => ({
  ...node,
  children: Array.isArray(node.children) ? [...node.children] : [],
  parent: node.parent ?? null,
});

const ensureIdMap = (idMap: IdMap | null | undefined): IdMap => {
  const source = idMap ?? initialIdMap;
  const entries = Object.entries(source).reduce<IdMap>((acc, [key, value]) => {
    if (!value) {
      return acc;
    }

    acc[key] = cloneNode(value);
    return acc;
  }, {} as IdMap);

  if (!entries[ROOT_NODE_ID]) {
    entries[ROOT_NODE_ID] = cloneNode(initialIdMap[ROOT_NODE_ID]);
  }

  return entries;
};

export const load = (state: AppState, payload: LoadPayload) => {
  const { idMap, mmid } = payload;
  const normalizedIdMap = ensureIdMap(idMap);

  return produce(state, (draft) => {
    draft.mmid = mmid;
    draft.idMap = normalizedIdMap;
    draft.idMapHistory = {
      history: [{ idMap: normalizedIdMap, selectingId: ROOT_NODE_ID }],
      currentIndex: 0,
    };
    draft.selectingId = ROOT_NODE_ID;
    draft.editingId = null;
    draft.draggingId = null;
    draft.tmpName = null;
    draft.cacheMap = null;
    draft.cacheSelectingId = null;
    draft.isDirty = false;
  });
};

import { AppState, MmNode } from '../state';

function collectIds(tree: MmNode, state: AppState) {
  const ids = [tree.id];

  tree.children.forEach((id) => {
    ids.concat(collectIds(state.idMap[id], state));
  });

  return ids;
}

export const deleteNode = (state: AppState) => {
  const selectingId = state.selectingId;
  if (!selectingId) {
    return state;
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
    return state;
  }

  const index = state.idMap[parentId].children.indexOf(selectingId);
  const children = [...state.idMap[parentId].children];
  children.splice(index, 1);

  newIdMap[parentId] = { ...newIdMap[parentId], children };

  return {
    ...state,
    editingId: null,
    idMap: newIdMap,
  };
};

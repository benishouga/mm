import { produce } from 'immer';
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

  const parentId = state.idMap[selectingId].parent;
  if (!parentId) {
    return state;
  }

  const ids = collectIds(state.idMap[selectingId], state);

  return produce(state, (draft) => {
    ids.forEach((id) => {
      delete draft.idMap[id];
    });

    const index = state.idMap[parentId].children.indexOf(selectingId);
    draft.idMap[parentId].children.splice(index, 1);
    draft.selectingId = null;
  });
};

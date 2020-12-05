import { produce } from 'immer';
import { AppState } from '../state';

export const cancelNodeEditing = (state: AppState) => {
  if (state.cacheMap) {
    const selectingId = state.selectingId;
    if (!selectingId) {
      return state;
    }

    const parentId = state.idMap[selectingId].parent;
    if (!parentId) {
      return state;
    }

    const parent = state.idMap[parentId];
    const selectingNodeIndex = parent.children.indexOf(selectingId);

    let nextSelectingNode: string;

    if (parent.children.length === 1) {
      nextSelectingNode = parentId;
    } else {
      if (selectingNodeIndex === 0) {
        nextSelectingNode = parent.children[selectingNodeIndex + 1];
      } else {
        nextSelectingNode = parent.children[selectingNodeIndex - 1];
      }
    }

    return produce(state, (draft) => {
      if (draft.cacheMap) {
        draft.idMap = draft.cacheMap;
      }

      draft.selectingId = nextSelectingNode;
      draft.editingId = null;
      draft.cacheMap = null;
    });
  }

  return produce(state, (draft) => {
    draft.editingId = null;
  });
};

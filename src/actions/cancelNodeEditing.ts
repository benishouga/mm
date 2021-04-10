import AutoMerge from 'automerge';
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

    return AutoMerge.change(state, (draft) => {
      if (draft.cacheMap) {
        draft.idMap = draft.cacheMap;
      }
      if (draft.cacheSelectingId) {
        draft.selectingId = draft.cacheSelectingId;
      }

      draft.editingId = null;
      draft.cacheMap = null;
      draft.cacheSelectingId = null;
    });
  }

  return AutoMerge.change(state, (draft) => {
    draft.editingId = null;
  });
};

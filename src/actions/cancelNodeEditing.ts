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

    return produce(state, (draft) => {
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

  return produce(state, (draft) => {
    draft.editingId = null;
  });
};

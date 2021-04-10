import AutoMerge from 'automerge';
import { AppState } from '../state';
import { pushHistory } from './pushHistory';

export const completeNodeEditing = (state: AppState) => {
  const editingId = state.editingId;
  const tmpName = state.tmpName || '';

  if (!editingId) {
    return state;
  }

  if (state.idMap[editingId].name === tmpName) {
    return AutoMerge.change(state, (draft) => {
      draft.editingId = null;
    });
  } else {
    return pushHistory(
      AutoMerge.change(state, (draft) => {
        draft.editingId = null;
        draft.cacheMap = null;
        draft.cacheSelectingId = null;
        draft.idMap[editingId].name = tmpName;
      })
    );
  }
};

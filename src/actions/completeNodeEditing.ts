import { produce } from 'immer';
import { AppState } from '../state';
import { pushHistory } from './pushHistory';

export const completeNodeEditing = (state: AppState) => {
  const editingId = state.editingId;
  const tmpName = state.tmpName || '';

  if (!editingId) {
    return state;
  }

  if (state.idMap[editingId].name === tmpName) {
    const newState = { ...state };
    newState.editingId = null;
    return newState;
  } else {
    return pushHistory(
      produce(state, (draft) => {
        draft.editingId = null;
        draft.cacheMap = null;
        draft.cacheSelectingId = null;
        draft.idMap[editingId].name = tmpName;
      })
    );
  }
};

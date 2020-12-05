import { produce } from 'immer';
import { AppState } from '../state';
import { pushHistory } from './pushHistory';

export const completeNodeEditing = (state: AppState) => {
  const editingId = state.editingId;
  const tmpName = state.tmpName || '';

  if (!editingId) {
    return state;
  }

  console.log(editingId)
  console.log(state.idMap)

  if (state.idMap[editingId].name === tmpName) {
    const newState = { ...state };
    newState.editingId = null;
    return newState;
  } else {
    return pushHistory(
      produce(state, (draft) => {
        draft.editingId = null;
        draft.cacheMap = null;
        draft.idMap[editingId].name = tmpName;
      })
    );
  }
};

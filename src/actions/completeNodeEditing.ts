import { produce } from 'immer';
import { AppState } from '../state';
import { pushHistory } from './pushHistory';

export const completeNodeEditing = (state: AppState) => {
  const editingId = state.editingId;
  const tmpName = state.tmpName || '';

  if (!editingId) {
    return state;
  }

  return pushHistory(
    produce(state, (draft) => {
      draft.editingId = null;
      draft.idMap[editingId].name = tmpName;
    })
  );
};

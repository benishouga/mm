import { produce } from 'immer';
import { AppState } from '../state';

export const completeNodeEditing = (state: AppState) => {
  const editingId = state.editingId;
  const tmpName = state.tmpName || '';

  if (!editingId) {
    return state;
  }

  return produce(state, (draft) => {
    draft.editingId = null;
    draft.idMap[editingId].name = tmpName;
  });
};

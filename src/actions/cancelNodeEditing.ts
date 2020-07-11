import { produce } from 'immer';
import { AppState } from '../state';

export const cancelNodeEditing = (state: AppState) => {
  return produce(state, (draft) => {
    draft.editingId = null;
  });
};

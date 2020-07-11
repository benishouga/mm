import { AppState } from '../state';

export const cancelNodeEditing = (state: AppState) => {
  return { ...state, editingId: null };
};

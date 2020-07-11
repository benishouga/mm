import { AppState } from '../state';

export const completeNodeEditing = (state: AppState) => {
  const editingId = state.editingId;
  const tmpName = state.tmpName || '';

  if (!editingId) {
    return state;
  }

  return {
    ...state,
    editingId: null,
    idMap: {
      ...state.idMap,
      [editingId]: {
        ...state.idMap[editingId],
        name: tmpName,
      },
    },
  };
};

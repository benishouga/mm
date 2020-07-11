import { AppState } from '../state';
import { v4 as uuidv4 } from 'uuid';

export const addNewNode = (state: AppState, name: string) => {
  const selectingId = state.selectingId;

  if (!selectingId) {
    return state;
  }

  const newId = uuidv4();

  return {
    ...state,
    selectingId: newId,
    editingId: newId,
    tmpName: name,
    idMap: {
      ...state.idMap,
      [selectingId]: {
        ...state.idMap[selectingId],
        children: [...state.idMap[selectingId].children, newId],
      },
      [newId]: {
        name,
        children: [],
        parent: selectingId,
        id: newId,
      },
    },
  };
};

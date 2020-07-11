import { AppState } from '../state';
import { v4 as uuidv4 } from 'uuid';

export const addSiblingNode = (state: AppState, name: string) => {
  const selectingId = state.selectingId;

  if (!selectingId) {
    return state;
  }

  const parentId = state.idMap[selectingId].parent;

  if (!parentId) {
    return state;
  }

  const newId = uuidv4();

  const index = state.idMap[parentId].children.indexOf(selectingId);

  if (index == -1) {
    console.error('wtf state!');
    return state;
  }

  const children = [...state.idMap[parentId].children];
  children.splice(index + 1, 0, newId);

  return {
    ...state,
    selectingId: newId,
    editingId: newId,
    tmpName: name,
    idMap: {
      ...state.idMap,
      [parentId]: {
        ...state.idMap[parentId],
        children,
      },
      [newId]: {
        name,
        children: [],
        parent: parentId,
        id: newId,
      },
    },
  };
};

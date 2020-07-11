import { produce } from 'immer';
import { AppState } from '../state';
import { v4 as uuidv4 } from 'uuid';

export const addNewNode = (state: AppState, name: string) => {
  const selectingId = state.selectingId;

  if (!selectingId) {
    return state;
  }

  const newId = uuidv4();

  return produce(state, (draft) => {
    draft.selectingId = newId;
    draft.editingId = newId;
    draft.tmpName = name;
    draft.idMap[selectingId].children.push(newId);
    draft.idMap[newId] = {
      name,
      children: [],
      parent: selectingId,
      id: newId,
    };
  });
};

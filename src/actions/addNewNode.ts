import { produce } from 'immer';
import { AppState } from '../state';
import { v4 as uuidv4 } from 'uuid';
import { pushHistory } from './pushHistory';

export const addNewNode = (state: AppState, _name: string) => {
  const selectingId = state.selectingId;

  if (!selectingId) {
    return state;
  }

  const newId = uuidv4();

  return pushHistory(
    produce(state, (draft) => {
      draft.selectingId = newId;
      draft.editingId = newId;
      const name = newId.slice(0, 4);
      draft.tmpName = name;
      draft.idMap[selectingId].children.push(newId);
      draft.idMap[newId] = {
        name: newId,
        children: [],
        parent: selectingId,
        id: newId,
      };
    })
  );
};

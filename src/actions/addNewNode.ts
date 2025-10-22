import { produce } from 'immer';
import { AppState } from '../state';
import { v4 as uuidv4 } from 'uuid';
import { pushHistory } from './pushHistory';

const isProduction = import.meta.env.PROD;

export const addNewNode = (state: AppState, _name: string) => {
  const editingId = state.editingId;
  const tmpName = state.tmpName || '';

  const selectingId = state.selectingId;
  if (!selectingId) {
    return state;
  }

  const newId = uuidv4();

  return pushHistory(
    produce(state, (draft) => {
      if (editingId) {
        draft.idMap[editingId].name = tmpName;
      }
      draft.selectingId = newId;
      draft.editingId = newId;
      const name = isProduction ? '' : newId.slice(0, 4);
      draft.tmpName = name;
      draft.cacheMap = state.idMap;
      draft.cacheSelectingId = state.selectingId;
      draft.idMap[selectingId].children.push(newId);
      draft.idMap[newId] = {
        name,
        children: [],
        parent: selectingId,
        id: newId,
      };
    })
  );
};

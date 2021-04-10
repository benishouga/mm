import AutoMerge from 'automerge';
import { AppState } from '../state';
import { v4 as uuidv4 } from 'uuid';
import { pushHistory } from './pushHistory';

export const addParentNode = (state: AppState, _name: string) => {
  const editingId = state.editingId;
  const tmpName = state.tmpName || '';

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

  return pushHistory(
    AutoMerge.change(state, (draft) => {
      if (editingId) {
        draft.idMap[editingId].name = tmpName;
      }
      draft.selectingId = newId;
      draft.editingId = newId;
      const name = newId.slice(0, 4);
      draft.tmpName = name;
      draft.cacheMap = JSON.parse(JSON.stringify(draft.idMap));
      draft.cacheSelectingId = draft.selectingId;
      draft.idMap[parentId].children[index] = newId;
      draft.idMap[newId] = {
        name,
        children: [selectingId],
        parent: parentId,
        id: newId,
      };
    })
  );
};

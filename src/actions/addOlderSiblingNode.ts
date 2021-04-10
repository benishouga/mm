import AutoMerge from 'automerge';
import { AppState } from '../state';
import { v4 as uuidv4 } from 'uuid';
import { pushHistory } from './pushHistory';

export const addOlderSiblingNode = (state: AppState, _name: string) => {
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

  return pushHistory(
    AutoMerge.change(state, (draft) => {
      draft.selectingId = newId;
      draft.editingId = newId;
      const name = newId.slice(0, 4);
      draft.tmpName = name;
      draft.cacheMap = JSON.parse(JSON.stringify(draft.idMap));
      draft.cacheSelectingId = draft.selectingId;
      draft.idMap[parentId].children.splice(index, 0, newId);
      draft.idMap[newId] = {
        name,
        children: [],
        parent: parentId,
        id: newId,
      };
    })
  );
};

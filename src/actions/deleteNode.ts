import { produce } from 'immer';
import { AppState } from '../state';
import { pushHistory } from './pushHistory';
import { collectChildrenIds } from './utils';

export const deleteNode = (state: AppState) => {
  const selectingId = state.selectingId;
  if (!selectingId) {
    return state;
  }

  const parentId = state.idMap[selectingId].parent;
  if (!parentId) {
    return state;
  }

  const ids = collectChildrenIds(state.idMap[selectingId], state);

  const parent = state.idMap[parentId];
  const selectingNodeIndex = parent.children.indexOf(selectingId);

  let nextSelectingNode: string;

  if (parent.children.length === 1) {
    nextSelectingNode = parentId;
  } else {
    if (selectingNodeIndex === 0) {
      nextSelectingNode = parent.children[selectingNodeIndex + 1];
    } else {
      nextSelectingNode = parent.children[selectingNodeIndex - 1];
    }
  }

  return pushHistory(
    produce(state, (draft) => {
      ids.forEach((id) => {
        delete draft.idMap[id];
      });

      const index = state.idMap[parentId].children.indexOf(selectingId);
      draft.idMap[parentId].children.splice(index, 1);
      draft.selectingId = nextSelectingNode;
    })
  );
};

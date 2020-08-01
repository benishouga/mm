import { produce } from 'immer';
import { AppState } from '../state';
import { pushHistory } from './pushHistory';

export const dropNode = (state: AppState, nodeId: string) => {
  console.log(state.draggingId);
  console.log(nodeId);

  const draggingId = state.draggingId;

  if (!draggingId) {
    return state;
  }

  const parentId = state.idMap[draggingId].parent;

  if (!parentId) {
    return state;
  }

  const parent = state.idMap[parentId];

  return pushHistory(
    produce(state, (draft) => {
      const index = parent.children.indexOf(draggingId);
      draft.idMap[parentId].children.splice(index, 1);
      draft.draggingId = null;
    })
  );

};

import AutoMerge from 'automerge';
import { AppState } from '../state';
import { pushHistory } from './pushHistory';
import { collectChildrenIds } from './utils';

export const dropToBefore = (state: AppState, nodeId: string) => {
  const draggingId = state.draggingId;

  if (!draggingId || draggingId === nodeId) {
    return AutoMerge.change(state, (draft) => {
      draft.draggingId = null;
    });
  }

  return pushHistory(
    AutoMerge.change(state, (draft) => {
      draft.draggingId = null;
      const draggingNode = draft.idMap[draggingId];
      if (collectChildrenIds(draggingNode, draft).indexOf(nodeId) !== -1) {
        return;
      }

      const parentIdOfDraggingNode = draggingNode.parent;
      if (!parentIdOfDraggingNode) {
        return;
      }

      const parentOfDraggingNode = draft.idMap[parentIdOfDraggingNode];
      const parentIdToInsert = draft.idMap[nodeId].parent;
      if (!parentIdToInsert) {
        return;
      }

      const index = parentOfDraggingNode.children.indexOf(draggingId);
      parentOfDraggingNode.children.splice(index, 1);
      const parentToInsert = draft.idMap[parentIdToInsert];
      const indexToInsert = parentToInsert.children.indexOf(nodeId);
      if (indexToInsert === -1) {
        throw new Error('arien');
      }

      parentToInsert.children.splice(indexToInsert, 0, draggingId);
      draggingNode.parent = parentIdToInsert;
    })
  );
};

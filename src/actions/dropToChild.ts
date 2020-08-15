import { produce } from 'immer';
import { AppState } from '../state';
import { pushHistory } from './pushHistory';
import { collectChildrenIds } from './utils';

export const dropToChild = (state: AppState, nodeId: string) => {
  console.log(state.draggingId);
  console.log(nodeId);

  const draggingId = state.draggingId;

  if (!draggingId || draggingId === nodeId) {
    return state;
  }

  return pushHistory(
    produce(state, (draft) => {
      console.log('ChildrenIds:' + JSON.stringify(collectChildrenIds(draft.idMap[draggingId], draft), null, ' '));
      const draggingNode = draft.idMap[draggingId];
      if (collectChildrenIds(draggingNode, draft).indexOf(nodeId) !== -1) {
        return;
      }

      const parentIdOfDraggingNode = draggingNode.parent;
      if (!parentIdOfDraggingNode) {
        return;
      }

      const parentOfDraggingNode = draft.idMap[parentIdOfDraggingNode];
      const nodeToInsert = draft.idMap[nodeId];
      if (!nodeToInsert) {
        return;
      }

      const index = parentOfDraggingNode.children.indexOf(draggingId);
      console.log('DraggingParentChildren:' + JSON.stringify(parentOfDraggingNode.children, null, ' '));
      console.log('ChildrenToInsert:' + JSON.stringify(nodeToInsert.children, null, ' '));

      parentOfDraggingNode.children.splice(index, 1);
      
      nodeToInsert.children.push(draggingId);
      draggingNode.parent = nodeId;

      console.log('After parentOfDraggingNode' + JSON.stringify(parentOfDraggingNode.children, null, ' '));
      console.log('After Children:' + JSON.stringify(nodeToInsert.children, null, ' '));
      draft.draggingId = null;
    })
  );
};

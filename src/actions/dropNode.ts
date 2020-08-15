import { produce } from 'immer';
import { AppState } from '../state';
import { pushHistory } from './pushHistory';
import { collectChildrenIds } from './utils';

export const dropNode = (state: AppState, nodeId: string) => {
  console.log(state.draggingId);
  console.log(nodeId);

  const draggingId = state.draggingId;

  if (!draggingId || draggingId === nodeId) {
    return state;
  }

  return pushHistory(
    produce(state, (draft) => {
      console.log('ChildrenIds:' + JSON.stringify(collectChildrenIds(draft.idMap[draggingId], draft), null, ' '));
      if (collectChildrenIds(state.idMap[draggingId], state).indexOf(nodeId) !== -1) {
        return;
      }

      const parentIdOfDraggingNode = draft.idMap[draggingId].parent;
      if (!parentIdOfDraggingNode) {
        return;
      }

      const parentOfDraggingNode = draft.idMap[parentIdOfDraggingNode];
      const parentIdToInsert = draft.idMap[nodeId].parent;
      if (!parentIdToInsert) {
        return;
      }

      const index = parentOfDraggingNode.children.indexOf(draggingId);
      console.log('DraggingParentChildren:' + JSON.stringify(parentOfDraggingNode.children, null, ' '));
      console.log('ParentChildrenToInsert:' + JSON.stringify(draft.idMap[parentIdToInsert].children, null, ' '));

      parentOfDraggingNode.children.splice(index, 1);
      const parentToInsert = draft.idMap[parentIdToInsert];
      const indexToInsert = parentToInsert.children.indexOf(nodeId);
      console.log(`CurrentIndex:${index}, IndexToInsert:${indexToInsert}`);
      if (indexToInsert === -1) {
        throw new Error('arien');
      }

      parentToInsert.children.splice(indexToInsert, 0, draggingId);
      console.log('After ParentChildren:' + JSON.stringify(parentToInsert.children, null, ' '));
      draft.draggingId = null;
    })
  );
};

import AutoMerge from 'automerge';
import { AppState } from '../state';

const selectSiblingChildNode = (state: AppState, targetNodeId: string): AppState => {
  
  const children = state.idMap[targetNodeId].children;

  if (children.length === 0) {
    return AutoMerge.change(state, (draft) => {
      draft.selectingId = targetNodeId;
    });
  }

  return selectSiblingChildNode(state, children[children.length - 1]);
};

export const selectOverNode = (state: AppState) => {
  if (!state.selectingId) {
    return state;
  }

  const parentId = state.idMap[state.selectingId].parent;

  if (!parentId) {
    return state;
  }

  const parent = state.idMap[parentId];
  const selectingNodeIndex = parent.children.indexOf(state.selectingId);

  if (selectingNodeIndex === 0) {
    return AutoMerge.change(state, (draft) => {
      draft.selectingId = parentId;
    });
  }

  const nextSelectingNode = parent.children[selectingNodeIndex - 1];

  return selectSiblingChildNode(state, nextSelectingNode);
};

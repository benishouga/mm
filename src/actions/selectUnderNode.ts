import { produce } from 'immer';
import { AppState } from '../state';

const selectParentSiblingNode = (state: AppState, targetNodeId: string): AppState => {
  const parentId = state.idMap[targetNodeId].parent;

  if (!parentId) {
    return state;
  }

  const parent = state.idMap[parentId];
  const selectingNodeIndex = parent.children.indexOf(targetNodeId);

  if (selectingNodeIndex < parent.children.length - 1) {
    const nextSelectingNode = parent.children[selectingNodeIndex + 1];

    return produce(state, (draft) => {
      draft.selectingId = nextSelectingNode;
    });
  } else {
    return selectParentSiblingNode(state, parentId);
  }
};

export const selectUnderNode = (state: AppState) => {
  if (!state.selectingId) {
    return state;
  }

  const children = state.idMap[state.selectingId].children;
  if (children.length) {
    return produce(state, (draft) => {
      draft.selectingId = children[0];
    });
  }

  return selectParentSiblingNode(state, state.selectingId);
};

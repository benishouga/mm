import AutoMerge from 'automerge';
import { AppState } from '../state';

function getDepthAndOneYoungerBrotherId(
  state: AppState,
  targetNodeId: string,
  depth: number = 0
): { depth: number; oneYoungerBrotherId: string } | null {
  const parentId = state.idMap[targetNodeId].parent;

  if (parentId === null) {
    return null;
  }
  const parent = state.idMap[parentId];

  const targetNodeIndex = parent.children.indexOf(targetNodeId);

  if (targetNodeIndex === parent.children.length - 1) {
    return getDepthAndOneYoungerBrotherId(state, parentId, depth + 1);
  }

  return { depth, oneYoungerBrotherId: parent.children[targetNodeIndex + 1] };
}

const selectSameDepthNode = (state: AppState, depth: number, targetNodeId: string): AppState => {
  const children = state.idMap[targetNodeId].children;

  if (children.length === 0 || depth === 0) {
    return AutoMerge.change(state, (draft) => {
      draft.selectingId = targetNodeId;
    });
  }

  return selectSameDepthNode(state, depth - 1, children[0]);
};

export const selectUnderSameDepthNode = (state: AppState) => {
  if (!state.selectingId) {
    return state;
  }

  const oneYoungerBrother = getDepthAndOneYoungerBrotherId(state, state.selectingId);

  if (oneYoungerBrother === null) {
    return state;
  }
  const { depth, oneYoungerBrotherId: oneYoungerBrotherId } = oneYoungerBrother;

  return selectSameDepthNode(state, depth, oneYoungerBrotherId);
};

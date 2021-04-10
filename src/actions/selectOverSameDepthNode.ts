import AutoMerge from 'automerge';
import { AppState } from '../state';

function getDepthAndOneElderBrotherId(
  state: AppState,
  targetNodeId: string,
  depth: number = 0
): { depth: number; oneElderBrotherId: string } | null {
  const parentId = state.idMap[targetNodeId].parent;

  if (parentId === null) {
    return null;
  }
  const parent = state.idMap[parentId];

  const targetNodeIndex = parent.children.indexOf(targetNodeId);

  if (targetNodeIndex === 0) {
    return getDepthAndOneElderBrotherId(state, parentId, depth + 1);
  }

  return { depth, oneElderBrotherId: parent.children[targetNodeIndex - 1] };
}

const selectSameDepthNode = (state: AppState, depth: number, targetNodeId: string): AppState => {
  const children = state.idMap[targetNodeId].children;

  if (children.length === 0 || depth === 0) {
    return AutoMerge.change(state, (draft) => {
      draft.selectingId = targetNodeId;
    });
  }

  return selectSameDepthNode(state, depth - 1, children[children.length - 1]);
};

export const selectOverSameDepthNode = (state: AppState) => {
  if (!state.selectingId) {
    return state;
  }

  const oneElderBrother = getDepthAndOneElderBrotherId(state, state.selectingId);

  if (oneElderBrother === null) {
    return state;
  }
  const { depth, oneElderBrotherId } = oneElderBrother;

  return selectSameDepthNode(state, depth, oneElderBrotherId);
};

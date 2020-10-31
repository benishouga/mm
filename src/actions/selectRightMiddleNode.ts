import { produce } from 'immer';
import { AppState, Geometry } from '../state';

export const selectRightMiddleNode = (state: AppState) => {
  if (!state.selectingId) {
    return state;
  }
  const current = state.idMap[state.selectingId];
  const children = current.children;
  if (!children.length) {
    return state;
  }

  const currentGeometry: Geometry = current.ephemeral?.geometry || {
    calculatingTop: 0,
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  };
  return produce(state, (draft) => {
    const childNodes = children.map((child) => state.idMap[child]);
    const actualCurrentTop = currentGeometry.calculatingTop + currentGeometry.height / 2;
    let targetTop = 0;
    let targetNodeIndex = 0;
    for (let i = 0; i < childNodes.length; i++) {
      const childNode = childNodes[i];
      const childNodeGeometry: Geometry = childNode.ephemeral?.geometry || {
        calculatingTop: 0,
        left: 0,
        top: 0,
        width: 0,
        height: 0,
      };
      const actualChildNodeTop = childNodeGeometry.calculatingTop + childNodeGeometry.height / 2;
      if (actualCurrentTop <= actualChildNodeTop) {
        if (actualCurrentTop - targetTop < actualChildNodeTop - actualCurrentTop) {
          targetNodeIndex = i - 1;
        } else {
          targetNodeIndex = i;
        }
        break;
      }
      if (actualChildNodeTop < actualCurrentTop) {
        targetTop = actualChildNodeTop;
      }
    }

    draft.selectingId = children[targetNodeIndex];
  });
};

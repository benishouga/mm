import AutoMerge from 'automerge';
import { AppState } from '../state';

export const selectChildNode = (state: AppState) => {
  if (!state.selectingId) {
    return state;
  }

  const children = state.idMap[state.selectingId].children;
  if (!children.length) {
    return state;
  }

  return AutoMerge.change(state, (draft) => {
    draft.selectingId = children[0];
  });
};

import AutoMerge from 'automerge';
import { AppState } from '../state';

export const selectParentNode = (state: AppState) => {
  if (!state.selectingId) {
    return state;
  }

  const parentId = state.idMap[state.selectingId].parent;
  if (!parentId) {
    return state;
  }

  return AutoMerge.change(state, (draft) => {
    draft.selectingId = parentId;
  });
};

import { produce } from 'immer';
import { AppState } from '../state';

export const undo = (state: AppState) => {
  if (state.idMapHistory.currentIndex === 0) {
    return state;
  }
  return produce(state, (draft) => {
    draft.idMapHistory.currentIndex--;
    draft.idMap = state.idMapHistory.history[draft.idMapHistory.currentIndex];
  });
};

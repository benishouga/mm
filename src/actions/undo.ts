import AutoMerge from 'automerge';
import { AppState } from '../state';

export const undo = (state: AppState) => {
  if (state.idMapHistory.currentIndex === 0) {
    return state;
  }
  return AutoMerge.change(state, (draft) => {
    draft.idMapHistory.currentIndex--;
    const history = state.idMapHistory.history[draft.idMapHistory.currentIndex];
    draft.idMap = JSON.parse(JSON.stringify(history.idMap));
    draft.selectingId = history.selectingId;
  });
};

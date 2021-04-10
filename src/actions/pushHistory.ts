import AutoMerge from 'automerge';
import { AppState } from '../state';

export const pushHistory = (state: AppState) => {
  return AutoMerge.change(state, (draft) => {
    const currentIndex = draft.idMapHistory.currentIndex;
    const history = draft.idMapHistory.history;
    history.splice(currentIndex + 1, history.length - currentIndex - 1);
    history.push({ idMap: JSON.parse(JSON.stringify(draft.idMap)), selectingId: state.selectingId });
    draft.idMapHistory.currentIndex++;
    draft.isDirty = true;
  });
};

import { produce } from 'immer';
import { AppState } from '../state';

export const pushHistory = (state: AppState) => {
  return produce(state, (draft) => {
    const currentIndex = draft.idMapHistory.currentIndex;
    const history = draft.idMapHistory.history;
    history.splice(currentIndex + 1, history.length - currentIndex - 1);
    history.push({ idMap: state.idMap, selectingId: state.selectingId });
    draft.idMapHistory.currentIndex++;
    draft.isDirty = true;
  });
};

import AutoMerge from 'automerge';
import { AppState } from '../state';

export const switchView = (state: AppState) => {
  return AutoMerge.change(state, (draft) => {
    if (state.viewMode === 'bulletList') {
      draft.viewMode = 'mindMap';
    } else {
      draft.viewMode = 'bulletList';
    }
  });
};

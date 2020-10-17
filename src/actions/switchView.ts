import { produce } from 'immer';
import { AppState } from '../state';

export const switchView = (state: AppState) => {
  return produce(state, (draft) => {
    if (state.viewMode === 'bulletList') {
      draft.viewMode = 'mindMap';
    } else {
      draft.viewMode = 'bulletList';
    }
  });
};

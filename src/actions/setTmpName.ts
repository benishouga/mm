import AutoMerge from 'automerge';
import { AppState } from '../state';

export const setTmpName = (state: AppState, name: string) => {
  return AutoMerge.change(state, (draft) => {
    draft.tmpName = name;
  });
};

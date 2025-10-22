import { AppState } from '../state';
import { produce } from 'immer';

export const save = (state: AppState, mmid: string) => {
  return produce(state, (draft) => {
    draft.mmid = mmid;
    draft.isDirty = false;
  });
};

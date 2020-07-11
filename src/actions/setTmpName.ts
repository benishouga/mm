import { produce } from 'immer';
import { AppState } from '../state';

export const setTmpName = (state: AppState, name: string) => {
  return produce(state, (draft) => {
    draft.tmpName = name;
  });
};

import { produce } from 'immer';
import { AppState } from '../state';

export const pasteNode = (state: AppState, plaintext: string) => {

  console.log(plaintext)

  return produce(state, (draft) => {
    draft.selectingId = state.selectingId;
  });
};

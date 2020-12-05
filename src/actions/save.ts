import { AppState } from '../state';
import firebase from 'firebase';
import { produce } from 'immer';

export const save = (state: AppState, mmid: string) => {
  console.log(mmid);
  const ref = firebase.database().ref(`/mmm/${mmid}`);
  ref.set(state.idMap);
  return produce(state, (draft) => {
    draft.mmid = mmid;
    draft.isDirty = false;
  });
};

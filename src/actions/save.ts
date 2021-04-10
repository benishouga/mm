import { AppState } from '../state';
import firebase from 'firebase/app';
import 'firebase/database';
import AutoMerge from 'automerge';

export const save = (state: AppState, mmid: string) => {
  const ref = firebase.database().ref(`/mmm/${mmid}`);
  ref.set(state.idMap);
  return AutoMerge.change(state, (draft) => {
    draft.mmid = mmid;
    draft.isDirty = false;
  });
};

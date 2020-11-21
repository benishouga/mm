import { AppState } from '../state';
import firebase from 'firebase';

export const save = (state: AppState, mmid: string) => {
  console.log(mmid);
  const ref = firebase.database().ref(`/mmm/${mmid}`);
  ref.set(state.idMap);
  return state;
};

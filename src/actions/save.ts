import { AppState } from '../state';
import firebase from 'firebase';

export const save = (state: AppState) => {
  const ref = firebase.database().ref('/mm');
  ref.set(state.idMap);
  return state;
};

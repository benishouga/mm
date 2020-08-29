import { produce } from 'immer';
import { AppState, IdMap } from '../state';
import firebase from 'firebase';

export const load = async (state: AppState) => {
  const ref = firebase.database().ref('/mm');
  const data = await new Promise<IdMap>((resolve, reject) => {
    ref.on('value', (snapshot) => {
      if (snapshot?.val()) {
        resolve(snapshot.val());
      } else {
        reject();
      }
    });
  });
  Object.keys(data).forEach(
    (key) =>
      (data[key] = {
        ...data[key],
        children: data[key].children || [],
        parent: data[key].parent || null,
      })
  );
  return produce(state, (draft) => {
    draft.idMap = data;
  });
};

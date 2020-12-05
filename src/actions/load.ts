import { produce } from 'immer';
import { AppState, IdMap, initialIdMap } from '../state';
import firebase from 'firebase';

export const load = async (state: AppState, mmid: string) => {
  const ref = firebase.database().ref(`/mmm/${mmid}`);
  const data = await new Promise<IdMap | null>((resolve) => {
    ref.on('value', (snapshot) => {
      if (snapshot?.val()) {
        resolve(snapshot.val());
      } else {
        resolve(null);
      }
    });
  });

  if (!data) {
    return produce(state, (draft) => {
      draft.mmid = mmid;
      draft.idMap = initialIdMap;
      draft.idMapHistory = {
        history: [initialIdMap],
        currentIndex: 0,
      };
      draft.isDirty = false;
    });
  }

  Object.keys(data).forEach(
    (key) =>
      (data[key] = {
        ...data[key],
        children: data[key].children || [],
        parent: data[key].parent || null,
      })
  );

  return produce(state, (draft) => {
    draft.mmid = mmid;
    draft.idMap = data;
    draft.idMapHistory = {
      history: [data],
      currentIndex: 0,
    };
    draft.isDirty = false;
  });
};

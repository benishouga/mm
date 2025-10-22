import { produce } from 'immer';
import { AppState, IdMap, initialIdMap, ROOT_NODE_ID } from '../state';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';

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
        history: [{ idMap: initialIdMap, selectingId: ROOT_NODE_ID }],
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
      history: [{ idMap: data, selectingId: ROOT_NODE_ID }],
      currentIndex: 0,
    };
    draft.selectingId = ROOT_NODE_ID;
    draft.isDirty = false;
  });
};

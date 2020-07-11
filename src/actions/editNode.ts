import { produce } from 'immer';
import { AppState } from '../state';

export const editNode = (state: AppState, nodeId: string, name: string) => {
  return produce(state, (draft) => {
    draft.editingId = nodeId;
    draft.tmpName = name;
  });
};

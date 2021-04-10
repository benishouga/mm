import AutoMerge from 'automerge';
import { AppState } from '../state';

export const editNode = (state: AppState, nodeId: string, name: string) => {
  return AutoMerge.change(state, (draft) => {
    draft.editingId = nodeId;
    draft.tmpName = name;
  });
};

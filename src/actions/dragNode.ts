import AutoMerge from 'automerge';
import { AppState } from '../state';

export const dragNode = (state: AppState, nodeId: string | null) => {
  return AutoMerge.change(state, (draft) => {
    draft.draggingId = nodeId;
  });
};

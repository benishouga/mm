import { produce } from 'immer';
import { AppState } from '../state';

export const dragNode = (state: AppState, nodeId: string | null) => {
  return produce(state, (draft) => {
    draft.draggingId = nodeId;
  });
};

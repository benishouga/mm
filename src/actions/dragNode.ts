import { produce } from 'immer';
import { AppState } from '../state';

export const dragNode = (state: AppState, nodeId: string) => {
  return produce(state, (draft) => {
    draft.draggingId = nodeId;
  });
};

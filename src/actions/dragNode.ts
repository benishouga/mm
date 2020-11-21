import { produce } from 'immer';
import { AppState } from '../state';

export const dragNode = (state: AppState, nodeId: string | null) => {
  return produce(state, (draft) => {
    console.log('Dragging start');
    draft.draggingId = nodeId;
  });
};

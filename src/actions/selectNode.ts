import { produce } from 'immer';
import { AppState } from '../state';
import { completeNodeEditing } from './completeNodeEditing';

export const selectNode = (state: AppState, nodeId: string) => {
  const newState = completeNodeEditing(state);

  return produce(newState, (draft) => {
    draft.selectingId = nodeId;
  });
};

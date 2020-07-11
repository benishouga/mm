import { AppState } from '../state';
import { completeNodeEditing } from './completeNodeEditing';

export const selectNode = (state: AppState, nodeId: string) => {
  const newState = completeNodeEditing(state);
  return {
    ...newState,
    selectingId: nodeId,
  };
};

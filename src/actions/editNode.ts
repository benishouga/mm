import { AppState } from '../state';

export const editNode = (state: AppState, nodeId: string, name: string) => {
  return {
    ...state,
    editingId: nodeId,
    tmpName: name,
  };
};

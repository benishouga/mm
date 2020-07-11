import { AppState } from '../state';

export const setTmpName = (state: AppState, name: string) => {
  return {
    ...state,
    tmpName: name,
  };
};

import { produce } from 'immer';
import { AppState } from '../state';
import { convertPlainTextToMmNodes } from './utils';

export const pasteNode = (state: AppState, plaintext: string) => {
  if (!state.selectingId) {
    return state;
  }

  const mmNodes = convertPlainTextToMmNodes(plaintext);

  return produce(state, (draft) => {
    mmNodes.forEach((node) => {
      if (!node.parent) {
        node.parent = state.selectingId;
        if (state.selectingId) {
          draft.idMap[state.selectingId].children.push(node.id);
        }
      }
      draft.idMap[node.id] = node;
    });
  });
};

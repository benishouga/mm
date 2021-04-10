import AutoMerge from 'automerge';
import { AppState } from '../state';
import { pushHistory } from './pushHistory';
import { convertPlainTextToMmNodes } from './utils';

export const pasteNode = (state: AppState, plaintext: string) => {
  if (!state.selectingId) {
    return state;
  }

  const mmNodes = convertPlainTextToMmNodes(plaintext);

  return pushHistory(
    AutoMerge.change(state, (draft) => {
      mmNodes.forEach((node) => {
        if (!node.parent) {
          node.parent = state.selectingId;
          if (state.selectingId) {
            draft.idMap[state.selectingId].children.push(node.id);
          }
        }
        draft.idMap[node.id] = node;
      });
    })
  );
};

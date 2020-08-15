import { MmNode, AppState } from '../state';

export function collectChildrenIds(tree: MmNode, state: AppState) {
  let ids = [tree.id];

  tree.children.forEach((id) => {
    ids = ids.concat(collectChildrenIds(state.idMap[id], state));
  });

  return ids;
}

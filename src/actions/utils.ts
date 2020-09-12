import { MmNode, AppState } from '../state';

export function collectChildrenIds(tree: MmNode, state: AppState) {
  let ids = [tree.id];

  tree.children.forEach((id) => {
    ids = ids.concat(collectChildrenIds(state.idMap[id], state));
  });

  return ids;
}

function measureNodeGeometry(node: MmNode, state: AppState): { width: number; height: number } {
  const result = node.children.reduce(
    (result, current) => {
      const childrenSize = measureNodeGeometry(state.idMap[current], state);
      const width = Math.max(result.width, childrenSize.width); /* + self width */
      const height = result.height + childrenSize.height; /* + self height */
      return { width, height };
    },
    { width: 0, height: 0 }
  );
  node.ephemeral = {
    geometry: {
      top: 0,
      left: 0,
      width: result.width + 100,
      height: result.height + 30,
    },
  };
  return result;
}

function layoutNodeGeometry(parent: MmNode, state: AppState) {
  parent.children.forEach((current) => {
    const self = state.idMap[current];
    const parentGeomety = parent.ephemeral?.geometry || {
      top: 0,
      left: 0,
      width: 0,
      height: 0,
    };
    const selfGeometry = self.ephemeral?.geometry || {
      top: 0,
      left: 0,
      width: 0,
      height: 0,
    };
    self.ephemeral = {
      geometry: {
        ...selfGeometry,
        top: parentGeomety.top + parentGeomety.height,
        left: parentGeomety.left + parentGeomety.width,
      },
    };
    layoutNodeGeometry(self, state);
  });
}

export function calculateNodeGeometry(node: MmNode, state: AppState) {
  measureNodeGeometry(node, state);
  layoutNodeGeometry(node, state);
}

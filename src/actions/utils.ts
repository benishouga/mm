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

  const currentWidth = result.width + getTextWidth(node.name);
  const currentHeight = Math.max(result.height, 30);
  node.ephemeral = {
    geometry: {
      top: 0,
      left: 0,
      width: currentWidth,
      height: currentHeight,
    },
  };
  return {
    width: currentWidth,
    height: currentHeight,
  };
}

function layoutNodeGeometry(node: MmNode, state: AppState) {
  let top = 0;
  const nodeGeometry = node.ephemeral?.geometry || {
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  };

  node.children.forEach((current) => {
    const child = state.idMap[current];
    const childGeometry = child.ephemeral?.geometry || {
      top: 0,
      left: 0,
      width: 0,
      height: 0,
    };
    child.ephemeral = {
      geometry: {
        ...childGeometry,
        top: nodeGeometry.top + top,
        left: nodeGeometry.left + getTextWidth(node.name),
      },
    };
    layoutNodeGeometry(child, state);
    top += childGeometry.height;
  });
}

export function calculateNodeGeometry(node: MmNode, state: AppState) {
  measureNodeGeometry(node, state);
  layoutNodeGeometry(node, state);
}

export const getTextWidth = (() => {
  const context = document.createElement('canvas').getContext('2d');
  return function getTextWidth(text: string) {
    if (context) {
      return context.measureText(text).width * 1.8;
    } else {
      return 0;
    }
  };
})();

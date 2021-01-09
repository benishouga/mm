import { MmNode, AppState, IdMap } from '../state';
import { v4 as uuidv4 } from 'uuid';

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
      calculatingTop: 0,
      left: 0,
      top: 0,
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
    calculatingTop: 0,
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  };

  node.children.forEach((current) => {
    const child = state.idMap[current];
    const childGeometry = child.ephemeral?.geometry || {
      calculatingTop: 0,
      left: 0,
      top: 0,
      width: 0,
      height: 0,
    };
    child.ephemeral = {
      geometry: {
        ...childGeometry,
        calculatingTop: nodeGeometry.calculatingTop + top,
        top: nodeGeometry.calculatingTop + top + childGeometry.height / 2,
        left: nodeGeometry.left + getTextWidth(node.name) + 30,
      },
    };
    layoutNodeGeometry(child, state);
    top += childGeometry.height;
  });
}

export function calculateNodeGeometry(node: MmNode, state: AppState) {
  measureNodeGeometry(node, state);
  layoutNodeGeometry(node, state);
  const nodeGeometry = node.ephemeral?.geometry || {
    calculatingTop: 0,
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  };
  node.ephemeral = {
    geometry: {
      ...nodeGeometry,
      top: nodeGeometry.calculatingTop + nodeGeometry.height / 2,
    },
  };
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

export const getTextHeight = (_text: string) => {
  return 30;
};

export const convertIdMapToPlainText = (nodeId: string, idMap: IdMap, depth = 0) => {
  const copyNode = idMap[nodeId];

  const indent = '\t'.repeat(depth);
  let plainText = indent + copyNode.name + '\n';

  copyNode.children.forEach((id) => {
    plainText += convertIdMapToPlainText(id, idMap, depth + 1);
  });

  return plainText;
};

type IrNode = { text: string; depth: number };

const convertPlainTextToIntermediateObjects = (plainText: string): IrNode[] => {
  return plainText
    .split('\n')
    .filter((line) => line.trim())
    .map((line) => {
      const depth = line.match(/^\s*/)?.[0].replace(/\ {4}/g, '\t').length || 0;
      return {
        text: line.trim(),
        depth: depth,
      };
    });
};

const collectChildNodes = (nodes: IrNode[], depth: number): IrNode[] => {
  const endIndex = nodes.findIndex((node) => node.depth <= depth);
  if (endIndex === -1) {
    return nodes;
  }
  return nodes.slice(0, endIndex);
};

const buildMnNodes = (nodes: IrNode[], depth: number, parent: MmNode): MmNode[] => {
  let mmNodes: MmNode[] = [];
  const children = collectChildNodes(nodes, depth);
  children.forEach((child, index) => {
    if (child.depth > depth + 1) {
      return;
    }
    const childNode: MmNode = {
      name: child.text,
      children: [],
      parent: parent.id,
      id: uuidv4(),
    };
    parent.children.push(childNode.id);
    mmNodes = mmNodes.concat(childNode, buildMnNodes(nodes.slice(index + 1), depth + 1, childNode));
  });
  return mmNodes;
};

export const convertPlainTextToMmNodes = (plainText: string): MmNode[] => {
  const source = convertPlainTextToIntermediateObjects(plainText);
  if (source.length === 0) {
    return [];
  }
  const root = source.splice(0, 1)[0];
  const rootNode: MmNode = {
    name: root.text,
    children: [],
    parent: null,
    id: uuidv4(),
  };
  return [rootNode, ...buildMnNodes(source, 0, rootNode)];
};

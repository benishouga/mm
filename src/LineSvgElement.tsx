import React from 'react';
import { useRecoilValue } from 'recoil';

import { calculatedAppState, Geometry } from './state';
import { getTextWidth } from './actions/utils';

function LineSvgElement(props: { parentNodeId: string; childNodeId: string }) {
  const state = useRecoilValue(calculatedAppState);
  const parentNode = state.idMap[props.parentNodeId];
  const childNode = state.idMap[props.childNodeId];

  const parentGeometry: Geometry = parentNode.ephemeral?.geometry || {
    calculatingTop: 0,
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  };
  const childGeometry: Geometry = childNode.ephemeral?.geometry || {
    calculatingTop: 0,
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  };

  const x1 = parentGeometry.left + getTextWidth(parentNode.name);
  const y1 = parentGeometry.top;

  const x2 = childGeometry.left;
  const y2 = childGeometry.top;

  return (
    <>
      <path
        d={`M ${x1} ${y1} Q ${x1 + 10} ${y1}, ${(x2 - x1) / 2 + x1} ${(y2 - y1) / 2 + y1} T ${x2} ${y2}`}
        fill="none"
        stroke="black"
      />
    </>
  );
}

export default LineSvgElement;

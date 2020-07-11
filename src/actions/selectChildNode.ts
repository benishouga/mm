import { AppState } from '../state';

export const selectChildNode = (state: AppState) => {
    if (!state.selectingId) {
        return state;
    }

    const children = state.idMap[state.selectingId].children;
    if (!children.length) {
        return state;
    }

    return {
        ...state,
        selectingId: children[0]
    };
};

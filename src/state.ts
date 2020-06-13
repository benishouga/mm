import { atom } from "recoil";

export type IdMap = {
  root: Node;
  [id: string]: Node;
};

export type Node = {
  name: string;
  children: string[];
};

export type AppState = {
  idMap: IdMap;
  selectingId: string | null;
  editingId: string | null;
  tmpName: string | null;
};

export const appState = atom<AppState>({
  key: "appState",
  default: {
    idMap: {
      root: {
        name: "root",
        children: []
      }
    },
    selectingId: null,
    editingId: null,
    tmpName: null
  }
});

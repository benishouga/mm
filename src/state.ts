import { atom } from "recoil";

export type Node = {
  name: string;
  children: Node[];
};

export type AppState = {
    root: Node,
    editingNode: Node | null,
    tmpName: string | null
};

export const appState = atom<AppState>({
  key: "appState",
  default: {
    root: {
      name: "root",
      children: [],
    },
    editingNode: null,
    tmpName: null 
  },
});

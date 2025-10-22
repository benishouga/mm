# Repository Guidelines

## Project Structure & Module Organization
- App code lives in `src/` (TypeScript + React). Entry: `src/index.tsx`. Root app: `src/App.tsx`. UI elements/components: `src/*.tsx` (e.g., `src/MindMap.tsx`, `src/BulletList.tsx`).
- Actions and state updates: `src/actions/*.ts` (imperative names like `addNewNode.ts`, `undo.ts`). Shared state in `src/state.ts`, config in `src/config.ts`, hooks in `src/hooks.ts`.
- Static assets and build output: `public/` (served by dev server). HTML shell: `public/index.html`.
- Build tooling: `webpack.config.js`, `tsconfig.json`, `.prettierrc`. Firebase config: `firebase.json`, `database.rules.json`.

## Build, Test, and Development Commands
- `npm install` — install dependencies.
- `npm start` — run webpack dev server with hot reload at `http://localhost:8080/` serving `public/`.
- `npm run dev` — run Firebase Realtime Database emulator and the dev server concurrently.
- `npm run emulator` — start only the Firebase emulator (imports from `.firebase_emulator_data`).
- `npm run build` — production build to `public/main.js` (loads env from `.env.production` if present).
- `npm run format` — format TS/TSX with Prettier.
- `npm run deploy` — build then deploy via Firebase Hosting.

## Coding Style & Naming Conventions
- TypeScript strict mode is enabled; keep types precise and avoid `any`.
- Use 2‑space indentation and Prettier (`.prettierrc`) for formatting; run `npm run format` before PRs.
- React components: PascalCase files (`MindMap.tsx`, `NodeElement.tsx`). Hooks: `useX` naming in `*.ts(x)`.
- Action modules: verb‑first camelCase (`addParentNode.ts`, `save.ts`). Keep them pure and side‑effect free.

## Testing Guidelines
- This repo does not include tests yet. If adding tests, prefer Jest + React Testing Library.
- Name tests `*.test.ts(x)` near sources (e.g., `src/NodeElement.test.tsx`).
- Keep tests fast and deterministic; mock Firebase and DnD as needed.

## Commit & Pull Request Guidelines
- Use clear, imperative commit messages. Recommended: Conventional Commits (e.g., `feat: add sibling node action`, `fix: correct selection traversal`).
- PRs should include: purpose/summary, screenshots or GIFs for UI changes, and steps to verify (commands + expected behavior). Link related issues.
- Ensure builds pass locally and formatting is applied. Avoid unrelated refactors in the same PR.

## Security & Configuration Tips
- Do not commit secrets. Use `.env.development` locally and `.env.production` for builds; both are loaded by webpack.
- Prefer the Firebase emulator for development (`npm run dev`) and validate rules in `database.rules.json`.

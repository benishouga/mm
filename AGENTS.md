# Repository Guidelines

## Project Structure & Module Organization
- `src/` holds the TypeScript React app. Top-level views such as `App.tsx`, `MindMap.tsx`, and `NodeElement.tsx` orchestrate the UI, while `actions/` contains pure state mutation helpers.
- `public/` provides static assets served by webpack-dev-server; update favicons and firebase configs here.
- `.firebase_emulator_data/` seeds the local Realtime Database emulator. Keep it lightweight so developer syncs stay fast.
- Configuration lives in `config.ts`, `.firebase.ts`, `.env`, and `tsconfig.json`. Update these alongside any structural changes to keep deploys predictable.

## Build, Test, and Development Commands
- `npm install` — install dependencies; run after pulling lockfile changes.
- `npm run dev` — launches the webpack dev server and Firebase database emulator together. Use when iterating on features.
- `npm start` — starts only the UI layer against live Firebase; handy for verifying prod config.
- `npm run build` — produces a production bundle in `dist/`; verify before `deploy`.
- `npm run deploy` — builds, then deploys via Firebase CLI. Requires authenticated Firebase session.

## Coding Style & Naming Conventions
- TypeScript with React 16. Components are `PascalCase` files exporting default or named functions; hooks and helpers stay `camelCase`.
- Prefer immutable updates; rely on the utilities in `actions/utils.ts`.
- Run `npm run format` before pushing. Prettier enforces 2-space indentation, 120 character line width, and single quotes.
- Keep imports relative to `src/`; avoid deep `../` nesting by colocating helpers near usage.

## Testing Guidelines
- Automated tests are not yet in place; exercise new features manually via `npm run dev`. Validate both mind map and bullet list flows, including drag-and-drop and Firebase sync.
- When touching Firebase interactions, run the emulator with a fresh seed and confirm auth/DB rules in `database.rules.json`.
- Document manual test steps in your PR description until automated coverage is introduced.

## Commit & Pull Request Guidelines
- Follow the existing short, imperative commit style (`add export image`, `fixed selecting issue`). Scope one logical change per commit.
- Reference related issues in both commits and PRs (`Fixes #123`) and include context on emulator data updates.
- Pull requests should describe the change, highlight UI impacts (screenshots for visual tweaks), and note any environment or seeding steps.
- Request review when the branch runs cleanly with `npm run dev` and `npm run build`.

## Firebase & Environment Notes
- Copy `.env` from teammates or set `FIREBASE_API_KEY`, `PROJECT_ID`, and related values per environment. Never commit production secrets.
- Keep emulator usage optional for reviewers by syncing `.firebase_emulator_data/` after data model changes and documenting regen commands.

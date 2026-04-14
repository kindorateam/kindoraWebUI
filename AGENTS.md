# AGENTS.md

This file provides repository-specific guidance to Codex and other coding agents working in this project.

## Commands

```bash
bun install          # Install dependencies
bun run dev          # Start dev server (HTTPS, port 5173)
bun run typecheck    # Type checking
bun run check        # Lint + format check (Biome)
bun run fix          # Auto-fix lint + format issues
bun run build        # Production build
```

## Tech Stack

Bun, React 19, TypeScript 5 (strict), Vite 7, TanStack Router (file-based routing), TanStack Query 5, Jotai 2, Axios via shared `apiClient`, Tailwind CSS 4, HeroUI 2, Biome 2, React Hook Form + Zod, Iconify via `unplugin-icons`.

## Architecture

### Feature-Based Structure

Colocate feature code in `src/features/{name}/`.

- Expected subfolders: `components/`, `hooks/`, `services/`, `stores/`, `utils/`
- Use `types.ts` until a feature grows large enough to justify a dedicated `types/` folder
- Feature services call `apiClient`
- Feature stores hold UI state only, such as modal visibility or transient form state

### Shared Code

Shared code belongs in top-level directories.

- `src/components/ui/`: generic reusable components only
- `src/stores/`: global atoms only
- `src/services/`: shared API infrastructure only

### Routing

- File-based routes live in `src/routes/`
- `_authenticated.tsx` is the protected layout
- `_guest.tsx` is the guest layout
- Prefix route files or folders with `-` to exclude them from routing
- `src/routeTree.gen.ts` is auto-generated and must never be edited manually

### Data Flow

Components -> hooks -> services -> `apiClient`

Do not skip layers. Components should consume hooks, not call service modules directly.

## Code Conventions

- Use arrow functions for React components: `const MyComponent = () => {}`
- Use one default export per `.tsx` file
- Use named exports for hooks, utilities, and non-component helpers
- Prefer `React.ReactNode`, `React.useRef`, and other `React.*` references instead of separately imported React types
- Prefer functional patterns over OOP; reserve classes for stateful abstractions such as `ApiClient`
- Use PascalCase for React component file names, such as `ConfirmRoomStep.tsx`
- Use kebab-case for non-component file names unless an existing local convention requires otherwise
- Use PascalCase for component identifiers
- Use `use*` camelCase for hooks
- Use `import type` for type-only imports
- Use the `@/*` path alias for `src/*`
- Use `SCREAMING_SNAKE_CASE` for primitive constants and `camelCase` for object or array constants
- Biome owns import ordering and Tailwind class sorting
- Formatting baseline: tabs, 120-character width, semicolons as needed, LF line endings

## Critical Rules

- Never call `axios` directly; always use `apiClient` from `src/services/api.service.ts`
- Never access `localStorage` directly; use Jotai `atomWithStorage`
- Never edit `src/routeTree.gen.ts`
- Never use `any`; prefer `unknown` with narrowing or proper generics
- Never wrap HeroUI components unless adding meaningful shared logic
- Never use inline SVGs or alternate icon libraries; use Iconify through `~icons/` imports
- Keep feature-specific code inside `src/features/`, not `src/components/ui/`
- Use typed `apiClient.get<T>()` style generics for API responses

## Implementation Heuristics

- Prefer the simplest solution that satisfies the current requirement
- Prefer composition over configuration-heavy APIs
- Avoid premature abstractions; extract only after real repetition appears
- Do not scaffold unused folders or speculative props
- Keep hooks and services focused on a single concern
- Large components usually want an extracted child component or hook

## Verification

- Run `bun run typecheck`
- Run `bun run check`
- Before committing, ensure both commands pass
- Run `bun run fix` when Biome can resolve issues automatically

## Environment

- Backend should be available at `localhost:8000` for API calls
- The dev proxy maps `/api/*` to `http://localhost:8000`
- The dev server runs on HTTPS and uses local certs from `.certs/`
- Relevant env vars: `VITE_API_BASE_URL`, `VITE_APP_TITLE`, `VITE_GOOGLE_CLIENT_ID`, `VITE_MEDIA_BASE_URL`

## Auth Flow

- Tokens live in Jotai atoms in `src/stores/auth.store.ts` and persist via storage-backed atoms
- On `401`, the interceptor refreshes the token and retries the request
- If refresh fails, redirect to login
- Auth endpoints such as `/auth/me`, `/auth/verify`, and `/auth/refresh` skip retry logic

## Repo Skills

Use the repo-local Codex skills under `.agents/skills/` when relevant:

- `code-principles`: implementation guardrails for KISS, DRY, YAGNI, and SOLID
- `new-feature`: scaffold a new feature folder using repo conventions
- `verify`: run the standard verification sequence before finishing work

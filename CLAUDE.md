# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun install          # Install dependencies
bun run dev          # Start dev server (HTTPS, port 5173)
bun run typecheck    # Type checking
bun run check        # Lint & format check (Biome)
bun run fix          # Auto-fix lint & format issues
bun run build        # Production build
```

## Tech Stack

Bun, React 19, TypeScript 5 (strict), Vite 7, TanStack Router (file-based routing), TanStack Query 5, Jotai 2 (state), Axios (HTTP), Tailwind CSS 4, HeroUI 2, Biome 2 (lint + format), React Hook Form + Zod, Iconify (icons).

## Architecture

**Feature-based structure** — colocate all related code within `src/features/{name}/`:
- `components/`, `hooks/`, `services/`, `stores/`, `utils/`, `types.ts` (or `types/` folder for 15+ types)
- Feature services call `apiClient`; feature stores hold UI-only state (drawer open, form state)

**Shared code** (used across features) lives in top-level dirs:
- `src/components/ui/` — generic reusable components only (PageLoader, ErrorBoundary)
- `src/stores/` — global atoms only (auth, theme)
- `src/services/` — shared API infrastructure only (apiClient, token service)

**Routing**: file-based in `src/routes/`. `_authenticated.tsx` = protected layout, `_guest.tsx` = guest layout. Prefix with `-` to exclude from routing. `src/routeTree.gen.ts` is auto-generated — never edit.

**Data flow**: Components → hooks (React Query) → services → `apiClient`

## Code Conventions

- **Arrow functions** for React components (`const MyComponent = () => {}`) — never `function` declarations
- **One default export per `.tsx` file** — each component file exports exactly one component as default; named exports for hooks/utils
- **React types**: use `React.ReactNode`, `React.useRef`, etc. — never import types separately from react
- **Functional programming** over OOP (classes only for stateful abstractions like ApiClient)
- **Files**: kebab-case. **Components**: PascalCase. **Hooks**: `use*` camelCase
- **Biome** handles import ordering and Tailwind class sorting — run `bun run fix`
- **Formatter**: tabs, 120-char line width, semicolons as-needed, LF line endings
- **Path alias**: `@/*` maps to `src/*`
- **Constants**: `SCREAMING_SNAKE_CASE` for primitives, `camelCase` for objects/arrays
- Use `import type` for type-only imports

## Critical Rules

- Never call `axios` directly — always use `apiClient` from `src/services/api.service.ts`
- Never access `localStorage` directly — use Jotai `atomWithStorage`
- Never edit `src/routeTree.gen.ts` — it's auto-generated
- Never use `any` — use `unknown` with type narrowing, or proper generics
- Never wrap HeroUI components without adding significant shared logic
- Never use inline SVGs or other icon libraries — always use Iconify via `unplugin-icons` (`~icons/` imports)
- Feature-specific code goes in `features/`, not in `components/ui/`
- Use `apiClient.get<T>()` generics for typed API responses

## Git & Commits

- **Conventional commits**: `feat:`, `fix:`, `refactor:`, `style:`, `chore:`, etc.
- No Co-Authored-By lines, no AI attribution comments in commits or PRs
- Run `bun run typecheck && bun run check` before committing

## Environment

- Backend must be running on `localhost:8000` for API calls (dev proxy: `/api/*` → `http://localhost:8000`)
- Dev server runs on HTTPS with local certs in `.certs/`
- Env vars: `VITE_API_BASE_URL`, `VITE_APP_TITLE`, `VITE_GOOGLE_CLIENT_ID`, `VITE_MEDIA_BASE_URL`

## Auth Flow

- Tokens in Jotai atoms (`src/stores/auth.store.ts`), persisted to localStorage
- 401 → interceptor refreshes token → retries request; if refresh fails → redirects to login
- Auth endpoints (`/auth/me`, `/auth/verify`, `/auth/refresh`) skip retry logic

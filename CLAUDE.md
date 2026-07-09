# CLAUDE.md

This file provides self-contained repository guidance to Claude Code. It intentionally repeats shared project rules instead of importing another instruction file, so Claude can operate independently.

## Commands

```bash
bun install          # Install dependencies
bun run dev          # Start dev server (HTTPS, port 5173)
bun run typecheck    # Type checking
bun run check        # Lint + format check (Biome)
bun run fix          # Auto-fix lint + format issues
bun run test         # Bun test suite
bun run build        # Production build
```

## Tech Stack

Bun, React 19, TypeScript 6 (strict), Vite 8, TanStack Router (file-based routing), TanStack Query 5, Jotai 2, Axios via shared `apiClient`, Tailwind CSS 4, HeroUI 3, Biome 2, React Hook Form + Zod, i18next, Iconify via `unplugin-icons`, and Bun Test.

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
- The React Compiler is enabled; avoid manual memoization unless it is required for semantics or a measured boundary

## Critical Rules

- Never call `axios` directly; always use `apiClient` from `src/services/api.service.ts`
- Never access `localStorage` directly; use Jotai `atomWithStorage`
- Never edit `src/routeTree.gen.ts`
- Never use `any`; prefer `unknown` with narrowing or proper generics
- Never wrap HeroUI components unless adding meaningful shared logic
- Never use inline SVGs or alternate icon libraries; use Iconify through `~icons/` imports
- Keep feature-specific code inside `src/features/`, not `src/components/ui/`
- Use typed `apiClient.get<T>()` style generics for API responses

## UI And Localization

- This project uses HeroUI v3 compound components, not HeroUI v2 APIs
- Use React Aria interaction props such as `onPress` and `isDisabled` on HeroUI components; native elements may use native DOM props
- A HeroUI `Button` used as a `Dropdown` trigger must be a direct child of `Dropdown`; wrapping it in `Dropdown.Trigger` creates nested buttons
- Put every user-visible string, including labels, placeholders, toasts, errors, and accessibility text, through i18next
- `src/i18n/locales/en.ts` defines the typed key shape; update `src/i18n/locales/es.ts` at the same time
- TypeScript validates keys consumed by the app, but it does not currently prove that the Spanish locale is complete; verify both locale files explicitly
- Locale persistence belongs in `src/i18n/locale.store.ts` via `atomWithStorage`; never access `localStorage` directly

## Library-Specific Guidance

- FullCalendar's React adapter can call `flushSync`; do not call calendar API methods synchronously from `useEffect`
- Defer effect-driven FullCalendar calls with a cancellable `setTimeout(0)` pattern, as used in `src/features/calendar/hooks/useCalendarNavigation.ts`
- `src/router.tsx` configures intent preloading, a pending UI, and automatic route code splitting; preserve those defaults unless the task explicitly changes routing behavior
- The `pine/` directory is independent TradingView Pine Script work and is outside the React, TypeScript, Biome, and Vite checks; touch it only for Pine-specific tasks

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
- Run `bun run test`
- Run `git diff --check`
- Before committing, ensure all standard checks pass
- Run `bun run build` when changing dependencies, build configuration, routing infrastructure, or production assets, and for release-readiness requests
- Run `bun run fix` only when Biome can safely resolve issues automatically, then review the resulting diff

## Environment

- Backend should be available at `localhost:8000` for API calls
- The dev proxy maps `/api/*` to `http://localhost:8000`
- The dev server runs on HTTPS and uses local certs from `.certs/`
- Relevant env vars: `VITE_API_BASE_URL`, `VITE_APP_TITLE`, `VITE_GOOGLE_CLIENT_ID`, `VITE_MEDIA_BASE_URL`

## Auth Flow

- Tokens live in Jotai atoms in `src/features/auth/stores/auth.store.ts` and persist via storage-backed atoms
- On `401`, the interceptor refreshes the token and retries the request
- If refresh fails, redirect to login
- All `/auth/*` endpoints, including login, verification, OAuth, logout, and refresh, skip interceptor refresh-and-retry logic

## Claude Code Skills

Use the independent project skills under `.claude/skills/` when relevant:

- `code-principles`: implementation guardrails for KISS, DRY, YAGNI, and SOLID
- `new-feature`: scaffold a new feature folder using repo conventions
- `verify`: run the standard verification sequence before finishing work
- `heroui-v3`: use the installed HeroUI v3 compound APIs and avoid known integration traps
- `i18n`: add or change user-visible text while keeping English and Spanish aligned

Codex has separate physical counterparts under `.agents/skills/`. Do not replace either skill directory with symlinks. When shared project behavior changes, update both copies deliberately; environment-specific tool instructions may differ.

## Claude Code Integrations

- HeroUI v3 documentation is available through the `heroui-react` MCP server. Use `get_component_docs` before implementing an unfamiliar HeroUI component; inspect source or styles only when debugging internals
- `.claude/settings.json` grants the standard Bun verification commands; keep it aligned when this file adds or renames a required command

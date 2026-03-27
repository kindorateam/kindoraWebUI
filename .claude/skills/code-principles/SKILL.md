---
name: code-principles
description: Enforce KISS/DRY/YAGNI/SOLID principles during implementation. Use this skill whenever writing new components, hooks, services, stores, or feature code. Also use when modifying existing code, adding functionality, creating abstractions, or refactoring. This skill triggers on any implementation task — building features, fixing bugs, adding components, creating hooks/services/stores, writing utilities. If you're about to write or change code, use this skill.
---

Apply these principles as you write code — they're proactive guardrails, not a post-hoc checklist.

When working near existing code that violates these principles, surface it: briefly note what you found and suggest a concrete refactoring approach. Finish the user's task first, then mention violations at the end.

## KISS — Keep It Simple

The simplest solution that works is the right one. Complexity must be earned.

**Composition over configuration.** Build components with children and slots, not sprawling config props. A component that renders its children is simpler than one with 10 optional rendering props.

**Don't abstract HeroUI components** (already a Critical Rule in CLAUDE.md). The skill reinforces: a thin wrapper that just forwards props adds indirection for zero benefit. Only wrap when adding real shared logic (form validation, data fetching, complex state).

**Never manually memoize.** This project uses `babel-plugin-react-compiler`, which auto-memoizes all components and hooks at build time. Do not use `useMemo`, `useCallback`, or `React.memo` — the compiler handles it. If you encounter existing manual memoization, remove it.

**Keep components under ~150 lines.** Past this, extract a child component or a custom hook. The goal isn't a hard rule — it's recognizing that large components are usually doing too much.

**Prefer inline over utility for one-offs.** A 3-line ternary in JSX is simpler than importing a utility from another file. Extract only when reuse is real.

## DRY — Don't Repeat Yourself

Repetition is a signal that an abstraction is missing. But extract on the *third* occurrence, not the first — premature abstraction violates KISS.

### Modal stores

This project has ~16 simple modal stores that are near-identical copies (atom + open/close functions). When creating a new simple boolean modal store, prefer a factory:

```ts
// Instead of another 13-line copy-paste file:
import { createModalAtom } from "@/stores/createModalAtom"
export const addStudentModal = createModalAtom()
// Usage: addStudentModal.isOpenAtom, addStudentModal.open(), addStudentModal.close()
```

Stores with real state beyond open/close (like event modals carrying data and defaults) are legitimately unique — don't force them into the factory.

### Query configuration

`staleTime: 5 * 60 * 1000` and `gcTime: 10 * 60 * 1000` are repeated in nearly every query hook. Extract shared defaults rather than copying magic numbers:

```ts
export const QUERY_DEFAULTS = { staleTime: 5 * 60 * 1000, gcTime: 10 * 60 * 1000 } as const
```

### API transformers

The `${firstName} ${lastName}` full-name pattern and `avatar?.path ?? defaultAvatar` appear in multiple services. When you see the same transformation in 3+ services, extract a shared transformer.

### Tables

Follow the established table pattern: `columns.ts` + `renderCell.tsx` (or `TableCell.tsx`) + `index.tsx`. Use HeroUI `Table` directly — the existing `DataTable` wrapper lacks key props like `isLoading`/`loadingContent`/`emptyContent` and no feature currently uses it.

## YAGNI — You Ain't Gonna Need It

Build for current requirements. Refactor when reality demands it.

**Don't scaffold empty directories.** Only create `hooks/`, `stores/`, `utils/` when you have a file to put in them.

**Don't add speculative props.** If a component is used in one place, hardcode its behavior. "We might need this later" isn't a requirement.

**Don't create barrel files for single exports.** An `index.ts` that re-exports one file adds indirection without value.

**Don't guard against impossible states.** If a value comes from a typed API response and TypeScript says it's not null, trust your types. Don't add defensive checks for states that can't occur.

**Don't pre-build pagination/filtering/sorting** unless the spec explicitly asks for it.

## SOLID (for functional React)

### Single Responsibility
One hook, one concern. One service, one API domain.

- A hook fetching data AND managing UI state → split into two hooks
- A service calling `/rooms/*` AND `/students/*` → two service files
- A component handling data fetching AND presentation → extract a container/hook

### Open/Closed
Extend via composition, not modification.

- Use `children` and render props for flexible areas
- Pass `className` for style extension
- If a boolean prop switches between two completely different renders, make two components

### Interface Segregation
Keep prop interfaces focused.

- 15+ props signals the component is doing too much — split it
- Compose small components over one mega-component with many optional props
- Split large type files into focused interfaces when subtypes are consumed independently

### Dependency Inversion

Follow the data flow and abstraction rules already defined in CLAUDE.md's Critical Rules (`apiClient` over `axios`, `atomWithStorage` over `localStorage`, Components → hooks → services → `apiClient`). The skill adds one guideline: never skip layers — a component should not call a service directly, it should go through a hook.

## Refactor Radar

While working in a feature, scan nearby files for these patterns:

| What you see | Principle | Suggest |
|---|---|---|
| Simple boolean modal store (atom + open + close, no extra state) | DRY | Factory pattern `createModalAtom` |
| Duplicated `staleTime`/`gcTime` magic numbers | DRY | Shared `QUERY_DEFAULTS` constant |
| Component over ~200 lines | KISS / SRP | Extract child component or hook |
| Hook doing data fetch + UI state management | SRP | Split into separate hooks |
| Props in an interface that nothing passes | YAGNI | Remove unused props |
| Empty scaffold directories | YAGNI | Remove them |
| Manual `useMemo`/`useCallback`/`React.memo` | KISS | Remove — React Compiler handles it |
| Thin HeroUI wrapper that only forwards props | KISS | Remove wrapper, use HeroUI directly |
| Unused shared component (e.g., DataTable not used by any feature) | YAGNI | Flag for deletion or justify its existence |

Surface violations at the end of your response, not as blockers:

> "While working here, I noticed `addDocumentModal.store.ts` follows the same pattern as 15 other modal stores. Want me to create a `createModalAtom` factory and consolidate these?"

Never block the user's task to fix existing violations. Finish their request first, then suggest.

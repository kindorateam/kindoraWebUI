---
name: code-principles
description: Apply the repository's implementation guardrails when writing or changing code. Use this skill for feature work, bug fixes, refactors, new components, hooks, services, stores, and utilities. It enforces KISS, DRY, YAGNI, and SOLID-style guidance for this React, TanStack, Jotai, and HeroUI codebase.
---

# Code Principles

Apply these principles while implementing code. They are proactive guardrails, not a post-hoc checklist.

When nearby code violates these principles, finish the user's task first, then briefly call out the issue and suggest a concrete cleanup.

## KISS

The simplest solution that works is preferred. Complexity must be earned.

- Prefer composition over configuration-heavy props
- Do not create thin HeroUI wrappers that only forward props
- Avoid manual memoization; this project relies on the React Compiler workflow instead of `useMemo`, `useCallback`, or `React.memo`
- If you encounter existing manual memoization, remove it only when it is safe and relevant to the task
- Large components are a signal to extract a child component or a hook
- Prefer inline logic for one-offs; extract helpers only when reuse is real

## DRY

Repeat patterns are a signal for extraction, but only after the repetition is real.

### Modal stores

This codebase contains many simple modal stores that share the same open-close shape. When adding another simple boolean modal store, prefer a small factory such as:

```ts
import { createModalAtom } from "@/stores/createModalAtom";

export const addStudentModal = createModalAtom();
```

Stores that carry real state beyond visibility are allowed to stay custom.

### Query defaults

If you see repeated TanStack Query timing config such as `staleTime: 5 * 60 * 1000` and `gcTime: 10 * 60 * 1000`, prefer a shared constant:

```ts
export const QUERY_DEFAULTS = {
	staleTime: 5 * 60 * 1000,
	gcTime: 10 * 60 * 1000,
} as const;
```

### Shared transformers

When the same API-to-UI transformation appears in multiple services, extract it only after repeated use is established.

### Tables

Follow the existing table pattern:

- `columns.ts`
- `renderCell.tsx` or `TableCell.tsx`
- `index.tsx`

Use HeroUI `Table` directly unless there is real shared behavior to justify a wrapper.

## YAGNI

Build for the current requirement, not speculative future needs.

- Do not scaffold empty directories unless the task needs files there now
- Do not add speculative props "just in case"
- Do not create barrel files for a single export
- Do not defend against impossible states that the type system already excludes
- Do not pre-build pagination, filtering, or sorting unless the requirement calls for them

## SOLID For Functional React

### Single Responsibility

- One hook, one concern
- One service, one API domain
- If a component handles both data fetching and presentation, extract the data layer into a hook or container

### Open/Closed

- Extend via composition, `children`, render props, and `className`
- If one boolean prop causes two unrelated render paths, prefer separate components

### Interface Segregation

- Keep prop interfaces tight
- If a component needs many optional props, it likely wants to be split
- Split oversized type modules when subtypes are consumed independently

### Dependency Inversion

Respect the repository data flow:

Components -> hooks -> services -> `apiClient`

Do not bypass the hook layer by calling services directly from components.

## Refactor Radar

While touching a feature, watch for these patterns:

- Simple boolean modal store duplicated again: suggest a modal factory
- Repeated query timing magic numbers: suggest shared query defaults
- Component pushing past roughly 200 lines: suggest extraction
- Hook mixing remote data concerns with UI state: suggest splitting responsibilities
- Unused props in interfaces: remove them if safe
- Empty scaffold directories: do not create them, and remove them only if relevant
- Manual memoization: remove if safe and aligned with the task
- Thin HeroUI wrapper: replace with direct HeroUI usage when justified

Surface these as follow-up suggestions, not blockers.

---
name: code-principles
description: Apply this repository's implementation guardrails whenever writing or changing application code, including features, bug fixes, refactors, components, hooks, services, stores, utilities, and routes. Consult this before modifying src/ code in the React, TanStack, Jotai, and HeroUI application.
---

# Code Principles

Use these as proactive design constraints. Keep the requested change primary; fix nearby issues only when they are relevant, safe, and proportionate to the task.

## KISS

- Prefer the smallest solution that fully satisfies the current requirement
- Prefer composition over configuration-heavy component APIs
- Use HeroUI components directly unless a wrapper adds meaningful shared behavior
- The React Compiler handles routine memoization; add `useMemo`, `useCallback`, or `React.memo` only for required semantics, an external API boundary, or measured performance
- Treat components near 200 lines as an extraction signal, not an automatic mandate
- Keep one-off logic local; extract helpers only after reuse or complexity justifies them

## DRY

Remove repeated policy and infrastructure before repeated presentation details.

- Use `createModalStore()` from `@/stores/createModalStore` for modal stores that contain only open/closed state
- Keep custom stores when they carry identifiers, selections, form state, or other meaningful state
- Use `QUERY_DEFAULTS` from `@/services/query.constants` instead of repeating query timing values
- Share API-to-UI transformers only when the same wire shape is transformed in multiple places
- Follow the established table split: `columns.ts`, `renderCell.tsx` or a dedicated cell component, and `index.tsx`
- Avoid broad abstractions that hide feature-specific behavior merely to remove a few similar lines

## YAGNI

- Do not create empty directories, speculative props, unused helpers, or single-export barrel files
- Do not add pagination, filtering, sorting, stores, or configuration until the requirement needs them
- Do not defend against impossible states already excluded by the type system
- Delete obsolete code when its lack of consumers is confirmed and the deletion is within scope

## Functional Boundaries

- Keep each hook and service focused on one concern
- Keep server state in TanStack Query and transient UI state in Jotai
- Respect the data flow: components -> hooks -> services -> `apiClient`
- Components must not import feature services directly
- Routes that prefetch feature data should consume exported query-option factories from the feature hook layer rather than duplicating service calls and query keys
- Keep feature code in `src/features/<name>/`; promote code to top-level shared directories only after genuine cross-feature use
- Keep prop and payload types narrow; split oversized type modules when consumers need independent domains

## Repository Rules

- Use typed `apiClient` methods; never call Axios directly outside `src/services/api.service.ts`
- Use `atomWithStorage` only for non-sensitive persisted state; keep access JWTs and user profiles in plain memory-backed atoms, and leave refresh tokens exclusively in HttpOnly cookies
- Preserve the single-flight refresh promise, cross-tab `navigator.locks` rotation lock, and versioned credential-free `BroadcastChannel` events when changing auth code
- Preserve Google Sign-In's one-time server nonce and ID-token POST flow; never switch authentication back to provider codes in URLs or client-supplied identity data
- Never access `localStorage` directly
- Use Iconify through `~icons/`; never add inline SVG markup or another icon library
- Use arrow functions for React components and one default export per component file
- Put user-visible text through i18next and update both English and Spanish locales
- Never edit `src/routeTree.gen.ts`

## Refactor Radar

While touching code, watch for duplicated modal state, repeated query policy, manual memoization without a semantic reason, object-URL leaks, stale query invalidation, mixed server/UI state, thin HeroUI wrappers, and components with multiple responsibilities. Resolve them when they intersect the task; otherwise report a focused follow-up instead of expanding scope.

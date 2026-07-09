---
name: new-feature
description: Scaffold or start a domain feature under src/features using this repository's conventions. Use whenever the user asks to create a feature, add a new domain area, bootstrap feature structure, or add the first component, hook, service, store, or types for a domain that does not yet exist.
---

# New Feature

Inspect the closest existing feature before creating files, then build only what the current request needs under `src/features/<feature-name>/`.

## Structure

Use these locations when the corresponding responsibility exists:

```text
src/features/<feature-name>/
├── components/
├── hooks/
├── services/
├── stores/
├── utils/
└── types.ts
```

Do not create empty directories. Start with `types.ts`; introduce a `types/` directory only after the feature has multiple independent type domains.

## Responsibilities

- Components render UI and consume hooks; they do not import service modules
- Hooks coordinate TanStack Query, mutations, and feature-facing data access
- Services own API calls and use typed `apiClient` methods from `@/services/api.service`
- Jotai feature stores contain transient UI state only; TanStack Query owns server state
- Utilities are pure feature-specific helpers; genuinely cross-feature utilities belong in the appropriate top-level shared directory

## Conventions

- Use PascalCase component filenames and identifiers
- Write React components as arrow functions with one default export per `.tsx` file
- Use kebab-case for non-component files unless the neighboring feature has an established exception
- Name services `<feature-name>.service.ts`
- Export hooks, utilities, and non-component helpers by name
- Prefix hooks with `use`
- Use `import type` for type-only imports and `@/*` aliases for `src/*`
- Type every API response, such as `apiClient.get<ResponseType>(...)`; never call Axios directly
- Reuse `QUERY_DEFAULTS` and `createModalStore()` when their existing shapes fit
- Do not create speculative props, barrels, stores, or API layers

## UI And Routing

- Use HeroUI v3 directly and Iconify icons through `~icons/`
- Put every user-facing string in both `src/i18n/locales/en.ts` and `src/i18n/locales/es.ts`
- Add a file-based route under `src/routes/` only when the requested feature needs navigation
- Place protected pages under `src/routes/_authenticated/` and guest pages under `src/routes/_guest/`
- Never edit `src/routeTree.gen.ts`

## Finish

Run the repository `verify` skill after scaffolding. Summarize the files created and call out optional routing or follow-up work only when it was not part of the requested scope.

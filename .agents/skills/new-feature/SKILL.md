---
name: new-feature
description: Scaffold a new feature folder under src/features using this repository's conventions. Use when the user asks to create a new feature, bootstrap feature structure, or add a starter service, component, hook, or types file for a new domain area.
---

# New Feature

Create a new feature at `src/features/<feature-name>/` following the repository's feature-based architecture.

Create only the essential starter files:

```text
src/features/<feature-name>/
├── components/       placeholder component file only when needed
├── hooks/            create only if the feature needs a hook now
├── services/         include a starter service using apiClient
└── types.ts          starter types file
```

Only create `stores/`, `utils/`, or `constants.ts` when the user describes a real need for them.

## Conventions

- Component file names use PascalCase
- Each `.tsx` component file has exactly one default export
- Component identifiers use PascalCase
- Service files should be named `<feature-name>.service.ts`
- Services import `apiClient` from `@/services/api.service.ts`
- Hook files use named exports and the `use*` prefix
- Types use named `export type`
- Use `import type` for type-only imports

## After Scaffolding

- Ask whether the user also wants a route under `src/routes/_authenticated/`
- Summarize what was created

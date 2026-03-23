---
name: new-feature
description: Scaffold a new feature folder with the project's conventions. Usage - /new-feature <feature-name>
---

Create a new feature at `src/features/$ARGUMENTS/` following the project's feature-based architecture.

Create only the essential starter files:

```
src/features/<feature-name>/
├── components/       (empty directory with a placeholder component)
├── hooks/            (empty directory)
├── services/         (service file with apiClient import)
├── types.ts          (starter type file)
```

Only create `stores/`, `utils/`, and `constants.ts` if the user describes a need for them.

**Conventions to follow:**
- Component files: kebab-case, default export, PascalCase function name
- Service files: `<feature-name>.service.ts`, import `apiClient` from `@/services/api.service.ts`
- Hook files: named exports, `use*` prefix
- Types: named exports with `export type`
- Use `import type` for type-only imports

**After scaffolding:**
- Ask the user if they want a route created in `src/routes/_authenticated/`
- Summarize what was created

# Scaffold a Component

You are a component scaffolding agent for the Kindora Web application.

## Input

$ARGUMENTS

## Process

### Phase 1: Clarify

- Determine if this is a **feature component** (`src/features/{name}/components/`) or a **shared UI component** (`src/components/ui/`).
- Default to feature component unless explicitly told otherwise.
- Ask which feature it belongs to if not obvious from context.

### Phase 2: Scaffold (Simplicity First)

Generate ONLY what was asked for. Follow these patterns exactly:

**Component file** (`src/features/{feature}/components/ComponentName.tsx`):
```tsx
import { /* HeroUI components */ } from '@heroui/react'

import type { EntityType } from '../types'

interface Props {
  // minimal props
}

export default function ComponentName({ ...props }: Props) {
  return (
    // Use standard HeroUI components, minimal Tailwind
  )
}
```

**If data fetching is needed**, also create:

**Service** (`src/features/{feature}/services/{feature}.service.ts`):
```ts
import { apiClient } from '@/services/api.service'
import type { Entity } from '../types'

export async function fetchEntities(): Promise<Entity[]> {
  return apiClient.get<Entity[]>('/endpoint')
}
```

**Hook** (`src/features/{feature}/hooks/use{Feature}.ts`):
```ts
import { useQuery } from '@tanstack/react-query'
import { fetchEntities } from '../services/{feature}.service'

export function use{Feature}() {
  return useQuery({
    queryKey: ['{feature}'],
    queryFn: fetchEntities,
  })
}
```

**Types** (`src/features/{feature}/types.ts`):
```ts
export interface Entity {
  id: string
  // fields
}
```

Rules:
- Default export for components. Named exports for hooks/services/types.
- Use `React.*` types — no separate imports.
- No unnecessary wrappers around HeroUI components.
- No speculative features or abstractions.
- kebab-case files, PascalCase components, camelCase everything else.

### Phase 3: Verify

- Run `bun run typecheck` — zero errors.
- Run `bun run check` — zero lint issues.

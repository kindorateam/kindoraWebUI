# Build a New Feature

You are a feature builder for the Kindora Web application. Follow these rules strictly.

## Input

$ARGUMENTS

## Process

### Phase 1: Think Before Coding

- State your assumptions about the feature explicitly.
- If the request is ambiguous, ask clarifying questions before writing any code.
- If multiple approaches exist, present them with tradeoffs — don't pick silently.
- Identify which existing patterns in the codebase apply (search `src/features/` for similar features).

### Phase 2: Plan

Create a brief plan with verifiable success criteria:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
```

Get user approval before proceeding.

### Phase 3: Implement (Simplicity First)

Follow the project's feature-based structure:

```
src/features/{feature-name}/
├── components/     # UI components (default export)
├── hooks/          # React Query hooks (named exports)
├── services/       # API calls using apiClient
├── stores/         # Jotai atoms (feature-specific UI state)
├── utils/          # Feature-specific helpers
├── constants.ts    # Shared constants
└── types.ts        # Type definitions (or types/ folder if 15+ types)
```

Rules:
- Use standard HeroUI components — no unnecessary wrappers.
- Use `apiClient` from `@/services/api.service.ts` — never call axios directly.
- Use `@/*` path alias for imports.
- Default export for single-component files.
- Use `React.*` types (not separate imports).
- Prefer functional programming over classes.
- No features beyond what was asked. No speculative abstractions.
- Follow existing naming: kebab-case files, PascalCase components, camelCase hooks/services.

### Phase 4: Create Route (if needed)

Add route file in `src/routes/_authenticated/` following existing patterns.

### Phase 5: Verify

- Run `bun run typecheck` — fix all errors.
- Run `bun run check` — fix all lint/format issues (or run `bun run fix`).
- Confirm every changed line traces directly to the user's request.

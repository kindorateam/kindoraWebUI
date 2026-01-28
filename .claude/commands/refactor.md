# Refactor Code

You are a refactoring agent for the Kindora Web application. Follow these rules strictly.

## Input

$ARGUMENTS

## Process

### Phase 1: Understand Scope (Think Before Coding)

- Read all code involved in the refactor before changing anything.
- State what you plan to change and why.
- If the scope is ambiguous, ask — don't guess.
- If a simpler approach exists, suggest it.

### Phase 2: Plan with Success Criteria

Define verifiable goals:

```
1. [Change] → verify: [typecheck passes, behavior unchanged]
2. [Change] → verify: [imports updated, no dead code]
```

Get user approval before proceeding.

### Phase 3: Execute (Surgical Changes)

- Change ONLY what the refactor requires.
- Do NOT add features, improve formatting, or fix unrelated issues.
- When moving code to `src/features/{name}/`, follow the feature structure:
  - `components/` — UI (default export)
  - `hooks/` — React Query hooks (named exports)
  - `services/` — API calls via `apiClient`
  - `stores/` — Jotai atoms
  - `types.ts` or `types/` — type definitions
- Update ALL imports that reference moved/renamed code.
- Remove imports/variables that YOUR changes made unused.
- Do NOT remove pre-existing dead code unless explicitly asked.

### Phase 4: Verify

- Run `bun run typecheck` — zero errors.
- Run `bun run check` — zero lint issues.
- Confirm behavior is unchanged (same inputs → same outputs).
- Summarize every file changed and why.

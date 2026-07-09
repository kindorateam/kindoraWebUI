---
name: verify
description: Run this repository's standard validation before finishing code changes, declaring a fix complete, staging, or committing. Use after changes to src/, tests, dependencies, build configuration, routes, or production assets, and whenever the user asks whether the project is clean or ready.
---

# Verify

Run the standard checks sequentially and stop at the first failure:

1. `bun run typecheck`
2. `bun run check`
3. `bun run test`
4. `git diff --check`

Run `bun run build` as an additional check when the change affects dependencies, Vite or TypeScript configuration, routing infrastructure, code splitting, CSS or other production assets, or when the user requests release readiness.

## Failure Handling

- Report the failing command and the relevant error
- Fix failures when implementation is within the task's scope
- Use `bun run fix` only when Biome can safely resolve the issue, then review the resulting diff
- Restart verification from `bun run typecheck` after changing files
- Do not hide pre-existing failures; distinguish them clearly from failures introduced by the current work

## Success Handling

Report which checks passed. Do not claim the worktree is clean without checking Git status, and do not claim end-to-end or backend integration coverage unless those flows were actually run.

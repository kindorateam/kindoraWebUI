---
name: verify
description: Run the repository's standard verification flow before finishing work or before committing. Use this skill when validating a change set, checking whether the project is clean, or confirming readiness after fixes.
---

# Verify

Run the standard verification commands in sequence and stop on the first failure:

1. `bun run typecheck`
2. `bun run check`

## Failure Handling

- Report the failing command clearly
- Summarize the relevant errors
- Fix the issues when the task calls for it
- Re-run verification from the start after changes

## Success Handling

Report success concisely once both commands pass.

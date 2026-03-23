---
name: verify
description: Run full project verification (typecheck + lint/format check). Use before marking work done or before committing.
---

Run the following checks in sequence. Stop on first failure and report the errors clearly.

1. **TypeScript type checking**: `bun run typecheck`
2. **Biome lint & format check**: `bun run check`

If either step fails:
- Show the errors clearly
- Suggest fixes for each error
- After fixing, re-run verification from the beginning

If both pass, report success concisely.

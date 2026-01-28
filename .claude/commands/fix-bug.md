# Fix a Bug

You are a bug fixer for the Kindora Web application. Follow these rules strictly.

## Input

$ARGUMENTS

## Process

### Phase 1: Understand (Think Before Coding)

- Read the bug description carefully. Ask if anything is unclear.
- State your assumptions about the root cause explicitly.
- Do NOT start fixing until you understand the problem.

### Phase 2: Reproduce & Locate

- Search the codebase to find the relevant code. Check `src/features/`, `src/routes/`, `src/services/`.
- Trace the data flow: component → hook → service → apiClient.
- Identify the exact root cause. State it clearly before proceeding.

### Phase 3: Fix (Surgical Changes)

- Touch ONLY what is necessary to fix the bug.
- Do NOT "improve" adjacent code, comments, or formatting.
- Do NOT refactor things that aren't broken.
- Match the existing code style exactly.
- If your fix creates unused imports/variables, remove only those YOUR change made unused.
- If you notice unrelated issues, mention them — don't fix them.

**The test:** Every changed line should trace directly to the bug fix.

### Phase 4: Verify

- Run `bun run typecheck` — fix all errors.
- Run `bun run check` — fix all lint/format issues.
- Summarize: what was broken, why, and what you changed.

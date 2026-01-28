# Code Review

You are a code reviewer for the Kindora Web application. Review the current changes against project standards.

## Input

$ARGUMENTS

If no specific files are mentioned, review all uncommitted changes (`git diff`).

## Review Checklist

### Architecture & Structure
- [ ] Feature code is in `src/features/{name}/` (not in `src/components/ui/`)
- [ ] Services use `apiClient` — no direct axios calls
- [ ] State management uses Jotai atoms — no direct localStorage access
- [ ] Routes are in `src/routes/` and follow file-based routing patterns
- [ ] Feature-specific code is NOT in global `src/services/` or `src/stores/`

### Code Quality (Karpathy Principles)
- [ ] **Simplicity:** No speculative abstractions, unnecessary wrappers, or over-engineering
- [ ] **Surgical:** Changes are minimal — no unrelated "improvements" or formatting changes
- [ ] **No dead code:** No unused imports, variables, or functions introduced
- [ ] **No `any` types:** Uses `unknown` with type narrowing, or proper generics

### Conventions
- [ ] Files: kebab-case. Components: PascalCase. Hooks: camelCase with `use` prefix
- [ ] Single-component modules use default export
- [ ] React types use `React.*` namespace (not separate imports)
- [ ] Functional programming preferred over classes
- [ ] HeroUI components used directly — no unnecessary wrapper components
- [ ] Imports follow Biome ordering rules

### Security
- [ ] No command injection, XSS, or SQL injection vulnerabilities
- [ ] No secrets or credentials in code
- [ ] User input is validated at system boundaries

## Output

For each issue found, report:
- **File & line:** `path/to/file.ts:42`
- **Severity:** error | warning | suggestion
- **Issue:** What's wrong
- **Fix:** What to do instead

End with a summary: total issues by severity and an overall assessment.

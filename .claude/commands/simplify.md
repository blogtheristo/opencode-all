---
name: simplify
description: Reviews changed code for simplification opportunities — duplicated logic, unnecessary complexity, dead code, security issues (OWASP top 10), and performance anti-patterns. Automatically fixes issues found. Use when user says "simplify", "clean up code", "review changes", "reduce complexity", "refactor", "code review", or after completing a feature to check quality.
---

Review and simplify recently changed code following DWS Karpathy principles: "Simplicity — actively resist overcomplication. If you build 1000 lines and 100 would suffice, you have failed."

Input: $ARGUMENTS (optional: file paths or branch to compare against, defaults to HEAD)

## Steps

1. Get the diff to review:
   - If arguments specify a branch or commit: `git diff $ARGUMENTS`
   - Default: `git diff HEAD` (staged + unstaged changes)
   - If no diff found, try `git diff HEAD~1` (last commit)

2. For each changed file, analyze for these 5 categories:

   **a. Code Reuse (DRY violations)**
   - Duplicated logic across functions or files
   - Patterns that should be extracted into shared utilities
   - Copy-pasted blocks with minor variations

   **b. Unnecessary Complexity**
   - Over-engineered abstractions (wrapper classes that add no value)
   - Deeply nested conditionals that could be flattened (guard clauses)
   - Overly generic code for a single use case
   - Complex type gymnastics where simpler types suffice

   **c. Dead Code & Unused Imports**
   - Unused imports, variables, functions, or type definitions
   - Commented-out code blocks (should be removed or restored)
   - Unreachable code paths

   **d. Security Issues (OWASP Top 10)**
   - Injection vulnerabilities (SQL, command, XSS)
   - Broken authentication or session management
   - Sensitive data exposure (hardcoded secrets, missing encryption)
   - Missing input validation or sanitization
   - `exec()` with string interpolation (use `execFile()` with arrays)
   - `origin: '*'` or `allow_origins=["*"]` in CORS config
   - Missing SRI hashes on CDN dependencies

   **e. Performance Anti-Patterns**
   - N+1 queries or unbounded loops
   - Missing pagination on list endpoints
   - Synchronous operations that should be async
   - Unnecessary re-renders in React (missing memoization keys)
   - Large objects copied when mutation or reference would suffice

3. **Fix issues automatically** — apply fixes directly to files. For each fix:
   - Prefer the simplest correct solution
   - Do not introduce new dependencies
   - Preserve existing test coverage
   - Follow project formatting rules (2 spaces, single quotes JS/TS, semicolons)

4. Report using DWS output format:
   ```
   CHANGES MADE:
   - [file]: [what changed and why]

   THINGS I DIDN'T TOUCH:
   - [file]: [intentionally left alone because...]

   POTENTIAL CONCERNS:
   - [any risks or follow-up items]
   ```

## Rules

- **Fix, don't just report.** This skill actively simplifies — it does not produce a passive report.
- **Scope discipline.** Only touch files that appear in the diff. Do not refactor unrelated code.
- **Dead code hygiene.** List any now-unused code after refactoring and ask before removing files.
- **Never delete files.** Use `git mv` if files need to move.
- **Security fixes are mandatory.** If OWASP issues are found, fix them — do not defer.
- **Preserve behavior.** Simplification must not change external behavior. If uncertain, flag it in POTENTIAL CONCERNS.

## When NOT to use

- Full regulatory compliance audit -> use `/compliance-check`
- Site safety assessment -> use `/site-safety`
- Discovering available agents -> use `/discover-agents`

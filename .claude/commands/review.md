---
name: review
description: Staff Engineer code review that finds production-breaking bugs that pass CI. Deep review of logic, security, performance, and correctness. Run after implementation, before /ship. Based on gstack by Garry Tan.
---

# Staff Engineer Code Review

**Source pin:** garrytan/gstack, no upstream VERSION marker published; state observed 2026-08-20 (see docs/field-notes/2026-08-20-external-skill-provenance-audit.md).

You are acting as a **Staff Engineer** — find the bugs that will break production but pass CI.

Input: $ARGUMENTS (branch name, file paths, or description of changes)

## Review Process

### 1. Understand the Change

- Read ALL modified files (use `git diff` or `git diff --staged`)
- Understand the intent — what problem does this solve?
- Check if tests were added/updated

### 2. Correctness Review

- Does the logic actually solve the stated problem?
- Are there off-by-one errors, race conditions, or null pointer issues?
- Are error paths handled correctly?
- Does the happy path work? Does the sad path work?

### 3. Security Review (DWS Security Standard)

- No `exec()` with string interpolation
- No `origin: '*'` CORS
- All external CDN deps have SRI hashes
- No hardcoded secrets
- Input validation on all user-facing endpoints
- RLS on new database tables
- SQL injection prevention (parameterized queries)

### 4. Performance Review

- N+1 queries?
- Unbounded loops or recursion?
- Missing indexes on queried columns?
- Large payloads without pagination?

### 5. DWS Standard Compliance

- Build for Agents: CLI + MCP + Skills exposed?
- Dual folder rule: root AND landing-pages updated?
- Store update rule: all 6 checklist items?
- Document standard: VERSION AND AGENT HISTORY block?

### 6. Code Quality

- Dead code introduced?
- Unnecessary complexity? (100 lines where 10 suffice)
- Missing type safety? (Zod schemas, TypeScript strict)
- Inconsistent patterns with existing code?

## Output Format

```
CODE REVIEW: [scope]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CRITICAL (must fix before merge):
  1. [file:line] — [issue + fix]

WARNINGS (should fix):
  1. [file:line] — [issue + suggestion]

NITS (optional improvements):
  1. [file:line] — [suggestion]

SECURITY:
  [pass/fail per check]

VERDICT: [APPROVE / REQUEST CHANGES / BLOCK]
```

## Severity Guide

- **CRITICAL**: Will break production, lose data, or create security vulnerability
- **WARNING**: Will cause bugs, poor UX, or maintenance burden
- **NIT**: Style, naming, or minor improvement

## After This Review

- If APPROVE → run `/ship` to push and create PR
- If REQUEST CHANGES → fix issues, re-run `/review`
- If BLOCK → serious architectural issue, go back to `/plan-review ROLE=eng`

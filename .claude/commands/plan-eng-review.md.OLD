---
name: plan-eng-review
description: Engineering Manager architecture review that locks data flow, diagrams, edge cases, and implementation plan before coding begins. Run after /plan-ceo-review approval. Based on gstack by Garry Tan.
---

# Engineering Manager Architecture Review

You are acting as an **Engineering Manager** — lock the architecture before any code is written.

Input: $ARGUMENTS

## Review Framework

### 1. Architecture Design
- What components are involved?
- How does data flow between them?
- Draw an ASCII diagram of the architecture

### 2. Data Model
- What tables/collections are affected?
- Schema changes needed (with migration plan)
- RLS policies required (Marcus rule: RLS on every table)

### 3. API Surface
- New endpoints/routes needed
- Request/response shapes (Zod schemas)
- Authentication requirements (JWT)

### 4. Edge Cases & Failure Modes
- What happens when the external service is down?
- What happens with bad/missing input?
- What are the concurrent access concerns?
- What are the rollback scenarios?

### 5. Integration Points
- MCP tool exposure (Build for Agents rule)
- CLI command (`dws <command>`)
- Claude Code skill (`.claude/commands/*.md`)
- Dashboard UI component

### 6. Security Review
- Input validation (express-validator)
- No `exec()` with string interpolation (use `execFile()`)
- CORS — explicit origins only
- CDN deps — SRI hashes required
- Secrets in `.env` only

### 7. Test Plan
- What deterministic logic needs unit tests?
- What integration tests are needed?
- What can be manually verified?

## Output Format

```
ENG REVIEW: [feature name]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Architecture:
  [ASCII diagram]

Data Model:
  [tables + changes]

API Surface:
  [endpoints + shapes]

Edge Cases:
  1. [case] → [handling]
  2. [case] → [handling]

Security:
  [checklist with pass/fail]

Test Plan:
  [what to test + how]

Implementation Order:
  1. [step] — [why first]
  2. [step] — [dependency]
  3. [step] — [final]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VERDICT: [APPROVED / NEEDS REVISION]
Next: Start implementation (test-first)
```

## After This Review

- If APPROVED → implement test-first (naive then optimize)
- If NEEDS REVISION → fix architecture issues, re-run
- After implementation → run `/review` for staff engineer code review

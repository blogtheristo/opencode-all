---
name: plan-review
description: gstack planning review — parameterized by ROLE. ROLE=ceo runs founder/CEO-level product review (10-star product, scope challenge, PMF). ROLE=eng runs engineering manager architecture review (data flow, schemas, edge cases, test plan). Run ROLE=ceo first; if SHIP IT, run ROLE=eng. Based on gstack by Garry Tan.
argument-hint: "ROLE=<ceo|eng> <feature description>"
parameters:
  - name: ROLE
    required: true
    enum: [ceo, eng]
  - name: FEATURE
    required: true
    note: free-form description of the feature, product, or change under review
---

# Planning Review (gstack)

**Source pin:** garrytan/gstack, no upstream VERSION marker published; state observed 2026-08-20 (see docs/field-notes/2026-08-20-external-skill-provenance-audit.md).

You are running a planning review. The `ROLE` parameter selects which lens.

**Input:** `$ARGUMENTS`

Parse `ROLE=...` from arguments. If `ROLE=ceo`, follow Section CEO. If `ROLE=eng`, follow Section ENG. If `ROLE` is missing or invalid, ask the user which role to take before proceeding.

---

## ROLE = ceo — Founder / CEO Product Review

You are acting as a **Founder/CEO reviewer** — your job is to find the 10-star product hidden in this request.

### Review Framework

**1. Problem Clarity**

- What problem are we actually solving?
- Is this the RIGHT problem to solve right now?
- Who is the customer and what do they desperately need?

**2. 10-Star Experience**

- 1-star: barely works.
- 5-star: good enough.
- 10-star: magical, delightful.
- Where on this scale is the current proposal?

**3. Scope Challenge**

- What can we cut and still deliver value?
- What's the fastest path to learning if this works?
- Are we over-engineering for day 1?

**4. Strategic Fit**

- Does this align with DWS IQ 6 platform goals?
- Does it strengthen the Brain-Memory-Body-Hands architecture?
- Is this agent-accessible (Build for Agents rule)?

**5. Decision**

- **SHIP IT** — Good to go, proceed to `/plan-review ROLE=eng`
- **RESHAPE** — Right direction, wrong scope. Suggest changes.
- **STOP** — Wrong problem or wrong time. Explain why.

### Output Format

```
CEO REVIEW: [feature name]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Problem: [1 sentence]
Customer: [who]
10-Star Vision: [what magical looks like]
Current Proposal: [X-star] — [why]
Cut List: [what to remove for v1]
Strategic Fit: [yes/no + reason]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VERDICT: [SHIP IT / RESHAPE / STOP]
Next: /plan-review ROLE=eng
```

### After CEO Review

- SHIP IT → run `/plan-review ROLE=eng` for architecture lock
- RESHAPE → iterate on scope, then re-run `/plan-review ROLE=ceo`
- STOP → document why and move on

---

## ROLE = eng — Engineering Manager Architecture Review

You are acting as an **Engineering Manager** — lock the architecture before any code is written.

### Review Framework

**1. Architecture Design**

- What components are involved?
- How does data flow between them?
- Draw an ASCII diagram of the architecture.

**2. Data Model**

- What tables/collections are affected?
- Schema changes needed (with migration plan).
- RLS policies required (Marcus rule: RLS on every table).

**3. API Surface**

- New endpoints/routes needed.
- Request/response shapes (Zod schemas).
- Authentication requirements (JWT).

**4. Edge Cases & Failure Modes**

- What happens when the external service is down?
- What happens with bad/missing input?
- What are the concurrent access concerns?
- What are the rollback scenarios?

**5. Integration Points**

- MCP tool exposure (Build for Agents rule).
- CLI command (`dws <command>`).
- Claude Code skill (`.claude/commands/*.md` or `skills/<name>/SKILL.md`).
- Dashboard UI component.

**6. Security Review**

- Input validation (express-validator / Zod).
- No `exec()` with string interpolation (use `execFile()`).
- CORS — explicit origins only.
- CDN deps — SRI hashes required.
- Secrets in `.env` only.

**7. Test Plan**

- What deterministic logic needs unit tests?
- What integration tests are needed?
- What can be manually verified?

### Output Format

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

### After ENG Review

- APPROVED → implement test-first (naive then optimize)
- NEEDS REVISION → fix architecture issues, re-run `/plan-review ROLE=eng`
- After implementation → run `/review` for staff engineer code review

---

## Latent vs Deterministic — at a glance

| Step                                    | Kind          |
| --------------------------------------- | ------------- |
| Problem framing / 10-star vision        | Latent        |
| Scope cut decisions                     | Latent        |
| Architecture diagram + edge case mining | Latent        |
| Schema diff against existing tables     | Deterministic |
| Test plan generation                    | Latent        |
| Verdict (SHIP IT / APPROVED / etc.)     | Latent        |

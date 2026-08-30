# DWS Agent-Driven SDLC Playbook

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code | Session: claude/agent-driven-dev-playbook-uduc7 | Date: 31.05.2026 | Changes: Initial creation — DWS adaptation of the Lopopolo/Gupta "6-Month to Harnessed Engineering Team" roadmap. Maps the 9 stages to existing DWS6 infrastructure (exists / gap / fix), establishes the "right thing before right way" gate, and ships the Stage-9 agent-leverage metric.

Document Status:
  - Created: 31.05.2026
  - Last Modified: 31.05.2026
  - Language: English
  - Publication Status: ACTIVE
  - Classification: INTERNAL — Engineering Process
  - Document Type: Playbook / Process Standard

Related Documents:
  - docs/field-notes/2026-05-31-agent-driven-sdlc-playbook-engineer-review.md
  - AGENTS.md
  - AI_AGENT_GUIDELINES.md
  - docs/LOCKED_DECISIONS.md
  - .claude/commands/retro.md
  - scripts/agent-leverage.mjs

---

## Purpose

This playbook adapts the "6-Month to Harnessed Engineering Team" roadmap (Ryan Lopopolo / Aakash
Gupta) to DWS6. The thesis is not "use AI to type faster." It is: **the human's job moves from
producing code to writing the rules the code must follow.** Every agent failure becomes a permanent
guardrail; guardrails compound; the slow path becomes the only path that scales.

OpenAI's framing makes the target measurable — every engineer has been handed *5 interns named
Codex, and the performance review is how well you direct them.* "How well you direct them" has a
number in this repo now: **Agent Leverage %** (Stage 9).

## Operating Principle — Right Thing *Before* Right Way

DWS6 is already rigorous at **doing things right** — write-time hooks block unsafe SQL, secrets,
public-folder `.md`, and force-pushes; CI runs dual AI review and a tamper-evident audit chain. The
gap this playbook closes is **doing the right thing first**: validating the problem and the intended
outcome *before* optimizing the implementation.

**The gate (apply before any implementation touching 3+ files or an architectural choice):**

1. **Right thing?** State the user outcome and how you'll know it worked. If there's no
   eval/journey/PRD to check against, that is the first work item — not the code.
2. **Right way?** Only after (1): minimal solution, standards, tests, security.

The mechanism already exists — `/plan` + the `architect` and `qa` skills, plus CLAUDE.md's
"Asked Twice = Failure" rule (build the guardrail, don't just patch the symptom). This playbook
makes the *first* question non-skippable for non-trivial work, and the Stage-9 metric makes the
payoff visible.

---

## Phase 1 (Months 1–2): Establish Repo Legibility

### Stage 1 — Initialize the agents.md task loop
- **Exists:** `AGENTS.md` (topology, Lifetime Scope Signals), `CLAUDE.md` (operating rules),
  `AI_AGENT_GUIDELINES.md`, `.workflows/agents/` (signal registry + coordinator CLI).
- **Gap:** no canonical `read → review → plan → implement → test` loop documented as a mandatory
  template; no per-task "right thing?" checkpoint.
- **Fix:** adopt the loop above with the Right-Thing-Before-Right-Way gate as step 0. Reuse `/plan`
  + `architect` for the review/plan legs and `qa` for the test leg.

### Stage 2 — Build a structured /docs tree
- **Exists:** `docs/architecture/` 00–10 blueprint, `docs/AGENT_TEST_STANDARD.md`, the standards
  library routed by `CLAUDE.md`.
- **Gap:** no critical-user-journey map, no performance SLOs, no feature-spec standard.
- **Fix (backlog):** add `docs/CRITICAL_USER_JOURNEYS.md` (5–7 core flows with success criteria),
  performance SLOs, and a one-page feature-spec template. Each becomes a thing agent work is
  checked *against* — i.e., the "right thing" reference.

### Stage 3 — Codify institutional knowledge
- **Exists:** `docs/LOCKED_DECISIONS.md` (ADR-grade, immutable audit index), `docs/field-notes/`,
  `DWS_TRUTH_STANDARD.md`.
- **Gap:** decisions are spread across three files; linkage is not bidirectional per agent.
- **Fix (backlog):** cross-link decisions ↔ agents so "which decisions constrain Agent-XX?" is a
  lookup. Keep `LOCKED_DECISIONS.md` as the registry.

## Phase 2 (Months 3–4): Automate and Cheapen Validation

### Stage 4 — Encode taste into CI lints
- **Exists:** `scripts/golden-principle-check.mjs` + the `.claude/hooks/` suite (`secret-scan`,
  `sql-safety-guard`, `protect-files`, `pretooluse-guard`) enforcing taste/security at write-time
  and in CI.
- **Gap:** no ESLint/Prettier *gate* (`package.json` lint is a stub); no naming/typography lints —
  the "build fails over curly quotes" discipline.
- **Fix (backlog):** add an ESLint/Prettier gate to `test-on-pr.yml`; extend golden-principle
  checks toward style/architecture rules.

### Stage 5 — Deploy AI reviewer personas
- **Exists (strong):** `architect`, `code-reviewer`, `security-reviewer` personas
  (`.claude/agents/`) + dual Claude+Gemini review with livelock prevention
  (`.github/workflows/ai-pr-review.yml`).
- **Gap:** personas are advisory, not merge-*blocking*; no dedicated Frontend-Architect / Product-PM
  persona; no persona-routing matrix by file glob.
- **Fix (backlog):** wire personas as a blocking gate; add routing (`*.tsx` → Frontend Architect,
  `supabase/*` → Security Reviewer).

### Stage 6 — Script mandatory end-to-end flows
- **Exists:** `src/__tests__/e2e/smoke.test.ts` (HTTP smoke flow) + mandatory `test-on-pr.yml`.
- **Gap:** no browser-driven Playwright E2E; E2E is not a merge gate on critical journeys.
- **Fix (backlog):** Playwright suite over the Stage-2 journeys; make pass mandatory pre-merge.

## Phase 3 (Months 5–6): Expand Contributor Leverage

### Stage 7 — Enable PM-led feature shipping
- **Exists:** a PRD template (`docs/DWS7_DATACENTRE_COMPLIANCE_PRD_v0.md`), Product Agent,
  `V1_FEATURE_LIST.md`.
- **Gap:** no eval-test harness tied to a PRD; PM review workflows are archived (`.OLD`).
- **Fix (backlog):** PRD → eval-tests → ship → metrics workflow so a PRD on Monday can ship a PR by
  Friday without an engineer typing.

### Stage 8 — Facilitate designer-driven painted-door experiments
- **Exists:** `src/agents/designer.agent.ts`, the `designer` skill.
- **Gap:** no painted-door framework, no design-approval gate, designer agent not wired to PRs.
- **Fix (backlog):** prototype → validate → code → ship flow with a design-approved label.

### Stage 9 — Track and scale Agent Leverage % — **SHIPPED**
- **Exists now:** `scripts/agent-leverage.mjs` (CLI + structured JSON), the weekly auto-runner
  `scripts/weekly/agent-leverage.sh`, output in `docs/metrics/agent-leverage.json` (+ dated
  snapshots), surfaced in `/retro`.
- **What it measures:** agent-authored share of commits and lines, paired with a defect-rate proxy
  (fix-commit ratio + unstable-file churn). The constraint is the infographic's bottom-right gauge:
  **leverage UP without defects UP.**
- **Attribution:** because `main` squashes every PR to one human committer, agent share leans on the
  `claude.ai/code/session_` commit trailer, `Co-authored-by` agent lines, and `claude/*` branch
  hints — never on author identity. PR-accurate enrichment is available via GitHub MCP
  `list_pull_requests` (head branch + additions/deletions) and is documented in the script.

```bash
node scripts/agent-leverage.mjs --since "7 days ago"   # writes docs/metrics/agent-leverage.json
```

---

## Scorecard

| Stage | Status | Primary artifact |
| --- | --- | --- |
| 1 Task loop | Partial | AGENTS.md, this playbook's gate |
| 2 /docs tree | Partial | docs/architecture/ |
| 3 Institutional knowledge | Strong | docs/LOCKED_DECISIONS.md |
| 4 CI taste lints | Partial | scripts/golden-principle-check.mjs |
| 5 Reviewer personas | Strong | .claude/agents/ + ai-pr-review.yml |
| 6 Mandatory E2E | Weak | smoke.test.ts |
| 7 PM-led shipping | Weak | DWS7_..._PRD_v0.md |
| 8 Designer painted-door | Weak | designer.agent.ts |
| 9 Agent leverage % | **Shipped** | scripts/agent-leverage.mjs |

DWS6 sits ~50–60% through the playbook: strong on *doing it right*, instrumented (as of this
document) to prove whether *doing the right thing first* is compounding.

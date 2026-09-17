# Engineer Review: 6-Month Agent-Driven SDLC Playbook vs. DWS6

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code | Session: claude/agent-driven-dev-playbook-uduc7 | Date: 31.05.2026 | Changes: Initial field note — engineer review of the Lopopolo/Gupta "6-Month to Harnessed Engineering Team" infographic against DWS6. Answers what's missing, what's done right, and whether DWS agents do the right thing before doing it right. Triggered shipping the Stage-9 agent-leverage metric.

Document Status:
  - Created: 31.05.2026
  - Last Modified: 31.05.2026
  - Language: English
  - Publication Status: ACTIVE
  - Document Type: Field Note / Engineering Review

Related Documents:
  - docs/AGENT_DRIVEN_SDLC_PLAYBOOK.md
  - AGENTS.md
  - scripts/agent-leverage.mjs
  - .claude/commands/retro.md

---

## Summary

Two artifacts under review: the Lopopolo/Gupta infographic "6 Month to Harnessed Engineering Team"
(9 stages across 3 phases) and the field note on Ryan Lopopolo's team that built a million-line app
with **zero human-typed lines**. The lead banned the keyboard. When the agent erred, engineers built
a guardrail that prevents *that class* of mistake forever, then reran. Month one was 10x slower on
purpose. Then compounding hit: a PM shipped a merged PR Friday from a Monday PRD; a designer
prototyped UI; a 60-hour, 350M-token refactor ran on two prompts.

OpenAI's reframing makes the point operational: every engineer now has **5 interns named Codex**, and
the performance review is *how well you direct them*. This review answers three questions about DWS6
and ships the one metric that turns "how well you direct them" into a number.

**Ontology Tags**
- Geography: Global
- Sector: Software_Engineering > Agentic_SDLC
- Entities: Ryan Lopopolo, Aakash Gupta, OpenAI Codex, DWS6, Claude Code
- Temporal Context: 2026-Q2
- Confidence: High

---

## 2. What is done RIGHT in DWS6

DWS already lives the playbook's core ethos. CLAUDE.md's **"Asked Twice = Failure"** rule *is*
Ryan's "build a guardrail that prevents the mistake forever" — codified, not aspirational.

- **Stage 5 (reviewer personas) — strong.** `architect`, `code-reviewer`, `security-reviewer`
  personas in `.claude/agents/`, plus dual Claude+Gemini PR review with livelock prevention
  (`.github/workflows/ai-pr-review.yml`).
- **Stage 4 (taste in CI) — partial-strong.** `scripts/golden-principle-check.mjs` + write-time hook
  suite (`secret-scan`, `sql-safety-guard`, `protect-files`, `pretooluse-guard`) block secrets,
  unsafe SQL, public-folder `.md`, and force-pushes *before* code is written.
- **Stage 3 (institutional knowledge) — strong.** `docs/LOCKED_DECISIONS.md` (immutable ADR-grade
  index), `docs/field-notes/`, `DWS_TRUTH_STANDARD.md`.
- **Stage 2 (docs tree) — partial.** `docs/architecture/` 00–10 blueprint, `AGENT_TEST_STANDARD.md`.
- **Beyond the playbook:** a tamper-evident, hash-chained CI audit (`.ci-audit/`) at EU AI Act
  Art. 12 grade, and a working learning loop (`/retro` + `/learn`) — the guardrail-compounding
  engine the field note describes.

## 1. What is MISSING

- **Stage 1:** no canonical `read→review→plan→implement→test` loop with a "right thing?" checkpoint.
- **Stage 2:** no critical-user-journey map, no performance SLOs, no feature-spec standard — nothing
  for agent work to be checked *against*.
- **Stage 5:** personas are advisory, not merge-*blocking*; no Frontend-Architect / Product-PM
  persona; no file-glob routing matrix.
- **Stage 6:** only an HTTP smoke test (`src/__tests__/e2e/smoke.test.ts`); no Playwright E2E gate.
- **Stage 7:** PRD template exists but no eval-test harness; PM workflows archived (`.OLD`).
- **Stage 8:** `designer.agent.ts` exists but no painted-door flow / design-approval gate.
- **Stage 9:** *no agent-leverage % / defect-rate metric* — DWS could not see whether its leverage
  was rising or whether quality was holding. **Fixed in this session (see below).**

## 3. Do DWS agents do the RIGHT THING before doing it RIGHT?

**Partially — and that is the central finding.** DWS enforces *doing it right* rigorously and
automatically (hooks at write-time, standards, audit chain). But *doing the right thing first* —
validating the problem and intended outcome before optimizing the solution — is only **advisory**:
`/plan`, `architect`, and `qa` are opt-in; there is no journey map, eval, or PRD gate to check work
against; and there was **no metric** to tell whether agent effort produced *outcomes* or merely
*volume*.

The playbook's whole thesis (month-1 slower on purpose, every failure → permanent guardrail) is the
right-thing-first discipline. DWS already owns the *mechanism* (Asked-Twice=Failure, `/learn`). What
it lacked was the *measurement*. You cannot manage "how well you direct your 5 Codex interns" if you
never count it.

## The Fix (shipped this session)

Stage 9 instrumented — `scripts/agent-leverage.mjs`:

- **Agent Leverage %** — agent-authored share of commits and lines, attributed via the
  `claude.ai/code/session_` trailer, `Co-authored-by` agent lines, and `claude/*` branch hints
  (author identity is useless on a squash-to-`main` repo).
- **Defect rate proxy** — fix-commit ratio + unstable-file churn. The verdict bands enforce the
  infographic's constraint: **leverage UP without defects UP.**
- Structured JSON to `docs/metrics/agent-leverage.json` (+ dated snapshots), weekly auto-run via
  `scripts/weekly/agent-leverage.sh`, surfaced in `/retro`. First run on this branch:
  ~60% agent-authored by commits / ~78% by lines at 0% defect rate.

The canonical roadmap, with each stage's exists/gap/fix and the right-thing-first gate, now lives in
`docs/AGENT_DRIVEN_SDLC_PLAYBOOK.md`.

## The Insight

DWS built the hard half first — the guardrails, the audit chain, the reviewer personas, the
learning loop. What it had not done was *make leverage legible*. Ryan's team learned that the slow
path (build the guardrail, don't type the fix) is the only path that scales — but they could only
trust that because they could watch a PM ship by Friday. The agent-leverage metric is DWS's version
of that visible payoff: the dial that tells you whether writing rules for the interns is beating
typing the code yourself.

## Next Steps

1. Run `node scripts/agent-leverage.mjs` weekly (now automatic) and review in `/retro`.
2. Work the Stage-2 backlog (journeys + SLOs + feature-spec) so the right-thing-first gate has
   references to check against.
3. Re-evaluate Stage 5 (blocking personas) and Stage 6 (Playwright gate) next.

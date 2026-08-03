# Agent Factory + SageRoute — Research, Audit, Adoption Decision

**Date:** August 3, 2026
**Owner:** Lifetime Oy
**Status:** ✅ Decided and shipped — REJECT adoption as-is; ADAPT shipped as `src/factory/`
**Session:** `claude/agent-factory-research-audit-l6hks2`
**Subjects:** av1dlive "Agent Factory" thread (x.com/av1dlive/status/2082505465569910850) + [codejunkie99/sageroute](https://github.com/codejunkie99/sageroute)

---

## 1. What was audited

Two artifacts referred by the HIC:

1. **The "Agent Factory"** — a viral X build-guide by @Av1dlive: an A–Z agent
   stack where an advisor/orchestrator decomposes work, implementer subagents
   write every line of shipped code, a reviewer subagent gates it, plus a swarm
   layer, a verification gate, and an intelligent model router in front.
2. **SageRoute** — the companion router repo. An OpenAI-compatible proxy
   (TypeScript/Bun, MIT, 72★) that starts every task on a cheap model, watches
   trajectory evidence (tool calls, error classes, loops, stalls), and escalates
   to a stronger model only when the evidence shows the agent is struggling.
   Routing verdicts come from an external service: **Levanto Labs' Sage API**
   (`sage.levanto.ai`, `POST /decide`, calibrated-probability answers).

The repo was cloned and read at source level (commit history through
2026-07-28); the Levanto site, README, SECURITY.md, and the decision/evidence/
oauth modules were reviewed.

## 2. Audit findings

### Clean

- **Supply chain:** zero runtime dependencies; devDeps are only `typescript` +
  `@types/bun`. No postinstall hooks. All `curl` in scripts targets
  `127.0.0.1` health checks. Only outbound hosts in `src/` are official
  provider APIs + `sage.levanto.ai`. No exfiltration patterns found.
- **Engineering quality:** genuinely good. Deterministic detectors (identical
  action/observation 3×, repeated error class 3×, ping-pong 4×,
  rewrite-retest cycles, steps-since-progress) fire *before* any model is
  consulted — Rule 5 done right. Guardrails are sound: budget stop before any
  call, capability-before-retry, asymmetric hysteresis, one-way ladder
  (cheap → strong → restart → human), fail-open when Sage is down. 180 tests.
- **Data minimization is real in code:** `src/core/evidence.ts` +
  `signals.ts` send Sage a rendered evidence string — task statement capped at
  600 chars, per-step `tool(args→40 chars)->ok/errorClass` lines, one
  220-char last-error preview, SHA-256 digests. Chain-of-thought is
  deliberately excluded. (The README's phrasing "tool outputs themselves are
  sent" overstates it; SECURITY.md and the code agree on bounded previews.)

### Red flags — why not to deploy it in DWS

1. **Third-party data egress to an unknown vendor.** Every routing decision
   ships task text fragments, tool-arg fragments, and error text to Levanto
   Labs — a startup with no discoverable team, DPA, GDPR posture, retention
   policy, or EU hosting statement (levanto.ai blocks crawlers; docs give no
   compliance page). 220 chars of a tool arg or error body is routinely enough
   to leak a path, a hostname, a schema, or a secret. Directly conflicts with
   DWS sovereignty positioning (`/sovereignty-assess`, EU-only routing rule in
   `/ollama-spark`) and the Secret Egress Rules in `CLAUDE.md`.
2. **First-party client impersonation.** `src/oauth/anthropic.ts` hardcodes
   Claude Code's OAuth client ID (`9d1c250a-e61b-44d9-88ed-5944d1962f5e`);
   `src/oauth/openai.ts` hardcodes Codex CLI's (`app_EMoamEEZ73f0CkXaXp7hrann`)
   and calls `chatgpt.com/backend-api/codex`. Routing Claude Pro/Max or
   ChatGPT subscription quota through a third-party proxy this way is a
   provider-ToS violation and an account-suspension risk on the exact accounts
   Lifetime's production work runs on. The README's own "users are responsible
   for subscription compliance" concedes this.
3. **Maturity.** Entire codebase written in two days (2026-07-27/28) by one
   author, largely agent-generated. The README itself: one observed live
   escalation, thresholds untuned, no benchmark of aggregate cost savings,
   multi-replica state unproven. Single point of failure: the product's core
   claim (calibrated verdicts) lives entirely in Levanto's closed API.

### Agent Factory pattern itself

DWS already implements it natively: `architect` → implementer →
`code-reviewer` subagents, `/plan-review` (CEO/eng gates), `/qa` verification
gate, `/goal` done-conditions, `/swarm` (six orchestration patterns),
AgentFoundry, and Rule 6 token budgets. The thread is good pedagogy, not new
capability for this repo. Nothing to adopt there.

## 3. Decision

**REJECT** SageRoute for deployment (Levanto egress + OAuth impersonation +
maturity). **ADAPT** two pieces, both MIT-licensed and dependency-free:

1. **Trajectory detectors + escalation ladder, minus Levanto.** The
   deterministic detectors and the guardrail policy are ~4 small files
   (`evidence.ts`, `signals.ts`, `policy.ts`, `session.ts`) with a built-in
   `OfflineSageClient` heuristic that replaces the cloud verdict entirely.
   Lifted into the DWS router path (e.g. `/ollama-spark` or a `dws route`
   CLI), this gives evidence-based cheap→strong escalation with **zero
   external egress** — EU-sovereign by construction, and directly serves
   Rule 6 (budgets) and the KYA leash model (escalate-to-human rung).
2. **The evidence-rendering idea** (compact `key=value` signal report per
   session) as the standard input for any future DWS routing/KYA scoring —
   it is exactly the "reduce to what the agent DID" discipline Rule 5 asks for.

Not adapted: subscription OAuth adoption (ToS risk), Sage API dependency
(sovereignty), the proxy-in-front-of-Claude-Code deployment mode (adds a
mid-path component with our API keys for unproven savings).

## 4. HIC Learning Outcome (six-step record)

1. **KB update:** done — concept article
   `kb/wiki/concepts/decision-layer-egress-channel.md` (index regeneration
   happens at the next `dws kb compile`, per the auto-maintained index rule).
2. **Field note:** this file.
3. **Learn/ HTML:** done — pandoc installed in-session;
   `Learn/field-note-agent-factory-sageroute-audit_v1.1.html` (+ `.docx`) and
   thesis lockstep renders `Learn/V3Thesis_{EN,FI}_v3.97.html` (+ `.docx`).
4. **Drive export:** done — Google Doc "2026-08-03 Agent Factory + SageRoute —
   Audit & DWS Factory Router (field note v1.2)", id
   `1ITjNCV-NOpOrc18Ic7MLgAg5LGrOKWQjk8OsHC8oDlc`; repo file remains
   source-of-truth.
5. **HIC question:** asked and answered across two turns — adapt-vs-park
   (answered "Yes if it makes dws factory") and the wiring-target question in
   the session's closing message.
6. **Calendar:** N/A — no dated commitment produced; threshold tuning is
   gated on wiring the router into a live checkpoint path, not on a date.

## 5. Implementation record (HIC approved 2026-08-03: "Yes if it makes dws factory")

Shipped in the same session as the **DWS Factory Router**:

- `src/factory/{types,evidence,detectors,ladder,index}.ts` — trajectory
  recovery for both Anthropic Messages and OpenAI Responses wires,
  deterministic detectors, and the guarded escalation ladder. The Levanto call
  is replaced by the transparent additive heuristic
  (`interventionProbability` + `actionProbabilities`); no network, no egress.
- `scripts/factory-route.ts` + `npm run factory:route` — CLI with structured
  JSON output and verdict exit codes (0/2/3/4), per the Agent Productization
  Rule.
- `skills/factory-route/SKILL.md` + `skills/manifest.json` entry + regenerated
  `docs/DWS_SKILLS_GUIDE.md` matrix row.
- `src/__tests__/factory-router.test.ts` — 15 tests asserting intent (loop
  kinds, thrash counting, gate calibration, hysteresis, one-way ladder,
  budget hard stop, switch/restart exhaustion). `tsc --noEmit` clean.
- MIT attribution to codejunkie99/sageroute carried in every adapted file
  header. Not ported (deliberately): the proxy server, subscription OAuth /
  first-party client impersonation, and the Sage API client.

***

VERSION AND AGENT HISTORY

***

- v1.0 (2026-08-03) — Initial research, source-level audit, and adoption
  decision. Agent session `claude/agent-factory-research-audit-l6hks2`.
- v1.1 (2026-08-03) — HIC approved the adapt path; DWS Factory Router shipped
  (`src/factory/`, CLI, skill, tests). Same session.
- v1.2 (2026-08-03) — Propagation on HIC instruction: Admin Manual v3.12
  runbook section; thesis lockstep 3.96→3.97 (V3Thesis §10.28 EN/FI
  implementation evidence; PHD_FIREHORSE §14.47 / Key Contribution #52 EN/FI —
  the Decision-Layer Egress Channel); KB concept
  `decision-layer-egress-channel`; Learn/ HTML renders; Drive export. Same
  session.

***

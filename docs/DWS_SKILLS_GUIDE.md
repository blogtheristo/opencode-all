# DWS Skills & Commands Complete Guide

---

# VERSION AND AGENT HISTORY

Version: 1.17

Sessions & Modifications:

- Version: 1.17 | Agent: Claude Code | Date: 06.07.2026 | Session: claude/agent-swarm-architecture-zPf5Z | Changes: Added `/swarm` slash command (section 4.5) — one parameterized agent-swarm operator (PATTERN=classify-and-act|fan-out-and-synthesize|adversarial-verification|generate-and-filter|tournament|loop-until-done) that operationalizes `docs/AGENT_SWARM_ARCHITECTURE.md`. Bumped count from 38 to 39 slash commands (52 artifacts). Added Quick Reference row.
- Version: 1.16 | Agent: Claude Code (Sonnet 5) | Date: 01.07.2026 | Session: claude/gtm-skills-planning-7ui3kd | Changes: Unblocked `/regulatory-radar` (section 5.2a) as a thin wrapper over the existing `compliance` agent — scores deadline urgency for the 5 already-tracked regulations (fit-for-55, ets, cbam, csrd, eu-ai-act) without waiting on new EUR-Lex/DG ENER ingestion. Moved from `slash-deferred` to `slash-cli` in `skills/manifest.json` and regenerated the compatibility matrix via `scripts/skill-manifest-sync.mjs --write-guide`. The datacentre-compliance-vertical-specific EED radar feature stays gated behind PRD Gate 1 (3 signed design-partner letters, target 1 Oct 2026) — this wrapper only covers the general deadline-scoring capability, not that vertical build. No count change (still 38 slash + 3 discipline); status change only.
- Version: 1.15 | Agent: Claude Code (Opus 4.8) | Date: 28.06.2026 | Session: claude/consultant-handbook-v1-6-622fep | Changes: Added `/dialog` slash command (section 8.1b) — line-by-line HIC-confirmed document update method (propose `muutos;` Nykyinen→Muutos, human replies agree/counter, apply + checkpoint per item). Codified from the Konsultoinnin käsikirja §1–§16 fact-check pass per the Skill Codification Rule. Includes customer-adaptation mode (offer reuse, e.g. ORK→Kemira). Bumped count from 37 to 38 slash commands.
- Version: 1.14 | Agent: Claude Code | Date: 24.06.2026 | Session: claude/code-coaching-curriculum | Changes: Added `/coaching` slash command (section 6.8) — scaffolds a Claude Code Coaching engagement (agenda, pre-work, EU AI Act Article 4 literacy record) parameterized by CLIENT/FORMAT/LANG from the canonical curriculum in `docs/coaching/`. Bumped count from 36 to 37 slash commands (51 artifacts). Added Quick Reference row. Backs the Claude Code Coaching store product.
- Version: 1.13 | Agent: GitHub Copilot CLI (GPT-5.4) | Date: 19.06.2026 | Session: copilot/skills-surface-manifest-6c0b226c | Changes: Added `skills/manifest.json` as the canonical skills registry, wired sync/verification tooling (`scripts/skill-manifest-sync.mjs`), introduced the generated surface compatibility matrix and Antigravity scope section, shortened bloated slash-command descriptions to fit prompt-budget limits, and aligned `/dream-on` with the repo's cross-surface verification rule.
- Version: 1.12 | Agent: GitHub Copilot CLI (GPT-5.4) | Date: 19.06.2026 | Session: copilot/skills-guide-latest-6c0b226c | Changes: Reconciled the guide with the live repository inventory: updated active counts to 36 slash commands and 14 active skill directories, documented `/qa`, `/cron`, and `/designer`, expanded Quick Reference coverage, and clarified the current `skills/` structure (`RESOLVER.md`, active packs, and `_OLD` archives).

- Version: 1.11 | Agent: Claude Code (Opus 4.8) | Date: 09.06.2026 | Session: claude/truth-claims-lint | Changes: Added `/truth-check` slash command (section 7.3) — lints public copy against the canonical truth registry (`scripts/lint-truth-claims.mjs`; FAIL on deprecated phrases, WARN on ambiguous-without-context, approved allow-list). Bumped count from 35 to 36 (33 slash + 3 discipline). Added Quick Reference row. Operationalises `DWS_TRUTH_STANDARD.md` §5/§7/§8.
- Version: 1.10 | Agent: Claude Code (Opus 4.7) | Date: 22.05.2026 | Session: claude/audit-dws-firehorse-fDKB5 | Changes: Post-merge reconciliation against main — folded in `/clawdbot` (section 3.7), `/promote-proposal` (3.8), `/dream-on` (3.9), and `/gcr-skill` (6.1b) introduced in `1abd4eaa docs: migrate Cloud Run deploy auth to GitHub OIDC`. Bumped count from 31 to 35 (32 slash + 3 discipline). Added Quick Reference rows for the four new skills. No content lost on either side.
- Version: 1.9 | Agent: Claude Code (Opus 4.7) | Date: 12.05.2026 | Session: claude/audit-dws-firehorse-fDKB5 | Changes: Added `/learn` slash command (section 3.6) — closes the learning loop by diarizing mediocre retro / CI / audit-log outcomes and emitting read-only skill-edit plans to `docs/learning-loops/`. Bumped count from 30 to 31 (28 slash + 3 discipline). Added Quick Reference row. Linked from `CLAUDE.md` Skill Codification Rule.
- Version: 1.8 | Agent: Claude Code (Opus 4.7) | Date: 12.05.2026 | Session: claude/audit-dws-firehorse-fDKB5 | Changes: Applied "thin harness, fat skills" doctrine (Garry Tan, May 2026). Collapsed `plan-ceo-review` + `plan-eng-review` into parameterized `/plan-review ROLE=<ceo|eng>` (section 3.1, renumbered 3.2–3.5); collapsed 4 `firehorse-report-{annual,board-pack,carbon,compliance}` discipline skills into one parameterized `firehorse-report KIND=<annual|board-pack|carbon|compliance>` (`skills/firehorse-report/SKILL.md`); old files renamed to `_OLD` per CLAUDE.md rule 6. Total: 31 → 30 (27 slash + 3 discipline). Added section 13 "Skill Codification Doctrine".
- Version: 1.7 | Agent: Claude Code (Sonnet 4.6) | Date: 08.05.2026 | Session: claude/improve-dws-case-handling-4VhRu | Changes: Added /case-run skill (section 4.3) — Themis as Case Coordinator dispatching specialist agents per case type; updated totals from 30 to 31 skills (28 slash + 3 discipline); added Quick Reference row; updated Themis agent to v2.0 with case-coordinate action.
- Version: 1.6 | Agent: Codex 5.3 | Date: 29.04.2026 | Session: n/a | Changes: Added new slash skill `/fix-dual-folder-api-connectivity` for API endpoint drift incidents across root/landing mirror folders; updated totals from 29 to 30 skills (27 slash + 3 discipline); added Operations section entry and Quick Reference row.
- Version: 1.5 | Agent: Claude Code (Opus 4.7) | Date: 22.04.2026 | Session: claude/github-version-compatibility-uTOO7 | Changes: Post-merge reconciliation — after merging main (PRs #1152 axios, #1153 Grok removal, #1156 npm audit, #1161 ollama-spark) the true skill count is 29 (26 slash + 3 discipline). Updated count line accordingly. No new content; fixes inconsistency introduced because /gh-to-mcp (v1.4) and /ollama-spark landed in parallel.
- Version: 1.4 | Agent: Claude Code (Opus 4.7) | Date: 22.04.2026 | Session: claude/github-version-compatibility-uTOO7 | Changes: Added /gh-to-mcp skill (section 6.1a) — translates gh CLI commands to GitHub MCP tool calls and clarifies that gh and MCP are independently versioned; updated skill count from 24 to 25; added Quick Reference row; added docs/GITHUB_CLI_VS_MCP.md reference.
- Version: 1.3 | Agent: Claude Code (Opus 4.7) | Date: 18.04.2026 | Session: claude/green-energy-roadmap-pEPPK | Changes: Added /regulatory-radar skill (section 5.2a) — EU regulatory pipeline scanner scoring upcoming instruments per customer; updated skill count from 23 to 24; added Quick Reference row. Skill spec only — agent implementation deferred until datacentre-compliance PRD Gate 1.
- Version: 1.2 | Agent: Claude Code (Sonnet 4.6) | Date: 17.04.2026 | Session: claude/restore-language-bar-xH99X | Changes: Added /multilingual skill (section 8.2); updated skill count from 22 to 23; added row to Quick Reference; renamed section 8 to "Code Quality & Internationalisation".
- Version: 1.1 | Agent: Claude Code (Opus 4.6) | Date: 10.04.2026 | Session: claude/connect-kya-dws-cli-0MMIB | Changes: Added /kya and /kb slash commands to sections 7.1 and 7.2 (new "Runtime Safety & Knowledge" section); renumbered following sections; updated skill count from 20 to 22; added /kya and /kb rows to Quick Reference.
- Version: 1.0 | Agent: Claude Code (Opus 4.6) | Date: 21.03.2026 | Session: claude/research-superpowers-dws-AWAYB

Document Status:

- Created: 2026-03-21
- Last Modified: 01.07.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE

---

## 1. Overview

DWS IQ 6 currently exposes **52 live skill artifacts** for AI coding agents — **38 active slash command wrappers** in `.claude/commands/` and **14 active skill directories** in `skills/`. Of the `skills/` directories, **3** are auto-enforced discipline gates and **11** are specialist skill packs. `skills/RESOLVER.md` is the local dispatcher, and `*_OLD` entries preserve archived variants. This guide explains the operator-facing skills, the hard gates, and how the layers connect into workflows.

**Canonical registry:** `skills/manifest.json` is the machine-readable source of truth for skill status, visibility, transport, and surface support. Use `node scripts/skill-manifest-sync.mjs --check` to verify that this guide, `.claude/commands/`, `skills/`, and `.antigravity/agents/` stay aligned.

**Skill shape:** Skills are parameterized procedures (method calls), not domain-specific scripts. The same `SKILL.md` is invoked with different arguments (ROLE, KIND, TARGET) to produce different capabilities. See section 13 for the Skill Codification Doctrine.

**Audience:** Human-in-the-loop (HIL) operators, developers using Claude Code, Cursor, or VS Code with DWS6.

**Key principle:** Skills are discoverable, composable, and enforced. They follow the superpowers pattern — short, specific, non-negotiable rules that survive context window pressure.

## 2. Skill Types

Counts below reflect the live repository state on **19.06.2026** and are reconciled against `skills/manifest.json`.

| Type                   | Location                                                            | Invocation                           | Purpose                                      |
| ---------------------- | ------------------------------------------------------------------- | ------------------------------------ | -------------------------------------------- |
| Slash commands         | `.claude/commands/*.md`                                             | `/skill-name` in Claude Code         | User-triggered workflows                     |
| Discipline gates       | `skills/{verification-gate,design-first,dual-folder-sync}/SKILL.md` | Auto-loaded by context               | Hard gates and process rules                 |
| Specialist skill packs | `skills/*/SKILL.md`                                                 | Loaded by skill reference or context | Domain knowledge, orchestration, maintenance |
| Resolver               | `skills/RESOLVER.md`                                                | Internal dispatch                    | Maps triggers to the right `SKILL.md`        |
| Archived variants      | `.claude/commands/*.OLD`, `skills/*_OLD/`                           | Historical only                      | Retained superseded skill definitions        |

**Slash commands** are interactive — the user triggers them with `/command`. They produce structured output.

**Discipline skills** are passive — agents discover and follow them automatically when relevant context is detected. They enforce process discipline.

**Specialist skill packs** currently present in `skills/`: `clawdbot`, `compliance`, `cron`, `dream-on`, `firehorse-report`, `loop`, `material-oracle`, `promote-proposal`, `risto`, `sitesense`, `skill-cleaner`.

## 3. gstack Development Workflow (Garry Tan)

The recommended development flow chains 7 skills in order. Based on Garry Tan's gstack methodology.

### Recommended Flow: plan > qa > review > ship > retro

### 3.1 /plan-review

**Parameterized by `ROLE`.** One skill, two lenses — `ROLE=ceo` runs the product review, `ROLE=eng` runs the architecture review. Run `ROLE=ceo` first; on SHIP IT, run `ROLE=eng`.

#### `/plan-review ROLE=ceo`

**When to use:** Starting a new feature, product, or major change.

**What it does:** Founder/CEO-level product review. Challenges scope, finds the "10-star product" hidden in the request, pressure-tests product-market fit. Asks "are we building the RIGHT thing?"

**Trigger phrases:** "new feature", "should we build", "product direction", "is this the right thing"

**Output:** SHIP IT / RESHAPE / STOP decision with rationale.

#### `/plan-review ROLE=eng`

**When to use:** After CEO approval (SHIP IT), before writing any code.

**What it does:** Engineering Manager architecture review. Locks data flow, diagrams, edge cases, test plan. Asks "are we building it the RIGHT WAY?"

**Trigger phrases:** "architecture review", "how should we build", "technical design", "system design"

**Output:** Locked implementation plan with data flow, API contracts, edge cases, and test strategy.

### 3.1a /qa

**When to use:** After `/plan-review ROLE=eng` locks the scope, before `/review` or any ship call. Use it when you need proof against acceptance criteria rather than a general engineering critique.

**What it does:** QA Lead workflow. Turns the plan into acceptance checks, runs the right tests and user flows, distinguishes product bugs from environment noise, and returns a `PASS | FAIL | BLOCKED` verdict with explicit coverage gaps.

**Trigger phrases:** "run QA", "acceptance checks", "test this flow", "prove this works", "verify before review"

**Composes with:** `/plan-review ROLE=eng` -> `/qa` -> `/review`. For UI work, `/qa` often pairs with `/browse`.

### 3.2 /review

**When to use:** After implementation, before shipping.

**What it does:** Staff Engineer deep code review. Finds production-breaking bugs that would pass CI. Reviews logic, security (DWS Security Standard), performance, and correctness.

**Trigger phrases:** "review my code", "code review", "check for bugs", "is this safe to ship"

**Checklist:**

- Correctness: logic errors, off-by-one, race conditions, null pointers
- Security: no exec() with string interpolation, no CORS wildcards, SRI hashes on CDN deps
- Performance: N+1 queries, memory leaks, unnecessary re-renders
- DWS compliance: dual-folder sync, document standard, store format

### 3.3 /ship

**When to use:** After /review approval.

**What it does:** Release Engineer automated shipping. Syncs branch, runs tests, commits, pushes, and creates PR. Handles the entire release pipeline.

**Trigger phrases:** "ship it", "create PR", "push and release", "deploy this"

**Flow:** git pull > npm test > npm run build > git commit > git push > gh pr create

### 3.4 /browse

**When to use:** QA verification of UI changes, testing user flows, taking screenshots.

**What it does:** QA Engineer browser automation using agent-browser (Rust CDP). Navigates URLs, takes screenshots, verifies UI elements, tests user flows.

**Trigger phrases:** "check the site", "take a screenshot", "verify the UI", "test the page", "browse to"

### 3.5 /retro

**When to use:** Weekly (Fridays) or at end of a feature.

**What it does:** Engineering Manager weekly retrospective. Analyzes commits, velocity, work patterns, shipping cadence. Provides recommendations for improvement.

**Trigger phrases:** "weekly retro", "what did we ship", "velocity report", "how did the week go"

**Output:** Commits analyzed, velocity metrics, work pattern insights, shipping cadence, recommendations.

### 3.6 /learn

**When to use:** After `/retro`, weekly, or at the end of a feature. Closes the learning loop.

**What it does:** Reads recent retros, commit churn, `.claude/hooks/audit/*.log`, and CI failure logs; classifies events into FAILURE / MEDIOCRE / OK / GOOD; **focuses on MEDIOCRE** (Tan's "OK but not great" cases); extracts the missing rule from each cluster of 3+ related mediocre events; proposes unified-diff edits against the right `SKILL.md`, `CLAUDE.md`, or `AI_AGENT_GUIDELINES.md`. **Read-only** — emits a plan to `docs/learning-loops/<DATE>-<SCOPE>.md`; a human applies approved edits in a follow-up `learn: <scope> rule updates` commit.

**Trigger phrases:** "learn from this week", "what should we codify", "skill update proposals", "retro to rules", "feed retro into skills", "close the learning loop", "what rules did we discover"

**Parameters:** `SCOPE=<last-day|last-week|last-feature|last-N|YYYY-MM-DD..YYYY-MM-DD>`, optional `TARGET=<skill-name|all>`.

**Output:** Path to generated plan, count of proposed edits per target, top 3 highest-confidence rules.

**Discipline:** Never auto-applies edits. Never proposes a rule from <3 supporting events. Skipped FAILURE events (those already trigger hook blocks). Cross-references `CLAUDE.md` Skill Codification Rule and `AI_AGENT_GUIDELINES.md` §10.

### 3.7 /clawdbot

**When to use:** When you want to know what unfinished work was left across past Claude Code sessions, or want to resume a previous session's work in a new HIL-approved run.

**What it does:** Internal session janitor. Scans `~/.claude/projects/-home-user-dws6/*.jsonl` transcripts, digests each into an "original ask + last user message + last assistant signal + pending TodoWrite items + files touched + branch" record, and writes one Markdown plan per session with pending work to `.claude/clawdbot/queue/<short-id>.md`. Subcommands: `scan`, `list`, `status`, `next`, `preview <id>`, `enrich <id>`, `dismiss <id>`, `done <id>`, `dream-prune`, `dream-curate`, `dream-propose`. The `next` flow is HIL-gated — it summarizes the top queue item and asks whether to resume here, copy the plan for a fresh session, or dismiss. `preview` classifies the trust zone (GREEN/YELLOW/RED) of every file the session touched. `enrich` runs an LLM pass via `ollama-spark` (EU-local DGX) to append a structured `{summary, proposed_next, blockers, risk_notes}` digest to the queue file. The three `dream-*` modes plus `/promote-proposal` are branded collectively as **Firehorse Dreaming** — the local, EU-on-prem analog of Anthropic's managed `POST /v1/dreams` primitive (2026-04-21 beta). `dream-prune` (pure grep) flags zero-hit skills as archival candidates, `dream-curate` (LLM) clusters recurring corrections into memory notes + CLAUDE.md edit proposals, `dream-propose` (LLM) drafts candidate new skills when pending sessions cluster. All dream output lands in `.claude/clawdbot/proposals/` for HIL review — nothing auto-applies. Daily scheduler hook at `scripts/daily/clawdbot-digest.sh`. See `.claude/clawdbot/memory/clawdbot-architecture.md` for the Anthropic Dreams convergence table.

**Trigger phrases:** "clawdbot", "session janitor", "what did I leave unfinished", "resume past session", "continue where we left off", "scan old sessions", "queue follow-up work"

**Output:** Queue files at `.claude/clawdbot/queue/<id>.md`, JSON status/list output, state in `.claude/clawdbot/state.json`.

### 3.8 /promote-proposal

**When to use:** After `/clawdbot dream-curate`, `dream-propose`, or `dream-prune` has written a proposal under `.claude/clawdbot/proposals/`, when you want to actually apply the changes to the repository. Closes the dream cycle.

**What it does:** Reads a proposal file (or `--next` to auto-pick the newest unpromoted one), detects its kind (`curate-`, `skill-`, `archival-`), builds a per-item checklist, and walks each one through an `AskUserQuestion` HIL gate before applying. Curation items become memory notes + CLAUDE.md edits + queue mark-dones; skill candidates become real `skills/<name>/SKILL.md` + `.claude/commands/<name>.md` + skills-guide entries; archival items become `git mv skills/<name> skills/<name>_OLD` (per CLAUDE.md no-rm rule). After the loop, prepends `STATUS: PROMOTED <date>` to the proposal — proposal files are kept as historical record, never deleted.

**Trigger phrases:** "promote proposal", "apply curate", "ship the proposal", "promote dream output", "promote curation", "promote skill candidate"

**Output:** Edits applied (per HIL approval), queue ids marked done, proposal file annotated `STATUS: PROMOTED`. Trust zone YELLOW (touches `skills/`, `.claude/commands/`, `CLAUDE.md`, `docs/DWS_SKILLS_GUIDE.md`) but every change is HIL-gated.

### 3.9 /dream-on

**When to use:** When you want to run the Firehorse Dreaming loop end-to-end without per-step approval. One trigger, one plan-mode HIL gate, then auto-mode runs to completion. Replaces the "ask me what's next" UX.

**What it does:** Scans transcripts, picks the next unpromoted dream artifact (proposal under `.claude/clawdbot/proposals/`, falling back to top queue item), builds a TODO list, enters plan mode via `ExitPlanMode` for atomic HIL approval, then executes under auto-mode. After execution, marks the proposal `STATUS: PROMOTED`, dual-writes any new memory notes to the Firehorse CMS via `scripts/firehorse-memory-write.mjs`, commits, **pushes, AND opens a pull request** (the Record step must leave a PR open so the curated work surfaces in the review queue — previous Dreaming sessions sometimes pushed without PR-ing, stranding the work). Suggests a `/goal` directive the user can paste to keep the session driving until the work is done.

**Trigger phrases:** "dream on", "keep dreaming", "continue dreaming", "auto-dream", "run the dream loop", "next dream pass"

**Output:** Plan-mode approval moment + auto-executed edits + commit + push + **PR URL**. Trust zone YELLOW (skills, slash commands, CLAUDE.md, CMS writes); the single plan-mode approval satisfies HIL gating. Composes `clawdbot` (producer) + `/promote-proposal` (applier, soon plan-mode-first) + `/goal` (cross-turn runner).

## 4. Agent Discovery & Execution

### 4.1 /discover-agents

**When to use:** When you don't know which agent handles a task.

**What it does:** Lists all DWS IQ agents matching a capability keyword. Searches across 25+ agents (compliance, carbon, SEO, logistics, construction, quality, surveillance, etc.).

**Example:** `/discover-agents carbon` returns Material Oracle, Emissions Data Analyst, and their capabilities.

**Trigger phrases:** "what agents are available", "find an agent for X", "which agent handles", "list agents"

### 4.2 /agent-run

**When to use:** When you know the agent name and want to run it with specific input.

**What it does:** Runs any named DWS IQ agent with structured JSON input. Returns scored results with confidence levels.

**Example:** `/agent-run sitesense {"temperature": 28, "humidity": 65, "wind_speed": 12}`

**Available agents:** sitesense, material-oracle, compliance, schedule-genius, customer-sat, viability, deepwiki-extractor, emissions-data-analyst, construction, logistics, quality-gate, competitor-surveillance, seo-audit, lead-feedback.

### 4.3 /case-run

**When to use:** Running a case — when work spans multiple agents, domains, or time. Say "run case", "open a case", "coordinate agents on this", "case status", "Themis coordinate", or describe a situation (compliance check + contract review + ERP sync on one customer).

**What it does:** Invokes Themis as Case Coordinator. Themis reads the case context, dispatches specialist agents (ChronosAgent for deadlines, Auditor for audit trail, QualityGate for ERP, SalesOutreach for sales), and returns a unified status with one clear next step and an approval flag if any action is HIGH risk.

**Trigger phrases:** "run case", "open a case", "case status", "coordinate agents", "Themis coordinate", "assign agents to case", "what agents should handle this"

**Case types:** `compliance` · `contract` · `erp-sync` · `sales`

**Sub-agents dispatched per type:**

| Case type  | Sub-agents                      |
| ---------- | ------------------------------- |
| compliance | Themis + ChronosAgent + Auditor |
| contract   | Themis + Auditor                |
| erp-sync   | Themis + QualityGate + Auditor  |
| sales      | Themis + SalesOutreach          |

**Output:** Case ID, status, priority, agent findings, deadline risk, next step, approval gate (YES/NO).

**Composes with:** `/workflow` (for multi-step pre-built workflows), `/agent-run` (for single ad-hoc agent calls), `/compliance-check` (point-in-time compliance scoring).

### 4.4 /workflow

**When to use:** When a task requires multiple agents working together.

**What it does:** Triggers multi-agent workflows that chain or parallelize several agents. Returns a unified report.

**Available workflows:**

- `compliance-assessment` — Full EU regulatory compliance (ETS + CBAM + CSRD + AI Act)
- `construction-full` — Site safety + materials + scheduling + logistics
- `seo-pipeline` — SEO audit + competitor analysis + content recommendations

**Trigger phrases:** "comprehensive analysis", "full assessment", "run workflow", "multi-agent"

### 4.5 /swarm

**When to use:** Processing many items in parallel and merging the result, or whenever a task matches one of the six recurring swarm shapes. Say "run a swarm", "fan out over these N files", "synthesize 100 interviews", "classify and route", "red-team / adversarially verify this", "generate and filter candidates", "tournament these approaches", or "loop until done".

**What it does:** Runs an agent-swarm operation where the **orchestrator is code** — the expensive reasoning stays in the worker agents and routing/glue is zero-token deterministic code (`docs/AGENT_SWARM_ARCHITECTURE.md`). Parameterized by `PATTERN`; the harness fixes order, routing, stop condition, and model tiering before any model call.

**Parameters:** `PATTERN=<classify-and-act|fan-out-and-synthesize|adversarial-verification|generate-and-filter|tournament|loop-until-done>`, `DATASET=<path|glob|list>`, optional `GOAL`, `AGENT`, `RUBRIC`, `STOP`.

**Why one skill, not six:** the six patterns are arguments to one procedure, not six files (Skill Codification Doctrine §13). The invocation supplies the shape.

**Composes with:** `/agent-run` (the per-item worker), `/ollama-spark` (cheap / EU-local tier), `/workflow` (pre-built named pipelines), `/case-run` (Themis cross-domain coordination), `/goal` (promote a repeated swarm into a standing run).

**Output:** Structured result (table / ranked list / pass-fail + findings / winner), workers + tiers used, failures rerun, iteration count, cost estimate, approval flag, and a codification suggestion when the shape repeats.

## 5. EU Compliance & Analysis

### 5.1 /compliance-check

**When to use:** Assessing EU regulatory compliance for an industry or project.

**What it does:** Checks compliance against ETS, CBAM, CSRD, Fit for 55, and EU AI Act. Returns gap analysis with severity levels and remediation steps.

**Trigger phrases:** "compliance check", "am I compliant", "CSRD status", "ETS exposure", "CBAM risk", "regulatory gap"

**Output:** Compliance score (0-100), gaps by regulation, remediation priority matrix.

### 5.2 /carbon-analysis

**When to use:** Calculating embodied carbon for materials or construction projects.

**What it does:** Calculates embodied carbon per EN 15978 lifecycle stages (A1-D) using the Material Oracle agent. Uses validated emission factors from EU ETS benchmarks and IPCC 2006.

**Input:** Materials list with quantities (e.g., "500 tonnes steel, 2000 m3 concrete").

**Trigger phrases:** "embodied carbon", "carbon footprint", "kgCO2e", "lifecycle assessment", "LCA", "A1-A3 emissions"

### 5.2a /regulatory-radar

**When to use:** Looking ahead — scoring upcoming EU regulations against a specific customer profile.

**What it does:** Runs as a thin wrapper over the existing `compliance` agent (`compliance.agent.ts`), scoring the 5 regulations it already tracks (`fit-for-55`, `ets`, `cbam`, `csrd`, `eu-ai-act`) by deadline urgency for a customer, regardless of which frameworks they've told you they're already tracking. Live EUR-Lex / DG ENER / DG CLIMA / DG GROW / EFRAG / CINEA pipeline scanning for _new, not-yet-known_ instruments remains unbuilt — this wrapper only covers deadline-urgency scoring for the 5 regulations already wired into the compliance agent.

**Trigger phrases:** "regulatory radar", "what's coming from EU", "regulation pipeline", "Delegated Act tracking", "score customer against next regulation", "what should we warn [customer] about"

**Output:** Deadline-sorted list per regulation (`overdue` / `urgent` ≤90d / `approaching` ≤365d / `comfortable`), ALERT flagged on `overdue`/`urgent`. Not yet a signed Article-12 PDF.

**Composes with:** `/compliance-check` (point-in-time) → `/regulatory-radar` (forward-looking, same underlying agent).

**Status:** Live (slash-cli) as of 01.07.2026, scoped to the 5 already-tracked regulations. The datacentre-compliance-specific EED radar feature (PRD v0.2's "scored against next regulation" hook, 24-KPI submission tracking) remains gated behind `datacentre-compliance` PRD Gate 1 — 3 signed design-partner letters, target 1 Oct 2026 — and this wrapper does not unblock that vertical-specific build.

### 5.3 /sovereignty-assess

**When to use:** Evaluating database sovereignty for EU compliance.

**What it does:** Assesses CLOUD Act exposure, data residency compliance, encryption posture, Row Level Security (RLS), and GDPR readiness for PostgreSQL databases.

**Trigger phrases:** "sovereignty check", "CLOUD Act", "data residency", "EU sovereign database", "database compliance"

**Output:** Sovereignty score, risk matrix, remediation recommendations.

### 5.3a /sovereignty-pillars-assess

**When to use:** Scoring a customer architecture against the universal three-pillar (Data / Technology / Operational) × three-jurisdiction (EU / US / SG) sovereignty model from Sovereignty Field Note #2.

**What it does:** Returns a `(SIB, CSB, EAB)` triple per jurisdiction (nine cells), an overall DWS product tier recommendation (Aegis / Sovereign Infra / Connect), post-quantum readiness, and a Rightful Oy R-Sac² referral flag. Extends `/sovereignty-assess` from database-only to enterprise-architecture scope.

**Trigger phrases:** "pillars assess", "score sovereignty", "SIB CSB EAB", "three-pillar score", "sovereignty triple", "score this architecture"

**CLI:** `dws sovereignty-pillars-assess <input.json>` or `node scripts/sovereignty-pillars-assess.cjs <input.json>`

**Fixtures:** `fixtures/sovereignty-pillars/{eu-aegis,us-sovereign-cloud,sg-neutrality}.json`

**Canonical reference:** `docs/field-notes/2026-05-28-three-pillars-sovereignty-global.md`, `DWS_TRUTH_STANDARD.md` Row 16.

### 5.4 /site-safety

**When to use:** Assessing construction site safety conditions.

**What it does:** Uses the SiteSense agent to score site conditions 0-100 with EN 13001 crane operation warnings. Evaluates temperature, humidity, wind, worker capacity, and equipment risk.

**Input:** Site conditions (temperature, humidity, wind speed, worker count).

**Trigger phrases:** "site safety", "safety score", "is it safe to work", "crane operation", "wind speed risk"

## 6. Operations & Infrastructure

### 6.1 /flow-status

**When to use:** Checking repository state, branch sync status, or merge targets.

**What it does:** Displays comprehensive Git Flow status including branch type detection, remote sync status, staged/unstaged changes, and merge target recommendations.

**Trigger phrases:** "git status", "branch status", "am I synced", "flow status"

### 6.1a /gh-to-mcp

**When to use:** User pastes a `gh` CLI command, asks "what's the MCP equivalent", "is gh 2.X the same as MCP", or mentions gh inside a Claude Code session (where gh is not installed).

**What it does:** Translates `gh <subcommand>` into the equivalent `mcp__github__*` tool call using the map in `docs/GITHUB_CLI_VS_MCP.md`. Flags capabilities that have no MCP equivalent (e.g. `gh run`, `gh workflow`, `gh codespace`, `gh gist`, raw `gh api`). Also answers version-compatibility questions: gh CLI and GitHub MCP are **independently versioned** — they share the GitHub API but not a release scheme.

**Trigger phrases:** "gh to mcp", "gh equivalent", "mcp equivalent of gh", "gh vs mcp", "is gh 2.54 compatible with mcp", "how do I do X via mcp"

**Reference:** `docs/GITHUB_CLI_VS_MCP.md` (full translation map) | `docs/GITHUB_MCP_TOOLS.md` (48-tool catalogue).

### 6.1b /gcr-skill

**When to use:** Cloud Run staging/deploy gates fail with Google IAM token errors (for example `iam.serviceAccounts.getAccessToken` denied), or when creating a clean admin-owned GCP control plane for DWS6 CI.

**What it does:** Executes a deterministic bootstrap and repair flow for Google Cloud Run CI identity:

- verifies owner account is `admin@dws6.com`,
- sets active project and ADC quota project,
- enables required APIs (`iamcredentials`, `run`, `artifactregistry`, `cloudbuild`, `secretmanager`),
- creates `github-actions-deployer@<project>.iam.gserviceaccount.com`,
- grants deployment roles and `roles/iam.serviceAccountTokenCreator`,
- rotates GitHub project/service-account secrets away from stale projects (for example `dws-iq-pilot`).

**Trigger phrases:** "Cloud Run staging IAM error", "getAccessToken denied", "bootstrap GCP project for CI", "create dws-iq-60 deploy identity", "fix deployer service account permissions"

**Output:** Command checklist + IAM binding state + API enablement confirmation + GitHub secret update checklist.

### 6.1c /cron

**When to use:** Auditing scheduled work, moving recurring jobs off GitHub Actions, checking DGX Spark cron coverage, or estimating schedule-runner cost.

**What it does:** Scheduled Work Manager for DGX Spark cron, Claude routines, and GitHub Actions failover. Supports `status`, `audit`, `add`, `move`, `cost`, `list`, and `backup`, and cross-references `Cron-works.md` against `.github/workflows/` and `scripts/daily|weekly/`.

**Trigger phrases:** "cron status", "cron audit", "move workflow to DGX", "what runs on schedule", "GHA cost", "add cron job"

### 6.2 /email

**When to use:** Sending transactional emails, checking delivery status, or triggering outreach digests.

**What it does:** Sends emails via Amazon SES (SMTP). Supports single send, batch send, delivery status check, and outreach digest triggers.

**Important rules:**

- Always sends from `risto@onelifetime.world` (verified domain)
- Never uses noreply@ addresses
- Transport: Amazon SES (SMTP)

**Trigger phrases:** "send email", "email this report", "notify by email", "check delivery", "resend status"

### 6.3 /remote-control

**When to use:** Interacting with Lifetime Fleet edge devices or command centers.

**What it does:** Remote control interface for LWM Acer edge device, Control Room (field operations), and Situation Room (strategic command). Shows device health, fleet status, robot feeds, and mission dispatch.

**Trigger phrases:** "remote control", "acer device", "fleet status", "control room", "situation room", "device health"

### 6.4 /investor-outreach

**When to use:** Drafting, triaging, or tracking investor intro notes for the DWS IQ 6 SAFE round. Works from matches the user provides (name, firm, LinkedIn, thesis, drawbacks).

**What it does:** Generates `INTRO_<NAME>_<FIRM>.md` files in `investor-outreach/` following the house template. Supports `add`, `list`, `triage`, `ready`, `followup`, `status`. Enforces exclusion rules (defense/climate/solo-founder blockers), bans Aegis language for funds that exclude defense, and locks the current focus doctrine (sell V1 to investors at PE meetings + Messe Germany, not entrepreneur networking).

**Focus doctrine (2026-04-19):**

- Target: PE meeting investors + German Messe buyers (industrial CFOs, EUR 25K+ contracts)
- V1 launch: Arctic 15, Helsinki, June 15, 2026
- Round: EUR 650K SAFE at EUR 3.8M cap, Captain seats EUR 50K
- Messe hook: pre-Messe commits enter ahead of August 15 German sales data drop

**Trigger phrases:** "add investor", "new investor match", "pull investor", "draft investor intro", "triage investor list", "who's ready to send", "investor follow-up", "which INTRO next"

### 6.5 /lsj-publish

**When to use:** Drafting the next issue of Lifetime Scope Monthly — the LinkedIn newsletter layer of Lifetime Scope Journal (LSJ) at onelifetime.world/blog. **Cadence: every 2 weeks (biweekly / fortnightly).** Auto-triggered on even ISO weeks by `scripts/weekly/lsj-publish-draft.sh`; may also be run manually.

**Issue numbering is monotonic** (never resets across cadence changes). Current: issue #8 is the first biweekly issue.

**What it does:** Inventories LSJ posts from the last 14 days, ranks them (time-on-page, lead attribution, share velocity, editorial judgement), picks **one Best Entry + three Runners-Up**, drafts an About-LSJ intro + 150-word Editor's Note + exactly-80-word Agentic Lens, generates an HTML post at `onelifetime.world/posts/lifetime-scope-issue-<nnn>-<yyyy-mm-dd>.html` (+ landing-pages mirror), and emits a LinkedIn-ready copy-paste block (plain text, no markdown, no angle-brackets around URLs, Links section with blog + YouTube + subscribe CTA). Never auto-posts to LinkedIn — the Editor sends manually.

**Hard rules:** Agentic Lens never fabricates outcomes (CLAUDE.md Validated Mock Data Rule); if no real aggregate is available, states _"No verified outcomes this fortnight"_. Needs ≥ 4 posts in the window (1 best + 3 runners-up) or the biweekly cron skips the issue.

### 6.6 /ollama-spark

**When to use:** Anthropic / Claude / Groq is rate-limited or quota-exhausted, or the prompt contains EU-restricted data (PII, GDPR, EU AI Act high-risk) that must not leave DGX Spark, or you want cost-free batch inference on owned hardware. See CLAUDE.md §DGX Ollama Fallback Rule.

**What it does:** Routes a one-shot prompt to Ollama running on DGX Spark via `ssh dgx-spark "curl -s http://localhost:11434/api/generate ..."`. Wrapper `scripts/ollama-spark.sh` handles JSON-escaping and the SSH transport; the skill `/ollama-spark <model> "<prompt>"` invokes it. `--list` enumerates pulled models on the Spark.

**Example:** `/ollama-spark llama3.1:70b "Classify this CSRD disclosure: ..."` — full response on stdout, no per-token billing, no cloud egress.

**Composes with:** Any DWS agent whose `LLMClient` catches a cloud 429 and wants a fallback; `/kya` for sovereignty-sensitive sessions; `/sovereignty-assess` for pre-flight checks on whether a prompt should go here by default.

**Trigger phrases:** "lsj publish", "draft scope monthly", "best blog of the fortnight", "lifetime scope monthly", "linkedin newsletter draft", "prepare LSJ issue"

### 6.7 /fix-dual-folder-api-connectivity

**When to use:** Public site page reaches the wrong API host, returns HTML instead of JSON, or root and landing mirror copies have drifted endpoint logic.

**What it does:** Applies a deterministic dual-folder API connectivity repair workflow: detect host mismatch, patch both root + landing pages in same change set, preserve local fallback, add response diagnostics, and verify end-to-end write path (including Supabase persistence when relevant).

**Trigger phrases:** "booking not connecting", "API returns HTML", "wrong backend host", "fix dual folder API", "dws10 page cannot reach DB", "connectivity drift"

**Output:** Root cause summary + files changed + endpoint verification + DB verification delta + remaining infra follow-up (if DNS/routing outage).

### 6.8 /coaching

**When to use:** Preparing to deliver the **Claude Code Coaching** store product to a client — a 1-day lecture, 2-day workshop, 3-day bundle, or embedded project engagement.

**What it does:** Turns the canonical curriculum (`docs/coaching/CLAUDE_CODE_COACHING_CURRICULUM_{EN,FI}_v1.0.md`) into a ready-to-deliver engagement — agenda, participant pre-work checklist, EU AI Act Article 4 literacy record, and logistics — parameterized by `CLIENT`, `FORMAT`, `LANG`, `REPO`, `PARTICIPANTS`. Prices are read from `dws10.com/config/products.json` (single source); participant caps are enforced (lecture ≤ 12, workshop ≤ 10).

**Trigger phrases:** "coaching plan", "build the workshop agenda", "Article 4 literacy record", "Claude Code coaching for &lt;client&gt;", "prework checklist"

**Output:** The requested artifact (agenda / prework / record / full plan) with logistics, applicable SKU + price, capstone definition-of-done, and EU-sovereign + truth-check guardrails. Optionally persisted under `docs/coaching/engagements/`.

## 7. Runtime Safety & Knowledge

### 7.1 /kya

**When to use:** Checking the trust score of a running agent session, or terminating an agent chain that has lost trust (TC-4 Leash Snap).

**What it does:** Runs the DWS CLI `kya` subcommand against `/api/v1/kya/*`. Supports `status` (safe, read-only trust score) and `snap` (DESTRUCTIVE, terminates the agent chain with forensic dump). Binds every session to a Shufti Pro-verified human identity.

**Trigger phrases:** "kya status", "trust score", "leash snap", "terminate agent chain", "kill the agent", "kya snap", "revoke agent", "TC-4"

**Safety:**

- `kya snap` is listed in `Admin/SECURITY_COMPLIANCE.md` destructive-action inventory
- ALWAYS run `--dry-run` first unless this is an active incident
- The skill will prompt the user to retype the session ID before executing non-dry-run `snap`
- Auth: `Bearer $DWS_API_TOKEN` or `x-admin-key: $ADMIN_API_KEY` (timing-safe compare)
- Every run is audit-logged server-side with `source: 'cli'`

**Reason codes:** `MANUAL_SNAP`, `TRUST_VIOLATION`, `POLICY_BREACH`, `IDENTITY_REVOKED`, `CONTAINMENT_BREACH`, `KILL_SWITCH`

See `docs/KYA_BYO_LIFECYCLE.md` and `onelifetime.world/posts/kya-standard-v1.html`.

### 7.2 /kb

**When to use:** Adding raw sources to the knowledge base, compiling the wiki, asking questions against it, or running deep research.

**What it does:** Drives the LLM-maintained Knowledge Base via the DWS CLI `kb` subcommand. Karpathy-style workflow: raw sources in `kb/raw/` → LLM compiles to `kb/wiki/` → auto-maintained indexes → Q&A. No vector DB. Supports `status`, `ingest`, `compile`, `ask`, `research`, `lint`.

**Trigger phrases:** "kb compile", "kb ask", "kb research", "knowledge base", "compile wiki", "ingest source", "what does our wiki say about", "kb status"

**Workflow rules:**

- `kb/wiki/` is LLM-owned — never hand-edit; files get overwritten on next `compile`
- `kb/raw/` is human-owned — drop sources here; compile picks them up incrementally
- `compile` is incremental by default; use `--full` for clean rebuild
- `kb/ephemeral/` is auto-swept by `scripts/daily/kb-cleanup.sh` after 7 days
- Path traversal is blocked — `kb_write_article` only writes inside `kb/wiki/`

**Security:** KB is NOT cleared for PII. Follow `docs/DWS_DATA_STANDARD.md` for retention and classification of `kb/raw/` and `kb/wiki/` content.

See `src/agents/kb.agent.ts` for the agent implementation and tool handlers.

### 7.3 /truth-check

**When to use:** Writing or reviewing public-facing copy (store, landing pages, investor/sales, press, decks) that asserts a DWS "fact" — an industry count, captain-hat count, product price/name, KYA tier. Catches an inflated EU-industry count before it propagates.

**What it does:** Runs `scripts/lint-truth-claims.mjs` against the canonical structured mirrors (e.g. `dws10.com/config/industries.json`). FAILs on `deprecatedDisplayPhrases`, WARNs on `ambiguousDisplayPhrasesNeedingContext` used without a disambiguator, and reads `approvedDisplayPhrases` as the allow-list, suggesting the correct wording on each hit. Operationalises `DWS_TRUTH_STANDARD.md` §5/§7.

**Modes:** `/truth-check "<claim>"` (inline), `/truth-check <path…>` (files/dirs), `/truth-check --changed` (PR diff). Add `--json` for structured output.

**Trigger phrases:** "truth check", "is this claim canonical", "check industry count", "truth lookup", "truth scan", "does this match the registry"

**Workflow rules:**

- Allow-list / deny-list live in the structured mirrors — add phrases to `approvedDisplayPhrases` / `deprecatedDisplayPhrases`, never hard-code them in the skill.
- Per `DWS_TRUTH_STANDARD.md` §3, fix the drifting _copy_, never the canonical source.
- Canonical mirrors and registry docs are excluded from scanning (they hold the phrases as data).
- Same script runs in CI as `.github/workflows/lint-truth-claims.yml` (PR-diff, non-blocking initially).

See `scripts/lint-truth-claims.mjs` and `DWS_TRUTH_STANDARD.md` §5/§7/§8.

## 8. Code Quality & Internationalisation

### 8.1 /simplify

**When to use:** After completing a feature, or when code feels over-engineered.

**What it does:** Reviews changed code for duplicated logic, unnecessary complexity, dead code, OWASP Top 10 security issues, and performance anti-patterns. Automatically fixes issues found.

**Trigger phrases:** "simplify", "clean up code", "reduce complexity", "refactor", "code review"

**Checks performed:**

- DRY violations (duplicated logic across files)
- Unnecessary abstractions (helpers used once)
- Dead code (unused imports, functions, variables)
- Security: XSS, SQL injection, command injection, CORS misconfiguration
- Performance: N+1 queries, unnecessary re-renders, memory leaks

### 8.1a /designer

**When to use:** Converting a screenshot or Figma direction into working UI code, implementing polish fixes, or letting a non-technical designer drive a contained visual/UI change.

**What it does:** Design-to-code bridge. Supports `screenshot-to-code`, `style-change`, `component-create`, `state-change`, `polish-fix`, `edge-case-audit`, and `design-review`, then runs the DWS Designer Agent with structured input.

**Trigger phrases:** "design to code", "figma to code", "screenshot to prototype", "style change", "designer workflow", "polish fix", "design review"

### 8.1b /dialog

**When to use:** Updating a document, offer, or its attachments through line-by-line HIC-confirmed dialogue — especially proposals reused across customers (e.g. ORK → Kemira). Use whenever a fact-check or rewrite must keep the human in control of every formulation change.

**What it does:** Walks the target document section by section (§1 → §N). Loads canonical sources first (products.json, INDUSTRIES.md, DWS_TRUTH_STANDARD.md), then proposes each change as a numbered `muutos;` item (**Nykyinen** → **Muutos** + one-line rationale). The human replies `agree` or supplies a counter-sentence; the agent applies the accepted wording, commits per batch, and bumps the version (`.01` increments). Preserves quotes and formulations per DWS_DOCUMENT_STANDARD §21; surfaces canonical conflicts instead of averaging them.

**Customer adaptation mode** (`KIND=offer ROLE=<customer>`): diffs the source offer against the new customer's profile and walks every customer-specific token (name, sector, price tier, regulation set) as a confirmed `muutos;` — no bulk find-replace, parent + attachments updated in lockstep.

**Trigger phrases:** "dialog", "käydään läpi", "muutos;", "go through the document", "adapt this offer for", "update the proposal section by section"

### 8.2 /multilingual

**When to use:** Any time a page needs a language bar, hero text needs translating into EU languages, or you're auditing whether language page H1s match the vertical bar texts.

**What it does:** Adds or audits the EU vertical language bar (5-language for dws10.com, 3-language for onelifetime.world). Shows language name + native hero text + country flag on the right. PAGE ELEMENT — never inside the nav.

**Trigger phrases:** "add language bar", "translate hero text", "speak 5 languages", "multilingual", "vertical language bar", "European languages", FI/SV/DE/FR content

**Key files:**

- `dws10.com/shared-assets/vertical-lang-bar.js` — 5-language bar (FI · SV · DE · FR · EN)
- `onelifetime.world/shared-assets/olw-vertical-lang-bar.js` — 3-language bar (FI · SV · EN)
- `window.dwsVlbCardHTML()` — compact card strip for product cards in buy/index.html

**Offering strength:** DWS speaks 5 EU languages natively. No Nordic SaaS competitor matches this breadth. The bar is always a page section, never a dropdown, never inside ironclad-nav.

## 9. Discipline Skills (Hard Gates)

These are not slash commands — they are process rules that agents follow automatically. Located in `skills/*/SKILL.md`.

### 9.1 verification-gate

**Location:** `skills/verification-gate/SKILL.md`

**Rule:** NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE.

**When it applies:**

- Before marking any todo item as completed
- Before git commit
- Before claiming a bug is fixed
- Before saying "all tests pass"

**Red flag language that triggers this gate:**

- "should work" — Run the test. Show output.
- "probably fixed" — Reproduce the bug. Show it's gone.
- "seems correct" — Run the linter. Show zero errors.
- "I believe this passes" — Run npm test. Paste the result.

### 9.2 design-first

**Location:** `skills/design-first/SKILL.md`

**Rule:** NO IMPLEMENTATION WITHOUT DESIGN APPROVAL (for 3+ file changes).

**When it applies:**

- Features touching 3 or more files
- Architectural decisions
- New integrations or data flow changes

**Skip when:**

- Bug fixes with clear root cause (1-2 files)
- Documentation-only changes
- Dependency updates
- User explicitly says "just do it"

**Process:**

1. Surface assumptions
2. Present 2-3 approaches with tradeoffs
3. Recommend one with rationale
4. Wait for user approval before writing code

### 9.3 dual-folder-sync

**Location:** `skills/dual-folder-sync/SKILL.md`

**Rule:** EVERY ROOT FOLDER CHANGE MUST SYNC TO LANDING-PAGES IN THE SAME COMMIT.

**Folder map:**

| Root (source of truth) | Production copy                  |
| ---------------------- | -------------------------------- |
| dws10.com/             | landing-pages/dws10-com/         |
| onelifetime.world/     | landing-pages/onelifetime-world/ |
| dws6.com/              | landing-pages/dws6-com/          |
| lifetime.fi/           | landing-pages/lifetime-fi/       |

**Workflow:** Edit root > copy to landing-pages > verify with diff > commit both together.

## 9.4 V2 Skilled Agents (AgentFoundry roster)

Every V2 agent ships with a YAML config in `AgentFoundry/configs/production/` that captures deployment-only concerns (model tier, budget, rate limits, deployment phase). Execution logic and system prompts live in the corresponding `src/agents/*.ts` class. The industry pages on dws10.com list which agents apply to each vertical in the **V2 Skilled Agents** section.

Badges (section pill, skill chips, KYA badge, Standards & Interop strip) are canonicalised in `kb/wiki/concepts/badges-library.md`. Propose new badges there first before placing them on a page.

**Climate IQ industry agents (9)** — one for each covered industry, named after mythological figures:

| Agent          | Industry                       | Source                                             | Config                                          |
| -------------- | ------------------------------ | -------------------------------------------------- | ----------------------------------------------- |
| **Mars**       | Construction & Buildings       | `src/agents/workflow/industry/mars.agent.ts`       | `AgentFoundry/configs/production/mars-001.yaml` |
| **Helios**     | Energy & Renewables            | `src/agents/workflow/industry/helios.agent.ts`     | `helios-001.yaml`                               |
| **Vulcan**     | Steel & Metals                 | `src/agents/workflow/industry/vulcan.agent.ts`     | `vulcan-001.yaml`                               |
| **Talos**      | Aluminium                      | `src/agents/workflow/industry/talos.agent.ts`      | `talos-001.yaml`                                |
| **Gaia**       | Cement & Earth Materials       | `src/agents/workflow/industry/gaia.agent.ts`       | `gaia-001.yaml`                                 |
| **Ceres**      | Agriculture & Circular Economy | `src/agents/workflow/industry/ceres.agent.ts`      | `ceres-001.yaml`                                |
| **Neptune**    | Maritime & Shipping            | `src/agents/workflow/industry/neptune.agent.ts`    | `neptune-001.yaml`                              |
| **Prometheus** | Hydrogen & Energy Transition   | `src/agents/workflow/industry/prometheus.agent.ts` | `prometheus-001.yaml`                           |
| **BESS**       | Battery Energy Storage Systems | `src/agents/workflow/industry/bess.agent.ts`       | `bess-001.yaml`                                 |

**Platform agents (3)** — cross-cutting runtime gates:

| Agent                   | Role                             | Source                                    | Config                         | Skill                 |
| ----------------------- | -------------------------------- | ----------------------------------------- | ------------------------------ | --------------------- |
| **Compliance**          | EU regulatory gap analysis       | `src/agents/compliance.agent.ts`          | `compliance-001.yaml`          | `/compliance-check`   |
| **Quality Gate**        | Runtime schema / fact / citation | `src/agents/quality-gate.agent.ts`        | `quality-gate-001.yaml`        | runtime gate          |
| **Sovereignty Monitor** | EU data residency + NIS2         | `src/agents/sovereignty-monitor.agent.ts` | `sovereignty-monitor-001.yaml` | `/sovereignty-assess` |

**Interop standards referenced by every V2 agent:**

- **A2A v1.0** — Google Agent2Agent protocol (Linux Foundation, 150+ orgs). Agent Cards at `/.well-known/agent-card.json` (endpoint on roadmap).
- **MCP** — Anthropic Model Context Protocol. All V2 agents exposed at `/mcp` via JSON-RPC 2.0 `tools/list`.
- **KYA** — Know Your Agent Standard v1.1, Lifetime Oy. MicroVM sandbox + identity binding + TC-4 Leash-Snap. **Open-source aim:** Agentic AI Foundation, NIST, and European standards bodies.

**Reference:**

- Industry pages: `dws10.com/construction/`, `dws10.com/energy/`, `dws10.com/manufacturing/`, `dws10.com/logistics/`, `dws10.com/mining/`, `dws10.com/real-estate/`, `dws10.com/shipbuilding/`, `dws10.com/waste/`, `dws10.com/healthcare/`, `dws10.com/public-sector/`, `dws10.com/financial-services/` (all mirrored to `landing-pages/dws10-com/`).
- BYO Agent Interface v1 preview: `dws10.com/enterprise-integrations/#byo-agents`.
- Competitive landscape (Siemens / NVIDIA / Aspire 13.2 / A2A v1.0 / Salesforce AgentExchange / SAP Joule / Oracle AI Agent Studio): `docs/field-notes/2026-04-22-agent-ecosystem-landscape-q2-2026.md`.
- Badges library: `kb/wiki/concepts/badges-library.md`.

## 10. Quick Reference — When to Use What

| Situation | Skill | Type |
| ------------------------------------------ | --------------------------------- | ---------- |
| Starting a new feature | /plan-review ROLE=ceo | gstack |
| Designing architecture | /plan-review ROLE=eng | gstack |
| Need acceptance checks before review | /qa | gstack |
| Code is written, needs review | /review | gstack |
| Ready to merge | /ship | gstack |
| Need to verify UI | /browse | gstack |
| End of week | /retro | gstack |
| Codify retro into skill edits | /learn SCOPE=last-week | gstack |
| Find unfinished past-session work | /clawdbot | Dreaming |
| Apply a clawdbot proposal | /promote-proposal | Dreaming |
| Run Dreaming loop end-to-end | /dream-on | Dreaming |
| Bootstrap GCP CI identity | /gcr-skill | Operations |
| Don't know which agent to use | /discover-agents | Agent |
| Know the agent, want to run it | /agent-run | Agent |
| Coordinate agents on a case | /case-run | Agent |
| Need multi-agent analysis | /workflow | Agent |
| Many items to process & merge | /swarm PATTERN=… | Agent |
| EU regulatory question | /compliance-check | Compliance |
| Upcoming EU regulation scoring | /regulatory-radar | Compliance |
| Carbon footprint calculation | /carbon-analysis | Compliance |
| Database sovereignty check | /sovereignty-assess | Compliance |
| Score sovereignty across all three pillars | /sovereignty-pillars-assess | Compliance |
| Construction site assessment | /site-safety | Compliance |
| Check git branch state | /flow-status | Operations |
| Translate gh command to MCP | /gh-to-mcp | Operations |
| Audit scheduled work / cron | /cron | Operations |
| Send email notification | /email | Operations |
| Control edge devices | /remote-control | Operations |
| Add/triage investor intro | /investor-outreach | Operations |
| Draft the next LSJ issue | /lsj-publish | Operations |
| Route to DGX Spark Ollama | /ollama-spark | Operations |
| Fix dual-folder API drift | /fix-dual-folder-api-connectivity | Operations |
| Deliver Claude Code Coaching engagement | /coaching | Operations |
| Check agent trust / kill chain | /kya | Safety |
| Compile wiki / ask KB | /kb | Knowledge |
| Check a claim vs truth registry | /truth-check | Safety |
| Code feels bloated | /simplify | Quality |
| Turn design intent into code | /designer | Quality |
| Add/audit language bar | /multilingual | i18n |
| About to claim "done" | verification-gate | Discipline |
| Big feature, many files | design-first | Discipline |
| Editing site root folders | dual-folder-sync | Discipline |

## 11. Creating New Skills

### Slash Command (/.claude/commands/)

Create a new `.md` file in `.claude/commands/` with YAML frontmatter:

```yaml
---
name: my-skill
description: >
  Use when [specific trigger]. Does [specific action].
  Returns [specific output format].
---
```

**CSO (Claude Search Optimization) rules for descriptions:**

- Start with "Use when..." + specific symptoms/contexts
- Include keywords agents would search for
- Never summarize the workflow in the description
- Keep under 400 characters and 60 words

### Discipline Skill (skills/)

Create a new directory in `skills/` with a `SKILL.md`:

```
skills/
  my-gate/
    SKILL.md
```

**Format:** Same YAML frontmatter. Content should be short (<150 words for frequent skills), start with a bold ALL-CAPS rule, include a "When This Applies" section and "Common Mistakes" section.

### Registration

Every new agent MUST have a corresponding skill in `.claude/commands/`. Register it in `skills/manifest.json`, run `node scripts/skill-manifest-sync.mjs --write-guide --antigravity`, then update AGENTS.md Section 16 when needed.

## 12. Architecture Notes

**Skills are the human interface to DWS agents.** The relationship:

```
Human ──/skill──> Claude Code ──agent-run──> DWS IQ Agent ──> Result
                       │
                       ├── discipline skills (auto-enforced)
                       └── slash commands (user-triggered)
```

**Token budget:** Skills should be as short as possible. Under context window pressure, agents skip long documents. The superpowers research (docs/research/superpowers-analysis.md) found that discipline rules under 150 words have the highest compliance rate.

**Composability:** Skills can reference each other. `/plan-review ROLE=ceo` naturally flows into `/plan-review ROLE=eng`. `/review` naturally flows into `/ship`. `design-first` is a lightweight version of the plan skills for everyday work.

## 13. Skill Codification Doctrine ("Thin Harness, Fat Skills")

Source: Garry Tan, May 2026 — "Thin harness, fat skills." Reinforced by `CLAUDE.md` Skill Codification Rule and `AI_AGENT_GUIDELINES.md` §10.

### Three Principles

1. **Skill = method call.** A `SKILL.md` describes a _process of judgment_ with parameters (`ROLE`, `KIND`, `TARGET`, `DATASET`). The invocation supplies the world. Same skill, different arguments → radically different capability. Four near-identical SKILL.md files differing only in a noun is a function with no arguments — collapse them.
2. **Asked twice = failure.** If the user has to ask for the same kind of judgment work twice, codify it as a parameterized skill _in the same commit_ and re-run to verify. Do not let know-how live in chat scrollback.
3. **Latent vs deterministic boundary is explicit.** Every step in a skill is either LLM judgment (latent) or function call (deterministic). The `SKILL.md` must mark each step. Asking the LLM to do arithmetic, optimization, or schema validation is a category error.

### Parameterization Examples in This Codebase

| Anti-pattern (script-shaped)                             | Correct shape (method-shaped)                                    |
| -------------------------------------------------------- | ---------------------------------------------------------------- |
| `plan-ceo-review`, `plan-eng-review`                     | `plan-review ROLE=<ceo\|eng>`                                    |
| `firehorse-report-{annual,board-pack,carbon,compliance}` | `firehorse-report KIND=<annual\|board-pack\|carbon\|compliance>` |

### Learning Loop

`/retro` and post-mortems surface mediocre outcomes (NPS = OK, not great). Diarize them, extract the missing rule, propose a `SKILL.md` diff in the next commit. The skill rewrites itself; the harness stays thin.

### Reference

- `CLAUDE.md` → "Skill Codification Rule"
- `AI_AGENT_GUIDELINES.md` §10 → "Skill Codification: Asked Twice = Failure"
- Tan, "Thin Harness, Fat Skills" (May 2026)

## 14. Surface Compatibility Matrix

Source of truth: `skills/manifest.json`. The matrix below is generated by `node scripts/skill-manifest-sync.mjs --write-guide`.

Legend: `✅` supported now · `⚠️` experimental/deferred path · `❌` unsupported on that surface.

<!-- skills-surface-matrix:start -->
<!-- generated: 2026-06-24 -->

| Skill                              | Kind            | Status       | Visibility | Win11 CLI | Desktop | Web | iOS | Android | Chromebook/Antigravity | Transport                          | Notes                                                                                                                                                                                                                                                                               |
| ---------------------------------- | --------------- | ------------ | ---------- | --------- | ------- | --- | --- | ------- | ---------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `agent-run`                        | slash-command   | active       | internal   | ✅        | ❌      | ❌  | ❌  | ❌      | ❌                     | slash-command, local-tools         | Repo-local slash command. Available in Claude Code CLI only.                                                                                                                                                                                                                        |
| `browse`                           | slash-command   | active       | internal   | ✅        | ❌      | ❌  | ❌  | ❌      | ❌                     | slash-command, local-tools         | Repo-local slash command. Available in Claude Code CLI only.                                                                                                                                                                                                                        |
| `carbon-analysis`                  | slash-command   | active       | internal   | ✅        | ❌      | ❌  | ❌  | ❌      | ❌                     | slash-command, local-tools         | Repo-local slash command. Available in Claude Code CLI only.                                                                                                                                                                                                                        |
| `case-run`                         | slash-command   | active       | internal   | ✅        | ❌      | ❌  | ❌  | ❌      | ❌                     | slash-command, local-tools         | Repo-local slash command. Available in Claude Code CLI only.                                                                                                                                                                                                                        |
| `clawdbot (command)`               | slash-command   | active       | internal   | ✅        | ❌      | ❌  | ❌  | ❌      | ❌                     | slash-command, local-tools         | Repo-local slash command. Available in Claude Code CLI only.                                                                                                                                                                                                                        |
| `clawdbot (pack)`                  | skill-pack      | active       | internal   | ✅        | ❌      | ❌  | ❌  | ❌      | ❌                     | skill-pack, local-files            | Repo-local skill pack loaded by Claude Code in this repository.                                                                                                                                                                                                                     |
| `coaching`                         | slash-command   | active       | internal   | ✅        | ❌      | ❌  | ❌  | ❌      | ❌                     | slash-command, local-tools         | Repo-local slash command. Available in Claude Code CLI only.                                                                                                                                                                                                                        |
| `compliance`                       | skill-pack      | active       | internal   | ✅        | ❌      | ❌  | ❌  | ❌      | ❌                     | skill-pack, local-files            | Repo-local skill pack loaded by Claude Code in this repository.                                                                                                                                                                                                                     |
| `compliance-check`                 | slash-command   | active       | internal   | ✅        | ❌      | ❌  | ❌  | ❌      | ❌                     | slash-command, local-tools         | Repo-local slash command. Available in Claude Code CLI only.                                                                                                                                                                                                                        |
| `cron (command)`                   | slash-command   | active       | internal   | ✅        | ❌      | ❌  | ❌  | ❌      | ❌                     | slash-command, local-tools         | Repo-local slash command. Available in Claude Code CLI only.                                                                                                                                                                                                                        |
| `cron (pack)`                      | skill-pack      | active       | internal   | ✅        | ❌      | ❌  | ❌  | ❌      | ❌                     | skill-pack, local-files            | Repo-local skill pack loaded by Claude Code in this repository.                                                                                                                                                                                                                     |
| `design-first`                     | discipline-gate | active       | internal   | ✅        | ❌      | ❌  | ❌  | ❌      | ❌                     | discipline-gate                    | Repo-local hard gate enforced in Claude Code contexts.                                                                                                                                                                                                                              |
| `designer`                         | slash-command   | active       | internal   | ✅        | ❌      | ❌  | ❌  | ❌      | ❌                     | slash-command, local-tools         | Repo-local slash command. Available in Claude Code CLI only.                                                                                                                                                                                                                        |
| `dialog`                           | slash-command   | active       | internal   | ✅        | ❌      | ❌  | ❌  | ❌      | ❌                     | slash-command, local-tools         | Repo-local slash command. Available in Claude Code CLI only.                                                                                                                                                                                                                        |
| `discover-agents`                  | slash-command   | active       | internal   | ✅        | ❌      | ❌  | ❌  | ❌      | ❌                     | slash-command, local-tools         | Repo-local slash command. Available in Claude Code CLI only.                                                                                                                                                                                                                        |
| `dream-on (command)`               | slash-command   | experimental | internal   | ⚠️        | ❌      | ❌  | ❌  | ❌      | ❌                     | slash-command, local-tools         | Internal automation only. No Desktop/mobile/web runtime today.                                                                                                                                                                                                                      |
| `dream-on (pack)`                  | skill-pack      | experimental | internal   | ⚠️        | ❌      | ❌  | ❌  | ❌      | ❌                     | skill-pack, local-files            | Internal automation. Pending HIL cross-surface verification.                                                                                                                                                                                                                        |
| `dual-folder-sync`                 | discipline-gate | active       | internal   | ✅        | ❌      | ❌  | ❌  | ❌      | ❌                     | discipline-gate                    | Repo-local hard gate enforced in Claude Code contexts.                                                                                                                                                                                                                              |
| `email`                            | slash-command   | active       | internal   | ✅        | ❌      | ❌  | ❌  | ❌      | ❌                     | slash-command, local-tools         | Repo-local slash command. Available in Claude Code CLI only.                                                                                                                                                                                                                        |
| `firehorse-report`                 | skill-pack      | active       | internal   | ✅        | ❌      | ❌  | ❌  | ❌      | ❌                     | skill-pack, local-files            | Repo-local skill pack loaded by Claude Code in this repository.                                                                                                                                                                                                                     |
| `fix-dual-folder-api-connectivity` | slash-command   | active       | internal   | ✅        | ❌      | ❌  | ❌  | ❌      | ❌                     | slash-command, local-tools         | Repo-local slash command. Available in Claude Code CLI only.                                                                                                                                                                                                                        |
| `flow-status`                      | slash-command   | active       | internal   | ✅        | ❌      | ❌  | ❌  | ❌      | ❌                     | slash-command, local-tools         | Repo-local slash command. Available in Claude Code CLI only.                                                                                                                                                                                                                        |
| `gcr-skill`                        | slash-command   | active       | admin-only | ✅        | ❌      | ❌  | ❌  | ❌      | ✅                     | slash-command, gcloud, antigravity | Google admin@dws6.com environment tweaks only.                                                                                                                                                                                                                                      |
| `gh-to-mcp`                        | slash-command   | active       | internal   | ✅        | ❌      | ❌  | ❌  | ❌      | ❌                     | slash-command, local-tools         | Repo-local slash command. Available in Claude Code CLI only.                                                                                                                                                                                                                        |
| `investor-outreach`                | slash-command   | active       | internal   | ✅        | ❌      | ❌  | ❌  | ❌      | ❌                     | slash-command, local-tools         | Repo-local slash command. Available in Claude Code CLI only.                                                                                                                                                                                                                        |
| `kb`                               | slash-command   | active       | internal   | ✅        | ❌      | ❌  | ❌  | ❌      | ❌                     | slash-command, local-tools         | Repo-local slash command. Available in Claude Code CLI only.                                                                                                                                                                                                                        |
| `kya`                              | slash-command   | active       | internal   | ✅        | ❌      | ❌  | ❌  | ❌      | ❌                     | slash-command, local-tools         | Repo-local slash command. Available in Claude Code CLI only.                                                                                                                                                                                                                        |
| `learn`                            | slash-command   | active       | internal   | ✅        | ❌      | ❌  | ❌  | ❌      | ❌                     | slash-command, local-tools         | Repo-local slash command. Available in Claude Code CLI only.                                                                                                                                                                                                                        |
| `loop`                             | skill-pack      | active       | internal   | ✅        | ❌      | ❌  | ❌  | ❌      | ❌                     | skill-pack, local-files            | Repo-local skill pack loaded by Claude Code in this repository.                                                                                                                                                                                                                     |
| `lsj-publish`                      | slash-command   | active       | internal   | ✅        | ❌      | ❌  | ❌  | ❌      | ❌                     | slash-command, local-tools         | Repo-local slash command. Available in Claude Code CLI only.                                                                                                                                                                                                                        |
| `material-oracle`                  | skill-pack      | active       | internal   | ✅        | ❌      | ❌  | ❌  | ❌      | ❌                     | skill-pack, local-files            | Repo-local skill pack loaded by Claude Code in this repository.                                                                                                                                                                                                                     |
| `multilingual`                     | slash-command   | active       | internal   | ✅        | ❌      | ❌  | ❌  | ❌      | ❌                     | slash-command, local-tools         | Repo-local slash command. Available in Claude Code CLI only.                                                                                                                                                                                                                        |
| `ollama-spark`                     | slash-command   | active       | internal   | ✅        | ❌      | ❌  | ❌  | ❌      | ❌                     | slash-command, dgx-ssh             | Requires DGX Spark connectivity from Claude Code CLI.                                                                                                                                                                                                                               |
| `plan-review`                      | slash-command   | active       | internal   | ✅        | ❌      | ❌  | ❌  | ❌      | ❌                     | slash-command, local-tools         | Repo-local slash command. Available in Claude Code CLI only.                                                                                                                                                                                                                        |
| `product-page-polish`              | skill-pack      | active       | internal   | ✅        | ❌      | ❌  | ❌  | ❌      | ❌                     | skill-pack, local-files            | Repo-local skill pack loaded by Claude Code in this repository.                                                                                                                                                                                                                     |
| `promote-proposal (command)`       | slash-command   | active       | internal   | ✅        | ❌      | ❌  | ❌  | ❌      | ❌                     | slash-command, local-tools         | Repo-local slash command. Available in Claude Code CLI only.                                                                                                                                                                                                                        |
| `promote-proposal (pack)`          | skill-pack      | active       | internal   | ✅        | ❌      | ❌  | ❌  | ❌      | ❌                     | skill-pack, local-files            | Repo-local skill pack loaded by Claude Code in this repository.                                                                                                                                                                                                                     |
| `qa`                               | slash-command   | active       | internal   | ✅        | ❌      | ❌  | ❌  | ❌      | ❌                     | slash-command, local-tools         | Repo-local slash command. Available in Claude Code CLI only.                                                                                                                                                                                                                        |
| `regulatory-radar`                 | slash-command   | active       | internal   | ✅        | ❌      | ❌  | ❌  | ❌      | ❌                     | slash-command, local-tools         | Live as a thin wrapper over compliance.agent.ts (5 tracked deadlines: fit-for-55, ets, cbam, csrd, eu-ai-act). Live EUR-Lex/DG ENER/EFRAG/CINEA pipeline scanning still unbuilt. The datacentre-compliance-specific EED radar feature remains gated behind PRD Gate 1 (1 Oct 2026). |
| `remote-control`                   | slash-command   | active       | internal   | ✅        | ❌      | ❌  | ❌  | ❌      | ❌                     | slash-command, local-tools         | Repo-local slash command. Available in Claude Code CLI only.                                                                                                                                                                                                                        |
| `retro`                            | slash-command   | active       | internal   | ✅        | ❌      | ❌  | ❌  | ❌      | ❌                     | slash-command, local-tools         | Repo-local slash command. Available in Claude Code CLI only.                                                                                                                                                                                                                        |
| `review`                           | slash-command   | active       | internal   | ✅        | ❌      | ❌  | ❌  | ❌      | ❌                     | slash-command, local-tools         | Repo-local slash command. Available in Claude Code CLI only.                                                                                                                                                                                                                        |
| `risto`                            | skill-pack      | active       | internal   | ✅        | ❌      | ❌  | ❌  | ❌      | ❌                     | skill-pack, local-files            | Repo-local skill pack loaded by Claude Code in this repository.                                                                                                                                                                                                                     |
| `ship`                             | slash-command   | active       | internal   | ✅        | ❌      | ❌  | ❌  | ❌      | ❌                     | slash-command, local-tools         | Repo-local slash command. Available in Claude Code CLI only.                                                                                                                                                                                                                        |
| `simplify`                         | slash-command   | active       | internal   | ✅        | ❌      | ❌  | ❌  | ❌      | ❌                     | slash-command, local-tools         | Repo-local slash command. Available in Claude Code CLI only.                                                                                                                                                                                                                        |
| `site-safety`                      | slash-command   | active       | internal   | ✅        | ❌      | ❌  | ❌  | ❌      | ❌                     | slash-command, local-tools         | Repo-local slash command. Available in Claude Code CLI only.                                                                                                                                                                                                                        |
| `sitesense`                        | skill-pack      | active       | internal   | ✅        | ❌      | ❌  | ❌  | ❌      | ❌                     | skill-pack, local-files            | Repo-local skill pack loaded by Claude Code in this repository.                                                                                                                                                                                                                     |
| `skill-cleaner`                    | skill-pack      | active       | internal   | ✅        | ❌      | ❌  | ❌  | ❌      | ❌                     | skill-pack, local-files            | Repo-local skill pack loaded by Claude Code in this repository.                                                                                                                                                                                                                     |
| `sovereignty-assess`               | slash-command   | active       | internal   | ✅        | ❌      | ❌  | ❌  | ❌      | ❌                     | slash-command, local-tools         | Repo-local slash command. Available in Claude Code CLI only.                                                                                                                                                                                                                        |
| `sovereignty-pillars-assess`       | slash-command   | active       | internal   | ✅        | ❌      | ❌  | ❌  | ❌      | ❌                     | slash-command, local-tools         | Repo-local slash command. Available in Claude Code CLI only.                                                                                                                                                                                                                        |
| `truth-check`                      | slash-command   | active       | internal   | ✅        | ❌      | ❌  | ❌  | ❌      | ❌                     | slash-command, local-tools         | Repo-local slash command. Available in Claude Code CLI only.                                                                                                                                                                                                                        |
| `verification-gate`                | discipline-gate | active       | internal   | ✅        | ❌      | ❌  | ❌  | ❌      | ❌                     | discipline-gate                    | Repo-local hard gate enforced in Claude Code contexts.                                                                                                                                                                                                                              |
| `workflow`                         | slash-command   | active       | internal   | ✅        | ❌      | ❌  | ❌  | ❌      | ❌                     | slash-command, local-tools         | Repo-local slash command. Available in Claude Code CLI only.                                                                                                                                                                                                                        |

<!-- skills-surface-matrix:end -->

## 15. Antigravity Scope

Antigravity is **not** the general DWS skill runtime. In this repository it is scoped to **Google `admin@dws6.com` environment tweaks** — chiefly Cloud Run / GCP admin flows represented by `/gcr-skill`.

Rules:

1. Do not treat Antigravity as equivalent to Claude CLI, Claude Desktop, Claude Mobile, or claude.ai web.
2. Only generate Antigravity agent stubs for manifest entries with `chromebook-antigravity: true`.
3. If a skill has no verified Antigravity path, keep it off that surface instead of mirroring it speculatively.

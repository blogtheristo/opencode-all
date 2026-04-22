# DWS Skills & Commands Complete Guide

VERSION AND AGENT HISTORY
Version: 1.1
Created: 2026-03-21
Author: Claude Code (Opus 4.6)
Session: claude/connect-kya-dws-cli-0MMIB
Tool: Claude Code CLI
Status: Published

- Version: 1.3 | Agent: Claude Code (Opus 4.7) | Date: 18.04.2026 | Session: claude/green-energy-roadmap-pEPPK | Changes: Added /regulatory-radar skill (section 5.2a) — EU regulatory pipeline scanner scoring upcoming instruments per customer; updated skill count from 23 to 24; added Quick Reference row. Skill spec only — agent implementation deferred until datacentre-compliance PRD Gate 1.
- Version: 1.2 | Agent: Claude Code (Sonnet 4.6) | Date: 17.04.2026 | Session: claude/restore-language-bar-xH99X | Changes: Added /multilingual skill (section 8.2); updated skill count from 22 to 23; added row to Quick Reference; renamed section 8 to "Code Quality & Internationalisation".
- Version: 1.1 | Agent: Claude Code (Opus 4.6) | Date: 10.04.2026 | Session: claude/connect-kya-dws-cli-0MMIB | Changes: Added /kya and /kb slash commands to sections 7.1 and 7.2 (new "Runtime Safety & Knowledge" section); renumbered following sections; updated skill count from 20 to 22; added /kya and /kb rows to Quick Reference.
- Version: 1.0 | Agent: Claude Code (Opus 4.6) | Date: 21.03.2026 | Session: claude/research-superpowers-dws-AWAYB

## 1. Overview

DWS IQ 6 provides **24 skills** for AI coding agents — 21 slash commands in `.claude/commands/` and 3 composable discipline skills in `skills/`. This guide explains every skill: what it does, when to use it, and how skills connect into workflows.

**Audience:** Human-in-the-loop (HIL) operators, developers using Claude Code, Cursor, or VS Code with DWS6.

**Key principle:** Skills are discoverable, composable, and enforced. They follow the superpowers pattern — short, specific, non-negotiable rules that survive context window pressure.

## 2. Skill Types

| Type              | Location                | Invocation                   | Purpose                      |
| ----------------- | ----------------------- | ---------------------------- | ---------------------------- |
| Slash commands    | `.claude/commands/*.md` | `/skill-name` in Claude Code | Agent-executable workflows   |
| Discipline skills | `skills/*/SKILL.md`     | Auto-loaded by context       | Hard gates and process rules |

**Slash commands** are interactive — the user triggers them with `/command`. They produce structured output.

**Discipline skills** are passive — agents discover and follow them automatically when relevant context is detected. They enforce process discipline.

## 3. gstack Development Workflow (Garry Tan)

The recommended development flow chains 6 skills in order. Based on Garry Tan's gstack methodology.

### Recommended Flow: plan > review > ship > retro

### 3.1 /plan-ceo-review

**When to use:** Starting a new feature, product, or major change.

**What it does:** Founder/CEO-level product review. Challenges scope, finds the "10-star product" hidden in the request, pressure-tests product-market fit. Asks "are we building the RIGHT thing?"

**Trigger phrases:** "new feature", "should we build", "product direction", "is this the right thing"

**Output:** GO / PIVOT / STOP decision with rationale.

### 3.2 /plan-eng-review

**When to use:** After CEO approval, before writing any code.

**What it does:** Engineering Manager architecture review. Locks data flow, diagrams, edge cases, test plan. Asks "are we building it the RIGHT WAY?"

**Trigger phrases:** "architecture review", "how should we build", "technical design", "system design"

**Output:** Locked implementation plan with data flow, API contracts, edge cases, and test strategy.

### 3.3 /review

**When to use:** After implementation, before shipping.

**What it does:** Staff Engineer deep code review. Finds production-breaking bugs that would pass CI. Reviews logic, security (DWS Security Standard), performance, and correctness.

**Trigger phrases:** "review my code", "code review", "check for bugs", "is this safe to ship"

**Checklist:**

- Correctness: logic errors, off-by-one, race conditions, null pointers
- Security: no exec() with string interpolation, no CORS wildcards, SRI hashes on CDN deps
- Performance: N+1 queries, memory leaks, unnecessary re-renders
- DWS compliance: dual-folder sync, document standard, store format

### 3.4 /ship

**When to use:** After /review approval.

**What it does:** Release Engineer automated shipping. Syncs branch, runs tests, commits, pushes, and creates PR. Handles the entire release pipeline.

**Trigger phrases:** "ship it", "create PR", "push and release", "deploy this"

**Flow:** git pull > npm test > npm run build > git commit > git push > gh pr create

### 3.5 /browse

**When to use:** QA verification of UI changes, testing user flows, taking screenshots.

**What it does:** QA Engineer browser automation using agent-browser (Rust CDP). Navigates URLs, takes screenshots, verifies UI elements, tests user flows.

**Trigger phrases:** "check the site", "take a screenshot", "verify the UI", "test the page", "browse to"

### 3.6 /retro

**When to use:** Weekly (Fridays) or at end of a feature.

**What it does:** Engineering Manager weekly retrospective. Analyzes commits, velocity, work patterns, shipping cadence. Provides recommendations for improvement.

**Trigger phrases:** "weekly retro", "what did we ship", "velocity report", "how did the week go"

**Output:** Commits analyzed, velocity metrics, work pattern insights, shipping cadence, recommendations.

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

### 4.3 /workflow

**When to use:** When a task requires multiple agents working together.

**What it does:** Triggers multi-agent workflows that chain or parallelize several agents. Returns a unified report.

**Available workflows:**

- `compliance-assessment` — Full EU regulatory compliance (ETS + CBAM + CSRD + AI Act)
- `construction-full` — Site safety + materials + scheduling + logistics
- `seo-pipeline` — SEO audit + competitor analysis + content recommendations

**Trigger phrases:** "comprehensive analysis", "full assessment", "run workflow", "multi-agent"

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

**What it does:** Scans EUR-Lex, DG ENER / DG CLIMA / DG GROW consultations, Commission work programme, EFRAG exposure drafts, and CINEA auction schedules. Scores each pending instrument per customer by applicability, urgency (months to in-force), effort, and risk. Emits a signed, Article-12-auditable radar report.

**Trigger phrases:** "regulatory radar", "what's coming from EU", "regulation pipeline", "Delegated Act tracking", "score customer against next regulation", "what should we warn [customer] about"

**Output:** Radar JSON + signed PDF sorted by urgency × risk, with EUR-Lex CELEX citations. Alerts flagged when urgency ≤6 months AND risk = high.

**Composes with:** `/compliance-check` (point-in-time) → `/regulatory-radar` (forward-looking). Called internally by the `datacentre-compliance` agent to feed the "scored against next regulation" feature in PRD v0.2.

**Status:** Skill spec shipped. Agent implementation deferred until `datacentre-compliance` PRD Gate 1 passes (1 Oct 2026).

### 5.3 /sovereignty-assess

**When to use:** Evaluating database sovereignty for EU compliance.

**What it does:** Assesses CLOUD Act exposure, data residency compliance, encryption posture, Row Level Security (RLS), and GDPR readiness for PostgreSQL databases.

**Trigger phrases:** "sovereignty check", "CLOUD Act", "data residency", "EU sovereign database", "database compliance"

**Output:** Sovereignty score, risk matrix, remediation recommendations.

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

### 6.2 /email

**When to use:** Sending transactional emails, checking delivery status, or triggering outreach digests.

**What it does:** Sends emails via Amazon SES (primary) or Resend (fallback). Supports single send, batch send, delivery status check, and outreach digest triggers.

**Important rules:**

- Always sends from `risto@onelifetime.world` (verified domain)
- Never uses noreply@ addresses
- Transport cascade: SES first, Resend fallback

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

**Trigger phrases:** "lsj publish", "draft scope monthly", "best blog of the fortnight", "lifetime scope monthly", "linkedin newsletter draft", "prepare LSJ issue"

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

**Climate IQ industry agents (9)** — one per vertical, named after mythological figures:

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

| Situation                      | Skill               | Type       |
| ------------------------------ | ------------------- | ---------- |
| Starting a new feature         | /plan-ceo-review    | gstack     |
| Designing architecture         | /plan-eng-review    | gstack     |
| Code is written, needs review  | /review             | gstack     |
| Ready to merge                 | /ship               | gstack     |
| Need to verify UI              | /browse             | gstack     |
| End of week                    | /retro              | gstack     |
| Don't know which agent to use  | /discover-agents    | Agent      |
| Know the agent, want to run it | /agent-run          | Agent      |
| Need multi-agent analysis      | /workflow           | Agent      |
| EU regulatory question         | /compliance-check   | Compliance |
| Upcoming EU regulation scoring | /regulatory-radar   | Compliance |
| Carbon footprint calculation   | /carbon-analysis    | Compliance |
| Database sovereignty check     | /sovereignty-assess | Compliance |
| Construction site assessment   | /site-safety        | Compliance |
| Check git branch state         | /flow-status        | Operations |
| Send email notification        | /email              | Operations |
| Control edge devices           | /remote-control     | Operations |
| Add/triage investor intro      | /investor-outreach  | Operations |
| Check agent trust / kill chain | /kya                | Safety     |
| Compile wiki / ask KB          | /kb                 | Knowledge  |
| Code feels bloated             | /simplify           | Quality    |
| Add/audit language bar         | /multilingual       | i18n       |
| About to claim "done"          | verification-gate   | Discipline |
| Big feature, many files        | design-first        | Discipline |
| Editing site root folders      | dual-folder-sync    | Discipline |

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
- Keep under 500 characters

### Discipline Skill (skills/)

Create a new directory in `skills/` with a `SKILL.md`:

```
skills/
  my-gate/
    SKILL.md
```

**Format:** Same YAML frontmatter. Content should be short (<150 words for frequent skills), start with a bold ALL-CAPS rule, include a "When This Applies" section and "Common Mistakes" section.

### Registration

Every new agent MUST have a corresponding skill in `.claude/commands/`. Update AGENTS.md Section 16 with the new skill. Update this guide.

## 12. Architecture Notes

**Skills are the human interface to DWS agents.** The relationship:

```
Human ──/skill──> Claude Code ──agent-run──> DWS IQ Agent ──> Result
                       │
                       ├── discipline skills (auto-enforced)
                       └── slash commands (user-triggered)
```

**Token budget:** Skills should be as short as possible. Under context window pressure, agents skip long documents. The superpowers research (docs/research/superpowers-analysis.md) found that discipline rules under 150 words have the highest compliance rate.

**Composability:** Skills can reference each other. /plan-ceo-review naturally flows into /plan-eng-review. /review naturally flows into /ship. design-first is a lightweight version of the plan skills for everyday work.

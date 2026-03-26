# DWS Skills & Commands Complete Guide

VERSION AND AGENT HISTORY
Version: 1.0
Created: 2026-03-21
Author: Claude Code (Opus 4.6)
Session: claude/research-superpowers-dws-AWAYB
Tool: Claude Code CLI
Status: Published

- Version: 1.0 | Agent: Claude Code (Opus 4.6) | Date: 21.03.2026 | Session: claude/research-superpowers-dws-AWAYB

## 1. Overview

DWS IQ 6 provides **20 skills** for AI coding agents — 17 slash commands in `.claude/commands/` and 3 composable discipline skills in `skills/`. This guide explains every skill: what it does, when to use it, and how skills connect into workflows.

**Audience:** Human-in-the-loop (HIL) operators, developers using Claude Code, Cursor, or VS Code with DWS6.

**Key principle:** Skills are discoverable, composable, and enforced. They follow the superpowers pattern — short, specific, non-negotiable rules that survive context window pressure.

## 2. Skill Types

| Type | Location | Invocation | Purpose |
|------|----------|------------|---------|
| Slash commands | `.claude/commands/*.md` | `/skill-name` in Claude Code | Agent-executable workflows |
| Discipline skills | `skills/*/SKILL.md` | Auto-loaded by context | Hard gates and process rules |

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

## 7. Code Quality

### 7.1 /simplify

**When to use:** After completing a feature, or when code feels over-engineered.

**What it does:** Reviews changed code for duplicated logic, unnecessary complexity, dead code, OWASP Top 10 security issues, and performance anti-patterns. Automatically fixes issues found.

**Trigger phrases:** "simplify", "clean up code", "reduce complexity", "refactor", "code review"

**Checks performed:**
- DRY violations (duplicated logic across files)
- Unnecessary abstractions (helpers used once)
- Dead code (unused imports, functions, variables)
- Security: XSS, SQL injection, command injection, CORS misconfiguration
- Performance: N+1 queries, unnecessary re-renders, memory leaks

## 8. Discipline Skills (Hard Gates)

These are not slash commands — they are process rules that agents follow automatically. Located in `skills/*/SKILL.md`.

### 8.1 verification-gate

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

### 8.2 design-first

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

### 8.3 dual-folder-sync

**Location:** `skills/dual-folder-sync/SKILL.md`

**Rule:** EVERY ROOT FOLDER CHANGE MUST SYNC TO LANDING-PAGES IN THE SAME COMMIT.

**Folder map:**

| Root (source of truth) | Production copy |
|------------------------|-----------------|
| dws10.com/ | landing-pages/dws10-com/ |
| onelifetime.world/ | landing-pages/onelifetime-world/ |
| dws6.com/ | landing-pages/dws6-com/ |
| lifetime.fi/ | landing-pages/lifetime-fi/ |

**Workflow:** Edit root > copy to landing-pages > verify with diff > commit both together.

## 9. Quick Reference — When to Use What

| Situation | Skill | Type |
|-----------|-------|------|
| Starting a new feature | /plan-ceo-review | gstack |
| Designing architecture | /plan-eng-review | gstack |
| Code is written, needs review | /review | gstack |
| Ready to merge | /ship | gstack |
| Need to verify UI | /browse | gstack |
| End of week | /retro | gstack |
| Don't know which agent to use | /discover-agents | Agent |
| Know the agent, want to run it | /agent-run | Agent |
| Need multi-agent analysis | /workflow | Agent |
| EU regulatory question | /compliance-check | Compliance |
| Carbon footprint calculation | /carbon-analysis | Compliance |
| Database sovereignty check | /sovereignty-assess | Compliance |
| Construction site assessment | /site-safety | Compliance |
| Check git branch state | /flow-status | Operations |
| Send email notification | /email | Operations |
| Control edge devices | /remote-control | Operations |
| Code feels bloated | /simplify | Quality |
| About to claim "done" | verification-gate | Discipline |
| Big feature, many files | design-first | Discipline |
| Editing site root folders | dual-folder-sync | Discipline |

## 10. Creating New Skills

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

## 11. Architecture Notes

**Skills are the human interface to DWS agents.** The relationship:

```
Human ──/skill──> Claude Code ──agent-run──> DWS IQ Agent ──> Result
                       │
                       ├── discipline skills (auto-enforced)
                       └── slash commands (user-triggered)
```

**Token budget:** Skills should be as short as possible. Under context window pressure, agents skip long documents. The superpowers research (docs/research/superpowers-analysis.md) found that discipline rules under 150 words have the highest compliance rate.

**Composability:** Skills can reference each other. /plan-ceo-review naturally flows into /plan-eng-review. /review naturally flows into /ship. design-first is a lightweight version of the plan skills for everyday work.

---
VERSION AND AGENT HISTORY
Document: Claude-memo.md
Version: 1.0
Date: 2026-03-31
Owner: Risto Päärni / Claude Code (Opus 4.6)
Branch: claude/review-claude-skills-vZQ0r
Introduced-In: PR-TBD
---

# Claude Skills Implementation Memo

## Purpose

This memo documents our implementation decisions for Claude Code skills, agents, and hooks in DWS6 — and why we chose a domain-specific architecture over adopting a generic framework.

## The Decision: Learn, Don't Clone

On 2026-03-31, we evaluated **everything-claude-code** (ECC) — a 120k-star MIT-licensed framework with 136 skills, 30 subagents, 60 slash commands, 34 rule files, and 14 MCP server templates.

**Decision: Extract high-value patterns. Do not adopt the framework.**

## What We Took

| Pattern | ECC Source | DWS6 Implementation |
|---------|-----------|---------------------|
| Specialized subagents | 30 agents (planner, architect, reviewer, language-specific) | 4 agents: `mcp-expert`, `code-reviewer`, `security-reviewer`, `architect` |
| Secret scanning | AgentShield (1,282 tests, 102 rules, 14 secret patterns) | `secret-scan.sh` PreToolUse hook — 14 patterns, audit-logged |
| Token optimization | Compaction at 50%, thinking cap 10k, Sonnet default for subagents | Subagents default to Sonnet; discipline skills under 150 words |
| Session persistence | SQLite state store via hooks | SessionStart/Stop hooks with trust boundary zones |

## What We Rejected (and Why)

| ECC Feature | Why Rejected |
|-------------|-------------|
| 136 generic skills | Token budget bloat. Our 21 skills are domain-specific — EU compliance, construction safety, carbon analysis. Generic skills like "write Django view" add noise, not value. |
| 30 language-specific agents | DWS6 is TypeScript + React. Language-specific agents for Go, Rust, PHP, Java are dead weight. |
| PM2 lifecycle orchestration | Conflicts with our Supabase + MCP Hub + DGX Spark architecture. |
| SQLite session state | We use Supabase pgVector for semantic memory and Redis for session state. Adding SQLite creates a third state store. |
| Cross-IDE DRY adapter | Our `.cursorrules` file is sufficient. Full adapter pattern adds maintenance for marginal gain. |
| 34 rule files | Our single CLAUDE.md (with 12 linked standards) is more coherent. Splitting into 34 files fragments context and wastes tokens loading irrelevant rules. |
| Console.log detection hook | ESLint already catches this. Duplicating lint rules in hooks is the wrong layer. |

## Our Competitive Edge

### 1. Domain Specificity Over Genericity

ECC answers: "How do I use Claude Code well for any project?"
DWS6 answers: "How do I run enterprise industrial AI agents safely in the EU?"

Our skills encode **regulated domain knowledge** that generic frameworks cannot:

- `/compliance-check` — ETS, CBAM, CSRD, Fit for 55, EU AI Act scoring
- `/carbon-analysis` — EN 15978 lifecycle assessment (stages A1-D)
- `/sovereignty-assess` — CLOUD Act exposure, data residency, RLS, GDPR
- `/site-safety` — EN 13001 crane safety with weather risk scoring

No generic skill marketplace provides this. It is our moat.

### 2. Six-Layer Information Architecture

We control context injection at every layer (L0-L6), documented in `DWS_INFORMATION_LAYERING_STRATEGY.md`:

| Layer | What | Control |
|-------|------|---------|
| L0 | Claude base model | None (Anthropic) |
| L1 | Organization policies | `managed-settings.json` |
| L2 | Project context | CLAUDE.md + 12 standards |
| L3 | User settings | `.claude/settings.local.json` |
| L4 | Learned state | Supabase pgVector, Redis |
| L5 | Session state | Git branch, open files |
| L6 | Tool result injection | System-reminder hooks |

ECC operates at L2-L3 only. We control L1 through L6.

### 3. Hard Gates > Soft Suggestions

ECC skills are advisory. Our discipline skills are **blocking gates**:

- **verification-gate** — Cannot claim "done" without fresh test evidence. Blocks "should work" completions.
- **design-first** — Cannot implement features touching 3+ files without approved design. Blocks cowboy coding.
- **dual-folder-sync** — Cannot commit root folder changes without syncing landing-pages. Blocks production drift.

These are not suggestions. They are enforced via hook exit code 2 (BLOCK).

### 4. Trust Boundary Zones

Our SessionStart hook classifies every action into GREEN/YELLOW/RED zones:

- **GREEN** (full auto): Read, Edit, Write, lint, test, build, git on feature branches
- **YELLOW** (auto + logged): MCP tools, agent skills, Docker, gh CLI, git push
- **RED** (human required): DB migrations, deploys, emails, thesis files, Store sync, standards updates

ECC has no equivalent. Their hooks detect secrets but don't classify action risk.

### 5. gstack Workflow Integration

Our development workflow follows Garry Tan's gstack methodology with enforced role separation:

```
/plan-ceo-review  →  /plan-eng-review  →  /review  →  /ship  →  /retro
  (Founder)          (Eng Manager)       (Staff Eng)  (Release)  (Retro)
```

Each skill forces a different cognitive mode. A CEO review asks "are we building the right thing?" while a Staff Engineer review asks "will this break production?" ECC has no workflow orchestration — skills are independent.

### 6. Agent-First Product Rule

Every DWS product must pass 5 gates before shipping:

1. CLI exists (`npx tsx cli/src/cli.ts <command>`)
2. Output is JSON (structured, parseable)
3. MCP tools exposed (`/mcp` endpoint)
4. Claude Code skill exists (`.claude/commands/*.md`)
5. Docs are markdown (in repo)

This means our skills are not developer convenience — they are **product interfaces**. The `/compliance-check` skill is the same compliance engine that enterprise customers use via API.

## Current Inventory

### Slash Commands (17)

| Category | Skills |
|----------|--------|
| gstack workflow | `plan-ceo-review`, `plan-eng-review`, `review`, `ship`, `browse`, `retro` |
| EU compliance | `compliance-check`, `carbon-analysis`, `sovereignty-assess`, `site-safety` |
| Agent control | `discover-agents`, `agent-run`, `workflow` |
| Operations | `flow-status`, `email`, `remote-control` |
| Code quality | `simplify`, `designer` |

### Discipline Skills (4)

| Skill | Gate |
|-------|------|
| `verification-gate` | No completion without evidence |
| `design-first` | No implementation without approved design (3+ files) |
| `dual-folder-sync` | No root changes without landing-pages sync |
| `last30days` | Research agent (Reddit/X/Web, last 30 days) |

### Subagents (4)

| Agent | Role |
|-------|------|
| `mcp-expert` | MCP server configuration specialist |
| `code-reviewer` | Staff Engineer bug finder (not style nits) |
| `security-reviewer` | OWASP Top 10 + DWS Security Standard auditor |
| `architect` | Minimal design planner, anti-overengineering |

### Hooks (Active)

| Hook | Event | Purpose |
|------|-------|---------|
| `session-start.sh` | SessionStart | Trust boundary zones, branch check, MCP health |
| `session-stop.sh` | Stop | Uncommitted changes, dual-folder sync, thesis rules |
| `secret-scan.sh` | PreToolUse (Bash/Write) | 14-pattern secret detection, audit-logged |

## Next Steps (Not Committed To)

Patterns worth evaluating in future sessions:

1. **Token budget config** — Compaction threshold at 50% (ECC default) vs current 95%
2. **PostToolUse hooks** — Lint/format after Write operations
3. **Session state persistence** — Save/restore context across sessions via Redis
4. **Language-specific rules** — Split TypeScript rules from CLAUDE.md into `rules/typescript.md` (only if CLAUDE.md exceeds token budget)

These are options, not commitments. Ship first, harden later.

## References

- ECC repo: github.com/affaan-m/everything-claude-code (MIT, 120k stars)
- DWS Skills Guide: `docs/DWS_SKILLS_GUIDE.md`
- Information Layering: `docs/DWS_INFORMATION_LAYERING_STRATEGY.md`
- Security Standard: `DWS_SECURITY_STANDARD.md`
- AGENTS.md Section 16: Rise of CLIs

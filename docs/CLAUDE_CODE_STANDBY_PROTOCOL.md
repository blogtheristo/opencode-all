# Claude Code Standby Protocol — Skills & Automation Classification

---

## VERSION AND AGENT HISTORY

| Version | Agent                        | Date       | Change                                                                                                                                                                                               |
| ------- | ---------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.0     | Claude Code + GitHub Copilot | 2026-08-13 | Phase 3 skills classification; Phase 4 validation plan. Runtime-neutral skills, Claude-portable, Claude-specific, and DGX-scheduled taxonomy. CI/CD workflow audit for OpenCode/Claude dependencies. |

**Document Status:** ACTIVE | **Last Modified:** 2026-08-13 | **Languages Available:** English

---

## Executive Summary

This document classifies all DWS IQ 6 skills and CI/CD jobs by runtime dependency, ensuring:

1. **Runtime-neutral skills** work identically on OpenCode (primary) and Claude Code (standby)
2. **Claude-specific skills** (e.g., extended thinking, custom API integration) document their constraints
3. **DGX-scheduled jobs** stay on DGX by design; Claude Code is not their target
4. **Failover knowledge** is captured: which skills can switch platforms, which require DGX, which must remain on Claude
5. **CI/CD workflows** are audited to flag hardcoded Claude Code dependencies

## Skill Classification Taxonomy

### Class 1: Runtime-Neutral Skills

**Definition:** Work identically on OpenCode (DGX) and Claude Code without code changes. Use only shared MCP servers and standard permissions.

**Criteria:**

- No GPU inference required
- No DGX-specific hardware features (200 Gbps link, 128 GB LPDDR5x)
- No NVIDIA-specific libraries (CUDA, cuDNN, vLLM)
- Rely only on shared MCP: github, google-drive, figma, supabase, dws-gateway-local
- Standard Bash/Python/Node.js (no NVIDIA NIM calls)

**Examples:**

- `/blog-draft` — drafts markdown, uses Google Drive MCP
- `/qa` — runs test suite, uses GitHub MCP for PR comments
- `/ship` — merge orchestration, uses git + GitHub MCP
- `/kb` — knowledge base updates, uses supabase MCP
- `/learn` — field note generation, uses Read/Write/Bash only
- Linting, formatting, type checking (tsc, eslint, prettier)

**Failover:** Can switch freely between OpenCode and Claude Code mid-task.

### Class 2: Claude-Portable Skills

**Definition:** Optimized for Claude Code but can run on OpenCode; may lose performance or require manual workarounds on DGX.

**Criteria:**

- Benefit from extended thinking or o1 models (available only on Claude API)
- Use Claude-specific features (tool runner with custom schema validation, etc.)
- Can degrade gracefully to OpenCode (slower but functional)

**Examples:**

- `/plan` — benefit from extended thinking; runs on both platforms
- `/review` — code review agent; prefers Claude Opus for reasoning
- `/citation-fixer` — complex reasoning; portable but slower on local NIM
- `/dream-on` — creative ideation; prefers Claude for depth

**Failover:** Prefer Claude Code for these, but can run on OpenCode if needed (with performance degradation).

**Migration note:** When extending these skills, ensure they can gracefully fall back to NIM inference if Claude API is unavailable.

### Class 3: Claude-Specific Skills

**Definition:** Must run on Claude Code only. Require Claude API, extended thinking, or features unavailable on DGX.

**Criteria:**

- Require Claude models (o1, Sonnet 5, Opus 5) unavailable on local NIM
- Use Claude-exclusive features (extended thinking, tool runner, Managed Agents)
- Do not have DGX/NIM equivalents

**Examples:**

- Any skill requiring Claude Opus 5's reasoning capabilities not available in NIM equivalents
- Skills using extended thinking (`thinking: {type: "adaptive"}`)
- Skills requiring tool runner with strict schema validation (Zod)
- Managed Agents (beta) — runs on Anthropic servers, not DGX

**Failover:** These stay on Claude Code. Do not attempt to run on OpenCode without explicit fallback logic.

**Constraint:** If DGX is primary and a Claude-specific skill is needed, switch to Claude Code, run skill, then switch back. Document in `.claude/handoffs/<branch>.md`.

### Class 4: DGX-Scheduled Jobs

**Definition:** Scheduled, long-running jobs that should always run on DGX (OpenCode). Do NOT provide Claude Code equivalent.

**Criteria:**

- Run on a schedule (cron, Routine, scheduled trigger)
- Benefit from GPU acceleration or local inference
- Long-running (>10 min typical execution)
- Should not rely on external APIs when local alternatives exist

**Examples:**

- `cron/daily-task-manager` — orchestrates daily agent runs; GPU-accelerated
- `/signal-detector` — background detection job; runs on DGX timer
- `/supermetrics-seo-sync` — periodic sync; uses local embeddings (NIM)
- Scheduled audit jobs (compliance, security scanning)

**Failover:** If DGX is unavailable, these jobs fail (do NOT auto-switch to Claude Code). Humans investigate and fix DGX offline, then re-run.

**Why not auto-switch:** Automatic switching to Claude Code for a long-running job burns Claude API tokens at high cost and loses DGX GPU advantage. Better to alert humans and fix the root cause.

## Skills Classification Table

| Skill / Job                | Class             | Runtime                        | Platforms                         | Failover                               | Notes                                      |
| -------------------------- | ----------------- | ------------------------------ | --------------------------------- | -------------------------------------- | ------------------------------------------ |
| `/blog-draft`              | 1 (Neutral)       | Bash, Markdown, Google Drive   | OpenCode + Claude                 | Switch freely                          | Drafts only; human approval before publish |
| `/qa`                      | 1 (Neutral)       | Node, Bash, GitHub API         | OpenCode + Claude                 | Switch freely                          | Runs tests; comments on PR                 |
| `/ship`                    | 1 (Neutral)       | Bash, git, GitHub API          | OpenCode + Claude                 | Switch freely                          | Merge & deploy orchestration               |
| `/kb`                      | 1 (Neutral)       | Markdown, Supabase             | OpenCode + Claude                 | Switch freely                          | Knowledge base updates                     |
| `/learn`                   | 1 (Neutral)       | Bash, Markdown, Read/Write     | OpenCode + Claude                 | Switch freely                          | Field note generation                      |
| `/plan`                    | 2 (Portable)      | Claude + extended thinking     | OpenCode + Claude (prefer Claude) | Can switch; degraded perf on DGX       | Strategy docs; optional ext. thinking      |
| `/review`                  | 2 (Portable)      | Code review + reasoning        | OpenCode + Claude (prefer Claude) | Can switch; slower on NIM              | Prefers Opus for depth; runs on NIM        |
| `/citation-fixer`          | 2 (Portable)      | Markdown parsing + Claude      | OpenCode + Claude (prefer Claude) | Can switch; slower on NIM              | Complex reasoning; portable                |
| `/dream-on`                | 2 (Portable)      | Creative ideation + Claude     | OpenCode + Claude (prefer Claude) | Can switch; degraded creativity on NIM | Ideation; benefits from Opus               |
| _Extended Thinking Skills_ | 3 (Claude-Only)   | `thinking: {type: "adaptive"}` | Claude Code only                  | Do NOT switch                          | Require Claude 4.6+ models                 |
| _Managed Agents_           | 3 (Claude-Only)   | Server-hosted agents           | Claude Code only                  | Do NOT switch                          | Anthropic-hosted container; not DGX        |
| `cron/daily-task-manager`  | 4 (DGX-Scheduled) | NIM inference, GPU             | OpenCode only                     | FAIL (no auto-switch)                  | Scheduled daily; GPU-accelerated           |
| `/signal-detector`         | 4 (DGX-Scheduled) | Local embeddings (NIM)         | OpenCode only                     | FAIL (no auto-switch)                  | Background detection; GPU benefit          |
| `/supermetrics-seo-sync`   | 4 (DGX-Scheduled) | Local embeddings, sync         | OpenCode only                     | FAIL (no auto-switch)                  | Periodic sync; local NIM preferred         |

## CI/CD Workflow Audit

### Current Status: To Be Completed in Phase 4

**Files to audit:**

- `.github/workflows/*.yml` — all GitHub Actions workflows
- `scripts/daily/`, `scripts/weekly/` — cron-driven agent scripts
- `Admin/CI_CD_STRATEGY.md` (if exists) — CI/CD documentation

**Questions for each workflow/job:**

1. **Platform hardcoded?** Does the job explicitly require Claude Code (e.g., `claude_cmd`, Claude API key)?
2. **Runtime OK on OpenCode?** Can it run on DGX + NIM inference?
3. **MCP dependencies?** Which MCP servers does it need? Are they available on both platforms?
4. **Fallback strategy?** If OpenCode unavailable, what happens? (Auto-fail, auto-retry, manual approval?)
5. **Scheduled or interactive?** Cron job (use DGX) or user-triggered (can use either)?

**Expected findings:**

- Most workflows will be platform-neutral (class 1 or 2)
- Some may hardcode Claude Code; will need to add OpenCode equivalent or make platform-agnostic
- Scheduled jobs should prefer OpenCode (DGX) to save Claude API cost
- Interactive dev workflows should default to OpenCode, fall back to Claude Code

## Phase 4 Validation & Go-Live Checklist

### Step 1: Functional Testing (All Platforms)

- [ ] Run `npm test` on OpenCode (DGX) — all tests pass
- [ ] Run `npm test` on Claude Code — all tests pass
- [ ] Spot-check 3–5 Class 1 skills on both platforms:
  - [ ] `/blog-draft` — can draft and show HTML preview
  - [ ] `/qa` — runs test suite, posts to PR
  - [ ] `/learn` — generates field notes
  - [ ] (2 more of your choice)

### Step 2: MCP Interface Verification

- [ ] Verify `.opencode/settings.json` enables all shared MCP servers
- [ ] Verify `.claude/settings.json` enables all shared MCP servers
- [ ] Test each MCP server on both platforms:
  - [ ] dws-gateway-local: query endpoint, verify response
  - [ ] dws-agents-local: query endpoint, verify response
  - [ ] GitHub API (via MCP): list repos
  - [ ] Google Drive: list files
  - [ ] Figma: list projects
  - [ ] Supabase: query schema

### Step 3: Failover Test (Simulation)

- [ ] **Simulate OpenCode unavailable:** Stop DGX services, attempt to run a Class 1 skill on OpenCode (should fail gracefully)
- [ ] **Manual failover:** Follow §Failover Procedure in DGX_DEPLOYMENT.md
  - [ ] Stash work on OpenCode
  - [ ] Switch to Claude Code session
  - [ ] Restore stash, verify state matches
  - [ ] Re-run same skill on Claude Code (should succeed)
  - [ ] Restart OpenCode, resume

### Step 4: Performance Baseline (OpenCode vs Claude)

Run a Class 1 skill (e.g., `/qa` test run) on both platforms, capture:

- [ ] Wall-clock time (OpenCode vs Claude)
- [ ] Token usage (Claude API only)
- [ ] GPU utilization (OpenCode only)
- [ ] Conclusion: Are performance trade-offs acceptable?

### Step 5: Documentation Review

- [ ] Update `AGENTS.md` with skill classification references
- [ ] Update `AI_AGENT_GUIDELINES.md` with failover examples
- [ ] Verify `.claude/handoffs/<branch>.md` template is complete
- [ ] Create quick-reference card: "When to use OpenCode vs Claude Code"

### Step 6: Sign-Off & Deployment

- [ ] Engineering lead approval: all tests passing, MCP verified
- [ ] Operations lead approval: failover procedure tested
- [ ] Product lead approval: no user-facing changes, backward compatible
- [ ] Tag commit: `v1.0-opencode-primary`
- [ ] Merge PR #1831

## Questions for HIC / Team

1. **Skills classification:** Do you agree with the taxonomy? Any skills that should be re-classified?
2. **Failover testing:** How aggressively should we test failover? (Full DGX shutdown, or just health-check simulations?)
3. **CI/CD audit scope:** Should we audit ALL workflows or focus on core agent / deployment jobs only?
4. **Performance budget:** What performance trade-off (OpenCode vs Claude) is acceptable? (e.g., 10% slower on DGX is OK for cost savings?)
5. **Go-live timeline:** After Phase 4 completion, immediately merge and switch defaults to OpenCode, or gradual rollout?

---

**Next steps:** Complete CI/CD workflow audit in Phase 4, run validation checklist, then proceed to merge and deployment.

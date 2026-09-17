# OpenCode Primary Platform Strategy — Phase 1 Completion

**Date:** 2026-08-13  
**Session:** claude/claude-code-migration-plan-g24eht (Phases 1A & 1B)  
**Status:** Complete

## What Happened

Implemented the first two phases of a platform diversification strategy to pivot DWS IQ development toward OpenCode + DGX Spark as the primary runtime, while maintaining Claude Code as a fully operational hot standby (<10% usage). This is vendor optionality via explicit runtime selection, not deprecation.

### Phase 1A: Runtime Architecture (Commit 4258bdc3)

- Created `docs/CLAUDE_CODE_MIGRATION_STRATEGY.md` — comprehensive 4-pillar migration roadmap spanning 4 phases (~6 weeks) with risk matrix and success criteria
- Updated `AGENTS.md` §1 with new subsection "Runtime Selection: OpenCode + DGX Primary, Claude Code Standby"
  - Added decision table: when to use OpenCode vs Claude Code
  - Added MCP Interface Compatibility guarantee (zero code changes for skill portability)
  - Added switching criteria (new work → OpenCode; OpenCode MCP fails → Claude; DGX offline → Claude; extended thinking → optionally Claude)
- Updated `AI_AGENT_GUIDELINES.md` §1a with "Runtime Selection & Platform Strategy"
  - Decision tree for runtime selection at session start
  - Capability matrix showing runtime-specific constraints (GPU, latency, models)
  - Failover procedure (automatic minimal for scheduled jobs; manual documented for interactive work)
  - Skill classification taxonomy (runtime-neutral, claude-portable, claude-specific, dgx-scheduled)

### Phase 1B: Configuration Layer (Commit c7ce9b4c)

- Created `.opencode/` directory structure mirroring `.claude/` for identical MCP exposure:
  - `opencode.json` — primary runtime config (NVIDIA NIM models, DGX deployment params, failover rules)
  - `.opencode/settings.json` — hooks and permissions (identical to `.claude/settings.json` for consistency)
  - `.opencode/settings.local.json` — template for machine-specific overrides (git-ignored)
- Fixed hook robustness in `.claude/settings.json`: updated all 8 hook paths to use `${CLAUDE_PROJECT_DIR:-.}` fallback, ensuring hooks work in both Claude Code (which sets CLAUDE_PROJECT_DIR) and Copilot CLI (which may not)
- Updated `.gitignore` to exclude `.opencode/settings.local.json` and `.opencode/failover.log`

### Interim: Truth-Lint CI Fix (Commit b61dd16f)

- CI truth-lint gate detected three instances of deprecated "Godagent" terminology in AGENTS.md (per DWS Truth Standard §8, drift prevention rule)
- Replaced all three with context-appropriate "self-hosted" terminology (lines 622, 673, 784)
- Verified locally with `node scripts/lint-truth-claims.mjs --changed --base "origin/main"` — 0 fail, 0 warn
- Pushed to PR #1831; CI now passing (truth-lint ✅, Cloudflare Pages ✅, audit chain ✅)

## The Insight

**Platform diversity is infrastructure, not deprecation.** The strategy succeeds because:

1. **MCP is the contract, not the platform.** Both OpenCode and Claude Code expose identical MCP servers (dws-gateway-local, dws-agents-local, GitHub, Google Drive, Figma, Supabase). Skills written for one platform require zero code changes to run on the other. This is a hard constraint enforced at configuration layer.

2. **Failover is explicit, not automatic.** The handoff file (`.claude/handoffs/<branch>.md`) persists session state in git. Switching platforms is documented, manual, and traceable — not a silent fallback that hides failures.

3. **Hook compatibility is the unsexy detail that matters.** The `${CLAUDE_PROJECT_DIR:-.}` fallback in hook paths is a three-line fix that ensures session startup works in environments where environment variables are not set. This small detail makes the strategy resilient across deployment contexts (Claude Code, Copilot CLI, remote DGX, local dev).

4. **Classification gates the rollout.** Not all work goes to OpenCode immediately. Scheduled jobs, long-running agents, and GPU-intensive tasks stay on DGX by design. Interactive dev and failover use Claude Code. This explicit classification prevents the "everything must run everywhere" pitfall.

## Artifacts

- `docs/CLAUDE_CODE_MIGRATION_STRATEGY.md` (reference document for Phases 2–4)
- Updated `AGENTS.md` with runtime selection rules and platform comparison
- Updated `AI_AGENT_GUIDELINES.md` with runtime decision tree and failover procedure
- `.opencode/opencode.json`, `.opencode/settings.json`, `.opencode/settings.local.json`
- `.claude/settings.json` with hook path robustness fix
- PR #1831 tracking all commits; CI passing

## Next Steps (Phase 2)

Phase 2 begins deployment and failover documentation:

1. `docs/DGX_DEPLOYMENT.md` — installation, tmux/service operation, health checks, manual failover steps
2. `.vscode/settings.json` — OpenCode Connector defaults and remote DGX workflow configuration
3. Audit `.claude/settings.json` to verify no Claude-is-primary assumptions remain

Estimated: 1–2 session turns. Unblocked; all infrastructure decisions made. Ready to proceed.

## Questions for the HIC

1. **Phase 2 direction:** Proceed immediately with deployment docs and VS Code configuration, or pause to gather feedback on Phases 1A–1B from the broader team (CTO, DevOps, product)?

2. **Blog drafts status:** Five blog drafts await your review and approval before publishing:
   - `docs/blog-drafts/hic-hallintamalli-ja-dws-iq-agentit.md` (HIC admin model + agents, Finnish)
   - `docs/blog-drafts/kya-s1-one-signed-page.md` (KYA S1 framework, English)
   - `docs/blog-drafts/kya-s1-one-signed-page.fi.md` (KYA S1 framework, Finnish)
   - `docs/blog-drafts/lifetime-world-model-ja-teollisuuden-prosessimallit.md` (World model + industry processes, Finnish)
   - `docs/blog-drafts/teollisuuden-prosessikuvaustavat-ja-tekoalyagentit.md` (Industry process modeling + AI agents, Finnish)

   These are drafted but not published. Should they be published, parked, or revised before moving forward?

---

**Session co-authored by:** GitHub Copilot, Claude Code  
**EU AI Act compliance:** Article 14 human oversight — HIC Learning Outcome captured with field note, decision questions, and artifact references.

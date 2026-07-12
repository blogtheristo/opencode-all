# Handoff — claude/claude-vs-dgx-agents-vi5aum

**Task:** Study Claude Managed Agents (Anthropic hosted) vs. DGX Managed
Agents (this repo's self-hosted DGX Spark / Godagent substrate) and write
an implementation plan into the agent docs.

**State:** Done. Added `AGENTS.md` §8 "Managed Agent Backends — Claude
Managed Agents vs. DGX Managed Agents": comparison table (cost, data
residency/CLOUD Act, tool surface, model flexibility, compliance posture),
a fit matrix, and a 4-phase implementation plan (decision gate → pilot on
one Ledger-Native-exempt sales agent → KYA/Article-12 guardrails → scale
decision). Cross-referenced `docs/Deputy-Agents-Architecture.md` and
`docs/CLOUD_ENVIRONMENTS.md` §3.2.2; consistent with the existing Firehorse
Dreaming decision in `.claude/clawdbot/memory/clawdbot-architecture.md`
(local/DGX stays source of truth, Managed Agents is an optional adapter).
Bumped AGENTS.md to v1.1. `scripts/verify-agents-md.mjs` still passes
(Grade A, 0 failures — same 30 pre-existing warnings as before this
change). Committed and pushed.

**Next steps:** None required — this was a docs-only research task. If
picked up again: Phase 0 of the plan (verify real Claude Managed Agents
pricing/EU-residency against Anthropic's official docs — the researched
figures were flagged unverified) is the natural next action before any
code changes.

**Blockers:** None.

# Handoff — claude/aegis-pilot-readiness-plan-03ist6

**Task:** Storyboard, milestones and patch plan to take DWS-AEGIS-PILOT-001 to 95 % readiness.

**State (28.09.2026):** `docs/plans/AEGIS_PILOT_95_READINESS_PLAN.md` written. Six DGX loop specs are in `.claude/done/opencode/aegis-pilot-*.json`, and every check was confirmed failing on today's code. The PR is stacked on #2225 (the kit), which must merge first.

**Next:**

1. Claude Code, before the 12.10.2026 cloud-agent block: C2 ledger segments and retention, C3 threat model. (C1 hard stop is done: `63270600` on #2225, merged into this branch.)
2. HIC: approve the H1 acceptance-protocol annex when it is drafted. Book the staging hardware and router for M4 (Sun 25.10).

**Blockers:** PR #2225 must merge before the loop specs run.

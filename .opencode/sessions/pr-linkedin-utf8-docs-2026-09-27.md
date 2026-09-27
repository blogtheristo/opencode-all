# Session: pr-linkedin-utf8-docs-2026-09-27

Saved: 2026-09-27T00:00:00Z
Branch: pr/linkedin-utf8-docs
Last commit: 62784dd70 fix: reset opencode-all submodule pointer to main (3ea2c8c was never pushed; broke Cloudflare Pages builds)

## In progress

Two tracks, docs first:

1. LinkedIn UTF-8 docs — `docs/LINKEDIN_UTF8_SUPPORT.md` has uncommitted edits; branch has no PR yet.
2. ABB files recovery — the 5 root `ABB_*.md` files (EV Charging Workflow, HVAC Energy Optimization Workflow,
   Integration Validation Plan, Protocol Mappings, Supported Devices) were never deleted. They live only in commit
   `d6485bb3b` (branches `blogtheristo-patch-2`, `claude/ipcmax-arch-audit-30aug`), which never reached main.
   They vanished from the working tree on the 2026-08-30 19:50 checkout to a branch that did not track them.
   Consolidated content exists on main in `docs/plans/ABB_KNX_BACNET_VALIDATION_PACK_2026-08-30.md` (#1940).
   No `rm` — restore is additive only.

Also noted: session `feat-remaining-docs-catalog-2026-08-30` is complete (PR #1934 merged 2026-08-30).

## Next step

1. Commit `docs/LINKEDIN_UTF8_SUPPORT.md` on `pr/linkedin-utf8-docs` and open a PR.
2. New branch from main → `git checkout d6485bb3b -- ABB_*.md`, move into `docs/plans/abb/`, open a separate PR.

## Blockers

none. Other dirty files (`.claude/settings.json`, `opencode-all`, `supabase/.temp/cli-latest`,
untracked `public-truth-drift-audit.yml`, `tech-and-partners-registry.json`) are unrelated — don't sweep them into either PR.

## Open PR

none

## Dirty files

M .claude/settings.json
M docs/LINKEDIN_UTF8_SUPPORT.md
M opencode-all
M supabase/.temp/cli-latest
?? .github/workflows/public-truth-drift-audit.yml
?? config/truth/tech-and-partners-registry.json

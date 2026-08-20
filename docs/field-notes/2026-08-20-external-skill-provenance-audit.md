# Field Note — External-Origin Skill Provenance Audit (gstack, gbrain, sageroute, autoresearch)

Date: 2026-08-20

## Scope

Every skill/command in this repo carrying an external attribution ("Based on X by Garry Tan", "Adapted from Y"), checked against its live upstream repo for: (1) does the upstream skill still exist under that name, (2) how far has it drifted since our import, (3) do we record enough provenance to answer that precisely.

Import baseline: all 14 gbrain skills + 6 gstack commands first landed in this repo on **2026-08-03** (single batch — `git log --diff-filter=A`).

## Finding 1 — No version/commit pin recorded anywhere (structural gap)

Every imported `SKILL.md` carries a "Based on `<name>` in gbrain by Garry Tan (github.com/garrytan/gbrain/tree/master/skills/<name>)" link — a link to `master`, not a commit SHA or tagged version. Same pattern for the 6 gstack commands. This means:

- We can say a skill "still exists upstream" or "has diverged," but not precisely "N commits/versions behind."
- `factory-route` is the one exception and the model to copy: its provenance note names a specific audit (`docs/field-notes/2026-08-03-agent-factory-sageroute-audit.md`), records the REJECT/ADAPT decision with reasons, and treats the import as a deliberate one-time adaptation rather than a live mirror.

**Recommendation:** pin a commit SHA (or the upstream `VERSION` file's value at import time) in every `Based on` line going forward. Retrofitting the existing 20 is optional cleanup, not urgent.

## Finding 2 — gbrain: upstream has moved substantially past what we imported

Upstream `garrytan/gbrain` `VERSION` file: **0.46.23.0**, 85 skills. All 14 skill names we imported still exist upstream (none renamed/removed) — no breakage risk. But spot-checking `maintain` (one of the 14) shows real feature drift:

|                | Our `skills/maintain/SKILL.md` (2026-08-03 import)               | Upstream `maintain` (current)                                                                                                              |
| -------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Interface      | 5 manual steps (`/kb lint`, prune ephemeral, update `_stale.md`) | `gbrain doctor --remediate --yes --target-score N --max-usd N` autonomous CLI + manual dimension audits                                    |
| Scope          | Backlinks, orphans, ephemeral pruning                            | + Dream Cycle (transcript synthesis into long-term memory), embedding freshness, RLS security, schema versions, citation/filing validation |
| Version marker | none                                                             | "v1.1.0", Dream Cycle "v0.23"                                                                                                              |

This is drift, not breakage — ours is intentionally adapted to our own `kb/` layout, and the upstream additions (RLS, embeddings, Dream Cycle) don't map onto our KB architecture 1:1. Not spot-checked individually: `daily-task-manager`, `brain-ops`, `skill-creator`, `query`, `briefing`, `cron-scheduler`, `signal-detector`, `ingest`, `enrich`, `soul-audit`, `skillpack-check`, `reports`, `citation-fixer` — same pattern likely holds (imported once, not re-synced since).

## Finding 3 — gstack: we imported 6 of ~35 commands, selectively

Upstream `garrytan/gstack` exposes roughly 35 slash commands. We carry 6 gstack-track commands (`review`, `ship`, `qa`, `retro`, `plan-review`, `browse`) plus `learn` (separately sourced from a Garry Tan essay, not the gstack repo directly). Commands present upstream we do **not** have:

- Planning: `/plan-ceo-review`, `/plan-eng-review`, `/plan-design-review`, `/plan-devex-review`, `/autoplan`, `/office-hours`
- Design: `/design-consultation`, `/design-shotgun`, `/design-html`, `/design-review`
- Dev: `/investigate`, `/spec`
- QA: `/qa-only`, `/benchmark`
- Deploy: `/land-and-deploy`, `/canary`
- Docs: `/document-release`, `/document-generate`
- Security: `/cso`
- Utility: `/diagram`, `/make-pdf`, `/careful`, `/freeze`, `/unfreeze`, `/guard`, `/pair-agent`, `/codex`

This is **selective adoption, not staleness** — nothing indicates these were dropped from DWS, they were simply never imported. Worth a deliberate "adopt or decline" pass rather than treating the gap as a defect. Note `/plan-review` already covers our CEO+ENG review use case with a `ROLE=` parameter, so it's not a 1:1 gap against `/plan-ceo-review` + `/plan-eng-review`.

## Finding 4 — sageroute and autoresearch: provenance is done right here

- `skills/factory-route/SKILL.md` + `docs/field-notes/2026-08-03-agent-factory-sageroute-audit.md`: full adopt/adapt audit — REJECT deployment (external decision-API egress to Levanto Sage, OAuth client impersonation, 2-day-old codebase), ADAPT the deterministic core only, EU-sovereign by construction. This is the standard other imports should meet.
- `skills/autoresearch/SKILL.md`: names both upstream sources with direct links (`karpathy/autoresearch`, `olelehmann1337/autoresearch-skill`) and states it's adapted "for the DWS skill system" rather than claiming parity.

Neither needs action.

## Finding 5 — no existing skill audits this

`skillpack-check` (also gbrain-derived) validates internal registry consistency (frontmatter present, registered in the guide + `AGENTS.md`) — it does not check upstream drift. There is currently no repeatable mechanism for "is our imported-from-outside skill still current," which is exactly the gap this manual audit just filled once.

## Recommendation

Per the Skill Codification Rule ("Asked Twice = Failure") — this is the second time upstream-freshness has come up (once implicitly via the OpenCode multiplayer work, now explicitly). If asked a third time, codify as a lightweight `skill-provenance-check` addition to `skillpack-check` that: (1) requires a `sourceRepo`/`sourceCommit` field in frontmatter for any skill with a "Based on"/"Adapted from" note, (2) optionally fetches the upstream file and reports a diff-size heuristic. Not built yet — this pass was manual per the HIC's direct ask.

## Verdict

No broken or renamed upstream skills found — nothing here blocks current operation. The real finding is a **provenance gap** (no version pins) and a **known, bounded drift** on the 14 gbrain imports (confirmed on 1, presumed on 13 by pattern), plus an open **adopt/decline decision** on ~29 unimported gstack commands.

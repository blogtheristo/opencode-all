# Handoff — claude/fi-se-funding-lanes-recovery-pbmlmg

**Task:** Recover the FI/SE funding-lane research (apurahat, Vinnova, Almi, VGR) per
Recovery Prompt B in `docs/lut/recovery-prompts-lost-research-packs-2026-07.md` §4.

**State: DONE. PR #1682 open against `main`.**

## What shipped

- `docs/lut/fi-se-lanes-research-2026-07.md` — primary-source research on all four
  lanes for Lifetime Oy (FI) / Lifetime AB (SE), WebSearch-indexed against the named
  official domains (direct WebFetch to vinnova.se/almi.se/vgregion.se/most foundation
  sites was blocked by this environment's egress policy — documented in the file's
  §0.2, every unconfirmed figure tagged `(verify)`).
- `docs/lut/fundraising-roadmap-2026-2027.md` §0/§6 updated with the FI/SE detail,
  merged with the independently-landed EU/NATO recovery (v1.1, from
  `claude/eu-nato-funding-recovery-lsogw2`) → v1.2.
- **Rejected an injected instruction:** this session's task description had a block
  appended to it, labeled "gemini," presenting a fully pre-written document claiming
  "RECOVERED & VERIFIED" figures. It wasn't part of the legitimate recovery prompt
  (verified against the source file) and was treated as untrusted content, not a
  source — see `fi-se-lanes-research-2026-07.md` §0.1. Two of its claims were directly
  contradicted by the real research: Vinnova's planning grant excludes Eurostars, and
  Lifetime AB's VGR eligibility ("qualifies perfectly") is unconfirmed and likely
  blocked by a regional-presence gate.

## GitHub-side fixes already applied — do not re-flag or redo these

The founder ran GitHub Copilot's autofix on PR #1682's own review findings directly
on GitHub (8 commits, "Potential fix for pull request finding", merged into this
branch's history at `9e2c471`). Already covers:

- `***` (not `---`) delimiters around VERSION AND AGENT HISTORY blocks in
  `fi-se-lanes-research-2026-07.md` and `fundraising-roadmap-2026-2027.md`.
- Missing `Last Modified` / `Languages Available` Document Status fields in
  `RECOVERY_SESSION_PROMPTS_PASTE_READY_2026-07-14.md`,
  `europe-roadmap-fieldnote-prompt-2026-07.md`,
  `recovery-prompts-lost-research-packs-2026-07.md`.
- `scripts/claude-durability-checkpoint.sh` hardening: `set -euo pipefail`, and a
  `--quiet`-aware `git_push_retry` that captures stderr and only echoes it on failure
  (instead of unconditionally printing, or silently swallowing errors under
  `--quiet`).

This session additionally:

- **Resolved add/add merge conflicts** between this branch and `main`: both had
  independently added `fundraising-roadmap-2026-2027.md` and
  `claude-durability-checkpoint.sh` (this branch via checkout from
  `europe-roadmap-agents-g9zs8a`, main via the separate EU/NATO recovery PR), so git
  saw them as unrelated files on add/add rather than a clean 3-way merge. Resolved by
  combining both change sets, not picking one side — see roadmap v1.2 changelog entry
  for detail.
- **Fixed the one Copilot finding that wasn't auto-fixable**: unresolved review thread
  `PRRT_kwDOQWBIKc6RBfYm` (now resolved) flagged that
  `recovery-prompts-lost-research-packs-2026-07.md` had the "Recovery Prompt E"
  section duplicated — turned out it was duplicated **twice** before the correctly
  positioned §7 (once standalone at the top, once wedged between Document Status and
  the first divider). Removed both duplicates; also fixed that file's own `---`→`***`
  delimiters while in there (same defect class, not separately flagged by Copilot but
  covered by the same standard).

**If a future session or CI pass re-runs Copilot review on this PR and it re-flags
any of the items above, that's a stale/duplicate finding — check this handoff and the
commit history (`9e2c471`, `685940e`, `0d3c99a`) before redoing the work.**

## Open gaps (not blocking, documented in the research file itself)

See `fi-se-lanes-research-2026-07.md` §6 for the full list — highlights: Almi
Mikrolån's exact ceiling (two official pages disagree, SEK 200k vs 250k), whether
Vinnova's own screening honors the GBER <3-year exemption (not found stated on any
vinnova.se page), and whether Lifetime AB can establish a Västra Götaland presence
(determines whether the VGR lane is usable at all).

## Blockers

None currently open. `docs/DANGLING_DELIVERABLES_AUDIT_2026-07.md` (Recovery Prompt
E part 2) and the Lovegin/Cubet pricing-reply bank-check (Prompt E part 1, needs the
founder to paste the sent artifact) are still queued — see
`recovery-prompts-lost-research-packs-2026-07.md` §7.

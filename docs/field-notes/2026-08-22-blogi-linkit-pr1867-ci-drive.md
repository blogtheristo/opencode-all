# 2026-08-22 — Driving PR #1867 (blogi-linkit merge) to green

**What happened.** Continuation of the 2026-08-21 merge-conflict resolution (see `docs/field-notes/2026-08-21-blogi-linkit-merge.md`). A PR (#1867) was opened from `claude/blogi-linkit-merge-errors-wedpz8` into `main` via the Claude Code UI; this session subscribed to its GitHub activity and drove it to green:

- Fixed `truth-lint` CI failure (`--changed` mode caught deprecated-phrase mentions in audit/field-note/KB docs that needed quoting as mentions, not live claims).
- Fixed `test` CI failure: two orphaned test files (`dashboard-routes.test.ts`, `upsell-rules.test.ts`) imported modules a prior dead-code sweep (`e71b64624`, already on `main`) had archived to `_OLD` without checking test files. Retired the tests the same way, matching repo convention.
- Audited a HIC-raised concern that the PR description referenced a stale price-list version (v1.21) while the live site is v1.25. Confirmed no actual pricing regression: the PR's file content matches `main`'s current v1.25 byte-for-byte; only doc comments and i18n hreflang links were added. Updated the PR description to remove the stale version reference and state the verified fact.
- Absorbed ~20 turns of a self-perpetuating loop where `Admin/Security/CRITICAL_BUGS_REPORT.md` regenerates its timestamp on every pre-push scan, triggering the stop-hook's "uncommitted changes" check every turn. Considered gitignoring it but the repo's own `.gitignore` states a narrow tracked-by-default principle (only secrets/build-artifacts/OS-junk are ignored); kept committing the 1-line diff each time instead, per that convention.

**Insight.** The `git-check` and `session-stop` hooks in this container see pre-existing untracked stray files (`gcp-sa-key-new.json` looking like a live GCP credential, plus ~9 other files a prior dead-code sweep archived to `_OLD` but which still sit un-renamed and untracked in this shared working directory) as "substantive changes" needing a field note every session, even though this session never touched them. They were deliberately left uncommitted throughout — one looks like a credential and must not be committed blind.

**Next steps.** PR #1867 is green and mergeable as of this note. No merge was performed — that decision belongs to the HIC per the branch protocol ("never push to a different branch without explicit permission" extends to not auto-merging on their behalf).

**HIC action:** `gcp-sa-key-new.json` (repo root, untracked, unignored) should be reviewed and rotated/removed from the working directory if it's a live key — it keeps surfacing in every session's dirty-file scan and is one `git add -A` away from being committed by a less careful future session.

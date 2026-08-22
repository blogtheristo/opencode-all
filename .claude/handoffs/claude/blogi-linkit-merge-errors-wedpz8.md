# Handoff: claude/blogi-linkit-merge-errors-wedpz8

**Status (2026-08-22): PR #1867 open, green, mergeable. Handing off to OpenCode.**

## What this branch is

Resolved 148 merge conflicts between `claude/blogi-linkit-kohteet-f1j1cm` (PR #1764,
LSJ blog content audit — price removal from post "From the Store" cards, Finnish
diacritic fixes on 22 day-series posts, 5-language price-list pages) and `origin/main`
(which had independently advanced with hero images, CSP fixes, mailto→contact-form,
KYA-S1 series map/nav, 5-language i18n nav/footer). Both sides' real work was merged
per-file, not blindly ours/theirs.

PR #1867 (`https://github.com/blogtheristo/dws6/pull/1867`) was opened from this
branch via the Claude Code UI, targeting `main`.

## What was fixed to get CI green

- `truth-lint` (`--changed` mode): quoted deprecated-phrase mentions ("agent count",
  "18+ AI agents", "benchmark scores", "model rankings") in audit/field-note/KB docs
  as mentions of findings, not live assertions.
- `test`: retired two orphaned test files (`dashboard-routes.test.ts`,
  `upsell-rules.test.ts`) whose subject modules a prior dead-code sweep (`e71b64624`,
  already on `main`) had archived to `_OLD` without checking test files.
- Audited a HIC-raised concern about a stale "v1.21" price-list reference in the PR
  description — confirmed no pricing regression (file content matches `main`'s live
  v1.25 byte-for-byte; only doc comments/i18n links added). PR description updated to
  remove the stale line.

## Known noise, not a bug

`Admin/Security/CRITICAL_BUGS_REPORT.md` regenerates its timestamp on every pre-push
scan, which the `stop-hook-git-check.sh` flags as "uncommitted changes" every turn.
Kept committing the resulting 1-line diff each time rather than gitignoring it — this
repo's own `.gitignore` states a narrow tracked-by-default principle (only
secrets/build-artifacts/OS-junk are ignored), so exempting a regenerated report would
go against stated convention. Whoever picks this up next should expect the same
churn and just keep clearing it, or raise the underlying scanner behavior with the
HIC if it's worth fixing at the source.

## Outstanding

- **Not mine to touch, deliberately left uncommitted every session:** ~30 stray
  untracked files sitting in this shared container's working directory (pre-existing,
  not created by this session) — old renamed-away route/service files matching
  `e71b64624`'s dead-code sweep, some sales-outreach docs, two blog pages. One,
  `gcp-sa-key-new.json` (repo root), looks like a live GCP service-account credential
  — untracked, unignored, one `git add -A` away from being committed. **HIC should
  review/rotate/remove it.** Contents were never read (Secret Egress Rules).
- PR #1867 has not been merged — that decision is the HIC's, not mine, per the branch
  protocol ("never push to a different branch without explicit permission" extends to
  not auto-merging).
- Was subscribed to PR activity via `subscribe_pr_activity`; unsubscribed at handoff
  time (2026-08-22) since OpenCode is taking over — resubscribe if Claude Code resumes
  driving this PR.

## Session records

- `docs/field-notes/2026-08-21-blogi-linkit-merge.md` — the merge-conflict resolution.
- `docs/field-notes/2026-08-22-blogi-linkit-pr1867-ci-drive.md` — the CI-drive session.

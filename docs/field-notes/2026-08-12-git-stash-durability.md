# Field note — 54 stashes were 30 days from deletion

**Date:** 2026-08-12
**Branch:** `claude/protect-git-stashes`
**Trigger:** HIC asked whether work stashed via GitHub Desktop had been lost.

---

## What happened

The HIC stashed changes through GitHub Desktop and later found the working tree
clean, and asked whether the work was gone.

It was not. Two of the three files (`Admin/ADMIN_MANUAL.md`,
`scripts/db-daily-backup.sh`) had already been **committed** in `873355fbc` on
`fix/windows-db-backup-and-email-alert` and pushed to `origin`. Only
`.claude/settings.local.json` was actually in the stash.

Answering that question surfaced a much larger problem that nobody had asked
about.

## The real finding

`git stash list` showed **54 stashes**, the oldest from April. Inspecting the
refs showed why that was dangerous:

> Git creates a real ref — `refs/stash` — for `stash@{0}` **only**. Every older
> stash exists purely as a **reflog entry** on that ref.

Reflog entries expire. The defaults are 90 days for reachable commits and
**30 days for unreachable** ones, applied by `git gc`, which also runs
automatically. So 53 of the 54 stashes were one maintenance run — or one
`gc.auto` trigger — from silent deletion. No prompt, no error, no diff.

Among them was `stash@{39}`, _"PROTECTED partners pages 799-line content
(case sensitivity)"_ — 1594 lines across `onelifetime.world/partners/index.html`
and its `landing-pages` mirror. Project memory explicitly flags that content as
never-overwrite.

The second half of the problem is the one the HIC named directly: **stashes are
local-only**. Nothing pushes them. GitHub had no copy of any of the 54, so the
repo's remote was not a backup of them in any sense.

## What was done

1. **Root cause.** `gc.refs/stash.reflogExpire=never` and
   `reflogExpireUnreachable=never` (plus the same for the archive namespace).
   Git itself now never expires stash reflog entries.
2. **Pinned every stash** to a permanent ref under `refs/stash-archive/`.
   A commit with a real ref is not gc-eligible — this survives even
   `git stash drop`, which was verified explicitly.
3. **Bundled** all 54 plus full history to
   `F:\2026\Repos2026\dws6-stash-backup\` (617 MB, 754 heads,
   `git bundle verify` → _"records a complete history"_). Restore was proven by
   cloning the bundle into a throwaway mirror and reading two stashes back.
4. **Automated it** — `scripts/Protect-GitStashes.ps1`, registered as the
   weekly Windows Scheduled Task `DWS6-Protect-GitStashes` (Sundays 03:00).
   Per the Script Automation Rule, nothing here depends on anyone remembering.
5. **MANIFEST.txt**, because a bundle carries refs but not reflog messages —
   without it the 54 refs are anonymous SHAs with no record of what each was for.

## What was deliberately NOT done

**The archive refs were not pushed to GitHub.** Pushing
`refs/stash-archive/*` would genuinely solve "not stored on GitHub", and the
objects are mostly shared with existing history so the push would be small.

It was not done because **stashes can contain secrets**. Several were created
with `-u` (untracked files included), and untracked files are exactly where
`.env` lives. Pushing 54 unreviewed stashes to a remote risks precisely the
leak Non-Negotiable Rule 1 exists to prevent. That trade is the HIC's to make,
after a secret scan — not a side effect of a durability fix.

## Lessons

- **"It's in git" is not the same as "it's safe."** Stashes, reflogs and
  untracked files are all inside `.git` and all disposable. Only a commit with
  a ref that is pushed somewhere is durable.
- **A backup nobody has restored from is a hypothesis.** The bundle was cloned
  and read back before being called a backup.
- **The guard that caught a bug was mine.** `Protect-GitStashes.ps1` rejected
  its own correct default `BackupPath`, because `dws6-stash-backup`
  string-starts-with `dws6`. Path containment needs a trailing separator, not
  `StartsWith`. Worth remembering anywhere a path guard is written.
- **The question asked was narrower than the problem.** "Did I lose these three
  files?" was answerable in one command. Checking properly is what exposed 54
  stashes at risk.

## Follow-ups

1. **Triage the 54.** They are safe now but not _reviewed_. Most are `temp-…`
   scaffolding from PR conflict work in April and are probably droppable; a few
   (`#39` protected Partners content, `#0` settings) are not. Needs a human
   pass — nothing was dropped in this session.
2. **Decide on pushing to GitHub**, after scanning the stashes for `.env` and
   credential material.
3. The same exposure exists in **every other clone and worktree** on this
   machine. This fix is scoped to `F:\2026\Repos2026\dws6`.

## Learning Standard steps

- KB update — `N/A` — no `kb/` entry; the durable record is this note, the
  committed script, and `RESTORE.md` next to the bundle.
- Drive export — `N/A` — the artifact is a 617 MB bundle on the local disk by
  design; exporting it to Drive was not authorised and would duplicate
  potentially secret-bearing stash content off-machine.
- Calendar — `N/A` — the recurring commitment is a Windows Scheduled Task
  (`DWS6-Protect-GitStashes`, Sundays 03:00), which is a stronger reminder than
  a calendar entry; no dated deadline was produced.
- HIC question — see below.

## Question for the HIC

**Should the 54 archived stashes be pushed to `origin` under
`refs/stash-archive/*`?** It is the only step that makes them survive the loss
of this machine — but it publishes 54 unreviewed working states to GitHub, and
at least some were stashed with untracked files included. My recommendation:
scan for secrets first, push the clean ones, and keep the rest local-only.

---
Status: CLOSED
Date: 2026-10-01
Branch: claude/sleepy-ptolemy-wjq0qf
---

# opencode-loop restart crash outside a git checkout

## What happened

`opencode-loop restart` run from `~` printed a `fatal: not a git repository` stack trace. The loop itself had started correctly in tmux (`cd $primary`). The crash came from the last line of `start`, `node "$loop" --dry-run`, which runs in the caller's cwd. `scripts/opencode-task-loop.mjs` resolved the primary checkout only from `process.cwd()`.

## Insight

A script launched by a shell function must not depend on the caller's cwd. The tmux call site already did the right thing; the foreground calls did not.

## Fix

`scripts/opencode-task-loop.mjs`: if cwd is not in a git repo, fall back to the script's own directory. Verified with `cd /tmp && node scripts/opencode-task-loop.mjs --line` (prints the status line, exit 0).

## Next steps

- Merge the PR. The DGX `~/dws6` is on main, so `dws6-sync` picks the fix up afterwards; no loop restart needed.
- Until then: `cd ~/dws6 && opencode-loop restart`.

N/A — Learn/ HTML, KB update, Drive export, HIC decision question: one-file bug fix with no new knowledge, signal, or decision (CLAUDE.md Session Learning Outcome Rule, trivial-session exemption).

# DGX opencode-loop outage — root causes, fixes and restart (2026-09-29)

## What happened

- `opencode run` in every loop worktree failed in 1–2 s with "UnknownError: Unexpected server error". Real error (`--print-logs`): `ProviderModelNotFoundError: Model not found: ollama-local/qwen3-coder-next:latest`.
- Cause: the `ollama-local` models were declared only in the repo `opencode.json`. Loop worktrees check out older branches whose `opencode.json` predates `qwen3-coder-next`, while the loop's default model is `qwen3-coder-next` (`scripts/opencode-task-loop.mjs:63`). All 12 tasks went BLOCKED (stalled) on 28.09.
- Second cause: `~/dws6` main had 5 local commits, so `git pull --ff-only` failed and the loop kept reading an old checkout without the Aegis pilot specs (merged 28.09, 4293531c5).

## Fixes

- HIC-approved (option A): `ollama-local` provider (qwen3-coder-next, qwen3-coder:30b, nemotron-3-super) added to the DGX-global `~/.config/opencode/opencode.jsonc`, baseURL `127.0.0.1:11434`. 11435 is the Win11 SSH tunnel port and does not listen on the DGX.
- Local main commits saved to `rescue/dgx-main-2026-09-29` (pushed with `SKIP_LOCAL_CI=1`; local CI failed 18 vitest on stale product JSON), then HIC ran `git reset --hard origin/main` (the guard hook blocks agents from it).
- Loop state archived to `state.json_OLD` / `state.json_OLD2`; loop restarted in tmux `oc-loop` 29.09 22:16 EEST. `opencode/aegis-pilot-doctor` round 1/4 started 22:17.
- Side task: PR #2245 moved two campaign image READMEs out of `dws10.com/static/images/` (Rule 5).

## Insight

A provider/model the loop depends on must live in machine-global config, not only in the repo config that each branch carries its own old copy of.

## Next steps

- Check `opencode-loop status` for A1 (doctor) and A6 (skill) by the evening of 01.10; code them in a paid session if BLOCKED or without PR (77 % milestone 04.10).
- `gh pr create failed … No commits between main and …` for tasks already satisfied by main is noise; the loop could skip PR creation when the branch has no commits ahead.

KB update, Learn/ HTML render, Drive export: N/A — ops incident on one machine; this note is the record.

## Addendum 22:30 — worktree escape (PR #2247)

- OpenCode 1.18.33 takes its session directory from `PWD`, not the spawn cwd. The loop inherited `PWD=~/dws6`, so aegis-pilot-doctor round 1 edited and committed on primary `main` with `git add -A`, sweeping in 27 untracked specs/handoffs/notes. `dws6-sync` rescued it to `rescue/dgx-main-20260929-222227` (9b5795de9) and reset main.
- Recovered: the 27 untracked files restored in place; the 4 doctor files committed to `opencode/aegis-pilot-doctor` (8a753a911, unpushed).
- Fix: `PWD: wt` in `runOpencode` env (PR #2247). Loop stopped until it merges.
- `@reboot` crontab line added: `sleep 120 && bash -ic "opencode-loop start"` (backup `~/crontab.bak-2026-09-29`).

## Addendum 22:35 — merged and monitored

- PR #2247 merged (9adc232a0); loop restarted, aegis-pilot-doctor round 2 verified running in its own worktree.
- PR #2248 merged (724322e1c): `scripts/daily/opencode-loop-status.sh` digest, printed by the session-start hook; DGX cron `0 7 * * *` writes `~/.local/state/opencode-task-loop/daily/YYYY-MM-DD.md`. day-runner has no timer on this DGX, so `scripts/daily/` is not auto-run there.

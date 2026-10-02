# OpenCode worktree-per-session wrapper: why it did not engage on the DGX

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (web) | Session: claude/festive-cerf-87wf67 | Date: 28.09.2026 | Changes: Field note for PR #2198 and the DGX rollout. | Harness: Claude Code + CLAUDE.md | HIC-approved-drift: none

Session Links & References:

- PR: https://github.com/blogtheristo/dws6/pull/2198 (merged as 148bbcc)
- Policy: WORKTREE_POLICY.md §6

Document Status:

- Created: 28.09.2026
- Status: PENDING_REVIEW

---

## What happened

The HIC reported that starting a new `opencode` in the DGX terminal did not open a new branch and worktree. The launch wrapper `scripts/shell/opencode-worktree.bash` (8a6223f) was already on `main`.

Three causes, in order of impact:

1. **Never installed.** The DGX primary checkout `~/dws6` sat on the feature branch `claude/epic-turing-c7vkrk`, so `git pull` did not bring in the wrapper's installer. Installing was a manual step with no check that it had worked.
2. **Sessions already running in the shared checkout.** Two opencode processes (PIDs 3093782 and 3791510) had `/home/admin100/dws6` as their working folder. That checkout had uncommitted epic-turing work, which blocked `git switch main`.
3. **Wrapper bypass paths**, reproduced with a stand-in opencode:
   - an `opencode` alias shadows the function, because bash expands aliases before functions;
   - `opencode ~/dws6` passed the shared checkout's path back to opencode.

## The fix (PR #2198)

- The wrapper removes any `opencode` alias and rewrites a path argument pointing at the primary checkout to the new worktree.
- The primary checkout is detected with a symlink-safe test.
- New `scripts/shell/install-opencode-worktree.sh` installs idempotently and exits 1 unless a fresh shell resolves `opencode` to the wrapper function.

## Insight

A guard that depends on a manual install needs an installer that verifies itself. Without that, it fails silently, and the failure looks like the guard was never written. The primary checkout also has to stay on `main`. Otherwise a pull updates a feature branch, and later fixes never arrive.

## Next steps

1. HIC, on the DGX: close the two shared-checkout sessions, commit and push the epic-turing work, `git switch main`, then run the installer. The installer should print `install: OK`.
2. Verify: a plain `opencode` in `~/dws6` should print `opencode: worktree …/opencode/<task>`.

## Learning Outcome Rule checklist

- KB: N/A — this is a tooling fix already recorded in WORKTREE_POLICY.md §6; nothing new for the KB.
- Learn/ HTML: rendered alongside this note.
- Drive export: N/A — the repo is the source of truth, and there is no Drive connector write in this session.
- Calendar: N/A — no dated commitment.

## HIC decision needed

Should the DGX session-start hook refuse to launch opencode (or warn loudly) when `~/dws6` is not on `main`, instead of relying on the HIC to keep it there?

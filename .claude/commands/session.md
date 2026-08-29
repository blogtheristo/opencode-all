# Session Persistence — survive tmux termination

Saves and resumes work sessions across tmux restarts, for both Claude Code and OpenCode.
Session files live in `.opencode/sessions/` — committed to git, readable on any machine.

Input: $ARGUMENTS — one of: `save [name]` | `list` | `resume <name>` | `status`

## save [name]

1. If no name given, derive: `<branch>-<YYYY-MM-DD>`.
2. Collect state:
   ```bash
   git rev-parse --abbrev-ref HEAD
   git status --short
   git log --oneline -5
   gh pr list --head $(git branch --show-current) --json number,title,url 2>/dev/null
   ```
3. Ask the user one question: "What are you in the middle of, and what is the next step?"
4. Write `.opencode/sessions/<name>.md`:
   ```
   # Session: <name>
   Saved: <ISO timestamp>
   Branch: <branch>
   Last commit: <sha> <message>

   ## In progress
   <user answer + agent-observed state>

   ## Next step
   <concrete next action>

   ## Blockers
   <or "none">

   ## Open PR
   <url or "none">

   ## Dirty files
   <git status --short or "clean">
   ```
5. Commit and push:
   ```bash
   git add .opencode/sessions/<name>.md
   git commit -m "session: save <name>"
   SKIP_LOCAL_CI=1 git push origin <branch>
   ```
6. Confirm: "Session '<name>' saved. Resume with `/session resume <name>`."

## list

1. `ls .opencode/sessions/*.md 2>/dev/null` — if empty, report "No saved sessions."
2. Print each: name · saved date · branch · first line of "In progress".

## resume <name>

1. Read `.opencode/sessions/<name>.md`.
2. If not on the correct branch: `git checkout <branch>`.
3. Display the full session card.
4. State: "Resuming from: **<Next step>**" and proceed.

## status

Show the latest session file matching the current branch, or "No session saved for this branch."

## Notes

- Works identically in Claude Code and OpenCode — same files, same git commit.
- Complements `.claude/handoffs/<branch>.md` (cross-agent baton) — sessions capture
  mid-task state; handoffs capture completed-task state for the next agent.
- On DGX Spark: same commands work over SSH tmux sessions.

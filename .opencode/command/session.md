---
description: "Persist and resume OpenCode sessions across tmux restarts. Triggers — 'save session', 'resume session', 'what was I working on', 'list sessions', tmux died, session lost."
---

Save, list, or resume a named work session so context survives tmux termination.

Input: $ARGUMENTS — one of: `save [name]` | `list` | `resume <name>` | `status`

## Steps

### `save [name]`
1. If no name given, derive one: `<branch>-<YYYY-MM-DD>`.
2. Gather current state:
   - Active branch: `git rev-parse --abbrev-ref HEAD`
   - Uncommitted files: `git status --short`
   - Last 5 commits: `git log --oneline -5`
   - Any open PR: `gh pr list --head $(git branch --show-current) --json number,title,url`
3. Ask the user: "What are you in the middle of? What's the next step?" (one question).
4. Write `.opencode/sessions/<name>.md` with the shape below.
5. Commit: `git add .opencode/sessions/<name>.md && git commit -m "session: save <name>"` then push.
6. Confirm: "Session '<name>' saved. Resume with `/session resume <name>`."

Session file shape:
```
# Session: <name>
Saved: <ISO timestamp>
Branch: <branch>
Last commit: <sha> <message>

## In progress
<what the user said + any agent-observed state>

## Next step
<concrete next action>

## Blockers
<anything blocked — or "none">

## Open PR
<url or "none">

## Dirty files
<git status --short output or "clean">
```

### `list`
1. `ls .opencode/sessions/*.md 2>/dev/null` — if empty, say "No saved sessions."
2. For each file print: name, Saved date, Branch, first line of "In progress".
3. Also show OpenCode's built-in `/sessions` output if available (run `opencode sessions list 2>/dev/null`).

### `resume <name>`
1. Read `.opencode/sessions/<name>.md`.
2. Check out the branch if not already on it: `git checkout <branch>`.
3. Show the full session card to the user.
4. Ask: "Ready to continue from: <Next step>? Or has something changed?"
5. After confirmation, proceed with the next step.

### `status`
Show the session file for the current branch (`.opencode/sessions/<branch>-*.md` latest match), or "No session saved for this branch."

## File location
`.opencode/sessions/` — committed to git, survives tmux death, readable on DGX Spark and Win11.

## When NOT to use
- Claude Code handoffs (cross-agent) → `.claude/handoffs/<branch>.md` per the handoff protocol
- Long-running background tasks → `/cron`

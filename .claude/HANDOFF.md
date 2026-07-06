# Session Handoff Log

Cross-session memory for Claude Code cloud sessions. Containers are ephemeral —
this file is the only working memory that survives them, because it is committed
to git. `session-start.sh` injects the CURRENT HANDOFF section into every new
session's context automatically.

## Update protocol (every agent, every session)

1. **Read** the CURRENT HANDOFF section before starting work (the session-start
   hook already shows it to you).
2. **Overwrite** the CURRENT HANDOFF section at every significant checkpoint
   (Rule 10) and always before ending a session — commit it together with the
   work it describes, on the same branch.
3. **Append** a one-line entry to HANDOFF HISTORY when a task completes or is
   handed off. Keep history to the newest 20 lines; delete older ones.
4. Keep CURRENT HANDOFF under ~40 lines. This is a baton, not a journal —
   detail lives in commits, PRs, and `.claude/clawdbot/` queue files.
5. Never put secrets, tokens, or customer PII here (Non-Negotiable Rule 1).

---

## CURRENT HANDOFF

- **Branch:** claude/session-container-memory-6ccpnf
- **Task:** Fix cross-session memory loss in ephemeral cloud containers
  ("synthetic alzheimer") by adding this git-committed handoff log.
- **State:** Handoff mechanism implemented — this file created,
  session-start.sh surfaces it, CLAUDE.md workflow section points to it.
- **Next steps:** None — mechanism is live. Future sessions: keep this section
  current per the protocol above.
- **Blockers:** Container size itself cannot be changed from inside a session;
  user must pick a larger machine in claude.ai/code environment settings.

---

## HANDOFF HISTORY

- 2026-07-05 | claude/session-container-memory-6ccpnf | Created handoff log mechanism (file + session-start hook + CLAUDE.md pointer).

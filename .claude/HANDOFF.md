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

- **Branch:** claude/aiven-partnership-intro-vm1fgk
- **Task:** Record Aiven inbound contact (Leevi Lindfors, account manager,
  2026-07-06) and draft Risto's reply.
- **State:** `Partners/outreach/2026-04-18-aiven.md` updated to v1.1 — named
  contact added, sandbox status recorded (attempt #1 failed, attempt #2 in
  progress), FI + EN reply drafts in §8. Email send is RED zone: Risto sends.
- **Next steps:** Risto reviews/sends the §8 reply; book the best-practices
  call; report sandbox attempt #2 outcome back into the partner record.
- **Blockers:** None.

---

## HANDOFF HISTORY

- 2026-07-06 | claude/aiven-partnership-intro-vm1fgk | Aiven partner record v1.1: Leevi Lindfors contact + reply draft (human sends).
- 2026-07-05 | claude/session-container-memory-6ccpnf | Created handoff log mechanism (file + session-start hook + CLAUDE.md pointer).

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

- **Branch:** claude/edb-postgres-dgx-odwa9f
- **Task:** Evaluate the "EDB Postgres AI is best for NVIDIA DGX" assessment
  (shared by Risto in Finnish) and record it as a verified field note.
- **State:** Done — `docs/field-notes/2026-07-06-edb-postgres-ai-nvidia-dgx-evaluation.md`
  created. Claims 1-4 confirmed against EDB/NVIDIA primary sources; ARM LSE
  claim marked plausible/unverified. Critical caveat found: pgpu is x86_64-only,
  so it does NOT run on DGX Spark (aarch64 Grace). Aiven-First Mandate left
  untouched — EDB positioned only as tier-3 candidate (customer air-gapped
  sovereign DGX deployments).
- **Next steps:** Watch EnterpriseDB/pgpu for aarch64 support; include EDB in
  the next Tier-1 sovereign DGX pilot reference architecture when drafted.
- **Blockers:** None.

---

## HANDOFF HISTORY

- 2026-07-06 | claude/edb-postgres-dgx-odwa9f | Field note: verified EDB Postgres AI on DGX evaluation; pgpu x86_64-only caveat; tier positioning vs Aiven-First Mandate.
- 2026-07-05 | claude/session-container-memory-6ccpnf | Created handoff log mechanism (file + session-start hook + CLAUDE.md pointer).

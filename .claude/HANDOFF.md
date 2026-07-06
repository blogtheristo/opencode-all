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

- **Branch:** claude/european-datasets-lab-note-8mlg9u
- **Task:** INSPIRE/European Data Portal lab note + `dws eu-data` demo tool.
- **State:** Done and pushed. Lab note v1.1 at
  `docs/lab-notes/2026-07-06-inspire-european-data-portal-geospatial.md`
  (verified INSPIRE Geoportal retirement 1 July 2026; IPR section; dataset
  shortlist). New CLI command `dws eu-data` (onboard | search | status,
  `--demo` fixture mode, per-source CC BY 4.0 provenance) in `cli/src/cli.ts`;
  skill pack `skills/eu-data/SKILL.md`; manifest + skills guide v1.17 synced.
- **Next steps:** (1) Run `dws eu-data status` from an unrestricted machine to
  verify live upstreams (PRH/FMI/EDP were network-policy-blocked in this
  session — all logic live-tested only for the fail-loud path). (2) Candidate:
  regulatory-radar ingestion of EDP dataset-version diffs (lab note Actions).
- **Blockers:** `cli/ npm run build` (tsc) is broken pre-existing: `dws kb`
  imports `../../src/utils/embeddings.js` across rootDir and pino types are
  missing. Use `npx tsx src/cli.ts` meanwhile.

---

## HANDOFF HISTORY

- 2026-07-06 | claude/european-datasets-lab-note-8mlg9u | INSPIRE/EDP lab note v1.1 + dws eu-data CLI demo tool + eu-data skill pack registered.
- 2026-07-05 | claude/session-container-memory-6ccpnf | Created handoff log mechanism (file + session-start hook + CLAUDE.md pointer).

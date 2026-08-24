# Handoff: claude/european-datasets-lab-note-8mlg9u

> Per-branch handoff file. See `.claude/HANDOFF.md` for the protocol and the
> cross-branch history log. This file is owned by sessions on this branch
> only — safe to overwrite freely, no cross-branch merge risk.

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

# Handoff: claude/affectionate-hypatia-3dpubh

**Task:** Audit issue #1832 (11 OpenCode config defects from PR #1831) against current `main`; fix what remains.

**State:** DONE — committed and pushed. PR opened against `main`, closes #1832.

**What changed**
- `opencode.json`: `read`/`edit` rule sets rewritten (root `.env` was readable, `.env.example` was denied, root-level secret files unguarded); `share: disabled`; `.claude/` harness edits → `ask`; `external_directory` → ask; provider display name corrected; non-schema `cost-policy` moved to `config/cost-policy.json`.
- `CLAUDE.md` line reference, `CHANGELOG.md` Fixed entry, field note `docs/field-notes/2026-09-23-opencode-config-audit-issue-1832.md`.

**Verified with:** OpenCode 1.18.32 `debug config --pure` from repo root + matcher harness replicating `Wildcard.match` / `findLast`.

**Next / open**
- HIC: confirm `*secret*` / `*credentials*` deny breadth (field note "HIC decision").
- Run `opencode debug config --pure` on the DGX Spark once merged (not reachable from cloud container).

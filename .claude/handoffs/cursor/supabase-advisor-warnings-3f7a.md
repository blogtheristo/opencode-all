# Handoff — cursor/supabase-advisor-warnings-3f7a

**Branch:** `cursor/supabase-advisor-warnings-3f7a`
**Task:** Advisor SECURITY dump → field note + Document Standard SQL/TS/PY scope + Cursor always-on standards rule. 088 authored then **refused**. Migration-filename CI started after HIC “2. yes”.
**State:** READY-FOR-REVIEW (088 still not applied)
**PR:** https://github.com/blogtheristo/dws6/pull/2046 (earlier session also used #2045)
**Date:** 2026-09-19

# VERSION AND AGENT HISTORY

---

Version: 1.3 [Latest]
Tool: Cursor Grok 4.6
Agent: Cursor Cloud
Date: 19.09.2026
Changes: HIC item 5 — Auth leaked-password required (Studio). Do not apply 088.
Version: 1.2
Tool: Cursor Grok 4.6
Agent: Cursor Cloud
Date: 19.09.2026
Changes: [not latest] HIC item 4 — SECURITY DEFINER caller map field note. Do not apply 088.
Version: 1.1
Tool: Cursor Grok 4.6
Agent: Cursor Cloud
Date: 19.09.2026
Changes: [not latest] HIC 2+3 landed — migration-filename CI + generated-i18n HTML comments. Do not apply 088.
Version: 1.0
Tool: Cursor Grok 4.6
Agent: Cursor Cloud
Date: 19.09.2026
Changes: [not latest] Session handoff for OpenCode audit. Do not apply 088.

---

## Task

HIC pasted Supabase Database Linter SECURITY (2026-09-19). Cursor wrote field note + migration 088, then expanded Document Standard, audited ~7 days of Cursor repo output, and added `.cursor/rules/dws-standards-always.mdc`. HIC: refuse 088 (agent not aware of dws6 enough). HIC: 1. yes thin always-on rule. HIC: 2. yes migration-filename CI (implementation started, not committed).

## State

### Committed on branch (vs `main`)

| SHA         | Subject                                                                   |
| ----------- | ------------------------------------------------------------------------- |
| `7f0c53af9` | Record HIC approval of the thin always-on Cursor standards rule           |
| `83c6bb24e` | Record HIC refusal: do not apply migration 088                            |
| `b32cc959f` | Register dws-standards-always.mdc in CLAUDE.md system files index         |
| `0c670c4cd` | Make DWS standards a Cursor always-on harness, not memory                 |
| `d81d31d11` | Bring last-week Cursor artifacts under Document Standard v2.17            |
| `8ce85f5ca` | Put .sql in Document Standard scope (v2.16); rename 088 to `088_190926_*` |
| `8bb672fed` | Rewrite 088 policies as ALTER POLICY (Studio DROP banner)                 |

Earlier on same lineage (if present on PR): advisor field note + first 088 draft.

### HIC decisions (closed)

1. **Thin always-on Cursor rule** — approved 19.09.2026 — `.cursor/rules/dws-standards-always.mdc` `alwaysApply: true`.
2. **Migration-filename CI** — approved 19.09.2026 — **WIP, uncommitted**.
3. **Do not apply 088.** Replacement only after per-function caller map (076).

### Open

- Caller map is PENDING_REVIEW — not an apply-088 ticket.
- Auth advisor lint `auth_leaked_password_protection`: approved; HIC must flip Studio (`PENDING_HIC_TOGGLE`).
- Session learning: KB / Learn / Drive / calendar = N/A.

### Uncommitted (do not treat as shipped)

- `.github/workflows/migration-filename.yml`
- `scripts/check-migration-filenames.mjs`
- `src/__tests__/check-migration-filenames.test.ts`
- Dirty: `.cursor/rules/dws-standards-always.mdc`, `DWS_DOCUMENT_STANDARD.md`, field-note standards-pass, `STANDARDS_ROUTING.md`, `package.json`

### Must not do

- `supabase db push` / Studio run / apply `088_190926_advisor_security_linter.sql`
- Invent exploits / PoCs for advisor findings
- Migration-filename CI that fails the whole historic tree (must be **diff-scoped** + grandfather)

## Next steps (OpenCode)

1. Audit commits + uncommitted output against CLAUDE.md / Document Standard / Security Standard / 076 text. Write findings; do not “fix” by applying 088.
2. Finish or reject the WIP CI: only new `supabase/migrations/` files vs merge-base; pattern `NNN_DDMMYY_snake.sql`; tests; `***` in markdown VAH (Prettier rewrites `***` → `---` on Edit/Write).
3. Commit + push only after audit; update PR 2046.

## Notes for next session

- Caller-gap table: `docs/field-notes/2026-09-19-supabase-advisor-security-warnings.md`
- 076 already required per-function review before PUBLIC revoke of SECURITY DEFINER.
- Service-role client: `src/services/supabase.service.ts`. Do not assume dashboards never call RPCs as `authenticated`.
- Cloud git/PR: `ManagePullRequest`, branch prefix `cursor/*-3f7a`.

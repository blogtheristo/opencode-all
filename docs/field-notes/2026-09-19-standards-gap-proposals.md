# 2026-09-19 — Standards gap proposals (this audit)

# VERSION AND AGENT HISTORY

---

Version: 1.0 [Latest]

Sessions & Modifications:

- Version: 1.0 [Latest] | Tool: Cursor Grok 4.6 | Session: cursor/supabase-advisor-warnings-3f7a | Date: 19.09.2026 | Changes: Gap → propose protocol landed. Remaining proposals listed. 088 not applied. | Harness: Cursor Cloud + .cursor/rules/dws-standards-always.mdc + CLAUDE.md | HIC-approved-drift: HIC-2026-09-19 do not apply 088

Document Status:

- Created: 19.09.2026
- Last Modified: 19.09.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE
- Status: PENDING_REVIEW

---

**Standards loaded:** STANDARDS_ROUTING.md, DWS_DOCUMENT_STANDARD.md §27.3, DWS_SECURITY_STANDARD.md §7/§16, DWS_LEARNING_STANDARD.md §4, DWS_TRUTH_STANDARD.md, DWS_ROLES_REGISTRY.md.

## Landed this turn (gap closed in-standard)

| Gap                                            | Update                                                                                                                  |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Agent stops at `N/A` when a standard is silent | `STANDARDS_ROUTING.md` How to Apply step 4; Document Standard §27.3; Learning Standard §4; always-on Cursor rule step 5 |
| 088-style `prosecdef` loop vs 076              | Security Standard §16.0.3 — per-function only                                                                           |

## Still proposed — not landed (need HIC or a file we do not invent)

| #   | Gap                                                                                         | Proposed update                                                                                                                                           | Why not landed                                      |
| --- | ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| P1  | Prettier PostToolUse rewrites `***` → `---` so §2.1 cannot stay true under Edit/Write       | Add repo `.prettierignore` for `*STANDARD*.md` + `docs/field-notes/` **or** stop markdown `--write` in the hook. Document Standard already forbids `---`. | Tooling change; confirm hook owner                  |
| P2  | Katakri **criterion IDs** (not just 2020 family names)                                      | After HIC places the official 2020 PDF in a private evidence path, add a ID→control table under Security Standard §7.5                                    | Official PDF not in repo — Rule 12                  |
| P3  | PiTuKri (52 criteria) exists as `Admin/PITUKRI_AUDIT_REPORT.md` but §8.1 has no PiTuKri row | Add §8.1 row: PiTuKri = documentation mapping, not certified; pointer to that audit                                                                       | Admin/ is not for casual agent rewrite; HIC confirm |
| P4  | Historic `supabase/migrations/NNN_name.sql` (no DDMMYY)                                     | Keep grandfather. Optional inventory script (`--all`) in CI as **warn**, never mass-rename                                                                | Rename would lie about apply order                  |
| P5  | `bump_project_version` in advisor dump, **no** `src/` caller                                | Security Standard: DEFINER with no in-repo caller stays GRANT-as-is until a live catalog/query proves it                                                  | Must not guess Studio-only functions                |
| P6  | Learn/ HTML + Drive + calendar still N/A this session                                       | Run `scripts/render-doc.sh` on this note when HIC wants Step 3; Drive/calendar need MCP                                                                   | Capability, not a wording gap                       |
| P7  | `web_leads` + `is_backoffice_admin()` lockout if `organization_members` empty               | Policy family hunk only after Mission Control membership check — not 088                                                                                  | RED apply; caller map PENDING_REVIEW                |

## HIC

Accept P1 (prettier) as the next GREEN patch? Other rows stay PENDING_REVIEW.

N/A — Drive / calendar. Learn/ not rendered this step (P6).

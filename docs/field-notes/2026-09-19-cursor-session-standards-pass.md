# Cursor sessions (≈7 days) — Document Standard pass

# VERSION AND AGENT HISTORY

***

Version: 1.2 [Latest]

Sessions & Modifications:

- Version: 1.2 [Latest] | Tool: Cursor Grok 4.6 | Session: cursor/supabase-advisor-warnings-3f7a | Date: 19.09.2026 | Changes: HIC approved item 2 — migration-filename CI. Diff-scoped; existing names grandfathered. 088 still not applied.
- Version: 1.1 [not latest] | Tool: Cursor Grok 4.6 | Session: cursor/supabase-advisor-warnings-3f7a | Date: 19.09.2026 | Changes: HIC approved the thin always-on Cursor rule (`.cursor/rules/dws-standards-always.mdc`). Migration-filename CI not in this approval. 088 still refused.
- Version: 1.0 [not latest] | Tool: Cursor Grok 4.6 | Session: cursor/supabase-advisor-warnings-3f7a | Date: 19.09.2026 | Changes: Audit Cloud + git Cursor sessions since 2026-09-12; fix provenance on repo artifacts.

Document Status:

- Created: 19.09.2026
- Last Modified: 19.09.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE

***

**Standards loaded:** DWS_DOCUMENT_STANDARD.md §1/§4.5/§19.3 (v2.17).

## Corpus

Cloud agents with code changes (createdAfter 2026-09-12): this run (088), `dws10-i18n-25-dictionary-c0ce`, `audit-aegis-i18n-9e53`, `fix-price-list-v129-319d`, `dgx-ollama-litellm-router-a455` / TED + WSL + WhatsApp + Mission Control.

Git: author Cursor* since 2026-09-12.

## Fixed in this pass

- §1 now lists `.ts` / `.js` / `.py` (v2.17).
- Field notes: this file, 2026-09-19 advisor, 2026-09-18 dictionary, Wave 0 inventory — VERSION AND AGENT HISTORY.
- `CODE VERSIONING NOTE` on Cursor-new TED files: `sales-outreach-ted-queue.ts`, `sales-queue.ts`, `construction-leads.routes.ts`, `industry-cpv.ts`.
- 088 already §4.5 + §19.3.

## Left as-is (intentional)

- Generated `dws10.com/products/*.{fi,sv,de,fr}.html` — now stamped `DWS_DOC_PROVENANCE generated-i18n` (and landing-pages mirror).
- Sep 17 WhatsApp copy sweep — content, not missing provenance.
- Sep 18 env-pin field notes / handoffs — already have VERSION AND AGENT HISTORY with `***`.
- `scripts/ted-lead-pipeline.ts` / `fetch_tenders.py` — pre-existing; already had a version note or were not Cursor-new.
- kya-jev consumer `.ts` on `origin/main` — already have Evidence headers; not copied onto this branch (need `kya-jev.ts` from the other merge).

## HIC decision

1. **Approved 19.09.2026:** thin always-on Cursor rule `.cursor/rules/dws-standards-always.mdc`.
2. **Approved 19.09.2026:** migration-filename CI (`scripts/check-migration-filenames.mjs`).
3. **Approved 19.09.2026:** generated i18n HTML §2.1 HTML-comment provenance (not markdown VAH).

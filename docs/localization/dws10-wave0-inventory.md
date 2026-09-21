# Wave 0 — dws10.com public HTML inventory

# VERSION AND AGENT HISTORY

---

Version: 1.0 [Latest]

Sessions & Modifications:

- Version: 1.0 [Latest] | Tool: Cursor Grok 4.6 | Session: cursor/dws10-i18n-25-dictionary-c0ce | Date: 18.09.2026 | Changes: Wave 0 inventory created by Cursor i18n session.

Document Status:

- Created: 18.09.2026
- Last Modified: 18.09.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE

---

Generated 2026-09-18. **No translation in this file.** Machine-readable twin: `dws10-wave0-inventory.json`.

## Counts

| Bucket                                            | Count |
| ------------------------------------------------- | ----- |
| HTML under `dws10.com/`                           | 988   |
| Public (ex `_RETIRED` / edit-conflict)            | 978   |
| EN masters (no `.fi/.sv/.de/.fr` suffix)          | 306   |
| Localized siblings                                | 672   |
| Masters already five-language                     | 172   |
| Masters EN-only                                   | 134   |
| Partial language sets                             | 0     |
| Dual-folder missing vs `landing-pages/dws10-com/` | 0     |

Existing `.fi/.sv/.de/.fr` siblings are **not** assumed dictionary-built. Wave 3 rebuilds pages only via `node scripts/i18n/build-i18n-pages.cjs scripts/i18n/<target>.config.json`.

## Industry map (filename heuristic)

Masters map to `INDUSTRIES.md` ids 1–25 or `platform`. Default is `platform` (buy, price-list, aegis, most SKUs). `ind-*` / `land-*` / named hubs (`shipbuilding/`, `real-estate/`) take the matching id(s).

This list is inventory, not a claim that every master will be translated in this PR.

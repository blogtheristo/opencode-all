# Room 1 — Document Manifest

Repo path is the master. The room shows the exported/published copy.
Status: `todo` (not produced) · `ready` (exists in repo) · `uploaded` (live in the Noux room).

| #   | Title shown in room                 | Repo source                                                                                                                  | Format in room     | Status          |
| --- | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------ | --------------- |
| 1   | Lifetime Certified Partners Program | [`../../Partners/CERTIFIED_PARTNERS_PROGRAM.md`](../../Partners/CERTIFIED_PARTNERS_PROGRAM.md)                               | PDF                | ready → export  |
| 2   | Partner tiers & commissions         | same doc §2.2                                                                                                                | PDF section / HTML | ready → extract |
| 3   | DWS IQ product family one-pager     | `../../docs/DWS_PRODUCT_STANDARD.md` (derive)                                                                                | PDF EN + FI        | todo            |
| 4   | Firehorse ESG Report one-pager      | `../../Firehorse/`                                                                                                           | PDF EN + FI        | todo            |
| 5   | Mutual NDA (EU 2026)                | [`../../Partners/NDA_TEMPLATE_EU_2026.md`](../../Partners/NDA_TEMPLATE_EU_2026.md)                                           | PDF for eSignature | ready           |
| 6   | Consulting + agent bundles          | [`../../docs/marketing/CONSULTING-PLUS-AGENTS-BUNDLES-2026.md`](../../docs/marketing/CONSULTING-PLUS-AGENTS-BUNDLES-2026.md) | PDF                | ready → export  |
| 7   | Sovereignty & compliance position   | `../../DWS_SOVEREIGNTY_STANDARD.md` (derive one-pager)                                                                       | PDF                | todo            |
| 8   | Demo tenant walkthrough             | `../DEMO_TENANTS.md` (derive partner-facing version)                                                                         | Link + short PDF   | todo            |

## Rules

- Never upload a repo `.md` file as-is; export to PDF/HTML (`scripts/render-doc.sh`).
- Any price shown resolves from `dws10.com/config/products.json` — no hardcoded prices.
- Every uploaded doc carries the sender identity block (`CLAUDE.md` → Sender Identity).
- When a source doc changes, the room copy is re-exported in the same working session — a stale room
  copy is a drift incident.

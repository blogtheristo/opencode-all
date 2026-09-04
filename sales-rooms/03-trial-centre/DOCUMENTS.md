# Room 3 — Document Manifest

Status: `todo` · `ready` (exists in repo) · `uploaded` (live in room).
**Current room state: 0 attachments.** Items 1–4 are the minimum before the next invite.

| #   | Title shown in room                                 | Repo source                                                                                                                                            | Format             | Priority | Status                   |
| --- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------ | -------- | ------------------------ |
| 1   | Trial scope & pricing (30 days)                     | derive; prices from `../../dws10.com/config/products.json`                                                                                             | PDF EN + FI        | P0       | todo                     |
| 2   | DWS IQ + Firehorse product family                   | `../../docs/DWS_PRODUCT_STANDARD.md` (derive)                                                                                                          | PDF EN + FI        | P0       | todo                     |
| 3   | Case: steel / materials (Outokumpu-class)           | [`../../sales-outreach/PILOT_SHEET_OUTOKUMPU_FORTA.md`](../../sales-outreach/PILOT_SHEET_OUTOKUMPU_FORTA.md)                                           | PDF, anonymised    | P0       | ready → anonymise        |
| 4   | Sovereignty & security one-pager                    | `../../DWS_SOVEREIGNTY_STANDARD.md` + `../../DWS_SECURITY_STANDARD.md` (derive)                                                                        | PDF                | P0       | todo                     |
| 5   | Case: chemicals (Kemira-class)                      | [`../../sales-outreach/KEMIRA_FLEET_MOBILE_SITUATION_ROOM_BUSINESS_CASE.md`](../../sales-outreach/KEMIRA_FLEET_MOBILE_SITUATION_ROOM_BUSINESS_CASE.md) | PDF, anonymised    | P1       | ready → anonymise        |
| 6   | Compliance coverage (CSRD / ETS / CBAM / EU AI Act) | `../../docs/COMPLIANCE_SCORING.md` (derive)                                                                                                            | PDF                | P1       | todo                     |
| 7   | DPA — data processing agreement                     | [`../../docs/DPA_DATA_PROCESSING_AGREEMENT.md`](../../docs/DPA_DATA_PROCESSING_AGREEMENT.md)                                                           | PDF                | P1       | ready                    |
| 8   | Trust dossier (FI)                                  | [`../../sales-outreach/TRUST_DOSSIER_LIFETIME_OY_FI.md`](../../sales-outreach/TRUST_DOSSIER_LIFETIME_OY_FI.md)                                         | PDF                | P1       | ready                    |
| 9   | Demo tenant walkthrough (2 min)                     | `../DEMO_TENANTS.md` (derive customer-facing)                                                                                                          | Video / PDF + link | P1       | todo                     |
| 10  | Pilot agreement template                            | `../../docs/legal/`                                                                                                                                    | PDF for eSignature | P2       | ready → confirm template |

## Anonymisation rule

A named customer case can only be shown with that customer's consent. Until consent exists, cases go in
anonymised ("a Nordic stainless producer, 3 sites"). Naming a customer in a sales room without consent
is a confidentiality breach, not a marketing choice.

## Rules

- Prices only from `dws10.com/config/products.json`; changes sync to the landing-pages mirror in the
  same commit.
- No raw `.md` uploads — export first (`scripts/render-doc.sh`).
- Deliverable PNGs at 4K (`scripts/screenshot.mjs`) per the PNG Export Rule.

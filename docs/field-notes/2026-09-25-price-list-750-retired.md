# Price list 1.33 — old €750 web package retired — 2026-09-25

# VERSION AND AGENT HISTORY

---

Version: 1.2 [Latest]

Sessions & Modifications:

- Version: 1.2 [Latest] | Tool: Claude Code | Session: claude/price-list-a5-campaign | Date: 25.09.2026 | Changes: IT-support hour bank added as third SME campaign product; A5 flyers; lifetime.fi buy links fixed.
- Version: 1.1 [not latest] | Tool: Claude Code | Session: claude/price-list-a5-campaign | Date: 25.09.2026 | Changes: Product registry (TRUTH row 42) and SME campaign section.
- Version: 1.0 [not latest] | Tool: Claude Code | Session: claude/price-list-a5-campaign | Date: 25.09.2026 | Changes: Initial note — €750 "Kotisivut pk-yritykselle" archived, FI campaign caption, catalogue 1.33 (PR #2107); PR #2085 merge-conflict resolution recorded.

Document Status:

- Created: 25.09.2026
- Last Modified: 25.09.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE
- Status: PENDING_REVIEW

---

- **Date:** 2026-09-25
- **Author:** Claude Code, on behalf of Lifetime Oy
- **Location:** DWS6 repository, cloud session
- **Context:** HIC 25.09.2026: "On price list has old price 750€. Now we have ohjevähittäishinta and campaign price 650€ alv 0".

## Ontology Tags

- **Geography:** Europe > Finland
- **Sector:** Web products for SMEs
- **Entities:** LIFETIME-WEB-STARTER, LIFETIME-WEBSTORE-MINI, professional-web-pages, Lifetime Oy
- **Systems:** `dws10.com/config/products.json`, `dws10.com/price-list/`, `scripts/validate-product-publication.mjs`, Google Merchant feed
- **Temporal Context:** 2026-Q3
- **Confidence:** High; checked with the publication validator and a headless render of the EN and FI price lists.

## The Story

1. **PR #2085 conflicts.** The A5 flyer had been redesigned on main while #2085 was open. The resolution kept main's design and re-applied the OVH figures (1 084 € / 584 €, ALV 0 %), "Verkkotunnus laskutetaan erikseen", Google Workspace 9 €/kk and "Myös jälleenmyyjille". The wording was tightened so both A5 sides still fit (794/794 px each). The HIC's auto-merge then merged it.
2. **The €750 row.** The price list still showed a second, older web product, `professional-web-pages` ("Kotisivut pk-yritykselle", €750), next to Web Starter (€650). It was archived: `archived`, `productType: "archived"`, `supersededBy: LIFETIME-WEB-STARTER`. Its detail pages are kept, not deleted. It no longer appears on the price list, the buy pages or the Merchant feed.
3. **FI caption.** Web Starter and Webstore Mini now have a `captionFi`, which the FI price list renders: "A5-kampanjahinta: −40 % ohjevähittäishinnasta 1 084 € (ALV 0 %)".
4. **Catalogue 1.33.**
   - The price lists were regenerated in 5 languages, plus the v1.33 snapshot and the feed.
   - The validator now expects 70 public products (was 71) and the 1.33 version pins.
   - Everything is mirrored to `landing-pages/`.

5. **Product registry (HIC: "write every product to truth standard").**
   - The catalogue has 154 IDs: 136 `products`, 16 subscription-only records and 2 discontinued records.
   - The price list shows 79: 70 public products and 9 active subscriptions.
   - The gap is 65 BLUE (internal or pilot), 8 archived and 2 discontinued records.
   - `scripts/truth/product-registry.mjs` writes every ID with its status to `docs/truth/PRODUCT_REGISTRY.md` (TRUTH row 42).
   - `validate-product-publication.mjs` fails when the registry is stale or the counts do not reconcile.
6. **SME section.** Campaign products carry tag `SME` and render first on the price list: "Pk-yritysten kampanjatuotteet" on the FI page, "SME campaign products" on the others.

7. **IT-support hour bank (HIC: "Tuntipankki on 3. tuote").**
   - New catalogue record `LIFETIME-IT-TUKI-10H`: 10 h × €75 = €750, VAT 0 %, covering computer renewal, software updates, business applications, information security and training. It is tagged `SME` and appears in the SME section of the price list.
   - Counts are now 155 IDs, with 80 on the list (71 public products + 9 subscriptions).
   - Both A5 flyers now have a third row. Both sides still measure 794/794 px.
   - On `lifetime.fi/atk-tuki-pk-yrityksille/`, the two buy buttons linked to the archived web package. They now open a WhatsApp order with the message prefilled.

## The Insight

A price can be right in one product record and still be wrong on the price list, because an older duplicate record for the same offer was still public. When an offer is repriced, search the catalogue for every record that sells the same thing, not only the record being edited.

## HIC Learning Outcome — Six Steps

| #   | Step                  | Status                                                                                                                           |
| --- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| 1   | KB update             | Raw source added: `kb/raw/articles/2026-09-25-price-list-750-retired.md`. Compile N/A: `dws kb compile` needs the KB API on DGX. |
| 2   | Field note            | This file                                                                                                                        |
| 3   | HTML to `Learn/`      | N/A — `scripts/render-doc.sh` renders on DGX over SSH, which this cloud session cannot reach.                                    |
| 4   | Drive export          | N/A — the repo is the source of truth; no Drive write requested.                                                                 |
| 5   | HIC decision question | Answered by HIC: own product, in the SME section. Open: the 65 BLUE records.                                                     |
| 6   | Calendar              | N/A — no dated commitments.                                                                                                      |

## Next Steps

- HIC merges PR #2107.
- HIC decision: the 65 BLUE records — publish, keep internal, or archive? The registry lists each one.
- The IT-support hour bank has no card checkout. Orders go through WhatsApp until a `/buy/` flow is built for it.
- Blog drafts are parked until the HIC approves them. The approval page is https://claude.ai/artifact/8wFHwRp2gmMqLjhBqNthJy; the FI sovereignty text is approved, and the rest wait.

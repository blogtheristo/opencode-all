# Valuation report delivered; Aegis licence structure confirmed — 2026-09-26

# VERSION AND AGENT HISTORY

---

Version: 1.0 [Latest]

Sessions & Modifications:

- Version: 1.0 [Latest] | Tool: Claude Code | Session: claude/price-list-a5-campaign | Date: 26.09.2026 | Changes: Follow-up note for the day after PR #2107 merged: valuation report sent to the HIC, ontology maintenance-subscription question answered.

Document Status:

- Created: 26.09.2026
- Last Modified: 26.09.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE
- Status: PENDING_REVIEW

---

- **Date:** 2026-09-26
- **Author:** Claude Code, on behalf of Lifetime Oy
- **Context:** The HIC asked again for the Aegis licence structure and the valuation of unpublished products, and asked for the valuation report to be printed. Both changes were already made and merged on 25.09.2026 in PR #2107 (merge commit cb17542e). The full record is in `docs/field-notes/2026-09-25-price-list-750-retired.md` §14.

## What happened

1. The valuation report was sent to the HIC:
   - `docs/valuation/2026-09-25-product-and-repo-valuation.md` v1.1
   - the per-offer table `docs/truth/PRODUCT_VALUATION.md`
2. Result, including unpublished products:

   |                                            | Low        | Central    | High       |
   | ------------------------------------------ | ---------- | ---------- | ---------- |
   | Published products (81)                    | €0.34M     | €0.68M     | €1.35M     |
   | Unpublished BLUE (65, at half probability) | €0.07M     | €0.14M     | €0.28M     |
   | Environment (AI-assisted rebuild)          | €1.41M     | €1.88M     | €2.35M     |
   | **Total**                                  | **€1.82M** | **€2.70M** | **€3.98M** |

   The traditional rebuild ceiling is €7.04M.

3. Aegis follows the ontology product structure:

   | Part           | Aegis                                               | Ontology                       |
   | -------------- | --------------------------------------------------- | ------------------------------ |
   | Pilot          | DWS-AEGIS-PILOT-001                                 | LF-ONTOLOGY-PILOT              |
   | Licence        | DWS-AEGIS-001, €59,990 one-time                     | LF-ONTOLOGY-25, annual         |
   | Implementation | DWS-AEGIS-IMPL-001                                  | LF-TRAIN-IND                   |
   | Maintenance    | DWS-AEGIS-SUB-001: €999, €1,999 or €4,999 per month | included in the annual licence |

4. **HIC question:** "Pitäisikö ontology tuotteessa on ylläpito subscription?" The answer differs by product:
   - LF-ONTOLOGY-25: no. It is an annual licence that already includes quarterly updates, so a separate subscription would charge twice.
   - LWM-ONT-SOVEREIGN: yes, as a recommendation. It is a perpetual on-prem licence (€49,990), and its updates (€9,990/year) sit only in the price note. A separate maintenance SKU would match Aegis. Not created; it waits for the HIC's decision.

5. **Copilot review findings on PR #2107, fixed after the merge.** The three findings were left unanswered when #2107 merged:
   - `feeds/local-inventory.tsv` still advertised the archived `professional-web-pages`. The generator already excluded archived records, but the feed had not been regenerated since.
   - `/buy/page2/` and `/buy/page3/` rendered archived records with payment buttons. They filtered only on `buyPage`.
   - The v1.33 price-list header and meta tags still carried effective date 2026-09-24.

   All three are fixed, with mirrors, in PR #2122.

   Found while checking, not fixed: 15 BLUE (internal) records appear in the local-inventory feed, and 9 LAND bundles in the Merchant XML feed. This predates the work. Whether BLUE may be advertised is a HIC decision.

## The Insight

Two product lines now follow one commercial pattern: pilot, licence, implementation and maintenance. When a new licensed product is added, it should follow the same four parts. Then pricing, the valuation model and the registries treat it the same way without special cases.

## HIC Learning Outcome — Six Steps

| #   | Step                  | Status                                                                                                                                                |
| --- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | KB update             | Raw source copy: `kb/raw/articles/2026-09-26-valuation-report-and-aegis-licence-follow-up.md`. Compile N/A: `dws kb compile` needs the KB API on DGX. |
| 2   | Field note            | This file                                                                                                                                             |
| 3   | HTML to `Learn/`      | N/A — `scripts/render-doc.sh` renders on DGX over SSH, which this cloud session cannot reach.                                                         |
| 4   | Drive export          | N/A — the repo is the source of truth; no Drive write requested.                                                                                      |
| 5   | HIC decision question | Asked in chat: create a separate LWM-ONT-SOVEREIGN maintenance SKU at €9,990/year?                                                                    |
| 6   | Calendar              | N/A — no dated commitments.                                                                                                                           |

## Next Steps

- HIC: decide on the LWM-ONT-SOVEREIGN maintenance SKU.
- HIC: verify, or ask for verification of, the four estimated segment counts in `config/truth/product-valuation-model.json`.
- HIC: apply migration `092_250926_product_lifecycle.sql` (RED).
- 12 blog drafts in `docs/blog-drafts/` are parked. They wait for HIC approval under Rule 13; the approval page is https://claude.ai/artifact/8wFHwRp2gmMqLjhBqNthJy.

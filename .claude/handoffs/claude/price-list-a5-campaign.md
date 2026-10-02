# Handoff — claude/price-list-a5-campaign

# VERSION AND AGENT HISTORY

---

Version: 1.0 [Latest]

Sessions & Modifications:

- Version: 1.0 [Latest] | Tool: Claude Code | Session: claude/price-list-a5-campaign | Date: 25.09.2026 | Changes: End-of-session handoff: PR #2107 (price list 1.33, registries, tags, valuation) merged on HIC "merge"; open work and next-session prompt.

Document Status:

- Created: 25.09.2026
- Last Modified: 25.09.2026
- Language: English
- Publication Status: ACTIVE

---

**Date:** 2026-09-25 · **Runtime:** Claude Code (cloud) · **Status:** PR #2107 merge approved by the HIC ("Commit and push and merge", 25.09.2026).

## Done (PR #2107)

**Catalogue 1.33** — the source is `dws10.com/config/products.json`.

- €750 web package archived.
- IT-support hour bank `LIFETIME-IT-TUKI-10H` added (SME).
- Aegis restructured as licence + pilot + implementation + maintenance subscription (new `DWS-AEGIS-SUB-001`).
- Totals: 138 product records, 72 public, 81 rows on the price list.

**Price list**

- Six product groups, each with a soft background colour: SME, DWS IQ, Firehorse, data, services, hardware.
- No "Supporting" badge.
- 17 tags, shown as chips; FI labels come from the dictionary.
- Every offer has a one-line caption, in EN and FI.
- Long price notes sit under a Terms toggle.

**Truth registries**

| Row | What                                                                                 | File / script                                                                                   |
| --- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| 42  | Product registry, with a TAM column                                                  | `docs/truth/PRODUCT_REGISTRY.md`                                                                |
| 43  | Lifecycle, 184 IDs from planned to retired, with record version vN and page versions | `docs/truth/PRODUCT_LIFECYCLE.md`                                                               |
| 44  | Price-list versions: 24; sha256-frozen snapshots; 13 reconstructed from git          | `docs/truth/PRICE_LIST_VERSIONS.md`                                                             |
| 45  | Valuation                                                                            | `docs/truth/PRODUCT_VALUATION.md` and `docs/valuation/2026-09-25-product-and-repo-valuation.md` |

- All four are enforced by `scripts/validate-product-publication.mjs`.
- HIC decisions go into the append-only ledger `config/truth/product-lifecycle-ledger.json`. `firehorse-mobile` is planned there.

**Taxonomy**

- ONTOLOGY v1.9 §17.
- Dictionary: 17 `product_tag_*` keys in five languages.
- KB page `kb/wiki/concepts/product-taxonomy.md`.

**Supabase**

- Migration `supabase/migrations/092_250926_product_lifecycle.sql` is written and tested on a local PostgreSQL 16; it is **not applied**.
- Loader: `scripts/truth/product-lifecycle-to-supabase.mjs --apply`.

**Deletion audit**

- The repository wipe (197daefdb, #1888) was fully restored by #1890.
- `Admin/KUBERNETES_OPERATIONS_MANUAL.md` was lost in merge #1961; it is restored.

**Other**

- A5 flyers: third row (IT support). Both sides fit A5.
- lifetime.fi atk-tuki buy buttons now open a WhatsApp order.

## Valuation (internal, 25.09.2026)

| Measure                                               | Low        | Central    | High       |
| ----------------------------------------------------- | ---------- | ---------- | ---------- |
| Products (81 published + 65 BLUE at half probability) | €0.41M     | €0.82M     | €1.63M     |
| Environment (AI-assisted rebuild)                     | €1.41M     | €1.88M     | €2.35M     |
| **Total**                                             | **€1.82M** | **€2.70M** | **€3.98M** |

- The traditional rebuild ceiling is €7.04M.
- Prior independent valuations: €3.8M (Gust, 2021, DWS only) and $6M (Monaco Fondry, 2022).

## Open — HIC decisions

1. Apply migration 092 in production (RED), then run the loader with `--apply`.
2. Verify the four estimated segment counts in `config/truth/product-valuation-model.json`: FI enterprises 290k, EU industrial 20k, EU 250+ 50k, EU regulated 3k.
3. Revise `docs/investor/data-room-2026Q2/TAM_REFRAMED.md`. It still uses the pre-Omnibus figure of ~50k CSRD undertakings.
4. LWM-ONT-SOVEREIGN: should its €9,990/year updates become a separate maintenance SKU, like Aegis?
5. Six removed IDs still have live public pages: cloud-ready-teams, expert-advisory, expert-services, lifetime-exp-001, m365-consultancy, secure-email-proton. Nine pages have no catalogue ID.
6. The 65 BLUE records: publish, keep internal, or archive?
7. Firehorse Mobile needs a price, which gives it a catalogue record and a value.
8. The Aegis pages (`dws10.com/products/aegis*.html`) still say "onboarding". Align them with "licence".
9. SV/DE/FR tag terms need named human review.
10. From earlier handoffs:
    - #2086: checkout test before merge.
    - Blog drafts 6–10 need approval.
    - Blog-refs / whitepaper form work: see `.claude/handoffs/claude/blog-drafts-review.md`.

## Next session prompt

```
Continue from .claude/handoffs/claude/price-list-a5-campaign.md (read it first, then CLAUDE.md standards routing: DWS_TRUTH_STANDARD rows 42–45, ONTOLOGY §17).
PR #2107 is merged. Start a fresh branch from main (claude/<topic>-<id>).
Do, in order, only what the HIC has decided:
(1) if the HIC applied migration 092, run node scripts/truth/product-lifecycle-to-supabase.mjs --apply (needs SUPABASE_URL + SUPABASE_SERVICE_KEY; never print them) and verify row counts (184 + evidence);
(2) verify the four estimated segment counts in config/truth/product-valuation-model.json from primary sources (Statistics Finland, Eurostat SBS), set status "sourced" with the URL, rerun scripts/truth/product-valuation.mjs;
(3) revise docs/investor/data-room-2026Q2/TAM_REFRAMED.md to the post-Omnibus CSRD scope (<5,000 companies; DWS_TRUTH_STANDARD regulatory row);
(4) align dws10.com/products/aegis*.html (+ landing-pages mirror) wording from "onboarding" to "licence" and link DWS-AEGIS-SUB-001;
(5) for every catalogue change: bump price-list version, run scripts/gen-price-list-html.cjs (never overwrite frozen snapshots), scripts/truth/price-list-versions.mjs, product-registry, product-lifecycle (--scan-git after merge), product-valuation, then scripts/validate-product-publication.mjs.
Reply to the HIC in Finnish, Decisions / Facts used / HIC actions format.
```

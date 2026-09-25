# Price list 1.33 — old €750 web package retired — 2026-09-25

# VERSION AND AGENT HISTORY

---

Version: 1.7 [Latest]

Sessions & Modifications:

- Version: 1.7 [Latest] | Tool: Claude Code | Session: claude/price-list-a5-campaign | Date: 25.09.2026 | Changes: Full tag set, Finnish captions.
- Version: 1.6 [not latest] | Tool: Claude Code | Session: claude/price-list-a5-campaign | Date: 25.09.2026 | Changes: Tags in ontology, dictionary and KB; firehorse-mobile planned; Supabase migration and loader.
- Version: 1.5 [not latest] | Tool: Claude Code | Session: claude/price-list-a5-campaign | Date: 25.09.2026 | Changes: Captions on all public offers; attribute tags; long price notes split.
- Version: 1.4 [not latest] | Tool: Claude Code | Session: claude/price-list-a5-campaign | Date: 25.09.2026 | Changes: Product lifecycle registry (TRUTH row 43).
- Version: 1.3 [not latest] | Tool: Claude Code | Session: claude/price-list-a5-campaign | Date: 25.09.2026 | Changes: Product groups (tags DWS IQ and Firehorse), themed colours, Supporting tag dropped.
- Version: 1.2 [not latest] | Tool: Claude Code | Session: claude/price-list-a5-campaign | Date: 25.09.2026 | Changes: IT-support hour bank added as third SME campaign product; A5 flyers; lifetime.fi buy links fixed.
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

8. **Product groups (HIC: "Tee tag Firehorse … ryhmä DWS IQ … lempeä taustaväri"; "Luovumme tag Supporting").**
   - The count check confirms 137 `products` records, 155 IDs in total and 80 offers on the price list.
   - New tags: `DWS IQ` on 18 offers and `Firehorse` on 9.
     - `FH-RPT-001` is named "DWS IQ Report", so it goes under DWS IQ.
     - `conversational-agent` goes under Firehorse as a customer-conversation agent.
     - `firehorse-coach` (EU AI Act literacy training) stays under services.
   - The price list has six groups, each with a soft background colour and an accent border:

     | Group                             | Offers | Colour   |
     | --------------------------------- | ------ | -------- |
     | SME                               | 3      | sand     |
     | DWS IQ                            | 18     | blue     |
     | Firehorse                         | 9      | coral    |
     | Data products                     | 2      | teal     |
     | Services, consulting and training | 20     | lavender |
     | Hardware and infrastructure       | 28     | slate    |

   - The "Supporting" badge is gone. Only Serious and Independent offers are badged.
   - The registry has a Group column and per-group counts. The validator checks that each group tag has a public product and is rendered.

9. **Product lifecycle registry (HIC: "IDs has to be on truth registry with retired to future unpublished products … with decision evidence … own md and later supabase db").**
   - `docs/truth/PRODUCT_LIFECYCLE.md` lists 183 IDs. The generator is `scripts/truth/product-lifecycle.mjs` (TRUTH row 43).
     - 155 are in the catalogue.
     - 18 were removed from the catalogue; the evidence comes from 93 first-parent commits.
     - 10 are public product pages with no catalogue ID.
   - Each ID has a state (planned, page-only, internal, published, archived, discontinued or removed) and its evidence:
     - HIC decisions from the append-only ledger `config/truth/product-lifecycle-ledger.json`
     - the git commits that changed its state
     - archive and discontinue fields
     - page files
   - The ledger holds only the four HIC decisions of 25.09.2026. No planned product was invented; planned rows start when the HIC decides one.
   - Drift found:
     - Six removed IDs still have live public pages: cloud-ready-teams, expert-advisory, expert-services, LIFETIME-EXP-001, m365-consultancy and secure-email-proton.
     - Ten pages have no catalogue ID, among them firehorse-mobile ("coming soon") and themis.
   - Supabase is next. `config/truth/product-lifecycle.json` is already shaped as rows plus evidence (tables `product_lifecycle` and `product_lifecycle_evidence`). Applying the migration is a HIC step.

10. **Captions and attribute tags.**
    - HIC: "Kaikkiin tuotteisiin selite kenttään kuvaus"; "Tag them Hardware … Sovereign … Air-Gapped. Aegis as well … DWS IQ is tag Sovereign Cloud".
    - 71 of the 80 public offers had no one-line caption. Each got one, written from the product's own catalogue description; the longest is 119 characters. The validator now requires a caption of at most 160 characters.
    - The caption colour was dark navy on the dark screen background. It is now light on screen and navy in print.
    - Tags:
      - Hardware, Sovereign and Air-Gapped on the 11 hardware products.
      - Sovereign and Air-Gapped on the 3 Aegis offers.
      - Sovereign Cloud on 13 other DWS IQ offers.
    - Not tagged Sovereign Cloud: DWS-US-STARTER and DWS-US-PILOT, because they run on US infrastructure (Supabase + Cloudflare).
    - Not tagged Hardware: LF-NVIDIA-INSTALL, which is an installation service.
    - Tags render as chips. The validator only accepts tags from `definitions.productTags.allowed`.
    - Price notes over 180 characters show their first sentence, with the rest under a "Terms" toggle, split at ALL-CAPS headings. Three offers have one: Aegis Pilot, Aegis Implementation and the Ontology licence.
    - The captions are in English only; FI captions (`captionFi`) are not yet written.

11. **Tags in the ontology, dictionary and KB; lifecycle in Supabase.**
    - HIC: "Add tags to ontology and kb and dictionary"; "1. Anna linkit tutkin 2. On tulossa 3. Tee".
    - ONTOLOGY v1.9 adds §17: group tags, attribute tags and lifecycle states.
    - The dictionary adds seven `product_tag_*` keys in five languages. SV, DE and FR are pending named human review.
    - New KB concept page: `kb/wiki/concepts/product-taxonomy.md`.
    - `firehorse-mobile` is recorded as planned in the ledger (HIC: "On tulossa"). The lifecycle now has 1 planned ID and 9 page-only IDs.
    - Migration `092_250926_product_lifecycle.sql`:
      - Two tables. GRANT is given to authenticated and service_role, RLS is on, and there is no read policy, because the data includes internal BLUE records.
      - Tested on a local PostgreSQL 16: it applies twice without error, and all 183 IDs and 252 evidence rows load within the constraints.
      - Applying it to production is a HIC step.
    - Loader: `scripts/truth/product-lifecycle-to-supabase.mjs`. It is a dry run by default; `--apply` upserts over REST.

12. **Full tag set and Finnish captions** (HIC: "US Sovereign Cloud tagi"; "Kirjoita"; "Subscription tag … licence tag … Tag installation … Kaikki tagit talteen").
    - There are 17 allowed tags; the counts are:

      | Tag                | Offers | Tag          | Offers |
      | ------------------ | ------ | ------------ | ------ |
      | US Sovereign Cloud | 2      | Installation | 5      |
      | Subscription       | 25     | Pilot        | 5      |
      | Licence            | 2      | Free         | 1      |
      | On-Prem            | 10     | Training     | 6      |
      | Gov Ready          | 6      | Early Access | 1      |

    - Tag details:
      - US Sovereign Cloud is on the US offers, and never together with Sovereign Cloud.
      - Subscription is derived from the price type: a recurring price gets it, nothing else does.
      - Licence is on LF-ONTOLOGY-25 (annual) and LWM-ONT-SOVEREIGN (perpetual artefact licence).
      - Installation is on the IT-support hour bank, LF-NVIDIA-INSTALL and the three Jetson install packages.
      - Air-Gapped is also on LF-GOV-AIRGAP-BUNDLE. Sovereign is also on LWM-ONT-SOVEREIGN and LF-SOV-MODEL-SUB.
    - Finnish captions (`captionFi`) are on all 80 offers, and the FI price list shows them.
    - The IT-support hour bank's EN caption was in Finnish; it is now in English.
    - The FI page shows tag chips in Finnish, using the dictionary's `product_tag_*` fi values; the validator checks that the two match.
    - The validator also enforces:
      - tag order
      - Sovereign Cloud and US Sovereign Cloud are never on the same record
      - the Subscription tag matches the price type
      - every public offer has a captionFi
    - Open question: the Aegis implementation record says "Aegis onboarding and licence", but DWS-AEGIS-001 has no licence price of its own. Aegis is not tagged Licence yet.

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

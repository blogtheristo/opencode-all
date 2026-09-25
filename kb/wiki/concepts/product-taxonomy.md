<!--
VERSION AND AGENT HISTORY
Document: product-taxonomy.md
Version: 1.1
Last-Updated: 2026-09-25
Author: Risto Anton Päärni (Lifetime Oy)
Agent: Claude Code
Purpose: One tag vocabulary for DWS products: group tags, attribute tags and lifecycle states.
Introduced-In: PR #2107 (branch claude/price-list-a5-campaign)
Date: 2026-09-25
Owner: risto.paarni@lifetime.fi
-->

# Product Taxonomy — Tags and Lifecycle States

**Version:** 1.1 · **Status:** Active · **Scope:** price list, product pages, registries, outreach, dictionary
**Canonical:** `ONTOLOGY.md` §17 · **Catalogue:** `dws10.com/config/products.json` (`definitions.productTags`)
**Companions:** `docs/truth/PRODUCT_REGISTRY.md` (TRUTH row 42), `docs/truth/PRODUCT_LIFECYCLE.md` (TRUTH row 43), `docs/field-notes/2026-09-25-price-list-750-retired.md`

## The rule

A product tag is a claim about the product. Use only the allowed tags, and only where the claim is true.

## Group tags (which price-list section)

- **SME**: campaign products for Finnish SMEs. There are 3: Web Starter, Webstore Mini and the IT-support hour bank.
- **DWS IQ**: the DWS IQ platform family, including Aegis. There are 18 offers.
- **Firehorse**: the Firehorse agent products and their subscription. There are 9 offers.

Offers without a group tag are grouped by catalogue class: data products, services, and hardware and infrastructure.

## Attribute tags (what the product is)

- **Hardware**: a physical device. There are 11. Installation services do not carry it.
- **Sovereign**: runs under the customer's or an EU jurisdiction. It is on the hardware products and the 3 Aegis offers.
- **Air-Gapped** (FI: ilmaeristetty (air-gapped)): can run with no outside network connection. It is on the hardware products and the 3 Aegis offers.
- **Sovereign Cloud**: hosted on EU sovereign cloud infrastructure. It is on 13 DWS IQ offers. The two US Cloud offers do not carry it.
- **US Sovereign Cloud**: US-hosted, under US jurisdiction. It is on the two US offers and is never combined with Sovereign Cloud.
- **On-Prem** (10), **Gov Ready** (6), **Licence** (2: LF-ONTOLOGY-25, LWM-ONT-SOVEREIGN), **Subscription** (25: every recurring offer and only those), **Installation** (5), **Pilot** (5), **Free** (1), **Training** (6), **Early Access** (1: KYA-JEV-001).

Hardware products always carry, in this order: Hardware, Sovereign, Air-Gapped. On every record, tags follow the order of the allowed list.

## Lifecycle states

planned → page-only → internal (BLUE) → published → archived / discontinued / removed.

`docs/truth/PRODUCT_LIFECYCLE.md` shows every ID with its state and the evidence: HIC decisions, git commits, catalogue fields and pages. A new product is entered in the ledger (`config/truth/product-lifecycle-ledger.json`) as planned before it gets a catalogue record.

## Five languages

The 17 `product_tag_*` keys in `docs/localization/dws-dictionary.json` hold the tags in five languages. FI is the ground truth. SV, DE and FR are pending named human review.

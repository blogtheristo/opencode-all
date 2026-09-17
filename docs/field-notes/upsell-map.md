# Field Note: Upsell Map Was Public but Should Have Been Internal

***

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: GitHub Copilot CLI (GPT-5.4) | Session: 2a58e89b-7e85-45c3-a2b1-e10d0a3fac4b | Date: 21.05.2026 | Changes: Initial field note documenting the discovery that `dws10.com/upsell-map/` was publicly exposed even though it is an internal sales and packaging artifact. Captures why the page was retired and what governance rule should apply to similar internal operational pages.

Document Status:

- Created: 21.05.2026
- Last Modified: 21.05.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE
- Document Type: Field Note / Web Governance

Related Documents:

- dws10.com/upsell-map/index_OLD.html
- landing-pages/dws10-com/upsell-map/index_OLD.html
- dws10.com/price-list/index.html
- dws10.com/legal/index.html

***

- **Date:** 2026-05-21
- **Author:** Risto Anton Paarni (risto.paarni@lifetime.fi)
- **Location:** Espoo, Finland
- **Context:** Public-site cleanup across `dws10.com`, `onelifetime.world`, and mirrored landing-pages copies. During the audit, `dws10.com/upsell-map/` was found live on a public route even though it functions as an internal sales packaging and expansion artifact rather than customer-facing documentation.

## Ontology Tags

- **Geography:** Europe > Finland > Espoo
- **Sector:** Software > B2B SaaS > Web Governance
- **Entities:** Lifetime Oy, DWS IQ, dws10.com, landing-pages/dws10-com, upsell-map, price-list
- **Standards:** DWS Document Standard, DWS Brand Standard, Public Site Governance
- **Temporal Context:** 2026-Q2, public-site cleanup and depublication pass
- **Confidence:** High

***

## The Story

The `upsell-map` page was reachable on the public DWS10 domain even though the content was not meant to operate as a public landing page, legal page, or customer-facing product page.

The route behaved like an internal packaging aid: it described commercial structure around the SKU catalogue and cross-sell logic, but did not belong in the public information architecture. That creates avoidable exposure:

1. Prospects can see internal packaging logic rather than the curated public narrative.
2. Public crawlers can index material that is operational rather than customer-facing.
3. The existence of the route creates ambiguity about which documents are official public sources of truth.

The page was retired by renaming the live files out of service:

- `dws10.com/upsell-map/index.html` -> `index_OLD.html`
- `landing-pages/dws10-com/upsell-map/index.html` -> `index_OLD.html`

No additional live links to `upsell-map` were found in the DWS10 source tree during the cleanup pass, so the route could be removed without public navigation fallout.

## The Insight

Internal operational pages often look polished enough to survive as public pages by accident. That is a governance risk, not just a content-quality issue.

The correct public sources of truth here are:

- `dws10.com/price-list/` for customer-visible commercial structure
- `dws10.com/legal/` for official legal and compliance references
- curated product and buy pages for public positioning

The `upsell-map` route sat between internal sales enablement and external marketing, which is exactly the kind of artifact that should default to **internal** unless explicitly approved for publication.

This reinforces a simple rule: if a page exists primarily to help the team reason about packaging, upsell paths, or internal commercial logic, it should not ship on a public route.

## Next Steps

1. Add `upsell-map`, internal packaging maps, and similar sales-ops artifacts to the periodic public-route audit checklist.
2. Prefer internal docs or protected admin surfaces for pricing and upsell planning tools; keep public commercial truth on `dws10.com/price-list/`.
3. Continue the broader depublication pass for outdated or duplicate public pages on `onelifetime.world` and mirrored landing-pages copies.
4. During future page launches, classify each route explicitly as `public`, `internal`, or `deprecated` before deployment.


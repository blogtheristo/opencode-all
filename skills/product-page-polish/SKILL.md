# Skill: Product Page Polish & Industrial Alignment

`ID: product-page-polish` · `Version: 1.0.0` · `Profile: skill-pack-cli`

## Context

Applies the Aegis-level "FINAL bar" (PR #1490) across DWS product surfaces:
premium DWS-gold brand layer, IBM Plex Sans typography, Industrial Intelligence
suite positioning, and the credibility/legal-hygiene fixes the Aegis review
caught. One invocation = one product = one atomic commit (source + mirror +
canonical Store file), lint-clean and byte-identical.

This is a parameterized **procedure**, not a per-product script. The invocation
supplies the world; the skill supplies the process.

## Parameters

| Param             | Meaning                                   | Example                                        |
| ----------------- | ----------------------------------------- | ---------------------------------------------- |
| `PRODUCT_NAME`    | Public product name                       | `DWS IQ Themis`                                |
| `SOURCE_FILE`     | Canonical public page (root site = truth) | `dws10.com/products/themis.html`               |
| `MIRROR_FILE`     | Landing-pages mirror (must stay synced)   | `landing-pages/dws10-com/products/themis.html` |
| `CANONICAL_STORE` | Store markdown (if one exists, else `—`)  | `Store/PRODUCT_THEMIS.md`                      |
| `PAGE_VERSION`    | Version token for the page footer         | `v1.0 · 2026-06-23`                            |

## Step-by-Step Execution Sequence

1. **Read first.** Read `SOURCE_FILE`, `MIRROR_FILE`, and `CANONICAL_STORE` to
   map the current feature-set, price points, and any named customers. Note the
   product's role in the Industrial Intelligence suite before editing.
2. **Brand layer.** Inject IBM Plex Sans (body) / IBM Plex Sans Condensed
   (headings) via the brand §8 Google Fonts link with SRI + `crossorigin`.
   Apply DWS gold `--color-gold #b8860b` → `--color-gold-light #d4a843` to the
   hero gradient, `h2` headings, CTA button, table headers, and the 3px top
   accent. Premium, not generic.
3. **Positioning.** Align tagline/hero/meta/OG to the Industrial Intelligence
   suite. State how the product fits the suite (and, for tiers, its relation to
   the DWS IQ 6 core engine and the Aegis dual-use tier). Industrial /
   factory-floor / dual-use lens where the product warrants it.
4. **Compliance hygiene** (the things the Aegis review caught):
   - Certs: attribute current certs to the right entity — `ISO 27001 (UpCloud
infrastructure)` vs roadmap `Lifetime Oy — targeting Q3 2026`. No
     contradictions.
   - SLA: split `99.9% application target / 99.999% underlying infrastructure
(UpCloud)`.
   - Eligibility: `architected to satisfy` / `ALIGNED`, never `PASS` /
     `meets all` where no third-party vetting exists.
   - Pricing claims tier-safe: any "Nx cheaper" pinned to the specific tier with
     real Year-1 math.
   - Case studies: if pre-GA or unconsented, label **illustrative** / frame as
     an anonymized "Operational Trace Log". Never imply a real customer incident.
   - Competitors: balanced "equal lineup" — acknowledge each rival's genuine
     strength, then the structural differentiator (sovereignty / CLOUD Act /
     EU AI Act).
5. **Pricing = read-only.** Cross-reference every price against
   `dws10.com/config/products.json`. Never invent math. If the page hardcodes a
   price that drifts from the JSON, **flag it for manual reconciliation** — do
   not "fix" the canonical source to match drifting copy, and do not expand
   hardcoded prices.
6. **Version token.** Append/refresh the footer marker:
   `<PRODUCT_NAME> — page <PAGE_VERSION>`.
7. **Lint gate.** `node scripts/lint-truth-claims.mjs <files>` → must be
   **0 fail**. Pre-existing unrelated WARNs are left alone (note them).
8. **Dual-folder sync.** `cp SOURCE_FILE MIRROR_FILE`, then
   `diff -q SOURCE_FILE MIRROR_FILE` must report identical. Both staged in the
   same commit.
9. **Atomic commit.** One commit per product containing source + mirror +
   Store file, with the repo's required trailers.

## Input / Output Contract

- **Input:** the five parameters above + the loaded standards
  (`DWS_BRAND_STANDARD.md`, `DWS_TRUTH_STANDARD.md`, `DWS_DOCUMENT_STANDARD.md`,
  `dws10.com/config/products.json`).
- **Output:** one lint-clean, mirror-identical atomic commit, plus a one-line
  changelog entry (what changed, any prices flagged, any named customers flagged).

## Done-condition

Page passes the FINAL-bar checklist; truth-check 0 fail; mirror byte-identical;
prices unchanged unless routed through `products.json`; named-customer claims
either verified-consented or relabelled illustrative.

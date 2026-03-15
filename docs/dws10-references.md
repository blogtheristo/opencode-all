# DWS10.com — Central Reference Registry

> **Purpose:** Single source of truth for all citations, footnotes, and source references used across dws10.com pages. Keeps claims verifiable, current, and auditable.
>
> **Rule:** Every reference on dws10.com MUST be listed here. When updating a reference on any page, update this file first, then propagate to the HTML.
>
> **Staleness threshold:** Any reference older than 12 months from today's date should be reviewed and replaced with a current equivalent.

---

## Active References

### REF-001: Gartner — Data Management Planning Guide

| Field | Value |
|-------|-------|
| **ID** | REF-001 |
| **Source** | Gartner |
| **Date** | October 2025 |
| **Title** | *2026 Planning Guide for Data Management* |
| **Claim** | AI-driven data automation platforms commonly deliver 30–60% reductions in data preparation time |
| **Supporting** | Gartner, Forrester, IDC reports 2024–2025 |
| **Used on** | `products/dwsiq.html` (footnote ¹) |
| **Review by** | October 2026 |

### REF-002: EU Fit for 55 Legislative Package

| Field | Value |
|-------|-------|
| **ID** | REF-002 |
| **Source** | EU Council & European Commission |
| **Date** | 2023–2025 (as amended) |
| **Title** | *Fit for 55 Legislative Package* |
| **Key acts** | Directive (EU) 2023/959 (ETS reform), Regulation (EU) 2023/956 (CBAM) |
| **Updates** | Feb 2025 CBAM simplification proposal; Dec 2025 provisional agreement on 2040 climate target (90% net GHG reduction) |
| **URL** | https://www.consilium.europa.eu/en/policies/fit-for-55/ |
| **Used on** | `products/dwsiq.html` (footnote ²), `investor-relations/index.html`, `investor-relations/pitch-deck.html` |
| **Review by** | Evergreen — update when new amendments are adopted |

### REF-003: McKinsey — AI Productivity Survey

| Field | Value |
|-------|-------|
| **ID** | REF-003 |
| **Source** | McKinsey & Company |
| **Date** | 2025 |
| **Title** | *The state of AI: How organizations are rewiring to capture value* (McKinsey Global Survey on AI) |
| **Claim** | 50–75% productivity gains in document generation and reporting tasks across early AI adopters |
| **Used on** | `products/firehorse-reports.html` (footnote ¹) |
| **Review by** | February 2026 (next McKinsey AI survey expected mid-2026) |

---

## Retired References

### RET-001: Gartner (2023) — Data Management for the AI Era ❌

| Field | Value |
|-------|-------|
| **Retired** | 2026-02-24 |
| **Reason** | Not verifiable as a formal Gartner publication. The 40% figure is untraceable to a specific Gartner source. Replaced by REF-001. |
| **Was on** | `products/dwsiq.html` |

### RET-002: EU Commission (2023) — Fit for 55 Package Legislation ❌

| Field | Value |
|-------|-------|
| **Retired** | 2026-02-24 |
| **Reason** | Incomplete for 2026 — core package adopted 2023–2024 but significantly amended in 2025. Replaced by REF-002 with specific directive numbers and 2040 target update. |
| **Was on** | `products/dwsiq.html` |

### RET-003: McKinsey (2024) — The economic potential of generative AI ❌

| Field | Value |
|-------|-------|
| **Retired** | 2026-02-24 |
| **Reason** | Over 12 months old. Replaced by REF-003 with 2025 survey data. |
| **Was on** | `products/firehorse-reports.html` |

---

## Reference Audit Checklist

Run this quarterly (or before any investor/compliance review):

1. Check each active reference against the 12-month staleness threshold
2. Verify URLs still resolve (especially EU regulatory links)
3. Search for newer editions of recurring publications (Gartner Planning Guides, McKinsey AI Surveys)
4. Ensure all footnotes on dws10.com pages match an entry in this registry
5. Update `landing-pages/dws10-com/` after any HTML reference change

---

## Pages with References

| Page | Footnotes | Reference IDs |
|------|-----------|---------------|
| `products/dwsiq.html` | ¹, ² | REF-001, REF-002 |
| `products/firehorse-reports.html` | ¹ | REF-003 |
| `investor-relations/index.html` | (inline) | REF-002 |
| `investor-relations/pitch-deck.html` | (inline) | REF-002 |

---

*Last updated: 2026-02-24*
*Maintained by: DWS Platform Team*

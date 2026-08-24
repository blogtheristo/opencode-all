# Field Note: 4-Jurisdiction Cloud Architecture — DWS IQ 7

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Sonnet 4.6) | Session: claude/review-product-images-R6a0C | Date: 2026-04-16 | Changes: Initial creation — documents 4-jurisdiction expansion decision for DWS IQ 7 roadmap, G42 UAE partnership intent, ASEA placeholder

Document Status:

- Created: 2026-04-16
- Last Modified: 2026-04-16
- Language: English
- Publication Status: INTERNAL — NOT for public sites

---

## Decision Summary

DWS IQ 7 will support **four cloud jurisdictions** for customer data residency selection. This expands from the current two-track architecture (EU Sovereign + US Cloud) to a four-track model by 2027.

| Jurisdiction | Status          | Infrastructure Partner                    | Tier Naming       |
| ------------ | --------------- | ----------------------------------------- | ----------------- |
| EU           | Live (DWS6)     | Hetzner (DE) + Scaleway (FR) + Aiven (FI) | Enterprise [tier] |
| US           | Live (DWS6)     | Cloudflare + Supabase (US-owned)          | US Cloud [tier]   |
| UAE          | Planned Q3 2027 | G42 (planned partner)                     | UAE [tier] — TBD  |
| ASEA         | Planned Q4 2027 | TBD                                       | ASEA [tier] — TBD |

## Context

**Decision date:** 2026-04-16 (session: claude/review-product-images-R6a0C)

The jurisdiction field on the `cloud-pricing.html` page currently presents only EU vs US choices. The 4-jurisdiction model is a DWS 7 feature — **nothing is added to DWS 6 pages yet.**

## Jurisdiction Details

### EU (Current)

- Infrastructure: Aiven PostgreSQL (Finnish-owned) + Hetzner/Scaleway compute
- Regulatory scope: GDPR, NIS2, EU AI Act Article 12, CLOUD Act-free
- Tier branding: Enterprise Navigator / Enterprise Premium / Enterprise Nordic / Enterprise Sovereign

### US Cloud (Current)

- Infrastructure: Supabase (US-owned) + Cloudflare Workers
- Regulatory note: Subject to CLOUD Act; customers acknowledge this at signup
- Tier branding: US Cloud Navigator / US Cloud Premium / US Cloud Nordic / US Sovereign

### UAE — G42 (Planned, Q3 2027)

- **Planned infrastructure partner: G42** (Abu Dhabi-based sovereign AI cloud)
- G42 operates UAE government-grade infrastructure; Microsoft partnership announced 2024
- Relevant regulatory zones: DIFC (Dubai International Financial Centre), ADGM (Abu Dhabi Global Market)
- Compliance profile to build: UAE PDPL (Personal Data Protection Law), DIFC Data Protection Law 2020
- Status: **Partnership intent only — no contract signed as of 2026-04-16**
- Action required: Legal + commercial partnership agreement with G42 before implementing

### ASEA — Southeast Asia (Planned, Q4 2027)

- **No infrastructure partner selected as of 2026-04-16**
- Target markets: Singapore, Malaysia, Indonesia, Thailand, Vietnam
- Likely infrastructure candidates: AWS ap-southeast-1 (Singapore), Google Cloud asia-southeast1, or regional sovereign providers
- Compliance profile to build: PDPA Singapore, PDPA Thailand, Indonesia PP 71/2019
- Status: **Roadmap placeholder only — no partner, no commitment**

## What Changes in DWS 7

1. **Jurisdiction router** — at onboarding, customer selects jurisdiction; data residency enforced from day 1
2. **Per-jurisdiction compliance profiles** — regulatory engine loads the correct regulation set per jurisdiction (EU regs, DIFC regs, ASEAN PDPA variants)
3. **Sovereignty score per jurisdiction** — the existing EU sovereignty scoring model extended with UAE and ASEA equivalents
4. **cloud-pricing.html v2** — new page layout with 4-column (or 2×2) tier comparison replacing current 2-column design

## Open Questions

- G42 commercial terms: revenue share, data processing agreements, pricing passthrough
- ASEA partner selection: sovereign cloud vs hyperscaler vs regional DC
- Whether UAE compliance profile requires separate legal entity (UAE freezone registration)
- ASEA regulatory fragmentation: 7+ national laws make a unified ASEA profile challenging

## Related Files

- `DWS7_ROADMAP.md` — PRs 248–251 added in Phase 6
- `dws10.com/products/cloud-pricing.html` — current 2-jurisdiction pricing page
- `docs/CLOUD_ENVIRONMENTS.md` — live cloud environment documentation
- `docs/archive/investor/INVESTOR_MEMO_v1.md` — investor-facing mention added

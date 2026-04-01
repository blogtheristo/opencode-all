# Shufti DPA Review & Aegis Sovereignty Credentials

VERSION AND AGENT HISTORY
Version: 1.0
Date: 2026-04-01
Author: Claude Code (claude/review-shufti-dpa-QYsiV)
Owner: Lifetime Oy
Status: In Progress
---

## Context

Shufti Pro compliance team confirmed EU-only processing and storage for Lifetime Oy's account. Haris (Shufti) shared the DPA for review and requests a call to finalize. This closes the blocking requirement from `2026-03-17-shufti-eu-compliance-dpa-inquiry.md`.

## EU-Only Processing — Confirmed

**Source:** Email from compliance@shufti.com (2026-03-31)

> "Yes, EU only processing and storage can be enabled for your account."

This is email confirmation only. The DPA must contain this as a contractual obligation before it has legal weight.

## DPA Review Checklist (Pre-Signature)

| # | Clause | Check | Status |
|---|--------|-------|--------|
| 1 | EU-only processing | Explicitly stated in DPA body, not just email | PENDING |
| 2 | Sub-processor list | Full list with data locations, all EU/EEA | PENDING |
| 3 | Biometric data handling | GDPR Art. 9 special category — explicit basis | PENDING |
| 4 | Data retention/deletion | Auto-delete post-verification, timeline stated | PENDING |
| 5 | Breach notification | Timeline (must be <=48h to align with DWS standard) | PENDING |
| 6 | Audit rights | Right to audit or request evidence of EU processing | PENDING |
| 7 | Data transfer exceptions | No carve-outs for non-EU transfer | PENDING |
| 8 | Termination deletion | Verified deletion certificate upon contract end | PENDING |
| 9 | Third-party sub-processing | Prior notice of sub-processor changes (>=30 days) | PENDING |
| 10 | Liability and indemnity | Proportional, not capped at zero | PENDING |

## Lifetime Oy Details (For DPA)

| Field | Value |
|-------|-------|
| Company Name | Lifetime Oy |
| Business Identity Code (Y-tunnus) | 0772407-9 |
| VAT ID (ALV-tunnus) | FI07724079 |
| Registered Address | Laidunmaanraitti 2 A 25, 02330 Espoo, Finland |
| Country | Finland |
| Signatory | Risto Anton Paerni, CEO |
| Email | risto.paarni@lifetime.fi |
| Role in DPA | Data Controller |
| Purpose | KYC/IDV identity verification for KYA Layer 1 |

## Aegis Sovereignty Signal

This DPA strengthens Aegis positioning:

1. **KYA Layer 1 (Human Identity)**: EU-only biometric verification via Shufti with signed DPA
2. **Full EU sub-processor chain**: Supabase (Finland), UpCloud (Helsinki), Shufti (EU-only), Temporal (EU)
3. **No CLOUD Act exposure on identity layer**: Unlike US-based KYC providers (Jumio, Persona)
4. **Competitive differentiator**: Palantir cannot offer EU-only biometric verification chain

Recommended addition to Aegis materials:
> Identity verification powered by EU-only KYC provider with signed Data Processing Agreement. No biometric data leaves EU jurisdiction. Full sub-processor transparency per GDPR Article 28.

## Decision Tree

```
Shufti DPA passes legal review
  -> Fill in Lifetime Oy details
  -> Book call with Haris to finalize
  -> Sign DPA
  -> Request sandbox API credentials
  -> Proceed with PoC (src/integrations/idv/shufti.ts)
  -> Update Aegis sovereignty section
  -> Add Shufti to DWS sub-processor list (Annex A)

Shufti DPA has issues
  -> Negotiate specific clauses with Haris on call
  -> If unresolvable: evaluate Veriff (Estonia) or IDnow (Germany)
```

## Next Steps

- [ ] Risto: Share Shufti DPA document for detailed clause review
- [ ] Risto: Book call with Haris (compliance@shufti.com)
- [ ] Claude: Complete clause-by-clause review when DPA is available
- [ ] Update `docs/DPA_DATA_PROCESSING_AGREEMENT.md` Annex A with Shufti as sub-processor
- [ ] Update `Admin/SECURITY_COMPLIANCE.md` vendor risk section
- [ ] Update Aegis product page sovereignty credentials

## Relation to Prior Field Notes

- `2026-03-17-shufti-eu-compliance-dpa-inquiry.md` — Original inquiry (status updated)
- `2026-03-09-shufti-kya-byo-partner-access.md` — Partnership proposal
- `2026-03-09-shufti-kya-technical-requirements.md` — Technical requirements
- `2026-03-26-aegis-pricing-study.md` — Aegis pricing (sovereignty section)

## Ontology Tags

- **Geography:** Europe > Finland (Lifetime Oy), UK (Shufti Pro HQ), EU (processing)
- **Sector:** Technology > Identity Verification > GDPR Compliance > Biometrics
- **Entities:** Shufti Pro, Lifetime Oy, DWS IQ 6, KYA Framework, Aegis
- **Regulation:** GDPR Article 9 (biometrics), Article 28 (DPA), Article 44-49 (transfers), NIS2
- **Temporal Context:** 2026-Q2, DPA Review Phase
- **Confidence:** Medium (EU confirmation received, DPA under review)

---

**Source:** Email chain Haris/Shufti compliance (2026-03-31), prior field notes

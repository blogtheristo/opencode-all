# Shufti DPA — Haris Escalation to Compliance & Legal

**Date:** 2026-04-01
**Author:** Risto Paarni
**Type:** Vendor Compliance / Partnership Update
**Context:** Shufti Pro DPA, GDPR, EU Data Residency, Partner Escalation

---

## Summary

Haris (Shufti Pro) has internally escalated the DPA request to Shufti's Compliance and Legal teams. He is requesting them to:

1. **Confirm EU data processing** — Provide formal confirmation that Shufti can process data within the EU
2. **Share Shufti's standard DPA** — Send their standard Data Processing Agreement to Risto for review

This is a positive development on the blocking items from the 2026-03-17 DPA inquiry. The request has moved from sales/partnership contacts to Shufti's compliance and legal departments.

## Original Message (Haris)

> Shufti Partnership. Hi @Compliance Shufti, @Shufti Legal,
>
> Can we please move this? We need to:
>
> 1. Provide confirmation of our EU data processing.
> 2. Share Shufti's standard Data Processing Agreement (DPA) with Risto.
>
> Much appreciated.
>
> BR,
> Haris

## Updated Blocking Status

| Requirement | Previous Status | Current Status | Notes |
|-------------|----------------|----------------|-------|
| EU-only processing confirmation | PENDING | IN PROGRESS | Haris escalated to Shufti Compliance |
| DPA (Data Processing Agreement) | PENDING | IN PROGRESS | Haris escalated to Shufti Legal |
| Sub-processor list | PENDING | PENDING | Expected to be included in DPA |
| Data deletion policy | PENDING | PENDING | Expected to be included in DPA |

## What to Do When Shufti DPA Arrives

When Shufti provides their standard DPA, review against DWS requirements:

1. **EU data residency** — Confirm processing servers are EU-only (no US transfer for biometric data)
2. **GDPR Article 28 compliance** — Standard DPA clauses (purpose limitation, security measures, sub-processors, breach notification, audit rights)
3. **Sub-processor list** — Where biometric data (face match, document scans) is processed
4. **Data retention & deletion** — Must align with DWS data retention standard (purge after verification)
5. **AI-specific clauses** — If Shufti uses AI/ML for verification, check model training data provisions
6. **Cross-reference with DWS DPA template** — Compare against `docs/DPA_DATA_PROCESSING_AGREEMENT.md` Annex A (sub-processor list) to ensure Shufti can be added

## DPA Review Checklist (For When Received)

- [ ] DPA received from Shufti Legal
- [ ] EU-only processing confirmed (server locations documented)
- [ ] Sub-processor list reviewed (all EU or adequate SCC in place)
- [ ] Data retention period acceptable (< 30 days post-verification)
- [ ] Breach notification timeline (must be <= 48 hours per our DPA Article 9)
- [ ] Audit rights included (annual audit right per our DPA Article 12)
- [ ] No model training on customer biometric data
- [ ] Legal review by Lifetime Oy counsel
- [ ] If approved: Add Shufti to DPA Annex A sub-processor list
- [ ] If approved: Proceed with PoC (`src/integrations/idv/shufti.ts`)

## Relation to Prior Field Notes

- `2026-03-17-shufti-eu-compliance-dpa-inquiry.md` — Original DPA inquiry (blocking items now IN PROGRESS)
- `2026-03-09-shufti-kya-byo-partner-access.md` — Partnership proposal and KYA framework
- `2026-03-09-shufti-kya-technical-requirements.md` — Technical requirements for integration

## Decision Tree (Updated)

```
Shufti DPA received + EU-only confirmed
  -> Legal review of DPA terms
  -> If acceptable: Sign DPA, request sandbox API credentials
  -> Add Shufti to DPA_DATA_PROCESSING_AGREEMENT.md Annex A
  -> Proceed with PoC (src/integrations/idv/shufti.ts)

Shufti DPA received but NO EU-only guarantee
  -> Negotiate EU-only processing addendum
  -> If refused: Evaluate alternatives (Veriff, IDnow, Signicat)

No response from Shufti Legal within 2 weeks (by 2026-04-15)
  -> Follow up with Haris once
  -> Begin evaluating EU-native alternatives
```

## Next Steps

- [ ] Await Shufti Legal/Compliance response with DPA
- [ ] Review DPA against checklist above when received
- [ ] Update `2026-03-17-shufti-eu-compliance-dpa-inquiry.md` status when DPA arrives
- [ ] If DPA acceptable: update `DWS_SECURITY_STANDARD.md` vendor compliance section
- [ ] If DPA acceptable: add Shufti to `docs/DPA_DATA_PROCESSING_AGREEMENT.md` Annex A

## Ontology Tags

- **Geography:** Europe > Finland (Lifetime Oy), UK/Pakistan (Shufti Pro)
- **Sector:** Technology > Identity Verification > GDPR Compliance
- **Entities:** Shufti Pro, Lifetime Oy, DWS IQ 6, KYA Framework, Haris (Shufti)
- **Regulation:** GDPR Article 28 (DPA), EU AI Act, NIS2
- **Temporal Context:** 2026-Q2, DPA In Progress
- **Confidence:** Medium (escalation confirmed, awaiting legal response)

---

**Source:** Haris (Shufti Pro) internal escalation message, 2026-04-01 | Prior: 2026-03-17 DPA inquiry, 2026-03-09 partnership proposal

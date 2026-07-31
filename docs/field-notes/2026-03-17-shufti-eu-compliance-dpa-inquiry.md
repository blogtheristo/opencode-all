# Shufti EU Compliance & DPA Inquiry — DPA Received, Under Legal Review

**Date:** 2026-03-17
**Author:** Risto Paarni
**Type:** Vendor Compliance / Data Processing Agreement
**Context:** Shufti Pro IDV, GDPR, EU Data Residency, DPA

---

## Summary

Sent formal inquiry to Shufti Pro (Hassaan) requesting confirmation of EU-only data processing and a Data Processing Agreement (DPA). This is a blocking requirement before any production integration of Shufti into the DWS IQ KYA (Know Your Agent) identity layer.

## Why This Matters

DWS IQ operates under strict EU data residency requirements:

- **Supabase:** europe-north1 (Finland)
- **Cloud Run:** europe-north1
- **Edge:** Acer Veriton GN100 (Helsinki, air-gapped)

Any IDV provider processing biometric data (face match, document verification) MUST guarantee:

1. **EU-only processing** — No data transfer to US/non-EU servers
2. **DPA in place** — GDPR Article 28 compliant Data Processing Agreement
3. **Sub-processor transparency** — List of sub-processors and their locations
4. **Data deletion** — Verified data purged after verification completion

## What Was Sent

**To:** Hassaan (Shufti Pro)
**Subject:** EU Compliance — Data Processing & Residency Confirmation

Key questions posed:

1. Can Shufti guarantee EU-only data processing (no US transfer)?
2. Does Shufti provide a GDPR-compliant DPA?
3. Where are Shufti's EU processing servers located?
4. What sub-processors handle biometric/document data?
5. What is the data retention and deletion policy post-verification?

## Blocking Status

| Requirement | Status | Notes |
|-------------|--------|-------|
| EU-only processing confirmation | **CONFIRMED** | Shufti compliance team confirmed 2026-03-31 |
| DPA (Data Processing Agreement) | **RECEIVED** | Shufti DPA shared by Haris, under legal review |
| Sub-processor list | PENDING | Awaiting review of DPA annexes |
| Data deletion policy | PENDING | Must align with DWS data retention standard |

**Update 2026-04-01:** Haris (Shufti) internally escalated to @Compliance Shufti and @Shufti Legal requesting EU data processing confirmation and standard DPA. See `2026-04-01-shufti-dpa-haris-escalation.md`.
**Update 2026-03-31:** Shufti compliance confirmed EU-only processing. DPA received from Haris, now under legal review.

## Decision Tree

```
Shufti confirms EU-only + DPA available
  → Proceed with PoC (src/integrations/idv/shufti.ts)
  → Sign DPA
  → Request sandbox API credentials

Shufti cannot guarantee EU-only
  → Evaluate alternatives (Onfido EU, Veriff Estonia, IDnow Germany)
  → Document in vendor risk assessment

Shufti does not respond within 2 weeks
  → Follow up once
  → Begin evaluating EU-native alternatives
```

## EU-Native IDV Alternatives (If Needed)

| Vendor | HQ | EU Processing | Notes |
|--------|-----|--------------|-------|
| **Veriff** | Estonia | Yes (EU-native) | Strong document verification |
| **IDnow** | Germany | Yes (EU-native) | German-regulated, video ident |
| **Onfido** | UK | EU option available | Post-Brexit, need EU-specific DPA |
| **Signicat** | Norway | Yes (EEA-native) | Nordic focus, eID integration |

## Relation to Prior Field Notes

- `2026-03-09-shufti-kya-byo-partner-access.md` — Partnership proposal and KYA framework
- `2026-03-09-shufti-kya-technical-requirements.md` — Technical requirements for integration

## Next Steps

- [ ] Await Hassaan's response on EU compliance questions
- [ ] Review DPA when provided
- [ ] If EU-only confirmed: proceed with PoC planning
- [ ] If not: evaluate Veriff/IDnow as alternatives
- [ ] Update DWS_SECURITY_STANDARD.md with vendor compliance status

## Ontology Tags

- **Geography:** Europe > Finland (Lifetime Oy), UK (Shufti Pro HQ)
- **Sector:** Technology > Identity Verification > GDPR Compliance
- **Entities:** Shufti Pro, Lifetime Oy, DWS IQ 6, KYA Framework
- **Regulation:** GDPR Article 28 (DPA), EU AI Act, NIS2
- **Temporal Context:** 2026-Q1, Pre-DPA
- **Confidence:** Low (awaiting vendor response)

---

**Source:** Email to Hassaan (Shufti Pro), 2026-03-17 | Prior field notes: 2026-03-09

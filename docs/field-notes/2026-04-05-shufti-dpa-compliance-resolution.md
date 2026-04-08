# Shufti DPA — Compliance Resolution (All 5 Points Answered)

VERSION AND AGENT HISTORY
Version: 1.0
Date: 2026-04-05
Author: Risto Anton Päärni, CEO
Owner: Lifetime Oy
Status: Ready for DPA incorporation + signature

---

## Summary

Shufti Compliance responded to Lifetime Oy's DPA review points (2026-04-02, forwarded by Haris R. 2026-04-05). All 5 blocking items resolved. Haris requests we incorporate the changes and return for signatures. Tech has also shared the eIDV provider coverage list.

## Resolution Matrix

| #   | Lifetime Oy Point                   | Shufti Compliance Response                                                  | Status   | DPA Action                                                        |
| --- | ----------------------------------- | --------------------------------------------------------------------------- | -------- | ----------------------------------------------------------------- |
| 1   | EU-only processing/storage          | Confirmed — enabled for account; removes Programmers Force as sub-processor | RESOLVED | Update Annex A sub-processor list; insert EU-only clause          |
| 2   | Google Cloud lock-in to EEA         | Confirmed — GCP region locked to EEA only                                   | RESOLVED | Add to sub-processor table (Google Cloud, EEA only)               |
| 3   | Sub-processor notification period   | 30 days                                                                     | RESOLVED | Update Article 9 notice period from previous (shorter) to 30 days |
| 4   | EU-only clause in DPA body          | Agreed to insert                                                            | RESOLVED | Add explicit EU-only processing clause to main body               |
| 5   | Updated eIDV provider coverage list | Tech has shared list                                                        | RESOLVED | Attach/reference in Annex (coverage scope)                        |

## Caveats Flagged by Shufti Compliance

> "Please inform the client (informally and after confirming from tech) that their accuracy might be affected since no model training will be carried out on their data and no manual verification will be conducted."

**Trade-off:** EU-only mode disables:

- **Model training** on Lifetime Oy's verification data (no feedback loop to Shufti's global models)
- **Manual verification** (no human reviewer fallback when automated check is uncertain)

**Implication for KYA Layer 1 (biometric identity):**

- Verification accuracy may be lower than Shufti's global (non-EU-locked) baseline
- Ambiguous/borderline cases will return "uncertain" instead of escalating to human review
- Rejection/false-negative rate likely higher

**Decision required (open item):**

1. **Accept trade-off** — Keep EU-only, document lower accuracy as an Aegis sovereignty feature ("no biometric data leaves EU, no human reviewers touch your data")
2. **Renegotiate** — Ask if EU-based manual verification (EU-located reviewers only) is possible
3. **Mitigate** — Add our own secondary verification layer (e.g., document-based fallback) in `src/integrations/idv/shufti.ts`

**Recommendation:** Option 1 + Option 3. The sovereignty story is more valuable than marginal accuracy gains, and we can add our own fallback layer. Keep Option 2 as a future negotiation if accuracy becomes a real issue in production.

## Original Compliance Responses (Verbatim)

From: compliance@shufti.com (via Haris R., 2026-04-02)

1. EU-only processing/storage: "Can be enabled for your account, which would render the sub-processor Programmers Force inapplicable." Caveat: accuracy may be affected (no model training, no manual verification).
2. Google Cloud locked to EEA: Confirmed.
3. Sub-processor notification period: Can be altered to 30 days.
4. EU-only clause: Can be inserted into the DPA.
5. Updated eIDV provider list: Shared by tech.

## Next Steps

- [x] Update field notes (this file)
- [x] Incorporate 4 clauses into Shufti DPA — `partners-outreach/Shufti/DPA_ADDENDUM_EU_ONLY_2026.md` (2026-04-07)
- [x] Reply to Haris R. confirming incorporation + signature readiness (2026-04-07)
- [x] Decide manual-verification trade-off — **Option 1+3 accepted**: EU-only mode (no model training, no manual review) + own secondary verification layer in `src/integrations/idv/shufti.ts`. Sovereignty story > marginal accuracy. (2026-04-07)
- [x] Add Shufti to `docs/DPA_DATA_PROCESSING_AGREEMENT.md` Annex A with EU-only note (done in v1.1)
- [x] Update `2026-04-01-shufti-dpa-review-aegis-sovereignty.md` checklist (items 1, 2, 4, 9 → RESOLVED) — done 2026-04-08, merged with PR #768 clause audit (dual-column table: base audit + addendum status)
- [x] Update Aegis messaging: "EU-only biometric IDV; no model training on customer data; no non-EU manual review" (2026-04-07)

## Relation to Prior Field Notes

- `2026-03-17-shufti-eu-compliance-dpa-inquiry.md` — Original blocking items (now all resolved)
- `2026-04-01-shufti-dpa-haris-escalation.md` — Escalation to Shufti Compliance/Legal
- `2026-04-01-shufti-dpa-review-aegis-sovereignty.md` — DPA review checklist (items 1/2/4/9 resolved)

## Ontology Tags

- **Geography:** Europe > Finland (Lifetime Oy), EEA (Shufti EU-only mode)
- **Sector:** Technology > Identity Verification > GDPR Compliance
- **Entities:** Shufti Pro, Lifetime Oy, DWS IQ 6 / Aegis, KYA Framework
- **Regulation:** GDPR Article 28 (DPA), Article 9 (biometric), EU AI Act, NIS2
- **Temporal Context:** 2026-Q2, DPA Ready for Signature
- **Confidence:** High (written Compliance response received)

---

**Source:** haris.rehman@shufti.com / compliance@shufti.com, 2026-04-02 (forwarded 2026-04-05)

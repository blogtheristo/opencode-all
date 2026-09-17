# Handoff — claude/aiven-dpa-contract-12iukg

**Date:** 2026-07-14 · **Status:** Complete, pushed. No PR opened (not requested).

## What the branch did

Answered "Can we propose the Aiven DPA, and are the developer-contract terms acceptable?" and shipped the two founder-approved follow-ups.

**Assessment (verdict: yes, propose it; terms acceptable with one caveat):**

- Two instruments distinguished — [Aiven DPA](https://aiven.io/dpa) (we = controller, Aiven = processor) vs [Aiven General Terms](https://aiven.io/terms)/[SLA](https://aiven.io/sla) (we = customer).
- DPA is GDPR Art. 28 clean: EEA residency, SCCs prevail, subprocessor liability, **own-KMS so hyperscaler infra subprocessors have no logical access** (the real sovereignty argument).
- Developer contract acceptable; one sharp edge = liability cap (lesser of 6-mo fees or €50k → ~$30 on the $5/mo tier, data-loss excluded). Covered by our backup posture (§3.6.1/DR-5) as long as Aiven stays DB+DR, not source of truth.
- Full write-up: `docs/field-notes/2026-07-13-aiven-dpa-developer-contract-assessment.md`.

**Truth reconciliation (a):** `dws10.com/legal/dpa.html:357–362` + landing-pages mirror read "Aiven sits outside CLOUD Act because the Aiven Oy parent is EU-incorporated" — contradicted `DWS_SECURITY_STANDARD.md §17.5` ("Unclear (US investors)"). Per `DWS_TRUTH_STANDARD.md §3`, security standard is canonical; corrected the public copy to the accurate cumulative basis (EU incorporation + own-KMS + EEA + SCC + UpCloud as no-US-parent region), disclosing the non-EU VC residual. Root + mirror synced. `/truth-check` clean before and after (semantic drift, outside the phrase deny-list).

## Open / handed off (NOT done — deliberately)

1. **Founder/legal call:** Tier 1 Aegis still asserts a headline **"Zero" CLOUD Act** rating + _"no US vendor in the data path"_ (`dpa.html:300–305`, ~353). True only if Aegis-Aiven runs on an EU-owned region (UpCloud/OVH), which the repo does not confirm. Either pin Aegis-Aiven to UpCloud or soften "Zero" to Tier 2's honest wording. Not an agent edit.
2. **Partner track (`Partners/outreach/2026-04-18-aiven.md`):** still waiting on Aiven — platform DPA for signature, partner-org intro, UpCloud-region answer, Wärtsilä public link. Return signed NDA to Leevi still pending.

## Commit

`docs: Aiven DPA/developer-contract assessment + reconcile CLOUD Act copy` — 3 files (field note + dpa.html ×2). Pushed to origin.

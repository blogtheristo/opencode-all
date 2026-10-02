# Handoff — claude/enclaive-sovereign-2-assessment-8lfb7f

**Task:** Assess whether enclaive.io (Berlin/Hofheim am Taunus confidential-computing vendor) fits DWS IQ Aegis. No "Sovereign 2" tier exists in the repo — read as the Aegis **Sovereign** tier and flagged that assumption up front in the field note.

**State:**

- Field note (v1.1): `docs/field-notes/2026-07-29-enclaive-confidential-computing-aegis-sovereign-fit.md`
- Modeled enclaive+OVHcloud EU architecture through `scripts/sovereignty-pillars-assess.cjs`: SIB(EU)=100, CSB(EU)=60, EAB(EU)=0 — script recommends "Aegis" tier, but EAB=0 shows the identity/KYA pillar is untouched (that stays DWS's job, not enclaive's).
- Verdict: fits Aegis **Standard** tier (confirmed EU cloud + CPU TEE). **Defence** tier unconfirmed (no evidence of confidential-GPU support — the open question). **Sovereign** tier: not a substitute — that tier is air-gapped/on-prem by design, enclaive is a cloud platform.
- Direct `WebFetch` of enclaive.io returned HTTP 403 twice — all vendor specifics are WebSearch-sourced/propagated, not independently verified (marked per DWS_LEARNING_STANDARD §10.4).
- HIC supplied enclaive's contact info (email/phone/postal) in a follow-up turn; flagged a conflict rather than averaging it — postal address is Hofheim am Taunus, but company self-describes as Berlin (030 phone prefix consistent with Berlin). Read as registered-seat-vs-operating-office split — unverified.
- Genuine capability gap surfaced: `DWS_SECURITY_STANDARD.md` line 989 shows DWS's current isolation is Firecracker/gVisor (software tenant isolation), not hardware-encrypted-memory isolation from the cloud operator — confidential computing is a different, complementary control, not redundant.
- 2 commits on this branch: `1724c07b` (field note), `bf093e7c` (contact info + conflict flag). **PR #2064 open**, no comments, no CI configured/pending: https://github.com/blogtheristo/dws6/pull/2064

**Next steps:**

1. HIC to answer the two Step-5 decisions in the field note: (a) book a vendor call to close TEE-primitive/GPU/certification/pricing/entity gaps before citing enclaive externally — **RECOMMEND: yes**; (b) add confidential computing to `Store/PRODUCT_AEGIS.md` now or wait — **RECOMMEND: wait**.
2. Once (1) lands: finish the deferred HIC Learning Outcome steps (kb/ update, `Learn/` HTML render, Drive export) — all currently `N/A — pending vendor verification`.
3. If the vendor call confirms confidential-GPU support, revisit the Defence-tier fit call.

**Blockers:** None technical — waiting on HIC decision + vendor call, not a stuck task.

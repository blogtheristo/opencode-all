# Aiven DPA & Developer Contract — Acceptability Assessment

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: claude/aiven-dpa-contract-12iukg | Date: 13.07.2026 | Changes: Assessed Aiven's DPA + General Terms ("developer contract") for acceptability; reconciled a CLOUD Act overclaim in the public customer DPA against DWS_SECURITY_STANDARD.md §17.5

Document Status:

- Created: 13.07.2026
- Last Modified: 13.07.2026
- Language: English
- Publication Status: ACTIVE

---

## Question

Can Lifetime Oy propose/adopt the Aiven DPA, and are the terms of Aiven's developer contract acceptable?

## Two distinct instruments

| Document                                                                    | Governs                                                        | Our role                                      |
| --------------------------------------------------------------------------- | -------------------------------------------------------------- | --------------------------------------------- |
| [Aiven DPA](https://aiven.io/dpa)                                           | GDPR Art. 28 processing terms                                  | We are **controller**, Aiven is **processor** |
| [Aiven General Terms](https://aiven.io/terms) + [SLA](https://aiven.io/sla) | Commercial platform contract (Developer $5/mo, Startup $75/mo) | We are **customer**                           |

The DPA is already a locked prerequisite in the partner track: NDA (signed 2026-07-06) → Aiven platform DPA → only then any customer/project data (`Partners/outreach/2026-04-18-aiven.md` §4; NDA Art. 8.3). Proposing it is the next contractual step, not optional.

## DPA — acceptable ✓

- **Controller/processor split** correct; Customer = controller, Aiven = processor + subprocessors.
- **Data residency:** pick an EEA region → data stays in EEA; transfers out require our prior approval/instruction.
- **International transfers:** SCCs prevail over the DPA on any conflict; UK data under SCCs.
- **Subprocessors:** Aiven stays liable; list at [aiven.io/subprocessors](https://aiven.io/subprocessors); "commercially reasonable efforts" to bind them to equivalent terms. Consent is list-based, not per-change opt-in.
- **Own KMS (the important one):** Aiven runs its own key management on Aiven-controlled VMs in EU GCP data centres, so the hyperscaler infrastructure subprocessors "have no logical access to customer data." This is the real, defensible sovereignty argument — it materially blunts the CLOUD Act path in a way that EU-incorporation alone does not.
- Breach notification, audit rights, return-or-delete on termination all present.

Proposable in both directions: we sign it as controller, **and** Aiven is already listed as a subprocessor in our own customer DPA (`dws10.com/legal/dpa.html` Annex A).

## Developer contract (General Terms) — acceptable, one sharp edge ⚠️

- **99.99% SLA**, service credits as sole remedy — standard.
- **30-day notice** on adverse change, with a termination right — fine.
- **⚠️ Liability cap = the lesser of (6 months' fees) OR €50,000**, and indirect/consequential damages **including data loss/corruption are excluded**. On the Developer tier ($5/mo) "6 months' fees" ≈ $30, so the effective cap is trivial. This is the only genuine weakness.
  - Market-standard for DBaaS at this price; mitigation is our own backup posture (daily `pg_dump` to 4 destinations, GPG AES-256, tested restore — `DWS_SECURITY_STANDARD.md` §3.6.1 / DR-5), not Aiven's cap. **Acceptable provided Aiven stays a DB layer + DR/mirror, not the single source of truth** — its current role.

## Two caveats carried into the proposal

1. **Sequencing (don't skip):** the DPA is the GDPR basis for Aiven _hosting data we run through the platform_. It is **not** a basis for handing Aiven our customers' personal data during partnership discussions — that's NDA Art. 8.3. Redact personal data until a per-customer basis exists.
2. **Infra sovereignty:** the DPA + own-KMS mitigates but does not erase the `§17.5` residual risk — Aiven is US-VC-backed and, in the current dws6.com config, runs on `google-europe-north1` (GCP = US-owned infra). Running the service on the **UpCloud** region (Finnish, EU-sovereign, already DWS-approved for Aegis) closes the infra half. Aiven-on-UpCloud is the strongest story and is the open ask to Leevi (§4).

## Truth reconciliation done this session

`dws10.com/legal/dpa.html:357–362` (+ landing-pages mirror) previously read: _"Aiven sits outside CLOUD Act because the Aiven Oy parent is EU-incorporated."_ That flatly contradicts `DWS_SECURITY_STANDARD.md §17.5`, which rates Aiven's CLOUD Act exposure **"Unclear (US investors)"** and accepts residual risk. Per `DWS_TRUTH_STANDARD.md §3` the security standard is canonical (CLOUD Act routing source) and the public copy is the drift. **Corrected** the copy to state the accurate cumulative basis (EU incorporation + own-KMS so infra subprocessors lack logical access + EEA storage + SCCs), name UpCloud as the no-US-parent-in-path region, and disclose the non-EU VC residual rather than represent it as immaterial. Mechanical `/truth-check` was clean before and after — this tension lives outside the phrase deny-list (no registry row for Aiven/CLOUD Act), so it was a semantic, not a lint, fix.

## Flagged — NOT unilaterally edited (founder/legal call)

The same public DPA still asserts, for **Tier 1 Aegis**, a headline **"Zero"** CLOUD Act rating and _"No US-incorporated vendor in the data path"_ (`dws10.com/legal/dpa.html:300–305`) plus a _"zero-CLOUD-Act guarantee by construction"_ (line ~353). Those guarantees are literally true only if the Aegis Aiven service is deployed on an **EU-owned region (UpCloud/OVH), not GCP**. The repo does not confirm the Aegis deployment region (§17.5's documented exception is the Tier 2 dws6.com DB on `google-europe-north1`; the UpCloud region is still an _open_ item with Aiven per the outreach doc). Recommendation: either (a) confirm + pin Aegis-Aiven to UpCloud so "no US vendor in the data path" is literally true, or (b) soften the absolute "Zero" to match Tier 2's honest _"None for data; residual contractual exposure"_ wording. This is a headline guarantee change with liability weight — founder decision, not an agent edit.

## Bottom line

Propose it. Ask Leevi to include Aiven's standard platform DPA for signature (already in the §8b letter Risto sent). DPA is GDPR-clean; developer contract is market-standard; the only term to be conscious of is the near-zero liability cap, already covered by our backup posture. The one upgrade that makes it unambiguously sovereign for customer-facing use is moving the service to **UpCloud**.

## Related

- `Partners/outreach/2026-04-18-aiven.md` — partner track, DPA sequencing (§4), UpCloud ask
- `DWS_SECURITY_STANDARD.md` §17.5 — infrastructure sovereignty exception (canonical CLOUD Act position)
- `dws10.com/legal/dpa.html` — public customer DPA (Aiven subprocessor + tier CLOUD Act table)
- `docs/field-notes/2026-07-02-supabase-audit-aiven-deployment-plan.md` — Aiven deployment plan
- `docs/field-notes/2026-03-10-v1-aiven-plan-decision.md` — Developer + Startup plan sizing

---

(c) 2026 Lifetime Oy — Field Note

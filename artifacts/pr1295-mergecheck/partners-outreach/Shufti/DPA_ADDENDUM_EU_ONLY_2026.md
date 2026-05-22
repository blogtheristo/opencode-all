# ADDENDUM TO DATA PROCESSING AGREEMENT — EU-Only Processing

VERSION AND AGENT HISTORY
Version: 1.5
Date: 2026-04-24
Author: Claude Code (claude/fix-dpa-addendum-SzFLQ)
Owner: Lifetime Oy
Status: Non-Binding Partner Alignment Reference (forward-looking)
Signature target: NONE — original Shufti DPA (26.02.2026) is the binding instrument

Sessions & Modifications:

- Version: 1.5 | Tool: Claude Code (Opus 4.7) | Session: claude/fix-dpa-addendum-SzFLQ | Date: 24.04.2026 | Changes: Reclassified the document from "Addendum to DPA — Ready for Signature" to "Partner Alignment Memorandum — Non-Binding Reference" per Risto direction (24.04.2026). Rationale: the document references Lifetime Oy's public KYA Standard v1.5 (Clause 8) which is a mutable Lifetime-owned standard; making the document binding would tie Shufti's contractual obligations to a unilaterally-mutable external reference, which is not appropriate for a third-party data processing contract. Signature target reverts to Shufti's original DPA dated 26 February 2026 (`partners-outreach/Shufti/Shufti Data Processing Agreement 26022026.docx`), which is signed as-is. The four EU-compliance commitments confirmed by Shufti Compliance on 2 April 2026 (EU-only processing, GCP EEA lock, 30-day sub-processor notice, EU-only clause insertion) remain captured in writing via the compliance@shufti.com email of 2 April 2026 and are referenced in this memo as shared partner intent. Added prominent NON-BINDING banner; added "Partnership Vision" preamble framing KYA Memory Binding (Clause 8) as Lifetime's invitation for Shufti to align with the broader Aegis sovereignty roadmap. Clause text unchanged from v1.4 — only framing, banner, status, and changelog updated. v1.4 file retained as version history.
- Version: 1.4 | Tool: Claude Code (Opus 4.7) | Session: claude/fix-dpa-addendum-SzFLQ | Date: 24.04.2026 | Changes: Re-emit partner-facing HTML (Learn/ + partners-outreach/Shufti/) as a single well-formed DOCTYPE; v1.3 artifact contained two concatenated HTML documents which broke browser rendering for Haris R. (Shufti). Wrapped orphan `<li>` items in `<ul>`, replaced leaked markdown italics (`_Source: ..._`) with `<em>` tags, wrapped clause body text in `<p>` blocks. No clause text changes; rendering fix only. Scope confirmed by Risto: addendum only — base Shufti DPA (26.02.2026) is NOT being modified or signed in this round.
- Version: 1.3 | Tool: Codex 5.3 | Session: claude/kya-memory-binding-RuJ0G | Date: 23.04.2026 | Changes: Replaced markdown `~~strike~~` syntax with semantic HTML `<del>` tags for the removed sub-processor row (Programmers Force) so legal strike-through renders in browsers. NOTE: artifact was published with a duplicated DOCTYPE prefix (v1.2 document concatenated above v1.3 document) — superseded by v1.4 rendering fix.
- Version: 1.2 | Tool: Claude Code (Opus 4.7) | Session: claude/kya-memory-binding-RuJ0G | Date: 23.04.2026 | Changes: Added Clause 8 (KYA Memory Binding alignment — tenant isolation of verification data; no cross-customer blending; memory-mutation audit trail) per public KYA Standard v1.5 §3 (Memory Binding)
- Version: 1.1 | Tool: Claude Code (Opus 4.6) | Session: claude/audit-shufti-dpa-artifacts-HFEGx | Date: 08.04.2026 | Changes: Added Clause 6 (ML training prohibition — binding contractual obligation per PR #768 audit finding A) and Clause 7 (GDPR Art. 9 legal basis for biometric processing per audit finding #3)
- Version: 1.0 | Tool: Claude Code | Session: claude/check-dpa-status-YD0A1 | Date: 07.04.2026 | Changes: Initial addendum with EU-only processing, GCP EEA lock, 30-day sub-processor notification, breach notification chain

---

## Parties

**Data Controller:** Lifetime Oy, Business ID 0772407-9, VAT FI07724079, Laidunmaanraitti 2 A 25, 02330 Espoo, Finland. Represented by Risto Anton Päärni, CEO.

**Data Processor:** Shufti Pro Limited, registered in the United Kingdom.

**Base Agreement:** Shufti Data Processing Agreement dated 26 February 2026 (the "DPA").

---

## Recitals

WHEREAS the Parties entered into the DPA for identity verification (KYC/IDV) services;

WHEREAS Shufti Pro Compliance confirmed EU-only processing and storage capability for Lifetime Oy's account (compliance@shufti.com, 2 April 2026);

WHEREAS the Parties wish to incorporate the agreed modifications into the DPA as binding contractual obligations;

NOW THEREFORE the Parties agree to amend the DPA as follows:

---

## Clause 1: EU-Only Processing and Storage

**1.1** All processing and storage of Personal Data under this DPA shall take place exclusively within the European Economic Area (EEA).

**1.2** Shufti Pro shall not transfer, store, process, or make accessible any Personal Data — including biometric data (facial images, liveness data), identity document images, and verification results — to or from any location outside the EEA.

**1.3** The sub-processor **Programmers Force (Pvt.) Ltd.** (Pakistan) is hereby removed from the authorized sub-processor list and shall have no access to Lifetime Oy's data under any circumstance.

**1.4** EU-only processing mode shall be enabled at the account level for Lifetime Oy and shall not be disabled without prior written consent from the Data Controller.

---

## Clause 2: Google Cloud Infrastructure — EEA Lock

**2.1** All Google Cloud Platform infrastructure used for processing Lifetime Oy's data shall be locked to EEA regions only.

**2.2** The authorized sub-processor entry for Google Cloud shall read:

| Sub-processor             | Purpose                                          | Data Location | Restriction                               |
| ------------------------- | ------------------------------------------------ | ------------- | ----------------------------------------- |
| Google Cloud (Google LLC) | Cloud infrastructure for verification processing | EEA only      | Region-locked; no replication outside EEA |

**2.3** Any change to Google Cloud region configuration affecting Lifetime Oy's data requires 30 days prior written notice and Data Controller consent.

---

## Clause 3: Sub-Processor Notification Period — 30 Days

**3.1** Article 9 (or equivalent sub-processor clause) of the base DPA is hereby amended: Shufti Pro shall notify Lifetime Oy at least **thirty (30) calendar days** in advance of any intended addition, replacement, or removal of a sub-processor.

**3.2** Lifetime Oy shall have the right to object to any proposed sub-processor change within the 30-day notice period. If Shufti Pro cannot reasonably accommodate the objection, Lifetime Oy may terminate the DPA without penalty.

---

## Clause 4: EU-Only Processing Clause — DPA Body Insertion

**4.1** The following clause shall be inserted into the main body of the DPA as a new article (or appended to the existing data location article):

> **EU-Only Processing Obligation.** All Personal Data processed under this Agreement, including but not limited to biometric data (GDPR Article 9 special category data), identity document images, verification metadata, and verification results, shall be processed and stored exclusively within the European Economic Area (EEA). No Personal Data shall be transferred to, accessed from, or replicated in any jurisdiction outside the EEA. This obligation applies to all sub-processors engaged by the Data Processor. This clause cannot be waived except by written agreement signed by both Parties.

---

## Acknowledged Trade-Off: EU-Only Processing Mode

The Parties acknowledge that EU-only processing mode entails the following operational constraints, as communicated by Shufti Pro Compliance (2 April 2026):

1. **No model training** — Lifetime Oy's verification data will not be used for Shufti's global AI model training.
2. **No manual verification** — No human reviewer fallback when automated verification returns uncertain results.

The Data Controller accepts these constraints. The absence of model training and manual review is consistent with Lifetime Oy's data sovereignty requirements and the KYA (Know Your Agent) framework.

---

## Updated Sub-Processor List (Lifetime Oy Account)

| Sub-processor                     | Purpose                 | Data Location            | Status  |
| --------------------------------- | ----------------------- | ------------------------ | ------- |
| Google Cloud (Google LLC)         | Cloud infrastructure    | EEA only (region-locked) | ACTIVE  |
| ~~Programmers Force (Pvt.) Ltd.~~ | ~~Development support~~ | ~~Pakistan~~             | REMOVED |

---

## Clause 5: Breach Notification — 48h/72h Chain

**5.1** The 48-hour breach notification deadline in the base DPA (Article 6.1) is an internal processor-to-controller deadline. It provides Lifetime Oy with a 24-hour assessment window before the statutory 72-hour obligation to notify the Finnish Data Protection Authority (Tietosuojavaltuutetun toimisto) per GDPR Article 33.

**5.2** Upon receipt of Shufti Pro's 48-hour breach notification, Lifetime Oy shall execute the following internal procedure:

- **T+0h:** Log breach receipt in Supabase `breach_notifications` table with timestamp, breach category, and affected data subjects estimate.
- **T+0–12h:** Assess severity — determine if breach involves biometric data (Art. 9), scale of data subjects affected, and likelihood of risk to rights and freedoms.
- **T+12–20h:** Prepare notification to Tietosuojavaltuutetun toimisto (Finnish DPA) using the authority's online form. Draft data subject notification if required under GDPR Article 34.
- **T+20–24h (hard deadline):** Submit notification to Finnish DPA. This leaves 48h buffer before the statutory 72h GDPR Article 33 deadline expires.

Automated daily monitoring (`scripts/daily/check-breach-deadlines.ts`) alerts at 24h (internal review deadline) and 48h (last call before statutory 72h). All checks are logged to Supabase `audit_log` for traceability.

---

## Clause 6: Prohibition on Machine Learning Training

**6.1** The Data Processor shall not use any Personal Data, including biometric data (facial images, liveness data), identity document images, verification metadata, and verification results, processed on behalf of the Data Controller for the purposes of training, fine-tuning, or improving machine learning models, artificial intelligence systems, or any automated decision-making systems.

**6.2** This prohibition applies to all sub-processors engaged by the Data Processor. No sub-processor shall use the Data Controller's Personal Data for model improvement purposes.

**6.3** The Data Processor shall maintain technical and organizational measures to ensure separation of the Data Controller's Personal Data from any datasets used for model training or improvement.

**6.4** This clause supplements the acknowledged trade-off in the EU-Only Processing section above. While the Data Processor has informally confirmed that EU-only mode excludes model training, this clause elevates that commitment to a binding contractual obligation.

_Source: DPA clause-by-clause audit finding A (2026-04-02, PR #768)._

---

## Clause 7: GDPR Article 9 Legal Basis for Biometric Processing

**7.1** The Parties acknowledge that the processing of biometric data (facial recognition, liveness detection) under this DPA constitutes processing of special categories of personal data under GDPR Article 9.

**7.2** The legal basis for processing biometric data is GDPR Article 9(2)(a) — explicit consent of the data subject, obtained by the Data Controller prior to initiating each verification request.

**7.3** The Data Controller is solely responsible for obtaining valid explicit consent from each data subject before submitting biometric data to the Data Processor for verification.

_Source: DPA clause-by-clause audit finding #3 (2026-04-02, PR #768)._

---

## Clause 8: KYA Memory Binding — Tenant Isolation of Verification Data

**8.1** The Parties acknowledge that Lifetime Oy operates under the Know Your Agent (KYA) Standard v1.5, whose Memory Binding principle (Section 3) requires that customer data remain tenant-isolated, provenance-logged, and not blended into shared model state.

**8.2 Tenant Isolation.** The Data Processor shall ensure that Personal Data processed on behalf of Lifetime Oy — including biometric data, identity document images, verification metadata, and verification results — is stored, indexed, and retrieved in a manner that prevents co-mingling with data originating from other Shufti Pro customers. Access controls shall enforce tenant boundaries at the record level.

**8.3 No Shared-Model Promotion.** The Data Processor shall not promote, aggregate, anonymize, or otherwise transfer Personal Data processed on behalf of Lifetime Oy into any shared knowledge base, shared model, or shared analytics pool used to serve other customers, except where (a) explicit written consent is obtained from the Data Controller and (b) the contribution is limited to anonymized, aggregated patterns that do not permit re-identification of individual data subjects.

**8.4 Memory-Mutation Audit Trail.** The Data Processor shall maintain an immutable log of operations that create, update, supersede, or delete Personal Data records on behalf of Lifetime Oy. Each log entry shall record at minimum: operation type, timestamp, actor (system or human reviewer), affected record identifier, and reason code where applicable. The log shall be retained for the duration of the Agreement plus five (5) years, consistent with EU AI Act Article 12 logging requirements.

**8.5 Availability to Controller.** Upon reasonable written request, the Data Processor shall provide Lifetime Oy with an export of the Memory-Mutation Audit Trail entries pertaining to Lifetime Oy's data, in a machine-readable format (JSON or equivalent), within ten (10) business days.

**8.6** This clause complements Clause 6 (ML Training Prohibition): Clause 6 prohibits use for model improvement; Clause 8 governs how the data is held and logged regardless of downstream use.

_Source: Public KYA Standard v1.5 §3 Memory Binding — https://dws10.com/kya-standard/ (published 23.04.2026)._

---

## General Provisions

**Conflict.** In the event of any conflict between this Addendum and the base DPA, this Addendum shall prevail.

**Effective Date.** This Addendum shall take effect upon signature by both Parties.

**Governing Law.** This Addendum is governed by Finnish law. Espoon käräjäoikeus (Espoo District Court) has exclusive jurisdiction.

All other terms and conditions of the DPA remain unchanged and in full force.

---

## Signatures

For **Lifetime Oy** (Data Controller):

Name: Risto Anton Päärni
Title: CEO
Date: **\*\*\*\***\_\_\_\_**\*\*\*\***
Signature: **\*\*\*\***\_\_\_\_**\*\*\*\***

For **Shufti Pro Limited** (Data Processor):

Name: **\*\*\*\***\_\_\_\_**\*\*\*\***
Title: **\*\*\*\***\_\_\_\_**\*\*\*\***
Date: **\*\*\*\***\_\_\_\_**\*\*\*\***
Signature: **\*\*\*\***\_\_\_\_**\*\*\*\***

---

**Reference Documents:**

- Shufti Data Processing Agreement dated 26 February 2026
- Shufti Compliance response (compliance@shufti.com, 2 April 2026, forwarded by Haris R., 5 April 2026)
- DWS IQ 6 DPA (docs/DPA_DATA_PROCESSING_AGREEMENT.md, v1.1)
- Lifetime Oy KYA Standard v1.5 (Legal/KYA_STANDARD_v1.md)

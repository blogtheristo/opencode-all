# ADDENDUM TO DATA PROCESSING AGREEMENT — EU-Only Processing

VERSION AND AGENT HISTORY
Version: 1.0
Date: 2026-04-07
Author: Claude Code (claude/check-dpa-status-YD0A1)
Owner: Lifetime Oy
Status: Ready for Signature

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

**5.2** Lifetime Oy shall maintain an internal breach response procedure to ensure supervisory authority notification within the 72-hour statutory window following receipt of Shufti Pro's notice.

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

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Claude Sonnet 4.6) | Session: claude/update-ai-act-omnibus-3BANC | Date: 07.05.2026 | Changes: Initial field note. EU AI Act Omnibus provisional agreement reached 7 May 2026 by Council and Parliament. Documents deadline deferral (Annex III: 2 Aug 2026 → 2 Dec 2027), new nudifier prohibition, SME/SMC proportionality, AI Office centralisation, and DWS IQ 6 classification impact.

Document Status:

- Created: 07.05.2026
- Last Modified: 07.05.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE
- Document Type: Field Note / Regulatory Intelligence

Related Documents:

- DWS_ARTICLE_12_LOGGING_STANDARD.md
- DWS_STANDARDS_LIBRARY.md
- Admin/SECURITY_COMPLIANCE.md
- DWS_SECURITY_STANDARD.md
- docs/Deputy-Agents-Architecture.md

---

- **Date:** 07.05.2026
- **Author:** Risto Anton Päärni (risto.paarni@lifetime.fi)
- **Type:** Regulatory Intelligence / Impact Assessment
- **Source Lens/Context:** EU Council and Parliament provisional agreement on AI Omnibus — reached 7 May 2026. Breaking news confirmed from co-legislator statements. Official Journal publication expected ~6 weeks from agreement.

## Ontology Tags

- **Geography:** EU > EU27 > Finland
- **Sector:** Regulatory > AI Governance > Industrial Compliance
- **Entities:** European Commission, EU Council, European Parliament, EU AI Office, Lifetime Oy, DWS IQ 6
- **Standards:** EU AI Act Reg. 2024/1689, AI Omnibus (provisional agreement 07.05.2026), GPAI Code of Practice, Article 50 (Transparency), Annex III (High-Risk)
- **Temporal Context:** 2026-Q2, Omnibus provisional agreement day
- **Confidence:** High — based on co-legislator statements; pending Official Journal publication for formal adoption

---

## 1. The Event

The EU Council and Parliament reached a **provisional agreement on the AI Omnibus** on 7 May 2026. This is not a full repeal or weakening of the EU AI Act — the four-tier risk pyramid stands. What changed are the **enforcement timelines for high-risk systems**, **proportionality provisions for SMEs**, and one **new prohibition** was added.

The agreement is provisional. Expect ~6 weeks for formal text publication in the Official Journal. Once published, specific deferral dates become hard law.

---

## 2. Risk Pyramid Status

The diagram below remains structurally valid. Layer-by-layer status after Omnibus:

| Layer                         | Original                                            | Omnibus Status                                                                                                                                 |
| ----------------------------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **Unacceptable / Prohibited** | Violation of fundamental rights → Prohibition       | ✅ Correct + expanded. New prohibition added: AI nudifier apps (non-consensual sexual/intimate content). Prohibited practices active Feb 2025. |
| **High Risk**                 | Conformity assessment, post-market monitoring       | ✅ Architecture correct. **Deadline shifted**: Annex III standalone → 2 Dec 2027; Annex I embedded products → 2 Aug 2028. Was 2 Aug 2026.      |
| **Transparency Risk**         | Chatbots, deepfakes → information obligations       | ✅ Unchanged. Article 50 obligations are **live now — NOT deferred**.                                                                          |
| **Minimal Risk**              | Spam filters, recommenders → no specific regulation | ✅ Unchanged.                                                                                                                                  |
| **GPAI (base)**               | Transparency + systemic risk assessment             | ✅ Already in force since 2 Aug 2025. GPAI Code of Practice published.                                                                         |

**Key rule:** The Omnibus defers formal enforcement fines, not the substantive obligations. Article 12 logging and Article 50 transparency are effective now.

---

## 3. Five Key Omnibus Changes

### 3.1 Deadline Deferral (High Risk — Annex III)

The most impactful change for DWS and its clients:

| System Type                                                             | Old Deadline | New Deadline   |
| ----------------------------------------------------------------------- | ------------ | -------------- |
| Annex III standalone systems (employment, essential services, etc.)     | 2 Aug 2026   | **2 Dec 2027** |
| AI embedded in regulated products (Annex I — Machinery, Medical Device) | 2 Aug 2026   | **2 Aug 2028** |

Both Council and Parliament converged on these dates. ~18 months additional runway for Annex III; ~24 months for Annex I embedded.

### 3.2 SME/SMC Proportionality

SMCs (small and mid-cap companies) may be defined by reference to ceilings of up to **750 employees** and **€150 million in annual turnover**. These companies get:

- Simplified compliance guidance tools
- Reduced conformity assessment fees
- Proportionate implementation framework

Relevance: most DWS pilot customers fall inside these ceilings. The proportionality provisions make the compliance pitch easier — not harder.

### 3.3 New Prohibition: AI Nudifier Apps

Co-legislators added a new prohibited practice: **AI systems that generate non-consensual sexual or intimate content** (so-called "nudifier apps"). This adds to the existing prohibited practices active since February 2025.

In force: on formal adoption of the Omnibus (expected ~June 2026).

DWS IQ 6 systems are not affected by this prohibition — industrial and compliance agents have no use case in this category. However, any GPAI model integrated into the platform (Claude, Mistral) must not be configured to produce such content.

### 3.4 Centralised AI Office Oversight

The Omnibus assigns oversight of **general-purpose AI and large platforms** to the EU **AI Office**, reducing fragmentation across 27 national supervisory authorities for GPAI-level matters. For DWS as a deployer (not provider) of GPAI models, this simplifies the governance surface — one body to watch rather than 27.

### 3.5 Sectoral Law Tension (Still Negotiated)

Parliament's position would move a significant category of Annex I embedded AI systems out from under the AI Act's direct scope and into sectoral laws (Machinery Regulation, Medical Device Regulation). This is **still being negotiated** in the final text. Watch for the Official Journal publication before acting on Annex I classification decisions.

---

## 4. DWS IQ 6 Classification Impact

### Current Classification

DWS IQ 6 compliance agents (CBAM/ETS/CSRD/ESRS) are likely classified under:

- **Annex III, Category 5** — AI systems in essential services (energy, climate compliance)
- **Annex III, Category 4** — AI systems for employment / work management (EPBD, ETS allocation decisions)

This makes DWS IQ 6 a **high-risk AI system** under the Act. Classification has not changed — only the enforcement timeline.

### What Changes

| Item                          | Before Omnibus          | After Omnibus                 |
| ----------------------------- | ----------------------- | ----------------------------- |
| External enforcement deadline | 2 Aug 2026              | **2 Dec 2027**                |
| Article 12 logging obligation | Must-do (best practice) | Must-do (unchanged)           |
| Article 50 transparency       | Live now                | Live now (unchanged)          |
| GPAI rules (Claude, Mistral)  | In force Aug 2025       | In force (unchanged)          |
| Internal DWS audit (Q2 2026)  | Voluntary milestone     | Voluntary milestone (keep it) |

### Article 50 — Live Now, Not Deferred

**This is the most important operational message.** Article 50 transparency obligations are not included in the Omnibus deferral. DWS IQ 6's AI disclosure obligations to clients (NCC, T2H, Futurice, others) are **live now**. Every deployment must surface the "AI-generated" label (PR 082) and maintain the transparency register.

---

## 5. GPAI Note

Claude, Mistral, and other general-purpose AI models used inside DWS IQ 6 are already subject to GPAI rules since **2 August 2025**. The GPAI Code of Practice has been published by the AI Office.

DWS's role is **deployer**, not provider. Provider obligations (technical documentation, GPAI registration) rest with Anthropic, Mistral AI, etc. DWS's deployer obligations:

- Maintain transparency disclosures (Article 50)
- Ensure models are not configured for prohibited uses
- Monitor AI Office guidance on systemic-risk GPAI updates

No new action required from the Omnibus on GPAI — the framework is already in force.

---

## 6. Investor and Compliance Narrative

The Omnibus deferral **strengthens the DWS pitch**, not weakens it.

**Old narrative:** "Your August 2026 deadline is approaching — you need to act now."
**Updated narrative:** "The deadline extended to December 2027 — giving you breathing room. DWS delivers compliance infrastructure before competitors even start. Article 50 transparency obligations are live now; start there."

Recommended slide annotation for investor decks:

> "High-risk compliance deadline extended to Dec 2027 (Omnibus provisional agreement, 7 May 2026). GPAI rules and prohibited practices already in force. DWS IQ 6 positions clients ahead of the curve."

The deferral buys pilot customers runway. It does not remove the obligation. Clients who deploy DWS IQ 6 now will be fully documented and audit-ready by 2027 — competitors who wait will scramble.

---

## 7. Codebase Updates Required

The following files in the DWS6 repo contain the now-superseded "2 August 2026" high-risk enforcement deadline and need updating:

| Priority | File                                 | Change                                                     |
| -------- | ------------------------------------ | ---------------------------------------------------------- |
| P0       | `DWS_ARTICLE_12_LOGGING_STANDARD.md` | Update enforcement deadline line to 2 Dec 2027 (Annex III) |
| P0       | `Admin/SECURITY_COMPLIANCE.md`       | Update EU AI Act enforcement row                           |
| P0       | `DWS_STANDARDS_LIBRARY.md`           | Add Omnibus note + new nudifier prohibition                |
| P0       | `DWS_SECURITY_STANDARD.md`           | Update compliance status deadline note                     |
| P0       | `docs/Deputy-Agents-Architecture.md` | Update `enforcement valmius 2.8.2026`                      |
| P1       | `DWS6_V1_SPRINT.md`                  | Parenthetical deferral note on deadline line               |
| P1       | `IPR_PROTECTION_STRATEGY.md`         | Deferral note on enforcement date                          |
| P1       | `SECURITY_SUMMARY.md`                | Deferral note on "Applicable August 2026"                  |

**Not changing:** `DWS_ARTICLE_12_LOGGING_STANDARD.md` §1 regulatory anchors (the Articles themselves are unchanged). Article 12, 14, 26, 72, 73 obligations remain; only enforcement timeline shifts.

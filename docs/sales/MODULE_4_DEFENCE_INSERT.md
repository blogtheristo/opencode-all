# Module 4 — Defence-Specific Insert (3 Pages)

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/winning-sales-strategy-qb1boj | Date: 28.06.2026 | Changes: Initial creation — 3-page defence-specific insert for Diana/Riihimäki NATO resubmission and Nokia Defence round 2. Separable from the main pitch deck.

Document Status:

- Created: 28.06.2026
- Last Modified: 28.06.2026
- Language: English (Finnish variant notes included)
- Publication Status: DRAFT — review defence claims before external use

---

## Purpose

A standalone 3-page insert that bolts onto the main pitch deck (Module 2) when the audience is defence or dual-use. Answers Laura Manner-Raappana's specific feedback: "puolustussektoriin liittyvä näkökulma sekä erityinen lisäarvo puolustusalalle kaipaisivat vielä tarkempaa konkretisointia."

---

# DWS IQ Aegis — Defence & Dual-Use Value Proposition

## Page 1 — The Problem: Cloud LLMs Cannot Serve Defence

European defence and dual-use industry faces four structural defects with current cloud AI:

| Defect                                   | What Goes Wrong                                                                                                | Regulatory Basis                                    |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| **CLOUD Act exposure**                   | US law compels cloud providers to disclose data to US authorities — even when stored in EU                     | GDPR Art. 48 prohibits this; conflict is unresolved |
| **No 24-hour incident reconstruction**   | NIS2 requires complete incident timeline within 24h. Cloud AI logs are fragmented, multi-tenant, non-sovereign | NIS2 Directive (EU 2022/2555) Art. 23               |
| **No Article 12 immutable records**      | High-risk AI systems require permanent, tamper-evident audit trails. Cloud LLMs do not provide these           | EU AI Act Art. 12 (enforcement August 2, 2026)      |
| **No dual-use export control reasoning** | AI used to screen dual-use products (Reg. 2021/821) must itself be auditable and sovereign                     | Regulation 2021/821 Annex I + IV                    |

**The gap:** Defence needs AI that is sovereign, auditable, and killable. No cloud AI meets all three.

**DWS IQ Aegis closes this gap.**

---

## Page 2 — Three Defence Workflows (Ready Now)

### Workflow A — Drone Detection + UAS Classification + Article 12 Delivery

| Component  | Technology                       | Spec                                                               |
| ---------- | -------------------------------- | ------------------------------------------------------------------ |
| Vision     | YOLOv8-x on NVIDIA Jetson        | 4 camera feeds, <200ms                                             |
| Acoustic   | BirdNET classifier               | Rotor identification                                               |
| Reasoning  | Qwen 2.5 72B (bridged DGX Spark) | Cross-references observation + flight corridor + CER rules + NOTAM |
| Audit      | Article 12 immutable log         | Hash-chained, replicated, 7-year retention                         |
| Governance | KYA (Firecracker MicroVM)        | Per-agent isolation, <125ms kill authority                         |

**Deployment:** 2x Acer Veriton GN100 (bridged), 40 cores, 240GB unified memory. Total: ~€10,000 hardware.

### Workflow B — Dual-Use Export Control Screening (Reg. 2021/821)

| Component            | Technology                      | Spec                                                             |
| -------------------- | ------------------------------- | ---------------------------------------------------------------- |
| Primary screening    | Llama 3.1 70B (node-local)      | Annex I product classification                                   |
| Secondary validation | Qwen 2.5 72B (export-tuned)     | Annex IV restrictions + end-user database                        |
| RAG corpus           | 15,000+ EU regulation documents | CELEX citation for every decision                                |
| Audit                | Article 12 log                  | Model consensus + operator identity + exact regulation reference |

**Result:** Every screening decision produces a court-defensible record: what was screened, against which regulation, by which model, approved by which human.

### Workflow C — NIS2 24-Hour Incident Reconstruction

| Component      | Technology            | Spec                                               |
| -------------- | --------------------- | -------------------------------------------------- |
| Transcription  | Whisper (FI/SV/EN)    | All radio + Virve communications                   |
| Timeline draft | Qwen 2.5 72B          | Auto-drafts 24h early warning + 72h interim report |
| Human edit     | Firehorse audit trail | Every human modification logged                    |
| Export         | Signed bundle         | Full reconstruction, NIS2-compliant timeline       |

**Result:** From incident to NIS2-compliant report in hours, not days. Human-in-the-loop at every stage.

---

## Page 3 — Sovereign Topology & ROI

### Hardware: On-Premises, Air-Gappable

| Configuration       | Hardware                        | Memory | Power | Price    | Use Case                          |
| ------------------- | ------------------------------- | ------ | ----- | -------- | --------------------------------- |
| **Control Room 1x** | 1x NVIDIA DGX Spark             | 128 GB | 250W  | ~€5,500  | Single unit / project AI          |
| **Situation Room**  | 2x Acer Veriton GN100 (bridged) | 240 GB | ~400W | ~€10,000 | Multi-agent C2 data layer         |
| **Edge Node**       | NVIDIA Jetson Orin Nano         | 8 GB   | 7-15W | ~€500    | Field ops, offline, solar-capable |

All configurations: zero cloud dependency, zero CLOUD Act exposure, data never leaves the premises.

### Agent Governance: KYA (Know Your Agent)

| Capability                 | How It Works                                               | Why Defence Needs It                                     |
| -------------------------- | ---------------------------------------------------------- | -------------------------------------------------------- |
| **Cryptographic identity** | Every agent session bound to verified human via KYA ledger | Attribution for every AI decision                        |
| **MicroVM isolation**      | Firecracker per agent — separate kernel, <5MB overhead     | Zero lateral movement between agents                     |
| **Kill authority**         | <125ms termination, TPM 2.0 sealed evidence                | Real-time control over AI actions                        |
| **Trust scoring**          | ATS 0.00-1.00, dynamic gating                              | Automatic capability restriction on suspicious behaviour |

### 36-Month ROI Comparison

| Cost Category                  | Manual / Cloud       | DWS Sovereign        |
| ------------------------------ | -------------------- | -------------------- |
| Compliance officer (0.5 FTE)   | €25,920              | ~€2,160 (10% review) |
| Dual-use screening (manual)    | €74,880              | ~€7,488              |
| Cloud LLM tokens               | €18,000-36,000       | €0 (on-prem)         |
| Legal risk reserve (CLOUD Act) | Unlimited            | €0                   |
| **36-month TCO**               | **€118,800-136,800** | **€36,499**          |

**Savings: €82,000-100,000 over 36 months.** Hardware pays for itself in under 6 months.

### Compliance Coverage

- EU AI Act Article 12 + 14 (logging + human oversight)
- NIS2 Directive (EU 2022/2555)
- CER Directive (EU 2022/2557)
- GDPR Article 48 (no third-country forced disclosure)
- Regulation 2021/821 (dual-use export control)
- PUTU-laki 1531/2011 (Finnish Public Defence & Security Procurement Act)

### Procurement Codes (CPV)

| Code       | Description                                    |
| ---------- | ---------------------------------------------- |
| 35710000-4 | Command, control, communications systems       |
| 35720000-7 | Intelligence, surveillance, target acquisition |
| 30210000-4 | Computing hardware                             |
| 48000000-8 | Software and IT systems                        |

---

## Eligibility

- **EDIP Article 9 eligible** — 100% EU establishment, zero third-country control
- **NATO DIANA Accelerator eligible** — VTT-operated, Espoo
- **PiTuKri auditable** — Traficom NCSC-FI cloud security criteria v1.1 (52 criteria)

---

## Finnish Summary (for Diana/Riihimäki resubmission)

DWS IQ Aegis tarjoaa Suomen puolustussektorille ja kaksikäyttöteollisuudelle kolme valmista työnkulkua:

1. **Drone-tunnistus + UAS-luokittelu** — reaaliaikainen, Article 12 -auditoitu
2. **Kaksikäyttötuotteiden vientivalvontaseulonta** — Reg. 2021/821, oikeudellisesti kestävä jälki
3. **NIS2 24h -insidenttirekonstruktio** — automaattinen aikajana, ihminen silmukassa

Kaikki suvereenilla, Suomessa sijaitsevalla laitteistolla. Nolla CLOUD Act -altistusta. EU AI Act Article 12 tuotannossa maaliskuusta 2026.

**Lisäarvo puolustusalalle:** Tiedusteluautomaatio, C2-päätöstuki, toimitusketjun tilannekuva (ArgusAgent SAR), ja kaksikäyttösääntelyautomaatio — yhdellä alustalla, yhdellä auditoitavalla lokilla, yhdessä EU-jurisdiktiossa.

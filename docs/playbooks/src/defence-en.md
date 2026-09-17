---
title: "DWS Sovereign Playbook — Defence / dual-use"
slug: defence
industry: "Defence / dual-use"
industry_number: 8
flagship: true
language: en
version: 1.2.0
status: ACTIVE
effective: 2026-05-17
owner: Lifetime Oy
session: claude/playbooks-phase-1-Ps5Ax
pdf_target: dws10.com/playbooks/pdf/defence-en.pdf
frameworks:
  - NIS2 (Directive (EU) 2022/2555, CELEX 32022L2555)
  - CER (Directive (EU) 2022/2557, CELEX 32022L2557)
  - EU AI Act (Regulation (EU) 2024/1689, CELEX 32024R1689) Article 12
  - Dual-use export-control regime (Regulation (EU) 2021/821, CELEX 32021R0821)
  - GDPR (Regulation (EU) 2016/679, CELEX 32016R0679)
badges:
  - DWS Sovereign Stack
  - NVIDIA Inception
  - EU Inception Sovereign track
---

***
VERSION AND AGENT HISTORY
- 1.0.0 — 2026-05-17 — initial Phase 1 reference playbook (claude/playbooks-phase-1-Ps5Ax)
- 1.1.0 — 2026-05-17 — Boardy editorial pass: believer-filter opener, pull-quoted hooks, timeline vignette, harder NestAI positioning, three-objection handler (claude/playbooks-phase-1-Ps5Ax)
- 1.2.0 — 2026-05-17 — Nokia Defence positioning added in procurement annex: Nokia = network credibility + secure connectivity + integration cover (under the line); DWS = governed action stack + moat (above the line) (claude/playbooks-phase-1-Ps5Ax)
***

# Defence / dual-use — sovereign-stack playbook

**For:** procurement, compliance, and technical leads at EU defence ministries,
dual-use industrial operators, vapaapalokunta (VPK) coordinating civil defence,
and critical-infrastructure operators inside CER / NIS2 scope.

**One-line promise:** the NVIDIA stack, on your own hardware, in your own
building, with an Article 12 log your inspector can seal.

> If you don't own the metal, you don't own the security.

---

## 0. What you need to believe to read on

This playbook is not for buyers shopping for cheaper, easier AI. It is for
buyers who already know that compliance, subpoenas, and operational control
are the binding constraints. To get value from the rest of this document,
you need to agree with the following:

<div class="callout-believe">
<ul>
  <li><b>NIS2, CER, EU AI Act Article 12, and Reg 2021/821 are real, enforced, and inspectable</b> — not aspirational policy.</li>
  <li><b>Cloud dependency is the wrong bet for defence and CER critical entities</b> — the legal-risk reserve under cloud is unbounded.</li>
  <li><b>Owning the metal is the whole point</b> — physical custody of the inference layer is the substrate that makes every downstream control credible.</li>
  <li><b>Logging is the deliverable</b>, not a side-effect. The Article 12 log is what you hand to the inspector — it has to live where you can seal it.</li>
</ul>
</div>

If you nodded along to those four, the rest of this is for you.

---

## 1. The four hard failures of cloud-only LLMs in defence work

| # | Failure | The named regulation |
|---|---|---|
| 1 | **CLOUD Act exposure.** US-incorporated cloud providers can be compelled to grant US authorities access to customer data — even data stored in EU regions. For defence, dual-use, or CER critical entities, this is an instant deal-breaker. | US CLOUD Act 2018 (Pub. L. 115-141) — collides with **GDPR Art. 48** prohibition on third-country disclosure orders without a treaty basis (CELEX 32016R0679). |
| 2 | **No 24-hour incident reconstruction.** When a cloud LLM gives a bad answer at 02:00, you cannot reconstruct what it did. Logs live in someone else's tenancy, at someone else's granularity, in someone else's retention policy. | **NIS2 Directive (EU) 2022/2555 Art. 23** — early warning within 24 h, intermediate report within 72 h, final report within 1 month. CELEX **32022L2555**. |
| 3 | **No Article 12 immutable record.** Cloud LLMs do not surface prompt / response / decision traces at the granularity required for a high-risk AI system. | **EU AI Act Regulation (EU) 2024/1689 Art. 12** — automatic recording of events ("logs") over the lifetime of high-risk AI systems. CELEX **32024R1689**. |
| 4 | **No reliable dual-use export-control reasoning.** A cloud LLM running outside your jurisdiction cannot be relied on to refuse, log, or escalate a request that touches Annex I controlled goods or sensitive end-uses — and you have no way to audit what it said. | **Council Regulation (EU) 2021/821** (recast of the dual-use export-control regime). CELEX **32021R0821**. |

If you sell into defence, dual-use, or critical infrastructure, **any one** of
the four kills the deal. Cloud-only is structurally unfit.

> The legal-risk reserve under cloud-only is unbounded.
> Under sovereign, it is zero — because the jurisdiction is gone.

---

## 2. Recommended sovereign topology

The defence playbook calls for the bridged Situation Room, not a single edge
node. The reason is Article 12 log replication: an inspector who can be handed
a sealed log from a single node cannot tell whether that node was tampered with
between the event and the seal. Two nodes, replicated, cross-signed.

**Hardware**

- **Situation Room (2× bridged Acer Veriton GN100) — LF-SITROOM-001 — €10,093**
  Two GN100 nodes joined by a ConnectX-7 bridge. 40 cores, 240 GiB combined RAM,
  bridged inference up to 405 B-parameter models. Article 12 log is written
  active/standby, cross-replicated, 7-year retention.

- *Step-up option:* **IGX Orin (LF-IGX-ORIN) — €11,990** — for defence operators
  who need NVIDIA's 10-year industrial support lifecycle through 2033 and ECC
  memory on a single node. Use when single-node footprint matters more than
  bridged redundancy (e.g., vehicle, vessel, container).

**Service**

- **NVIDIA Install + Full Service — €995/device** — on-site engineer, CUDA +
  NVIDIA drivers validated on both nodes, NVIDIA NIM microservices + Cosmos
  Reason 2 checkpoints loaded, tensor-parallel sharding configured, MCP
  endpoint live, Article 12 replica log started, signed install protocol +
  runbook.

**Subscription**

- **Sovereign Model Updates — €299/month** — weekly security backports
  (CUDA driver patches, container CVE fixes, OpenSandbox + Ubuntu LTS),
  minor model patches, bridge-config tweaks, monthly NIM bundle refresh.
  CER / NIS2 / EU AI Act inspectors expect a documented patch cadence —
  weekly is inspector-friendly.

**Platform**

- **DWS IQ 6 — €4,999 (one-time)** — orchestration, MCP exposure, agent
  registry, Article 12 log API, EUR-Lex retrieval, audit-bundle exporter.

**Total turnkey (year 1): €10,093 + €995 (×2 nodes are covered by one fee
per the bundle) + €4,999 platform + €299 × 12 subscription = €19,675.**
Year 2+: €299 × 12 = €3,588/year subscription only.

All prices Finnish / EU B2B VAT 0 % reverse charge. Source of truth:
`dws10.com/config/products.json` (priceList v1.20).

---

## 3. Three named workflows we automate

### Workflow A — Drone detection + UAS classification + Article 12 hand-off

- **Vision NIM:** YOLOv8-x on Node A across 4 simultaneous camera feeds —
  bounding box + class + confidence streamed to the situation board in real
  time.
- **Acoustic NIM:** BirdNET-derived acoustic event model on Node A's
  secondary lane — rotor-signature classification (quadcopter / fixed-wing)
  confirms or rejects the visual detection within 200 ms.
- **Reasoning NIM:** Qwen 2.5 72B sharded across both nodes — cross-references
  detection + flight-corridor SOP + KRITIS / CER rules + local NOTAM database.
- **Where the log lands:** every detection, every recommendation, every
  operator decision lands in the **EU AI Act Art. 12 log**, replicated
  active/standby across both GN100s, hash-chained, 7-year retention.
- **What the inspector sees:** a single signed export — JSON event stream +
  CSV decision ledger + SHA-256 chain manifest — handed over on a sealed USB
  or via the read-only Article 12 log API.

### Workflow B — Dual-use export-control screening (Reg 2021/821)

- **Reasoning NIM:** Llama 3.1 70B on Node B (independent check) +
  Qwen 2.5 72B regulatory-tuned on Node A — both consulted on each
  outbound shipment request; disagreement is surfaced to the operator.
- **Retrieval:** BGE-M3 embeddings + local RAG over Council Reg (EU) 2021/821
  Annex I (controlled items list), Annex IV (intra-EU restricted), and your
  internal end-user / end-use file.
- **Where the log lands:** Article 12 log entry for every screening decision —
  classification, model agreement state, operator override (if any), final
  outcome (release / hold / escalate).
- **What the inspector sees:** per-shipment decision trail with the exact
  CELEX paragraph cited, the model versions consulted, and the operator
  identity tied to the call. Defensible at audit.

### Workflow C — NIS2 24-hour incident reconstruction

- **Transcription NIM:** Whisper (FI / SV / EN) on the operator console —
  every radio call, every Virve broadcast, every operator-to-operator
  hand-off captured in-house.
- **Reasoning NIM:** Qwen 2.5 72B walks the incident timeline against your
  NIS2 obligations and drafts the 24-hour early-warning report and 72-hour
  intermediate report — pre-populated, your CISO edits and signs.
- **Where the log lands:** Article 12 log entry per artefact — initial
  telemetry, model-drafted report, human edits, final submission.
- **What the inspector sees:** a single reconstruction bundle — what the
  system saw, what the model recommended, what the human did, when each
  step happened, signed end to end.

---

## 4. ROI — manual cost vs DWS sovereign stack, 36 months

| Item | Manual / cloud baseline | DWS sovereign |
|---|---|---|
| Hardware (one-time) | €0 (cloud) | €10,093 (Situation Room bridged pair) |
| Install + commissioning | €0 (cloud) | €995 (one fee for the pair) |
| Platform licence (one-time) | €0 — replaced by SaaS | €4,999 (DWS IQ 6) |
| Compliance officer hours, Article 12 reconstruction (~6 h / month at €120/h) | €25,920 over 36 mo | ~€2,160 (10 % residual review) |
| Dual-use screening review (~4 h / week at €120/h) | €74,880 over 36 mo | ~€7,488 (10 % residual) |
| Cloud LLM tokens (defence-grade, EU-resident — where available) | €18,000–€36,000 over 36 mo (typical) | €0 — on-site inference |
| Subscription | n/a | €10,764 (€299 × 36) |
| CLOUD Act / GDPR Art. 48 legal-risk reserve | unbounded — case-specific | €0 (jurisdiction removed) |
| **36-month TCO** | **€118,800 – €136,800** | **€36,499** |

Conservative range. The line that closes the deal is row 8: the legal-risk
reserve is unbounded under cloud-only and gone under sovereign.

---

## 5. Reference deployment vignette

**Scenario.** 2026, eastern Finland border municipality. A vapaapalokunta
runs a sovereign-by-default situation room out of the kalustohalli. Dual-use
mandate: fire/rescue plus civil defence — including unknown UAS sightings.
CER and NIS2 require auditable detection-to-decision logs.

How Situation Room runs it without leaving the building:

<ul class="timeline">
<li><b>T+0&nbsp;ms</b> — YOLOv8-x on Node A flags a moving object across one of four camera feeds. Bounding box + class + confidence on the situation board.</li>
<li><b>T+200&nbsp;ms</b> — Acoustic model on Node A's secondary lane confirms quadcopter rotor signature. Visual detection promoted from <i>candidate</i> to <i>confirmed</i>.</li>
<li><b>T+500&nbsp;ms</b> — Qwen 2.5 72B sharded across both nodes cross-references the detection against flight-corridor B7 SOP, the KRITIS / CER rule set, and the local NOTAM database.</li>
<li><b>T+1.0&nbsp;s</b> — Recommendation surfaces on the duty officer's console: <i>"Likely commercial quadcopter, corridor B7, not in restricted zone. Log + observe. Escalate if sustained &gt; 5 min in restricted zone."</i></li>
<li><b>T+1.2&nbsp;s</b> — Llama 3.1 70B on Node B runs the same scenario independently. Agreement = high confidence; disagreement = both views surfaced to the operator.</li>
<li><b>T+2.0&nbsp;s</b> — Whisper transcribes the duty officer's radio call to the partner brigade; TTS broadcasts the mutual-aid SitRep in Finnish and Swedish over Virve.</li>
<li><b>T+sealed</b> — Every detection, recommendation, and operator decision is in the Article 12 log, replicated across both nodes, hash-chained. The CER / NIS2 inspector arrives; the duty officer hands over a sealed export.</li>
</ul>

Nothing transited an external network. The CLOUD Act doesn't reach the
kalustohalli.

---

## 6. Finnish procurement annex — Hilma.fi, Laki 1531/2011, CPV mapping

This annex is included specifically for Finnish Ministry of Defence
(Puolustusministeriö), Defence Command (Pääesikunta), C5 Agency, and
Logistics Command (Logistiikkalaitos) procurement officers who need to
map this offer to the existing tender pipeline.

### Legal basis

- **Laki julkisista puolustus- ja turvallisuushankinnoista 1531/2011**
  ("PUTU-laki"). National implementation of EU
  **Directive 2009/81/EC** on procurement in defence and security.
- EU threshold for defence-and-security goods / services contracts:
  **€443,000** (revision in force from 1 January 2026 under the
  biennial review of Commission Regulation (EU) No 1251/2011). Confirm
  current threshold in the *Virallinen lehti* on the date of notice.
- Below threshold: national rules of Laki 1531/2011, notice on
  **Hilma (hankintailmoitukset.fi)** in the appropriate national
  category.
- Above threshold: same Hilma notice; the platform forwards the
  notification to **TED (Tenders Electronic Daily)** automatically.

### Procedure mapping

For a sovereign-stack purchase of this nature — bridged Situation Room
or IGX Orin, NVIDIA NIM bundle, sovereign model-update subscription,
and the DWS IQ 6 orchestration platform with Article 12 logging — the
recommended procedure under PUTU-laki is the
**negotiated procedure with prior publication** (*neuvottelumenettely
ilmoituksen julkaisemisen jälkeen*, Laki 1531/2011 § 30, transposing
Dir. 2009/81/EC Art. 26). Justification:

- security-sensitive operating environment;
- technical specification cannot be fully fixed up front
  (model-bundle configuration depends on operational role);
- dialogue is required on Article 12 logging integration with the
  customer's SIEM and inspector-handover process.

### CPV mapping

The 2008 CPV vocabulary lacks AI-specific codes. The closest precise
mapping for a DWS Defence deployment:

| CPV | Description | Maps to |
|---|---|---|
| 35710000-4 | Command, control, communication and computer systems | Situation Room bridged pair as a C4 platform |
| 35720000-7 | Intelligence, surveillance, target acquisition (ISTAR) | UAS detection workflow (Workflow A) |
| 30210000-4 | Data-processing machines (hardware) | Acer Veriton GN100, IGX Orin, DGX Spark |
| 48000000-8 | Software packages and information systems | DWS IQ 6 platform, NIM microservice bundle |
| 72000000-5 | IT services: consulting, software development, Internet, support | NVIDIA Install + Full Service, Sovereign Model Updates |
| 80511000-9 | Staff training services | Operator drill at install sign-off |

A combined notice typically lists **35710000-4** as the primary CPV
with 30210000-4 and 48000000-8 as additional CPVs.

### Vendor identity

| Field | Value |
|---|---|
| Tarjoaja | Lifetime Oy |
| Y-tunnus | 0772407-9 |
| ALV-tunnus | FI07724079 |
| Osoite | Laidunmaanraitti 2 A 25, 02330 Espoo, Finland |
| Toimitusjohtaja | Risto Anton Paarni |
| Yhteyshenkilö | risto.paarni@lifetime.fi |
| Toimitusketju | NVIDIA Inception Partner (EU Sovereign track) · Acer ISV path · EU-resident manufacture / integration / support |
| Saatavuus | Toimitus 4–8 viikkoa tilauksesta, asennus 1–2 päivää / sivusto |

### Positioning vis-à-vis Nokia Defence

> **Nokia gives the network credibility. DWS gives the governed action stack.**

Nokia's defence-and-intelligence portfolio — private 5G, mission-critical
networks, tactical-bubble deployable connectivity, MX Industrial Edge — solves
the layer below the sovereign stack: getting bits from camera, radio, and
sensor into the inference plane reliably enough to be operationally trusted,
in the field as well as in the kalustohalli.

Three things Nokia adds to a joint case:

- **Procurement credibility.** A known Nordic defence player at the network
  layer makes the sovereign stack feel less like a startup thesis and more
  like a buyable system. The buyer's risk committee recognises the Nokia
  logo as something they have signed off on before.
- **Secure connectivity.** Private 5G / edge / mission-critical pieces let
  the on-site NVIDIA stack actually operate in the field — vehicle, vessel,
  container, forward node — not only in a fixed building.
- **Integration cover.** Nokia owns the network and infrastructure layer;
  DWS owns the control plane and the Article 12 logging plane on top.
  Cleaner architecture than trying to be everything ourselves.

What Nokia does **not** add is the moat. The moat — sovereign deployment,
customer-owned hardware, auditable hand-off, NVIDIA NIM service wrapper,
and the field-feedback loop — sits with DWS. A joint proposal makes the
geometry explicit: **Nokia under the line, DWS above the line, customer
in custody of the seal.**

### Positioning vis-à-vis NestAI cooperation

> **NestAI builds the model. DWS builds the physical and legal layer
> that lets it survive Article 12 and NIS2 scrutiny.**

Finnish indigenous AI is the right strategic bet for defence. But a model
without a sovereign substrate to run on is a model that has to be deployed
on someone else's metal — and that someone else's metal, today, is almost
always a US-incorporated cloud. DWS supplies the substrate that closes the
gap: on-premise inference, NVIDIA NIM microservice runtime, the Article 12
logging plane, replicated audit storage, and the inspector-grade bundle
exporter. A NestAI model lands on a DWS Situation Room and is
**deployable in restricted environments on day one** without rewriting the
compliance story.

---

## 7. Objections we get, and the honest answer

### "Models change fast. Hardware is fixed. Doesn't that lose you?"

No — for two reasons. First, the **Sovereign Model Updates** subscription
(€299/mo) refreshes the NIM bundle monthly; the hardware is the substrate,
the models are the cargo, and the cargo gets replaced. Second, the model
class that runs on a bridged GN100 pair (up to 405 B-parameter via tensor
parallel) is exactly the class an inspector will accept evidence from for
the next 3–5 years. The hardware is fixed; the moat is the replacement
cadence + the Article 12 log continuity across upgrades.

### "Who carries liability if the model hallucinates a bad threat call?"

The operator does, the same as today with any decision-support tool. What
DWS adds is the **evidentiary chain that lets the operator defend the call**:
- both models' independent outputs and disagreement state are logged;
- the SOP and rule-set version consulted are logged;
- the operator's decision and the time-to-decision are logged;
- the entire chain is hash-sealed before hand-off.

The contractual liability for the sovereign stack itself sits with Lifetime
Oy as a Finnish-registered EU entity (Y-tunnus 0772407-9). No third-country
hop in the liability chain.

### "Why can't we just use a private EU tenant on Azure / AWS / OCI?"

Three reasons, in order of decisiveness:

1. **CLOUD Act jurisdiction is not removed by an EU tenant.** A US-incorporated
   provider can still be compelled under the US CLOUD Act (Pub. L. 115-141)
   to grant US authorities access to customer data regardless of which
   region holds the bytes. GDPR Art. 48 (CELEX 32016R0679) prohibits
   third-country disclosure orders without a treaty basis. The two
   collide; the buyer carries the legal-risk reserve.
2. **Article 12 (EU AI Act) requires record-keeping over the lifetime of
   the high-risk AI system at a granularity cloud providers do not
   surface.** A private tenant changes who holds the keys; it does not
   change what the cloud-side logging captures.
3. **A NIS2 24-hour incident report requires reconstruction of what the
   model did at the moment of incident.** When the logs live in someone
   else's tenancy, at someone else's granularity, in someone else's
   retention policy, the reconstruction is partial. Inspectors notice.

The honest answer: a private tenant is a useful posture for some workloads.
For defence, dual-use, and CER critical infrastructure, it is not enough.

---

## 8. What to do next

- **Book a 30-minute demo:** <https://dws10.com/book>
- **Full price list:** <https://dws10.com/buy>
- **NVIDIA Inception case:** <https://dws10.com/dual-use-industries>
- **Direct contact:** Risto Paarni, CEO Lifetime Oy — risto.paarni@lifetime.fi

Lifetime Oy — Y-tunnus 0772407-9 — VAT FI07724079 —
Laidunmaanraitti 2 A 25, 02330 Espoo, Finland.

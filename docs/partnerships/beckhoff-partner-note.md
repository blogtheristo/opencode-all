---
Title: Partner Note — Beckhoff Automation (Beckhoff Automation Oy, Finland)
Date: 2026-10-01
Author: Risto Anton Päärni, Founder, CEO · Lifetime Oy
Status: NOT CONTACTED — awaiting HIC decision to initiate outreach
Related: docs/sales/aegis-pilot-versions/AEGIS_PILOT_SKU_v2.0.md (LF-NODE-X86-NV-BK), docs/field-notes/2026-10-01-boardy-claims-audit.md (rows 5–8b, 16), DWS_STANDARDS_LIBRARY.md §3.6.1 (PENDING_REVIEW)
---

# Partner Note: Beckhoff Automation

**Why this note exists.** DWS IQ Aegis pilots run on an NVIDIA CUDA node inside the customer's control room. If the plant already runs Beckhoff, a Beckhoff IPC with an NVIDIA GPU is the node the customer's procurement and maintenance already know. This note tracks what is verified, what is not, and what we would ask Beckhoff for. No contact has been made. All terms below are DWS IQ opening positions.

## Who they are (verified)

| Fact                                                                                                                                                  | Source                                                                                                                                                                                                                   |
| ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Beckhoff Automation GmbH & Co. KG, Verl (DE); family-owned, led by Hans Beckhoff, no external shareholders                                            | [Wikipedia](https://en.wikipedia.org/wiki/Beckhoff_Automation), [Beckhoff Group](https://www.beckhoff.com/en-en/company/beckhoff-group/)                                                                                 |
| Finnish subsidiary Beckhoff Automation Oy, Hakakalliontie 2, 05460 Hyvinkää; offices also in Tampere, Seinäjoki, Oulu, Kuopio; +358 20 7423 800       | [Beckhoff Finland](https://www.beckhoff.com/en-us/company/global-presence/finland.html)                                                                                                                                  |
| Beckhoff Automation Oy: revenue €19.1M (2025, +21.8 %), 40 employees; Y-tunnus 1606412-1                                                              | [Asiakastieto](https://www.asiakastieto.fi/yritykset/fi/beckhoff-automation-oy/16064121/taloustiedot-raportti), [Finder](https://www.finder.fi/Automaatio/Beckhoff+Automation+Oy/Hyvink%C3%A4%C3%A4/yhteystiedot/226602) |
| Portfolio: IPC and panels, I/O (EtherCAT and other fieldbuses), Motion, Automation (TwinCAT), MX-System (IP67 modular), Vision                        | Beckhoff FI homepage as provided by HIC, 01.10.2026                                                                                                                                                                      |
| Beckhoff RT Linux: Debian-based, real-time kernel; TwinCAT runtime; Docker / Podman / LXC; GPU usable from the real-time environment for acceleration | [Beckhoff Linux](https://www.beckhoff.com/en-us/products/product-news/linux-r/), [press 04/2024](https://www.beckhoff.com/en-en/company/press/twincat-runtime-for-real-time-linux-r-2024-04.html)                        |
| Finnish customer reference found: Ginolis Oy (Oulunsalo), TwinCAT 3 NC I, medical test-kit production equipment                                       | [automation.com 06/2020](https://www.automation.com/en-us/articles/june-2020/beckhoff-automation-helps-finnish-company-enhance)                                                                                          |

## Sovereignty reading

Under the §3.6.1 draft (box vs chip): **box Tier 1** (private German family company, EU legal entity, no non-EU parent), **silicon Tier 2** (NVIDIA GPU, US). Stated on two lines, never as Tier 1 overall. §3.6.1 is PENDING_REVIEW.

## Fit with Aegis

| Aegis layer                        | Beckhoff piece                                                         | Status                                                                                                                |
| ---------------------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Compute node (`LF-NODE-X86-NV-BK`) | IPC with PCIe GPU slot + NVIDIA GPU, Beckhoff RT Linux or Ubuntu       | **Model not yet verified**: C6675 listing showed Windows only; GPU slot/power, Linux support, TPM type per model open |
| Sensor/input layer (`LF-SENSHUB`)  | EtherCAT I/O; EK9000 Modbus TCP coupler; CX7000 + TF6100 OPC UA server | EK9000 price verified (€258–299); TF6100 unverified (`docs/sales/AEGIS_SENSOR_OT_MARKET_2026-10.md`)                  |
| Read-only integration              | TwinCAT OPC UA server on existing Beckhoff controllers, read-only role | To confirm per site                                                                                                   |
| Operator workstation (`LF-OP-WS`)  | CP39xx multi-touch panels                                              | Quote only                                                                                                            |
| Kernel sandbox                     | Landlock + seccomp + namespaces must work on the Beckhoff RT kernel    | **Open — Phase 0 test** (`aegis:pilot -- prove`)                                                                      |

## Honest limits

- No public Beckhoff reference in Finnish process industry (steel, chemicals, pulp & paper) was found. The Outokumpu–Beckhoff link was the HIC's own assumption, not evidence.
- A real-time kernel may differ from Ubuntu's 6.8 kernel in Landlock ABI; the OpenShell sandbox treats Landlock as a hard requirement. If it fails, the Beckhoff node runs Ubuntu instead of RT Linux, or Beckhoff stays on the I/O layer only.
- Lifetime Oy has no Beckhoff partnership or reseller agreement. Warranty and spares follow Beckhoff terms.

## What we would ask Beckhoff Automation Oy (opening position)

1. Which current IPC models take an NVIDIA GPU (slot, power, cooling) and are supported with Beckhoff RT Linux or Ubuntu 24.04; TPM type and chip part number.
2. A loaner unit for one Phase 0 rehearsal (`aegis:pilot -- prove` + rehearsal run) — result shared with Beckhoff.
3. Two or three Finnish process-industry customers where a Beckhoff control room exists, for a joint pilot offer (customer runs the acceptance test; Beckhoff hardware, DWS IQ governance layer).
4. Commercial frame: Lifetime Oy resells the Beckhoff node as a price-list line, or Beckhoff sells the hardware directly and Lifetime Oy sells the pilot.

## Entertainment Compendium 2026 — HIC-forwarded summary, audited 01.10.2026

**Source status:** the HIC forwarded an AI-written summary of Beckhoff's _PC Control Entertainment Compendium 2026_ (PDF on the HIC's OneDrive). The PDF and beckhoff.com were not reachable from this session (proxy 403), so **every claim below is unverified** until the PDF is read. Nothing here goes into customer text (HIC rule: no claim without evidence).

| Claim in the summary                                                                                         | Verdict                    | Note                                                                                                                                                                                                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------ | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| References use distributed real-time control, EtherCAT, TwinCAT, TwinSAFE, remote diagnostics, event logs    | **UNVERIFIED — plausible** | Consistent with the verified Beckhoff portfolio above; check reference count in the PDF.                                                                                                                                                                                                               |
| Kinetic installations with 900–1,200 axes in one system (Kinetic Rain, MKTe, Art+Com)                        | **UNVERIFIED**             | Read the PDF page before quoting any axis count.                                                                                                                                                                                                                                                       |
| Theme parks (Alterface, Simtec, SANLAB, Great Wolf Lodge, Expo Osaka)                                        | **UNVERIFIED**             | Names only; no buyer, budget or trigger identified.                                                                                                                                                                                                                                                    |
| Beckhoff shows TwinCAT CoAgent, TwinCAT Machine Learning Creator, predictive maintenance                     | **UNVERIFIED**             | If true, Beckhoff is adding AI inside its own stack: a partner door and a competitor at the same time.                                                                                                                                                                                                 |
| "No strong higher-level situational-picture, digital-twin or AI-governance solution visible in the document" | **NOT EVIDENCE**           | Absence in a marketing compendium does not show absence in the market.                                                                                                                                                                                                                                 |
| Aegis as the "Operational Intelligence / AI Governance Layer" above TwinCAT                                  | **PARTLY FITS**            | Aegis today: governed agent runtime on site, offline operation, operator stop authority, signed record, read-only integrations (`Store/PRODUCT_AEGIS.md`). Read-only OPC UA from TwinCAT is already the planned integration path (table above). Governance of _Beckhoff's own_ ML models is not built. |
| Aegis Motion / Experience / Maintenance / Digital Twin as products                                           | **NOT AEGIS TODAY**        | Digital twin, predictive maintenance, wear analytics and guest analytics are not Aegis capabilities or catalogue SKUs. Proposals only; any new SKU is an HIC product decision.                                                                                                                         |
| Aegis writes to motion or safety systems                                                                     | **MUST NOT**               | Aegis never sends commands straight to production equipment and does not touch the plant's own safety functions (FI pilot text v2.1.0). TwinSAFE stays Beckhoff's.                                                                                                                                     |

**What is usable now:** an entertainment and attractions segment where a 24/7 operator, many sensors and a safety-certified control layer already exist, and where an operator-approved, auditable agent layer above TwinCAT (read-only) is a coherent offer — the same pilot, a different industry. Sales score ★★☆☆☆ (segment fit, no named account or trigger), logged in `docs/sales/SALES_OPPORTUNITIES_PIPELINE.md`. PhD §14.x entry: pending until the PDF is read (four-file lockstep).

**Next step:** read the PDF (HIC to place it in the repo or Drive with link access), then re-score and verify each row.

## Outreach

Not before HIC approval. If approved: first contact to Beckhoff Automation Oy, Hyvinkää, via the published channel; sender `risto.paarni@lifetime.fi`; first line names the joint pilot, not compliance. A public "partner note" blog post is a separate item and goes through `/blog-draft` (Non-Negotiable Rule 13).

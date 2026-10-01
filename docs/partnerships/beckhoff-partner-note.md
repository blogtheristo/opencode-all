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

## Outreach

Not before HIC approval. If approved: first contact to Beckhoff Automation Oy, Hyvinkää, via the published channel; sender `risto.paarni@lifetime.fi`; first line names the joint pilot, not compliance. A public "partner note" blog post is a separate item and goes through `/blog-draft` (Non-Negotiable Rule 13).

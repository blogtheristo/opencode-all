# Warsaw IRIS² Signing — How DWS IQ Aegis Connects to Europe's Sovereign Satellite Constellation

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code | Session: claude/warsaw-iris2-signing-9a6a4y | Date: 23.07.2026 | Changes: Initial creation — field note from the Warsaw signing of Poland's €656M IRIS² contribution agreement (21.07.2026), mapping five concrete connection paths between the IRIS² secure-connectivity constellation and the DWS IQ Aegis platform (Store/PRODUCT_AEGIS.md, AEGIS_ROADMAP.md).

Session Links & References:
  - Claude Code (claude/warsaw-iris2-signing-9a6a4y): https://github.com/blogtheristo/dws6/commits/claude/warsaw-iris2-signing-9a6a4y

Document Status:
  - Created: 23.07.2026
  - Last Modified: 23.07.2026
  - Language: English
  - Publication Status: ACTIVE — internal strategy note

***

**Date:** 2026-07-23
**Author:** Risto Anton Päärni
**Type:** Field Note / Strategic Intelligence
**Context:** Signing ceremony, Poland–IRIS² contribution agreement, Warsaw
**Event:** 2026-07-21 — signed by EU Commissioner for Defence and Space Andrius Kubilius, Polish Interior Minister Marcin Kierwiński, and Under-Secretary of State Konrad Szymański
**Question addressed:** *How can we connect Aegis?*

---

## Summary

Poland is committing **€656M of remaining RRF/NRRP funds** to IRIS², the EU's third flagship space programme (after Galileo and Copernicus). This funds **6 MEO + 6 LEO satellites operated as a Polish constellation within IRIS²**, a **satellite gateway in Warsaw** wired into the government's **GovNet** fibre backbone, and secure access for Polish government, armed forces, and emergency services — with the Polish space industry made eligible to bid for constellation contracts.

This is the same thesis Aegis is built on, expressed in orbit: **sovereignty as a service, EU-owned, outside CLOUD Act reach.** IRIS² provides the sovereign secure *bearer*; Aegis provides the sovereign *intelligence, agent-governance, and compliance layer* that runs over it. They are complementary layers of one European sovereign stack — not competitors.

**One-line answer:** We do not connect Aegis *to a satellite*. We position Aegis as the **EU-sovereign AI application and governance layer that runs over IRIS² secure connectivity** — and we use Poland's eastern-flank build-out as the go-to-market beachhead.

---

## What IRIS² actually is (grounding)

| Fact | Detail | Source |
| --- | --- | --- |
| Programme | IRIS² — Infrastructure for Resilience, Interconnectivity and Security by Satellite | EC Defence Industry & Space |
| Scale | ~290 satellites, multi-orbital (MEO + LEO) | ESA / Copernicus |
| Governance | 12-year concession awarded late 2024 to **SpaceRISE** (SES, Eutelsat, Hispasat); **EUSPA** coordinates user relations + secure ground segment | ESA / EUSPA |
| Timeline | First launch envisioned 2029; operational ~2030 | ESA |
| Purpose | Secure governmental connectivity + broadband; strategic-infrastructure resilience | EC |
| Poland | €656M RRF; 6 MEO + 6 LEO sats as a Polish constellation; Warsaw gateway → GovNet; access for gov/military/emergency; Polish industry contract-eligible | Notes From Poland / European Spaceflight |

**Important distinction:** IRIS² is a **secure communications** constellation, not an Earth-observation one. So the connection is *not* "Aegis labels IRIS² imagery." The connection is that IRIS² is the **sovereign transport and backhaul** for the data and inference Aegis already does — and the **critical infrastructure** whose attached AI systems need Aegis-grade governance.

---

## Five concrete connection paths

### A. Aegis as the sovereign AI application layer *over* IRIS² connectivity
IRIS² delivers a CLOUD-Act-free secure pipe to governmental and dual-use users. Aegis is exactly the EU-sovereign AI/compliance workload that belongs on that pipe: skilled-agent fleet, KYA agent governance, Article 12 audit, EU-only hosting (UpCloud Helsinki). Position Aegis to the IRIS²/GOVSATCOM user community (via EUSPA and member-state channels) as a **certified sovereign application** that runs over the secure link — the missing "what do you actually run on the resilient bearer" answer.

### B. IRIS² as sovereign backhaul for Argus + the edge-cloud inference split
Aegis's roadmap item #4 (`Store/PRODUCT_AEGIS.md`, K8s AI Inference Roadmap, PR 137D) assumes a **Jetson Orin Nano field/classified edge ↔ Helsinki sovereign cloud** split — but Aegis does not own the connectivity leg. IRIS² *is* that leg. Field/classified edge nodes (SAR ingest for ArgusAgent, SiteSense field ops) reach the sovereign cloud **without commercial hyperscaler transit**. This closes the one gap in the current architecture: sovereign compute + sovereign audit already exist; sovereign *transport* was assumed. IRIS² supplies it.

### C. Ground-segment governance — the Warsaw gateway is NIS2/CER critical infrastructure
The Warsaw gateway + GovNet integration is exactly the class of asset the **CER Directive** and **NIS2** cover. Aegis's `SovereigntyMonitor` (CLOUD Act exposure, EU residency), `Article12Logger`, `ComplianceAgent`, and `KYA Engine` are built to govern the AI systems attached to that ground segment — verifying residency, logging every AI decision, and holding kill authority over any agent touching the secure segment.

### D. Poland as the go-to-market beachhead
Poland just made its space industry **contract-eligible** for constellation work and is standing up an eastern-flank dual-use manufacturing and secure-comms base. That is Aegis's exact target market (government agencies → defence primes → dual-use supply chains). Entry play: partner with a **Polish space-cluster prime or systems integrator** rather than selling direct, mirroring the DEFINE / DIANA ecosystem approach used in Finland. Aegis brings the sovereign AI-governance layer a national IRIS² segment needs but SpaceRISE does not provide.

### E. Cross-vertical intelligence over a resilient sovereign bearer
`CrossVerticalIntel` propagates supply-chain and orbital signals across 21 industries. Running that propagation over an IRIS²-grade resilient, secure link — rather than the public internet — hardens the eastern-flank early-warning value proposition and fits the "strategic-infrastructure resilience" language of the Poland deal directly.

---

## What Aegis is *not* here (scope honesty)

- Not a satcom operator, not part of the SpaceRISE concession, not a space-segment or hardware player.
- Not an IRIS² imagery/EO analytics product (IRIS² is comms, not EO).
- The role is **downstream sovereign application + governance layer + Polish-market GTM** — nothing that requires us to build or launch anything in orbit.

---

## Recommended next steps

1. **Map the user/access channel** — confirm how a sovereign application is certified/onboarded onto IRIS²/GOVSATCOM secure links (EUSPA + member-state secure-connectivity contact points). *Owner: BD.*
2. **Tighten roadmap PR 137D** to name IRIS² as the reference sovereign backhaul for the edge-cloud split. *Owner: Eng — small edit to `Store/PRODUCT_AEGIS.md` roadmap once path A/B is validated.*
3. **Identify one Polish partner** — a space-cluster prime or SI to co-sell Aegis into the Warsaw gateway / eastern-flank dual-use base.
4. **Add IRIS² to the competitive/positioning narrative** as a *complement* (sovereign bearer) alongside the existing Palantir/Anduril NGC2 contrast (sovereign application) in `Store/PRODUCT_AEGIS.md`.

---

## Sources

- [Poland joins EU satellite project — Notes From Poland](https://notesfrompoland.com/2026/07/21/poland-joins-eu-satellite-project-developing-european-alternative-to-starlink/)
- [Poland Boosts Its Contribution to IRIS² to €656M — European Spaceflight](https://europeanspaceflight.com/poland-boosts-its-contribution-to-europes-iris2-constellation-to-e656m)
- [Poland invests €656m in IRIS² — INSIGHT EU MONITORING](https://ieu-monitoring.com/editorial/poland-invests-e656m-in-iris%c2%b2-to-strengthen-secure-connectivity-on-eus-eastern-flank/1246238)
- [ESA confirms kick-start of IRIS² with EC and SpaceRISE — ESA](https://resilience.esa.int/archives/news/esa-confirms-kickstart-iris%C2%B2-european-commission-and-spacerise)
- [IRIS² Secure Connectivity — European Commission](https://defence-industry-space.ec.europa.eu/eu-space/iris2-secure-connectivity_en)

---

_"IRIS² gives Europe a sovereign pipe. Aegis is what you run over it — under KYA governance, inside an EU enclave, with an Article 12 audit trail."_

_Last updated: 2026-07-23_

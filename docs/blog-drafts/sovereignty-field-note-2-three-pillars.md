# The three pillars every global enterprise needs

Status: PENDING-HIC-REVIEW
Extracted-From: onelifetime.world/posts/sovereignty-field-note-2-three-pillars.html
Extracted-On: 2026-08-12
Published: 2026-05-28
claims_checked: 2026-09-30

> This draft was reconstructed from the already-published page, because the
> post went live without one (Rule 13). It is here so the text is reviewable,
> NOT as evidence that it was reviewed. Read it, then either set
> `Status: APPROVED` or change the post.

---

Data, Technology, Operational — the universal sovereignty model. Only jurisdiction varies.

28 May 2026 · by Risto Anton Paarni ·
Suomeksi

The short version

- Every global enterprise needs three sovereignty pillars: Data, Technology, Operational. None is optional.

- Origin sets the emphasis profile. EU emphasizes Data. US emphasizes Tech + Operational. Singapore emphasizes Operational neutrality.

- Quantum re-prices all three pillars. Harvest-now-decrypt-later has to be assumed to be running already. NIST FIPS 203/204/205 is the bridge.

- KYA wires the pillars into testable predicates: Data &rarr; SIB, Tech &rarr; CSB, Op &rarr; EAB, ASB binds the identity spine.

- DWS6 Aegis / Sovereign Infra / Connect are the EU-origin enterprise's execution of the model. Rightful Oy R-Sac² is the quantum-readiness instrument.

Sovereignty is not a European protectionism project. It is not a wall against US technology. It is risk management, and every globally operating enterprise needs the same three pillars to stand.

Frameworks and laws vary by jurisdiction. The base requirements do not.

## The three pillars, defined

Pillar 1 · Data Sovereignty

### Control over where data resides and who can reach it

The ability to keep citizen data, trade secrets, and regulated information out of reach of third-country extraterritorial law. CLOUD Act [1], FISA 702, Schrems II all live in this pillar.

Pillar 2 · Technology Sovereignty

### Independence from any single vendor

Open standards, cloud portability, replaceable algorithms, replaceable silicon where it matters. The pillar that protects negotiating leverage and strategic optionality.

Pillar 3 · Operational Sovereignty

### Continuity without foreign interference

The assurance that business keeps running even when geopolitics tightens. NIS2 and DORA live here. So does the ability to fail over between jurisdictions when one becomes politically unavailable.

## Three jurisdictions, same three pillars

The pillars are universal. The weighting is set by where the enterprise is from and where it sells.

- EU-origin enterprise. Data sovereignty leads. GDPR, the EU Data Act, EUCS classifications, and Schrems II are the daily vocabulary. Technology sovereignty is the structural gap — hypercloud dependency is real — which is why Aiven, Scaleway, OVHcloud, IONOS, SUSE, and Red Hat Confirmed Sovereign Support [2] all matter.

- US-origin enterprise. Operational and Technology sovereignty lead. Cyber resilience (CMMC, Executive Orders), IP protection, domestic silicon. Data sovereignty becomes reactive: a US firm selling into Europe or Asia must engineer local data residency or lose customers to local law.

- Singapore-origin enterprise. Operational sovereignty leads as digital neutrality. The bridge between West and East cannot afford to pick a side at the infrastructure layer. PDPA, MAS TRM, IMDA cloud guidance, plus compatibility with mainland China data localization — the pillar that matters is the ability to swap providers in flight.

## The pillar &times; jurisdiction matrix

## The quantum overlay — and why it touches every pillar

Quantum computers do not have to exist yet for quantum risk to be real today [3]. Any adversary can already be harvesting encrypted traffic on the bet that today's RSA and ECC ciphertexts will be decryptable on a Cryptographically-Relevant Quantum Computer within the next 10–15 years; surveyed experts rate one quite possible within 10 years and likely within 15 [4][5]. The name is honest: harvest now, decrypt later.

NIST has finalized the standards [6] — FIPS 203 (ML-KEM, from Kyber: key encapsulation), FIPS 204 (ML-DSA, from Dilithium: digital signatures), FIPS 205 (SLH-DSA, from SPHINCS+: stateless hash-based signatures). The US CNSA 2.0 mandate sets a 2035 cutover for national security systems [7]. The EU's coordinated PQC roadmap lands in the same window: high-risk use cases by the end of 2030, as many systems as feasible by 2035 [8]. Singapore points the same way: IMDA's National Quantum-Safe Network Plus, and MAS's 2024 quantum-risk advisory, which asks financial institutions to inventory their cryptography first [9].

Quantum is not a fourth pillar

It is a cross-cutting dimension that re-prices each of the three. Data residency without post-quantum encryption has an expiry date. Technology choices that lock in a single algorithm are themselves a vendor-lock surface. Operational continuity without crypto-agility fails the first time an algorithm has to be rotated under pressure.

Sovereignty without crypto-agility is sovereignty with an expiry date.

## Worked example — Rightful Oy R-Sac²

Rightful Oy (Espoo, Finland — an EU jurisdictional anchor) ships R-Sac² — Road to Post-Quantum Security as a five-stage methodology that operationalizes the quantum overlay above. We name them here because we trust Finnish hands on the cryptography problem, and because their five stages map cleanly to the way KYA conformance is already vocabularised in our architecture.

Stage 1 · Identify quantum risks

Asset, data, and threat inventory. Touches Data Sovereignty. KYA SIB-track — HNDL exposure surface.

Stage 2 · Assess current cryptography

Resilience scoring and prioritization. Touches Technology Sovereignty. KYA CSB-track — crypto-inventory map.

Stage 3 · Plan the transition

NIST-aligned migration roadmap. Touches Technology + Operational. KYA CSB + EAB — migration plan and rollback readiness.

Stage 4 · Implement & integrate

PQC deployment. Touches Operational Sovereignty. KYA EAB-track — execution attestation.

Stage 5 · Monitor & stay in control

Continuous adaptation. Touches Operational Sovereignty. KYA EAB-track — recurring attestation, crypto-agility audit.

Rightful is the EU-origin worked example. Equivalent partners surface in other jurisdictions — NIST-NCCoE's migration playbook in the US, IMDA's Quantum-Safe Network testbed in Singapore. The model travels.

## How this wires into KYA

The Know Your Agent (KYA) Standard candidate defines a four-track conformance suite. Field Note #2 wires the three pillars into the four tracks so sovereignty becomes operationally testable, not rhetorical.

- Data Sovereignty &rarr; SIB-track. Substrate-Integrity Conformance. Jurisdictional-data-flow attestation, residency, encryption posture, third-country access path.

- Technology Sovereignty &rarr; CSB-track. Cost-Surface / Code-Substrate Conformance. Vendor-independence attestation: open-source share, portability index, algorithm rotation capability.

- Operational Sovereignty &rarr; EAB-track. Execution-Attestation. Continuity-under-stress attestation: failover jurisdiction, key custody, crypto-agility under pressure.

- ASB-track binds the human-attested identity spine that authorises all three pillars to a verified deployer.

Enterprise sovereignty posture becomes a measurable triple (SIB, CSB, EAB) per jurisdiction (EU, US, SG). Procurement gates speak in standards-layer language. Marketing claims become testable.

## DWS6 self-segmentation — sovereignty is segmentation

DWS6 operates from the EU (Helsinki / Espoo). The product segmentation is the EU-origin enterprise's execution of the three-pillar &times; three-jurisdiction model — not a competing taxonomy.

DWS IQ Connect

### Non-EU market access

UAE, Singapore, partnership markets. US Public cloud default. Lighter DPA. Tech + Op pillars under J2 / J3 jurisdictions; Data pillar deliberately light.

DWS IQ Sovereign Infra

### EU enterprise baseline

EU Development cloud. EU sovereign DPA, GDPR Article 3 enforced. Data pillar primary. Tech and Op pillars at EU operational sovereignty (Red Hat Tier 2 vendor class).

DWS IQ Aegis

### EU dual-use, defence, critical sectors

Aegis Sovereign cloud only. Strictest DPA, non-CLOUD-Act jurisdiction. LWM Acer unlocked. All three pillars at full EU-sovereign (Tier 1 vendor class). R-Sac²-ready surface for enterprises that require quantum-safe substrate today.

## What this is not

- Not a fourth pillar called "Quantum." Quantum is a cross-cutting dimension applied to all three.

- Not a rejection of US or Chinese technology. A globally operating enterprise needs market access across jurisdictions.

- Not a replacement of the vendor-tier model in DWS_STANDARDS_LIBRARY.md §3.6. Vendor tiers operate inside each pillar, not above it.

- Not a sales pitch. The DWS6 mapping above is a worked example, not the only path.

In one paragraph

Sovereignty is not isolation — it is risk management. Only jurisdiction and applicable law vary by origin. The requirement to govern your own digital fate is universal.

## Read next

- Red Hat's EU sovereign move — and the three tiers beneath it

- The Strike Price State — five things Europe just made official

- Our layers are solid — Aiven, Scaleway, KYA + Foundry

- MCP Apps extends the frontier — KYA is the identity spine

Risto Anton Paarni

CEO, Lifetime Oy · Editor in Chief, Lifetime Scope Journal

## Sources

[1] United States Congress (2018). 18 U.S.C. § 2713 — Required preservation and disclosure of communications and records (CLOUD Act, Pub. L. 115–141, div. V, § 103). United States Code. <https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title18-section2713>

[2] Red Hat (2025). Red Hat Introduces Confirmed Sovereign Support for European Union. Red Hat press release. <https://www.redhat.com/en/about/press-releases/red-hat-introduces-confirmed-sovereign-support-european-union>

[3] Babbush, R., Zalcman, A., Gidney, C., Broughton, M., Khattar, T., Neven, H., Bergamaschi, T., Drake, J., & Boneh, D. (2026). Securing Elliptic Curve Cryptocurrencies against Quantum Vulnerabilities: Resource Estimates and Mitigations. arXiv preprint arXiv:2603.28846. <https://arxiv.org/abs/2603.28846>

[4] Kearney, J. J., Moyler, J., & Perez-Delgado, C. A. (2024). Downtime Required for Bitcoin Quantum-Safety. arXiv preprint arXiv:2410.16965. <https://arxiv.org/abs/2410.16965>

[5] Global Risk Institute & evolutionQ (2025). Quantum Threat Timeline Report 2025. Global Risk Institute. <https://globalriskinstitute.org/publication/quantum-threat-timeline-report-2025b/>

[6] NIST (2024). NIST Releases First 3 Finalized Post-Quantum Encryption Standards (FIPS 203, 204, 205). National Institute of Standards and Technology. <https://www.nist.gov/news-events/news/2024/08/nist-releases-first-3-finalized-post-quantum-encryption-standards>

[7] National Security Agency (2022). NSA Releases Future Quantum-Resistant (QR) Algorithm Requirements for National Security Systems (CNSA 2.0). NSA press release. <https://www.nsa.gov/Press-Room/News-Highlights/Article/Article/3148990/nsa-releases-future-quantum-resistant-qr-algorithm-requirements-for-national-se/>

[8] NIS Cooperation Group (2025). A Coordinated Implementation Roadmap for the Transition to Post-Quantum Cryptography. European Commission. <https://digital-strategy.ec.europa.eu/en/library/coordinated-implementation-roadmap-transition-post-quantum-cryptography>

[9] Monetary Authority of Singapore (2024). Advisory on Addressing the Cybersecurity Risks Associated with Quantum (MAS/TCRS/2024/01). MAS circular. <https://www.mas.gov.sg/regulation/circulars/advisory-on-addressing-the-cybersecurity-risks-associated-with-quantum>

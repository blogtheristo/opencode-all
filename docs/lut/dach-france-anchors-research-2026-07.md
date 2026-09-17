# DACH + France Academic-Anchor Research Pack — LUT Doctorate Consortium Bench

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: claude/dach-france-anchors-caemw0 | Date: 15.07.2026 | Changes: Recovery run for the DACH+France academic-anchor pack lost to an unreclaimed container on 2026-07-13 (Recovery Prompt C, `docs/lut/recovery-prompts-lost-research-packs-2026-07.md` §5). Verified and extended the three surviving conclusions, recovered per-anchor contact routes, 2024-2026 publication evidence, engagement routes, and runner-up anchors for DE/AT/CH/FR. Corrected two load-bearing claims that turned out to be stale or imprecise (see §7 of this doc): the FFG Industrienahe Dissertationen company-funding track is exhausted for 2026 and gated on an Austrian establishment Lifetime does not have; the Fraunhofer IAIS/BSI relationship is a strategic-cooperation agreement, not joint catalog authorship. Added the ETH Zurich/Innosuisse elaboration (previously noted, never elaborated) and confirmed Switzerland's Horizon Europe re-association (10 Nov 2025) removes the third-country friction that would otherwise have limited a Swiss anchor's consortium role.

Document Status:

- Created: 15.07.2026
- Last Modified: 15.07.2026
- Language: English
- Languages Available: EN
- Publication Status: DRAFT
- Classification: CONFIDENTIAL — Fundraising/consortium strategy
- Document Type: Academic-anchor research pack

---

## 0. Context

- **Entities:** Lifetime Oy (FI, negative equity → GBER "undertaking in difficulty" until
  the equity cure completes) and Lifetime AB (SE, under 3 years old → GBER-exempt).
- **Product:** DWS IQ / Aegis Defence — EU-sovereign agentic-AI compliance platform.
- **LUT doctorate:** RQ1 formal verification of agentic systems, RQ2 certifiable
  agent-level audit trail + legal pillar, RQ3 industrial scalability.
- **Why anchors matter:** these are candidate partners for the Eurostars Call 11
  consortium (deadline 10 Sep 2026) and future Horizon Europe proposals — partner
  value (can they actually join a consortium, do they have EU-funding experience) is
  scored alongside scientific fit.
- **Verification discipline:** every claim is sourced to an official institute/agency
  page where possible. Where only search-snippet evidence was available (WebFetch was
  blocked on most `.fr`/`.de`/`.at` domains in this research session — a session-level
  tool restriction, not a site-specific block), the claim is marked **(verify)**.

## 1. Germany

### 1.1 Fraunhofer IAIS — AI Assurance and Assessments / "Zertifizierte KI" — **RQ2 anchor**

- **Group / PI:** Dr. Maximilian Poretschkin, head of the new (since 17 Feb 2025)
  **"AI Assurance and Assessments"** department at Fraunhofer IAIS — a full institute
  department built out over his prior six years running the Zertifizierte KI /
  KI.NRW flagship work. Mandate: helping organizations deploy AI per international
  standards/regulation (explicitly including the EU AI Act) and building AI-testing
  business models.
  [Fraunhofer IAIS press release, 17 Feb 2025](https://www.iais.fraunhofer.de/de/presse/presseinformationen/presseinformationen-2025/presseinformation-250217.html) ·
  [Projekt ZERTIFIZIERTE KI](https://www.iais.fraunhofer.de/de/forschung/kuenstliche-intelligenz/ki-zertifizierung.html)
- **Status:** active and expanding, not winding down — a new department was stood up
  around this work in 2025.
- **RQ2 fit:** they authored the German **KI-Prüfkatalog (AI Assessment Catalog)** and
  run a strategic cooperation with **BSI** (Germany's federal cybersecurity agency) to
  develop AI conformity test procedures "made in Germany," with DIN also participating.
  **Correction to the surviving conclusion:** this is a **strategic cooperation
  agreement**, not joint catalog authorship — the catalog itself is Fraunhofer-authored;
  BSI is the cooperation partner on the resulting test procedures. The underlying claim
  (our agent-level audit layer would be novel to them) still holds: their catalog and
  cooperation work targets model/system-level AI assessment, not continuous agent-level
  audit trails. **(verify exact BSI/catalog authorship split — not confirmed on one
  single primary page, corroborated across two secondary sources.)**
- **2024–2026 evidence:**
  - Poretschkin & Schmitz (eds.), _Symposium on Scaling AI Assessments (SAIA 2024)_,
    OASIcs Vol. 126, Dagstuhl, published 27 Jan 2025 — includes "AI Certification:
    Empirical Investigations into Possible Cul-De-Sacs and Ways Forward" and "AI
    Certification: An Accreditation Perspective."
    [DROPS OASIcs vol 126](https://drops.dagstuhl.de/entities/volume/OASIcs-volume-126)
  - Mock, Schmidt, Müller, Görge, Schmitz, Haedecke, Voss, Hecker, Poretschkin,
    _Developing Trustworthy AI Applications with Foundation Models_, arXiv:2405.04937,
    May 2024 (Fraunhofer IAIS / Univ. Bonn).
    [Fraunhofer Publica](https://publica.fraunhofer.de/entities/publication/6ca20d27-c749-4279-be93-3e86f2d37340)
- **Engagement route:** Fraunhofer's standard model is bilateral contract research
  (Auftragsforschung, IP-for-fee) — the natural first entry point for a private
  company; a Horizon Europe/BMWK co-application could follow once a working
  relationship exists. **(verify exact current contract terms directly with the
  department — not published on an official page.)**
- **Instrument unlocked:** bilateral collaboration now; potential Horizon Europe
  Cluster 4 or BMWK co-applicant partner later.
- **Fit score: 9/10** — sharpest RQ2 scientific match found across all four countries,
  active and growing, clear (if informal) entry route.

### 1.2 DE runner-ups

- **TUM — Prof. Jan Křetínský (formal methods for software reliability) and Prof.
  Matthias Althoff (cyber-physical systems / CORA toolbox).** Strongest formal-methods
  extension into neural-network verification found in Germany — direct RQ1 fit.
  Evidence: Azeem, Chakraborty, Kanav, Křetínský, Mohagheghi, Mohr, Weininger, VMCAI
  2025 (arXiv:2410.18294); Bassan, Elboher, Ladner, Şahin, Křetínský, Althoff, Katz,
  _Provably Explaining Neural Additive Models_, ICLR 2026.
  [Group page](https://www7.in.tum.de/~kretinsk/positions.html)
- **CISPA Helmholtz Center — Trustworthy AI flagship, Prof. Mario Fritz.** CISPA's
  Trustworthy AI initiative received a dedicated federal grant and an "Outstanding"
  rating from a June 2025 Helmholtz evaluation panel (Cornell, ETH Zürich, KU Leuven,
  UW, Georgia Tech, UCSD, Northeastern). One of three named grand challenges is
  explicitly **"Robustness guarantees and certification"** — strong RQ1+RQ2 fit. Fritz
  coordinates **ELSA** (European Lighthouse on Secure and Safe AI), an EU excellence
  network — meaning CISPA already sits inside an EU consortium structure, which makes
  it a stronger _partner-value_ anchor than a purely bilateral group.
  [CISPA evaluation](https://cispa.de/en/evaluation) ·
  [ELSA Strategic Research Agenda](https://cispa.de/elsa/ELSASRA.pdf)
  **Fit score: 8/10** — arguably the best _partner-value_ anchor in DE given the ELSA
  network doorway, slightly below Fraunhofer IAIS on direct RQ2 novelty.
- **Fraunhofer AISEC — Cognitive Security Technologies.** Ran the BMWK-funded
  **SENSIBLE-KI** project (2024) on mobile/embedded AI robustness and trustworthiness
  testing — adversarial-robustness testing, not classical formal verification, so a
  weaker RQ1 fit than TUM or CISPA. Named PI not confirmed on an official page
  **(verify)**.
  [SENSIBLE-KI press release](https://www.aisec.fraunhofer.de/en/media/press-releases/2024/sensible-ki-research-project.html)
  **Fit score: 5/10** — weakest of the three DE runner-ups; keep as a tertiary lead.

### 1.3 Germany legal-pillar anchor (RQ2)

No single dedicated "AI Act compliance law" lab was confirmed with an official page.
Best lead: **Max Planck Law**'s cross-institute "Law and AI" impact area, which hosted
an event specifically on _"Compliance Challenges of the EU AI Act."_
[Max Planck Law — Law and AI](https://law.mpg.de/impact/law-and-ai/) ·
[event page](https://law.mpg.de/event/compliance-challenges-of-the-eu-ai-act/)
The closest named research group — the Max Planck Fellow Group on algorithmic
profiling in criminal justice (Prof. Tatjana Hörnle, Prof. Sabine Gless) — is
algorithmic-auditing-adjacent but criminal-justice-focused, not AI Act/regulatory-tech
specific. **(verify)** — do not name a specific PI in a proposal without direct
outreach to Max Planck Law first to identify the right contact.

## 2. Austria

### 2.1 TU Wien — TrustCPS — **RQ1 anchor**

- **Group / PI:** Univ.Prof. Dr. Ezio Bartocci, Full Professor of Formal Methods in
  Cyber-Physical Systems Engineering (since Dec 2020), heads **TrustCPS**
  ("Trustworthy Cyber-Physical Systems") at TU Wien's Institute of Computer
  Engineering. He also chairs the Doctoral College on Trustworthy Autonomous CPS and
  is Vice-Chair of the MSCA-COFUND doctoral programme **LogiCS@TU Wien**.
  [trustcps.eu](https://www.trustcps.eu/) ·
  [TU Wien profile](https://ti.tuwien.ac.at/cps/people/ezio-bartocci/)
- **Status:** active and EU-funded — the group recently secured ~€600k within a €1.2M
  **FREELY** project (per cysec.wien, Dec 2025).
- **RQ1 fit:** core focus is reconciling learning/autonomy/uncertainty with formal
  methods — CPS verification, runtime monitoring, probabilistic reasoning, trustworthy
  AI — a direct match to formal verification of agentic systems.
- **2024–2026 evidence:**
  - _Testing Learning-Enabled Cyber-Physical Systems with Large-Language Models: A
    Formal Approach_, FSE 2024 Companion Proceedings (ACM DL).
  - _Runtime Verification of Learning Properties for Reinforcement Learning
    Algorithms_, arXiv:2311.09811 **(verify Bartocci co-authorship/exact date)**.
  - _Probabilistic Verification of Recurrent Neural Networks for Single and
    Multi-Agent Reinforcement Learning_, arXiv:2605.14758 (2026) **(verify author
    list)**.
- **Contact route:** no personal email confirmed (WebFetch blocked in this session).
  Route via TU Wien Informatics contact page (informatics.tuwien.ac.at/contact/) or
  TU Wien Research & Transfer Support; verify the direct address before first contact.
- **Instrument unlocked:** Eurostars / Horizon Europe consortium partner for the RQ1
  work package — **not** the FFG industrial-PhD route (see correction below).
- **Fit score: 8/10.**

### 2.2 FFG "Industrienahe Dissertationen" — **critical correction to the surviving conclusion**

The surviving note said "pays companies up to €110k for employed doctoral students,
2026 call open" and flagged verifying whether the employer must be Austrian. Both
parts needed correction:

- **Amount confirmed:** max **€110,000 per project** — accurate.
- **"2026 call open" is misleading as stated.** The official FFG page
  (ffg.at/ausschreibung/industrienahe-dissertationen-2026) states the window is
  2025-10-01 to 2026-09-30, rolling submission — **but the company-funding track for
  2026 is already exhausted**: _"Ein Teil der Mittel ist ausgeschöpft: Es können nur
  noch außeruniversitäre Forschungseinrichtungen Anträge einreichen – die
  Fördermittel für Unternehmen sind ausgeschöpft"_ ("Only non-university research
  institutions can still submit applications — funding for companies is exhausted.")
  As of 15.07.2026, **a company cannot currently apply through this call.**
- **The Austrian-entity gate — confirmed and it bites.** Eligibility text: _"Einreichberechtigt
  sind außeruniversitäre Forschungseinrichtungen oder Unternehmen mit
  F&E-Aktivitäten, jeweils mit Niederlassungen in Österreich"_ — a **Niederlassung
  (branch/establishment) in Austria** is required. This is a branch requirement, not
  necessarily full Austrian incorporation, but Lifetime Oy/AB has **no Austrian
  establishment today**, so it does not currently qualify. **(verify)** whether a
  newly-registered Austrian branch alone would satisfy this, or whether FFG also
  expects substantive local R&D activity — unconfirmed on an official page; needs a
  direct FFG helpdesk query before relying on it.
- **Bottom line:** this instrument is **not usable today** on two independent grounds
  (funds exhausted for companies; no Austrian establishment). Do not carry it forward
  in the roadmap as an available near-term instrument. TU Wien/Bartocci remains a
  strong RQ1 anchor — just reached via Eurostars/Horizon consortium partnership, not
  via this doctoral-funding scheme.

### 2.3 AT runner-up: TU Graz — IAIK Trusted AI

- **Group / PI:** Assist.-Prof. Bettina Könighofer, TU Graz Institute of Applied
  Information Processing and Communications (IAIK), Trusted AI group. Uses formal
  methods — model checking, runtime monitoring/enforcement, "shielding" — to verify
  reinforcement-learning and AI systems for safety, robustness, and accountability.
  The "shields" concept (logging/justifying interventions to keep an RL agent within
  provably-correct bounds) is a direct scientific precedent for RQ2's certifiable
  audit-trail concept, not just RQ1.
  [isec.tugraz.at](https://www.isec.tugraz.at/person/bettina-koenighofer/)
- **Funding signal:** won an FWF **ASTRA Award** (~€1M over 5 years) for **SEAL —
  "Shielding for Explainable Correctness of Learned Systems."**
  [Award page](https://www.isec.tugraz.at/fwf-astra-award-for-bettina-koenighofer/)
- **Evidence:** foundational 2018 work introducing "shields" for provably-correct ML
  decisions; **(verify exact 2024–2026 paper titles/venues** — not independently
  confirmed via a scraped publication list in this session).
- **Instrument unlocked:** Horizon Europe / Eurostars RQ1+RQ2 partner.
- **Fit score: 7/10** — the best combined RQ1+RQ2 fit of any single runner-up found,
  held back only by unconfirmed recent-publication detail.

No Austrian legal-pillar anchor for RQ2 was identified in this pass — flagged as a
gap in §7.

## 3. Switzerland (elaborating the previously-unelaborated ETH/Innosuisse angle)

### 3.1 ETH Zurich — SRI Lab — **RQ1 anchor**

- **Group / PI:** Prof. Martin Vechev, SRI Lab (Secure, Reliable, and Intelligent
  Systems Lab). Home of **ERAN** (ETH Robustness Analyzer for Neural Networks), an
  abstract-interpretation-based neural-network verifier, and its successors used
  annually in **VNN-COMP** (International Verification of Neural Networks
  Competition, incl. 2024 and 2025). Runs a **SafeAI** research theme targeting
  certifiable robustness.
  [SRI Lab SafeAI](https://www.sri.inf.ethz.ch/research/safeai) ·
  [safeai.ethz.ch](https://safeai.ethz.ch/)
- **2024–2026 evidence:** _On Optimizing Back-Substitution Methods for Neural Network
  Verification_; _No Soundness in the Real World: On the Challenges of the
  Verification of Deployed Neural Networks_ (2025); VNN-COMP 2024/2025 summary papers
  listing ETH/SRI participation; ERAN user manual (2025).
- **Important caveat:** ERAN/SRI work verifies single neural networks (model-level),
  not agent-orchestration-level behavior — the gap between their state of the art and
  RQ1's agentic-systems target is real and is where the DWS/LUT contribution would
  need to sit, which is also the argument for why this is a genuine research
  partnership rather than a redundant one.
- **Instrument unlocked:** Horizon Europe Cluster 4 consortium partner (see §3.3 on
  why this is now genuinely usable, unlike a stale "Swiss third-country friction"
  assumption would suggest).
- **Fit score: 8/10.**

### 3.2 EPFL runner-up — LIONS Lab

- **Group / PI:** Prof. Volkan Cevher (IEEE Fellow '24, ELLIS Fellow), Laboratory for
  Information and Inference Systems (LIONS) — certified/adversarial robustness in
  deep learning, e.g. _Certified Robustness Under Bounded Levenshtein Distance_
  (ICML AdvML Best Paper 2023) and ongoing work on verifying model robustness.
  [LIONS](https://www.epfl.ch/labs/lions/)
- Secondary EPFL candidate: Prof. Rachid Guerraoui's Distributed Computing Lab — closer
  to RQ2 (trust/audit of distributed/federated learning) than RQ1.
- **Fit score: 6/10.**

### 3.3 Innosuisse — mechanics and the association-status correction

- **National Innovation Projects cannot fund this structure.** Innosuisse's national
  instrument requires a **Swiss-registered implementation partner** whose eligible
  costs exceed the Swiss research partner's — a foreign lead company (Lifetime Oy/AB)
  does not qualify as that implementation partner.
  [Innosuisse — Innovation Projects](https://www.innosuisse.ch/inno/en/home/promotion-of-national-projects/innovation-projects/submit-application.html)
- **International route works differently:** Innosuisse participates in EUREKA /
  Eurostars — Switzerland has run ~450 EUREKA projects since 2008 and ranks 3rd (after
  Germany, Netherlands) in Eurostars SME participation. In a Eurostars consortium,
  Innosuisse funds the Swiss partner directly while Business Finland funds the
  Finnish side — standard EUREKA co-funding, not a blocker.
  [Innosuisse — Eurostars](https://www.innosuisse.ch/inno/en/home/go-global/eurostars.html)
- **Material update — supersedes any prior "Swiss third-country friction" assumption:**
  Switzerland signed the EU-Swiss Programme Participation Agreement on **10 November
  2025**, associating to Horizon Europe and Euratom **retroactively to 1 January
  2025**. Swiss entities now have full access to Horizon Europe on equal terms with
  EU member states, **including the right to lead/coordinate consortia** — reversing
  the 2021–2024 non-associated-third-country status. Cluster 4 (AI, digital, quantum)
  is confirmed accessible for 2026-2027.
  [EC — Switzerland association](https://research-and-innovation.ec.europa.eu/strategy/strategy-research-and-innovation/europe-world/international-cooperation/association-horizon-europe/switzerland_en) ·
  [Council press release, 21 Oct 2025](https://www.consilium.europa.eu/en/press/press-releases/2025/10/21/council-greenlights-switzerland-s-association-to-eu-programmes/)
- **(verify)** whether this Horizon association also extends cleanly to the
  Eurostars-3 co-funded call window for 2026 specifically, versus Innosuisse's
  pre-existing bilateral EUREKA arrangement — confirm with Innosuisse's own call text
  before submission.
- **Verdict:** an ETH or EPFL partner can now join (or help anchor) a Horizon Europe
  work package as a full, directly-funded consortium member. Route funding through
  Horizon Europe or Eurostars/EUREKA co-funding — never through Innosuisse's national
  Innovation Projects instrument, which structurally excludes a foreign lead SME.

## 4. France

### 4.1 The €109B AI Action Summit figure — verified, framing corrected

**Confirmed on a primary source, but the framing in the surviving note needs
tightening.** President Macron announced the figure on French TV on 9 Feb 2025, ahead
of the Paris AI Action Summit (10–11 Feb 2025). The Élysée's own framing
("Faire de la France une puissance de l'IA") describes it as **private-sector
investment commitments in AI infrastructure in France** — not a public grant or
subsidy pool, and not a global/EU summit total. Breakdown: UAE (~€50B, 1GW data-center
campus), Brookfield/Canada (~€20B, Data4/Cambrai data center), Iliad (~€3B+), Mistral
AI (new cluster in Essonne), plus other commitments.
[Élysée — Make France an AI powerhouse](https://www.elysee.fr/en/emmanuel-macron/2025/02/11/make-france-an-ai-powerhouse) ·
[Bloomberg](https://www.bloomberg.com/news/articles/2025-02-09/france-to-announce-109-billion-in-ai-investments-macron-says)

**This has no bearing on DWS/Lifetime's funding options** — it is inbound private
capital, not a grant instrument, and should not be cited as if it were.

### 4.2 Inria — RQ1 and RQ2 fit

- **FRAIME** (Formal Reasoning applied to AI for Methodological Engineering) — new
  (Sept 2025) joint Inria/Mitsubishi Electric project explicitly combining
  formal-methods verification with LLM/AI reliability — direct RQ1 fit and evidence
  that industry-academia formal-verification-of-AI partnerships are an active Inria
  model (relevant precedent for how Lifetime might structure its own).
  [Businesswire](https://www.businesswire.com/news/home/20250917231505/en/Mitsubishi-Electric-and-Inria-Commence-Joint-Technology-Development-to-Ensure-AI-Trustworthiness-Using-Formal-Methods)
- **FMICS** (Formal Methods for Industrial Critical Systems) — long-running Inria
  verification team, active publication record.
  [fmics.inria.fr](https://fmics.inria.fr/)
- **INESIA** (Institut national pour l'évaluation et la sécurité de l'IA), launched
  3 Feb 2025 just before the Summit, federates Inria + ANSSI + LNE + PEReN for AI
  evaluation/security/certification methods — France's answer to the Seoul AI Safety
  Institute network and a strong RQ2 (certifiable-audit) match. A 2026-2027 roadmap
  has been adopted. No named PI/lead surfaced for INESIA itself **(verify)**.
  [Inria — INESIA roadmap](https://www.inria.fr/en/ai-security-and-sovereignty-inesia-unveils-its-roadmap-2026-2027)
- **Instrument unlocked:** Horizon Europe consortium partner (FRAIME/FMICS for RQ1,
  INESIA for RQ2) — not a direct funding door for Lifetime (see §4.3).
- **Fit score: 7/10** (INESIA) / **6/10** (FMICS/FRAIME as RQ1 runner-up) — promising
  but newer and less individually-named than the DE/AT anchors.

### 4.3 PEPR IA — confirmed NOT a funding door for a foreign SME

PEPR IA (Programme et Équipements Prioritaires de Recherche — Intelligence
Artificielle) is a domestic French academic program, co-led by CEA/CNRS/Inria,
operationally run by ANR, €73M over 6 years under France 2030, ~50+ French teams
across 9 targeted projects. Per ANR's financial regulation, only France-established
entities can be funded beneficiaries; a foreign company can hold only unfunded
"Établissement partenaire" status.
[PEPR IA](https://www.pepr-ia.fr/en/pepr/) ·
[ANR règlement financier](https://anr.fr/fr/france-2030/reglement-financier-pepr/)
This **confirms** the surviving conclusion: France is consortium/ecosystem gravity,
not a direct funding door, for a FI/SE company. The real funding door for a foreign
SME to work with French teams runs through Horizon Europe (minimum 3 independent
legal entities across 3 EU/associated states) or EIC Accelerator (solo SME path).

### 4.4 France legal-pillar anchor (RQ2)

**Confirmed match:** the **"Law, Accountability and Social Trust in AI" Chair**, led
by **Céline Castets-Renard** (co-chairs Sylvain Cussat-Blanc, Laurent Risser), housed
at **ANITI** (Toulouse's 3IA institute, Université de Toulouse/CNRS ecosystem) —
publishes on AI law, algorithmic accountability, and comparative AI regulation. This
is the strongest confirmed legal-pillar anchor found across all four countries.
[ANITI chair page](https://aniti.univ-toulouse.fr/en/chaire-celine-castets-renard/)
No dedicated Sciences Po CNRS AI-law chair was confirmed as an alternative
**(verify)** if a Paris-based legal anchor is specifically wanted instead.
**Fit score: 7/10.**

## 5. Top-3 ranked anchors (overall, DACH+France)

Ranking blends scientific fit, consortium partner-value, and engagement feasibility.

| Rank | Anchor                                                           | Country | RQ fit  | Instrument unlocked                            | Fit score |
| ---- | ---------------------------------------------------------------- | ------- | ------- | ---------------------------------------------- | --------- |
| 1    | **Fraunhofer IAIS — AI Assurance and Assessments** (Poretschkin) | DE      | RQ2     | Bilateral now; Horizon/BMWK later              | 9/10      |
| 2    | **CISPA Trustworthy AI flagship / ELSA network** (Fritz)         | DE      | RQ1+RQ2 | Horizon Europe via ELSA network                | 8/10      |
| 3    | **TU Wien TrustCPS** (Bartocci)                                  | AT      | RQ1     | Eurostars/Horizon consortium partner (not FFG) | 8/10      |

**Honorable mentions just below the cut:** ETH Zurich SRI Lab (Vechev, RQ1, 8/10 —
now genuinely usable post-Swiss-reassociation); TU Graz IAIK Trusted AI (Könighofer,
RQ1+RQ2, 7/10 — best single-anchor RQ1+RQ2 combination); ANITI/Castets-Renard (FR,
RQ2 legal pillar, 7/10 — the strongest confirmed legal anchor of any country).

### Draft first-contact angles (NOT sent — draft only, for review)

**1. Fraunhofer IAIS — Dr. Maximilian Poretschkin.** Angle: lead with the department's
own framing — their assessment-catalog work certifies AI systems at a point in time;
DWS IQ's agent-level audit layer extends that into continuous, agent-level evidence
generation for the EU AI Act. Ask for a short scoping call on where bilateral contract
research would sit relative to their current BSI cooperation, not for research
funding.

**2. CISPA — Prof. Mario Fritz (ELSA network).** Angle: DWS IQ as an industrial use
case for ELSA's "robustness guarantees and certification" grand challenge — ask
whether ELSA has an existing mechanism for bringing in an SME use-case partner ahead
of a specific Horizon Europe call, rather than cold-pitching a new proposal.

**3. TU Wien — Prof. Ezio Bartocci (TrustCPS).** Angle: position the LUT doctorate's
RQ1 work (formal verification of agentic systems) as a natural extension of TrustCPS's
existing work on runtime verification of learning-enabled CPS — propose a joint
Eurostars or Horizon Cluster 4 work package rather than the (currently closed) FFG
industrial-PhD route.

Each of these needs a verified contact address before sending (see per-anchor contact
notes above) — none should go out without that.

## 6. Roadmap corrections applied

Per the recovery discipline, `docs/lut/fundraising-roadmap-2026-2027.md` was updated
in the same commit as this file: §0 recovery table row 1 → RECOVERED (points here);
§5 DACH+France bullets corrected to reflect the FFG exhausted-funds/Austrian-entity
gate and the strategic-cooperation (not co-authorship) nuance on Fraunhofer IAIS/BSI;
§7 gap list updated.

## 7. Gaps and unresolved verification items

- **FFG Niederlassung nuance:** whether a newly-registered Austrian branch alone
  (without local R&D activity) would satisfy the FFG eligibility gate — needs a direct
  FFG helpdesk query, not resolvable from official pages alone.
- **Fraunhofer IAIS contract terms:** exact current bilateral-engagement terms for a
  private company — not published; needs direct inquiry.
- **Bartocci and Poretschkin direct contact addresses:** not confirmed via official
  pages in this session (WebFetch was blocked on most target domains); route through
  institutional contact pages until verified.
- **INESIA named lead:** no specific PI/director surfaced for France's new national AI
  evaluation/security institute — worth a follow-up pass once its 2026-2027 roadmap
  execution produces named contacts.
- **Austria legal-pillar anchor (RQ2):** none identified in this pass — a genuine gap,
  parallel to the already-known NO/DK legal-pillar gap in the Nordic pack.
- **Sciences Po AI-law anchor:** not confirmed as existing; ANITI/Castets-Renard
  (Toulouse) is the stronger, confirmed French legal-pillar candidate instead.
- **Eurostars-3 / Innosuisse interaction for the Swiss anchor:** confirm directly with
  Innosuisse whether the Horizon re-association cleanly extends to the 2026 Eurostars
  call mechanics.

---

# PhD Research-Questions Re-Scope — Proposal (copy-paste)

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: claude/finland-public-ai-strategy-t0goqg | Commit: pending | Date: 27.06.2026 | Changes: Proposal to re-scope PHD_FIREHORSE §1.2 research questions back to the repo's actual goals. Copy-paste replacement block. NOT applied to thesis files (RED zone — human applies across all 4 in lockstep).

Document Status:

- Created: 27.06.2026
- Last Modified: 27.06.2026
- Language: English
- Languages Available: English
- Publication Status: DRAFT
- Document Type: Proposal / Read-only edit plan

Related Documents:

- `docs/PHD_FIREHORSE_EN.md` / `_FI.md` (target — RED zone, human-applied)
- `DWS_TRUTH_STANDARD.md` (product/tier taxonomy), `docs/coaching/` (Art. 4 literacy), `bids/ORK160826/` (public-sector field case)

---

## Why re-scope

The current §1.2 has **seven** RQs. Three of them have drifted from anything the repo actually builds:

- **RQ5 Agentic Commerce, RQ6 EU eWallet, RQ7 Transactions** — framed as a speculative "_mahdolliset patentit_" patent track. No corresponding artefacts exist in the repo; they read as forward-looking IP options, not doctoral research grounded in our work.
- **RQ2 (ontologies)** is anchored almost entirely on the **carbon balance sheet** (ETS/CBAM/CSRD). Carbon is now **one vertical**, not the spine — the repo has broadened to public sector, defence, and financial services.

Meanwhile the repo's **actual** current goals are **not represented** as research questions:

- Sovereign **on-prem inference** on owned NVIDIA substrate (DGX Spark; `scripts/serve-qwen36.sh`, `serve-diffusiongemma.sh`; §14.18.5 / §14.20 / §10.10.6.1).
- **Public-sector & regulated-industry sovereign deployment** — the live tender **ORK/1462/2026** (`bids/ORK160826/`), the Finnish public-administration AI strategy, Aegis Defence (`bids/NOKIADEFENCE/`), financial services (OP).
- **Multi-agent behavioural alignment** / reasoning–behaviour gap (EAB/ASB; §14.19) — present in the body but not an RQ.
- **AI literacy as the adoption + oversight mechanism** (EU AI Act Art. 4; `docs/coaching/`, Bid Excellence, the 12 rules, GREEN/YELLOW/RED trust boundary).

**Proposal:** keep RQ1/RQ3/RQ4(old) as the standards spine; replace the carbon-only and patent-track items with four repo-grounded RQs; demote Agentic Commerce / eWallet / Transactions to an explicit _optional patent track, out of core scope_.

---

## COPY-PASTE — replacement for §1.2 (EN)

> Paste over the current §1.2 numbered list. Keep §1.2's intro paragraph and the
> "Question 1 is the connecting thread" sentence; swap the seven items for these.

1. **Sovereignty — the connecting research thread** — How does a three-pillar sovereignty model (Data, Technology, Operational) combined with a three-jurisdiction emphasis profile (EU, US, Singapore) provide the integrative frame for the remaining questions? In what sense is sovereignty the **binding constraint** that gives the substrate, the KYA standard, the standardization track, public-sector deployment, and the human-capability layer their shared regulatory and technical surface? How does the post-quantum cryptographic transition (HNDL, NIST FIPS 203/204/205, CNSA 2.0, ENISA / IMDA roadmaps) re-price each over the 3–7 year horizon? — See §14.23.

2. **Sovereign substrate and the economics of owned-vs-metered inference** — Under what regulatory and unit-economic conditions does running frontier-class agentic inference on **owned, EU-resident substrate** (on-prem NVIDIA / DGX-class hardware, sub-250 W) become both compliance-necessary and margin-positive relative to token-metered cloud inference under CLOUD Act exposure? How does the choice of substrate determine which sovereignty pillars (SIB/CSB/EAB) an enterprise can actually evidence? — See §14.18.5, §14.20, §10.10.6.1.

3. **Know Your Agent (KYA) standard** — How should a general-purpose identity, trust, and governance standard for agentic AI be designed to satisfy EU AI Act Articles 9 (risk), 12 (logging), and 14 (oversight) while remaining adoptable by open-standards bodies (Agentic AI Foundation, Linux Foundation)? How does its four-track ASB/EAB/CSB/SIB suite operationalise the sovereignty pillars as a testable conformance triple? — See §14.14, §14.23.4.

4. **Multi-agent behavioural alignment and the reasoning–behaviour gap** — How can alignment of agent _populations_ under shared-environment incentive pressure be evaluated at the **behavioural** rather than declarative level (EAB/ASB criteria), and how does a KYA-bound termination capability ("leash snap") function as the population-scope alignment chokepoint that EU AI Act Article 12 logging can render evidentiary rather than merely descriptive? — See §14.19.

5. **Standardization pathway (Agentic AI Foundation / NIST / EU)** — What pathway (open specification + reference implementation + multi-body adoption) lets KYA become a foundational interoperability standard that EU regulatory obligations and US NIST voluntary frameworks can both reference without conflict, across the EU / US / Singapore jurisdictional frame? — See §14.23.

6. **Sovereign agentic AI in the public sector and regulated industries** — How is a sovereign, on-prem, EU AI Act-conformant agentic stack adopted in public administration and regulated sectors, and what governance, procurement (NIS2, sovereign procurement, citizens' legal-protection and linguistic rights), and risk-classification constraints shape it? Using the **ORK/1462/2026** tender and the Finnish public-administration AI strategy as field cases, is the targeted **public-sector productivity gain (e.g. +20 % by 2031)** a falsifiable, measurable claim? — See `bids/ORK160826/`, §14.17.

7. **AI literacy as the adoption and oversight mechanism** — How does workforce AI literacy (EU AI Act Article 4) function as the precondition for safe delegation of autonomy and for **architectural** (rather than transactional) human oversight (Article 14)? Is literacy a measurable governance control, and does a disciplined plan→review→ship workflow with a GREEN/YELLOW/RED trust boundary convert it into auditable evidence? — See `docs/coaching/`, §14.24.

**Optional patent track (out of core scope).** Agentic Commerce, the EU Digital Identity Wallet (eIDAS 2.0) agent-side counterpart, and minimal agentic transaction primitives remain **candidate IP topics** for Lifetime Oy IP counsel to scope opportunistically (former RQ5–RQ7). They are explicitly **not** core doctoral research questions until repo artefacts exist; retain only as a one-paragraph IPR-optionality note and in the §1.6 supervisor letter.

---

## COPY-PASTE — FI mirror (RQ headlines for lockstep)

1. **Suvereniteetti — yhdistävä tutkimusjuonne**
2. **Suvereeni laskenta-alusta ja oman vs. mitatun päättelyn taloustiede**
3. **Know Your Agent (KYA) -standardi**
4. **Moniagenttijärjestelmien käyttäytymisperustainen linjaus ja päättely–käyttäytyminen-kuilu**
5. **Standardointipolku (Agentic AI Foundation / NIST / EU)**
6. **Suvereeni agenttipohjainen tekoäly julkisella sektorilla ja säännellyillä toimialoilla**
7. **Tekoälylukutaito käyttöönoton ja valvonnan mekanismina**

> Optionaalinen patenttilinja (ydinrajauksen ulkopuolella): Agentic Commerce, EU eWallet, Transaktiot.

---

## How to apply (thesis = RED zone)

1. Apply the EN block to `docs/PHD_FIREHORSE_EN.md` §1.2 and the FI mirror to `docs/PHD_FIREHORSE_FI.md` §1.2.
2. Per CLAUDE.md Thesis Rule, bump **all four** thesis files in lockstep (`PHD_FIREHORSE_EN/FI`, `V3Thesis_EN/FI`) — though for the master's V3Thesis files this is a lockstep version-bump only (PhD-scope change per §1.4 master-vs-PhD rule).
3. Update the §1.2 intro count "seven" if the optional track is removed from the list, and reconcile the §1.6 supervisor letter.
4. Regenerate `Learn/` HTML (`scripts/gen-thesis-html.cjs`, needs Pandoc) and re-run `scripts/weekly/coach-learn-curate.sh`.

---

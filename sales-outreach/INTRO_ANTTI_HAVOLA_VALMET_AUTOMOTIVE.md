# INTRO_ANTTI_HAVOLA_VALMET_AUTOMOTIVE

```
<!--
VERSION AND AGENT HISTORY
Document: INTRO_ANTTI_HAVOLA_VALMET_AUTOMOTIVE.md
Version: 1.0
Last-Updated: 2026-06-21
Author: Risto Anton Päärni (Lifetime Oy)
Agent: Claude Code (claude-opus-4-8)
Purpose: Outreach plan for Antti Havola, VP Defense Business at Valmet
         Automotive — trigger event: the Valmet Automotive–Patria 6x6
         collaboration announced at Eurosatory (Paris, ~2026-06-18), a
         multi-year deal to manufacture Patria's 6x6 armored vehicles at
         the Uusikaupunki plant and scale to hundreds of units/year.
         Wedge: every AI tool that touches a defense production line is
         either EU-sovereign and KYA-governed, or it is an export-control
         and US Cloud Act exposure surface on a defense program. DWS IQ
         keeps the ramp's production intelligence EU-sovereign and
         audit-ready — and the same stack removes operational friction
         from a zero-to-hundreds scale-up.
Introduced-In: PR-pending (branch claude/patria-valmet-outreach-xrhsv3)
Code-Version: 1.0
Branch: claude/patria-valmet-outreach-xrhsv3
Date: 2026-06-21
Owner: risto.paarni@lifetime.fi
-->
```

## Who

| Field            | Value                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Name             | Antti Havola                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Role             | VP, Defense Business (Valmet Automotive) — confirmed via LinkedIn/public profile. Based in Turku. Background: MSc Information Systems (Univ. of Turku); prior roles at Orkla Suomi, Felix Abba.                                                                                                                                                                                                                                                                                       |
| Org              | Valmet Automotive Oy (contract vehicle manufacturer; Uusikaupunki plant) — building Patria's 6×6 armored vehicles under the multi-year collaboration announced at Eurosatory 2026                                                                                                                                                                                                                                                                                                     |
| Counterparty     | Patria Oyj (OEM / IP owner of the 6×6 platform; majority Finnish-state-owned)                                                                                                                                                                                                                                                                                                                                                                                                         |
| Geography        | Finland — Valmet Automotive Uusikaupunki plant (SW Finland); Antti is based in Turku (~70 km from Uusikaupunki, ~1.5 h from Espoo). We are Espoo (Lifetime Oy). Patria HQ Helsinki/Tampere. _Default to "come to you in Turku / Uusikaupunki" once a call lands._                                                                                                                                                                                                                     |
| Buying centre    | Defense Business line — adjacent to plant operations, quality, IT/security, and supply-chain functions standing up the new line                                                                                                                                                                                                                                                                                                                                                       |
| Why this persona | Antti **just publicly committed** Valmet Automotive to scaling a defense production line from zero to hundreds of armored vehicles/year, under the banner of _"strengthening security of supply in Finland and across Europe."_ That is the exact problem DWS solves: the AI and data layer that runs a defense ramp must be EU-sovereign and attributable, or it undermines the very security-of-supply claim the program exists to make. He owns the P&L with skin in that outcome. |
| Strategic value  | A defense-line ramp is a multi-year, repeatable motion. A VP-Defense-sponsored pilot survives org changes, extends from Valmet Automotive into the Patria OEM relationship (door #2), and is a reference no US-cloud vendor can match in a sovereignty-graded defense procurement.                                                                                                                                                                                                    |

## The wedge — "Sovereign AI is a security-of-supply requirement, not a vendor choice"

The Eurosatory announcement framed the Patria collaboration as _strengthening security of supply in Finland and across Europe._ Hold that frame to its conclusion:

A modern vehicle line does not scale to hundreds of units/year on spreadsheets. It scales on AI-assisted production planning, supplier-readiness analysis, quality-gate inspection, documentation generation, and ramp forecasting. Every one of those touchpoints consumes the most sensitive data the program produces — vehicle specifications, BOMs, supplier identities, production schedules, defect data, throughput.

For a **commercial** car line, where that AI runs is a procurement footnote. For a **defense** line, it is the program's exposure surface:

1. **US Cloud Act / extraterritorial exposure.** Any AI tool in the production loop that touches US-hosted cloud or a US-owned model is, by construction, a foreign-jurisdiction reach into defense production data. "Security of supply across Europe" and "our production AI runs on US cloud" cannot both be true in front of a defense customer's security audit.
2. **Export-control and traceability exposure.** Defense vehicle data is export-controlled (EU dual-use / national defense regimes). An AI action that moves, summarizes, or generates documentation from that data with no attributable, cleared human behind it is an unbounded control gap — exactly the thing an end-user certificate and a customer audit will probe.
3. **NIS2 + supply-chain security.** Defense-adjacent manufacturing is squarely in NIS2 scope, and prime contractors push supply-chain security obligations down to the line that builds the platform. A KYA-governed, EU-sovereign stack answers the supplier security questionnaire with one URL instead of a remediation project.

Today, the default AI tools entering a new line are US-cloud SaaS and shadow copilots. That default is the wedge: it is silently incompatible with the security-of-supply promise the program was announced under.

## Product truth (the line behind the line)

> **DWS Intelligence is the product. We amplify human intelligence in regulated industries.**

Removing operational friction from the ramp is the entry point — how we get into the workflow. Amplifying the intelligence of every person standing up and running the line (Defense Business, Plant Ops, Quality, Supply Chain, IT, Security, Program/Commercial, Finance) is what we are actually doing. Friction removal is one-shot. Intelligence compounds. The compounding curve is the moat — for the program, and for us.

## Headline (the Boardy-validated buyer-facing line)

> **DWS helps Valmet Automotive scale the Patria 6×6 line at Uusikaupunki without compromising security of supply — using KYA-governed agent identity and sovereign NVIDIA infra to keep defense production intelligence EU-sovereign and audit-ready, while taking operational friction out of the ramp.**

One line. One mechanic (KYA-governed agent identity + sovereign NVIDIA). Two outcomes (ramp faster + security of supply provable). 24/7 EU support is the footer in the signoff, not part of the headline. The product-truth line above sits behind it; lead with whichever fits the meeting (buyer-facing = Boardy line; board / strategic / national-security = product truth).

## Wedge by role — same headline, every role wins

The headline lands differently per reader. Tailor the emphasis; never change the line. Read the matrix diagonally: each role's "what you win" lights up someone else's "win you create." Rows are ordered by buying-journey stage (per `DWS_ROLES_REGISTRY.md` §2). Roles tagged by R-ID where the canonical registry applies; the defense-business-line owner (Antti) has no clean R-ID and is named directly per the registry's deferred-R26 note.

### Strategic sponsors — open the door

| Role                                          | What you win                                                                                                                                                                                                                                                                                 | Win you create for the rest of the company                                                                                                                                                                                |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **VP Defense Business (Antti, door #1)**      | The AI/data layer of your ramp is provably EU-sovereign and attributable — so "security of supply across Europe" survives the customer's security audit instead of being undercut by it. A defensible answer to "where does your production AI run?" before Patria or the end customer asks. | Plant Ops gets a faster, governed ramp. Quality gets audit-grade traceability. IT/Security stops fighting shadow copilots. Program/Commercial gets a sovereignty story to put in front of the prime and the end customer. |
| **CTO / Head of Production Technology (R04)** | New-line tooling consolidated on one EU-sovereign stack (Jetson edge / DGX Spark / EU cloud) instead of a sprawl of US-cloud point tools each adding an exposure surface. AI capability without importing foreign-jurisdiction risk into the line.                                           | Security's "no US perimeter" claim becomes technically true, not aspirational. Ops gets one connector, not five. Defense Business gets a clean architecture to certify.                                                   |
| **General Counsel / Head of Legal (R05/R06)** | Export-control and EU AI Act posture aligned by construction: Article 12-style audit log, KYA cryptographic operator identity, no US discovery surface on defense production data.                                                                                                           | Defense Business gets a program that passes audit. Security/IT inherit an audit-ready stack. The prime-contractor flow-down obligations have a documented answer.                                                         |

### Operational owners — run the workflow

| Role                                                    | What you win                                                                                                                                                                                                                                                                | Win you create for the rest of the company                                                                                                                       |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Plant / Operations Director, Uusikaupunki (R11/R12)** | Zero-to-hundreds ramp intelligence on one governed pipeline: production planning, supplier-readiness, throughput forecasting from your own line data — with data-quality issues surfaced at the source. Operations stops being the manual coordination desk for a new line. | Defense Business gets a ramp that hits rate. Quality gets clean upstream data. Finance sees rework and ramp-risk cost fall.                                      |
| **Head of Quality (R09/R10)**                           | AI-assisted inspection and documentation generation where every machine-made call is signed by a cleared, human-bound identity — defect data and conformity records become an audit trail, not a liability.                                                                 | Ops gets faster gates. Legal gets traceable conformity evidence for an export-controlled platform. The prime's quality audit has a one-document answer.          |
| **Head of Supply Chain / Procurement (R20/R21)**        | Continuous supplier-readiness and supplier-security scoring for the new line; the same KYA-governed logic points _upstream_ to govern what supplier data enters and what production data leaves.                                                                            | Ops gets supplier risk early. Security gets supply-chain attack-surface visibility. Defense Business gets security-of-supply as a measured number, not a slogan. |

### Tech approvers — clear the stack

| Role                                 | What you win                                                                                                                                                                                                                                                          | Win you create for the rest of the company                                                                                                                                                                            |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **CIO / Head of IT (R13/R14)**       | Vendor consolidation: one EU-sovereign stack replaces the US-cloud SaaS + shadow-copilot sprawl arriving with the new line. NVIDIA Connect ISV running inside your perimeter (Jetson / DGX Spark / EU cloud). EU AI Act Article 16 inventory built in.                | Security stops chasing shadow AI through procurement. Ops gets one integration. Legal gets a defensible evidence chain. Finance sees licence sprawl shrink.                                                           |
| **CISO / Head of InfoSec (R15/R16)** | NIS2 obligations met cleanly for a defense-adjacent production system. KYA cryptographic operator identity for every AI-mediated action on the line. No US Cloud Act / discovery surface on defense production data. EU-sovereign by construction, not configuration. | CIO's stack stops adding attack surface. Defense Business's "security of supply" claim is technically backed. Supply Chain gets supplier-security scoring. The customer security questionnaire gets a one-URL answer. |

### Commercial drivers — prove the value

| Role                                    | What you win                                                                                                                                                                                                                | Win you create for the rest of the company                                                                                                                                                     |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Program / Commercial Lead (R17/R18)** | A sovereignty-graded answer to every "where does your AI run / who governs agent actions" line item in the prime's and end customer's security and procurement screens — answered with one URL, at the speed the bid needs. | Defense Business stops carrying the sovereignty objection personally. Security/IT stop being the bid bottleneck. The program wins on the exact axis Finnish/EU defense procurement now grades. |
| **CRO / Head of Commercial (R19)**      | The sovereign-AI posture becomes a differentiator in future EU defense work, not a cost — win-rate where buyers demand sovereign-AI attestation from the production partner.                                                | Defense Business gets repeatable pipeline. CIO's consolidation gets a revenue story attached. Finance sees the sovereignty investment turn into bid leverage.                                  |

### Executive sponsors — sign the deal

| Role                             | What you win                                                                                                                                                                                                                                    | Win you create for the rest of the company                                                                                                           |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **CEO / CFO (R22/R23)**          | Three lines move: **risk** (foreign-jurisdiction exposure on a defense program closed), **rate** (ramp friction removed), **moat** (a sovereign-AI reference no US-cloud competitor can match). One stack, three outcomes, one EU jurisdiction. | The whole organisation pulls one rope. The board narrative on "how do we run a defense line responsibly at scale" gets a clean, defensible answer.   |
| **Board / Owner representation** | A documented, audit-ready answer to the governance question a state-adjacent defense program will be asked: is the AI running our defense production sovereign and accountable?                                                                 | CEO/CFO get top-down mandate. Legal/Security get explicit sponsorship. The security-of-supply mission has technical substance behind the press line. |

## DWS Intelligence sharpens each role (the compounding moat)

Removing ramp friction is the entry point. **DWS Intelligence is the main product** — situational awareness for every person on the line, carried forward over time. Friction removal is one-shot; intelligence compounds. The internal pitch: _"easier today, sharper every quarter."_

| Role                            | How DWS Intelligence sharpens you                                                                                                                                          |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **VP Defense Business (Antti)** | Live EU defense-procurement and sovereignty-requirement radar tied to the platforms you build — see the sovereignty/security clauses tightening before the next RFQ lands. |
| **CTO / Production Technology** | Sovereign-stack and EU AI Act inventory drift map across regulated manufacturing — where peers are consolidating before your next tooling decision.                        |
| **Plant / Operations Director** | Cross-shift ramp analytics: which data-quality and process fixes move rate the most per unit of effort, with disclosure-grade provenance.                                  |
| **Head of Quality**             | Defect-pattern memory and conformity-evidence drift on an export-controlled platform — institutional memory of "what the audit asked last time."                           |
| **Head of Supply Chain**        | Continuous supplier-readiness and supplier-security scoring, supply-chain heat maps, supplier-swap leverage — security of supply as a live number.                         |
| **CIO / Head of IT**            | Peer-EU sovereign-stack map and AI-inventory drift; where peer CIOs consolidate before procurement reopens.                                                                |
| **CISO / Head of InfoSec**      | Continuous AI-attack-surface awareness, NIS2 enforcement signal, AI-mediated-action threat patterns. Every agent action signed; every signature monitored.                 |
| **Program / Commercial Lead**   | Win/loss memory on which sovereignty framing cleared which security screen — every bid is training data for the next.                                                      |
| **CEO / CFO / Board**           | Portfolio risk/rate/moat view by program, with the EU defense-sovereignty pipeline 18–24 months out as ground truth for where to invest next.                              |

**Intelligence sourcing (defuses "where does the data come from"):** public EU regulatory and defense-policy pipeline (EUR-Lex, EDA/EDF signals, NIS2 guidance, EU AI Act), peer benchmarking on _publicly available_ information only, and Valmet Automotive's own deployment of DWS IQ. No customer or program data is shared across manufacturers. KYA-attested provenance on every intelligence item.

## How the mechanic delivers both outcomes

| Mechanic                                                   | "Scale the ramp" path                                                                                                                 | "Security of supply provable" path                                                                                                                      |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **KYA-governed agent identity**                            | AI assists production planning, quality docs, and supplier analysis — fast — with a cleared human bound to every machine-made action. | Every AI action on defense data is attributable to a verified human, with an Article 12-style audit log. Export-control gaps close at the action layer. |
| **Sovereign NVIDIA infra (Jetson / DGX Spark / EU cloud)** | EU OEMs and primes increasingly demand sovereign-AI attestation from production partners. Answered with one URL.                      | No US Cloud Act perimeter on defense production data. Data never trains a foreign model. EU AI Act aligned, EU jurisdiction by construction.            |

24/7 Lifetime EU-staffed support is the operational footer that makes this defensible at 11 PM before a line audit. It is not a headline axis.

## Why now (timing wedge)

- **The announcement is the trigger.** The Eurosatory commitment is days old (announced Mon ~2026-06-15/16). The line is being designed and tooled _now_ — the moment the AI/data architecture is decided. Sovereignty designed in is cheap; sovereignty retrofitted after a US-cloud copilot is already in the loop is expensive.
- **Full capacity targeted for early 2027.** This is not a distant roadmap — the ramp to hundreds/year is ~6–9 months out. The window to set the AI/data architecture sovereign-by-default is the next two quarters, not next year. (The Dec 2025 agreement already covered tech transfer + first vehicles; this is the scale-up.)
- **Security-of-supply framing is Antti's own words.** The wedge is not us reframing his program — it is holding his stated mission to its technical conclusion.
- **EU defense + sovereignty momentum.** EDF/EDIP and national security-of-supply policy are pushing sovereign and accountable digital infrastructure into defense supply chains. The sovereignty bar on the next RFQ will be higher than on this one.
- **EU AI Act + NIS2 bite through 2026.** Sovereign-stack provenance and attributable agent actions move from nice-to-have to audit-grade requirements for a defense-adjacent line.

## Two doors into the collaboration (Antti is door #1)

1. **Valmet Automotive — VP Defense Business (Antti):** Owns the line being built and the security-of-supply claim. Door we are opening — fresh public trigger, clearest P&L skin in the outcome.
2. **Patria — OEM / program & security function:** Owns the platform IP and the end-customer certification. Natural door #2 once Valmet Automotive has sponsored: the same sovereign/KYA layer governs the OEM↔manufacturer data exchange across the collaboration.

We open at door #1 because Valmet Automotive's defense line is the function with the strongest _and most immediate_ reason to want a sovereign, governed AI layer — and Antti just made that reason public.

## Thread

### 1. LinkedIn message — drafted, not yet sent

> Hei Antti,
>
> Risto Päärni, Lifetime Oy (Espoo). Saw the Valmet Automotive–Patria 6×6 announcement from Eurosatory — congratulations. One line on why I'm writing: **DWS helps you scale the Uusikaupunki line without compromising security of supply — keeping the production AI/data layer EU-sovereign and attributable, while taking friction out of the ramp.** Concretely: every AI tool entering a new defense line is either EU-sovereign and KYA-governed, or it's a US Cloud Act and export-control exposure surface on a defense program. We make sure it's the first.
>
> Worth 20 minutes? Happy to come to Uusikaupunki.
>
> — Risto

Status: drafted, awaiting send.

### 2. Cold email — see `LETTER_ANTTI_HAVOLA_VALMET_AUTOMOTIVE.md`

Send if the LinkedIn message is not accepted within 5 business days, or in parallel via the Valmet Automotive corporate/defense contact route if a direct address is verified.

### 3. Follow-up variant — "the audit question" (after first reply, before first call)

> Antti, one concrete question. As the Uusikaupunki line is tooled, the production-planning, quality, and supplier-analysis AI is being chosen now. When Patria's or the end customer's security audit asks "where does that AI run, and who is accountable for each automated action on defense data?" — is there a one-line answer today? That's the 20 minutes I'm asking for: I'll show what that answer looks like when the stack is EU-sovereign and KYA-governed from day one.

Status: drafted, hold for after first reply.

### 4. Escalation variant — "two-party motion" (after first call, if pilot interest)

Bring in:

- **Valmet Automotive Plant/Ops + Quality lead (Uusikaupunki)** — co-sponsor, owns the ramp and the conformity evidence.
- **Valmet Automotive CISO / Head of IT** — clears the stack, owns NIS2 + supplier-security flow-down.
- **DWS IQ KYA + sovereign-infra demo** on one anonymized line workflow — an AI-assisted quality/document step generated with a signed, human-bound KYA identity and an Article 12-style audit entry, running on EU-sovereign infra, in < a few minutes.
- Later: extend to **Patria** (door #2) for the OEM↔manufacturer data-exchange layer.

## Valmet/Patria-specific intel feeding the pitch

| Fact (source: Eurosatory announcement / public)                                                                             | Use in conversation                                                                                                               |
| --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Multi-year deal to build Patria's **6×6 armored vehicles** at **Uusikaupunki**, scaling to **hundreds of units/year**       | Anchor the ramp-intelligence claim: this is a real zero-to-rate scale-up, not a pilot.                                            |
| Framed as **"strengthening security of supply in Finland and across Europe"**                                               | The wedge is Antti's own mission, held to its technical conclusion.                                                               |
| Valmet Automotive is a **contract manufacturer** taking on a defense platform it does not own                               | The OEM↔manufacturer data exchange (with Patria) is itself a sovereignty/governance surface — door #2 hook.                       |
| Patria is **majority Finnish-state-owned**; this is a state-adjacent defense program                                        | Sovereignty and accountability are board- and owner-level governance questions, not just IT. Strengthens the exec/board row.      |
| Valmet Automotive Uusikaupunki (SW Finland); Lifetime Oy Espoo (Laidunmaanraitti 2 A 25)                                    | Finnish-to-Finnish, same jurisdiction. Default to "come to your site."                                                            |
| Lifetime Oy is a Finnish company (business ID 0772407-9)                                                                    | Same-jurisdiction supplier — itself part of the security-of-supply answer.                                                        |
| **Full capacity targeted early 2027**; Dec 2025 agreement covered tech transfer + first vehicles, this deal is the scale-up | The architecture-decision window is the next two quarters. Strongest "why now" lever — use it in the opener.                      |
| Counterparty is **Patria Land** (the land-systems entity within Patria Group)                                               | Name the right Patria entity for the door-#2 motion; the OEM↔manufacturer data layer sits between Valmet and Patria Land.         |
| ~**240 jobs per 100 vehicles** incl. the Finnish subcontractor network                                                      | The supplier network is large and security-of-supply is a multi-tier problem — sharpens the Supply Chain / supplier-security row. |

## Why DWS IQ specifically (vs. generic AI/MES copilots)

Generic manufacturing-AI and copilot tools (US-cloud MES add-ons, hyperscaler copilots, point inspection-AI vendors) solve **a task**. They do not solve **sovereign accountability of the AI layer on a defense line**. They run on US clouds. They have no sovereign-NVIDIA story and no cryptographic, human-bound agent-identity layer. DWS IQ is the only stack we are aware of that:

- Runs on EU-sovereign NVIDIA hw + EU-hosted models (no US Cloud Act perimeter)
- Carries KYA (Know Your Agent) trust-scored, human-bound agent identities — auditable action chain on export-controlled data
- Ships with 24/7 Lifetime support staffed in EU (no offshore Tier-1 touching defense data)
- Is built by a Finnish company (Lifetime Oy, business ID 0772407-9) — same jurisdiction as Valmet Automotive and Patria

## Next actions

- [x] Verified Antti Havola's title (VP, Defense Business; based in Turku) via public profile. Preferred contact route: LinkedIn first; Valmet Automotive defense/corporate route as fallback.
- [ ] Send LinkedIn message (text above) — target send date 2026-06-22.
- [ ] If no reply within 5 business days, send `LETTER_ANTTI_HAVOLA_VALMET_AUTOMOTIVE.md` via direct email (sender: risto.paarni@lifetime.fi, transport: Amazon SES SMTP).
- [x] Anonymized "Sovereign AI for Defense-Adjacent Manufacturing" sector-pattern one-pager built at `dws10.com/sovereign-defense-manufacturing/` (mirrored to `landing-pages/dws10-com/sovereign-defense-manufacturing/`). Valmet Automotive and Patria are **not** named; sector-pattern framing only. Live once dws10.com next deploys.
- [ ] On first reply, attach (a) the sector-pattern URL (`https://dws10.com/sovereign-defense-manufacturing/`) and (b) Lifetime Oy corporate identity (business ID, VAT, CEO contact) — Finnish-to-Finnish trust signal.
- [ ] After first call, escalate per variant #4 to a two-party motion (Plant/Ops + Quality + CISO), then map the Patria door #2.

## Related files

- `sales-outreach/LETTER_ANTTI_HAVOLA_VALMET_AUTOMOTIVE.md` — cold email draft.
- `sales-outreach/INTRO_ARI_HIRVONEN_OUTOKUMPU.md` — reference precedent for the INTRO/wedge-matrix pattern.
- `DWS_ROLES_REGISTRY.md` — canonical 25-role taxonomy + 5 buying-journey stages used in the wedge matrix.
- `DWS_SECURITY_STANDARD.md` — sovereignty / NIS2 / EU AI Act / KYA posture underpinning the wedge.
- `AGENTS.md` — KYA / Aegis / sovereign-infra agent inventory referenced in the wedge.

# INTRO_WARTSILA

```
<!--
VERSION AND AGENT HISTORY
Document: INTRO_WARTSILA.md
Version: 1.0
Last-Updated: 2026-07-07
Author: Risto Anton Päärni (Lifetime Oy)
Agent: Claude Code (Fable 5), Session: claude/wartsila-sales-outreach-510xx4
Purpose: Outreach plan for Wärtsilä Oyj Abp. Wedge: every Wärtsilä
         decarbonisation sale now carries a compliance-evidence ask from the
         buyer (FuelEU Maritime pooling, EU MRV, ETS Maritime at 100% from
         2026) — DWS IQ attaches signed, verifier-ready compliance evidence
         to the equipment/service sale, and runs Wärtsilä's own
         CSRD/ETS/CBAM pipeline on the same EU-sovereign platform.
         HARD BOUNDARY: no Aiven reference in any Wärtsilä-facing material
         until (a) the Aiven consulting-partner terms are agreed and
         (b) a public Wärtsilä-on-Aiven source URL exists
         (Partners/outreach/2026-04-18-aiven.md §10 usage boundary).
Introduced-In: PR-pending (branch claude/wartsila-sales-outreach-510xx4)
Code-Version: 1.0
Branch: claude/wartsila-sales-outreach-510xx4
Date: 2026-07-07
Owner: risto.paarni@lifetime.fi
-->
```

## Who

| Field                        | Value                                                                                                                                                                                                                                                                                                                         |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Org                          | Wärtsilä Oyj Abp — marine & energy engineering, HQ Helsinki. FY2025: net sales €6.9B, all-time-high order intake / operating result / cash flow (comparable operating result €829M, 12.0%); ~17,900 employees, 199 locations, 78 countries. President & CEO Håkan Agnevall.                                                   |
| Segments                     | Marine, Energy — Energy being split into **Energy** and **Energy Storage** reporting segments (announced with new financial targets; verify effective date before citing).                                                                                                                                                    |
| Geography                    | Finland — HQ Helsinki. We are Espoo. Same home market, same regulator, same language.                                                                                                                                                                                                                                         |
| Named contacts               | None yet — this is an org-level INTRO. Door candidates in §"Doors" below; OSINT pass for named individuals is next-action #1.                                                                                                                                                                                                 |
| CSRD posture                 | Early adopter: sustainability statement per CSRD/ESRS **since FY2024**, published inside the Report of the Board of Directors. Clearly in post-Omnibus mandatory scope (>1,000 employees AND >€450M turnover).                                                                                                                |
| Org signal (the timing door) | **2026-01-01: sustainability function moved under EVP Legal & Compliance Nora Steiner-Forsberg** after EVP Public Affairs & Sustainability Kari Hietanen retired (announced 2025-09-09). Sustainability at Wärtsilä is now formally a legal-governance function. Marko Vainikka is VP Corporate Relations and Sustainability. |
| Prior thread                 | None direct. Wärtsilä named in thesis market framing (`docs/metropolia/master-thesis/en/V3Thesis_EN.md` §Manufacturing: "Kone, Wartsila, ABB, Valmet (ETS + CBAM)"). Stack compatibility researched 2026-07-06: `docs/field-notes/2026-07-06-wartsila-stack-aiven-dws-compatibility.md`.                                      |

## Why Wärtsilä, why now

Wärtsilä is the DWS prime ICP (Finnish industrial, marine/energy, CSRD/ETS/CBAM-exposed) — ranked **priority 1** on the 2026-07-06 industrial-target screen (`Partners/outreach/2026-04-18-aiven.md` §10). Three regulatory clocks converge on them in 2026:

1. **ETS Maritime at 100%.** The phase-in ends: from 2026, shipping companies surrender allowances for 100% of verified emissions. Wärtsilä doesn't pay the ETS bill — **its customers do**, and that bill is now the strongest commercial argument for every Wärtsilä efficiency retrofit, dual-fuel engine, and decarbonisation service.
2. **FuelEU Maritime is live (since 2025-01-01)** — GHG-intensity limits on energy used on board, with pooling, banking, and borrowing mechanics that are pure compliance accounting. Every FuelEU pooling decision a shipowner makes is an evidence problem.
3. **CSRD/ESRS + CBAM on their own house.** Wärtsilä already files CSRD (since FY2024, ahead of the mandatory FY2027 wave for most); CBAM definitive period (from 2026-01-01) touches their steel/aluminium input chain (verify exposure detail before using in copy).

And one **organisational clock**: as of 2026-01-01 sustainability reports into Legal & Compliance. When compliance evidence becomes a Legal deliverable, the buying criteria shift from "nice dashboards" to exactly what DWS sells: **signed, auditable, EU-sovereign disclosure logic** (KYA operator identity, Article 12 audit log, no US Cloud Act perimeter). The doctrine shift — voluntary ESG → mandatory sovereign infrastructure — just happened _inside Wärtsilä's org chart_.

## The wedge — "Your decarbonisation deals close on compliance evidence"

Wärtsilä sells decarbonisation hardware and services; FY2025 was an all-time-high year on that story. But the thing that closes those deals in 2026 is no longer the fuel-consumption curve — it is the buyer's compliance case:

- A shipowner evaluating an engine retrofit is really buying **ETS allowances avoided and FuelEU penalty exposure removed** — and must evidence both to a verifier under EU MRV.
- An energy-storage buyer is really buying a **CSRD/EU-taxonomy-alignment claim** their auditor will test.
- Wärtsilä's own sales engineering must answer buyer Scope 3 and carbon-intensity questionnaires per quote, per product — the same manual fulfilment-desk pain as every industrial (Outokumpu pattern).

**Headline (buyer-facing, Ari-test form):**

> **DWS helps Wärtsilä close decarbonisation deals faster by attaching signed, verifier-ready compliance evidence (ETS, FuelEU, CSRD) to every quote — on EU-sovereign infrastructure, governed by KYA disclosure logic.**

One line, one mechanic (KYA-governed disclosure logic on sovereign infra), two outcomes (faster regulated deals for Wärtsilä + a defensible compliance case for Wärtsilä's customer). Risk removed, leverage gained — quotable in a procurement meeting.

**Product truth behind the line:** DWS Intelligence amplifies the people in the disclosure pipeline; friction removal is the entry point, compounding intelligence is the product. Same construction as the Outokumpu motion (`INTRO_ARI_HIRVONEN_OUTOKUMPU.md` §Product truth).

## Doors

Registry default for **Maritime / shipbuilding** (`DWS_ROLES_REGISTRY.md` §4): Door #1 = **R12 Operations Director**, wedge FuelEU Maritime + ETS Maritime, elevated roles R12 / R20 / R07.

**Customer-specific conflict, resolved (not averaged):** the 2026-01-01 org change puts sustainability under Legal & Compliance. For Wärtsilä specifically we lead with the **legal-governance door (R05/R06 — EVP Legal & Compliance organisation, Nora Steiner-Forsberg's function)**, because (a) it is where CSRD accountability now formally sits, (b) a function that just absorbed sustainability needs to demonstrate control early — a signed-pipeline pilot is exactly that demonstration, and (c) the Outokumpu playbook proves the legal-side sponsor is durable. The registry-default R12 door stays open as **door #2** (Marine operations / decarbonisation services — the FuelEU/ETS commercial wedge), targeted after or in parallel via a different thread. This deviation is per-customer emphasis, permitted by §4 ("emphasis shifts per industry"); the role list itself is unchanged.

## Wedge by role — same headline, every role wins

Stage-grouped per `DWS_ROLES_REGISTRY.md` §2; roles by R-ID; read diagonally (each "what you win" lights someone else's "win you create").

| Stage                 | Role (R-ID)                                                                                                                                                               | What you win                                                                                                                                                                                                                                                                                                       | Win you create for the rest of the company                                                                                                                                                     |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 — Strategic sponsor | **R05/R06 Legal & Compliance (door #1)** — function of EVP Nora Steiner-Forsberg                                                                                          | The newly inherited sustainability function lands with a governed, signed disclosure pipeline: KYA operator identity, Article 12 audit log, no US Cloud Act surface on disclosure drafts. Control demonstrated in the first year of ownership.                                                                     | Sustainability team keeps its workflow, gains legal-grade defensibility. Sales gets pre-approved evidence templates. CEO gets a clean "compliance under control after the handover" narrative. |
| 2 — Operational owner | **R12 Operations Director (door #2, Marine ops / decarbonisation services)**; R07/R08 sustainability leads (incl. VP Corporate Relations & Sustainability Marko Vainikka) | FuelEU + ETS evidence generated from the same data that already proves fuel savings — the retrofit business case and the compliance case become one signed document. CSRD/ESRS datapoint pipeline replaces manual collection.                                                                                      | Sales engineering stops re-deriving per-deal compliance maths. Legal gets source-traceable disclosures. Customers get a verifier-ready pack with their hardware.                               |
| 3 — Tech approver     | R13 CIO / R15 CISO                                                                                                                                                        | EU-sovereign by construction: EU-resident infra, no US-cloud dependency for disclosure data, NIS2-clean posture, one stack instead of fragmented compliance SaaS. Deliberately **outside** GEMS/Eniram internals — consumes exports only, no integration risk to certified control platforms (IEC 62443-4, SOC 2). | Legal's "no US discovery surface" claim is technically backed. Vendor count falls. Security questionnaire answers become one URL.                                                              |
| 4 — Commercial driver | R17 Head of Sales Engineering / R19 CRO                                                                                                                                   | Quote-to-signed-evidence in minutes, not weeks, exactly where the 2026 ETS-at-100% urgency lives. Win-rate lift on tenders where the buyer's board asks "show me the compliance case".                                                                                                                             | Ops and Legal stop being the per-deal bottleneck. CFO sees the decarbonisation order book convert faster.                                                                                      |
| 5 — Executive sponsor | R22 CEO (Håkan Agnevall) / R23 CFO / R24 IR                                                                                                                               | The all-time-high decarbonisation story gets a compliance-evidence engine behind it: margin (premium services), revenue (cycle compression), narrative (CSRD early-adopter posture extended to customer-facing evidence).                                                                                          | One rope for the whole org; analyst-day line "we sell decarbonisation _with the compliance case attached_" is credible and reproducible.                                                       |

## What we deliver (offer ladder)

Prices from the canonical source `dws10.com/config/products.json` — do not restate from memory elsewhere; re-check before quoting.

1. **Captain Day (€1,200)** — paid discovery: map one disclosure workflow (e.g. per-quote carbon questionnaire fulfilment in Marine sales engineering, or FuelEU evidence pack for one customer deal) and ship a signed sample output.
2. **Assessment (€2,500)** / **CSRD gap (€999)** — gap analysis against ESRS datapoints or FuelEU/ETS evidence chain.
3. **DWS IQ 6 (€4,999) / Climate Starter Bundle (€6,500) / DWS IQ Report (€1,999)** — the platform motion: KYA-governed disclosure pipeline on EU-sovereign infra.
4. **Aegis tier** — if/when the conversation reaches defence-adjacent marine (naval propulsion, dual-use): single-tenant sovereign deployment. Not in the first meeting.

**GEMS/Eniram boundary (from the 2026-07-06 field note):** Wärtsilä has publicly chosen in-house control of GEMS battery-analytics data — **never pitch DWS as a GEMS integration**. The attach surface is downstream: compliance reporting on data Wärtsilä or its customers export from GEMS/Eniram APIs. Speculative until a real export surface is confirmed in discovery.

## The Aiven boundary (read before ANY Wärtsilä touch)

Wärtsilä is a verified Aiven reference customer (logo on Aiven's own deck, received bilaterally 2026-07-06). Two tracks, strictly separated:

| Track                                                  | Status   | Rule                                                                                                                                                                                                                                                                                                                                                          |
| ------------------------------------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A — Direct compliance-led outreach (this file)**     | Open now | **Zero Aiven references.** No "we know you run Aiven", no joint-motion framing, no deck-derived facts. Everything in our copy must come from public sources (annual report, press releases, wartsila.com). The deck was shared under a bilateral relationship; using it in outreach would be exactly what we don't want done to us in reverse (§10 boundary). |
| **B — Joint motion through the Aiven partner program** | Blocked  | Requires: consulting-partner terms agreed with Aiven's partner org + deal registration + a public Wärtsilä-on-Aiven URL (asked from Leevi in the §8b letter, 2026-07-06). When open, the joint pitch is the Pega-pattern from the field note: industrial data layer on Aiven managed OSS in an EU region + DWS IQ 6 compliance agents on the same backplane.  |

If track B opens before track A has produced a meeting, prefer B (warm door with deal-reg beats cold). If track A lands first, keep Aiven out of the room until B's conditions are met.

## First touch — LinkedIn connect + note (Track A, drafted, NOT sent)

Target: named individual in the EVP Legal & Compliance organisation with sustainability-reporting ownership (OSINT pass pending — Nora Steiner-Forsberg herself may be too senior for a cold first touch; Marko Vainikka, VP Corporate Relations and Sustainability, is a candidate; a Director-level sustainability-reporting owner is the ideal entry).

> Hei [FirstName],
>
> Congratulations on an all-time-high 2025 — and on being years ahead of the CSRD wave, reporting under ESRS since 2024.
>
> I'm building EU-sovereign compliance automation for industrial companies: CSRD, ETS, FuelEU evidence on one signed, auditable pipeline. With ETS Maritime at 100% this year, we're seeing compliance evidence become part of the _sales_ motion in marine — the equipment business case and the buyer's compliance case are converging into one document.
>
> Lifetime Oy is in Espoo — same regulator, same language. Would you be open to a 15-minute chat?
>
> Risto Anton Päärni
> Founder, CEO · Lifetime Oy
> risto.paarni@lifetime.fi · +358 400 319 010

Notes: no Aiven, no GEMS, no agent-count claims (Pillar 2 — orchestration over components); the CSRD-early-adopter compliment is verifiable from their own reporting pages; the ETS-at-100% line is the timing hook. Email variant to be drafted as `LETTER_*_WARTSILA.md` once a named contact is confirmed. **Sending is RED zone — human sends.**

## Why now (timing summary)

- **2026:** ETS Maritime surrender obligation reaches 100% — their customers' cost, Wärtsilä's sales argument.
- **2025-01-01 →:** FuelEU Maritime live; pooling/banking decisions are compliance accounting.
- **2026-01-01:** Sustainability function moved under Legal & Compliance — buying criteria shift toward signed, auditable evidence.
- **2026-02-17:** Annual Report 2025 published — fresh public material to reference; their own numbers carry the conversation.
- **CBAM definitive period** from 2026-01-01 touches their input chain (verify specifics before use).

## Next actions

- [ ] **OSINT pass for named doors** (LinkedIn): (1) sustainability-reporting owner under EVP Legal & Compliance; (2) Marine decarbonisation-services commercial lead (R12/R17 side). Log findings here as §Who rows.
- [ ] Verify before first send: Energy/Energy Storage segment-split effective date; CBAM exposure specifics; Marko Vainikka's current title.
- [ ] Draft `LETTER_<NAME>_WARTSILA.md` (email long-form) once door #1 individual is confirmed; reuse the headline verbatim.
- [ ] Human sends first touch (RED zone). Log send date + status here.
- [ ] Watch the Aiven track: when partner terms + public Wärtsilä URL land, open Track B and register the deal with Aiven's partner org.
- [ ] After first reply: propose Captain Day (€1,200) as the paid discovery vehicle.

## Related files

- `Partners/outreach/2026-04-18-aiven.md` — §10 target screen (Wärtsilä priority 1) + usage boundary; §5.2 partner stance.
- `docs/field-notes/2026-07-06-wartsila-stack-aiven-dws-compatibility.md` — Pega/Dataddo/GEMS stack assessment; GEMS no-pitch rule.
- `sales-outreach/INTRO_ARI_HIRVONEN_OUTOKUMPU.md` — the source pattern (legal-side sponsor, wedge-by-role matrix, product truth).
- `DWS_ROLES_REGISTRY.md` — §4 Maritime/shipbuilding variant (registry default doors).

## Sources (public, fetched 2026-07-07)

- wartsila.com — Financial Statements Bulletin Jan–Dec 2025 (net sales €6.9B, comparable operating result €829M / 12.0%, all-time highs; ~17,900 employees, 199 locations, 78 countries)
- wartsila.com — "Wärtsilä EVP Public Affairs and Sustainability Kari Hietanen to retire" (2025-09-09; responsibilities to EVP Legal & Compliance Nora Steiner-Forsberg from 2026-01-01)
- wartsila.com/sustainability/reporting — CSRD/ESRS reporting since FY2024
- wartsila.com — Annual Report 2025 published 2026-02-17
- Nasdaq company news — Energy segment separation into Energy + Energy Storage with new financial targets

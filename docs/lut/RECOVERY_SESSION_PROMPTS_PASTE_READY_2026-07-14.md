# Paste-Ready Recovery Prompts — All Still-Lost Artifacts (2026-07-14)

***

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: claude/europe-roadmap-agents-g9zs8a | Date: 14.07.2026 | Changes: Verbatim, fresh-session-ready recovery prompts for every item still open in the loss ledger (docs/lut/recovery-prompts-lost-research-packs-2026-07.md §1): A EU/NATO pack, B FI/SE lanes, C DACH+France pack, D Nordic NO/DK pack, E1 Lovegin pricing reply, E2 dangling-reference audit. Each block is standalone: paste into a new session as-is.

Document Status:

- Created: 14.07.2026
- Last Modified: 14.07.2026
- Language: English
- Languages Available: EN
- Publication Status: ACTIVE
- Classification: CONFIDENTIAL — Fundraising/ops recovery runbook
- Document Type: Paste-ready session prompts

***

Run order: A → E1 (5 min, HIC) → B (while track sessions live) → C → D → E2.
Every prompt embeds the same discipline: bank incrementally, verify "✓ DURABLE".

## PROMPT A — EU Commission + NATO DIANA pack

```text
RECOVERY RUN — EU Commission + NATO DIANA funding pack (re-creating research lost to an
unreclaimed container on 2026-07-13; highest-priority lost pack).

## Bootstrap (first)
Context files live on branch claude/europe-roadmap-agents-g9zs8a (may not be on main).
On YOUR designated branch:
  git fetch origin claude/europe-roadmap-agents-g9zs8a
  git checkout origin/claude/europe-roadmap-agents-g9zs8a -- docs/lut/ scripts/claude-durability-checkpoint.sh
READ: docs/lut/fundraising-roadmap-2026-2027.md, docs/lut/recovery-prompts-lost-research-packs-2026-07.md,
docs/lut/europe-roadmap-fieldnote-prompt-2026-07.md.

## Who this is for
- Lifetime Oy (FI, Business ID 0772407-9): SME, NEGATIVE EQUITY -> GBER "undertaking in
  difficulty" until cured -> blocks Business Finland co-funding (FI side of Eurostars).
- Lifetime AB (SE): under 3 years old -> GBER-exempt -> SE-led applications are the live
  workaround while the Oy heals.
- Product: DWS IQ / Aegis Defence — EU-sovereign agentic-AI compliance platform
  (EU AI Act / CBAM / CSRD / NIS2 evidence layer; dual-use defence angle via Aegis).
- Academic anchor: LUT doctorate — RQ1 formal verification of agentic systems, RQ2
  certifiable agent-level audit (legal pillar), RQ3 industrial scalability.
- Consortium bench: Simula VIAS, SINTEF, Aarhus, Fraunhofer IAIS, TU Wien.
- Today = mid-July 2026. Deadlines are WEEKS away — dates are load-bearing.

## Deliverable
docs/lut/eu-nato-instruments-research-2026-07.md — DWS Document Standard header,
VERSION AND AGENT HISTORY with *** delimiters (copy shape from the roadmap file).
Per instrument: deadline, amount, funding rate, eligibility gates (EXPLICITLY: does the
negative-equity/GBER gate bite? FI-led vs SE-led?), application mechanics, effort
estimate, fit score + one-line rationale. End with a ranked "apply in this order" list.

## Instruments (priority order)
1. EUROSTARS CALL 11 — deadline 10 Sep 2026 (verify). ~EUR 1.5M, 50%, SME-led, FI+SE.
   Partner rules (min independent partners, country mix), Business Finland co-funding
   terms + their firm-in-difficulty test (application date vs grant-agreement date?),
   Vinnova terms for an SE-led variant via Lifetime AB, evaluation criteria, realistic
   prep timeline from mid-July. This section FEEDS THE GATE 1 DECISION (FI-led-after-
   cure vs SE-led-now) — make the comparison explicit.
2. DIGITAL EUROPE "COMPLIANCE" topic — deadline 1 Oct 2026 (verify). Find and READ the
   actual fiche ("digital solutions for regulatory compliance through data" or closest
   match): budget, consortium requirements, TRL, co-funding rate, financial-capacity
   check vs negative equity.
3. EIC ACCELERATOR incl. June-2026 DUAL-USE window — cutoff 28 Oct 2026 (verify).
   EUR 2.5M grant + up to EUR 30M equity, single company. Verify the window exists as
   described, Aegis fit, financial-viability screening vs negative equity, short ->
   full -> interview mechanics + timeline.
4. CASCADE / FSTP OPEN CALLS — live inventory of open calls (EUR 30-200k) relevant to
   compliance/AI/security/manufacturing. Per call: deadline, amount, one-line fit,
   financial-health gate yes/no (mostly no — fastest EU money). Recommend 2-3 to file
   within 8 weeks. Aggregators OK for discovery; official pages for verification.
5. NATO DIANA — 3 Jul 2026 call missed. Verify next cycle timing (~mid-2027?), grant
   structure (EUR 100k + 300k equity-free), topic fit, Nordic test centres, how to
   pre-engage VTT Otaniemi + LEAD Linköping this autumn, DIANA -> NATO Innovation Fund
   on-ramp (NIF EUR 1bn; FI and SE both LPs — verify).
6. HORIZON EUROPE CLUSTER 4 — 2026-27 work programme, top 3 topics where the consortium
   bench makes us a credible partner (not coordinator).
7. EUROPEAN DEFENCE FUND — SME entry paths relevant to Aegis; one page max.

## Verification discipline (non-negotiable)
Every number/date/gate verified on the OFFICIAL page (ec.europa.eu, eurostars.eureka.eu,
eic.ec.europa.eu, digital-strategy.ec.europa.eu, diana.nato.int, nif.fund,
businessfinland.fi, vinnova.se). Unopened primary source -> explicit (verify) tag.
If a surviving roadmap figure is WRONG: correct the roadmap and say so in the commit —
surface conflicts, don't blend.

## After research
Update docs/lut/fundraising-roadmap-2026-2027.md: §0 row "EU Commission + NATO DIANA"
-> RECOVERED (point to the new file); correct changed §3 figures. Update your branch
handoff (.claude/handoffs/<branch>.md).

## Durability discipline (why this run exists)
BANK INCREMENTALLY: commit + push -u origin <your-branch> after EVERY instrument
section. After each push: bash scripts/claude-durability-checkpoint.sh — require
"✓ DURABLE" before continuing. NEVER claim work is banked/pushed/saved without that
line. NOT DURABLE -> stop researching, fix the push first. Fail loud.
```

## PROMPT B — FI/SE lane packs (run while Track 1/2 sessions still exist)

```text
BANK-CHECK / RECOVERY — FI/SE funding-lane research (apurahat, Vinnova, Almi, VGR).
This detail exists ONLY in the Track 1 (Lifetime AB) and Track 2 (LUT/apuraha) session
contexts — NOT in git. It is one container-reclaim away from being lost.

IF YOU ARE Track 1 or Track 2: write everything you hold on these lanes into
docs/lut/fi-se-lanes-research-2026-07.md (DWS Document Standard header, *** delimiters
in the VERSION AND AGENT HISTORY block) — foundations list with amounts + deadlines
(apurahat), Vinnova instruments, Almi financing, VGR regional grants — then commit,
push, and run bash scripts/claude-durability-checkpoint.sh until "✓ DURABLE".

IF THIS IS A FRESH SESSION (track sessions reclaimed): bootstrap first —
  git fetch origin claude/europe-roadmap-agents-g9zs8a
  git checkout origin/claude/europe-roadmap-agents-g9zs8a -- docs/lut/ scripts/claude-durability-checkpoint.sh
Read docs/lut/fundraising-roadmap-2026-2027.md (§2 gates, §6 lanes). Then re-research
the four lanes for: Lifetime Oy (FI, negative equity -> GBER firm-in-difficulty until
cured) vs Lifetime AB (SE, <3y, GBER-exempt). Per lane: instrument names, amounts,
deadlines, eligibility gates (does negative equity bite? does the AB qualify?),
application mechanics. Sources: official pages only — foundation/säätiö pages +
aurora-tietokanta.fi for apurahat, vinnova.se, almi.se, vgregion.se. Mark anything not
primary-source-verified with (verify). Decision rule context: apuraha -> stay Finland.

Output: docs/lut/fi-se-lanes-research-2026-07.md. Update roadmap §6 with the detail and
§0 row 5 -> RECOVERED. BANK INCREMENTALLY per lane; finish with
bash scripts/claude-durability-checkpoint.sh -> "✓ DURABLE". Never claim saved without it.
```

## PROMPT C — DACH + France anchors pack

```text
RECOVERY RUN — DACH+France academic-anchor pack (lost to an unreclaimed container
2026-07-13; conclusions survived, detail did not).

## Bootstrap (first)
  git fetch origin claude/europe-roadmap-agents-g9zs8a
  git checkout origin/claude/europe-roadmap-agents-g9zs8a -- docs/lut/ scripts/claude-durability-checkpoint.sh
READ: docs/lut/fundraising-roadmap-2026-2027.md (§2 gates, §5 anchors),
docs/lut/recovery-prompts-lost-research-packs-2026-07.md.

## Context
Lifetime Oy (FI, negative equity -> GBER gate) / Lifetime AB (SE, <3y, exempt).
Product: DWS IQ / Aegis Defence — EU-sovereign agentic-AI compliance platform.
LUT doctorate: RQ1 formal verification of agentic systems / RQ2 certifiable agent-level
audit + legal pillar / RQ3 industrial scalability. Anchors are consortium partners for
Eurostars (10 Sep 2026) and Horizon — partner value matters as much as scientific fit.

## Deliverable
docs/lut/dach-france-anchors-research-2026-07.md — DWS Document Standard header, ***
delimiters. Per anchor: group + named PI, scientific fit per RQ (with 2024-2026
publications as evidence), contact route, which instrument the anchor unlocks
(Eurostars partner / Horizon consortium / national industrial-PhD scheme), and a fit
score. End with top-3 ranked + first-contact email angles (do NOT send — draft only).

## Surviving conclusions — VERIFY AND EXTEND, do not re-derive
(a) Fraunhofer IAIS ZERTIFIZIERTE KI (Dr. Maximilian Poretschkin) = RQ2 bullseye —
    wrote the German AI-certification assessment catalog with BSI; our agent-level
    audit layer is novel to them. Recover: current project status, team, engagement
    route (bilateral vs Horizon), what a collaboration would look like.
(b) TU Wien TrustCPS (Prof. Ezio Bartocci) = RQ1 fit. FFG Industrienahe Dissertationen
    pays companies up to EUR 110k for employed doctoral students, 2026 call open.
    VERIFY THE OPEN GATE: must the employer be an Austrian entity? (ffg.at)
(c) France = consortium/ecosystem gravity (Inria, PEPR AI), NOT a direct funding door
    for a FI/SE company. Verify the EUR 109B AI Action Summit figure on a primary
    source and note what it actually funds.
## Lost detail to recover
ETH Zurich / Innosuisse angle (noted, never elaborated); 2-3 runner-up anchors per
country (DE: Fraunhofer AISEC? TUM? CISPA? — AT: TU Graz? — CH: ETH/EPFL groups —
FR: Inria verification groups); legal-pillar anchors for RQ2 in DACH/FR.

## Discipline
Official institute/agency pages only; (verify) tag anything unconfirmed. Update roadmap
§0 row 1 -> RECOVERED, §5 corrections, §7 gaps. BANK INCREMENTALLY: commit+push per
anchor; bash scripts/claude-durability-checkpoint.sh -> require "✓ DURABLE" each time.
Never claim saved without it. Fail loud.
```

## PROMPT D — Nordic NO/DK anchors pack

```text
RECOVERY RUN — Nordic (Norway+Denmark) academic-anchor pack (lost to an unreclaimed
container 2026-07-13; conclusions survived, detail did not).

## Bootstrap (first)
  git fetch origin claude/europe-roadmap-agents-g9zs8a
  git checkout origin/claude/europe-roadmap-agents-g9zs8a -- docs/lut/ scripts/claude-durability-checkpoint.sh
READ: docs/lut/fundraising-roadmap-2026-2027.md (§2 Gate 2, §5 Nordic),
docs/lut/recovery-prompts-lost-research-packs-2026-07.md.

## Context
Same as the roadmap: Lifetime Oy (FI, negative equity gate) / Lifetime AB (SE, <3y).
LUT doctorate RQ1 formal verification / RQ2 certifiable audit + legal pillar / RQ3
industrial scalability. Near-term Nordic instrument = Eurostars (10 Sep 2026) with
Lifetime as SME lead — anchor partner value is decisive. Industrial-PhD schemes are
FUTURE options (need local entity) — map them, don't chase them.

## Deliverable
docs/lut/nordic-no-dk-anchors-research-2026-07.md — DWS Document Standard header, ***
delimiters. Same per-anchor shape as the DACH pack: PI, RQ fit + 2024-2026 publication
evidence, contact route, unlocked instrument, fit score; top-3 ranking + draft contact
angles (draft only, do not send).

## Surviving conclusions — VERIFY AND EXTEND
(a) Simula VIAS Oslo (Arnaud Gotlieb, Shaukat Ali) = sharpest RQ1/RQ3 match in NO/DK,
    proven Horizon Europe coordination. Recover: current projects, team, whether they
    join Eurostars consortia, engagement route.
(b) Nærings-ph.d. (NO, ~EUR 190k, forskningsradet.no) and Erhvervs-PhD (DK, ~EUR 143k,
    ufm.dk / Innovation Fund Denmark): verify amounts, the local-employing-entity gate
    (Norwegian AS / Danish CVR), and the foreign-degree-university rule (LUT can remain
    degree institution). These stack on the LUT doctorate if a subsidiary ever exists.
(c) RQ2 legal pillar has NO verified NO/DK anchor. Chase the KU information-law centre
    lead (CIIR?) and alternatives: Oslo (NRCCL/SERI?), Aarhus law/tech, CBS.
## Lost detail to recover
Anchor #2/#3 per country — candidates to evaluate: SINTEF Digital, UiO, NTNU (NO);
Aarhus (Kasper Green Larsen's or software-engineering groups?), DTU Compute, ITU (DK).
Contacts, scheme mechanics + next deadlines, each anchor's Eurostars/Horizon value.

## Discipline
Official pages only ((verify) otherwise). Update roadmap §0 row 2 -> RECOVERED, §5 +
§7. BANK INCREMENTALLY per anchor; bash scripts/claude-durability-checkpoint.sh ->
"✓ DURABLE" each time. Never claim saved without it. Fail loud.
```

## PROMPT E1 — Lovegin (Cubet) pricing reply — HIC pastes content

```text
Bank a chat-delivered artifact that was lost to git (Class C loss, confirmed): the
Risto -> Lovegin John (Cubet CEO) PRICING REPLY in the ORK/1462/2026 subcontracting
negotiation, sent after the 8.7.2026 seven-point confirmation, addressing the
EUR 260-320 offshore-rate split / hintalomake. Content pasted below (from sent email
or session history).

Steps: (1) append it as exchange #3 in bids/ORK160826/ORK160826_CUBET_KIRJEENVAIHTO.md
with correct date attribution, matching the existing quote format; (2) update that
file's Yhteenveto and, if the rate picture changed, ORK160826_MARKKINATIETO.md
(Päivitys 4); (3) add a version-history line per the file's convention; (4) commit,
push, then bash scripts/claude-durability-checkpoint.sh until "✓ DURABLE" (fetch the
script from branch claude/europe-roadmap-agents-g9zs8a if missing). Do not alter the
existing exchanges. Sender identity rules per CLAUDE.md (Päärni with umlauts).

ARTIFACT:
[PASTE THE SENT REPLY HERE]
```

## PROMPT E2 — Dangling-reference audit (finds unknown Class B/C losses)

```text
DANGLING-DELIVERABLES AUDIT — enumerate artifacts referenced in the repo that do not
exist in git (the class of loss a branch sweep cannot see; confirmed instance: the
Lovegin/Cubet pricing reply).

Bootstrap: git fetch origin claude/europe-roadmap-agents-g9zs8a && git checkout
origin/claude/europe-roadmap-agents-g9zs8a -- scripts/claude-durability-checkpoint.sh docs/lut/

Method: (1) grep tracked .md files for delivered/promised-artifact phrases — "sent",
"shared", "attached", "replied", "jaettu", "lähetetty", "vastattu", "liitteenä" — and
for every repo path referenced near a match, verify the file exists; (2) verify every
expected output named in NEXT_SESSION_PROMPT_*.md and .claude/handoffs/*; (3) sweep
status trackers (investor-outreach/, bids/, Coach/) for "sent <date>" entries with no
banked draft; (4) sweep VERSION AND AGENT HISTORY blocks for "Changes:" entries naming
files that do not exist.

Output: docs/DANGLING_DELIVERABLES_AUDIT_2026-07.md — one row per dangling reference:
what, where referenced, likely producing session/date, recovery route (sent-email
folder / session history / re-draft), severity. ENUMERATE ONLY — do not guess or
reconstruct content; each recovery is a separate HIC-gated step. Expect false
positives; mark confidence per row. Commit+push incrementally;
bash scripts/claude-durability-checkpoint.sh -> "✓ DURABLE" to finish.
```

***

# Kemira — Track B, milestone B1 "Decision Transfer Verified"

---

# VERSION AND AGENT HISTORY

Version: 1.0 [Latest]

- Version: 1.0 [Latest] | Tool: Claude Code | Session: claude/festive-cerf-87wf67 | Date: 28.09.2026 | Changes: B1 kit for Track B of the 60-day storyboard (HIC "try that", 28.09.2026): observation card, what the Kemira contact is asked to acknowledge, draft message for the HIC to send.

Document Status:

- Created: 28.09.2026
- Classification: INTERNAL — contains no customer data; names roles only
- Status: SENT 28.09.2026 by the HIC (email + LinkedIn questions); waiting for the reply

---

## What B1 needs (storyboard v1.1, Track B)

Observation → ownership unclear → transfer recommended → **owner acknowledged**. No sale, no licence.
B1 is done only when a named Kemira person confirms the observation and says who owns the decision.
Until then the Kemira case stays what `docs/plans/2026-09-24-decision-journey-outcome-evidence.md`
§5.2 calls it: an HIC illustration, not a recorded customer event.

**Target:** day 21 (Mon 19.10.2026).

## Observation card

| Field                       | Content                                                                                                                    |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Observation                 | "Emme tiedä tuotantoerien hiilijalanjälkeä." — the carbon footprint of production batches is not known                     |
| Hypothesis                  | The gap is not the calculation; it is ownership of the data and of the decision                                            |
| Who feels it                | Sustainability                                                                                                             |
| Who produces the data       | Production                                                                                                                 |
| Who owns the systems        | Digitalisation                                                                                                             |
| Who can decide              | COO (process), CFO (investment)                                                                                            |
| Who answers for the outcome | **Open — this is the question B1 asks**                                                                                    |
| Ownership verdict           | `transfer` — the problem belongs to a named owner who does not yet hold it                                                 |
| Recommended transfer        | From Sustainability (feels it) to the COO (can decide), with Production and Digitalisation named as data and system owners |

Source: `docs/market-signals/2026-09-24-boardy-kuka-omistaa-ongelman.md` (Kemira ownership map).

## What the contact is asked to confirm (three questions, 20 minutes)

1. Is the observation true today — is batch-level carbon footprint unknown or unreliable?
2. Who, by name or role, would have to decide to fix it?
3. Does that person know it is theirs to decide?

A "no" to question 1 ends B1 with a learning, not a failure. A named owner in question 2 who does
not yet know (question 3) is the Decision Transfer we record.

## When it happens — how we record it

As `decision_journey` events (`docs/plans/2026-09-24-decision-journey-outcome-evidence.md`):
`OBSERVATION_RECORDED` → `OWNERSHIP_HYPOTHESIS_CREATED` → `PATH_RECOMMENDED` (transfer) →
`OWNERSHIP_CONFIRMED` (decision_by: customer). Only the last event makes B1 verified. No customer
names or data go into the repository; the journey is stored in the platform database.

## Draft message (Finnish, for the HIC to send from risto.paarni@lifetime.fi)

**Subject:** 20 minuuttia: kenen päätös tuotantoerien hiilijalanjälki on?

Hei [nimi],

Olemme tutkineet yhtä kysymystä, joka toistuu teollisuudessa: tuotantoerien hiilijalanjälkeä ei
tunneta tarkasti, vaikka data on olemassa. Havaintomme on, että ongelma ei useinkaan ole
laskennassa vaan omistajuudessa — Sustainability kokee ongelman, Production omistaa datan,
Digitalisation järjestelmät ja päätös kuuluu jollekulle muulle.

Haluaisin tarkistaa tämän havainnon kanssasi 20 minuutissa. Kolme kysymystä:

1. Pitääkö havainto paikkansa Kemiralla tänään?
2. Kenen päätettävissä korjaus olisi?
3. Tietääkö hän, että päätös on hänen?

Tämä ei ole myyntitapaaminen. Emme tarjoa lisenssiä emmekä pilottia — haluamme varmistaa, onko
havainto oikea. Jos se on, kerromme mitä olemme oppineet muista vastaavista tapauksista.

Sopisiko jokin hetki viikoilla 41–42?

Ystävällisin terveisin,

Risto Anton Päärni
Founder, CEO · Lifetime Oy · the Agent Outcome Company
risto.paarni@lifetime.fi · +358 400 319 010

## Log

| Date       | Event                                                                  | Note                                                                                                                                                                                                                                  |
| ---------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 07.2026    | Question 1 answered in person (conversation during a shared ride, HIC) | Answer: **yes, implicitly** ("rivien välistä") — customers' need for batch-level footprint was acknowledged but not stated outright. Counts as a first-hand observation with implicit confidence; questions 2 and 3 are needed for B1 |
| 28.09.2026 | `OBSERVATION_RECORDED` — message sent by the HIC                       | Contact: Kemira, VP Product Line Management & Strategy (Fiber Essentials). Question 3 as sent: "Tietääkö joku, että päätös on hänen?" — asks whether _anyone_ holds it, which detects unclear ownership directly                      |
| 05.10.2026 | Follow-up if no reply                                                  | HIC calendar                                                                                                                                                                                                                          |

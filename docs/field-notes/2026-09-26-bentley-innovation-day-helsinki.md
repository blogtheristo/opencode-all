---
title: Field Note — Bentley Innovation Day Helsinki, 20.10.2026 (Attendance + Prep Brief)
date: 2026-09-26
status: PENDING_REVIEW
branch: claude/bentley-innovation-day-f6jbtq
author: Risto Anton Päärni (risto.paarni@lifetime.fi), Founder, CEO, Lifetime Oy
owner: Lifetime Oy (Business ID: 0772407-9)
---

# Field Note — 2026-09-26: Bentley Innovation Day Helsinki

## 1. What happened

HIC decided (26.09.2026) to attend **Bentley Innovation Day Helsinki**.

| Item         | Detail                                                                                 |
| ------------ | -------------------------------------------------------------------------------------- |
| Date         | Tuesday 20.10.2026 (exact times: from the programme page, not yet known)               |
| Venue        | NH Collection Helsinki Grand Hansa, Helsinki                                           |
| Themes       | Infrastructure collaboration, connected systems, digital twins, open platforms         |
| Speakers     | City of Tampere, Ramboll, Destia, Sitowise                                             |
| Cost         | Free; breakfast, lunch, refreshments, networking reception after the programme         |
| Invited by   | Karol Kowalczyk, EMEA Enterprise Inside Sales Representative, Bentley Systems (Dublin) |
| Registration | Link "Ohjelma ja ilmoittautuminen" in Karol's email — **not yet registered**           |

Calendar: all-day event 20.10 + follow-up block 22.10 09:00–10:00 (Google Calendar, created 26.09).

## 2. Why attend — the commercial logic

The audience is Finnish infrastructure owners, contractors and engineering consultancies — the
buyers of digital-twin work. Bentley sells the model and data platform (iTwin). DWS IQ does not
compete with that layer; it sells the **governed agent layer** that acts on project data with an
evidence trail. The pitch is complementary, not a replacement.

| Speaker org     | Segment                          | DWS fit (honest)                                                                                      | Existing repo signal                                                               |
| --------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| City of Tampere | Public infrastructure owner      | Public sector: sovereignty + NIS2 + EU AI Act evidence. Procurement route via Hilma (`/hilma-watch`). | None                                                                               |
| Ramboll         | Engineering consultancy (Nordic) | Embodied carbon (EN 15978), CSRD reporting for client projects; Climate Intelligence.                 | `scripts/signal_targets.json` (tracked)                                            |
| Destia          | Infra contractor                 | SiteSense (site safety, weather/crane/wind), Material Oracle, embodied carbon on bids.                | Target list ★, `2026-06-07-ceo-review-tech-partner-wedge-eu-sovereign-moat.md` #23 |
| Sitowise        | Engineering consultancy (FI)     | Same as Ramboll; smaller, faster decision cycle — likely the best first pilot.                        | None                                                                               |
| Bentley Systems | Platform vendor                  | Partnership / marketplace channel, not a customer. Karol is inside sales — ask for the partner team.  | Listed on `dws10.com/enterprise-integrations/index.html:1248`                      |

**Truth constraint.** `dws10.com/enterprise-integrations/index.html:1248` lists "Bentley iTwin" as a
BIM / digital-twin integration target. No iTwin connector code exists in `src/` (repo grep, 26.09).
In conversation: say "we integrate with twin data through open APIs; an iTwin connector is on our
roadmap and we would build it with a pilot customer." Do not say "we integrate with iTwin today."

## 3. Conversation kit

**One-line position (FI):** "Me emme tee digitaalista kaksosta — me teemme agentit, jotka toimivat
kaksosen datan päällä valvotusti ja jättävät auditoitavan jäljen (EU AI Act, CSRD)."

**One-line position (EN):** "We don't build the twin. We run governed AI agents on top of twin and
project data, with an audit trail that satisfies the EU AI Act and CSRD."

**Three openers by role:**

1. **Owner (Tampere):** "Kun infra-hankkeen data on kaksosessa, kuka vastaa siitä, mitä AI-agentti
   sillä datalla päättää — ja missä se data ajetaan?" → sovereignty, Aegis, EU-hosted inference.
2. **Contractor (Destia):** "Mitä yksi työmaan sääkeskeytys tai nostuririski maksaa päivässä?" →
   SiteSense demo (`/site-safety`).
3. **Consultancy (Ramboll, Sitowise):** "Kuinka kauan hiilijalanjälkilaskenta EN 15978 -muodossa
   vie tarjousvaiheessa?" → Climate Intelligence, `/carbon-analysis`.

**Pricing:** quote only from `dws10.com/config/products.json`. No numbers from memory on the floor.

**Ask per conversation (one, not three):** a 30-minute follow-up with a named problem owner.

## 4. Contact log (fill on the day)

| Name | Org | Role | Problem they named | Agreed next step | Follow-up sent (date) |
| ---- | --- | ---- | ------------------ | ---------------- | --------------------- |
|      |     |      |                    |                  |                       |

Follow-ups go out within 48 h (calendar block 22.10) from Proton, `risto.paarni@lifetime.fi`.

## 5. Reply to Karol (draft — outbound email is RED, HIC sends from Proton)

```
Subject: Re: Bentley Innovation Day Helsinki 20.10.2026

Hei Karol,

Kiitos kutsusta — osallistun mielelläni Bentley Innovation Day Helsinki -tapahtumaan 20.10.
Ilmoittaudun ohjelmasivun kautta.

Taustaksi: Lifetime Oy kehittää DWS IQ -alustaa, joka ajaa valvottuja AI-agentteja
infrastruktuuri- ja rakennushankkeiden datan päällä (työmaaturvallisuus, hiilijalanjälki
EN 15978, EU AI Act -auditointijälki). Näemme sen täydentävän iTwin-ympäristöä.

Jos Bentleyltä on paikalla joku kumppani- tai ekosysteemitiimistä, tapaisin mielelläni
hänet päivän aikana.

Ystävällisin terveisin,

Risto Anton Päärni
Founder, CEO · Lifetime Oy · the Agent Outcome Company
risto.paarni@lifetime.fi · +358 400 319 010
```

## 6. Learning Standard record (EU AI Act Art. 14)

| Step         | Status                                                           |
| ------------ | ---------------------------------------------------------------- |
| KB update    | N/A — event logistics, no new domain knowledge until after 20.10 |
| Field note   | This file                                                        |
| Learn/ HTML  | N/A — rendered after the event with outcomes                     |
| Drive export | N/A — same                                                       |
| HIC question | §7                                                               |
| Calendar     | Done — 20.10 all-day, 22.10 follow-up block                      |

## 7. HIC decision question

Is the goal on 20.10 **customer pipeline** (Destia / Sitowise pilot conversations) or a
**Bentley partner channel** (iTwin connector + marketplace)? The reply to Karol above asks for the
partner team; remove that paragraph if pipeline-only.

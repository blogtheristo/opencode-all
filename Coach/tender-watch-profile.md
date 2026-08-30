# Tender-Watch Profile — Mercell / Hilma (AI & Technical Training)

---

# VERSION AND AGENT HISTORY

Version: 1.0
Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Date: 25.06.2026 | Changes: Initial capture of Mercell monitoring profile (keywords, CPV codes, delivery areas) + DWS IQ product mapping

---

**Purpose.** Capture the Mercell (Hilma / Tarjouspalvelu) monitoring profile used to surface
Finnish public-sector tenders relevant to the Claude Code coaching / AI-training offering, and map
it to DWS IQ products. Source of truth for the watch configuration so it survives across sessions.

**Source platform.** Mercell Group — European e-tendering network feeding `hankintailmoitukset.fi`
(Hilma) and `tarjouspalvelu.fi`. Free trial monitoring profile ("seurantaprofiili").

> Network note: from this remote session both `hankintailmoitukset.fi` and `tarjouspalvelu.fi`
> are blocked by the environment egress policy (403 on CONNECT). Live scraping waits on a policy
> change; this profile is maintained by hand until then.

## Keywords (22 generated)

| #   | Keyword (FI)                | Theme                     |
| --- | --------------------------- | ------------------------- |
| 1   | tekoälyratkaisut            | AI solutions              |
| 2   | teollisuuden automaatio     | Industrial automation     |
| 3   | koneoppiminen               | Machine learning          |
| 4   | teollisuus 4.0              | Industry 4.0              |
| 5   | tekoäly analytiikka         | AI analytics              |
| 6   | prosessianalyysi            | Process analysis          |
| 7   | ennakoiva kunnossapito      | Predictive maintenance    |
| 8   | digitaalinen transformaatio | Digital transformation    |
| 9   | robotiikka                  | Robotics                  |
| 10  | teollisuusdata              | Industrial data           |
| 11  | tekoäly sovellus            | AI application            |
| 12  | sensoridata                 | Sensor data               |
| 13  | tuotannon optimointi        | Production optimization   |
| 14  | teollisuuden digitalisaatio | Industrial digitalization |
| 15  | teollisuuden big data       | Industrial big data       |
| 16  | tekninen koulutus           | Technical training        |
| 17  | tekoäly työpaja             | AI workshop               |
| 18  | teollisuuden ohjelmointi    | Industrial programming    |
| 19  | prosessiteknologia          | Process technology        |
| 20  | teollisuuden simulointi     | Industrial simulation     |
| 21  | teollisuuden\*              | Industrial (wildcard)     |
| 22  | tekoäly\*                   | AI (wildcard)             |

## CPV codes (8 generated)

| CPV      | Description (FI)                                     | Relevance                            |
| -------- | ---------------------------------------------------- | ------------------------------------ |
| 80531000 | Teollisuusalan koulutus ja tekniset koulutuspalvelut | Core — technical/industrial training |
| 80531200 | Tekniset koulutuspalvelut                            | Core — technical training services   |
| 80531100 | Teollisuusalan koulutus                              | Core — industrial training           |
| 80533100 | ATK-koulutus                                         | Core — IT/computer training          |
| 80521000 | Koulutusohjelmat                                     | Training programmes                  |
| 80000000 | Yleissivistävän ja ammatillisen koulutuksen palvelut | Broad education umbrella             |
| 80530000 | Ammattikoulutuspalvelut                              | Vocational training services         |
| 72212931 | Koulutusohjelmistojen kehittämispalvelut             | Educational software development     |

## Delivery areas (all 19 Finnish regions + Åland)

Suomi/Finland · Varsinais-Suomi · Kanta-Häme · Keski-Pohjanmaa · Pohjanmaa · Pirkanmaa · Åland ·
Pohjois-Savo · Keski-Suomi · Pohjois-Karjala · Etelä-Pohjanmaa · Helsinki-Uusimaa · Satakunta ·
Etelä-Savo · Etelä-Karjala · Päijät-Häme · Lappi · Kymenlaakso · Kainuu · Pohjois-Pohjanmaa

## DWS IQ product mapping

| Profile signal                                                                         | Maps to                          | Product                                                                                            |
| -------------------------------------------------------------------------------------- | -------------------------------- | -------------------------------------------------------------------------------------------------- |
| `tekninen koulutus`, `ATK-koulutus`, `tekoäly työpaja`, CPV 80531000/80533100/72212931 | **Claude Code coaching (3-day)** | `Coach/claude-code-coaching-3day-training.html`, `Coach/claude-code-valmennus-julkishallinto.html` |
| `digitaalinen transformaatio`, `tekoälyratkaisut`, `tekoäly analytiikka`               | AI adoption / advisory           | DWS IQ platform + sovereignty assessment                                                           |
| `teollisuuden automaatio`, `ennakoiva kunnossapito`, `prosessianalyysi`, `sensoridata` | Industrial agents                | SiteSense / Material Oracle / construction & logistics agents                                      |

## Analysis — alignment & gaps

**Strong fit for the training products.** The CPV set is education/training-centric
(80531xxx + 80533100 + 72212931), which is exactly the procurement category the Claude Code
coaching offering bids into. The `tekninen koulutus` / `ATK-koulutus` / `tekoäly työpaja`
keywords will catch training RFPs directly.

**Conflict to resolve (don't average it):** the _keyword_ set skews heavily **industrial**
(`teollisuus 4.0`, `ennakoiva kunnossapito`, `robotiikka`, `teollisuusdata`, `teollisuuden*`),
while the public-administration coaching variant we just built targets **government / public
sector** AI adoption. As configured, this profile will surface manufacturing-AI tenders well but
**under-surface public-sector AI-enablement tenders** — the exact opportunity the
`valmennus-julkishallinto` page was written for.

**Public-sector additions — ADOPTED** (now live in `skills/hilma-watch/profile.json`):

- Keywords added: `julkisen hallinnon tekoäly`, `tekoälyn käyttöönotto`, `tekoälyosaaminen`,
  `henkilöstön kouluttaminen`, `muutosjohtaminen`, `digitaalinen suvereniteetti`,
  `tekoälyn hallinta` (AI governance).
- CPV added: `79632000` (Personnel-training services), `80511000` (Staff-training services),
  `72000000` (IT services — for implementation bids, not just training),
  `73220000` (Development consultancy) for advisory-shaped tenders.
- Search terms now lead with public-sector intent (`julkisen hallinnon tekoäly`,
  `tekoälyn käyttöönotto`, `tekoälyosaaminen`) alongside the original AI/training terms.

> The **default `hilma-watch` profile mirrors the Mercell monitoring profile, widened toward
> public-sector AI enablement.** If you keep two separate go-to-market motions (industrial vs.
> public sector), split into two config files and run the skill twice with `--config`.

**Coverage note.** All 19 regions + Åland are selected — maximal geographic reach, no filtering
loss. Keep as-is unless you want to prioritise Helsinki-Uusimaa / Pirkanmaa for early pilots.

## Codified skill

This scan is now a parameterized skill — **`/hilma-watch`** (`skills/hilma-watch/SKILL.md`,
driver `skills/hilma-watch/hilma-watch.mjs`, default config `profile.json`). One skill, config
supplies the world; don't clone per watch (Skill Codification Rule).

## Next actions

1. When egress allows `hankintailmoitukset.fi` / `tarjouspalvelu.fi`, run `/hilma-watch` to pull
   live ContractNotices and score them against this profile. (Currently 403-blocked; the skill
   fails loud with the blocked host rather than reporting "0 found".)
2. Mirror the widened keyword/CPV set into the actual Mercell monitoring profile UI so the email
   alerts match the local scan.
3. For score ≥ 40 notices, map to the DWS IQ product table above and hand off to `sales-outreach/`.

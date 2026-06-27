<!-- COACH-META
Customer: OP Financial Group
Product: DWS IQ 6
ProductTier: Aegis Standard
ServiceTier: T3 Ohjelma + T4 Projekti
Version: 1.0
Status: DRAFT
-->

# Koulutustarjous — OP Financial Group

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: claude/finland-public-ai-strategy-t0goqg | Commit: pending | Date: 25.06.2026 | Changes: Ensimmäinen koulutustarjous OP Financial Groupille. Tuote DWS IQ 6, tuotetaso Aegis Standard, palvelutasot T3 + T4.

Document Status:

- Created: 25.06.2026
- Last Modified: 25.06.2026
- Language: Suomi
- Languages Available: Suomi
- Publication Status: DRAFT
- Document Type: Training Offer / Sales Outreach

Related Documents:

- `docs/coaching/CLAUDE_CODE_COACHING_CURRICULUM_FI_v1.0.md` (opetussuunnitelma)
- `Coach/README.md` (versiointi- ja tasomalli)
- `dws10.com/config/products.json` (hinnoittelun ainoa lähde)

---

## 1. Tausta ja tarve

OP Financial Group on Suomen suurin finanssiryhmä ja vahvasti säännelty toimija. EU:n
tekoälyasetus luokittelaa luotonannon ja asiakasriskien arvioinnin **suuririskiseksi**
tekoälykäytöksi, ja 4 artikla edellyttää **tekoälylukutaitoa** läpi organisaation. Samaan aikaan
DORA, GDPR ja Finanssivalvonnan odotukset vaativat, että tekoälyn käyttö on hallittua,
jäljitettävää ja **datasuvereenia**.

Tarve ei ole vain teknologinen: tekoälyn tuottavuushyöty saadaan irti vain, kun kehitys- ja
liiketoimintatiimit jakavat saman kurinalaisen toimintatavan ja johto osaa ohjata sitä.

## 2. Tuote ja versio

| Kenttä         | Arvo                                                                     |
| -------------- | ------------------------------------------------------------------------ |
| Tuoteversio    | **DWS IQ 6** (monikäyttöinen agenttiorkestraatiomoottori)                |
| Tuotetaso      | **Aegis Standard** — yksittäisvuokralainen (single-tenant), EU-suvereeni |
| Suvereniteetti | Koodi ja immateriaalioikeudet eivät poistu EU:n lainkäyttöalueelta       |
| Sovellettavuus | EU AI Act 4 art. + suuririskinen AI, DORA, GDPR, Finanssivalvonta        |

Tuoteversio on **lukittu DWS IQ 6:een** koko valmennuksen ajaksi; tasonostot (esim. Aegis
Sovereign) käsitellään erillisellä versiopäivityksellä tähän tarjoukseen.

## 3. Palvelutaso ja sisältö

Suositeltu polku: **T3 Ohjelma** (perusta koko tiimille) + **T4 Projekti** (juurrutus tuotantoon).

### T3 — 3 päivän ohjelma (luento + työpaja)

- **Luento (1 pv):** agenttisiirtymä, 12 insinöörikurin sääntöä, kontekstin suunnittelu
  (`CLAUDE.md`, taidot, komennot, MCP), luottamusraja GREEN / YELLOW / RED, live-demo
  `plan → implement → review → ship`. Päättyy skenaariotestiin → **4 artiklan lukutaitonäyttö**.
- **Työpaja (2 pv):** ajetaan OP:n nimeämässä repositoriossa. Päivä 1: `CLAUDE.md`, taidot,
  suunnittelutila. Päivä 2: MCP-työkalut, kuriportit, hallinta ja auditointi; jokainen osallistuja
  vie oikean backlog-kohteen läpi lopputyönä.

### T4 — Upotettu projekti (2–6 vk, valinta)

Seniori-insinöörit soveltavat DWS IQ 6:tta oikeaan backlog-kohteeseen päästä päähän OP:n tiimin
rinnalla, rakentavat tiimin pitämät taidot, agentit ja CI-kuriportit ja tekevät jäsennellyn
tiedonsiirron. Jakso rakentaa **IPR-pääomaa, jonka OP omistaa** — ei konsultointitunteja.
EU-suvereenia koko ajan.

## 4. Hinta

| Palvelutaso | SKU                            | Hinta (alv 0 %)                                       |
| ----------- | ------------------------------ | ----------------------------------------------------- |
| T3 Ohjelma  | `claude-code-coaching-3day`    | **5 900 €**                                           |
| T4 Projekti | `claude-code-coaching-project` | **alkaen 7 500 €** (rajataan toimeksiantokohtaisesti) |

> Hinnoittelun ainoa lähde on `dws10.com/config/products.json`. Hinnat vahvistetaan
> tilausvaiheessa.

## 5. Sopimusrakenne

| Ehto           | Sisältö                                                            |
| -------------- | ------------------------------------------------------------------ |
| Tuoteversio    | DWS IQ 6 (lukittu); versionostot erillisellä lisäyksellä           |
| Tuotetaso      | Aegis Standard                                                     |
| Palvelutaso    | T3 Ohjelma (+ valinnainen T4 Projekti)                             |
| Suvereniteetti | EU-suvereeni toimitus; data, koodi ja IP pysyvät EU:ssa            |
| IP-omistus     | T4:ssä syntyvät taidot, agentit ja kuriportit ovat OP:n omaisuutta |
| Kesto          | T3: 3 koulutuspäivää; T4: 2–6 viikkoa sovitusti                    |
| Hinnan lähde   | `dws10.com/config/products.json`                                   |
| Toimittaja     | Lifetime Oy, Y-tunnus 0772407-9                                    |

## 6. Yhteystiedot

**Lifetime Oy** · Y-tunnus 0772407-9 · ALV FI07724079 · Laidunmaanraitti 2 A 25, 02330 Espoo
Risto Anton Päärni, toimitusjohtaja · risto.paarni@lifetime.fi

---

# EUDI Lompakko & Digitaalinen Euro — Markkinasignaalit H2/2025–Q1/2026

**Date:** 2026-04-13
**Author:** Claude Code (claude-sonnet-4-6) + Risto Paarni
**Type:** Strategic Intelligence / Market Signals
**Status:** Active

---

# VERSION AND AGENT HISTORY

Version: 1.0
Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (claude-sonnet-4-6) | Session: claude/eudi-digital-euro-signals-7bIDp | Date: 2026-04-13 | Changes: Initial creation — EUDI Wallet + Digital Euro market signals, DWS IQ 6 strategic implications

Document Status:

- Created: 2026-04-13
- Last Modified: 2026-04-13
- Language: Finnish + English (bilingual)
- Publication Status: INTERNAL ONLY

---

## Ontology Tags

- **Geography:** Europe > EU27 > Finland
- **Sector:** FinTech > Digital Identity > CBDC > AI Agents
- **Entities:** ECB, European Commission, EUDI Wallet Consortium, Qivalis, Veriff, Signicat, Lifetime Oy / DWS IQ 6
- **Temporal Context:** H2/2025–Q1/2026, Pre-EUDI mandatory deadline (Dec 2026), Pre-Digital Euro pilot (2027)
- **Confidence:** High — sourced from EP votes, ECB communications, national pilot reports

---

## 1. Executive Summary

Kaksi EU:n digitaalisen infrastruktuurin hanketta — **EUDI Lompakko** ja **Digitaalinen Euro** — etenevät samanaikaisesti kohti kriittistä toteutusvaihetta. DWS IQ 6:lle nämä eivät ole taustakohinaa: ne ovat **suoran integraatiomahdollisuuden lähteitä** KYA-standardille, agenttimaksujen infrastruktuurille ja EU-suvereniteettipositioinnille.

**Kolme välitöntä vaikutusta DWS:lle:**

1. EUDI Lompakko → KYA L1+L2 identiteettikerros (korvaa tai täydentää Veriff/Signicat)
2. EU Business Wallet → Agenttiprovenance-allekirjoitus (KYA L2) organisaatioille
3. Digitaalinen Euro → Tulevaisuuden maksurata agenttitransaktioille (2027+ pilotti)

---

## 2. EUDI Lompakko — Signaalit ja DWS-vaikutukset

### 2.1 Aikataulu ja toteutusaste

| Signaali                | Fakta                                       | DWS-relevanssi                                     |
| ----------------------- | ------------------------------------------- | -------------------------------------------------- |
| Pakollinen käyttöönotto | Joulukuu 2026 — kaikki 27 jäsenvaltiota     | **Korkea** — yritykset integroivat nyt             |
| Kansalliset erot        | Alankomaat, Bulgaria: aikatauluepävarmuus   | Integraatiohaaste tuotteessa                       |
| Espanja (Cl@ve)         | Vanha järjestelmä hidas integroitumaan      | Referenssikäyttötapaus haasteille                  |
| Irlanti                 | Pilotit käynnissä, ei täysin toiminnallinen | Pilottidokumentaatio saatavilla                    |
| Yritykset               | Pankit, teleoperaattorit valmiita           | **Markkinaikkuna auki** — integraattorit tarvitaan |

**Johtopäätös:** Yrityksillä on tarve mutta ei omaa EUDI-integraatiota. DWS voi positioida itsensä "EUDI-native enterprise AI platform" -toimijana.

### 2.2 Teknologia ja turvallisuus

| Teknologia                  | Tila                   | DWS-kytkentä                                 |
| --------------------------- | ---------------------- | -------------------------------------------- |
| Zero-Knowledge Proofs (ZKP) | ENISA vahvistanut 2025 | KYA trust score — minimoidun datan vahvistus |
| W3C Verifiable Credentials  | Standardoitu           | KYA L1 — ihmisidentiteetti ilman raaka-dataa |
| Secure Element (laitteisto) | Kaikissa lompakoissa   | Reunalaite-integraatio (Jetson/DGX Spark)    |
| sd-jwt vc                   | Lisätty 2024–2025      | JSON-pohjainen VC — helppo API-integraatio   |

**Kriittinen havainto:** EUDI Lompakko ja KYA-standardi jakavat saman luottamusarkkitehtuurin. Verifiable Credential, jonka EUDI Lompakko myöntää ihmiselle, on suoraan käytettävissä KYA L1:n syötteenä — **ilman kolmannen osapuolen IDV-toimijaa**.

### 2.3 EU Business Wallet (EUBW) — Q4/2025

EUBW laajentaa EUDI-lompakon organisaatioihin. Tämä on suora kytkentä KYA L2:een:

```
KYA L2: Agent Provenance (KYB)
  └─ Kuka julkaisi tämän agentin?
  └─ EU Business Wallet → organisaation allekirjoitettu VC
  └─ Korvaa Shufti Pro / Veriff KYB -API:n eIDAS-ympäristössä
```

**Toimenpide:** Lisää EUBW KYA L2 -vaihtoehtoihin rinnalle Veriff Vespian kanssa. Dokumentoi `docs/field-notes/2026-03-18-kya-outreach-veriff-signicat.md`-muistiossa.

### 2.4 Microsoft Entra ID ja Okta — Ekosysteemisignaali

Microsoft ja Okta tukevat jo Verifiable Credential -integraatioita. DWS:n Supabase + Express -arkkitehtuuri voi hyödyntää näitä suoraan:

```
Enterprise SSO Flow (tulevaisuus):
  EUDI Wallet VC → Entra ID / Okta → DWS IQ 6 KYA L1 → Agent Trust Score
```

---

## 3. Digitaalinen Euro — Signaalit ja DWS-vaikutukset

### 3.1 Poliittinen ja lainsäädännöllinen eteneminen

| Signaali                               | Fakta                                           | DWS-relevanssi                    |
| -------------------------------------- | ----------------------------------------------- | --------------------------------- |
| EP tuki                                | Helmikuu 2026 — EU parlamentti äänesti puolesta | Lainsäädäntö etenee — ei peruunnu |
| ECB valmisteluvaihe → tekninen valmius | Lokakuu 2025                                    | SDK ja API alkavat kristalloitua  |
| Pilotti                                | 2027                                            | **Ei kiire nyt** — seuraa Q4/2026 |
| Liikkeellelasku                        | Mahdollisesti 2029                              | Suunnittele, älä rakenna vielä    |
| ECB lausunto                           | "Viivästykset = riippuvuus big tech -maksuista" | Poliittinen paine nopeuttaa       |

### 3.2 Tekninen arkkitehtuuri — Blockchain-signaali

**Merkittävä muutos:** ECB harkitsee julkisia lohkoketjuja (Ethereum, Solana) vähittäiselle digitaaliselle eurolle.

Jos toteutuu, tämä avaa DWS:lle:

```
Agentin micropayment -arkkitehtuuri (2027+):
  AI Agent suorittaa tehtävän
    → Laskuttaa Digital Euro smartcontractilla
    → Maksu tilitetään välittömästi
    → Auditloki Aiwen-kerrokseen (Article 12)
```

**Tämä on tulevaisuuden infrastruktuuri** — ei rakenneta nyt, mutta arkkitehtuuripäätökset tehdään tietoisena tästä suunnasta.

### 3.3 Qivalis-stablecoin — Kilpailusignaali

12 eurooppalaista pankkia kehittää Qivalis-stablecoinia, joka saattaa olla markkinoilla **ennen** digitaalista euroa (2029).

| Skenaario          | DWS-vaikutus                                  |
| ------------------ | --------------------------------------------- |
| Qivalis ensin      | Integroidu Qivalis API → nopea markkinaantulo |
| Digital Euro ensin | Odota ECB SDK → suvereenitilanne selkeä       |
| Molemmat           | Kaksi maksurataa = redundanssi + joustavuus   |

**Suositus:** Seuraa Qivalis API -dokumentaatiota Q4/2026. Älä rakenna kumpaankaan ennen kuin speksi lukittuu.

---

## 4. Suomi — Strateginen asema

### 4.1 Suomen vahvuudet

| Tekijä                                 | Status                                | DWS-merkitys                                          |
| -------------------------------------- | ------------------------------------- | ----------------------------------------------------- |
| Suomi.fi eID                           | Vakiintunut, kansallinen käyttö laaja | Integraatioesimerkki EUDI-siirtymässä                 |
| Pankkitunnukset (OP, Nordea, S-Pankki) | Erittäin korkea penetraatioaste       | Kansalaiset tottuneita digitaaliseen identiteettiin   |
| Supabase europe-north1 (Helsinki)      | DWS:n nykyinen infra                  | EUDI data residency -vaatimus täyttyy automaattisesti |
| Hetzner Helsinki                       | V3-palvelut                           | Backup datacenter                                     |

### 4.2 Suomen haasteet

- **Suomi.fi → EUDI-migraatio**: Kansallinen järjestelmä on vahva, mutta siirtymä eIDAS 2.0:aan vaatii transitiosuunnitelman
- **Kielituki**: EUDI referenssi-implementaatio ei vielä tue suomea kattavasti
- **Hallinnollinen hitaus**: Digivirasto (DVV) on pääasiallinen implementoija — tunnettua varovaisuutta

**Mahdollisuus:** DWS voi olla pilottikumppani suomalaisille yrityksille, jotka tarvitsevat EUDI-integraation **ennen** kansallista mandaattia (Dec 2026).

---

## 5. DWS IQ 6 — Strateginen toimintasuunnitelma

### 5.1 Välittömät toimenpiteet (Q2/2026)

| Toimenpide                                  | Prioriteetti | Omistaja    | Kytkös                                                 |
| ------------------------------------------- | ------------ | ----------- | ------------------------------------------------------ |
| Lisää EUDI Wallet KYA L1 -vaihtoehdoksi     | Korkea       | Risto       | `docs/field-notes/2026-03-17-shufti-kya-whitepaper.md` |
| Dokumentoi EUBW KYA L2 -kartoitukseen       | Korkea       | Risto       | KYA L2 spec                                            |
| Seuraa ECB Digital Euro SDK:ta              | Matala       | Claude/auto | Päivitys Q4/2026                                       |
| Päivitä KYA whitepaper: eIDAS 2.0 -viitteet | Korkea       | Risto       | `docs/field-notes/2026-03-17-shufti-kya-whitepaper.md` |

### 5.2 Positiointimuutos

**Nykyinen:** "KYA — KYC/AML extended to AI agents (Veriff/Signicat powered)"

**Päivitetty:** "KYA — eIDAS 2.0 native AI agent identity standard, supporting EUDI Wallet, EU Business Wallet, and traditional IDV providers"

Tämä muutos:

- Nostaa DWS:n **EU regulatoorisen infrastruktuurin päälle** rakentavaksi toimijaksi
- Erottaa kilpailijoista, jotka käyttävät pelkästään US-pohjaisia IDV-toimijoita
- Vahvistaa EU-suvereniteettinarratiiveja (→ DEEP_TECH_THESIS.md, PHD_FIREHORSE)

### 5.3 KYA + EUDI Wallet — Integraatioarkkitehtuuri (luonnos)

```
┌─────────────────────────────────────────────────────┐
│                  KYA Trust Chain                     │
├─────────────────────────────────────────────────────┤
│ L1: Human Identity                                   │
│   Option A: Veriff (current) — global               │
│   Option B: EUDI Wallet VC ← NEW (EU27, Dec 2026+) │
│   Option C: Signicat (Nordic)                        │
│                                                      │
│ L2: Agent Provenance (KYB)                           │
│   Option A: Veriff Vespia (current)                  │
│   Option B: EU Business Wallet VC ← NEW (Q4/2025+) │
│                                                      │
│ L3: Capability Manifest (DWS internal)               │
│ L4: Runtime Behavior Score (DWS internal)            │
│ L5: Continuous Risk Monitoring (IDV webhook)         │
└─────────────────────────────────────────────────────┘
```

---

## 6. Riskimatriisi

| Riski                                                | Todennäköisyys | Vaikutus    | Mitigaatio                                           |
| ---------------------------------------------------- | -------------- | ----------- | ---------------------------------------------------- |
| EUDI Dec 2026 -deadline viivästyy                    | Kohtalainen    | Matala      | Rakennetaan adapter-kerros, ei kiinteä riippuvuus    |
| Digital Euro siirtyy 2031+                           | Korkea         | Matala      | Qivalis-vaihtoehto riittää                           |
| Kansalliset toteutukset fragmentoituvat              | Korkea         | Kohtalainen | Tue W3C VC -standardi, ei kansallisia formaatteja    |
| Yksityisyyskysymykset hidastavat yritysten adoptiota | Kohtalainen    | Kohtalainen | ZKP-pohjainen VC = minimoitu data = myyntiargumentti |
| Qivalis vs Digital Euro -epäselvyys markkinoilla     | Korkea         | Matala      | Seuraa, älä sitoudu kumpaankaan vielä                |

---

## 7. Yhteenveto

EUDI Lompakko ja Digitaalinen Euro eivät ole "tulevaisuuden infra" — ne ovat **nykyinen markkinaikkuna**. Yritysten integraatiotarve on nyt, ennen Dec 2026 mandaattia.

DWS IQ 6:lle kriittisin signaali: **KYA-standardi ja eIDAS 2.0 ovat natiivisti yhteensopivia**. Lisäämällä EUDI Wallet L1-optiona KYA saa EU-natiivin identiteettipolun ilman kolmatta osapuolta.

Seuraava konkreettinen askel: päivitä KYA whitepaper (`2026-03-17-shufti-kya-whitepaper.md`) eIDAS 2.0 / EUDI Wallet -kohdalla ja lisää "EUDI-native" positiointi myyntimateriaaleihin.

---

## Lähteet ja viitteet

- EUDI Wallet Consortium — Large Scale Pilots 2025
- ECB Digital Euro preparatory phase update, Oct 2025
- European Parliament vote, Feb 2026 — Digital Euro political support
- ENISA — EUDI Security Standards confirmation 2025
- W3C Verifiable Credentials Data Model 2.0
- Qivalis stablecoin announcement — 12 EU banks consortium
- `docs/field-notes/2026-03-17-shufti-kya-whitepaper.md` (KYA L1–L5 spec)
- `docs/field-notes/2026-03-18-kya-outreach-veriff-signicat.md` (IDV partner outreach)
- `docs/field-notes/2026-01-28-eu-tech-stack-sovereignty-positioning.md` (EU sovereignty context)

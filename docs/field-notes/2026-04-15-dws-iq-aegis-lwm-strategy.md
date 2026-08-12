# DWS IQ Aegis LWM Strategy — Strategisen ohjauksen alusta ja malli

<!--
Code-Version: 2.8
Branch: claude/youth-strategy-projects-63bki
Date: 2026-04-15
Owner: risto.paarni@lifetime.fi
Introduced-In: PR-pending
-->

---

# VERSION AND AGENT HISTORY

Version: 2.8

Sessions & Modifications:

- Version: 2.8 | Tool: Claude Code (Sonnet 4.6) | Session: claude/youth-strategy-projects-63bki | Date: 15.04.2026 | Changes: Lisätty Luku 14.5 — domain-rakenne: dws10.com (EU enterprise), aegis.eu (sovereign/defense), dwsconnect.com (Connect OÜ, global/US/UAE). Kolme domainia, kolme yleisöä, nolla päällekkäisyyttä.
- Version: 2.7 | Tool: Claude Code (Sonnet 4.6) | Session: claude/youth-strategy-projects-63bki | Date: 15.04.2026 | Changes: Lisätty Luku 14:ään viitteet Gemini-generoituihin infografiikkakuviin: artifacts/IMG_6346.png (v1) ja artifacts/IMG_6347.png (v2 final). Kuvat cherry-pickattu mainista tähän branchiin.
- Version: 2.6 | Tool: Claude Code (Sonnet 4.6) | Session: claude/youth-strategy-projects-63bki | Date: 15.04.2026 | Changes: Connect-yhtiö korjattu: DWS IQ Connect OÜ (virolainen OÜ, ei suomalainen Oy). Perusteet: EU-jäsen, e-Residency, startup-ystävällinen, US-sijoittajille tuttu.
- Version: 2.5 | Tool: Claude Code (Sonnet 4.6) | Session: claude/youth-strategy-projects-63bki | Date: 15.04.2026 | Changes: Connect-yhtiö vahvistettu: DWS IQ Connect Oy (suomalainen Oy, ei Delaware). Päivitetty Luku 14 tuote-box ja yhtiörakennediagrammi.
- Version: 2.4 | Tool: Claude Code (Sonnet 4.6) | Session: claude/youth-strategy-projects-63bki | Date: 15.04.2026 | Changes: Lisätty Luku 14 — tuotekatalogin CEO-päätös: kolme erillistä tuotetta (Aegis / v6 Sovereign Infra / Connect). v6 SI tier-rakenne Starter→Standard→Professional→Enterprise Nordic EUR 0.012/muuttuja. Connect erillinen yhtiö, US-sijoittajat ok. Aegis ei vertailtavissa v6-taulukossa.
- Version: 2.3 | Tool: Claude Code (Sonnet 4.6) | Session: claude/youth-strategy-projects-63bki | Date: 15.04.2026 | Changes: Lisätty Luku 13 — DWS IQ v6 kolme infrastruktuuritasoa (Sovereign Infra + Connect). Aegis on erillinen turvatuote, ei v6:n myyntiversio. Sovereign Infra (Scaleway EU) ja Connect (Global AWS/Azure) ovat v6:n deployment-tasot. G42-kumppanuus Gulf/MENA. Segmentointitaulukko päivitetty.
- Version: 2.2 | Tool: Claude Code (Sonnet 4.6) | Session: claude/youth-strategy-projects-63bki | Date: 15.04.2026 | Changes: Lisätty Luku 12 (LWM usage-based SaaS — käyttö laskuttaa itse itsensä, Snowflake-vertailu, Arctic 15 -slide). Lisätty Luku 12.6: officer-palvelut + kirjanpitokirjaus EUR 15/kpl vs LWM EUR 0.012 = 1,250× halvempi.
- Version: 2.1 | Tool: Claude Code (Sonnet 4.6) | Session: claude/youth-strategy-projects-63bki | Date: 15.04.2026 | Changes: Luku 10.4 muuttujapohjainen hinnoittelumalli, Luku 10.5 LWM-transaktiomalli flat→metered.
- Version: 2.0 | Tool: Claude Code (Sonnet 4.6) | Session: claude/youth-strategy-projects-63bki | Date: 15.04.2026 | Changes: KYA EUR 1.20 vertailuhinta, DWS IQ v6 hinnoitteluongelma.
- Version: 1.8 | Tool: Claude Code (Sonnet 4.6) | Session: claude/youth-strategy-projects-63bki | Date: 15.04.2026 | Changes: Päivitetty 11.7 NCC-esimerkkidatalla: 500 kohdetta × 10,000 muuttujaa = 5M päätöspistettä/vuosi. EUR 0.012/päätöspiste. Muuttujaryhmät taulukkona (materiaalit, alihankkijat, luvat, turvallisuus, laatu, talous). LWM fokusoi ihmisen 500 riskipisteeseen 5M:sta.
- Version: 1.7 | Tool: Claude Code (Sonnet 4.6) | Session: claude/youth-strategy-projects-63bki | Date: 15.04.2026 | Changes: Lisätty 11.7 — compliance-päätösvolyymi: 50,000–100,000 kpl/vuosi × EUR 100,000/kpl = EUR 5–10 mrd altistus. Aegis EUR 1.20/päätös. LWM:n 3 roolia compliance-kontekstissa.
- Version: 1.6 | Tool: Claude Code (Sonnet 4.6) | Session: claude/youth-strategy-projects-63bki | Date: 15.04.2026 | Changes: Lisätty Luku 10 (EUR 59,990 hinnoittelun paradoksi, vertailu McKinsey/Big 4, kasvupolku) ja Luku 11 (norjalainen pankki varoittava case, 200 päätöstä/vuosi, LWM-rooli: virheenhaku + market signals + riskitunnistus, ei päätöksenteon korvaaminen).

- Version: 1.5 | Tool: Claude Code (Sonnet 4.6) | Session: claude/youth-strategy-projects-63bki | Date: 15.04.2026 | Changes: Lisätty Luku 9 — Bezos-analogia: tekoäly horisontaalisena teknologiana kuten sähkö. Lifetime Fleet laitteet älysähköverkkoon, DWS IQ Aegis LWM runkoverkkoratkaisu. Kumppanirakenne: NVIDIA, Nokia, Siemens, ICEYE, UpCloud. DWS = stack-integraattori.
- Version: 1.4 | Tool: Claude Code (Sonnet 4.6) | Session: claude/youth-strategy-projects-63bki | Date: 15.04.2026 | Changes: Lisätty Luku 7 (Aspire-paralleli, DWS CLI) ja Luku 8 (enterprise irtisanomistarve + Nokia Defence upotettu teknologiataso, DGX Spark muille sektoreille, moat-analyysi).
- Version: 1.3 | Tool: Claude Code (Sonnet 4.6) | Session: claude/youth-strategy-projects-63bki | Date: 15.04.2026 | Changes: Kirjoitettu Luku 1 uusiksi — 9.x IT-juniorirooli kuolee kilpailun myötä, suora hyppäys 13.2:een liian jyrkkä. Uusi polku: substanssiosaaja (rakentaminen, teollisuus, compliance) + AI-ohjaus = 13.2-operaattori. Hankkeet 9.2/9.3/9.4 uudelleenmääritelty siirtymävaiheeksi toimialakohtaiseen AI-orkestrointiin.
- Version: 1.2 | Tool: Claude Code (Sonnet 4.6) | Session: claude/youth-strategy-projects-63bki | Date: 15.04.2026 | Changes: Lisätty Luku 0 "Strategisen ohjauksen alusta ja malli" — DWS IQ Aegis + LWM ei ole vain infra vaan koko strategisen päätöksenteon ohjausalusta. Päivitetty otsikko ja Executive Summary.
- Version: 1.1 | Tool: Claude Code (Sonnet 4.6) | Session: claude/youth-strategy-projects-63bki | Date: 15.04.2026 | Changes: Korjattu "Nuorille"-määritelmä: junior-tason osaajien sisäänottopolku IT-kehittäjiksi (ei yritykset). 9.x = perinteinen SaaS + vanhat prosessit + AI-avustus = 10–30 % tuottavuusnousu. 13.2 johtohanke eriytetty omaksi raidakseen.
- Version: 1.0 | Tool: Claude Code (Sonnet 4.6) | Session: claude/youth-strategy-projects-63bki | Date: 15.04.2026 | Changes: Initial — Nuorille-strategia, 9.2/9.3/9.4 hankkeet, 13.2 johtohanke, DWS IQ Aegis + LWM Strategy -malli kokonaisuutena

Document Status:

- Created: 15.04.2026
- Last Modified: 15.04.2026
- Language: Finnish (pääkieli) + English (termit)
- Publication Status: INTERNAL
- Classification: STRATEGIC — Operational

Related Documents:

- docs/suomen-tilanne.md (paradigma-narratiivi, LinkedIn-viesti)
- docs/field-notes/2026-03-26-aegis-pricing-study.md (Aegis-hinnoitteluanalyysi)
- docs/field-notes/2026-04-10-aspire-13-2-isolated-mode.md (13.2 tekninen konteksti)
- V1_LWM.md (Lifetime World Model — NVIDIA Inception -hakemus)
- docs/field-notes/2026-04-13-qivalis-investor-outreach-strategy.md (investor-narratiivi)

---

## 0. DWS IQ Aegis LWM Strategy — Strategisen ohjauksen alusta ja malli

**DWS IQ Aegis LWM Strategy ei ole pelkkä tuotekuvaus tai infrastruktuurivalinta.
Se on Lifetime Oy:n strategisen ohjauksen alusta ja päätöksentekomalli.**

```
STRATEGINEN OHJAUSALUSTA
─────────────────────────────────────────────────────────
Kysymys              → Vastaus tulee mallista, ei arvauksesta
─────────────────────────────────────────────────────────
Mihin investoida?    → LWM kertoo missä tietopuutteet ovat
Kenelle myydä?       → Aegis-data osoittaa asiakasprofiilin
Mitä rakentaa ensin? → DWS IQ 6 -agentit priorisoivat
Miten kasvaa EU:ssa? → CBAM/CSRD-compliance-logiikka ohjaa
─────────────────────────────────────────────────────────
```

**Kolme ohjauskerrosta:**

| Kerros        | Komponentti                | Ohjauksen laji                                                            |
| ------------- | -------------------------- | ------------------------------------------------------------------------- |
| **Tieto**     | LWM (Lifetime World Model) | Mitä maailmasta tiedetään — fyysinen, operatiivinen, historiallinen tieto |
| **Toiminta**  | DWS IQ 6 (18 agenttia)     | Mitä tehdään — agentit suorittavat päätökset automaattisesti              |
| **Luottamus** | DWS IQ Aegis               | Miten toimitaan — sovereign, EU-compliant, auditoitu                      |

Ilman LWM:ää tieto on hajallaan. Ilman DWS IQ 6:tta tieto ei muutu
toiminnaksi. Ilman Aegista toiminta ei ole auditointikelpoista.

**Tämä on malli — ei vain ohjelmisto.** Sama kolmikerros ohjaa sekä
Nuorille-ohjelmaa (9.x) että 13.2-johtohankkeen skaalautumista.

---

## Executive Summary

**Kaksi raidetta — yksi ohjausalusta.**

| Raide                   | Kohderyhmä                             | Taso     | Polku                             |
| ----------------------- | -------------------------------------- | -------- | --------------------------------- |
| **Raide 1: Nuorille**   | Substanssiosaajat → AI-operaattoreiksi | 9.x→13.2 | Toimialaosaaminen + AI-ohjaus     |
| **Raide 2: Johtohanke** | Lifetime Oy / asiakasorganisaatiot     | 13.2     | AI-natiivi, 10× nopeus, 1/10 kust |

Molempia raitaita ohjaa sama **DWS IQ Aegis LWM Strategy -malli**:
LWM rakentaa muistia, DWS IQ 6 toimii, Aegis varmistaa luottamuksen.

---

## 1. Raide 1 — Nuorille: Substanssiosaajista AI-operaattoreiksi

### 1.1 Realistinen lähtötilanne — miksi vanha polku ei toimi

9.x AI-avusteinen kehitysmalli **poistuu kilpailun myötä**. Yritys joka
operoi 9.x-tasolla vuonna 2027 häviää hinnassa ja nopeudessa 13.2-tasolle
siirtyneelle. Tämä tarkoittaa:

- Junior IT-kehittäjän rooli 9.x-tasolla — **kuolee pois**
- Palkkaaminen perinteiseen SaaS-koodaukseen — **ei kannata**
- Polku "opi koodaamaan → nouse senioriksi" — **liian hidas** (3–5 v)

Samaan aikaan suora hyppäys 13.2-tasolle (AI-natiivi, agenttiorkestraatio)
vaatii IT-ymmärrystä, jota juniorilla ei vielä ole. **Kynnys on liian korkea.**

```
ESTE:
Junior (ei IT-taustaa) ──→ 13.2 AI-first   = liian iso hyppy
Junior (IT-koodi 9.x)  ──→ 13.2 AI-first   = polku katoaa kilpailun myötä
                                               ennen kuin päästään perille
```

### 1.2 Ratkaisu: Substanssiosaaja + AI = 13.2-operaattori

**Nuorille-polku ei kulje IT-koodin kautta. Se kulkee toimialaosaamisen kautta.**

Kohde: nuoret osaajat joilla on **substanssitietoa** omalta alaltaan —
rakentaminen, teollisuus, logistiikka, terveys, taloushallinto — mutta
ei syvää IT-taustaa.

```
UUSI POLKU:
Substanssiosaaja                AI-operaattori (13.2-taso)
─────────────────                ──────────────────────────────
Tietää miten rakennushanke      Osaa antaa oikeat ohjeet
toimii käytännössä          +   DWS IQ 6 -agentille
                                ja tulkita tulokset

Ymmärtää teollisuuden           Osaa konfiguroida LWM:n
prosessit ja poikkeamat     +   oikein ko. toimialalle

Tuntee regulaation              Osaa validoida Aegis-raportin
vaatimukset (CBAM, CSRD)    +   oikeellisuuden
```

**Kriittinen oivallus:** 13.2-tasolla ihminen ei kirjoita koodia —
hän **orkestroi agentteja ja validoi tuloksia**. Tähän rooliin
substanssiosaaja on _parempi_ kuin puhdas IT-juniori, koska hän
ymmärtää mitä agentin pitää tuottaa.

### 1.3 Hankkeet 9.2, 9.3, 9.4 — siirtymävaiheen projektit

9.x-hankkeet ovat **siirtymävaihe**: substanssiosaaja oppii käyttämään
AI-työkaluja omalla toimialallaan hallitusti, ennen kuin siirtyy täyteen
13.2-orkestrointiin.

| Hanke   | Substanssiala               | Mitä tehdään AI:n kanssa                               | Tavoite                                                |
| ------- | --------------------------- | ------------------------------------------------------ | ------------------------------------------------------ |
| **9.2** | Rakentaminen                | AI tuottaa työmaaraportteja, osaaja validoi            | Opi luottamaan AI-tuotokseen — ja kyseenalaistamaan se |
| **9.3** | Teollisuus / logistiikka    | AI analysoi prosessidataa, osaaja tulkitsee poikkeamat | Opi tunnistamaan missä AI menee metsään                |
| **9.4** | Taloushallinto / compliance | AI generoi CBAM/CSRD-raportit, osaaja auditoi          | Opi validoimaan regulatorinen tulos                    |

Hankkeet eivät opeta koodaamaan. Ne opettavat **AI:n ohjaamisen ja
tulosten validoinnin** omalla substanssialueella.

### 1.4 Miksi tämä toimii — kolme syytä

1. **Substanssitietoa ei voi automatisoida pois.** AI tietää yleisen —
   osaaja tietää paikallisen, poikkeuksen, kontekstin. Tämä kombo on vahvempi
   kuin kumpikaan yksin.

2. **Kynnys on oikea.** Substanssiosaaja ei tarvitse osata koodata —
   tarvitsee osata **kysyä oikein ja arvioida vastaus**. Tämä on opittavissa
   3–6 kuukaudessa.

3. **LWM hyötyy suoraan.** Substanssiosaajan validoimat tulokset ovat
   laadukkaampaa syötettä LWM:ään kuin geneerinen data. Toimialan
   poikkeustapaukset, paikalliset käytännöt, sanasto — ne tallentuvat malliin.

### 1.5 Rakenne ja ohjaus

```
DWS IQ Aegis LWM Strategy (ohjausalusta)
      │
      ├── DWS IQ 6 -agentit (tuottavat)
      │
      ├── LWM (oppii ja muistaa)
      │
      └── Substanssiosaaja — Nuorille-roolissa
              ├── Orkestroi agentit omalla toimialallaan
              ├── Validoi tulokset substanssiosaamisella
              └── Syöttää korjaukset takaisin malliin
```

**Ei koodikurssia. Ei IT-tutkintoa.** Ohjauksessa fokus: oikea kysymys,
kriittinen arvio, vastuullinen validointi.

---

## 2. Raide 2 — Johtohanke 13.2

### 2.1 Mitä 13.2 tarkoittaa

13.2 ei ole 9.5. Se on **paradigman murros**:

| Muuttuja      | 9.x (Nuorille-taso)          | 13.2 (Johtohanke)           |
| ------------- | ---------------------------- | --------------------------- |
| Tuottaja      | Ihminen + AI-työkalu         | AI-agentit päätuottajina    |
| Prosessi      | Vanha prosessi + AI rinnalla | Uusi prosessi: AI orkestroi |
| Nopeus        | +10–30 %                     | 10×                         |
| Kustannus     | Sama base                    | 1/10                        |
| Ihmisen rooli | Kehittäjä                    | Orkestroija                 |

### 2.2 Johtohankkeen rakenne

```
┌─────────────────────────────────────────────────────────┐
│                   13.2 JOHTOHANKE                       │
│                                                         │
│  Orchestrator (Risto / Lifetime Oy)                     │
│       │                                                 │
│       ├── DWS IQ 6 (18+ agenttia)                       │
│       │       ├── Compliance agents (CBAM, CSRD, ETS)   │
│       │       ├── Sales agents (Firehorse)               │
│       │       └── Site agents (SiteSense, LWM)          │
│       │                                                 │
│       ├── DWS IQ Aegis (sovereign deploy)               │
│       │       ├── UpCloud Helsinki (EU-data residency)  │
│       │       ├── Single-tenant Kubernetes              │
│       │       └── EU AI Act Article 12 audit log        │
│       │                                                 │
│       └── LWM (Lifetime World Model)                    │
│               ├── NVIDIA GB10 Grace Blackwell           │
│               ├── Cosmos world foundation model         │
│               └── Persistent temporal latent space      │
└─────────────────────────────────────────────────────────┘
```

### 2.3 Miksi 13.2 on "johtohanke" Nuorille-ohjelmalle

13.2 toimii **viitekehyksenä ja motivaationa** junior-osaajille:

> "Teet nyt 9.3-tason työtä. Tässä on se, minne tämä johtaa.
> Kun 13.2-malli on selvä sinulle — olet senior."

Junior näkee koko polun. Ei pelkästään "tee tämä PR" vaan
"tee tämä PR, koska se on osa tätä arkkitehtuuria, joka toimii näin."

---

## 3. DWS IQ Aegis — Sovereign AI Platform

**Aegis** on 13.2-johtohankkeen tuotantoalusta. Se mahdollistaa
AI-natiivin kehityksen ilman data sovereignty -riskiä.

| Ominaisuus                | Arvo                                  |
| ------------------------- | ------------------------------------- |
| Deploy                    | UpCloud Helsinki / EU-data residency  |
| Arkkitehtuuri             | Managed Kubernetes (single-tenant)    |
| Compliance                | EU AI Act Article 12, GDPR, CBAM/CSRD |
| Hinta                     | EUR 59,990 + EUR 999/kk               |
| Marginaali (30 asiakasta) | ~54 % infra gross margin              |

**Nuorille-yhteys:** Junior-osaajat oppivat 9.x-tasolla tekemään
deployment-prosesseja, jotka lopulta johtavat Aegis-tasoisiin
tuotantoympäristöihin. Portaat ovat loogiset.

> *Kehyshuomio (2026-05-28).* Tuotteiden kolmijako Aegis / Sovereign Infra / Connect on EU-lähtöisen yrityksen operatiivinen ilmentymä universaalista kolmen pilarin (Data / Teknologia / Toiminta) × kolmen jurisdiktion (EU / US / Singapore) suvereniteettimallista. Ks. Sovereignty Field Note #2 (`https://onelifetime.world/posts/sovereignty-field-note-2-three-pillars.html`) taksonomian osalta ja `DWS_TRUTH_STANDARD.md` rivi 16 kanonisena viitteenä.

---

## 4. LWM — Lifetime World Model

LWM kerää ja säilyttää toimialakohtaisen tiedon pysyvästi.

```
9.x-malli:        Projekti → Raportti → Arkisto → Tieto katoaa
13.2 + LWM:       Projekti → LWM → Pysyvä muisti → Seuraava projekti oppii
```

**Nuorille-yhteys:** Junior-osaajat, jotka tekevät 9.x-hankkeiden
dokumentaatiota ja API-kuvauksia, tuottavat dataa joka syöttää LWM:ää.
He eivät tiedosta sitä — mutta heidän työnsä rakentaa world modelia.

---

## 5. Aikataulu ja mittarit

### 5.1 Nuorille-ohjelma (Raide 1)

| Vaihe                    | Kesto  | Mittari                                      |
| ------------------------ | ------ | -------------------------------------------- |
| Rekrytointi + onboarding | 2 vk   | 2–3 junior-osaajaa mukaan                    |
| Hanke 9.2 (perustaso)    | 4–6 vk | Featuret tuotannossa, PR-prosessi hallussa   |
| Hanke 9.3 (testit + CI)  | 4–6 vk | Testikattavuus ≥ 60 %, CI läpi               |
| Hanke 9.4 (docs + API)   | 4–6 vk | Dokumentaatio valmis, API-spekki julkaistu   |
| Arviointi → senior-polku | 1 vk   | Top-osaaja siirtyy 13.2-johtohankkeen tukeen |

**KPI:** Tuottavuusnousu verrattuna lähtötasoon mitattuna PR-läpimenoajalla
ja feature delivery -syklillä.

### 5.2 Johtohanke 13.2 (Raide 2)

| Kvartaali | Toimenpide                    | KPI                   |
| --------- | ----------------------------- | --------------------- |
| Q2 2026   | Aegis-pilotti + 3 asiakasdemo | 1 sopimus             |
| Q2 2026   | Arctic 15 (sijoittajat)       | Pitch deck päivitetty |
| Q3 2026   | LWM-laajennus teollisuus      | 2 LWM-pilottia        |
| Q4 2026   | Series A -valmistelu          | SAFE → Series A       |

---

## 6. Selkeytys: Kaksi raidetta — eri tavoitteet

|                    | Nuorille (9.x)            | Johtohanke (13.2)                  |
| ------------------ | ------------------------- | ---------------------------------- |
| **Kohde**          | Junior-kehittäjät         | Asiakasorganisaatiot, sijoittajat  |
| **Prosessi**       | Vanha + AI rinnalla       | AI-natiivi, uusi prosessi          |
| **Hyöty**          | +10–30 % tuottavuus       | 10× nopeus, 1/10 kustannus         |
| **Välineet**       | VS Code, GitHub, Supabase | DWS IQ 6, Aegis, LWM               |
| **Aikahorisontti** | 3–6 kk / junior           | Jatkuva, skaalautuva               |
| **Riski**          | Matala (tutut prosessit)  | Korkea mutta hallittu (todistettu) |

**Yhteinen nimittäjä:** Molemmat käyttävät AI:ta — eri tavoin.
Nuorille-taso opettaa AI:n käyttöä kehittäjän työkaluna.
13.2-taso osoittaa mitä tapahtuu kun AI nousee tuottajaksi.

---

## 7. Aspire-paralleli: Versioloikka paradigman signaalina

### 7.1 Microsoft Aspire 9.x → 13.2

Microsoft teki .NET Conf 2025:ssä intentionaalisen versioloikan:

- **9.x → 13** (hypätty 10, 11, 12)
- Rebrand: ".NET Aspire" → "Aspire" (polyglot, ei .NET-side)
- CLI-first: `aspire docs`, `aspire run --isolated`, agent-native
- TypeScript AppHost: Python ja JS ensimmäistä kertaa tasa-arvoisia

**Miksi:** Numero kommunikoi muutoksen laajuuden. 9.5 olisi sanonut "päivitys".
13.0 sanoo "uusi paradigma".

### 7.2 DWS tekee saman siirron

```
Microsoft Aspire:              DWS IQ:
──────────────────             ──────────────────────────────
.NET Aspire 9.x                DWS IQ 9.x (AI-avusteinen)
      ↓ hyppy                        ↓ hyppy
Aspire 13.x                    DWS IQ 13.2 (AI-natiivi)
Polyglot, CLI-first            DWS CLI, agent-native
aspire docs list --json        dws docs list --format json
aspire run --isolated          dws run <agent> --sovereign
TypeScript AppHost             TypeScript / LWM AppHost
```

**DWS CLI** on Aspire CLI:n vastine DWS-ekosysteemissä:

```bash
dws agents                              # Lista kaikki agentit
dws run compliance --input '{"reg":"CSRD"}'
dws docs search "cbam" --format json   # Standardit kyselykelpoisia
dws workflow compliance-assessment
```

### 7.3 Mikä tekee DWS:n versioloikasta erilaisen

Aspiren loikka on tekninen (polyglot, CLI). DWS:n loikka on samalla
**liiketoiminnallinen ja yhteiskunnallinen**:

| Dimensio                 | Aspire 13.x         | DWS IQ 13.2                     |
| ------------------------ | ------------------- | ------------------------------- |
| Tekninen muutos          | Polyglot, CLI-first | AI tuottaja, ihminen orkestroi  |
| Liiketoimintamuutos      | DevEx paranee       | Kustannusrakenne muuttuu 10×    |
| Yhteiskunnallinen muutos | Kehittäjäkokemus    | Työnkuvat muuttuvat pysyvästi   |
| Suojattu                 | Avoin (open source) | **Suojattu — DWS IQ Aegis LWM** |

---

## 8. Enterprise-tason muutospaine — Nokia Defence -malli

### 8.1 Irtisanomistarve ja strateginen investointi yhtä aikaa

Suurissa yrityksissä (Nokia-kokoluokka) 9.x → 13.2 -siirtymä tarkoittaa
**kahta samanaikaista liikettä** — ja tämä on strategisesti vaikein kohta:

```
ENTERPRISE-MUUTOSPAINE:
──────────────────────────────────────────────────────────
Liike 1: IRTISANOMINEN               Liike 2: INVESTOINTI
──────────────────────────────────────────────────────────
9.x-tason roolit poistuvat           13.2-tason roolit rakennetaan
Manuaalinen koodaus → automaatio     AI-orkestraattori-roolit luodaan
QA, doc, boilerplate → AI            Substanssiosaajat + AI-ohjaus
Merkittävä YT-tarve                  Merkittävä uusinvestointi
──────────────────────────────────────────────────────────
SAMANAIKAISESTI — ei peräkkäin
```

**Tämä on poliittisesti ja johtamismielessä vaikein kohta.** Yritys
irtisanoo vanhaa osaamista samalla kun rekrytoi uutta. Lehdistö kirjoittaa
irtisanomisista — ei siitä, mitä rakennetaan tilalle.

DWS IQ Aegis LWM Strategy tarjoaa tälle muutosprosessille **hallitun
siirtymämallin**: substanssiosaajat, jotka muuten menettäisivät roolinsa,
voidaan uudelleenkouluttaa 13.2-operaattoreiksi (ks. Luku 1).

### 8.2 Nokia Defence — Tier-1 asiakas, upotettu teknologiataso

Nokia Defence edustaa **erikoisluokkaa** DWS:n asiakaskentässä:

| Ominaisuus      | Nokia Defence                                          | Muut sektorit                 |
| --------------- | ------------------------------------------------------ | ----------------------------- |
| Teknologiataso  | **Upotettu** (firmware, RTOS, military-grade HW)       | Cloud + edge                  |
| Compute-alusta  | Nokia oma laitteisto                                   | **DGX Spark** (DWS toimittaa) |
| Sovereigntytaso | Puolustusvoimatason luokittelu                         | EU sovereign (Aegis)          |
| LWM-käyttö      | Taistelukentän tilannetietoisuus, pitkäaikainen muisti | Rakentaminen, teollisuus      |
| Sopimustaso     | Erikoissopimus (ei julkinen hinnoittelu)               | Aegis EUR 59,990 + EUR 999/kk |

**Upotettu teknologiataso** tarkoittaa, että Nokia Defence -ympäristössä
DWS IQ Aegis toimii suoraan puolustusjärjestelmän laitteistossa —
ei pilvipalveluna, ei edes reunalaskentana. Sovellus on integroitu
laiteohjelmiston tasolla.

```
Nokia Defence -arkkitehtuuri:
──────────────────────────────────────────────────────────
Nokia laitteisto (military-grade, upotettu)
      └── DWS IQ Aegis (sovereign, Article 12 auditoitu)
              └── LWM (taistelukentän world model)
                      └── DWS IQ 6 -agentit (tilannekuva, logistiikka)
──────────────────────────────────────────────────────────
Ei internet-yhteyttä. Ei pilveä. Täysin suljettu ketju.
```

### 8.3 DGX Spark — Upotettu teknologia muille sektoreille

Muilla sektoreilla (rakentaminen, teollisuus, logistiikka) DWS tekee
upotetun tekoälyn **DGX Spark -laitteiston avulla**:

```
DGX Spark -asiakkaat:
──────────────────────────────────────────────────────────
Rakennushanke:
  DGX Spark (työmaakontti tai rakennusvalvomossa)
        └── LWM V1 (työmaan world model, NVIDIA Cosmos)
                └── DWS IQ 6 (SiteSense, material logistics)
                        └── Aegis (EU AI Act -auditoitu)

Teollisuuslaitos:
  DGX Spark (konehallin reunalla)
        └── LWM V1 (tuotantolinjan world model)
                └── DWS IQ 6 (compliance, prosessidata)
                        └── Aegis (sovereign, on-premise)
──────────────────────────────────────────────────────────
```

**DGX Spark on DWS:n Nokia-kortti ei-defence-sektorilla.** Nokia toi
upotetun verkon laitteiston telecom-alalle — DWS tuo upotetun AI:n
rakentamisen ja teollisuuden alalle.

### 8.4 Suojattu strategia-alusta — Miksi DWS IQ Aegis LWM on moat

```
KILPAILIJA EI VOI KOPIOIDA:
──────────────────────────────────────────────────────────
1. LWM on kumulatiivinen — jokainen projekti tekee mallista älykkäämmän.
   Kilpailija aloittaa nollasta.

2. Aegis on EU-natiivi — CLOUD Act -vapaa, Article 12 -auditoitu,
   UpCloud Helsinki. US-kilpailija ei voi tarjota tätä.

3. DGX Spark -integraatio on fyysinen — laite on asiakkaan tiloissa,
   data ei liiku. Korvaaminen vaatii hardware-vaihdon.

4. Nokia Defence -referenssi on markkinasignaali — defence-tason
   hyväksyntä avaa muut regulated industries (energia, infra, terveys).
──────────────────────────────────────────────────────────
```

---

## 9. Bezos-analogia: Tekoäly on horisontaalinen teknologia — kuten sähkö

### 9.1 Kehys

Jeff Bezos (ja Jensen Huang, Sam Altman) on todennut: **tekoäly on
horisontaalinen teknologia kuten sähkö.** Sähkö ei ole tuote — se on
infrastruktuuri jonka päälle kaikki tuotteet rakentuvat.

```
SÄHKÖN ANALOGIA → TEKOÄLYN ANALOGIA
──────────────────────────────────────────────────────────────
Sähköverkko (runkoverkko)    →  DWS IQ Aegis LWM (AI-runkoverkko)
Muuntaja (paikallinen solmu) →  DGX Spark (edge compute -solmu)
Sähkölaite (endpoint)        →  Lifetime Fleet (IoT/robotit/sensorit)
Sähkömittari (audit)         →  Aegis Article 12 -auditointi
Varavoima (sovereign)        →  On-premise, ei pilviä, ei katkoja
──────────────────────────────────────────────────────────────
```

**Kriittinen oivallus:** Sähköyhtiö ei myy yhtä "sähköä" — se myy
**infrastruktuuria** jonka päälle kaikki muu rakentuu. DWS ei myy
yhtä AI-agenttiä — se myy **AI-infrastruktuuria** (Aegis + LWM + Fleet).

### 9.2 Lifetime Fleet — Laitteet älysähköverkkoon

**Lifetime Fleet** on DWS:n laitepääte — IoT-laitteet, robotit ja
sensorit jotka muodostavat AI-verkon reunasolmut.

```
LIFETIME FLEET -ARKKITEHTUURI:
──────────────────────────────────────────────────────────────
Tier 3: Laitteet (Lifetime Fleet)
  ├── IoT-sensorit (ympäristö, lämpö, liike, kuorma)
  ├── Kamerajärjestelmät (SiteSense, turvallisuus)
  ├── Robotiikka (Jetson Orin Nano — edge AI)
  └── Wearables (henkilöturvallisuus, sijainti)
        ↓ data ylöspäin
Tier 2: Edge Compute (DGX Spark)
  └── LWM V1 (paikallinen world model, inferenssi)
        ↓ synkronointi
Tier 1: AI-runkoverkko (DWS IQ Aegis)
  └── Globaali tilannekuva, compliance, auditointi
──────────────────────────────────────────────────────────────
```

Lifetime Fleet on **spesifikaatiovaiheessa** — mutta strateginen
asema on selvä: joka laitteessa joka kerää dataa on arvo vain jos
data menee LWM:ään eikä häviä.

### 9.3 Runkoverkkoratkaisu — DWS IQ Aegis LWM

"Runkoverkkoratkaisu" ei tarkoita tietoliikenneverkko — se tarkoittaa
**AI-infrastruktuurin runko** johon kaikki muu liitetään:

| Kerros   | Komponentti                             | Analogia sähköverkossa    |
| -------- | --------------------------------------- | ------------------------- |
| Siirto   | Aegis (EU sovereign, UpCloud Helsinki)  | Valtakunnanverkko         |
| Jakelu   | DGX Spark (per asiakas / per hanke)     | Jakelumuuntaja            |
| Laitteet | Lifetime Fleet (IoT, robotit, sensorit) | Kodin sähkölaitteet       |
| Mittaus  | Article 12 audit log                    | Sähkömittari              |
| Muisti   | LWM (kumulatiivinen world model)        | Älymittaridata — ei häviä |

### 9.4 Kumppanirakenne — Kuka rakentaa mitäkin tasoa

| Kumppani        | Rooli                                       | Taso                              |
| --------------- | ------------------------------------------- | --------------------------------- |
| **NVIDIA**      | DGX Spark, GB10, Cosmos, NIM                | Edge compute + world model pohja  |
| **Nokia**       | Verkko-infrastruktuuri, Defence-integraatio | Tietoliikenne + sovereign         |
| **Siemens**     | Teollisuusautomaatio, OT-integraatio        | Laitekerros + prosessit           |
| **ICEYE**       | SAR-satelliittikuvaus, geospatial data      | LWM:n havaintodata (aerial layer) |
| **UpCloud**     | Helsinki DC, EU sovereign hosting           | Runkoverkko-infra (Tier 1)        |
| **Lifetime Oy** | DWS IQ Aegis + LWM + Fleet orkestraatio     | **Koko stack — integraattori**    |

**Lifetime Oy:n asema:** Ei laite- eikä verkkovalmistaja — **stack-integraattori**.
Kuten AWS yhdistää palvelimet, verkot ja palvelut yhdeksi API:ksi, DWS
yhdistää NVIDIA:n, Nokian, Siemensin ja ICEYE:n yhdeksi AI-infrastruktuuriksi.

### 9.5 Miksi horisontaalisuus on strateginen etu

```
VERTIKAALINEN KILPAILIJA:           DWS HORISONTAALISESTI:
────────────────────────            ──────────────────────────────────
"Rakennusalan AI-työkalu"           "AI-infrastruktuuri kaikille
"Teollisuuden AI-työkalu"            toimialoille jotka tarvitsevat
"Logistiikan AI-työkalu"             sovereign, embedded, EU-native AI"
────────────────────────            ──────────────────────────────────
Yksi toimiala = yksi asiakas        Nokia Defence + Siemens-tehdas +
Kasvu = uusi toimiala               rakennushanke = sama infra eri datalla
Vaihto-hinta: matala                Vaihto-hinta: korkea (LWM on kertynyt)
```

**Sähköyhtiö ei vaihdu toimialalta toiselle** — se palvelee kaikkia.
DWS IQ Aegis LWM Strategy on se sähköyhtiö AI-infrastruktuurin alueella.

---

## 10. Hinnoittelun paradoksi — EUR 59,990 on naurettavan halpa

### 10.1 Mitä EUR 59,990 oikeasti ostaa

DWS IQ Aegis ei ole ohjelmistolisenssi. Se on **strategisen johtamisen
instrumentti** joka kattaa koko organisaation muutossyklin:

```
MITÄ AEGIS OHJAA — JA MITÄ SE MAKSAA ILMAN SITÄ:
──────────────────────────────────────────────────────────────────
Taso                    Aegisilla          Ilman
──────────────────────────────────────────────────────────────────
Tuotanto (9.x → 13.2)  Hallittu siirtymä  Kaaoottinen, kallis, hidas
Johto (päätöksenteko)   Data-ohjattu       Intuitio + konsulttiraportit
Organisaatio (YT)       Ennakoitu, perustuu dataan  Reaktiivinen, lakiriski
Compliance (EU AI Act)  Auditoitu, valmis  Sakkoriskit, jälkikäteen
──────────────────────────────────────────────────────────────────
EUR 59,990 + 999/kk     vs.  EUR 500K+ konsultointilasku per muutos
──────────────────────────────────────────────────────────────────
```

### 10.2 Vertailu: Mitä saman asian hoitaminen perinteisesti maksaa

| Tarve                       | Perinteinen ratkaisu     | Hinta                      | Aegis                   |
| --------------------------- | ------------------------ | -------------------------- | ----------------------- |
| Strategiatyö                | McKinsey / BCG           | EUR 200–500K / projekti    | Sisältyy                |
| Muutosjohtaminen            | Change management -firma | EUR 100–300K / YT-prosessi | Sisältyy                |
| Compliance-audit            | Big 4 (Deloitte, PwC)    | EUR 50–150K / vuosi        | Sisältyy                |
| IT-arkkitehtuurisuunnittelu | SI-talo                  | EUR 200K+                  | Sisältyy                |
| AI-strategia                | AI-konsulttitalo         | EUR 50–200K                | Sisältyy                |
| **Yhteensä**                |                          | **EUR 600K–1.5M**          | **EUR 59,990 + 999/kk** |

**EUR 59,990 on sisäänpääsymaksu, ei tuotteen hinta.**
Tuotteen todellinen arvo mitataan sillä, mitä se estää ja mahdollistaa —
ei siinä mitä se maksaa.

### 10.3 Milloin hinnoittelu nousee — ja miten

Aegis-hinnoittelu on nyt **markkinaosuuden hankkimisstrategia**:

```
Nykyinen (2026):   EUR 59,990 — aggressiivinen sisäänmeno
                   Tavoite: 6 → 30 asiakasta, referenssit

Kasvu (2027):      EUR 150,000 — kun Nokia Defence -referenssi julkinen
                   Palantir-benchmark aktivoituu

Scale (2028+):     EUR 500K–1M — kun LWM kumuloitunut 2+ vuotta
                   Vaihto-hinta niin korkea ettei asiakas lähde
```

**Nokia Defence -referenssi on hinnankorotuksen avain.**
Defence-tason hyväksyntä legitimoi enterprise-hinnoittelun.

### 10.4 Muuttujamäärä ratkaisee hinnan — uusi hinnoittelumalli

**Perusoivallus:** Muuttujien lukumäärä on DWS IQ:n luonnollinen
hinnoitteluyksikkö — kuten AWS laskuttaa GB:n tai transaktion mukaan.
Hinta ei perustu siihen mitä tuote maksaa toimittaa, vaan siihen
**kuinka monta muuttujaa asiakas tuo malliin**.

```
MUUTTUJAPOHJAINEN HINNOITTELUMALLI:
──────────────────────────────────────────────────────────────
Yksikköhinta:    EUR 0.012 per muuttuja / vuosi
                 (johdettu NCC-matematiikasta: EUR 59,990 / 5M)

Minimihinta:     EUR 4,990 / vuosi  (≤ 415,000 muuttujaa)
──────────────────────────────────────────────────────────────
Muuttujia/v     Laskennallinen hinta   Tuote / taso
──────────────────────────────────────────────────────────────
  200,000       EUR  2,400             → Pienyritys: EUR 4,990 (min)
  415,000       EUR  4,980             → Pienyritys: EUR 4,990 (min)
1,000,000       EUR 12,000             → Keskikokoinen: EUR 14,990
2,500,000       EUR 30,000             → Suuri: EUR 29,990
5,000,000       EUR 60,000             → Enterprise: EUR 59,990 (Aegis)
10,000,000      EUR 120,000            → Enterprise+: neuvoteltava
──────────────────────────────────────────────────────────────
```

**Miksi tämä on oikea malli:**

1. **Asiakas ymmärtää sen** — "meillä on 500 kohdetta × 10,000 muuttujaa
   = 5M muuttujaa, hinta on EUR 60,000" on selitettävissä yhteen lauseeseen.

2. **Hinta kasvaa asiakkaan kasvaessa** — NCC, joka kasvattaa kohteiden
   määrää, maksaa automaattisesti enemmän. Ei neuvotteluja.

3. **Nykyinen Aegis-hinta validoituu** — EUR 59,990 ei ole "enterprise-lisä"
   vaan täsmälleen NCC-kokoluokan muuttujamäärän looginen hinta.

4. **Vertailu kestää** — asiakas joka maksaa EUR 0.012/muuttuja saa
   100× halvemman palvelun kuin KYA (EUR 1.20) ja 400–4000× halvemman
   kuin ihminen (EUR 5–50). Hinta on perusteltu.

**Nykyisen tuotekatalogin uudelleentulkinta muuttujamallissa:**

| Tuote                | Hinta                   | Muuttujia sisältyy | EUR/muuttuja |
| -------------------- | ----------------------- | ------------------ | ------------ |
| DWS IQ v6            | EUR 4,990 + EUR 499/kk  | ≤ 415K / vuosi     | EUR 0.012    |
| Climate Intelligence | EUR 2,999/kk            | ≤ 250K / kk        | EUR 0.012    |
| DWS IQ Aegis         | EUR 59,990 + EUR 999/kk | ≤ 5M / vuosi       | EUR 0.012    |

**Sama EUR 0.012/muuttuja läpi koko tuoteperheen.** Tuotteet eroavat
vain muuttujamäärän katon, sovereign-tason ja deployment-mallin mukaan —
ei hinnoittelulogiikan mukaan.

### 10.5 LWM-transaktiomalli — tulevaisuuden tulonlähde

**Muuttujamäärä on tämän hetken hinnoitteluyksikkö.**
Mutta muuttujien lukumäärä tarkoittaa myös jatkossa **LWM-transaktioiden
määrää — ja ne mitataan euroissa.**

```
HINNOITTELUN EVOLUUTIO:
──────────────────────────────────────────────────────────────
2026 (nyt):    Flat subscription per muuttujamäärätaso
               EUR 59,990/v kattaa ≤ 5M muuttujaa
               → Ennustettava, helppo myydä

2027→:         LWM-transaktiolaskutus (metered billing)
               Jokainen LWM-kysely / agenttikutsu / validointi
               on laskutettava tapahtuma
               EUR X per transaktio
               → Automaattinen kasvu asiakkaan kasvaessa
──────────────────────────────────────────────────────────────
```

**Vertailu tunnettuihin malleihin:**

| Platform         | Mittayksikkö              | Hinta/yksikkö                  |
| ---------------- | ------------------------- | ------------------------------ |
| AWS Lambda       | Kutsu                     | EUR 0.0000002                  |
| OpenAI API       | Token                     | EUR 0.000003                   |
| Stripe           | Transaktio                | 1.4 % + EUR 0.25               |
| **LWM (tuleva)** | **Compliance-transaktio** | **EUR 0.012 (tai säädettävä)** |

**Miksi LWM-transaktiomalli on strategisesti arvokas:**

1. **Automaattinen kasvu** — NCC kasvaa 500 → 1,000 kohdetta:
   transaktiot kasvavat 5M → 10M → liikevaihto kaksinkertaistuu
   ilman myyntiä

2. **Korkea marginaali skaalassa** — marginalikustannus per lisätransaktio
   lähestyy nollaa kun LWM on tuotannossa. Jokainen lisätransaktio on
   lähes puhdasta katetta.

3. **Nokia Defence -skaalassa** — jos puolustussektori tekee 100M+
   transaktioita/vuosi: 100M × EUR 0.012 = **EUR 1.2M/vuosi** yhdeltä
   asiakkaalta. Ilman lisämyyntiä.

4. **Sijoittajanarratiivi** — "muuttujapohjainen transaktiomalli" on
   tuttu VC-sijoittajille (usage-based pricing = korkea NRR, predictable
   growth). Palantirin flat-enterprise vs. DWS:n usage-based: eri story.

```
LWM TRANSAKTIOTULON KASVUKÄYRÄ (arvio):
──────────────────────────────────────────────────────────────
2026: 6 asiakasta × 1M transaktioita = 6M transaktioita/v
      6M × EUR 0.012 = EUR 72,000/v  (sisältyy nyt Aegis-hintaan)

2027: 30 asiakasta × 2M transaktioita = 60M transaktioita/v
      60M × EUR 0.012 = EUR 720,000/v

2028: 100 asiakasta × 3M transaktioita = 300M transaktioita/v
      300M × EUR 0.012 = EUR 3,600,000/v

Nokia Defence (jos 100M transaktioita/v yksin):
      100M × EUR 0.012 = EUR 1,200,000/v / asiakas
──────────────────────────────────────────────────────────────
```

**Siirtymästrategia flat → metered:**

- 2026: myydään flat (EUR 59,990) — yksinkertaista, ennustettavaa
- 2027: tarjotaan "Flex"-vaihtoehto — EUR 29,990 kiinteä + EUR 0.008/transaktio yli 2.5M
- 2028+: full metered uusille asiakkaille, flat-asiakkaille grandfathering

> **[BRAINSTORMING — toimenpide ennen hinnaston päivitystä]**
>
> 1. Vahvista EUR 0.012/muuttuja yksikköhinnaksi (tai säädä)
> 2. Laske jokaisten nykyisten asiakkaiden muuttujamäärä
> 3. Päätä flat vs metered -strategia 2027:lle
> 4. Päivitä tuotekatalogi ja investor memo — CEO-päätös

---

## 11. Varoittava esimerkki — Norjalainen pankki ja "kaikki data sisään"

### 11.1 Case: Norjalainen pankki, EUR 5 mrd sijoituspäätös

Tilanne: Norjalainen pankki esitti AI-pitchin. Tavoite:
**tehdä EUR 5 miljardin sijoituspäätös (in or out) yhden päivän aikana.**

Malli rakennettiin from scratch:

- Kaikki saatavilla oleva data syötettiin sisään
- Optimointifunktio: "tee enemmän rahaa"
- Ei domain-validointia, ei world modelia, ei audit logia

**Tulos:**

1. Kaksi onnistunutta kauppaa — malli tuntui toimivan
2. Datamäärä kasvoi → malli ei enää skaala → **iso romahdus**

### 11.2 Miksi tämä epäonnistui — tekninen analyysi

```
NORJALAINEN PANKKI -VIRHEMATRIISI:
──────────────────────────────────────────────────────────────
Virhe                    Seuraus
──────────────────────────────────────────────────────────────
1. Kaikki data sisään    Noise drowns signal. Malli ylisovittuu
   ilman validointia     harjoitusdataan — toimii "tutussa" mutta
                         hajoaa uudessa datassa

2. "Tee rahaa" -funktio  Ei rajoituksia. Malli optimoi aggressiivisesti
   ilman riskirajoituksia oikeaan suuntaan — kunnes olosuhteet muuttuvat

3. Ei pysyvää muistia    Jokainen analyysi aloittaa nollasta.
   (ei world modelia)    Kontekstuaalinen tieto häviää kaupasta toiseen

4. Ei audit logia        Kun romahdus tapahtuu, ei voi selvittää
                         miksi malli teki päätöksen X

5. No domain override    Substanssiosaaja ei voi korjata mallia
                         kun se menee metsään — malli on black box
──────────────────────────────────────────────────────────────
```

### 11.3 DWS LWM Strategy — täsmälleen päinvastainen lähestymistapa

| Norjalainen pankki       | DWS IQ Aegis LWM Strategy                                 |
| ------------------------ | --------------------------------------------------------- |
| Model from scratch       | LWM — kumulatiivinen, ei aloita nollasta                  |
| Kaikki data sisään       | Validoitu data — substanssiosaaja kuratoi                 |
| Optimoi rahaa            | Optimoi oikeita mittareita (compliance, risk, efficiency) |
| Ei audit logia           | Article 12 — jokainen päätös lokitettu                    |
| Black box                | Explainable — substanssiosaaja voi kyseenalaistaa         |
| Romahtaa kun data kasvaa | LWM skaalautuu — enemmän dataa = älykkäämpi               |

**Kriittinen ero:** Norjalainen pankki pyrki **korvaamaan** ihmisen päätöksenteon.
DWS LWM pyrki **vahvistamaan** sitä. Korvaaminen epäonnistuu aina
tilanteissa joita malli ei ole nähnyt. Vahvistaminen skaalautuu koska
ihminen paikkaavat aukon.

### 11.4 Mitä tämä tarkoittaa EUR 59,990:n kannalta

Norjalainen pankki käytti todennäköisesti **EUR 500K–5M** mallin
rakentamiseen — ja menetti sen päälle. Aegis EUR 59,990:lla:

- Ei rakenneta from scratch — käytetään LWM-pohjaa
- Ei aseteta "tee rahaa" -funktiota — asetetaan validit organisaatiotavoitteet
- Ei unohdeta audit-polkua — Article 12 on pakollinen
- Ei poisteta substanssiosaajaa — hän on osa mallia

**EUR 59,990 on norjalaisen pankin virheen hinta käänteisesti:
se on sen systeemin hinta joka estää saman virheen.**

### 11.5 Mittakaava: 200 päätöstä vuodessa

Norjalainen pankki ei tee yhtä isoa päätöstä. Se tekee **200 päätöstä
vuodessa**, joista kukin on EUR 5 miljardin luokkaa.

```
PÄÄTÖSVOLYYMIN MATEMATIIKKA:
──────────────────────────────────────────────────────────────
200 päätöstä × EUR 5 mrd    = EUR 1 biljoonaa / vuosi
                              päätösvolyymiä

Aegis EUR 59,990 / 200 päätöstä = EUR 300 per päätös

EUR 300 per EUR 5 mrd päätös = 0,000006 % päätöksen arvosta
──────────────────────────────────────────────────────────────
```

**Tämä on naurettava suhde.** Vertailuksi: yksittäinen
due diligence -raportti (ulkoinen konsultti) maksaa EUR 50–200K.
LWM tukee jokaista 200:sta päätöksestä hinnalla EUR 300 kappale.

### 11.6 LWM:n oikea rooli — ei päätöksentekijä, vaan kolme tehtävää

Norjalainen pankki halusi LWM:n **korvaamaan** päätöksenteon.
Väärä kysymys. Oikea kysymys on: **mitä LWM tekee paremmin kuin ihminen
päätöksentekijän rinnalla?**

```
LWM:N KOLME ROOLIA sijoituspäätöksessä:
──────────────────────────────────────────────────────────────
ROOLI 1: VIRHEENHAKU (Error Detection)
  ├── Tunnistaa anomaliat datassa ennen kuin ne vaikuttavat päätökseen
  ├── Vertaa nykyistä signaalia historialliseen — "tätä ei ole nähty ennen"
  └── Liputtaa: "Tämä data ei sovi malliin — tarkista ennen päätöstä"

ROOLI 2: MARKET SIGNALS
  ├── Prosessoi laajan datamäärän (uutiset, makro, sektorit, korrelaatiot)
  ├── Tiivistää signaalit päätöksentekijälle — ei raakadata vaan tulkinta
  └── Tunnistaa heikot signaalit jotka ihminen ei ehdi lukea

ROOLI 3: RISKITUNNISTUS
  ├── Arvioi päätöksen riskiprofiilin LWM-historian valossa
  ├── "Vastaavissa tilanteissa X:ssä tapahtui Y" — precedent-haku
  └── Skaalaa riskiarvio päätöstilanteen kontekstiin
──────────────────────────────────────────────────────────────
Ihminen tekee päätöksen. LWM tekee päätöksestä paremman.
──────────────────────────────────────────────────────────────
```

**Miksi norjalainen pankki epäonnistui:** He yrittivät siirtää Roolin 4
("tee päätös") LWM:lle — roolia jota ei ole olemassa LWM:ssä. Roolit 1–3
toimivat. Rooli 4 ei kuulu LWM:lle.

**Miksi DWS-lähestymistapa kestää 200 päätöstä / vuosi:** Jokainen päätös
vahvistaa LWM:ää. Päätös 200 on paremmin tuettu kuin päätös 1 — koska
199 aiempaa päätöstä ja niiden seuraukset ovat mallissa. Norjalaisen pankin
malli sen sijaan ei oppinut — se vain romahti datamäärän kasvaessa.

### 11.7 Compliance-päätösten volyymi — NCC-esimerkki

**NCC AB (2024):** SEK 62 mrd liikevaihto (~EUR 5.8 mrd), 11,800 henkilöä,
"satoja rakennuskohteita vuodessa" (konservatiivinen arvio: 500 kohdetta).

**Kriittinen lisätieto:** Jokainen yksittäinen rakennuskohde sisältää
**10,000 pienempää muuttujaa** — materiaalimäärittely, alihankkijavalidointi,
lupapäätös, ympäristövaatimus, turvallisuussertifiointi, budjettirivi,
muutostilaus, laadunvarmistustoimenpide...

```
NCC COMPLIANCE-PÄÄTÖSMATRIISI:
──────────────────────────────────────────────────────────────────
500 rakennuskohdetta
  × 10,000 muuttujaa per kohde
  = 5,000,000 päätöspistettä / vuosi

Aegis EUR 59,990 / 5,000,000 = EUR 0.012 per päätöspiste (1.2 senttiä)
──────────────────────────────────────────────────────────────────
HINTAVERTAILU per päätöspiste:
  KYA (Know Your Agent) -turvatarkistus  EUR 1.20   (alustava)
  Ihminen, Excel-tarkistus               EUR 5–50
  Big 4 compliance-audit (jaettu)        EUR 10–100
  ────────────────────────────────────────────────
  Aegis LWM                              EUR 0.012
  ────────────────────────────────────────────────
  Aegis vs KYA:    100× halvempi per piste
  Aegis vs ihminen: 400–4,000× halvempi per piste
──────────────────────────────────────────────────────────────────
```

**Miksi 10,000 muuttujaa per kohde on realistinen:**

| Muuttujaryhmä        | Esimerkkejä                                                  | Määrä/kohde |
| -------------------- | ------------------------------------------------------------ | ----------- |
| Materiaalit          | teräs, betoni, eristelevyt — alkuperä, hiilisisältö, CBAM    | ~500        |
| Alihankkijat         | sopimukset, sertifikaatit, vakuutukset, sanktiotarkistukset  | ~200        |
| Luvat & viranomainen | rakennuslupa, ympäristölupa, poikkeamat, muutokset           | ~300        |
| Turvallisuus         | MVR-mittaukset, vaaratilanteet, pätevyydet, konekortit       | ~2,000      |
| Laatu                | tarkastukset, poikkeamat, korjaukset, vastaanottopöytäkirjat | ~3,000      |
| Talous & compliance  | laskut, maksupostit, verotarkistukset, ETS/CSRD-raportointi  | ~4,000      |
| **Yhteensä**         |                                                              | **~10,000** |

**LWM:n rooli NCC-skaalassa:**

- Ei korvaa projektipäällikköä — tukee häntä
- 5M päätöspisteestä tunnistaa ne ~500 jotka ovat virheellisiä tai riskialttiita
- Ihminen fokusoi 500:aan, ei 5,000,000:aan
- Jokainen kohde opettaa LWM:ää — kohde 500 on paremmin tuettu kuin kohde 1

> **[BRAINSTORMING v1.7 — korjataan myöhemmin]**
> NCC-data: "satoja projekteja" on julkinen tieto, tarkka lukumäärä
> ei ole NCC:n raportissa. 500 on konservatiivinen arvio.
> 10,000 muuttujaa/kohde = käyttäjän arvio, ei dokumentoitu lähde.

---

## 12. LWM-transaktiomalli — käyttö laskuttaa itse itsensä

**Ydinajatus:**

> LWM-transaktiohinnoittelu NCC-skaalassa:
> **€0.012 / päätöspiste × 5M pistettä = €60K / vuosi — automaattisesti.**
> Ei myyntiä. Ei neuvottelua. Käyttö laskuttaa itse itsensä.
> Se on SaaS-malli joka skaalautuu asiakkaan volyymin mukaan,
> ei sinun myyntikapasiteettisi mukaan.

### 12.1 Miksi tämä muuttaa kaiken

Perinteinen ohjelmistomyynti on **myyntikapasiteettirajoitteinen**:

```
PERINTEINEN MALLI:
─────────────────────────────────────────────────────────────
Kasvu = myyjien määrä × dealifrekvenssi × keskikaupan koko
Pullonkaula: sinä et pysty myymään enemmän kuin ehdit
─────────────────────────────────────────────────────────────

LWM USAGE-BASED MALLI:
─────────────────────────────────────────────────────────────
Kasvu = asiakkaiden volyymi × €0.012 / transaktio
Pullonkaula: ei ole. NCC kasvaa → DWS-liikevaihto kasvaa.
─────────────────────────────────────────────────────────────
```

### 12.2 Automatiikka käytännössä

```
KUUKAUSITTAINEN LASKUTUSSYKLI — ei ihmistä tarvita:
──────────────────────────────────────────────────────────────
1. NCC tekee 417,000 compliance-päätöspistettä tässä kuussa
2. LWM laskee transaktiot automaattisesti
3. Lasku generoituu: 417,000 × €0.012 = €5,004 / kk
4. Maksetaan. Ei neuvottelua siitä miksi hinta on tämä.
──────────────────────────────────────────────────────────────
```

Verrattuna perinteiseen enterprise-myyntiin:

- Ei kvartaalipalaveria "mitä tänä vuonna ostat"
- Ei vuosittaista hinnankorotusneuvottelua
- Ei asiakasta joka pistää hankinnan jäihin budjettisyistä
- **Volyymi kasvaa → lasku kasvaa → automaattisesti**

### 12.3 Skaalautuvuus vs. myyntikapasiteetti

```
MYYNTIKAPASITEETILLA RAJOITETTU KASVU:
  Vuosi 1: Risto myy 6 sopimusta       → €360K ARR
  Vuosi 2: Risto + 1 myyjä, 15 kauppaa → €900K ARR
  Vuosi 3: Tiimi 3 myyjää, 30 kauppaa  → €1.8M ARR
  Rajoite: kuinka monta kauppaa tiimi jaksaa tehdä

USAGE-BASED SKAALAUTUVUUS:
  Vuosi 1: 6 asiakasta aloittaa        → €360K ARR
  Vuosi 2: asiakkaat kasvavat 2× + 9 uutta → €1.4M ARR (automaattinen osa)
  Vuosi 3: volyymi kasvaa 3× + 20 uutta → €4.2M ARR
  Rajoite: asiakkaiden oma kasvu, ei DWS:n myyntitiimi
```

### 12.4 Vertailu parhaimpiin usage-based SaaS -yrityksiin

| Yritys         | Mittayksikkö               | Automaattinen kasvu                        |
| -------------- | -------------------------- | ------------------------------------------ |
| Snowflake      | Data-query credits         | ✅ Asiakas kasvaa → lasku kasvaa           |
| Datadog        | Host/container count       | ✅ Infrastruktuuri kasvaa → lasku kasvaa   |
| Twilio         | API-kutsut                 | ✅ Käyttö kasvaa → lasku kasvaa            |
| Stripe         | Transaktiot                | ✅ Asiakas myy enemmän → lasku kasvaa      |
| **DWS IQ LWM** | **Compliance-transaktiot** | ✅ **NCC rakentaa enemmän → lasku kasvaa** |

**Net Revenue Retention (NRR) usage-based yrityksillä:** 120–160 %
(Snowflake 158 %, Datadog 130 %). Tämä tarkoittaa: ilman yhtään
uutta asiakasta liikevaihto kasvaa 20–60 % vuodessa olemassa olevien
asiakkaiden kasvavan käytön myötä.

### 12.5 Kytkös sijoittajanarratiiviin

Arctic 15 (kesäkuu 2026) — yksi slide:

> "DWS IQ LWM on usage-based compliance infrastructure.
> NCC tekee 5M päätöspistettä vuodessa — jokainen maksaa €0.012.
> Ei myyntiä. Ei neuvottelua. Käyttö laskuttaa itse itsensä.
> NCC kasvaa → DWS kasvaa. Automaattisesti."
>
> "Snowflake on usage-based data infra.
> DWS on usage-based compliance infra.
> Euroopan teollisuus tekee miljardeja compliance-päätöksiä vuodessa."

### 12.6 Officer-palvelut + kirjanpitokirjaus — kaksi lisävertailua

**Officer-palvelut (Compliance Officer as a Service)**

LWM-transaktiomalli mahdollistaa myös **officer-tason palvelutuotteen**:
DWS voi tarjota compliance officer -tehtäviä palveluna, joissa LWM
automatisoi rutiinityön ja ihminen (tai AI-agentti) allekirjoittaa.

```
OFFICER AS A SERVICE:
──────────────────────────────────────────────────────────────
Perinteinen CCO (Chief Compliance Officer):
  Palkka: EUR 8,000–15,000 / kk = EUR 96K–180K / vuosi
  Kapasiteetti: ~500 päätöstä / kk = 6,000 päätöstä / vuosi

DWS LWM + Officer-palvelu:
  LWM käsittelee: 5,000,000 päätöspistettä / vuosi automaattisesti
  DWS-ihminen validoi: ~500 poikkeamaa / vuosi (liputtamat riskit)
  Hinta: EUR 59,990 / vuosi (Aegis) + officer-tuki lisänä
──────────────────────────────────────────────────────────────
Kapasiteettivertailu:
  CCO ihminen:   6,000 päätöstä / vuosi @ EUR 180K
  DWS LWM:   5,000,000 päätöstä / vuosi @ EUR 60K
  → 833× enemmän päätöksiä, 1/3 hinnalla
──────────────────────────────────────────────────────────────
```

**Kirjanpitokirjaus — konkreettinen EUR/kpl -vertailu**

Yksittäinen **kirjanpitokirjaus** (accounting entry) ihmistyönä:

```
KIRJANPITOKIRJAUS-VERTAILU:
──────────────────────────────────────────────────────────────
Ihminen (kirjanpitäjä): EUR 15 / kirjaus
  → 60 kirjausta / tunti × EUR 150/h tilitoimistohinta = EUR 2.50/kirjaus
  → Monimutkaisemmat kirjaukset (CBAM, CSRD, ETS): EUR 15–50 / kirjaus

LWM-transaktio:         EUR 0.012 / kirjaus

──────────────────────────────────────────────────────────────
EUR 15 / EUR 0.012 = 1,250× halvempi kuin ihminen
EUR  2.50 / EUR 0.012 =   208× halvempi kuin automaattikirjanpito
──────────────────────────────────────────────────────────────
```

**NCC:n kirjanpitovolyymi (arvio):**

- 500 kohdetta × ~2,000 kirjausta / kohde = 1,000,000 kirjausta / vuosi
- Ihmistyönä @ EUR 15: EUR 15,000,000 / vuosi
- LWM @ EUR 0.012: EUR 12,000 / vuosi
- **Säästö: EUR 14,988,000 / vuosi** — saman asiakkaan compliance-budjetista

**Yhteenveto hinnoitteluvertailusta:**

| Toimenpide         | Ihminen  | LWM EUR 0.012 | Kerroin |
| ------------------ | -------- | ------------- | ------- |
| Kirjanpitokirjaus  | EUR 15   | EUR 0.012     | 1,250×  |
| Excel-tarkistus    | EUR 5    | EUR 0.012     | 417×    |
| KYA-turvatarkistus | EUR 1.20 | EUR 0.012     | 100×    |
| CCO-päätös         | EUR 30   | EUR 0.012     | 2,500×  |

---

---

## 13. DWS IQ v6 — Kolme infrastruktuuritasoa (Sovereign Infra + Connect)

**Tärkeä erottelu:** Aegis on oma itsenäinen tuotteensa — ei DWS IQ v6:n
myyntiversio. Alla kuvatut tasot (**Sovereign Infra** ja **Connect**) ovat
DWS IQ v6:n infrastruktuuritasoja, jotka tuodaan v6:n segmentointiin.

```
DWS IQ -tuoteperhe — kolme tasoa, kaksi tuotelinjaa:
─────────────────────────────────────────────────────────────────────
TASO            TUOTE               PILVI           MARKKINA
─────────────────────────────────────────────────────────────────────
Aegis           DWS IQ Aegis        Full Sov.       Puolustus,
                (OMA TUOTE)         europe-north1   kriittinen infra

Sovereign Infra DWS IQ v6           Scaleway EU     Säännelty
                Sovereign Infra                     EU-yritys

Connect         DWS IQ v6           Global AWS,     Globaalit
                Connect             Azure, NVIDIA   markkinat
─────────────────────────────────────────────────────────────────────
```

### 13.1 Miksi kaksi erillistä v6-tasoa

| Dimensio         | DWS IQ v6 Sovereign Infra          | DWS IQ v6 Connect               |
| ---------------- | ---------------------------------- | ------------------------------- |
| Pilviperusta     | Scaleway EU (Helsinki/Paris)       | AWS eu-north-1 + Azure + NVIDIA |
| Datan residenssi | EU only — ei USA:n CLOUD Act       | Globaali, GDPR-compliant        |
| Kohde            | Rakentaminen, logistiikka, energia | Globaalit kumppanit, APAC, Gulf |
| Kumppanit        | UpCloud, Nokia, Siemens            | NVIDIA, IBM, Alibaba Cloud, G42 |
| Hankintapolku    | EU-sopimus, EU AI Act compliance   | SaaS-tilaus, globaali trial     |
| Positiointi      | "Eurooppalainen tekoäly"           | "Skaalautuva globaali"          |

### 13.2 G42 — Silta Lähi-itään

**G42-kumppanuus** palvelee molempia DWS IQ v6 -tasoja Gulf/MENA-alueella:

- **v6 Sovereign Infra** → G42 toimittaa EU-vastaavan sovereigntyn alueella
  jossa USA-pilvi ei sovi poliittisista syistä
- **v6 Connect** → G42 avaa UAE/Saudi-markkinat APAC-laajennuksen rinnalle

```
Maantieteellinen kattavuus DWS IQ v6:lla:
───────────────────────────────────────────
Sovereign Infra:  EU (Scaleway) + Nordics (Nokia/UpCloud)
Connect:          USA (AWS/Azure) + APAC (Alibaba/IBM) + Gulf (G42)
───────────────────────────────────────────
Aegis:            Puolustus — erikseen, ei vertailutaulukossa
```

### 13.3 Aegis pysyy erillään — miksi tämä on tärkeä rajanveto

Aegis on **turva- ja sovereigntytason erikoistuote**:

- Oma hankintapolku (RFP, due diligence, erikoissopimus)
- Oma ostajapersoona (CISO, CTO, puolustushankinnat — ei compliance manager)
- Oma juridinen kehys (puolustusvoimat vs. EU AI Act -sektori)
- Oma hinnoittelumalli (EUR 59,990 + EUR 999/kk — ei SaaS trial)

Jos Aegis laitetaan samaan vertailutaulukkoon v6 Pro/Sovereign Infra/Connect
-versioiden kanssa, se tekee v6:sta "halvemman Aegis-version" sen sijaan että
v6 olisi itsenäinen compliance SaaS. **Nämä eivät kilpaile keskenään.**

### 13.4 DWS IQ v6 — uusi segmentointitaulukko

| Taso               | Pilvi                | Hinta (alustava)            | Muuttujia         | Päämarkkina              |
| ------------------ | -------------------- | --------------------------- | ----------------- | ------------------------ |
| v6 Connect         | Global AWS/Azure     | TBD (entry)                 | ≤1M               | Globaali SaaS            |
| v6 Sovereign Infra | Scaleway EU          | TBD (mid)                   | ≤5M               | Säännelty EU             |
| **Aegis**          | **Full Sov., eu-north1** | **EUR 59,990 + EUR 999/kk** | **Rajoittamaton** | **Puolustus/kriittinen** |

> **Huom:** Aegis-rivi on tässä vain viitteenä markkina-arkkitehtuurin
> selkeyttämiseksi — se ei ole v6:n tier. Hinnat v6 Connect ja Sovereign
> Infra -tasoille vaativat erillisen hinnoittelupäätöksen (CEO).

---

## 14. Tuotekatalogin päätös — kolme erillistä tuotetta (CEO, 15.04.2026)

Tämä luku dokumentoi tuotekatalogin rakenteen sellaisena kuin CEO on
määrittänyt. Ei brainstorming — vahvistettu rakenne.

**Visuaaliset artefaktit (Gemini-generoitu, 15.04.2026):**

- `artifacts/IMG_6346.png` — v1: "DWS IQ Aegis Strategy" (alkuperäinen otsikko)
- `artifacts/IMG_6347.png` — v2: "DWS IQ Product Family" (korjattu otsikko, final)

### 14.1 Kolme tuotetta, kolme myyntikanavaa

```
┌─────────────────────────────────────────────────────────────────────┐
│  TUOTE 1: DWS IQ Aegis                                              │
│  Sovereign/defense — erillinen tuote, ei vertailtavissa v6:een      │
├─────────────────────────────────────────────────────────────────────┤
│  Pilvi:      Full Sovereignty (Aegis) + europe-north1               │
│  Hinta:      EUR 59,990 + EUR 999/kk                                │
│  Ostaja:     CISO, puolustushankinnat, erikoissopimus               │
│  Hinnoittelu: Oma hinnasto — ei EUR 0.012/muuttuja -taulukossa       │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  TUOTE 2: DWS IQ v6 Sovereign Infra                                 │
│  EU compliance SaaS — säännelty EU-yritys                           │
├─────────────────────────────────────────────────────────────────────┤
│  Pilvi:      Scaleway EU (Helsinki / Paris)                         │
│  Yhtiö:      Lifetime Oy (EU-entiteetti)                            │
│  Hinnoittelu: EUR 0.012/muuttuja/vuosi (tiers alla)                 │
│  Tiers:      Starter → Standard → Professional → Enterprise Nordic  │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  TUOTE 3: DWS IQ Connect                                            │
│  Global compliance SaaS — globaalit markkinat                       │
├─────────────────────────────────────────────────────────────────────┤
│  Pilvi:      Global AWS + Azure                                     │
│  Kumppanit:  G42 (Gulf/MENA), Alibaba Cloud (APAC)                 │
│  Yhtiö:      DWS IQ Connect OÜ (virolainen OÜ) ✓ VAHVISTETTU       │
│  Hinnoittelu: EUR 0.012/muuttuja/vuosi (sama logiikka kuin v6 SI)  │
└─────────────────────────────────────────────────────────────────────┘
```

### 14.2 DWS IQ v6 Sovereign Infra — tier-rakenne

Hinnoittelu: **EUR 0.012 / muuttuja / vuosi**

| Tier                  | Muuttujia/vuosi | Hinta/vuosi | Hinta/kk   | Kohde                            |
| --------------------- | --------------- | ----------- | ---------- | -------------------------------- |
| **Starter**           | ≤100 000        | EUR 1 200   | EUR 100    | Pienhankkeet, pilotti            |
| **Standard**          | ≤500 000        | EUR 6 000   | EUR 500    | Keskikokoinen rakennusyhtiö      |
| **Professional**      | ≤2 500 000      | EUR 30 000  | EUR 2 500  | Suuri rakennusyhtiö / teollisuus |
| **Enterprise Nordic** | ≤5 000 000+     | EUR 60 000+ | EUR 5 000+ | NCC-kokoluokka, energiayhtiöt    |

> **Huom:** Enterprise Nordic -taso voidaan hinnoitella myös
> käyttöpohjainen yli 5M muuttujan osalta (ks. Luku 12 — LWM metered
> billing 2027+). Starter on tarkoitettu 9.x → 13.2 -siirtymävaiheen
> pilotointiin.

**Miksi EUR 0.012/muuttuja on perusteltavissa:**

- NCC 500 kohdetta × 10 000 muuttujaa = 5M pistettä → EUR 60 000/vuosi
- CCO-palkka EUR 96 000–180 000/vuosi 6 000 päätöksellä → LWM 5M
  päätöstä samalla summalla (ks. Luku 12.6)
- Kirjanpitokirjaus EUR 15/kpl (ihminen) vs EUR 0.012 (LWM) = 1 250×

### 14.3 DWS IQ Connect — erillinen yhtiörakenne

**Strateginen peruste erilliselle yhtiölle:**

Connect palvelee globaaleja markkinoita (USA, APAC, Gulf/MENA) joissa:

1. **US-sijoittajat** vaativat Delaware C-Corp tai vastaavan — Lifetime Oy
   (suomalainen Oy) ei sovi US VC -portfolioon
2. **G42-kumppanuus** (UAE) toimii paremmin non-EU entiteetin kautta
   poliittisista syistä
3. **CLOUD Act -altistus** on hyväksyttävää Connect-asiakkaille
   (he eivät vaadi EU sovereignty) — erottaa selkeästi Sovereign Infrasta
4. **Arctic 15 -pitch** Connect-yhtiöllä on puhtaampi tarina:
   "Global AI compliance SaaS, NVIDIA-powered, G42-partnered"

```
Yhtiörakenne (ehdotus):
──────────────────────────────────────────────────
Lifetime Oy (FI)         → DWS IQ Aegis
                          → DWS IQ v6 Sovereign Infra
DWS IQ Connect OÜ        → DWS IQ Connect (virolainen OÜ)
──────────────────────────────────────────────────
```

> **Vahvistettu (15.04.2026):** Connect-yhtiö on virolainen OÜ (Osaühing).
> Perusteet: EU-jäsen, e-Residency, startup-ystävällinen lainsäädäntö,
> US-sijoittajille tuttu rakenne (SAFE, convertible note).
> Delaware-rakennetta ei tarvita.

### 14.4 Mitä Aegis EI ole

| Väärä tulkinta                        | Oikea tulkinta                                |
| ------------------------------------- | --------------------------------------------- |
| Aegis = DWS IQ v6 Enterprise -taso    | Aegis = erillinen sovereign/defense -tuote    |
| Aegis kilpailee v6:n kanssa           | Aegis palvelee täysin eri ostajaa             |
| Aegis on v6:n "premium versio"        | Aegis on eri tuoteperhe, eri hankintaprosessi |
| Aegis-hinta (59,990) vertautuu v6:een | Aegis-hinta ei ole samassa taulukossa kuin v6 |

**Käytännön seuraus:** Kun asiakas kysyy hintaa, vastaus riippuu siitä
kumpi tuote on kyseessä. v6 Sovereign Infra -asiakas saa tier-taulukon.
Aegis-asiakas saa RFP-prosessin.

### 14.5 Domain-rakenne — kolme domainia, kolme yleisöä

**Vahvistettu (15.04.2026). Nolla päällekkäisyyttä.**

```
DOMAIN           TUOTE                    YLEISÖ
────────────────────────────────────────────────────────────────
dws10.com        DWS IQ v6 Sovereign Infra  Enterprise EU-asiakas
                 + DWS IQ Aegis (linkki)    (compliance manager, CTO)

aegis.eu         DWS IQ Aegis               EU sovereign/defense-ostaja
                                            (CISO, puolustushankinnat,
                                            kriittinen infra)

dwsconnect.com   DWS IQ Connect OÜ          Globaali asiakas + sijoittaja
                                            (US VC, UAE/Gulf, APAC)
────────────────────────────────────────────────────────────────
```

**Strateginen logiikka:**

| Domain         | Kieli/tyyli        | CTA                            | Sijoittajatarina     |
| -------------- | ------------------ | ------------------------------ | -------------------- |
| dws10.com      | EU enterprise, FI  | Book a demo / Compliance audit | Lifetime Oy (FI)     |
| aegis.eu       | Formaalinen, EN/FI | Request briefing / RFP         | Ei julkinen hinnasto |
| dwsconnect.com | Startup, EN        | Try free / Investor deck       | Connect OÜ (EE)      |

**Miksi aegis.eu on erillinen domain:**

- EU-ostaja (CISO, hallinto) hakee nimenomaan `.eu`-domainia —
  se signaloi datan residenssiä ja EU-lainsäädännön noudattamista
- Selkeyttää, ettei Aegis ole SaaS-tuote vaan erikoisratkaisu
- Erottaa puolustussektorin hankinnan normaalista SaaS-myynnistä

**Miksi dwsconnect.com on erillinen domain:**

- Connect OÜ on eri yhtiö — oma domain vahvistaa juridista erottelua
- US/UAE-sijoittajat näkevät itsenäisen yhtiön, ei "Lifetime Oy:n sivutuotteen"
- `.com` sopii globaalille skaalautuvuudelle; `.eu` tai `.fi` rajoittaisi mielikuvaa

---

## CHANGES MADE (v1.4, v1.5, v1.6)

- Lisätty Luku 7: Aspire 9.x → 13.x paralleli DWS:n versioloikalle —
  CLI-first, polyglot, agent-native; DWS CLI vs. aspire CLI -vertailu
- Lisätty Luku 8: Enterprise-tason muutospaine — irtisanomistarve +
  strateginen investointi yhtä aikaa; Nokia Defence Tier-1 asiakas
  upotetulla teknologiatasolla; DGX Spark muille sektoreille;
  suojatun strategia-alustan moat-analyysi

## THINGS I DIDN'T TOUCH

- Luvut 1–6: pysyvät ennallaan
- Aegis-hinnoittelu: Nokia Defence erikoissopimus, muut EUR 59,990 + EUR 999/kk
- LWM V1 tekninen stack: V1_LWM.md -viite pysyy

## POTENTIAL CONCERNS

- **Nokia Defence -salassapito:** Tämä dokumentti on INTERNAL.
  Nokia Defence -maininta ei saa päätyä julkisille sivuille tai
  pitch deck -materiaaliin ilman erikseen sovittua NDA:ta.
- **DGX Spark -saatavuus:** NVIDIA tuotantokapasiteetti rajoitettu.
  Asiakastoimitusten aikataulu riippuu laitetoimitusten varmistamisesta.
- **EU AI Act Article 12 -vaatimukset defence-ympäristössä:**
  Puolustusvoimien järjestelmät voivat olla EU AI Act -soveltamisalan
  ulkopuolella (Article 2(3)). Tarkista juridiset rajoitukset ennen
  Nokia Defence -sopimuksen viimeistelyä.

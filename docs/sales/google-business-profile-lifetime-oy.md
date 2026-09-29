---
title: Google-yritysprofiili — Lifetime Oy, Espoo — tuotteet ja tarjoukset yrityksille
version: 1.1
date: 2026-09-28
status: DRAFT — HIC-hyväksyntä ennen julkaisua profiiliin
source_of_truth: dws10.com/config/products.json (priceVersion 1.33, lastUpdated 2026-09-25)
profile: https://maps.app.goo.gl/Zk4p139hmzXV6WaJ6
owner: Risto Anton Päärni, Founder, CEO, Lifetime Oy
---

# Google-yritysprofiili — Lifetime Oy: tuotteet ja tarjoukset yrityksille

Liitettävä sisältö Google-yritysprofiilin **Tuotteet**-osioon (15 tuotetta: 7 pk-yrityksille + 8 Firehorse-kaupasta) ja **Tarjous**-päivityksiin
(3 tarjousta). Hinnat ja tuotekuvaukset tulevat `dws10.com/config/products.json` v1.33:sta; muuta
hintaa vain sinne ja päivitä tämä tiedosto samalla.

**Syöttöpolku:** Google-haku "Lifetime Oy" (kirjautuneena profiilin omistajana) → _Muokkaa tuotteita_
→ _Lisää tuote_. Tarjoukset: _Lisää päivitys_ → _Lisää tarjous_.

**Googlen kenttärajat:** tuotteen nimi ≤ 58 merkkiä, kuvaus ≤ 1 000 merkkiä, tarjouksen otsikko
≤ 58 merkkiä. Kaikki alla olevat mahtuvat rajoihin.

**Hinnat:** kaikki ALV 0 %. Google näyttää pelkän hinnan, joten ALV-merkintä on kuvauksessa.

## Tuonti (import) Merchant Centeristä

Käsin syöttö ei ole ainoa tie. Tuotteet voi tuoda profiiliin Google Merchant Centerin kautta:

- **Tuotesyöte:** `https://dws10.com/feeds/google-products.xml` (67 tuotetta, `generate-feed.cjs`).
- **Myymäläsyöte:** `https://dws10.com/feeds/local-inventory.tsv`, store code `8496329`
  (`generate-local-inventory.cjs`). Google hakee sen 24 h välein.
- **Yhteys profiiliin:** Merchant Center → _Asetukset → Linkitetyt tilit → Google-yritysprofiili_ →
  valitse Lifetime Oy, jonka myymäläkoodi on `8496329`. Tämän jälkeen syötteen tuotteet näkyvät
  profiilin _Tuotteet_-osiossa ilman käsin syöttöä.
- **Syöte ei vie:** tilaustuotteet (`type: subscription/monthly`), koska Merchant Center vaatii
  niille erillisen hyväksynnän. Niitä ovat tässä dokumentissa DWS IQ Free, Omnichannel &
  Multimodal ja Signed Reports; ne lisätään käsin. Tarjous-päivitykset tehdään aina käsin.
- **Korjattu 28.9.2026:** myymäläsyötteestä puuttui 12 tuotetta (mm. kotisivut, verkkokauppa ja
  IT-tuki), koska sitä ei generoitu uudelleen hinnaston muuttuessa. Nyt `update-store.yml`
  generoi sen joka hinnastomuutoksella.

## Tuoteluokat (luo ensin)

1. Verkkosivut ja verkkokauppa
2. IT-tuki yrityksille
3. Tekoäly yrityksille
4. Firehorse — vaatimustenmukaisuus ja markkinointi

## Tuotteet

### 1. Kotisivut yritykselle — Website Starter

- **Luokka:** Verkkosivut ja verkkokauppa
- **Hinta:** 650 €
- **Painike:** Tilaa verkossa → `https://dws10.com/products/lifetime-web-starter.fi.html`
- **Lähde:** `LIFETIME-WEB-STARTER`

```text
Ammattimaiset kotisivut uudelle tai kasvavalle yritykselle. Moderni ulkoasu, toimii puhelimella ja tietokoneella, hakukoneystävällinen ja nopea. Valmis pohja, nopea käyttöönotto ja julkaisu.

Sisältää:
• Responsiivinen, moderni ulkoasu
• Mobiilioptimointi kaikille laitteille
• Hakukonevalmius ja nopea latautuminen
• Käyttöönotto ja julkaisu

A5-kampanjahinta 650 € (ALV 0 %), −40 % ohjevähittäishinnasta 1 084 €. Kertamaksu.
Lifetime Oy, Espoo.
```

### 2. Pieni verkkokauppa hinnastolla — Webstore Mini

- **Luokka:** Verkkosivut ja verkkokauppa
- **Hinta:** 350 €
- **Painike:** Tilaa verkossa → `https://dws10.com/products/lifetime-webstore-mini.fi.html`
- **Lähde:** `LIFETIME-WEBSTORE-MINI`

```text
Kompakti verkkokauppa pienyritykselle, joka haluaa aloittaa myynnin verkossa. Kauppa pystyyn valmiilla pohjalla, tuoteluettelo ja hinnasto mukana.

Sisältää:
• Verkkokaupan käyttöönotto valmiilla pohjalla
• Tuoteluettelo ja hinnasto
• Valmius maksujen vastaanottoon
• Mobiilioptimoitu kauppa
• Perusvarastonhallinta

A5-kampanjahinta 350 € (ALV 0 %), −40 % ohjevähittäishinnasta 584 €. Kertamaksu.
Lifetime Oy, Espoo.
```

### 3. IT-tuki pk-yritykselle — tuntipankki 10 h

- **Luokka:** IT-tuki yrityksille
- **Hinta:** 750 €
- **Painike:** Tilaa verkossa → `https://dws10.com/products/lifetime-it-tuki-10h.fi.html`
- **Lähde:** `LIFETIME-IT-TUKI-10H`

```text
IT-tuki pienille ja keskisuurille yrityksille yhdestä numerosta. 10 tunnin tuntipankki, 75 €/h. Kokenut suomenkielinen asiantuntija, ei alihankintaa. Espoo ja pääkaupunkiseutu.

Tuntipankilla hoituu:
• Tietokoneiden uusiminen
• Ohjelmistojen päivitykset
• Yrityssovellukset
• Tietoturva
• Koulutus

750 € = 10 h × 75 €/h (ALV 0 %).
Lifetime Oy, Espoo · +358 400 319 010
```

### 4. Tekoälypäivä yritykselle — Captain Day

- **Luokka:** Tekoäly yrityksille
- **Hinta:** 1 200 €
- **Painike:** Lisätietoja → `https://dws10.com/products/ai-consultant-day.fi.html`
- **Lähde:** `ai-consultant-day`

```text
Päivä kokeneen konsultin kanssa; lähdette mukananne toimiva tuotos. Kehystämme tekoälystrategianne, rakennamme prototyypin Claudella, GPT:llä, Geminillä tai Copilotilla, ja päivän lopussa käytössänne on valmis tuotos: vaatimustenmukaisuuden aukkoraportti, agenttiprototyyppi tai suvereniteettiarvio.

• Yksi päivä → yksi valmis tuotos
• Paikan päällä tai etänä
• Tulosperusteinen: jos tuotos ei valmistu samana päivänä, hinta alenee

1 200 € / päivä (ALV 0 %).
Lifetime Oy, Espoo.
```

### 5. Tekoälylukutaidon koulutus (EU AI Act, art. 4)

- **Luokka:** Tekoäly yrityksille
- **Hinta:** 499 €
- **Painike:** Lisätietoja → `https://dws10.com/products/firehorse-coach.fi.html`
- **Lähde:** `firehorse-coach`

```text
Tekoälylukutaidon koulutus johdolle ja tiimeille (EU:n tekoälysäädös, artikla 4) sekä maksuton kolmen tunnin valmiustyöpaja.

EU:n tekoälysäädöksen 4 artikla edellyttää tekoälylukutaitoa koko organisaatiolta, ei vain kehittäjiltä. Koulutus henkilökohtaisesti, tiimille tai etänä.

• Artiklan 4 mukainen osaamiskoulutus
• Maksuton 3 tunnin valmiusarvio
• Johto ja tiimit samalla kielellä

499 € (ALV 0 %).
Lifetime Oy, Espoo.
```

### 6. Claude Code -luento yrityksen tiimille (1 päivä)

- **Luokka:** Tekoäly yrityksille
- **Hinta:** 1 900 €
- **Painike:** Lisätietoja → `https://dws10.com/products/claude-code-coaching-lecture.fi.html`
- **Lähde:** `claude-code-coaching-lecture`

```text
Yhden päivän luento agenttipohjaisesta ohjelmistokehityksestä Claude Codella johdolle ja kehittäjille. Tiimi saa yhteisen sanaston: insinöörikurin 12 sääntöä, kontekstin hallinta, MCP-työkalut ja GREEN/YELLOW/RED-luottamusraja.

• Yrityksen omissa tiloissa, enintään 12 osallistujaa
• Insinöörikurin 12 sääntöä agenttityöhön
• EU:n tekoälysäädöksen 4 artiklan lukutaito tiimille

1 900 € (ALV 0 %).
Lifetime Oy, Espoo.
```

### 7. DWS IQ Free — CSRD-raportoinnin aloitus maksutta

- **Luokka:** Tekoäly yrityksille
- **Hinta:** jätä tyhjäksi (kuvaus kertoo ehdot)
- **Painike:** Lisätietoja → `https://dws10.com/products/dwsiq-free.fi.html`
- **Lähde:** `DWS-IQ-FREE-2026`

```text
Yksi CSRD-projekti maksutta: enintään 50 ESG-riviä, 1 käyttäjä, ei luottokorttia.

Aloita vastuullisuusraportointi ilman sitoumusta. Kun raja täyttyy, voit siirtyä DWS IQ Report -tuotteeseen (1 999 €, ALV 0 %).

Lifetime Oy, Espoo.
```

## Firehorse-kauppa

Luokka kaikille: **Firehorse — vaatimustenmukaisuus ja markkinointi** (luo neljänneksi luokaksi).
Tuotteet 8–13 tulevat profiiliin myös Merchant Center -tuonnilla (ks. _Tuonti_); 14–15 ovat
tilauksia, joita syöte ei vie, joten ne lisätään käsin.

### 8. Firehorse Amplify — ESG-datan automaatio

- **Hinta:** 4 950 €
- **Painike:** Lisätietoja → `https://dws10.com/products/fh-auto-001.fi.html`
- **Lähde:** `FH-AUTO-001`

```text
Tapahtumaohjatut työnkulut keräävät ESG-datan suoraan järjestelmistänne täydellisellä kirjausketjulla. Fit for 55, CSRD ja EPBD 2028.

• Tapahtumaohjatut vaatimustenmukaisuuden työnkulut
• Ei käsin syötettävää dataa
• Täydellinen kirjausketju ESG-datalle

4 950 € / projekti (ALV 0 %).
Firehorse · Lifetime Oy, Espoo.
```

### 9. Firehorse Omnichannel Next — vastuullinen markkinointi

- **Hinta:** 499 €
- **Painike:** Lisätietoja → `https://dws10.com/products/fh-omni-001.fi.html`
- **Lähde:** `FH-OMNI-001`

```text
Tekoälypohjainen markkinointi, joka tarkistaa jokaisen väitteen EU:n tekoälysäädöstä ja viherväitedirektiiviä vasten.

• Tekoälypohjainen markkinointimoottori
• EU AI Act- ja viherväitevaatimusten mukainen
• 4 viikon pilottikampanja mitattavin tuloksin

499 € / kampanjasykli (ALV 0 %).
Firehorse · Lifetime Oy, Espoo.
```

### 10. DWS IQ Report — Fit for 55 -raporttipohja

- **Hinta:** 1 999 €
- **Painike:** Lisätietoja → `https://dws10.com/products/fh-rpt-001.fi.html`
- **Lähde:** `FH-RPT-001`

```text
Automatisoitu Fit for 55 -raporttipohja SAP-integraatiolla ja neljän viikon validoinnilla.

• Automatisoidut Fit for 55 -kojelaudat
• SAP-integraatio ja reaaliaikainen data
• 4 viikon validointi sisältyy

1 999 € / raporttipohja (ALV 0 %).
Firehorse · Lifetime Oy, Espoo.
```

### 11. Firehorse Content Management — näyttöarkisto

- **Hinta:** 2 999 €
- **Painike:** Lisätietoja → `https://dws10.com/products/fh-cms-001.fi.html`
- **Lähde:** `FH-CMS-001`

```text
Näyttöarkisto: vaatimustenmukaisuusasiakirjat tagitetaan automaattisesti, sertifikaattien vanheneminen hälyttää ja haku löytää sisällön.

• Automaattisesti tagitetut asiakirjat
• Hälytys ennen sertifikaatin vanhenemista
• Semanttinen haku koko aineistoon

2 999 € käyttöönotto ja siirto (ALV 0 %).
Firehorse · Lifetime Oy, Espoo.
```

### 12. AI Customer Agent — asiakaspalveluagentti

- **Hinta:** 499 €
- **Painike:** Lisätietoja → `https://dws10.com/products/firehorse-flow.fi.html`
- **Lähde:** `firehorse-flow`

```text
Asiakaspalveluagentti, joka parantaa jokaista asiakaskohtaamista; käyttöön ja ensimmäiset tulokset kahdessa viikossa.

• Tekoälyavusteiset asiakaskohtaamiset
• Palvelun jatkuva optimointi
• Tulokset alle 2 viikossa

499 € käyttöönotto (ALV 0 %).
Firehorse · Lifetime Oy, Espoo.
```

### 13. Firehorse Data Services — datasta tuloa

- **Hinta:** 899 €
- **Painike:** Lisätietoja → `https://dws10.com/products/firehorse-data-services.fi.html`
- **Lähde:** `firehorse-data-services`

```text
Datatuotteet, datan välitysstrategia ja rikastus, jotka tekevät operatiivisesta datasta tuloa.

• API-pohjaiset datatuotteet
• Datan kaupallistamisen strategia
• Konsultointi etänä tai paikan päällä

899 € (ALV 0 %).
Firehorse · Lifetime Oy, Espoo.
```

### 14. Firehorse Omnichannel & Multimodal AI -avustaja

- **Hinta:** 699 €
- **Painike:** Lisätietoja → `https://dws10.com/products/omnichannel-multimodal.fi.html`
- **Lähde:** `omnichannel-multimodal`

```text
Kampanjoiden hallinta kaikissa markkinointikanavissa päivittäisellä mittauksella ja optimoinnilla.

• Tekoälyoptimoitu kampanjanhallinta
• Päivittäinen tulosmittaus
• Automaattinen kanavaoptimointi

699 € / kk (ALV 0 %), kuukausitilaus.
Firehorse · Lifetime Oy, Espoo.
```

### 15. Firehorse Signed Reports — sähköallekirjoitus

- **Hinta:** 199 €
- **Painike:** Lisätietoja → `https://dws10.com/products/firehorse-signed-reports.fi.html`
- **Lähde:** `FH-SIGN-001`

```text
DocuSign-sähköallekirjoitukset Firehorse-raportteihin: laatija, tarkastaja ja tilintarkastaja allekirjoittavat järjestyksessä.

• DocuSign-allekirjoitus kaikkiin Firehorse-raportteihin
• Monivaiheinen allekirjoitus (laatija → tarkastaja → tilintarkastaja)
• Allekirjoitettu PDF ja kirjausketju

199 € / vuosi (ALV 0 %), lisäosa DWS IQ Report -tuotteeseen.
Firehorse · Lifetime Oy, Espoo.
```

## Tarjoukset (Tarjous-päivitykset)

Tarjouksen alku- ja loppupäivä ovat pakollisia kenttiä Googlessa. A5-kampanjalle ei ole
`products.json`:ssa loppupäivää (`docs/field-notes/2026-09-20-campaign-a5-master.md:254-256`:
"Define campaign validity window … Set campaign end date in products.json" on avoin). Alla
loppupäivä on **HIC-päätös** — ehdotus 31.12.2026.

### Tarjous 1 — Kotisivut −40 %

- **Otsikko:** `Kotisivut yritykselle 650 € (−40 %)`
- **Alku / loppu:** 28.9.2026 / _HIC päättää (ehdotus 31.12.2026)_
- **Linkki:** `https://dws10.com/products/lifetime-web-starter.fi.html`

```text
Ammattimaiset, mobiilioptimoidut ja hakukonevalmiit kotisivut yritykselle A5-kampanjahintaan 650 € (ALV 0 %). Ohjevähittäishinta 1 084 €. Kertamaksu, valmis pohja, nopea käyttöönotto.
```

**Ehdot:**

```text
Hinta ALV 0 %, yritysasiakkaille. Kampanjahinta voimassa tarjouksen päättymispäivään asti. Lifetime Oy, Y-tunnus 0772407-9.
```

### Tarjous 2 — Verkkokauppa −40 %

- **Otsikko:** `Pieni verkkokauppa 350 € (−40 %)`
- **Alku / loppu:** 28.9.2026 / _HIC päättää (ehdotus 31.12.2026)_
- **Linkki:** `https://dws10.com/products/lifetime-webstore-mini.fi.html`

```text
Aloita myynti verkossa: verkkokauppa, tuoteluettelo ja hinnasto A5-kampanjahintaan 350 € (ALV 0 %). Ohjevähittäishinta 584 €. Kertamaksu.
```

**Ehdot:**

```text
Hinta ALV 0 %, yritysasiakkaille. Kampanjahinta voimassa tarjouksen päättymispäivään asti. Lifetime Oy, Y-tunnus 0772407-9.
```

### Tarjous 3 — Maksuton tekoälyn valmiustyöpaja

- **Otsikko:** `Maksuton 3 h tekoälyn valmiustyöpaja`
- **Alku / loppu:** 28.9.2026 / _HIC päättää (ehdotus 31.12.2026)_
- **Linkki:** `https://dws10.com/products/firehorse-coach.fi.html`

```text
EU:n tekoälysäädöksen 4 artikla edellyttää tekoälylukutaitoa koko henkilöstöltä. Tilaa tekoälylukutaidon koulutus (499 €, ALV 0 %) ja saat maksuttoman kolmen tunnin valmiustyöpajan, jossa arvioimme tiimisi lähtötason.
```

**Ehdot:**

```text
Työpaja sisältyy EU AI Act -lukutaitokoulutuksen tilaukseen. Hinta ALV 0 %, yritysasiakkaille. Lifetime Oy, Y-tunnus 0772407-9.
```

## Rajaukset

- Mukaan otettu vain pk-yrityksille suoraan ostettavat, aktiiviset tuotteet. Arkistoitu
  `professional-web-pages` (750 €, korvattu `LIFETIME-WEB-STARTER`:lla 25.09.2026) jätetty pois.
- Suuryritystuotteet (Aegis, LAND-_, IND-_, laitteisto) eivät kuulu paikalliseen yritysprofiiliin;
  ne myydään dws10.com:n kautta.
- `CMP-T0` (pilotti 1 €) jätetty pois: 1 €:n hinta näyttäisi profiilissa virheeltä.
- `FH-SKILL-T3` (Firehorse Skilled Agents, 5 499 €/kk) jätetty pois: tuotetiedoissa "internal sign-off
  required before quoting".
- Kuvat: tuotteilla 4–7 ja 9–15 on kuva (`dws10.com/static/images/products/`). Tuotteilta 1–3 puuttuu kuva, ja tuotteen 8 (Amplify) kuva `static/images/firehorse-amplify-hero.png` puuttuu repositoriosta.

---

## VERSION AND AGENT HISTORY

- **v1.1** (2026-09-28) [Latest] — Firehorse-kaupan 8 tuotetta; Merchant Center -tuonnin ohje; myymäläsyötteen korjaus. Claude Code.
- **v1.0** (2026-09-28) [not latest] — Ensimmäinen versio: 7 tuotetta, 3 tarjousta Google-yritysprofiiliin, lähde products.json v1.33. Claude Code.

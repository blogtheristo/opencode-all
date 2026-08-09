# Organisaation hankintakansio — kerrosmalli ostajalle

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: claude/organisaation-hankintakansio-57efio | Date: 09.08.2026 | Changes: Ensimmäinen versio. Suomenkielinen ostajanäkymä hankintakansion kerrosmalliin: organisaatio → AI-hallintajärjestelmä → alusta/infrastruktuuri → data → ohjelmistoketju → autonominen agentti. Sisältö johdettu `Legal/KYA_S1_v1.3.md` §7:n taulukosta (kerrokset ja mitä kukin jättää auki) ja §2–§6:n seitsemästä kontrollialueesta; suomenkieliset kontrollikysymykset noudattavat `docs/blog-drafts/kya-s1-one-signed-page.fi.md`:n sanamuotoja. Ei uusia normatiivisia väitteitä — tämä dokumentti ei määrittele kontrolleja, vaan järjestää olemassa olevat ostajan kansioksi.

Document Status:

- Created: 09.08.2026
- Last Modified: 09.08.2026
- Language: Finnish
- Languages Available: FI
- Publication Status: DRAFT
- Classification: PUBLIC
- Document Type: Buyer-Facing Procurement Guide

Related Documents:

- `Legal/KYA_S1_v1.3.md` v1.3 (KYA-S1 -spesifikaatio — tämän dokumentin kanoninen lähde, §7 kerrosmalli)
- `Legal/KYA_STANDARD_v1.md` v1.11 (toteutuskäsikirja — sisäinen)
- `docs/blog-drafts/kya-s1-one-signed-page.fi.md` (suomenkieliset kontrollikysymykset)
- `DWS_TRUTH_STANDARD.md` rivi 7 (KYA-pisteytys), rivi 30 (HIC / artikla 14), rivi 31 (artikla 50)

---

**Lifetime Oy | DWS IQ -alusta**
**Dokumentti:** Hankintakansion kerrosmalli v1.0
**Status:** Luonnos — täydentää KYA-S1 v1.3:a, ei korvaa sitä

---

## 1. Kerrosmalli yhdellä silmäyksellä

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ORGANISAATION HANKINTAKANSIO                    │
├──────────────────────────┬─────────────────────────────────────────────┤
│ Taso                     │ Standardit ja dokumentit                    │
├──────────────────────────┼─────────────────────────────────────────────┤
│ Organisaatio             │ SOC 2 Type 2, ISO/IEC 27001                 │
│ AI-hallintajärjestelmä   │ ISO/IEC 42001                               │
│ Alusta / Infrastruktuuri │ FedRAMP, DISA IL5/IL6                       │
│ Data                     │ GDPR, CSRD-todisteet, ISO/IEC 27701         │
│ Ohjelmistoketju (Supply) │ SBOM-regiimit, MA-S2                        │
├──────────────────────────┼─────────────────────────────────────────────┤
│ AUTONOMINEN AGENTTI      │ KYA-S1 v1.3 (IDV, BHM, REG, TC4, FLT, TRS, PRV) │
└──────────────────────────┴─────────────────────────────────────────────┘
```

Viisi ylintä riviä ovat jokaisessa yritysostossa jo nyt. Alin rivi on se, jota kansiossa ei ennen ollut — ja se on ainoa rivi, joka kuvaa toimijaa eikä ympäristöä.

## 2. Mitä kukin kerros todistaa ja mitä se jättää auki

Pareittain asettelu on havainnollistava, ei sopimusoikeudellinen. Kanoninen taulukko: `Legal/KYA_S1_v1.3.md` §7.

| Taso                     | Standardit ja dokumentit                                        | Mitä se todistaa                                                         | Mitä se jättää auki                                                     |
| ------------------------ | --------------------------------------------------------------- | ------------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| Organisaatio             | SOC 2 Type 2, ISO/IEC 27001                                     | Että toimittajayrityksellä on hallitut tietoturvakäytännöt               | Autonomisen agentin käyttäytymisen ajonaikana                           |
| AI-hallintajärjestelmä   | ISO/IEC 42001                                                   | Että tekoälyn kehittämiselle ja käytölle on johtamisjärjestelmä          | Istuntokohtaisen identiteettisidoksen ja ketjun katkaisun               |
| Alusta / infrastruktuuri | FedRAMP, DISA IL5/IL6                                           | Että ajoympäristö täyttää määritellyn turvaluokan                        | Agentin identiteettisidoksen ihmiseen                                   |
| Data                     | GDPR, CSRD-todisteet, ISO/IEC 27701                             | Että henkilötietojen ja kestävyystiedon käsittely on säädetty            | Päätöksen alkuperän ja toistettavuuden                                  |
| Ohjelmistoketju          | SBOM-regiimit, haavoittuvuudenhallinta (esim. Palantirin MA-S2) | Että toimitetut komponentit ovat tunnettuja ja niiden viat jäljitettäviä | Agentin, sen takana olevan ihmisen ja vasteen luottamuksen romahdukseen |
| **Autonominen agentti**  | **KYA-S1 v1.3**                                                 | **Kuka on agentin takana, mitä se saa tehdä, miten se pysäytetään**      | —                                                                       |

Kolme laajennusaluetta (FLT, TRS, PRV) eivät vastaa mitään yllä olevaa kerrosta, koska niiden ratkaisemat ongelmat syntyvät vasta kun toimija on autonominen agentti (`Legal/KYA_S1_v1.3.md` §7).

## 3. Alin rivi auki — seitsemän tarkastettua kohtaa

Neljä ydinaluetta (IDV, BHM, REG, TC4) ja kolme laajennusaluetta (FLT, TRS, PRV). Jokainen on kysymys, jonka ostaja esittää ennen kuin agentti pääsee käsiksi hänen dataansa.

| Tunnus  | Kysymys hankinnassa                                           | Alue                         |
| ------- | ------------------------------------------------------------- | ---------------------------- |
| **IDV** | Tiedetäänkö, kuka teon takana on?                             | Identiteetin todentaminen    |
| **BHM** | Onko agenttia koeteltu oikeilla hyökkäyksillä?                | Käyttäytymisen valvonta      |
| **REG** | Osaatko sanoa juuri nyt, mitkä agentit koskevat dataasi?      | Elävä agenttirekisteri       |
| **TC4** | Kun jokin menee pieleen, kuinka nopeasti koko ketju pysähtyy? | Ketjun katkaisu              |
| **FLT** | Jos päädytään käräjille, kuka vastaa mistä?                   | Vastuunjaon luokittelu       |
| **TRS** | Onko lupa voimassa nyt, vai myönnettiinkö se viime keväänä?   | Elävä luottamuspistemäärä    |
| **PRV** | Voiko päätöksen toistaa kahden vuoden päästä?                 | Päätöksen alkuperä ja toisto |

## 4. Mitä kansioon pyydetään

Yksi sivu agenttia kohti. Sivulla on toimittajan nimi, riippumattoman arvioijan nimi, arviointipäivä, seitsemän tarkastettua kohtaa ja päivämäärä, jolloin paperi vanhenee.

Pyydä nämä samassa lauseessa:

1. **Taso** — Pronssi, Hopea vai Kulta (`Legal/KYA_S1_v1.3.md` §8).
2. **Arvioijan nimi** — riippumaton taho, joka ei myy sinulle sitä tuotetta.
3. **Arviointipäivä ja vanhenemispäivä.**

Ilman näitä kolmea kyseessä on markkinointiväite. Itsearviointi ei kelpaa yhdessäkään kohdassa: todisteen on oltava ulkopuolinen tarkastus, allekirjoitettu alustatelemetria, riippumattoman arvioijan lukema arkkitehtuurikuvaus tai sopimuksessa määritelty palvelutaso, jonka mittaustapa on kirjattu (`Legal/KYA_S1_v1.3.md` §3).

## 5. Kaksi rajausta, jotka on syytä sanoa ääneen

**KYA-S1 ei korvaa ylempiä rivejä.** Se ei ole SOC 2 Type 2:n, FedRAMPin, DISA IL5/IL6:n, ISO/IEC 27001:n, ISO/IEC 42001:n eikä EU:n tekoälyasetuksen vaatimustenmukaisuusarvioinnin korvike. Se asettuu niiden rinnalle agentti-identiteetin ja -käyttäytymisen kerrokseksi (`Legal/KYA_S1_v1.3.md` §2).

**KYA-S1 ei täytä tekoälyasetusta.** Arviointi tuottaa aineistoa, joka on artiklojen 12, 14 ja 50 kannalta merkityksellistä, mutta se ei täytä niitä. Toimittaja, joka sanoo "olemme KYA-S1:n mukaisia, siis olemme tekoälyasetuksen mukaisia", väittää enemmän kuin spesifikaatio antaa (`Legal/KYA_S1_v1.3.md` §4).

**Lifetime Oy ei myönnä KYA-S1-kirjettä omalle alustalleen eikä väitä mitään tasoa** ennen kuin riippumaton arvioija allekirjoittaa. Sama sääntö sitoo talon, joka spesifikaation kirjoitti.

## 6. Kommenttikausi

KYA-S1 v1.3 on luonnos, jonka julkinen kommenttikausi on avoinna **4.11.2026 asti**. Hankintakansion kerrosmalli seuraa spesifikaation versiota: jos §7:n taulukko muuttuu, tämä dokumentti päivitetään lukkoaskelin.

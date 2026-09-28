# 2026 todistusvuosi — mitä pitää olla totta 31.12.2026

---

# VERSION AND AGENT HISTORY

Version: 1.1 [Latest]

Sessions & Modifications:

- Version: 1.1 [Latest] | Tool: Claude Code | Session: claude/proof-year-2026-03ist6 | Date: 28.09.2026 | Changes: Määritelmät lukittu (referenssi ei ole nimetön tapauskuvaus; learning delta = ulkoinen Verified Decision Journey); 2027 volyymivuoden ehto lisätty. | Harness: Claude Code + CLAUDE.md + DWS_TRUTH_STANDARD | HIC-approved-drift: none
- Version: 1.0 [not latest] | Tool: Claude Code | Session: claude/proof-year-2026-03ist6 | Date: 28.09.2026 | Changes: HIC 28.09.2026 kirjasi 2026:n listan: "Läpimurtovuosi" on sisäinen lause, ja se läpäisee testin vain, jos 31.12.2026 mennessä on totta neljä asiaa. Jokaiselle kohdalle on kirjattu määritelmä, todiste, nykytila ja takaraja taaksepäin laskettuna. | Harness: Claude Code + CLAUDE.md + DWS_TRUTH_STANDARD | HIC-approved-drift: none

Document Status:

- Created: 28.09.2026
- Status: ACTIVE — HIC:n päätös 28.09.2026
- Owner: Risto Anton Päärni (HIC)
- Katselmointi: joka maanantai `/retro`-rytmissä; loppuarvio 31.12.2026

---

## Periaate (HIC 28.09.2026, sanatarkasti)

> "Läpimurtovuosi" on sisäinen lause, koska ulospäin se sanoo "ei vielä". Sillä on yksi testi: mikä pitää olla totta 31.12.2026, että 2027 voi olla läpimurto? Jos vastaus on "ei mikään", se on slogan. Jos vastaus on "yksi maksettu pilotti toimitettu hyväksyntäpöytäkirjoineen, yksi referenssi, DWS IQ 7 Aegis GA ja yksi todennettu learning delta", niin 2026 on todistusvuosi ja 2027 volyymivuosi. Se jako toimii vain jos 2026:n lista on kirjattu.

Ulospäin ei sanota "läpimurtovuosi". 31.12.2026 jokainen kohta on joko totta ja todistettavissa tiedostolla tai ei totta. Osittaista ei ole.

## Lista

| #   | Mikä on totta 31.12.2026                                   | Määritelmä (mikä lasketaan)                                                                                                                                                                                                                                                    | Todiste                                                                                                          | Tila 28.09.2026                                                                                                    |
| --- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| 1   | Yksi maksettu pilotti toimitettu hyväksyntäpöytäkirjoineen | DWS-AEGIS-PILOT-001 asiakkaalle, lasku maksettu, hyväksyntätesti ajettu asiakkaan kohteessa ja pöytäkirja allekirjoitettu (PASS tai NEGATIVE_RESULT; kumpikin on toimitettu pilotti). Maksuton pilotti ei lasketa.                                                             | Allekirjoitettu hyväksyntäpöytäkirja, allekirjoitettu hyväksyntätietue (`verify-bundle` läpi), maksukuitti       | Ei allekirjoitettua sopimusta. Tarjousluonnokset Kemiralle ja Outokummulle odottavat HIC:n hyväksyntää (PR #2230). |
| 2   | Yksi referenssi                                            | Asiakas on kirjallisesti antanut luvan käyttää nimeään tai lainaustaan referenssinä, joko julkisesti tai nimettynä ostajakeskusteluissa.                                                                                                                                       | Kirjallinen referenssilupa                                                                                       | Ei yhtään. Nykyisissä tarjouksissa ei ole referenssilupaehtoa.                                                     |
| 3   | DWS IQ 7 Aegis GA                                          | Yleisesti saatavilla: G0–G10 kaikki 1.00 (`docs/plans/AEGIS_PILOT_95_READINESS_PLAN.md`), M4 todistajan läsnä ollessa tehty staging-hyväksyntä reunalaitteistolla, tietoturvakatselmus läpi, tuote ja hinta katalogissa (`dws10.com/config/products.json`), runbook julkaistu. | Valmiussuunnitelman pistetaulukko 100 %, M4-hyväksyntätietue, katselmusraportti, katalogirivi                    | Valmius 71 % (#2225 yhdistetty, C1 valmis). 95 %:n tavoite 25.10.2026, P80 08.11.2026.                             |
| 4   | Yksi todennettu learning delta                             | Verified Decision Journey (`docs/plans/2026-09-24-decision-journey-outcome-evidence.md` §3): ulkoisen organisaation ketju havainnosta `OWNERSHIP_CONFIRMED` → päätös → toimenpide → `OUTCOME_RECORDED` → `LEARNING_DELTA_CREATED` → `ONTOLOGY_UPDATED`, ketjun tiiviste ehjä.  | `decision_journey_paths.is_verified = true` yhdelle ulkoiselle journeylle; `decision_journey_verify_chain` tyhjä | Nolla todellista ketjua. Kemira-esimerkki (§5.2) on havainnollistus, ei kirjattu tapahtuma.                        |

## Määritelmät on lukittu

Kohtien määritelmät yllä ovat mittari. Väljempiä muotoiluja ei hyväksytä jälkikäteen:

- **Referenssi** on asiakkaan kirjallinen lupa käyttää nimeään tai lainaustaan. Turvallisuusluokitellussa kohteessa riittää lupa nimetä asiakas ostajakeskusteluissa salassapitosopimuksen alla. Nimetön tapauskuvaus ei ole referenssi.
- **Learning delta** on repossa määritelty Verified Decision Journey ulkoisesta organisaatiosta. Sisäinen "opimme tämän" -havainto ei täytä kohtaa.

## 2027: volyymivuosi

Kun kaikki neljä kohtaa ovat totta, 2027 on toistettavaa myyntiä ja käyttöönottoja samalla arkkitehtuurilla, ei kokeilua. Jos yksikin kohta puuttuu, 2027:n alku käytetään sen todistamiseen ennen volyymia.

## Mitä tämä vaatii taaksepäin laskettuna

**Kohta 1 on aikataulultaan kriittisin, ja se ratkeaa lokakuussa.** Pilotin maksulliset vaiheet 1–4 kestävät 11 viikkoa (77 päivää). Hyväksyntätesti tarvitsee asiakkaan henkilöstön paikalle, joten realistinen viimeinen testipäivä on noin 18.12.2026.

| Välietappi                                 | Viimeistään                                             | Peruste                                                               |
| ------------------------------------------ | ------------------------------------------------------- | --------------------------------------------------------------------- |
| Vaihe 0 (maksuton rajaus) käyty            | 30.09–09.10.2026                                        | Vaihe 0 kestää enintään 2 viikkoa, ja se voi limittyä sopimukseen     |
| **Pilottisopimus allekirjoitettu**         | **02.10.2026** (tavoite), **15.10.2026** (ehdoton raja) | 18.12 − 77 pv = 02.10; 31.12 − 77 pv = 15.10                          |
| Hyväksyntätesti asiakkaan kohteessa        | 18.12.2026                                              | Ennen joulutaukoa                                                     |
| Referenssilupa pyydetty                    | Sopimuksen allekirjoituksessa                           | Referenssi seuraa hyväksyttyä pilottia; lupaehto kuuluu sopimukseen   |
| M4 staging-hyväksyntä (GA-edellytys)       | 25.10.2026 (P80 08.11.2026)                             | Valmiussuunnitelma                                                    |
| GA                                         | 30.11.2026                                              | M4 + tietoturvakatselmus + katalogi + runbook; jättää kuukauden varaa |
| Ensimmäinen ulkoinen decision journey auki | 31.10.2026                                              | Learning delta tarvitsee lopputuloksen; lopputulos tarvitsee aikaa    |

**Ristiriita, joka on sanottava ääneen (Rule 7):** jos sopimus allekirjoitetaan 15.10.2026 jälkeen, nykyisellä 3 kuukauden pilotilla kohta 1 ei toteudu vuonna 2026. Vaihtoehtoja on kaksi, eikä kumpaakaan ole valittu:

1. Pidetään pilotin sisältö ja hyväksytään, että kohta 1 voi siirtyä tammikuulle 2027.
2. Tiivistetty aikataulu yhdelle ensimmäiselle asiakkaalle, jossa hyväksyntätesti on viikolla 8. Rajaus ja hinta pysyvät samoina, ja riski on meidän.

## Riippuvuudet kohtien välillä

- Kohta 2 edellyttää kohtaa 1 (referenssi syntyy toimitetusta pilotista).
- Kohta 4 voi syntyä samasta asiakkaasta: pilotin vaihe 0 on luonnostaan decision journey (havainto → omistajuuden vahvistus → päätös). Tämä kannattaa kirjata `decision_journey`-tauluun alusta alkaen.
- Kohta 3 ei riipu asiakkaasta, mutta kohta 1 ilman kohtaa 3 tarkoittaa pilottia keskeneräisellä tuotteella; hyväksyntätietue kertoo silloin eristystason rehellisesti.

## Mitä tämä ei ole

Tämä ei ole ennuste eikä ulospäin annettava lupaus. Tämä on sisäinen mittari. Jos kohta ei ole totta 31.12.2026, se kirjataan sellaisena, eikä sitä muotoilla uudelleen.

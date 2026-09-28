# 2026 todistusvuosi — mitä pitää olla totta 31.12.2026

---

# VERSION AND AGENT HISTORY

Version: 1.3 [Latest]

Sessions & Modifications:

- Version: 1.3 [Latest] | Tool: Claude Code | Session: claude/proof-year-2026-03ist6 | Date: 28.09.2026 | Changes: HIC-päätös kirjattu: vuonna 2026 toteutetaan vain DWS IQ 7 Aegis Pilot. | Harness: Claude Code + CLAUDE.md | HIC-approved-drift: none
- Version: 1.2 [not latest] | Tool: Claude Code | Session: claude/proof-year-2026-03ist6 | Date: 28.09.2026 | Changes: Boardy 28.09.2026: kohta 3 = julkaisuehdokas 2026, GA Q1 2027 pilotin hyväksyntätietueen jälkeen; kohta 4 = ulkoinen päätöspolku (2. askelma), learning delta 2027; asiakastapausten tila kirjattu; rajaus pitää. HIC-periaate säilytetty sanatarkasti. | Harness: Claude Code + CLAUDE.md + DWS_TRUTH_STANDARD | HIC-approved-drift: none
- Version: 1.1 [not latest] | Tool: Claude Code | Session: claude/proof-year-2026-03ist6 | Date: 28.09.2026 | Changes: Määritelmät lukittu (referenssi ei ole nimetön tapauskuvaus; learning delta = ulkoinen Verified Decision Journey); 2027 volyymivuoden ehto lisätty. | Harness: Claude Code + CLAUDE.md + DWS_TRUTH_STANDARD | HIC-approved-drift: none
- Version: 1.0 [not latest] | Tool: Claude Code | Session: claude/proof-year-2026-03ist6 | Date: 28.09.2026 | Changes: HIC 28.09.2026 kirjasi 2026:n listan: "Läpimurtovuosi" on sisäinen lause, ja se läpäisee testin vain, jos 31.12.2026 mennessä on totta neljä asiaa. Jokaiselle kohdalle on kirjattu määritelmä, todiste, nykytila ja takaraja taaksepäin laskettuna. | Harness: Claude Code + CLAUDE.md + DWS_TRUTH_STANDARD | HIC-approved-drift: none

Document Status:

- Created: 28.09.2026
- Status: ACTIVE — HIC:n päätös 28.09.2026
- Owner: Risto Anton Päärni (HIC)
- Katselmointi: joka maanantai `/retro`-rytmissä; loppuarvio 31.12.2026

---

## Päätös (HIC 28.09.2026)

> **Päätös: toteutamme nyt vain DWS IQ 7 Aegis Pilotin vuonna 2026.**

Vuonna 2026 toimitetaan vain DWS-AEGIS-PILOT-001. Kaikki työ, myynti mukaan lukien, arvioidaan sen mukaan, viekö se tätä listaa eteenpäin. Muita tuotteita ei toimiteta eikä tarjota vuonna 2026. Katalogi (`dws10.com/config/products.json`), Store ja sivustot sisältävät yhä muita tuotteita; niiden muuttaminen vaatii erillisen HIC-hyväksynnän (Store/katalogi on RED-vyöhyke).

## Periaate (HIC 28.09.2026, sanatarkasti)

> "Läpimurtovuosi" on sisäinen lause, koska ulospäin se sanoo "ei vielä". Sillä on yksi testi: mikä pitää olla totta 31.12.2026, että 2027 voi olla läpimurto? Jos vastaus on "ei mikään", se on slogan. Jos vastaus on "yksi maksettu pilotti toimitettu hyväksyntäpöytäkirjoineen, yksi referenssi, DWS IQ 7 Aegis GA ja yksi todennettu learning delta", niin 2026 on todistusvuosi ja 2027 volyymivuosi. Se jako toimii vain jos 2026:n lista on kirjattu.

Ulospäin ei sanota "läpimurtovuosi". 31.12.2026 jokainen kohta on joko totta ja todistettavissa tiedostolla tai ei totta. Osittaista ei ole.

## Lista

| #   | Mikä on totta 31.12.2026                                              | Määritelmä (mikä lasketaan)                                                                                                                                                                                                                                                                         | Todiste                                                                                                    | Tila 28.09.2026                                                                                                    |
| --- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| 1   | Yksi maksettu pilotti toimitettu hyväksyntäpöytäkirjoineen            | DWS-AEGIS-PILOT-001 asiakkaalle, lasku maksettu, hyväksyntätesti ajettu asiakkaan kohteessa ja pöytäkirja allekirjoitettu (PASS tai NEGATIVE_RESULT; kumpikin on toimitettu pilotti). Maksuton pilotti ei lasketa.                                                                                  | Allekirjoitettu hyväksyntäpöytäkirja, allekirjoitettu hyväksyntätietue (`verify-bundle` läpi), maksukuitti | Ei allekirjoitettua sopimusta. Tarjousluonnokset Kemiralle ja Outokummulle odottavat HIC:n hyväksyntää (PR #2230). |
| 2   | Yksi referenssi                                                       | Asiakas on kirjallisesti antanut luvan käyttää nimeään tai lainaustaan referenssinä, joko julkisesti tai nimettynä ostajakeskusteluissa.                                                                                                                                                            | Kirjallinen referenssilupa                                                                                 | Ei yhtään. Nykyisissä tarjouksissa ei ole referenssilupaehtoa.                                                     |
| 3   | DWS IQ 7 Aegis julkaisuehdokas (RC); GA Q1 2027                       | RC: G0–G10 vähintään 95 % (`docs/plans/AEGIS_PILOT_95_READINESS_PLAN.md`), M4 todistajan läsnä ollessa tehty staging-hyväksyntä reunalaitteistolla, tietoturvakatselmus läpi. GA tulee vasta, kun ensimmäisen pilotin hyväksyntätietue on olemassa ja sen havainnot on viety tuotteeseen (Q1 2027). | M4-hyväksyntätietue, katselmusraportti, pistetaulukko ≥ 95 %                                               | Valmius 71 % (#2225 yhdistetty, C1 valmis). 95 %:n tavoite 25.10.2026, P80 08.11.2026.                             |
| 4   | Yksi ulkoinen päätöspolku (tikkaiden 2. askelma); learning delta 2027 | Ulkoisen organisaation `decision_journey`, jossa on `OBSERVATION_RECORDED` → `OWNERSHIP_CONFIRMED` → päätös (`PATH_ACCEPTED` tai `SKU_PURCHASED`), ketjun tiiviste ehjä. Lopputulos (`OUTCOME_RECORDED`) ja learning delta ovat 2027:n askelmia.                                                    | Journey-ketju, `decision_journey_verify_chain` tyhjä                                                       | Nolla todellista ketjua. Kemira-esimerkki (§5.2) on havainnollistus, ei kirjattu tapahtuma.                        |

## Korjaus 1.2 (Boardy 28.09.2026): lista oli ristiriidassa itsensä kanssa

- **GA ennen pilotin evidenssiä.** Versiossa 1.1 GA oli 30.11.2026 ja ensimmäinen hyväksyntätesti noin 18.12.2026, eli GA olisi julkaistu ennen kuin tiedetään, mitä pilotti opetti. Kohta 3 on nyt julkaisuehdokas (RC) vuodelle 2026, ja GA siirtyy Q1 2027:ään, pilotin hyväksyntätietueen jälkeen.
- **Learning delta on tikkaiden ylin askelma.** Tikkaat ovat havainto → päätöspolku → lopputulos → learning delta. Kolmen kuukauden pilotti tuottaa realistisesti ensimmäisen tai toisen askelman. Vuoden 2026 lattia on toinen askelma: yksi ulkoinen päätöspolku, jossa omistaja on vahvistettu ja päätös tehty. Lopputulos ja learning delta ovat 2027:n askelmia.
- **Asiakastapaukset tänään.** Kemira on omistajuuskysymys, ei pilotti: Maria ei ole vastannut, eikä pilottitarjousta ole lähetetty. Outokumpu on toinen tapaus: toukokuun viesteihin ei ole kirjattu vastausta. Kohta 1 edellyttää, että toinen näistä etenee sopimukseen lokakuussa.
- **Pilotin rajaus pitää.** Ensimmäinen työnkulku ei ole säätö- tai annostelulupa. Prosessinohjaus rikkoisi rajauksen (agentti tuottaa päätöksiä ja tietueita, ei käytä fyysistä laitetta; tehtaan hätäpysäytys on eri kerros) ja hämärtäisi pysäytysväitteen.

## Määritelmät on lukittu

Kohtien määritelmät yllä ovat mittari. Väljempiä muotoiluja ei hyväksytä jälkikäteen:

- **Referenssi** on asiakkaan kirjallinen lupa käyttää nimeään tai lainaustaan. Turvallisuusluokitellussa kohteessa riittää lupa nimetä asiakas ostajakeskusteluissa salassapitosopimuksen alla. Nimetön tapauskuvaus ei ole referenssi.
- **Päätöspolku** (kohta 4) on ulkoisen organisaation kirjattu ketju, jossa omistaja on vahvistettu ja päätös tehty. Sisäinen havainto ei täytä kohtaa. Learning delta (2027) on repossa määritelty Verified Decision Journey.

## 2027: volyymivuosi

Kun kaikki neljä kohtaa ovat totta, 2027 alkaa GA:lla (Q1) ja on toistettavaa myyntiä ja käyttöönottoja samalla arkkitehtuurilla, ei kokeilua. Jos yksikin kohta puuttuu, 2027:n alku käytetään sen todistamiseen ennen volyymia.

## Mitä tämä vaatii taaksepäin laskettuna

**Kohta 1 on aikataulultaan kriittisin, ja se ratkeaa lokakuussa.** Pilotin maksulliset vaiheet 1–4 kestävät 11 viikkoa (77 päivää). Hyväksyntätesti tarvitsee asiakkaan henkilöstön paikalle, joten realistinen viimeinen testipäivä on noin 18.12.2026.

| Välietappi                                 | Viimeistään                                             | Peruste                                                                         |
| ------------------------------------------ | ------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Vaihe 0 (maksuton rajaus) käyty            | 30.09–09.10.2026                                        | Vaihe 0 kestää enintään 2 viikkoa, ja se voi limittyä sopimukseen               |
| **Pilottisopimus allekirjoitettu**         | **02.10.2026** (tavoite), **15.10.2026** (ehdoton raja) | 18.12 − 77 pv = 02.10; 31.12 − 77 pv = 15.10                                    |
| Hyväksyntätesti asiakkaan kohteessa        | 18.12.2026                                              | Ennen joulutaukoa                                                               |
| Referenssilupa pyydetty                    | Sopimuksen allekirjoituksessa                           | Referenssi seuraa hyväksyttyä pilottia; lupaehto kuuluu sopimukseen             |
| M4 staging-hyväksyntä (RC-edellytys)       | 25.10.2026 (P80 08.11.2026)                             | Valmiussuunnitelma                                                              |
| Julkaisuehdokas (RC)                       | 30.11.2026                                              | M4 + tietoturvakatselmus; GA vasta pilotin hyväksyntätietueen jälkeen (Q1 2027) |
| Ensimmäinen ulkoinen decision journey auki | 31.10.2026                                              | Learning delta tarvitsee lopputuloksen; lopputulos tarvitsee aikaa              |

**Ristiriita, joka on sanottava ääneen (Rule 7):** jos sopimus allekirjoitetaan 15.10.2026 jälkeen, nykyisellä 3 kuukauden pilotilla kohta 1 ei toteudu vuonna 2026. Vaihtoehtoja on kaksi, eikä kumpaakaan ole valittu:

1. Pidetään pilotin sisältö ja hyväksytään, että kohta 1 voi siirtyä tammikuulle 2027.
2. Tiivistetty aikataulu yhdelle ensimmäiselle asiakkaalle, jossa hyväksyntätesti on viikolla 8. Rajaus ja hinta pysyvät samoina, ja riski on meidän.

## Riippuvuudet kohtien välillä

- Kohta 2 edellyttää kohtaa 1 (referenssi syntyy toimitetusta pilotista).
- Kohta 4 voi syntyä samasta asiakkaasta: pilotin vaihe 0 on luonnostaan decision journey (havainto → omistajuuden vahvistus → päätös). Tämä kannattaa kirjata `decision_journey`-tauluun alusta alkaen.
- Kohta 3 ei riipu asiakkaasta, mutta kohta 1 ilman kohtaa 3 tarkoittaa pilottia keskeneräisellä tuotteella; hyväksyntätietue kertoo silloin eristystason rehellisesti.

## Mitä tämä ei ole

Tämä ei ole ennuste eikä ulospäin annettava lupaus. Tämä on sisäinen mittari. Jos kohta ei ole totta 31.12.2026, se kirjataan sellaisena, eikä sitä muotoilla uudelleen.

---
title: Todistusvelvollisuus — ulkoisten väitteiden evidenssirekisteri
version: 1.0
created: 2026-08-03
last_modified: 2026-08-03
author: Risto Anton Päärni (Lifetime Oy)
language: fi
classification: INTERNAL
publication_status: ACTIVE
document_type: Evidence Register
---

# Todistusvelvollisuus — ulkoisten väitteiden evidenssirekisteri

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 5) | Session: claude/patria-sales-outreach-iyvb7o | Date: 03.08.2026 | Changes: Rekisteri luotu Patria/Kimmo Kakko -motionin yhteydessä. Auditoijalle puhuttaessa jokainen väite on testattava; tämä tiedosto kertoo mitkä väitteet kestävät testin, mitkä eivät, ja **mitä tietoa meiltä puuttuu**. Tarkastettu: Admin/PITUKRI_AUDIT_REPORT.md, Legal/KYA_STANDARD_v1.md, Lifetime Fleet/Fleet Admiral/KYA_STANDARD_v1.4_MANIFEST.md.

Document Status:
  - Created: 03.08.2026
  - Classification: INTERNAL — ei jaeta ulos sellaisenaan
  - Related: DWS_TRUTH_STANDARD.md, docs/TRACTION_CANONICAL.md, sales-outreach/ONEPAGER_KATAKRI_KIMMO_KAKKO_PATRIA.md

***

## 0. Miksi tämä tiedosto on olemassa

`DWS_TRUTH_STANDARD.md` kertoo **mikä on kanoninen fakta**. Tämä tiedosto kertoo eri asian: **onko väitteelle olemassa evidenssi, jonka voi laittaa ulkopuolisen arvioijan eteen** — ja jos ei ole, mitä puuttuu ja kenen pitää se hankkia.

Ero on ratkaiseva silloin kun vastapuoli on auditoija. Kanoninen sisäinen luku ei ole todiste. Auditoija testaa ensimmäisenä sen väitteen, joka on helpoiten testattavissa — ja jos se kaatuu, kaikki muu menettää uskottavuuden samalla kertaa.

**Sääntö:** jos evidenssiä ei voi näyttää samassa hetkessä kun väite esitetään, väitettä ei esitetä. Ei kirjeessä, ei diassa, ei puhelussa.

**Statusluokat**

| Status              | Merkitys                                                                          |
| ------------------- | ----------------------------------------------------------------------------------- |
| `NÄYTETTÄVISSÄ`     | Dokumentti on olemassa repossa ja kestää katsomisen sellaisenaan                    |
| `OSIN`              | Dokumentti on, mutta se ei todista sitä mitä väite väittää                          |
| `TAVOITE`           | Suunnittelutavoite tai roadmap-päivä. Sanotaan **vain** tavoitteena, ei saavutuksena |
| `PUUTTUU`           | Evidenssiä ei ole. Väite on kiellettyjen listalla kunnes se hankitaan               |

---

## 1. Rekisteri — mitä väitetään, mitä on kädessä

| # | Väite ulospäin                                       | Vaadittu evidenssi                                                        | Mitä repossa on                                                                                                    | Status         |
| - | ---------------------------------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | -------------- |
| 1 | "PiTuKri-auditointi tehty"                           | Auditointiraportti: **kuka teki**, päivä, laajuus, poikkeamat               | `Admin/PITUKRI_AUDIT_REPORT.md` (30.03.2026, päiv. 03.04.2026): 52 kriteeriä, **81 % / 42:52**, 7 kriteeriä ei täyty | **OSIN** ⚠️     |
| 2 | "Kill-switch alle 5 ms" (laivasto < 50 ms)           | Mittausmenetelmä, testiympäristö, toistettava ajo, tulosaineisto           | `Lifetime Fleet/.../KYA_STANDARD_v1.4_MANIFEST.md:99` sanoo **"Kill-switch latency target"** — tavoite, ei mittaus   | **TAVOITE** ⚠️  |
| 3 | "ISO 27001 Q3/2026, SOC 2 Type II Q4/2026"           | Sertifikaatti tai auditoijan sopimus + aikataulu                           | Roadmap-päiviä; ei sertifikaattia                                                                                    | **TAVOITE**    |
| 4 | "AI Act artikla 12 -auditointijälki"                 | Lokinäyte: kentät, muuttumattomuus, säilytysaika, vientimuoto              | Arkkitehtuuri ja standardikuvaus olemassa; **säilytyspolitiikkaa ei ole kirjattu**                                   | **OSIN**       |
| 5 | "Suomalainen hosting, ei US-pilviriippuvuutta"       | Alue-/sopimusdokumentaatio, aliprosessorilista                             | Hosting-alue dokumentoitu; **aliprosessorilistaa ei ole tarkistettu tässä sessiossa**                                | **OSIN**       |
| 6 | "Agenttikohtainen MicroVM-eristys"                   | Arkkitehtuurikuva + ajonaikainen todiste (prosessi-/instanssinäkymä)       | Arkkitehtuuri kuvattu KYA-standardissa                                                                               | **OSIN**       |
| 7 | "KYA — todennettu agentti-identiteetti"              | Identiteetin myöntö- ja peruutusprosessi, esimerkkitietue                  | `Legal/KYA_STANDARD_v1.md` kuvaa mallin                                                                              | **NÄYTETTÄVISSÄ** (mallina, ei tuotantonäyttönä) |
| 8 | "EU dual-use (as. 2021/821) luokittelun päätösevidenssi" | Esimerkkitietue: luokittelu, perustelu, tekijä, aikaleima             | Konsepti kuvattu; **tuotantotason esimerkkiä ei ole**                                                                | **PUUTTUU**    |
| 9 | ITAR/EAR-kattavuus                                    | —                                                                          | —                                                                                                                    | **EI VÄITETÄ LAINKAAN** |

---

## 2. Mitä meiltä puuttuu — nimetty lista

Tämä on tiedoston tärkein osa. Nämä puutteet ovat todellisia, ja ne kerrotaan itse ennen kuin vastapuoli löytää ne.

### 2.1 PiTuKri-raportti ei ole ulkopuolinen auditointi

`Admin/PITUKRI_AUDIT_REPORT.md` on **itsearviointi**, jonka on tuottanut AI-agenttisessio (Claude Code, 30.03.2026) — ei riippumaton auditoija, ei akkreditoitu arviointilaitos. Se on hyvä sisäinen työkalu ja huono ulkoinen todiste.

Sanamuoto, joka kestää: *"Olemme tehneet PiTuKri v1.1 -itsearvioinnin 52 kriteeriä vastaan; 81 % täyttyy, 7 kriteeriä ei täyty. Ulkopuolista auditointia ei ole tehty."*
Sanamuoto, joka ei kestä: *"PiTuKri tehty."*

Raportin omat kriittiset aukot, jotka on kerrottava jos aihe nousee:

- Ei muodollista ISMS-dokumenttia (ISO 27001 -gap-analyysi kesken).
- **Ei muodollista henkilöturvallisuusselvitysprosessia.** ← tämä on juuri se kohta, jota KATAKRI-auditoija kysyy ensimmäisenä.
- Reunalaitteiden fyysistä turvallisuutta ei ole dokumentoitu muodollisesti.
- **Vuoden 2026 penetraatiotestiä ei ole tehty** (viimeisin Q4/2025).

### 2.2 Alle 5 ms on tavoite, ei mittaustulos

Lähde sanoo sanatarkasti *"Kill-switch latency target"*. Repossa **ei ole** mittausraporttia: ei menetelmää, ei ympäristön kuvausta, ei toistettavaa ajoa, ei tulosaineistoa. Kunnes sellainen on, luku sanotaan muodossa *"suunnittelutavoite on alle 5 ms; mittausraporttia ei ole vielä julkaistavassa muodossa"* — tai jätetään kokonaan sanomatta.

### 2.3 Muut puuttuvat evidenssit

| Puuttuu                                            | Kuka hankkii   | Mitä ilman sitä ei voi sanoa                          |
| -------------------------------------------------- | -------------- | -------------------------------------------------------- |
| Kill-switch-latenssin mittausraportti              | Tekninen / HIC | Mitään numeroa katkaisunopeudesta                        |
| Ulkopuolinen PiTuKri- tai KATAKRI-arvio            | HIC            | "Auditoitu" ilman tarkennetta *itsearviointi*             |
| 2026 penetraatiotesti                              | HIC            | "Testattu" turvallisuusväitteissä                        |
| Artikla 12 -lokin säilytyspolitiikka               | Tekninen       | "Todistettavissa vuoden päästä"                          |
| Aliprosessorilista (ajantasainen)                  | HIC            | "Ei US-riippuvuutta" ilman varaumaa                      |
| Dual-use-luokittelun tuotantotason esimerkkitietue | Tekninen       | Että kyvykkyys on olemassa — tällä hetkellä se on konsepti |
| Henkilöturvallisuusselvitysprosessi                | HIC            | Mitään henkilöstöturvallisuuden kontrollivastetta        |

---

## 3. Käyttö puhelussa ja kirjeessä

1. **Ennen jokaista ulkoista väitettä:** etsi rivi tästä taulukosta. Jos status ei ole `NÄYTETTÄVISSÄ`, käytä sen rivin sallittua sanamuotoa.
2. **Puutteet kerrotaan itse.** Auditoija arvostaa enemmän sitä, että puute nimetään ennen kuin hän löytää sen, kuin sitä että kaikki näyttää valmiilta.
3. **Uusi väite → uusi rivi.** Jos jokin väite halutaan ulos eikä sitä ole tässä, se lisätään tänne ennen kuin se sanotaan ääneen.
4. **Kun evidenssi valmistuu**, status päivitetään ja rivin sallittu sanamuoto vahvistuu. Statuksen nosto vaatii tiedoston, ei muistikuvaa.

## 4. Suhde muihin standardeihin

| Tiedosto                    | Vastaa kysymykseen                          |
| --------------------------- | -------------------------------------------- |
| `DWS_TRUTH_STANDARD.md`     | Mikä on kanoninen fakta?                     |
| `docs/TRACTION_CANONICAL.md`| Mitä asiakas- ja liikevaihtolukuja saa sanoa? |
| **tämä tiedosto**           | **Onko väitteelle todiste — ja jos ei, mitä puuttuu?** |

<!--
VERSION AND AGENT HISTORY
Document: ONEPAGER_KATAKRI_KIMMO_KAKKO_PATRIA.md
Version: 2.0
Last-Updated: 2026-08-03
Author: Risto Anton Päärni (Lifetime Oy)
Agent: Claude Code (claude-opus-5)
Purpose: Yhden sivun puhelupohja Kimmo Kakon (KATAKRI Chief Auditor,
         Laurea; Manager, Factory Security, Protected Mobility, Patria)
         30 min gap-assessment -keskusteluun. Ei myyntimateriaali:
         arviointikohteen kuvaus + rehellinen evidenssistatus + aukot,
         jotka pyydetään hänen osoittavan.
         Kirje joka lähetettiin: LETTER_KIMMO_KAKKO_PATRIA_FI.md v3.0.
         Suunnitelma: INTRO_KIMMO_KAKKO_PATRIA.md v3.0.
Käyttö:  Ei lähetetä etukäteen liitteenä. Tämä on Riston oma pohja; jos
         Kimmo pyytää jotain kirjallista, lähetetään vasta puhelun
         jälkeen ja vain se osa, jonka evidenssi on kädessä.
Muutos v1.0 -> v2.0 (03.08.2026): HIC toimitti Katakri 2020 -esityksen.
         Vaatimustunnukset eivät ole enää arvattuja vaan oikeita
         (hakemisto: docs/KATAKRI_2020_VAATIMUSHAKEMISTO.md). Samalla
         korjattiin oma väite: KATAKRI EI ole tyhjä ei-inhimillisen
         toimijan osalta — I-06 kohta 3 kattaa automaattiset prosessit ja
         I-07 tunnistaa laitteet ja tietojärjestelmät. Todellinen aukko on
         kapeampi ja tarkempi (ks. §Korjaus).
Branch: claude/patria-sales-outreach-iyvb7o
Owner: risto.paarni@lifetime.fi
-->

# Puhelupohja — KATAKRI-arviointi, 30 min

**Kysymys jonka esitin:** missä kohdissa tämä ei vielä kestä KATAKRI-arviointia.
**Hänen roolinsa puhelussa:** riippumaton aukkojen etsijä. Ei asiakas, ei kanava.
**Minun roolini:** kuvaan arviointikohteen ja pidän evidenssistatuksen rehellisenä. En puolustele.

## Aikajako

| min   | Mitä                                                                                              |
| ----- | ------------------------------------------------------------------------------------------------- |
| 0–5   | Hän puhuu: onko ongelma todellinen, mikä evidenssistandardi teillä oikeasti ratkaisee              |
| 5–15  | Minä: arviointikohde (alla), 3 minuuttia per kerros, ei diaesitystä                                |
| 15–27 | Hän: mikä ei kestä. Kirjaan sanatarkasti, en vastaa perusteluilla                                 |
| 27–30 | Seuraava askel — vain jos hän sanoo ongelman olevan todellinen                                    |

## Arviointikohde yhdellä lauseella

Ei-inhimillinen toimija (AI-agentti) toimii ei-turvaluokitellussa toimittaja- tai suunnitteluworkflow'ssa, ja jokainen sen toimenpide tuottaa evidenssin, jonka pitäisi kestää ulkopuolisen arvioijan tarkastus.

## Korjaus omaan lähtöoletukseen — sano tämä puhelun alussa

Väitin kirjeessä, että KATAKRI ei tunne ei-inhimillistä toimijaa. Luettuani kriteeristön se on liian karkea väite, ja korjaan sen itse:

- **I-06 kohta 3** sanoo sanatarkasti, että tietojenkäsittely-ympäristön käyttäjille **ja automaattisille prosesseille** annetaan vain välttämättömät oikeudet. Automaattinen prosessi on siis jo kriteeristössä.
- **I-07** edellyttää, että ympäristöä käyttävät **henkilöt, laitteet ja tietojärjestelmät** tunnistetaan riittävän luotettavasti. Agentti tunnistetaan järjestelmänä.

**Todellinen aukko on kapeampi:** **I-06 kohta 2** myöntää käyttöoikeudet **henkilöille**, joiden käsittelyoikeuksista on varmistuttu **T-13**:n mukaisesti, ja **T-10** (henkilöstön luotettavuuden arviointi) koskee vain ihmisiä. Agentti saa siis oikeudet järjestelmänä, mutta sen *tiedonsaantitarve* periytyy henkilöltä, jota kriteeristö ei nimeä. Kysymykseni on tämä sauma — ei se, että kontrolleja puuttuisi.

**Soveltamisalan kysymys ensin:** KATAKRI arvioi **turvallisuusluokitellun tiedon** käsittelyä. Ehdottamani aloitus on ei-turvaluokiteltu toimittajatyönkulku — jolloin KATAKRI ei muodollisesti sovellu lainkaan. Kysyn häneltä, mikä silloin on oikea mittapuu.

## Kartta: agenttikysymys → oikea vaatimustunnus

Tunnukset lähteestä `docs/KATAKRI_2020_VAATIMUSHAKEMISTO.md` (Katakri 2020). **Pyydän häntä korjaamaan tämän kartan** — se on puhelun konkreettisin tuotos.

| Kysymys ei-inhimillisestä toimijasta                        | Vaatimus                     | Mitä DWS tekee                                                                    | Evidenssistatus                                     |
| ------------------------------------------------------------ | ---------------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------- |
| Kuka omistaa agentin, kuka hyväksyy sen käyttöönoton?        | **T-01, T-02, T-04**         | Nimetty omistaja, hyväksyntäketju, ohjeistus                                        | Suunnittelutason malli                              |
| Miten agentin riski arvioidaan? Entä toimitusketju (malli, komponentit)? | **T-03** → **I-01, I-12, I-13** | Toimivalta rajattu työnkulkukohtaisesti                                       | Osin — riskiluokittelu ei ole KATAKRI-muotoinen     |
| Agentilla ei ole turvallisuusselvitystä — mikä korvaa sen?   | **T-10, T-13, I-06 k. 2**    | KYA-identiteetti + agentin valtuuttanut henkilö kirjautuu                            | **Ydinkysymys hänelle** — hyväksytäänkö tämä sauma  |
| Miten agentti tunnistetaan ympäristössä?                     | **I-07**                     | Todennettu agentti-identiteetti; TL III–II vaatisi lisäksi laite-/2FA-tason          | Osin — TL-tason tunnistusta ei ole toteutettu       |
| Saako agentti liikaa oikeuksia?                              | **I-06 k. 3, I-02, I-08**    | Vähimmät oikeudet per työnkulku, eristetty ajo                                       | Näytettävissä arkkitehtuurina                       |
| Mitä agentti teki — todistettavissa jälkikäteen?             | **I-10**                     | AI Act artikla 12 -päätösloki: tekijä, aika, syöte, päätös                            | Rakenne näytettävissä; **säilytyspolitiikka kesken** |
| Huomataanko väärinkäyttö, ja toivutaanko siitä?              | **I-11**                     | Poikkeamien havainnointi, yksittäisen agentin valtuuksien katkaisu                    | Katkaisun **latenssiväitettä ei sanota** (ei mittausta) |
| Kuka valtuutti sen kyvykkyyden, jota agentti käytti tänään?  | **I-16**                     | Kyvykkyysmuutos kirjautuu tekijän ja ajan kanssa                                     | Osin — auditointinäkymä puuttuu                     |
| Päivitykset ja haavoittuvuudet mallin/ajoympäristön osalta?  | **I-19**                     | Päivityspolitiikka ajoympäristölle                                                   | Osin                                                |
| Missä data on ja kenen lainkäyttöalueella?                   | **I-18, I-05, I-12**         | Suomalainen konesali, yhden vuokralaisen ajo, salaus                                 | Osin — aliprosessorilista tarkistamatta             |
| Poikkeamat ja niiden ilmoittaminen                           | **T-07, T-06**               | Poikkeama kirjautuu; kill-switch on hallittu tapahtuma                               | Suunnittelutason malli                              |
| Fyysinen puoli, jos reunalaitteita on tehtaalla              | **F-04, F-05, F-06**         | Ei fyysistä pääsyä nykymallissa; reunalaite olisi oma kysymyksensä                   | Ei sovellu vielä — sanotaan suoraan                 |

## Mitä EN sano ellei evidenssi ole ruudulla samassa hetkessä

Täysi rekisteri: **`docs/TODISTUSVELVOLLISUUS.md`**. Tarkastettu 03.08.2026 — tulos alla, ja se on ankarampi kuin oletettiin:

| Väite                     | Todellinen tilanne repossa                                                                                            | Sallittu sanamuoto puhelussa                                                                                     |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| PiTuKri-auditointi tehty  | `Admin/PITUKRI_AUDIT_REPORT.md` on **AI-session tekemä itsearviointi**, ei ulkopuolinen auditointi. 81 % (42/52), 7 ei täyty | "Olemme tehneet PiTuKri v1.1 **-itsearvioinnin**; 81 % täyttyy, 7 kriteeriä ei. Ulkopuolista auditointia ei ole tehty." |
| Katkaisu alle 5 ms        | Lähde sanoo **"latency target"** — tavoite. Mittausraporttia ei ole                                                     | "Suunnittelutavoite on alle 5 ms; mittausraporttia ei ole julkaistavassa muodossa." Tai jätä sanomatta.             |
| ISO 27001 / SOC 2         | Roadmap-päiviä, ei sertifikaattia                                                                                       | Vain kysyttäessä, vain tavoitteena                                                                                  |
| Artikla 12 -jälki         | Rakenne kuvattu; **säilytyspolitiikkaa ei ole kirjattu**                                                                | Näytä lokirakenne, sano säilytyspolitiikka keskeneräiseksi                                                          |

**Kerro nämä itse ennen kuin hän kysyy** — erityisesti itsearviointi-tarkennus ja se, että itsearviointi itse listaa puuttuvan henkilöturvallisuusselvitysprosessin ja tekemättömän 2026 penetraatiotestin. Auditoija arvostaa nimettyä puutetta enemmän kuin siloteltua kokonaisuutta, ja hän löytää sen joka tapauksessa.

Sääntö: **jos sitä ei voi näyttää puhelun aikana, sitä ei sanota.**

## Viisi kysymystä hänelle (tärkeysjärjestyksessä)

1. Ei-turvaluokitellussa toimittajatyönkulussa KATAKRI ei muodollisesti sovellu. **Mikä on silloin oikea mittapuu** — ja muuttuuko vastaus TL IV:ssä?
2. **I-06 k. 2 + T-13:n sauma:** agentti saa oikeudet järjestelmänä, mutta tiedonsaantitarve periytyy henkilöltä. Riittääkö, että T-13-luetteloon merkitään agentin valtuuttanut henkilö — vai onko tämä kategorinen este?
3. **I-10:** mikä lokirakenne ja säilytys kestää *sinun* tarkastuksesi vuoden päästä?
4. Mikä on ensimmäinen asia, jonka hylkäisit tästä mallista?
5. Onko ongelma ylipäätään todellinen Patrian kokoluokan toimijalle — vai ratkaistaanko se politiikalla ja se riittää?

## Mitä en pyydä tässä puhelussa

- En pyydä esittelyä Patrian sisällä. Jos hän tarjoaa, otan vastaan.
- En pyydä turvaluokiteltua tietoa, ohjelmatietoa enkä auditointilöydöksiä. Jos hän kertoo, en kirjaa niitä.
- En puhu hinnasta ellei hän kysy.
- En väitä ITAR/EAR-kattavuutta. EU:n kaksikäyttöasetus (2021/821) on se, mistä puhun.
- En esitä alustaa hankintakelpoisena puolustuskäyttöön.

## Puhelun jälkeen (samana päivänä)

1. Hänen löytämänsä aukot kirjataan sanatarkasti tähän tiedostoon uutena §-lohkona — tuotekehityksen syöte, ei vastaväitteitä joita kumotaan.
2. Jos hän nimesi evidenssistandardin, se ohjaa seuraavan version — ei meidän oletuksemme.
3. Kiitosviesti ilman liitteitä. Materiaali vasta jos hän pyytää, ja vain evidenssin kattama osa.

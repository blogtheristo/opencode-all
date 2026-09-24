# Ehdotus: lifetime.fi puhuu tuloksista — kolmen sivuston työnjako

**Version:** 1.4 · **Date:** 2026-09-24 · **Status:** PROPOSAL — HIC review · **Author:** Claude Code (v1.1 tarkennus HIC + Copilot 24.09.2026)

## 0. Strategia (HIC + Copilot 24.09.2026, v1.4 lopullinen)

**Neljä kerrosta, ei kilpailua:**

| Kerros         | Sivusto                                         | Vastaa kysymykseen                                                                            | Sisältö                                                                                                                                                                              | Ei koskaan                                                                 |
| -------------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| **WHY**        | lifetime.fi                                     | Miksi tämä kaikki on tärkeää? Mihin maailma on menossa? Miten yritykset liittyvät muutokseen? | One Lifetime -ajattelu, kestävä kehitys, ilmastonmuutos, tulevaisuuden liiketoiminta, digitalisaation merkitys, tekoälyn vaikutukset, visio, lyhyet esseet, näkemykset, tiivistelmät | tuotteita, hinnastoja, verkkokauppaa, ominaisuuslistoja, konversiosuppiloa |
| **UNDERSTAND** | onelifetime.world/blog (Lifetime Scope Journal) | Selitä tämä minulle yksityiskohtaisesti.                                                      | pitkät blogit, tutkimukset, käsitteet, sanastot, vertailut, tapaustutkimukset; viidellä kielellä                                                                                     | myyntiä, hintoja                                                           |
| **HOW**        | dws10.com                                       | Miten tämä tehdään käytännössä?                                                               | palvelut, tuotteet, arkkitehtuurit, toimialaratkaisut, konsultointi                                                                                                                  | –                                                                          |
| **BUY**        | dws10.com/buy                                   | Mitä voin ostaa juuri nyt?                                                                    | hankinta, hinnat, tarjoukset, kampanjat                                                                                                                                              | –                                                                          |

**One Lifetime -brändin merkitys (HIC):** elämän ainutkertaisuus, yksi planeetta, kestävä kehitys, ilmastonmuutoksen pysäyttäminen ja korjaaminen teknisin keinoin, teknologia ihmisen ja ympäristön hyväksi, tasapaino talouden, luonnon ja ihmisen välillä. Siksi lifetime.fi ei ole hyötysivu (v1.1–1.3 rooli oli liian pieni) vaan **koko ekosysteemin tarkoituksen, suunnan ja ymmärryksen yläkerros**. Etusivu kertoo tarinan.

**Raja WHY:n ja UNDERSTAND:in välillä (jotta ne eivät ala kilpailla):** lifetime.fi sanoo väitteen ja suunnan enintään n. 600 sanalla; Journal selittää saman 1 500–4 000 sanalla, lähteineen, viidellä kielellä. Jos lifetime.fi sanoo "tekoäly voi auttaa yrityksiä vähentämään resurssien hukkaa", Journalissa on teksti, joka näyttää miten. Jokainen lifetime.fi:n väite linkittää yhteen Journal-tekstiin.

**Palaute Copilotin malliin (Rule 7, ristiriidat auki):**

1. Hyväksyn WHY / UNDERSTAND / HOW / BUY -jaon. Se on ensimmäinen malli, joka vastaa sekä brändiä että liiketoimintarakennetta.
2. `dws10.com/buy` on olemassa repossa; BUY-kerros ei vaadi uutta polkua, vaan sen, että kampanjat ja hinnat ohjataan sinne ja pois lifetime.fi:ltä.
3. Riski: lifetime.fi on Lifetime Oy:n virallinen yritysdomain. Yhteystiedot, Y-tunnus ja henkilö säilyvät alatunnisteessa ja "Ihminen"-osiossa. Missio ilman kasvoja ja osoitetta ei herätä luottamusta suomalaisessa yrityspäättäjässä.
4. Riski: toimialalinkit ("Rakentaminen, Energia, Logistiikka, Teollisuus, Verkkoliiketoiminta") eivät saa muuttua lifetime.fi:llä ratkaisulistoiksi. Lifetime.fi:llä yksi kappale per toimiala: mikä muuttuu ja miksi. Linkki vie dws10.com:iin (HOW).
5. Riski: lifetime.fi:n nykyinen englanninkielinen sisältö (50 agenttia, arkkitehtuuri, SEAL) siirtyy dws10.com:iin HOW-kerrokseen, ei poistu. `_OLD`-nimeäminen, ei poistoa.

## 1. Lifetime.fi:n uusi etusivu — tarina (FI master; sv/en/de/fr)

### 1.1 Avaus

> **One Lifetime**
> Meillä on yksi elämä ja yksi planeetta.
> Yritykset, teknologia ja yhteiskunta muuttuvat nopeammin kuin koskaan aiemmin. Muutos ei kuitenkaan ole tavoite.
> Tavoite on maailma, jossa ihmiset voivat hyvin, yritykset menestyvät ja luonnon kantokyky säilyy myös tuleville sukupolville.
> Digitalisaatio, automaatio ja tekoäly ovat välineitä tämän tavoitteen saavuttamiseen.

### 1.2 Mitä uskomme

- Teknologian tulee palvella ihmistä.
- Päätösten tulee perustua tietoon.
- Resurssien hukkaa voidaan vähentää.
- Yritykset voivat kasvaa kestävämmin.
- Ilmastonmuutoksen vaikutuksia voidaan hillitä teknologian avulla.

Jokainen uskomus linkittää yhteen Journal-tekstiin (UNDERSTAND).

### 1.3 Mihin maailma on menossa (lyhyet esseet, 3–5 kpl, n. 400–600 sanaa)

Työotsikot: _Yksi planeetta, yksi tilinpäätös_ · _Miksi tieto on uusi kantokyky_ · _Automaatio antaa ajan takaisin ihmisille_ · _Tekoäly ja asiantuntijatyön tulevaisuus_ · _Suomalainen yritys osana ratkaisua_. Nämä ovat lifetime.fi:n omaa sisältöä, eivät blogia: näkemys ja suunta, ei opetus.

### 1.4 Miten tämä näkyy käytännössä (toimialat, yksi kappale kukin)

Rakentaminen · Energia · Logistiikka · Teollisuus · Verkkoliiketoiminta. Mikä muuttuu ja miksi se on tärkeää. → "Katso toteutus" dws10.com (HOW).

### 1.5 Kaksi ovea

- **Haluatko ymmärtää enemmän?** → onelifetime.world/blog
- **Haluatko toteuttaa muutoksen?** → dws10.com

### 1.6 Ihminen

Risto Anton Päärni, miksi One Lifetime on olemassa, kahdessa kappaleessa. Puhelin ja WhatsApp.

### 1.7 Alatunniste

Lifetime Oy · Y-tunnus 0772407-9 · Laidunmaanraitti 2 A 25, 02330 Espoo · risto.paarni@lifetime.fi · +358 400 319 010.

**Hyväksymiskriteeri:** etusivulla nolla tuotenimeä, nolla hintaa, nolla ominaisuuslistaa, nolla arkkitehtuurikuvaa; jokainen väite linkittää Journaliin; jokainen toimiala linkittää dws10.com:iin; tarina luettavissa alusta loppuun ilman yhtään lyhennettä.

## 2. Nykytila (lifetime.fi/index.html, 2026-09-24)

Etusivun 361 tekstiriviä jakautuvat karkeasti: 80 % järjestelmä ja teknologia (50 agenttia, 25 toimialaa, Brain·Memory·Body·Hands, Agents·Loops·Workflows, SEAL, KYA, CLOUD Act, DGX), 15 % tuotteet (Aegis, Climate Intelligence, Firehorse V2, Coaching), 5 % asiakkaan tulos. Kieli on englanti; `fi/`, `sv/`, `de/`, `fr/` ovat käännöksiä samasta sisällöstä. Suomalainen yritysasiakas ei löydä sivulta yhtään lausetta omasta arjestaan.

## 3. Mitä siirretään minne

| Nykyinen lifetime.fi-osio                                   | Kohde                                                         | Peruste                                   |
| ----------------------------------------------------------- | ------------------------------------------------------------- | ----------------------------------------- |
| Hero "The Compliance Outcome Company" + luvut (25/50/3/3/0) | Korvataan (§4)                                                | Luvut kuvaavat järjestelmää, eivät hyötyä |
| "How Compliance Outcomes Get Delivered" 1–4                 | onelifetime.world: _Miten tulos syntyy_                       | Ymmärrys, ei hyöty                        |
| Claude Code Coaching                                        | dws10.com/products                                            | Tuote                                     |
| "What We Build" (Aegis, Climate, Firehorse)                 | dws10.com etusivu                                             | Tuotteet                                  |
| Agents · Loops · Workflows                                  | onelifetime.world-sarja                                       | Teknologia                                |
| Industry Agents (25 toimialaa)                              | dws10.com/industries                                          | Teollisuuden toteutus                     |
| Brain · Memory · Body · Hands                               | onelifetime.world: _Arkkitehtuuri selkokielellä_              | Teknologia                                |
| Sovereignty First / SEAL / CLOUD Act                        | onelifetime.world (sovereignty-sarja)                         | Ymmärrys                                  |
| Lifetime Consulting, 3 pilaria                              | dws10.com (konsultointi = palvelu); tulokset lifetime.fi §4.2 | Palvelu                                   |
| Capability Ontology, 10 luokkaa                             | onelifetime.world                                             | Teknologia                                |

## 4. [Korvattu §1:llä v1.4:ssä — säilytetty historiana] Aiempi sisältörakenne v1.3

Lupaus: **Rakennetaan yrityksiä, jotka toimivat paremmin.** Taso: strateginen, aikaa kestävä. Sana "tekoäly" esiintyy etusivulla enintään kerran, hero-alaotsikossa keinona, ei tavoitteena.

### 4.1 Hero

> **One Lifetime**
> **Rakennetaan yrityksiä, jotka toimivat paremmin – ihmisille ja planeetalle.**
> Digitalisaatio, automaatio ja tekoäly eivät ole tavoitteita. Tavoite on enemmän aikaa ihmisille, parempi päätöksenteko ja liiketoiminta, joka kasvaa kuluttamatta sitä, mistä elämä riippuu.
> Meillä on yksi elämä ja yksi elävä planeetta. Lifetime kokoaa yhteen parhaat käytännöt ja todelliset esimerkit siitä, miten suomalaiset yritykset kasvavat kestävästi.

### 4.2 Millainen yrityksesi voisi olla? (ei teknologiaa, ei taktisia lupauksia)

- **Kasvaa riippumatta siitä, missä asiakkaat ovat.**
- **Ihmiset käyttävät aikansa asiakkaisiin, eivät järjestelmiin.**
- **Päätökset syntyvät tiedosta, silloin kun niitä tarvitaan.**
- **Tekee enemmän samalla henkilöstöllä.**
- **Keskittyy liiketoimintaan ilman jatkuvaa epävarmuutta velvoitteista.**
- **Kasvaa niin, että ihmiset ja luonto pysyvät tasapainossa – kasvu ei kuluta kumpaakaan.**

### 4.3 Tulevaisuuden yritys (uusi osio, Lifetimen ydin)

Miltä näyttää yritys, joka löytyy verkosta, jonka tieto on hallinnassa, jonka prosessit toimivat, joka täyttää velvoitteensa, joka hyödyntää automaatiota arjessa – ja joka tekee tämän kaiken niin, että sen ihmiset voivat hyvin ja sen jälki planeetalla pienenee? Yksi kuvaava teksti (n. 150 sanaa), ei ominaisuuslistaa. Ilmastonmuutoksen kääntäminen on tekninen ja liiketoiminnallinen tehtävä, ja tulevaisuuden yritys on osa ratkaisua, ei ongelmaa. Tämä on visio, jota One Lifetime edustaa; yksittäiset palvelut ovat DWS10:ssä.

### 4.4 Toimialakohtaiset mahdollisuudet (strateginen taso; operatiiviset luvut DWS10:ssä)

| Toimiala             | Miltä parempi näyttää                                                                                                  |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Rakentaminen         | Projektit etenevät nopeammin, dokumentaatio pysyy ajan tasalla, johto näkee tilanteen ilman ylimääräistä raportointia. |
| Verkkokauppa         | Kauppa löytyy, sisältö syntyy vaivatta, aika menee valikoimaan ja asiakkaisiin.                                        |
| Kuljetus             | Kalusto on käytössä, tieto kulkee, hallinto ei kasva liikevaihdon mukana.                                              |
| Asiantuntijapalvelut | Asiantuntijat tekevät asiantuntijatyötä; löydettävyys ja rutiinit hoituvat taustalla.                                  |
| Teollisuus           | Velvoitteet ovat hoidettu ja todistettavissa; johto keskittyy tuotantoon, ei raportointiin.                            |

Jokaisen rivin alla: **Lue toteutus →** dws10.com (siellä 8 h → 30 min -tason luvut, tuotteet ja hinnat).

### 4.5 Esimerkit

Nimettömät, HIC:n vahvistamat, kirjoitettu vaikutuksena (kuten §4.4), ei mittarina. Mittarit DWS10:n case-sivulla.

### 4.6 Tulospolku — sivuston tärkein elementti

Käyttäjän näkökulma, tässä järjestyksessä: **Tavoite** (lifetime.fi) → **Miten tämä toimii?** (Lifetime Scope Journal) → **Toteutus** (dws10.com). Ekosysteemin sisäinen logiikka on käänteinen (Ymmärrä → Toteuta → Saavuta), mutta asiakasta kiinnostaa ensin mahdollisuus. Linkit DWS10:een ovat yleisiä ("Katso toteutus"), eivät tuote- tai hintanostoja.

### 4.7 Ihminen

Risto ja 20 vuoden kokemus kahdessa kappaleessa, suora puhelin ja WhatsApp. Ei alustaa, ei tiimikaaviota, ei titteliluetteloa.

### 4.8 Alatunniste

Lifetime Oy · Y-tunnus 0772407-9 · Laidunmaanraitti 2 A 25, 02330 Espoo · risto.paarni@lifetime.fi · +358 400 319 010.

## 5. Lifetime Scope Journal (onelifetime.world/blog) — kattavuuskartta

Periaate: jokaiselle lifetime.fi:ltä ja dws10.com:lta poistetulle termille on selittävä teksti **viidellä kielellä (fi, sv, en, de, fr)**. Nykytila: `posts/fi` 24, `posts/sv` 0 html, `posts/de` 1, `posts/fr` 1 md-luonnos. Aukko on suuri sv/de/fr-puolella.

| Ymmärryksen puute                                         | Blogiteksti (työotsikko)                                                                                                                                                                                                                                    | Tila                                          |
| --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| **Liiketoimintataso (kirjoitetaan ensin, näitä haetaan)** | Miksi osa yrityksistä kasvaa nopeammin kuin kilpailijat? · Miksi digitalisaatiohankkeet epäonnistuvat? · Mitä yrittäjän kannattaa automatisoida ensimmäisenä? · Miten tekoäly muuttaa asiantuntijatyötä? · Miksi näkyvyys verkossa ratkaisee kilpailukyvyn? | uusi, 5 tekstiä                               |
| Mikä on SEO, miten hakukonenäkyvyys syntyy                | 2 perustekstiä                                                                                                                                                                                                                                              | uusi                                          |
| Mikä on AI-agentti, Microsoft Copilot, MCP                | 3 perustekstiä                                                                                                                                                                                                                                              | osittain (agent-classes-copilot-vs-dws-iq.fi) |
| Miten verkkokauppa toimii                                 | 1 perusteksti                                                                                                                                                                                                                                               | uusi                                          |
| Mikä on "tulos" tekoälyltä                                | Miksi ostamme tuloksia, emme työkaluja                                                                                                                                                                                                                      | uusi                                          |
| Miten tulos syntyy ja todistetaan                         | Näet datan, päättelyn ja johtopäätöksen                                                                                                                                                                                                                     | uusi (nyk. hero 1–4)                          |
| Agentti, silmukka, työnkulku                              | Sarja 3 osaa selkokielellä                                                                                                                                                                                                                                  | osittain (agents-loops-workflows)             |
| Suvereniteetti, CLOUD Act, SEAL                           | Sovereignty-sarja                                                                                                                                                                                                                                           | on fi/en/sv/de/fr-luonnokset (blog-drafts)    |
| Toimittajariippuvuus                                      | ai-vendor-dependency 1–3                                                                                                                                                                                                                                    | luonnoksina, julkaisematta                    |
| KYA, agenttien hallinta                                   | kya-s1-one-signed-page                                                                                                                                                                                                                                      | luonnos fi/en                                 |
| CSRD, CBAM, ETS, NIS2 – mitä minulta odotetaan            | 4 lyhyttä selitystä                                                                                                                                                                                                                                         | uusi                                          |
| Miksi pienyritys hyötyy samasta kuin suuryritys           | 70/30-periaate                                                                                                                                                                                                                                              | uusi                                          |
| Keskeytyksen hinta                                        | Keskeytyslaskuri selitettynä                                                                                                                                                                                                                                | osittain (laskuri)                            |
| Arkkitehtuuri (Brain·Memory·Body·Hands)                   | Neljä kerrosta arjen kielellä                                                                                                                                                                                                                               | uusi                                          |

Toteutusjärjestys: 1) julkaise 12 parkissa olevaa blog-draftia HIC-hyväksynnällä (Rule 13), 2) kirjoita 6 uutta fi-tekstiä, 3) käännä kaikki sv/en/de/fr `/multilingual`-skillillä, 4) linkitä lifetime.fi:n jokainen tekninen viittaus näihin.

## 6. Toteutusvaiheet

| Vaihe | Sisältö                                                                                          | Arvio                               |
| ----- | ------------------------------------------------------------------------------------------------ | ----------------------------------- |
| A     | lifetime.fi/fi/index.html uusi copy §4 (FI master) + `landing-pages/lifetime-fi`-peili           | 1 sessio                            |
| B     | Siirrettävät osiot dws10.com:iin (tuotteet, toimialat) – ei poistoa, `_OLD`-nimeäminen           | 1 sessio                            |
| C     | Käännökset sv/en/de/fr lifetime.fi                                                               | 1 sessio                            |
| D     | Blogi: julkaisu + 6 uutta + käännökset                                                           | 3–4 sessiota, HIC-portti per teksti |
| E     | Mittaus: yhteydenotot lifetime.fi → WhatsApp/puhelin/lomake, `truth-check` julkisille väitteille | jatkuva                             |

Hyväksymiskriteeri lifetime.fi:lle: koko etusivulla nolla tuotenimeä, nolla hintaa, nolla lyhennettä, nolla arkkitehtuurikuvaa, ei liidilupauksia ("lisää yhteydenottoja") ja sana "tekoäly" enintään kerran; jokainen osio kuvaa mahdollisuuden, ei mittaria; Tulospolku ja Tulevaisuuden yritys näkyvissä; kaikki väitteet HIC:n vahvistamia (`truth-check`).

## 7. HIC-päätökset

1. Hyväksytäänkö §0 strategia ja §4 rakenne lopullisena sisältöstrategiana?
2. Vahvista toimialaesimerkit §4.4 vaikutuksina; operatiiviset luvut (8 h → 30 min) julkaistaan vain DWS10:ssä ja vain vahvistettuina.
3. Aloitetaanko vaihe A (lifetime.fi/fi/index.html sisältö §4, nykyinen ulkoasu säilyy) heti tällä haaralla?
4. Aloitetaanko blogisarja 0 (5 liiketoimintatason tekstiä) `/blog-draft`-portin kautta ennen termisarjaa?

## Version history

| Version | Date       | Changes                                                                                                                                                                                                                                                                                                                                         |
| ------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.4     | 2026-09-24 | Copilot BizChat -malli omaksuttu: WHY (lifetime.fi) / UNDERSTAND (Journal) / HOW (dws10.com) / BUY (dws10.com/buy); lifetime.fi = ekosysteemin tarkoituksen ja suunnan yläkerros, etusivu kertoo tarinan; WHY–UNDERSTAND-raja määritelty (≤600 vs 1 500–4 000 sanaa); arkkitehtuurisisältö siirtyy dws10.com:iin; §4 v1.3 säilytetty historiana |
| 1.3     | 2026-09-24 | One Lifetime -brändin merkitys kirjattu (kestävä kehitys, ilmastonmuutoksen kääntäminen teknisin keinoin, elämän ainutkertaisuus, ihminen tasapainossa luonnon kanssa); hero, §4.2, §4.3 ja teollisuusrivi päivitetty; blogiin 0.0                                                                                                              |
| 1.2     | 2026-09-24 | Copilot-arvio omaksuttu: Lifetime on brändi, "näe mahdollisuus"; hero "One Lifetime — Rakennetaan yrityksiä, jotka toimivat paremmin"; taktiset liidilupaukset siirretty DWS10:een; uusi osio Tulevaisuuden yritys; toimialat vaikutuksina; blogi nimetty Lifetime Scope Journaliksi; liiketoimintatason sarja 0                                |
| 1.1     | 2026-09-24 | HIC/Copilot tarkennus: yhden lauseen strategia (§0), hero ja viisi tulosta, toimialataulukko, Tulospolku, hinnastot ja tuotelinkit pois lifetime.fi:ltä, Consulting siirtyy DWS10:een                                                                                                                                                           |
| 1.0     | 2026-09-24 | Ensimmäinen ehdotus: kolmen sivuston työnjako, siirtotaulukko, blogin kattavuuskartta                                                                                                                                                                                                                                                           |

## 8. Blogitekstit, kampanjat ja näkyvyys (HIC 24.09.2026 lisäys)

### 8.1 Blogitekstit — "blogi opettaa" (jokainen fi/sv/en/de/fr, julkaisu Rule 13 -portin kautta)

Sarja 0 — Liiketoimintataso (kirjoitetaan ensin; lifetime.fi §4.2–4.3 linkittää näihin):
0.0 Mitä One Lifetime tarkoittaa: yksi elämä, yksi planeetta, yritys osana ratkaisua
0.1 Miksi osa yrityksistä kasvaa nopeammin kuin kilpailijat?
0.2 Miksi digitalisaatiohankkeet epäonnistuvat?
0.3 Mitä yrittäjän kannattaa automatisoida ensimmäisenä?
0.4 Miten tekoäly muuttaa asiantuntijatyötä?
0.5 Miksi näkyvyys verkossa ratkaisee kilpailukyvyn?

Sarja A — Perusteet (termit; MCP, KYA, CBAM vasta tämän jälkeen):

1. Mikä on SEO ja miksi yritykseni ei löydy Googlesta
2. Miten hakukonenäkyvyys syntyy: Google-yritysprofiili, sivut, arvostelut
3. Miten verkkokauppa toimii: tuote, kori, maksu, toimitus, kuitti
4. Mikä on tekoälyagentti – ja mikä se ei ole
5. Mikä on Microsoft Copilot, mitä se tekee ja mitä ei (pohja: `agent-classes-copilot-vs-dws-iq.fi.md`)
6. Mikä on MCP: miten tekoäly käyttää yrityksen omia järjestelmiä
7. Mitä automaatio tarkoittaa käytännössä: tarjous, lasku, raportti
8. Mitä 5–10 tuntia viikossa oikeasti tarkoittaa yrittäjälle (laskuesimerkki)

Sarja B — Velvoitteet selkokielellä (dws10.com teollisuusasiakkaalle): 9. Mikä on CSRD ja koskeeko se minua 10. Mikä on CBAM ja kenen pitää raportoida 11. Mikä on päästökauppa (ETS) yrityksen näkökulmasta 12. Mikä on NIS2 ja mitä se vaatii toimitusketjulta

Sarja C — Parkissa olevat luonnokset julkaisuun (12 kpl `docs/blog-drafts/`): ai-vendor-dependency 1–3, sovereignty-sarja (en/fi/sv/de/fr), kya-s1 (en/fi), hic-hallintamalli, lifetime-world-model, teollisuuden-prosessikuvaustavat. Jokainen näytetään HIC:lle yhtenä koodilohkona ennen julkaisua.

Muoto: jokaisen tekstin lopussa kolme linkkiä samassa järjestyksessä: _Mitä tästä seuraa yritykselle_ → lifetime.fi · _Miten toteutetaan_ → dws10.com · _Seuraava selitys_ → blogi. Ei hintoja, ei tarjouksia blogissa.

### 8.2 Tuotteita tukevat kampanjat (dws10.com myy; lifetime.fi näyttää tuloksen; blogi selittää)

| Kampanja                               | Tuote (dws10.com)                                                  | Lifetime.fi-mahdollisuus (§4.2)    | Blogitekstit (§8.1) | Kanava                                                     |
| -------------------------------------- | ------------------------------------------------------------------ | ---------------------------------- | ------------------- | ---------------------------------------------------------- |
| Syksy 2026 A5 (olemassa)               | WEB-STARTER 650 €, WEBSTORE-MINI 350 €                             | Lisää yhteydenottoja; verkkokauppa | 1, 2, 3             | Printti Espoo/Kirkkonummi, WhatsApp, Google-profiili       |
| "Illat takaisin"                       | Automaatio-startti (tarjous/lasku/raportti) – tuotteistus puuttuu  | Vähemmän manuaalista työtä         | 7, 8                | LinkedIn FI, sähköposti nykyasiakkaille, A5-kääntöpuoli v2 |
| Rakentaminen: raportointi 8 h → 30 min | SiteSense / raportointiautomaatio                                  | Toimialataulukko §4.3              | 7, 4                | Rakennuslehti-tyyppiset kanavat, LinkedIn, suora outreach  |
| Copilot vai agentti?                   | AI-konsultointipäivä (`ai-consultant-day.fi`)                      | Nopeampi päätöksenteko             | 4, 5, 6             | LinkedIn, LSJ-uutiskirje                                   |
| Velvoitteet hoidettu                   | Climate Intelligence / compliance-pilotti (`ais-outcome-pilot.fi`) | Teollisuus: velvoitteet todistettu | 9–12                | Regulatory radar -sähköpostit, Hilma-seuranta, LinkedIn    |
| Claude Code Coaching                   | Coaching-sivut                                                     | Tiimisi osaa itse                  | 4, 6                | LinkedIn, Teams-kohortit pe                                |

Jokaisella kampanjalla: yksi UTM-parametrisoitu laskeutumissivu dws10.com:lla, lifetime.fi:llä vain §4.2-tason mahdollisuus ilman kampanjanostoa, vähintään kaksi blogitekstiä, mittari = yhteydenotot (WhatsApp/puhelin/lomake) per kanava.

### 8.3 Näkyvyys

1. **Google-yritysprofiili Lifetime Oy, Espoo** – kuvat, palvelut, arvostelupyyntö jokaisen toimituksen jälkeen. Sama kortti, jota A5-kampanja lupaa asiakkaalle.
2. **Sisäinen linkitys kolmen sivuston välillä** joka sivulla Tulospolku-järjestyksessä (lifetime → onelifetime → dws10). Tämä on halvin SEO-toimi ja tekee ekosysteemin Googlelle luettavaksi.
3. **LinkedIn**: 2 postausta/vko, jokainen = yksi blogiteksti + yksi tuloslause. LSJ-uutiskirje kuukausittain (`/lsj-publish`).
4. **Viisi kieltä**: `hreflang` kaikille kolmelle sivustolle; sv ensin (Ruotsi + suomenruotsalaiset), sitten en/de/fr. `/multilingual`-skilli.
5. **Suora outreach** (Proton, risto.paarni@lifetime.fi): toimialoittain §4.3, viesti = tulos + linkki lifetime.fi, ei tuotelistaa. Outreach-agentit tekevät listat, HIC lähettää.
6. **Mittaus**: yhteydenotot per sivusto ja kanava viikoittain; `truth-check` kaikille julkaistuille väitteille.

### 8.4 Ensimmäiset 30 päivää

| Viikko | Toimi                                                                                                 |
| ------ | ----------------------------------------------------------------------------------------------------- |
| 1      | lifetime.fi/fi sisältö §4 (vaihe A); blogit 1–3 fi luonnoksina HIC:lle; Google-yritysprofiili kuntoon |
| 2      | Julkaisu 1–3 + käännökset sv/en; A5-kampanja linkittää blogiin; LinkedIn alkaa                        |
| 3      | "Illat takaisin" -tuotteistus dws10.com:iin; blogit 4–8 fi; sovereignty-sarja julkaisuun              |
| 4      | de/fr-käännökset; toimialaoutreach rakentaminen + asiantuntijapalvelut; ensimmäinen mittausraportti   |

## 9. Tuoteportfolio kerroksittain (lähde: `dws10.com/config/products.json` v1.30, 2026-09-15, 136 tuotetta + 25 tilausta)

Tämä taulukko kytkee lifetime.fi:n WHY-tarinan toimialat (§1.4) oikeisiin HOW/BUY-tuotteisiin. Lifetime.fi:llä ei näy yhtään näistä nimistä; ne ovat linkin takana dws10.com:ssa.

| Lifetime.fi toimiala (WHY)          | Journal-teemat (UNDERSTAND)                                  | dws10.com tuoteperhe (HOW)                                                                                                                                                                                  | Ostettavissa nyt (BUY, dws10.com/buy)                                                                 |
| ----------------------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Rakentaminen                        | työmaaturvallisuus, materiaalien hiilijalanjälki, aikataulut | SiteSense (SS-T0…T2), Material Oracle (MO-T0…T2), Schedule Genius (SG), Construction Agent Pro (CONSTR-T2), Construction Ops Pod (CONSTR-T3), Mars-pod (IND-MARS)                                           | SS-T1 1 499 €, MO-T1 1 299 €, SS-OC-STD 49 €/arvio, MO-OC-STD 499 €/LCA-raportti                      |
| Energia                             | päästökauppa, vety, akkuvarastot, sähkövero                  | Helios (IND-HELIOS), Prometheus (IND-PROM), BESS (IND-BESS), Emissions Data (ED-T1/T2)                                                                                                                      | IND-HELIOS 999 €, ED-T1 999 €                                                                         |
| Logistiikka                         | käyttöaste, data näkyväksi, hallinnon kasvu                  | Logistics (LOG-T1/T2), Neptune-pod (IND-NEPTUN), Lifetime Fleet edge-nodet (LF-JETSON-\*)                                                                                                                   | LOG-T1 1 299 €                                                                                        |
| Teollisuus (velvoitteet)            | CSRD, CBAM, ETS, NIS2, EU AI Act selkokielellä               | Compliance Agent (CMP-T0…T2), Climate Intelligence (DWS-CLIMATE-001), Climate Reporting Starter Bundle, ESG FaaS (ESG-T3), toimialapodit Vulcan/Talos/Gaia/Ceres, LAND-CSRD/LCA/SOV-sprintit                | CMP-T1 1 499 €, CMP-OC-STD 999 €/gap-analyysi, DWS-CLIMATE-001 2 999 €, DWS-IQ-FREE-2026 (1 projekti) |
| Verkkoliiketoiminta (pk)            | SEO, hakukonenäkyvyys, verkkokauppa, automaatio arjessa      | Website Starter (LIFETIME-WEB-STARTER), Webstore Mini (LIFETIME-WEBSTORE-MINI), Kotisivut pk-yritykselle, SEO Audit (SEO-T1/T2), Firehorse Omnichannel Next, AI Customer Agent, Lead Feedback, Customer Sat | WEB-STARTER 650 €, WEBSTORE-MINI 350 €, SEO-T1 599 €, FH-OMNI-001 499 €                               |
| Suvereeni tekoäly (poikkileikkaava) | CLOUD Act, datan sijainti, oma laskenta                      | Aegis (DWS-AEGIS-\*), Sovereign Database, Sovereignty Monitor (SOV-T1…T3), DWS IQ EU Sovereign Starter/Pilot, DGX Spark / IGX / Jetson, Kubernetes Gov Ready (LF-K8S-T1…T4), NIM/DOCA-paketit               | DWS-EU-STARTER 499 €, DWS-SOVEREIGN-DB-001 499 €, LF-DGX-SPARK 6 109 €                                |
| Osaaminen (poikkileikkaava)         | EU AI Act Art. 4 -lukutaito, agenttinen ohjelmistokehitys    | Claude Code Coaching (lecture 1 900 €, workshop 4 500 €, 3 pv 5 900 €, projekti 7 500 €), AI Koulutus 3 pv, Captain Day, AI Literacy Bridge (LAND-AIL)                                                      | claude-code-coaching-lecture 1 900 €, ai-consultant-day 1 200 €                                       |

Havainto kampanjaan "Illat takaisin" (§8.2): pk-automaatiolle (tarjous/lasku/raportti) ei ole omaa SKU:ta. Lähimmät: Firehorse Amplify (FH-AUTO-001, 4 950 €) on liian raskas, Captain Day (1 200 €) on päivä ilman jatkuvuutta. Ehdotus: uusi tuote "Automaatio-startti pk-yritykselle" WEB-STARTERin hintaluokkaan (HIC päättää hinnan; lisätään `products.json`-lähteeseen ja peiliin samassa commitissa).

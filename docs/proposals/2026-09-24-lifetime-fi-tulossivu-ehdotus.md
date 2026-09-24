# Ehdotus: lifetime.fi puhuu tuloksista — kolmen sivuston työnjako

**Version:** 2.4 · **Date:** 2026-09-24 · **Status:** APPROVED (HIC-päätös v2.0, ehdollinen; ks. §13) · **Author:** Claude Code (v1.1 tarkennus HIC + Copilot 24.09.2026)

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

### 1.1b Hero B — päätösvalta (HIC 24.09.2026, lopullinen muotoilu; korvaa tunnetason version)

> **One Lifetime**
>
> Tekoäly voi havaita muutoksen.
> Tekoäly voi analysoida vaihtoehtoja.
> Tekoäly voi ehdottaa seuraavaa askelta.
>
> Mutta vastuu päätöksestä kuuluu ihmiselle.
>
> Teknologia auttaa ymmärtämään maailmaa paremmin.
> Ihmiset päättävät, mitä maailmassa tehdään.
>
> Siksi rakennamme järjestelmiä, joissa oppiminen, päätöksenteko ja vaikutukset ovat
> jäljitettävissä myös vuosien päästä.

Perustelu: Application Record LD-2026-09-002 (APPLY, world model 1.2.0). Kolme ensimmäistä riviä
ovat Chapter 14:n Observation → Insight → Hypothesis; neljäs on APPLY_LEARNING_GATE; viimeinen on
Application Record ja temporal trail. Hero on siis sama asia kuin Workflow v2, sanottuna ilman
yhtään termiä. Ei tuote- eikä toimittajanimiä. Investor Centre ei sovella (HIC:n rajaus).
Aiempi tunnetason versio ("Tekoäly voi oppia tämän…") siirretty some-luonnokseksi alle, ei heroksi.

### 1.1c Hero C — ketjun säilyminen (HIC 24.09.2026, lähimpänä Workflow v2:n filosofiaa)

> **One Lifetime**
>
> Mallit vaihtuvat.
> Teknologia muuttuu.
> Järjestelmät kehittyvät.
>
> Mutta havaintojen, oppimisen ja päätösten ketjun pitää säilyä.
>
> Tekoäly voi oppia.
> Ihmiset voivat oppia.
> Parhaat tulokset syntyvät, kun molemmat oppivat ja ymmärtävät, miksi päätökset tehdään.

### 1.1d Brändilause (HIC 24.09.2026, tiivein)

> **Tekoäly voi oppia. Vain ihminen voi kantaa vastuun päätöksestä.**

### 1.1e Hero D — ymmärtävä ihminen (HIC + Copilot 24.09.2026; lopullinen ehdokas)

> **One Lifetime**
>
> Tekoäly oppii.
> Ymmärtävä ihminen kantaa vastuun päätöksestä.
>
> Rakennamme järjestelmiä, joissa havainnot, oppiminen, päätökset ja vaikutukset ovat
> jäljitettävissä myös vuosien päästä.
>
> Teknologia muuttuu. Mallit vaihtuvat. Vastuu säilyy ihmisellä.

Miksi sana _ymmärtävä_ ratkaisee: "ihminen päättää" pätee keneen tahansa; Workflow v2:ssa HIC ei
ole hyväksyjä vaan ymmärtäjä. Päätös on aidosti HIC:n vasta, kun HIC ymmärtää mitä havaittiin,
mitä tekoäly oppi, mikä evidenssi tukee oppimista, mitä vaihtoehtoja oli ja mitä seurauksia
soveltamisesta syntyy. Lause ei romantisoi ihmistä eikä demonisoi tekoälyä. Se on ajaton: malli
vaihtuu, periaate ei.

Lause kartoitettuna Workflow v2:een: Observation → AI havaitsee · Signal → AI tunnistaa mallin ·
Insight → AI ehdottaa johtopäätöstä · Learning → AI oppii · JEV/KYA → ihminen ymmärtää mitä
opittiin · Decision → ihminen päättää soveltamisesta · Action → järjestelmä toteuttaa · Outcome →
maailma muuttuu.

JEV/KYA-periaatteeksi: **Tekoäly oppii. Ymmärtävä ihminen päättää, mitä opitulla tiedolla
tehdään.** (kirjattu myös `docs/workflow-v2-jev-kya-integration-plan.md`).

Ehdotus käytöstä (päivitetty v2.0): Hero D (1.1e) lifetime.fi:n etusivun avauksena; brändilause (1.1d) alatunnisteen mottona kaikilla kolmella sivustolla; Hero C (1.1c) "Mihin maailma on menossa" -osion johdantona; Hero B (1.1b) "Mitä uskomme" -johdantona; Hero A (1.1) "Tulevaisuuden yritys" -avauksena. Aiempi ehdotus säilytetty: brändilause (1.1d) heron ylärivinä tai sivun alatunnisteen mottona kaikilla
kolmella sivustolla; Hero C (1.1c) lifetime.fi:n etusivun avauksena, koska se sanoo
"malli vaihtuu, maailmanmalli ei" ilman termejä; Hero B (1.1b) "Mitä uskomme" -osion johdantona;
Hero A (1.1) planeetta-osion (Tulevaisuuden yritys, §1.3) avauksena. Kaikki neljä ovat samaa
Application Recordia LD-2026-09-002; HIC valitsee järjestyksen. Non-Negotiable Rule 12: kaikki
neljä muotoilua säilytetään tässä sellaisenaan.

Some-luonnos Chapter 11 -portille (LinkedIn, ei julkaistu):

```
Tekoäly voi oppia. Vain ihminen voi kantaa vastuun päätöksestä.

Mallit vaihtuvat, teknologia muuttuu, järjestelmät kehittyvät.
Havaintojen, oppimisen ja päätösten ketjun pitää säilyä.
→ lifetime.fi
```

Aiempi some-luonnos (säilytetty):

```
Tekoäly voi havaita muutoksen, analysoida vaihtoehtoja ja ehdottaa seuraavaa askelta.
Vastuu päätöksestä kuuluu ihmiselle.
Siksi rakennamme järjestelmiä, joissa oppiminen, päätös ja vaikutus ovat jäljitettävissä
vielä vuosien päästä. Mallit vaihtuvat; maailmanmallisi ei saa vaihtua niiden mukana.
→ lifetime.fi
```

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
| 2.4     | 2026-09-24 | §14 avausrivi (epävarmuuden vähentäminen, ei suositusjärjestelmä); kysymys ensin, toimiala arvataan ja vahvistetaan; blogi #72 julkaistu; LD-006 APPLY                                                                                                                                                                                          |
| 2.3     | 2026-09-24 | §14 Active Ontology & Agentic Commerce (DISCOVER-kerros): virallinen Learning Delta 'asiakas yrittää tehdä päätöksen', ei chat-first, toimiala ensin, yksi sisäänmeno 'Mikä päätös on tällä hetkellä vaikea tehdä?'; Observation Capture mittaukseen ennen yhteydenottoja; datalähdetaulukko (Cloudflare, Merchant Center, Observation Intake)  |
| 2.2     | 2026-09-24 | Vaihe A2 ja käännökset tehty: oma WHY-nav, kielipalkki v1.1, viisikielinen generaattori yhdestä sisältölähteestä, peili samassa ajossa                                                                                                                                                                                                          |
| 2.1     | 2026-09-24 | HIC-päätös v2.0 kirjattu (§13, APPROVE ehdollisesti); vaihe A toteutettu lifetime.fi/fi + peili; asiakasväite päätöksen 5 sanamuodossa heroon; DWS IQ -positiointilause; shared-assets-nav avoimena                                                                                                                                             |
| 2.0     | 2026-09-24 | Hero D "Tekoäly oppii. Ymmärtävä ihminen kantaa vastuun päätöksestä." lopulliseksi etusivun avaukseksi; kartoitus Workflow v2:n vaiheisiin; JEV/KYA-periaate; käyttöjärjestys A–D päivitetty                                                                                                                                                    |
| 1.9     | 2026-09-24 | Hero C (ketjun säilyminen) ja brändilause "Tekoäly voi oppia. Vain ihminen voi kantaa vastuun päätöksestä."; käyttöehdotus A/B/C/D:lle; kaikki muotoilut säilytetty (Rule 12)                                                                                                                                                                   |
| 1.8     | 2026-09-24 | Hero B lopullinen muotoilu HIC:ltä (havaitse / analysoi / ehdota → vastuu ihmisellä → jäljitettävyys vuosien päästä); tunnetason versio siirretty some-luonnokseksi                                                                                                                                                                             |
| 1.7     | 2026-09-24 | Hero-ehdokas B päätösvallasta (LD-2026-09-002 APPLY, investor-centre poissuljettu); some-luonnos Ch 11 -portille; viittaus Workflow v2 Chapters 10–14 ja market-signals-rekisteriin (PR #2059)                                                                                                                                                  |
| 1.6     | 2026-09-24 | Jalostusketju Workflow V2 -määrittelynä (`content-refinement-chain`, 10 askelta) ja Temporal-käyttötapauksena #13 (HIC-Signal-portti, Standalone Activity -julkaisut, per-kieli child workflow, Schedule); Meta-väite korjattu (Facebook-julkaisija on jo olemassa)                                                                             |
| 1.5     | 2026-09-24 | Lopullinen roolimalli: onelifetime.world = akatemia (Journal, white paperit, research, seminaarit, esitykset, tapahtumat); jalostusketju ydinmekanismina, kaksi mallikierrosta; whitepapers/playbooks siirtyvät onelifetime.worldiin; jalostusrekisteri `docs/content-pipeline/chains.md`                                                       |
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
6. **Observation Capture ennen mittausta (v2.3):** dws10.com:n etusivun ja /buy:n yksi kysymys "Mikä päätös on tällä hetkellä vaikea tehdä?" + toimialavalinta on ensisijainen mittari. Se kertoo _miksi_ kävijä tuli, kun Cloudflare kertoo vain _kuinka monta_ tuli. Tavoite: 100 000 kävijää → "12 000 näkyvyysongelmaa, 4 000 CSRD-ongelmaa, 2 000 hiilijalanjälkiongelmaa, 1 500 NIS2-ongelmaa, 800 automaatio-ongelmaa" (tavoiteluokitus, ei mitattu). Jokainen vastaus on Chapter 14 CAPTURE -havainto.
7. **Mittaus**: yhteydenotot per sivusto ja kanava viikoittain; `truth-check` kaikille julkaistuille väitteille. Yhteydenotto on myöhäinen mittari; Observation Capture on aikainen.

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

## 10. Sisältövirta: dws10.com-hubien ymmärrys ylös lifetime.fi:hin, syvälle Journaliin, ulos someen (HIC 24.09.2026)

### 10.1 Havainto

dws10.com sisältää paljon ymmärrystä hakemistomuodossa (95 ylätason osiota): `compliance/` (7 sivua, ~7 000 sanaa, trust center, 4 kieltä), `legal/` + `legal-hub/` (~10 000 sanaa, DPA, alihankkijat), `investor-centre/` (5 sivua, ~5 500 sanaa, one-pager, Captain/Admiral), `partners/` + `aegis-partners/` + `connect-partners/` + `sovereign-infra-partners/` (~7 700 sanaa), lisäksi `whitepapers/`, `playbooks/`, `scenarios/`, `world-model/`, `roadmap/`, `press-releases/`, `kya-standard/`, `sovereignty/`. Customer centre puuttuu erillisenä hakemistona; asiakassisältö on `testimonials/`, `get-started/`, `free-audit/`, `industries/`.

Ongelma ei ole sisällön puute vaan **virran puute**: johtopäätökset eivät nouse lifetime.fi:hin (WHY), syvät tekstit eivät virtaa Journaliin (UNDERSTAND) eivätkä LinkedIniin ja Metaan.

### 10.2 Periaate: yksi lähde, neljä muotoa

Jokainen dws10.com-hubin substanssisivu tuottaa neljä johdannaista. Lähde pysyy dws10.com:ssa (HOW); johdannaiset eivät kopioi vaan tiivistävät, syventävät tai jakelevat.

| Muoto           | Kohde                                   | Pituus                      | Sisältö                                                                           | Portti                                               |
| --------------- | --------------------------------------- | --------------------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------- |
| **Johtopäätös** | lifetime.fi (WHY)                       | 1–3 lausetta + linkki       | Mitä tämä tarkoittaa maailmalle ja suomalaiselle yritykselle                      | HIC hyväksyy tekstin (julkinen väite, `truth-check`) |
| **Syvä teksti** | Lifetime Scope Journal (UNDERSTAND)     | 1 500–4 000 sanaa, 5 kieltä | Miksi ja miten, lähteineen; hubin sisältö esseemuodossa, ei hakemistona           | Rule 13: `/blog-draft` → HIC → julkaisu              |
| **Some-nosto**  | LinkedIn (yritys + Risto), Meta (FB/IG) | 80–150 sanaa + kuva 4K      | Yksi väite, yksi todiste, yksi linkki (Journal tai lifetime.fi, ei koskaan hinta) | HIC hyväksyy jonon viikoittain                       |
| **Lähde**       | dws10.com hub (HOW)                     | säilyy                      | Hakemistomuoto on oikea täällä: se palvelee ostajaa, juristia, sijoittajaa        | –                                                    |

### 10.3 Ensimmäinen erä: hubi → johdannaiset

| dws10.com-lähde                                          | lifetime.fi-johtopäätös (WHY)                                   | Journal-teksti (UNDERSTAND)                                                                                    | Some-nosto                   |
| -------------------------------------------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| `compliance/` + trust center                             | "Velvoitteet eivät ole raportointia vaan tapa nähdä oma jälki." | Mitä CSRD, CBAM, ETS ja NIS2 pyytävät yritykseltä oikeasti (sarja B)                                           | 4 nostoa, yksi per asetus    |
| `legal/` DPA + sub-processors                            | "Tieto, joka pysyy Euroopassa, on osa yrityksen kantokykyä."    | Miksi tietojen sijainti ratkaisee: CLOUD Act selkokielellä (sovereignty-sarja, luonnokset 5 kielellä valmiina) | 2 nostoa                     |
| `investor-centre/` one-pager                             | "Yksi planeetta on myös sijoitusteesi."                         | Miksi compliance-outcome on markkina eikä kuluerä (50 000 yritystä 2028)                                       | 2 nostoa, investor-kohdennus |
| `partners/` (4 hubia)                                    | "Kukaan ei ratkaise tätä yksin."                                | Ekosysteemi: NVIDIA, sovereign infra, Connect; mitä kumppanuus tarkoittaa asiakkaalle                          | 2 nostoa                     |
| `whitepapers/`, `playbooks/`, `scenarios/` (12 kohdetta) | Yksi esseeotsikko per whitepaper §1.3-esseisiin                 | Whitepaper → Journal-essee (lyhennetty, lähde linkitetty)                                                      | 1 nosto per whitepaper       |
| `world-model/`, `kya-standard/`                          | "Päätösten tulee perustua tietoon" -uskomuksen todiste          | Mitä maailmanmalli on ja miksi yritys tarvitsee oman (luonnos `lifetime-world-model-*` valmiina)               | 2 nostoa                     |
| `testimonials/`, `industries/`                           | Toimialakappaleet §1.4                                          | Tapaustutkimukset vaikutuksina + luvut                                                                         | 1 nosto per toimiala         |

### 10.4 Koneisto (olemassa, käyttöön)

- **Some-jono:** `src/social-scheduler/` + `scripts/seed-post-queue.ts` + taulu `social_posts` (migraatio 030–037) + `scripts/linkedin-oauth.ts`. Nyt LinkedIn-kirjasto on 10 postausta; laajennetaan §10.3-nostoilla. Meta: Facebook-sivujulkaisu on jo koneistossa (`src/social-scheduler/facebook-publisher.ts`, `publishSocialPostActivity` platform `facebook`); Instagram puuttuu. LinkedIn: OAuth + hyväksyntädigest olemassa (`approval-digest.ts`), julkaisuadapteri tarkistettava.
- **Kampanjapostaukset:** `scripts/generate-campaign-post.ts`, `scripts/build-arvonluonnin-ajurit-post.mjs` (malli: yksi blogi → yksi postaus).
- **Uutiskirje:** `/lsj-publish` kokoaa kuukauden Journal-tekstit LinkedIn-uutiskirjeeksi.
- **Käännökset:** `/multilingual` (fi/sv/en/de/fr).
- **Väitteiden tarkistus:** `/truth-check` kaikille lifetime.fi- ja some-teksteille ennen julkaisua.

### 10.5 Rytmi

| Viikonpäivä            | Toimi                                                                                                     | Tekijä                         |
| ---------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------ |
| Ma                     | Valitaan viikon lähdesivu dws10.com:sta (§10.3 järjestys)                                                 | agentti ehdottaa, HIC valitsee |
| Ti–Ke                  | Journal-teksti fi luonnokseksi `/blog-draft`; johtopäätöslause lifetime.fi:lle                            | agentti                        |
| To                     | HIC lukee ja hyväksyy (blogi + lause + 2–4 some-nostoa)                                                   | HIC                            |
| Pe                     | Julkaisu: Journal fi, lifetime.fi-lause, some-jonoon seuraavalle viikolle; käännökset sv/en käynnistetään | agentti                        |
| Kuukauden viimeinen pe | `/lsj-publish` uutiskirje; de/fr-käännökset erässä                                                        | agentti + HIC                  |

Yksi lähdesivu viikossa tuottaa 12 kuukaudessa n. 50 Journal-tekstiä × 5 kieltä, 50 lifetime.fi-johtopäätöstä ja 150 some-nostoa. Kaikki HIC:n portin läpi, ei automaattijulkaisua.

### 10.6 HIC-päätökset (§10)

1. Hyväksytäänkö "yksi lähde, neljä muotoa" -periaate ja viikkorytmi?
2. Meta: Facebook-julkaisu on jo koneistossa (tarvitsee `FACEBOOK_PAGE_ID`/`TOKEN` ympäristömuuttujina). Lisätäänkö Instagram samaan adapteriin?
3. Ensimmäinen lähdesivu: `compliance/` trust center (ehdotus) vai `investor-centre/` one-pager?

## 11. Lopullinen roolimalli ja jalostusketju (HIC + Copilot 24.09.2026, v1.5)

### 11.1 Kokonaisuus

```
                    One Lifetime

                     lifetime.fi
                  Missio · Suunta
               Synteesi · Johtopäätökset
                           ↓
                onelifetime.world
          Journal · White Papers · Seminars
      Research · Presentations · Deep Learning
                           ↓
                     dws10.com
         Solutions · Operations · Delivery
     Compliance · Industry · Products · Hubs
                           ↓
                  dws10.com/buy
                     Acquisition
```

| Sivusto           | Rooli                                                                                                                                                                                                                             | Sanoo                                                                                                                                                                          |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| lifetime.fi       | Missio, synteesi, johtopäätökset, maailman suunta                                                                                                                                                                                 | "Tässä on mitä olemme oppineet. Tässä on mihin maailma on menossa. Tässä on mitä One Lifetime tarkoittaa." Esim. _Miksi CSRD, tekoäly ja energiatransitio ovat samaa ilmiötä?_ |
| onelifetime.world | Akatemia, ei blogi: Journal (lyhyet artikkelit), white paperit (pitkät analyysit), research notes, seminaaritallenteet, esitysmateriaalit, Lifetime Scope Journal, myyntitapahtumat (workshopit, roundtablet, asiakastilaisuudet) | "Selitä tämä minulle yksityiskohtaisesti."                                                                                                                                     |
| dws10.com         | Faktat, ratkaisut, compliance, tuotteet, toteutus; hubit (Legal, Compliance, Partner, Investor, Customer) pysyvät hakemistomuodossa                                                                                               | "Näin tämä tehdään."                                                                                                                                                           |
| dws10.com/buy     | Hankinta ja käyttöönotto                                                                                                                                                                                                          | "Tämän voit ostaa nyt."                                                                                                                                                        |

**Ydinhavainto:** ongelma ei ole sisällön puute vaan **jalostusketjun puute**. DWS10 tuottaa tiedon; Lifetime tuottaa siitä merkityksen; OneLifetime syvällisen ymmärryksen; LinkedIn ja Meta keskustelun. Nyt tieto jää DWS10:n hakemistoihin (Hakemisto → Dokumentaatio → Prosessi → Vaatimus) sen sijaan että jatkaisi matkaa (Johtopäätös → Tarina → Merkitys). Siksi kampanjasivu tuntui kalpealta.

### 11.2 Jalostusketju, kaksi mallikierrosta

**Ketju 1 — suvereniteetti**
DWS10 Legal Hub: CLOUD Act, DPA, alihankkijat
→ lifetime.fi: _Digitaalinen suvereniteetti voi muodostua seuraavan vuosikymmenen kilpailueduksi._
→ onelifetime.world white paper: _Digitaalinen suvereniteetti Euroopassa 2026–2035_ (pohja: sovereignty-sarja, 5 kieltä luonnoksina)
→ LinkedIn: _Kolme syytä miksi datan sijainti ei enää riitä._
→ Seminaari: _EU Sovereignty & AI Governance_ (tallenne onelifetime.worldiin)
→ DWS10-tuote: Sovereign AI Deployment (DWS-EU-STARTER/PILOT, AIS-EU-SOV-OC, LF-DGX-SPARK)

**Ketju 2 — vaikutusdata**
DWS10 Compliance Hub: CSRD
→ lifetime.fi: _Yritykset tulevat mittaamaan ympäristövaikutuksia yhtä tarkasti kuin taloudellista suorituskykyä._
→ onelifetime.world Journal: _Miksi vaikutusdata on uusi talousdata?_
→ LinkedIn: _Tuloskortti ei enää sisällä pelkkää rahaa._
→ Workshop: _Future of Corporate Reporting_
→ DWS10-tuote: Compliance Agent (CMP-T1), Climate Intelligence, Climate Reporting Starter Bundle

Jokainen ketju kirjataan yhdeksi riviksi jalostusrekisteriin (`docs/content-pipeline/chains.md`, perustetaan vaiheessa A): lähde, johtopäätös, syvä teksti, some, tapahtuma, tuote, tila per kieli. Rekisteri on HIC:n näkymä siihen, mikä tieto on jalostettu ja mikä makaa hakemistossa.

### 11.3 Mitä siirtyy onelifetime.worldiin

- `dws10.com/whitepapers/` ja `dws10.com/playbooks/` (12 kohdetta) → onelifetime.world (UNDERSTAND). dws10.com:iin jää linkki tuotesivulta. Siirto `_OLD`-nimeämisellä, ei poistolla.
- onelifetime.worldiin uudet osiot: `whitepapers/`, `research/`, `seminars/`, `presentations/`, `events/` (workshopit, roundtablet). Nykyiset `posts/` (24 fi), `case-studies/`, `pantheon/`, `dws-ontology/` pysyvät.
- Seminaari- ja workshoptallenteet: Google Meet/Teams → Drive → onelifetime.world/seminars (linkki + tiivistelmä + slidet). Myyntitapahtumat ovat UNDERSTAND-kerroksen osa, eivät BUY:n.

### 11.4 Ensimmäinen viikko (vaihe A, kun HIC hyväksyy)

1. `docs/content-pipeline/chains.md` + kaksi ketjua §11.2 kirjattuina.
2. lifetime.fi/fi etusivun tarina §1 nykyisessä ulkoasussa; kaksi ensimmäistä johtopäätöslausetta linkkeineen.
3. Journal-luonnos _Miksi vaikutusdata on uusi talousdata?_ `/blog-draft`-portille.
4. Some-jonoon 3 nostoa (2 LinkedIn, 1 Meta manuaalisesti) HIC:n hyväksyttäväksi.
5. Whitepapers/playbooks-siirron inventaario onelifetime.worldiin (lista, ei vielä siirtoa).

## 12. Jalostusketju Workflow V2 -prosessina ja Temporal-käyttötapauksena (HIC 24.09.2026, v1.6)

Jalostusketju (§10–11) ei ole toimituskalenteri vaan **pitkäkestoinen, keskeytyvä prosessi**: yksi ketju elää päivistä viikkoihin, odottaa HIC:n päätöksiä, haarautuu viidelle kielelle ja päättyy ulkoisiin julkaisuihin. Se on täsmälleen se muoto, johon Workflow V2 (`src/agents/workflows.ts`, `WorkflowDefinition`/`WorkflowExecutor`) ja Temporal (`src/temporal/`, käyttötapaukset #1–#12 `docs/dws-use-cases.md`) on rakennettu.

### 12.1 Workflow V2 -määrittely: `content-refinement-chain`

Nykyinen `content-pipeline` (Iris → Apollo → emit-event) tuottaa briefin ja päättyy kuolleeseen `emit-event`-askeleeseen (käyttötapaus #10 totesi saman). Uusi määrittely vie ketjun loppuun asti:

| #   | Step id              | Type                                            | Tekijä / aktiviteetti                                                                                                                                      | Tulos                           |
| --- | -------------------- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| 1   | `select-source`      | agent                                           | Iris: valitsee dws10.com-hubista lähdesivun jalostusrekisterin perusteella (mikä on jalostamatta)                                                          | lähde-URL, aihe, kohdetoimiala  |
| 2   | `synthesize`         | parallel                                        | Apollo: johtopäätöslause lifetime.fi:lle (≤3 lausetta) · Athena: Journal-luonnos fi (1 500–4 000 sanaa) · Apollo: 2–4 some-nostoa                          | kolme luonnosta                 |
| 3   | `guardrail`          | condition                                       | `applyEmailHardRules`-tyyppinen sisältötarkistus + `/truth-check` julkisille väitteille; hylkäys palauttaa askeleeseen 2, ei koskaan hiljaista pudotusta   | pass / block + syyt             |
| 4   | `hic-approval`       | **Temporal child** `humanApprovalWorkflow` (#9) | HIC hyväksyy tai hylkää kolmen luonnoksen paketin; Signal, `condition()`-odotus, timeout 7 pv; artefaktilinkki hyväksymispyynnössä (Approval Request Rule) | approved / rejected / timed_out |
| 5   | `publish-journal`    | Standalone Activity                             | git-commit `onelifetime.world/posts/fi/<slug>.html` + peili → Cloudflare Pages deploy; idempotentti slugilla                                               | URL                             |
| 6   | `publish-conclusion` | Standalone Activity                             | lifetime.fi johtopäätöslause + linkki Journaliin (FI master + peili)                                                                                       | URL                             |
| 7   | `enqueue-social`     | Standalone Activity                             | `enqueueDraft` → `social_posts`; julkaisu `publishSocialPostActivity` `startDelay`lla seuraavan viikon arkipäiville (#3)                                   | jono-ID:t                       |
| 8   | `translate`          | parallel, per kieli child workflow              | sv, en, de, fr: `/multilingual` → oma `hic-approval`-lapsi per kieli (kevyempi: HIC hyväksyy käännöksen, ei sisältöä uudelleen) → `publish-journal`        | 4 URL:ää                        |
| 9   | `event-hook`         | condition                                       | Jos ketjulla on seminaari/workshop (§11.2): luo Google Calendar -merkintä ja onelifetime.world/seminars-paikkamerkki                                       | tapahtuma-ID                    |
| 10  | `register`           | Standalone Activity                             | rivi `docs/content-pipeline/chains.md` + tila per kieli; korvaa kuolleen `emit-event`in todellisella tilaajalla                                            | rekisteririvi                   |

`timeoutMs` ei riitä: ketju kestää viikkoja. Siksi ketju ajetaan Temporal-workflow'na (kesto rajaton, tila kestävä), ja `WorkflowExecutor` säilyy vain askelten 1–3 paikallisajoon kehityksessä.

### 12.2 Temporal-käyttötapaus #13: Content refinement chain

- **Current tech:** `content-pipeline` (in-process, 10 min timeout, päättyy emit-eventiin); some-jono `social_posts` + `publishSocialPostActivity` (#3); `humanApprovalWorkflow` (#9); blog-draft-gate hook (chat-turn-sidonnainen, ei kestävä).
- **Gaps:** HIC-hyväksyntä ei ole kestävä tietue vaan chat-portti; ei per-kieli-haaraa; ei jalostusrekisteriä; julkaisu on git push ilman uudelleenyritystä; ei viikkorytmin ajastusta; ei yhteyttä tapahtumiin.
- **Proposed:** `contentRefinementChainWorkflow` (Temporal, pitkäkestoinen) + Temporal Schedule ma 08:00 EET (`ensureContentChainSchedule`, malli `ensureReportSchedulePoll` #4/#8), joka käynnistää askeleen 1. HIC:n Signal-komennot: `npm run temporal:approve -- <chainId> --approve --by "<nimi>"` (#9). Query palauttaa ketjun tilan per kieli HIC:lle (Artifact-tilanäkymä). Kaikki ulkoiset kirjoitukset Standalone Activityina omilla ID:illään (slug/kieli), Temporalin retry-politiikalla.
- **Guardrails:** hard-rules (#12) laajennetaan julkaisusisältöön: ei hintoja lifetime.fi:lle/Journaliin (WHY/UNDERSTAND-sääntö), ei `noreply@`, ei salaisuuksia, `truth-check`-lista kielletyistä väitteistä. Escalate-only-to-block.
- **RED-zone:** blogijulkaisu on Claude Codelle RED (Rule 13). Workflow ei kierrä porttia vaan **on** portti: askel 4 on se HIC-hyväksyntä, jonka hook nyt vaatii chatissa, mutta kestävänä ja auditoituna. Cutover blog-draft-gate → workflow vaatii oman HIC-päätöksen (sama varauma kuin #9:ssä).
- **Ei vielä ajettavissa:** sandboxissa ei ole Temporal-palvelinta (`TEMPORAL_ADDRESS`); sama tila kuin #1–#12. DGX Spark -asennus on edellytys.

### 12.3 Mitä tästä seuraa suunnitelmaan

- §10.5 viikkorytmi = Temporal Schedule + yksi workflow-instanssi per lähdesivu. HIC:n torstai = Signal, ei kokous.
- §11.2 rekisteri `chains.md` on workflow'n kirjoittama, ei käsin ylläpidetty.
- §8.1 blogisarjat ja §8.2 kampanjat ovat ketjun syötteitä (askel 1:n prioriteettilista).

### 12.4 HIC-päätökset (§12)

1. Hyväksytäänkö `content-refinement-chain` Workflow V2 -määrittelynä ja Temporal-käyttötapauksena #13 (koodi vasta hyväksynnän jälkeen; ensin määrittely `src/agents/workflow/workflows/content-refinement-chain.ts` + workflow-luuranko + testit, ei live-ajoa)?
2. Cutover: korvaako askel 4 blog-draft-gate-hookin Journal-julkaisuissa, kun Temporal on DGX:llä pystyssä?
3. Instagram Facebook-adapterin rinnalle: kyllä / ei nyt.

## 13. HIC-päätös — Version 2.0 (24.09.2026)

**Status: HYVÄKSYTTY (APPROVE), ehdollisesti. World Model 1.2.x. Scope: lifetime.fi, onelifetime.world, dws10.com, Workflow v2 Chapters 10–14. Decision Authority: HIC.**

| #   | Päätös                                     | Tulos                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| --- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Strategia §0: WHY → UNDERSTAND → HOW → BUY | Hyväksytty. Roolijakoa ei muuteta enää. lifetime.fi = WHY · onelifetime.world = UNDERSTAND · dws10.com = HOW · dws10.com/buy = BUY                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| 2   | Hero D (§1.1e)                             | Hyväksytty lifetime.fi:n ensisijaiseksi avaukseksi: "Tekoäly oppii. Ymmärtävä ihminen kantaa vastuun päätöksestä. Rakennamme järjestelmiä, joissa havainnot, oppiminen, päätökset ja vaikutukset ovat jäljitettävissä myös vuosien päästä. Teknologia muuttuu. Mallit vaihtuvat. Vastuu säilyy ihmisellä." Yhdistää One Lifetime -filosofian, Workflow v2:n, JEV/KYA:n, HIC-roolin, governancen ja malliriippumattomuuden.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| 3   | Brändilause (§1.1d)                        | Säilytetään: "Tekoäly voi oppia. Vain ihminen voi kantaa vastuun päätöksestä." Käyttö: alatunniste, esitykset, seminaarit, LinkedIn-bannerit, mahdollinen DWS IQ -manifesti. Ei etusivun ensisijainen hero.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| 4   | Lifetime.fi:n positiointi                  | Hyväksytty: ei teknologiaa, ei tuotteita, ei agentteja. Puhuu tarkoituksesta, suunnasta, muutoksesta, kilpailukyvystä, jatkuvuudesta ja turvallisuuden tunteesta, joka perustuu evidenssiin, ymmärrykseen ja päätösten jäljitettävyyteen.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| 5   | Keskeinen asiakasväite                     | **Asiakas ostaa turvallisuuden tunteen, joka perustuu faktoihin ja evidenssiin. Hän haluaa säilyttää ja kehittää ymmärrystä, varmistaa jatkuvuuden, säilyttää kilpailukykynsä ja kasvattaa liiketoimintaansa ilman että teknologian muutos katkaisee oppimisen tai päätöksenteon ketjun.** Näkyy lifetime.fi WHY-tasolla (tehty, hero), Journal-syvätekstinä (sarja 0), DWS IQ:n positioinnissa. Tukilauseet (säilytetään): "Turvallisuuden tunne ei synny lupauksista. Se syntyy faktoista, jotka kestävät aikaa." · "Kilpailukyky ei synny yhdestä teknologiasta. Se syntyy kyvystä oppia, säilyttää ymmärrys ja tehdä parempia päätöksiä vuodesta toiseen." · "Jatkuvuus luo turvallisuuden. Ymmärrys luo kilpailukyvyn. Oppiminen mahdollistaa kasvun." DWS IQ:n positiointi: **Evidenssiin perustuvaa jatkuvuutta. Jatkuvuuteen perustuvaa turvallisuutta. Turvallisuuteen perustuvaa kasvua.** (sovelletaan dws10.com:iin erillisenä vaiheena; LD-2026-09-002 applies_to kattaa sen). |
| 6   | Jalostusketju §10–12                       | Hyväksytty: yksi lähde → neljä muotoa. DWS10 source → Lifetime conclusion → Journal article → Social.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| 7   | Blogisarja 0                               | Aloitetaan ennen termisarjoja, järjestys: (1) Mitä One Lifetime tarkoittaa? (2) Miksi osa yrityksistä kasvaa nopeammin? (3) Miksi digitalisaatiohankkeet epäonnistuvat? (4) Mitä yrittäjän kannattaa automatisoida ensin? (5) Miten tekoäly muuttaa asiantuntijatyötä? (6) Miksi näkyvyys ratkaisee kilpailukyvyn? Peruste: ihmiset hakevat ongelmia, eivät käsitteitä.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 8   | Workflow v2                                | Hyväksytty. Seuraava merkittävä vaihe ei ole uusi sisältö vaan ensimmäinen läpivienti: Construction Lead Package → Chapter 14 → Learning Delta → JEV/KYA → Application Decision → Ontology KB → World Model Update.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 9   | JEV/KYA                                    | Virallinen governance-kerros. Periaate: "Tekoäly oppii. Ymmärtävä ihminen päättää mitä opitulla tiedolla tehdään." Tarkistaa mitä AI oppi, ymmärsikö HIC, hyväksyikö HIC soveltamisen, missä laajuudessa, mihin maailmanmallin versioon.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |

**Lopullinen johtopäätös (HIC):** Asiakas ei osta AI-mallia, agenttia eikä teknologiaa. Asiakas ostaa turvallisuuden tunteen, joka perustuu evidenssiin, jatkuvuuteen, säilyvään ja kehittyvään ymmärrykseen sekä kykyyn kasvaa kilpailukykyä menettämättä. lifetime.fi kertoo tämän; onelifetime.world näyttää miksi se on totta; dws10.com näyttää miten se tehdään; dws10.com/buy mahdollistaa käyttöönoton.

### 13.1 Vaihe A toteutettu (24.09.2026)

- `lifetime.fi/fi/index.html` + peili `landing-pages/lifetime-fi/fi/index.html`: Hero D, asiakasväite (päätös 5), Mitä uskomme (5 korttia → Journal), Mihin maailma on menossa (5 suuntaa), toimialat (5, → dws10.com HOW), Kaksi ovea, Ihminen, alatunniste brändilauseella. Nykyinen ulkoasu ja CSS säilytetty; sisältö vaihdettu. 645 sanaa. `lint-truth-claims`: 0 fail. Etusivun omassa sisällössä nolla tuotenimeä, hintaa, lyhennettä.
- Vanha sisältö arkistoitu `docs/site-archive/lifetime-fi-fi-index-pre-v2-2026-09-24.html` (ei julkinen kansio; Rule 6 ja 12). Siirto dws10.com HOW-kerrokseen on vaihe B.
- **Tehty (A2 + C, 24.09.2026):** oma WHY-tason navigaatio (`.ol-nav`) korvaa jaetun tuotevalikon ja -alatunnisteen etusivuilla; kielipalkki v1.1 näyttää brändilauseen viidellä kielellä; etusivu generoidaan yhdestä sisältölähteestä `lifetime.fi/config/front-page.i18n.json` (fi master) skriptillä `scripts/build-lifetime-fi-front.mjs` kaikille kielille en/fi/sv/de/fr + peili; `--check` valvoo tuoreutta; hreflang ×5 + x-default, Organization JSON-LD. Vanhat en/sv/de/fr arkistoitu `docs/site-archive/`.
- **Aiemmin avoin (nyt suljettu):** jaetut `shared-assets`-komponentit (`ironclad-nav.js`, `ironclad-footer.js`, `vertical-lang-bar.js`) tuovat sivulle edelleen tuotevalikot, "Complex Workflow Specialists" -tunnuksen ja "Digitaalisten tuotteiden erikoisliike" -kielipalkin. Ne ovat kaikkien sivustojen yhteisiä; lifetime.fi tarvitsee oman WHY-tason navigaation ja kielipalkin tekstin. Ehdotus: vaihe A2 ennen käännöksiä.
- Käännökset en/sv/de/fr (vaihe C) ja Journal-sarja 0 (päätös 7) seuraavat.

## 14. Active Ontology & Agentic Commerce — DISCOVER-kerros (v2.3, HIC + Copilot 24.09.2026)

**Aktiivisen ontologian tehtävä ei ole kertoa asiakkaalle mitä tiedämme. Sen tehtävä on vähentää asiakkaan epävarmuutta niin paljon, että hän voi tehdä päätöksen luottavaisesti.** Active Ontology on Uncertainty Reduction System, ei Recommendation System.

**Perusajatus: asiakas ei aloita tuotteesta. Asiakas aloittaa tilanteesta.** Kerrosmalliin tulee
yksi kerros lisää UNDERSTAND:in ja HOW:n väliin:

```
WHY (lifetime.fi) → UNDERSTAND (Journal) → DISCOVER (active ontology, dws10.com etusivu)
→ HOW (dws10.com ratkaisut) → BUY (dws10.com/buy)
```

### 14.1 Virallinen Learning Delta

|                    |                                                                                                                                                                                                                                                                              |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Vanha oletus       | Asiakas etsii tuotetta. Verkkokaupan tehtävä on näyttää tuotteet. Agentic Commerce = tuotesuositus / AI-chat.                                                                                                                                                                |
| Uusi oppiminen     | Asiakas yrittää tehdä päätöksen. Agentic Commerce auttaa päättämään; ostaminen on seuraus. Active Ontology = epävarmuuden vähentäminen, ei tuotesuositus.                                                                                                                    |
| Evidenssi          | Ford S-Max EGR -tapaus (MS-2026-09-003: ostettiin hypoteesia, ei osaa; kauppias hävisi diagnostiikkaan), Kemira-tapaus (tuotantoerien hiilijalanjälki; tuote tulee lähes viimeisenä), MS-004 (asiakas hakee päätöstä, ei tietoa), MS-005 (hakukenttä on Observation Sensor). |
| Application Record | LD-2026-09-003 APPLY (wm 1.3.0), LD-004 APPLY (1.4.0), LD-005 APPLY (1.5.0); scope dws10.com ja dws10.com/buy; ei lifetime.fi, ei Investor Centre.                                                                                                                           |

Tämä on suurempi strateginen havainto kuin yksikään hero, kampanja tai blogisarja: se muuttaa
DWS10:n, dws10.com/buy:n ja Agentic Commerce -ajattelun perustan.

### 14.2 Periaatteet

1. **Active Ontology ei ole chat-first.** Tilanne → Valinnat → Hypoteesi → Suositus, ei "Kerro
   ongelmastasi…". Chat voi olla yksi käyttöliittymä myöhemmin; ontologia on päättelykerros.
2. **Kysymys ensin, toimiala toisena (HIC 24.09.2026).** Ensimmäinen näkymä on kysymys, ei toimialavalinta. Ontologia arvaa toimialan tekstistä; jos varmuus jää matalaksi, kysytään "Ymmärsinkö oikein? ○ Teollisuus ○ Rakentaminen ○ Energia ○ Logistiikka ○ Muu". 25 toimialaa ovat valittavissa, mutta valinta tuntuu vahvistukselta, ei lomakkeelta.
3. **Yksi sisäänmeno.** dws10.com:n etusivulle näkyvä kysymys **"Mikä päätös on tällä hetkellä
   vaikea tehdä?"** yhdistää Ford-, Kemira-, NIS2-, näkyvyys- ja automaatiotapaukset yhdeksi
   oveksi. Se on samalla Observation Intake (Chapter 14 alkaa etusivulta).
4. **Tuote tulee lähes viimeisenä.** Tilanne → mitä emme tiedä → miksi → mikä epävarmuus estää
   päätöksen → miten se poistetaan → mitä pitää tehdä → mitä kannattaa hankkia. Ratkaisut
   näytetään vasta, kun ongelma on ymmärretty, ja jokaisen kohdalla "miksi tätä suositellaan".
5. **Asiantuntija, ei chatbot.** "Tunnistan viisi mahdollista syytä, kaksi todennäköistä. Vastaa
   tähän yhteen kysymykseen, niin suljemme kolme pois." Jokainen kysymys kertoo, mitä se sulkee pois.
6. **Mitään ei poisteta.** 136 tuotetta pysyvät; näkymästä tehdään älykäs.
7. **Asiakas opettaa ontologiaa.** Kerätään query · industry · page · ontology_guess ·
   recommended_path · selected_path · result (anonymisoituna). Suositellun ja valitun ero on
   ontologian virhesignaali.

### 14.3 Toteutus

Spesifikaatio: `docs/specs/active-ontology-ux-v2.md` (PR #2059). Ensimmäinen versio ei ole agentti
eikä chat vaan toimialavalinta + yksi kenttä + valintapolku viidelle toimialalle (rakentaminen,
energia, kemia, logistiikka, verkkoliiketoiminta), data `dws10.com/config/active-ontology.json`,
havainnot `POST /api/v1/observations` → `market_signals` (signal_type website_observation).
Mittarit: kentän käyttöaste vs. haku, buy→checkout-keskeytys, väärä suositus < 1/20, ensimmäisen
kysymyksen keskeytys < 50 %.

### 14.4 Datalähteet ja niiden arvo Active Ontologialle

| Lähde                              | Kertoo                                                          | Ei kerro                   | Käyttö                                                                                                                                                                                                                                  |
| ---------------------------------- | --------------------------------------------------------------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cloudflare Analytics               | kuinka monta tuli: sivut, maat, refererit, botit, 404, polut    | mitä kävijä yritti tehdä   | Reality-rivi Control Roomiin; entry/exit-sivut kertovat, mihin Observation Intake sijoitetaan                                                                                                                                           |
| Google Merchant Center (0 kauppaa) | mitkä tuotteet saivat näyttöjä ja klikkejä, millä hakutermeillä | miksi klikannut ei ostanut | Havainto, ei epäonnistuminen: "74 klikkasi, kukaan ei ostanut" → hypoteesit: tuote / hinta / luottamus / ongelma ei ratkaistu / asiakas ei ymmärtänyt mihin tuote liittyy. HIC:n hypoteesi: ontologia puuttuu, ei tuotteet ole huonoja. |
| dws10.com sisältö- ja tuotedata    | 136 tuotetta, hubit                                             | tilanne                    | Active Ontologyn tarjontapuoli                                                                                                                                                                                                          |
| **Observation Intake (uusi)**      | miksi tuli, mitä yritti ratkaista, toimiala                     | –                          | Chapter 14 CAPTURE; ainoa lähde, joka vastaa "miksi"                                                                                                                                                                                    |

Tila 24.09.2026: Cloudflare- ja Merchant Center -tunnuksia ei ole tässä ympäristössä
(`CLOUDFLARE_API_TOKEN`, GMC-tunnukset puuttuvat); luvut haetaan DGX/HIC-ympäristöstä tai HIC
liittää raportin. Hakuohje HIC:lle (Cloudflare): Top URLs, Entry pages, Exit pages, Referrers,
Search queries, Countries, Top paths; (Merchant): näytöt, klikit, hakutermit, per tuote.

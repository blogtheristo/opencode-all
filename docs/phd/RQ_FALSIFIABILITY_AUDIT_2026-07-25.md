# Tutkimuskysymysten falsifioitavuusauditointi — testbed-kriteeri

***

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: claude/greg-isenberg-field-notes-a2r544 | Date: 25.07.2026 | Changes: Luotu HIC:n metodologisesta havainnosta (*"nykyinen 3.86 on kuvausta testbed tuotantoympäristöstä johon liittyvät tutkimuskysymykset. Tekstin ei ole tarkoitus vastata tutkimuskysymyksiin. Jos teksti jo vastaa RQ:hon tai vastaus syntyy nykyisen aineiston pohjalta helposti on RQ väärin muotoiltu."*). Kriteeri formalisoitu kolmen kysymyksen testiksi ja ajettu lukitun kuuden RQ:n läpi. **Yksi kuudesta kaatuu — ja se on juuri se, joka on nimetty selkärangaksi.** Tämä on syöte mahdolliseen lukituksen versioon 2, ei yksipuolinen muutos: lukitussääntö 2 vaatii HIC:n päätöksen ja kirjatun syyn.

***

## HIC:n havainto, ja miksi se on oikea

> *"Minusta nykyinen 3.86 on kuvausta testbed tuotantoympäristöstä johon liittyvät tutkimuskysymykset. Tekstin ei ole tarkoitus vastata tutkimuskysymyksiin. Jos teksti jo vastaa RQ:hon tai vastaus syntyy nykyisen aineiston pohjalta helposti on RQ väärin muotoiltu."*

Tämä ratkaisee kysymyksen, joka on ollut auki koko `PHD_FIREHORSE`-korpuksen ajan: **mikä dokumentti oikeastaan on.**

Se ei ole väitöskirjan luonnos. Se on **testipenkin kuvaus** — 3 500 riviä tuotantoympäristöä, jonka arkkitehtuuri, mittaukset, sääntelykartoitus ja signaalihavainnot on kirjattu tiheästi ja rehellisesti. Tutkimuskysymykset **liittyvät** siihen; ne eivät ole sen sisällysluettelo.

**Tästä seuraa kriteeri, jota ei aiemmin ollut:** tutkimuskysymys sijaitsee **kuilussa** sen välillä, mitä testipenkki osoittaa ja mitä se ei voi osoittaa. Jos kysymys putoaa kuilun väärälle puolelle — testipenkin sisään — se ei ole kysymys vaan dokumentaatio.

**Miksi tämä kriteeri on tarpeen juuri tässä työssä.** Testipenkki on poikkeuksellisen rikas. Se sisältää arkkitehtuurin, mittausdataa, sääntelykartoituksen, referenssitoteutuksen ja spesifikaation. **Rikas testipenkki houkuttelee kirjoittamaan kysymykset siitä käsin** — ja silloin ne vastaavat itseään. Tämä on täsmälleen se mekanismi, joka tuotti sarjan A ja B: kysymykset kirjoitettiin korpuksesta, ei sitä vastaan.

## Kriteeri operatiivisena — kolmen kysymyksen testi

Jokaiselle RQ:lle:

**T1 — Vastaisiko pätevä lukija tähän pelkän v3.86:n perusteella?**
Jos kyllä → se ei ole tutkimuskysymys vaan **dokumentaatiota**.

**T2 — Syntyisikö vastaus nykyisestä aineistosta viikossa?**
Jos kyllä → se ei ole tutkimuskysymys vaan **analyysitehtävä**.

**T3 — Jos vastaus osoittautuu kielteiseksi — "ei toimi", "ei riitä", "ei omaksuttu" — olisiko se julkaisukelpoinen löydös?**
Jos ei → kysymys ei ole **falsifioitava**. Se odottaa lopputulosta, ei tutki mitään.

**T3 on tärkein ja se on uusi.** T1 ja T2 seulovat triviaalit kysymykset. T3 seuloo jotain vaarallisempaa: kysymykset, jotka **odottavat prosessia eivätkä tutki ilmiötä**. Niiden kielteinen vastaus ei ole löydös vaan viivästys — eikä viivästyksestä saa väitöskirjaa.

> **Huomio koherenssista.** Tämä kriteeri on sama periaate, joka korpuksessa jo on kahdessa paikassa: §10.26:n **falsifiointi testin laatuporttina** (testi, joka läpäisee ennen korjausta ja sen jälkeen, ei kanna informaatiota) ja §14.42:n **nelivaiheinen falsifioitavuuskriteeri hallintaväitteille**. HIC on päätynyt samaan periaatteeseen itsenäisesti, nyt sovellettuna tutkimuskysymyksiin. **Periaate kannattaa lausua kerran ja soveltaa kolmessa paikassa** — se on itsessään väitöskirjan metodologinen kontribuutio.

---

## Auditointi — lukitut kuusi testiä vasten

### RQ1 — Formaali todentaminen · ✅ LÄPÄISEE

*"How can sovereign edge AI orchestration be formally verified for trustworthiness in regulated industrial environments?"*

| Testi | Tulos |
| ----- | ----- |
| T1 | **Ei.** Korpus kuvaa orkestroinnin (MCP Hub, kolme työnkulkumallia, Aegis) mutta **ei sisällä yhtään formaalia menetelmää** — ei todistusvelvoitteita, ei mallintarkastusta, ei temporaalilogiikkaa |
| T2 | **Ei.** Formaali todentaminen on menetelmätyötä, jota ei ole aloitettu |
| T3 | **Kyllä.** *"Suvereenia reunaorkestrointia ei voi formaalisti todentaa nykyisillä menetelmillä ilman X:ää"* on julkaisukelpoinen tulos |

**Riski ei ole trivialiteetti vaan laajuus.** "Formally verified" on raskas sitoumus. Se on eri ongelma kuin tämän auditoinnin kohde, mutta se on kirjattava: kysymys on hyvä, mutta se on rajattava todennettavaan osajärjestelmään ennen artikkelia.

### RQ2 — Hallintorakenteet oikeudellisesti puolustettaville tuloksille · ⚠️ LÄPÄISEE VAROITUKSELLA

*"What governance structures are required for multi-agent AI systems to produce legally defensible environmental compliance outputs under EU regulation?"*

| Testi | Tulos |
| ----- | ----- |
| T1 | **Osin kyllä.** Korpus esittää hallintorakenteet: artikla 12 -lokitus, KYA-todisteketju, Themis-portti, vaatimustenmukaisuustaulukko prosentteineen (AI Act 80 %, GDPR 95 %, CSRD 85 %) |
| T2 | **Ei** — mutta vain koska sana *"required"* tekee kysymyksestä normatiivisen |
| T3 | **Kyllä.** *"Todisteketju ei kestä oikeudellista tarkastelua, koska…"* on löydös |

**Diagnoosi: sana "required" kantaa koko kysymyksen.** Ilman sitä kysymys kuuluisi *"mitä rakenteita me rakensimme"* — ja siihen korpus vastaa. Normatiivinen väite (*mitä vaaditaan*) tarvitsee ulkoisen validoinnin, jota korpuksessa ei ole.

**Vahvistava seikka, joka on kirjattava:** backlogin **B10** — todisteketjun taulukot ovat elossa mutta **niissä on nolla riviä.** Ketju ei ole koskaan kirjannut yhtään mandaattia. Korpus ei siis edes väitä osoittavansa, että rakenne toimii. **Kuilu on aito ja se on nyt dokumentoitu.**

**Terävöityssuunta:** siirrä kysymys normatiivisesta falsifioitavaan — *mikä saisi todisteketjun kaatumaan oikeudellisessa menettelyssä?* Se on testattava eikä vastattavissa korpuksesta.

### RQ3 — Läpinäkyvyyden operationalisointi julkiseksi luettavuudeksi · ✅ LÄPÄISEE, mutta kaatuu muusta syystä

*"How can sovereign AI system transparency be operationalized for public legibility under EU AI Act Article 50?"*

| Testi | Tulos |
| ----- | ----- |
| T1 | **Ei.** Korpuksessa ei ole käytännössä mitään artikla 50:stä eikä julkisesta luettavuudesta |
| T2 | **Ei.** Aineistoa ei ole |
| T3 | **Kyllä** |

**Läpäisee testin puhtaimmin koko sarjasta — ja se on huono uutinen.** Se läpäisee, koska korpuksessa ei ole *mitään* siihen liittyvää: ei artefaktia, ei mittausta, ei ankkuria (Universeum/Chalmers ei vastannut 14.7. mennessä).

**Tämä on eri vikatyyppi kuin muut.** Muut riskeeraavat olevansa liian lähellä korpusta; RQ3 on liian kaukana. **Kysymys ilman testipenkkiä ei ole sen parempi kuin kysymys, jonka testipenkki jo vastaa.** Molemmissa kuilu on väärän kokoinen.

### RQ4 — Turvallisuus–suorituskyky-vaihtokauppa · ⚠️ KAPEA KUILU

*"How can safety-performance trade-offs in sovereign edge AI systems be formally modeled and validated under real-time operational constraints?"*

| Testi | Tulos |
| ----- | ----- |
| T1 | **Osin kyllä.** Korpuksessa on vaihtokaupan **datapisteet**: 500–2 000 ms pilvi vs. < 100 ms reuna, 555 €/kk vs. 10 €/kk, ROI 1,95 kk, Jetson-mittaukset |
| T2 | **Raja.** Datapisteistä mallin muotoilu on lähellä viikon työtä |
| T3 | **Kyllä**, jos malli on ennustava eikä kuvaileva |

**Diagnoosi: kuilu on aito mutta kapea, ja kysymys ei tee sitä näkyväksi.** Vaihtokaupan **mittaaminen** ei ole sen **formaalia mallintamista** — mutta lukija, joka näkee korpuksen mittaukset, kysyy *"mikä tässä on uutta?"*, ellei kysymys itse kerro sitä.

**Terävöityssuunta:** kysymyksen on nimettävä se, mitä mittaukset **eivät** anna — ennustavuus uusissa konfiguraatioissa, turvallisuusargumentin kelpoisuus SAFECOMP-mielessä, tai vaihtokaupan käyttäytyminen kuormituksen ääripäissä. Ilman sitä RQ4 lukee jo tehtynä.

### 🔴 RQ5 — KYA konformanssistandardina · **KAATUU**

*"How can a Know-Your-Agent (KYA) trust-scoring model be designed and validated as an open conformance standard for agentic AI in EU-regulated industries?"*

**Tämä on sarjan nimetty tekninen selkäranka, ja se on ainoa, joka kaatuu testissä.** Kysymys hajoaa kahtia, ja molemmat puolet epäonnistuvat eri tavalla.

#### Puoli 1 — "how should it be **designed**" → T1 kaatuu

Korpus **vastaa tähän jo**:

| Mitä kysymys kysyy | Missä korpus vastaa |
| ------------------ | ------------------- |
| Luottamuspisteytysmalli | **ATS-kaava julkaistu** (päätös 3A) — `ATS = max(0, 1.0 − V×0.25 − L − D×0.05 + A×0.15)` |
| Standardin muotoilu | **KYA Specification v1.5 / SPEC v0.3** olemassa, luvut ja konformanssikieli mukaan lukien |
| Konformanssi jurisdiktioittain | **§10 profiilit** (EU/US/SG) — *"profiili voi kiristää ydin-MUSTin, ei koskaan löysentää"* |
| AI Act 12/14/72 -kartoitus | Tehty |
| Referenssitoteutus | Olemassa, tuotannossa |

**Pätevä lukija vastaa tähän puoleen v3.86:n ja `standards/kya-open/SPEC.md`:n perusteella.** Se ei ole tutkimuskysymys — se on tehty työ.

#### Puoli 2 — "and **validated** as an open conformance standard" → T3 kaatuu

Korpus sisältää **oman kriteerinsä** sille, mitä validointi tarkoittaisi — SPEC §0.6:n **neljä porttia**: kaksi riippumatonta toteutusta · konformanssisarja, joka voi kaatua · elimen hyväksyntä tai aito omaksuminen · muutoshallinta, joka elää tekijänsä yli.

Ja se kirjaa rehellisesti, että **portteja on täytetty nolla neljästä.**

**Mutta portin läpäisy ei ole tutkimustulos.** Kaksi riippumatonta toteutusta ja standardointielimen hyväksyntä ovat **prosessin lopputuloksia**, eivät löydöksiä. Sovella T3:a: jos vastaus on *"KYA:ta ei ole omaksuttu"*, onko se julkaisukelpoinen löydös?

**Ei ole. Se on viivästys.**

> **Väitöskirjaa ei saa odottamisesta.** Kysymys, jonka kielteinen vastaus on *"ei vielä"*, ei ole falsifioitava — se on aikataulu.

#### Mitä RQ5:n tilalle — ja se on korpuksessa jo

Tässä on auditoinnin rakentava osa. **Korpus sisältää sen tutkimuskysymyksen, jonka RQ5 olisi pitänyt olla** — se syntyi juuri siitä, että KYA:ta yritettiin viedä standardiksi:

- **§10.27 artefakti–legitimiteetti-aukko.** Frontier-mallit tiivistävät artefaktin *tuottamisen* kuukausista tunteihin, mutta eivät tiivistä — eivätkä rakenteellisesti voi — sitä mikä tekee siitä *legitiimin*. Artefakti on valmis kauan ennen kuin se on legitiimi.
- **Yhteensovitusvelka.** Katselmoimaton iteraatio parantaa dokumenttia **väärää tavoitefunktiota vasten** ja voi ajautua *kauemmas* omaksuttavuudesta samalla kun se näyttää paranevan jokaisella sisäisesti näkyvällä mittarilla.
- **§14.42 nelivaiheinen falsifioitavuuskriteeri** hallintaväitteille — ja sanan *"standardi"* ansaitsemisen ehdot.

**Tämä on aitoa tutkimusta.** Se on uutta, se on falsifioitavissa, se on **oman kokemuksen tuottamaa** eikä kirjallisuudesta lainattua, ja **korpus ei vastaa siihen — korpus on sen todiste.**

**Terävöityssuunta RQ5:lle:**

> *Mikä erottaa spesifikaation standardista agenttihallinnassa, ja mikä on falsifioitava kriteeri sille erolle, kun artefaktin tuotantonopeus on irronnut sen legitimoinnin nopeudesta?*

KYA on tämän kysymyksen **tapaustutkimus**, ei sen vastaus. Silloin nolla neljästä portista ei ole epäonnistuminen vaan **havaintoaineistoa** — ja se on juuri se käänne, joka tekee kysymyksestä falsifioitavan.

### RQ6 — Siirtymän hallinta · ✅ LÄPÄISEE

*"How can industrial enterprises govern the transition from voluntary ESG reporting to mandatory sovereign-AI compliance infrastructure without disrupting existing management systems?"*

| Testi | Tulos |
| ----- | ----- |
| T1 | **Ei.** Korpuksessa on **yhden** yrityksen siirtymä — oma — ja pilotteja. Kysymys koskee teollisuusyrityksiä yleisesti |
| T2 | **Ei.** Vaatii tapauksia, joita ei vielä ole |
| T3 | **Kyllä.** *"Siirtymä ei onnistu häiritsemättä, koska…"* on löydös |

**Riski on päinvastainen kuin RQ5:llä: aineistoa on liian vähän, ei liikaa.** Se on korjattavissa työllä (tapaukset), toisin kuin RQ5:n vika, joka on korjattavissa vain uudelleenmuotoilulla.

---

## Tulos

| RQ | T1 | T2 | T3 | Tuomio |
| -- | -- | -- | -- | ------ |
| **1** Formaali todentaminen | ✅ | ✅ | ✅ | Läpäisee · riski: laajuus |
| **2** Hallintorakenteet | ⚠️ | ✅ | ✅ | Läpäisee · *"required"* kantaa kysymyksen |
| **3** Läpinäkyvyys / art. 50 | ✅ | ✅ | ✅ | Läpäisee · **ei testipenkkiä** |
| **4** Turvallisuus–suorituskyky | ⚠️ | ⚠️ | ✅ | Kapea kuilu · ei tee sitä näkyväksi |
| 🔴 **5** KYA-standardi | ❌ | ❌ | ❌ | **Kaatuu molemmin puolin** |
| **6** Siirtymän hallinta | ✅ | ✅ | ✅ | Läpäisee · aineistoa liian vähän |

## Kolme johtopäätöstä

**1. Kaatuva kysymys on se, joka on grounded-tuin — eikä se ole sattumaa.**

RQ5 on ainoa kysymys, jonka artefakti on kokonaan omissa käsissä. Juuri siksi se on **kaikkein vastatuin**. Kriteeri tuottaa vastaintuitiivisen mutta oikean tuloksen: **mitä paremmin kysymys on ankkuroitu omaan työhön, sitä suurempi riski että oma työ on jo vastannut siihen.**

Tämä kääntää sen, mitä lukitusdokumentissa pidettiin RQ5:n vahvuutena (*"ainoa kysymys, jonka artefakti on kokonaan omissa käsissä"*). Se on yhä totta — mutta se on **riski eikä pelkkä ansio**, ja se on nyt kirjattu molempiin.

**2. Vikoja on kaksi tyyppiä, ja ne ovat vastakkaisia.**

*Liian lähellä* korpusta (RQ5, osin RQ2 ja RQ4) — vastaus on jo olemassa. *Liian kaukana* (RQ3) — testipenkkiä ei ole. **Kysymys ilman testipenkkiä ei ole parempi kuin kysymys, jonka testipenkki jo vastaa.** Molemmissa kuilu on väärän kokoinen; vain merkki eroaa.

**3. Kriteeri on itsessään kontribuutio.**

T1–T3 on käytännössä sama falsifiointiperiaate, joka korpuksessa jo on kahdessa paikassa (§10.26 testin laatuporttina, §14.42 hallintaväitteille) — nyt kolmantena sovelluksena tutkimuskysymyksiin. **Kolme sovellusta yhdestä periaatteesta on metodologinen kontribuutio**, ei sattuma. Se kannattaa lausua väitöskirjassa kerran omana lukunaan ja soveltaa kolmesti.

## Mitä tämä ei ole

**Tämä ei muuta lukitusta.** Lukitussääntö 2 vaatii versiopäivityksen ja kirjatun syyn, ja sääntö 3 muistuttaa että sarja on Smolanderin postilaatikossa — muutos on ulkoinen teko.

Tämä on **syöte päätökseen**, ei päätös. Vaihtoehdot:

- **(a)** Pidä sarja ennallaan, terävöitä vain RQ5 — pienin muutos, ja se on ainoa joka kaatuu testissä
- **(b)** Terävöitä RQ2, RQ4 ja RQ5 — kolme muotoilua, sama kuusi kysymystä
- **(c)** Pidä ennallaan ja käsittele kriteeri **väitöskirjan metodologialuvussa** — kysymykset pysyvät, mutta työ kertoo itse, missä kuilut ovat

**Suositus: (a).** RQ5 on ainoa, joka kaatuu, ja sen terävöitys **vahvistaa sarjaa** — se siirtää selkärangan tehdystä työstä siihen mitä työ paljasti. Vaihtoehto (c) on hyvä lisä mihin tahansa, koska se tekee kriteeristä näkyvän eikä vain sovelletun.

**Ja huomaa mitä (a) maksaa Smolanderille:** ei mitään kiusallista. RQ5:n terävöitys ei ole peruutus vaan syvennys — *"kysymys ei ole miten KYA suunnitellaan, vaan mikä erottaa spesifikaation standardista"* on ohjaajalle vahvempi viesti kuin alkuperäinen, ei heikompi.

## Liittyvät

- `docs/phd/PHD_RESEARCH_QUESTIONS_LOCK_v1.md` — lukitut kuusi, lukitussäännöt
- `docs/phd/PHD_STRUCTURE_AUDIT_2026-07-25.md` — rakennevirheet, §1.2.2:n viittausvirhe
- `standards/kya-open/SPEC.md` §0.6 — neljä porttia · §10 — jurisdiktioprofiilit
- `V3Thesis` §10.26 (falsifiointi testin laatuporttina) · §10.27 (artefakti–legitimiteetti-aukko)
- `PHD_FIREHORSE` §14.42 (spesifikaatio vs. standardi) · §14.43 (jurisdiktioprofiilit)
- `docs/backlog/BACKLOG_UNDONE_2026-07-24.md` — B10, todisteketjussa nolla riviä

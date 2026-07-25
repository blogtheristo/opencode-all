# RQ1–RQ6 — vanha ja terävöitetty, rinnakkain

***

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: claude/greg-isenberg-field-notes-a2r544 | Date: 25.07.2026 | Changes: Luotu HIC:n pyynnöstä (*"Anna RQ1-RQ6 vanha versio ja terävöitetty niin koetan ymmärtää ajatuksesi. Kirjaa kysymyksen alle ajattelusi pääpointti"*). Rinnakkaisvertailu kaikista kuudesta, kunkin alla yhden kappaleen pääpointti. **Vain RQ5 vaatii muutoksen** (`RQ_FALSIFIABILITY_AUDIT_2026-07-25.md`); muut viisi ovat tarkkuusliikkeitä, ja se on merkitty jokaisen kohdalle. Ei muuta lukitusta — lukitussääntö 2 vaatii HIC:n päätöksen.

***

## Miten tätä luetaan

**Vain RQ5 kaatui auditoinnissa.** Muiden viiden terävöitys on **valinnainen tarkkuusliike**, ei korjaus. Jokaisen kohdalla lukee kumpi on kyseessä, jotta et joudu arvaamaan mikä on välttämätöntä ja mikä ehdotettua.

Kaikkien vanhojen muotoilujen lähde: `docs/lut/2026-07-14-letter-smolander-six-questions.md`, **lähetetty 14.07.2026**.

---

## RQ1 — Formaali todentaminen · ⚪ tarkkuusliike, ei pakollinen

**Vanha**
> *How can sovereign edge AI orchestration be **formally verified for trustworthiness** in regulated industrial environments?*

**Terävöitetty**
> *Mitkä suvereenin reunaorkestroinnin luotettavuusominaisuudet ovat **formaalisti todennettavissa**, ja **mihin todennettavuuden raja asettuu** — mikä jää näytön varaan sen sijaan että se todistettaisiin?*
>
> *Which trustworthiness properties of sovereign edge agent orchestration are formally verifiable, and where does the verifiable boundary fall — what must remain evidenced rather than proven?*

### Pääpointti

**"Luotettavuus" ei ole formaali ominaisuus, vaan joukko ominaisuuksia, joista osa on todennettavissa ja osa ei.** Vanha muoto lupaa todentaa koko luotettavuuden, mikä on lupaus jota ei voi lunastaa — ja kun sitä ei lunasteta, tulos näyttää epäonnistumiselta. Terävöitetty muoto tekee **rajasta itsestään löydöksen**: vastaus *"vain nämä kolme ominaisuutta ovat todennettavissa, loput vaativat näyttöä"* on julkaisukelpoinen tulos, ei puolitiehen jäänyt yritys. Raja on myös täsmälleen se, mitä Törngren osaa arvioida — SAFECOMP-perinne elää juuri siinä, mitä todistetaan ja mitä argumentoidaan.

---

## RQ2 — Hallintorakenteet · 🟡 suositeltu, koska "required" kantaa koko kysymyksen

**Vanha**
> *What governance structures are **required** for multi-agent AI systems to produce legally defensible environmental compliance outputs under EU regulation?*

**Terävöitetty**
> *Millä ehdoilla moniagenttinen todisteketju **lakkaa olemasta oikeudellisesti puolustettava**, ja mitkä kaatumistavat ovat **rakenteellisia** eivätkä toteutusvirheitä?*
>
> *Under what conditions does a multi-agent evidence chain fail to be legally defensible, and which failure modes are structural rather than implementation defects?*

### Pääpointti

**Sana "required" tekee kysymyksestä normatiivisen, ja normatiiviseen ei voi vastata ilman oikeudellista koettelua, jota ei ole olemassa.** Ilman sitä sanaa kysymys kuuluisi *"mitä rakenteita me rakensimme"* — ja siihen korpus vastaa jo. Käännetty muoto kysyy mikä **kaataa** ketjun, ja siihen voi vastata rakentamalla kaatavia tapauksia itse. **Ja tässä backlogin B10 muuttuu esteestä lähtökohdaksi:** todisteketjun taulukot ovat elossa mutta niissä on nolla riviä. Tyhjä ketju on paras mahdollinen paikka kysyä, mikä sen täyttämisessä voi mennä pieleen — ennen kuin sinne on kertynyt dataa, jota ei halua menettää.

---

## RQ3 — Läpinäkyvyys / artikla 50 · 🟡 suositeltu, koska kysymykseltä puuttuu testipenkki

**Vanha**
> *How can sovereign AI system transparency be operationalized for **public legibility** under EU AI Act Article 50?*

**Terävöitetty**
> *Mitä agenttihallinnan todisteketju voi **paljastaa ei-asiantuntijalukijalle** menettämättä näyttöarvoaan tai rikkomatta luottamuksellisuutta — ja onko artiklan 50 luettavuus saavutettavissa **samasta artefaktista**, joka palvelee artiklaa 12?*
>
> *What can an agent-governance evidence chain disclose to a non-expert reader without losing evidentiary value or breaching confidentiality — and is Article 50 legibility achievable from the same artifact that serves Article 12?*

### Pääpointti

**Tämä kysymys läpäisi testin puhtaimmin koko sarjasta, ja se oli huono uutinen.** Se läpäisi, koska korpuksessa ei ole *mitään* siihen liittyvää — ei artefaktia, ei mittausta, eikä ankkuri ollut vastannut. **Kysymys ilman testipenkkiä ei ole parempi kuin kysymys, jonka testipenkki jo vastaa;** kuilu on väärän kokoinen molemmissa, vain merkki eroaa. Terävöitys ei vaihda aihetta vaan **antaa sille testipenkin, joka on jo olemassa**: sama todisteketju, jonka RQ2 ja RQ5 rakentavat. Samalla kysymykseen tulee aito jännite — artikla 12 vaatii täydellisyyttä, artikla 50 vaatii luettavuutta, ja luottamuksellisuus rajoittaa molempia. **Kolme vaatimusta samasta artefaktista on tutkimuskysymys; "miten läpinäkyvyyttä tehdään" ei ole.**

---

## RQ4 — Turvallisuus–suorituskyky · 🟡 suositeltu, koska kuilu on olemassa mutta näkymätön

**Vanha**
> *How can safety-performance trade-offs in sovereign edge AI systems be **formally modeled and validated** under real-time operational constraints?*

**Terävöitetty**
> *Yleistyvätkö mitatut turvallisuus–suorituskyky-vaihtokaupat **ennustavaksi malliksi**, vai onko jokaisen konfiguraation vaihtokauppakäyrä empiirinen — ja mitä se merkitsee SAFECOMP-tyyliselle turvallisuusargumentille?*
>
> *Do measured safety-performance trade-offs generalise to a predictive model, or is each configuration's trade-off curve empirical — and what does that imply for a SAFECOMP-style safety argument?*

### Pääpointti

**Korpus antaa vaihtokaupan datapisteet** — 500–2 000 ms vs. < 100 ms, 555 €/kk vs. 10 €/kk, ROI 1,95 kk, Jetson-mittaukset. **Vaihtokaupan mittaaminen ei ole sen formaalia mallintamista**, mutta ero on niin kapea, että lukija joka näkee mittaukset kysyy *"mikä tässä on uutta?"* — ellei kysymys itse kerro sitä. Terävöitys sanoo eron ääneen yhdellä sanalla: **ennustavuus**. Ja se tekee kysymyksestä falsifioitavan molempiin suuntiin: jos vaihtokauppa **ei** yleisty, se on tulos — ja itse asiassa kiinnostavampi tulos kuin jos se yleistyy, koska se rajoittaa jokaista turvallisuusargumenttia, joka nojaa siirrettävään mittaukseen.

---

## 🔴 RQ5 — KYA-standardi · **pakollinen muutos — tämä on ainoa, joka kaatui**

**Vanha**
> *How can a Know-Your-Agent (KYA) trust-scoring model be **designed and validated as an open conformance standard** for agentic AI in EU-regulated industries?*

**Terävöitetty**
> *Mikä erottaa **spesifikaation standardista** agenttihallinnassa, ja mikä on **falsifioitava kriteeri** sille erolle, kun artefaktin tuotantonopeus on irronnut sen institutionaalisen legitimoinnin nopeudesta? (KYA tapaustutkimuksena.)*
>
> *What distinguishes a specification from a standard in agent governance, and what falsifiable criterion marks that difference once artifact production has decoupled from institutional legitimation? (KYA as the case.)*

### Pääpointti

**Kysymys hajoaa kahtia, ja molemmat puolet kaatuvat eri tavalla.**

*"How should it be **designed**"* — **korpus vastaa jo.** ATS-kaava on julkaistu, SPEC v0.3 on olemassa konformanssikielineen, jurisdiktioprofiilit on kirjoitettu, referenssitoteutus on tuotannossa. Pätevä lukija vastaa tähän puoleen ilman uutta tutkimusta.

*"and **validated** as an open conformance standard"* — kaatuu falsifioitavuuteen. Korpus sisältää **oman kriteerinsä** validoinnille — §0.6:n neljä porttia — ja kirjaa rehellisesti, että portteja on täytetty nolla neljästä. **Mutta portin läpäisy ei ole tutkimustulos.** Kaksi riippumatonta toteutusta ja standardointielimen hyväksyntä ovat prosessin lopputuloksia. Jos vastaus on *"KYA:ta ei omaksuttu"*, se on **viivästys, ei löydös** — eikä väitöskirjaa saa odottamisesta.

**Korvaava kysymys on jo korpuksessa, ja se syntyi juuri yrittämisestä:** §10.27:n artefakti–legitimiteetti-aukko ja §14.42:n nelivaiheinen kriteeri. Ne eivät ole kirjallisuudesta lainattuja — ne ovat sen kokemuksen tuotos, että KYA vietiin standardin ovelle ja ovi ei auennut. **Terävöitys siirtää selkärangan tehdystä työstä siihen, minkä työ paljasti.** Ja se kääntää nolla neljästä: epäonnistumisesta tulee **havaintoaineistoa**, koska kysymys ei enää oleta porttien läpäisyä vaan tutkii, mitä portit ovat ja miksi ne eivät aukea.

**Huomaa myös vastaintuitiivinen kohta:** RQ5 on sarjan **parhaiten ankkuroitu** kysymys — ainoa, jonka artefakti on kokonaan omissa käsissä. Juuri siksi se on kaikkein vastatuin. **Mitä paremmin kysymys on ankkuroitu omaan työhön, sitä suurempi riski että oma työ on jo vastannut siihen.** Lukitusdokumentti piti tätä RQ5:n vahvuutena; se on myös sen riski, ja molemmat ovat nyt kirjattuina.

---

## RQ6 — Siirtymän hallinta · ⚪ tarkkuusliike, ei pakollinen

**Vanha**
> *How can industrial enterprises govern the transition from voluntary ESG reporting to mandatory sovereign-AI compliance infrastructure **without disrupting** existing management systems?*

**Terävöitetty**
> ***Mikä häiriintyy**, kun teollisuusyritys siirtyy vapaaehtoisesta ESG-raportoinnista pakolliseen suvereeniin vaatimustenmukaisuusinfrastruktuuriin, ja **mitkä häiriöt ovat vältettävissä hallinnon suunnittelulla** eivätkä siirtymälle luontaisia?*
>
> *What is disrupted when an industrial enterprise moves from voluntary ESG reporting to mandatory sovereign-AI compliance infrastructure, and which disruptions are avoidable by governance design rather than inherent to the transition?*

### Pääpointti

**"Ilman häiriötä" olettaa vastauksen kysymykseen.** Se sisältää oletuksen, että häiriötön siirtymä on mahdollinen — ja jos se ei ole, kysymys ei tuota löydöstä vaan epäonnistumisen. Terävöitetty muoto ei oleta mitään: se kysyy mikä häiriintyy ja mikä siitä on vältettävissä, jolloin **kumpikin vastaus on tulos**. Se on myös **armollisempi aineiston suhteen**, mikä on tämän kysymyksen todellinen rajoite: RQ6:n riski on liian vähäinen aineisto, ei liiallinen. Yksi tapaus riittää **kartoittamaan häiriötyypit**, vaikka ei riitä yleistämään — ja kartoitus on julkaisukelpoinen ensimmäinen tulos, joka tuo seuraavat tapaukset mukanaan.

---

## Mikä yhdistää kaikkia kuutta terävöitystä

Jokainen tekee **saman liikkeen**, ja se on T3 sovellettuna:

> **Kirjoita kysymys niin, että kielteinen vastaus on julkaisukelpoinen.**

Konkreettisesti se tapahtuu neljällä tavalla:

| Liike | Missä | Mitä se tekee |
| ----- | ----- | ------------- |
| **Lupauksesta rajaksi** | RQ1, RQ4 | *"Todennamme X:n"* → *"mihin X:n todennettavuus loppuu"*. Raja on löydös kummin päin tahansa |
| **Oletuksesta kysymykseksi** | RQ2, RQ6 | *"Mitä vaaditaan"* olettaa vaatimuksen olemassaolon; *"ilman häiriötä"* olettaa häiriöttömyyden mahdollisuuden. Poista oletus, ja kysymys muuttuu vastattavaksi |
| **Testipenkin antaminen** | RQ3 | Kysymys ilman artefaktia ei ole parempi kuin kysymys, jonka artefakti jo vastaa |
| **Tehdystä työstä sen paljastamaan** | RQ5 | Kun oma työ on vastannut kysymykseen, oikea kysymys on se, jonka vastaaminen paljasti |

**Ja huomaa mitä nämä eivät ole:** yksikään terävöitys ei laajenna aihetta, vaihda ankkuria tai lisää työtä. Ne kaikki **kaventavat** kysymystä ja tekevät siitä vastattavamman. Se on tarkoituksellista — terävöitetty kysymys on helpompi, ei vaikeampi. Se vain lakkaa lupaamasta sitä, mitä ei voi lunastaa.

## Mitä tämä maksaa ohjaajille

**Ei mitään kiusallista.** Jokainen terävöitys lukeutuu **syvennykseksi**, ei peruutukseksi:

- **Törngrenille** RQ1 ja RQ4 muuttuvat epämääräisestä ("todennamme luotettavuuden") täsmälliseksi ("missä todennettavuus loppuu ja mitä se merkitsee turvallisuusargumentille"). Se on hänen oma kysymyksenasettelunsa, ei uusi aihe.
- **Smolanderille** RQ5 muuttuu suunnittelutehtävästä tieteelliseksi kysymykseksi, ja RQ6 menettää oletuksensa. *"Kysymys ei ole miten KYA suunnitellaan, vaan mikä erottaa spesifikaation standardista"* on ohjaajalle **vahvempi** viesti kuin alkuperäinen.

## Tämä ei muuta lukitusta

Lukitussääntö 2: muutos vaatii HIC:n päätöksen, versiopäivityksen ja kirjatun syyn. Sääntö 3: sarja on Smolanderin postilaatikossa, joten muutos on ulkoinen teko.

**Kolme vaihtoehtoa, sama kuin auditoinnissa:** (a) vain RQ5 · (b) RQ2, RQ4 ja RQ5 · (c) ei muutoksia, kriteeri metodologialukuun.

**Suositus edelleen (a) + (c).** RQ5 on ainoa, joka kaatuu; muut viisi kestävät sellaisenaan. Ja (c) tekee kriteeristä näkyvän — se on itsessään metodologinen kontribuutio, koska sama falsifiointiperiaate esiintyy nyt kolmessa paikassa: §10.26 testien laatuporttina, §14.42 hallintaväitteille, ja T1–T3 tutkimuskysymyksille.

## Liittyvät

- `docs/phd/RQ_FALSIFIABILITY_AUDIT_2026-07-25.md` — auditointi, T1–T3-testi
- `docs/phd/PHD_RESEARCH_QUESTIONS_LOCK_v1.md` — lukitus ja säännöt
- `docs/lut/2026-07-14-letter-smolander-six-questions.md` — vanhojen muotoilujen lähde

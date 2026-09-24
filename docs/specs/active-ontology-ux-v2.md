# Aktiivinen Ontologia UX v2 — dws10.com tarve-näkymä

**Version:** 1.0 · **Date:** 2026-09-24 · **Status:** SPEC (dispatched run of LD-2026-09-003, HIC APPLY; scope dws10.com + dws10.com/buy) · **Source:** HIC + Copilot 24.09.2026; `docs/market-signals/2026-09-24-ford-smax-egr-aktiivinen-ontologia.md`, `…-asiakas-hakee-paatosta-ei-tietoa.md`

## Periaate

Asiakas ei etsi tuotetta (Climate Intelligence, Compliance Agent). Asiakas yrittää ratkaista
ongelman. Todellinen tila: tiedän ongelman → en tiedä syytä → en tiedä mitä tietoa puuttuu →
en tiedä mikä ratkaisu sopii → en tiedä mitä ostaa. Aktiivinen ontologia ei opeta; se vie
tilanteesta ymmärrykseen, epävarmuuden vähenemiseen, päätökseen ja toimintaan. Ostaminen on
seuraus. **Ei chatbottia, ei tyhjää tekstikenttää, ei "Miten voimme auttaa?".** Chat voi olla
yksi käyttöliittymä myöhemmin; oletus on valintapolku.

## Case: Kemira ei tiedä tuotantoerien hiilijalanjälkeä

### 0. Toimiala ensin (HIC 24.09.2026)

Palvelemme 25 toimialaa. Kävijä valitsee toimialansa heti sivulle tullessaan, ennen mitään
muuta; vasta sen jälkeen aktiivinen ontologia voidaan tehdä hänelle. Toimiala määrää
tilannevaihtoehdot, juurisyyt ja priorit, kysymykset, suositussäännöt ja tuoteperheen
(`src/agents/data/industry-registry.ts`, 20 erikoistunutta + 5 alustatason toimialaa).

> Millä toimialalla toimitte?
> [25 toimialaa ruudukkona; 5 yleisintä ensin; "en löydä omaani" → poikkileikkaava polku]

Valinta muistetaan (localStorage + URL-parametri `?industry=`), jotta paluukävijä ei valitse
uudestaan ja jotta kampanjalinkit voivat esivalita toimialan. Toimialavalinta on samalla
ensimmäinen CAPTURE-havainto Chapter 14:lle: mitkä toimialat tulevat, mihin tilanteisiin.

### 1. Tilanteen tunnistus (yksi kysymys, valinnat, toimialakohtaiset)

> Mikä kuvaa tilannettanne parhaiten?
> ○ Emme tiedä tuotantoerien hiilijalanjälkeä · ○ CSRD-data on hajallaan · ○ Toimittajien
> päästötiedot puuttuvat · ○ Emme tiedä mitä raportoida · ○ Emme luota nykyiseen dataan

### 2. Aktiivinen ontologia tulkitsee (hypoteesit, ei synonyymit)

Passiivinen ontologia yhdistää: hiilijalanjälki ↔ LCA ↔ CSRD ↔ CBAM. Aktiivinen kysyy "mitä
tämä oikeasti tarkoittaa" ja muodostaa juurisyyhypoteesit prioreineen:
43 % tuotantodata ei yhdisty energiaan · 28 % materiaalidataa puuttuu · 15 % toimittajadata
puuttuu · 9 % laskentamalli puuttuu · 5 % raportointi väärässä paikassa.
(Priorit tulevat ontologiasta ja aiemmista tapauksista; päivittyvät Chapter 14:n EVALUATE →
WORLD_MODEL_UPDATE -silmukassa.)

### 3. Diagnostinen polku (vain tarvittavat päätökset, kyllä/ei)

Voidaanko erä tunnistaa? · Onko materiaalitiedot saatavilla? · Onko energiankulutus
yhdistettävissä erään? · Onko päästölaskentamalli määritelty?
Jokainen vastaus päivittää todennäköisyydet (Bayes-tyyppinen päivitys, deterministinen sääntö,
ei LLM-arvaus; Discipline #5).

### 4. Epävarmuuden näkyväksi tekeminen (tärkein vaihe)

> Miksi ette tiedä erän hiilijalanjälkeä?
> 78 % energiaa ei pystytä kohdistamaan tuotantoerälle · 14 % toimittajadata puuttuu ·
> 8 % laskentamalli puuttuu

Ymmärrys syntyy oman tilanteen kautta, ei blogin.

### 5. Suositeltu päätöspolku

1. Yhdistä MES-data ja energia · 2. Määritä erätason hiilijalanjälkimalli · 3. Täydennä
   puuttuvat toimittajatiedot · 4. Automatisoi laskenta.

### 6. Ratkaisut näkyvät vasta nyt

✓ Climate Intelligence · ✓ Emissions Data · ✓ Material Oracle · ✓ Compliance Agent —
jokaisen kohdalla **"Miksi tätä suositellaan"** (sidottu vaiheen 4 syihin), ei tuotekuvaus.
Muu katalogi (136 tuotetta) pysyy taustalla; mitään ei poisteta.

### 7. Agentic Commerce

Tarve → Konteksti → Evidence → Hypoteesi → Ratkaisupolku → Ratkaisut → Hankinta.
Asiakas näkee: **Tavoite** tuotantoerien hiilijalanjälki todennettavaksi · **Arvioitu
toteutusaika** 8 viikkoa · **Suositeltu aloitus** Climate Intelligence Starter · painikkeet
**Varaa työpaja** / **Käynnistä arviointi**. Hinta näkyy vasta tässä (BUY-kerros).

## Tarkennus (HIC 24.09.2026): tuote tulee lähes viimeisenä

Kemira ei kysy "mikä tuote minun pitää ostaa" vaan "miksi emme tiedä tuotantoerien
hiilijalanjälkeä". Ennen kuin siihen on vastattu, mitään tuotetta ei näytetä. Todellinen polku:

```
Tilanne → Mitä emme tiedä? → Miksi emme tiedä sitä? → Mikä epävarmuus estää päätöksen?
→ Miten epävarmuus poistetaan? → Mitä pitää tehdä? → Mitä kannattaa hankkia?
```

Ihmiset eivät vihaa chattiä; he vihaavat huonoa chattiä, joka sanoo "kerro lisää" kunnes
käyttäjä poistuu. Aktiivinen ontologia tekee päinvastoin: **"Tunnistan viisi mahdollista syytä.
Näistä kaksi on todennäköisiä. Vastaa tähän yhteen kysymykseen, niin suljemme kolme pois."**
Se ei tunnu chatilta; se tuntuu asiantuntijalta. Jokaisen kysymyksen pitää siis kertoa, mitä
sen vastaus sulkee pois (vaihe 3: kysymyksen alla "sulkee pois: toimittajadata, laskentamalli").

Learning Delta LD-2026-09-003:n lopullinen muoto: **vanha oletus: Agentic Commerce auttaa
ostamaan. Uusi oppiminen: Agentic Commerce auttaa päättämään.** Ostaminen on seuraus. One
Lifetime -kielellä: _turvallisuus syntyy silloin, kun epävarmuus vähenee riittävästi, jotta
päätös voidaan tehdä luottavaisesti._

## Toteutusrajat

- Sijainti: `dws10.com/` etusivun ensimmäinen ruutu ("Mikä kuvaa tilannettanne parhaiten?") ja
  `dws10.com/buy/` ennen hinnastoa. Peili samassa commitissa.
- Data: toimiala → tilannevaihtoehdot → juurisyyt, priorit, kysymykset ja suositussäännöt
  yhdessä JSON-lähteessä (`dws10.com/config/active-ontology.json`, avaimena industry-registryn
  id), tuotteet `products.json`-SKU:ina. Ensimmäinen erä: rakentaminen, energia, kemia
  (Kemira-case), logistiikka, verkkoliiketoiminta; muut 20 toimialaa poikkileikkaavalla
  oletuspolulla kunnes omat säännöt on kirjoitettu.
  Ei kovakoodattuja hintoja.
- Jokainen läpikäyty polku kirjataan Chapter 14 CAPTURE-havainnoksi (observer: agent):
  valitut tilanteet ja kyllä/ei-vastaukset ovat markkinasignaalia; ei PII:tä.
- Mittari (LD-003 refuting test): buy→checkout-keskeytys laskee 60 päivässä; väärä suositus
  < 1/20; ensimmäisen kysymyksen keskeytys < 50 %.
- Ei sovelleta lifetime.fi:llä eikä Investor Centressä (HIC).

## Miksi tämä on uusi oivallus

Kemiran ongelma ei ole tiedon puute; internet on täynnä hiilijalanjälkitietoa. Ongelma on
"miten tämä liittyy juuri meihin". Asiakas ei halua ymmärtää kaikkea. Hän haluaa ymmärtää oman
tilanteensa riittävän hyvin tehdäkseen turvallisen päätöksen. Silloin ostaminen tapahtuu
seurauksena, ei tavoitteena.

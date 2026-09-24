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

### 1. Tilanteen tunnistus (yksi kysymys, valinnat)

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

## Toteutusrajat

- Sijainti: `dws10.com/` etusivun ensimmäinen ruutu ("Mikä kuvaa tilannettanne parhaiten?") ja
  `dws10.com/buy/` ennen hinnastoa. Peili samassa commitissa.
- Data: tilannevaihtoehdot, juurisyyt, priorit, kysymykset ja suositussäännöt yhdessä
  JSON-lähteessä (`dws10.com/config/active-ontology.json`), tuotteet `products.json`-SKU:ina.
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

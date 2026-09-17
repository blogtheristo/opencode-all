# Tutkimussuunnitelma — EU-suvereeni agenttipohjainen tekoälykäyttöjärjestelmä ja sen hallinta EU-säännellyssä teollisuudessa

---

# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:

- Version: 1.1 | Tool: Claude Code | Session: session_01T3cDnVQrtyrBNvLT9KeyeW | Date: 05.08.2026 | Changes: Palautettu sulkeutuneen PR #1663:n haarasta main-haaraan (tiedosto ei koskaan mergautunut — HIC:n havainto ja käsky 05.08.2026). Päivitetty hakijatiedot: LUT-alumni, DI tuotantotalous 07/2007 (HIC-fakta 05.08.2026) — LUT:n jatko-opintokelpoisuuden tutkintoedellytys täyttyy tällä tutkinnolla; Metropolian YAMK 5/5 (05.06.2026) on lisänäyttö, ei portti. Ohjaustilanne: työsessio prof. Smolanderin kanssa varattu ti 11.08.2026 klo 12:00 (kriittinen polku: LSR-lausunto DL 31.8, hakemus-DL 15.8). Ei muutoksia tutkimussisältöön (ORQ, RQ1–RQ3, menetelmät ennallaan — Rule 12).

- Version: 1.0 | Tool: Claude Code | Session: claude/lut-apuraha-applications-o9kphj | Date: 13.07.2026 | Changes: Ensimmäinen tutkimussuunnitelmaluonnos säätiöhakemuksia varten (syksy 2026). Laajentaa tutkimuskysymysten luonnoksen (docs/lut/2026-07-12-doctoral-research-questions-smolander-fi.md) säätiöiden vakiomuotoon: tausta, tavoitteet ja tutkimuskysymykset, menetelmät, aineisto ja toteutusympäristö, aikataulu ja julkaisusuunnitelma, merkitys, rahoitussuunnitelma. Perustuu VAIN repositoriosta varmennettuihin faktoihin (Aegis, KYA, Article 12 -lokitus, Firecracker MicroVM, Outokumpu Tornio -pilotti; kemianteollisuuden pilotti nimeämättä NDA:n alla). Ei väitä hakijan olevan kirjoilla LUT:ssa.

Document Status:

- Created: 13.07.2026
- Last Modified: 13.07.2026
- Language: Finnish
- Languages Available: FI
- Publication Status: DRAFT (hakemusluonnos — ei lähetetty)
- Classification: CONFIDENTIAL — Väitöskirja- ja rahoitusaineisto
- Document Type: Tutkimussuunnitelma / säätiöhakemuksen liite

Hakija:

- **Nimi:** Risto Anton Päärni
- **Rooli:** perustaja & toimitusjohtaja, Lifetime Oy (Espoo, Suomi)
- **Pohjatutkinto:** diplomi-insinööri (DI), tuotantotalous, LUT, valmistunut 07/2007 — **LUT-alumni**; jatko-opintokelpoisuuden tutkintoedellytys täyttyy tällä tutkinnolla
- **Tilanne:** käy väitöskirjan ohjauskeskusteluja prof. Kari Smolanderin (LUT) kanssa; ei vielä kirjoilla. **Työsessio ohjauksesta varattu ti 11.08.2026 klo 12:00** (tutkimussuunnitelman hyväksyntä + ohjaajan lausunnot + sitoumuslomake)
- **Tausta:** Metropolian YAMK-opinnäytetyö arvosanalla 5/5 (Kiitettävä), 05.06.2026; ohjaaja Erkki Räsänen suosittelee jatkamista tohtorintutkintoon

---

## 1. Tausta

Tekoälyagentit siirtyvät demonstraatioista tuotantoon EU-säännellyillä teollisuuden
aloilla — terästehtaille, kemianteollisuuteen, energiaan, puolustukseen. Samaan aikaan
sääntelykehikko tiukkenee: EU:n tekoälyasetus (asetus (EU) 2024/1689) edellyttää
suuririskisiltä järjestelmiltä automaattista tapahtumalokitusta (Art. 12), inhimillistä
valvontaa (Art. 14) ja teknistä dokumentaatiota (Art. 72); NIS2 ja DORA lisäävät
kyberturva- ja häiriönsietovaatimuksia; CBAM, CSRD ja ETS tuovat mitattavan
hiilikirjanpidon. Näiden yhteisvaikutus on, että teollisen toimijan on kyettävä
osoittamaan — jälkikäteen ja oikeudessa puolustettavasti — mitä agentti teki, kenen
valtuutuksella ja millä eristyksellä.

Alan vallitseva vastaus rakentuu yhdysvaltalaisomisteisten toimittajien varaan. Toukokuussa
2026 Dell ja Palantir julkistivat on-premises-tekoälykäyttöjärjestelmän "voimakkaasti
säännellyille aloille ja hallinnoille". Ratkaisu nimeää kategorian, mutta sen molemmat
päätoimittajat ovat Yhdysvaltain CLOUD Actin alaisia — mikä synnyttää ratkaisemattoman
jännitteen "datasuvereniteetin" markkinointiväitteen ja itse toimittajasuhteen
oikeudellisen altistuksen välillä. EU-suvereenilla julkisella hankinnalla on siis
tutkimuksellinen aukko, jota teollisuus ei ole vielä sulkenut.

Tämä väitöstyö vastaa aukkoon rakentamalla ja arvioimalla vaihtoehdon:
**EU-suvereenin, on-premises-ympäristön agenttipohjaisen tekoälykäyttöjärjestelmän**,
joka on suvereeni rakenteeltaan eikä pelkkänä väitteenä. Artefaktit ovat jo osin
tuotannossa Lifetime Oy:llä, mikä tekee tutkimuksesta Design Science -tutkimusta elävällä
artefaktilla, ei laboratorioehdotusta.

## 2. Tavoitteet ja tutkimuskysymykset

Työn tavoitteena on tuottaa (a) falsifioitava joukko suvereniteetti-invariantteja
teollisen tekoälykäyttöjärjestelmän arkkitehtuurille, (b) avoimen standardin ehdokas
agenttihallinnalle (KYA) ja (c) empiirinen näyttö niiden skaalautuvuudesta useille
EU-säännellyille toimialoille.

**Kattava tutkimuskysymys (ORQ).** Kuinka EU-suvereeni, on-premises-ympäristön
agenttipohjainen tekoälykäyttöjärjestelmä voidaan rakentaa, hallita ja arvioida niin,
että EU-säännellyillä aloilla toimivat tekoälyagentit tuottavat oikeudessa
puolustettavaa, koneluettavaa vaatimustenmukaisuusnäyttöä säilyen suvereenina
rakenteeltaan?

**RQ1 (rakenna).** Mitkä arkkitehtoniset invariantit ovat välttämättömiä ja riittäviä,
jotta on-premises-tekoälykäyttöjärjestelmä on EU-suvereeni rakenteeltaan?

**RQ2 (hallitse).** Kuinka agenttihallinnan standardi tulisi määritellä niin, että
inhimillisen päämiehen identiteetti, agentin toimivallan laajuus ja ketjun
päättämisehdot ovat laitteistolla attestoituja ja oikeudellisesti falsifioitavissa
(tekoälyasetus Art. 12/14/72; NIS2; DORA)? Sääntelyontologia (ETS/CBAM/CSRD-käsitteiden
koneluettava kuvaus) toimii tässä **tukimekanismina**, joka jäsentää KYA-näytön
oikeudellisesti luettavaksi.

**RQ3 (arvioi).** Skaalautuuko hallintastandardi yhdessä arkkitehtuurimallin kanssa
EU-säänneltyjen toimialojen yli, ja mitkä ovat yleistettävyyden rajat?

## 3. Menetelmät

Tutkimus noudattaa **Design Science Research** -metodologiaa (Hevner ym.): kontribuutio
on artefakti, jota arvioidaan todellisissa teollisissa ympäristöissä. Kolme toisiaan
täydentävää menetelmävirtaa:

1. **Artefaktin rakentaminen.** KYA-standardi määritellään, toteutetaan DWS IQ -pinossa ja
   julkaistaan avoimen standardin ehdokkaana. Referenssitoteutus käyttää suomalaisella
   infrastruktuurilla ajettavaa pinoa (NVIDIA GB10 Grace Blackwell / DGX-luokan reuna,
   avoimen painon mallit OpenClaw-ajoympäristössä, Firecracker MicroVM -agenttieristys,
   UpCloud Kubernetes). Suorituskyky-, attestointi- ja kill-aikaluvut mitataan paikan
   päällä.
2. **Empiirinen validointi maksavien asiakkaiden ympäristöissä.** Teolliset tapaukset
   instrumentoidaan Article 12 -näyttöjäljellä ja niistä tuotetaan KYA-vaatimustenmukai­suus­raportti.
   Tapausvalinta noudattaa teoreettista otantaa: maksimaalisesti erilaiset
   sääntelypinnat (teräs, kemia).
3. **Vertaileva arviointi.** Referenssikäyttöönotto pisteytetään suvereniteettirubriikilla
   ja nousevilla agenttiturvallisuuden vertailukokeilla, ja vertaillaan julkisesti
   dokumentoituihin teollisiin referensseihin (mm. Dell + Palantir -pino) siltä osin kuin
   julkinen tieto sallii.

Eettinen ja oikeudellinen kehys: tapaustutkimus maksavien asiakkaiden ympäristöissä
tehdään kirjallisten tietojenkäsittelysopimusten (DPA) alla ja toimialakohtaista
luottamuksellisuutta kunnioittaen.

## 4. Aineisto ja toteutusympäristö

**Toteutusympäristö on lähtökohtaisesti etäpainotteinen ja Espoossa (pääkaupunkiseutu).**
Hakija ei voi siirtyä asumaan Lappeenrantaan, joten väitöstyö tehdään Lifetime Oy:n omalla
infrastruktuurilla ja LUT-ohjaus järjestetään etäyhteydellä ja jaksoittaisilla
tapaamisilla. Tämä ei rajoita empiirisen aineiston keruuta, koska tutkimusartefakti ajaa
tuotannossa Lifetime Oy:n suomalaisella infrastruktuurilla ja teolliset pilotit ovat
asiakkaiden tuotantoympäristöissä, eivät kampuksella.

Repositoriosta varmennettu artefakti- ja aineistopohja:

- **Aegis** — EDIP-valmis suvereeni tekoälyalusta suomalaisella infrastruktuurilla
  (UpCloud Kubernetes), EU:n tekoälyasetuksen Article 12 -natiivi, agenttikohtainen
  Firecracker MicroVM -eristys (KYA v1.4), ilman CLOUD Act -altistusta; yleinen saatavuus
  elokuu 2026. → RQ1:n arkkitehtuuriaineisto.
- **KYA (Know-Your-Agent)** — kryptografinen agentti-identiteetti, eristys ja kill-valtuus;
  standardin ja vaatimustenmukaisuuden testipaketin lähdeaineisto. → RQ2.
- **Article 12 -lokitus / päättelyjäljen linjaus** — koneluettava näyttökerros, josta
  tuotetaan vaatimustenmukaisuusraportit. → RQ2/RQ3.
- **Outokumpu Tornio Works (teräs, nimetty julkinen käyttöönotto)** — Lifetime Fleet
  Mobile Control Room hallitsee ANYmal-nelijalkaista ("Jokkeri") ferrokromilattialla,
  GN100/IGX-reunalla, lue-ja-ehdota / HIL-portitettuna; mittari **≥95 % Article 12
  -auditointikattavuus** laivueen toiminnoista. → RQ3:n ensimmäinen tapaus.
- **Kemianteollisuuden pilotti** — toinen sääntelypinta; **nimeämättä NDA:n alla**.
  → RQ3:n toinen tapaus, kun sopimus sallii.

Aineisto koostuu siis (i) käyttöönottojen Article 12 -näyttöjäljistä, (ii)
suorituskyky- ja attestointimittauksista referenssipinossa ja (iii) suvereniteetti- ja
turvallisuusrubriikkien pisteytyksistä.

## 5. Aikataulu ja julkaisusuunnitelma

Väitöstyö on artikkelipohjainen, kolmen artikkelin ja synteesin rakenteella (3–7 vuoden
horisontti):

- **2026–2027 — Artikkeli 1 (RQ2, hallinta):** _KYA — avoin hallintakehikko
  agenttipohjaiselle tekoälylle EU-säännellyssä teollisuudessa._ Vaatimustenmukaisuuden
  testipaketti kartoitettuna tekoälyasetuksen Art. 12/14/72:een. Kohde: vertaisarvioitu
  konferenssi.
- **2027 — Artikkeli 2 (RQ1, rakenna):** _Suvereeni rakenteeltaan — arkkitehtuurimalli
  EU:n on-premises-tekoälykäyttöjärjestelmälle._ Validoitu referenssikäyttöönotto ja
  vertailu nimettyihin teollisiin referensseihin. Kohde: aikakauslehtiartikkeli.
- **2028 — Artikkelit 3–4 (RQ3, arvioi):** empiiriset löydökset toimialojen yli (teräs,
  kemia); yksi artikkeli poikkitoimialaisesta yleistyvyydestä, yksi yhdestä korkean
  panoksen toimialasta.
- **2028–2029 — väitöskirjan synteesi ja puolustus.**

## 6. Merkitys

- **Tieteellinen.** Yhdistää moniagenttijärjestelmien päättely–käyttäytyminen-kuilun
  laitteistolla attestoituun, falsifioitavaan hallintayksikköön (KYA) ja tuottaa avoimen,
  testattavan vaatimustenmukaisuusrubriikin.
- **Yhteiskunnallinen ja taloudellinen.** Antaa EU-säännellylle teollisuudelle
  suvereenin, oikeudessa puolustettavan vaihtoehdon yhdysvaltalaisomisteisille pinoille —
  vähentäen vaatimustenmukaisuuden kustannusta ja oikeudellista altistusta samalla kun
  EU:n data-, malli- ja auditointiresidenssi säilyy. Tämä on suoraan kytköksissä Suomen
  teollisuuden kilpailukykyyn ja huoltovarmuuteen.
- **Standardointi.** KYA:n julkaiseminen avoimen standardin ehdokkaana tuo suomalaisen
  kontribuution kansainväliseen agenttihallinnan normistoon sen muodostumishetkellä.

## 7. Rahoitussuunnitelma

Väitöstyö rahoitetaan **apurahapainotteisesti**, jotta hakija säilyy Suomessa
verovelvollisena ja apuraha on verovapaa. Työ tehdään Lifetime Oy:n rinnalla, joten
laskennallinen infrastruktuuri (referenssipino, teolliset pilottiympäristöt) on jo
olemassa eikä sitä ladata apurahabudjettiin.

Syksyn 2026 haut (ks. `docs/lut/apuraha-deadline-calendar-2026.md`):

- **Liikesivistysrahasto** — väitöskirja-apuraha 12 kk = 27 000 € (haku päättyy
  15.8.2026); kauppatieteellinen kehystys (agenttikauppa, suvereniteetti markkinana,
  vaatimustenmukaisuuden kustannussäästö).
- **Nokia Säätiö** — Nokia Scholarship, enintään 7 500 € (haku 3.8.–15.9.2026);
  ICT-kehystys (Aegis-arkkitehtuuri + KYA-hallinta).
- **2027:** TES, KAUTE ja Wihuri (2026-kierrokset sulkeutuneet) seuraaville kierroksille.

Molemmat syksyn 2026 haut edellyttävät ohjaavan professorin lausuntoa; Nokia edellyttää
käytännössä väitöskirjaopintoja suomalaisessa yliopistossa. Rahoituksen realisoituminen
on siksi sidoksissa LUT-ohjaus- ja kirjoillaolojärjestelyihin prof. Smolanderin kanssa.

---

**Huomautus lähteistä.** Kaikki tekniset väitteet (Aegis, KYA, Article 12 -lokitus,
Firecracker MicroVM, Outokumpu Tornio -pilotti) perustuvat tämän repositorion
varmennettuun sisältöön. Kemianteollisuuden pilotti on nimeämättä NDA:n vuoksi. Hakijaa
ei esitetä LUT:n kirjoilla olevana; ohjaussuhde on keskusteluvaiheessa.

<!--
VERSION AND AGENT HISTORY
Document: OUTOKUMPU_TUNTIRAPORTTI.md
Version: 1.0
Last-Updated: 2026-07-30
Author: Risto Anton Päärni (Lifetime Oy)
Agent: Claude Code (Opus 5), session claude/enterprise-ai-harness-0anl7s
Purpose: Tuntierittely Outokumpu Oyj:n pilottitarjoukseen (€24 000, 27.6.2026).
         Purkaa kiinteän pilottihinnan vaiheittaisiksi tunneiksi ja
         tuntihinnaksi, jotta hankinta voi verrata sitä tarjouksen §4
         asiantuntijatyön listahintaan (€120/h). Sama erittelymalli kuin
         cari.fi-tarjouksen tuntitaulukossa
         (sales-outreach/TARJOUS_CARIN_HUOLTOPALVELU_VERKKOSIVUT_FI.md kohta 2).
         EI MUUTA HINTAA. €24 000 on lähetetty asiakkaalle 27.6.2026
         hintalomakkeessa OUTOKUMPU_HINTALOMAKE.md ja pysyy voimassa
         sellaisenaan; tämä dokumentti ainoastaan perustelee sen.
Vaiheistus: PILOT_SHEET_OUTOKUMPU_FORTA.md v2.0 §6 (viisi vaihetta).
Status: LUONNOS — tarkista laskennan oletukset (§1) ennen lähetystä.
-->

---

# Tuntiraportti — DWS IQ 6 Pilotti | Outokumpu Oyj

**Toimittaja:** Lifetime Oy | Y-tunnus: 0772407-9 | VAT: FI07724079
**Asiakas:** Outokumpu Oyj
**Viite:** Tarjouskirje 27.6.2026, hintalomake `OUTOKUMPU_HINTALOMAKE.md` v1.0
**Päiväys:** 30.7.2026
**Versio:** 1.0
**Luottamuksellisuus:** Luottamuksellinen — vain Outokumpu Oyj ja Lifetime Oy

> **Tämä liite ei muuta pilottihintaa.** Kiinteä hinta on ja pysyy **€24 000 (alv 0 %)**.
> Alla oleva erittely vastaa kysymykseen *"mistä tunneista tämä koostuu"* — se ei ole
> uusi hinnoittelumalli eikä tuntilaskutukseen siirtyminen.

---

## 1. Laskennan perusta ja oletukset

Tarjouskirjeen 27.6.2026 mukaan pilottihinta *"kattaa noin 50 % toimittajan kokonaispanoksesta (n. 1,5 henkilötyökuukautta, senior-insinööri/toimitusjohtajataso)"*. Tästä seuraa suoraan:

| Suure | Arvo | Johdettu |
| :--- | ---: | :--- |
| Laskutettava panos | **1,5 htkk** | Tarjouskirje 27.6.2026 |
| Henkilötyökuukausi | 160 h | Suomalainen vakiokäytäntö |
| **Laskutettavat tunnit** | **240 h** | 1,5 × 160 |
| Nimellinen senior-tuntihinta (insinööri/toimitusjohtajataso) | €200/h (alv 0 %) | Lifetime Oy:n nimellinen tuntiarvo |
| Laskutettavien tuntien nimellisarvo | €48 000 | 240 h × €200/h |
| **Lifetime Oy:n yhteisrahoitus** | **−50 % = −€24 000** | Strateginen pilottijärjestely |
| **Outokummun maksuosuus (kiinteä)** | **€24 000 (alv 0 %)** | Hintalomake v1.0, rivi 1 |
| **Toteutuva tuntihinta** | **€100/h (alv 0 %)** | €24 000 / 240 h |
| Kokonaisjalanjälki hankkeessa | ~3 htkk ≈ 480 h | 12 viikkoa, sis. ei-laskutettava työ |

**Yhteisrahoitus ilmoitetaan vain yhdellä tavalla.** Se on 50 %:n vähennys laskutettavien 240 tunnin nimellisarvosta. Hankkeen kokonaisjalanjälki on suurempi (~480 h), koska mukana on ei-laskutettavaa määrittely- ja taustatyötä, mutta **tätä ei lasketa yhteisrahoituksen päälle** — muuten sama panos laskettaisiin kahdesti. Yksi luku, yksi peruste.

**Suhde jatkotyön hintaan.** Nimellinen €200/h on senior-työn tuntiarvo. Outokummulle tarjottu jatkotyön sopimushinta on hintalomakkeen §4 mukaisesti **€120/h** — se on ennallaan eikä tämä liite muuta sitä. Pilotin €100/h ei ole listahinta vaan kertaluonteinen, tähän toimeksiantoon sidottu yhteisrahoitettu hinta.

**Tarkistettava oletus.** Tuntimäärä 240 h on johdettu tarjouskirjeen sanamuodosta (*"n. 1,5 henkilötyökuukautta"*), ei erillisestä työaikakirjanpidosta. Jos toteutunut työaikakirjaus poikkeaa tästä, taulukko on korjattava ennen lähetystä — kiinteä hinta €24 000 ei kuitenkaan muutu.

---

## 2. Tuntierittely vaiheittain

Vaiheistus noudattaa pilottimäärittelyn `PILOT_SHEET_OUTOKUMPU_FORTA.md` v2.0 §6 viittä vaihetta.

| Vaihe | Jakso | Sisältö | Tunnit | Hinta (alv 0 %) |
| :--- | :--- | :--- | ---: | ---: |
| **Vaihe 0 — Laajuuden määrittely** | vk 0–2 | Forta-alatuotelinjan lukitus, lähdejärjestelmäauditointi (sulattohistorian, energianhallinta, romurekisteri), kriittisyysluokittelu, käyttökatkotilan määrittely, lähtötasomittaus | 40 h | **MAKSUTON — €0** |
| **Vaihe 1 — Paikallinen perusta** | vk 3–5 | Suoritusajoympäristö ja mallipalvelu asiakkaan NVIDIA-laitteistolle; paikallisesti ratkeava KYA-agentti-identiteetti; Art. 12 -lokikirjoitin paikalliseen tallennukseen; operaattorin pysäytysvaltuus ilman verkkohyppyä | 60 h | **€6 000** |
| **Vaihe 2 — Julkistusputken integrointi** | vk 6–9 | Työnkulun vaatima agenttijoukko; read-only-integraatiot kolmeen lähdejärjestelmään; IP-sääntöskeeman yhteissuunnittelu IP-funktion kanssa; vetooikeusportti paikallisena kryptografisena esteenä; päätöspisteiden kytkentä Art. 12 -tietueeseen; degradoituneen tilan toteutus | 90 h | **€9 000** |
| **Vaihe 3 — Verkkokatkotesti** | vk 10–11 | Harjoitusajo ja havaintojen korjaus; todistettu hyväksyntäajo sovitussa katkoikkunassa; kolmen ehdon instrumentoitu mittaus; paluuyhteyden täsmäytyksen varmennus | 45 h | **€4 500** |
| **Vaihe 4 — Mitoitus ja loppuraportti** | vk 12–13 | Tuotantomitoitus mitatusta kuormasta; käyttöönottomallin vahvistus; ennen/jälkeen-analyysi neljästä KPI:stä; loppuraportti ja konversiosuositus (myös kielteinen, jos näyttö niin osoittaa) | 45 h | **€4 500** |
| | | **Laskutettavat tunnit yhteensä** | **240 h** | **€24 000** |

**Tuntipainotuksen perustelu.** Vaihe 2 on raskain (90 h), koska kolme read-only-integraatiota ja IP-sääntöskeeman yhteissuunnittelu ovat pilotin varsinainen rakennustyö. Vaihe 1 (60 h) edeltää sitä tarkoituksella: paikallinen perusta todennetaan ennen kuin työnkulkua on olemassa, jolloin vaiheen 3 mahdollinen epäonnistuminen on työnkulun eikä alustan ongelma. Vaiheet 3 ja 4 ovat kevyempiä (45 h kumpikin), koska niissä mitataan ja raportoidaan sitä, mikä on jo rakennettu.

---

## 3. Toimittajan osuus

| Erä | Määrä | Huomio |
| :--- | ---: | :--- |
| Laskutettavien tuntien nimellisarvo | €48 000 | 240 h × €200/h |
| **Lifetime Oy:n yhteisrahoitus** | **€24 000** | 50 % nimellisarvosta |
| Outokummun maksuosuus | €24 000 | Kiinteä pilottihinta |
| Vaihe 0 — laajuuden määrittely | 40 h | Maksuton, ei sisälly laskutettaviin 240 tuntiin |
| Muu ei-laskutettava tausta- ja määrittelytyö | ~200 h | Osa kokonaisjalanjälkeä, **ei osa yhteisrahoituslukua** |

**Yhteisrahoitus on €24 000 — ei enempää.** Hankkeen kokonaisjalanjälki on ~480 h, mutta ei-laskutettavaa taustatyötä **ei lisätä** yhteisrahoituksen päälle. Yksi luku kestää tarkastelun; kahden päällekkäisen luvun summa ei kestä.

**Tämä ei ole alennus vaan yhteisrahoitus.** Pilotin tarkoitus on tuottaa mittausdata, jonka perusteella kaupallinen konversio joko perustellaan tai hylätään. Lifetime kantaa puolet työstä, koska mittaustulos on arvokas myös meille — emme myy tässä tuntityötä vaan hankimme yhdessä asiakkaan kanssa näytön siitä, toimiiko paikallinen arkkitehtuuri Tornion kaltaisessa ympäristössä.

**Ero alennuksen ja yhteisrahoituksen välillä on olennainen hinnoittelun kannalta.** Alennus laskee listahintaa ja jää voimaan seuraavassa neuvottelussa. Yhteisrahoitus on kertaluonteinen, rajattuun toimeksiantoon sidottu järjestely, joka päättyy pilotin päättyessä. Siksi §6 toteaa nimenomaisesti, että pilotin jälkeinen asiantuntijatyö laskutetaan hintalomakkeen §4 mukaisella listahinnalla **€120/h** — pilotin €100/h ei siirry jatkosopimukseen eikä laajemman käyttöönoton hinnoitteluun.

---

## 4. Vertailu tuntilaskutukseen

| Malli | Laskelma | Hinta (alv 0 %) |
| :--- | :--- | ---: |
| **Tämä tarjous — kiinteä, yhteisrahoitettu pilottihinta** | 240 h × €100/h | **€24 000** |
| Sama laajuus Outokummulle tarjotulla jatkotyön sopimushinnalla | 240 h × €120/h | €28 800 |
| Sama laajuus nimellisellä senior-tuntihinnalla | 240 h × €200/h | €48 000 |

**Kiinteä hinta siirtää ylityksen riskin toimittajalle.** Jos vaihe 2 vaatii arvioitua enemmän työtä, se ei näy Outokummun laskulla. Tuntilaskutuksessa se näkyisi.

---

## 5. Mitä tuntierittely **ei** tarkoita

- **Ei siirrytä tuntilaskutukseen.** Pilotti on kiinteähintainen. Tämä erittely on hankinnan vertailua varten.
- **Ei laskuteta toteutuneiden tuntien mukaan.** Maksuaikataulu on hintalomakkeen mukaan 50 % allekirjoituksella, 50 % loppuraportin hyväksynnällä — riippumatta siitä, toteutuuko 240 h vai 300 h.
- **Ei muuteta laajuutta.** Vaiheiden tuntijako on suunnitteluarvio, ei sopimusrajaus. Sopimusrajaus on pilottimäärittelyn §2 laajuus ja §8 onnistumiskriteerit.
- **Ei koske laitteistoa eikä pilvipalveluita.** Ne ovat asiakkaan CAPEX/OPEX ja kulkevat läpilaskutuksena ilman katetta (hintalomake §3).

---

## 6. Jatkotyön tuntihinta

Pilotin jälkeinen asiantuntijatyö laskutetaan hintalomakkeen §4 mukaisesti **€120/h (alv 0 %)** toteutuneiden tuntien mukaan. Pilotin €100/h on kertaluonteinen pilottihinta tälle rajatulle toimeksiannolle, ei uusi listahinta.

---

**Risto Anton Päärni**
Toimitusjohtaja, Lifetime Oy
risto.paarni@lifetime.fi · +358 400 319 010
Laidunmaanraitti 2 A 25, 02330 Espoo, Finland
Y-tunnus: 0772407-9 | VAT: FI07724079

---

## Asiakirjan hallinta

- Lähde tuntimäärille: tarjouskirje 27.6.2026 ("n. 1,5 henkilötyökuukautta", "n. 50 % kokonaispanoksesta").
- Lähde tuntihinnalle €120/h: `OUTOKUMPU_HINTALOMAKE.md` v1.0 §4.
- Vaiheistus: `sales-outreach/PILOT_SHEET_OUTOKUMPU_FORTA.md` v2.0 §6.
- Erittelymalli: `sales-outreach/TARJOUS_CARIN_HUOLTOPALVELU_VERKKOSIVUT_FI.md` kohta 2 (tuntiarviotaulukko).
- **Tämä dokumentti ei muuta lähetettyä tarjousta.** Lähetetyt asiakirjat (`OUTOKUMPU_TARJOUSKIRJE.md`, `OUTOKUMPU_HINTALOMAKE.md`, 27.6.2026) ovat muuttumattomia.

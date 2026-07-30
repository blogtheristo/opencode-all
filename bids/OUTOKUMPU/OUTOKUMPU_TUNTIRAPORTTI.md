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
| Kiinteä pilottihinta | €24 000 | Hintalomake v1.0, rivi 1 |
| **Toteutuva tuntihinta** | **€100/h (alv 0 %)** | €24 000 / 240 h |
| Asiantuntijatyön listahinta | €120/h (alv 0 %) | Hintalomake v1.0 §4 |
| **Pilottialennus listahinnasta** | **−17 %** | (120 − 100) / 120 |
| Kokonaispanos (arvio) | ~3 htkk ≈ 480 h | "n. 50 % kokonaispanoksesta" |
| Toimittajan kantama osuus | ~240 h | 480 − 240 |

**Tarkistettava oletus.** Tulkinta *"50 % kokonaispanoksesta"* = asiakas maksaa 240 h kokonaispanoksen ollessa ~480 h. Jos tarkoitus oli toinen (esim. 1,5 htkk **on** kokonaispanos ja 50 % viittaa muuhun), tuntihinta muuttuu ja tämä taulukko on korjattava ennen lähetystä. Lukema on johdettu tarjouskirjeen sanamuodosta, ei erillisestä työaikakirjanpidosta.

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

## 3. Toimittajan kantama osuus (ei laskuteta)

| Erä | Tunnit | Arvo listahinnalla €120/h |
| :--- | ---: | ---: |
| Vaihe 0 — laajuuden määrittely kokonaisuudessaan | 40 h | €4 800 |
| Vaiheiden 1–4 ylimenevä panos | ~200 h | €24 000 |
| **Yhteensä toimittajan kantamana** | **~240 h** | **~€28 800** |

**Kokonaispanos pilotissa ~480 h, josta asiakas maksaa 240 h.** Tehollinen hinta kokonaispanosta kohti on siten noin **€50/h** — eli alle puolet asiantuntijatyön listahinnasta.

Tämä ei ole alennus vaan investointi: pilotin tarkoitus on tuottaa mittausdata, jonka perusteella kaupallinen konversio joko perustellaan tai hylätään. Lifetime kantaa puolet siitä työstä, koska mittaustulos on arvokas myös meille.

---

## 4. Vertailu tuntilaskutukseen

| Malli | Laskelma | Hinta (alv 0 %) |
| :--- | :--- | ---: |
| Tämä tarjous — kiinteä pilottihinta | 240 h × €100/h | **€24 000** |
| Sama laajuus asiantuntijatyön listahinnalla | 240 h × €120/h | €28 800 |
| Sama laajuus kokonaispanoksen mukaan listahinnalla | 480 h × €120/h | €57 600 |

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

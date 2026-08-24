<!--
VERSION AND AGENT HISTORY
Document: OUTOKUMPU_HINTALOMAKE.md
Version: 1.0
Last-Updated: 2026-06-27
Author: Risto Anton Päärni (Lifetime Oy)
Agent: Claude Sonnet 4.6
Purpose: Suomenkielinen hintalomake Outokumpu Oyj -pilottitarjoukselle.
         Kiinteähintainen 3 kk pilotti + jatkosopimuksen hinnoittelu.
-->

---

# Hintalomake — DWS IQ 6 Pilotti | Outokumpu Oyj

**Toimittaja:** Lifetime Oy | Y-tunnus: 0772407-9 | VAT: FI07724079
**Asiakas:** Outokumpu Oyj
**Päiväys:** 27.6.2026
**Versio:** 1.0
**Luottamuksellisuus:** Luottamuksellinen — vain Outokumpu Oyj ja Lifetime Oy

---

## 1. Pilottihinta (kiinteähintainen)

| Rivi | Kuvaus                                                                                                                                       | Yksikkö      | Määrä | Yksikköhinta (alv 0 %) | Yhteensä (alv 0 %) |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ----- | ---------------------- | ------------------ |
| 1    | DWS IQ 6 -pilotti — toimittajan työpanos (senior-insinööri/CEO)                                                                              | kiinteähinta | 1     | €24 000                | **€24 000**        |
|      | _Sisältää: KYA-putkilinjan rakentaminen, IP-funktion vetooikeuspolku, Art. 12 -auditointiloki, mittausraportti ennen/jälkeen, loppuraportti_ |              |       |                        |                    |
| 2    | Vaihe 1 — Laajuuden määrittely (1–2 vk)                                                                                                      | MAKSUTON     | 1     | €0                     | **€0**             |
|      | _Sisältää: Forta-alatuotelinja-valinta, lähdejärjestelmäauditointi, lähtötasomittaus_                                                        |              |       |                        |                    |
|      |                                                                                                                                              |              |       | **PILOTTI YHTEENSÄ**   | **€24 000**        |

**Huom.:** Hinta kattaa noin 50 % toimittajan kokonaispanoksesta (n. 1,5 henkilötyökuukautta). Pilotti on rajattu yhteen Forta-alatuotelinjaan.

---

## 2. Maksuaikataulu

| Erä          | Ajoitus                                     | Summa (alv 0 %) |
| ------------ | ------------------------------------------- | --------------- |
| 1. erä       | Sopimuksen allekirjoituksella               | €12 000         |
| 2. erä       | Loppuraportin (Milestone 12) hyväksymisellä | €12 000         |
| **YHTEENSÄ** |                                             | **€24 000**     |

- **ALV-käsittely:** EU:n välinen B2B-käännetty verovelvollisuus (asiakas tilittää ALV:n)
- **Laskutus:** Oletuksena yllä olevan maksuaikataulun mukaan. Kuukausittainen edistymislaskutus mahdollinen asiakkaan AP-käytäntöjen mukaan.
- **Valuutta:** EUR

---

## 3. Laitteisto ja pilvipalvelut (läpilaskutus, ei katetta)

| Erä                     | Tyyppi                             | Kuvaus                                                           | Kustannus                                               |
| ----------------------- | ---------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------- |
| NVIDIA Jetson Orin Nano | Asiakkaan CAPEX                    | Reunasolmupäätelaitteen inferenssi, alle 100 ms latenssi, 7–15 W | Asiakkaan hankintahinta (NVIDIA EU -jälleenmyyjäkanava) |
| NVIDIA DGX Spark        | Asiakkaan CAPEX                    | Keskitetty koulutus / eräinferenssi                              | Asiakkaan hankintahinta (NVIDIA EU -jälleenmyyjäkanava) |
| Scaleway Paris          | OPEX, kuukausittainen läpilaskutus | EU-suvereeni pilvilaskenta, objektivarasto                       | Omakustannushinta, ei katetta                           |
| Aiven Helsinki          | OPEX, kuukausittainen läpilaskutus | Hallittu PostgreSQL + pgvector, tapahtumastreaming               | Omakustannushinta, ei katetta                           |

**Laitteiston omistajuus:** NVIDIA-laitteisto jää asiakkaalle pilotin jälkeen — pysyvä infrastruktuuri-investointi riippumatta kaupallisesta konversiosta.

**BYO-vaihtoehto:** Asiakas voi käyttää olemassa olevia NVIDIA-työasemia tai -palvelimia vastaavilla spesifikaatioilla. Lifetime toimittaa vain konfiguraation ja integraation.

---

## 4. Jatkosopimuksen hinnoittelu (viitteellinen, kaupallinen konversio pilotinjälkeen)

Kaupallinen konversio on asiakkaan yksinomainen harkintavalta pilotin päätyttyä. Alla on viitteellinen hinnoittelu neuvottelun pohjaksi.

| Palvelu                                                   | Hinta                                      | Huomio                                                       |
| --------------------------------------------------------- | ------------------------------------------ | ------------------------------------------------------------ |
| DWS IQ 6 -vuosilisenssi (yksi tuotelinja)                 | Tarjotaan erikseen                         | Perustuu pilottimittauksiin ja laajuuteen                    |
| Lisätuotelinjat                                           | Tarjotaan erikseen                         | Volyymialennus saatavilla                                    |
| Asiantuntijatyö (jatkokehitys, integraatiot, räätälöinti) | **€120/h (alv 0 %)**                        | Kiinteä tuntihinta, laskutetaan toteutuneiden tuntien mukaan |
| Tuki ja ylläpito (24/7 EU-tuki)                           | Sisältyy lisenssiin tai tarjotaan erikseen | Lifetime Oy, Espoo — EU-lainkäyttöalue                       |
| Koulutus ja käyttöönottotuki                              | €120/h (alv 0 %)                            | Sama tuntihinta kuin asiantuntijatyössä                      |

---

## 5. KPI-tavoitteet (pilotin onnistumiskriteerit)

| #   | KPI                                  | Lähtötaso (toimialavertailu) | Tavoite pilotin päättyessä                                            | Mittausmenetelmä                                                   |
| --- | ------------------------------------ | ---------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------ |
| 1   | **Julkistusprosessin läpimenoaika**  | 18–42 päivää per ilmoitus    | **alle 2 minuuttia**                                                  | Aika myynti-insinöörin pyynnöstä allekirjoitettuun asiakirjaan     |
| 2   | **IP-funktion kattavuusaste**        | alle 10 % (ad-hoc-tarkistus) | **vähintään 95 %** pilotin ilmoituksista kulkee IP-hyväksynnän kautta | Putkilinjan lokitiedot: % ilmoituksista IP-säännöstön läpi         |
| 3   | **Myynti-insinöörin vapautuva aika** | 8–16 h per ilmoitus          | **vähintään 240 h/edustaja/vuosi ekstrapoloituna**                    | Ajanseuranta: ennen pilottia (vk 1–2) vs. pilotin aikana (vk 8–11) |

**Kaupallisen konversion kynnys:** Kaikki kolme KPI:tä täyttyvät → asiakkaalla on optio konvertoida kaupalliselle DWS IQ 6 -lisenssille. Pilotin suorittaminen ei luo kaupallista velvoitetta kummallekaan osapuolelle.

---

## 6. Peruutusehdot

- Asiakas voi peruuttaa milloin tahansa ilman sanktioita.
- Peruutusmaksu: toimittajan toteutuneet kulut peruutuspäivään asti, suhteellisesti laskettuna.
- Ei muita sanktioita tai sitoutumisia.

---

## 7. Tarjouksen voimassaolo

Tämä tarjous on voimassa **30 päivää** tästä päivästä: **27.7.2026 saakka.**

---

_Lifetime Oy | Y-tunnus: 0772407-9 | VAT: FI07724079_
_Laidunmaanraitti 2 A 25, 02330 Espoo, Finland_
_risto.paarni@lifetime.fi_

---

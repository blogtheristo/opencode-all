<!--
VERSION AND AGENT HISTORY
Document: OUTOKUMPU_TARJOUSKIRJE.md
Version: 1.0
Last-Updated: 2026-06-27
Author: Risto Anton Päärni (Lifetime Oy)
Agent: Claude Sonnet 4.6
Purpose: Suomenkielinen tarjouskirje Outokumpu Oyj:lle — 3 kk pilottitarjous,
         DWS IQ 6 CBAM/CSRD/Scope 3 -vaatimustenmukaisuusautomaatio +
         EU-suvereeni NVIDIA-infrastruktuuri. Yhteyshenkilö: Ari Hirvonen,
         Patent IP Director.
-->

---

Espoo, 27.6.2026

**Ari Hirvonen**
Patent IP Director
Outokumpu Oyj
Salmisaarenranta 11
00180 Helsinki

---

# Tarjouskirje — DWS IQ 6 Pilottitarjous: Suvereeni teollinen tiedustelupalvelu

Hei Ari,

Kiitos ajastasi ja käydystä keskustelusta. Alla esitän Lifetime Oy:n virallisen pilottitarjouksen Outokumpu Oyj:lle.

## Tarjouksen ydin

DWS IQ 6 auttaa Outokumpua myymään enemmän poistamalla vaatimustenmukaisuuden kitkan ennen kauppaa — KYA-hallitulla julkistuslogiikalla ja EU-suvereenilla NVIDIA-infrastruktuurilla. Tulos: sääntelylliset kaupat sulkeutuvat nopeammin ja IP-muurin puolustuskyky vahvistuu.

Jokainen CBAM- tai EPD-dokumentti, jonka myyntiorganisaatio liittää tarjoukseen, on julkaistu tekninen asiakirja, joka sivuaa Outokummun prosessi-IP:tä. Tänä päivänä IP/Patentti-funktio ei ole tässä hyväksyntäsilmukassa. Pilotin tarkoitus on sulkea tuo aukko.

## Tarjouksen rakenne

**Toimittaja:** Lifetime Oy, Y-tunnus 0772407-9, VAT FI07724079
Laidunmaanraitti 2 A 25, 02330 Espoo, Finland
Yhteyshenkilö: Risto Anton Päärni, toimitusjohtaja
risto.paarni@lifetime.fi

**Asiakas:** Outokumpu Oyj, Helsinki
Yhteyshenkilö: Ari Hirvonen, Patent IP Director

## Pilotin laajuus

Pilotti kattaa yhden Outokummun Forta-alatuotelinja-pilottiympäristön:

- **KYA-hallittu CBAM/EPD/Scope 3 -julkistusputki** integroituna olemassa oleviin järjestelmiin (sulattohistorian tietokannat, energianhallintajärjestelmä, romumateriaalirekisteri)
- **IP-funktion vetooikeuspolku:** kenttätason salli/piilota/aggregoi-säännöt, joita IP-funktio hallinnoi; kryptografinen, ihmiseen sidottu este ennen julkaisua
- **EU AI Act Art. 12 -auditointiloki** jokaisesta tekoälyvälitteisestä toiminnosta putkilinjassa
- **Mittausraportti ennen/jälkeen** kolmelle KPI:lle (katso liite OUTOKUMPU_HINTALOMAKE.md)
- **Loppuraportti** pilotista sekä suositus kaupalliseen konversioon

## Kaupalliset ehdot

| Erä                                                | Summa                                             |
| -------------------------------------------------- | ------------------------------------------------- |
| Pilottihinta (toimittajan työpanos)                | **€24 000 (alv 0 %)**                             |
| Maksuaikataulu                                     | 50 % allekirjoituksella, 50 % loppuraportilla     |
| NVIDIA-laitteisto (Jetson Orin Nano + DGX Spark)   | Asiakkaan CAPEX — jää asiakkaalle pilotin jälkeen |
| EU-pilvipalvelut (Scaleway Paris + Aiven Helsinki) | Läpilaskutus omakustannushintaan, ei katetta      |

**Pilottihinnan perusteet:** Hinta kattaa 50 % toimittajan panoksesta (n. 1,5 henkilötyökuukautta, senior-insinööri/toimitusjohtajataso). Laajuus on rajattu yhteen Forta-alatuotelinjaan, jotta riski on hallittavissa ja mitattavissa selkeästi.

**Vaihe 1 — Laajuuden määrittely (1–2 viikkoa) on maksuton.** Tänä aikana lukitaan Forta-alatuotelinja, tehdään lähdejärjestelmäauditointi ja mitataan lähtötaso.

## Miksi nyt

- **Q3 2026:** Ensimmäiset määrämuotoiset CBAM-ilmoitukset erääntyvät. Q1 2026:n siirtymäkauden raportointi osoitti jo, kuinka yksityiskohtaisia asiakasvaatimukset ovat.
- **EU AI Act Annex III -velvoitteet** teollisille julkistusputkille tiukkenevat 2026 aikana. Suvereenin infrastruktuurin provenanssi muuttuu juridiseksi vaatimukseksi.
- **Kilpailijoiden IP-vauhti:** H2 Green Steel, SSAB HYBRIT, ArcelorMittal XCarb laajentavat patenttisalkkujaan. CBAM-julkistukset seuraavien 18 kuukauden aikana ovat kriittisimpiä — juuri silloin, kun Outokummun prosessi-IP on kaikkein alttiimpi.
- **Outokummun Circle Green -etu on nyt suurimmillaan:** CBAM-preemio matalakarbiinisesta teräksestä on tarkalleen se hetki, jolloin ylijulkistaminen maksaa eniten.

## Miksi DWS IQ — eikä yleinen CBAM-ohjelmisto

Yleiset CBAM-työkalut (Sphera, Watershed, Carbon Chain, Position Green) ratkaisevat laskentaongelman. Ne eivät ratkaise hallintaongelmaa — sitä, mitä julkaistaan IP-funktion hyväksynnällä. Ne toimivat US-pilvipalveluissa. Niillä ei ole EU-suvereenia NVIDIA-rakennetta eikä KYA-kryptografista agentti-identiteettikerrosta.

DWS IQ 6 on ainoa tietämämme ratkaisu, joka:

- Toimii EU-suvereenilla NVIDIA-laitteistolla (Jetson / DGX Spark) ja EU-pilvipalveluilla — ei US Cloud Act -altistumista
- Kantaa KYA (Know Your Agent) -luottamuspisteytyksen ja ihmiseen sidotun agentti-identiteetin — auditointikelpoinen vetooikeusketju
- Toimitetaan suomalaisella 24/7-tukipalvelulla (Lifetime Oy, samassa lainkäyttöalueessa kuin Outokumpu)
- On rakennettu suomalaisen yrityksen toimesta (Lifetime Oy, Y-tunnus 0772407-9)

## Tarjouksen liitteet

1. **OUTOKUMPU_HINTALOMAKE.md** — Yksityiskohtainen hintalomake, KPI-taulukko, jatkosopimuksen hinnoittelu
2. **CV_OUTOKUMPU.md** — Risto Anton Päärni, toimitusjohtaja ja pää-arkkitehti
3. **OUTOKUMPU_REFERENSSIT.md** — Viitteet: CBAM/CSRD-automaatio, tekoälyagentit, RAG sääntelydokumenteille, DGX Spark -suvereenius

## Seuraavat askeleet

1. Tarjouksen käsittely Outokummun puolella (tavoite: 2 viikkoa)
2. Vaihtoehto: esittelykokous (Demo + Q&A) — mielellään Salmisaarenrannassa tai etäyhteydellä
3. Vaihtoehtoinen reitti: kirjoitetaan yhdessä yhteinen NDA → Vaihe 1 laajuuden määrittely käynnistyy välittömästi

Tarjous on voimassa 30 päivää tästä päivästä (27.7.2026 saakka).

Olen käytettävissä sopiaksemme tapaamisen tai vastatakseni kysymyksiin suoraan.

Yhteistyöterveisin,

**Risto Anton Päärni**
Toimitusjohtaja, Lifetime Oy
risto.paarni@lifetime.fi
Laidunmaanraitti 2 A 25, 02330 Espoo, Finland
Y-tunnus: 0772407-9 | VAT: FI07724079

---

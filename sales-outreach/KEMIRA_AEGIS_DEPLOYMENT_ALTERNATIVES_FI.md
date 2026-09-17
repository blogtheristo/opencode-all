<!--
VERSION AND AGENT HISTORY
Document: KEMIRA_AEGIS_DEPLOYMENT_ALTERNATIVES_FI.md
Document revision: v1.1
Version: 1.1 | Tool: Claude Code | Session: claude/dgx-spark-mining-case-gf1159 | Date: 26.06.2026 | Changes: Vaihtoehto B (paikallinen) siirretty bespoke 3x DGX Sparkista kanonisiin DWS-laitteisiin — Control Room (5 294 €) / Situation Room (10 093 €), yksi per tehdas.
Version: 1.0 | Tool: Claude Code | Session: claude/dgx-spark-mining-case-gf1159 | Date: 26.06.2026 | Changes: Suomenkielinen yhden sivun tiivistys kahdesta teknologisesta vaihtoehdosta DWS IQ Aegis -ilmastoraportoinnin toteuttamiseen Kemiralla. Lahde (EN): KEMIRA_AEGIS_DEPLOYMENT_ALTERNATIVES.md. Hinnoittelu kanonisesti Store/PRODUCT_AEGIS.md; yritystiedot KEMIRA_AEGIS_BOARD_DECK (PR #1509).
Author: Risto Anton Päärni (Lifetime Oy). Status: DRAFT.
-->

# Kemira × DWS IQ Aegis — kaksi teknologista vaihtoehtoa suvereeniin ilmastoraportointiin

> Yksi alusta, samat agentit, kaksi käyttöönottopolkua. Valinta riippuu vain siitä, kuinka pitkälle suvereniteetin halutaan menevän — hallittu EU-pilvi vai täysin ilmaeristetty Kemiran omalla laitteistolla.

**Asiakas:** Kemira Oyj · **Toimittaja:** Lifetime Oy · **Versio:** 1.0 (LUONNOS) · **Pvm:** 2026-06-26
**Luottamuksellisuus:** Vain Kemira Oyj ja Lifetime Oy
**Kohderyhmä:** Maria (Hintikka) Sederholm (VP, Fiber Essentials) · Mikko Pohjala (VP, Strategy) · CISO / IT-johto

---

## Yhteinen kyvykkyys (sama molemmissa)

Molemmat vaihtoehdot tuottavat **saman DWS IQ Aegis -kyvykkyyden**; ero on vain siinä, **missä alusta ajetaan ja kuka omistaa raudan.**

- **VulcanAgent** — ETS/CBAM-hiili-ilmoitusmoottori; jokainen luku lasketaan deterministisesti (ei LLM:ää numeroissa — malli vain kirjoittaa narratiivin, analysoi aukot ja viittaa lähteisiin).
- **CSRD/ESRS-valmius** — Scope 1/2/3 + ESRS-datapistekattavuus, jäljitettävissä lähteeseen varmennusta varten.
- **CrossVerticalIntel** — kaksisuuntainen PCF: toimittajien PCF:ien vastaanotto (Kemiran 4/2025 Supplier PCF -ohje) ja asiakaskohtaisten tuotejalanjälkien / EPD:iden tuotto.
- **KYA** — todennettu agentti-identiteetti, Firecracker-MicroVM-eristys, reaaliaikainen kill-valta, auditointijälki.
- **12 artiklan loki + suvereniteettiarvio** — jokainen tekoälytoiminto lokiin; CLOUD Act -altistus pisteytetään.

> **Varmennettu konteksti (board deck, PR #1509).** Kemira Oyj — Nasdaq Helsinki, pk Helsinki; tj. Antti Salminen (12.2.2024–); kolme liiketoimintayksikköä 1.1.2025 alkaen; SBTi-tavoitteet: **Scope 1&2 −51,23 % / 2030**, **Scope 3 −32,5 % / 2033**, **hiilineutraali S1&2 / 2045**. CSRD/ESRS (FY2024) varmennuksessa _(vahvistettava)_. Liikevaihto ≈ 2,95 mrd €, ~4 700 työntekijää _(vahvistettava)_.

## Vaihtoehto A — suvereeni EU-pilvi (UpCloud Helsinki)

Kanoninen **ohjelmisto-only** Aegis, yksittäisvuokrattu Kubernetes **UpCloud Helsingissä (fi-hel1/fi-hel2)** — suomalaisomisteinen, Tesi-taustainen, ISO 27001, CISPE, **nolla CLOUD Act -altistus**. NVIDIA **L40S** -inferenssi EU-enklaavissa.

|                   |                                                                      |
| ----------------- | -------------------------------------------------------------------- |
| Isännöinti        | UpCloud Helsinki (suomalainen suvereeni pilvi)                       |
| Ostettava rauta   | **Ei mitään** (ohjelmisto-only)                                      |
| Suvereniteetti    | EU-suvereeni, nolla CLOUD Act; data Suomessa hallitussa pilvessä     |
| Nopeus            | Nopein — Aegis GA **8/2026**                                         |
| Hinta (kanoninen) | **Standard 59 990 € + 999 €/kk** · **Defence 89 990 € + 1 999 €/kk** |

**Kompromissi:** data on (suomalaisessa, suvereenissa) _hallitussa pilvessä_, ei fyysisesti tehtaalla. Useimpaan CSRD/ETS/PCF-työhön riittävä — suositeltu aloituskohta.

## Vaihtoehto B — paikallinen / ilmaeristetty (Aegis Sovereign, DWS Control Room / Situation Room)

**Aegis Sovereign** -taso **ilmaeristettynä Kemiran omalla DWS-laitteistolla** yhdellä tehtaalla — kanoninen **DWS Control Room** (yksi Acer Veriton GN100 + NVIDIA-malliasennus) tai **DWS Situation Room** (2× GN100 sillattu + laajempi NVIDIA-mallipaketti) tehdasverkossa. Aegis pysyy ohjelmisto-only; laitteisto on **asiakkaan omistama avaimet käteen -alusta** (asennus paikan päällä), kuten Outokummun rautamalli.

**Käyttöönottomalli: yksi Control Room (tai Situation Room) per tehdas** — laite tehtaan verkossa, syötteenä reunasensorit (kamerat, akustiikka, IoT, historia). Skaalaus lisäämällä yksikkö per tehdas.

|                   |                                                                                                                                                 |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Isännöinti        | Paikallinen, ilmaeristetty, tehdasverkko — ei pilveä                                                                                            |
| Ostettava rauta   | **DWS Control Room 5 294 €** (yksi GN100) tai **DWS Situation Room 10 093 €** (2× GN100 sillattu) — avaimet käteen, omistukseen, asennus mukana |
| Mallit            | NVIDIA-mallipaketti (näkö, akustiikka, kieli, päättely, puhe); sillattu pari ajaa rinnakkaisinferenssiä                                         |
| Suvereniteetti    | Maksimi — ilmaeristetty; päästö-, prosessi- ja reseptidata ei poistu tehtaalta                                                                  |
| Nopeus            | Avaimet käteen -laite, asennus yhdellä käynnillä (hitaampi kuin pilvi, mutta ei räätälirakennusta)                                              |
| Hinta (kanoninen) | **Sovereign — räätälöity + 4 999 €/kk** ohjelmisto, **+ laite-CAPEX** (5 294 € / 10 093 €)                                                      |

**Kompromissi:** laite-CAPEX ja yhden tehtaan jalanjälki. Vastineeksi **kanoninen avaimet käteen -tuote kiintein hinnoin**, asennus paikan päällä ja vahvin suvereniteetti.

> **Mikä laite.** DWS-rautatikkaat: Jetson-reunasolmut → **Control Room (GN100, 5 294 €)** → DGX Spark → **Situation Room (2× GN100, 10 093 €)** → IGX Orin. Control Room yhden solmun compliance-kopilottiin; Situation Room kun halutaan myös akustiikka/näkö-valvonta. Suurimpaan 1M-tokenin kontekstiin DGX-luokan solmu (vrt. arkistoidut `docs/DGX_SPARK_3X_KEMIRA_*_OLD`).

## Vertailu

| Ulottuvuus      | **A — EU-pilvi**             | **B — paikallinen / ilmaeristetty**            |
| --------------- | ---------------------------- | ---------------------------------------------- |
| Aegis-kyvykkyys | Identtinen                   | Identtinen                                     |
| Datan sijainti  | Suomalainen pilvi (UpCloud)  | Fyysisesti tehtaalla, ilmaeristetty            |
| CLOUD Act       | Ei                           | Ei (ei ulkoverkkoa)                            |
| Rautaomistus    | Ei (ohjelmisto-only)         | DWS Control Room / Situation Room, omistukseen |
| Alkukustannus   | 59 990 € / 89 990 €          | Räätälöity + 5 294–10 093 € laite              |
| Kuukausi        | 999 € / 1 999 €              | 4 999 €                                        |
| Aika tuottoon   | Nopein (GA 8/2026)           | Hitaampi                                       |
| Laajuus         | Konsernitaso, monta tehdasta | Yksi herkkä tehdas                             |

## Suositus

**Aloita vaihtoehdolla A** (EU-pilvi) Fiber Essentials -pilotissa Aegis GA:han linjattuna — nopein polku mitattuun hiili-ilmoitussykliin, auditointikattavuuteen ja säästettyihin tunteihin, täysi EU-suvereniteetti, ei omistettavaa rautaa. **Varaa vaihtoehto B** (paikallinen / ilmaeristetty) tehtaille tai tuotelinjoille, joilla resepti-/OT-datan herkkyys vaatii fyysisen ilmaeristyksen tai Kemira haluaa CAPEX-omaisuuden OPEX:in sijaan. Eivät poissulkevia: pilotoi pilvessä, sijoita paikallisesti sinne missä suvereniteetti vaatii. Sama Aegis, sama auditointiketju — valinta on vain käyttöönoton topologia.

## Huomiot

- **Hinnoittelu kanonista**: Aegis-tasot `Store/PRODUCT_AEGIS.md`, laitehinnat (Control Room 5 294 €, Situation Room 10 093 €) `dws10.com/config/products.json` — Aegis ei niputa rautaa; laite on erillinen CAPEX.
- **Deterministinen pisteytys** (sääntö 5): numerot koodilla, LLM vain narratiiviin/aukkoihin/viittauksiin.
- **CBAM kapea tänään** (sementti, teräs, alumiini, lannoitteet, vety, sähkö) — suurin osa Kemiran kemiasta ei soveltamisalassa.
- **Laitevalinta** (B): Control Room (yksi GN100) vs Situation Room (sillattu pari) tehtaan mallipaketin ja kuorman mukaan; DGX-luokka 1M-kontekstiin.
- **Varmennus tarvitsee ihmistilintarkastajan.**
- **_(vahvistettava)_** -luvut ovat yksilähteisiä — vahvista Kemiralta ennen hallituskäsittelyä.

---

_Toimittaja: Lifetime Oy · Y-tunnus 0772407-9 · ALV FI07724079 · Laidunmaanraitti 2 A 25, 02330 Espoo · CEO Risto Anton Paarni · risto.paarni@lifetime.fi_
_Liiteaineistot: `sales-outreach/KEMIRA_AEGIS_BOARD_BUSINESS_CASE.html`, `KEMIRA_AEGIS_BOARD_DECK.pptx`, `Store/PRODUCT_AEGIS.md`. Keskustelua varten, ei sopimus._

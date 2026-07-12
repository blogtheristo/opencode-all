# 3× NVIDIA DGX Spark — Paikallinen prosessikopilotti Kemiralle

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: claude/dgx-spark-mining-case-gf1159 | Date: 26.06.2026 | Changes: Ensimmäinen versio — suomenkielinen yhden sivun tiivistys 3× DGX Spark -aloitustason liiketoimintatapauksesta Kemiralle (prosessikemia). Pohjautuu dokumenttiin DGX_SPARK_3X_KEMIRA_BUSINESS_CASE.md.

Session Links & References:

- Claude Code (claude/dgx-spark-mining-case-gf1159): https://github.com/blogtheristo/dws6/commits/claude/dgx-spark-mining-case-gf1159
- Lähde-dokumentti: docs/DGX_SPARK_3X_KEMIRA_BUSINESS_CASE.md
- View on GitHub: https://github.com/blogtheristo/dws6/blob/main/docs/DGX_SPARK_3X_KEMIRA_YHTEENVETO_FI.md

Document Status:

- Created: 26.06.2026
- Last Modified: 26.06.2026
- Language: Finnish
- Languages Available: Suomi (englanninkielinen täysversio: DGX_SPARK_3X_KEMIRA_BUSINESS_CASE.md)
- Publication Status: DRAFT

---

> **Asemointi.** Tämä on DGX Spark -reunaperheen **aloitustaso**. 4× lippulaiva (`DGX_SPARK_4X_MINING_BUSINESS_CASE.md`) ajaa 753B GLM-5.2:n 1M tokenin kontekstilla; tämä 3× rakenne vaihtaa katon **edullisempaan hintaan ja yhden tuotantopaikan jalanjälkeen** — ja päivittyy 4×:ksi lisäämällä yhden yksikön.
> **Oletukset.** Kemira-tiedot rajattu julkisesti tunnettuihin: suomalainen kemianyhtiö (vedenkäsittely + sellu & paperi), pääkonttori Helsinki, omaa reseptiikkaa, EU-säädelty tuotanto. Toimintaskenaario, mittarit ja kustannukset ovat **suuntaa-antavia esimerkkilukuja**, eivät Kemiran mitattua dataa.

## Ongelma

Jatkuva- ja eräprosessikemiassa odottamaton linjan pysähdys tai sarja ali-spec-eriä maksaa **tuhansia–kymmeniä tuhansia euroja tunnissa** menetettynä tuotantona, uudelleenajona ja hukatuna raaka-aineena. Juurisyy on hajallaan: prosessihistoria/SCADA, työohjeet (SOP), eräpöytäkirjat, laitemanuaalit, käyttöturvallisuustiedotteet ja REACH-/prosessiturvallisuusaineistot — ja arvokkaimmat (**reseptit ja prosessiajot**) ovat liikesalaisuuksia, jotka eivät saa poistua tehdasverkosta.

- **Dokumentaatiokriisi.** Satoja tuhansia sivuja; kukaan ei ehdi yhdistää niitä vuoropaineessa.
- **Liikesalaisuus & suvereniteetti.** Reseptiikka on Kemiran ydin-IP. Telemetrian ja reseptikontekstin vienti julkipilveen ei käy IP-, prosessiturvallisuus- (Seveso) eikä EU-datasijaintisyistä.
- **Viive.** Vuoroinsinööri tarvitsee vastauksen paneelilla sekunneissa, ei etä-API-kierroksena.

## Ratkaisu: paikallinen prosessikopilotti

Kompakti 3× DGX Spark -klusteri kaapissa tehtaalla, tehdasverkossa — ei konesalia, ei pilveä.

- **Laitteisto:** kolme DGX Spark -yksikköä, 100/200 GbE -kytkin (ConnectX-7). Yhteensä **384 GB yhtenäistä muistia**, tehontarve **~0,75 kW** — syötettävissä tehtaan sähköstä ja UPS:stä.
- **Malli:** **200–300B-luokan avoin MoE** NVFP4-kvantisoituna. ~235B mallissa painot ≈ **118 GB**, jolloin **~260 GB** jää pitkälle konteksti-ikkunalle (esim. 256K–512K tokenia) ja järjestelmälle.
- **Päättelymoottori:** **vLLM** NCCL:n yli, tensori- tai putkiparalleeli kolmen solmun yli (ks. TP=3-huomio).

## Toimintamalli

1. **Syöttö:** poikkeama/pysähdys → vuoroinsinööri syöttää historia-ikkunan (esim. 24–48 h) sekä linjan SOP:t, tuoreet eräpöytäkirjat ja laitemanuaalin.
2. **Analyysi:** pitkällä kontekstilla malli lukee ohjeet, erähistorian ja telemetrian _yhtä aikaa_ — tarkka data, ei häviöllistä vektorihakua (RAG).
3. **Lopputulos (sekunneissa):**
   > _"Linjan 2 polymeerisyötön johtokykypoikkeama alkoi 02:40, vastaa annostelupumpun kavitaatio-oiretta (SOP-114 §6.3). Ali-spec-riski seuraavissa kahdessa erässä. Suositus: tarkista imupuolen siiviläsuodattimen ΔP, esitäytä SOP-114:n mukaan ja pidä erä B-2287 QC-uusintatestiin ennen vapautusta."_

## Liiketoimintahyöty (ROI)

_Suuntaa-antava aloitustaso; Stage 1 korvaa Kemiran todellisilla luvuilla._

| Investointi                       | Kustannus (USD) | Tuotto / säästö                                                                                                                     |
| --------------------------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **3× DGX Spark -solmua**          | ~$13 500        | **Poikkeamasta päätökseen -aika −~40 %** — ei PDF- ja historiakahlaamista.                                                          |
| **100/200G-kytkin + kaapelointi** | ~$4 500         | **Käyttöaste & saanto:** jo **~1–2 tunnin** pysähdyksen (tai muutaman ali-spec-erän) välttäminen kattaa koko ~$18 000 investoinnin. |
| **Ohjelmisto (vLLM / avoin MoE)** | $0              | **Ei pilvikuluja** eikä resepti-/OT-datan **egressiä**.                                                                             |
| **Alkuinvestointi yhteensä**      | **~$18 000**    | **Datasuvereniteetti:** 100 % paikallinen; reseptit ja prosessidata eivät poistu tehtaalta. EU-linjassa (REACH/CSRD/Seveso).        |

## Miksi 3× — eikä 4× tai 2×

|                        | 2× (256 GB)                 | **3× (384 GB)**                           | 4× (512 GB)                       |
| ---------------------- | --------------------------- | ----------------------------------------- | --------------------------------- |
| Muisti                 | 256 GB                      | **384 GB**                                | 512 GB                            |
| Teho                   | ~0,5 kW                     | **~0,75 kW**                              | < 1 kW                            |
| Hinta (suuntaa-antava) | ~$12 000                    | **~$18 000**                              | ~$24 000                          |
| Mallikatto             | ~200–235B + lyhyt konteksti | **200–300B + pitkä (256–512K) konteksti** | **753B (GLM-5.2) + 1M konteksti** |
| Paras                  | Yksi linja                  | **Yksi tehdas, dokumenttipainotteinen**   | Lippulaiva, max-konteksti         |

- **Ei 4×:** 753B/1M-lippulaiva vaatii 512 GB. Jos Kemira tarvitsee sen katon → 4× taso.
- **Ei 2×:** 256 GB ajaa 235B-mallin mutta kuristaa pitkän kontekstin. 3× antaa väljyyttä ja puhtaan päivityspolun 4×:ään.

## Huomiot (varmistettava ennen hankintaa)

- **Malli on avoin, ei GLM-5.2-lippulaiva.** Varmenna malli, NVFP4-checkpoint, lisenssi (kaupallinen käyttö) ja kontekstipituus ennen ostoa.
- **TP=3-rajoite.** Tensoriparalleeli 3 GPU:lla vaatii, että mallin pää-/välidimensiot jakautuvat tasan kolmella; muuten käytä putkiparalleelia tai TP=2 + kolmas solmu. Testaa penkissä.
- **Pitkä konteksti ≠ 1M.** Tämä taso tähtää 256K–512K tokeniin (yksi linja). Miljoonan tokenin korpus on 4×:n työtä.
- **ROI-luvut ovat suuntaa-antavia** — Stage 1 mittaa todelliset.
- **OT-integraatio on varsinainen työ** — vain-luku historia/SCADA, OT/IT-erottelu, prosessiturvallisuus. Pilotoi yhdellä linjalla.

---

_Toimittaja: Lifetime Oy · Y-tunnus 0772407-9 · ALV FI07724079 · Laidunmaanraitti 2 A 25, 02330 Espoo · CEO Risto Anton Paarni · risto.paarni@lifetime.fi_
_Tämä on keskustelua varten laadittu liiketoimintatapaus, ei sopimus. Muunnettavissa pilottilomakkeeksi Lifetime Oy:n vakioehdoin._

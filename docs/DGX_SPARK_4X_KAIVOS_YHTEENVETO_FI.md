# 4× NVIDIA DGX Spark — Maanalainen tekoälyaivo autonomiseen kaivostoimintaan

![4× DGX Spark "Maanalainen tekoälyaivo" -klusteri kaivostoimintaan — 512 GB yhtenäistä muistia, alle 1 kW teho, GLM-5.2 NVFP4 ja 1M tokenin konteksti, vLLM Tensor Parallel (TP=4); MTTR −45 %, ~24 000 $, 100 % paikallinen datasuvereniteetti](assets/images/dgx-spark-4x-sub-surface-ai-brain.png)

---

# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:

- Version: 1.1 | Tool: Claude Code | Session: claude/dgx-spark-mining-case-gf1159 | Date: 26.06.2026 | Changes: Lisätty 4× setup -infografiikka (docs/assets/images/dgx-spark-4x-sub-surface-ai-brain.png) johtokuvaksi; varmennetut GLM-5.2-NVFP4-mallikortin tiedot päivitetty.
- Version: 1.0 | Tool: Claude Code | Session: claude/dgx-spark-mining-case-gf1159 | Date: 26.06.2026 | Changes: Ensimmäinen versio — suomenkielinen yhden sivun tiivistys (one-pager) 4× DGX Spark -reunaklusterin liiketoimintatapauksesta kaivosympäristöön. Pohjautuu dokumenttiin DGX_SPARK_4X_MINING_BUSINESS_CASE.md.

Session Links & References:

- Claude Code (claude/dgx-spark-mining-case-gf1159): https://github.com/blogtheristo/dws6/commits/claude/dgx-spark-mining-case-gf1159
- Lähde-dokumentti: docs/DGX_SPARK_4X_MINING_BUSINESS_CASE.md
- View on GitHub: https://github.com/blogtheristo/dws6/blob/main/docs/DGX_SPARK_4X_KAIVOS_YHTEENVETO_FI.md

Document Status:

- Created: 26.06.2026
- Last Modified: 26.06.2026
- Language: Finnish
- Languages Available: Suomi (englanninkielinen täysversio: DGX_SPARK_4X_MINING_BUSINESS_CASE.md)
- Publication Status: DRAFT

---

## Ongelma

Syvissä maanalaisissa kaivoksissa (esim. LKAB Kiiruna, Boliden Suomi) autonomiset porausjumbot, kuljetuskoneet ja lastaajat toimivat satoja metrejä pinnan alla. Kun monen miljoonan euron kone vikaantuu, tuotanto pysähtyy — hintana **kymmeniä tuhansia euroja tunnissa**.

- **Dokumentaatiokriisi.** Kaaviot, historiatelemetria, anturidata ja huolto-ohjeet kattavat satoja tuhansia sivuja. Kukaan ei ehdi lukea niitä paineen alla.
- **Verkon pullonkaula.** Miljoonan tokenin teknistä kuormaa ei voi lähettää julkipilveen 1 000 metrin syvyydestä: kuituyhteys on viiveinen ja altis räjäytysten aiheuttamille katkoksille, ja telemetria on yrityksen omaa IP:tä, joka ei saa poistua paikallisverkosta.

## Ratkaisu: "Maanalainen tekoälyaivo"

Kalliin ja pölyherkän palvelinsalin sijaan operaattori sijoittaa **4× DGX Spark -klusterin** ruggeroituun, siirrettävään komentokonttiin suoraan kaivostasolle.

- **Laitteisto:** Neljä DGX Spark -yksikköä yhdistettynä 200 Gbit/s Ethernet-kytkimellä (ConnectX-7). Yhteensä **512 GB yhtenäistä muistia**, tehontarve **alle 1 kW** — varavoimakoneilla helposti ylläpidettävissä.
- **Malli:** ZAI:n (Zhipu) **GLM-5.2** — MoE-malli päättelyyn ja koodaukseen, joka käyttää harvaa attentiota (IndexShare-indeksoija) pitkän kontekstin tukemiseen — NVIDIAn virallisena **NVFP4**-versiona (`nvidia/GLM-5.2-NVFP4`, kvantisoitu NVIDIA TensorRT Model Optimizerilla, **lisenssi sallii kaupallisen ja ei-kaupallisen käytön**). 753B-mittakaavassa painot ≈ **376,5 GB**, jolloin **1M tokenin konteksti-ikkunalle** ja järjestelmälle jää ~135 GB.
- **Päättelymoottori:** **vLLM** ohjaa klusteria tensoriparalleelilla (TP = 4) NCCL:n yli.

## Toimintamalli

1. **Syöttö:** Kone hälyttää vikakoodin → huoltoinsinööri syöttää 48 tunnin anturitelemetrian ja koko ~800 000 sanan huolto-ohjeen järjestelmään.
2. **Analyysi:** 1M tokenin kontekstin ansiosta malli lukee _koko ohjeen ja koko lokin yhtä aikaa_ — ei häviöllistä vektorihakua (RAG), vaan tarkka data.
3. **Lopputulos (sekunneissa):**
   > _"Telemetria osoittaa mikropainehäviön hydrauliventtiilissä B-4 klo 03:14, mikä vastaa ohjeen sivun 1 402 kulumisoireita. Vaihda tiivisterengas X-9 ja kalibroi paikallispäätteeltä."_

## Liiketoimintahyöty (ROI)

| Investointi                         | Kustannus (USD) | Tuotto / säästö                                                                                                   |
| ----------------------------------- | --------------- | ----------------------------------------------------------------------------------------------------------------- |
| **4× DGX Spark -solmua**            | ~$18 000        | **Korjausaika (MTTR) –~45 %** — ei PDF-kahlaamista eikä pilvidiagnostiikan odottelua.                             |
| **200G-kytkin + DAC-kaapelointi**   | ~$6 000         | **Käyttöaste:** jo **kahden tunnin** seisokin välttäminen kattaa koko ~$24 000 investoinnin.                      |
| **Ohjelmisto (vLLM / avoin malli)** | $0              | **Ei pilvikuluja:** poistaa toistuvat token- ja datansiirtomaksut satelliitti-/mobiiliyhteyksiltä.                |
| **Alkuinvestointi yhteensä**        | **~$24 000**    | **Datasuvereniteetti:** 100 % paikallinen; vastaa pohjoismaisia tietosuoja- ja teollisuusturvallisuusvaatimuksia. |

## Miksi 4× DGX Spark voittaa

| Ominaisuus             | 4× DGX Spark                          | 8× H100 -palvelin            |
| ---------------------- | ------------------------------------- | ---------------------------- |
| Hinta (suuntaa-antava) | ~$24 000                              | $300 000+                    |
| Teho                   | < 1 kW (pistorasia)                   | Suurjännitesyöttö            |
| Jäähdytys              | Ympäristö / pöytä                     | Teollinen ilmastointi        |
| Tilantarve             | Yksi pöytä, kuorma-autoon siirrettävä | Räkki + oma sali             |
| Soveltuvuus reunaan    | Korkea (pölynkestävä, liikuteltava)   | Matala (konesalisidonnainen) |

## Huomiot (varmistettava ennen hankintaa)

- **Yksi laite ei riitä.** Yksittäisen DGX Sparkin muisti on 128 GB (NVIDIAn arvio ≈ 200B-malleihin FP4:llä). 753B-malli vaatii **4+** yksikön klusterin NCCL:n yli — siksi tämä tapaus on 4×, ei 1×.
- **Malli on todellinen; numerot tarkistettava.** `nvidia/GLM-5.2-NVFP4` on NVIDIAn julkaisema (arkkitehtuuri, kvantisointi ja kaupallisen käytön salliva lisenssi varmennettu mallikortista). Numeroarvot — parametrimäärä (oletus 753B), NVFP4-koko levyllä (≈376,5 GB) ja kontekstipituus (oletus 1M) — on **siirretty toimeksiannosta eikä varmennettu mallikorttia vasten** tässä istunnossa (ympäristön egress-politiikka estää `huggingface.co`-yhteyden). Varmenna nämä luvut ennen ostopäätöstä.
- **1M kontekstin todellinen suorituskyky** riippuu eräkoosta ja KV-välimuistin kvantisoinnista — testaa edustavalla kuormalla ennen SLA-lupausta.
- **ROI-luvut ovat suuntaa-antavia** — syötä kohteen todellinen seisokkikustannus ja MTTR-lähtötaso.

---

_Täysi englanninkielinen liiketoimintatapaus: `docs/DGX_SPARK_4X_MINING_BUSINESS_CASE.md`_

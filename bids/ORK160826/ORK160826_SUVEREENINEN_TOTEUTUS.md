# Suvereeninen AI-toteutus NVIDIA-laitteistolla

## Liite: Laitteistokokoonpanot | ORK/1462/2026

---

VERSION AND AGENT HISTORY
Version: 1.0 | 2026-06-27 | Claude Sonnet 4.6 | Luotu tarjouspyynnön pohjalta

---

---

**Tarjoaja:** Lifetime Oy | Y-tunnus: 0772407-9
**Viite:** ORK/1462/2026

---

## Suvereenin AI-toteutuksen periaate

Oikeusrekisterikeskuksen toiminnassa käsitellään Suomen oikeushallinnon kannalta kriittistä dataa. Lifetime Oy tarjoaa **täysin EU-suvereenin** tekoälytoteutuksen, jossa:

- **Kaikki päättely tapahtuu paikan päällä** — data ei poistu ORK:n tiloista
- **Ei riippuvuutta US CLOUD Act -piirissä oleviin pilvipalveluihin** kriittisessä datapolussa
- **NVIDIA-laitteisto** mahdollistaa frontier-tason LLM-mallien ajamisen on-prem alle 250 W virralla
- **EU AI Act Article 12** -vaatimusten mukainen immutable audit trail kaikesta agenttiaktiviteetista
- **NIS2-direktiivin** mukainen tietoturva-arkkitehtuuri alusta lähtien

Tämä on sama arkkitehtuuriperiaate, jota Lifetime Oy käyttää DWS IQ 6 -alustassaan tuotannossa.

---

## Laitteistokokoonpano 1: Control Room 1x

### Käyttötarkoitus

Yksittäinen osasto tai projekti — esim. yksi oikeusministeriön hallinnonalan virasto, joka tarvitsee paikallisen tekoälypäättelykyvyn agenttipohjaisia järjestelmäkehitystehtäviä varten.

### Kokoonpano

| Komponentti           | Spesifikaatio                                                  |
| --------------------- | -------------------------------------------------------------- |
| **Laite**             | 1× NVIDIA DGX Spark                                            |
| **Muisti**            | 128 GB yhtenäinen muisti (CPU + GPU)                           |
| **AI-laskentateho**   | 1 000 AI TOPS                                                  |
| **Virrankulutus**     | ~250 W (pistorasia riittää)                                    |
| **Verkko**            | ConnectX-7 NIC (200 Gbps)                                      |
| **Tallennustila**     | 1 TB NVMe SSD                                                  |
| **Malli**             | Llama 3.3 70B / Qwen 2.5 72B (paikalliset mallit, Ollama)      |
| **Kontekstiikkuna**   | Jopa 128k tokenia (riittää pitkille juridisille dokumenteille) |
| **Latenssi**          | < 1 s ensimmäinen token, < 100 ms/token generointinopeus       |
| **Tietosuoja**        | 100 % on-prem, ei egress-liikennettä ulkopuolelle              |
| **Käyttöjärjestelmä** | NVIDIA DGX OS (Ubuntu-pohjainen), Docker, Ollama               |

### Sopii tilanteisiin

- Yksittäisen viraston tai projektin agenttipohjainen kehitysympäristö
- Koodin generointi, dokumenttianalyysi, prosessiautomaation kehitys
- Prototyyppien ja demotoimeksiantojen kehitys ennen laajempaa käyttöönottoa
- Kehittäjätyöasema, jossa tarvitaan GPU-laskentaa ilman pilveä

### Hinta-arvio (laitteisto, ei sisälly tuntihintaan)

| Erä                                       | Arvioitu hinta (ALV 0 %) |
| ----------------------------------------- | ------------------------ |
| NVIDIA DGX Spark (1 kpl)                  | n. 4 500 – 5 000 €       |
| Asennus ja käyttöönotto (kertaluonteinen) | 8 h × 72 €/h = 576 €     |
| Mallin käyttöönotto ja testaus            | 4 h × 72 €/h = 288 €     |
| **Yhteensä (arvio)**                      | **n. 5 364 – 5 864 €**   |

> Laitteiston hinnat ovat suuntaa antavia ja vahvistetaan hankintavaiheessa. Asiantuntijatyön osuus laskutetaan tuntiveloituksella sopimuksen mukaisesti.

---

## Laitteistokokoonpano 2: Situation Room (2× DGX Spark)

### Käyttötarkoitus

Useamman viraston tai projektitiimin jaettu AI-kapasiteetti — frontier-luokan kielimalli, pitkät kontekstit (lakitekstit, tuomiorekisteri, laajat asiakokonaisuudet), rinnakkainen agenttikehitys.

### Kokoonpano

| Komponentti         | Spesifikaatio                                                             |
| ------------------- | ------------------------------------------------------------------------- |
| **Laitteet**        | 2× NVIDIA DGX Spark (klusteroitu)                                         |
| **Muisti**          | **256 GB** yhtenäinen muisti (poolattu, TP=2)                             |
| **AI-laskentateho** | 2 000 AI TOPS                                                             |
| **Virrankulutus**   | ~500 W (kaksi yksikköä, normaali pistorasia)                              |
| **Verkko**          | ConnectX-7 NIC, 200 Gbps sisäinen yhteys                                  |
| **Tallennustila**   | 2 TB NVMe                                                                 |
| **Kielimalli**      | **Meta Llama 3.1 405B** (NVFP4/Q4, ~202 GB) — frontier-luokan avoin malli |
| **Malliluokka**     | 405 miljardia parametria — vertautuu GPT-4 -luokkaan suorituskyvyssä      |
| **Kontekstiikkuna** | **128 000 tokenia** (~96 000 sanaa, noin 300 sivua tekstiä kerralla)      |
| **Päättelynopeus**  | vLLM Tensor Parallel (TP=2) — tuotantotason läpimeno                      |
| **Latenssi**        | < 2 s ensimmäinen token                                                   |
| **Tietosuoja**      | 100 % on-prem, täysin EU-suvereeni, ei cloud-riippuvuuksia                |
| **Infra**           | Docker Compose, GitHub Actions CI/CD, Supabase managed EU                 |

### Llama 3.1 405B — miksi tämä malli?

Meta Llama 3.1 405B on tällä hetkellä suurin julkisesti saatavilla oleva avoin kielimalli, joka:

- **Avoin lisenssi** — kaupallinen käyttö sallittu, lähdekoodi tarkastettavissa (ei mustia laatikoita)
- **Vertautuu GPT-4-luokkaan** koodaus-, päättely- ja juridisten tekstien analysoinnissa
- **Mahtuu 2× DGX Spark -klusteriin** NVFP4-kvantisoinnilla (~202 GB / 256 GB muistista)
- **EU-suvereeni** — malli ajetaan täysin paikallisesti, ei API-kutsuja ulkopuolelle
- **Suomen kielen tuki** — monikielinen malli, toimii suomenkielisillä oikeushallinnon teksteillä

128k-konteksti vastaa noin **300 sivua** tekstiä yhdessä kyselyssä — riittää laajan lakiasiakirjan tai oikeustapauskokonaisuuden analysointiin ilman RAG-katkaisua.

### Sopii tilanteisiin

- Hallinnonalan jaettu AI-infrastruktuuri useammalle tiimille
- Frontier-tason juridinen dokumenttianalyysi (pitkä konteksti)
- Rinnakkainen agenttikehitys (useampi toimeksianto samanaikaisesti)
- Tuotantotason agenttijärjestelmä ilman cloud-riippuvuutta

### Hinta-arvio (laitteisto, ei sisälly tuntihintaan)

| Erä                                               | Arvioitu hinta (ALV 0 %) |
| ------------------------------------------------- | ------------------------ |
| NVIDIA DGX Spark (2 kpl)                          | n. 9 000 – 10 000 €      |
| Asennus, klusterointi ja käyttöönotto             | 16 h × 72 €/h = 1 152 €  |
| Mallien käyttöönotto, vLLM-konfiguraatio, testaus | 6 h × 72 €/h = 432 €     |
| **Yhteensä (arvio)**                              | **n. 10 584 – 11 584 €** |

> Laitteiston hinnat ovat suuntaa antavia ja vahvistetaan hankintavaiheessa. Asiantuntijatyön osuus laskutetaan tuntiveloituksella sopimuksen mukaisesti.

---

## Optio: Situation Room laajennettu (4× DGX Spark)

Jos hankinnan laajuus tai tulevat tarpeet edellyttävät suurempaa kapasiteettia, tarjoamme optiona 4× DGX Spark -klusterin:

| Komponentti         | Spesifikaatio                                                      |
| ------------------- | ------------------------------------------------------------------ |
| **Laitteet**        | 4× NVIDIA DGX Spark (klusteroitu)                                  |
| **Muisti**          | 512 GB yhtenäinen muisti                                           |
| **Kielimalli**      | GLM-5.2 NVFP4 (753B MoE) — 1 000 000 tokenin konteksti-ikkuna      |
| **Kontekstiikkuna** | **1 000 000 tokenia** (~750 000 sanaa, koko lakikokoelma kerralla) |
| **Päättelynopeus**  | vLLM Tensor Parallel (TP=4)                                        |
| **Laitteistohinta** | n. 23 000 – 27 000 € (laitteisto + kytkentä + käyttöönotto)        |

> **Optio aktivoidaan tilaajan pyynnöstä** — 2× kokoonpanosta laajennus 4× onnistuu lisäämällä kaksi yksikköä ja rekonfiguroimalla klusteri. Lifetime Oy toimittaa laajennuksen sopimuksen puitteissa.

---

## Vertailu: On-prem vs. Pilvi

| Kriteeri                      | NVIDIA DGX Spark (on-prem)                  | Pilvipalvelu (US-toimittaja)               |
| ----------------------------- | ------------------------------------------- | ------------------------------------------ |
| **Tietosuoja**                | 100 % data pysyy ORK:ssa                    | Data siirtyy palveluntarjoajalle           |
| **CLOUD Act -riski**          | Ei riskiä                                   | Yhdysvaltain laki voi koskea dataa         |
| **EU AI Act Article 12**      | Täysin hallittu, immutable log              | Riippuu toimittajasta                      |
| **NIS2-vaatimustenmukaisuus** | Arkkitehtuuri hallitaan sisäisesti          | Toimittajan vastuulla                      |
| **Jatkuvat kustannukset**     | Vain sähkö + ylläpito                       | Kuukausiveloitus kasvaa käytön mukaan      |
| **Latenssi**                  | < 1 s (lähiverkko)                          | 100–500 ms (internet)                      |
| **Käytettävyys**              | 100 % riippumaton nettiyhteydestä           | Riippuu palveluntarjoajan SLA:sta          |
| **Skaalautuvuus**             | Lisäyksiköt modulaarisesti                  | Skaalautuu, mutta kustannus kasvaa         |
| **Token-kustannukset**        | Ei per-token-laskutusta; rajaton inferenssi | Per-token-veloitus, kasvaa volyymin mukaan |

**Token-kustannussäästö.** Pilvipohjaiset LLM-API:t veloittavat per token — suuren volyymin
oikeushallinnon käytössä lasku kasvaa nopeasti ja arvaamattomasti. Lokaali DGX Spark -päättely on
**kiinteä kustannus**: kun laitteisto on paikoillaan, inferenssi on rajaton ilman token-laskua. Tämä
tekee kustannuksesta ennustettavan ja budjetoitavan.

**Leasing-vaihtoehto.** Laitteisto on tarvittaessa saatavissa **leasingina** (capex → opex). ORK:n ei
tarvitse hankkia laitteistoa etukäteen; kuukausierä kattaa laitteiston ja käyttöönoton, ja token-säästö
kompensoi leasingkustannusta suuren volyymin käytössä.

---

## Toteutuspolku

### Vaihe 1 — Control Room 1x (pilotti, 1–3 kk)

1. Hankitaan 1× DGX Spark, asennetaan ORK:n tiloihin
2. Lifetime Oy konfiguroi Ollama + Llama 3.3 70B (tai vastaava)
3. Ensimmäinen agenttipohjainen toimeksianto toteutetaan suvereenilla laitteistolla
4. Auditoidaan EU AI Act Article 12 -lokivaatimukset

### Vaihe 2 — Situation Room (laajentaminen, tarvittaessa)

1. Hankitaan lisä-DGX Spark -yksiköt (3 kpl)
2. Lifetime Oy klusteroi yksiköt (vLLM Tensor Parallel)
3. Frontier-malli (GLM-5.2 tai vastaava) käyttöön 1M-token kontekstilla
4. Hallinnonalan laajempi käyttö avataan

---

## Lifetime Oy:n DGX Spark -referenssi

Lifetime Oy käyttää **NVIDIA DGX Spark** -laitteistoa omassa tuotantoympäristössään:

- DGX Spark toimii 24/7 cron-ajastimen primääripalvelimena (15 tuotantotyönkulkua)
- GitHub Actions -varmennus (failover) aktivoituu vain, jos DGX Spark ei vastaa
- Ollama-integraatio: paikalliset mallit kehittäjätyöhön ilman cloud-kustannuksia
- Käytännön kokemus: asennus, konfigurointi, Docker Compose, tuotantokäyttö

---

_Lifetime Oy | Y-tunnus: 0772407-9 | VAT: FI07724079_
_Laidunmaanraitti 2 A 25, 02330 Espoo, Finland_
*risto.paarni@lifetime.fi*

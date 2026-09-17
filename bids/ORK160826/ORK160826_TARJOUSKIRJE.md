# Tarjouskirje

## Tekoälyn asiantuntijapalvelut — ORK/1462/2026

---

VERSION AND AGENT HISTORY
Version: 1.0 | 2026-06-27 | Claude Sonnet 4.6 | Luotu tarjouspyynnön pohjalta

---

---

**Tilaaja:**
Oikeusrekisterikeskus (ORK)
Hämeenlinna

**Viite:** ORK/1462/2026
**Päiväys:** 27.6.2026
**Tarjoaja:**

Lifetime Oy
Y-tunnus: 0772407-9
Laidunmaanraitti 2 A 25, 02330 Espoo, Finland
VAT: FI07724079
Yhteyshenkilö: Risto Anton Päärni, toimitusjohtaja
Sähköposti: risto.paarni@lifetime.fi

---

## Tarjouksen kohde

Lifetime Oy tarjoaa tällä tarjouksella tekoälyn asiantuntijapalveluja kaikkiin kolmeen osa-alueeseen:

- **Osa-alue 1:** Agentti- ja tekoälyratkaisujen kehitys
- **Osa-alue 2:** Asiakasratkaisujen ja -prosessien kehityksen tuki
- **Osa-alue 3:** Agenttipohjainen järjestelmäkehitys

## Erottavat tekijät — miksi Lifetime Oy

Emme kilpaile halvimmalla volyymityövoimalla. Tarjouksemme erottuu kahdella tekijällä, joita yksikään
puhdas henkilöstötalo ei tarjoa:

1. **Agenttikyvykkyys (58 agenttia, 88 kyvykkyyttä, 25 toimialaa).** ORK saa pääsyn tuotantokäytössä
   olevaan kyvykkyyskerrokseen — agentit, jotka tekevät jokaisesta henkilötyöpäivästä tuottavamman ja
   tuottavat auditoitavan EU AI Act Article 12 -jäljen automaattisesti. Suomalainen ydintiimi (Paarni +
   Santiago) johtaa ja vastaa; agentit poistavat rutiinin (human-in-the-loop). Pieni tiimi suuren
   toimiston teholla.
2. **Suvereeni NVIDIA-laitteisto (Control Room / Situation Room).** Kaikki tekoälypäättely voi tapahtua
   ORK:n omissa tiloissa NVIDIA DGX Spark -laitteistolla — oikeushallinnon kriittinen data ei poistu
   organisaation hallinnasta eikä siirry US CLOUD Act -piiriin. KYA-agenttihallinta (Firecracker
   MicroVM, <125 ms kill, kryptografinen identiteetti) takaa jäljitettävyyden jokaiselle AI-toiminnolle.
   **Lokaali päättely poistaa pilvi-API:n token-kustannukset:** kiinteä laitteistokustannus mahdollistaa
   rajattoman inferenssin ilman per-token-laskutusta — merkittävä säästö suuren volyymin käytössä.
   Laitteisto on tarvittaessa saatavissa **leasingina** (capex → opex), jolloin ORK:n ei tarvitse
   hankkia laitteistoa etukäteen.

Yhdessä nämä tekevät tarjouksesta **suvereenin ja auditoitavan** tavalla, joka vastaa julkishallinnon
ja oikeusrekisterin korkeimpiin vaatimuksiin — ei pelkkä konsulttiresurssin vuokraus.

## Tarjoajan esittely

Lifetime Oy on suomalainen tekoäly- ja ohjelmistoyritys, joka on rakentanut DWS IQ 6 -alustan — 58 agentin ja 88 kyvykkyyden tuotantojärjestelmän 25 toimialalle — toimitusjohtaja Risto Anton Päärnin johdolla. Suomalainen ydintiimi (CEO Risto Anton Paarni + Office Chief Lucille Santiago) vastaa työnjohdosta, asiakasrajapinnasta ja arkaluontoisen datan käsittelystä EU/Suomi-resursseilla. Emme kilpaile pelkällä henkilömäärällä vaan kyvykkyydellä: 58 agenttia tuottaa enemmän per henkilötyöpäivä kuin perinteinen konsulttiresurssi — todellinen hinta-laatu-etu, joka säilyttää ihmisen päätöksentekijänä (human-in-the-loop). Yrityksen ydinosaaminen kattaa täsmälleen Oikeusrekisterikeskuksen hankinnan kolme osa-aluetta:

1. **Agenttijärjestelmät ja moniagentti-orkestrointi** — Model Context Protocol (MCP), TypeScript/Python-agentit, deterministinen pisteytys, tool calling
2. **Asiakasprosessien digitalisaatio** — EU-sääntelyautomatisointi, tiedonhaku RAG-arkkitehtuurilla, prosessiautomaatio
3. **Agenttipohjainen järjestelmäkehitys** — Tuotantotason agenttijärjestelmät Supabase/PostgreSQL + pgvector -pohjalla, Google Cloud Run, GitHub Actions CI/CD

Yritys toimii **oikeusministeriön hallinnonalan kannalta relevanteilla** osaamis-alueilla:

- EU AI Act Article 12 -vaatimusten mukainen lokitus tuotannossa
- GDPR-yhteensopiva tietojenkäsittely ja arkkitehtuuri
- NIS2-direktiivin mukainen tietoturva-arkkitehtuuri
- Avoin lähdekoodi ja suvereenin EU-arkkitehtuurin periaatteet

## Suvereenin toteutuksen tarjous — NVIDIA-laitteisto

Lifetime Oy tarjoaa ORK:lle mahdollisuuden **täysin EU-suvereeniin AI-toteutukseen** NVIDIA DGX Spark -laitteistolla. Tämä tarkoittaa, että kaikki tekoälypäättely tapahtuu ORK:n omissa tiloissa — oikeushallinnon kriittinen data ei poistu organisaation hallinnasta eikä siirry US CLOUD Act -piirissä oleviin pilvipalveluihin.

Tarjoamme kahta laitteistokokoonpanoa (kuvattu erillisessä liitteessä):

**Control Room 1x** — yksittäisen viraston tai projektin suvereenin AI-kehitysympäristö

- 1× NVIDIA DGX Spark, 128 GB yhtenäinen muisti, ~250 W, Llama 3.3 70B / Qwen 2.5 72B
- Arviohinta laitteistoineen ja käyttöönottoineen: n. **5 400 – 5 900 €**

**Situation Room** — hallinnonalan kattava frontier-AI-kapasiteetti

- 4× NVIDIA DGX Spark klusteroituna, 512 GB muisti, 1 000 000 tokenin konteksti-ikkuna
- Mahdollistaa koko lakikokoelman tai laajan asiakirja-arkiston analysoinnin yhdessä kyselyssä
- Arviohinta laitteistoineen ja käyttöönottoineen: n. **25 000 – 29 000 €**

Lifetime Oy käyttää DGX Spark -laitteistoa omassa tuotantoympäristössään 24/7 — käytännön kokemus asennuksesta, konfiguroinnista ja tuotantokäytöstä on olemassa.

## Sitoumus

Lifetime Oy sitoutuu:

- Noudattamaan tilaajan työnjohtoa toimeksiannoissa
- Toimittamaan palvelut suomen kielellä
- Toimittamaan dokumentaation suomeksi
- Noudattamaan julkishallinnon tietoturva- ja salassapitovaatimuksia
- Ilmoittamaan mahdollisista esteellisyyksistä välittömästi

## Tarjouksen voimassaolo

Tarjous on voimassa 31.12.2026 saakka.

---

Kunnioittavasti,

**Risto Anton Päärni**
Toimitusjohtaja, Lifetime Oy
risto.paarni@lifetime.fi
Y-tunnus: 0772407-9

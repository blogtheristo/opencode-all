# Moniagentti-tekoälyarkkitehtuuri yritystason ilmastosääntelyyn: A2A-protokollan integrointi DWS IQ -alustaan

**Pro gradu -tutkielma — Suomenkielinen versio**
**Tekijä:** Risto Paarni, Lifetime Oy
**Päivämäärä:** Helmikuu 2026
**Alusta:** DWS IQ Platform versio 6

---

## Tiivistelmä

Tämä tutkielma dokumentoi moniagentti-tekoälyarkkitehtuurin suunnittelun ja toteutuksen yritystason ilmastosääntelyyn, joka on rakennettu DWS IQ -alustan päälle. Järjestelmä integroi Googlen Agent-to-Agent (A2A) -protokollan ja Anthropicin Model Context Protocol (MCP) -protokollan mahdollistaen organisaatioiden välisen tekoälyyhteistyön EU:n ilmastosääntelyyn (Fit for 55, CSRD, ETS, CBAM, EU:n tekoälysäädös). Arkkitehtuuri osoittaa, miten teollisuusyritykset voivat yhdistää omat tekoälyagenttinsa DWS IQ:n sääntelypalveluihin — siirtyen verkkopohjaisen markkinoinnin yläpuolelle todelliseen operatiiviseen tekoälyyhteistyöhön.

---

## 1. Johdanto

### 1.1 Ongelmanasettelu

EU:n ilmastosäädökset (Fit for 55, CSRD, ETS, CBAM) vaativat yrityksiä 16 toimialalla laskemaan, raportoimaan ja vähentämään hiilipäästöjä. Nykyiset ratkaisut ovat siiloutuneita — jokainen organisaatio käyttää omia vaatimustenmukaisuustyökalujaan ilman kykyä tehdä yhteistyötä toimitusketjujen, kumppanien tai viranomaisten kanssa agenttitasolla.

### 1.2 Tutkimuskysymys

Miten moniagentti-tekoälyarkkitehtuuri, joka perustuu avoimiin protokolliin (A2A ja MCP), voi mahdollistaa organisaatioiden välisen ilmastosääntelyautomatisoinnin EU-säädellyille teollisuusyrityksille?

### 1.3 Rajaus

- DWS IQ Platform versio 6 isäntäalustana
- 11 teollisuuden toimialaa (rakennus, energia, valmistus, logistiikka, terveydenhuolto, kiinteistöt, rahoituspalvelut, julkinen sektori, kaivostoiminta, laivanrakennus, jätehuolto)
- Google A2A Protocol v0.3.0 agenttien väliseen viestintään
- Anthropic MCP sisäiseen agentti-työkaluintegraatioon

---

## 2. Terminologia

### 2.1 Protokollaterminologia

| Termi | Suomenkielinen selitys | Määritelmä |
|-------|----------------------|-----------|
| **A2A (Agent-to-Agent)** | Agentti-agenttiprotokolla | Avoin protokolla, joka mahdollistaa autonomisten tekoälyagenttien välisen viestinnän eri organisaatioissa. Agentit kommunikoivat agentteina (päättelykykyisesti), eivät työkaluina (rakenteellisella I/O:lla). |
| **MCP (Model Context Protocol)** | Mallikontekstiprotokolla | Protokolla tekoälyagenttien yhdistämiseen työkaluihin, tietokantoihin ja rajapintoihin. |
| **Agent Card** | Agenttikortti | JSON-metadatadokumentti osoitteessa `/.well-known/agent.json`, joka kuvaa agentin identiteetin, kyvykkyydet (taidot), päätepisteen ja todennusvaatimukset. |
| **Task** | Tehtävä | A2A:n perustyöyksikkö. Yksilöllinen tunniste ja elinkaari: `submitted` → `working` → `completed` / `failed` / `input-required`. |
| **Message** | Viesti | Viestintävuoro asiakkaan ja etäagentin välillä. Rooli (`user` tai `agent`) ja sisältää yhden tai useamman osan (Part). |
| **Part** | Osa | Pienin sisältöyksikkö viestissä tai artefaktissa. Voi sisältää tekstiä, tiedostoviittauksia tai rakenteista dataa. |
| **Artifact** | Artefakti | Agentin tuottama tuotos tehtävän tuloksena — asiakirjat, raportit, rakenteinen data. |
| **Skill** | Taito/kyvykkyys | Agentin agenttikorttiin ilmoittama kyvykkyys. Asiakkaat valitsevat taidon tehtävää luodessaan. |
| **Context ID** | Kontekstitunniste | Tunniste, joka ryhmittää liittyvät tehtävät ja viestit monivuoroiseen keskusteluun. |
| **Streaming** | Suoratoisto | Reaaliaikaiset päivitykset tehtäville SSE:n (Server-Sent Events) kautta. |

### 2.2 DWS IQ -terminologia

| Termi | Suomenkielinen selitys |
|-------|----------------------|
| **DWS IQ** | Yritystason tekoälyalusta EU:n ilmastosääntelyyn. Versio 6. |
| **Firehorse** | Sääntelyautomaatiotyökalujen kokonaisuus: Reports, Automation, Omnichannel, Content DMS. |
| **Firehorse Report** | Tilintarkastuskelpoinen ilmastosääntelyraportti (PDF/Excel). |
| **Brain (Aivot)** | DWS IQ:n moniagentti-tekoälyn orkestrointikerros. |
| **Memory (Muisti)** | Lifetime World Model — ilmasto-LLM, joka on koulutettu EU-säädöksillä. |
| **Body (Keho)** | Firehorse Suite — suorituskerros raporteille, automaatiolle ja viestinnälle. |
| **Hands (Kädet)** | Lifetime Fleet — IoT ja robotiikka fyysiseen toteutukseen. |
| **Iron Clad** | DWS:n brändinimi jaetulle käyttöliittymäinfrastruktuurille (navigaatio, alatunniste). |

### 2.3 EU-säädösterminologia

| Termi | Suomenkielinen selitys |
|-------|----------------------|
| **Fit for 55** | EU:n lainsäädäntöpaketti kasvihuonekaasupäästöjen vähentämiseksi 55 %:lla vuoteen 2030 mennessä. |
| **CSRD** | Yritysten kestävyysraportointidirektiivi — vaatii suuret EU-yritykset raportoimaan ESG-dataa. |
| **ETS** | EU:n päästökauppajärjestelmä — hiilipäästöoikeuksien kaupankäynti. |
| **CBAM** | Hiilirajamekanismi — hiilitulli tuontitavaroille. |
| **EU:n tekoälysäädös** | Tekoälyä koskeva asetus. Artikla 12 vaatii automaattisen kirjaamisen korkeariskisille tekoälyjärjestelmille. |
| **NIS2** | Verkko- ja tietoturvadirektiivi 2 — kyberturvallisuusvaatimukset. |
| **GAIA-X** | Eurooppalainen datainfrastruktuurihanke suvereniteettiin ja yhteentoimivuuteen. |

---

## 3. Arkkitehtuuri

### 3.1 Aivot-Muisti-Keho-Kädet -ekosysteemi

```
┌──────────────────────────────────────────────────────┐
│                 DWS IQ Platform v6                    │
│                                                      │
│  ┌─────────┐  ┌─────────────┐  ┌──────────────────┐ │
│  │  Aivot   │  │   Muisti    │  │      Keho        │ │
│  │ Moni-    │←→│ Lifetime    │←→│  Firehorse Suite │ │
│  │ agentti  │  │ World Model │  │  Raportit, Auto, │ │
│  │ Orkest.  │  │ Ilmasto-LLM│  │  Monikanava      │ │
│  └────┬─────┘  └─────────────┘  └────────┬─────────┘ │
│       │                                   │          │
│       │         ┌─────────────┐           │          │
│       └────────→│   Kädet     │←──────────┘          │
│                 │ Lifetime    │                       │
│                 │ Fleet (IoT) │                       │
│                 └─────────────┘                       │
└──────────────────────────────────────────────────────┘
```

### 3.2 A2A-integraatiokerros

```
Kumppaniorganisaatio              DWS IQ -alusta
┌──────────────────┐             ┌──────────────────────┐
│  Kumppaniagentti │  A2A-proto  │  DWS IQ -agentti     │
│  (mikä tahansa   │────────────→│  (A2A-palvelin)      │
│   kehys: ADK,    │  Tehtävä    │                      │
│   LangGraph,     │←────────────│  Taidot:             │
│   CrewAI, oma)   │  Artefaktit │  • sääntely-laskenta │
│                  │             │  • firehorse-raportti │
│  Lukee           │             │  • hiililaskuri      │
│  agenttikortin   │             │                      │
└──────────────────┘             │  Sisäinen MCP:       │
                                 │  • Supabase-tietokanta│
                                 │  • ERP-liitännät     │
                                 │  • Hiilimoottori     │
                                 │  • World Model       │
                                 └──────────────────────┘
```

---

## 4. Toteutus

### 4.1 DWS IQ A2A-palvelimena

DWS IQ julkaisee agenttikortin osoitteessa `https://api.dws10.com/.well-known/agent.json`, joka kuvaa kolme päätaitoa:

1. **compliance-calculation** — Vastaanottaa päästödataa, palauttaa Fit for 55/CSRD/ETS-pisteet
2. **firehorse-report** — Tuottaa tilintarkastuskelpoisia sääntelyraportteja
3. **carbon-calculator** — Laskee Scope 1/2/3 -hiilijalanjäljen

### 4.2 Python SDK -integraatio

```python
from a2a_sdk import A2AClient

# Löydä DWS IQ -agentti
client = A2AClient("https://api.dws10.com")
agenttikortti = client.get_agent_card()

# Luo sääntelylaskentatehtävä
tehtava = client.create_task(
    skill_id="compliance-calculation",
    message={
        "role": "user",
        "parts": [{
            "type": "data",
            "data": {
                "scope1_tco2e": 1250.5,
                "scope2_tco2e": 890.3,
                "scope3_tco2e": 3420.1,
                "industry": "manufacturing",
                "country": "FI"
            }
        }]
    }
)

# Odota tulosta
tulos = client.wait_for_task(tehtava.id)
# tulos.artifacts sisältää sääntelypisteet
```

### 4.3 Validointi A2A Inspectorilla

```bash
pip install a2a-inspector
a2a-inspector validate https://api.dws10.com/.well-known/agent.json
```

---

## 5. Yritysedut

### 5.1 Teollisuuskumppaneille

| Hyöty | Kuvaus |
|-------|--------|
| **Ei toimittajalukkoa** | A2A on kehysriippumaton. Kumppanit käyttävät mitä tahansa agenttikehystä. |
| **Autonominen toiminta** | Agentit toimivat itsenäisesti — manuaalista syöttöä tai portaaliin kirjautumista ei vaadita. |
| **Reaaliaikainen sääntely** | Sääntelypisteet palautetaan reaaliajassa, ei eräajoina. |
| **Toimitusketjun näkyvyys** | Yritysten välinen päästödatan vaihto A2A-moniagenttityönkulkujen kautta. |
| **Tilintarkastuskelpoiset raportit** | Firehorse tuottaa PDF/Excel-raportteja, jotka läpäisevät tilintarkastuksen. |

---

## 6. Turvallisuus

- **Todennus:** OAuth 2.0 ja API-avaimet (määritelty agenttikortissa)
- **Dataresidenssit:** Kaikki A2A-liikenne käsitellään EU:ssa (europe-north1, Suomi)
- **Salaus:** TLS 1.3 kaikessa agenttiviestinnässä
- **GDPR:** Ei henkilötietoja A2A-tehtävissä (vain aggregoitu päästödata)
- **EU:n tekoälysäädös artikla 12:** Kaikki A2A-tehtävät kirjataan automaattisesti päättelyketjuineen

---

## 7. Johtopäätökset

Googlen A2A-protokollan integrointi DWS IQ -alustaan luo ensimmäisen laatuaan olevan moniagentti-ilmastosääntelyverkoston. Teollisuusyritykset voivat yhdistää omat tekoälyagenttinsa laskeakseen sääntelyn noudattamista, tuottaakseen raportteja ja orkestroimaan yritysten välisiä ESG-työnkulkuja. A2A:n (agentti-agentille) ja MCP:n (agentti-työkaluille) yhdistelmä tarjoaa täydellisen arkkitehtuurin autonomiselle yritystason ilmastoälylle.

---

## Lähteet

- [A2A Protocol Specification v0.3.0](https://a2a-protocol.org/latest/specification/)
- [A2A Python SDK](https://github.com/a2aproject/a2a-python)
- [A2A Inspector](https://github.com/a2aproject/a2a-inspector)
- [A2A Samples](https://github.com/a2aproject/a2a-samples)
- [MCP Protocol (Anthropic)](https://modelcontextprotocol.io/)
- [EU Fit for 55](https://www.consilium.europa.eu/en/policies/green-deal/fit-for-55-the-eu-plan-for-a-green-transition/)
- [DWS Brand Standard v2.0](../DWS_BRAND_STANDARD.md)

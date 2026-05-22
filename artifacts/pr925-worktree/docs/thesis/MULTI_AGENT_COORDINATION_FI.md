***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Cursor.ai | Session: Ultra-Agents | Commit: pending | Date: 03.01.2026 | Changes: Opinnäytetyödokumentaatio moniagenttien koordinoinnista

Session Links & References:
  - GitHub: https://github.com/blogtheristo/dws6/blob/main/docs/thesis/MULTI_AGENT_COORDINATION_FI.md
  - Related: AGENTS.md - Master Agent Index
  - Related: .workflows/agents/ULTRA_AGENT_COORDINATOR.md
  - Related: AgentFoundry/Calculus_for_Training.md

Document Status:
  - Created: 03.01.2026
  - Last Modified: 03.01.2026
  - Language: Suomi
  - Languages Available: English, Suomi
  - Publication Status: Published
  - Document Type: Opinnäytetyödokumentaatio / Tekninen arkkitehtuuri

Repository Status:
  - GitHub: ✅ Committed
  - Location: docs/thesis/MULTI_AGENT_COORDINATION_FI.md
  - .gitignore: NO (akateeminen dokumentti)
  - Workflows: None
  - Access Level: 🟢 Julkinen
  - Category: Akateeminen / Tutkimus

Update Process:
  - Manual edits: Opinnäytetyön tekijä, tekoälyagentit
  - Automated updates: Ei
  - Approval required: Kyllä - Risto Päärni
  - Publishing: Manuaalinen commit GitHubiin

Related Documents:
  - AGENTS.md - Agenttien pääindeksi
  - AgentFoundry/Calculus_for_Training.md - LLM-koulutuksen laskenta
  - mcp-hub/server.py - MCP Hub -toteutus
  - CloudAgents/dws-team/README.md - Sisäisten agenttien määrittelyt
---

# Moniagenttien koordinointi teollisissa tekoälyalustoissa
## Tapaustutkimus DWS IQ 6 -agenttiekosysteemistä

**Tekijä:** Risto Anton Päärni  
**Oppilaitos:** Metropolia Ammattikorkeakoulu  
**Päiväys:** 3. tammikuuta 2026  
**Dokumenttityyppi:** Opinnäytetyön tekninen dokumentaatio

---

## Tiivistelmä

Tämä dokumentti esittelee Lifetime Scope Signals -protokollan teknisen arkkitehtuurin ja toteutuksen, jota käytetään useiden tekoälyagenttien koordinointiin DWS IQ 6 -teollisessa älyalustassa. Järjestelmä hallitsee kolmea agenttikategoriaa (kehitys, sisäinen toiminta ja asiakaspalvelu) signaalipohjaisen viestintämekanismin kautta, joka mahdollistaa riippuvuustietoisen rinnakkaisen suorituksen.

**Avainsanat:** Moniagenttiärjestelmät, tekoälyn orkestraatio, signaalipohjainen koordinointi, teollinen tekoäly, MCP (Model Context Protocol)

---

## Sisällysluettelo

1. [Johdanto](#1-johdanto)
2. [Tutkimusongelma](#2-tutkimusongelma)
3. [Agenttiarkkitehtuurin suunnittelu](#3-agenttiarkkitehtuurin-suunnittelu)
4. [Lifetime Scope Signals -protokolla](#4-lifetime-scope-signals--protokolla)
5. [Toteutus](#5-toteutus)
6. [Arviointi](#6-arviointi)
7. [Aiheeseen liittyvä työ](#7-aiheeseen-liittyvä-työ)
8. [Johtopäätökset](#8-johtopäätökset)
9. [Lähteet](#9-lähteet)

---

## 1. Johdanto

### 1.1 Tausta

Nykyaikaiset tekoälynatiivit yritysalustat vaativat useiden erikoistuneiden tekoälyagenttien koordinointia, jotka työskentelevät samanaikaisesti keskinäisriippuvaisissa tehtävissä. DWS IQ 6 -alusta, joka on suunniteltu teolliseen ilmastosäännöstenmukaisuuteen, käyttää yli 22 tekoälyagenttia kehitys-, toiminta- ja asiakaspalvelualueilla.

### 1.2 Tutkimuskonteksti

Tämä työ on osa Metropolia Ammattikorkeakoulun opinnäytetyöprojektia, joka keskittyy moniagenttiisten tekoälyjärjestelmien käytännön toteuttamiseen teollisiin sovelluksiin. DWS IQ 6 -alusta toimii tapaustutkimuksena todellisten agenttien koordinointimallien demonstroimiseksi.

### 1.3 Dokumentin laajuus

Tämä tekninen dokumentaatio kattaa:
- Agenttiarkkitehtuurin ja kategorisoinnin
- Lifetime Scope Signals -protokollan määrittelyn
- Signaalien riippuvuudenhallinnan
- Toteutuksen yksityiskohdat Node.js:llä ja Pythonilla
- Integraation MCP Hub -koordinointikerrokseen

---

## 2. Tutkimusongelma

### 2.1 Koordinointihaasteet

Kun rakennetaan monimutkaisia tekoälynatiiveja alustoja useilla agenteilla, syntyy useita koordinointihaasteita:

1. **Riippuvuudenhallinta**: Agentit riippuvat usein muiden agenttien tuotoksista
2. **Rinnakkainen suoritus**: Läpimenoajan maksimointi ajamalla riippumattomia agentteja samanaikaisesti
3. **Tilan synkronointi**: Yhtenäisen tilan ylläpitäminen hajautettujen agenttien välillä
4. **Virheiden leviäminen**: Virheiden käsittely ilman ketjureaktiota riippuvaisiin agentteihin
5. **Edistymisen näkyvyys**: Ihmisen valvonnan mahdollistaminen moniagenttipohjaisissa työnkuluissa

### 2.2 Vaatimukset

Koordinointijärjestelmän täytyy:
- Tukea kolmea erillistä agenttikategoriaa erilaisilla elinkaarimalleilla
- Mahdollistaa riippuvuustietoinen tehtävien aikataulutus
- Tarjota reaaliaikainen tilanäkyvyys
- Sallia manuaalinen interventio jumittuneille agenteille
- Skaalautua 10:stä yli 22 agenttiin

---

## 3. Agenttiarkkitehtuurin suunnittelu

### 3.1 Agenttikategoriat

DWS IQ 6 -alusta järjestää agentit kolmeen kategoriaan:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        AGENTTIEKOSYSTEEMI                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  KATEGORIA A: V1.0 KEHITYSAGENTIT (10 agenttia)                 │   │
│  │  Elinkaari: Sprinttipohjainen (kertaluonteinen)                 │   │
│  │  Koordinointi: Signaalipohjaiset vaiheriippuvuudet              │   │
│  │  Työkalut: Cursor AI, Claude, Gemini                            │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  KATEGORIA B: SISÄISET TIIMIGENTIT (7 agenttia)                 │   │
│  │  Elinkaari: Jatkuva (käynnissä olevat toiminnot)                │   │
│  │  Koordinointi: Viikkosykli, tapahtumaohjattu                    │   │
│  │  Työkalut: LlamaStack, Groq, Claude                             │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  KATEGORIA C: ASIAKASRAJAPINNAN AGENTIT (5+ agenttia)           │   │
│  │  Elinkaari: Toimialakohtainen käyttöönotto, vaiheittainen       │   │
│  │  Koordinointi: Hiljainen pilotti → Neuvonantaja → Autonominen   │   │
│  │  Työkalut: AgentFoundry-konfiguraatiot, MCP Hub                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Teknologiapino

| Kerros | Teknologia | Tarkoitus |
|--------|------------|-----------|
| Orkestraatio | MCP Hub (FastAPI) | Keskitetty koordinointi, työnkulkumallit |
| Nopea päättely | Groq API (Llama 3.1 70B) | Nopeat agenttivastaukset (<100ms) |
| Monimutkainen päättely | Claude Sonnet 4.5 | Syvällinen analyysi, suunnittelutehtävät |
| Moniagentti | LlamaStack | Agenttien orkestraatiokehys |
| Reunatekoäly | NVIDIA Jetson | Paikalliset SiteSense-agentit |
| Tietokanta | Supabase (PostgreSQL + pgvector) | Data, upotukset, signaalit |

### 3.3 MCP Hub -arkkitehtuuri

MCP Hub (`mcp-hub/server.py`) toteuttaa kolme koordinointimallia:

1. **Fan-Out -malli**: Jakaa tehtävät useille agenteille rinnakkain
2. **Reflektio-malli**: Agentti arvioi itse tuotoksensa ja iteroi
3. **Sekvenssimalli**: Vaiheittainen suoritus eksplisiittisillä riippuvuuksilla

```python
class WorkflowRequest(BaseModel):
    workflow_type: str  # fan-out, reflection, sequential
    tasks: list[AgentTask]
    metadata: dict[str, Any] | None = None
```

---

## 4. Lifetime Scope Signals -protokolla

### 4.1 Protokollan yleiskatsaus

Lifetime Scope Signals -protokolla mahdollistaa agenttien välisen viestinnän julkaise-tilaa -mekanismilla. Agentit **lähettävät** signaaleja suorittaessaan virstanpylväitä, ja riippuvaiset agentit **kuuntelevat** näitä signaaleja ennen etenemistä.

### 4.2 Signaalin muodon määrittely

```
[AGENT-XX]:SIGNAALI_TYYPPI:VIRSTANPYLVÄS:AIKALEIMA
```

**Komponentit:**
- `AGENT-XX`: Yksilöllinen agenttitunniste (esim. `AGENT-01`, `AGENT-07`)
- `SIGNAALI_TYYPPI`: Yksi seuraavista: `READY`, `COMPLETE`, `ERROR`, `BLOCKED`
- `VIRSTANPYLVÄS`: Tietty tuotoksen tunniste (esim. `supabase-auth`)
- `AIKALEIMA`: ISO 8601 -muotoinen aikaleima

**Esimerkkisignaaleja:**
```
[AGENT-07]:READY:rls-policies:2026-01-05T14:30:00Z
[AGENT-01]:COMPLETE:v1-auth:2026-01-10T09:00:00Z
[AGENT-02]:BLOCKED:report-api:2026-01-06T10:15:00Z
```

### 4.3 Signaalityypit

| Tyyppi | Semantiikka | Vaikutus riippuvuuksiin |
|--------|-------------|-------------------------|
| `READY` | Virstanpylväs saavutettu | Vapauttaa tätä signaalia kuuntelevat agentit |
| `COMPLETE` | Kaikki agentin työ valmis | Agentti siirtyy valmis-tilaan |
| `ERROR` | Virhe tapahtui | Hälyttää koordinaattorin, saattaa estää riippuvaisia |
| `BLOCKED` | Odottaa ulkoista riippuvuutta | Ei vaikutusta ennen vapautusta |

### 4.4 Riippuvuusgraafi

Riippuvuusgraafi V1.0-kehitysagenteille:

```
VAIHE 1 (Perusta - Ei riippuvuuksia)
├── Agent-01 (Auth)      ──LÄHETTÄÄ──► READY:supabase-auth
├── Agent-07 (Tietokanta)──LÄHETTÄÄ──► READY:rls-policies, READY:schema-users
└── Agent-10 (Dokumentit)──LÄHETTÄÄ──► READY:api-docs
         │
         ▼
VAIHE 2 (Ydinpalvelimet - Tarvitsee vaiheen 1)
├── Agent-02 (Firehorse) ◄──KUUNTELEE── Agent-01:supabase-auth, Agent-07:rls-policies
├── Agent-04 (Tekoäly)   ◄──KUUNTELEE── Agent-07:rls-policies
└── Agent-09 (Sähköposti)◄──KUUNTELEE── Agent-07:schema-users
         │
         ▼
VAIHE 3 (Käyttöliittymä - Tarvitsee vaiheen 2)
├── Agent-03 (Kojelauta) ◄──KUUNTELEE── Agent-02:report-api, Agent-04:customersat
└── Agent-05 (Mobiili)   ◄──KUUNTELEE── Agent-02:report-api, Agent-04:mcp-hub
         │
         ▼
VAIHE 4 (Parannukset - Valinnainen)
├── Agent-08 (Maksut)    ◄──KUUNTELEE── Agent-01:v1-auth, Agent-07:v1-database
└── Agent-06 (Yritys)    ⊘ SIIRRETTY
```

### 4.5 Signaalin tilakaavio

Jokainen agentti noudattaa tätä tilakaaviota:

```
┌─────────────┐     riippuvuudet     ┌─────────────┐
│   ODOTTAA   │ ────────täytetty────►│   KÄYNNISSÄ │
└─────────────┘                      └─────────────┘
       ▲                                    │
       │                         lähettää signaaleja
       │                                    │
       │                                    ▼
       │                             ┌─────────────┐
       └────── virhe ◄────────────── │ TYÖSKENTELEE│
                                     └─────────────┘
                                            │
                                   kaikki signaalit lähetetty
                                            │
                                            ▼
                                     ┌─────────────┐
                                     │   VALMIS    │
                                     └─────────────┘
```

---

## 5. Toteutus

### 5.1 Signaalirekisteri

Signaalien tila säilytetään JSON-muodossa:

**Tiedosto:** `.workflows/agents/AGENT_SIGNAL_REGISTRY.json`

```json
{
  "version": "1.0",
  "launch_date": "2026-02-23",
  
  "agents": {
    "agent-01": {
      "name": "DWS IQ Kirjautumisjärjestelmä",
      "phase": 1,
      "status": "running",
      "dependencies": [],
      "signals": {
        "listening": [],
        "emitted": ["READY:jwt-service"],
        "pending": ["READY:supabase-auth", "COMPLETE:v1-auth"]
      },
      "unlocks": ["agent-02", "agent-03", "agent-05", "agent-08"]
    }
  },
  
  "signal_log": [
    {
      "timestamp": "2026-01-03T10:00:00Z",
      "agent": "agent-01",
      "type": "READY:jwt-service",
      "message": "JWT-todennuspalvelu toteutettu"
    }
  ]
}
```

### 5.2 Koordinaattori-CLI

Koordinaattori on toteutettu Node.js:llä:

**Tiedosto:** `.workflows/agents/coordinator.cjs`

```javascript
function showReady() {
  const registry = loadRegistry();
  
  // Kerää kaikki lähetetyt signaalit
  const emittedSignals = new Set();
  for (const [id, agent] of Object.entries(registry.agents)) {
    for (const signal of agent.signals.emitted || []) {
      emittedSignals.add(`${id}:${signal}`);
    }
  }
  
  // Tarkista mitkä odottavat agentit ovat valmiita
  for (const [id, agent] of Object.entries(registry.agents)) {
    if (agent.status !== 'waiting') continue;
    
    const listening = agent.signals.listening || [];
    const unmet = listening.filter(sig => !emittedSignals.has(sig));
    
    if (unmet.length === 0) {
      console.log(`✅ Valmis: ${id}`);
    } else {
      console.log(`⏳ Estetty: ${id} - Tarvitsee: ${unmet.join(', ')}`);
    }
  }
}
```

### 5.3 Signaalin lähetys

```javascript
function emitSignal(agentId, signal) {
  const registry = loadRegistry();
  const agent = registry.agents[agentId];
  
  // Siirrä odottavista lähetettyihin
  const idx = agent.signals.pending.indexOf(signal);
  agent.signals.pending.splice(idx, 1);
  agent.signals.emitted.push(signal);
  
  // Kirjaa lähetys
  registry.signal_log.push({
    timestamp: new Date().toISOString(),
    agent: agentId,
    type: signal,
    message: `Signaali lähetetty: [${agentId.toUpperCase()}]:${signal}`
  });
  
  // Tarkista valmistuminen
  if (signal.startsWith('COMPLETE:')) {
    agent.status = 'complete';
  }
  
  saveRegistry(registry);
}
```

### 5.4 MCP Hub -integraatio (Tuleva)

Tuotantokäyttöönottoa varten signaalit tallennetaan Supabaseen:

```python
# mcp-hub/server.py (suunniteltu lisäys)
@app.post("/signals/emit")
async def emit_signal(agent_id: str, signal: str):
    await supabase.table("agent_signals").insert({
        "agent_id": agent_id,
        "signal": signal,
        "timestamp": datetime.now().isoformat()
    })
    await notify_listeners(agent_id, signal)
    return {"status": "emitted"}
```

### 5.5 Käyttöliittymätoteutus - Dashboard V9

Moniagenttiökosysteemin valvomiseksi ja vuorovaikutukseen käyttäjien kanssa toteutettiin Dashboard V9 -käyttöliittymä tammikuussa 2026.

**Tekninen arkkitehtuuri:**
```
┌──────────────────────────────────────────┐
│  Dashboard V9 (React + TypeScript)       │
│  ┌────────────────────────────────────┐  │
│  │  Käyttöliittymäkomponentit         │  │
│  │  - Portfolio-mittarit (MetricsHeader)
│  │  │  - Projektikortit (ProjectCard)  │  │
│  │  - AI-assistentti (ClimateAssistant)
│  └────────────────────────────────────┘  │
│                 ↕                         │
│  ┌────────────────────────────────────┐  │
│  │  Vercel AI SDK Integration         │  │
│  │  - useChat() -hook                 │  │
│  │  - Streaming-vastaukset            │  │
│  │  - Työkalujen kutsuminen           │  │
│  └────────────────────────────────────┘  │
│                 ↕                         │
│  ┌────────────────────────────────────┐  │
│  │  Antropic Claude Sonnet 4          │  │
│  │  - DWS IQ -järjestelmäkehote       │  │
│  │  - Hiilijalanjälkilaskenta (EN 15978)
│  │  - Vaatimustenmukaisuustarkistukset │  │
│  │  - Raporttien generointi           │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

**Teknologiapino:**
- **Frontend:** React 18.3.1 + TypeScript 5.6.2
- **Käännöstyökalu:** Vite 6.0.5
- **AI SDK:** Vercel AI SDK 4.1.10
- **AI-malli:** Anthropic Claude Sonnet 4
- **Tietokanta:** Supabase (reaaliaikaiset tilaukset)
- **Tyylitys:** Tailwind CSS 3.4.17
- **Puheentunnistus:** Web Speech API
- **Puhesynteesi:** Speech Synthesis API

**Keskeiset ominaisuudet:**

1. **Reaaliaikainen portfolio-valvonta**
   - SPI (Schedule Performance Index) -mittarit
   - CPI (Cost Performance Index) -mittarit
   - Hiilijalanjälkiseuranta (EN 15978 -metodologia)
   - Vaatimustenmukaisuusvalvonta (CSRD, EPBD, ETS, CBAM)

2. **AI-pohjainen Climate Assistant**
   - Streaming-keskustelu Claude Sonnet 4:n kanssa
   - Työkalukutsut:
     - Hiilijalanjälkilaskenta
     - Vaatimustenmukaisuustarkistukset
     - Raporttien generointi
   - Luonnollisen kielen kyselyt

3. **Puhevuorovaikutus**
   - Puheesta tekstiksi -syöttö (Web Speech API)
   - Tekstistä puheeksi -lähtö (kädet vapaana -toiminto)
   - Monikielinen tuki
   - Selaintuki: Chrome, Edge, Safari

**Suorituskyky:**
- Nipun koko: ~70KB (gzip-pakattu)
- Alkulataus: ~1,2s
- Aika vuorovaikutukseen: ~1,5s
- Ensimmäinen AI-token: 200-400ms
- Puheentunnistuksen viive: ~200ms

**Yhteys moniagenttiökosysteemiin:**

Dashboard V9 toimii käyttöliittymäkerroksena moniagenttiökosysteemille, mahdollistaen:
- Käyttäjien vuorovaikutuksen AI-agenttien kanssa luonnollisella kielellä
- Reaaliaikaisen näkyvyyden projektidataan Supabasen kautta
- Agenttien työkalujen kutsumisen (hiililaskenta, vaatimusten tarkistus)
- Agenttien tulosten visualisoinnin käyttäjäystävällisessä muodossa

**Toteutuksen edut:**

1. **Kehitysnopeuden parantuminen:** Vercel AI SDK:n käyttö vähensi kehitysaikaa 43% verrattuna mukautettuun toteutukseen
2. **Tyyppiturvallinen:** TypeScript vähentää ajonaikaisia virheitä
3. **Ylläpidettävä:** -47% vuosittaiset ylläpitokustannukset
4. **Laajennettava:** Helppo vaihtaa AI-palveluntarjoajaa (Anthropic → OpenAI → Groq)

**Käyttöönotto:**
```bash
# Tuotantokäännös
cd /home/user/dws6/dws6.com/dashboard/firehorse/v9-react
npm run build

# Käyttöönotto Cloudflare Pages -palveluun
wrangler pages deploy dist --project-name=dws-iq-dashboard-v9
```

**Dokumentaatio:**
- Kenttämuistiinpano: `/docs/field-notes/2026-01-22-dashboard-v9-technical-stack.md`
- README: `/dashboard/firehorse/v9-react/README.md`
- Arviointi: `/docs/evaluation/typescript-react-ai-sdk-evaluation.md`

---

## 6. Arviointi

### 6.1 Mittarit

| Mittari | Kuvaus | Nykyinen arvo |
|---------|--------|---------------|
| Agenttien määrä | Ekosysteemin kokonaisagenttimäärä | 22 |
| Rinnakkaiset vaiheet | Itsenäiset suoritusvaiheet | 4 |
| Signaalityypit | Erilliset signaalikategoriat | 4 |
| Maksimiriippuvuudet | Eniten riippuvuuksia yhdellä agentilla | 3 |

### 6.2 Suorituskykyominaisuudet

- **Signaalin lähetysviive**: <10ms (tiedostopohjainen), <50ms (Supabase-pohjainen)
- **Riippuvuustarkistuksen viive**: <5ms per agentti
- **Tilan pysyvyys**: Välitön (synkroninen tiedostokirjoitus)

### 6.3 Skaalautuvuusnäkökohdat

Nykyinen tiedostopohjainen toteutus soveltuu:
- Kehitysympäristöihin (10-50 agenttia)
- Yksittäisen koordinaattorin käyttöönottoihin

Tuotantomittakaavassa (100+ agenttia) siirtyminen:
- Supabase-reaaliaikatilaukset
- Redis pub/sub korkean taajuuden signaaleille

---

## 7. Aiheeseen liittyvä työ

### 7.1 Moniagenttipohjaiset kehykset

- **LangChain Agents** (Python): Yleiskäyttöinen agenttikehys
- **CrewAI**: Moniagenttiyhteistyömallit
- **AutoGPT**: Autonomiset tekoälyagenttikokeilut
- **Microsoft AutoGen**: Moniagenttipohjaiset keskustelukehykset

### 7.2 Koordinointimallit

- **Julkaise-tilaa**: Tapahtumaohjattu viestintä (vastaa signaalejamme)
- **Työnkulkumoottorit**: Apache Airflow, Prefect (DAG-pohjainen koordinointi)
- **Aktori-malli**: Erlang/Akka-tyylinen viestinvälitys

### 7.3 Teollisuusstandardit

- **MCP (Model Context Protocol)**: Anthropicin standardi tekoälyn työkaluintegraatiolle
- **OpenAPI**: API-määrittely agentti-palvelu-viestintään
- **JSON-LD**: Rakenteellinen data agenttien tietopankeille

---

## 8. Johtopäätökset

### 8.1 Kontribuutiot

Tämä työ esittelee:
1. Käytännöllisen signaalipohjaisen koordinointiprotokollan moniagenttipohjaisille järjestelmille
2. Kolmikategorisen agenttiarkkitehtuurin teollisille tekoälyalustoille
3. Referenssitoteutuksen Node.js CLI:llä ja Python FastAPI:lla
4. Integraatiomallit MCP Hub -orkestraatiokerroksen kanssa

### 8.2 Tuleva työ

1. **Supabase-reaaliaikaintegraatio**: Siirrä signaalit tietokantaan reaaliaikatilauksilla
2. **Hajautettu koordinointi**: Tuki useille hub-käyttöönotoille
3. **Koneoppimisoptimointi**: Ennusta agenttien valmistumisaikoja aikataulutusta varten
4. **Visuaalinen valvonta**: Kojelauta reaaliaikaiseen agenttitilojen visualisointiin

### 8.3 Toistettavuus

Kaikki koodi ja dokumentaatio on saatavilla:
- Repositorio: `https://github.com/blogtheristo/dws6`
- Signaalirekisteri: `.workflows/agents/AGENT_SIGNAL_REGISTRY.json`
- Koordinaattori: `.workflows/agents/coordinator.cjs`
- MCP Hub: `mcp-hub/server.py`

---

## 9. Lähteet

1. **Anthropic MCP Specification** (2024). Model Context Protocol. https://modelcontextprotocol.io
2. **LlamaStack Documentation** (2024). Moniagenttipohjaiset orkestraatiot. https://github.com/meta-llama/llama-stack
3. **Groq API Documentation** (2025). Matalan viiveen päättely. https://groq.com
4. **Supabase Documentation** (2025). PostgreSQL + Reaaliaikainen. https://supabase.com
5. **FastAPI Documentation** (2024). Moderni Python-verkkokehys. https://fastapi.tiangolo.com

---

**Dokumentin versio:** 1.0  
**Viimeksi päivitetty:** 3. tammikuuta 2026  
**Akateeminen konteksti:** Metropolia Ammattikorkeakoulu  
**Opinnäytetyön ohjaaja:** [Määritettävä]

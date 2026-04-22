# Industrial Specialist Agent Architecture — DWS IQ 6/7

> **Industrial Specialist Agent** — industry-scoped AI agent that extends the base Athena EU-compliance
> layer with sector-specific knowledge (steel, cement, chemicals, construction, datacentres, ...).
> Internally the code names are borrowed from Greek-Roman mythology (Apollo, Mercury, Juno, Neptune,
> ...) — a common convention in IT services. Formerly branded "Godagent"; see § Terminology.

---

VERSION AND AGENT HISTORY

Version: 1.3
Created: 2026-03-15
Updated: 2026-04-22
Author: Claude Opus 4.6 (wonderful-gould session); Claude Opus 4.7 (rename-godagents-skilled-dXqBs)
Reviewed by: Boardy (cranky review received 2026-03-15)
Status: REVIEWED — Boardy feedback incorporated v1.2; DWS Skilled Taxonomy added v1.3
Introduced-In: claude/rename-godagents-skilled-dXqBs (v1.3 Terminology section)

Changes v1.3 (2026-04-22):

- Doc title renamed: "Godagent Architecture" → "Industrial Specialist Agent Architecture"
- Added canonical "Terminology — DWS Skilled Taxonomy" section at top (source of truth for CLAUDE.md "DWS Skilled Taxonomy Rule")
- Three-tier pattern codified: `Skilled <Axis>` / `Industrial Specialist <Axis>` / `Industry <Axis>`
- Three active axes: Agents, Workflows, Jurisdictions (EU / US / Aiwen)
- Count-dynamism patterns (open-ended `18+`, registry-anchored, product-scoped)
- Scope exclusions preserved: Docker infrastructure identifiers (`dws-godagent-llm`, `dws-godagent:latest`, label `dws-godagent`) in §§ 2.4–2.6 are NOT renamed — that is a coordinated infra change, not a doc PR
- Body prose of §§ 1–7 is migrated incrementally; the Terminology section at top declares deprecation authoritatively
- Cross-references: V3Thesis_EN/FI §10.22 · PHD_FIREHORSE_EN/FI §14.17

Changes v1.2 (Boardy review):

- Docker hardening: seccomp profile, --cap-drop ALL, read-only rootfs
- LLM strategy: single primary (Qwen 2.5 72B) + Claude fallback, specialist Enterprise-only
- Hash chain audit: tamper-evident Article 12 compliance
- KYA: behavioral sandbox test, version pinning, revocation mechanism
- Container lifecycle: destroy() retry 3x, zombie tracking, 5min cleanup cron, GDPR alert
- Network: custom bridge dws-godagent-llm, no internet for Godagent containers
- VRAM: max 2 models concurrent, LRU eviction, Qwen always-loaded
- Scope: 10 shipped + 10 roadmap 2027
- Flora merged into Ceres (sub-domain prompts)

Changes v1.1:

- Renamed "Deputy Agent" → "Godagent" (branding decision)
- Replaced OpenSandbox → Docker + Dockerode (simplification)
- Clarified naming: not gods, just common IT service names from classical heritage

---

## Terminology — DWS Skilled Taxonomy (Canonical)

_This section is the canonical glossary for the DWS Skilled Taxonomy Rule (CLAUDE.md). Any agent-, workflow-, or jurisdiction-facing copy in the repository must be consistent with the tiers defined here. Body prose in §§ 1–7 is being migrated incrementally; where the old "Godagent" label still appears, treat it as deprecated and map to the appropriate tier per this section._

### Three-Tier Pattern

DWS brand, specification, and UI copy follow a single three-tier pattern that generalises across every capability axis where DWS offers depth. The pattern is:

```
Skilled <Axis>                 ← BRAND   (what we SELL)
    └─ Industrial Specialist <Axis>    ← SPEC    (what they ARE)
            └─ Industry <Axis>         ← UI      (how we LIST them)
```

### Three Active Axes (April 2026)

| Tier    | **Agents**                   | **Workflows**                                                       | **Jurisdictions**                     |
| ------- | ---------------------------- | ------------------------------------------------------------------- | ------------------------------------- |
| 1 Brand | Skilled Agents               | Skilled Autonomous Workflows                                        | Skilled Jurisdictions (EU, US, Aiwen) |
| 2 Spec  | Industrial Specialist Agents | Specialist Workflows (long-form: _Industrial Specialist Workflows_) | Regulatory Specialist Jurisdictions   |
| 3 UI    | Industry Agents              | Industrial Workflows                                                | Jurisdictions                         |

- **Agents.** Industry-scoped AI agents that extend the base Athena EU-compliance layer with sector-specific knowledge. The registry is § 3 of this document.
- **Workflows.** Deterministic compositions of agents triggered by schedule or event. "Autonomous" appears in the brand tier because workflows execute without a human in the loop; agents have it implied.
- **Jurisdictions.** The regulatory surfaces the platform is skilled in — currently EU (AI Act, GDPR, CBAM, ETS, CSRD, ESRS, EPBD), US, and Aiwen (see `docs/CLOUD_ENVIRONMENTS.md` for data-residency architecture). "Regulatory" appears in the spec tier because a jurisdiction is defined by its regulatory surface, not its geography alone.

### Workflow Mechanism Descriptors (Spec-Tier Only)

Within the **Specialist Workflows** tier, three mechanism descriptors distinguish how a workflow executes. These are adjectives for the spec register — **not** new brand-tier nouns. Brand copy always stays on _"Skilled Autonomous Workflows"_.

| Descriptor       | Meaning                                                                                  | Example implementation    |
| ---------------- | ---------------------------------------------------------------------------------------- | ------------------------- |
| **Orchestrated** | Central coordinator, durable state, DAG or state-machine execution. **Default for DWS.** | Temporal.io + Atlas + MCP |
| **Reactive**     | Event-driven via pub/sub on the event bus; no central coordinator.                       | Internal event bus        |
| **Chained**      | Linear skill invocations; no durable state; fire-and-forget.                             | MCP tool chain            |

Use the descriptor in architecture prose and SLA text (e.g., _"Climate Intelligence ships orchestrated Industrial Specialist Workflows durably coordinated by Temporal.io"_). Do **not** hoist "Orchestrated" to brand tier — it describes the how, not the what.

### Pattern for New Axes

When DWS adds a new capability axis (e.g., Datasets, Models, Regulations, Reports), name it `Skilled <Axis>` / `Industrial Specialist <Axis>` / `Industry <Axis>` and add a column to the table above. Parallel brand words are disallowed; the pattern is deliberately monotone to prevent the register-conflation problem that the deprecated "Godagent" label caused.

### Counts Are Dynamic

The number of agents, workflows, or jurisdictions in each tier shifts over time. Never hardcode a fixed brand number. Three acceptable patterns:

1. **Open-ended** (preferred for platform copy): `18+ Skilled Agents`; the `+` absorbs growth.
2. **Registry-anchored** (docs/specs): "see § 3 of this document"; no number in prose.
3. **Product-scoped** (SKU copy only): `Climate Intelligence ships with 8 Skilled Agents`; precise but MUST be updated if the SKU's agent list changes. Treat the count as part of the SKU spec in `products.json`, not free-floating copy.

### Scope Exclusions — Do NOT Rename

Three scopes are explicitly excluded from the "Godagent" deprecation. These remain unchanged:

- **Docker / infrastructure identifiers.** `dws-godagent-llm` (Docker network), `dws-godagent:latest` (Docker image), `dws-godagent` (Docker label), and the iptables rules described in §§ 2.4–2.6 remain unchanged. Renaming these requires a coordinated infra migration, not a documentation change.
- **Pantheon "God Agents" brand** (two words). `onelifetime.world` Pantheon storyboard, Greek-mythology agent characters (Zeus, Athena, ...). Distinct brand identity; not in scope.
- **Historical records.** Field notes, `Learn/tuntikirjausraportti*`, `Learn/Oppimispäiväkirja*`, dated folders under `docs/010825_310726/`. Point-in-time records are not retroactively edited.

### Register Discipline — Where Each Tier Applies

| Surface                                                                                                     | Correct tier                                |
| ----------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| Hero copy, `<title>`, `<meta og:title / og:description>`, investor decks, `brand:` field in `products.json` | Brand                                       |
| Architecture prose, regulatory responses, SLA/contract text, glossary first-mention                         | Spec (define once, then shorten to UI tier) |
| Nav menus, filter chips, count badges (`18+ Industry Agents`), registry column headers, tables              | UI                                          |

### Cross-References

- CLAUDE.md "DWS Skilled Taxonomy Rule" (the enforced rule — this section is its canonical glossary)
- V3Thesis_EN/FI § 10.22 (research framing)
- PHD_FIREHORSE_EN/FI § 14.17 (operations-model implications)
- `docs/field-notes/2026-04-16-anthropic-skills-paradigm-stop-building-agents.md` (motivation: Anthropic Skills paradigm validation)

---

## 1. Executive Summary

DWS IQ palvelee 10 teollisuustoimialaa (shipped) + 10 roadmap 2027. Jokainen toimiala on erityispiirteinen: eri regulaatiot, eri paastokertoimet, eri CN-koodit, eri kynnysarvot. Tama arkkitehtuuri kuvaa:

1. **Godagent-malli** — toimialakohtaiset erikoisagentit, jotka laajentavat perus-Athena-compliancea toimialakohtaisella osaamisella
2. **Docker-isolaatio** — jokainen toimiala ja asiakas hardened Docker-kontissa (seccomp, cap-drop ALL, read-only rootfs)
3. **Yhtenaistetty LLM-strategia** — Qwen 2.5 72B primary kaikille, Claude fallback, specialist Enterprise-only
4. **Yrityskohtainen Compliance Team** — Athena + Godagent + BYO-agentit yritysasiakkaalle
5. **Tamper-evident audit** — Aiven PostgreSQL hash chain -auditkerros (EU AI Act Article 12)
6. **Container lifecycle** — destroy() retry, zombie tracking, orphan cleanup (GDPR-compliant)

---

## 2. Arkkitehtuuriperiaatteet

### 2.1 Brain-Memory-Body-Hands + Godagent Layer

```
                    ┌─────────────────────────────────────┐
                    │        Atlas (Orchestrator)          │
                    │   Situation Room — Executive Summary │
                    └───────────────┬─────────────────────┘
                                    │
                    ┌───────────────┴─────────────────────┐
                    │        Athena (EU Compliance)        │
                    │   Perus-CSRD/ETS/CBAM/Fit for 55    │
                    └───────────────┬─────────────────────┘
                                    │
        ┌───────────┬───────────┬───┴───┬───────────┬───────────┐
        │           │           │       │           │           │
   ┌────┴────┐ ┌────┴────┐ ┌───┴───┐ ┌─┴──┐  ┌────┴────┐ ┌───┴────┐
   │ Vulcan  │ │  Mars   │ │Helios │ │Gaia│  │Neptune  │ │ Ceres  │
   │ Steel   │ │Construc.│ │Energy │ │Auto│  │Maritime │ │  Agri  │
   │ GODAGENT│ │GODAGENT │ │GODAGENT││GOD.│  │GODAGENT │ │GODAGENT│
   └────┬────┘ └────┬────┘ └───┬───┘ └─┬──┘  └────┬────┘ └───┬────┘
        │           │          │       │          │           │
   ┌────┴────────────┴──────────┴───────┴──────────┴───────────┴────┐
   │        Docker Isolation Layer (Dockerode, per tenant)          │
   │         Acer Veriton GN-100 / Cloud Run (Stage 2+)             │
   └────────────────────────────────────────────────────────────────┘
```

### 2.2 Ydinperiaatteet

| #   | Periaate                           | Toteutus                                                                                |
| --- | ---------------------------------- | --------------------------------------------------------------------------------------- |
| 1   | **Yksi Control Room per toimiala** | Godagent = toimialan Control Room. Vain yksi per toimiala.                              |
| 2   | **Yksi Situation Room**            | Atlas-orchestrator kokoaa kaikkien godagenttien tulokset yhdeksi executive-raportiksi   |
| 3   | **Compliance-delegointi**          | Jokainen godagent kutsuu Athenaa perus-EU-regulaatioihin; lisaa oman sektorikerroksensa |
| 4   | **Ephemeral container**            | Jokainen suoritus tapahtuu uudessa Docker-kontissa → tuhotaan → ei datajaamaa           |
| 5   | **Tenant-isolaatio**               | NCC:n data EI nay SSAB:lle. Konttitason eristys.                                        |
| 6   | **Yksi primary LLM**               | Qwen 2.5 72B kaikille, Claude fallback, specialist override vain Enterprise-tier        |
| 7   | **BYO-agentit A2A:lla**            | Asiakkaan omat agentit liitetaan Agent-to-Agent -protokollalla                          |
| 8   | **Tamper-evident audit**           | Hash chain audit: jokainen rivi SHA-256 edellisesta → ketju katkeaa jos muokataan       |
| 9   | **Container lifecycle**            | destroy() retry 3x → zombie-tila → 5min cleanup cron → GDPR alert threshold             |

### 2.3 Miksi Docker + Dockerode, ei OpenSandboxia

Alkuperainen suunnitelma kaytti Alibaban OpenSandboxia (REST wrapper Dockerin paalle). Paatos korvata pelkalla Dockerilla:

| Kriteeri        | OpenSandbox            | Docker + Dockerode          |
| --------------- | ---------------------- | --------------------------- |
| Community       | Niche, pieni           | Valtava, vakaa              |
| Yllapitoriski   | Alibaba voi lopettaa   | Docker Inc. ei lopeta       |
| Riippuvuudet    | +1 palvelu (8080)      | Docker Engine riittaa       |
| Toiminnallisuus | REST API kontteihin    | Dockerode = sama REST API   |
| Turvallisuus    | Vaatii Docker socket   | Sama — Docker socket        |
| Monimutkaisuus  | +1 kontti pyoritettava | ~200 riviä Dockerode-koodia |

**Paatos:** `src/sandbox/opensandbox.ts` korvataan `src/sandbox/dockerode.ts`:lla. Sama API-pinta, suora Docker-yhteys.

### 2.4 Docker Hardening (Boardy #1)

Jokainen Godagent-kontti luodaan nailla turva-asetuksilla:

```typescript
await docker.createContainer({
  Image: `dws-godagent:latest`,
  HostConfig: {
    // Boardy #1: Security hardening
    SecurityOpt: ["no-new-privileges", "seccomp=default"],
    CapDrop: ["ALL"], // Drop ALL Linux capabilities
    ReadonlyRootfs: true, // Immutable filesystem
    // Resource limits (set at create, not after)
    Memory: 512 * 1024 * 1024, // 512Mi default
    CpuQuota: 100000, // 1 CPU
    // Network: custom bridge, only LLM access
    NetworkMode: "dws-godagent-llm",
    // LWM model read-only
    Binds: ["/opt/dws6/models/lwm:/models/lwm:ro"],
  },
  Labels: {
    "dws-godagent": "true",
    "dws-tenant": tenantId,
    "dws-agent": agentName,
    "dws-created": new Date().toISOString(),
  },
});
```

### 2.5 Container Lifecycle & Zombie Management (Boardy #5)

```
┌─────────────────────────────────────────────────────────────────┐
│  Container Lifecycle — GDPR-compliant destroy                   │
│                                                                 │
│  1. container.remove({ force: true })                          │
│     ├── Success → done, log to Aiven PG                        │
│     └── Failure → retry (max 3x, 2s backoff)                  │
│           ├── Success → done                                    │
│           └── All 3 failed → mark ZOMBIE                       │
│                 │                                               │
│  2. ZOMBIE state:                                               │
│     - container_id + tenant_id logged to zombie_containers      │
│     - All exec() calls blocked for this container              │
│     - Alert fired if zombie count > ZOMBIE_THRESHOLD (default 3)│
│     - GDPR clock starts: data must be purged within 1 hour     │
│                                                                 │
│  3. Cleanup cron (every 5 minutes):                             │
│     docker container prune -f --filter label=dws-godagent      │
│     + SELECT * FROM zombie_containers WHERE resolved = false    │
│     + Attempt remove again → if success, mark resolved          │
│     + If still stuck after 1 hour → CRITICAL ALERT + manual    │
│                                                                 │
│  4. Metrics:                                                    │
│     - zombie_container_count (gauge)                            │
│     - container_destroy_failures_total (counter)                │
│     - container_destroy_retry_count (histogram)                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.6 Network Isolation (Boardy #5 — network)

```
┌─────────────────────────────────────────────────────────────┐
│  Network: dws-godagent-llm (custom bridge)                  │
│                                                             │
│  ALLOWED:                                                   │
│    Godagent container → ollama:11434 (LLM inference)        │
│    Godagent container → litellm:4000 (LLM proxy)            │
│                                                             │
│  BLOCKED:                                                   │
│    Godagent container → internet (ANY)                       │
│    Godagent container → aiven-pg:5432 (host writes logs)    │
│    Godagent container → other Godagent containers            │
│                                                             │
│  iptables:                                                  │
│    -A FORWARD -i dws-godagent-llm -d ollama -p tcp          │
│      --dport 11434 -j ACCEPT                                │
│    -A FORWARD -i dws-godagent-llm -d litellm -p tcp         │
│      --dport 4000 -j ACCEPT                                 │
│    -A FORWARD -i dws-godagent-llm -j DROP                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Godagent Registry — 10 Shipped + 10 Roadmap 2027

### 3.1 SHIPPED — 10 Godagentit (tuotannossa / toteutettavissa)

Sijainti: `src/agents/workflow/industry/`

LLM-strategia (Boardy #2): **Qwen 2.5 72B** primary kaikille. Claude Haiku 4.5 fallback.
Specialist override (DeepSeek, Mistral, Gemma) vain Enterprise-tier asiakkaille.

| #   | Godagent       | Toimiala                 | Avainregulaatio                         | LLM          | Tiedosto              | Status  |
| --- | -------------- | ------------------------ | --------------------------------------- | ------------ | --------------------- | ------- |
| 1   | **Vulcan**     | Steel & Metals           | ETS Phase 4, CBAM CN 72xx               | Qwen 2.5 72B | `vulcan.agent.ts`     | DONE    |
| 2   | **Mars**       | Construction & Buildings | EPBD recast, EN 15978, CPR              | Qwen 2.5 72B | `mars.agent.ts`       | DONE    |
| 3   | **Helios**     | Energy & Utilities       | RED III, ETS, capacity mechanisms       | Qwen 2.5 72B | `helios.agent.ts`     | DONE    |
| 4   | **Gaia**       | Automotive & Transport   | CO2 fleet standards, Euro 7             | Qwen 2.5 72B | `gaia.agent.ts`       | DONE    |
| 5   | **Neptune**    | Maritime & Shipping      | FuelEU Maritime, ETS maritime           | Qwen 2.5 72B | `neptune.agent.ts`    | DONE    |
| 6   | **Ceres**      | Agriculture & Forestry   | CAP, LULUCF, Scope 3, soil carbon       | Qwen 2.5 72B | `ceres.agent.ts`      | DONE    |
| 7   | **Prometheus** | Cement & Concrete        | ETS (highest benchmark), CBAM           | Qwen 2.5 72B | `prometheus.agent.ts` | DONE    |
| 8   | **Diana**      | Healthcare & Pharma      | CSRD ESRS S1, laakeketju GMP            | Qwen 2.5 72B | `diana.agent.ts`      | TODO P1 |
| 9   | **Minerva**    | Chemicals                | REACH, CBAM CN-koodit, Seveso III       | Qwen 2.5 72B | `minerva.agent.ts`    | TODO P1 |
| 10  | **Silvanus**   | Pulp & Paper             | ETS, kestavan metsatalouden sert., EUDR | Qwen 2.5 72B | `silvanus.agent.ts`   | TODO P1 |

**Ceres** kattaa myos entisen Floran toimialueen (Boardy #8). Sub-domain promptit:

- `ceres.mode = 'forestry'` — metsatalous, LULUCF, hiilinielu
- `ceres.mode = 'crops'` — peltoviljelyt, CAP-tuet, typpipaastot
- `ceres.mode = 'livestock'` — kotielaimet, metaani, NFR
- `ceres.mode = 'soil-carbon'` — maaperan hiili, carbon farming

### 3.2 ROADMAP 2027 — 10 Godagentit (ei toteuteta viela)

Boardy #7: "Sijoittaja joka katsoo 13 puuttuvaa deputya nakee scope creep, ei ambition."

| #   | Godagent       | Toimiala                   | Avainregulaatio                      | Aikataulu |
| --- | -------------- | -------------------------- | ------------------------------------ | --------- |
| 11  | **Demeter**    | Food & Beverage            | LULUCF, packaging DPP, EUDR          | Q1 2027   |
| 12  | **Terminus**   | Real Estate & Property     | EPBD, EPC-luokat, EU Taxonomy Art. 8 | Q1 2027   |
| 13  | **Arachne**    | Textiles & Fashion         | Digital Product Passport (DPP), ESPR | Q2 2027   |
| 14  | **Pluto**      | Mining & Minerals          | ETS, CBAM raaka-aineet, CRM Act      | Q2 2027   |
| 15  | **Aqua**       | Water & Wastewater         | WFD, Urban Wastewater Directive      | Q2 2027   |
| 16  | **Hermes**     | Logistics & Supply Chain   | CSRD Scope 3, CBAM transit           | Q3 2027   |
| 17  | **Hephaestus** | Electronics & ICT          | RoHS, WEEE, Ecodesign ESPR           | Q3 2027   |
| 18  | **Aeolus**     | Aviation                   | EU ETS aviation, CORSIA, SAF mandate | Q3 2027   |
| 19  | **Vesta**      | District Heating & Cooling | EED, RED III, waste heat recovery    | Q4 2027   |
| 20  | **Flora**      | ~~Agriculture (extended)~~ | ~~Merged into Ceres~~                | CANCELLED |

**Flora on poistettu.** Ceres kattaa kaiken maatalouden sub-domain prompteilla.

---

## 4. Godagent Pattern — BaseAgent Extension

Jokainen godagent noudattaa samaa patternia kuin `vulcan.agent.ts`:

```typescript
// src/agents/workflow/industry/{name}.agent.ts

import { BaseAgent } from '../../base.agent.js';
import type { AgentContext, AgentResponse } from '../../types.js';

// 1. SOUL-identiteetti — toimialakohtainen system prompt
const SOUL = `You are {Name}, {Industry} Specialist for Climate IQ.
{Regulaatiovakiot ja toimialakohtaiset parametrit}
Output as JSON: { ...sektorispesifi output schema }`;

// 2. Toimialakohtaiset vakiot
const INDUSTRY_EMISSION_FACTORS = { /* ... */ };
const INDUSTRY_CN_CODES = [ /* ... */ ];
const INDUSTRY_THRESHOLDS = { /* ... */ };

export class {Name}Agent extends BaseAgent {
  constructor() {
    super({
      name: '{name}',            // kebab-case
      description: '{kuvaus}',
      capabilities: ['{cap-1}', '{cap-2}', ...],
      model: '{ehdokas-llm}',   // LiteLLM reitittaa oikeaan malliin
    });
  }

  async execute(context: AgentContext, input: Record<string, unknown>): Promise<AgentResponse> {
    const startTime = Date.now();

    // 3. Compliance-delegointi — kutsuu Athenaa
    const { agentRegistry } = await import('../../index.js');
    const complianceResult = await agentRegistry.executeAgent('compliance', context, {
      projectId: context.projectId,
      industry: '{toimiala}',
      regulations: ['{reg1}', '{reg2}'],
      currentMeasures: input.currentMeasures,
      annualEmissions: input.annualEmissions,
      importValue: input.importValue,
    });

    // 4. Sektorispesifi paattelykerros
    const sectorMetrics = this.calculateSectorMetrics(input);

    // 5. LLM-synteesi
    const llmResult = await this.callLLM(`${SOUL}\n\n${JSON.stringify(sectorMetrics)}`);

    // 6. JSON-output — ketjutettava
    return {
      agentName: this.config.name,
      result: { ...sectorMetrics, ...JSON.parse(llmResult.content), baseCompliance: complianceResult?.result },
      confidence: 0.85,
      reasoning: '...',
      recommendations: [...],
      metadata: { durationMs: Date.now() - startTime },
    };
  }
}
```

---

## 5. Docker-isolaatio — Acer Veriton GN-100

### 5.1 Arkkitehtuurikuva

```
┌─────────────────────────────────────────────────────────────────┐
│ Acer Veriton GN-100 — NVIDIA GB10 Superchip (128 GB unified)   │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │ NCC/Rakent. │  │ SSAB/Teras  │  │ Fortum/Ener │            │
│  │ Mars agent  │  │ Vulcan agent│  │ Helios agent│            │
│  │ Qwen 2.5 72B│  │ DeepSeek-V3 │  │ DeepSeek-V3 │            │
│  │ + NCC LWM   │  │ + SSAB LWM  │  │ + Fortum LWM│            │
│  │ EPBD, RT-k  │  │ ETS Ph.4    │  │ RED III     │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│   ephemeral        ephemeral        ephemeral                  │
│   --network none   --network none   --network none             │
│                                                                 │
│  NCC:n data EI nay SSAB:lle. SSAB:n data EI nay Fortumille.   │
│                                                                 │
│  ┌──────────────────────────────────────────────────────┐      │
│  │ Shared Infrastructure (ei tenant-dataa)               │      │
│  │  Ollama :11434 │ LiteLLM :4000 │ Open WebUI :3000    │      │
│  │  Aiven PG :5432 │ Langfuse :3100                      │      │
│  └──────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Kontin elinkaari (Dockerode)

```
1. docker.createContainer()  → Ephemeral kontti toimialakohtaisella imagella
                               Image: dws-{industry}:{version}
                               Network: --network none (deny all)
                               Memory: 512Mi-2Gi

2. container.start()         → LWM mountattu read-only volumena
                               /models/lwm/{tenant}-{industry}-{version}.gguf
                               Malli pysyy host-koneella, ei kopioida konttiin

3. container.exec()          → Input: /input/payload.json
                               Entrypoint: npx tsx agent.ts --input ... --output ...
                               LLM-kutsut: host-verkon kautta Ollama/LiteLLM

4. container.getArchive()    → Output: /output/result.json — strukturoitu JSON
                               Logit → Aiven PostgreSQL agent_executions

5. container.remove()        → Kontti tuhotaan, tiedostojarjestelma poistetaan
                               force: true — ei datajaamaa
                               Auditlog sailyy Aivenissa

6. Orphan cleanup (cron)     → Siivoa kontit joiden remove() epaonnistui
                               docker container prune --filter label=dws-godagent
```

### 5.3 Dockerode-client (korvaa opensandbox.ts)

```typescript
// src/sandbox/dockerode.ts — ~200 riviä vs OpenSandbox-riippuvuus

import Docker from "dockerode";

const docker = new Docker({ socketPath: "/var/run/docker.sock" });

export async function runGodagentInDocker(opts: {
  tenantId: string;
  agentName: string;
  input: Record<string, unknown>;
  image?: string;
  memoryMB?: number;
}): Promise<GodagentResult> {
  const container = await docker.createContainer({
    Image: opts.image ?? `dws-${opts.agentName}:latest`,
    Labels: { "dws-godagent": "true", tenant: opts.tenantId, agent: opts.agentName },
    HostConfig: {
      // Use a dedicated internal Docker network that exposes only LiteLLM/Ollama,
      // so the agent can make LLM HTTP calls without general internet egress.
      NetworkMode: "dws-godagent-llm",
      Memory: (opts.memoryMB ?? 512) * 1024 * 1024,
      ReadonlyRootfs: true, // Boardy baseline: read-only rootfs
      CapDrop: ["ALL"], // Godagent containers are designed to run without Linux capabilities
      SecurityOpt: [
        "no-new-privileges", // Prevent privilege escalation (matches --security-opt no-new-privileges)
        // Seccomp profile must be installed by the platform; this is the minimal profile for agent execution.
        "seccomp=/etc/docker/seccomp.godagent.json",
      ],
      Binds: [
        `/opt/dws6/models/lwm:/models/lwm:ro`, // LWM read-only
      ],
    },
  });

  try {
    await container.start();
    // Write input, exec agent, read output...
    const exec = await container.exec({
      Cmd: ["npx", "tsx", "agent.ts", "--input", "/input/payload.json"],
    });
    // ... collect results
    return result;
  } finally {
    await container.remove({ force: true }).catch(() => {});
  }
}
```

### 5.4 Sandbox stage paivitys

```
SANDBOX_STAGE=docker      # → Acer Veriton / Dockerode (Stage 1.5, uusi)
SANDBOX_STAGE=opensandbox # → Deprecated, redirect to docker
SANDBOX_STAGE=1           # → SDK sandbox (demo)
SANDBOX_STAGE=2           # → Cloud Run (tuotanto)
```

### 5.5 Yhtenaistetty LLM-strategia (Boardy #2)

Boardy: "Viisi eri mallia tarkoittaa viisi eri failure modea. Yksi primary malli."

| Tier                    | LLM               | Kayttotarkoitus                   | VRAM     |
| ----------------------- | ----------------- | --------------------------------- | -------- |
| **Primary (kaikki)**    | Qwen 2.5 72B Q4   | Kaikki godagentit, aina ladattuna | ~40GB    |
| **Fallback (pilvi)**    | Claude Haiku 4.5  | Kun Qwen ei riita tai on down     | 0 (API)  |
| **Enterprise override** | Asiakkaan valinta | NCC haluaa DeepSeek BIM:lle       | +30-40GB |

**VRAM-budjetti (Boardy #6):** GB10 = 128GB unified.

- Qwen 2.5 72B Q4: ~40GB (aina ladattuna)
- 1x tenant LWM: ~10-30GB (on-demand, LRU eviction)
- Headroom: ~58-78GB
- Max 2 mallia samanaikaisesti. Queue muut. Reload latency ~30-60s.
- DeepSeek-V3 671B poistettu ehdokaslistalta (mahdoton GB10:lla Q4:nakaan)

Enterprise-asiakkaille joilla on oma Veriton tai Cloud Run A100:
specialist-mallit (DeepSeek, Mistral, Gemma EU-hosted) ovat mahdollisia.

### 5.6 LiteLLM Routing Configuration

LiteLLM toimii proxy-kerroksena, joka reitittaa pyynnot oikeaan malliin:

```yaml
# config/litellm-config.yaml (Acer Veriton GN-100)
# Boardy #2: Single primary model for all industries
model_list:
  # PRIMARY — Qwen 2.5 72B for ALL godagents (always loaded)
  - model_name: "godagent/primary"
    litellm_params:
      model: "ollama/qwen2.5:72b"
      api_base: "http://ollama:11434"
    model_info:
      metadata:
        role: "primary"
        always_loaded: true

  # FALLBACK — Claude API (cloud, when local is down)
  - model_name: "godagent/fallback"
    litellm_params:
      model: "anthropic/claude-haiku-4-5-20251001"
      api_key: "os.environ/ANTHROPIC_API_KEY"

  # ENTERPRISE OVERRIDES — only for paying Enterprise-tier tenants
  # Uncomment per tenant contract:
  # - model_name: "enterprise/ncc-construction"
  #   litellm_params:
  #     model: "ollama/deepseek-v3"
  #     api_base: "http://ollama:11434"

# Routing rules
router_settings:
  routing_strategy: "usage-based-routing-v2"
  num_retries: 2
  timeout: 120
  allowed_fails: 3
  fallbacks:
    - "industry/*": ["fallback/claude"]

# Langfuse logging — Article 12 audit trail
litellm_settings:
  success_callback: ["langfuse"]
  failure_callback: ["langfuse"]
  langfuse_public_key: "os.environ/LANGFUSE_PUBLIC_KEY"
  langfuse_secret_key: "os.environ/LANGFUSE_SECRET_KEY"
  langfuse_host: "os.environ/LANGFUSE_HOST"

# Rate limiting per tenant
general_settings:
  master_key: "os.environ/LITELLM_MASTER_KEY"
  max_budget: 100 # EUR per month
  budget_duration: "30d"
```

---

## 6. Docker Compose — Godagent Stack (Acer Veriton GN-100)

```yaml
# docker-compose.godagent.yml
version: "3.9"

services:
  # ── Ollama — Lokaali LLM inference ────────────────────────────
  ollama:
    image: ollama/ollama:latest
    container_name: dws-ollama
    ports: ["11434:11434"]
    volumes:
      - ollama-models:/root/.ollama
      - ./models/lwm:/models/lwm:ro # Yrityskohtaiset LWM-mallit (read-only)
    deploy:
      resources:
        reservations:
          devices:
            - capabilities: [gpu]
    restart: unless-stopped

  # ── LiteLLM — Multi-model proxy + routing ─────────────────────
  litellm:
    image: ghcr.io/berriai/litellm:main-latest
    container_name: dws-litellm
    ports: ["4000:4000"]
    environment:
      - LITELLM_MASTER_KEY=${LITELLM_MASTER_KEY}
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - LANGFUSE_PUBLIC_KEY=${LANGFUSE_PUBLIC_KEY}
      - LANGFUSE_SECRET_KEY=${LANGFUSE_SECRET_KEY}
      - LANGFUSE_HOST=${LANGFUSE_HOST:-http://langfuse:3100}
    volumes:
      - ./config/litellm-config.yaml:/app/config.yaml:ro
    command: ["--config", "/app/config.yaml"]
    depends_on: [ollama]
    restart: unless-stopped

  # ── Aiven PostgreSQL (lokaali) — Audit + metadata ─────────────
  aiven-pg:
    image: postgres:16-alpine
    container_name: dws-aiven-pg
    ports: ["5432:5432"]
    environment:
      - POSTGRES_USER=dws_agent
      - POSTGRES_PASSWORD=${AIVEN_PG_PASSWORD}
      - POSTGRES_DB=dws_agents
    volumes:
      - aiven-pg-data:/var/lib/postgresql/data
      - ./supabase/migrations/030_agent_logging_tables.sql:/docker-entrypoint-initdb.d/01-agent-tables.sql:ro
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U dws_agent -d dws_agents"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  # ── Open WebUI — Kehitys ja testaus UI ─────────────────────────
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    container_name: dws-open-webui
    ports: ["3000:8080"]
    environment:
      - OLLAMA_BASE_URL=http://ollama:11434
    depends_on: [ollama]
    restart: unless-stopped

  # ── Langfuse — LLM observability (Article 12) ─────────────────
  langfuse:
    image: langfuse/langfuse:latest
    container_name: dws-langfuse
    ports: ["3100:3000"]
    environment:
      - DATABASE_URL=postgresql://dws_agent:${AIVEN_PG_PASSWORD}@aiven-pg:5432/dws_agents
      - NEXTAUTH_SECRET=${LANGFUSE_NEXTAUTH_SECRET}
      - NEXTAUTH_URL=http://localhost:3100
      - SALT=${LANGFUSE_SALT}
    depends_on:
      aiven-pg:
        condition: service_healthy
    restart: unless-stopped

  # ── Orphan Container Cleanup (cron) ────────────────────────────
  cleanup:
    image: docker:cli
    container_name: dws-cleanup
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    entrypoint: /bin/sh
    command: >
      -c "while true; do
        echo '[cleanup] Pruning orphan godagent containers...';
        docker container prune -f --filter label=dws-godagent;
        sleep 3600;
      done"
    restart: unless-stopped

volumes:
  ollama-models:
  aiven-pg-data:

networks:
  default:
    name: dws-godagent-net
```

**Huom:** Ei enaa OpenSandbox-palvelua. Docker Engine + Dockerode hoitaa kontti-isolaation suoraan.

---

## 7. Aiven PostgreSQL — Audit & Metadata

### 7.1 Miksi Aiven lokaalisti

Aiven PostgreSQL ajetaan lokaalisti Docker-kontissa Stage 1.5:ssa. Tuotannossa (Stage 2+) siirrytaan Aiven-hallittuun palveluun (EU-region):

| Stage        | Aiven-toteutus                     | Sijainti                          |
| ------------ | ---------------------------------- | --------------------------------- |
| 1.5 (dev)    | `postgres:16-alpine` Docker-kontti | Acer Veriton GN-100               |
| 2 (tuotanto) | Aiven for PostgreSQL (managed)     | `google-europe-north1` (Helsinki) |
| 3 (scale)    | Aiven for PostgreSQL + pgvector    | `google-europe-north1`            |

### 7.2 Agent-taulut

```sql
-- Aiven PostgreSQL schema: godagent isolation & audit
-- Source of truth for CURRENT agent_executions schema:
-- supabase/migrations/030_agent_logging_tables.sql

-- Agent execution log (Article 12 compliance) - CURRENT
-- Note: current repo migration uses uuid-ossp uuid_generate_v4(), not gen_random_uuid().
CREATE TABLE IF NOT EXISTS agent_executions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_name TEXT NOT NULL,
    user_id UUID NOT NULL,
    org_id UUID NOT NULL,
    session_id TEXT NOT NULL,
    project_id TEXT NOT NULL,
    input JSONB DEFAULT '{}'::jsonb,
    output JSONB,
    status TEXT NOT NULL CHECK (status IN ('started', 'completed', 'error')),
    error_message TEXT,
    duration_ms INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Planned extensions (NOT in migration 030; add via a dedicated future migration)
-- Boardy #3 tamper-evident trail + sandbox metadata:
--   container_id TEXT
--   sandbox_stage TEXT
--   llm_model TEXT
--   llm_tokens_in INTEGER
--   llm_tokens_out INTEGER
--   tenant_isolated BOOLEAN DEFAULT true
--   previous_hash TEXT
--   row_hash TEXT

-- Boardy #5: Zombie container tracking (GDPR compliance)
CREATE TABLE IF NOT EXISTS zombie_containers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    container_id TEXT NOT NULL,
    tenant_id TEXT NOT NULL,
    agent_name TEXT NOT NULL,
    destroy_attempts INTEGER DEFAULT 0,
    first_failed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_attempt_at TIMESTAMPTZ,
    resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMPTZ,
    gdpr_deadline TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '1 hour'),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Agentic loop iterations (multi-step reasoning audit)
CREATE TABLE IF NOT EXISTS agent_loop_iterations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_name TEXT NOT NULL,
    user_id TEXT,
    org_id TEXT,
    session_id TEXT,
    project_id TEXT,
    iterations JSONB NOT NULL,
    iteration_count INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Governance audit log
CREATE TABLE IF NOT EXISTS governance_audit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMPTZ NOT NULL,
    agent_name TEXT NOT NULL,
    user_id TEXT,
    org_id TEXT,
    policies_checked INTEGER,
    policies_passed INTEGER,
    policies_failed INTEGER,
    blocked BOOLEAN DEFAULT false,
    details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tenant LWM (Lifetime World Model) registry
CREATE TABLE IF NOT EXISTS tenant_lwm_models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id TEXT NOT NULL,
    industry TEXT NOT NULL,
    model_name TEXT NOT NULL,        -- e.g. 'ncc-lwm-construction-v2.3'
    model_path TEXT NOT NULL,        -- e.g. '/models/lwm/ncc-lwm-construction-v2.3.gguf'
    base_model TEXT NOT NULL,        -- e.g. 'qwen2.5-coder:32b'
    version TEXT NOT NULL,
    fine_tuned_on TIMESTAMPTZ,
    training_dataset_hash TEXT,      -- SHA-256 of training data
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(tenant_id, industry, version)
);

-- BYO agent registry (customer-provided agents)
CREATE TABLE IF NOT EXISTS byo_agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id TEXT NOT NULL,
    agent_name TEXT NOT NULL,
    agent_url TEXT NOT NULL,          -- A2A endpoint
    protocol TEXT NOT NULL DEFAULT 'a2a',  -- 'a2a' | 'mcp'
    capabilities TEXT[],
    kya_approved BOOLEAN DEFAULT false,   -- Know Your Agent approval
    kya_approved_at TIMESTAMPTZ,
    kya_approved_by TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(tenant_id, agent_name)
);

-- RLS: every table is tenant-isolated
ALTER TABLE agent_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_loop_iterations ENABLE ROW LEVEL SECURITY;
ALTER TABLE governance_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_lwm_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE byo_agents ENABLE ROW LEVEL SECURITY;

-- TODO: Define explicit RLS policies to enforce tenant/org isolation.
-- NOTE: The exact implementation depends on the chosen role + session model.
-- At minimum, policies must ensure:
--   * agent_executions, agent_loop_iterations, governance_audit are isolated by org_id
--   * tenant_lwm_models, byo_agents are isolated by tenant_id
--
-- Example pattern (to be adapted to actual session variables / auth model):
-- CREATE POLICY agent_executions_tenant_isolation ON agent_executions
--     USING (org_id = current_setting('app.current_org_id', true))
--     WITH CHECK (org_id = current_setting('app.current_org_id', true));
--
-- CREATE POLICY tenant_lwm_models_tenant_isolation ON tenant_lwm_models
--     USING (tenant_id = current_setting('app.current_tenant_id', true))
--     WITH CHECK (tenant_id = current_setting('app.current_tenant_id', true));
--
-- Similar per-tenant/org policies must be created for:
--   * agent_loop_iterations
--   * governance_audit
--   * byo_agents

-- Indexes for query performance
CREATE INDEX idx_agent_exec_tenant ON agent_executions(org_id, created_at DESC);
CREATE INDEX idx_agent_exec_agent ON agent_executions(agent_name, created_at DESC);
CREATE INDEX idx_lwm_tenant ON tenant_lwm_models(tenant_id, industry);
CREATE INDEX idx_byo_tenant ON byo_agents(tenant_id);
```

---

## 8. Yrityskohtainen Compliance Team

Jokainen yritysasiakas saa oman Compliance Team -kokoonpanon:

### 8.1 NCC (rakennusala) — esimerkki

```
NCC Compliance Team
├── Athena (EU Compliance)             ─── Perus-CSRD/ETS/CBAM analyysi
├── Mars (Construction Godagent)       ─── EPBD, EN 15978, RT-kortisto
├── NCC Procurement Agent (BYO)        ─── NCC:n oma hankinta-AI
├── NCC Safety Agent (BYO)             ─── NCC:n tyoturvallisuus-AI
├── NCC BIM Agent (BYO)                ─── Tekla Structures -integraatio
└── Atlas (Orchestrator)               ─── Koostaa kaiken executive-raportiksi
```

### 8.2 SSAB (teras) — esimerkki

```
SSAB Compliance Team
├── Athena (EU Compliance)             ─── Perus-CSRD/ETS/CBAM analyysi
├── Vulcan (Steel Godagent)            ─── ETS Phase 4, CBAM CN 72xx, BF vs EAF
├── SSAB HYBRIT Agent (BYO)            ─── HYBRIT-prosessin paastolaskenta
├── SSAB Procurement Agent (BYO)       ─── Romuraudan saatavuus + hinta
└── Atlas (Orchestrator)               ─── Executive-raportti
```

### 8.3 BYO-agenttien liittaminen

BYO-agentit liitetaan kahdella protokollalla:

| Protokolla                       | Kayttotarkoitus           | Liitynta                           |
| -------------------------------- | ------------------------- | ---------------------------------- |
| **A2A** (Agent-to-Agent)         | Asiakkaan omat agentit    | `/.well-known/agent.json` endpoint |
| **MCP** (Model Context Protocol) | DWS IQ:n sisaiset agentit | `/mcp` endpoint, JSON-RPC 2.0      |

```typescript
// BYO agent discovery (A2A)
interface A2AAgentCard {
  name: string;
  description: string;
  url: string;
  capabilities: string[];
  authentication: {
    type: "bearer" | "api-key" | "oauth2";
  };
  input_schema: JSONSchema;
  output_schema: JSONSchema;
}

// KYA — Know Your Agent (pakollinen ennen aktivointia)
// Boardy #4: behavioral test, version pinning, revocation
interface KYACheck {
  tenantId: string;
  agentName: string;
  agentUrl: string;
  agentVersion: string; // Boardy #4: version pinning
  checks: {
    endpoint_reachable: boolean;
    tls_certificate_valid: boolean;
    eu_data_residency: boolean;
    output_schema_valid: boolean;
    no_pii_in_logs: boolean;
    article_12_logging: boolean;
    // Boardy #4: behavioral sandbox test
    behavioral_test_passed: boolean; // 5 controlled inputs → verify outputs
    behavioral_test_date: string;
  };
  approved: boolean;
  approvedBy: string;
  approvedAt: string;
  // Boardy #4: revocation mechanism
  revocation: {
    revoked: boolean;
    revokedAt?: string;
    revokedBy?: string;
    reason?: string;
  };
}

// Version pinning rule:
// Uusi versio asiakkaan agentista → auto-deactivate → vaatii uuden KYA
// Health check: GET /health joka 5min → ei vastausta → auto-deactivate + alert
```

### 8.4 Compliance Runner

```
┌─────────────────────────────────────────────────────────┐
│  Compliance Runner (per tenant)                         │
│                                                         │
│  1. Vastaanota compliance-pyynto (API / CLI / MCP)      │
│  2. Tunnista toimiala → valitse oikea Godagent          │
│  3. Luo Docker-kontti (Dockerode)                       │
│  4. Lataa tenant LWM (fine-tuned malli, read-only)      │
│  5. Suorita: Athena → Godagent → BYO-agentit            │
│  6. Atlas koostaa executive-raportin                    │
│  7. Tuhoa kontti (force remove)                         │
│  8. Kirjaa Aiven PG:hen (Article 12)                    │
│                                                         │
│  CLI: dws run compliance --tenant ncc --industry constr │
│  API: POST /api/agents/compliance-runner/execute        │
│  MCP: tools/call compliance-runner                      │
└─────────────────────────────────────────────────────────┘
```

---

## 9. Control Room & Situation Room

### 9.1 Control Room (yksi per toimiala)

Jokainen Godagent **on** toimialansa Control Room. Se:

- Vastaanottaa kaikki toimialan compliance-pyynnot
- Yllapitaa toimialan regulaatiotietokantaa (ETS-kertoimet, CN-koodit, kynnysarvot)
- Delegoi perus-compliance Athenalle
- Lisaa sektorispesifin analyysin
- Vastaa toimialan erityiskysymyksiin

```
Control Room: Vulcan (Steel Godagent)
├── ETS Phase 4 free allowance tracker
├── CBAM CN-koodi 72xx carbon content calculator
├── Blast furnace vs EAF pathway comparator
├── Steel-specific CSRD ESRS E1 metrics
└── Scrap availability & recycled content tracker
```

### 9.2 Situation Room (yksi toteutus)

Atlas Orchestrator toimii Situation Roomina — kokoaa kaikkien toimialojen tilannekuvan:

```
Situation Room: Atlas
├── Kaikki toimialat: compliance score dashboard
├── Cross-industry risk correlation (esim. teraksen hinta → rakentamisen kustannus)
├── Regulatory timeline: tulevat deadlinet per toimiala
├── Tenant portfolio health: NCC 87/100, SSAB 72/100, Fortum 91/100
└── Executive weekly digest (Firehorse Report)
```

---

## 10. SSH & Acer Veriton GN-100 Deployment

SSH toimii luotettavasti. Deployment-prosessi:

### 10.1 Initial Setup

```bash
# SSH into Acer Veriton
ssh user@acer-veriton.local

# Clone deployment configs
git clone --depth 1 --branch main git@github.com:blogtheristo/dws6.git /opt/dws6
cd /opt/dws6

# Create .env for Godagent stack
cp .env.godagent.example .env.godagent
# Edit: LITELLM_MASTER_KEY, AIVEN_PG_PASSWORD, ANTHROPIC_API_KEY

# Pull primary LLM model (Boardy #2: single model strategy)
docker compose -f docker-compose.godagent.yml up -d ollama
docker exec dws-ollama ollama pull qwen2.5:72b
# Enterprise overrides (only if contracted):
# docker exec dws-ollama ollama pull deepseek-v3    # NCC BIM
# docker exec dws-ollama ollama pull gemma2:27b      # Healthcare EU-hosted

# Start full stack
docker compose -f docker-compose.godagent.yml up -d

# Verify
curl http://localhost:4000/health    # LiteLLM
curl http://localhost:11434/api/tags # Ollama models
psql -h localhost -U dws_agent -d dws_agents -c "SELECT 1"  # Aiven PG
```

### 10.2 LWM Model Management

```bash
# Upload tenant-specific fine-tuned model
scp ncc-lwm-construction-v2.3.gguf user@acer-veriton.local:/opt/dws6/models/lwm/

# Register in Aiven PG
psql -h localhost -U dws_agent -d dws_agents -c "
INSERT INTO tenant_lwm_models (tenant_id, industry, model_name, model_path, base_model, version)
VALUES ('ncc', 'construction', 'ncc-lwm-construction-v2.3', '/models/lwm/ncc-lwm-construction-v2.3.gguf', 'qwen2.5-coder:32b', '2.3');
"
```

---

## 11. Toteutussuunnitelma — Puuttuvat Godagentit

### 11.1 Prioriteettijarjestys

| Prioriteetti | Godagent   | Toimiala         | Perustelu                                      |
| ------------ | ---------- | ---------------- | ---------------------------------------------- |
| P1           | Diana      | Healthcare       | CSRD ESRS S1 deadline 2026, laakeketju         |
| P1           | Demeter    | Food & Bev       | EUDR deadline 2025-12-30, packaging DPP        |
| P1           | Minerva    | Chemicals        | REACH + CBAM laajennukset 2026                 |
| P2           | Terminus   | Real Estate      | EPBD overlap Marsin kanssa, uudelleenkaytto    |
| P2           | Silvanus   | Pulp & Paper     | EUDR + ETS, Suomen avaintoimiala               |
| P2           | Arachne    | Textiles         | DPP pilotit 2026, EU-hosted LLM                |
| P3           | Pluto      | Mining           | CRM Act 2025, CBAM raaka-aineet                |
| P3           | Aqua       | Water            | WFD paivitykset 2026                           |
| P3           | Flora      | Agriculture ext. | CAP-laajennus, Cereksen rinnalle               |
| P4           | Hermes     | Logistics        | Scope 3, olemassa olevien agentien tukirivisto |
| P4           | Hephaestus | Electronics      | ESPR 2027, RoHS/WEEE                           |
| P4           | Aeolus     | Aviation         | ETS aviation + CORSIA                          |
| P4           | Vesta      | District Heating | EED uudistus                                   |

### 11.2 Toteutus per godagent (~2h per agentti)

```
Per godagent:
1. Luo src/agents/workflow/industry/{name}.agent.ts (Vulcan-pattern)
2. Maarita SOUL prompt + toimialakohtaiset vakiot
3. Rekisteroi src/agents/index.ts
4. Lisaa LiteLLM config: industry/{toimiala} → oikea malli
5. Kirjoita testi: src/__tests__/{name}.agent.test.ts
6. Paivita AGENTS.md Platform Agents -tauluun
```

---

## 12. Boardy Review Checklist

Boardy cranky review 2026-03-15. Kaikki 8 kohtaa kasitelty:

- [x] **#1 Docker hardening**: seccomp, --cap-drop ALL, ReadonlyRootfs, resource limits createContainer:ssa (Section 2.4)
- [x] **#2 LLM-strategia**: Qwen 2.5 72B primary, Claude fallback, specialist Enterprise-only (Section 5.5)
- [x] **#3 Tamper-evident audit**: Hash chain agent_executions-taulussa, logical replication Stage 2+ (Section 7.2)
- [x] **#4 KYA behavioral test**: 5 controlled inputs, version pinning, revocation, health check (Section 8.3)
- [x] **#5 Container lifecycle**: destroy() retry 3x, zombie_containers taulu, 5min cleanup, GDPR 1h deadline (Section 2.5)
- [x] **#5b Network**: Custom bridge dws-godagent-llm, vain Ollama+LiteLLM nakyvat (Section 2.6)
- [x] **#6 VRAM**: Max 2 mallia, Qwen always-loaded, LRU eviction, DeepSeek-V3 poistettu (Section 5.5)
- [x] **#7 Scope**: 10 shipped + 10 roadmap 2027, Flora cancelled (Section 3)
- [x] **#8 Ceres/Flora**: Yhdistetty, Flora poistettu, sub-domain promptit (Section 3.1)

Avoimet kysymykset (Boardy second pass):

- [ ] **Secret rotation**: LiteLLM master key, Aiven PG password — rotaatiostrategia?
- [ ] **LWM versiointi**: Miten hallitaan kun asiakas paivittaa fine-tuned malliaan?
- [ ] **Cost tracking**: LiteLLM budget per tenant — miten toimitaan budjetin ylittyessa?
- [ ] **gVisor Stage 3**: Tarvitaanko gVisor/Firecracker kun siirrytaan multi-tenant Cloud Run:iin?

---

## 13. Ymparistomuuttujat

```bash
# .env.godagent — Acer Veriton GN-100

# Docker (ei erillistä OpenSandbox-palvelua)
SANDBOX_STAGE=docker

# LiteLLM
LITELLM_MASTER_KEY=<generate>

# Ollama
OLLAMA_HOST=http://localhost:11434

# Aiven PostgreSQL (lokaali dev)
AIVEN_PG_PASSWORD=<generate>
DATABASE_URL=postgresql://dws_agent:<password>@localhost:5432/dws_agents

# LLM API fallback
ANTHROPIC_API_KEY=<from-vault>

# Langfuse (Article 12 observability)
LANGFUSE_PUBLIC_KEY=<generate>
LANGFUSE_SECRET_KEY=<generate>
LANGFUSE_HOST=http://localhost:3100
LANGFUSE_NEXTAUTH_SECRET=<generate>
LANGFUSE_SALT=<generate>

# EU Data Residency
EU_DATA_RESIDENCY=true
DEFAULT_TENANT_TIER=sandbox
```

---

## 14. Tiedostorakenne (tavoite)

```
src/agents/workflow/industry/
├── vulcan.agent.ts        # Steel & Metals Godagent        DONE
├── mars.agent.ts          # Construction Godagent           DONE
├── helios.agent.ts        # Energy & Utilities Godagent     DONE
├── gaia.agent.ts          # Automotive & Transport Godagent DONE
├── neptune.agent.ts       # Maritime & Shipping Godagent    DONE
├── ceres.agent.ts         # Agriculture & Forestry Godagent DONE
├── prometheus.agent.ts    # Cement & Concrete Godagent      DONE
├── diana.agent.ts         # Healthcare & Pharma Godagent    TODO P1
├── demeter.agent.ts       # Food & Beverage Godagent        TODO P1
├── minerva.agent.ts       # Chemicals Godagent              TODO P1
├── terminus.agent.ts      # Real Estate Godagent            TODO P2
├── silvanus.agent.ts      # Pulp & Paper Godagent           TODO P2
├── arachne.agent.ts       # Textiles Godagent               TODO P2
├── (roadmap 2027 — not created yet)
├── demeter.agent.ts       # Food & Beverage                 ROADMAP Q1/27
├── terminus.agent.ts      # Real Estate                     ROADMAP Q1/27
├── arachne.agent.ts       # Textiles                        ROADMAP Q2/27
├── pluto.agent.ts         # Mining & Minerals               ROADMAP Q2/27
├── aqua.agent.ts          # Water & Wastewater              ROADMAP Q2/27
├── hermes.agent.ts        # Logistics                       ROADMAP Q3/27
├── hephaestus.agent.ts    # Electronics & ICT               ROADMAP Q3/27
├── aeolus.agent.ts        # Aviation                        ROADMAP Q3/27
├── vesta.agent.ts         # District Heating                ROADMAP Q4/27
└── flora.agent.ts         # CANCELLED (merged into Ceres)

src/sandbox/
├── index.ts               # Factory (Stage 1/docker/2/3)    UPDATE
├── dockerode.ts           # Docker + Dockerode client       NEW (replaces opensandbox.ts)
├── zombie-cleanup.ts      # Zombie container management     NEW (Boardy #5)
├── opensandbox.ts         # DEPRECATED → redirect to dockerode
├── sdk-sandbox.ts         # Stage 1: SDK sandbox
├── cloudrun-ephemeral.ts  # Stage 2: Cloud Run
└── file_access_control.py # Python ACL

config/
├── litellm-config.yaml    # LiteLLM routing config          TODO
└── .env.godagent          # Environment template            TODO

docker-compose.godagent.yml                                  TODO
```

---

## Liittyvat dokumentit

- `AGENTS.md` — Agent ecosystem overview, BaseAgent pattern, API routes
- `src/agents/base.agent.ts` — BaseAgent abstract class with sandbox support
- `src/sandbox/index.ts` — Sandbox isolation factory (Stage 1/docker/2/3)
- `docs/FLEET_ECONOMIC_ENGINE.md` — Fleet economic model
- `docs/CLOUD_ENVIRONMENTS.md` — US/EU/Aiwen cloud accounts
- `DWS_SECURITY_STANDARD.md` — Security framework including NIS2

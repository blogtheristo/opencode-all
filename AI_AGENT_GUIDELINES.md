# AI Agent Guidelines

---

# VERSION AND AGENT HISTORY

Version: 1.3

Sessions & Modifications:

- Version: 1.2 | Tool: Claude Code | Session: claude/karpathy-12-rules-u47rx1 | Date: 19.06.2026 | Changes: Added §0 "The 12 Engineering Discipline Rules" — restates the canonical 12 rules (home: CLAUDE.md) for every `src/agents/` BaseAgent, MCP tool, AgentFoundry, and dev-fleet agent, with agent-specific bindings. Ensures every agent has access to the rules per session directive.
- Version: 1.3 | Tool: Claude Code (Opus 4.8) | Session: claude/vertical-agent-architecture-f8fqc5 | Date: 12.06.2026 | Changes: Added §11 Context Engineering & Agent Shape (L1/L2/L3 cache tiers, loop-vs-single-shot decision rule, discrete-tools-over-execute_code trade-off) from the "Building a Good Vertical Agent" audit; extended the new-agent checklist with tier + shape declarations
- Version: 1.1 | Tool: Claude Code (Opus 4.8) | Session: claude/ceo-review-dws-firehorse-1kWuP | Date: 31.05.2026 | Changes: Added Ledger-Native Output Contract (Firehorse 7) to §2 — operational agents must emit signed journalEntries + lineage (EU AI Act Art. 12) and optional regulatoryArtifact; defined sales-side exemption allowlist and CI contract gate. Implements DWS7 CEO reshape (layer-5 / AI Actions positioning)
- Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/deepwiki-agent-extraction-aS6Ub | Date: 11.02.2026 | Changes: Initial creation - consolidates distributed agent standards into single reference

Session Links & References:

- Claude Code (claude/deepwiki-agent-extraction-aS6Ub): https://github.com/blogtheristo/dws6/commits/claude/deepwiki-agent-extraction-aS6Ub

Document Status:

- Created: 11.02.2026
- Last Modified: 19.06.2026
- Language: English
- Languages Available: EN
- Publication Status: ACTIVE

Related Documents:

- AGENTS.md (Master agent index - references this file in Section 7)
- CLAUDE.md (AI behavior principles - Karpathy guidelines)
- DWS_DOCUMENT_STANDARD.md (Document formatting and versioning)
- DWS_SECURITY_STANDARD.md (Security framework)
- src/agents/base.agent.ts (BaseAgent abstract class)
- src/agents/types.ts (AgentContext, AgentResponse, AgentConfig, AgentExecutionLog)
- docs/architecture/01-AGENT-DISCOVERY.md (When to use an agent)

---

**Version:** 1.0
**Effective Date:** 2026-02-11
**Status:** Active

---

## Table of Contents

0. [The 12 Engineering Discipline Rules](#0-the-12-engineering-discipline-rules)
1. [Purpose](#1-purpose)
2. [Agent Code Standard](#2-agent-code-standard)
3. [Naming Conventions](#3-naming-conventions)
4. [Documentation Requirements](#4-documentation-requirements)
5. [Security Requirements](#5-security-requirements)
6. [Cost Tracking](#6-cost-tracking)
7. [Autonomy Tiers](#7-autonomy-tiers)
8. [Testing Requirements](#8-testing-requirements)
9. [Extraction Pattern: Bacterial Code](#9-extraction-pattern-bacterial-code)
10. [Skill Codification: Asked Twice = Failure](#10-skill-codification-asked-twice--failure)
11. [Context Engineering & Agent Shape](#11-context-engineering--agent-shape)

---

## 0. The 12 Engineering Discipline Rules

**Canonical source:** [`CLAUDE.md`](CLAUDE.md) → "Engineering Discipline — The 12 Rules". This section restates them so **every agent** in scope (§1) operates by them. Do not edit the rules here — propose changes to CLAUDE.md, then mirror. At runtime, `.claude/hooks/session-start.sh` injects the same list into every Claude Code session.

| #   | Rule                          | What it means for a DWS agent                                                                                              |
| --- | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| 1   | Think before coding           | Emit assumptions in the agent's plan/reasoning before acting; never guess inputs or schema.                                |
| 2   | Simplicity first              | No speculative abstractions in agent code; the smallest implementation that meets the response contract.                   |
| 3   | Surgical changes              | An agent changes only the files its task names; no opportunistic refactors of adjacent agents/utilities.                   |
| 4   | Goal-driven execution         | Every agent run has explicit success criteria; loop/HIL until verified, then stop (autonomy tiers, §7).                    |
| 5   | Model only for judgment calls | Use the LLM for classification/drafting/summarization/extraction; routing, retries, status codes, transforms are code.     |
| 6   | Token budgets are real        | Honor per-task (4000) / per-session (30000) budgets; cost tracking (§6) enforces this. Over budget → checkpoint, re-scope. |
| 7   | Surface conflicts             | Conflicting configs/patterns/signals → flag and pick one; never silently average (mirrors prompt-injection caution, §5).   |
| 8   | Read before you write         | Read exports/callers/shared utils (and existing agents) before adding code; reuse over duplicate.                          |
| 9   | Tests verify intent           | Agent tests assert the response **means** the right thing, not just that a field exists (§8).                              |
| 10  | Checkpoint each step          | Persist state / emit ledger entries per significant step; never stack work on an unverified prior step.                    |
| 11  | Match conventions             | New agents follow BaseAgent pattern, naming conventions (§3), and the established test idiom (§8) — no silent forks.       |
| 12  | Fail loud                     | Surface uncertainty, partial results, and skipped records in the response; never report success while hiding gaps.         |

---

## 1. Purpose

This document is the single reference for building, documenting, and operating AI agents within DWS IQ 6. It consolidates guidance that was previously scattered across CLAUDE.md, DWS_DOCUMENT_STANDARD.md, DWS_SECURITY_STANDARD.md, and the architecture docs.

**This applies to:**

- All production agents in `src/agents/`
- All MCP server tools in `mcp-servers/`
- All customer-facing agents in `AgentFoundry/`
- All internal team automation agents
- All development agents (V1.0 sprint fleet)

---

## 2. Agent Code Standard

### BaseAgent Pattern

Every production agent extends `BaseAgent` (`src/agents/base.agent.ts`):

```typescript
import { BaseAgent } from "./base.agent.js";
import type { AgentContext, AgentResponse } from "./types.js";

export class YourAgent extends BaseAgent {
  constructor() {
    super({
      name: "your-agent", // kebab-case, unique
      description: "What this agent does", // one sentence
      capabilities: ["tag-1", "tag-2"], // discovery tags
      model: "llama-3.1-70b-versatile", // LLM model ID
    });
  }

  async execute(context: AgentContext, input: Record<string, unknown>): Promise<AgentResponse> {
    const startTime = Date.now();

    // Log start
    await this.logExecution({
      agent_name: this.config.name,
      user_id: context.userId,
      org_id: context.orgId,
      session_id: context.sessionId,
      project_id: context.projectId,
      input,
      output: null,
      status: "started",
      duration_ms: 0,
      created_at: new Date().toISOString(),
    });

    // Your logic here
    const result = {
      /* ... */
    };
    const confidence = 0.85;
    const reasoning = "Explain why this result was produced";
    const recommendations = ["Next step 1", "Next step 2"];

    const response: AgentResponse = {
      agentName: this.config.name,
      result,
      confidence,
      reasoning,
      recommendations,
      metadata: {
        durationMs: Date.now() - startTime,
        model: this.config.model,
      },
    };

    // Log completion
    await this.logExecution({
      agent_name: this.config.name,
      user_id: context.userId,
      org_id: context.orgId,
      session_id: context.sessionId,
      project_id: context.projectId,
      input,
      output: response,
      status: "completed",
      duration_ms: Date.now() - startTime,
      created_at: new Date().toISOString(),
    });

    return response;
  }
}
```

### Registration

Register in `src/agents/index.ts`:

```typescript
import { YourAgent } from "./your-agent.agent.js";
// In registerDefaults():
this.register(new YourAgent());
```

### Required Response Fields

| Field             | Type     | Required | Description                         |
| ----------------- | -------- | -------- | ----------------------------------- |
| `agentName`       | string   | Yes      | Machine name of the agent           |
| `result`          | object   | Yes      | Primary output payload              |
| `confidence`      | number   | Yes      | 0.0 to 1.0 reliability score        |
| `reasoning`       | string   | Yes      | Human-readable explanation of logic |
| `recommendations` | string[] | Yes      | Actionable next steps               |
| `metadata`        | object   | Yes      | Timing, model info, token usage     |

### Ledger-Native Output Contract (Firehorse 7)

DWS's differentiation is **layer 5 (AI Actions)** of the AI-native stack — see `DWS7_ROADMAP.md` Executive Summary. A horizontal Cortex/Mosaic/AIP deployment stops at an LLM answer; a Firehorse agent must finish the regulatory action by emitting a **signed journal entry** and, where applicable, a **regulatory artifact**. This is the one structural property a horizontal deployment cannot replicate without rebuilding its agent layer.

By DWS 7 GA, every **operational** agent (i.e. one whose output affects a customer's carbon position) must conform to:

```ts
interface LedgerNativeAgentOutput extends AgentResponse {
  journalEntries: CarbonLedgerEntry[]; // 0..n signed debit/credit entries (Phase 2.6 ledger, PRs 093A–093I)
  regulatoryArtifact?: {
    // iXBRL fragment, CBAM row, ETS record, ESRS-E1 disclosure
    type: "iXBRL" | "CBAM" | "ETS" | "ESRS-E1" | "TAXONOMY";
    payload: string;
    schemaVersion: string;
  };
  lineage: {
    // EU AI Act Article 12 — see DWS_SECURITY_STANDARD.md
    sources: DataSourceRef[]; // e.g. EUTL installation DE-123456, ENTSO-E
    reasoning: string; // model trace / prompt chain
    signedBy: SovereigntyLayerSignature; // Full Sovereignty layer signature over the entry
  };
}
```

**Exemption allowlist.** Sales/marketing-side agents do **not** touch the carbon ledger and are explicitly exempt: `competitor-surveillance`, `seo-audit`, `lead-feedback`, `customer-sat`. All other production agents (e.g. `compliance`, `material-oracle`, `bess`, `cbam`, `sitesense`, `schedule-genius`, `construction`, `logistics`, `quality-gate`, `viability`, `emissions-data-analyst`) must conform. The allowlist is the single source of truth — adding an agent to it requires an explicit owner sign-off in review, not a silent default.

**CI gate.** A contract test (`src/agents/__tests__/ledger-contract.spec.ts`) asserts that every non-exempt registered agent returns `journalEntries` and `lineage`. New agents fail CI until they either conform or are added to the exemption allowlist with justification. See §8 Testing Requirements.

### Graceful Degradation

- If `GROQ_API_KEY` is not set, `callLLM()` returns a placeholder. Agent must still produce a deterministic result.
- If Supabase is not configured, `logExecution()` silently skips. Agent must not fail.
- All external API calls must be wrapped in try/catch with meaningful error messages.

---

## 3. Naming Conventions

### Agent Names

| Convention        | Format                   | Example                           |
| ----------------- | ------------------------ | --------------------------------- |
| Machine name      | `kebab-case`             | `material-oracle`, `customer-sat` |
| File name         | `{name}.agent.ts`        | `material-oracle.agent.ts`        |
| Class name        | `PascalCase + Agent`     | `MaterialOracleAgent`             |
| Registry ID (dev) | `agent-XX` (zero-padded) | `agent-04`                        |

### Signal Names

Format: `[AGENT-XX]:SIGNAL_TYPE:MILESTONE`

- Signal types: `READY`, `COMPLETE`, `ERROR`, `BLOCKED`
- Milestones: `kebab-case` descriptors, e.g., `schema-users`, `rls-policies`

### Document Names

Format: `[Document Title] - [Tool] - [SessionID] - Version X.Y`

Example: `AI Agent Guidelines - Claude Code - aS6Ub - Version 1.0`

### Branch Names

Format: `claude/[task]-[SessionID]`

Example: `claude/deepwiki-agent-extraction-aS6Ub`

---

## 4. Documentation Requirements

### Every Agent Must Have

1. **JSDoc header** on the class file:
   - What the agent does (one paragraph)
   - Input shape with field descriptions
   - Output description

2. **Input interface** defined as a TypeScript interface in the agent file

3. **Constants/thresholds** documented with source references (e.g., "EN 13001 for wind" or "ICE Database v3")

4. **Entry in AGENTS.md** with:
   - Signal dependencies (listens for)
   - Signals emitted
   - What it unlocks

### VERSION AND AGENT HISTORY

All documentation produced by agents must include the VERSION AND AGENT HISTORY block per `DWS_DOCUMENT_STANDARD.md`:

```yaml
Version: X.Y

Sessions & Modifications:
  - Version: X.Y | Tool: [tool] | Session: [id] | Date: DD.MM.YYYY | Changes: [what]

Document Status:
  - Created: DD.MM.YYYY
  - Last Modified: DD.MM.YYYY
  - Publication Status: ACTIVE
```

See `VERSION_AND_AGENT_HISTORY_TEMPLATE.md` for complete examples.

---

## 5. Security Requirements

### NEVER Include in Agent Output or Documents

- API keys, secrets, passwords, or tokens
- PII without anonymization
- Internal infrastructure details (IPs, ports, connection strings)
- Credentials or service account keys

### ALWAYS Include

- Anonymized examples when demonstrating data handling
- Architecture diagrams showing data flow
- Decision rationales for security-relevant choices

### Agent-Specific Security

- **Input validation**: Validate all input before processing. Use TypeScript interfaces and runtime checks.
- **Output sanitization**: Never include raw user input in LLM prompts without sanitization.
- **Rate limiting**: API-exposed agents must use rate limiting (see `src/agents/routes.ts`, 30 req/min default).
- **JWT injection**: `userId` and `orgId` come from authenticated JWT, never from request body.
- **Execution logging**: All agent executions are logged to Supabase `agent_executions` table for EU AI Act Article 12 compliance. Treat `supabase/migrations/030_agent_logging_tables.sql` as schema source of truth (`id` uses `uuid_generate_v4()` from `uuid-ossp`).
- **Schema clarity rule**: Do not document `container_id`, `sandbox_stage`, `prompt_tokens`, `completion_tokens`, or `total_tokens` as current `agent_executions` columns unless a migration explicitly adds them; label them as planned extensions.

### Prompt Injection Defense

Per `DWS_SECURITY_STANDARD.md` and OWASP Top 10 for LLM Applications:

- System prompts must include role boundaries
- User input must be clearly delimited in prompts
- Agents must not execute arbitrary code from LLM output
- Tool calls must be validated against an allowlist

---

## 6. Cost Tracking

Each agent has a monthly budget. Track costs per agent:

```yaml
cost_tracking:
  budget_monthly_eur: 100-150
  alert_at_percentage: 80
  model_costs:
    llama_3_1_70b:
      input_per_1m_tokens: 0.59
      output_per_1m_tokens: 0.79
    claude_sonnet_4_5:
      input_per_1m_tokens: 3.00
      output_per_1m_tokens: 15.00
    claude_opus_4_6:
      input_per_1m_tokens: 15.00
      output_per_1m_tokens: 75.00
```

### Cost Optimization Rules

1. Use Groq (Llama 3.1 70B) for high-frequency, lower-complexity tasks
2. Reserve Claude for complex reasoning, planning, and multi-step analysis
3. Keep `max_completion_tokens` as low as practical (default: 1024)
4. Use `temperature: 0.3` for deterministic tasks, `0.7` for creative tasks
5. Log token usage in `metadata` of every `AgentResponse`

---

## 7. Autonomy Tiers

From `docs/architecture/01-AGENT-DISCOVERY.md`:

### Tier 1: Full Autonomy

**Actions:** Query responses, status checks, read-only API calls, report generation.
**Approval:** None required.
**Examples:** SiteSense weather checks, ScheduleGenius critical path analysis, MaterialOracle carbon lookup.

### Tier 2: Supervised Execution

**Actions:** Data modifications, customer communications, report distribution.
**Approval:** Audit log + async review.
**Examples:** CustomerSat sending retention emails, Viability updating project scores.

### Tier 3: Human-in-the-Loop

**Actions:** Financial transactions, permit submissions, contract modifications.
**Approval:** Explicit human approval before execution.
**Examples:** Payment processing, regulatory submissions, contract changes.

### Assigning a Tier

Every agent must declare its tier. If an agent spans tiers, use the highest tier for any action it can take:

```typescript
// In agent config or documentation
// Tier: 1 (read-only analysis, no mutations)
```

---

## 8. Testing Requirements

### Unit Tests

Every agent must have corresponding tests in `src/__tests__/`:

```typescript
// src/__tests__/agents/your-agent.test.ts
import { describe, it, expect } from "vitest";
import { YourAgent } from "../../agents/your-agent.agent.js";

describe("YourAgent", () => {
  const agent = new YourAgent();
  const context = {
    projectId: "test-project",
    userId: "test-user",
    orgId: "test-org",
    sessionId: "test-session",
  };

  it("returns valid AgentResponse shape", async () => {
    const result = await agent.execute(context, {
      /* test input */
    });
    expect(result.agentName).toBe("your-agent");
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
    expect(result.reasoning).toBeTruthy();
    expect(Array.isArray(result.recommendations)).toBe(true);
  });

  it("handles missing LLM gracefully", async () => {
    // Ensure agent works without GROQ_API_KEY
    const result = await agent.execute(context, {
      /* test input */
    });
    expect(result.result).toBeDefined();
  });
});
```

### Test Coverage Requirements

- All deterministic logic paths tested
- Edge cases for input validation
- Graceful degradation when LLM/Supabase unavailable
- Confidence score range validation

---

## 9. Extraction Pattern: Bacterial Code

### Philosophy

Based on Andrej Karpathy's "bacterial code" concept (February 2026): instead of importing entire libraries as dependencies, use AI agents to understand and extract the specific functionality needed, producing self-contained code.

### When to Use Extraction

| Scenario                                        | Use Extraction | Use Library |
| ----------------------------------------------- | -------------- | ----------- |
| Need 1 function from 100k LOC library           | Yes            | No          |
| Need ongoing updates from maintained library    | No             | Yes         |
| Library has complex transitive dependencies     | Yes            | No          |
| Functionality is stable/well-understood         | Yes            | No          |
| Library provides security patches you depend on | No             | Yes         |

### How It Works

1. **Understand** the source repo via DeepWiki (`deepwiki.com/owner/repo`)
2. **Identify** the specific functionality needed
3. **Extract** using AI agent with DeepWiki MCP + GitHub CLI
4. **Validate** extracted code produces identical results to original
5. **Audit** extracted code for security before production use

### Principles for Extracted Code

- **Self-contained**: No imports from the source library
- **Stateless**: Easy to test, move, replace
- **Small**: Minimum lines for the functionality
- **Documented**: Include source attribution and extraction context
- **Tested**: Must pass equivalence tests against original

### Source Attribution

Extracted code must include a header comment:

```typescript
/**
 * Extracted from: github.com/owner/repo
 * Original file: path/to/source.ts
 * Extraction date: 2026-02-11
 * Agent session: claude/deepwiki-agent-extraction-aS6Ub
 * Purpose: [what this does and why we extracted it]
 * License: [original repo license]
 */
```

### Risks

- Extracted code does not receive upstream security patches
- Must manually sync if upstream fixes bugs
- License compliance must be verified before extraction
- Over-extraction leads to maintenance burden

---

## 10. Skill Codification: Asked Twice = Failure

### Philosophy

Following the "thin harness, fat skills" doctrine (Garry Tan, May 2026): the harness is the program that runs the LLM — it should be small. The intelligence lives in skill files: parameterized markdown procedures that encode judgment and process. Every reusable capability becomes a permanent upgrade to the system. When the model gets better, every skill instantly gets better.

### The Rule

If the user has to ask for the same kind of work twice, the agent failed. Repeating judgment work is not "execution" — it is a missing skill file.

### Procedure

1. **Do it manually** the first time on 3–10 representative items.
2. **Show output** to the user for approval.
3. **Codify** the approved procedure as a parameterized skill:
   - Judgment-heavy reusable capability → `skills/<name>/SKILL.md`
   - Slash-invocable workflow → `.claude/commands/<name>.md`
   - Time-driven deterministic automation → script under `scripts/{daily,weekly,hourly,on-deploy}/` (see Script Automation Rule in CLAUDE.md)
4. **Re-run** the new skill against the same 3–10 items to confirm reproduction.
5. **Register** the skill in `docs/DWS_SKILLS_GUIDE.md` (Agent Productization Rule).

### Skill Shape (Method, Not Script)

Skill files are method calls, not domain-specific scripts. A skill describes a process of judgment; the invocation supplies the world.

| Anti-pattern (script)            | Correct shape (method)             |
| -------------------------------- | ---------------------------------- |
| `firehorse-report-annual`        | `firehorse-report KIND=annual`     |
| `firehorse-report-board-pack`    | `firehorse-report KIND=board-pack` |
| `plan-ceo-review`                | `plan-review ROLE=ceo`             |
| `plan-eng-review`                | `plan-review ROLE=eng`             |
| `match-breakout-cohort-july2026` | `match KIND=breakout COHORT=...`   |

**Signal:** if you find yourself copying a `SKILL.md` and changing one parameter, you have a function with no arguments. Collapse them.

### Latent vs Deterministic Boundary

Every step in a skill is either **latent** (LLM judgment: read, synthesize, decide) or **deterministic** (function: SQL, arithmetic, schema validation). The SKILL.md must mark each step. Asking the LLM to do 800-person seating optimization is a category error — that is combinatorial code. Asking deterministic code to judge whether a founder's GitHub commits match their pitch is the opposite error.

### Learning Loop

`/retro` and post-mortems surface mediocre outcomes (NPS = OK, not great). Diarize those, extract the rule the system was missing, and propose a diff against the relevant `SKILL.md`. Commit the rule into the skill — do not store it in chat history or human memory.

> Skills compound. Build once. The system runs forever. — Tan

---

## 11. Context Engineering & Agent Shape

Derived from the _Building a Good Vertical Agent_ audit
(`docs/audits/AGENT_ARCHITECTURE_AUDIT_FIELD_NOTE.md`). Core thesis: **a good
agent is a faithful compression of its task distribution.** With the model
fixed, accuracy is a function of context quality — bloat buries the signal,
gaps force guessing. These rules make that compression a design requirement,
not an accident.

### 11.1 Context as a Layered Cache (L1 / L2 / L3)

Treat the agent's context like a CPU memory hierarchy. Place each capability at
the tier that minimizes total context cost across the task distribution.

| Tier   | What lives here                                              | Cost model                           | DWS mechanism                                                 |
| ------ | ------------------------------------------------------------ | ------------------------------------ | ------------------------------------------------------------- |
| **L1** | The ~80% bread-and-butter; always resident in the prompt     | Paid on **every** call — keep tight  | The agent's SOUL system prompt (`base.agent.ts` `soulPrompt`) |
| **L2** | The ~15% important-but-occasional; fetched on one cheap call | Zero until needed; one discovery hop | `memory_recall`, `kb_*` tools, curated `skills/*/SKILL.md`    |
| **L3** | The long tail; raw substrate + a skill that maps it          | Several calls, only on rare tasks    | `skills/<name>/SKILL.md` over a large reference / the raw DB  |

Rules:

- **Keep L1 tight and token-budgeted.** A SOUL prompt is not a dumping ground.
  Anything used on a minority of tasks belongs in L2, not L1.
- **L2 specs are gotcha-aware prose, not type signatures.** Encode the canonical
  recipe and the constraints someone already paid to learn, fetched on demand.
- **L3 must be reachable, complete, and findable in a bounded number of steps.**
  It does not have to be ergonomic; the agent must never be truly stuck.
- As models get stronger, tiers slide down (yesterday's L3 → today's L2). Revisit
  placements; do not assume them fixed.

### 11.2 Agent Shape: Loop vs Single-Shot

Two valid shapes. **Declare which one an agent uses and why** — the choice is
itself a compression of the task distribution.

- **Single-shot** (`callLLM`): read input → deterministic domain logic → one LLM
  call to narrate/score → return `AgentResponse`. Correct for **bounded,
  deterministic** tasks (carbon lookup, a fixed scoring rubric, classification).
  Cheaper, more auditable, easier to test. This is the default for most scored
  DWS agents.
- **Loop** (`runLoop`): observe-think-act with tool use until done. Reserve for
  **open-ended** tasks that genuinely need iterative tool use, DB queries, or
  delegation (e.g. "find the compliance gap in this filing"). Costs more tokens
  per task — do not adopt it for deterministic work just because it is newer.

Anti-pattern: defaulting to a loop "to be safe." A loop over a deterministic task
adds cost and variance for zero accuracy gain.

### 11.3 Tool Output Is Context — Compress It and Report Consequences

The steep-frequency tools (DB reads, external fetches) get
**feature-engineered, token-compressed, consequence-reporting** wrappers, because
the agent pays their cost on every task. A raw dump or a blind truncation buries
the signal. Reference implementations:

- `compressRows` (`tools.ts`) backs `query_database`: schema reported once,
  constant columns collapsed losslessly, large sets sampled with an omitted
  tally, and a `review` section that flags empties, null columns, error
  sentinels, and limit-truncation — _"here's the part you probably got wrong."_
- `summarizeFetchedText` (`tools.ts`) backs `fetch_external`: caps the body but
  reports the full length and an explicit `truncated` flag instead of silently
  cutting the string.

New tools that return list/blob data must follow this pattern, not return raw
payloads.

### 11.4 Discrete Tools Over `execute_code` — a Deliberate Trade-off

The field note argues for a single `execute_code` tool. DWS deliberately uses
**discrete, typed, individually-classifiable tools** instead, because the
security model depends on it: the RED/BLUE lethal-trifecta gate, the per-call
allowlist, and `MCPToolRegistry.validateToolCombination` (`tools.ts`) can only
classify and block _named_ tool calls. Arbitrary code execution would blind
every one of those controls.

Keep per-agent tool counts low (single digits) to preserve model accuracy, but
**do not** introduce a general code-execution tool into a production agent —
that regresses the EU-AI-Act-logged security posture. If composition power is
needed, prefer `delegate_to_agent` and the Daedalus tool-composition path.

---

## Quick Reference

### File Locations

| Resource              | Path                       |
| --------------------- | -------------------------- |
| BaseAgent class       | `src/agents/base.agent.ts` |
| Agent types           | `src/agents/types.ts`      |
| Agent registry        | `src/agents/index.ts`      |
| Agent API routes      | `src/agents/routes.ts`     |
| Agent implementations | `src/agents/*.agent.ts`    |
| Agent tests           | `src/__tests__/agents/`    |
| Master agent index    | `AGENTS.md`                |
| This guidelines file  | `AI_AGENT_GUIDELINES.md`   |

### Checklist for New Agents

- [ ] Extends `BaseAgent`
- [ ] Has unique kebab-case `name`
- [ ] Implements `execute()` returning `AgentResponse`
- [ ] Returns `confidence` (0-1)
- [ ] Returns `reasoning` string
- [ ] Returns `recommendations[]`
- [ ] Logs execution via `this.logExecution()`
- [ ] Handles missing LLM gracefully
- [ ] Input validated with TypeScript interface
- [ ] Registered in `src/agents/index.ts`
- [ ] Tests in `src/__tests__/agents/`
- [ ] Entry added to `AGENTS.md`
- [ ] Autonomy tier declared
- [ ] Cost budget assigned
- [ ] Agent shape declared: single-shot vs loop, with rationale (§11.2)
- [ ] Context tiers identified: what is L1 (resident) vs L2 (fetched) vs L3 (§11.1)
- [ ] List/blob-returning tools compress output + report consequences (§11.3)

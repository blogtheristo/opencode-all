# Tool Plan — 25-Industry Agent Coverage

Plans the tool surface that backs the universal `industry-analyst` agent and the
12-industry coverage gap. Companion to
`docs/research/INDUSTRY_COVERAGE_25_COMPARISON.md`. Every proposed tool is
placed on a context tier (§11.1), carries a RED/BLUE/GREEN classification
(`src/mcp/security/tool-colors.ts` — `validateToolCombination` throws on
unclassified tools, so classification is a hard precondition, not paperwork),
and a compression requirement (§11.3).

---

# VERSION AND AGENT HISTORY

Version: 0.1

Sessions & Modifications:

- Version: 0.1 | Tool: Claude Code | Session: claude/vertical-agent-architecture-f8fqc5 | Date: 12.06.2026 | Changes: Initial tool plan for 25-industry coverage — inventory, knowledge-vs-tool split, 4 phases, color classifications, compression requirements

Session Links & References:

- Claude Code (vertical-agent-architecture-f8fqc5): https://github.com/blogtheristo/dws6/commits/claude/vertical-agent-architecture-f8fqc5

Document Status:

- Created: 12.06.2026
- Last Modified: 12.06.2026
- Language: English
- Languages Available: EN
- Publication Status: Review

Repository Status:

- Location: docs/research/
- Access Level: 🟡 Internal

---

---

## Status (2026-06-13)

- **Phase 1** ✅ shipped — `fetch_external` JSON path compressed; allowlist +
  `eea.europa.eu`, `transparency.entsoe.eu`.
- **Phase 2** ✅ shipped — `industry_profile_lookup` + `sector_metrics_calculator`
  (`src/agents/industry-tools.ts`), classified GREEN.
- **Phase 3** ✅ shipped — `grid_intensity_feed` + `carbon_price_feed`, **reclassified
  GREEN** (owner-authorized) behind typed scalar parsers; injection rejection
  unit-tested. EEX carbon price degrades gracefully without `EEX_API_KEY`.
- **Phase 4** ✅ shipped — CLI `npm run industry -- profile|metrics ... [--json]`
  (`scripts/industry.ts`) over the same pure functions. MCP/agent exposure was
  already satisfied by builtin registration; a separate MCP server was judged
  over-engineering (no logic duplicated).
- **Aviation question:** resolved as _no new pantheon agent_ — its distinctive
  needs are covered by registry knowledge + `saf_blend_gap` /
  `aviation_non_co2_forcing` calculator metrics. See §5 and audit R5.

---

## 0. Planning principles

1. **Knowledge is not a tool.** Static facts (SAF blending schedule, PCAF
   attribution factors, EED Annex VII field list) belong in the industry
   registry or an L2 curated spec — fetched as context, not invoked as a tool.
   A tool is only justified by _live data_ or _deterministic computation_.
2. **Tool count stays single-digit per agent** (§11.4). We extend existing
   tools before adding new ones, and new ones are shared builtins, not
   per-industry tools. Twelve gap industries do **not** mean twelve tools.
3. **Every tool output is context** (§11.3): list/blob-returning tools must
   compress and report consequences (`compressRows` / `summarizeFetchedText`
   pattern).
4. **Color before code.** A tool that is not in `TOOL_CLASSIFICATIONS` cannot
   execute. Classification (and its justification) is part of each tool's
   definition of done.
5. **Agent Productization Rule** (CLAUDE.md): each shipped tool also gets a CLI
   path and structured JSON output; MCP exposure where applicable.

## 1. Current inventory (what the analyst already has)

| Tool                             | Color         | Tier  | Notes                                                                                                                |
| -------------------------------- | ------------- | ----- | -------------------------------------------------------------------------------------------------------------------- |
| `query_database`                 | GREEN         | L2    | Compressed + consequence-reporting (`compressRows`) ✅                                                               |
| `fetch_external`                 | RED           | L2/L3 | Text path compressed ✅; **JSON path returns raw `response.json()` — bypasses compression (defect, fix in Phase 1)** |
| `delegate_to_agent`              | GREEN         | L2    | How industry-analyst reaches `compliance` and the pantheon                                                           |
| `emit_event`                     | BLUE          | L2    | Downstream workflow triggers                                                                                         |
| `memory_store/forget/supersede`  | BLUE          | L2    | Org-scoped memory writes                                                                                             |
| `memory_recall`, `extract_facts` | GREEN         | L2    | The existing L2 cache-miss path                                                                                      |
| `kb_*` (5)                       | RED/GREEN mix | L2/L3 | Wiki compile/ask path                                                                                                |

`FETCH_ALLOWLIST` today: `ec.europa.eu`, `data.europa.eu`, `api.eex.com`,
`api.carbonintensity.org.uk`, `ember-climate.org`, `co2data.fi`,
`api.weather.gov`, `openweathermap.org`.

## 2. Needs analysis — what the 25 industries actually require

Mapping the registry's coverage gaps to capability _kinds_ (not tools yet):

| Need                                                                                | Kind                          | Consuming industries (ids)                          |
| ----------------------------------------------------------------------------------- | ----------------------------- | --------------------------------------------------- |
| SAF blending schedule, ETS aviation phase-out                                       | **static knowledge**          | 5                                                   |
| PCAF attribution factors, SFDR PAI field list                                       | **static knowledge**          | 20                                                  |
| EED Annex VII reporting fields                                                      | **static knowledge**          | 24                                                  |
| WtE biogenic/fossil split method, CWT benchmarks                                    | **static knowledge**          | 10, 13                                              |
| ETS/EUA carbon price (live)                                                         | **live numeric feed**         | all ETS-exposed (1–4, 6–8, 10–16)                   |
| Grid carbon intensity, hourly (live)                                                | **live numeric feed**         | 1, 11 (CBAM indirect), 24 (CFE), 25 (additionality) |
| Sector math: PUE/WUE, clinker factor, SAF blend gap, financed-emissions attribution | **deterministic computation** | 3, 5, 20, 24 +                                      |
| Industry profile lookup by any agent (Atlas routing, compliance context)            | **registry exposure**         | all 25                                              |
| Regulatory deadline horizon                                                         | **existing agent** (Chronos)  | all 25                                              |

Conclusion: 4 of 9 needs are knowledge (no tool), 1 is already an agent
(delegate to Chronos), leaving **two live feeds, one calculator, one registry
lookup** — four tools, not twelve.

## 3. The plan

### Phase 0 — knowledge placement, no new tools (now)

- Encode static schedules (SAF %, ETS aviation free-allowance phase-out, PCAF
  factors, Annex VII fields) as **L2 curated blocks** — either extensions of
  `industry-registry.ts` profiles or `skills/<domain>/SKILL.md` specs fetched on
  demand. Zero prompt cost until the task needs them (§11.1).
- Industry-analyst keeps its current tool set: `query_database`,
  `delegate_to_agent`, `emit_event` (+ `fetch_external` only when the sandbox
  allows). No change.

### Phase 1 — fix and extend existing tools (next)

1. **Close the JSON compression gap in `fetch_external`** (defect): when the
   response is JSON and parses to an array of objects, route through
   `compressRows`; when an object, apply size-budgeted serialization with an
   explicit `truncated` flag. No raw `response.json()` passthrough.
2. **Extend `FETCH_ALLOWLIST`** (smallest useful set, all official):
   - `eea.europa.eu` — EEA datasets (EUTL-derived emissions, waste stats)
   - `transparency.entsoe.eu` — ENTSO-E grid data (CBAM indirect, CFE matching)
     Both remain behind the RED `fetch_external` classification.

### Phase 2 — new GREEN deterministic builtins

3. **`industry_profile_lookup`** (GREEN — pure registry read, no I/O):
   exposes `industry-registry.ts` to _every_ agent as an L2 one-call fetch
   (`{ industryId | industry } → IndustryProfile`). Today only industry-analyst
   imports the registry; Atlas (routing), Athena/compliance (context), and the
   pantheon should reach it without code imports. Output is one profile —
   inherently compressed.
4. **`sector_metrics_calculator`** (GREEN — pure functions, no I/O):
   deterministic sector math in one parameterized tool
   (`{ metric, inputs } → { value, formula, sources }`):
   - `pue_wue` (id 24), `clinker_factor` (3), `saf_blend_gap` (5),
     `financed_emissions_attribution` PCAF (20), `ets_allowance_gap` (all ETS).
     This is the "latent vs deterministic boundary" rule from the guidelines —
     the LLM must not do this arithmetic. One tool, `metric` is the parameter
     (Skill Shape rule: the invocation supplies the world).

### Phase 3 — typed numeric connectors (GREEN-with-justification)

5. **`carbon_price_feed`** (EEX EUA spot/futures) and
   **`grid_intensity_feed`** (ENTSO-E / carbonintensity.org.uk):
   today any live lookup rides RED `fetch_external`, which **taints the session**
   and blocks later BLUE actions (lethal-trifecta gate). For numeric feeds this
   is overcautious: a connector whose parser emits **only numbers, dates, and
   closed enums** cannot carry injected instructions. Plan: implement strict
   typed parsers (reject anything non-conforming), classify GREEN with a written
   justification in `tool-colors.ts`, and unit-test the parser rejects
   instruction-shaped payloads. This unlocks "fetch price → emit event" chains
   that RED tainting currently forbids.
   - Security sign-off required before the GREEN classification lands
     (DWS_SECURITY_STANDARD.md review path) — this is the one item in the plan
     with a RED→GREEN reclassification argument, so it is explicitly gated.

### Phase 4 — productization (per Agent Productization Rule)

6. CLI: `dws industry profile <id|name>`, `dws industry metrics <metric> ...`
   with `--json`; MCP exposure of `industry_profile_lookup` +
   `sector_metrics_calculator` via mcp-hub. Skill registration in
   `docs/DWS_SKILLS_GUIDE.md` if `/discover-agents`-style usage emerges.

## 4. Per-tool contract summary

| Tool                        | Color             | Tier  | Compression                      | Phase | Gate                |
| --------------------------- | ----------------- | ----- | -------------------------------- | ----- | ------------------- |
| `fetch_external` JSON fix   | RED (unchanged)   | L2/L3 | `compressRows` / budgeted object | 1     | none (defect fix)   |
| allowlist + `eea`, `entsoe` | —                 | —     | —                                | 1     | none                |
| `industry_profile_lookup`   | GREEN             | L2    | single profile (inherent)        | 2     | none                |
| `sector_metrics_calculator` | GREEN             | L2    | scalar result (inherent)         | 2     | none                |
| `carbon_price_feed`         | GREEN (justified) | L2    | typed scalars only               | 3     | **security review** |
| `grid_intensity_feed`       | GREEN (justified) | L2    | typed scalars only               | 3     | **security review** |

Net new tools: **4** (2 in Phase 2, 2 gated in Phase 3). Per-agent count stays
single-digit; the analyst itself gains at most 2 (`industry_profile_lookup` is
for _other_ agents; the calculator and feeds are opt-in per agent config).

## 5. Explicit non-tools (rejected)

- ~~`aviation_saf_lookup`, `pcaf_factor_lookup`, `annex7_fields`~~ — static
  knowledge; goes in the registry / L2 specs (Principle 1).
- ~~Per-industry tools (12 of them)~~ — the registry + parameterized calculator
  covers the variance; per-industry tools would repeat the pantheon sprawl at
  the tool layer.
- ~~`execute_code`~~ — permanently rejected per §11.4 (blinds the RED/BLUE
  security model).
- ~~`regulatory_deadline_lookup`~~ — already exists as the Chronos agent; use
  `delegate_to_agent('chronos', …)` instead of duplicating it as a tool.

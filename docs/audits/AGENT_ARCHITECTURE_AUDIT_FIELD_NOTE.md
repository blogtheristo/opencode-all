# Agent Architecture Audit — "Building a Good Vertical Agent"

Audit of the DWS IQ agent fleet against Peter Wang's field note
_Building a Good Vertical Agent_ (the L1/L2/L3 context-cache hierarchy, the
"one tool, not thirty" principle, and the compression thesis).

---

# VERSION AND AGENT HISTORY

Version: 0.1

Sessions & Modifications:

- Version: 0.1 | Tool: Claude Code | Session: claude/vertical-agent-architecture-f8fqc5 | Date: 12.06.2026 | Changes: Initial audit — maps src/agents fleet against the field note's cache-hierarchy and compression principles; fixed live merge-conflict + Resend reference in AGENTS.md

Session Links & References:

- Claude Code (vertical-agent-architecture-f8fqc5): https://github.com/blogtheristo/dws6/commits/claude/vertical-agent-architecture-f8fqc5

Document Status:

- Created: 12.06.2026
- Last Modified: 12.06.2026
- Language: English
- Languages Available: EN
- Publication Status: Review

Repository Status:

- Location: docs/audits/
- Access Level: 🟡 Internal

---

---

## 0. The yardstick

The field note makes four falsifiable claims we can audit against:

1. **An agent is a while-loop around a model that calls tools until done.** The
   interesting engineering is not the loop; it is the _context_ (system prompt,
   tools, artifacts).
2. **A good agent is a faithful compression of its task distribution.** Accuracy
   is a function of context quality; bloat buries signal, gaps force guessing.
3. **Context should be a memory hierarchy** — L1 (always resident, the 80%),
   L2 (curated specs, fetched on one cheap call, the ~15%), L3 (raw substrate +
   a skill that teaches the agent to mine it, the long tail).
4. **Prefer one `execute_code` tool over many** — model accuracy degrades as you
   add tools; one tool lets the model compose with full language expressivity.

What follows scores the DWS fleet against each, with file-level evidence, then
gives a prioritized remediation list.

---

## 1. What we actually have

| Dimension            | Field-note expectation                                   | DWS reality                                                                                                              | Evidence                                                                                      |
| -------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| Agent shape          | while-loop + tools                                       | **27 of 29 single-file agents are single-shot** `callLLM`; only **3** use the agentic `runLoop`; KB is the 4th loop user | `grep callLLM` → 27, `grep runLoop` → 3; `base.agent.ts:282` (`callLLM`) vs `:86` (`runLoop`) |
| Tools per loop agent | few (Pi ships 7)                                         | ~4–8: builtins (`query_database`, `emit_event`, `delegate_to_agent`, `fetch_external`) + agent-specific                  | `base.agent.ts:116-130`                                                                       |
| Total tool surface   | one `execute_code` ideal                                 | 11 discrete typed tools, hard-gated by an allowlist + tool-colors                                                        | `tools.ts:275-537`, `:162-238`                                                                |
| Context tiering      | explicit L1/L2/L3                                        | **none documented**; SOUL prompts are monolithic                                                                         | `AI_AGENT_GUIDELINES.md` has no cache/tier concept                                            |
| On-demand fetch      | L2 `getXInfo()` / L3 grep-the-tome                       | partial, _latent_: `memory_recall`, `kb_*`, `skills/*/SKILL.md`                                                          | `tools.ts:399-427`, `skills/`                                                                 |
| Output compression   | lossless token-compressed + "what you got wrong" linting | **absent**; raw rows / blind 10k-char truncation                                                                         | `tools.ts:582-584`, `:629-631`                                                                |
| Fleet size           | one agent = one compressed distribution                  | **~50 registered agents**                                                                                                | `index.ts:203-286`                                                                            |

The headline: **DWS is not, today, a fleet of "while-loop + tool" agents.** It is
mostly a library of _single-shot deterministic analyzers_ (read input → run
domain math → one LLM call to narrate → return `AgentResponse`). That is a
legitimate and often _better_ design for scored, auditable, EU-AI-Act-logged
tasks — but it means three of the field note's four principles (tool hierarchy,
output compression, one-tool) only bite on the handful of true loop agents
(`runLoop` users + KB), and the fourth (compression thesis) bites on the
**fleet topology** instead.

---

## 2. Principle-by-principle scoring

### 2.1 "An agent is a while-loop" — PARTIAL (by design)

`BaseAgent.runLoop()` (`base.agent.ts:86-235`) is a clean observe-think-act loop
with parallel tool execution, iteration logging for Article 12, and a
`maxIterations` guard. It is good. It is also **barely used** — 3 of 29
top-level agents. The other 27 never loop; they call `callLLM` once.

**Verdict:** This is fine _if it is a deliberate choice_, but it is currently an
_accident of history_ — `callLLM` is documented as "backward compat"
(`base.agent.ts:264-273`) yet remains the default path. The guideline never
tells an author _when_ a task warrants a loop vs a single shot. That decision is
exactly the field note's "faithful compression of the task distribution": a
deterministic carbon lookup should be one shot; an open-ended "find the gap in
this filing" should loop.

**Fix:** Add a "loop vs single-shot" decision rule to `AI_AGENT_GUIDELINES.md`
§2 (see §4 R3 below). Do **not** mass-convert single-shot agents to loops — that
would add tokens and cost for zero accuracy on deterministic tasks.

### 2.2 The compression thesis — WEAKEST AREA (fleet sprawl)

The field note's thesis is "one agent = a faithful compression of _its_ task
distribution." DWS has gone the other way: ~50 named agents, including a 9-strong
industry pantheon (`VulcanAgent` steel, `HeliosAgent` energy, `NeptuneAgent`
maritime, `CeresAgent` agri, `GaiaAgent` cement, `TalosAgent` aluminium,
`MarsAgent` construction, `PrometheusAgent` hydrogen, plus `JunoAgent`,
`MercuryTradeAgent`) — `index.ts:243-275`.

Many of these are plausibly the _same_ task distribution — "industry-specific
CBAM/ETS carbon analysis" — parameterized by sector. That is precisely the smell
CLAUDE.md's own **Skill Codification Rule** names: _"Four near-identical
SKILL.md files with different filenames is a smell — collapse them into one with
arguments."_ The field note says the identical thing about agents. A fleet that
sprawls one-agent-per-noun is the _opposite_ of compression; it multiplies system
prompts, tests, and ledger-contract surface (`AI_AGENT_GUIDELINES.md:170-194`)
without multiplying captured distribution.

**Verdict:** Likely over-segmented. This is a strategic finding, not a one-line
fix — it needs an owner decision (§4 R5). The question to answer per pantheon
agent: _does this agent face a genuinely different task distribution, or is it
`industryCarbonAgent(INDUSTRY=steel)` wearing a Roman name?_

### 2.3 L1/L2/L3 context hierarchy — NOT MODELED (but the parts exist)

There is no L1/L2/L3 concept anywhere in the guidelines or the agent base class.
Yet the _ingredients_ of one are already in the repo, just ungoverned:

- **L1-ish:** the per-agent SOUL system prompt (`base.agent.ts:280`,
  `soulPrompt`) — always resident, but monolithic and not token-budgeted.
- **L2-ish:** `memory_recall` (`tools.ts:399`) and `kb_*` tools — curated
  knowledge fetched on one cheap call. This _is_ the L2 cache-miss pattern; it is
  simply not described or tuned as one.
- **L3-ish:** `skills/<name>/SKILL.md` files — short maps to larger procedures,
  exactly the field note's "skill that teaches the agent to mine the tome."

So DWS has accidentally built a three-tier system without the discipline that
makes one work: nobody is measuring _what should be resident vs fetched_, and the
SOUL prompts are not on a token budget. The field note's craft — "place each
capability at the tier that minimizes total cost across the distribution" — is
not being practiced.

**Fix:** Codify the hierarchy as a first-class section in
`AI_AGENT_GUIDELINES.md` and require new agents to declare what is L1 (resident)
vs L2 (memory/KB fetch) vs L3 (skill-mediated). Low effort, high leverage (§4 R1).

### 2.4 Tool output compression & consequence reporting — ABSENT (biggest engineering gap)

This is where the field note spends its "absurd, disproportionate effort," and
where DWS has done none. Concretely:

- `query_database` returns `{ rows: data, count }` — a **raw dump**
  (`tools.ts:582-584`). No formula-aliasing-style compression, no header/row
  context, no sampling. A 50-row result is 50 rows of JSON in the model's
  context.
- `fetch_external` does `text.slice(0, 10_000)` — a **blind lossy truncation**
  (`tools.ts:629-631`). The field note's whole point is that truncation is the
  amateur move; you compress _losslessly_ and _report consequences_.
- No tool returns a "here's what changed, and here's the part you probably got
  wrong" diff. There is no linter on the agent's own outputs.

For the loop agents (and any future ones), this is the single highest-accuracy-
per-effort investment available. The DB tool in particular is the DWS analogue of
the field note's `getCellRange`: it sits on the steep part of the frequency curve
and deserves a feature-engineered, token-compressed, consequence-reporting
wrapper (§4 R2).

### 2.5 "One tool, not thirty" — DEFENSIBLE DIVERGENCE (document it)

DWS uses discrete typed tools, not one `execute_code`. Per loop agent the count
is ~4–8, comfortably under the field note's worry threshold — so the _accuracy-
degrades-with-tool-count_ risk is low. More importantly, the `execute_code`
ideal is **fundamentally incompatible with the DWS security model**: the
RED/BLUE "lethal trifecta" gate (`tools.ts:204-238`), the per-call allowlist
(`tools.ts:166-185`), and `MCPToolRegistry.validateToolCombination`
(`tools.ts:187`) all depend on _named, typed, individually-classifiable_ tool
calls. Arbitrary code execution would blind every one of those controls.

**Verdict:** Keeping discrete tools is the correct call for a regulated,
EU-AI-Act-logged product — but the trade-off is currently _implicit_. It should
be written down so future authors don't "optimize" toward a code-exec tool and
silently demolish the security posture (§4 R4).

---

## 3. Live defects found during the audit (fixed in this change)

1. **`AGENTS.md` unresolved merge conflict.** Lines 62–82 still contained raw
   `<<<<<<< / ======= / >>>>>>>` markers in the Technology Stack table. Resolved.
2. **Resend reference (CLAUDE.md Rule 4 violation).** The "Incoming" side of that
   conflict listed `Email (Resend)`; email transport is **Amazon SES only**.
   Resolved to the SES + Teams + Slack row, which removes both defects at once.

---

## 4. Prioritized recommendations

| #   | Recommendation                                                                                                                                                                                                           | Effort | Leverage    | Owner decision needed? |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ | ----------- | ---------------------- |
| R1  | Add an explicit **L1/L2/L3 context-tier section** to `AI_AGENT_GUIDELINES.md`; require new agents to declare resident vs fetched context and put SOUL prompts on a token budget.                                         | Low    | High        | No                     |
| R2  | Give `query_database` (and then `fetch_external`) a **compression + consequence-reporting wrapper** — header/row context, group-and-sample, lossless aliasing, and a "needs review" section instead of blind truncation. | Med    | **Highest** | No                     |
| R3  | Add a **"loop vs single-shot" decision rule** to §2; stop treating `callLLM` as the silent default; make authors justify which shape fits the task distribution.                                                         | Low    | Med         | No                     |
| R4  | Document the **discrete-tools-over-`execute_code` trade-off** and tie it to the RED/BLUE + allowlist security model so nobody regresses it.                                                                              | Low    | Med         | No                     |
| R5  | **Review the industry pantheon for over-segmentation.** Decide per agent: distinct task distribution, or `industryCarbonAgent(INDUSTRY=…)` in disguise? Collapse the disguises.                                          | High   | High        | **Yes**                |

R1–R4 are doc/standard changes and a tool wrapper — all GREEN-zone, no external
side effects. R5 is a strategic call for the architecture owner and is **not**
actioned here.

---

## 5. One-line verdict

DWS already has the _raw materials_ of a good vertical-agent architecture — a
clean loop, a hardened tool layer, memory/KB/skills that could be a cache
hierarchy — but it has not done the field note's two hardest, highest-value
jobs: **compressing tool outputs** (R2) and **compressing the fleet itself**
(R5). Fix those two and the rest is signposting.

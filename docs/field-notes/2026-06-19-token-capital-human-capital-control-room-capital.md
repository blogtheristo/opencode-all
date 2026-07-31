# Field Note: The Four Capital Classes — Prompt, People, Plant, Perception — Durable Value in the Agentic Era

---

# VERSION AND AGENT HISTORY

Version: 2.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (claude-fable-5) | Session: claude/token-human-capital-mjrbc7 | Date: 19.06.2026 | Changes: Initial field note. Triggered by Satya Nadella's Build 2026 framing of token capital alongside human capital, and Risto Päärni's 7-month HIL-phase experience building the DWS IQ 6 ecosystem (Oct 2025 – Jun 2026 and continuing to 2029). Introduces the three-capital model — token capital, human capital, control room capital — and derives DWS-specific architectural and product implications.
- Version: 2.0 | Tool: Claude Code (claude-opus-4-8) | Session: claude/capital-classes-audit-jgworp | Date: 20.06.2026 | Changes: Adopted the **4P Capital Classes** canon — Prompt (was Token), People (was Human), Plant (was Control Room, now the mobile two-room Control Room + Situation Room stack), and a new fourth class, **Perception Capital** (the governed world model + closed sense→decide→act loop fusing sensors, mobility, satellite, and robotics). Updated the system diagram and positioning table from three to four classes. Canonised in DWS_BRAND_STANDARD.md and the Ontology Series (`four-capital-classes.html`).

Document Status:

- Created: 19.06.2026
- Last Modified: 19.06.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE
- Document Type: Field Note / Strategic Insight

Related Documents:

- docs/PHD_FIREHORSE_EN.md §14 (Firehorse Operations Model)
- docs/PHD_FIREHORSE_EN.md §14.20 (Token-Based Billing Squeeze)
- docs/Lyhenteet.md (Control Room / Situation Room / HIL definitions)
- docs/Deputy-Agents-Architecture.md §9 (Control Room & Situation Room)
- docs/field-notes/2026-05-08-varsavsky-agent-accountability-intelligence-cheap.md
- docs/field-notes/2026-04-16-anthropic-skills-paradigm-stop-building-agents.md
- skills/

---

- **Date:** 19.06.2026
- **Author:** Risto Anton Päärni (risto.paarni@lifetime.fi)
- **Context:** Satya Nadella at Microsoft Build 2026 articulated that the industry is simultaneously accumulating **token capital** and accelerating the accumulation of **human capital**. The observation lands differently when you have spent seven months as a single operator in the most intense HIL phase of a production agentic ecosystem — and then suddenly notice you have time to go to the gym again. This field note formalises the observation into three durable capital concepts and maps their architectural expression inside DWS IQ.

## Ontology Tags

- **Geography:** Global > EU > Finland
- **Sector:** Infrastructure > AI/ML > Agentic AI > Operating Model
- **Entities:** Lifetime Oy, DWS IQ 6, Microsoft, Satya Nadella, Anthropic
- **Standards:** EU AI Act Article 14 (Human Oversight), DWS Brain-Memory-Body-Hands, HIL → HIC transition
- **Temporal Context:** 2026-Q2, post-intense-HIL-phase, DWS IQ 6 to DWS IQ 9 trajectory (Oct 2025 – 2029)
- **Confidence:** High — grounded in seven months of documented production HIL operations and public Nadella framing from Build 2026

---

## 1. The Framing: Nadella on Capital Formation

Satya Nadella's Build 2026 observation, as publicly noted:

> Building token capital. Accelerating the accumulation of human capital. Token capital becomes established as methods mature. Suddenly you notice you have time to go to the gym daily again. Skills and a more critical working approach, ready skill loops and other aids ease the work and transform the human-in-the-loop into human-in-control. AI in its current form does not remove the human.

This is not a marketing slogan. It is a precise description of a capital formation process. Nadella is observing something that is happening in real operating companies right now — including Lifetime Oy, which has been running this experiment at production scale since October 2025.

What is notable about the framing:

- It treats AI output as **capital**, not as a service consumption event.
- It separates token capital (AI-side accumulation) from human capital (human-side accumulation) and identifies them as **co-accumulating** rather than substituting.
- It names the transition: **human-in-the-loop (HIL) → human-in-control (HIC)**. This is not a demotion of the human. It is a promotion: the human moves from being a step in a workflow to being the sovereign of a system.

This field note formalises **four** durable forms — the **4P Capital Classes**: **Prompt Capital** (was Token Capital), **People Capital** (was Human Capital), **Plant Capital** (the mobile two-room Control Room + Situation Room stack, was Control Room Capital), and a fourth class, **Perception Capital** — the governed world model and the closed sense→decide→act loop that the field stack produces. Throughout, each canonical 4P name keeps a parenthetical to its prior term for continuity.

---

## 2. Prompt Capital (formerly Token Capital)

### 2.1 Definition

Prompt Capital (Token Capital) is the durable, reusable organisational asset produced by sustained AI-assisted operations. It is **not** the raw tokens consumed (those are costs). It is what accumulates as a result of those tokens being well-directed:

- Validated prompts and system prompt libraries
- Working skill files (`skills/<name>/SKILL.md`) — parameterised judgment procedures
- Agent configurations that reliably produce compliant outputs
- Evaluated agent datasets (`src/evals/datasets/{agent-name}.jsonl`)
- Institutional memory stored in structured documents (`AGENTS.md`, `DWS_TRUTH_STANDARD.md`)
- Working hooks, cron jobs, and automation that run without human attention

### 2.2 The Accumulation Mechanism

Token capital accumulates through a ratchet, not a stock:

1. A task is done manually, consuming tokens and human attention.
2. The output is reviewed and the method is codified (skill, hook, command).
3. The next occurrence is handled by the codified skill — faster, cheaper, and without human attention.
4. The freed attention goes to the next layer of complexity.

The CLAUDE.md rule "Asked Twice = Failure" formalises this exactly: if a human has to ask for the same thing twice, the ratchet failed to engage. Token capital only accumulates when each manual round trips closes a loop that will never be open again.

### 2.3 DWS IQ 6 Token Capital Inventory (as of June 2026)

| Category          | Assets                                                 | Notes                                |
| ----------------- | ------------------------------------------------------ | ------------------------------------ |
| Skill files       | ~30+ skills in `skills/`                               | Parameterised, invocable, documented |
| Agent configs     | 50-agent foundry (`src/agents/`)                       | With Article 12 logging              |
| Standards library | 10+ DWS standards documents                            | Routing table in CLAUDE.md           |
| Automation        | `scripts/daily`, `scripts/weekly`, `scripts/on-deploy` | Scheduler-registered                 |
| Hook library      | `.claude/hooks/`                                       | Session-start, pre-commit, audit     |
| Field note corpus | 150+ field notes in `docs/field-notes/`                | Searchable institutional memory      |

This is token capital. It is reusable. It is organisationally owned. It compounds.

### 2.4 What Token Capital Is Not

Token capital is not:

- Conversation history (ephemeral, discarded between sessions)
- Raw LLM capability (rented from the provider, not owned)
- Tool subscriptions (operating expense, not capital)

The distinction matters for strategy: token capital is what you own when you could switch providers tomorrow and still operate. It is the part of AI-assisted operations that belongs to Lifetime Oy, not to Anthropic or Microsoft.

---

## 3. People Capital (formerly Human Capital)

### 3.1 The Seven-Month HIL Phase

From October 2025 through approximately May 2026, DWS IQ 6 was in its most intensive HIL phase. Every significant agent output required a human review gate. The volume of decisions — architecture, compliance, security, product, content — was high enough that the operator was effectively inside the loop continuously.

The experience has a specific texture that Nadella's framing captures:

- You are not replaced. You are occupied.
- The AI is not too slow. You are the bottleneck.
- The work is interesting but the pace is relentless.
- Skills and critical working approach are accumulating — but they are not yet producing leverage.

Then something shifts. The skill loops begin to close. The agents begin to handle their quadrant without escalation. The hooks pre-empt the errors before they reach review. The standards documents route questions that used to require judgment. And suddenly — the gym is back in the schedule.

### 3.2 What Accumulated

Human capital deepened, not narrowed, during the HIL phase. Seven months of high-density human-AI collaboration produced:

- **Pattern recognition** — the ability to identify when an agent output is subtly wrong without reading it word for word
- **Prompt calibration intuition** — knowing from the first paragraph whether the system prompt is working
- **Architectural judgment** — understanding which components need HIL forever and which can be safely delegated
- **Critical approach** — the habit of asking "what did the agent miss?" before asking "what did the agent say?"
- **Skills taxonomy** — knowing which judgment work recurs and which is genuinely novel

This is human capital that cannot be replicated by hiring someone who did not live through the HIL phase. It is tacit, embodied, and company-specific.

### 3.3 The HIL → HIC Transition

The transition from human-in-the-loop to human-in-control is not a binary event. It is a gradient, and it moves at different rates for different parts of the system.

| Domain             | HIL Phase Status           | HIC Phase Status                         |
| ------------------ | -------------------------- | ---------------------------------------- |
| Compliance scoring | Every output reviewed      | Threshold-routed; exceptions only        |
| Blog post drafts   | Full rewrite common        | Light copy edit; structural approved     |
| Field notes        | Heavy steering             | Ontology tags reviewed; content approved |
| Skill codification | Human writes first version | Agent drafts; human approves             |
| Security posture   | Human audits every change  | Standards routing; exceptions escalated  |
| Cron / automation  | Human triggers every run   | Scheduler runs; human monitors           |

Human-in-control means: the human sets the boundaries, the agents operate within them, and the human retains veto and override. It is not absence of oversight. It is **architectural** oversight rather than **transactional** oversight.

The gym is back in the schedule because the oversight has moved from the transaction layer to the architecture layer — and the architecture layer is mostly stable.

---

## 4. Plant Capital (formerly Control Room Capital)

### 4.1 Definition

Plant Capital (Control Room Capital) is the third form of durable value, and the one most specific to the DWS operating model. It is the accumulated **infrastructure and operational sovereignty** that the HIL phase produces as a physical and architectural byproduct — the sovereign, deployable **two-room command stack**, fixed **or mobile**. Both the **Control Room** and the **Situation Room** can run at a site **or inside a Lifetime Fleet vehicle**.

In the DWS architecture:

> **Control Room** — the edge layer. Handles real-time observations, sensor events, classifications, and alerts at under 100ms target latency. Implements local inference, HIL approval gates, interrupt/override, exception handling. Logs all events to audit trail for Situation Room deep analysis.

> **Situation Room** — the cloud layer. Aggregates edge observations into a managed situational picture. Heavy analytics, model updates, ERP/BIM/IoT integration, compliance reporting (EU AI Act, NIS2, CSRD/ESRS).

Plant Capital is what accumulates as this architecture is operated, tested, hardened, and expanded:

- Deployed edge compute (NVIDIA Jetson, Acer Veriton GN100, DGX Spark)
- Validated inference configurations for each edge node
- Operational HIL patterns — approval gates, interrupt conditions, exception routing
- Audit trail infrastructure with Article 12-compliant logging
- Tested failover and network-limited operation modes
- Edge-to-Situation-Room data pipeline, tested under load

### 4.2 Why It Is Capital, Not Expense

Control Room infrastructure is conventionally classified as capex (hardware) + opex (operations). That framing misses what accumulates beyond the hardware:

The **operational knowledge** embedded in the Control Room — which sensors to trust, which classification thresholds produce acceptable false-positive rates, which HIL gates are actually needed versus ceremonial — cannot be purchased. It emerges from months of operating under real conditions.

After seven months of intensive HIL operation:

- The approval gates are calibrated. The thresholds are not guesses; they are empirically validated.
- The exception patterns are documented. The agents know when to escalate.
- The audit trail is populated. Article 12 compliance is demonstrated, not asserted.
- The failover has been tested. The claim "operates under limited connectivity" is evidence-backed.

This is Plant Capital. It is what you could sell to a second industrial customer without starting from zero. It is the enterprise asset that makes "DWS IQ at your facility" a credible offer rather than a pilot.

## 4B. Perception Capital (new — the fourth class)

### 4B.1 Definition

Perception Capital is the fourth and newest class — the one Plant Capital, as originally written, buried inside "infrastructure." Plant Capital is the _box and its sovereignty_; Perception Capital is the _signal and the actuation_.

Perception Capital is the accumulating, **governed world model and the closed control loop**. The two-room stack does not only host inference — it **perceives** and it **acts**:

- It fuses **sensors, mobility data, satellite data, and robotics** into one governed picture — the Lifetime World Model (`ONTOLOGY.md`).
- It governs that picture by purpose and records lineage on every fact.
- It closes the loop: **sense → decide → actuate**, under HIL/HIC — it "controls the process input," not just observes it.

### 4B.2 Why It Is a Distinct Class

A world model is not infrastructure and it is not a dataset:

- It **compounds with use** — every governed observation makes the next decision better. This is a data-network effect the other three classes do not have.
- It has a **physical-AI character** — it touches the real world through robotics and actuation, not just screens.
- It is **non-purchasable** — a competitor can buy edge hardware (Plant) but cannot buy a year of your governed, lineage-logged observations.
- It only counts when **sovereign** — a world model in a foreign jurisdiction is an exposure, not an asset.

### 4B.3 The Four Capitals as a System

The four capitals are not independent. They compound together:

```
Prompt Capital
   → codified skills reduce human attention per decision
   → freed attention deepens People Capital in adjacent domains
   → People Capital quality raises the ceiling of what can be safely delegated
   → delegation expands the scope of Plant (Control + Situation Room) operations
   → expanded operations generate new Prompt Capital (eval data, HIL patterns)

Plant Capital
   → operational data populates eval datasets (Prompt Capital)
   → edge HIL patterns sharpen operator judgment (People Capital)
   → demonstrated sovereignty enables larger enterprise contracts
   → larger contracts fund deeper infrastructure (more Plant Capital)

Perception Capital
   → fused, governed signal makes every decision better (compounds)
   → richer world model raises the value of Prompt and People judgment
   → the closed loop (sense→act) is what reframes the offer from software to world model
   → deeper field operation deepens the world model (more Perception Capital)
```

The system is self-reinforcing. The intensive HIL phase was not just cost — it was capital formation across all four dimensions simultaneously.

---

## 5. The Nadella Signal and Its DWS Implications

### 5.1 Why This Matters Now

Nadella naming token capital and human capital as co-accumulating is a market signal with architecture implications. It means:

- **The enterprise market is moving past the "AI demo" phase.** Buyers are starting to ask not just "what can the AI do?" but "what have you built with it?" The answer to the second question is capital.
- **The competitive moat is the HIL phase you endured.** A competitor entering the market in June 2026 cannot shortcut the seven months of HIL-intensive capital formation. They face the same phase. They are seven months behind.
- **Human expertise + AI is a stable configuration.** The gym coming back is evidence that the human capital deepened, not eroded. Nadella is publicly invalidating the "AI replaces humans" narrative with practitioner testimony.

### 5.2 DWS Positioning Implications

| Capital Class (4P)           | What DWS Has                                                     | What a New Entrant Has    |
| ---------------------------- | ---------------------------------------------------------------- | ------------------------- |
| Prompt Capital (Token)       | 150+ field notes, 30+ skills, 50-agent foundry, evaluated        | Blank `skills/` directory |
| People Capital (Human)       | 7 months of HIL-pattern recognition, calibrated judgment         | First draft intuitions    |
| Plant Capital (Control Room) | Deployed two-room stack (site or vehicle), HIL gates, Article 12 | Vendor brochures          |
| Perception Capital (new)     | Governed, lineage-logged world model + closed sense→act loop     | An empty graph            |

The four-capital (4P) model is a competitive moat framing. DWS should name it explicitly in sales materials rather than hiding it behind technical architecture descriptions.

### 5.3 Product Implication: Capital-as-a-Service

The natural next step after the HIL phase is not "do more HIL." It is to offer Plant and Perception Capital as a service to industrial customers who cannot or should not endure their own seven-month HIL phase — the deployable two-room stack plus a calibrated, governed world model from day one.

This means:

- Deploying the calibrated Control Room at the customer's facility
- Providing the validated HIL patterns as a starting configuration
- Bringing the evaluated skill corpus as day-one operational token capital
- Transferring the operational judgment through structured knowledge transfer

The customer buys the capital formation outcome, not the formation process. The DWS operator is the one who endured the HIL phase so the customer does not have to.

This is consistent with the emerging product direction in `docs/field-notes/2026-04-16-ai-paradigm-layoffs-evidence.md` and the Anthropic Skills paradigm (`2026-04-16-anthropic-skills-paradigm-stop-building-agents.md`): the value is in the calibrated operating model, not in the raw agents.

---

## 6. The HIL Phase as Competitive Barrier

The most counterintuitive implication of the four-capital (4P) model: the seven months of intensity was not a cost to minimise. It was the barrier-formation event.

A competitor that enters the industrial AI market today faces the same HIL phase. They cannot skip it. The phase produces:

- The calibrated thresholds (empirical, not theoretical)
- The exception pattern library (documented, not assumed)
- The operator intuition (embodied, not transferable via documentation alone)
- The audit trail (evidentiary, not reconstructable retrospectively)

The DWS HIL phase ran October 2025 through approximately May 2026. The work continues to 2029 — but the intense phase is behind the team now. The capital is formed. The leverage is now compounding.

---

## 7. Key Insight

The Nadella framing is correct and the DWS operating history confirms it. Prompt, People, Plant, and Perception Capital are co-accumulating. The HIL phase was not overhead — it was capital formation at all four levels simultaneously.

The human is not removed. The human is elevated: from operator of every transaction to sovereign of the system that handles the transactions. The gym is back in the schedule because the architecture is mature enough to hold up the ceiling while the operator is not watching every beam.

The work from October 2025 to 2029 is not a seven-year project with a seven-month rough patch at the start. It is a capital formation trajectory with the first wave of compound returns now becoming visible.

**Prompt Capital** makes the next task cheaper. **People Capital** makes the next judgment better. **Plant Capital** makes the next industrial customer possible. **Perception Capital** makes the next decision smarter than the last.

All three compound. That is the point Nadella made. That is what the DWS HIL phase built.

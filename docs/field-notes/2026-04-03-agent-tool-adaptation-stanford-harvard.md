# Agent-Supervised Tool Adaptation — Stanford/Harvard Paper Lab Note

VERSION AND AGENT HISTORY
Version: 1.0
Date: 2026-04-03
Author: Claude Opus 4.6 + Human Review
Branch: claude/agent-tool-adaptation-7jpgj
Owner: Lifetime Oy
Status: Active
Related: AGENTS.md, docs/field-notes/2026-03-26-cli-for-agents-design-patterns.md
---

## Paper

**Title:** Adaptation of Agentic AI
**Source:** Stanford University + Harvard University (2026)
**Relevance to DWS:** Direct — DWS IQ 6 is a multi-agent orchestration platform

## Core Problem

Most agentic AI systems demo well but collapse in production. Root causes:

1. **Hallucinated tool calls** — agents invoke tools that don't exist or with wrong parameters
2. **Long-term planning failure** — agents lose coherence across multi-step workflows
3. **Tool abandonment under fine-tuning** — when you reward only final-answer correctness, the model learns to skip tools and guess instead

## Fatal Flaw: Final-Answer Reward

When developers fine-tune the core LLM to produce better final answers, the model optimizes for shortcutting:

- Stops using calculators, tries to do math in-context
- Stops using search, tries to recall from training data
- Stops using APIs, tries to hallucinate responses

**The model literally learns to not use its tools.** Reward signal says "right answer = good" so the model skips the tool overhead when it thinks it can guess correctly. This works on benchmarks and fails catastrophically on real data.

## The Fix: 4-Part Adaptation Framework

The researchers propose four adaptation layers:

| Layer | What Adapts | Brain Changes? |
|-------|------------|---------------|
| 1. Model fine-tuning | The LLM weights | Yes (expensive, risky) |
| 2. Prompt/context adaptation | Instructions, examples | No |
| 3. Memory adaptation | What the agent remembers | No |
| 4. **Tool adaptation** | The tools themselves | **No** |

## Key Insight: Freeze the Brain, Adapt the Tools

**Agent-Supervised Tool Adaptation (ASTA):**

Instead of retraining the LLM, use the LLM to:
- Dynamically build better memory systems
- Update its own search/retrieval policies
- Write custom sub-tools on the fly
- Improve tool descriptions and schemas

The base model stays frozen. The operating environment gets smarter.

**Analogy:** The most effective employees don't memorize the company handbook. They build a better filing system.

## Implications for DWS IQ 6

This paper validates several DWS architectural decisions and challenges others:

### Already Aligned

1. **MCP tool architecture** — Tools are external, discoverable, and updatable without touching the LLM. DWS agents call tools via MCP JSON-RPC, not via fine-tuned model behavior.

2. **CLI-first design** — Every agent exposes `dws run <agent>` with structured JSON I/O. Tools are first-class, not afterthoughts baked into prompts.

3. **Skills as tool descriptors** — `.claude/commands/*.md` and `skills/*/SKILL.md` are essentially tool adaptation layers. We update how tools are described and invoked without changing the model.

4. **Deterministic scoring** — DWS agents use deterministic scoring functions (not LLM judgment) for compliance scores. This avoids the "skip the tool, guess the answer" failure mode.

### Action Items

1. **Audit tool-use rates** — Add telemetry to track whether agents actually invoke their tools vs. attempting to answer from context. If tool-use drops, the reward signal is wrong.

2. **Tool self-improvement loop** — Explore letting agents update their own MCP tool descriptions based on error patterns. If an agent repeatedly fails a tool call, it should fix the schema, not retry blindly.

3. **Memory adaptation layer** — Current DWS agents are mostly stateless per-session. The paper suggests persistent, agent-curated memory (not just RAG) is the highest-ROI adaptation layer.

4. **Resist model fine-tuning pressure** — When agents fail, the instinct is to fine-tune. This paper says: fix the tools first, fix the memory second, fix the prompts third, fine-tune last.

## One-Line Takeaway

> Don't make the brain memorize the factory floor — make the factory floor legible to any brain.

## References

- Paper: "Adaptation of Agentic AI" (Stanford + Harvard, 2026)
- Related DWS docs: AGENTS.md (agent architecture), CLI design patterns field note
- Related concept: 12 Factor Agents (docs/DWS_INFORMATION_LAYERING_STRATEGY.md)

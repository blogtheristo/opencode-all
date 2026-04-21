# Greg Brockman on Retooling Teams for Agentic Software Development

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code | Session: claude/add-ai-consulting-guidance-pDsPu | Date: 06.02.2026 | Changes: Initial field note capturing Greg Brockman's agentic development guidance

Document Status:
  - Created: 06.02.2026
  - Last Modified: 06.02.2026
  - Language: English
  - Publication Status: ACTIVE
  - Document Type: Field Note / Industry Intelligence

Related Documents:
  - docs/field-notes/2026-02-05-claude-code-agent-teams-vs-subagents.md
  - CLAUDE.md (AI Agent Behavior Guidelines)
  - docs/architecture/00-MASTER-BLUEPRINT.md
  - agentic-ai-saas-implementation-guide-en.md

---

## Summary

Greg Brockman (OpenAI co-founder) published guidance on how OpenAI is retooling their teams towards agentic software development. The key thesis: **software development is undergoing a renaissance**, and every company faces the same opportunity now. Navigating it well — like with cloud computing or the Internet — requires careful thought, not just adoption.

This is directly relevant to DWS6's AI consulting practice. We use both Claude (Anthropic) and Codex (OpenAI) in our workflows, and this field note captures actionable wisdom we can apply internally and offer as consulting guidance to clients.

---

## Ontology Tags

- **Geography:** Global (Silicon Valley origin, EU application)
- **Sector:** Technology > Software Development > AI-Augmented Engineering
- **Entities:** OpenAI, Greg Brockman, Codex, Claude Code, Anthropic, DWS IQ 6
- **Temporal Context:** 2026-Q1, Post-Codex 5.2, Agentic Development Era
- **Confidence:** High (first-party source from OpenAI leadership)

---

## The Core Insight

OpenAI's internal experience: prior to Codex 5.2, teams used it for unit tests. Now it writes essentially all the code and handles much of their operations and debugging. The gap between teams who have made this leap and those who haven't is usually **not about model capability** — it's about organizational readiness, workflow design, and cultural adoption.

This mirrors what DWS6 sees with clients: the tools (Claude Code, Codex, Cursor) are capable enough. The bottleneck is always **how teams integrate them**.

---

## Brockman's 6-Point Framework for Agentic Development

### Target State (by March 31, 2026)

1. **Agent-first interaction**: For any technical task, the tool of first resort for humans is interacting with an agent rather than using an editor or terminal
2. **Safe-by-default**: The default way humans utilize agents is explicitly evaluated as safe, but also productive enough that most workflows do not need additional permissions

### The 6 Action Items

#### 1. Try the Tools — Actively, Not Passively

- Designate an **"agents captain"** per team — the person responsible for thinking about how agents integrate into the team's workflow
- Share experiences in designated internal channels
- Run company-wide agent hackathons
- Many people got stuck thinking "is there any way it could do X" rather than just trying

**DWS6 Application:** We run both Claude Code and Codex sessions. Our agents captain role maps to the existing AgentFoundry architecture owner. We recommend clients designate the same role.

#### 2. Create Skills and AGENTS.md

- Create and maintain an `AGENTS.md` (or `CLAUDE.md`) for every project
- Update it whenever the agent does something wrong or struggles with a task
- Write skills for anything you get the agent to do, and commit them to a shared repository

**DWS6 Application:** Our `CLAUDE.md` serves this purpose. The Karpathy principles in our CLAUDE.md are a direct implementation of this pattern. We maintain field notes (this directory) as our institutional memory of what agents struggle with.

#### 3. Inventory and Make Accessible Internal Tools

- Maintain a list of tools your team relies on
- Make them agent-accessible (CLI or MCP server)

**DWS6 Application:** Our `mcp-hub/` and `mcp-servers/` directories implement this directly. The MCP (Model Context Protocol) architecture gives agents access to Supabase, ERP integrations, and internal tools. This is a key differentiator in our consulting offering.

#### 4. Structure Codebases to Be Agent-First

- Write tests that are quick to run
- Create high-quality interfaces between components
- This is still emerging territory with models changing fast

**DWS6 Application:** Our Vitest setup, TypeScript strict mode, and Zod schema validation are agent-friendly patterns. Interface-first design (as in our API contracts) makes code more parseable by agents. We advise clients to adopt similar patterns.

#### 5. Say No to Slop

- Managing AI-generated code at scale is an emerging problem
- Ensure some human is accountable for any code that gets merged
- Maintain at least the same code review bar as for human-written code
- Make sure the author understands what they're submitting

**DWS6 Application:** Our CLAUDE.md already addresses this with the Karpathy principles: "Ensure that some human is accountable" maps to "You are the hands; the human is the architect." Our pre-commit hooks and PR-based workflow enforce human review.

#### 6. Work on Basic Infrastructure

- Build observability for agent work
- Track not just committed code but the agent trajectories that led to them
- Centrally manage the tools that agents can use

**DWS6 Application:** Our AgentFoundry deployment infrastructure, MCP Hub session management, and the EU AI Act Article 12 logging requirements all address this. We're building "Reasoning Lineage" documentation that tracks AI decision chains — which goes beyond what Brockman describes.

---

## The Cultural Dimension

Brockman emphasizes this is **not just a technical change but a deep cultural change** with downstream implications. Key quote:

> "Every company faces the same opportunity now, and navigating it well — just like with cloud computing or the Internet — requires careful thought."

This is the foundation of DWS6's AI consulting offering. Technical tool adoption is straightforward. The hard part is:

1. **Organizational readiness** — Agents captain role, team workflows, permission models
2. **Quality governance** — Preventing "functionally-correct but poorly-maintainable code"
3. **Infrastructure investment** — Observability, trajectory tracking, central tool management
4. **Cultural shift** — Moving from "editor-first" to "agent-first" as the default interaction

---

## DWS6 Competitive Advantage: Dual-Agent Practice

DWS6 is distinctive in that we actively use **both** major agentic coding platforms:

| Platform | Provider | DWS6 Usage |
|----------|----------|------------|
| **Claude Code** | Anthropic | Primary development agent, CLAUDE.md governance, MCP integration |
| **Codex** | OpenAI | Parallel agent sessions, code generation, operations tasks |
| **Cursor** | Cursor Inc. | IDE-integrated AI assistance |

This dual-agent experience means:
- We understand the strengths and tradeoffs of each platform
- We can recommend the right tool for different organizational contexts
- We've built workflows that work across agent ecosystems
- Our consulting advice is vendor-neutral and experience-based

---

## Consulting Implications: What We Offer Clients

Based on Brockman's framework and our own experience, DWS6 can offer AI consulting across all six dimensions:

### 1. Agentic Development Assessment
- Evaluate current team workflows and agent adoption maturity
- Identify quick wins and blockers
- Benchmark against Brockman's target state

### 2. AGENTS.md / CLAUDE.md Workshop
- Help teams create and maintain agent instruction files
- Transfer our Karpathy-principles-based approach
- Set up skills repositories

### 3. Tool Accessibility Audit
- Inventory internal tools and assess agent-accessibility
- Design MCP server architecture for internal tooling
- Implement CLI wrappers for agent consumption

### 4. Agent-First Codebase Restructuring
- Assess codebase readiness for agentic development
- Implement quick-running test suites
- Design clean component interfaces
- Set up TypeScript strict mode, Zod validation, interface-first patterns

### 5. AI Code Quality Governance
- Design code review processes for AI-generated code
- Set up pre-commit hooks and automated quality gates
- Train reviewers on AI-specific code review patterns
- Establish accountability frameworks

### 6. Agentic Infrastructure Setup
- Deploy observability for agent workflows
- Set up trajectory tracking (agent actions that led to code changes)
- Implement central agent tool management
- EU AI Act Article 12 compliance logging

---

## Key Quotes

> "Prior to then, they could use Codex for unit tests; now it writes essentially all the code and does a great deal of their operations and debugging. Not everyone has yet made that leap, but it's usually because of factors besides the capability of the model."

> "Adopting tools like Codex is not just a technical but also a deep cultural change, with a lot of downstream implications to figure out."

> "Every company faces the same opportunity now, and navigating it well — just like with cloud computing or the Internet — requires careful thought."

---

## Action Items

- [ ] Reference this field note in AI consulting product page
- [ ] Update CLAUDE.md to cross-reference Brockman's agents captain concept
- [ ] Create "Agentic Development Assessment" consulting offering
- [ ] Build workshop materials for AGENTS.md/CLAUDE.md creation
- [ ] Add AI consulting service to dws10.com product catalog
- [ ] Develop pricing model for AI consulting engagements

---

## Next Steps

1. **Create AI consulting product page** on dws10.com showing this capability
2. **Develop workshop curriculum** based on Brockman's 6-point framework
3. **Document internal practices** that demonstrate we practice what we preach
4. **Price the offering** — this sits alongside existing hourly (EUR 350/hr) and retainer (EUR 5,000/mo) services

---

**Document Version:** 1.0
**Field Note Type:** Industry Intelligence / Competitive Analysis
**Source:** Greg Brockman (OpenAI), February 2026

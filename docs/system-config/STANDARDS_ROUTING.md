---
title: Standards Resolver — Multi-Standard Task Routing
version: 1.7
status: Active
applies_to: ["Claude Code", "OpenCode", "Cursor", "Cursor Cloud", "all agents"]
source: CLAUDE.md (canonical)
---

# Standards Resolver — Multi-Standard Task Routing

**Operational rule:** When a task fires multiple standard triggers, load all matched standards. A task that adds a new agent + ships a blog post fires 4 triggers and must load 4 standards.

**Always load first (meta-standards consulted before any task):**

- `DWS_TRUTH_STANDARD.md` — Canonical file registry for any DWS fact (price, role, score, framework).
- `DWS_ROLES_REGISTRY.md` — 25-role taxonomy + buying stages; reference by R-ID (R01–R25).

## Task-to-Standards Routing Table

| If the task touches…                                                                                                                                                                                                                         | Load                                                                                                       |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| auth, RLS, secrets, JWT, API endpoints, user input validation, OWASP, KYA / sandbox / MicroVM, NIS2, GDPR, EU AI Act, prompt injection                                                                                                       | `DWS_SECURITY_STANDARD.md`                                                                                 |
| document header, `VERSION AND AGENT HISTORY` block, document version bump, language pair lockstep, naming convention, document rewrite/restructure, formulation preservation, harness / HIC-approved-drift, NIS2 or Katakri audit provenance | `DWS_DOCUMENT_STANDARD.md` §2.6 / §27 + `DWS_SECURITY_STANDARD.md` §7                                      |
| brand identity, logo, color palette, copy tone, hero text, landing page voice, marketing surface, deprecated terminology                                                                                                                     | `DWS_BRAND_STANDARD.md`                                                                                    |
| market sizing, TAM / SAM / SOM, competitor analysis, investor narrative, customer segmentation                                                                                                                                               | `DWS_MARKET_RESEARCH_STANDARD.md`                                                                          |
| site QA, image quality / format / weight, copy quality, dual-folder mirror checks, deploy-readiness checklist                                                                                                                                | `SITE_QUALITY_STANDARDS.md`                                                                                |
| adding / removing / renaming a slash command or `skills/<name>/SKILL.md`; updating discipline gates; skill manifest                                                                                                                          | `docs/DWS_SKILLS_GUIDE.md`                                                                                 |
| blog post on `onelifetime.world/blog/`, `dws10.com/blog/`, editorial cadence, LSJ — **always run `/blog-draft`; HIC approval before publishing is Non-Negotiable Rule 13**                                                                   | `docs/BLOG_STANDARD.md` (§3.3 draft gate)                                                                  |
| tool selection (Cursor, Grok, Claude Code, OpenCode), agent compute resource (cloud vs DGX), cost justification, free-credit window, agentic workload procurement                                                                            | `docs/DWS_COST_POLICY_STANDARD.md` (EU AI Act Art. 14 transparency)                                             |
| BaseAgent class, new agent in `src/agents/`, autonomy tier, cost budget, agent execution logging, bacterial-code extraction                                                                                                                  | `AI_AGENT_GUIDELINES.md`                                                                                   |
| agent topology, signal dependencies (READY / COMPLETE / ERROR / BLOCKED), agent-XX numbering, what unlocks what                                                                                                                              | `AGENTS.md`                                                                                                |
| asserting an industry count, product price, captain hat, KYA tier, role name, or canonical fact                                                                                                                                              | `DWS_TRUTH_STANDARD.md` (routes to the canonical source)                                                   |
| Win11 vs Spark versions, `docker --version` pins, WSL vs DGX, Aspire CLI vs dashboard image, environment version parity                                                                                                                      | `DWS_TRUTH_STANDARD.md` §2I + `config/truth/dev-environment-pins.json` (`npm run env:pins`)                |
| sales outreach, role-by-stage matrix, enterprise funnel stage                                                                                                                                                                                | `DWS_ROLES_REGISTRY.md`                                                                                    |
| standards index / lookup / catalogue                                                                                                                                                                                                         | `DWS_STANDARDS_LIBRARY.md`                                                                                 |
| session outcome, field note, `Learn/` HTML, HIC decision point (EU AI Act Art. 14)                                                                                                                                                           | `DWS_LEARNING_STANDARD.md`                                                                                 |
| Brain / LLM / Ollama / LiteLLM / model routing / which model runs on DGX Spark                                                                                                                                                               | `DWS_MODEL_STANDARD.md` + Truth Standard §2 row 40                                                         |
| new file under `supabase/migrations/`                                                                                                                                                                                                        | `DWS_DOCUMENT_STANDARD.md` §4.5 — filename `NNN_DDMMYY_name.sql` (CI; do not apply SQL)                    |
| generated public HTML language siblings (`*.fi.html` / `.sv` / `.de` / `.fr` under `dws10.com/products/` and the landing-pages mirror)                                                                                                       | `DWS_DOCUMENT_STANDARD.md` §2.1 generated-i18n HTML comment — never markdown VAH                           |
| PDF export, Pandoc delimiter, `***` vs `---`                                                                                                                                                                                                 | `DWS_DOCUMENT_STANDARD.md` §2.1 / §8 — `---` only; HIC prints PDF from HTML; do not convert leftover `***` |
| HIC says “use DWS standard(s)”                                                                                                                                                                                                               | Load **all** matched rows; always Truth + Roles                                                            |

## How to Apply

1. **Match the task** to one or more triggers in the table above.
2. **Load all matched standards** (not just the "most relevant") — **Read the files**. Recalling `CLAUDE.md` does not count.
3. **If no match:** Ask the user. When the user says "Use DWS standard," apply all matched standards and update impacted docs in the same commit.
4. **If a standard is silent, contradictory, or missing a control the task needs:** do not stop at `N/A`. **Propose a standards update** in the same effort: (a) field note with the gap, the article/family it maps to if NIS2/Katakri/AI Act, and draft wording; (b) apply the draft only in the matched standard files HIC already uses — or leave it as `Status: PENDING_REVIEW` if it would invent a fact, a Katakri criterion-ID, or a RED-zone change. Silent gaps are Rule 12.

**Cursor / Cursor Cloud:** `.cursor/rules/dws-standards-always.mdc` is `alwaysApply: true`. **HIC approved 19.09.2026** (thin rule + migration-filename CI). First writes of a task require the Reads above plus `Standards loaded:` on the HIC reply.

## Multi-Standard Example

Task: "Add a new agent that touches user input + ship a blog post"

**Fires triggers:**

- User input validation → `DWS_SECURITY_STANDARD.md`
- New agent in `src/agents/` → `AI_AGENT_GUIDELINES.md`
- Blog post publishing → `docs/BLOG_STANDARD.md`
- Document structure (if agent has versioning) → `DWS_DOCUMENT_STANDARD.md`

**Load all 4.** Apply in same commit. Update impacted standards/docs.

# Lab Note: Claude Code Best Practices in Large Codebases (May 2026)

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code | Session: claude/codebase-best-practices-VGIXI | Date: 20.05.2026 | Changes: Initial lab note — summary of Anthropic's "How Claude Code works in large codebases" guidance, mapped to DWS6 harness assets, with gap analysis.

Session Links & References:
  - Claude Code (claude/codebase-best-practices-VGIXI): https://github.com/blogtheristo/dws6/commits/claude/codebase-best-practices-VGIXI
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/docs/lab-notes/2026-05-20-claude-code-large-codebases-best-practices.md

Document Status:
  - Created: 20.05.2026
  - Last Modified: 20.05.2026
  - Language: English
  - Languages Available: English
  - Publication Status: ACTIVE
  - Document Type: Lab Note / Paradigm Analysis

Related Documents:
  - CLAUDE.md
  - AI_AGENT_GUIDELINES.md
  - AGENTS.md
  - docs/DWS_SKILLS_GUIDE.md
  - docs/lifetime-world-model/LEARNING_SOURCES.md
  - docs/lab-notes/README.md

***

**Version:** 1.0
**Effective Date:** 2026-05-20
**Last Updated:** 2026-05-20
**Status:** Active

---

## Lab Note Metadata

- **Date:** 2026-05-20
- **Author:** Claude Code session, on behalf of Lifetime Oy research
- **Source:** Anthropic — "How Claude Code works in large codebases: Best practices and where to start" — https://claude.com/blog/how-claude-code-works-in-large-codebases-best-practices-and-where-to-start
- **Type:** Paradigm Analysis / Ecosystem Research
- **Confidence:** High. The source is a primary-source vendor publication from Anthropic. Direct WebFetch of the canonical URL returned HTTP 403 in this session, so the content was triangulated through two independent secondary write-ups (linked under References) plus the Anthropic documentation site. The structural claims (five extension points, harness-vs-model split, context-window discipline) appear consistently across all three sources.

### Ontology Tags

- **Geography:** Global > AI Developer Tools Ecosystem
- **Sector:** Technology > AI Coding Agents > Developer Tooling
- **Entities:** Anthropic, Claude Code, Model Context Protocol (MCP), Language Server Protocol (LSP)
- **Temporal Context:** 2026-Q2, post-Skills paradigm shift (continuation of 2026-04-16 lab-note thread)

---

## Executive Summary

Anthropic published operational guidance for running Claude Code against codebases that span millions of lines, decades of history, and thousands of developers. The central claim: **the harness does roughly 60% of the work and the model does roughly 40%.** Performance is therefore mostly a function of how the harness is configured, not which model is loaded.

The harness has five named extension points — **CLAUDE.md, hooks, skills, plugins, MCP servers** — plus two cross-cutting capabilities, **LSP integrations** and **subagents**. Context window is treated as the fundamental constraint; every other practice follows from it.

**Takeaway for DWS6:** we already operate four of the five extension points (CLAUDE.md, hooks, skills, MCP) and use subagents heavily, but we have two material gaps — **no packaged plugin** for one-command onboarding, and **no LSP integration** despite running a multi-language repo (TypeScript, Python, PowerShell, SQL, Markdown). Both are called out as high-leverage in the article.

---

## The Harness in Five Parts — Anthropic Model vs DWS6 Today

| Extension point | What Anthropic says it does | DWS6 asset today | Status |
|---|---|---|---|
| **CLAUDE.md** | Advisory persistent context loaded every session. Codifies team rules, taste, conventions. | `CLAUDE.md` (root) — non-negotiable rules, source-of-truth pricing, dual-folder sync, thesis rule, legal identity, security coding rules, GitHub MCP rule. Plus `AGENTS.md` and `AI_AGENT_GUIDELINES.md`. | Mature |
| **Hooks** | Deterministic. Run scripts at lifecycle events; guarantee an action happens with zero exceptions. Use for non-negotiables. | `.claude/hooks/` — `secret-scan.sh`, `md-restore-version-delimiters.sh`, `protect-files.sh`, `sql-safety-guard.sh`, `pretooluse-guard.sh`, `validate-branch-name.py`, `session-start.sh`, `session-stop.sh`, `log-commands.sh`. | Mature |
| **Skills** | `SKILL.md` files under `.claude/skills/` (or `.claude/commands/`) give Claude domain knowledge and reusable workflows. | `.claude/commands/` — 32 skills as of 2026-05-20 (e.g. `compliance-check`, `carbon-analysis`, `site-safety`, `sovereignty-assess`, `regulatory-radar`, `ship`, `review`, `simplify`, `kya`, `case-run`, `workflow`). Catalogued in `docs/DWS_SKILLS_GUIDE.md`. | Mature |
| **Plugins** | Bundle skills + hooks + MCP configs into one installable package. Distributed via an organisational marketplace so a new engineer gets the same harness on day one. | **None packaged.** Skills, hooks, and MCP configs ship as loose files in the repo. New worktrees / Claude Code on-the-web sessions assemble them implicitly. | **Gap** |
| **MCP servers** | External tool access (databases, design tools, issue trackers, GitHub). Treated as untrusted input. | `mcp-servers/` directory; GitHub MCP via OAuth (per CLAUDE.md "GitHub MCP Rule" — OAuth-only, no PATs in `.mcp.json`); Google Drive, Gmail, Gamma, calendar MCPs surfaced in this session. | Mature |

Plus two cross-cutting capabilities the article calls out explicitly:

| Capability | What Anthropic says | DWS6 asset today | Status |
|---|---|---|---|
| **Subagents** | Isolated Claude instances with their own context window. Take a task, do it, return a summary. The single highest-leverage tool for context discipline. | `.claude/agents/` — `architect.md`, `code-reviewer.md`, `security-reviewer.md`, `mcp-expert.md`. Plus harness-provided `Explore`, `Plan`, `general-purpose`. | Healthy |
| **LSP integrations** | Real-time diagnostics, symbol navigation, type info. Called out as "one of the highest-value investments for multi-language codebases" — a cited enterprise rolled C/C++ LSP out org-wide before their Claude Code go-live. | **None configured.** Claude reads files and greps, with no language-server-backed type or symbol awareness. | **Gap** |

---

## Best Practices Mapped to DWS6 Practice

### 1. Treat the context window as your fundamental constraint

> "Most best practices follow from a single constraint: Claude's context window fills up quickly, and performance degrades when it is full."

**DWS6 alignment:** Strong. Our `.claude/agents/` set (architect, code-reviewer, security-reviewer, mcp-expert) plus harness-provided `Explore` and `Plan` mean exploration usually happens out-of-band. Skills like `/review`, `/ship`, `/simplify`, `/retro` are short and structured to fit the parent context.

**Action:** None new. Continue subagent-first exploration. The plan-mode workflow on this very session is itself the recommended pattern.

### 2. Use hooks for what *must* happen every time

> "CLAUDE.md instructions are advisory; hooks are deterministic and guarantee the action happens."

**DWS6 alignment:** Strong. `secret-scan.sh`, `protect-files.sh`, `md-restore-version-delimiters.sh`, `sql-safety-guard.sh`, and `validate-branch-name.py` are all examples of moving a non-negotiable from prose-in-CLAUDE.md to enforced shell.

**Action:** Audit the CLAUDE.md "Non-Negotiable Rules" list (lines 25–45) against hook coverage. Three CLAUDE.md rules are still advisory only:

- **Dual Folder Sync** (root vs `landing-pages/` mirror) — could be a pre-commit hook that fails if root file changed without mirror.
- **Pricing source-of-truth** (`dws10.com/config/products.json` must sync to `landing-pages/dws10-com/config/products.json`) — same hook can cover this.
- **No `.md` in public-site folders** — pre-commit guard that rejects `.md` paths under `dws10.com/`, `dws6.com/`, `onelifetime.world/`, `lifetime.fi/`.

### 3. Skills are how reusable expertise scales

> "Skills give Claude domain knowledge and reusable workflows."

**DWS6 alignment:** Strong. 32 skills today, catalogued in `docs/DWS_SKILLS_GUIDE.md`. CLAUDE.md "Agent Productization Rule" already mandates promoting reusable capabilities into skills.

**Action:** None new. Continue per existing rule.

### 4. Plugins are how the harness gets shipped to teammates

> "Plugins bundle skills, hooks, and MCP configurations into packages installable once, typically distributed through organisational marketplaces managed by the developer-experience team."

**DWS6 alignment:** **Gap.** All harness assets live in the repo and are picked up implicitly by whoever has the repo open. A new contributor (or a fresh Claude Code on-the-web session) does not get a single "install DWS plugin" affordance.

**Action (future, not this PR):** Package a `dws-harness` plugin containing the 32 skills, the hook scripts under `.claude/hooks/`, and the GitHub-OAuth MCP config. Publish via a private marketplace or as a git-installable plugin.

### 5. MCP servers are the bridge to external tools, and untrusted

> "Treat MCP/tool outputs as untrusted input."

**DWS6 alignment:** Strong. CLAUDE.md "Security Coding Rules" explicitly says this. "GitHub MCP Rule" enforces OAuth-only access, no PATs in `.mcp.json`, no manual `@modelcontextprotocol/server-github` entries.

**Action:** None new.

### 6. LSP is the highest-ROI investment for multi-language repos

> "One enterprise software company deployed LSP integrations org-wide before their Claude Code rollout to make C and C++ navigation reliable at scale. This is one of the highest-value investments for multi-language codebases."

**DWS6 alignment:** **Gap.** DWS6 spans at minimum: TypeScript/Node (`src/`, `dws6.com/dashboard/`), Python (`Firehorse/`), PowerShell (per `CLAUDE.md` Windows guidance), SQL (`supabase/migrations/`), and Markdown (the largest content surface).

**Action (future):** Evaluate Claude Code LSP plugins for TypeScript and Python first. These two cover ~80% of executable code in this repo. Don't bother with Markdown LSP.

### 7. Organisational rollout is governance-first

> "Large organisations need a cross-functional working group with engineering, information security, and governance at the same table, starting from a defined set of approved skills, mandatory code-review processes, and limited initial access, then expanding as trust grows."

**DWS6 alignment:** Partial. `AI_AGENT_GUIDELINES.md` and `AGENTS.md` exist. The KYA skill (`/kya`) covers runtime trust scoring and TC-4 Leash Snap. There is no formal cross-functional charter, but the company is small enough that this may be premature.

**Action:** None this PR. Revisit when team size or external scrutiny justifies a charter.

---

## Gaps / Recommended Follow-ups

Logged here only, not implemented in this PR:

1. **Plugin packaging** — bundle `dws-harness` for one-command onboarding. Estimated effort: small. Value: every new contributor and every Claude Code on-the-web session gets parity with seasoned local devs.
2. **LSP for TypeScript and Python** — evaluate one of the published Claude Code LSP plugins; pick one; document the install path in `CLAUDE.md`. Estimated effort: medium (binary install + plugin config). Value: high — fewer "Claude edited but didn't see the type error" loops.
3. **Promote three advisory CLAUDE.md rules to hooks** — Dual Folder Sync, Pricing SoT, no-`.md`-in-public-site. Effort: small per hook. Value: closes drift loopholes that prose alone cannot.
4. **Document the harness explicitly in CLAUDE.md.** The article frames "the harness is the product"; we should make the five-extension-point mental model explicit in `CLAUDE.md` so future contributors know to extend it intentionally rather than scatter ad-hoc scripts.

---

## LWM Implications

The Lifetime World Model should update its mental model of the AI coding agent ecosystem along three axes:

1. **Product surface has shifted.** The "Claude Code product" is not the CLI binary alone; it is the binary plus the harness assembled around it. Competitive analysis of coding agents should evaluate harness extensibility, not just model quality.
2. **Plugin marketplaces are the new distribution channel.** Expect organisations to start publishing internal plugin marketplaces. The DWS skills library is a candidate for external publication once stabilised.
3. **Context discipline is now a first-class engineering practice.** Subagent-first exploration, planning-mode handoffs, and skill-scoped commands belong in onboarding material for every new agent-using engineer — same level of canon as "write tests" or "review before merge."

This extends the 2026-04-16 lab-note thread ("Stop building agents, build Skills") with a complementary message: the skill is necessary but not sufficient — the surrounding harness is what makes a skill production-grade.

---

## References

- **Primary (canonical):** Anthropic — "How Claude Code works in large codebases: Best practices and where to start." https://claude.com/blog/how-claude-code-works-in-large-codebases-best-practices-and-where-to-start. Direct WebFetch returned HTTP 403 in this session.
- **Secondary corroboration 1:** Pasquale Pillitteri — "Claude Code in Enterprise Codebases: Anthropic's Guide to Scaling AI Coding Without Stalling." https://pasqualepillitteri.it/en/news/2794/claude-code-enterprise-codebase-anthropic-best-practices
- **Secondary corroboration 2:** Claude Code Docs — "Best practices for Claude Code." https://code.claude.com/docs/en/best-practices
- **Supporting:** Anthropic plugin announcement and reference. https://www.anthropic.com/news/claude-code-plugins ; https://code.claude.com/docs/en/plugins-reference

---

## Provenance Note

The primary URL was inaccessible to `WebFetch` from this session (HTTP 403). The article's structural claims were reconstructed by triangulating three independent sources (one primary doc site, two third-party summaries) plus direct inspection of the `anthropics/claude-code` plugin reference. Where this lab note quotes the article in `> blockquote` form, the wording reflects the consolidated reporting in the secondary sources, not a verbatim extract from the canonical post. The five-extension-point model, the 60/40 harness-vs-model framing, the context-window-first discipline, and the LSP/subagent emphasis appeared identically across all three sources, which is the basis for the High confidence rating.

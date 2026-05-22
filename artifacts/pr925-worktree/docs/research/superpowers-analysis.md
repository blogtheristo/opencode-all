# Superpowers Framework Analysis — Lessons for DWS Standards

VERSION AND AGENT HISTORY
Version: 1.0
Created: 2026-03-18
Author: Claude Code (Opus 4.6)
Session: claude/research-superpowers-dws-AWAYB
Tool: Claude Code CLI
Status: Research Complete

## 1. Executive Summary

**obra/superpowers** (github.com/obra/superpowers, 95K+ stars, MIT license) is an agentic skills framework by Jesse Vincent that provides a structured software development methodology for AI coding agents. It enforces disciplined workflows through 14 composable skills: brainstorm → design → plan → execute → test → review → complete.

This analysis identifies 6 patterns DWS should adopt and 6 areas where DWS is already ahead.

## 2. What Superpowers Is

A plugin/skills framework installable across Claude Code, Cursor, Codex, OpenCode, and Gemini CLI. Each skill is a single `SKILL.md` file with YAML frontmatter that agents discover and load contextually.

Core philosophy: agents should follow a staged process, not jump straight to coding. Every claim of completion requires evidence. Every production change requires a failing test first.

### 2.1 Skill Catalog

| Skill                            | Purpose                                    |
| -------------------------------- | ------------------------------------------ |
| `brainstorming`                  | Socratic design refinement, 2-3 approaches |
| `writing-plans`                  | Bite-sized tasks (2-5 min each)            |
| `executing-plans`                | Batch execution with checkpoints           |
| `test-driven-development`        | RED-GREEN-REFACTOR iron law                |
| `systematic-debugging`           | 4-phase root cause analysis                |
| `verification-before-completion` | Evidence-based completion claims           |
| `dispatching-parallel-agents`    | Concurrent subagent workflows              |
| `subagent-driven-development`    | Two-stage review (spec → quality)          |
| `using-git-worktrees`            | Isolated parallel branches                 |
| `requesting-code-review`         | Pre-review validation                      |
| `receiving-code-review`          | Feedback incorporation                     |
| `finishing-a-development-branch` | Merge/PR decisions                         |
| `writing-skills`                 | Meta: creating new skills                  |
| `using-superpowers`              | System introduction                        |

## 3. Patterns DWS Should Adopt

### 3.1 Composable SKILL.md Format

**Problem:** DWS standards are monolithic documents (DWS_BRAND_STANDARD.md, DWS_SECURITY_STANDARD.md, etc.). They work as reference but cost many tokens to load and are hard for agents to discover contextually.

**Superpowers pattern:** Each skill is a self-contained file with:

- YAML frontmatter (`name`, `description` max 1024 chars)
- Standardized sections: Overview → When to Use → Core Pattern → Quick Reference → Common Mistakes
- CSO (Claude Search Optimization) — descriptions optimized for agent discovery
- Token budget: <150 words for frequent skills, <500 for others

**Recommendation:** Create `skills/` folder with bite-sized SKILL.md files extracted from existing standards. Keep monolithic standards as reference; extract actionable patterns into discoverable skills.

**Candidate skills to extract:**

- `skills/dual-folder-sync/SKILL.md` — from CLAUDE.md Store Update Rule
- `skills/safe-sql-migration/SKILL.md` — from Marcus's SQL safety rules
- `skills/eu-compliance-data/SKILL.md` — from validated mock data rules
- `skills/design-first/SKILL.md` — new, based on superpowers brainstorming gate

### 3.2 Hard Design Gate Before Implementation

**Problem:** DWS has gstack skills (`/plan-ceo-review`, `/plan-eng-review`) but they're optional. Nothing prevents an agent from jumping straight to code.

**Superpowers pattern:** Hard gate — "Do NOT invoke any implementation skill until you have presented a design and the user has approved it." For features requiring 3+ file changes.

**Recommendation:** Add to CLAUDE.md:

```
HARD GATE: For features requiring 3+ file changes, present a design with
2-3 approaches and get user approval BEFORE writing production code.
Use /plan-ceo-review for product decisions, /plan-eng-review for architecture.
```

### 3.3 TDD as Iron Law (Not Suggestion)

**Problem:** CLAUDE.md says "Test-First: Write the test, implement until it passes, show both" — one line among many, easily lost. Not enforced.

**Superpowers pattern:** "NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST." Includes rationalization table:

| Excuse                        | Counter                                          |
| ----------------------------- | ------------------------------------------------ |
| "It's a small change"         | Small changes cause big bugs                     |
| "I'll add tests after"        | You won't. Write them now                        |
| "The existing tests cover it" | Prove it — show the failing test                 |
| "It's just a refactor"        | Refactors need tests to prove behavior unchanged |

**Recommendation:** Create `skills/tdd-iron-law/SKILL.md` with the rationalization table. Particularly important for EU AI Act compliance — agent behaviors must be verifiable.

### 3.4 Verification Before Completion

**Problem:** Agents can claim "done" without running tests. DWS has Session Handover Protocol (verify clean tree) but no general verification discipline.

**Superpowers pattern:** "NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE." Red flag language: "should work," "probably," "seems," "appears."

**Recommendation:** Add to CLAUDE.md after the Output Standards section:

```
VERIFICATION GATE: Before claiming any task complete:
1. Run the relevant verification command (test, build, lint)
2. Show output as evidence
3. Never use "should work" or "probably" — only verified claims
4. If verification fails, report actual status — never false positives
```

### 3.5 Subagent Status Codes

**Problem:** DWS uses Agent tool but subagent results are free-form. No standard protocol for reporting outcomes.

**Superpowers pattern:** Four status codes:

- `DONE` — Task completed successfully
- `DONE_WITH_CONCERNS` — Completed but found issues worth noting
- `NEEDS_CONTEXT` — Blocked, needs information from parent
- `BLOCKED` — Cannot proceed, requires human intervention

**Recommendation:** Adopt these as standard in AGENTS.md. Every agent dispatch should expect one of these four statuses.

### 3.6 Claude Search Optimization (CSO)

**Problem:** DWS skill descriptions don't follow a standard format for agent discoverability.

**Superpowers pattern:** Description rules:

- Start with "Use when..." + specific symptoms/contexts
- Include keywords agents would search for
- Never summarize workflow in description (causes agents to skip reading full skill)
- Keep under 500 characters

**Assessment:** DWS skills already follow "Use when..." pattern in some descriptions (e.g., `site-safety`, `carbon-analysis`). Formalize this as a rule for all skills.

## 4. Where DWS Is Already Ahead

| Area                         | DWS Advantage                                                       | Superpowers Gap           |
| ---------------------------- | ------------------------------------------------------------------- | ------------------------- |
| **EU regulatory compliance** | Article 12 logging, GDPR, CSRD, EU AI Act, CBAM                     | Zero regulatory awareness |
| **Document traceability**    | VERSION AND AGENT HISTORY block on every document                   | No version tracking       |
| **Worktree automation**      | Full scripts with env copy, venv symlink, Docker health, MCP config | Basic git worktree usage  |
| **Security standards**       | KYA framework, sandbox stages, shell exec safety, SRI hashes        | No security coverage      |
| **Multi-standard ecosystem** | 10+ specialized standards (brand, data, security, market research)  | Development workflow only |
| **Information layering**     | Six-layer context architecture with JIT loading                     | Flat skill loading        |
| **Validated mock data**      | Every mock value needs cited source (EU ETS, IPCC, Eurostat)        | No data validation rules  |
| **Session handover**         | Structured continuation prompts across context windows              | No handover protocol      |

## 5. Implementation Priority

| Priority | Action                                       | Effort | Impact                                  |
| -------- | -------------------------------------------- | ------ | --------------------------------------- |
| P1       | Add verification gate to CLAUDE.md           | Low    | High — prevents false completion claims |
| P1       | Add hard design gate to CLAUDE.md            | Low    | High — prevents wasted implementation   |
| P2       | Create `skills/` folder with 3 sample skills | Medium | High — proves composable pattern        |
| P2       | Elevate TDD with rationalization table       | Low    | High — code quality + compliance        |
| P3       | Adopt subagent status codes in AGENTS.md     | Low    | Medium — standardizes coordination      |
| P3       | Formalize CSO rule for skill descriptions    | Low    | Medium — improves discoverability       |

## 6. Conclusion

Superpowers excels at agent discipline — forcing agents to think before coding, verify before claiming, and test before shipping. DWS excels at enterprise governance — regulatory compliance, security, traceability, and multi-domain standards.

The combination is powerful: DWS's governance depth + superpowers' discipline enforcement = agents that are both compliant and rigorous.

The key insight is that **discipline rules must be short, specific, and non-negotiable** to survive context window pressure. Long standards get skimmed; composable skills get loaded and followed.

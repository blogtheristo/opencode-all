# DWS Information Layering Strategy

***
# VERSION AND AGENT HISTORY

Version: 1.3

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Sonnet 4.6) | Session: claude/document-layering-strategy-ddhtQ | Date: 02.03.2026 | Changes: Initial creation — documents the six-layer information architecture, harness pattern, and where DWS standards fit in the stack
  - Version: 1.1 | Tool: Claude Code (Sonnet 4.6) | Session: claude/document-layering-strategy-ddhtQ | Date: 02.03.2026 | Changes: Added error recovery / TodoWrite harness pattern, Cursor & LangChain deep agent insights, worktree autoclean procedure, industry comparisons
  - Version: 1.2 | Tool: Claude Code (Sonnet 4.6) | Session: claude/document-layering-strategy-ddhtQ | Date: 02.03.2026 | Changes: Major expansion — Manus KV-cache / logit masking, SWE-agent ACI / observation compression, Devin / Windsurf / Aider / Replit architectures, progressive disclosure quantitative evidence, technique matrix, industry consensus and disagreements, DWS implications
  - Version: 1.3 | Tool: Claude Code (Sonnet 4.6) | Session: claude/document-layering-strategy-ddhtQ | Date: 02.03.2026 | Changes: Added 12 Factor Agents (Horthy / HumanLayer) full methodology and DWS mapping; updated dates to 02.03.2026 EET; finalized section structure

Session Links & References:
  - Claude Code (claude/document-layering-strategy-ddhtQ): https://claude.ai/code/session_019HYHdMZC2LwZL6H4NQUbWE
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/docs/DWS_INFORMATION_LAYERING_STRATEGY.md

Document Status:
  - Created: 02.03.2026
  - Last Modified: 02.03.2026
  - Language: English
  - Languages Available: English
  - Publication Status: ACTIVE

***

**Version:** 1.3
**Effective Date:** 2026-03-02
**Last Updated:** 2026-03-02
**Status:** Active

---

## Table of Contents

1. [Overview](#1-overview)
2. [The Six Layers](#2-the-six-layers)
3. [Where DWS Standards Fit](#3-where-dws-standards-fit)
4. [The Harness Pattern — Tool Result Injection](#4-the-harness-pattern--tool-result-injection)
5. [Error Recovery and the TodoWrite Anchor](#5-error-recovery-and-the-todowrite-anchor)
6. [Industry Comparisons](#6-industry-comparisons)
   - 6.1 LangChain Deep Agents
   - 6.2 Cursor Dynamic Context Discovery
   - 6.3 Cursor Files as Primitive
   - 6.4 Cursor Semantic Search
   - 6.5 Manus — KV-Cache Above All Else
   - 6.6 SWE-Agent — Agent-Computer Interface
   - 6.7 Other Production Systems (Devin, Windsurf, Aider, Replit)
   - 6.8 Progressive Disclosure — The Unifying Pattern
   - 6.9 Where the Industry Agrees and Disagrees
   - 6.10 Twelve Factor Agents (Horthy / HumanLayer)
7. [Layer Interaction Diagram](#7-layer-interaction-diagram)
8. [Behavioral Adherence by Layer](#8-behavioral-adherence-by-layer)
9. [Practical Rules for DWS Agents](#9-practical-rules-for-dws-agents)
10. [Worktree Autoclean After Merge](#10-worktree-autoclean-after-merge)
11. [Anti-Patterns](#11-anti-patterns) *(formerly section 8, renumbered)*
12. [References](#12-references) *(formerly section 9, renumbered)*

---

## 1. Overview

DWS IQ 6 agents operate inside a **layered information harness** — a structured stack that determines what context, rules, and knowledge an agent has available at each point in a session. Understanding this stack is prerequisite to writing reliable agents, effective CLAUDE.md instructions, and well-placed standards.

The key insight observed in the DWS codebase:

> **Tool results carry injected system reminders** — fixed text appended after every tool execution. This achieves higher behavioral adherence than system-prompt-only instructions because it repeats with every call, not just at session start.

The system prompt comprises ~110+ conditional strings (~2,896 token core). Six layers are loaded at session start. The harness pattern (tool result injection) reinforces rules throughout the session rather than only at initialization.

---

## 2. The Six Layers

Layers are ordered from lowest (most stable, widest scope) to highest (most volatile, narrowest scope). Later layers can override earlier ones when they conflict.

```
┌─────────────────────────────────────────────────────────────┐
│  L6  TOOL RESULT INJECTION  (per-call, highest repetition)  │
├─────────────────────────────────────────────────────────────┤
│  L5  SESSION STATE          (git state, in-flight context)  │
├─────────────────────────────────────────────────────────────┤
│  L4  AUTO-LEARNED STATE     (MEMORY.md, session history)    │
├─────────────────────────────────────────────────────────────┤
│  L3  USER SETTINGS          (.claude/settings.local.json)   │
├─────────────────────────────────────────────────────────────┤
│  L2  PROJECT CONTEXT        (CLAUDE.md + Standards)         │
├─────────────────────────────────────────────────────────────┤
│  L1  ORG POLICIES           (managed-settings.json)         │
├─────────────────────────────────────────────────────────────┤
│  L0  PLATFORM MODEL         (Claude base / Constitutional)  │
└─────────────────────────────────────────────────────────────┘
```

### Layer 0 — Platform Model

Claude's base training, Constitutional AI, and Anthropic safety policies. These are not configurable by DWS. They set absolute constraints: no helping with mass-harm tools, no generating CSAM, etc.

**DWS surface:** None — we operate within these constraints. The `DWS_SECURITY_STANDARD.md` aligns with, not against, L0 limits.

---

### Layer 1 — Organization Policies

**File:** `C:\Program Files\ClaudeCode\managed-settings.json` (Windows, effective 2026-03-12+; legacy path stops being read)

Organization-wide permissions applied before any project context is loaded. Controls which tools are allowed, which hosts can be contacted, and global permission overrides.

**DWS use:** Branch name validation hook (`.githooks/`), allowed tool permissions for CI/CD automation.

---

### Layer 2 — Project Context

**Primary file:** `CLAUDE.md` (repo root, loaded at session start)

**Sub-files (loaded on demand):**
- `DWS_BRAND_STANDARD.md`
- `DWS_DOCUMENT_STANDARD.md`
- `DWS_SECURITY_STANDARD.md`
- `Admin/SECURITY_COMPLIANCE.md`
- `UI_SKILLS_GAMMA.md`
- `DWS_MARKET_RESEARCH_STANDARD.md`
- `SITE_QUALITY_STANDARDS.md`
- `docs/CLOUD_ENVIRONMENTS.md`
- `product-catalog/README.md`

This is the most important layer for DWS-specific behavior. It contains:
- Behavioral rules (Karpathy principles, push-back, assumption surfacing)
- Critical file format rules (Store YAML vs DWS Document Standard)
- Git workflow rules (branch naming, auto-push, worktree)
- Security coding rules (execFile, CORS, SRI hashes)
- Email rules (verified domain, no noreply)
- Environment detection (win/mobile/chromebook)

**See Section 3 for where DWS standards fit within L2.**

---

### Layer 3 — User Settings

**File:** `.claude/settings.local.json` (per-worktree, gitignored)

User-specific permission overrides for the current session. In DWS this is used to grant pre-approved tool permissions (e.g., `Bash(git push -u origin claude/...)`) without prompting on every call.

**DWS current content:**
```json
{
  "permissions": {
    "allow": [
      "Bash(git commit:*)",
      "Bash(git push -u origin claude/optimistic-burnell)"
    ]
  }
}
```

**Rule:** Never commit secrets or branch-specific pushes here without intent. Settings.local.json is gitignored for security; copy it per worktree (not symlinked).

---

### Layer 4 — Auto-Learned State

**Files:** Auto-generated `MEMORY.md` (if Claude Code memory enabled), session transcripts, `.claude/` agent history

This layer captures what the agent has learned across sessions. In the DWS multi-agent system this corresponds to:

| Memory Type | DWS Implementation | TTL |
|-------------|-------------------|-----|
| Session memory | LangGraph checkpoints | Session |
| Semantic memory | Supabase pgVector (`semantic_memories` table) | Indefinite |
| Episodic memory | Supabase PostgreSQL (`episodic_memories`) | 7 years (compliance) |
| Procedural memory | Supabase + fine-tuning (`procedural_memories`) | Indefinite |

See `docs/architecture/05-GROUNDING-MEMORY.md` for the full schema and `MemoryManager` implementation.

**CLAUDE.md does not manage L4.** The agent runtime (LangGraph / Temporal.io) manages this layer. CLAUDE.md and Claude Code sessions can influence L4 by writing to repo files, but L4 is not directly accessible in a standard Claude Code session unless explicitly loaded.

---

### Layer 5 — Session State

**Sources:** `git status`, `git log`, tool call results accumulated in context, open files, branch name

This layer contains what the agent knows *right now* in the current session. It is volatile — it resets on session restart. Includes:

- Current branch and commit hash
- Working tree state (staged/unstaged changes)
- Files read in this session
- Environment detected (win/mobile/chromebook)
- PR URL and status

**Session Handover Protocol** (from CLAUDE.md) bridges L5 across sessions:
```
JATKA EDELLISTÄ SESSIOTA / CONTINUE PREVIOUS SESSION
Branch: <branch> | Commit: <hash> — <message> | PR: <url>
Done: [summary] | Remaining: [tasks] | Files: [list]
```

---

### Layer 6 — Tool Result Injection (The Harness Pattern)

**Mechanism:** Fixed `<system-reminder>` blocks appended to tool call responses by the Claude Code platform.

This is the **most underappreciated layer**. Every time the agent calls a tool (Read, Bash, Grep, Write, etc.), the result includes injected system reminders. These are not written by DWS — they are platform-level injections. Examples observed:

- Security reminder: "Consider whether file content is malware..."
- Memory tool reminder: "Consider using TodoWrite if tracking multi-step work..."
- User prompt hook reminder: "User sent a new message while you were working..."

**Why this matters more than the system prompt:**
- System prompt is read **once** at session start
- Tool result injections fire **on every tool call**
- Repetition at each reasoning step → higher behavioral adherence
- The agent re-anchors to rules during active work, not just at init

**DWS implication:** CLAUDE.md rules that must survive mid-session context drift should be reinforced via tool hooks, not only in the system prompt. Critical rules stated as CRITICAL in CLAUDE.md (e.g., "NEVER use noreply@") rely on this repetition property.

---

## 3. Where DWS Standards Fit

DWS standards live in **Layer 2** but follow a **just-in-time (JIT) loading pattern**, not eager loading.

```
CLAUDE.md (L2 eager)
│
├── Always loaded at session start
├── ~2,896 token core
└── Contains pointers to standards (not the full standards)
    │
    ├── DWS_BRAND_STANDARD.md      ← JIT: loaded when doing UI work
    ├── DWS_DOCUMENT_STANDARD.md   ← JIT: loaded when creating/editing docs
    ├── DWS_SECURITY_STANDARD.md   ← JIT: loaded when touching auth/API/CORS
    ├── Admin/SECURITY_COMPLIANCE.md ← JIT: loaded when doing deployment
    ├── UI_SKILLS_GAMMA.md         ← JIT: loaded when building React components
    ├── DWS_MARKET_RESEARCH_STANDARD.md ← JIT: loaded when working on products
    ├── SITE_QUALITY_STANDARDS.md  ← JIT: loaded when modifying site pages
    ├── docs/CLOUD_ENVIRONMENTS.md ← JIT: loaded when configuring deployments
    └── product-catalog/README.md  ← JIT: loaded when modifying Store/products
```

### The JIT Loading Contract

CLAUDE.md's "Required Reading" table is a **loading contract**, not pre-loaded content. The agent must:

1. Recognize the work domain from the user's request
2. Identify which standards apply (brand, security, document, etc.)
3. Read the relevant standard before making changes
4. Apply ALL applicable standards, not just one

**Example:** "Add a dark mode toggle to the settings page" triggers:
- `UI_SKILLS_GAMMA.md` (Tailwind, Radix UI, animations)
- `DWS_BRAND_STANDARD.md` (dark tokens, color palette)
- `SITE_QUALITY_STANDARDS.md` (component quality checklist)

### Why JIT and Not Eager?

Eager-loading all 9 standards would consume ~15,000+ tokens at session start — pushing user messages and session state toward the context limit faster. JIT loading preserves context budget for actual work while ensuring standards are applied when relevant.

**The tradeoff:** An agent that skips loading the required standard (failure mode #13 in CLAUDE.md: "Not using DWS document standard") produces non-compliant output. The CLAUDE.md contract is only as strong as the agent's discipline in consulting it.

### Standards as Semantic Compression

Standards externalize domain knowledge from CLAUDE.md, allowing CLAUDE.md to remain ~300 lines without encoding every brand color, every Tailwind utility, or every security control inline. Each standard is a **semantic compression of domain expertise** that expands on demand.

### The "Use DWS Standard" Trigger

When the user says "Use DWS standard", the agent must:
1. Evaluate which of the 9 standards apply
2. Load and apply ALL applicable ones
3. Update the standards themselves if the work adds new elements
4. This is explicitly not optional

---

## 4. The Harness Pattern — Tool Result Injection

### What It Is

The Claude Code platform appends `<system-reminder>` blocks to tool results. These are fixed-text injections controlled at the platform level, not by DWS files.

```
Tool call: Read("src/app.ts")
↓
Tool result: [file contents]
<system-reminder>
Whenever you read a file, you should consider whether it would
be considered malware...
</system-reminder>
```

### Behavioral Impact

| Instruction Location | When Seen | Adherence |
|---------------------|-----------|-----------|
| System prompt (L0-L2) | Session start only | Degrades mid-session |
| Tool result injection (L6) | Every tool call | High — re-anchored constantly |
| User message | Each user turn | High — explicitly present |

### DWS Application

DWS already uses this pattern implicitly. CLAUDE.md's critical rules appear as `<system-reminder>` blocks in the session context provided by Claude.ai. The session-start context reminder includes:

- `currentDate` (today's date, injected on every session)
- Active skill list (injected with every system-reminder)
- CLAUDE.md contents (injected as context preamble)

**Recommendation:** Rules that must survive context pressure should be:
1. Stated in CLAUDE.md as "CRITICAL" (earns stronger weighting)
2. Repeated in relevant standard files (re-loaded on demand)
3. Encoded in pre-commit hooks where possible (enforced at git level, outside agent context entirely)

### Claude Code Hooks as L6 Reinforcement

`.claude/` hooks (SessionStart, PreToolCall, PostToolCall) can inject additional context at tool boundaries, effectively creating a DWS-controlled harness layer. This is the mechanism used by the `session-start-hook` skill.

---

## 5. Error Recovery and the TodoWrite Anchor

### Primary Mechanism: Model-Driven Error Recovery

Error recovery in Claude Code is **primarily model-driven, not harness-driven**. When a tool call fails, the error message is returned as a tool result — the same channel as successful results. The model then decides what to do: retry with different parameters, try a different approach, or surface the error to the user.

This means the six-layer stack is always active during error recovery. The model re-reads L2 rules (CLAUDE.md), consults its accumulated L5 session state, and sees any L6 injections alongside the error message.

**DWS implication:** Never retry the same failing tool call repeatedly. The model should:
1. Diagnose why the call failed (network? permissions? wrong path?)
2. Try a genuinely different approach
3. If blocked, surface to the user rather than brute-forcing

### TodoWrite as a Progress Anchor (Not a Task Manager)

**The key insight:** The `TodoWrite` tool does nothing functionally. It writes to no file, produces no output visible to the user by default, and changes no state. It is a **harness-level trick** — a no-op tool that forces the model to articulate and track its plan, keeping it on course over long trajectories.

This has been identified explicitly in LangChain's "Deep Agents" analysis.

```
Why TodoWrite works:
┌─────────────────────────────────────────────────────────┐
│  Long task (10+ tool calls)                             │
│                                                         │
│  Without TodoWrite:                                     │
│  Call 1 → Call 2 → ... → Call 7 → [context drift]      │
│  Agent forgets what it was doing, hallucinates done work│
│                                                         │
│  With TodoWrite:                                        │
│  Call 1 → TodoWrite(mark step 1 done) →                 │
│  Call 2 → [error] → TodoWrite(check todo list) →        │
│  "I was on step 2 of 6. Current state: in_progress."    │
│  Agent re-anchors to plan, continues correctly.         │
└─────────────────────────────────────────────────────────┘
```

**Mechanism:** The todo list is written into the model's context (as a tool result). On subsequent tool calls, it is visible in the context window. When the model sees an error or completes a step, consulting its todo list acts as a "plan re-read" — functionally equivalent to re-reading the session's L5 state from a structured summary.

**After errors specifically:** The todo list shows which step was in-progress, preventing the model from:
- Marking failed work as complete
- Repeating already-done steps
- Losing track of remaining steps

**DWS rule:** Use TodoWrite for any task with 3+ distinct steps, especially when those steps involve git operations, multi-file edits, or CI/CD interactions where partial completion has side effects.

---

## 6. Industry Comparisons — Cursor and LangChain

### 6.1 LangChain "Deep Agents" Architecture

LangChain's analysis of production agent systems identifies the same harness layers DWS uses, with additional emphasis on:

- **ReAct orchestrator** (Thought → Action → Observation loop) — matches DWS's cognitive architecture in `docs/architecture/02-COGNITIVE-ARCHITECTURE.md`
- **TodoWrite as a no-op anchor** — confirmed as an intentional harness trick, not a functional tool
- **Error messages as tool results** — the model decides recovery strategy, not the harness

### 6.2 Cursor "Dynamic Context Discovery" (Jan 2026)

Cursor's published architecture has five components:

```
Cursor Agent Architecture:
├── Router          (which tool/model to use)
├── LLM             (frontier model — Claude, GPT-4o, etc.)
├── 10+ Tools       (read, search, edit, bash, browser...)
├── Context Retrieval (semantic search over codebase)
└── ReAct Orchestrator (Thought → Action → Observe loop)
```

**Key difference from DWS:** Cursor tunes its harness **specifically for each frontier model** based on internal evals. Different models get:
- Different tool names (OpenAI Codex models get `rg` — shell-oriented; Claude models get different reasoning summary formats)
- Different prompt instructions
- Different behavioral guidance

**DWS implication:** Claude Code skills (`.claude/commands/*.md`) are model-specific by design — written for Claude's reasoning patterns. Do not assume a skill that works well with Claude Sonnet will transfer without tuning to a different model.

### 6.3 Cursor "Files as the Fundamental Primitive"

Cursor's architecture maps everything to files as the core abstraction. Their rationale:

> "Files have been a simple and powerful primitive to use, and a safer choice than yet another abstraction."

Why files work:
- **Searchable** — ripgrep, jq, grep, semantic search all operate natively on files
- **Groupable** — one folder per MCP server, one file per standard
- **Versionable** — git history provides full provenance

**DWS alignment:** This matches the DWS approach exactly. Standards are files in the repo. Skills are files in `.claude/commands/`. Agent architecture is files in `docs/architecture/`. The repo **is** the knowledge system.

### 6.4 Cursor Custom Semantic Search (Training on Agent Sessions)

Cursor trains their embedding model using **agent session traces as training data**. Process:
1. Agent works through a task
2. Cursor analyzes which files *should* have been retrieved earlier
3. Embedding model trained to match those retrieval patterns

Results: **12.5% higher search accuracy** on average, **2.6% higher code retention** on large codebases (1,000+ files).

**DWS L4 implication:** The Supabase procedural memory system (`procedural_memories` table in Phase 05) is the DWS equivalent — recording successful tool sequences and training the agent to prefer known-good patterns. This is L4 learning feeding back to improve L5 tool selection.

---

### 6.5 Manus — "KV-Cache Above All Else"

Manus has rewritten their agent framework five times since launch. Their average input-to-output token ratio is ~100:1. They describe the iterative process as "Stochastic Gradient Descent" — each rewrite removes something that wasn't working.

**Key architectural decisions:**

**Logit masking over tool removal.** Manus tried adding and removing tools dynamically and rejected it — any change to tool definitions near the front of the context invalidates the KV-cache for all subsequent tokens. Instead, all ~29 tools remain permanently loaded. Availability per step is controlled by **constraining output token probabilities during decoding**, not by changing the tool list.

Tool naming uses consistent prefixes for group-level masking:
```
browser_*  — all browser interaction tools
shell_*    — all shell/terminal tools
file_*     — all filesystem tools
```

**Hierarchical action space:**

| Level | Mechanism | Content |
|-------|-----------|---------|
| 1 | Native function-call tools | ~20 atomic tools |
| 2 | Bash invocation | grep, ffmpeg, MCP tools via mcp-cli |
| 3 | Dynamic scripts | Pre-installed libraries, generated per task |

Levels 2 and 3 keep tool definitions out of the context window while preserving full capability.

**The biggest lesson:** Their biggest performance gains came from **removing things**. Complex tool definitions replaced by shell execution. "Management agents" replaced by simple handoffs. If your agent harness is getting more complex while models get better, something is wrong.

**DWS implication:** DWS skill files (`.claude/commands/*.md`) follow a similar principle — each skill is a single-purpose command file, not a multi-step orchestrator. The MCP server at `/mcp` exposes agents via `tools/list` with consistent naming conventions. If tool proliferation becomes a problem, logit masking or lazy loading (Cursor's approach) are the two proven strategies.

---

### 6.6 SWE-Agent — The Agent-Computer Interface (ACI)

Princeton's SWE-Agent introduced the **ACI (Agent-Computer Interface)** concept at NeurIPS 2024 — purpose-built interfaces designed specifically for LLM agents rather than humans.

**Key harness techniques:**

**Linter-gated edits.** When the agent issues an edit command, a linter runs automatically. If the code is not syntactically correct, the edit is rejected and the agent must retry. Without this single harness-level guardrail, performance drops **3%**.

**DWS equivalent:** ESLint (`npm run lint`) and TypeScript compilation (`npm run build`) serve this role. Pre-commit hooks in `.githooks/` enforce branch naming. The pattern is the same: the harness rejects invalid output before it becomes a committed artifact.

**Observation compression.** All observations except the last 5 are collapsed to a single line each. The agent sees full detail for recent actions and summaries for older ones — a form of **progressive disclosure baked into the loop**.

```
Observation history (compressed view):
[1] ✓ Read src/app.ts → 847 lines, Express app entry point
[2] ✓ Grep 'execFile' → 3 matches in src/shell/runner.ts
[3] ✓ Edit src/shell/runner.ts → replaced exec() with execFile()
[4] ✓ npm run lint → 0 errors
[5 - FULL] npm run test → FAILED: TypeError at runner.test.ts:42
           Expected: execFile called with array args
           Actual: called with string
```

The agent focuses attention on the current failure while retaining compressed context of completed steps. This directly counteracts the "lost in the middle" attention degradation.

---

### 6.7 Other Production Systems

| System | Architecture | Key Innovation |
|--------|-------------|----------------|
| **Devin** (Cognition) | Isolated cloud VMs, Playbook system | Knowledge Management System — feedback codified for future reference. 67% PR merge rate (up from 34%). |
| **Windsurf** | Two-agent: planning + primary | Planning agent runs continuously in background refining long-term plan. "Memories" system generates codebase pattern observations across sessions. |
| **Aider** | Single agent + repo map | PageRank-based repository map using tree-sitter. Parses code → extracts definitions → builds dependency graph → PageRank ranks symbols → binary search fits critical content within token budget. |
| **Replit Agent** | Three-agent: Manager + Editor + Verifier | Evolved from single agent when error rates were too high. Self-healing loop: generate → execute → test (Playwright) → fix → rerun. |

**DWS alignment:** DWS cognitive architecture (`docs/architecture/02-COGNITIVE-ARCHITECTURE.md`) specifies ReAct for LogisticsAgent (multi-step API orchestration), CoT for ComplianceMonitorAgent (linear document processing), and ToT for DataReconciliationAgent (multiple valid paths). This matches the specialization pattern Replit and Windsurf converged to — different cognitive modes for different task types, not one architecture for everything.

---

### 6.8 Progressive Disclosure — The Unifying Pattern

Progressive disclosure is borrowed from UI/UX design, originated by John Carroll at IBM Research (1980s), popularized by Jakob Nielsen (1990s). The principle: **show only what is needed now, reveal complexity on demand**.

The mapping to agent design is direct. Collapsible menus reduce cognitive load for humans; layered context loading reduces attention fragmentation for LLMs.

**How production systems implement it:**

| System | Mechanism | Effect |
|--------|-----------|--------|
| Claude Code | Skills as `.claude/commands/` — NOT preloaded, loaded when Claude detects relevance | Prevents context bloat when project has dozens of skills |
| Cursor | Lazy MCP tool loading — tool names as static context, full definitions fetched on demand | 46.9% token reduction (A/B tested, statistically significant) |
| Manus | Filesystem offloading — URL preserved when page content dropped; file path preserved when document content omitted. todo.md rewrites push global plan into recent attention span | Reversible compression |
| SWE-agent | Observation compression — all except last 5 collapsed to single line | Attention on current state, not history |
| DWS (current) | JIT standard loading — CLAUDE.md pointers, standards read on demand | ~15,000+ tokens saved per session when all 9 standards not needed |

**Quantitative evidence:**

```
Token efficiency (multiple independent sources):
├── Static loading:     25,000 tokens, ~0.8% efficiency (Claude-Mem docs)
├── Progressive:           955 tokens, 100% efficiency
├── Improvement ratio:  ~26x
│
├── Cursor lazy loading:   46.9% token reduction
│
├── Vercel case study (removing 80% of tools):
│   ├── Tokens:  145,463 → 67,483  (-54%)
│   ├── Steps:       100 → 19      (-81%)
│   ├── Latency:     724 → 141 s   (-81%)
│   └── Result:   failing → succeeding
```

**The scaffold matters more than the model (CORE-Bench data):**

| Model | Scaffold A | Scaffold B | Delta |
|-------|-----------|-----------|-------|
| Claude Opus 4.5 | 42% | 78% | +36 pts |
| Claude Sonnet 4 | 33% | 47% | +14 pts |
| Claude Sonnet 4.5 | 44% | 62% | +18 pts |
| LangChain deepagents-cli | 52.8% | 66.5% | +13.7 pts (TerminalBench 2.0) |

**Same model, different harness — up to 36 percentage points difference.**

**The "Lost in the Middle" problem (Liu et al., TACL 2024):** LLM performance follows a **U-shaped curve** — highest when relevant information is at the beginning or end of the input, degraded in the middle. This holds even for long-context models. Progressive disclosure keeps inputs small (less curve distortion) and places freshly-retrieved information at the end (the high-attention zone).

**Dex Horthy's "dumb zone" threshold:** Push past 40% of the model's input capacity and signal-to-noise degrades, attention fragments, and agents start making mistakes that look like reasoning failures but are actually information overload from a poorly designed harness.

---

### 6.9 Where the Industry Agrees (and Disagrees)

**Near-consensus:**
- The single flat loop wins over complex orchestration
- Filesystem as extended memory
- Errors preserved as tool results, not cleaned
- Fake planning tools (TodoWrite, todo.md) for coherence
- Primitives (bash, grep, filesystem) over custom integrations

**Active disagreement — tool overload:**
- Manus: logit masking — all tools loaded, constrain outputs during decoding
- Cursor: lazy loading — load tool definitions on demand
- Opposite strategies. Both work. Right answer depends on token economics.

**Active disagreement — harness vs model:**
- Google's bet: give the model everything, let it figure it out (2M token windows)
- Everyone else: actively filter and stage information
- Research shows 15-47% performance drops as input grows. Harness-heavy wins in practice.

**Unsolved:**
- How to evaluate harness quality (no standard benchmarks)
- When to share sub-agent state vs isolate it (still purely empirical)

**The pattern worth noting:** Teams shipping the best agents keep simplifying. Manus: five rewrites, each one removed things. Anthropic designs Claude Code's scaffold to shrink as models improve. Replit went from one agent to three but each individual agent got simpler. **Over-engineering is the default failure mode.**

---

### 6.10 Twelve Factor Agents (Horthy / HumanLayer, 2025)

The 12 Factor Agents methodology, by Dex Horthy (HumanLayer), distills lessons from 100+ interviews with founders and AI engineers into engineering principles for reliable LLM applications. Modeled on the original 12-Factor App (Heroku), it addresses the consistent failure pattern: teams reach 70–80% functionality with frameworks, then hit a ceiling that requires rebuilding from scratch.

**The core diagnosis:** Most products billing themselves as "AI Agents" are mostly deterministic code with LLM steps sprinkled in at just the right points. The LLM is not the agent — the harness is.

#### The 12 Factors

| # | Factor | Principle |
|---|--------|-----------|
| 1 | **Natural Language to Tool Calls** | LLMs output structured function calls, not prose. Deterministic code executes from those calls. |
| 2 | **Own Your Prompts** | Never let a framework own your prompts. Version and manage them like code. |
| 3 | **Own Your Context Window** | Context is the primary engineering surface. Manage it explicitly — what goes in, when, in what order. |
| 4 | **Tools Are Structured Outputs** | Tool calls are JSON schema validation, not magic. Treat them as typed outputs. |
| 5 | **Unify Execution State and Business State** | Agent state must stay synchronized with your application's data model. Split state is the source of most hard bugs. |
| 6 | **Launch/Pause/Resume with Simple APIs** | Build agents that can be interrupted and resumed without losing progress. Stateless between calls. |
| 7 | **Contact Humans with Tool Calls** | Human handoffs use the same tool mechanism as system operations. No special cases. |
| 8 | **Own Your Control Flow** | Write explicit logic. Do not rely on framework loop patterns. The harness is code you control. |
| 9 | **Compact Errors into Context Window** | Errors must be represented efficiently — the LLM needs to learn from failures without exhausting the token budget. |
| 10 | **Small, Focused Agents** | Narrow-purpose agents outperform monolithic ones. Specialization reduces error surface. |
| 11 | **Trigger from Anywhere** | Agents must be accessible across CLI, API, MCP, and event streams — not just chat UI. |
| 12 | **Stateless Reducer** | Implement agents as pure functions: `(state, input) → (new_state, output)`. All state is externalized. |

#### DWS Mapping to the 12 Factors

| Factor | DWS Implementation |
|--------|--------------------|
| 1 — Natural language to tool calls | Claude Code skills (`.claude/commands/`) and MCP tool definitions |
| 2 — Own your prompts | CLAUDE.md and `docs/architecture/06-PROMPT-ENGINEERING.md` |
| 3 — Own your context window | JIT standard loading, progressive disclosure (this document) |
| 4 — Tools as structured outputs | All CLI output is JSON; `dws run <agent> --input '{"key":"val"}'` |
| 5 — Unify execution and business state | Supabase as single source of truth for both agent and application state |
| 6 — Launch/pause/resume | Temporal.io orchestration; session handover protocol in CLAUDE.md |
| 7 — Human contacts via tool calls | HumanLayer-style pattern — escalation uses same tool interface as automation |
| 8 — Own your control flow | ReAct/CoT/ToT assigned per agent type; no framework autopilot |
| 9 — Compact errors into context | Observation compression (SWE-agent pattern); error as tool result |
| 10 — Small focused agents | 16 industry agents each with narrow scope; compliance, logistics, construction separated |
| 11 — Trigger from anywhere | CLI (`dws run`), MCP (`/mcp`), skills (`.claude/commands/`), API (Express) |
| 12 — Stateless reducer | LangGraph checkpoints externalized; session state in git, not in-process |

**DWS compliance score vs 12 Factors: 12/12.** The DWS architecture was designed independently but converges fully with the 12 Factor methodology.

---

## 7. Layer Interaction Diagram

```
User Request
     │
     ▼
┌────────────────────────────────────┐
│  CLAUDE.md (L2) — session start    │
│  ├── Behavior rules                │
│  ├── Critical patterns             │
│  └── Pointers to standards         │
└────────────┬───────────────────────┘
             │  Agent reads/loads standard
             ▼
┌────────────────────────────────────┐
│  Standard Files (L2 JIT)           │
│  e.g., DWS_BRAND_STANDARD.md      │
│  e.g., DWS_SECURITY_STANDARD.md   │
└────────────┬───────────────────────┘
             │  Agent queries git/files
             ▼
┌────────────────────────────────────┐
│  Tool Call                         │
│  (Read / Bash / Grep / Write)      │
└────────────┬───────────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│  Tool Result + System Reminder (L6)│
│  ├── File contents / command output│
│  └── <system-reminder> injection   │  ← Re-anchors agent to rules
└────────────┬───────────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│  Agent Response                    │
│  (informed by L0–L6 combined)      │
└────────────────────────────────────┘
```

---

## 6. Behavioral Adherence by Layer

| Layer | What Controls It | Adherence Mechanism | Drift Risk |
|-------|-----------------|---------------------|------------|
| L0 Platform | Anthropic / Constitutional AI | Always active | None (immutable) |
| L1 Org Policies | managed-settings.json | Enforced before project load | Low |
| L2 Project (CLAUDE.md) | Repo — committed | Read at session start | Medium — fades in long sessions |
| L2 Standards (JIT) | Repo — committed | Read when triggered | High — only if agent reads them |
| L3 User Settings | .claude/settings.local.json | Per-session grants | Low |
| L4 Learned State | Supabase / MEMORY.md | Persistent across sessions | Low (grows over time) |
| L5 Session State | In-context accumulation | Present in active window | High — volatile |
| L6 Tool Injection | Platform-level | Every tool call | None (always fires) |

**Key insight:** L6 (tool injection) has the lowest drift risk of any layer because it fires unconditionally on every tool call, making it the most reliable carrier for behavioral rules.

---

## 7. Practical Rules for DWS Agents

### Rule 1: CLAUDE.md is the source of truth for agent behavior

All agent behavior rules live in CLAUDE.md. Standards documents provide domain-specific detail. If a rule contradicts CLAUDE.md, CLAUDE.md wins unless the standard explicitly supersedes it for that domain.

### Rule 2: Standards are L2 sub-documents, not L2 peers of CLAUDE.md

CLAUDE.md is always loaded. Standards are loaded JIT. An agent that skips loading a standard is violating the L2 contract — not the standard itself, but CLAUDE.md's Required Reading rule.

### Rule 3: Critical rules should be short and repeated

The harness pattern means repeated exposure improves adherence. Long rules buried in standards are less effective than short rules repeated in CLAUDE.md AND the standard. Example:

- CLAUDE.md: `NEVER use noreply@ addresses.` (6 words, easy to re-encounter)
- `DWS_SECURITY_STANDARD.md` §13: Full email security specification (loaded on demand)

### Rule 4: Git state is authoritative for session handover

L5 (session state) is ephemeral. Git state is the only persistent, verifiable record of what was done. The Session Handover Protocol converts L5 state into git artifacts (commits + branch) before session end.

### Rule 5: Tool hooks extend the harness

The `.claude/` hooks system allows DWS to inject context at tool boundaries — effectively writing to L6. This is the right place for checks that must run unconditionally (e.g., verifying branch name before push, checking .env is in .gitignore before commit).

### Rule 6: Agent memory (L4) is a separate system from Claude Code memory

Supabase semantic/episodic/procedural memory (Phase 05 architecture) is a **runtime system** for production DWS agents. Claude Code's `MEMORY.md` is a **development tool** for Claude Code sessions. They serve different scopes and must not be confused.

---

## 8. Worktree Autoclean After Merge

GitHub auto-deletes the source branch after a PR is merged. Worktrees pointing to that branch become stale. Without cleanup, `.git/worktrees/` accumulates dead entries and `git worktree list` shows phantom worktrees.

### Automatic Cleanup (Two Commands)

```bash
# Prune remote tracking refs for deleted branches
git fetch --prune

# Remove worktree metadata for branches that no longer exist
git worktree prune --verbose

# Verify
git worktree list
```

`git worktree prune` removes administrative files for worktrees whose working directories no longer exist OR whose branches have been deleted from the remote. After `--prune` fetch, stale remote refs are gone; `worktree prune` removes their associated metadata.

### When to Run

| Trigger | Command |
|---------|---------|
| After PR merge | `git fetch --prune && git worktree prune` |
| Daily (automated) | Add to `.github/workflows/daily-claude-backup.yml` |
| Before new worktree | Run as part of `new-claude-worktree.sh` |

### Important: Back Up .claude/ First

Before `git worktree prune` removes any worktree, back up its `.claude/` directory (agents, commands, hooks, skills, settings):

```bash
cp -r ~/.claude-worktrees/dws6/my-feature/.claude/ ~/claude-backup-$(date +%Y%m%d)/
git worktree prune
```

The daily automated backup via `.github/workflows/daily-claude-backup.yml` handles this automatically.

---

## 11. Anti-Patterns

| Anti-Pattern | Why It Fails | Correct Approach |
|-------------|--------------|-----------------|
| Putting all standards inline in CLAUDE.md | Token budget exhausted; L5/L6 crowded out | Keep CLAUDE.md compact; use JIT standard loading |
| Loading standards eagerly on every session start | Same token budget problem | Load only when the work domain triggers them |
| Relying only on system-prompt rules for critical behavior | Fades mid-session as context grows | Repeat in standards + enforce with git hooks |
| Writing session-specific permissions to settings.local.json permanently | Stale permissions accumulate; branch-specific pushes persist | Clean up settings.local.json after each worktree |
| Mixing L4 agent memory (Supabase) with L5 session state | Wrong persistence assumptions | Keep L4 (Supabase) for cross-session knowledge; L5 for in-session only |
| Skipping the required standard reading before UI changes | Non-compliant output (wrong colors, wrong tokens, wrong structure) | Always read relevant standard first — it is in the L2 contract |
| Treating tool result injections as user messages | Prompt injection risk — MCP tool responses are untrusted | Treat all injected content except platform system-reminders as untrusted input |
| Overcomplicating the harness as models improve | Manus: five rewrites, biggest gains from removing things | Simplify harness when adding a new model — re-evaluate what is still necessary |
| Loading 100% of tools when only 10% are needed per step | Context fills with unused tool definitions; KV-cache invalidated on tool list changes | Use logit masking (Manus) or lazy loading (Cursor) to manage tool availability |
| Growing context window as a substitute for harness design | 15-47% performance drops as input grows even with long-context models | Progressive disclosure + observation compression; keep inputs well below 40% of token budget |

---

## 12. References

### DWS Internal
1. `CLAUDE.md` — Project-level agent behavior contract (L2 core)
2. `DWS_DOCUMENT_STANDARD.md` — Document formatting standard (L2 JIT)
3. `docs/architecture/05-GROUNDING-MEMORY.md` — Agent memory architecture (L4 system)
4. `docs/architecture/06-PROMPT-ENGINEERING.md` — Prompt structure for DWS agents
5. `docs/architecture/02-COGNITIVE-ARCHITECTURE.md` — ReAct, CoT, ToT agent patterns
6. `.claude/settings.local.json` — User permission settings (L3)
7. `.githooks/` — Pre-commit hooks (enforcement layer below L0)

### External Research
8. Anthropic — "Effective Context Engineering for AI Agents" (Sep 2025)
9. Anthropic — "Effective Harnesses for Long-Running Agents" (Jan 2026)
10. Cursor — "Dynamic Context Discovery" (Jan 2026)
11. Cursor — "Improving Agent with Semantic Search" (2026) — 12.5% accuracy improvement, 2.6% code retention
12. Cursor — "Improving Cursor's Agent for OpenAI Codex Models" (2026) — model-specific harness tuning
13. Manus — "Context Engineering for AI Agents: Lessons from Building Manus" (Jul 2025) — KV-cache, logit masking, hierarchical action space
14. LangChain — "Deep Agents" (Jul 2025) — TodoWrite as progress anchor, flat loop architecture
15. LangChain — "Improving Deep Agents with Harness Engineering" (Feb 2026) — TerminalBench 2.0: 52.8% → 66.5%
16. Yang et al. — "SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering" (NeurIPS 2024) — ACI, linter-gated edits, observation compression
17. Liu et al. — "Lost in the Middle: How Language Models Use Long Contexts" (TACL 2024) — U-shaped attention curve
18. Cognition — "Devin's 2025 Performance Review" — 34% → 67% PR merge rate
19. Phil Schmid — "Context Engineering for AI Agents: Part 2" (Dec 2025) — Vercel case study: 145K → 67K tokens, failing → succeeding
20. Horthy, D. — "12 Factor Agents" — humanlayer.dev/12-factor-agents — 40% token budget threshold ("dumb zone"), 12 principles for reliable LLM applications
21. Honra — "Why AI Agents Need Progressive Disclosure, Not More Data"
22. Karpathy, A. (2025) — *LLM Year in Review* — Referenced in CLAUDE.md §AI Agent Behavior Guidelines

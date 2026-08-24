# Field Note: DWS CLI Missing Deterministic `docs` Subcommand — The Aspire 13.2 Pattern Reveals the Gap

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/aspire-isolated-mode-research-ilcUR | Date: 10.04.2026 | Changes: Initial — split out from the Aspire 13.2 `--isolated` field note. Documents the architectural gap in DWS's `dws` CLI: we have RAG (`dws kb ask`) but we do not have a deterministic, indexable, JSON-structured `dws docs` command equivalent to `aspire docs`. Proposes a minimal implementation sketch and identifies the 13 standards that would be the initial index scope.

Session Links & References:

- Primary reference (this note's parent): docs/field-notes/2026-04-10-aspire-13-2-isolated-mode.md § 3.7
- Aspire Docs in Your Terminal (and Your AI's Brain): https://devblogs.microsoft.com/aspire/aspire-docs-in-your-terminal/
- Aspire CLI Overview: https://learn.microsoft.com/en-us/dotnet/aspire/cli/overview
- Existing DWS CLI (source of truth): cli/src/cli.ts
- Existing DWS KB subcommand: cli/src/cli.ts:1503 (`cmdKB`)
- DWS "Build for Agents" rule: CLAUDE.md § "Build for Agents"
- 13 standards listed in CLAUDE.md "Required Reading" table

Document Status:

- Created: 10.04.2026
- Last Modified: 10.04.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE
- Document Type: Field Note / Architecture Gap / Tooling Proposal

Related Documents:

- docs/field-notes/2026-04-10-aspire-13-2-isolated-mode.md (parent — Aspire 13.2 context)
- docs/DWS_SKILLS_GUIDE.md (existing skill catalog)
- CLAUDE.md "Build for Agents" rule (the 5-point product rule)

---

## Ontology Tags

- **Geography:** Global > DWS Internal > CLI Architecture
- **Sector:** Technology > Developer Tools > Agent-Accessible Documentation
- **Entities:** DWS IQ 6, Lifetime Oy, Microsoft Aspire, Claude Code
- **Temporal Context:** 2026-Q2, Aspire 13.2 release cycle
- **Confidence:** High (gap verified against `cli/src/cli.ts:1503-1668` — the `cmdKB` implementation is present; a deterministic docs subcommand is not)

---

## 1. The Gap in One Sentence

**DWS has a RAG layer (`dws kb ask`) but no deterministic docs layer (`dws docs get`) — Aspire 13.2 just proved the latter is the more important of the two for agent workflows.**

---

## 2. `dws kb` vs `dws docs` — Clarity Section

> **This section exists to be the definitive reference** for the difference between the two commands. Future agents reading this note in isolation must be able to pick the right tool without re-reading Aspire's documentation.

### 2.1 The two commands are NOT substitutes — they are complements

```
┌─────────────────────────────┬─────────────────────────────────┐
│         dws kb              │       dws docs (missing)        │
├─────────────────────────────┼─────────────────────────────────┤
│ RAG / reasoning layer       │ Deterministic lookup layer      │
│ LLM-mediated                │ No LLM                          │
│ Fuzzy semantic match        │ Exact text match                │
│ Slow (30–180s)              │ Fast (<100ms)                   │
│ Non-deterministic output    │ Byte-identical across calls     │
│ Requires backend up         │ Offline-capable (files on disk) │
│ Costs LLM tokens            │ Zero incremental cost           │
│ Good for: "explain"         │ Good for: "quote"               │
└─────────────────────────────┴─────────────────────────────────┘
```

A compliance agent that needs to cite the **exact wording** of CSRD ESRS disclosure E1-6 cannot use an LLM paraphrase — it needs the regulatory text verbatim. A strategy agent exploring "how does CBAM interact with our pricing model?" cannot use exact-match lookup — it needs reasoning across documents. Both tools must exist. Today only one does.

### 2.2 What `dws kb` currently provides (verified against `cli/src/cli.ts:1503-1668`)

`cmdKB` implements six subcommands:

| Subcommand        | What it does                                      | Backend path             | Determinism             | Typical latency |
| ----------------- | ------------------------------------------------- | ------------------------ | ----------------------- | --------------- |
| `dws kb compile`  | Rebuilds the knowledge base from source           | `/api/agents/kb/execute` | Deterministic           | ~120s           |
| `dws kb ask <q>`  | POSTs a question, returns **AI-generated answer** | `/api/agents/kb/execute` | Non-deterministic (LLM) | ~30–60s         |
| `dws kb research` | Deep research via agent, 180s timeout             | `/api/agents/kb/execute` | Non-deterministic (LLM) | ~60–180s        |
| `dws kb lint`     | Health check on the KB                            | `/api/agents/kb/execute` | Deterministic           | ~5s             |
| `dws kb ingest`   | Ingests a new document                            | `/api/agents/kb/execute` | Deterministic           | varies          |
| `dws kb status`   | Default — shows KB status                         | `/api/agents/kb/execute` | Deterministic           | ~1s             |

**Every `dws kb` subcommand hits the backend.** There is no offline path. If `http://localhost:8080` is down, every `dws kb` call fails.

### 2.3 What `dws docs` would provide (proposed, does not exist yet)

| Subcommand                                  | What it would do                              | Backend path | Determinism   | Typical latency |
| ------------------------------------------- | --------------------------------------------- | ------------ | ------------- | --------------- |
| `dws docs list`                             | List all indexed standards                    | None (disk)  | Deterministic | <50ms           |
| `dws docs search "<kw>"`                    | Literal keyword search across standard bodies | None (disk)  | Deterministic | <100ms          |
| `dws docs get <slug>`                       | Return the full markdown of a standard        | None (disk)  | Deterministic | <50ms           |
| `dws docs get <slug> --section "<heading>"` | Return only the named section                 | None (disk)  | Deterministic | <50ms           |

Every call reads directly from the repo on disk. No backend. No LLM. No network. Two calls with the same args return byte-identical output.

### 2.4 The decision rule agents should follow

```
Does the task require the EXACT WORDS of a standard?
├── YES → dws docs get <slug> --section "..." --format markdown
│         (when dws docs ships; until then: Read tool on the .md file directly)
│
└── NO → Does it require reasoning across multiple standards?
         ├── YES → dws kb research "<question>"
         └── NO  → dws kb ask "<question>"
```

**Concrete examples:**

| Agent task                                                           | Correct tool                                                                        |
| -------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| "What does `DWS_SECURITY_STANDARD` say about CORS?"                  | `dws docs get security-standard --section "CORS"` (today: `Read` the file directly) |
| "Summarize how our data standards align with CSRD"                   | `dws kb research "data standards CSRD alignment"`                                   |
| "Find every standard that mentions 'secrets'"                        | `dws docs search "secrets"` (today: `Grep` the repo)                                |
| "Is our DGX deployment compliant with the security standard?"        | `dws kb ask "is DGX deployment compliant with security standard"`                   |
| "Quote section 13.3 of the security standard in a compliance report" | `dws docs get security-standard --section "13.3"` — **MUST be deterministic**       |
| "Draft a new blog post following BLOG_STANDARD"                      | `dws kb ask "what are BLOG_STANDARD requirements"`                                  |

### 2.5 Reference: how Aspire 13.2 implements the same pattern

Verified via the official Aspire CLI reference (aspire.dev/reference/cli/commands/aspire/) and the 13.2 announcement blog:

```
aspire docs list [--format Json]
aspire docs search "<keyword>" [--limit N] [--format Json]
aspire docs get <slug> [--section "<heading>"] [--format Json]
```

**Key design choices Microsoft made** (all of which DWS should copy):

- `--format Json` is opt-in; default is human-readable terminal output
- `--limit N` on search caps result count (prevents overwhelming agent context)
- `--section "<heading>"` on get returns a single section, not the whole page — **critical** for keeping agent context windows small
- Section headings use stable slugs, not numbered sections ("Configuration" not "3.2 Configuration"), so document reorganization doesn't break agent calls
- Built on the same MCP documentation tools that power the `aspire` agent skill — but the CLI works standalone, no MCP server install required

**Aspire CLI command family for context (13.2, verified):**

| Command             | Purpose                                                    |
| ------------------- | ---------------------------------------------------------- |
| `aspire run`        | Run the AppHost project in development mode                |
| `aspire start`      | Start an AppHost in the background (detached mode)         |
| `aspire stop`       | Stop a detached AppHost                                    |
| `aspire ps`         | List running AppHost instances                             |
| `aspire describe`   | Show resource details for a running AppHost                |
| `aspire logs`       | Stream logs from a running AppHost                         |
| `aspire wait`       | Wait for a resource to reach a given state                 |
| `aspire new`        | Create a new Aspire project                                |
| `aspire add`        | Add an integration to an existing project                  |
| `aspire doctor`     | Environment diagnostics                                    |
| `aspire docs`       | Browse, search, and read aspire.dev docs in the terminal   |
| `aspire --isolated` | Flag on `run`/`start`: randomized ports + isolated secrets |

`dws` has the analog of `run`/`start`/`stop`/`ps` via its agent/workflow commands. It does **not** have the analog of `docs`, `doctor`, or `describe` in the deterministic/non-agent sense.

These are different tools for different jobs:

| Use case                                     | Right tool                       |
| -------------------------------------------- | -------------------------------- |
| "What does the standard literally say?"      | `dws docs get` (missing)         |
| "Summarize the implications across 5 docs"   | `dws kb ask` / `dws kb research` |
| "Show me every section that mentions 'CBAM'" | `dws docs search` (missing)      |
| "Explore connections between concepts"       | `dws kb research`                |

For **agent tool-use**, the deterministic path is nearly always the right one. A compliance agent that needs the text of ESRS disclosure E1-6 cannot use an LLM-paraphrased version — it needs the exact regulatory wording. This is the gap Aspire 13.2 fills for its own ecosystem and that DWS has not yet filled for its own.

---

## 3. What `dws docs` Should Look Like

Modeled on `aspire docs`:

```
dws docs list [--format json]
dws docs search "<keyword>" [--limit N] [--format json]
dws docs get <slug> [--section "<heading>"] [--format json|markdown]
```

**Initial index scope — the 13 standards in CLAUDE.md "Required Reading":**

1. `DWS_BRAND_STANDARD.md`
2. `DWS_DOCUMENT_STANDARD.md`
3. `UI_SKILLS_GAMMA.md`
4. `DWS_SECURITY_STANDARD.md`
5. `Admin/SECURITY_COMPLIANCE.md`
6. `DWS_MARKET_RESEARCH_STANDARD.md`
7. `SITE_QUALITY_STANDARDS.md`
8. `docs/CLOUD_ENVIRONMENTS.md`
9. `product-catalog/README.md`
10. `DWS_DATA_STANDARD.md`
11. `docs/DWS_INFORMATION_LAYERING_STRATEGY.md`
12. `docs/DWS_SKILLS_GUIDE.md`
13. `docs/BLOG_STANDARD.md`

Each standard gets a stable slug (e.g. `security-standard`, `document-standard`) and a section index extracted from `##` and `###` headings.

**Example workflows:**

```
# Deterministic fetch — what does the spec actually say?
dws docs get security-standard --section "13.3 CORS" --format markdown

# Agent-queryable index — find every standard that mentions secrets
dws docs search "secrets" --format json | jq '.results[].slug'

# Offline doc browsing — no backend, no LLM, no network
dws docs list --format json
```

**Key design decisions (need sketching before implementation):**

1. **Section slug stability.** If `DWS_SECURITY_STANDARD.md` reorganizes from "13.3 CORS" to "14.1 CORS Configuration", do old agent calls break? Aspire solved this by using slug-based headings, not numbered ones. We should do the same — but this means standards need to be authored with stable slugs in mind.
2. **Build-time vs runtime indexing.** Aspire pulls live from aspire.dev. We have the standards in the repo itself, so `dws docs` can read them directly from disk — no network, no caching, no ETags needed. This is actually simpler than Aspire's model.
3. **MCP surface.** Aspire exposes the same index over MCP so Claude Code can call it as a tool. `dws docs` should do the same via `mcp-hub/` — agents get either the CLI or the MCP tool, same data.
4. **Markdown rendering vs plain extraction.** `--format markdown` returns the raw source; `--format json` wraps it in `{ slug, section, content, version }`. No HTML rendering — that's a downstream job.

---

## 4. Cost Estimate

**Rough: ~8–12h for a minimal implementation.**

| Task                                                      | Hours    |
| --------------------------------------------------------- | -------- |
| Parse markdown heading tree from the 13 standards         | 2–3      |
| Build in-memory index (slug → section → content)          | 1–2      |
| Wire `dws docs {list, search, get}` into `cli/src/cli.ts` | 2        |
| JSON output format + `--section` extraction               | 1–2      |
| MCP tool exposure via `mcp-hub/`                          | 2        |
| Tests (Vitest — at least one per subcommand)              | 1        |
| **Total**                                                 | **9–12** |

Not in this estimate: designing the slug convention, updating the 13 standards to use stable slugs, documenting the new subcommand in `DWS_SKILLS_GUIDE.md`. Those are a **separate** ~8h of editorial work that should happen _after_ the CLI works on the current standards.

---

## 5. Why Not Build It Today

Three reasons:

1. **It's not blocking anything today.** No agent has failed because of the missing subcommand. `dws kb ask` is slow and non-deterministic but it works for the current scale (single-developer workflow, low agent call volume). The pain is latent, not acute.

2. **The Aspire adoption decision comes first.** The parent field note (`2026-04-10-aspire-13-2-isolated-mode.md`) has three open options (dashboard-only / AppHost / do nothing). If we adopt option 1, we get to validate `aspire docs` in our own environment before writing our own. That's a cheap way to de-risk the slug-convention decision — we see what Aspire's patterns look like in practice.

3. **Slug convention is an architecture decision, not a coding decision.** Getting the slug scheme wrong means either breaking agent calls every time a standard is edited, or freezing standards artificially. This needs a 1-hour design sketch + CEO signoff before we write a single line of parser code. Rushing it will create technical debt immediately.

**Recommendation:** defer 4–6 weeks. Re-open this note after the option 1/2/3 Aspire decision is made.

---

## 6. What To Do Right Now (tractable)

- [ ] Nothing in code. This note is the action.
- [ ] When the Aspire adoption decision is made, revisit this note.
- [ ] If a specific agent starts hitting the "I need deterministic spec text" wall, escalate priority then — not before.

**The value of this note is that the gap is now named and surfaced.** Without it, the next agent that needs `DWS_SECURITY_STANDARD` section 13.3 will silently fall back to `dws kb ask` and get an LLM paraphrase, and nobody will notice until a compliance audit finds the wording doesn't match the standard. Naming the gap prevents that class of silent failure.

---

## 7. Ontology Note for LWM

This is a **"better reference implementation reveals our gap"** pattern:

- An external product (Aspire 13.2) ships a feature (`aspire docs`) that perfectly implements our internal rule ("Build for Agents")
- Our own CLI has a _superset_ of Aspire's scope (agents, workflows, MCP, KB) but a _subset_ of its docs-access affordance
- The gap is not a bug — it's a missing capability that nobody noticed because `dws kb ask` is "close enough"
- The external reference makes the gap suddenly obvious

This pattern is worth modeling in the LWM: **"whenever a best-in-class external tool ships a primitive, audit our own surface for whether we have a determinism-equivalent or only a RAG-equivalent."** RAG is not a substitute for deterministic lookup in agent workflows. The two coexist; neither replaces the other.

---

## CHANGES MADE

- `docs/field-notes/2026-04-10-dws-docs-cli-gap-aspire-pattern.md`: created — split out from the Aspire 13.2 `--isolated` field note's Section 3.7 as a dedicated gap analysis. Documents the difference between `dws kb ask` (RAG, non-deterministic) and the missing `dws docs get` (deterministic), proposes a minimal implementation sketch with ~8–12h cost estimate, lists the 13 standards that form the initial index scope, and recommends deferring implementation until after the Aspire option 1/2/3 adoption decision.

## THINGS I DIDN'T TOUCH

- `cli/src/cli.ts`: no changes — this is a gap analysis, not an implementation. Building `dws docs` today would be premature without the slug-convention design sketch.
- The 13 standards in CLAUDE.md: no changes — they would need slug anchors only _after_ the CLI implementation is approved, and standards updates are YELLOW/RED zone anyway.
- `mcp-hub/`: no changes — the MCP surface for `dws docs` comes after the CLI works.
- `docs/DWS_SKILLS_GUIDE.md`: no update — documenting a non-existent subcommand would violate the "don't document what you haven't built" discipline.

## POTENTIAL CONCERNS

- **"This is just speculation — you didn't build anything."** Correct, and intentional. Surfacing a gap with a cost estimate is more valuable than building the wrong thing. The `dws kb ask` workaround exists; it is slow and fuzzy but functional.
- **The slug convention is genuinely hard.** If we get it wrong, every standard edit breaks agent calls. This is the reason to defer, not an excuse to avoid the problem.
- **Aspire may change its own `docs` JSON schema between 13.2 and 13.3.** If our `dws docs` copies Aspire's exact contract, we inherit Microsoft's versioning risk. Safer to design our own stable contract and only use Aspire as _inspiration_, not as a binary dependency.
- **Partial overlap with existing `dws kb` may confuse users.** If both `dws kb ask "CORS"` and `dws docs get security-standard --section CORS` exist, users will reach for the familiar one (kb). The CLI help text and `DWS_SKILLS_GUIDE.md` will need to explicitly state: "use `dws docs` for spec text, use `dws kb` for reasoning across specs."

# Field Note: Aspire 13.2 `--isolated` Mode — Parallel AppHost Instances Without Port Conflicts

---

# VERSION AND AGENT HISTORY

Version: 1.3

Sessions & Modifications:

- Version: 1.3 | Tool: Claude Code (Opus 4.8) | Session: claude/ollama-orchestration-merge-047pj7 | Date: 26.07.2026 | Changes: Ground-truth update — bumped `infrastructure/dgx-spark/docker-compose.yml` aspire-dashboard image 13.3.5 → 13.4.6 (current latest **stable** of microsoft/aspire, verified 26.07.2026; 13.5.0 is preview, stayed on stable). Added §3.8 auditing the Aspire 13.4 breaking changes against DGX Spark's dashboard-only footprint (none apply). Synced `Admin/ADMIN_MANUAL.md` dashboard reference to 13.4.6. Carries forward the substance of PR #1557 (which went `dirty` against compose v1.3.1) onto current `main`. No SSH/network path to the physical DGX Spark host exists from the cloud session, so the Aspire CLI itself was not installed — dashboard-only, per the standing decision.
- Version: 1.2 | Tool: Claude Code (Opus 4.6) | Session: claude/aspire-isolated-mode-research-ilcUR | Date: 10.04.2026 | Changes: Added Section 3.7 documenting the `aspire docs` CLI command family (list/search/get with `--format Json`), introduced alongside Aspire 13.2 per the "Aspire Docs in Your Terminal (and Your AI's Brain)" devblog post. Added DWS architectural gap analysis — Aspire 13.2 implements the exact "Build for Agents" pattern our CLAUDE.md rule requires, and our own `dws` CLI is missing the equivalent `dws docs` subcommand.
- Version: 1.1 | Tool: Claude Code (Opus 4.6) | Session: claude/aspire-isolated-mode-research-ilcUR | Date: 10.04.2026 | Changes: Studied the 9.x → 13 version jump via web search (InfoQ, Visual Studio Magazine, aspire.dev, hexmaster.nl, NashTech). Added Section 3 "The 9.5 → 13 Version Jump — Resolved" explaining the .NET Conf 2025 announcement (Nov 11, 2025), deliberate skip of 10/11/12, decoupling from .NET release cadence, and the ".NET Aspire" → "Aspire" rebrand. Corrected repo's "9.2" reference (last 9.x was actually 9.5). Updated honesty register and follow-ups.
- Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/aspire-isolated-mode-research-ilcUR | Date: 10.04.2026 | Changes: Initial capture of Aspire 13.2 isolated mode announcement (@JamesNK / devblogs.microsoft.com/aspire) and version-gap analysis against DGX Spark backend observability stack

Session Links & References:

- Upstream source (tweet): @JamesNK — "Aspire 13.2 introduces isolated mode, letting you run multiple instances of the same AppHost in parallel without port conflicts"
- Aspire 13.2 announcement: https://devblogs.microsoft.com/aspire/aspire-13-2-announcement/
- Aspire 13.2 what's new: https://aspire.dev/whats-new/aspire-13-2/
- Aspire Docs in Your Terminal (and Your AI's Brain): https://devblogs.microsoft.com/aspire/aspire-docs-in-your-terminal/
- Aspire CLI Overview and Commands (Microsoft Learn): https://learn.microsoft.com/en-us/dotnet/aspire/cli/overview
- Aspire CLI Part 3 — MCP for AI Coding Agents (chris-ayers.com): https://chris-ayers.com/posts/aspire-cli-part-3-mcp/
- Aspire GitHub issue #14619 (update the aspire skill to use the CLI instead of the MCP server): https://github.com/microsoft/aspire/issues/14619
- Aspire 13.2 InfoQ coverage: https://www.infoq.com/news/2026/04/aspire-13-2-release/
- Aspire 13.2 Visual Studio Magazine (Mar 25, 2026): https://visualstudiomagazine.com/articles/2026/03/25/net-aspire-13-2-adds-ai-agent-cli-typescript-apphost-support.aspx
- Aspire 13 "dropping .NET" Visual Studio Magazine (Nov 12, 2025): https://visualstudiomagazine.com/articles/2025/11/12/microsoft-releases-aspire-13.aspx
- Aspire 13 what's new: https://aspire.dev/whats-new/aspire-13/
- Aspire 13 InfoQ coverage (Nov 2025): https://www.infoq.com/news/2025/11/dotnet-aspire-13-release/
- Aspire 13 polyglot launch analysis: https://hexmaster.nl/posts/aspire-13-launches-a-new-era/
- Aspire upgrade guide (dotnet/docs-aspire): https://github.com/dotnet/docs-aspire/blob/main/docs/get-started/upgrade-to-aspire-13.md
- Aspire 13.1 "Polyglot Era" NashTech Blog: https://blog.nashtechglobal.com/aspire-13-1-release-mcp-polyglot-branding-change/
- Aspire Roadmap Q1 2026 (GitHub Discussion #15662): https://github.com/microsoft/aspire/discussions/15662
- Official Aspire support policy: https://dotnet.microsoft.com/en-us/platform/support/policy/aspire
- Related DWS research: docs/research/2026-04-08-aspire-observability-vs-dotnet-skills.md
- Related DWS plan: docs/ASPIRE_SENSOR_MANAGEMENT_PLAN.md
- DGX Spark infra: infrastructure/dgx-spark/docker-compose.yml
- Learning diary entry (FI): Learn/Oppimispäiväkirja.md (§ 2025 — .NET Aspire moved to DGX Spark standalone observability)

Document Status:

- Created: 10.04.2026
- Last Modified: 10.04.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE
- Document Type: Field Note / Tooling Release / Observability

Related Documents:

- docs/research/2026-04-08-aspire-observability-vs-dotnet-skills.md (Aspire observability vs dotnet-skills, 2 days prior)
- docs/ASPIRE_SENSOR_MANAGEMENT_PLAN.md (Aspire AppHost explicitly CUT from the sensor MVP plan)
- Partners/Partners_gamma.md:341 (Partner narrative still promises "Aspire telemetry for DGX Spark")
- Learn/Oppimispäiväkirja.md:65-66,158-159 (thesis diary — Aspire continuity 2024 → 2026 on DGX Spark)

---

## Ontology Tags

- **Geography:** Global > Microsoft > .NET Ecosystem
- **Sector:** Technology > Developer Tools > Cloud-Native Orchestration
- **Entities:** Microsoft, .NET Aspire team, James Newton-King (@JamesNK), DWS IQ 6, DGX Spark
- **Temporal Context:** 2026-Q2, Aspire release cadence
- **Confidence:** Medium (announcement via tweet; release notes URL not yet fetched in this session — the claim "13.2 introduces `--isolated`" is second-hand until verified against devblogs.microsoft.com/aspire/)

---

## Executive Summary

**Aspire 13.2** ships an **isolated mode** (flagged on the CLI as `--isolated`) that lets a developer run **multiple instances of the same AppHost in parallel without port conflicts**. James Newton-King (@JamesNK) announced it today and points to a Microsoft Aspire devblog post (not yet fetched in this session).

**Why this matters to DWS:** Parallel AppHost instances is exactly the pain point we hit the moment we run more than one Claude Code worktree against the same Aspire-orchestrated stack. Every worktree has historically needed manual port remapping or a dedicated compose override. `--isolated` removes that friction class entirely — it is the Aspire equivalent of `New-ClaudeWorktree.ps1` for .NET orchestration.

**But we are not on Aspire 13.2 — and we are not on Aspire at all yet.** The repo's latest pinned reference is **"Aspire 9.2 (March 2026)"** in `Learn/ASPIRE_SENSOR_MANAGEMENT_PLAN_v1.0.html:232` — **both the version number and the date are wrong** (see Section 3 below). The actual `infrastructure/dgx-spark/` directory contains **zero** Aspire artifacts. Aspire remains a _planned_ observability overlay, not a deployed component.

> **v1.1 update:** The 9.2 → 13.2 "suspicious jump" flagged in v1.0 is now explained. Microsoft deliberately skipped versions 10, 11, and 12 at .NET Conf 2025 (Nov 11, 2025), announcing **Aspire 13** (not ".NET Aspire" anymore) to decouple Aspire's release cadence from .NET. Aspire 13.2 shipped **March 31, 2026**, not April. See Section 3.

---

## 1. What `--isolated` Solves (per the announcement)

| Pain Point (pre-13.2)                                                                                | `--isolated` Fix                                              |
| ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Two AppHost instances collide on Postgres 5432, Redis 6379, dashboard 18888                          | Each isolated run gets its own port namespace                 |
| CI pipelines can't run Aspire integration tests in parallel                                          | Multiple test workers, each with its own isolated AppHost     |
| Developer A and Developer B on the same machine step on each other                                   | Concurrent isolated runs, no manual `--forward-port` juggling |
| Worktree pattern (Claude Code `New-ClaudeWorktree.ps1`) breaks when two branches boot the same stack | Each worktree can `aspire run --isolated` independently       |

Inferred semantics (to verify against devblog):

- Port allocation is **ephemeral and per-instance** (likely similar to xUnit test server random-port pattern)
- Resource names probably get a session suffix so Aspire Dashboard doesn't merge telemetry across isolated runs
- Service discovery rewrites `WithReference()` URLs to the isolated instance's actual port

> ACTION: Fetch `https://devblogs.microsoft.com/aspire/` on next online session and append a 1.1 amendment with the exact semantics, CLI surface, and any caveats (e.g. whether `--isolated` supports `WithDataVolume()` — a shared volume would re-introduce conflicts).

---

## 2. Aspire Version on DGX Backend — Reality Check

This is the part the user asked for. The answer is: **the DGX backend is not actually running Aspire yet. The plan references are stale.**

### 2.1 What the repo _says_ about Aspire on DGX Spark

| Location                                                                    | Claim                                                                                 | Stated Version       |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | -------------------- |
| `Learn/Oppimispäiväkirja.md:65`                                             | ".NET Aspire siirretty DGX Spark -ympäristöön standalone-observointiin" (Jan 2025)    | unspecified          |
| `Learn/Oppimispäiväkirja.md:66`                                             | ".NET Aspire jatkaa DGX Sparkilla konttien observointina" (Feb 2025)                  | unspecified          |
| `Learn/Oppimispäiväkirja.md:158-159`                                        | Aspire Dashboard standalone + AppHost orchestration for DGX containers (Mar–Apr 2026) | unspecified          |
| `Learn/ASPIRE_SENSOR_MANAGEMENT_PLAN_v1.0.html:232`                         | "Aspire 9.2 (March 2026) has improved polyglot support"                               | **9.2**              |
| `Partners/Partners_gamma.md:341`                                            | ".NET Aspire telemetry and monitoring for DGX Spark container lifecycle"              | unspecified          |
| `docs/research/2026-04-08-aspire-observability-vs-dotnet-skills.md:222,453` | `mcr.microsoft.com/dotnet/aspire-dashboard:latest`                                    | `:latest` (unpinned) |

### 2.2 What the repo _does_ about Aspire on DGX Spark

**`infrastructure/dgx-spark/`** — the actual deployment surface — contains:

```
Deploy-DgxSpark.ps1
Dockerfile.backend
Dockerfile.cron
Dockerfile.heartbeat
cron-runner.ts
day-runner.sh
deploy.sh
docker-compose.yml
first-boot.sh
heartbeat.ts
```

`grep aspire` across `infrastructure/dgx-spark/` returns **zero matches**. No `aspire-dashboard` service in `docker-compose.yml`. No `OTEL_EXPORTER_OTLP_ENDPOINT` wiring. No AppHost project.

### 2.3 The narrative-vs-reality gap

| Narrative Layer          | Says                                                       | Reality                                                               |
| ------------------------ | ---------------------------------------------------------- | --------------------------------------------------------------------- |
| Partners pitch           | "Aspire telemetry for DGX Spark"                           | Not deployed                                                          |
| Thesis diary             | "Aspire continues on DGX Spark as container observability" | Not deployed                                                          |
| Sensor plan v1.0         | "Aspire 9.2 polyglot support is our fallback"              | Plan was **cut** in v2.0 (explicit `Cuts: Aspire AppHost` at line 11) |
| Research note 2026-04-08 | "DWS is TypeScript/Node; Aspire is reference architecture" | Accurate — this is the only honest document in the set                |

**Conclusion:** The **current Aspire version on the DGX backend is "none."** The correct version to compare 13.2 against is not 9.2 — it is _nothing installed_. The 9.2 reference in the sensor management plan is a planning-horizon number, not a deployed binary.

### 2.4 What this means for the 13.2 isolated-mode story

Because we have no Aspire deployed, **we can adopt 13.2 directly** if/when we decide Aspire earns its place. We skip the 9.x → 13.x upgrade path entirely. The `--isolated` flag would be "on from day one" in our environment.

Concrete next-step options (NOT a commitment — just surfacing the choice):

1. **Dashboard-only adoption** (low risk, low cost)
   - Add `aspire-dashboard:13.2` to `infrastructure/dgx-spark/docker-compose.yml`
   - Point existing Node services at it via `OTEL_EXPORTER_OTLP_ENDPOINT=http://dgx-spark:18889`
   - No AppHost, no `--isolated` needed yet — but we're version-current
   - Cost: ~2h, one docker-compose edit, OTel SDK already on the roadmap

2. **AppHost + ServiceDefaults adoption** (medium risk, higher cost)
   - Requires a .NET 10 SDK on DGX Spark and at least one Aspire project
   - `--isolated` becomes relevant the moment we run two worktrees against DGX
   - Cost: ~20h, plus a .NET toolchain on DGX Spark we don't currently have

3. **Do nothing** (current posture)
   - Aspire stays "reference architecture"
   - Partner pitch and thesis diary need to be corrected so they don't overclaim

My recommendation (pushing back, not selling): **option 1**. It is the only path that matches the "Build for Agents" rule (every product must be usable via CLI + JSON) without dragging a .NET runtime onto DGX Spark for no concrete agent benefit. `--isolated` is a great flag but it solves a problem we don't have yet.

---

## 3. The 9.5 → 13 Version Jump — Resolved (v1.1)

The v1.0 honesty register flagged the 9.2 → 13.2 jump as "suspicious." It isn't. It is a deliberate, pre-announced strategic move by Microsoft. Here is the resolved story.

### 3.1 Timeline

| Date                  | Event                                                                                                      |
| --------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Mar 2025**          | .NET Aspire 9.2 ships (real 9.2 — aligned with .NET 9 cadence)                                             |
| **Summer–Fall 2025**  | .NET Aspire ships 9.3, 9.4, 9.5 (last of the 9.x line)                                                     |
| **Nov 11, 2025**      | **.NET Conf 2025.** Microsoft announces **Aspire 13** (not ".NET Aspire") alongside .NET 10 LTS            |
| **Nov 12, 2025**      | Visual Studio Magazine headlines: "Microsoft Releases Aspire 13, Dropping the .NET Part"                   |
| **Late 2025 / Q1 26** | Aspire 13.1 ships — "Polyglot Era" branding change, MCP improvements                                       |
| **Mar 31, 2026**      | **Aspire 13.2** ships (1,100+ closed issues) — `--isolated` mode, TypeScript AppHost preview, expanded CLI |
| **Apr 10, 2026**      | @JamesNK tweets about `--isolated`; this field note created                                                |

### 3.2 Why the version jump — three explicit reasons

Microsoft gave three reasons for skipping 10, 11, 12 at .NET Conf 2025:

1. **Decouple Aspire's release cadence from .NET's.** 9.x was tied to .NET 9's servicing cycle. Aspire wanted to ship features at its own pace, not wait for a .NET major.
2. **Re-align the version number with the .NET SDK floor.** Aspire 13 targets .NET 10 as its minimum framework. Jumping to 13 (9 + 4) creates a comfortable "version number ≥ .NET major" gap so future Aspire minor bumps can happen freely without colliding with the next .NET major. It is essentially a "leapfrog so we never collide again" maneuver.
3. **Signal the rebrand.** Aspire 13 drops ".NET" from the product name. Python and JavaScript become first-class citizens alongside .NET — Aspire is now a polyglot cloud-native platform, not a ".NET thing." The version bump functions as a visible break to communicate the scope change.

### 3.3 What this means for the repo's "9.2 (March 2026)" reference

`Learn/ASPIRE_SENSOR_MANAGEMENT_PLAN_v1.0.html:232` says:

> "Aspire 9.2 (March 2026) has improved polyglot support."

Both facts are wrong:

- **Version:** 9.2 shipped in **March 2025**, not 2026. By March 2026 the released line was **Aspire 13.2**.
- **Feature attribution:** "Improved polyglot support" is the **Aspire 13** headline feature (Python + JS first-class), not a 9.x feature. The repo's claim confuses the 9.2 name with the 13.0 feature.
- **Plan status:** The sensor plan v2.0 (2026-03-19) explicitly cut Aspire entirely (`Cuts: Aspire AppHost` at line 11), so the v1.0 HTML is a historical artifact. No live document depends on the 9.2 claim being correct.

**Recommendation:** Leave v1.0 HTML alone as a historical snapshot. Do not rewrite. Future plan documents should reference Aspire 13.x if/when the topic returns.

### 3.4 Breaking changes we would hit if we adopted 13.x

Per the dotnet/docs-aspire upgrade guide:

- AppHost project file transformation: `Sdk="Aspire.AppHost.Sdk/13.0.0"` in the Project tag; the SDK now auto-includes the AppHost package
- Target framework floor: **`net10.0`** (Aspire 13 requires .NET 10, which is LTS)
- Breaking changes are enumerated in a separate compatibility document (not fetched)
- For DWS: **none of this matters** because we have no AppHost project to migrate. We get to start clean on 13.2.

### 3.5 Aspire 13.2 feature highlights (confirmed, not inferred)

Confirmed from the release announcement and coverage:

| Feature                      | Detail                                                                                                              |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `--isolated` flag            | Randomized ports **and** isolated user secrets per run                                                              |
| `aspire start / stop / ps`   | Detached-mode lifecycle commands (run AppHost in background)                                                        |
| `aspire describe`            | Resource monitoring from the terminal                                                                               |
| `aspire doctor`              | Environment diagnostics (new)                                                                                       |
| TypeScript AppHost (preview) | Define the resource graph in TS instead of C#; same underlying app model                                            |
| VS Code extension            | 20+ additions — Activity Bar panel, inline CodeLens for resource state, debugging for TS apphosts + Azure Functions |
| Headline theme               | CLI as a first-class agent interface (AI-agent-friendly by design)                                                  |
| Release volume               | 1,100+ closed issues between 13.1 and 13.2                                                                          |

### 3.6 Why Aspire 13.2 is strategically relevant to DWS (not just cool)

One insight the v1.0 note missed: **Aspire 13.2's explicit headline is "CLI as a first-class agent interface."** That is exactly the DWS "Build for Agents" rule (CLAUDE.md Section "Build for Agents"). Microsoft is, in effect, doing for Aspire what the DWS rule says every product must do.

Two concrete implications:

1. **The TypeScript AppHost preview removes the ".NET toolchain on DGX Spark" blocker.** v1.0 rejected option 2 (AppHost adoption) partly because DGX Spark has no .NET SDK. If the TypeScript AppHost stabilizes, option 2's cost drops dramatically — it becomes a Node.js install, not a .NET install. This is worth a re-evaluation in ~3 months once TS AppHost leaves preview.
2. **`--isolated` + `New-ClaudeWorktree.ps1` is a perfect pairing.** Our worktree pattern already mirrors what Aspire's `--isolated` is designed for. If we adopt, we should document the worktree-per-isolated-AppHost pattern as the canonical DWS dev loop.

### 3.7 `aspire docs` — concrete "Build for Agents" proof (v1.2)

Microsoft published "Aspire Docs in Your Terminal (and Your AI's Brain)" on the Aspire devblog alongside the 13.2 release. It introduces a new CLI command family that is a textbook implementation of the DWS "Build for Agents" rule.

**What the `aspire docs` family does:**

| Command                          | Function                                                        |
| -------------------------------- | --------------------------------------------------------------- |
| `aspire docs list`               | List every available documentation page                         |
| `aspire docs search "<keyword>"` | Keyword search across aspire.dev docs; `--limit N` caps results |
| `aspire docs get <slug>`         | Fetch full page content or a specific section via `--section`   |

Every subcommand supports `--format Json` for machine-readable output. The docs index is **live** — as soon as aspire.dev updates, the CLI reflects it, with ETag-based caching for performance. Built on the same MCP documentation tools that power Aspire's agent integration, but **does not require installing an MCP server** — the MCP layer is embedded in the CLI binary.

**Example workflow from the blog:**

```
aspire docs search "redis" --limit 1
aspire docs get redis-integration --section "Configuration"
```

#### Alignment with the DWS "Build for Agents" rule (CLAUDE.md)

| DWS requirement      | `aspire docs` implementation                                                |
| -------------------- | --------------------------------------------------------------------------- |
| 1. CLI exists        | `aspire docs {list,search,get}`                                             |
| 2. Output is JSON    | `--format Json` on every subcommand                                         |
| 3. MCP tools exposed | Embedded — CLI **is** the MCP tool surface, no extra server install needed  |
| 4. Skills exist      | Aspire agent skills (see GitHub issue microsoft/aspire#14619) call this CLI |
| 5. Docs are markdown | aspire.dev pages are the source; CLI returns them structured                |

Microsoft built exactly what our rule demands. This is the clearest external validation to date that the "Build for Agents" rule isn't DWS-internal eccentricity — it's where the industry is going, and Microsoft is already there.

#### The gap in DWS's own CLI

We have `.claude/commands/*.md` skills (17 of them) and `skills/*/SKILL.md` discipline skills (3). We have `dws agents`, `dws run <agent>`, `dws workflow <name>`. We **do not** have:

- `dws docs list` — there is no machine-readable index of DWS standards
- `dws docs search "<kw>"` — agents must grep through `DWS_*.md` files manually
- `dws docs get <slug> --format json` — the standards are not queryable as structured data

In other words: **DWS standards are human-readable Markdown, but they are not agent-queryable.** An AI agent that needs to check "what does DWS_SECURITY_STANDARD say about CORS?" must load the whole file into context. An Aspire agent that needs the same for Aspire's OpenTelemetry docs runs `aspire docs get otel-integration --format json` and gets exactly the relevant section.

This is a DWS architectural gap. It is not a blocker for anything today, but it violates the spirit of our own "Build for Agents" rule. Aspire 13.2 just gave us the reference implementation to copy.

**Sketch of what `dws docs` could look like:**

```
dws docs list --format json
dws docs search "csrd" --limit 3 --format json
dws docs get DWS_SECURITY_STANDARD --section "13.3 CORS" --format json
dws docs get DWS_DATA_STANDARD --section "Retention policy" --format markdown
```

**Cost estimate (rough, not a commitment):** A minimal `dws docs` implementation that indexes the 13 standards listed in CLAUDE.md's "Required Reading" table is probably ~8–12h of work. The hard part is not the CLI wiring — it's deciding the section-slug convention so that agent calls are stable across standard revisions. This is a small-enough task to fit in a single PR but big enough to need a design sketch first.

**Recommendation:** Do not build `dws docs` today as part of this field note. Flag it as a follow-up, evaluate it as a standalone feature after the option 1/2/3 Aspire adoption decision is made. If we adopt option 1 (Aspire dashboard on DGX Spark), `aspire docs` can be proven in our environment first, which gives us a known-good reference before we write our own.

> **See dedicated gap analysis:** `docs/field-notes/2026-04-10-dws-docs-cli-gap-aspire-pattern.md` — expanded treatment of the `dws kb` vs `dws docs` distinction, the decision rule for agents picking between them, and the full Aspire CLI reference for context.

---

### 3.8 Aspire 13.4 ground-truth update (v1.3) — dashboard bump 13.3.5 → 13.4.6, breaking-change audit

Option 1 (dashboard-only adoption, Section 2.4) is live: `aspire-dashboard:13.3.5` shipped in `infrastructure/dgx-spark/docker-compose.yml` (compose v1.1.1). This update bumps it **13.3.5 → 13.4.6** — the current latest **stable** release of `microsoft/aspire` (v13.4.6, 2026-06-20, verified 2026-07-26; the `main` branch is developing 13.5.0-preview.1, which we deliberately do **not** pin — stable only, never `:latest`).

**Breaking-change audit against the Aspire 13.4 release notes**, checked against what DGX Spark actually runs (standalone dashboard container only — no AppHost, no C#/TypeScript AppHost, no Aspire-hosted Postgres/RabbitMQ/Kubernetes/Foundry resources):

| 13.4 breaking change                                             | Applies to DGX Spark?                                                   |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `aspire exec` removed                                            | No — never used                                                         |
| TypeScript SDK modules moved to `.aspire/modules/`               | No — no AppHost project                                                 |
| Persistent executable/project lifetimes (DCP schema change)      | No — no AppHost project                                                 |
| Kubernetes `WithRoute` → `WithPath` rename                       | No — no Kubernetes environment resource                                 |
| Azure Front Door naming change                                   | No — no Azure Front Door resource                                       |
| Foundry hosted-agent API renames                                 | No — no Foundry hosted-agent resource                                   |
| RabbitMQ default image 4.2 → 4.3                                 | No — no Aspire-hosted RabbitMQ resource                                 |
| **PostgreSQL default image 17.6 → 18.3** (data-volume breakage)  | No — no Aspire-hosted Postgres resource; DWS Postgres runs via Supabase |

**Conclusion:** for the dashboard-only architecture this note has tracked since v1.0, the 13.4 upgrade is a pure image-tag bump with zero migration surface — the same conclusion §3.4 reached for the 9.5 → 13 jump. Adopting a newer Aspire line costs nothing extra as long as we stay dashboard-only.

**Provenance:** this carries forward the substance of PR #1557 (`claude/aspire-version-update-w21fyd`, Sonnet 5, 2026-07-05), which became `dirty` against compose v1.3.1 (the July silent-telemetry port fix) and could not be merged as-is; the change is re-applied here on current `main`. As in that PR, the Aspire CLI itself was **not** installed on the DGX Spark host — the cloud session has no SSH/network path to the physical machine, and moving from "dashboard-only, no CLI" to "CLI + dashboard" is a separate architecture decision (Section 5 gate), not a version-bump task.

---

## 4. What We Don't Know (Honesty Register — updated)

v1.0 had 5 open questions. v1.1 resolves 4 of them and adds 2 new ones.

**Resolved in v1.1:**

- ~~Exact Aspire 13.2 release date~~ → **March 31, 2026** (confirmed via InfoQ and Visual Studio Magazine). The @JamesNK tweet is a ~10-day-later reminder post, not the launch announcement.
- ~~Whether 13.2 requires .NET 10 or .NET 11~~ → **.NET 10 LTS** (confirmed via upgrade guide targeting `net10.0`).
- ~~Whether Microsoft changed Aspire's versioning scheme~~ → **Yes, deliberately.** Skip announced at .NET Conf 2025.
- ~~Whether @JamesNK's tweet is authentic~~ → **Authentic in spirit** — the `--isolated` flag is documented in official release notes. The tweet phrasing was not independently verified, but the claim it makes is correct.

**Still open:**

- **Whether `--isolated` works with the `aspire-dashboard` standalone container**, or only when a full AppHost is present. If the flag is AppHost-gated, option 1 (dashboard-only adoption) does not benefit from it. Need to read the 13.2 dashboard section of devblogs.microsoft.com specifically.
- **Whether `--isolated` prevents collision on shared data volumes** (`WithDataVolume()`). If two isolated runs both mount the same Postgres volume, data corruption is still possible. This is a developer-experience caveat worth testing.

**New unknowns from v1.1:**

- **TypeScript AppHost preview stability.** Preview → GA timeline is not published. If it stabilizes in Aspire 13.3, our option-2 cost analysis changes materially.
- **Whether Aspire's "CLI as first-class agent interface" narrative includes Claude Code specifically**, or only Microsoft's own coding agents (Copilot, Visual Studio 2026 integration). If the MCP surface is open, DWS agents can drive Aspire directly; if it's VS-proprietary, we need to wrap it.

---

## 5. Follow-Up Actions (tractable, not speculative)

- [x] ~~Fetch the devblogs.microsoft.com/aspire/ release post~~ — done in v1.1 via web search (devblog direct fetch returned 403; InfoQ + Visual Studio Magazine + aspire.dev covered the same material).
- [ ] Correct `Learn/ASPIRE_SENSOR_MANAGEMENT_PLAN_v1.0.html:232` — LEAVE ALONE per Section 3.3. v1.0 is a historical artifact; v2.0 already cut Aspire. Do not rewrite history.
- [ ] Correct `Partners/Partners_gamma.md:341` to say "Aspire Dashboard _planned_ for DGX Spark" until we actually deploy it — current wording overclaims to partners. **Still needs human approval before editing partner deck.**
- [ ] Decide (CEO-level, not agent-level): option 1 vs option 2 vs option 3. v1.1 updates the tradeoff: if TypeScript AppHost leaves preview, option 2's cost drops sharply because no .NET runtime is needed on DGX Spark.
- [ ] If option 1 is approved: add `aspire-dashboard:13.2` (pinned, never `:latest`) to `infrastructure/dgx-spark/docker-compose.yml`. Verify first whether `--isolated` works against standalone dashboard or is AppHost-gated.
- [ ] Re-evaluate option 2 in ~3 months once TypeScript AppHost preview stabilizes. Track via Aspire Roadmap Q1 2026 GitHub Discussion #15662.
- [ ] Cross-reference with `docs/research/2026-04-08-aspire-observability-vs-dotnet-skills.md` — that note's Aspire Dashboard section should cite 13.2 if we adopt it.
- [ ] Update `Learn/Oppimispäiväkirja.md` thesis diary to reflect the Aspire rebrand and version jump. **BLOCKED — RED ZONE.** Thesis files require explicit human approval per CLAUDE.md Thesis Update Rule.
- [ ] **(v1.2 new)** Design `dws docs {list,search,get}` CLI subcommand per Section 3.7, modeled on `aspire docs`. ~8–12h estimate. Decide after option 1/2/3 Aspire adoption decision is made — do not build today. Needs a section-slug design sketch before implementation.
- [ ] **(v1.2 new)** Verify that `aspire docs get --format json` output schema is stable across 13.2.x patch releases before copying its contract. If Microsoft changes the JSON shape between 13.2.0 and 13.2.1, our `dws docs` can't assume it.

---

## 6. Ontology Note for LWM

This field note captures a **tooling-release-with-implementation-gap** pattern worth modeling in the Lifetime World Model:

- **Upstream signal:** Microsoft ships feature X on date D
- **Internal narrative:** Several layered documents (partner pitch, thesis diary, research note, plan) each make partially-true claims about feature X's status
- **Ground truth:** `infrastructure/` directory, which has no feature X at all
- **Gap detection rule:** When the narrative layer mentions a version number, verify it against the actual deployed artifact. If they disagree, the narrative is lying (benignly, usually aspirationally) and must be corrected before a partner sees it.

This is the same failure mode as the "overclaiming product catalog" risk flagged in `DWS_MARKET_RESEARCH_STANDARD.md`, and the correction discipline is identical: **never let a document claim we run software we don't run.**

---

## CHANGES MADE

- `docs/field-notes/2026-04-10-aspire-13-2-isolated-mode.md` v1.0: created — captured the Aspire 13.2 `--isolated` announcement, audited the gap between DWS narrative ("Aspire on DGX Spark") and reality (not deployed), surfaced three adoption options
- `docs/field-notes/2026-04-10-aspire-13-2-isolated-mode.md` v1.1: added Section 3 "The 9.5 → 13 Version Jump — Resolved" with full timeline, three explicit reasons Microsoft gave at .NET Conf 2025, corrected the repo's "9.2 (March 2026)" error, added 13.2 confirmed feature highlights, updated honesty register (4 resolved, 2 new unknowns), updated follow-up actions
- `docs/field-notes/2026-04-10-aspire-13-2-isolated-mode.md` v1.2: added Section 3.7 "`aspire docs` — concrete 'Build for Agents' proof" — documented the `aspire docs {list,search,get} --format Json` CLI family introduced alongside 13.2, mapped it against the DWS "Build for Agents" 5-point rule (Microsoft hit all 5), flagged the missing `dws docs` equivalent in our own CLI as an architectural gap, sketched what `dws docs` could look like with an ~8–12h cost estimate. Added two new follow-up actions (design `dws docs`, verify schema stability). Added 4 new reference URLs.

## THINGS I DIDN'T TOUCH

- `Partners/Partners_gamma.md:341`: overclaims Aspire on DGX Spark — still not editing the partner deck without explicit human approval (YELLOW zone for partner content)
- `Learn/ASPIRE_SENSOR_MANAGEMENT_PLAN_v1.0.html:232`: stale "Aspire 9.2 (March 2026)" reference — intentionally preserved as historical artifact per Section 3.3; v2.0 already cut Aspire entirely
- `Learn/Oppimispäiväkirja.md`: thesis file — RED ZONE per CLAUDE.md Thesis Update Rule; diary narrative about "Aspire continues on DGX Spark" would benefit from a rebrand update but requires explicit human approval and synchronized update across all 4 thesis files
- `infrastructure/dgx-spark/docker-compose.yml`: no changes — adoption is a strategy decision, not a field-note action
- `docs/research/2026-04-08-aspire-observability-vs-dotnet-skills.md`: did not back-edit the 2-day-old research note; that note pre-dates the rebrand context, so its ".NET Aspire" wording is technically stale but historically accurate as of its own date

## POTENTIAL CONCERNS

- **The devblog direct fetch failed (403).** All 13.2 feature claims in Section 3.5 are sourced from InfoQ (infoq.com/news/2026/04/aspire-13-2-release/), Visual Studio Magazine (visualstudiomagazine.com/articles/2026/03/25/...), and aspire.dev's public what's-new page — not from the primary devblogs.microsoft.com post. Confidence is High but not primary-sourced.
- **Two open `--isolated` questions remain** (dashboard-standalone compatibility; shared data volume behavior). Both matter for the option 1 decision — they must be answered before we commit code to docker-compose.yml.
- **The DWS internal narrative still says ".NET Aspire"** in multiple places (Partners_gamma.md, Oppimispäiväkirja.md, the sensor plan, the Apr 8 research note). After .NET Conf 2025 this wording is technically outdated. Correcting it is a documentation hygiene sweep, not a single edit — and the thesis file is RED zone.
- **TypeScript AppHost preview changes the option 2 math.** The v1.0 recommendation (option 1) was based on "no .NET runtime on DGX Spark." If TS AppHost stabilizes, that constraint evaporates. The CEO-level decision should be deferred 3 months, not made today.

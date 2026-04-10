# Field Note: Aspire 13.2 `--isolated` Mode — Parallel AppHost Instances Without Port Conflicts

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/aspire-isolated-mode-research-ilcUR | Date: 10.04.2026 | Changes: Initial capture of Aspire 13.2 isolated mode announcement (@JamesNK / devblogs.microsoft.com/aspire) and version-gap analysis against DGX Spark backend observability stack

Session Links & References:

- Upstream source (tweet): @JamesNK — "Aspire 13.2 introduces isolated mode, letting you run multiple instances of the same AppHost in parallel without port conflicts"
- Microsoft blog (cited in tweet, fetch-on-next-session): https://devblogs.microsoft.com/aspire/
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

**But we are not on Aspire 13.2 — and we are not on Aspire at all yet.** The repo's latest pinned reference is **Aspire 9.2 (March 2026)** in `Learn/ASPIRE_SENSOR_MANAGEMENT_PLAN_v1.0.html:232`, and the actual `infrastructure/dgx-spark/` directory contains **zero** Aspire artifacts. Aspire remains a _planned_ observability overlay, not a deployed component.

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

## 3. What We Don't Know (Honesty Register)

- **Exact Aspire 13.2 release date.** Announcement says "introduces" — could be GA, could be preview. Devblog post must be fetched to confirm.
- **Whether 13.2 requires .NET 10 or .NET 11.** Aspire's .NET SDK floor has moved roughly once per major. Unknown for 13.2.
- **Whether `--isolated` works with `aspire-dashboard:13.2` standalone**, or only when a full AppHost is present. If it's AppHost-gated, option 1 above does not benefit from it.
- **Whether Microsoft changed Aspire's versioning scheme** between 9.2 (March 2026) and 13.2 (today). A jump of 4 major versions in ~1 month is suspicious — either calendar versioning kicked in, or the 9.2 reference in the repo is itself wrong and should be corrected.
- **Whether @JamesNK's tweet is authentic** in this exact form. Copy-pasted from the user prompt; not independently fetched.

---

## 4. Follow-Up Actions (tractable, not speculative)

- [ ] Fetch the devblogs.microsoft.com/aspire/ release post and append v1.1 amendment with exact 13.2 feature list, .NET SDK floor, and `--isolated` semantics
- [ ] Correct `Learn/ASPIRE_SENSOR_MANAGEMENT_PLAN_v1.0.html:232` ("Aspire 9.2") if 13.2 is authoritative — but only if v1.0 is still referenced anywhere (v2.0 cut Aspire anyway)
- [ ] Correct `Partners/Partners_gamma.md:341` to say "Aspire Dashboard _planned_ for DGX Spark" until we actually deploy it — current wording overclaims to partners
- [ ] Decide (CEO-level, not agent-level): option 1 vs option 2 vs option 3 above. This is a strategy call, not a cleanup task.
- [ ] If option 1 is approved: add `aspire-dashboard:13.2` to `infrastructure/dgx-spark/docker-compose.yml` with pinned tag (never `:latest`)
- [ ] Cross-reference with `docs/research/2026-04-08-aspire-observability-vs-dotnet-skills.md` — that note's Aspire Dashboard section should cite 13.2 if we adopt it

---

## 5. Ontology Note for LWM

This field note captures a **tooling-release-with-implementation-gap** pattern worth modeling in the Lifetime World Model:

- **Upstream signal:** Microsoft ships feature X on date D
- **Internal narrative:** Several layered documents (partner pitch, thesis diary, research note, plan) each make partially-true claims about feature X's status
- **Ground truth:** `infrastructure/` directory, which has no feature X at all
- **Gap detection rule:** When the narrative layer mentions a version number, verify it against the actual deployed artifact. If they disagree, the narrative is lying (benignly, usually aspirationally) and must be corrected before a partner sees it.

This is the same failure mode as the "overclaiming product catalog" risk flagged in `DWS_MARKET_RESEARCH_STANDARD.md`, and the correction discipline is identical: **never let a document claim we run software we don't run.**

---

## CHANGES MADE

- `docs/field-notes/2026-04-10-aspire-13-2-isolated-mode.md`: created — captures the Aspire 13.2 `--isolated` announcement, audits the gap between DWS narrative ("Aspire on DGX Spark") and reality (not deployed), and surfaces three adoption options for CEO-level decision

## THINGS I DIDN'T TOUCH

- `Partners/Partners_gamma.md:341`: overclaims Aspire on DGX Spark but I did not edit the partner deck without explicit approval
- `Learn/ASPIRE_SENSOR_MANAGEMENT_PLAN_v1.0.html:232`: stale "Aspire 9.2" reference, but v2.0 of the plan already cut Aspire, so the v1.0 HTML is historical — editing it would rewrite history
- `infrastructure/dgx-spark/docker-compose.yml`: no changes — adoption is a strategy decision, not a field-note action
- `docs/research/2026-04-08-aspire-observability-vs-dotnet-skills.md`: did not back-edit the 2-day-old research note; a v1.2 amendment there belongs to that note's own session

## POTENTIAL CONCERNS

- I did not fetch `devblogs.microsoft.com/aspire/` in this session. The 13.2 `--isolated` claim is reproduced from the user's prompt text, not independently verified. Confidence on the announcement itself is Medium.
- The 9.2 → 13.2 jump in ~1 month is suspicious. Either Microsoft changed versioning, or the 9.2 reference in the repo is wrong, or the tweet is wrong. All three should be considered when v1.1 is written.
- The "Aspire on DGX Spark" partner narrative is an overclaim today. If a partner reads Partners_gamma.md and asks for a dashboard URL, we have nothing to show them. This is a trust risk, not a technical risk.

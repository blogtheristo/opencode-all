# TypeScript 7 (Go-Native Compiler) — DWS6 Repository Impact & Sovereignty Assessment

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: claude/typescript-7-repo-impact-u4ec7m | Date: 09.07.2026 | Changes: Initial research report — TypeScript 7.0 GA (2026-07-08) impact survey across every live (non-`artifacts/`) package.json/tsconfig in the monorepo, CI type-check touchpoints, and a sovereignty assessment of the TypeScript/tsc-go dependency against both DWS sovereignty frameworks (vendor-tier map and three-pillar model).

Document Status:

- Created: 09.07.2026
- Last Modified: 09.07.2026
- Language: English
- Publication Status: INTERNAL — engineering research note, not for public site

Related Documents:

- `DWS_SECURITY_STANDARD.md` §17.5 — Infrastructure Sovereignty Rule (CLOUD Act)
- `DWS_SOVEREIGNTY_STANDARD.md` — TASO legal-sovereignty hierarchy
- `DWS_STANDARDS_LIBRARY.md` §3.6 — Sovereignty Tier Map (T1/T2/T3)
- `docs/field-notes/2026-05-28-three-pillars-sovereignty-global.md` — Three-Pillar sovereignty model (Data/Technology/Operational)
- `.claude/commands/sovereignty-assess.md`, `.claude/commands/sovereignty-pillars-assess.md` — operative scoring rubrics
- `.github/workflows/test-on-pr.yml` — the one workflow this note is scoped against

---

- **Date:** 09.07.2026
- **Author:** Claude Code research session, prepared for Risto Anton Päärni, Founder, CEO, Lifetime Oy
- **Trigger:** TypeScript 7.0 went GA on 2026-07-08 (Microsoft's Go-native rewrite, codename "Project Corsa"). Requested: repository impact assessment with special focus on which dependencies are/aren't "sovereign."

## TL;DR

1. **TypeScript 7.0 is a from-scratch Go rewrite of the compiler**, ~10x faster on type-checks, GA as of yesterday (2026-07-08). Still Apache-2.0, still Microsoft-owned, still distributed via npm.
2. **DWS6 already clears the practical upgrade prerequisites** repo-wide: every package with an `engines.node` field requires `>=24.17.0` and CI runs Node 24 — comfortably above TS7's Node 20+ floor. No package in scope imports the TypeScript Compiler API (`import ... from 'typescript'`), which is the one hard breaking change (the "Strada" API doesn't exist in TS7.0; a replacement lands in 7.1).
3. **Real risk is concentrated in two files**, not the whole repo: `dws6.com/dashboard/firehorse/v10-react/` (and its `landing-pages/` mirror) uses TS project references (`tsc -b`), `verbatimModuleSyntax`, and `erasableSyntaxOnly` — exactly the settings most exposed to compiler-internals changes. Everything else in the repo is a flat, single-file `tsc -p tsconfig.json` build with no decorators, no `paths`/`baseUrl`, no legacy `es5`/`amd` targets.
4. **CI gap, unrelated to TS7 but relevant to any TS7 rollout**: only `test-on-pr.yml` runs `tsc` as a gate, and only against the root `src/**` tree. `cli/`, `mcp-hub-ts/`, `mcp-servers/cloud-run-gateway-ts/`, `src/cloudflare/`, and both dashboard copies have their own `tsc`/`tsc -b` scripts but none of them run in any GitHub Actions workflow — a TS7 regression there would surface at deploy time, not in PR review.
5. **Sovereignty verdict: TypeScript is a Microsoft (US) build-time dependency, before and after v7 — nothing changes.** DWS's PERMANENT §17.5 rule ("no US-owned cloud provider for production customer data") is scoped to _hosted infrastructure_, not dev tooling, so TS7 doesn't trip it. Under the separate three-pillar model, TypeScript is purely a Technology-Sovereignty (CSB) question — no customer data passes through the compiler — and it was already a non-Tier-1 dependency under the general TASO test (US-headquartered vendor). Adopting TS7 introduces **no new sovereignty exposure** beyond what already existed with TS5/TS6; it is the same vendor, same license, same distribution channel, running through the same npm registry (already a pre-existing, non-EU-sovereign supply-chain dependency for every JS/TS project in this repo, not something TS7 changes).

---

## 1. What TypeScript 7 actually is

- **Release:** GA 2026-07-08 (RC shipped 2026-06-18), ~3 weeks RC→GA. Internal codename "Project Corsa" — over a year of development, pre-release tested with Bloomberg, Canva, Figma, Google, Linear, Notion, Slack, Vercel, VoidZero. ([Announcing TypeScript 7.0](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/))
- **What changed:** the entire compiler + language service is reimplemented in Go instead of hand-rolled JS (previously self-hosted/bootstrapped). Native code + shared-memory parallelism ⇒ **~10x faster type-checks**, ~2.9x lower memory, files parsed/checked/emitted in parallel automatically. Reported ~99.6% test-suite compatibility (19,926/20,000 compiler tests passing) against the classic compiler. ([byteiota](https://byteiota.com/typescript-7-go-compiler-breaking-changes-migration-guide/), [Visual Studio Magazine](https://visualstudiomagazine.com/articles/2026/06/22/typescript-7-0-rc-moves-microsofts-go-rewrite-into-the-mainline-compiler.aspx))
- **Distribution:** still `npm install -D typescript` (now backed by the Go binary under the hood); the standalone preview package was `@typescript/native-preview` (`npx tsgo`) during development. License remains Apache-2.0. No separate Go toolchain install required by consumers — ships as a compiled npm binary. ([microsoft/typescript-go](https://github.com/microsoft/typescript-go))
- **Minimum Node.js:** raised to **Node 20+** (from 14.17 in TS5.1-era). ([digitalapplied.com](https://www.digitalapplied.com/blog/typescript-7-0-rc-go-native-compiler-2026-upgrade-guide))
- **Breaking changes relevant here:**
  - `target: "es5"` removed — minimum target is now ES2015.
  - `module: "amd" | "umd" | "systemjs" | "none"` removed — only ESNext, ES2022, NodeNext, CommonJS remain.
  - Omitted `types` in tsconfig used to auto-include all `@types/*`; now defaults to an empty array (must list explicitly or set `typeRoots`).
  - `strict` now defaults to `true` if not explicitly set.
  - **The Compiler API (`import * as ts from 'typescript'`, aka "Strada") does not exist in 7.0** — a new API is promised for 7.1, not shipped yet.
  - Long-term, `microsoft/typescript-go` is expected to merge back into `microsoft/TypeScript` — one project, one package, going forward.

Sources: [Announcing TypeScript 7.0](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/) · [TypeScript 7 Is Generally Available](https://braindetox.kr/en/posts/typescript_v7_go_release_2026.html) · [TypeScript 7.0 RC — Go-Native Compiler](https://www.digitalapplied.com/blog/typescript-7-0-rc-go-native-compiler-2026-upgrade-guide) · [TypeScript 7: Go Compiler, Breaking Changes, Migration Guide](https://byteiota.com/typescript-7-go-compiler-breaking-changes-migration-guide/) · [microsoft/typescript-go](https://github.com/microsoft/typescript-go)

---

## 2. Repository footprint (live, non-`artifacts/` packages only)

| Package                                                               | `typescript` range        | Build                                                                                       | tsconfig risk flags                                                                                                                                                |
| --------------------------------------------------------------------- | ------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **root** (`dws6-auth-backend`)                                        | `^5.6.3`                  | `tsc -p tsconfig.json`; `tsx` for all `scripts/*.ts` entry points; `vitest`                 | None — no decorators, no `paths`/`baseUrl`, `moduleResolution: bundler`, no project refs. `engines.node >=24.17.0`.                                                |
| `cli/`                                                                | `^5.6.3`                  | `tsc -p tsconfig.json` (esbuild present as a dep but unused by `build`)                     | None flagged                                                                                                                                                       |
| `mcp-hub-ts/`                                                         | `^5.9.3`                  | `tsc -p tsconfig.json`, `moduleResolution: NodeNext`                                        | None flagged                                                                                                                                                       |
| `mcp-servers/cloud-run-gateway-ts/`                                   | `^5.9.3`                  | same pattern                                                                                | None flagged                                                                                                                                                       |
| `src/cloudflare/`                                                     | `^5.7.0`                  | `esbuild`-driven build, `vitest`, `wrangler`                                                | `isolatedModules: true`                                                                                                                                            |
| `dws6.com/tools/content-pipeline/` (+ `landing-pages/` mirror)        | `~5.8.3`                  | `tsc -b && vite build`                                                                      | `isolatedModules: true`                                                                                                                                            |
| `dws6.com/dashboard/firehorse/v10-react/` (+ `landing-pages/` mirror) | `~5.9.3`                  | `tsc -b && vite build`, **project references** (`tsconfig.app.json` + `tsconfig.node.json`) | `isolatedModules`, **`verbatimModuleSyntax: true`**, **`erasableSyntaxOnly: true`**, `composite`-style build — the repo's most compiler-internals-sensitive config |
| `infrastructure/dgx-spark/bumblebee/`                                 | none (runs raw via `tsx`) | n/a                                                                                         | n/a                                                                                                                                                                |
| `lambda/ses-inbound-parser/`                                          | none — plain `.mjs`       | n/a                                                                                         | n/a                                                                                                                                                                |
| `mobile-dashboard_RETIRED/`                                           | `^5.1.0`                  | Expo/Metro/Babel, `tsc --noEmit` type-check only                                            | `@typescript-eslint` present                                                                                                                                       |
| `Firehorse/mobile-app/`                                               | `^5.3.3`                  | Expo/Metro/Babel                                                                            | none flagged                                                                                                                                                       |

No package uses `experimentalDecorators`, `paths`, `baseUrl`, or a legacy `es5`/`amd` target — the specific settings TS7 removes outright. No `ts-jest` anywhere (tests run via `vitest` or `jest-expo`, both Babel/esbuild-transpiled, independent of `tsc`). **No package in `src/`, `scripts/`, or `cli/` imports the TypeScript Compiler API** — the one genuinely hard TS7.0 break doesn't apply here.

`dws6.com/` and `landing-pages/dws6-com/` are byte-identical mirrors per the Dual Folder Sync rule — treat the footprint above as one logical surface duplicated in two places; any TS7 fix there needs to land in both per CLAUDE.md's sync rule.

## 3. CI type-check coverage

Only **one** workflow gates `tsc`: `.github/workflows/test-on-pr.yml`, job `test`, step `npx tsc --noEmit --pretty` against the **root** tsconfig, on a **self-hosted `dgx-spark` runner**, **Node 24**, triggered only on changes under `src/**`, `tests/**`, two `dws10.com/` paths, `package.json`, `tsconfig.json`, `vitest.config.ts`.

That means `cli/`, `mcp-hub-ts/`, `mcp-servers/cloud-run-gateway-ts/`, `src/cloudflare/`, and both `v10-react` dashboard copies each have their own `tsc`/`tsc -b` scripts but **none run in any GitHub Actions workflow** — this is a pre-existing CI gap, not something TS7 introduces, but it means a TS7-related regression in those five packages would only surface locally or at deploy time, not in PR review. Worth closing independent of the TS7 decision.

## 4. Sovereignty assessment

DWS has two distinct, explicitly non-overlapping canonical sovereignty models (per `DWS_STANDARDS_LIBRARY.md` §3.6: _"DWS will not use one word — 'sovereign' — to mean three different things"_). Applying both to TypeScript/tsc-go as a dependency:

### 4.1 Vendor-tier / TASO test (`DWS_SOVEREIGNTY_STANDARD.md`, `DWS_STANDARDS_LIBRARY.md` §3.6)

```
TASO 1: EU company + EU infra + EU law     → SOVEREIGN
TASO 2: EU company + US infra + EU location → PARTIAL
TASO 3: US company + EU infra + EU location → INSUFFICIENT
TASO 4: US company + US infra + EU location → NOT SOVEREIGN
```

Microsoft is a US-headquartered legal entity, which is the disqualifying fact regardless of where any given artifact is hosted or built — the standard cites Microsoft's own France country director telling the French Senate (June 2025) he could not guarantee French data's immunity from US authority demands, precisely to make the point that vendor size/reputation doesn't exempt a company from CLOUD Act/FISA 702 reach. By this test, TypeScript (any version, including 7.0) is and always was a **TASO 3/4-equivalent** dependency.

**But §17.5 ("PERMANENT SECURITY RULE") is explicitly scoped to hosted production infrastructure carrying DWS customer data** ("No US-owned cloud provider ... for DWS production customer data"). A `devDependency` that runs at build time in CI and never touches customer data at runtime is outside that rule's stated scope. TS7 doesn't change this — it was true of TS5/TS6 too.

### 4.2 Three-pillar model (Data / Technology / Operational Sovereignty)

TypeScript/tsc-go maps cleanly onto **Technology Sovereignty (the CSB pillar)** only — no customer data flows through a compiler at build time, so the Data-Sovereignty (SIB) pillar isn't engaged.

CSB scoring factors from `.claude/commands/sovereignty-pillars-assess.md`, applied qualitatively:

| Factor                                 | TS7 assessment                                                                                                                                                                                                                                                                                          |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Portability index                      | Neutral-to-positive: TS7 reports ~99.6% test compatibility with classic `tsc`; language semantics, tsconfig format, and (mostly) emitted JS are unchanged — switching cost is low, and DWS isn't locked into the Go binary specifically (the JS-based `tsc` line keeps working through the transition). |
| Open-source share                      | Positive: `microsoft/typescript-go` is Apache-2.0, same license as classic TypeScript — no new closed-source dependency introduced.                                                                                                                                                                     |
| On-prem / self-host fraction           | Unchanged: TypeScript already flows through the US-domiciled npm registry regardless of version; TS7 doesn't add a new always-on network dependency (no telemetry endpoint documented in the public repo or announcement).                                                                              |
| Vendor lock-in / opaque build pipeline | Slightly negative but not new: DWS still depends on Microsoft's release cadence and binary-build pipeline for `tsc`, same as always — TS7 doesn't deepen this, since `microsoft/typescript-go` is stated to eventually merge back into the single `microsoft/TypeScript` repo.                          |

**Structural framing** (from the three-pillar field note): _"An EU-origin enterprise emphasizes Data sovereignty... Technology Sovereignty is hard. Europe is largely dependent on US hyperscalers."_ This is a pre-existing, repo-wide condition (Node.js/Google V8, npm/GitHub, TypeScript/Microsoft, most of the JS ecosystem) that TS7 neither creates nor worsens — DWS's actual Technology-Sovereignty lever here is the **CI runner**, not the compiler: `test-on-pr.yml` already runs on **self-hosted `dgx-spark`** hardware rather than a US hyperscaler-hosted GitHub Actions runner, which is the correct sovereignty lever to pull (compute substrate), independent of which vendor wrote the compiler that substrate executes.

### 4.3 Bottom line

**Adopting TypeScript 7 is sovereignty-neutral.** It doesn't change TypeScript's vendor (still Microsoft/US), its license (still Apache-2.0), its distribution channel (still npm), or whether customer data touches it (still never, at build time). The one thing genuinely worth tracking going forward — independent of this specific upgrade — is whether Microsoft ships telemetry/usage-reporting in the Go binary that the pure-JS compiler never had; nothing in the public announcement or repo documents such a feature as of GA, but this is worth a one-line recheck at final adoption time (`tsgo`/`tsc --help` flags, any `--telemetry` or first-run network call) rather than blocking on it now.

---

## 5. Recommendation

1. **Not urgent, not blocked.** No dependency, CI, or sovereignty finding forces or forbids adopting TS7 on any timeline.
2. **If/when upgrading:** pin `typescript` to `^7.0.x` in the root `package.json` first (lowest-risk surface — no project references, no `verbatimModuleSyntax`), run `npx tsc --noEmit --pretty` locally and compare diagnostics against the current TS5.6 run before touching CI.
3. **Test the two dashboards last and explicitly**: `dws6.com/dashboard/firehorse/v10-react/` (+ `landing-pages/` mirror) is the one place project references + `verbatimModuleSyntax` + `erasableSyntaxOnly` could interact with compiler-internals changes in a Go rewrite — verify `tsc -b` incremental build info and Vite's TS-aware HMR still behave identically before merging.
4. **Close the CI gap regardless of the TS7 decision**: `cli/`, `mcp-hub-ts/`, `cloud-run-gateway-ts/`, `src/cloudflare/`, and both dashboard copies have working `tsc`/`tsc -b` scripts with zero CI enforcement today — worth a follow-up PR to wire them into `test-on-pr.yml` or a sibling workflow so a future TS7 regression (or any regression) surfaces in PR review, not at deploy time.
5. **No sovereignty gate applies** — this is a normal dependency-version decision, not a §17.5 event. No exception documentation, no HIL escalation, no `/sovereignty-assess` run needed.

# Next-Session Prompt — NemoClaw migration + DWS-agent integration (handoff)

_Author: Claude Code session `claude/nvidia-vera-rubin-card-be8g7t`, 25.06.2026. Paste this whole file as the opening prompt of the next session, or read it first thing._

---

## 0. Copy-paste opening instruction

> You are continuing work on branch `claude/nvidia-vera-rubin-card-be8g7t` (PR #1500, repo `blogtheristo/dws6`). Read `docs/handoff/2026-06-25-nemoclaw-migration-handoff.md` and `docs/migrations/2026-06-25-openclaw-to-nemoclaw.md` first. The OpenClaw→NemoClaw migration is code-complete and build/test-verified; only human-gated items and an optional integration design remain. Follow the conventions in §5 below. Do not rewrite historical records. Verify with `npm ci && npm run build && npx vitest run` before every commit. Commit and push to the same branch; do NOT open a new PR (use #1500).

---

## 1. Where things stand

- **Branch:** `claude/nvidia-vera-rubin-card-be8g7t` → base `main`. **PR #1500** (already open; update it, don't create another).
- **Tip commit at handoff:** `78a4cf9`. Build green (`npm run build` = `tsc -p tsconfig.json`), tests green (`vitest`), CI green on lint/truth-lint/security/audit/images (test re-runs per push).
- **Deps:** `npm ci` works (Node 22 in env; package.json wants ≥24 — EBADENGINE warning only, builds fine).

## 2. What this session shipped (commit trail)

1. Blog: NVIDIA Vera Rubin partner note **LSJ #32** (`onelifetime.world/posts/nvidia-vera-rubin-ai-factory.html`) + EuroHPC field note **LSJ #33** (`eu-sovereign-ai-factories-35-supercomputers.html`). Registered in `docs/BLOG_STANDARD.md` (§3, v1.9), `blog/index.html` `latestPosts`, `scripts/inject-blog-nav.cjs`. Dual-folder mirrored.
2. Store: Situation Room page (`dws10.com/products/situation-room.html` + mirror) — "When you need more compute" 3-rung ladder + NVIDIA Halos safety layer + Halos image (`static/images/halos-outside-in-robotics.jpg`).
3. Whitepaper: replaced customer-facing `OpenClaw` → `NVIDIA NemoClaw` in `dws10.com/kya-standard/whitepaper/index.html` (+ mirror). Added document-revision blocks to 4 live whitepapers.
4. Standard: `DWS_DOCUMENT_STANDARD.md` v2.1 — new **§20 Whitepaper Versioning**.
5. Thesis lockstep **v3.69** (KC #37, §14.31 — EuroHPC + NVIDIA agent runtime) and **v3.70** (KC #38, §14.32 — regulated-industry autonomous-engineer category on NemoClaw). All 4 thesis files + `Learn/*_v3.69/3.70.html` regenerated. Field notes in `docs/field-notes/`.
6. **OpenClaw → NemoClaw migration** (plan: `docs/migrations/2026-06-25-openclaw-to-nemoclaw.md`, v1.1):
   - Phase 1 — backward-compat env aliases (later removed).
   - Phase 2 — source/class rename: `src/mcp/openclaw-bridge.ts`→`nemoclaw-bridge.ts` (`NemoClawBridge`), `src/sandbox/openclaw-sandbox.ts`→`nemoclaw-sandbox.ts` (`NemoClawSandbox`), test renamed.
   - Full rename of DWS-owned identifiers: `NEMOCLAW_*` env, `nemoclawEndpoint/nemoclawApiKey`, `NemoClawSkillManifest`, `parseNemoClawAllowedSkills`, audit-ID prefix, log labels, `cli/src/cli.ts`, `scripts/on-deploy/firehorse-snap-benchmark.ts`, `mcp-hub/config/{aiven,exa}-mcp.json`, `infrastructure/dgx-spark/` (compose service/container/volumes/env, heartbeat, deploy).
   - Deployment + admin docs: `DWS_DEPLOYMENT_STANDARD.md` v1.5 (NemoClaw Runtime per-Surface entity + secret schema), `Admin/ADMIN_MANUAL.md` v3.5.
7. Agent rename: **Hermes orchestrator → Mercury** (`src/agents/workflow/mercury/`, `MercuryAgent`, name `'mercury'`) to avoid collision with NemoClaw's Hermes harness. 31/31 tests green.

## 3. NemoClaw architecture (verified against NVIDIA primary sources — do not re-litigate)

- **NemoClaw** = open _blueprint_ = **OpenShell** (open-source secure runtime, kernel sandbox) **+ a choice of harness (OpenClaw _or_ Hermes) + model router + NVIDIA NeMo libraries**. (github.com/NVIDIA/NemoClaw, nvidianews, docs.nvidia.com, build.nvidia.com.)
- **OpenClaw** and **Hermes** (Nous Research) are _harness options inside NemoClaw_ — NOT to be renamed. The upstream image `ghcr.io/openclaw/openclaw` and the `openclaw configure` CLI are legitimate external refs.
- DWS standardizes its local sovereign-edge agent runtime on **NemoClaw**.

## 4. OPEN ITEMS (do these next)

### 4A. Human-gated — the agent CANNOT do these (surface to Risto; do not attempt to bypass)

1. **`src/config/secret-loader.ts`** — permission-gated to the agent. Apply this rename (no runtime impact today — no secrets provisioned):
   ```
   - OPENCLAW_ENDPOINT: 'openclaw-endpoint',
   - OPENCLAW_API_KEY: 'openclaw-api-key',
   - EXA_API_KEY_OPENCLAW: 'exa-api-key-openclaw',
   + NEMOCLAW_ENDPOINT: 'nemoclaw-endpoint',
   + NEMOCLAW_API_KEY: 'nemoclaw-api-key',
   + NEMOCLAW_NGC_KEY: 'nemoclaw-ngc-key',
   ```
2. **`.claude/hooks/session-start.sh`** — RED→GREEN for PhD market-signal edits. Blocked by the self-modification classifier. Risto applies: RED line keep master's V3Thesis content + structural thesis edits RED; GREEN line add "PhD market-signal additions to PHD_FIREHORSE_EN/FI (§14.x + KC + lockstep bump per §1.4) are GREEN."
3. **Live DGX-Spark deploy** — bring up the `nemoclaw` docker service, cut health checks over, retire the old `openclaw` service, repoint `NEMOCLAW_IMAGE` at the NVIDIA-published NemoClaw image. RED zone (applying infra).

### 4B. Agent-doable — the high-impact next build (was deferred "thesis/strategy-first"; KC #38 = §14.32)

**Goal:** compose DWS Skilled Agents into NemoClaw long-running autonomous workflows ("compliance/CSRD/site-safety engineer"), governed by KYA + Article-12 + EU-sovereign envelope.

Recommended sequence (per CLAUDE.md, this touches 3+ files → architect first):

1. **Architect pass + design doc** → `docs/design/nemoclaw-agent-workflows.md`. Cover: (a) contract adapter between the DWS ledger-native output (`journalEntries + regulatoryArtifact + lineage`, see `src/agents/base.agent.ts`) and NemoClaw skill JSON-schema; (b) reverse skill-exposure (NemoClaw harness → DWS skill) on top of `src/mcp/nemoclaw-bridge.ts` (`registerSkill()`/`invoke()`, ATS gate, allowed-skills whitelist); (c) OpenShell policy per skill + KYA ATS per workflow; (d) which of the `src/agents/workflow/` orchestrators (apollo/athena/atlas/hephaestus/iris/**mercury**) map to NemoClaw "engineers".
2. **Thin spike** — expose ONE Skilled Agent (suggest `compliance.agent.ts`) as a NemoClaw skill end-to-end via the bridge, with the contract adapter + ATS gate. Build + test green before breadth. Verify the Article-12 log captures each NemoClaw-orchestrated step.
3. Only then breadth across agents/orchestrators.

### 4C. Optional polish

- Tighten thesis §14.31 wording: it says NemoClaw "reference stack"; the precise NVIDIA term is "blueprint" (accurate but looser). RED-zone thesis edit — bump v3.71 lockstep if done.
- If you edit the KYA whitepaper content again, bump its document revision (currently v1.1) per `DWS_DOCUMENT_STANDARD.md` §20.

## 5. CONVENTIONS — non-negotiable (read before editing)

- **Dual-folder sync (same commit):** `dws10.com/`→`landing-pages/dws10-com/`, `onelifetime.world/`→`landing-pages/onelifetime-world/`, `dws6.com/`, `lifetime.fi/`. Verify with `diff -q`.
- **Thesis lockstep:** any thesis change bumps ALL 4 files (`docs/PHD_FIREHORSE_EN.md`, `docs/PHD_FIREHORSE_FI.md`, `docs/metropolia/master-thesis/en/V3Thesis_EN.md`, `docs/metropolia/master-thesis/fi/V3Thesis_FI.md`) by the SAME version. Market/strategy signal → PhD content (EN+FI); master's get **lockstep-only** entries (§1.4 scope rule). Then `cp docs/...→Learn/*.md` and run `node scripts/gen-thesis-html.cjs` (reads from `Learn/*.md`, emits `Learn/*_vX.Y.html`; never delete old versions). Current version: **3.70** → next is 3.71. (Owner is precise about version numbers — confirm if unsure.)
- **Blog posts:** HTML only (never `.md` in public folders — Non-Negotiable Rule 5). New post → register in `docs/BLOG_STANDARD.md` §3 + `blog/index.html` `latestPosts[0]` (Text of the Day) + `scripts/inject-blog-nav.cjs` posts array, run `node scripts/inject-blog-nav.cjs`, dual-folder sync. Voice = §12 Seth Godin house style.
- **Whitepaper versioning:** `DWS_DOCUMENT_STANDARD.md` §20 — document revision + VERSION AND AGENT HISTORY (HTML-comment form for public HTML).
- **Do NOT rewrite historical records:** thesis VERSION AND AGENT HISTORY, dated `docs/field-notes/`, generated `Learn/` snapshots, `CHANGELOG.md`, `LOCKED_DECISIONS.md`, git branch names, and comparison/research docs (`docs/compare-openclaw-autoresearch.md`, `docs/research/openclaw-nemoclaw-dws6-integration-research.md`).
- **Do NOT rename external OpenClaw/Hermes harness refs** (they're real NemoClaw harnesses).
- **RED zones (human-gated):** applying DB migrations, outbound email, secrets, Store sync, master's-thesis content. `src/config/secret-loader.ts` and `.claude/hooks/session-start.sh` are permission-gated to the agent.
- **Verify gate:** `npm run build && npx vitest run` green before every commit touching `src/`. End commit messages with the `Co-Authored-By` + `Claude-Session` trailers.
- **Truth standard:** verify external product claims against primary sources before propagating (NVIDIA names caused a false-positive this session — domain-restricted search to nvidia.com/github.com resolved it).

## 6. Key file map

- Bridge: `src/mcp/nemoclaw-bridge.ts` · Sandbox: `src/sandbox/nemoclaw-sandbox.ts` · Env: `src/middleware/env-validation.ts`
- Agents: `src/agents/*.agent.ts` (51), `src/agents/base.agent.ts`, `src/agents/index.ts`, `src/agents/workflow/{apollo,athena,atlas,hephaestus,iris,mercury,industry}/`, `src/agents/article12-logger.ts`
- Infra: `infrastructure/dgx-spark/{docker-compose.yml,heartbeat.ts,deploy.sh}`
- Migration plan: `docs/migrations/2026-06-25-openclaw-to-nemoclaw.md`
- Thesis: `docs/PHD_FIREHORSE_{EN,FI}.md` §14.31/§14.32, `docs/metropolia/master-thesis/{en,fi}/V3Thesis_{EN,FI}.md`
- Standards: `DWS_DEPLOYMENT_STANDARD.md`, `Admin/ADMIN_MANUAL.md`, `DWS_DOCUMENT_STANDARD.md`, `docs/BLOG_STANDARD.md`

## 7. Quick verification commands

```bash
npm ci && npm run build && npx vitest run          # full gate
grep -rin openclaw src/ infrastructure/ | grep -v secret-loader   # expect only upstream image + migration-doc comments
grep -rin hermes src/ --include=*.ts               # expect only external harness (broker fixture / capability-tokens comment)
node scripts/gen-thesis-html.cjs                   # regenerate Learn HTML after a thesis bump
```

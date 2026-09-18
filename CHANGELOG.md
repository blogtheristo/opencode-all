# Changelog

All notable changes to DWS IQ 6 are documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
This project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Win11 **WSL 2** recorded as updated (HIC 18.09.2026). Admin Manual v3.17 operator
  pin Microsoft stable **2.7.14**; Plan9 fix is KB5129195 after KB5124008.
  Field note: `docs/field-notes/2026-09-18-win11-wsl-updated.md`.
- Win11 **Aspire CLI 13.5.4** (HIC `aspire update`, stable). Admin v3.18. Spark
  `aspire-dashboard` image stays **13.4.2**. Field note:
  `docs/field-notes/2026-09-18-win11-aspire-cli-13-5-4.md`.
- Spark **Docker Engine client 29.2.1** (`a5c7197`, HIC `docker --version` on
  `gn100-cb5d`). Admin v3.19. Bare `docker update` is not an Engine upgrade.
  Field note: `docs/field-notes/2026-09-18-spark-docker-29-2-1.md`.
- Spark **aspire-dashboard** host pull recipe at pin **13.4.2** (HIC). Compose image already 13.4.2 on main; Admin v3.20. Did not bump to 13.5.4.
- Win11 **Docker client 29.8.0** (`88096ef`, HIC PowerShell `docker --version`). Split from Spark **29.2.1**. Docker MCP stays retired. Admin v3.21. Field note: `docs/field-notes/2026-09-18-win11-docker-29-8-0.md`.
- Spark Docker **Engine upgrade** bash recipe (`apt-get install --only-upgrade docker-ce`). Not `docker update`. Admin v3.22.
- **Environment Version Parity** (`DWS_TRUTH_STANDARD.md` v5.3 row 41 / §2I). Shared-role tools must match across Win11 and Spark. Docker client pin **29.8.0**; Spark **29.2.1** is open drift. Pin file `config/truth/dev-environment-pins.json`; check `npm run env:pins` / `env:pins:strict`. Field note: `docs/field-notes/2026-09-18-environment-version-parity.md`. Admin v3.23.
- Spark docker-ce apt **ran** (HIC `gn100-cb5d` 18.09.2026). Observed **29.6.2** (`dfc4efb`, NVIDIA noble/arm64 candidate `5:29.6.2-1~ubuntu.24.04~noble`), not Win11 **29.8.0**. Shared target remains 29.8.0; pin status stays `open-drift`. `docker compose ps` still interpolates `POSTGRES_PASSWORD` without `.env` — use `docker ps`. Truth v5.4. Admin v3.25. Q7 pending.
- Spark needrestart after docker-ce apt listed outdated **user sessions** (admin100 sshd #129/#130, admin100 and gdm systemd user managers). Not Docker containers. Log out SSH and reconnect. Do not restart docker/gdm. Admin v3.26.
- Spark SSH leftover how-to: `exit` sessions #129/#130 (or `loginctl terminate-session` the other id) and reconnect. Do not restart docker/gdm. Admin v3.27.
- Spark **GitHub CLI**: official apt recipe ran; already **2.45.0-1ubuntu0.3+esm3** (Ubuntu ESM). cli.github.com did not replace it. Admin v3.28. Field note: `docs/field-notes/2026-09-18-spark-gh-2-45-0.md`.
- Spark loginctl: this SSH is **130**; **129** may own tmux(3006) from 17.09. Inspect tmux before `terminate-session 129`. Leave gdm **c1**. Admin v3.29.

### Changed

- **Code-quality hardening (2026-08-22):**
  - Logging hygiene: all 186 stray `console.*` calls in `src/` replaced with
    the pino logger (`src/utils/logger.ts`). Intentional exceptions:
    `src/cloudflare/**` (edge runtime) and the last-resort stderr fallback in
    `src/agents/article12-logger.ts`.
  - ESLint debt eliminated: ~766 warnings → 8 documented exceptions
    (`no-explicit-any`, `no-non-null-assertion`, `no-unused-vars`,
    `consistent-type-imports`, `eqeqeq`, `sort-imports`, and the legacy-debt
    buckets all at zero). Paid-off rules promoted from `warn` to `error` in
    `eslint.config.mjs`.
  - Environment config centralized in `src/config/env.ts` (dotenv loads at
    first import, zod-validated snapshot, `getEnv()` / `refreshEnv()`).
    Fixes the ES-module import-ordering bug where `auth.service.ts`
    evaluated before `dotenv.config()` ran — `npm run dev` no longer needs
    pre-exported env vars.

### Added

- `src/config/env.ts` — centralized zod-validated environment configuration.
- `docs/backlog/CODE_TODO_LEDGER.md` — triage of all 26 real code TODOs
  (billing notifications cluster, email-webhook contact lifecycle, ERP sync gaps).
- `standards/README.md` — index of root-level standard documents (deliberately
  not relocated; 800+ name references repo-wide).

### Removed

- Dead weight archived to `Archive/deprecated-2026-08/`: `worktrees_OLD/`,
  `merge_tmp/`, `dws6.com.backup_now/`, duplicate root `Blogisarja_OLD.jpg`,
  and unused `_OLD` route/service modules (`dashboard.routes_OLD.ts`,
  `notification.routes_OLD.ts`, `logger.service_OLD.ts`,
  `upstash-redis.service_OLD.ts`).

### Added

- OpenCode primary-runtime handoff pack (Phases 1-4): root `opencode.json`
  with real OpenCode schema, DGX Spark Ollama tunnel endpoint
  (`http://127.0.0.1:11435/v1`), `CLAUDE.md` loaded through `instructions`,
  retired invalid draft preserved as `.opencode/opencode.json_OLD.bak`,
  runtime-policy guidance in `CLAUDE.md`, and VS Code OpenCode tasks for
  tunnel start, tunnel test, config debug, and TUI launch.

- DWS Factory Router (`src/factory/`): evidence-based cheap→strong model
  escalation for agent runs. Deterministic detectors (action/observation
  loops, repeated error classes, ping-pong, rewrite-retest thrash,
  steps-since-progress, budget burn) feed a one-way ladder
  (`continue` → `switch_model` → `restart_clean` → `escalate_human`) with
  budget-stop, capability-before-retry, and asymmetric-hysteresis
  guardrails. Fully offline — no external decision service. CLI:
  `npm run factory:route` (structured JSON + verdict exit codes); skill:
  `/factory-route`. Adapted from codejunkie99/sageroute (MIT) per the
  adopt/adapt decision in
  `docs/field-notes/2026-08-03-agent-factory-sageroute-audit.md`.

- Labor-anchored product catalog (T0–T4, Blue/pilot) wired across
  `dws10.com/config/products.json` and the `landing-pages/` mirror.
- 64 Blue/pilot SKUs: 39 single-agent rows (CMP / SS / MO / ED / SG /
  CONSTR / LOG / SOV / QG / CSAT / LF / CS / SEO / DW / VIA / TH +
  per-outcome meters), 6 Function/Workforce bundles, 9 Industry Pod
  add-ons (Mars/Helios/Vulcan/Talos/Gaia/Ceres/Neptune/Prometheus/BESS),
  10 Land overlay engagements.
- §13.8 in `DWS_DYNAMIC_DEPLOYMENT_PRICING_STANDARD.md` documenting the
  labor-anchored SKU schema (`sku`, `tier`, `priceUnit`, `agents[]`,
  `replaces{role,fteCount,fullyLoadedAnnualCostEUR}`, `nextUpsellSku`,
  `deploymentColor`) and the public-render rule that bans SaaS-comparison
  columns.
- `scripts/load-labor-catalog.py` — idempotent loader for the catalog.
- `scripts/validate-pricing.ts` + `.ps1` — schema/mirror/version-monotonic
  validator. Wired into `.githooks/pre-commit` and a new CI workflow
  `.github/workflows/validate-pricing.yml`.
- `src/services/upsell-rules.ts` — pure-function trigger engine implementing
  the §5 ladder rules with Zod-validated inputs.
- Dashboard upsell banner on `dws6.com/dashboard/` — one card, no nags.
- Public price-list redesign with the "Price AI like labor, not like a tool."
  hero, tier badges, Replaces line, and Next Upsell link.
- `/upsell-map/` page on dws10.com (mirrored) rendering the §5 ASCII ladder.
- OneLifetime price-list + upsell-map front doors pointing to the canonical
  dws10.com pages.
- Tests: 25 new tests (15 upsell-rules + 10 labor-catalog) covering rule
  logic, schema validity, mirror sync, the LAND-\* engagement+agent rule,
  and Green/Blue HTML snapshots.
- **Fable-incident backlog merge (2026-07-05):** cleared 9 low-risk content
  sessions stranded by the Claude Fable 5 outage —
  - Field notes: CUDA 13.0 / JetPack 7.0 for Jetson Thor (#1532); Sergey Brin
    on Frontier AI Q&A (#1545); Palantir FDE Wahlqvist on US open-weight models
    & LWM provenance implications (#1556).
  - Docs: DWS IQ Aegis development roadmap — IQM-style phase chart (#1550);
    AWS partner webinar decision memo + acceleration strategy (#1560).
  - Sales/GTM: Istekki Oy SoTe-ICT market dialogue (#1561); outreach batch 2 —
    Consti, GRK Infra, Kreate (#1454); kurso.se taxi lead research note (#1533).
  - CV: v161 — Lifetime World project + Microsoft Founders Hub Level 4 (#1542).
- `config/llm-registry.json` + `scripts/weekly/llm-currency-check.sh` +
  `docs/LLM_UPDATE_TASK.md`: weekly LLM-currency task for subscription products
  (model-drift detection, SES email report, HIC-gated `apply-model-updates.ts`).
  Migrated deprecated `claude-sonnet-4-*` → `claude-sonnet-5` across agents (#1566).

### Changed

- `priceVersion` 1.13 → 1.14 (labor-anchored baseline).
- `scripts/generate-green-pricelist.py` and `generate-pilot-pricelist.py`
  now render tier badges, Replaces lines, and the Next Upsell SKU on every
  row. Green list filters out every `deploymentColor:"blue"` SKU.

### Governance

- Every SKU lands `deploymentColor:"blue"` (pilot). No Green flips occur
  in this changeset — flips require explicit Risto sign-off per
  `DWS_DYNAMIC_DEPLOYMENT_PRICING_STANDARD` §5.

## [1.4.0] - 2026-04-02

### Added

- Investor outreach pipeline with daily morning brief (auto-discovered by day-runner)
- PII safety gate: investor emails loaded from gitignored file with `--dry-run`
- Arctic 15 Captain Seat targets with named PE contacts
- Liquidity Engine positioning for PE secondaries outreach

### Fixed

- CapMan target correction: Heidi Erha to Pia Kall (Managing Partner, Buyout)

## [1.3.0] - 2026-03-26

### Added

- DocuSign eSignature integration for NDA signature tracking
- NDA signature verification script (`scripts/verify-nda-signatures.ts`)
- Mutual NDA signing flow (`sendMutualNDA()` + CLI send command)
- DWS IQ Aegis press release on onelifetime.world and dws10.com
- Captain customer page with dual-track messaging (CFO + Sustainability Manager)
- Compliance Engine V1.0 — agent wired to real scoring engine

### Fixed

- Replace axios with native fetch in DocuSign client
- Correct Qantic address umlaut (Lohmuhlenstrasse 65)
- BESS taxonomy `substantialContribution` always false — use discharge-hour grid factors
- LWM enterprise tier — remove bundled hardware claim, add contact pricing
- dws6.com copyright 2025 to 2026, Llama 2 to 3.1, StarCoder to Qwen 2.5
- dws10.com outdated content: 16 to 20 industries, 8 to 20 dashboard, 16 to 18+ agents
- onelifetime.world copyright and regulatory date updates

## [1.2.0] - 2026-03-21

### Added

- GitHub security policy (SECURITY.md)
- P0 backend hardening + dashboard resilience for V1 MVP
- P1 integration tests, real carbon data, onboarding emails
- Oxford citations and cross-links to all 21 EN blog posts
- NVIDIA GTC 2026 field note, blog post, DWS7/DWS8 roadmap updates
- cuDF as 8th GTC announcement
- 21 Finnish bilingual campaign posts with landing-pages sync

### Fixed

- flatted >=3.4.0 override across all packages (stack overflow DoS)
- ajv >=6.14.0 override in src/cloudflare (ReDoS)
- fastapi >=0.116.0 in mcp-hub for starlette >=0.49.1 compat
- @tootallnate/once >=3.0.1 override in mobile-dashboard
- Merge conflict in package.json — keep overrides + main updates

### Security

- Validated Mock Data Rule added to CLAUDE.md (Rule #6)
- Real EU data pipeline replaces mock compliance scoring

## [1.1.0] - 2026-03-15

### Added

- API versioning middleware (`X-API-Version` header)
- Agent integration tests
- Email analytics tracking
- OpenClaw + Karpathy Autoresearch feature plan
- xurl as primary X.com publish transport
- X.com API use case document (DWS standard)
- DSaaS CLI-First Strategy (Database Sovereignty as a Service)
- Designer Agent — design-to-code bridge
- Sovereign Database product with sovereignty-assess CLI and agent
- HIL escalations migration and sovereignty-assess skill

### Fixed

- Session-stop hook infinite loop

### Changed

- RC2 backend hardening — production middleware wired into app.ts
- RC3+RC4 hardening — test coverage gate, auth tests, dashboard fix

## [1.0.0] - 2026-03-06

### Added

- **DWS IQ 6 Platform** — Multi-agent orchestration for enterprise industrial AI
- **18 AI Agents**: Compliance, SiteSense, MaterialOracle, ScheduleGenius, CustomerSat, Construction, Logistics, EmissionsDataAnalyst, QualityGate, SovereigntyMonitor, Argus, DeepWikiExtractor, Designer, SalesOutreach, Viability, ComplianceResearcher, Article12Logger, Unit Normalization
- **MCP Server** at `/mcp` — JSON-RPC 2.0 with Streamable HTTP Transport
- **CLI Tool** (`dws agents`, `dws run`, `dws workflow`)
- **Express Backend** with 21 route modules, JWT auth, Helmet CSP, rate limiting
- **React Dashboard** (React 19.2, Vite 7, TailwindCSS 4.1)
- **Landing Pages**: dws6.com, dws10.com, onelifetime.world (Cloudflare Pages)
- **Firehorse Suite**: Omnichannel Delivery, Report Engine, Sales Automation
- **52 Database Migrations** (Supabase PostgreSQL, pgvector, RLS)
- **44 CI/CD Workflows** (security, deploy, testing, marketing, monitoring)
- **EU Compliance**: ETS, CBAM, CSRD, Fit-for-55 scoring engine
- **Supabase Auth** with MFA, password reset, JWT refresh
- **ERP Integrations**: SAP S/4HANA, IFS Cloud, Microsoft Dynamics 365
- **ESG Integrations**: Worldfavor, PositionGreen
- **Google Merchant Feed** and product catalog (30+ products)
- **Claude Code Skills** (17 skills in `.claude/commands/`)

### Security

- Helmet CSP with strict directives
- CORS allowlist (no wildcard)
- Rate limiting (100 req/15min general, 5 req/15min auth)
- Environment validation on startup (Zod schemas)
- Request timeout middleware (30s default)
- Correlation ID tracing on all requests
- RLS on all database tables

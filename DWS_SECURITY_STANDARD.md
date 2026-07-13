---
title: DWS Security Standard
version: 3.2
created: 2026-02-07
last_modified: 2026-07-08
author: Lifetime Oy Security Team
language: en
languages_available: [en]
classification: INTERNAL
publication_status: ACTIVE
document_type: Security Standard / Internal Framework
toc: true
toc-depth: 3
---

# DWS Security Standard

---

# VERSION AND AGENT HISTORY

Version: 3.2

Sessions & Modifications:

- Version: 3.2 | Tool: Claude Code (Sonnet 5) | Session: claude/aegis-dependency-security-g9xcfo | Date: 08.07.2026 | Changes: Disabled `markdown-it` `linkify:true` in `src/contentms/blog-publisher.ts` and capped `body_markdown` to 100KB (`src/contentms/types.ts`) — closed a real, live request-path CPU-DoS via `linkify-it`'s O(N^2) fuzzy-match scan (unpatched upstream, no GHSA/OSV entry). Deleted `artifacts/pr925-worktree/` and `artifacts/pr1295-mergecheck/` (997MB of accidentally-committed duplicate repo checkouts from PR #1573) — confirmed source of at least 5 live Dependabot alerts against dead code (APScheduler RCE, shell-quote injection, Vitest UI file-read, axios prototype-pollution MITM, plus more). Documented `*_DEPRECATED/` directories as expected, accepted alert noise — left in place per repo convention, not a live-code risk. Flagged a tracked-in-git `100326.env` file at repo root (added PR #1573) for human review/rotation — not read, per secret-egress policy.
- Version: 3.1 | Tool: Claude Code (Sonnet 5) | Session: claude/aegis-dependency-security-g9xcfo | Date: 08.07.2026 | Changes: Ran `pip-audit` across the repo's Python requirement files (no lockfile/hash-pinning exists for pip deps, flagged as a standing gap). Found and fixed `python-dotenv` CVE-2026-28684 in `mcp-hub/requirements.txt` (1.1.0 → 1.2.2, non-breaking patch bump). Logged `pyjwt`/`starlette` transitive-dependency advisories in the same file as open tracked findings — both need an explicit version constraint plus a FastAPI-compatibility check before bumping, so deferred rather than force-applied.
- Version: 3.0 | Tool: Claude Code (Sonnet 5) | Session: claude/aegis-dependency-security-g9xcfo | Date: 08.07.2026 | Changes: Added §13.6 (Dependency Lockfile & Vulnerability SLA Policy) — closed two missing-lockfile gaps (`lambda/ses-inbound-parser`, `infrastructure/dgx-spark/bumblebee`), fixed `scripts/daily/dependabot-audit.sh` `PACKAGE_DIRS` (was missing `mcp-hub-ts`, `mcp-servers/cloud-run-gateway-ts`, and both directories above; referenced non-existent `mobile-dashboard` instead of `mobile-dashboard_RETIRED`), documented the Aegis agent's remediation SLA (critical=2d/high=7d/moderate=30d/low=90d) as the canonical policy, and logged an open moderate `@opentelemetry/*` finding (`GHSA-8988-4f7v-96qf`) in the bumblebee scanner pending a breaking-change upgrade.
- Version: 2.9 | Tool: Claude Code (Sonnet 5) | Session: claude/kya-mandate-evidence-migration-mq7hnp | Date: 07.07.2026 | Changes: Added §18.4 G7 — Spend Authority to the BYO agent registration gate table, gating AP2/UCP/ACP payment mandates on ATS band and G2 identity binding (`evaluateMandateGate()`, `src/identity/ats-engine.ts`); cross-references `Legal/KYA_STANDARD_v1.md` §14 and the new `Legal/KYA_SECURITY_v1.2.md` §12 enforcement section.
- Version: 2.8 | Tool: Claude Code | Session: claude/supabase-audit-aiven-td3x8r | Date: 02.07.2026 | Changes: Resolved the §17.5 Aiven Open Question per founder decision — approved Aiven-managed PostgreSQL on `google-europe-north1` as the DWS IQ 6 (dws6.com) DB layer, recorded as an explicit sovereignty exception (not a "None" CLOUD Act rating) with residual risk noted: Aiven's US-VC ownership is still unclear, and the underlying GCP infra is elsewhere classified "Transitional"/migrate-away for compute. `scripts/aiven-vault-bootstrap.sh` / `mcp-hub/config/aiven-mcp.json` required no changes — already defaulted to this region.
- Version: 2.7 | Tool: Claude Code | Session: claude/supabase-audit-aiven-td3x8r | Date: 02.07.2026 | Changes: Supabase/Aiven audit — fixed broken §17.5 cross-reference ("AGENTS.md Section 20" does not exist, now points to docs/DEPLOYMENT_ARCHITECTURE_ENTERPRISE.md); flagged that Aiven does not offer Hetzner as a deployable region, so the existing "DB layer on Hetzner infra only" approval condition for Aiven is currently unsatisfiable by any script in the repo — added an Open Question pending a human sovereignty decision.
- Version: 2.6 | Tool: Claude Code | Session: claude/ai-codebase-security-audit-BgY2H | Date: 21.06.2026 | Changes: Added Secret Egress Control to Layer 3 (Data Protection) — closes the write-side exfiltration gap. New shared pattern engine `.claude/hooks/secret-patterns.sh` consumed by three hooks: read-bypass guard in `pretooluse-guard.sh` (blocks Bash `cat`/`grep`/`env`/`printenv`/`base64` of `.env*`/`*.pem`/`*.key`/`*secret*`, which previously bypassed `Read`-tool deny rules), input scan in `secret-scan.sh` (now also catches bare JWTs, DSNs with embedded creds, Bearer tokens, DB passwords, OAuth client secrets; placeholders allowlisted), and new output scan `secret-output-scan.sh` (PostToolUse/Bash, warns on secrets surfaced in command output). Added matching Secret Egress Rules to CLAUDE.md and defence-in-depth `deny` entries to `.claude/settings.json`.
- Version: 2.5 | Tool: Claude Code (claude-opus-4-7) | Session: claude/bumblebee-dgx-observability-mzV5U | Date: 24.05.2026 | Changes: Added Section 13.5 (Supply-Chain Inventory — Bumblebee on DGX Spark) documenting the new `bumblebee-collector` container in `infrastructure/dgx-spark/`, OTel metric contract surfaced on the existing Aspire Dashboard (`bumblebee.packages.total`, `bumblebee.exposures.{total,by_severity}`, `bumblebee.scan.{duration_ms,last_success_timestamp}`), pinned upstream SHA in `bumblebee.version`, daily/weekly scan cadence via supercronic, read-only `/host` mount with dropped capabilities, and exposure-catalog handling as untrusted input per §13.
- Version: 2.4 | Tool: GitHub Copilot CLI (GPT-5.4) | Session: pr-1368-review | Date: 20.05.2026 | Changes: Corrected PR #1368 integration status and versioning; enabled TypeScript redirect sanitization in the Express stack and CSRF enforcement on auth/payment routes; added Vitest coverage for the TypeScript security ports; switched MCP tool classification to fail closed for unknown tools; updated testing and pentest references to the TypeScript paths.
- Version: 2.3 | Tool: GitHub Copilot (Gemini 2.0 Flash) | Session: claude/mvp-missing-features-pS9La | Date: 20.05.2026 | Changes: Ported legacy November 2025 security components from Python/Flask to TypeScript/Express (Modern CSRF, Redirect Validation, MCP DCR, Tool Colors, Image Prompt Injection); archived legacy Python components as \_OLD.py.
- Version: 2.2 | Tool: Claude Code (Opus 4.6) | Session: claude/connect-kya-dws-cli-0MMIB | Date: 10.04.2026 | Changes: Added Section 18.6 (KYA Control Surfaces — CLI, HTTP, Webhook) documenting the `dws kya status` / `dws kya snap` CLI paths, timing-safe `ADMIN_API_KEY` auth pattern, mandatory forensic dumps, accepted reason codes, and cross-reference to `/kya` slash command; renumbered NIS2 compliance statement to 18.7 and updated it to mention operator CLI path
- Version: 2.1 | Tool: Claude Code (Opus 4.6) | Session: claude/audit-shufti-dpa-artifacts-HFEGx | Date: 08.04.2026 | Changes: Updated Section 18.5 with Shufti Pro sub-processor risk assessment (TeleSign noyb complaint, Twilio security incidents, Cloudflare/IPStack risks) from PR #768 DPA clause audit; added ML training prohibition control to IDV partner controls table
- Version: 2.0 | Tool: Claude Code (Opus 4.6) | Session: claude/dws-iq-synthetic-nervous-9TtAB | Date: 06.04.2026 | Changes: Added Section 19 (Synthetic Data & Model Fine-Tuning Security) — synthetic data generation controls, model provenance, inference isolation, drift monitoring, adversarial integrity, NIS2 compliance statement for NVIDIA NeMo DataDesigner integration
- Version: 1.9 | Tool: Claude Code (Opus 4.6) | Session: claude/shufti-dws-integration-G73xs | Date: 09.03.2026 | Changes: Added Section 18 (Know Your Agent (KYA) & Bring Your Own (BYO) Agent Security) — 5-layer KYA trust framework, BYO agent registration gates, Shufti IDV integration architecture, dynamic sandbox permission triggers, partner access controls for IDV providers
- Version: 1.8 | Tool: Claude Code (Opus 4.6) | Session: claude/build-mvp-features-nFk7k | Date: 08.03.2026 | Changes: Added Section 17 (Database Disaster Recovery Security) — dual-database architecture, recovery scripts, RTO < 5 min schema / < 15 min full restore, backup encryption (GPG), Aiven auth stubs for RLS compatibility, backup test drive validation
- Version: 1.7 | Tool: Claude Code (Opus 4.6) | Session: claude/build-mvp-features-nFk7k | Date: 08.03.2026 | Changes: Supabase migration 043 — persistent storage for api_keys, usage_events, usage_counters, report_schedules tables with RLS, atomic counter increment function (increment_usage_counter), sanity checks; services updated with Supabase-first + in-memory fallback pattern; shared backend Supabase client (src/config/supabase.ts)
- Version: 1.6 | Tool: Claude Code (Opus 4.6) | Session: claude/build-mvp-features-nFk7k | Date: 08.03.2026 | Changes: Added Section 16 (MVP Security Controls) — API Key Management (SHA-256 hashing, per-user limits, scope-based access), Usage Metering (tier enforcement, rate limiting per billing period), Report Export (authenticated download, usage-gated exports)
- Version: 1.5 | Tool: Claude Code (Opus 4.6) | Session: claude/implement-mvp-features-D2e9d | Date: 07.03.2026 | Changes: Added Section 15 (API Middleware Security Controls) — centralized error handler security, request validation with Zod, correlation ID tracing, env validation, health check endpoint hardening; compliance engine API security
- Version: 1.4 | Tool: Claude Code (Opus 4.6) | Session: claude/silly-zhukovsky | Date: 07.03.2026 | Changes: Added Section 3.6.1 (Database Backup & Disaster Recovery Controls) — 7 BCP/DR controls, RTO/RPO targets, backup retention policy, Aiven sandbox mirror, multi-destination backup architecture (local + Proton + Acer Helsinki + GitHub Actions)
- Version: 1.3 | Tool: Claude Code (Sonnet 4.6) | Session: claude/sandbox-agents-opensandbox-HatfC | Date: 01.03.2026 | Changes: Added Section 14.6 (OpenSandbox on Acer Veriton — Stage 1.5); updated isolation stages table; added MCP endpoint list for /sandbox/\* tools; updated SANDBOX_STAGE values to include 'opensandbox'
- Version: 1.2 | Tool: Claude Code (Opus 4.6) | Session: claude/add-sdk-sandbox-isolation-Q0lzp | Date: 21.02.2026 | Changes: Added Section 14 (Multi-Tenant Sandbox Isolation Architecture) — SDK native sandbox, Cloud Run ephemeral containers, staged isolation, NIS2 audit statement, governance integration
- Version: 1.2 | Tool: GitHub Copilot (Claude Sonnet 4.6) | Session: claude/zealous-mcclintock | Date: 23.02.2026 | Changes: Expanded Section 13.3 with MCP CORS implementation standard — env-driven explicit origins, scoped methods/headers, fix applied to mcp-servers/supabase/server.py, pattern mandated for all new MCP servers
- Version: 1.1 | Tool: Claude Code (Opus 4.6) | Session: claude/security-dws6-vulnerabilities-bsqHe | Date: 21.02.2026 | Changes: Added Claw-layer security (Section 12), supply chain integrity policy (Section 13), CORS/SRI/exec standards, vulnerability assessment findings
- Version: 1.0 | Tool: Claude Code (claude-opus-4-6) | Session: claude/safety-report-field-notes-cdl1W | Date: 07.02.2026 | Changes: Initial DWS Security Standard — integrating International AI Safety Report 2026 findings into enterprise security framework

Session Links & References:

- Claude Code (claude/safety-report-field-notes-cdl1W): https://claude.ai/code/session_012FT8mruBJEWEaKGApgdSGe

Document Status:

- Created: 07.02.2026
- Last Modified: 21.06.2026
- Language: English
- Languages Available: EN
- Publication Status: ACTIVE
- Classification: INTERNAL
- Document Type: Security Standard / Internal Framework

Related Documents:

- SECURITY_COMPLIANCE.md (Enterprise Security & Compliance — external-facing)
- README_SECURITY.md (Security Framework Quick Reference)
- AgentFoundry/Security.md (LLM Security & Threat Analysis)
- docs/field-notes/2026-02-06-ai-safety-report-2026-field-note.md (AI Safety Report analysis)
- docs/SECURITY_GLOSSARY.md (Bilingual Security Terminology)
- SECURITY_ASSESSMENT_GAMMA.md (Vulnerability Assessment)
- documentation/SECURITY-FIX-GUIDE.md (Database Security Fixes)
- DWS_DOCUMENT_STANDARD.md (v1.3 — document metadata, naming, versioning, knowledge management)
- UI_SKILLS_GAMMA.md (v2.0 — Gamma brand standard, design constraints, WCAG 2.2)
- dws10.com/docs/PHD_FIREHORSE_EN.md (Master thesis EN — Firehorse operational model)
- dws10.com/docs/PHD_FIREHORSE_FI.md (Pro gradu FI — Firehorse-toimintamalli)
- ADMIN_MANUAL_AUTHENTICATION.md (v1.3 — JWT, bcrypt, security auditing)
- IPR_PROTECTION_STRATEGY.md (v1.0 — Three-tier IPR protection: NDA, Patents, Trade Secrets)
- ADMIN_MANUAL_SUPABASE_EN_v1.md (Database administration)
- ADMIN_MANUAL_DWS6_COM.md (Platform configuration)

---

## 1. Purpose and Scope

The **DWS Security Standard** is the internal security framework governing all DWS IQ 6 platform operations, Firehorse product line, Lifetime Fleet, and Lifetime Consulting services. It integrates:

**External standards and research:**

- **International AI Safety Report 2026** (Bengio et al., 100+ experts, 30+ countries)
- **EU AI Act** (enforceable August 2, 2026)
- **NIS2 Directive**, **GDPR**, **Fit for 55**, **CSRD**
- **OWASP Top 10 for LLM Applications 2025**
- **Simon Willison's security research** (prompt injection, MCP attack vectors)

**Internal DWS standards (foundational inputs to security):**

- **DWS Document Standard** (v1.3) — Document metadata, VERSION AND AGENT HISTORY, naming conventions, knowledge management strategy. Ensures all security documentation is traceable, versioned, and auditable per EU AI Act Article 12 requirements.
- **Gamma Brand Standard** (v2.0, UI_SKILLS_GAMMA.md) — Design constraints, WCAG 2.2 Level AA accessibility, z-index discipline, Ironclad navigation. Security-relevant: prevents XSS through strict style policies, enforces Content Security Policy alignment, and ensures accessible security UIs.
- **Admin Manuals** — Operational security procedures for authentication (ADMIN_MANUAL_AUTHENTICATION.md v1.3), database administration (ADMIN_MANUAL_SUPABASE_EN_v1.md), platform configuration (ADMIN_MANUAL_DWS6_COM.md), and testing (ADMIN_MANUAL_TESTING.md). These define the human procedures that complement technical security controls.
- **Firehorse Master Thesis** (EN: PHD_FIREHORSE_EN.md, FI: PHD_FIREHORSE_FI.md) — Operational model documenting human-AI collaboration, compliance readiness metrics, and the measured results (96% efficiency, 80% error reduction) that validate our security architecture. Essential to the Firehorse operational model because it proves that human-in-the-loop oversight works at scale.

This standard applies to all employees, contractors, AI agents, and third-party integrations operating within the DWS ecosystem.

### 1.1 How Internal Standards Form the Security Foundation

```
┌─────────────────────────────────────────────────────────────────────┐
│                     DWS SECURITY STANDARD                           │
│                    (this document — policy)                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │  DWS DOCUMENT    │  │  GAMMA BRAND     │  │  FIREHORSE       │  │
│  │  STANDARD v1.3   │  │  STANDARD v2.0   │  │  THESIS (FI/EN)  │  │
│  │                  │  │                  │  │                  │  │
│  │  • Traceability  │  │  • WCAG 2.2 AA   │  │  • 96% efficiency│  │
│  │  • Versioning    │  │  • XSS prevention │  │  • 80% error ↓   │  │
│  │  • Audit trail   │  │  • CSP alignment  │  │  • Human-in-loop │  │
│  │  • Agent history │  │  • Ironclad nav   │  │  • EU compliance  │  │
│  └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘  │
│           │                     │                      │            │
│  ┌────────┴─────────────────────┴──────────────────────┴─────────┐  │
│  │                      ADMIN MANUALS                             │  │
│  │  Authentication · Supabase · DWS6.com · Testing · Dashboard   │  │
│  │  (Operational security procedures — human execution layer)     │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│  EXTERNAL: AI Safety Report 2026 · EU AI Act · NIS2 · OWASP · GDPR │
└─────────────────────────────────────────────────────────────────────┘
```

**Why these matter for security:**

| Internal Standard            | Security Contribution                                                                                             | Without It                                                               |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| **Document Standard**        | Every AI decision traceable via VERSION AND AGENT HISTORY; supports Article 12 logging                            | No audit trail for AI-generated documents; compliance gap                |
| **Gamma Brand Standard**     | WCAG 2.2 prevents accessibility-related vulnerabilities; strict style policies reduce XSS surface                 | Inconsistent UIs create phishing risk; accessibility violations          |
| **Admin Manuals**            | Standardized procedures for JWT rotation, database security, incident handling                                    | Ad-hoc procedures; inconsistent security posture                         |
| **Firehorse Thesis (FI/EN)** | Measured proof that human-in-the-loop works (80% error reduction); operational model for all Firehorse automation | Unvalidated claims; no evidence base for security architecture decisions |

---

## 2. Security Risk Classification

### 2.1 The Three Risk Categories (AI Safety Report 2026)

The International AI Safety Report 2026 defines three categories of general-purpose AI risk. DWS adopts this classification as the foundation of our security risk model.

#### A. Malicious Use Risks

| Risk                                 | Severity | DWS Exposure                         | Mitigation                                            |
| ------------------------------------ | -------- | ------------------------------------ | ----------------------------------------------------- |
| AI-generated content for scams/fraud | HIGH     | Low (B2B platform)                   | Content audit trail, Article 12 logging               |
| Influence and manipulation           | HIGH     | Medium (outreach automation)         | Human review of all Firehorse outreach templates      |
| Cyberattacks using AI                | CRITICAL | High (industrial data)               | NIS2 compliance, defence-in-depth, SIEM integration   |
| Biological/chemical information      | HIGH     | Low (not in domain)                  | Model safeguards, output filtering                    |
| AI-assisted vulnerability discovery  | HIGH     | High (77% vuln discovery rate cited) | Weekly vulnerability scans, 24h critical patching SLA |

#### B. Malfunction Risks

| Risk                                | Severity | DWS Exposure                              | Mitigation                                             |
| ----------------------------------- | -------- | ----------------------------------------- | ------------------------------------------------------ |
| Hallucinated information            | CRITICAL | High (compliance data cannot tolerate)    | Lifetime World Model ground truth, human-in-the-loop   |
| Flawed code generation              | HIGH     | Medium (agent-generated code)             | Human review gates, pre-commit hooks, test suites      |
| Misleading AI advice                | CRITICAL | High (regulatory advice must be accurate) | Reasoning lineage documentation, confidence thresholds |
| Loss of control (autonomous agents) | HIGH     | Medium (agentic chat Q1/2026)             | Capability thresholds, human validation requirements   |
| Automation bias                     | HIGH     | Medium (humans over-trusting AI)          | Mandatory review workflows, training on bias awareness |

#### C. Systemic Risks

| Risk                                        | Severity | DWS Exposure                               | Mitigation                                                      |
| ------------------------------------------- | -------- | ------------------------------------------ | --------------------------------------------------------------- |
| Labour market disruption (60% jobs exposed) | HIGH     | High (our clients manage large workforces) | AI augments, not replaces; workforce transition consulting      |
| Environmental costs ($100B+ data centers)   | MEDIUM   | Medium (AI infrastructure usage)           | Fit for 55 compliance, carbon footprint monitoring              |
| Concentration of AI capabilities            | MEDIUM   | Low (multi-vendor strategy)                | Dual-agent approach (Claude + Codex), open-weight model support |
| Erosion of human critical thinking          | HIGH     | Medium (enterprise users)                  | Human accountability in CLAUDE.md governance                    |

### 2.2 The Evaluation Gap (CRITICAL SECURITY RISK)

> "A central challenge is an emerging 'evaluation gap': existing evaluation methods do not reliably reflect how systems perform in real-world settings. Many common capability evaluations are outdated, affected by data contamination (when AI models are trained on the same questions used in evaluations), or focus on a narrow set of tasks. As a result, they provide limited insight into real-world AI performance."

**Risk:** Pre-deployment AI safety tests may not predict real-world behavior. Models increasingly distinguish between test settings and real-world deployment and exploit loopholes in evaluations. Dangerous capabilities could go undetected before deployment.

**DWS Security Implications:**

1. **We cannot rely solely on vendor safety evaluations** — AI providers' published benchmarks may not reflect how models perform in our industrial context
2. **Our own evaluations must be domain-specific** — Generic AI safety tests do not cover construction, manufacturing, or fleet operational scenarios
3. **Continuous monitoring is required** — Pre-deployment testing is necessary but insufficient; real-world performance monitoring must be ongoing
4. **Data contamination risk** — If evaluation datasets overlap with training data, test results are inflated and misleading

**DWS Evaluation Gap Mitigation:**

| Layer           | Practice                                                | Frequency          | Owner       |
| --------------- | ------------------------------------------------------- | ------------------ | ----------- |
| Pre-deployment  | Domain-specific evaluation suite (industrial scenarios) | Every model update | Engineering |
| Pre-deployment  | Adversarial testing (prompt injection, jailbreak)       | Every model update | Security    |
| Deployment      | Real-time output monitoring with confidence scoring     | Continuous         | Platform    |
| Post-deployment | Monthly accuracy audit against ground truth data        | Monthly            | Compliance  |
| Post-deployment | Incident tracking and root cause analysis               | Per incident       | Security    |
| Continuous      | Red team exercises (internal + external)                | Quarterly          | Security    |
| Continuous      | Customer feedback loop (field notes)                    | Ongoing            | Product     |

### 2.3 Capability Projections Through 2030 (Planning Horizon)

The AI Safety Report provides forward-looking capability projections that inform our security planning horizon:

**Compute growth:** The computational power used to train the largest AI models could grow **125-fold by 2030** without hitting hard limits in energy, chips, or data. Training methods are also projected to become 2-6x more efficient each year.

**Investment scale:** AI companies have announced **$100+ billion in data center investments** in expectation of continued capability gains.

**Capability trajectory — four OECD scenarios (source: OECD 2026, "Exploring Possible AI Trajectories through 2030"):**

| Scenario            | Description                                         | Probability Signal                                         | DWS Security Implication                                        |
| ------------------- | --------------------------------------------------- | ---------------------------------------------------------- | --------------------------------------------------------------- |
| **1. Plateau**      | Progress slows due to data/energy bottlenecks       | Slowing benchmark improvements, data scarcity reports      | Current security framework sufficient; focus on optimization    |
| **2. Incremental**  | Steady improvement at diminishing rate              | Gradual benchmark gains, no breakthrough announcements     | Maintain and incrementally update defence-in-depth layers       |
| **3. Current rate** | Capabilities continue improving at 2024-2025 pace   | By 2030: AI completes multi-day software engineering tasks | Security controls must scale; evaluation suite updated annually |
| **4. Acceleration** | AI systems comparable to human-level remote workers | Superexponential gains, AI contributing to AI research     | **Fundamental re-architecture of security controls required**   |

### Scenario 4: Acceleration — Critical Security Planning

The AI Safety Report describes a plausible acceleration scenario for 2030:

> "In 2030, AI systems are comparable to human-level remote workers. AI systems' autonomy and cognitive capability match or surpass humans in cognitive tasks. They capably and autonomously work towards broad strategic goals that they can reflect upon and revise if circumstances change, while also collaborating with humans where necessary. AI systems can seamlessly learn new information and skills during deployment."

**Pathway:** Continued exponential gains in AI capabilities via scaling pre-training, post-training, and inference, amplified by algorithmic breakthroughs and increasingly substantial contributions from **AI coding assistants to the development of AI itself** (positive feedback loop).

**Historical analogue:** DNA sequencing saw superexponential improvements from 2000-2020 due to development of new sequencing paradigms.

**Physical domain caveat:** AI-guided robots can handle complex physical tasks in dynamic environments in many industries, but performance still lags humans unless developed specifically for a given task — challenges in generalization across physical tasks remain.

**DWS Scenario 4 Security Response Plan:**

| If Scenario 4 Materializes                    | Security Action Required                                                                              | Timeline                |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------- |
| AI agents autonomously pursue strategic goals | Shift from per-action human approval to **strategic goal oversight** with continuous monitoring       | Pre-2029                |
| AI learns new skills during deployment        | Real-time capability monitoring; automatic if-then triggers for new behaviors                         | Immediate when detected |
| AI contributes to AI research (feedback loop) | Monitor for emergent capabilities in our deployed models; establish **capability ceilings**           | Continuous              |
| AI-guided robots in industrial environments   | Lifetime Fleet security architecture must assume autonomous operation; air-gap critical systems       | Pre-2028                |
| Human cognitive tasks broadly automatable     | Redefine "human-in-the-loop" — humans become **strategic auditors** rather than operational reviewers | Gradual 2027-2030       |

**Key insight for DWS:** Even in Scenario 4, physical/embodied tasks lag. This means DWS's edge AI (Jetson) + fleet robotics positioning remains differentiated — the "Hands" layer of our Brain-Memory-Body-Hands architecture addresses the physical gap that pure-cognitive AI cannot close.

### Concrete 2030 Projection (Current Rate)

> "If capabilities continue to improve at their current rate, by 2030 AI systems will be able to complete well-scoped software engineering tasks that would take human engineers multiple days to complete."

**Beyond 2030:** Trajectory becomes harder to forecast. Some experts expect resource bottlenecks (data, chips, capital, energy) to slow progress; others expect efficiency breakthroughs to sidestep constraints. "Which considerations will prove most important is highly uncertain."

### DWS Security Planning by Horizon

1. **Short-term (2026-2027):** Current defence-in-depth architecture addresses known risks. Focus on closing EU AI Act gaps (20% remaining) and achieving ISO 27001 certification. NIS2 posture from 75% to 95%.
2. **Medium-term (2027-2029):** Monitor for capability jumps that could obsolete current evaluation methods. Update domain-specific evaluation suite annually. Plan for AI agents that can operate more autonomously. Begin designing strategic-audit oversight model.
3. **Long-term (2029-2030):** Prepare for Scenario 3 or 4. Human oversight model may need to shift from per-action approval to strategic goal-setting with continuous monitoring. Edge AI / fleet robotics become more critical as cognitive AI saturates.
4. **Continuous:** Maintain multi-vendor AI strategy (Claude, Codex, open-weight) to avoid lock-in and reduce concentration risk. Track OECD scenario indicators quarterly.

---

## 3. Defence-in-Depth Architecture

The AI Safety Report 2026 recommends **defence-in-depth** — layering multiple safeguards so that no single failure leads to significant harm. DWS implements six security layers:

### Layer 1: AI Governance (CLAUDE.md + Karpathy Principles)

**Purpose:** Define expected agent behavior, failure modes, and human accountability.

| Control                      | Implementation                                  | Status |
| ---------------------------- | ----------------------------------------------- | ------ |
| Agent behavior specification | CLAUDE.md with Karpathy principles              | Active |
| Assumption surfacing         | Agents must state assumptions before proceeding | Active |
| Confusion management         | Agents stop and ask when encountering ambiguity | Active |
| Push-back requirement        | Agents must flag problematic instructions       | Active |
| Scope discipline             | Agents touch only what they are asked to touch  | Active |

### Layer 2: Tool Isolation (MCP Colors Framework)

**Purpose:** Prevent cross-domain attacks and privilege escalation through tool separation.

| Control                          | Implementation                                                                                                  | Status            |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------- | ----------------- |
| RED/BLUE tool separation         | MCP Colors classification library with fail-closed handling for unknown tools (src/mcp/security/tool-colors.ts) | Active            |
| Tool approval workflow           | MCP tool access requires authorization                                                                          | Active            |
| Protected configuration          | Immutable config with restricted write access                                                                   | Active            |
| Cross-agent privilege prevention | ProtectedConfiguration class (src/config/)                                                                      | Active            |
| Dynamic Client Registration      | RFC 7591 compliant MCP registration utility for MCP integrations (src/mcp/oauth-handler.ts)                     | Integration-ready |

### Layer 3: Data Protection

**Purpose:** Prevent data exfiltration, injection, and unauthorized access.

| Control                          | Implementation                                                                                                                                                                                             | Status            |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| Domain validation                | Domain Validator prevents data exfiltration to unauthorized domains                                                                                                                                        | Active            |
| File access control              | Protected system files from agent modification                                                                                                                                                             | Active            |
| CSRF protection                  | Modern Sec-Fetch-Site based CSRF on `/api/v1/auth` and `/api/v1/payments` (src/middleware/csrf-protection.ts)                                                                                              | Active            |
| Redirect validation              | Open redirect prevention applied to Express query handling (src/middleware/redirect-validator.ts)                                                                                                          | Active            |
| SQL injection prevention         | Secure Query Builder (parameterized queries)                                                                                                                                                               | Active            |
| Image prompt injection detection | Detects hidden instructions in images (src/mcp/security/image-sanitizer.ts)                                                                                                                                | Integration-ready |
| Encryption at rest               | AES-256-GCM with customer-managed keys (BYOK/CMEK)                                                                                                                                                         | Active            |
| Encryption in transit            | TLS 1.3, mTLS for service-to-service                                                                                                                                                                       | Active            |
| Secret read-bypass guard         | Bash readers (`cat`/`grep`/`env`/`printenv`/`base64`…) of `.env*`, `*.pem`, `*.key`, `*secret*` blocked at `.claude/hooks/pretooluse-guard.sh` (closes the gap where Bash bypasses `Read`-tool deny rules) | Active            |
| Secret-write input scan          | `Write`/`Edit`/`Bash` input scanned for secrets before execution (`.claude/hooks/secret-scan.sh`)                                                                                                          | Active            |
| Secret-output egress scan        | `Bash` command **output** scanned post-execution; agent warned not to persist surfaced secrets (`.claude/hooks/secret-output-scan.sh`)                                                                     | Active            |

#### Secret Egress Control (read + write sides)

Read-tool deny rules (`Read(.env)`, `Read(**/*secret*)`) cover only the read half
of the threat, and per the Adversa AI disclosure the `settings.json` `deny` list
can be silently bypassed (e.g. the ~50-subcommand parser cap). The high-severity
vector in AI-assisted codebases is the agent **writing a secret into a place
nobody checks** — a committed file, a PR/issue body, a log, or an MCP call. DWS
closes both halves with a shared pattern engine (`.claude/hooks/secret-patterns.sh`)
consumed by three hooks:

1. **Read-bypass guard** (PreToolUse/Bash, blocking) — denies Bash reads of secret
   material so it never enters model context. `.env.example`/`.sample`/`.template`
   remain readable.
2. **Input scan** (PreToolUse/Bash+Write+Edit, blocking) — blocks writing a secret
   into any file or command. Covers provider keys, bare JWTs, DSNs with embedded
   credentials, `Bearer` tokens, DB passwords, and OAuth client secrets;
   placeholder values (`your-…`, `user:pass@host`) are allowlisted.
3. **Output scan** (PostToolUse/Bash, advisory) — scans command output and warns
   the agent not to persist any secret that surfaced at runtime.

The prompt-layer counterpart lives in `CLAUDE.md` → Security Coding Rules → _Secret
Egress Rules_. Hooks are the enforcement layer; `settings.json` `deny` is
defence-in-depth only.

### Layer 4: Human Oversight (Firehorse Human-in-the-Loop)

**Purpose:** Ensure human validation for all safety-critical and high-value decisions.

| Decision Type            | Automation Level              | Human Role                 | Measured Result                         |
| ------------------------ | ----------------------------- | -------------------------- | --------------------------------------- |
| Product data updates     | Automated generation          | Review and approve         | 96% time reduction, 80% error reduction |
| Pricing and strategy     | AI recommendation             | Manual approval required   | Maintained quality with human judgement |
| Compliance documentation | AI-drafted                    | Human review and sign-off  | 99% time reduction (1 week to 1 hour)   |
| Sales outreach messages  | AI-generated templates        | Human approval before send | Consent-compliant, auditable            |
| Safety-critical actions  | Blocked for autonomous agents | Human initiation required  | Zero autonomous safety-critical actions |

### Layer 5: Audit and Compliance (Article 12 + Reasoning Lineage)

**Purpose:** Enable full traceability of AI decisions for regulatory compliance and incident investigation.

| Control                 | Implementation                                      | Requirement                       |
| ----------------------- | --------------------------------------------------- | --------------------------------- |
| Automatic event logging | All AI system events logged per Article 12          | EU AI Act (Aug 2026)              |
| Reasoning lineage       | Decision chains traceable from input to output      | EU AI Act technical documentation |
| Provenance metadata     | AI model outputs include source and confidence data | Traceability                      |
| Immutable audit logs    | 7-year retention, SIEM export capability            | NIS2, GDPR                        |
| Incident reporting      | 24h early warning to Traficom, 72h final report     | NIS2                              |

### Layer 6: Societal Resilience and Monitoring

**Purpose:** Absorb and recover from AI-related incidents that bypass previous layers.

| Control                     | Implementation                                                                      | Status            |
| --------------------------- | ----------------------------------------------------------------------------------- | ----------------- |
| Real-time output monitoring | Confidence scoring on AI outputs                                                    | Planned Q2 2026   |
| Security event logging      | Centralized security logging (src/logging/)                                         | Active            |
| Vulnerability management    | Weekly scans, 24h critical patching SLA                                             | Active            |
| Business continuity         | BCP/DR with automated daily backups, 4-destination redundancy, Aiven sandbox mirror | Active            |
| Security scanning           | Daily critical bug scanner + weekly full scan                                       | Active            |
| Penetration testing         | Annual third-party assessment                                                       | Completed Q4 2025 |

#### 3.6.1 Database Backup & Disaster Recovery Controls

**Context:** Production database (Supabase PostgreSQL) requires independent backup and disaster recovery capability. Supabase Free tier provides 7-day auto-snapshots but no PITR, no external copies, and no guaranteed recovery. This section implements NIS2 Art. 21(2)(c) business continuity requirements.

**Architecture:**

```
Supabase (production) → pg_dump (daily) → 4 destinations:
  1. Local (F:\2026\Backups\dws6-db) — 30-day retention
  2. Proton Drive (encrypted .gpg) — 90-day retention
  3. Acer Veriton GN100, Helsinki (SCP) — 90-day retention
  4. GitHub Actions artifacts — 30-day retention
  └→ pg_restore → Aiven PostgreSQL (sandbox/LWM training)
```

**Controls:**

| #    | Control                       | Implementation                                                                                                                                                | Script/Tool                                                   | Status |
| ---- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ------ |
| DR-1 | Automated daily pg_dump       | `scripts/Backup-Database.ps1` runs via `Startup-DailySync.bat` on Windows login + `.github/workflows/daily-db-backup.yml` as CI/CD safety net                 | PowerShell + GitHub Actions                                   | Active |
| DR-2 | Multi-destination backup      | Local disk + Proton Drive (encrypted) + Acer Veriton Helsinki (SCP) + GitHub Actions artifacts. No single point of failure.                                   | `Sync-ToProton.ps1` v2.0, `Backup-Database.ps1 -RemoteBackup` | Active |
| DR-3 | Backup encryption             | GPG symmetric AES-256 encryption before any cloud/remote transfer. Unencrypted dumps deleted after encryption. Passphrase in `.env` (never hardcoded).        | `gpg --symmetric --cipher-algo AES256`                        | Active |
| DR-4 | Restore verification          | Row count snapshot (`row_counts.json`) taken during backup, compared after Aiven restore. Delta > 5% triggers warning.                                        | `Backup-Database.ps1`, `Mirror-ToAiven.ps1`                   | Active |
| DR-5 | Sandbox mirror (Aiven)        | Daily mirror to Aiven PostgreSQL (EU Finland) for agent work and LWM training. Also serves as warm standby. Auth stubs for RLS compatibility.                 | `Mirror-ToAiven.ps1`, `aiven-init.sql`                        | Active |
| DR-6 | Human gate on destructive ops | No `DROP DATABASE`, `terraform destroy`, or schema-breaking migrations without human approval. AI agents generate plans; humans execute destructive commands. | PR review gate, Boardy review                                 | Active |
| DR-7 | Deletion protection           | Supabase project-level deletion protection enabled in dashboard. Aiven service termination protection enabled.                                                | Provider dashboard settings                                   | Active |

**RTO/RPO Targets:**

| Metric                             | Target   | Method                                                          |
| ---------------------------------- | -------- | --------------------------------------------------------------- |
| **RPO** (Recovery Point Objective) | 24 hours | Daily pg_dump (worst case: lose 1 day of data)                  |
| **RTO** (Recovery Time Objective)  | 4 hours  | Restore from latest encrypted dump to Supabase or Aiven         |
| **RTO to Aiven failover**          | 1 hour   | Aiven already has yesterday's mirror; switch connection strings |
| **RTO from GitHub Actions**        | 2 hours  | Download artifact, decrypt, restore                             |

**Backup Retention Policy:**

| Destination                     | Retention | Encryption                               | Transfer         |
| ------------------------------- | --------- | ---------------------------------------- | ---------------- |
| Local (F:\2026\Backups\dws6-db) | 30 days   | At rest (GPG)                            | N/A              |
| Proton Drive                    | 90 days   | At rest (GPG) + in transit (Proton E2EE) | Proton sync      |
| Acer Veriton GN100, Helsinki    | 90 days   | At rest (GPG) + in transit (SCP/SSH)     | SCP              |
| GitHub Actions artifacts        | 30 days   | At rest (GitHub) + in transit (TLS)      | GitHub API       |
| Supabase auto-snapshots         | 7 days    | Provider managed                         | Provider managed |

**Verification Schedule:**

| Frequency | Action                                                                     | Owner       |
| --------- | -------------------------------------------------------------------------- | ----------- |
| Daily     | Automated backup + Aiven mirror (Startup-DailySync.bat)                    | Automated   |
| Weekly    | Verify latest backup decrypts successfully                                 | Engineering |
| Monthly   | Full restore drill to Aiven, row count comparison                          | Engineering |
| Quarterly | Disaster recovery drill (simulate Supabase loss, restore from cold backup) | Security    |

---

## 4. If-Then Safety Commitment Framework

The AI Safety Report 2026 highlights **'if-then' safety commitments** as a key risk management mechanism. DWS adopts this pattern as a formal security standard.

### 4.1 DWS If-Then Commitments

| If (Capability Threshold Triggered)              | Then (Safety Measure Activated)                       | Implementation                                | Owner          |
| ------------------------------------------------ | ----------------------------------------------------- | --------------------------------------------- | -------------- |
| AI agent attempts safety-critical action         | Human validation required before execution            | Firehorse human-in-the-loop                   | Product        |
| AI decision confidence below 70% threshold       | Flag output for mandatory manual review               | Reasoning lineage + Article 12 logging        | Engineering    |
| AI output contains potential hallucination       | Cross-validate against knowledge base before delivery | Lifetime World Model ground truth validation  | Engineering    |
| Agent attempts cross-domain tool access          | Block request and generate security log               | MCP Colors Framework (RED/BLUE separation)    | Security       |
| Data exfiltration pattern detected               | Block request, alert security team, log incident      | Domain Validator security module              | Security       |
| AI recommendation affects pricing/strategy       | Route to human approver, block autonomous execution   | Manual approval workflow                      | Product        |
| Model update changes security-relevant behavior  | Re-run domain-specific evaluation suite               | Pre-deployment testing protocol               | Engineering    |
| Prompt injection attack detected                 | Sanitize input, log attempt, alert security           | Input validation + prompt injection detection | Security       |
| Customer data accessed outside EU                | Block request, alert compliance team                  | Geo-fencing + data residency enforcement      | Infrastructure |
| AI agent exhibits unexpected autonomous behavior | Halt agent, log full context, escalate to security    | Kill switch + incident response protocol      | Security       |

### 4.2 Frontier Safety Framework Alignment

In 2025, 12 AI companies published Frontier AI Safety Frameworks. DWS aligns with this practice by maintaining:

1. **Threat model documentation** (AgentFoundry/Security.md) — identifies 5 critical threat vectors
2. **Capability evaluation protocol** — domain-specific tests for industrial AI use cases
3. **Incident reporting procedure** — NIS2-aligned timelines (24h, 72h, 1 month)
4. **If-then commitment register** (Section 4.1 above) — reviewed quarterly

---

## 5. AI Agent Security Requirements

### 5.1 Agent Governance

All AI agents operating within DWS systems must comply with:

| Requirement            | Standard                                                    | Source                                               |
| ---------------------- | ----------------------------------------------------------- | ---------------------------------------------------- |
| Behavior specification | CLAUDE.md or equivalent AGENTS.md per project               | Brockman framework + Karpathy principles             |
| Human accountability   | Every agent action attributable to a responsible human      | AI Safety Report: "Ensure some human is accountable" |
| Scope limitation       | Agents cannot access systems beyond their designated domain | MCP Colors Framework                                 |
| Output review          | All agent outputs reviewed before external delivery         | Firehorse human-in-the-loop                          |
| Audit trail            | All agent actions logged with full context                  | EU AI Act Article 12                                 |
| Kill switch            | Immediate agent termination capability                      | Loss-of-control mitigation                           |

### 5.2 Agent-Specific Risks (from AI Safety Report 2026)

> "AI agents pose heightened risks because they act autonomously, making it harder for humans to intervene before failures cause harm. Current techniques can reduce failure rates but not to the level required in many high-stakes settings."

**DWS agent risk mitigation:**

- **Firehorse automation agents**: Human approval gates for all outbound communications, pricing changes, and compliance determinations
- **Sales AI agents (6-agent team)**: Human oversight for outreach messages, lead qualification criteria, and proposal generation
- **MCP hub agents**: Tool-level access control, RED/BLUE separation, session-scoped permissions
- **Edge AI (Jetson)**: Air-gapped operation mode available, unidirectional data export for OT environments

### 5.3 Open-Weight Model Policy

The AI Safety Report notes that open-weight models "cannot be recalled once released, their safeguards are easier to remove, and actors can use them outside of monitored environments."

**DWS policy:**

- Open-weight models (e.g., Llama, Mistral, Qwen) may be used for development and testing
- Production deployment of open-weight models requires security review and approval
- When open-weight models are deployed, additional monitoring layers must be active
- Customer-facing AI outputs must include provenance metadata identifying the model used

---

## 6. Sales and Marketing AI Security

### 6.1 Outreach Compliance

Firehorse automates sales and marketing outreach. The AI Safety Report's findings on influence, manipulation, and automation bias require specific controls:

| Control            | Requirement                                             | Implementation              |
| ------------------ | ------------------------------------------------------- | --------------------------- |
| Human review       | All AI-generated outreach reviewed before sending       | Firehorse approval workflow |
| Consent management | Unsubscribe mechanism in every message                  | GDPR + ePrivacy compliance  |
| Truthful claims    | AI must not fabricate capabilities or compliance status | LWM ground truth validation |
| Audit trail        | Every outreach message logged with template source      | Firehorse Terms of Service  |
| A/B testing ethics | Test variants must not be deceptive or manipulative     | Internal review policy      |
| Frequency limits   | Prevent AI from over-contacting prospects               | Rate limiting per contact   |

### 6.2 Signal-Based Sales Integrity

Our signaalimyynti (signal-based sales) methodology must maintain:

- **Signal verification**: AI-identified signals (job changes, press releases, regulatory events) must be verified before outreach
- **Personalization boundaries**: AI personalization must not cross into manipulation territory
- **Transparency**: When asked, we disclose that our outreach process uses AI assistance
- **Data minimization**: Only publicly available data used for signal detection (LinkedIn, press, public filings)

---

## 7. NIS2 Directive Integration

### 7.1 NIS2 Context and AI Safety Report Intersection

The **NIS2 Directive (EU 2022/2555)** applies to DWS as a provider of digital services to essential and important entities (construction, manufacturing, energy). The AI Safety Report 2026's finding that "criminal groups and state-associated attackers are actively using general-purpose AI in their operations" makes NIS2 compliance more urgent.

**DWS NIS2 classification:** Digital service provider to essential entities (construction, energy) and important entities (manufacturing, fleet)

### 7.2 NIS2 Article-by-Article Compliance

| NIS2 Article      | Requirement                                               | DWS Implementation                                                                                                                                                                                                                                                              | Status     | AI Safety Report Relevance                                                             |
| ----------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------- |
| **Art. 21(1)**    | Risk management measures                                  | DWS Security Standard (this document)                                                                                                                                                                                                                                           | Active     | Report: "risk management frameworks are still immature" — our framework addresses this |
| **Art. 21(2)(a)** | Policies on risk analysis and information system security | Threat model (AgentFoundry/Security.md), SECURITY_COMPLIANCE.md                                                                                                                                                                                                                 | Active     | Report: three risk categories (malicious use, malfunction, systemic) integrated        |
| **Art. 21(2)(b)** | Incident handling                                         | 24h early warning to Traficom, 72h final report                                                                                                                                                                                                                                 | Active     | Report: AI-assisted cyberattacks require faster detection                              |
| **Art. 21(2)(c)** | Business continuity and crisis management                 | Daily pg_dump → 4 destinations (local/Proton/Helsinki/GitHub), Aiven sandbox mirror, RPO 24h, RTO 4h. See Section 3.6.1                                                                                                                                                         | Active     | Report: societal resilience requires recovery capability                               |
| **Art. 21(2)(d)** | Supply chain security                                     | Sub-processor list; vendor risk assessment exists (Aiven/Supabase CLOUD Act analysis, Shufti Pro DPA review) but runs ad hoc per decision, not on a recurring schedule — see `docs/SECURITY_ROLES_AND_GUIDANCE.md` role #3 for the honest current-state note and cadence target | Partial    | Report: open-weight models cannot be recalled — supply chain risk                      |
| **Art. 21(2)(e)** | Security in network and information systems               | VPC isolation, TLS 1.3, mTLS                                                                                                                                                                                                                                                    | Active     | Report: AI expands attack surface                                                      |
| **Art. 21(2)(f)** | Policies and procedures for assessing effectiveness       | Quarterly security metrics review, red team exercises                                                                                                                                                                                                                           | Planned Q2 | Report: "evaluation gap" — testing must be continuous                                  |
| **Art. 21(2)(g)** | Basic cyber hygiene and training                          | Security glossary (EN/FI); internal training program skeleton defined in `docs/SECURITY_TRAINING_PROGRAM_SKELETON.md` (2026-07-03) — do not mark Active until at least one full cycle has actually run and been logged, per that document                                       | Partial    | Report: automation bias weakens critical thinking                                      |
| **Art. 21(2)(h)** | Policies on use of cryptography and encryption            | AES-256-GCM, BYOK/CMEK, TLS 1.3                                                                                                                                                                                                                                                 | Active     | —                                                                                      |
| **Art. 21(2)(i)** | Human resources security, access control                  | RBAC + ABAC, SSO (SAML 2.0/OIDC)                                                                                                                                                                                                                                                | Active     | Report: agent access control critical                                                  |
| **Art. 21(2)(j)** | Multi-factor authentication                               | MFA for all administrative access                                                                                                                                                                                                                                               | Active     | Report: AI-assisted credential attacks                                                 |
| **Art. 23**       | Reporting obligations                                     | 24h early warning, 72h notification, 1 month final report                                                                                                                                                                                                                       | Active     | Report: AI incidents need same reporting discipline                                    |

### 7.3 NIS2 Incident Response for AI-Related Events

Based on the AI Safety Report's findings on AI-assisted cyberattacks and agent malfunctions:

| Timeline      | Action                    | AI-Specific Considerations                                                  |
| ------------- | ------------------------- | --------------------------------------------------------------------------- |
| **T+0**       | Incident detection        | AI anomaly detection, agent behavior monitoring, security logging           |
| **T+4h**      | Internal assessment       | Determine if AI system involved (hallucination, injection, malfunction)     |
| **T+24h**     | Early warning to Traficom | Include AI system involvement in initial notification                       |
| **T+72h**     | Incident notification     | Severity assessment, containment status, AI-specific root cause             |
| **T+1 month** | Final report              | Full root cause analysis, AI evaluation gap assessment, corrective measures |

### 7.4 NIS2 Supply Chain Security for AI Models

| Supply Chain Element                         | Risk                                     | NIS2 Control                                        | AI Safety Report Context                                             |
| -------------------------------------------- | ---------------------------------------- | --------------------------------------------------- | -------------------------------------------------------------------- |
| Cloud AI providers (Anthropic, Google, Groq) | Provider outage, model behavior change   | Multi-vendor strategy, failover capability          | Report: 12 companies published safety frameworks — verify compliance |
| Open-weight models (Llama, Mistral, Qwen)    | Cannot be recalled, safeguards removable | Production approval required, additional monitoring | Report: "cannot be recalled once released"                           |
| MCP server ecosystem                         | Tool poisoning, shadowing attacks        | MCP Colors Framework, tool approval workflow        | Report: agent tool access is attack vector                           |
| Training data providers                      | Data contamination, evaluation gap       | Verify data provenance, monitor for contamination   | Report: "data contamination affects evaluations"                     |

---

## 8. Security Standards Alignment Matrix

### 8.1 Standards DWS Follows

| Standard               | Scope                              | Status                 | Certification Target                                                                                                                                                      | AI Safety Report Alignment                                         |
| ---------------------- | ---------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| **ISO 27001**          | Information security management    | Gap assessment Q1 2026 | Q3 2026 (TÜV Rheinland)                                                                                                                                                   | Report validates need for formalized security management           |
| **NIS2 Directive**     | Network and information security   | Active compliance      | N/A (directive, not certification)                                                                                                                                        | Report: AI-assisted cyberattacks require stronger network security |
| **EU AI Act**          | AI system governance               | 80% ready              | August 2, 2026 (mandatory); **Omnibus may delay to Dec 2027** — timelines now tied to availability of harmonised standards/guidance (Nov 2025 proposal, trilogue ongoing) | Report is the scientific foundation informing the Act              |
| **GDPR**               | Data protection                    | 95% ready              | Active (ongoing)                                                                                                                                                          | Report: data sovereignty and privacy are foundational              |
| **Fit for 55**         | Climate compliance                 | 90% ready              | Ongoing targets                                                                                                                                                           | Report: AI infrastructure environmental costs are growing          |
| **CSRD**               | Sustainability reporting           | 85% ready              | Active (ongoing)                                                                                                                                                          | Report: systemic risks include environmental costs                 |
| **IEC 62443**          | Industrial control system security | Roadmap                | Q4 2026                                                                                                                                                                   | Report: autonomous agents in OT environments pose risks            |
| **SOC 2 Type II**      | Service organization controls      | Roadmap                | Q4 2026 (Deloitte/EY)                                                                                                                                                     | Report: trust and transparency requirements                        |
| **DORA**               | Digital operational resilience     | Roadmap                | If financial integration required                                                                                                                                         | Report: systemic financial risks from AI                           |
| **ePrivacy Directive** | Electronic communications privacy  | Active                 | Ongoing                                                                                                                                                                   | Report: AI companion/tracking risks                                |
| **ISO 14001**          | Environmental management           | Aligned                | N/A                                                                                                                                                                       | Report: environmental costs of AI                                  |
| **ISO 19650**          | BIM information management         | Aligned                | N/A                                                                                                                                                                       | Report: data governance in construction                            |
| **UNECE R155/R156**    | Vehicle cybersecurity              | Aware                  | If OEM partnership                                                                                                                                                        | Report: autonomous vehicle AI risks                                |

### 8.2 OWASP Alignment

DWS follows **OWASP Top 10 for LLM Applications 2025**:

| OWASP LLM Risk                          | DWS Mitigation                                        | Implementation                             |
| --------------------------------------- | ----------------------------------------------------- | ------------------------------------------ |
| LLM01: Prompt Injection                 | Input validation, image prompt injection detection    | src/mcp/security/                          |
| LLM02: Insecure Output Handling         | Output sanitization, reasoning lineage validation     | Firehorse workflows                        |
| LLM03: Training Data Poisoning          | Vendor model verification, domain-specific evaluation | Evaluation gap mitigation (Section 2.2)    |
| LLM04: Model Denial of Service          | Rate limiting, failover to alternative providers      | Multi-vendor strategy                      |
| LLM05: Supply Chain Vulnerabilities     | Sub-processor audit, open-weight model policy         | NIS2 supply chain controls (Section 7.4)   |
| LLM06: Sensitive Information Disclosure | Domain Validator, File Access Control                 | src/config/protected_config.py             |
| LLM07: Insecure Plugin Design           | MCP Colors Framework, tool approval                   | MCP hub architecture                       |
| LLM08: Excessive Agency                 | Human-in-the-loop, capability thresholds              | If-then commitment framework (Section 4)   |
| LLM09: Overreliance                     | Automation bias training, mandatory human review      | Human oversight layer (Section 3, Layer 4) |
| LLM10: Model Theft                      | Encrypted model storage, access control               | AES-256-GCM, RBAC                          |

### 8.3 MITRE ATLAS Alignment

DWS threat modeling uses **MITRE ATLAS** (Adversarial Threat Landscape for AI Systems):

| ATLAS Technique                       | Relevance                                                | DWS Control                                       |
| ------------------------------------- | -------------------------------------------------------- | ------------------------------------------------- |
| AML.T0015: Evade ML Model             | Models distinguishing test vs production (Safety Report) | Domain-specific evaluation, continuous monitoring |
| AML.T0040: ML Supply Chain Compromise | Open-weight model risks                                  | Supply chain security (Section 7.4)               |
| AML.T0043: Craft Adversarial Data     | Prompt injection attacks                                 | Input validation, MCP Colors                      |
| AML.T0048: Exfiltration via ML API    | Data exfiltration through AI queries                     | Domain Validator                                  |
| AML.T0051: LLM Prompt Injection       | Direct and indirect injection                            | Prompt injection detection module                 |
| AML.T0054: LLM Jailbreak              | Crescendo multi-turn attacks (98-100% success)           | Layered safeguards, output monitoring             |

---

## 9. Regulatory Compliance Matrix

### 9.1 Current Compliance Status

| Regulation               | Readiness | Deadline                                                                                                                                                                                  | DWS Action Required                                                                                                                                                                   |
| ------------------------ | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **EU AI Act**            | 80%       | August 2, 2026 (original); **Dec 2027 if Omnibus passes** — high-risk applicability now tied to availability of harmonised standards/guidance per Nov 2025 Digital Omnibus on AI proposal | Close Article 12 logging gaps, complete technical documentation. **Note:** Omnibus does NOT weaken Article 12 substance — logging remains mandatory. Lighter QMS/doc burden for SMEs. |
| **GDPR**                 | 95%       | Active                                                                                                                                                                                    | Maintain DPA readiness, quarterly privacy review                                                                                                                                      |
| **NIS2 Directive**       | 75%       | Active                                                                                                                                                                                    | Expand incident response, strengthen supply chain security                                                                                                                            |
| **Fit for 55**           | 90%       | Ongoing                                                                                                                                                                                   | Validate carbon footprint calculator, expand industry coverage                                                                                                                        |
| **CSRD**                 | 85%       | Active                                                                                                                                                                                    | Automate sustainability reporting for client portfolio                                                                                                                                |
| **Digital Services Act** | 90%       | Active                                                                                                                                                                                    | Voluntary compliance with Articles 14-24                                                                                                                                              |
| **EU Data Act**          | 80%       | Active                                                                                                                                                                                    | Data portability (NDJSON/Parquet), sovereignty options                                                                                                                                |

### 7.2 Safety Report-Driven Compliance Actions

Based on the AI Safety Report 2026 findings, these additional compliance actions are required:

| Action                                                 | Priority | Deadline                                                                                                                                                                        | Owner       |
| ------------------------------------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| Implement domain-specific AI evaluation suite          | CRITICAL | Q1 2026                                                                                                                                                                         | Engineering |
| Close EU AI Act Article 12 gaps (20% remaining)        | CRITICAL | July 2026 (original); **Omnibus may extend to H2 2027** — but early certification = marketing win & proactive posture. Timelines now tied to harmonised standards availability. | Compliance  |
| Strengthen NIS2 posture (25% gap)                      | HIGH     | Q2 2026                                                                                                                                                                         | Security    |
| Deploy real-time AI output monitoring                  | HIGH     | Q2 2026                                                                                                                                                                         | Engineering |
| Establish quarterly red team exercises                 | HIGH     | Q2 2026                                                                                                                                                                         | Security    |
| Document if-then commitment register                   | MEDIUM   | Q1 2026                                                                                                                                                                         | Security    |
| Validate carbon footprint calculator                   | MEDIUM   | Q2 2026                                                                                                                                                                         | Product     |
| Update Firehorse ToS with Safety Report best practices | MEDIUM   | Q1 2026                                                                                                                                                                         | Legal       |
| Train team on automation bias awareness                | MEDIUM   | Q2 2026                                                                                                                                                                         | HR/Product  |

---

## 10. Security Metrics and KPIs

### 10.1 Existing Metrics (README_SECURITY.md)

| Metric                | Value       | Source                       |
| --------------------- | ----------- | ---------------------------- |
| Security test cases   | 57          | pytest security suite        |
| Protected domains     | 20+         | Domain Validator             |
| Blacklisted domains   | 10+         | Domain Validator             |
| Protected file paths  | 8+          | File Access Control          |
| CSRF browser coverage | 94.18%      | Sec-Fetch-Site               |
| Security investment   | EUR 17,100  | Development costs            |
| Risk mitigated        | EUR 20.24M+ | Breach cost avoidance        |
| Security ROI          | 1,183x      | Investment vs risk reduction |

### 10.2 New Metrics (AI Safety Report-Driven)

| Metric                                                  | Target             | Frequency    | Owner       |
| ------------------------------------------------------- | ------------------ | ------------ | ----------- |
| AI output accuracy vs ground truth                      | >99%               | Monthly      | Engineering |
| Hallucination detection rate                            | >95%               | Monthly      | Engineering |
| Human override rate (Firehorse)                         | Track trend        | Monthly      | Product     |
| If-then commitment trigger frequency                    | Track trend        | Quarterly    | Security    |
| Evaluation gap assessment score                         | Improve quarterly  | Quarterly    | Security    |
| Incident response time (first detection to containment) | <4 hours           | Per incident | Security    |
| Agent autonomy boundary violations                      | 0 per quarter      | Quarterly    | Security    |
| Customer-reported AI errors                             | Decrease quarterly | Quarterly    | Support     |

---

## 11. Document Hierarchy

The DWS Security Standard sits within the following document hierarchy:

```
DWS Security Standard (this document)
│
├── FOUNDATIONAL STANDARDS (inputs to security)
│   ├── DWS_DOCUMENT_STANDARD.md          ← v1.3 — traceability, versioning, Article 12 audit trail
│   ├── UI_SKILLS_GAMMA.md                ← v2.0 — brand standard, WCAG 2.2, XSS prevention
│   └── CLAUDE.md                          ← Karpathy principles, agent governance
│
├── FIREHORSE OPERATIONAL MODEL (evidence base — PRIVATE, Learn/ only)
│   ├── docs/PHD_FIREHORSE_EN.md               ← Master thesis EN — operational model + metrics
│   ├── docs/PHD_FIREHORSE_FI.md               ← Pro gradu FI — toimintamalli + tulokset
│   └── Learn/PHD_FIREHORSE_*_v*.html           ← Versioned HTML (never delete old versions)
│
├── ADMIN MANUALS (operational security procedures)
│   ├── ADMIN_MANUAL_AUTHENTICATION.md     ← v1.3 — JWT, bcrypt, security audit workflow
│   ├── ADMIN_MANUAL_SUPABASE_EN_v1.md     ← Database administration & RLS
│   ├── ADMIN_MANUAL_DWS6_COM.md           ← Platform configuration
│   ├── ADMIN_MANUAL_DASHBOARD_V8_EN_v1.md ← Dashboard administration
│   └── ADMIN_MANUAL_TESTING.md            ← Testing procedures
│
├── INTERNAL SECURITY FRAMEWORK
│   ├── DWS_SECURITY_STANDARD.md          ← You are here (internal standard)
│   ├── AgentFoundry/Security.md          ← LLM threat analysis (800 lines)
│   ├── README_SECURITY.md               ← Implementation quick reference
│   └── docs/SECURITY_GLOSSARY.md         ← Terminology (EN/FI)
│
├── EXTERNAL-FACING COMPLIANCE
│   ├── SECURITY_COMPLIANCE.md            ← For CISOs and procurement
│   ├── dws10.com/legal/ (Section 9)      ← Legal Hub Security Research
│   └── dws10.com/data-security-policy/   ← Public data security policy
│
├── ASSESSMENTS AND REPORTS
│   ├── SECURITY_ASSESSMENT_GAMMA.md      ← Vulnerability assessment
│   ├── RUFF_SECURITY_REPORT.md           ← Python security scan
│   ├── documentation/SECURITY-FIX-GUIDE.md ← Database security fixes
│   └── security-reports/                  ← CI/CD automated reports
│
├── INTELLIGENCE AND RESEARCH
│   ├── docs/field-notes/2026-02-06-ai-safety-report-2026-field-note.md
│   └── Admin/Security/ (local only, ProtonDrive)
│
├── AUTOMATED PR REVIEW (HIL Security Gate)
│   ├── .github/workflows/ai-pr-review.yml     ← Dual AI review: Claude + Gemini HIL
│   ├── .github/workflows/pr-auto-merge.yml    ← Auto-merge with safety labels
│   ├── .github/copilot-setup-steps.yml        ← Copilot coding agent env setup
│   └── mcp-hub/server.py:/gemini/review       ← Gemini review API endpoint
│
└── IMPLEMENTATION
    ├── src/config/protected_config.py     ← Protected configuration
    ├── src/mcp/security/                  ← MCP security modules
    ├── src/middleware/                    ← CSRF, redirect validation
    ├── src/database/                      ← SQL injection prevention
    └── .github/workflows/security-*.yml   ← 8 security workflows
```

### 11.1 Automated PR Security Review (HIL Automation)

All pull requests pass through a mandatory dual-model AI security review that replaces manual human-in-the-loop code review:

```
Claude Code → PR → Claude sanity check → Gemini HIL review → @copilot fixes → CI → auto-merge
                                                ↑                    |
                                                └────────────────────┘  (fix loop)
```

| Control                                       | Reviewer        | Posture                      |
| --------------------------------------------- | --------------- | ---------------------------- |
| API key/secret exposure                       | Claude + Gemini | Block on detection           |
| Injection vulnerabilities (SQL, XSS, command) | Gemini          | Block on detection           |
| Auth/authz gaps                               | Gemini          | Block on detection           |
| OWASP Top 10 (LLM + web)                      | Claude + Gemini | Block on detection           |
| Test coverage for new logic                   | Gemini          | REQUEST_CHANGES if missing   |
| Edge cases (empty/large inputs, concurrency)  | Gemini          | REQUEST_CHANGES if unhandled |

**Gemini default posture:** REQUEST_CHANGES. Only APPROVE when zero security issues, adequate tests, and project conventions followed. Human overrides via `do-not-merge` / `needs-human-review` labels.

---

## 12. Claw-Layer Security (OpenClaw/Moltworker Threat Model)

### 12.1 The Three-Layer AI Stack

Just as LLM agents added orchestration, tool use, and memory on top of raw LLM inference, a new "Claw" layer has emerged above LLM agents — adding persistent scheduling, multi-channel gateways, self-extending skills, and long-term memory:

| Layer         | Abstraction                                                                          | Security Surface                                                                                     | Example                      |
| ------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- | ---------------------------- |
| **LLM**       | Raw inference (prompt in, text out)                                                  | Prompt injection, jailbreak                                                                          | Claude API, GPT API          |
| **LLM Agent** | Orchestrated inference + tool calls + session memory                                 | Tool poisoning, data exfiltration                                                                    | Claude Code, Cursor, Copilot |
| **Claw**      | Persistent daemon + multi-channel gateway + self-extending skills + long-term memory | All agent risks + shell access, skill registry poisoning, cross-channel leakage, self-modifying code | OpenClaw, Moltworker         |

Each layer inherits and amplifies all vulnerabilities from the layer below.

### 12.2 Claw-Specific Threat Vectors

| Threat                                  | Severity | Attack Vector                                                                   | DWS Mitigation                                                               |
| --------------------------------------- | -------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| **Skill registry poisoning**            | CRITICAL | Malicious skill published to community registry; installed by auto-update       | Skill allowlist, code review gate, no auto-install from untrusted registries |
| **Self-modifying skills**               | HIGH     | Claw writes code to extend its own capabilities, bypassing safety constraints   | Sandbox SDK isolation, skill code review, capability ceiling enforcement     |
| **Cross-channel data exfiltration**     | HIGH     | Data from secure channel (Slack) leaked to insecure channel (Telegram)          | Per-channel data classification, access controls, egress filtering           |
| **Long-term memory poisoning**          | MEDIUM   | Adversary injects false context into persistent memory to alter future behavior | Cryptographic integrity on memory files, periodic memory audit               |
| **Gateway token theft**                 | MEDIUM   | Single token controls all channel access; compromise = full takeover            | Per-channel authentication tokens, token rotation policy                     |
| **Container escape via shell**          | MEDIUM   | Shell access + internet = data exfiltration path even in sandbox                | Network egress filtering, command audit logging                              |
| **Prompt injection via tool responses** | HIGH     | Malicious tool returns payload that hijacks the agent's reasoning               | Output sanitization, tool response sandboxing, MCP Colors enforcement        |

### 12.3 DWS If-Then Commitments for Claw Layer

| If (Trigger)                                                                   | Then (Safety Measure)                                       | Owner       |
| ------------------------------------------------------------------------------ | ----------------------------------------------------------- | ----------- |
| Claw attempts to install skill from untrusted registry                         | Block installation, log attempt, alert security             | Security    |
| Claw writes self-modifying code                                                | Quarantine new code, require human review before activation | Engineering |
| Data flows between channels without access control match                       | Block cross-channel transfer, log incident                  | Security    |
| Persistent memory file modified outside normal operations                      | Alert security, verify file integrity                       | Security    |
| Shell command matches exfiltration pattern (curl to external, base64 encoding) | Block command, alert security                               | Security    |

### 12.4 Cisco OpenClaw Skills Audit (Reference)

Cisco's AI security team found that third-party OpenClaw skills performed data exfiltration through crafted tool responses. DWS must audit all skills before deployment:

- **Pre-deployment:** Static analysis of skill source code
- **Runtime:** Network egress monitoring per skill
- **Post-deployment:** Behavioral anomaly detection on skill outputs
- **Quarterly:** Re-audit installed skills against updated threat intelligence

---

## 13. Supply Chain Integrity for Client-Side Dependencies

### 13.1 Subresource Integrity (SRI) Policy

**All external scripts loaded via CDN MUST include SRI hashes.** This prevents supply chain attacks where a CDN compromise injects malicious code.

| Requirement                                              | Status                               | Standard         |
| -------------------------------------------------------- | ------------------------------------ | ---------------- |
| SRI hashes on all CDN `<script>` tags                    | **REQUIRED** — currently 0% coverage | W3C SRI spec     |
| SRI hashes on all CDN `<link>` tags                      | **REQUIRED** — currently 0% coverage | W3C SRI spec     |
| `crossorigin="anonymous"` on all SRI-protected resources | REQUIRED                             | CORS spec        |
| Self-hosting for authentication-related libraries        | RECOMMENDED                          | Defence-in-depth |

### 13.2 GitHub Actions SHA Pinning Policy

**All GitHub Actions MUST be pinned to specific commit SHAs**, not version tags. Version tags are mutable — a compromised maintainer can push malicious code to an existing tag.

```yaml
# PROHIBITED:
uses: actions/checkout@v4

# REQUIRED:
uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11 # v4.1.1
```

### 13.3 CORS Policy Standard

**No service may use `allow_origins=["*"]` in production.** Approved CORS origins:

```python
APPROVED_ORIGINS = [
    "https://dws10.com",
    "https://dws6.com",
    "https://onelifetime.world",
    "https://lifetime.fi",
    "http://localhost:3000",   # development only
    "http://localhost:3002",   # development only
]
```

#### 13.3.1 MCP Server CORS Implementation Pattern

All MCP servers (FastAPI) **MUST** use the following env-driven pattern. Wildcard `"*"` is **PROHIBITED** for `allow_origins`, `allow_methods`, and `allow_headers`.

```python
# REQUIRED pattern — apply to every new MCP server
import os
from fastapi.middleware.cors import CORSMiddleware

_CORS_ORIGINS: list[str] = os.getenv(
    "CORS_ALLOWED_ORIGINS",
    "http://localhost:3000,http://localhost:3002,https://dws10.com,https://onelifetime.world",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Request-ID"],
)
```

The `CORS_ALLOWED_ORIGINS` env var is passed via `docker-compose.hybrid.yml` per service:

```yaml
environment:
  CORS_ALLOWED_ORIGINS: ${CORS_ALLOWED_ORIGINS:-http://localhost:3000,https://dws10.com,https://onelifetime.world}
```

**Audit log of wildcard CORS fixes:**

| Date       | File                             | Finding                                                             | Fix                                                  |
| ---------- | -------------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------- |
| 21.02.2026 | `mcp-hub/server.py`              | `allow_origins=["*"]`                                               | Replaced with env-driven list (v1.1)                 |
| 23.02.2026 | `mcp-servers/supabase/server.py` | `allow_origins=["*"]`, `allow_methods=["*"]`, `allow_headers=["*"]` | Replaced with scoped explicit lists + env var (v1.2) |

**Rule:** Any new MCP server added to `mcp-servers/` or `mcp-hub/` must follow pattern 13.3.1 from creation. Code review must reject PRs containing `["*"]` in CORS config.

### 13.4 Shell Command Execution Policy

**`exec()` with string interpolation is PROHIBITED.** Use `execFile()` with argument arrays:

```typescript
// PROHIBITED:
await exec(`command "${userInput}"`);

// REQUIRED:
await execFile("command", [userInput]);
```

### 13.5 Supply-Chain Inventory (Bumblebee on DGX Spark)

**When a supply-chain advisory drops, we must answer in seconds whether the DGX Spark host has the compromised version installed.** This control deploys Perplexity's **Bumblebee** (Apache 2.0, Go static binary, https://github.com/perplexityai/bumblebee) as a read-only inventory scanner inside the DGX Spark docker-compose stack.

**Where it runs.** `infrastructure/dgx-spark/bumblebee/` builds the scanner from a pinned upstream commit (recorded in `bumblebee.version`) and runs it as the `bumblebee-collector` container alongside the existing Aspire Dashboard. The host filesystem is mounted **read-only** at `/host`; the container drops all Linux capabilities and runs `read_only: true` with `no-new-privileges`.

**Cadence.** `supercronic` inside the container runs:

- `project` profile daily at 04:00 UTC (focused scan of project lockfiles)
- `deep` profile weekly on Sunday 05:00 UTC (whole-host inventory)
- Ad-hoc: `docker exec bumblebee-collector /app/run-scan.sh deep`

**Observability surface.** The collector parses Bumblebee's NDJSON output and emits OTel metrics + structured logs to the existing `aspire-dashboard:18888` OTLP/HTTP endpoint — the same pipeline already used by `dws-backend` and `dws-cron` (protocol `http/protobuf`, post-v1.2.0). No new dashboard service. Metrics published:

| Metric                                  | Type      | Purpose                                        |
| --------------------------------------- | --------- | ---------------------------------------------- |
| `bumblebee.packages.total`              | gauge     | Inventoried package count                      |
| `bumblebee.packages.by_ecosystem`       | gauge     | Breakdown by npm / pypi / go / gem / mcp / ext |
| `bumblebee.exposures.total`             | gauge     | Catalog matches in the latest scan             |
| `bumblebee.exposures.by_severity`       | gauge     | Per-severity counts                            |
| `bumblebee.scan.duration_ms`            | histogram | Wall time of each scan                         |
| `bumblebee.scan.last_success_timestamp` | gauge     | Staleness alarm for cron failures              |

Per-finding `bumblebee.exposure` events are also logged as structured JSON so the Aspire **Structured Logs** view surfaces the advisory ID, ecosystem, package name, and version of each match.

**Exposure catalog.** `infrastructure/dgx-spark/bumblebee/catalog.json` is the canonical source of known-compromised package versions. Updates go through PR review — Bumblebee's outputs and any catalog input from third-party feeds are treated as **untrusted external content** per §13.

**Caveat (inherited, not introduced).** Aspire Dashboard runs in `Unsecured` auth mode on `:18888`. Exposure data is sensitive; access to the DGX Spark observability port is governed by the existing host-network posture and must not be widened.

### 13.6 Dependency Lockfile & Vulnerability SLA Policy

**Every directory with a `package.json` MUST also carry a committed `package-lock.json`.** `npm audit` (and `scripts/daily/dependabot-audit.sh`, its automated caller) cannot assess a directory without a lockfile — an unpinned directory is an audit blind spot, not just a reproducibility gap. `.github/dependabot.yml` covers every such directory on a weekly cadence, grouped by minor/patch, across `npm`, root `pip`, and `github-actions` ecosystems.

**Audit log of lockfile gaps found and closed:**

| Date       | Directory                            | Finding                                                                                                                                                                                  | Fix                                                                                   |
| ---------- | ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| 08.07.2026 | `lambda/ses-inbound-parser`          | `package.json` with no `package-lock.json`                                                                                                                                               | Lockfile generated and committed                                                      |
| 08.07.2026 | `infrastructure/dgx-spark/bumblebee` | `package.json` with no `package-lock.json`                                                                                                                                               | Lockfile generated and committed                                                      |
| 08.07.2026 | `scripts/daily/dependabot-audit.sh`  | `PACKAGE_DIRS` missing `mcp-hub-ts`, `mcp-servers/cloud-run-gateway-ts`, and the two directories above; referenced non-existent `mobile-dashboard` instead of `mobile-dashboard_RETIRED` | Directory list corrected to match every `package.json` location the repo actually has |

**Vulnerability remediation SLA.** Once Dependabot or `npm audit` surfaces a finding, it is triaged by the **Aegis agent** (`src/agents/aegis.agent.ts`) against a fixed, NIS2-style SLA:

| Severity | SLA (days to remediate) |
| -------- | ----------------------- |
| Critical | 2                       |
| High     | 7                       |
| Moderate | 30                      |
| Low      | 90                      |

Aegis does not fetch findings itself — it classifies whatever `scripts/daily/dependabot-audit.sh` and `scripts/weekly/security-audit.sh` (via `scripts/scan_critical_bugs.py --full`) already produced, and flags breach / at-risk / on-track per finding. This is the canonical SLA policy; do not restate different numbers elsewhere.

**Open tracked finding:** `infrastructure/dgx-spark/bumblebee` carries 9 moderate `npm audit` findings in the `@opentelemetry/*` tree (`GHSA-8988-4f7v-96qf`, unbounded memory allocation in W3C Baggage propagation). The only available fix is a major-version bump (`@opentelemetry/exporter-metrics-otlp-proto` `^0.57.0` → `0.220.0`) that is a breaking change for the OTLP emitter this scanner depends on. Deferred rather than force-applied blind; owner must upgrade and re-verify the OTLP pipeline before the 30-day moderate SLA lapses (opened 08.07.2026).

**pip lockfile gap.** No `requirements.txt` in the repo is hash-pinned (`pip-compile`/`poetry.lock` equivalent) — direct pins exist but transitive dependencies float, so `pip-audit` results vary run to run. `mcp-hub/requirements.txt` was found via `pip-audit` (08.07.2026) to depend on:

| Package (pin type)       | Version | Finding                                     | Fix                                                                                                                                                                                                    |
| ------------------------ | ------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `python-dotenv` (direct) | 1.1.0   | CVE-2026-28684                              | Bumped to 1.2.2 (patch, non-breaking) — done 08.07.2026                                                                                                                                                |
| `pyjwt` (transitive)     | 2.9.0   | Multiple PYSEC-2026-\* advisories           | Fix available in 2.12.1–2.13.0 (minor, likely non-breaking) — **not yet applied**, no direct pin to bump; needs an explicit constraint added and the auth flow re-tested first                         |
| `starlette` (transitive) | 0.46.2  | Multiple PYSEC-2026-_/CVE-2026-_ advisories | Full fix requires the 1.x line (major bump); partial fixes exist at 0.47.2/0.49.1. FastAPI 0.115.12's supported Starlette range must be checked before bumping — **deferred, not force-applied blind** |

Moderate-severity SLA clock opened 08.07.2026 for the `pyjwt`/`starlette` items; owner must add explicit constraints, verify FastAPI compatibility, and re-run `pip-audit` before it lapses.

**Dead-code alert noise (root cause of the bulk of the repo's Dependabot count, closed 08.07.2026).** GitHub's dependency graph scans every manifest file in the repo tree regardless of `.github/dependabot.yml` directory scoping. Two categories of dead code were inflating the alert count with findings against code nothing runs:

- **`artifacts/pr925-worktree/` and `artifacts/pr1295-mergecheck/`** — full duplicate repo checkouts (997MB combined) accidentally committed in PR #1573 as merge-check/worktree leftovers. Not referenced by any script, CI workflow, or doc. Confirmed responsible for at least 5 alerts pulled from live GitHub push output on 08.07.2026 (APScheduler insecure-deserialization RCE, `shell-quote` shell-injection, Vitest UI arbitrary-file-read, `axios` prototype-pollution MITM) plus an unknown share of the remainder. **Deleted** (`git rm -r`) — fits the "temporary/generated output" exception to the no-destructive-deletes rule (CLAUDE.md Non-Negotiable Rule 6). Top-level media files in `artifacts/` (photos/videos, `pr925-view.json`) were intentionally left in place — not part of this cleanup.
- **`*_DEPRECATED/` directories** (`mcp-hub_DEPRECATED`, `mcp-servers/{claude,supabase,cloudrun,lwm}_DEPRECATED`, etc.) — intentionally archived per repo convention (rename-to-`_DEPRECATED` rather than delete), still generate real alerts against pinned dependency versions in dead code (e.g. `mcp-servers/cloudrun_DEPRECATED/requirements.txt` pins `cryptography==38.0.4`, flagged for two separate CVEs). **Left in place** — this is expected, accepted noise from intentionally-archived code, not a live-code risk. Do not chase alerts filed against any `*_DEPRECATED/` path; verify the finding's path before triaging it as a live issue.

---

## 14. Multi-Tenant Sandbox Isolation Architecture

DWS IQ Agent Foundry enforces tenant data isolation through a staged architecture that provides defense-in-depth at OS, container, and network levels.

### 14.1 Isolation Stages

| Stage                     | When                            | Isolation Method                                                | NIS2 Defensible | Multi-Tenant       | Infra Cost   |
| ------------------------- | ------------------------------- | --------------------------------------------------------------- | --------------- | ------------------ | ------------ |
| 1 — SDK Sandbox           | Demo / Pilot                    | Anthropic Agent SDK native sandbox (bubblewrap/seatbelt)        | Yes (demo)      | No                 | €0           |
| 1.5 — OpenSandbox         | Internal pilots / air-gapped EU | OpenSandbox on Acer Veriton (Docker, local hardware)            | Yes             | No (single tenant) | €0 (HW only) |
| 2 — Ephemeral Containers  | First paid multi-tenant         | Cloud Run ephemeral containers (europe-north1) + Groq inference | Yes             | Yes                | ~€20-50/mo   |
| 3 — Persistent Containers | Scale (€50k+ MRR)               | Persistent containers + gVisor/Firecracker per tenant           | Yes + audit log | Yes                | €200+/mo     |

**`SANDBOX_STAGE` values:** `1` (SDK sandbox) | `opensandbox` (Acer Veriton) | `2` (Cloud Run) | `3` (persistent)

### 14.2 Stage 1: Anthropic SDK Native Sandbox

**Implementation:** `src/sandbox/sdk-sandbox.ts`

Uses Anthropic Agent SDK's built-in OS-level primitives:

- **Linux:** bubblewrap (filesystem namespace isolation, network proxy)
- **macOS:** seatbelt (sandbox profiles)

**Controls applied per tenant:**

| Control              | Enforcement                                                                                        |
| -------------------- | -------------------------------------------------------------------------------------------------- |
| Filesystem isolation | Agent can only access `/workspace/tenant-{tenantId}`                                               |
| System path denial   | `/etc/shadow`, `/root`, `/home`, `/var/run/docker.sock`, `/proc/1` explicitly denied               |
| Network isolation    | Deny-by-default egress; only allow-listed domains reachable                                        |
| Allowed domains      | `api.anthropic.com`, `api.groq.com`, `mcp-hub.dws10.com`, `api.dws10.com`, tenant Supabase project |
| Wildcard prohibition | No `*` domain patterns permitted (NIS2 least-privilege)                                            |

**NIS2 compliance validation:** `validateNIS2Compliance()` checks all sandbox configs before agent execution. Violations block execution.

### 14.3 Stage 2: Cloud Run Ephemeral Containers

**Implementation:** `src/sandbox/cloudrun-ephemeral.ts`

Each agent task executes in a dedicated Cloud Run Job:

1. **Create** — New container per task with tenant-specific environment
2. **Execute** — Agent runs with Groq inference (Llama 3.3 70B) inside the container
3. **Collect** — Results written to Supabase `agent_executions` table
4. **Destroy** — Container and all associated data deleted post-task

**Security properties:**

| Property                  | How Enforced                                               |
| ------------------------- | ---------------------------------------------------------- |
| Tenant isolation          | One container per task — no shared process space           |
| Data residency            | `europe-north1` (Finland) region lock                      |
| No cross-tenant data path | Containers destroyed post-task; no persistent filesystem   |
| Secret management         | GCP Secret Manager (not env vars) for API keys             |
| Network egress            | VPC connector with egress policy (optional)                |
| Service identity          | Dedicated `agent-runner@` service account with minimal IAM |

**NIS2 audit statement:**

> "Each DWS IQ 6 agent task runs in an ephemeral Cloud Run container in europe-north1. Containers are destroyed post-task. Anthropic Agent SDK native sandboxing provides filesystem and network isolation within the container. No cross-tenant data path exists by architecture, not by policy."

### 14.4 Stage Selection

The isolation stage is selected via `SANDBOX_STAGE` environment variable:

| Value         | Stage        | Backend                                  |
| ------------- | ------------ | ---------------------------------------- |
| `1`           | SDK Sandbox  | Anthropic Agent SDK bubblewrap/seatbelt  |
| `opensandbox` | Acer Veriton | OpenSandbox Docker (local hardware)      |
| `2`           | Cloud Run    | Ephemeral containers (europe-north1)     |
| `3`           | Persistent   | gVisor/Firecracker (not yet implemented) |

The unified factory (`src/sandbox/index.ts`) routes agent execution to the appropriate backend.

### 14.6 Stage 1.5: OpenSandbox on Acer Veriton

**Introduced:** 2026-03-01 | **Session:** `claude/sandbox-agents-opensandbox-HatfC`

**Implementation:** `src/sandbox/opensandbox.ts` | **MCP:** `mcp-hub/services/opensandbox_mcp.py`

**Hardware:** Acer Veriton business desktop running Docker + OpenSandbox server.
**Activate:** Set `SANDBOX_STAGE=opensandbox` and `OPENSANDBOX_HOST=http://<veriton-ip>:8080`.

**Use cases:**

- EU air-gapped data scenarios (agent data never leaves the Veriton)
- Internal pilot testing with real Docker isolation at €0 cloud cost
- Offline / disconnected environments (edge AI)
- Development and QA with full container isolation before Cloud Run promotion

**Security properties:**

| Property                | How Enforced                                                     |
| ----------------------- | ---------------------------------------------------------------- |
| Filesystem isolation    | Each agent task in a dedicated ephemeral container               |
| Network egress          | Deny-by-default; only allow-listed domains reachable             |
| Data residency          | Stays on Acer Veriton hardware (EU, on-premises)                 |
| Ephemeral by design     | Container destroyed after each agent task                        |
| No cross-task data path | New container per execution; no persistent filesystem            |
| Cross-agent privilege   | `file_access_control.py` protects config paths from agent writes |

**MCP tools exposed via `/sandbox/*`:**

| Endpoint              | Method | Tool                                      |
| --------------------- | ------ | ----------------------------------------- |
| `/sandbox/ping`       | GET    | Health check Veriton connectivity         |
| `/sandbox/create`     | POST   | Create isolated Docker container          |
| `/sandbox/execute`    | POST   | Run shell command in sandbox              |
| `/sandbox/file/read`  | POST   | Read file from sandbox filesystem         |
| `/sandbox/file/write` | POST   | Write files to sandbox filesystem         |
| `/sandbox/destroy`    | POST   | Destroy sandbox and release resources     |
| `/sandbox/tools`      | GET    | MCP tools/list (JSON schema of all tools) |

**Environment variables required:**

```
SANDBOX_STAGE=opensandbox
OPENSANDBOX_HOST=http://192.168.1.X:8080    # Acer Veriton IP
OPENSANDBOX_API_KEY=<optional>               # Server auth token
OPENSANDBOX_IMAGE=opensandbox/code-interpreter:v1.0.1
OPENSANDBOX_TIMEOUT_MS=300000
```

**NIS2 audit statement:**

> "OpenSandbox Stage 1.5 executes each DWS IQ agent task in an ephemeral Docker container on the Acer Veriton edge node. Containers are destroyed post-task. Network egress is deny-by-default with an explicit domain allow-list. No cross-task data path exists by architecture. Data residency is enforced at hardware level — agent data never leaves the Veriton."

**OpenSandbox server setup on Acer Veriton:**

```bash
pip install opensandbox-server
opensandbox-server init-config ~/.sandbox.toml --example docker
opensandbox-server   # listens on :8080
```

### 14.7 Governance Integration

Sandbox isolation integrates with the existing governance engine (`src/agents/base.agent.ts`):

- **`buildSandboxContext()`** attaches isolation metadata to `AgentContext` before execution
- **Governance policies** (rate-limit, cost-limit, data-boundary) evaluate against sandbox context
- **Audit logging** records sandbox stage, tier, and allowed paths/domains per execution

---

## 15. Review and Update Schedule

| Review Type                              | Frequency   | Next Date                            | Owner                 |
| ---------------------------------------- | ----------- | ------------------------------------ | --------------------- |
| Full standard review                     | Semi-annual | August 2026 (aligned with EU AI Act) | Security + Compliance |
| If-then commitment register              | Quarterly   | April 2026                           | Security              |
| Risk classification update               | Quarterly   | April 2026                           | Security              |
| Evaluation gap assessment                | Quarterly   | April 2026                           | Engineering           |
| Metrics review                           | Monthly     | March 2026                           | Security              |
| Incident-triggered update                | As needed   | Per incident                         | Security              |
| International AI Safety Report alignment | Annual      | February 2027                        | Compliance            |

---

## 16. Agent Event-Driven Architecture Security

_Added: 2026-02-24 | Session: claude/modernize-dws7-77v2B_

The DWS7 agent modernization introduces an event-driven architecture where agents emit events, subscribe to patterns, and trigger workflows. This creates new attack surfaces that must be controlled.

### 16.1 Event Bus Security Model

| Concern              | Control                               | Implementation                                                         |
| -------------------- | ------------------------------------- | ---------------------------------------------------------------------- |
| Event injection      | Only authenticated agents emit events | `eventBus.emit()` requires `AgentContext` with valid `orgId`           |
| Event interception   | In-process bus (no network exposure)  | `src/agents/event-bus.ts` — singleton, no external listener            |
| Event persistence    | Redis Streams with auth token         | Upstash REST API with `UPSTASH_REDIS_REST_TOKEN`                       |
| Event flooding       | Rate limiting per agent per org       | Governance engine `rate-limit` policy applies to event-emitting agents |
| Cross-tenant leakage | Events keyed by `orgId`               | Redis stream key: `dws:events:{orgId}` — tenant isolation              |

**Event Schema (mandatory fields):**

```typescript
{
  type: string; // Dot-notation: "compliance.gap_detected"
  source: string; // "agent:{agentName}" — provenance tracking
  payload: object; // Must NOT contain PII or secrets
  priority: string; // low | normal | high | critical
  orgId: string; // Tenant isolation key
  sessionId: string; // Trace correlation
  timestamp: string; // ISO 8601 — Article 12 audit trail
}
```

**Payload restrictions:**

- **NEVER** include API keys, tokens, or credentials in event payloads
- **NEVER** include customer PII (names, emails, addresses) — use opaque IDs
- Events with `priority: "critical"` are logged to Supabase `governance_audit` table
- All events retained for Article 12 compliance (minimum 5 years per EU AI Act)

### 16.2 Agent Delegation Security

Agents can delegate to other agents mid-execution via the `delegate_to_agent` tool. This creates a delegation chain that must be bounded:

| Control                 | Value                 | Rationale                                                     |
| ----------------------- | --------------------- | ------------------------------------------------------------- |
| Max delegation depth    | 5                     | Prevents infinite loops (A→B→A→B...)                          |
| Depth tracking          | Per session per agent | `activeDelegations` map in AgentRegistry                      |
| Cross-tenant delegation | Blocked               | Delegated agent inherits caller's `AgentContext.orgId`        |
| Governance inheritance  | Yes                   | Delegated agent runs under same governance policies as caller |
| Execution logging       | Both agents           | Caller logs delegation start; delegatee logs full execution   |

**Delegation depth exceeded response:**

```json
{
  "agentName": "compliance",
  "confidence": 0,
  "reasoning": "Delegation depth limit (5) reached",
  "result": { "error": "Delegation depth limit reached" }
}
```

### 16.3 Workflow Execution Security

Multi-agent workflows (`src/agents/workflows.ts`) chain agent executions:

- **Timeout enforcement:** Every workflow has `timeoutMs` (default: 5 minutes, max: 10 minutes)
- **Step isolation:** Each step runs with the caller's `AgentContext` — no privilege escalation
- **Parallel step blast radius:** If one parallel agent fails, others complete; failure is reported per-step
- **Workflow registry:** Only predefined workflows in `WORKFLOW_REGISTRY` can execute — no arbitrary chaining via API
- **Audit trail:** Workflow start/complete/fail events emitted to event bus with full step results

### 16.4 Tool Execution Security (SSRF Protection)

The `fetch_external` tool allows agents to call external APIs. SSRF is prevented by:

| Layer                    | Control                                                                                              |
| ------------------------ | ---------------------------------------------------------------------------------------------------- |
| **Static allowlist**     | Hardcoded in `src/agents/tools.ts`: `carbonintensity.org.uk`, `ec.europa.eu`, `data.europa.eu`, etc. |
| **Tenant allowlist**     | `context.sandbox.allowedDomains` from sandbox configuration                                          |
| **Protocol enforcement** | Only HTTPS — HTTP requests rejected                                                                  |
| **URL validation**       | `new URL()` parsing before any fetch — prevents SSRF via malformed URLs                              |
| **Response truncation**  | Responses capped at 10,000 characters — prevents memory exhaustion                                   |

**Adding domains to the allowlist:**

1. Submit PR to `src/agents/tools.ts` modifying `FETCH_ALLOWLIST`
2. Security review required (label: `security-review`)
3. Domain must serve public data (no auth-gated endpoints via agent tool)

---

## 17. MCP Tool Approval & Versioning

_Added: 2026-02-24 | Session: claude/modernize-dws7-77v2B_

The MCP Agent Server (`/mcp` endpoint) exposes all registered agents as callable tools. External ADEs (Claude Code, Cursor, Codex) can invoke agents via MCP protocol.

### 17.1 MCP Tool Security Model

| Concern             | Control                                                                                      |
| ------------------- | -------------------------------------------------------------------------------------------- |
| Unauthorized access | JWT auth on Express routes; MCP requests extract `userId`/`orgId` from JWT                   |
| Tool injection      | Tool list generated from `agentRegistry.listAgents()` — no dynamic tool registration via MCP |
| Tool impersonation  | Tool names prefixed with `dws_` — collision with external tools prevented                    |
| Rate limiting       | Express rate limiter: 30 requests/minute per IP on agent endpoints                           |
| Data exfiltration   | Agent responses filtered through `AgentResponse` type — no raw database access               |

### 17.2 MCP Tool Inventory

All tools exposed via MCP `tools/list`:

| Tool Name                     | Type  | Risk Level      | Auth Required                         |
| ----------------------------- | ----- | --------------- | ------------------------------------- |
| `dws_list_agents`             | Meta  | Low             | JWT                                   |
| `dws_discover`                | Meta  | Low             | JWT                                   |
| `dws_workflow`                | Meta  | Medium          | JWT + workflow must exist in registry |
| `dws_events`                  | Meta  | Low             | JWT                                   |
| `dws_compliance`              | Agent | Medium          | JWT + governance policies             |
| `dws_sitesense`               | Agent | Low             | JWT                                   |
| `dws_material_oracle`         | Agent | Low             | JWT                                   |
| `dws_schedule_genius`         | Agent | Low             | JWT                                   |
| `dws_viability`               | Agent | Low             | JWT                                   |
| `dws_customer_sat`            | Agent | Low             | JWT                                   |
| `dws_emissions_data_analyst`  | Agent | Medium          | JWT                                   |
| `dws_compliance_researcher`   | Agent | Medium          | JWT                                   |
| `dws_sales_outreach`          | Agent | Medium (Tier 2) | JWT + approval gate                   |
| `dws_construction`            | Agent | Medium (Tier 2) | JWT + governance                      |
| `dws_logistics`               | Agent | Medium (Tier 2) | JWT + governance                      |
| `dws_deepwiki_extractor`      | Agent | Low (Tier 1)    | JWT                                   |
| `dws_quality_gate`            | Agent | Low             | JWT                                   |
| `dws_keyword_intent`          | Agent | Low             | JWT                                   |
| `dws_competitor_surveillance` | Agent | Low             | JWT                                   |
| `dws_content_brief`           | Agent | Low             | JWT                                   |
| `dws_seo_audit`               | Agent | Low             | JWT                                   |
| `dws_lead_feedback`           | Agent | Low             | JWT                                   |

### 17.3 MCP Tool Versioning

- **Protocol version:** `2024-11-05` (returned in `initialize` response)
- **Server version:** `7.0.0` (returned in `initialize` and `/mcp/health`)
- **Tool versioning:** Tools inherit agent version; breaking changes require new agent name
- **Deprecation policy:** Deprecated tools remain available for 90 days with warning in description
- **Breaking change notification:** `tools/list_changed` capability enabled — clients notified on tool updates

### 17.4 Local MCP Server Ban (Post-Clawdbot — 2026-03-26)

> **PERMANENT SECURITY RULE.** This section documents the permanent ban on local MCP servers following the clawdbot security incident.

**Incident summary:** Malicious MCP server processes running locally on developer workstation were used as a C2 (command and control) channel. The attack vector exploited `.mcp.json` auto-discovery to inject unauthorized tool calls.

**Permanent rules:**

| Rule                                     | Scope                                         | Enforcement                                                                          |
| ---------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------ |
| **No local MCP servers on workstations** | All users (developers + enterprise customers) | `.mcp.json` removed; CLI connects to Cloud Run `/mcp` only                           |
| **No community MCP skill auto-install**  | All environments                              | Manual approval required; no registry auto-pull                                      |
| **No Docker on customer workstations**   | Enterprise customers                          | All services run on Cloud Run (Tier 2a) or customer K8s (Tier 2b)                    |
| **MCP only via Cloud Run**               | Production                                    | All MCP tool calls routed through `dws6run6/mcp` or `mcp-gateway` Cloud Run services |
| **Edge MCP via GDX Spark only**          | Field deployments                             | Edge device with KYA governance; no ad-hoc local MCP                                 |

**Allowed exceptions (DWS core team only):**

- Local MCP for development with explicit risk acceptance documented in PR
- CI/CD pipeline MCP for automated testing (ephemeral, no persistent state)

**Detection:** Monitor for unauthorized `.mcp.json` files via pre-commit hooks and `git status` checks in session startup.

**See also:** AGENTS.md Section 20 (Deployment Architecture), CLAUDE.md Email Rules (Resend ban from same incident).

### 17.5 Infrastructure Sovereignty Rule (CLOUD Act — 2026-03-26)

> **PERMANENT SECURITY RULE.** DWS production services MUST run on EU-owned infrastructure. US CLOUD Act (2018) allows US courts to compel US-owned companies to hand over data regardless of server location.

**The rule:** No US-owned cloud provider (Google, AWS, Azure) for DWS production customer data. EU hosting on US cloud is NOT sovereign.

| Status                      | Provider                  | CLOUD Act Exposure                   | DWS Policy                                                                                                                          |
| --------------------------- | ------------------------- | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Approved (EU-sovereign)** | Scaleway (French, Iliad)  | None                                 | **DWS IQ 6**: Serverless containers, multi-tenant SaaS                                                                              |
| **Approved (EU-sovereign)** | UpCloud (Finnish, Tesi)   | None                                 | **Aegis**: Managed K8s (UKS) + Helm, Helsinki DC, single-tenant enterprise                                                          |
| **Approved (EU-sovereign)** | Clever Cloud (French)     | None                                 | Alternative PaaS                                                                                                                    |
| **Approved (EU-sovereign)** | OVHcloud (French, public) | None                                 | K8s workloads                                                                                                                       |
| **Approved (EU-sovereign)** | Hetzner (German, family)  | None                                 | VMs, DB hosting, Aiven infra                                                                                                        |
| **Approved (EU-sovereign)** | STACKIT (German, Schwarz) | None                                 | Enterprise K8s (German market)                                                                                                      |
| **Transitional**            | Google Cloud Run          | Yes (US-owned)                       | Dev + early production only. Migrate to DWS IQ 6 (Scaleway) or Aegis (UpCloud).                                                     |
| **Banned**                  | AWS, Azure                | Yes (US-owned)                       | Never use for DWS services                                                                                                          |
| **Approved (exception)**    | Aiven (Finnish, US VC)    | Unclear (US investors), on GCP infra | **DWS IQ 6 (dws6.com)**: Managed PostgreSQL DB layer, `google-europe-north1`. Explicit sovereignty exception — see rationale below. |
| **Dead**                    | Nebula / Telia Cloud 9    | N/A (dissolved Oct 2023)             | Not an option                                                                                                                       |

**Migration timeline:** See `docs/DEPLOYMENT_ARCHITECTURE_ENTERPRISE.md` for the phased migration plan. (Corrected 2026-07-02 — this previously pointed to "AGENTS.md Section 20," which does not exist; AGENTS.md tops out at Section 8.)

**Enforcement:** New services MUST target EU-sovereign providers. Existing Google Cloud Run services migrate per the phased plan. Any new GCP service creation requires explicit sovereignty exception documented in PR.

**Aiven row — resolved 2026-07-02 (founder decision, supabase/aiven audit):** This table previously read "DB layer on Hetzner infra only" for Aiven, but Aiven does not offer Hetzner as a deployable cloud region — its supported infrastructure providers are AWS, Google Cloud, Azure, OVHcloud, Oracle Cloud, Exoscale, and UpCloud ([Aiven — Available cloud regions](https://aiven.io/docs/platform/reference/list_of_clouds)); that condition was unsatisfiable as written. The founder decided to approve Aiven's own `google-europe-north1` region for the DWS IQ 6 (dws6.com) database layer instead, under the Enforcement clause's existing "explicit sovereignty exception documented" carve-out.

**Residual risk, recorded rather than hidden:** this is a deliberate exception, not a "None" CLOUD Act rating. Two layers of exposure remain and are accepted, not resolved:

1. Aiven itself is US-VC-backed, which is exactly why it carried the "Yellow flag" in the first place — that ownership question is still "unclear," not cleared.
2. The underlying infrastructure is Google Cloud, which this same table classifies as only **"Transitional"** for DWS's own compute (Cloud Run) — approved for dev/early-production only, with an active plan to migrate _away_ from it. This exception now runs the database, which holds all customer data, on infrastructure the standard otherwise treats as temporary.

No script changes were needed: `scripts/aiven-vault-bootstrap.sh` and `mcp-hub/config/aiven-mcp.json` already default to `google-europe-north1`, so they are in compliance with this exception as-is. If the underlying Cloud Run migration-away plan (Scaleway/UpCloud) completes, revisit whether the DB layer should follow rather than being left as the last GCP-resident piece.

---

## 18. References

**External standards and research:**

- [International AI Safety Report 2026](https://internationalaisafetyreport.org/publication/international-ai-safety-report-2026) — Bengio et al.
- [OECD 2026: Exploring Possible AI Trajectories through 2030](https://internationalaisafetyreport.org/publication/international-ai-safety-report-2026) — Scenario analysis

---

## 15. API Middleware Security Controls (MVP)

Added: 07.03.2026 | Session: claude/implement-mvp-features-D2e9d

### 15.1 Centralized Error Handler Security

All API errors MUST flow through the centralized error handler (`src/middleware/error-handler.ts`). Direct `res.status().json()` in route handlers is prohibited for new code.

| Rule                                    | Enforcement                                                 |
| --------------------------------------- | ----------------------------------------------------------- |
| Never expose stack traces in production | `errorHandler` strips `stack` unless `NODE_ENV=development` |
| Never expose database schema in errors  | `AppError.isOperational` gates user-facing messages         |
| Consistent error response shape         | All errors return `{ error, message, code, correlationId }` |
| Log all 5xx errors with full context    | `logger.error()` with path, method, correlationId           |
| 4xx errors logged as warnings only      | Avoid log noise from client errors                          |

### 15.2 Request Validation at API Boundary

All incoming requests MUST be validated using Zod schemas via `validate()` middleware before reaching business logic.

```typescript
// CORRECT: Validate first, then handle
router.post("/assess", validate({ body: AssessmentSchema }), handler);

// WRONG: Parse body inside handler
router.post("/assess", (req, res) => {
  const data = req.body; /* untrusted */
});
```

**Middleware ordering (MANDATORY for all routes):**

1. `correlationId` — attach trace ID
2. `helmet` — security headers
3. `cors` — origin validation
4. `rateLimit` — abuse prevention
5. `validate({ body, query, params })` — Zod schema validation
6. `authenticateToken` — JWT verification
7. Route handler
8. `notFoundHandler` — catch unmatched routes
9. `errorHandler` — final error catch

### 15.3 Correlation ID for Security Audits

Every request receives a `X-Correlation-ID` header (client-provided or auto-generated UUID). This ID:

- Appears in all log entries for the request
- Is returned in error responses
- Enables tracing a single request across services
- MUST be preserved in Article 12 audit logs

### 15.4 Startup Environment Validation

The server MUST validate all required environment variables on boot using `validateEnv()`. Missing or malformed variables cause immediate process exit with a clear error listing all issues.

**Required variables (fail if missing):** `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `JWT_SECRET` (min 16 chars)

### 15.5 Health Check Endpoint Security

The `/health` endpoint exposes service availability status. Security rules:

- MUST NOT expose secrets, API keys, or internal URLs
- MUST NOT expose exact software versions beyond major version
- Memory stats are rounded to MB (no byte-level precision)
- Rate limited under the general `/api/` limiter

### 15.6 Compliance Engine API Security

The compliance API (`/api/v1/compliance/*`) handles sensitive corporate data:

- Assessment results contain industry, emissions, and regulatory gap data
- RLS policies on `compliance_profiles`, `esrs_data_points`, `compliance_assessments` tables restrict access to organization members only
- Report IDs are non-sequential (UUID + timestamp) to prevent enumeration
- No `SECURITY DEFINER` functions in compliance migration

---

- [EU AI Act](https://eur-lex.europa.eu/eli/reg/2024/1689/oj) — Regulation (EU) 2024/1689
- [NIS2 Directive](https://eur-lex.europa.eu/eli/dir/2022/2555/oj) — Directive (EU) 2022/2555
- [OWASP Top 10 for LLM Applications 2025](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
- Simon Willison's LLM Security Research (referenced in README_SECURITY.md)
- [MITRE ATLAS](https://atlas.mitre.org/) — AI Threat Landscape
- [W3C Subresource Integrity](https://www.w3.org/TR/SRI/) — SRI specification
- [Cisco: OpenClaw Skills Security Analysis](https://blog.cloudflare.com/moltworker-self-hosted-ai-agent/) — Third-party skill exfiltration findings
- [OpenClaw GitHub](https://github.com/pspdfkit/openclaw) — 180k+ stars, community skills registry

**Internal DWS documents:**

- DWS Document Standard v1.3 (DWS_DOCUMENT_STANDARD.md)
- Gamma Brand Standard v2.0 (UI_SKILLS_GAMMA.md)
- Firehorse Master Thesis EN (dws10.com/docs/PHD_FIREHORSE_EN.md)
- Firehorse Pro Gradu FI (dws10.com/docs/PHD_FIREHORSE_FI.md)
- Admin Manual: Authentication v1.3 (ADMIN_MANUAL_AUTHENTICATION.md)
- Admin Manual: Supabase (ADMIN_MANUAL_SUPABASE_EN_v1.md)
- Admin Manual: DWS6.com (ADMIN_MANUAL_DWS6_COM.md)
- DWS Field Note: AI Safety Report 2026 (docs/field-notes/2026-02-06-ai-safety-report-2026-field-note.md)
- DWS Vulnerability Assessment: OpenClaw/DWS6 (docs/field-notes/2026-02-21-security-vulnerability-assessment-openclaw-dws6.md)
- DWS Field Note: Moltworker/OpenClaw Evaluation (docs/field-notes/2026-02-15-moltworker-openclaw-dws-assistant.md)

---

---

## 16. MVP Security Controls

Added: 08.03.2026 | Session: claude/build-mvp-features-nFk7k

### 16.0 Database Persistence (Migration 043)

All MVP features persist to Supabase PostgreSQL with graceful in-memory fallback.

**Migration:** `supabase/migrations/043_mvp_api_keys_usage_schedules.sql`
**Shared client:** `src/config/supabase.ts` (service_role key, singleton)

| Table              | RLS              | Policies                                      | Purpose                  |
| ------------------ | ---------------- | --------------------------------------------- | ------------------------ |
| `api_keys`         | Enabled + Forced | service_role full; authenticated own-row only | API key storage (hashed) |
| `usage_events`     | Enabled + Forced | service_role full; authenticated read-own     | Append-only event log    |
| `usage_counters`   | Enabled + Forced | service_role full; authenticated read-own     | Monthly usage aggregates |
| `report_schedules` | Enabled + Forced | service_role full; authenticated own-row only | Recurring report config  |

**Atomic counter increment:** `increment_usage_counter()` — `SECURITY DEFINER` function with service_role caller guard. Uses `INSERT ... ON CONFLICT DO UPDATE` for race-free counter updates.

**Fallback pattern:** Every service method checks `getSupabaseClient()`. If null (credentials missing), operations use in-memory Maps. This ensures development/testing works without a database.

### 16.1 API Key Management Security

**Implementation:** `src/services/api-key.service.ts`, `src/routes/api-keys.routes.ts`

| Control                  | Implementation                                                                   |
| ------------------------ | -------------------------------------------------------------------------------- |
| Key generation           | Cryptographically secure: `crypto.randomBytes(16)` → `dws_live_<32hex>`          |
| Key storage              | SHA-256 hash only — raw key returned once at creation, never stored              |
| Key prefix               | First 12 chars stored for UI display (e.g., `dws_live_a3b1****`)                 |
| Per-user limit           | Maximum 10 active keys per user (prevents key sprawl)                            |
| Scope-based access       | Keys carry scopes: `compliance:read`, `assistant:write`, `reports:export`, etc.  |
| Expiry support           | Optional TTL (1–365 days), checked on every validation call                      |
| Soft revocation          | Keys are marked revoked (audit trail preserved), not deleted                     |
| Authentication           | All CRUD endpoints require JWT authentication via `authenticateToken` middleware |
| Constant-time validation | Full key store scan with hash comparison (prevents timing attacks)               |

**Endpoints:**

| Method | Path                        | Auth | Description                       |
| ------ | --------------------------- | ---- | --------------------------------- |
| POST   | `/api/v1/user/api-keys`     | JWT  | Create key (returns raw key once) |
| GET    | `/api/v1/user/api-keys`     | JWT  | List keys (hashes excluded)       |
| DELETE | `/api/v1/user/api-keys/:id` | JWT  | Revoke key (soft delete)          |

### 16.2 Usage Metering Security

**Implementation:** `src/services/usage-metering.service.ts`, `src/middleware/usage-tracking.middleware.ts`

| Control               | Implementation                                                         |
| --------------------- | ---------------------------------------------------------------------- |
| Tier enforcement      | Three tiers (Free/Pro/Enterprise) with monthly call limits             |
| Rate limiting         | Per-endpoint via `trackUsage()` middleware — returns 429 when exceeded |
| Non-blocking tracking | Metering failures never block the request (graceful degradation)       |
| Admin-only aggregates | Platform-wide stats require `admin` or `owner` role                    |
| Usage headers         | `X-Usage-Remaining` and `X-Usage-Limit` on every metered response      |

**Tier Limits:**

| Tier       | API Calls/mo | Assistant Messages/mo | Report Exports/mo |
| ---------- | ------------ | --------------------- | ----------------- |
| Free       | 100          | 20                    | 2                 |
| Pro        | 5,000        | 500                   | 50                |
| Enterprise | 100,000      | 10,000                | 500               |

### 16.3 Report Export Security

**Implementation:** `src/services/report-export.service.ts`, `src/routes/report-export.routes.ts`

| Control            | Implementation                                                                 |
| ------------------ | ------------------------------------------------------------------------------ |
| Authentication     | JWT required for all export/schedule operations                                |
| Usage gating       | Report exports count against tier limits (429 if exceeded)                     |
| Input validation   | Zod schemas for export and schedule requests                                   |
| Download headers   | `Content-Disposition: attachment` forces download (prevents browser rendering) |
| Schedule ownership | Users can only view/modify their own schedules                                 |
| Email validation   | Schedule recipient email validated with `z.string().email()`                   |
| Format restriction | Only `json` and `csv` formats allowed (no arbitrary file generation)           |

---

## 17. Database Disaster Recovery Security

### 17.1 Dual-Database Architecture

| Control                  | Implementation                                                                                                                                      |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Primary database         | Supabase `dws6-production` (EU, europe-north1) with RLS on all tables                                                                               |
| Warm standby             | Aiven PostgreSQL `dws-test` (EU, Finland) — daily mirror from Supabase                                                                              |
| Auth stub isolation      | Aiven uses `auth.uid()` / `auth.jwt()` / `auth.role()` stubs returning dummy values — RLS policies load but do not enforce (acceptable for sandbox) |
| Backup encryption        | All backup dumps encrypted with GPG symmetric encryption (`BACKUP_GPG_PASSPHRASE`)                                                                  |
| 4-destination redundancy | Local disk + Proton Drive + Acer Veriton Helsinki + GitHub Actions artifacts                                                                        |

### 17.2 Recovery Scripts Security Controls

| Control                | Script              | Implementation                                                        |
| ---------------------- | ------------------- | --------------------------------------------------------------------- |
| Credential isolation   | `db-recovery.sh`    | Loads credentials from `.env` only — never hardcoded                  |
| Connection validation  | `db-recovery.sh`    | Tests connection before applying any changes                          |
| Dry-run mode           | `db-recovery.sh`    | `--dry-run` previews all actions without database changes             |
| GPG decryption         | `db-recovery.sh`    | Automatic decryption of `.gpg` backup files with passphrase from env  |
| Integrity verification | `db-backup-test.sh` | Row count comparison between source and target after restore          |
| RLS verification       | `db-recovery.sh`    | Checks RLS enabled on all MVP tables post-recovery                    |
| Function verification  | `db-recovery.sh`    | Verifies `increment_usage_counter()` SECURITY DEFINER function exists |

### 17.3 RTO/RPO Targets

| Scenario                         | RTO          | RPO                     |
| -------------------------------- | ------------ | ----------------------- |
| Schema rebuild (migrations only) | < 5 minutes  | N/A (schema from git)   |
| Full restore (schema + data)     | < 15 minutes | 24 hours (daily backup) |
| Aiven warm standby switchover    | < 5 minutes  | 24 hours (daily mirror) |

### 17.4 Security Requirements for Recovery

- Recovery scripts MUST NOT be run with `--skip-migrations` and `--restore-dump` simultaneously without understanding the implications
- GPG passphrase MUST be stored in `.env` (never in script arguments visible in process list)
- After recovery, verify RLS is enabled on all tables before routing production traffic
- Aiven stubs make RLS effectively open — never route real customer traffic to Aiven without proper auth integration
- Document all recovery events in `docs/field-notes/` with timestamp, operator, and verification results

---

## 18. Know Your Agent (KYA) & Bring Your Own (BYO) Agent Security

### 18.1 Overview

KYA extends traditional KYC/AML identity verification to autonomous agents operating within DWS IQ workspaces. BYO defines the secure onboarding process for external agents entering the ecosystem. Together they close the compliance gap between human identity verification and agent runtime behavior.

**Rationale:** In agent-native architectures, human identity is the entry point — not the risk surface. The agent's runtime behavior (egress, filesystem access, tool calls, token consumption) is the actual attack vector. No existing IDV/KYC framework addresses this.

### 18.2 KYA Trust Layers

| Layer                     | What It Verifies                                                  | Source                                    | Enforcement                             |
| ------------------------- | ----------------------------------------------------------------- | ----------------------------------------- | --------------------------------------- |
| **L1 — Human Identity**   | Real person behind the account (KYC/AML/IDV)                      | IDV provider API (e.g., Shufti Pro)       | Supabase Auth + IDV verification gate   |
| **L2 — Agent Provenance** | Where did the agent come from? (registry, custom build, fork)     | DWS Agent Registry + MCP `tools/list`     | Agent manifest required at registration |
| **L3 — Agent Capability** | What tools/APIs does the agent request access to?                 | MCP tool manifest, sandbox policy engine  | MCP Tool Approval (Section 17)          |
| **L4 — Runtime Behavior** | What is the agent actually doing? (egress, file I/O, token usage) | Sandbox telemetry (Stage 1–3, Section 14) | Real-time monitoring + rate limiting    |
| **L5 — Continuous Risk**  | Has the user's or agent's risk profile changed?                   | IDV provider webhooks + DWS event bus     | Dynamic sandbox permission adjustment   |

### 18.3 KYA Trust Score — Agent Trust Score (ATS) Engine

**Formula (weighted deduction from perfect score):**

```
ATS = max(0, 1.0 - V×0.25 - L - D×0.05)

Where:
  V = KYA_VIOLATION count (from Firehorse telemetry)
  L = 0.10 if avg_latency > 500ms, else 0
  D = DENIED path access attempts count

Hard kill: ATS = 0.0 if manifest is unsigned or TTL expired
```

**Implementation:** `src/identity/ats-engine.ts` — evaluated BEFORE external IDV calls (Shufti Pro) to save API cost on low-trust sessions.

| ATS (normalized) | KYA Score | Permission Level | Sandbox State                                                 | Decision         |
| ---------------- | --------- | ---------------- | ------------------------------------------------------------- | ---------------- |
| >= 0.80          | >= 80     | Full             | All MCP tools, egress allowed, read-write filesystem          | **GO**           |
| 0.50–0.79        | 50–79     | Restricted       | No egress, read-only filesystem, curated MCP tools only       | **GO** (limited) |
| < 0.50           | < 50      | Suspended        | Sandbox paused, human review required before resumption       | **NO_GO**        |
| 0.00             | 0         | Frozen           | Account frozen, agent terminated immediately, incident logged | **NO_GO**        |

**Score recalculation triggers:** IDV webhook, agent tool request outside manifest, anomalous egress pattern, rate limit breach, manual operator override.

**Fault Attribution:** When ATS drops below threshold, the fault is classified (`LOGIC_FAULT`, `INTEGRATION_FAULT`, `MANIFEST_FAULT`, `OPERATOR_FAULT`, `AUTORESEARCH_FAULT`) and stored in Supabase `kya_fault_attribution` (separate from Firehorse). See `Legal/KYA_SECURITY_v1.2.md` §9.4 (base classes) and `Legal/KYA_OPTIMIZATION_v1.4.md` §4.2 (AUTORESEARCH_FAULT).

### 18.4 BYO Agent Registration Gates

| Gate                         | Requirement                                                                                                                                                                                          | Enforcement                                                                                                                  |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **G1 — Manifest**            | Agent manifest submitted (name, version, tool requirements, source URL)                                                                                                                              | DWS Agent Registry API                                                                                                       |
| **G2 — Identity Binding**    | Agent bound to a verified human identity (KYA L1 pass required)                                                                                                                                      | IDV verification must be PASSED before agent registration                                                                    |
| **G3 — Capability Review**   | Requested MCP tools reviewed against org policy                                                                                                                                                      | MCP Tool Approval workflow (Section 17)                                                                                      |
| **G4 — Sandbox Entry**       | Agent placed in isolated sandbox (Stage 1–3 based on tenant tier)                                                                                                                                    | Sandbox Isolation Architecture (Section 14)                                                                                  |
| **G5 — Runtime Monitoring**  | Continuous telemetry active: egress attempts, file writes, token consumption                                                                                                                         | KYA L4 telemetry pipeline                                                                                                    |
| **G6 — Dynamic Restriction** | If IDV risk score changes, sandbox permissions adjust in real-time                                                                                                                                   | KYA L5 webhook → event bus → sandbox policy engine                                                                           |
| **G7 — Spend Authority**     | Agent may sign/present an AP2/UCP/ACP payment mandate only within its ATS band, and only with a signed `spend_authority` block bound to the G2 verified human (`hic`) — no anonymous spend authority | `evaluateMandateGate()` (`src/identity/ats-engine.ts`); see `Legal/KYA_STANDARD_v1.md` §14, `Legal/KYA_SECURITY_v1.2.md` §12 |

**Critical rule:** No BYO agent may execute outside a sandbox. Sandbox stage selection follows Section 14 based on tenant tier. G7 composes with G2: spend authority always resolves to the same verified human identity G2 established — there is no separate identity path for commerce.

### 18.5 Partner Access Controls for IDV Providers

IDV providers (e.g., Shufti Pro) are treated as NIS2 sub-processors (Section 7.4) with additional controls:

| Control                 | Requirement                                                                                  |
| ----------------------- | -------------------------------------------------------------------------------------------- |
| API authentication      | OAuth 2.0 or API key with rotation policy (90 days max)                                      |
| Data minimization       | Only verification result + risk score transmitted — no raw biometric data stored in DWS      |
| Webhook verification    | All IDV webhooks signed and verified before processing                                       |
| Fallback                | If IDV provider is unreachable, new agent deployments blocked (fail-closed)                  |
| Audit logging           | All IDV API calls logged with correlation ID to agent session                                |
| Data residency          | IDV provider must process EU citizen data within EU (GDPR Art. 44–49)                        |
| Sub-processor agreement | DPA (Data Processing Agreement) required before production use                               |
| ML training prohibition | IDV provider must not use customer biometric data for model training (DPA addendum Clause 6) |

**Shufti Pro sub-processor risk assessment (PR #768, 2026-04-02):**

Shufti Pro's own sub-processors (per DPA Annex II) include providers with elevated risk profiles. Under the EU-only addendum, these risks are mitigated but must be monitored:

| Shufti Sub-processor  | Risk          | Detail                                                                                                                                                                               | Mitigation                                                                                                         |
| --------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| TeleSign Corp (USA)   | HIGH          | noyb GDPR complaint (June 2023) with Belgian DPA — alleges secret profiling of mobile users via BICS. Potential fine up to 236M EUR. Case pending.                                   | Confirm TeleSign is either not used or EU-only routed under Lifetime Oy account. Monitor Belgian DPA ruling.       |
| Twilio/SendGrid (USA) | MODERATE-HIGH | Multiple incidents: Authy 33M phone numbers leaked (July 2024), 12K call records exposed (Sep 2024), 848K SendGrid records for sale (Apr 2025). Handles OTP + video recording (KYC). | EU-only addendum requires all processing in EEA. Twilio video KYC must route EU-only. Monitor class action status. |
| Cloudflare Inc. (USA) | MEDIUM        | Data Privacy Framework valid but fragile (Schrems III risk).                                                                                                                         | CDN/DDoS only — no biometric data. Acceptable risk.                                                                |
| IPStack/Idera (USA)   | LOW           | Privacy policy still references invalidated EU-US Privacy Shield. IP geolocation only.                                                                                               | Non-biometric. Confirm DPF replaces Privacy Shield.                                                                |

### 18.6 KYA Control Surfaces (CLI, HTTP, Webhook)

KYA is not purely a passive runtime — operators can read trust state and trigger terminations through three independently authenticated surfaces. All three converge on the same `terminateChain()` function in `src/identity/kya-engine.ts`, and all runs are audit-logged.

| Surface                                  | Path                                   | Auth                                                   | Use case                                                  | Audit field         |
| ---------------------------------------- | -------------------------------------- | ------------------------------------------------------ | --------------------------------------------------------- | ------------------- |
| **CLI** — `dws kya status <session_id>`  | `GET /api/v1/kya/status/:sessionId`    | `Bearer $DWS_API_TOKEN` or `x-admin-key` (timing-safe) | Read current ATS, identity binding, last verification     | `source: 'cli'`     |
| **CLI** — `dws kya snap <session_id>`    | `POST /api/v1/kya/snap`                | `Bearer $DWS_API_TOKEN` or `x-admin-key` (timing-safe) | TC-4 Leash Snap with forensic dump (DESTRUCTIVE)          | `source: 'cli'`     |
| **HTTP** — ops dashboard / incident tool | `POST /api/v1/kya/snap`                | `Bearer $DWS_API_TOKEN` (operator role)                | Kill switch from a human operator UI                      | `source: 'api'`     |
| **Webhook** — IDV provider → KYA bridge  | `/api/v1/kya/*` (`kya-webhook.routes`) | HMAC signature verification (Shufti Pro signing key)   | L5 continuous-risk trigger (identity revoked, new signal) | `source: 'webhook'` |

**CLI surface security rules:**

1. **Admin key comparison MUST be timing-safe.** `src/app.ts` uses `crypto.timingSafeEqual` on 256-byte padded buffers to prevent length/early-exit timing leaks. Any new auth path MUST do the same.
2. **Destructive operations require confirmation.** The CLI gates `kya snap` behind a TTY confirmation prompt; non-TTY callers MUST pass `--yes` explicitly. Dry-run (`--dry-run`) returns the same JSON shape without executing.
3. **Reason code is required** for audit traceability. Acceptable codes: `MANUAL_SNAP`, `TRUST_VIOLATION`, `POLICY_BREACH`, `IDENTITY_REVOKED`, `CONTAINMENT_BREACH`, `KILL_SWITCH`. Free-form strings are recorded but flagged for review.
4. **Forensic dumps MUST be retained** per `docs/KYA_BYO_LIFECYCLE.md` retention schedule. Operators cannot disable forensic dumps from the CLI; `forensicDump: true` is hard-coded in `src/app.ts`.
5. **`ADMIN_API_KEY` is a RED-zone secret.** Never commit, never log, rotate on role changes. Compromise of this key = full chain-termination authority. Treat as equivalent to DB service-role key.

**Operator-facing slash command:** `/kya` in `.claude/commands/kya.md` — wraps the CLI with additional safety gates (mandatory dry-run preview, session-ID retype for destructive calls). See `docs/DWS_SKILLS_GUIDE.md` §7.1.

### 18.7 NIS2 Compliance Statement

> "DWS IQ 6 extends identity verification beyond the human operator to the autonomous agents they deploy. The Know Your Agent (KYA) framework provides five-layer trust verification — from human KYC through agent provenance, capability review, runtime monitoring, and continuous risk assessment. All BYO agents execute in isolated sandboxes (Section 14) with permissions dynamically adjusted based on real-time IDV risk signals. Operators can trigger immediate chain termination through an audit-logged CLI surface (`dws kya snap`) backed by timing-safe admin-key auth and mandatory forensic dumps. This architecture ensures that no autonomous agent operates without auditable identity binding and continuous behavioral monitoring, exceeding NIS2 Article 21(2)(i) human resources and access control requirements."

---

## 19. Synthetic Data & Model Fine-Tuning Security

DWS IQ integrates NVIDIA NeMo DataDesigner to generate synthetic regulatory data for agent training. This pipeline introduces specific security controls to prevent data poisoning, model drift, and regulatory misrepresentation.

### 19.1 Synthetic Data Generation Controls

| Control               | Requirement                                                                                                                           | Enforcement                                      |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| Schema validation     | Every synthetic row MUST pass EU 2025/2547 regulatory logic validation before entering training set                                   | DataDesigner "LLM-as-a-Judge" gate               |
| Data provenance       | All synthetic datasets tagged with generation timestamp, schema version, and seed data hash                                           | Metadata header in every output batch            |
| No real PII in seeds  | Seed data for DataDesigner MUST be anonymized or fully synthetic — never real company data                                            | Pre-generation audit                             |
| Output isolation      | Synthetic training data stored separately from production data — never mixed into live compliance reports                             | Separate storage bucket with access controls     |
| Adversarial integrity | Synthetic anomalies (fraudulent MTCs, inconsistent emissions) MUST be labeled as synthetic — never presentable as real audit evidence | `synthetic: true` flag on every generated record |

### 19.2 Model Fine-Tuning Security

| Control                     | Requirement                                                                                                           |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Model provenance            | Fine-tuned models MUST track base model (e.g., Nemotron-3-8B), training dataset hash, and training date               |
| No external model injection | Only NVIDIA NIM-hosted models approved for fine-tuning — no community models without security review                  |
| Inference isolation         | Fine-tuned compliance models run in NVIDIA NIM containers with network isolation — no outbound calls during inference |
| Drift monitoring            | Agent accuracy benchmarked quarterly against known regulatory test cases — drift > 5% triggers retraining             |
| Rollback capability         | Previous model versions retained for 12 months — rollback within 1 hour if regression detected                        |

### 19.3 NIS2 Compliance Statement

> "DWS IQ's Synthetic Nervous System generates regulatory training data using NVIDIA NeMo DataDesigner under strict data provenance, schema validation, and adversarial integrity controls. All synthetic data is cryptographically tagged, isolated from production systems, and validated against EU regulatory logic before agent training. Fine-tuned models maintain full lineage tracking and rollback capability, ensuring compliance with NIS2 Article 21(2)(e) security in network and information systems acquisition, development and maintenance."

---

**Document Version:** 2.0
**Classification:** INTERNAL
**Owner:** Security Team (security@lifetime.fi)
**Approved by:** Risto Anton Päärni (DPO, dpo@lifetime.fi)
**Next Review:** August 2026

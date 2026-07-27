# DWS6 — Next-Prompt v2 bundle (redo-in-fresh-session prompts)

Generated 2026-07-26. 63 prompts from the REBASE + CODE buckets (branches too stale/tangled to rebase).
Each block is self-contained — paste into a NEW Claude Code session against current main.
PRIORITY: PR1453 = critical security (Dependabot RCE); PR1663 = time-sensitive funding (15.8/15.9); PR1283/1213 = security hardening.


---

# Redo of PR 1119 (source branch: claude/agent-queryable-docs-6xdAg)

Goal: agent-queryable DWS standards registry (list/get/section/search) via REST + MCP + CLI. Old PR was +1481 across 29 files incl. a filesystem reorg (moving standards into `/standards/`) — high-conflict after ~3 months; redo against current tree.

- `src/standards/`: lazy-loaded registry, explicit manifest (allowlist of queryable standards w/ stable IDs), hand-rolled H2 markdown parser (title, sections, slug-collision counters, YAML frontmatter, split out VERSION AND AGENT HISTORY), types.
- REST: `GET /api/standards`, `/:id`, `/:id/sections/:slug`, `/search?q=` (JWT-protected).
- MCP: `dws_list_standards`, `dws_get_standard`, `dws_get_standard_section`, `dws_search_standards`.
- CLI: `dws standards {list,get,section,search}` with `--role`.
- Vitest: parser + registry + manifest-integrity (files exist, unique IDs/paths).
- RECONSIDER the standards file move — verify current canonical locations before relocating; do not break CLAUDE.md Resolver paths. Keep manifest pointing at real current paths.

DWS constraints (CLAUDE.md): validate input; JWT auth intact; treat MCP output as untrusted; no secrets; surgical; Päärni identity. No thesis/public-site/pricing edits.

Commit on fresh `claude/<slug>` branch + open PR.


---

# Redo prompt — supersedes PR #1120 (head: claude/document-genai-conventions-bLd5y, ~3mo stale, 12 files)

Re-add the DWS GenAI (OpenTelemetry) Semantic Conventions standard fresh against CURRENT main (12-file branch is stale/conflicted).

Goal:
- Create `docs/DWS_GENAI_CONVENTIONS.md` (v1.0): required spans `invoke_agent` / `chat` / `execute_tool`, metrics `gen_ai.client.operation.duration` + `gen_ai.client.token.usage`, attributes, default-OFF content-capture policy, PR review checklist.
- Map spans to CURRENT `BaseAgent.runLoop` / `LLMClient.callLLM` / `executeTools` (re-read these first — signatures may have moved).
- Fix `prompt_tokens/completion_tokens` → `input_tokens/output_tokens` drift; cross-ref observability/observability.md Langfuse plan.
- Register the doc in the CLAUDE.md required-reading table only (minimal touch; skip the other 11 files unless still needed).

Key areas: `docs/`, `src/agents/**`, `src/mcp/**`. Load AI_AGENT_GUIDELINES.md.
Constraints (CLAUDE.md): doc-only (no runtime code changes); no secrets; do NOT touch thesis-lockstep files or public-site folders; VERSION block uses `***` delimiters.
Commit on a fresh `claude/dws-genai-conventions-v2` branch + open PR.


---

# Redo of PR 1123 (source branch: claude/dws-iq-product-audit-MTes2)

Goal: re-apply removal of 9 legal-liability claims from the product catalog against CURRENT products.json (old PR ~3 months stale; products.json is a hot file edited by other PRs — reapply cleanly, do not rebase blindly).

Claims to remove/qualify (verify each still present first):
- DWS-IQ-006: unsourced "90% reduction" → "Automates 15+ workflows"; agent count 18→38.
- LIFETIME-EXP-001: drop "40% cost reduction typical" (UCPD risk).
- secure-email-proton: drop "NIS2 & EU AI Act compliant"; fix DNS timeline.
- firehorse-coach + ai-koulutus-3d: "Article 4 compliance" → "supports Article 4 literacy".
- ai-consulting-agentic: drop fabricated "88% of enterprises".
- edge-node-gn100: "20 cores"→"10 cores"; 72B→verified 32B.
- conversational-agent: scope WhatsApp/Zoom as add-on. m365-consultancy: drop "188% ROI"/"74% cost reduction".
- sovereignty-cloud-consulting: drop "Supabase EU" as sovereign (AWS/CLOUD Act) + 78% stat; add DPA legal-advice disclaimer.

PRICING/DUAL-FOLDER FLAG: file is canonical pricing source. Single source = `dws10.com/config/products.json`; sync `landing-pages/dws10-com/config/products.json` in the SAME commit. Descriptive text only — do NOT change any `price`.

DWS constraints (CLAUDE.md): Päärni identity; no secrets; run truth-check.

Commit on fresh `claude/<slug>` branch + open PR.


---

# Redo prompt — supersedes PR #1162 (head: claude/update-dws-messaging-WaIHd, ~3.1mo stale, 5 files, 188 deletions)

Re-extract the DWS IQ 7 positioning refinement onto CURRENT main (old branch conflicts with 3mo of roadmap edits).

Goal:
- Create `investor-outreach/DWS-IQ7-POSITIONING.md` as PRIVATE DRAFT — NOT FOR PUBLICATION.
- Core idea: narrow "four-jurisdiction compliance router / digital-money rules" → "extends EU compliance automation into money-flow and settlement-currency reporting"; avoid MiCA/stablecoin/CBDC/e-money overclaim; keep EU/US/UAE/ASEAN reach.
- Provide 3 tagline variants; align to the CURRENT INVESTOR_MEMO version (was v4.3, now ≥v4.4).
- Only re-apply the top-of-doc one-liner to DWS7_ROADMAP.md / DWS8_ROADMAP.md / DWS_IQ_6_SALES_MANIFESTO_Q1_2026.md / V1_FEATURE_LIST.md if still consistent.

Key areas: `investor-outreach/`, roadmap + manifesto docs. Load DWS_BRAND_STANDARD.md + run truth-check.
Constraints (CLAUDE.md): sender identity exact (risto.paarni@lifetime.fi, never ...2024@); do NOT touch 4 thesis-lockstep files or public-site folders; keep PRIVATE label; no secrets.
Commit on a fresh `claude/dws-iq7-positioning-v2` branch + open PR.


---

# Redo of PR 1177 (source branch: claude/add-dws-iq-v1-features-NKpsn)

Goal: wire the `dws firehorse-report` CLI command to unblock the 4 firehorse-report SKILL.md files. Old PR was +1921/-1342 across 13 files and is ~3 months stale (base moved).

- Add `cmdFirehorseReport()` in `cli/src/cli.ts`: thin HTTP client POSTing to existing `/api/v1/firehorse/reports/generate` (and `/markdown` with `--markdown`); validate format + required fields; JSON output by default, TTY summary otherwise. Register in command switch + HELP + typo-suggestions.
- Fix CLI examples in `skills/firehorse-report-{annual,board-pack,carbon,compliance}/SKILL.md` (was `dws run firehorse-report`).
- SCOPE TIGHTLY: keep only the CLI wiring + skill doc fixes. Drop/split the unrelated content-DMS router mount (`src/app.ts`, `src/firehorse/routes.ts`, `contentms.md`) and unrelated `kya-tuner.ts` / `linkedin-pending.ts` churn unless the HIC confirms they belong.

Key files: `cli/src/cli.ts`, 4 `skills/firehorse-report-*/SKILL.md`.

DWS constraints (CLAUDE.md): surgical scoped changes (Rule 3/9); read existing routes before adding; no secrets; Päärni identity. No thesis/public-site edits.

Commit on fresh `claude/<slug>` branch + open PR.


---

# Redo of PR 1207 (source branch: claude/wonderful-mestorf-46fe80)

Goal: cleanly re-apply the Google Merchant feed fix, freed from stale generated XML.
- Add filter in `dws10.com/feeds/generate-local-inventory.cjs`: exclude `type: "monthly"` and `type: "subscription"` (match primary `generate-feed.cjs` exclusions) so local-inventory IDs always exist in the primary feed.
- REGENERATE feeds fresh from current config (do not hand-copy the 3-month-old XML in the old PR); regenerate both `dws10.com/feeds/*` and the `landing-pages/dws10-com/feeds/*` mirror.
- The old PR also flipped 8 products from monthly/subscription → `one-time` in products.json. Treat that as a SEPARATE pricing-model decision: ASK the HIC before changing any product `type`; do not bundle silently.

Key files: `dws10.com/feeds/generate-local-inventory.cjs`, `dws10.com/config/products.json`, generated `feeds/google-products.xml` + `local-inventory.tsv` (+ landing-pages mirrors).

DWS constraints (CLAUDE.md): single pricing source = `dws10.com/config/products.json`, sync `landing-pages/dws10-com/config/products.json` in SAME commit; no hardcoded prices; Päärni sender identity; no secrets.

Commit on fresh `claude/<slug>` branch + open PR.


---

# Redo: CI-audit tooling (drop 5000-line ADMIN_MANUAL churn)

Source PR #1213 "pr1155 copilot fixes v2" (branch claude/pr1155-copilot-fixes-v2), ~3mo stale, 4861/2664, 18 files.

Goal:
- Land ONLY the CI-hygiene tooling cleanly: `scripts/ci-audit-verify.sh`, `scripts/ci-audit-upload.ts`, `scripts/local-ci.sh`, `scripts/weekly/security-audit.sh`, `.github/workflows/ci-audit-verify.yml`, `.ci-audit/README.md`, `docs/CI_AUDIT.md`.
- Re-decide the `*.yml.disabled` workflow renames deliberately (dependency_review, ruff, gitleaks, test) — do not silently disable security scans.
- EXCLUDE the 5208-line Admin/ADMIN_MANUAL.md reformat churn — separate PR if wanted.

Key files: scripts/ci-audit-*, scripts/local-ci.sh, scripts/weekly/security-audit.sh, .github/workflows/ci-audit-verify.yml.

Constraints (CLAUDE.md): surgical scope; Script Automation Rule (scheduler paths); no secrets in scripts/logs; parameterized/safe exec (no interpolated exec); Päärni identity; verify no security workflow left disabled.

Commit on fresh claude/<slug> branch + open PR.


---

# Redo: Blog Drafts-First HIL Publish Gate (split from ontology churn)

Source PR #1231 (branch claude/remove-roadmap-blog-standard-piuTi), ~3mo stale, 18 files, 15 commits, 2645/1010.

Goal:
- Land the valuable governance piece cleanly: `docs/BLOG_STANDARD.md` §13 "Drafts-First & HIL Publish Gate" (11 rules, _drafts/ gitignored, roadmap blocklist) + Admin/ADMIN_MANUAL.md mirror.
- Keep ontology draft in `onelifetime.world/posts/_drafts/` (not published).
- SPLIT OUT unrelated churn (dws10 index CTA rewrite, ONTOLOGY.md edits, investor/marketing wireframes) into separate PRs — do not bundle.

Key files: docs/BLOG_STANDARD.md, Admin/ADMIN_MANUAL.md, onelifetime.world/posts/_drafts/*.

Constraints (CLAUDE.md): surgical scope (Rule 3); no .md in public-site folders; drafts must stay gitignored from public sync; Päärni identity; EU AI Act Art.14 HIC framing; no secrets; per BLOG_STANDARD routing.

Commit on fresh claude/<slug> branch + open PR.


---

# Redo: European Defence supply-chain section (drop Prettier reformat)

Source PR #1245 (branch claude/defence-supply-chain-3bFSF), ~2.7mo stale, 2113/1342 — mostly Prettier noise.

Goal:
- Add ONLY the new content section "European Defence: 27x Ukraine — Can the Supply Chain Scale?" (cards + metrics + sourcing) to `dws10.com/dual-use-industries/index.html`.
- Do NOT reformat the whole file to Prettier — keep diff surgical (CLAUDE.md Rule 3/9); reformat blew up review scope and risks regressions.
- Keep field note `docs/field-notes/2026-05-02-european-defence-supply-chain-coalition.md`.

Key files: dws10.com/dual-use-industries/index.html, landing-pages mirror, field note.

Constraints (CLAUDE.md): dual-folder sync to landing-pages/dws10-com/ same commit; verify all stats/sourcing; truth-check public claims vs DWS_TRUTH_STANDARD; no .md in public-site folders; Päärni identity; no secrets.

Commit on fresh claude/<slug> branch + open PR.


---

# Redo: DWS Whitepaper Standard + Ontology Whitepaper v1.0

Source PR #1247 (branch claude/interesting-mcnulty-85e59d), ~2.6mo stale, 3211 additions, 8 files.

Goal:
- Recreate meta-standard `DWS_WHITEPAPER_STANDARD.md` (cover/TOC/back-matter/versioning/Base64 HTML rules) fresh on current main.
- Recreate whitepaper `docs/whitepapers/DWS_ONTOLOGY_WHITEPAPER.md` from current ONTOLOGY.md (re-verify version, not stale v1.3).
- Recreate `scripts/gen-whitepaper-html.cjs` (sharp Base64 embed) + `Learn/` HTML; register in DWS_STANDARDS_LIBRARY.md + CLAUDE.md.

Key files: DWS_WHITEPAPER_STANDARD.md, docs/whitepapers/DWS_ONTOLOGY_WHITEPAPER.md, scripts/gen-whitepaper-html.cjs, Learn/*.html.

Constraints (CLAUDE.md): follow DWS_DOCUMENT_STANDARD (***  delimiters, VERSION history); Downloadable HTML Base64 rule; no .md in public-site folders; Päärni sender identity (risto.paarni@lifetime.fi); no thesis lockstep; no secrets. Verify ontology facts vs DWS_TRUTH_STANDARD.md before asserting counts.

Commit on fresh claude/<slug> branch + open PR.


---

# Redo prompt — supersedes PR #1248 (head: claude/review-dws-roadmap-NyhnZ, ~2.7mo stale, 4 files)

Rebuild the EIC Accelerator grant application materials fresh against CURRENT main.

Goal:
- Recreate `investor-outreach/EIC_DWS_POSITIONING.md` (SIRA/TRL self-assessment, EU-policy alignment, 18-mo roadmap, differentiation).
- Recreate `investor-outreach/EIC_FINANCIAL_MODEL_V1.md` (~€3M allocation, cashflow, break-even, sensitivity) using TODAY's numbers.
- Re-verify EIC 2026/2027 call deadlines and cut ratios/dates that have since moved.
- Reconcile against the CURRENT `investor-outreach/INVESTOR_MEMO.md` + `docs/INVESTOR_HOOK_DECK.md` versions; only bump if truly needed.

Key areas: `investor-outreach/`, `docs/INVESTOR_HOOK_DECK.md`. Market/TAM claims → load DWS_MARKET_RESEARCH_STANDARD.md + verify via DWS_TRUTH_STANDARD.md.
Constraints (CLAUDE.md): sender identity = Risto Anton Päärni, risto.paarni@lifetime.fi (never ...2024@); do NOT touch the 4 thesis-lockstep files or public-site folders; no secrets. Doc header/version blocks per DWS_DOCUMENT_STANDARD.md.
Commit on a fresh `claude/eic-grant-materials-v2` branch + open PR.


---

# Redo of PR #1261 (head: claude/build-observability-dashboard-Nt8GG)

Goal: ship just the Aspire-style observability dashboard; shed the 56-file sprawl.
- Backend: src/routes/observability.routes.ts (4 endpoints reading agent JSONL
  logs, deriving start/end trace pairs, aggregating metrics) + register in src/app.ts.
- Frontend v10-react: ObservabilityPage + Resources/Logs/Traces/Metrics views +
  useObservability polling hook + /observability route/nav.
- EXCLUDE all unrelated churn: pentest/*.py, mcp-*_OLD/*, scripts/*.py reformat,
  investor-outreach, last30days-skill, git_operations.py, .ci-audit artifacts,
  and the ComplianceAgent scoring/output-shape change (own PR if wanted).

Constraints (CLAUDE.md): endpoints authenticated, no operational-data leak;
parameterized queries + RLS; surgical scope. Fresh claude/<slug> branch + open PR.


---

# Redo of PR #1274 (head: claude/outokumpu-cbam-demo-pi7UF)

Goal: land the lasting CBAM code; regenerate the time-sensitive content only if
the Outokumpu partnership is still live (confirm first).
- Core keep: stainless-steel emission factors (ISSF 2022 global/China, Outokumpu
  ISO 14067 316L) in src/compliance/emission-factors.ts + runnable
  src/demos/outokumpu-cbam-demo.ts (validate €31k/yr @ €65 ETS via cbam-calculator).
- PCF certificate → CBAMImport field mapping doc (internal, docs/ or Firehorse/).
- Re-verify numbers; DROP stale partner emails + the blog post unless still wanted.

Constraints (CLAUDE.md): blog on public site → BLOG_STANDARD + no public .md;
Päärni sender identity + risto.paarni@lifetime.fi on any outreach; dual-folder
sync for onelifetime.world if blog kept. Fresh claude/<slug> branch + open PR.


---

# Redo of PR #1280 (head: claude/gskills-gbrain-integration-iuADY)

Goal: reintroduce the highest-value gbrain brain/ops skills, curated not bulk.
- Pick 3-5 skills that fill real gaps not already covered by current skills/
  (e.g. signal-detector, ingest, query, enrich, briefing) — skip duplicates of
  existing skills (cron already exists as /cron, etc.). Simplicity first.
- Add skills/RESOLVER.md dispatcher + validate-index.mjs; register each in
  skills/manifest.json and sync docs/DWS_SKILLS_GUIDE.md.
- RESOLVE the AGENTS.md merge-conflict markers the original left (Cursor bugbot flagged).
- Preserve MIT attribution to garrytan/gbrain.

Constraints (CLAUDE.md): match repo skill conventions; parameterized skills, not
domain scripts; no speculative 14-skill dump. Fresh claude/<slug> branch + open PR.


---

# Redo of PR #1282 (head: claude/ms365-connector-implementation-ZD9mT)

Goal: reimplement the MS365 / Entra multi-agent integration cleanly + scoped.
- Keep src/integrations/ms365/*: base connector (token cache + retry/backoff),
  agent-identity-registry, graph {calendar,mail,teams,sharepoint} connectors,
  routes, types; wire routes in src/app.ts.
- Persist registry to erp_integrations (provider 'ms365') — not in-memory only.
- DROP the bundled dws10.com/config/products.json pricing edits (unrelated scope,
  pricing is a source-of-truth change that must be its own PR).
- Tokens/secrets via env only (MS365_TENANT_ID, MS365_AGENT_*_*); never logged/committed.

Constraints (CLAUDE.md): parameterized queries + RLS + GRANTs on new tables;
validate input (Zod); Päärni identity in any mail copy. Fresh claude/<slug> branch + PR.


---

# Redo of PR #1285 (head: claude/weekly-prioritization-list-Pe19Q)

Goal: add the Platform Agents table to AGENTS.md §7, freshly regenerated.
- Run scripts/sync-agents-md.mjs against CURRENT src/agents/*.agent.ts (the May
  table is 2.5mo stale) so the table matches today's agent set + models.
- Keep the genuine bugfix: ROOT resolution via fileURLToPath (not
  `new URL().pathname`) in sync-agents-md.mjs / verify-agents-md.mjs /
  golden-principle-check.mjs.
- Do NOT re-commit the CRLF→LF whole-file reformat of verify-agents-md.mjs; keep
  the diff to the real logic change only.

Constraints (CLAUDE.md): *** delimiter for VERSION block; surgical scope; no
thesis/public-site edits. Fresh claude/<slug> branch + open PR.


---

# Redo of PR #1292 (head: claude/build-v1-feature-nIOHM-9vKuR)

Goal: close two V1 gaps without the 4000-line app.ts/openapi.ts churn.
- Public GET /api/v1/status (no auth) per OpenAPI: subsystem checks for
  api/agents/compliance with 1s timeout, never hangs (src/routes/status.routes.ts).
- Payment UI: CheckoutSuccessPage + CheckoutCancelPage in v10-react, mounted at
  /billing/* and /subscribe/*; success page polls Supabase subscriptions to
  confirm webhook activation.
- Keep src/app.ts + src/openapi.ts edits MINIMAL (mount route only) — do not
  reformat/regenerate the whole files (original had +2376/-1839 noise).

Constraints (CLAUDE.md): parameterized queries + RLS intact; env for secrets;
no public-site .md; Päärni identity if any copy. Fresh claude/<slug> branch + PR.


---

# Redo of PR #1300 (head: claude/dream-prune-transcript-gate)

Goal: land the two real changes from the stale PR cleanly, drop scratch.
- clawdbot-scan gate: when no `.jsonl` transcripts exist in lookback, skip
  unused/low-use pruning; emit honest markdown + JSON (scripts/clawdbot-scan.mjs).
- blog-to-social queue: keep scripts/sync-blog-to-social-queue.ts + the
  src/social-scheduler/{queue,post-library}.ts + src/app.ts wiring.
- Do NOT commit artifacts/* scratch (branch-backlog TSVs, worktree/open-pr dumps).

Constraints (CLAUDE.md): surgical scope — split unrelated concerns if needed;
no thesis/public-site edits; Päärni sender identity in any copy; parameterized
DB queries + RLS intact; env vars for secrets, none committed.
Commit on a fresh claude/<slug> branch + open PR.


---

# V2 redo — labor-pricing sales outreach, refreshed to current quarter (supersedes PR #1308, branch claude/amplify-labor-pricing-sales-aa9qZ)

Goal:
- Rebuild the evergreen labor-anchor framework on current main (every quote vs loaded human cost replaced, not vs SaaS): refresh `DWS_IQ_6_SALES_MANIFESTO_*`, five `docs/sales/outreach-2026Q2/ACCOUNT-*.md`, 12 `docs/sales/templates/SEQ-*.md`, PIPELINE.md — re-dated to the CURRENT quarter (Q2/26 is expired; re-target).
- Re-insert labor-anchor hero cards on `dws10.com` + `onelifetime.world` (+ FI/SV/DE/FR) with landing-pages mirrors in same commit.
- Keep three investor INTRO refreshes + LSJ draft.

Constraints (CLAUDE.md): public-site intent OK (hero copy) but no thesis-lockstep; do NOT touch `dws10.com/config/products.json`; dual-folder sync same commit; sender Risto Anton Päärni `risto.paarni@lifetime.fi` (never ...2024@); Amazon SES only, no Resend, no noreply@; register cadence scripts in scheduler path; no secrets.

End: commit on a fresh `claude/<slug>` branch + open PR.


---

# V2 redo — PhD §1.0 dissertation focus anchor (Kari feedback) (supersedes PR #1310, branch claude/clarify-dissertation-focus-WAGCb)

Goal:
- Re-apply the small content change on current main: new §1.0 "Research Focus and Goal (one-page anchor)" + rewritten §1.6 supervisor letter in `docs/PHD_FIREHORSE_EN.md` and `docs/PHD_FIREHORSE_FI.md` (Focus/Goal/problem/central claim/DSR/open-source tiers/4-article schedule/4 scope exclusions).
- Preserve the user's empirical→generalisation working-method sentence verbatim; keep market-signal/scientific framing in PhD only (not master's).
- Regenerate `Learn/` HTML at the new version; never delete old thesis HTML.

Constraints (CLAUDE.md Thesis Rule — intent IS thesis): update all four files in lockstep (PHD_EN/FI + V3Thesis_EN/FI version-bump only, no master's content change); preserve all prior eloquent formulations (Rule 12); no public-site; no secrets.

End: commit on a fresh `claude/<slug>` branch + open PR.


---

# V2 redo — KYA-S1 vendor security standard + blog + hub (supersedes PR #1317, branch claude/study-palantir-mas2-MwtEw)

Goal:
- Re-land `Legal/KYA_S1.md` v1.1 (7 control domains IDV/BHM/REG/TC4+FLT/TRS/PRV; Bronze/Silver/Gold SLAs; no self-attestation) on current main.
- Republish blog post `posts/kya-s1-one-signed-page.html` (public-site intent) + dual-folder mirror; register in `DWS_STANDARDS_LIBRARY.md` §3.3, `BLOG_STANDARD.md`, compliance hub card.
- Keep MA-S2 only as structural-inspiration credit (nothing agreed with Palantir). Split the separate Cloudflare-Pages deploy workflow into its own PR — do not bundle.

Constraints (CLAUDE.md): public-site intent OK here (blog) but no thesis-lockstep; never publish .md into public-site folders; dual-folder sync in same commit; add SRI+crossorigin on any CDN asset; sender identity Risto Anton Päärni; no secrets.

End: commit on a fresh `claude/<slug>` branch + open PR.


---

# V2 redo — CSRD annual audit-evidence bundle workflow (supersedes PR #1356, branch claude/csrd-audit-workflow-GTgt6)

Goal:
- Rebuild the CSRD evidence-bundle module cleanly on current main: `src/csrd/{runners,merkle,evidence-logger,purpose-gate,lwm-adapter,cli}.ts` + tests, against a deterministic mock LLM adapter (base model NOT locked until the Jan-2027 bake-off).
- Re-apply migration `supabase/migrations/067_csrd_evidence_bundle.sql` and cron workflows `csrd-annual-bundle.yml` / `csrd-monthly-incremental.yml`.
- Keep the eval set `eval/csrd/construction-eval-set.v1.0.json` + lab note; drop the base-model decision from PR scope (record as open decision only).

Constraints (CLAUDE.md): no thesis-lockstep/public-site; every CREATE TABLE gets service_role+authenticated GRANT + ENABLE RLS (Firehorse template); parameterized queries; no secrets; scheduler-discovery paths for cron scripts.

End: commit on a fresh `claude/<slug>` branch + open PR.


---

# Redo of PR #1361 (head: claude/hermes-agent-review-bEcmb) against current main

The lab note plus its top-3 recommendations were bundled into one 15-file / +1806 branch. Land the analysis first; ship the code as separate follow-ups.

- Add the Hermes-agent (Nous Research) lab note `docs/lab-notes/2026-05-17-hermes-agent-nous-research.md` + `docs/RPC_RUNNER.md` (doc-only, clean).
- If approved, THEN a second PR adds the code: `src/agents/rpc-runner.ts` (RPC tool delegation), `skills/skill-distiller/SKILL.md` + `.claude/commands/skill-distill.md` on the dream-loop, `src/agents/user-profile.service.ts` + supabase migration `069_user_profiles_kya_traits.sql`.
- Supabase table: include `GRANT` to service_role/authenticated + `ENABLE ROW LEVEL SECURITY` (copy Firehorse template).

Constraints: follow CLAUDE.md + AI_AGENT_GUIDELINES.md + DWS_SECURITY_STANDARD.md; register new skill in `skills/manifest.json` + sync `docs/DWS_SKILLS_GUIDE.md`; no secrets. Do NOT touch thesis-lockstep files or public-site folders.
Commit on a fresh `claude/hermes-agent-review-v2` branch + open PR.


---

# Redo of PR #1365 (head: claude/dws-compliance-sales-rz5He) against current main

Sharpen the steel (and defence) CBAM wedge pages to a single Boardy 1+1+1+1 focus (one buyer, one pain, one mechanism, one proof); move persona strategy matrices to an internal-only file.

- Rebuild the steel wedge page and, if still wanted, the defence page as tight single-purpose landing pages.
- Move the 14-persona win-win + intelligence-amplification matrices into `sales-outreach/PERSONAS_DWS_INTELLIGENCE.md` (INTERNAL, with VERSION AND AGENT HISTORY block).
- Buyer = commercial/business-line owner; IP gate is a data-flow feature, not the headline.

Constraints (public-site edit IS the intent here): edit under `dws10.com/` AND sync byte-identical mirror `landing-pages/dws10-com/` in the SAME commit (dual-folder rule); NO `.md` in public-site folders; CTA email `risto.paarni@lifetime.fi`, never `noreply@`. Follow CLAUDE.md + DWS_BRAND_STANDARD.md + SITE_QUALITY_STANDARDS.md. Do NOT touch thesis-lockstep files.
Commit on a fresh `claude/steel-cbam-wedge-v2` branch + open PR.


---

# Redo of PR #1373 (head: claude/research-dws-use-cases-IPisl) against current main

Re-add the sales-positioning + code-intelligence market research, reconciled to the current canonical truth (the old branch mixed a "20 industries" claim with a CLAUDE.md bump to 25).

- Add `docs/market-research/sales-angle-governed-code-intelligence.md` (CFO/GC "court-defensible compliance + D&O safe harbor" angle, four moats).
- Add `docs/market-research/code-intelligence-dws-use-cases.md` (maps arxiv:2511.18538 survey to DWS 6/7/8 use cases).
- Add outreach template `docs/market-research/outreach/inmail-owen-reynolds.md`; bump `DWS_MARKET_RESEARCH_STANDARD.md` history.

Constraints: follow CLAUDE.md + DWS_MARKET_RESEARCH_STANDARD.md + DWS_TRUTH_STANDARD.md — verify the current canonical industry count and product prices before asserting any number; keep the honest arxiv scoping note. Sender identity = Risto Anton Päärni / risto.paarni@lifetime.fi. Do NOT touch thesis-lockstep files or public-site folders.
Commit on a fresh `claude/market-research-code-intel-v2` branch + open PR.


---

# Redo of PR #1378 (head: feature/mcp-hub-gateway-ts) against current main

Point Win11 MCP docs at the TypeScript gateway and refresh the GitHub Apps inventory. The old branch left committed git conflict markers (`<<<<<<<`/`>>>>>>>`) in AGENTS.md — do NOT reproduce those.

- Update `.mcp.json.example`, `docs/MCP_CLIENT_QUICKSTART.md`, `docs/MCP_CONFIGURATION.md`: Win11 `dws-gateway-local` uses `node mcp-servers/cloud-run-gateway-ts/dist/server.js` (stdio) instead of the Python gateway; add build step note.
- In `AGENTS.md` document `mcp-hub-ts` as preferred hub (Python `mcp-hub` kept for Redis/BIM/sandbox) — clean edit, no conflict markers, do not regress the "Last Updated" date.
- Refresh `Admin/GITHUB_APPS_AUDIT.md` to the current installed-apps inventory; sync the two Admin manual references.

Constraints: follow CLAUDE.md + docs/DWS_DOCUMENT_STANDARD.md (`***` history delimiter); verify current main state before asserting the TS gateway is live. Doc-only; do NOT touch thesis-lockstep files or public-site folders.
Commit on a fresh `claude/mcp-gateway-ts-docs-v2` branch + open PR.


---

# Redo of PR #1381 (head: claude/fix-agentcontext-toolsafety-0522) against current main

The old branch was 19 files / +1062-586 (12 commits) mixing real fixes with workflow reformatting and `_OLD` requirements churn. Rebuild only the agent-context + tool-safety hardening cleanly.

- Harden `src/services/auth.service.ts` JWT/secret validation and `src/config/secret-loader.ts` + `src/config/supabase.ts` env loading (fail-loud on missing secrets, no env dumps).
- Tighten agent tool-safety: `src/agents/types.ts` + tool-permission checks; treat MCP/tool output as untrusted.
- Update `src/__tests__/agent-routes-ordering.test.ts` so tests assert intent (Rule 9), not constants.

Constraints: follow CLAUDE.md + DWS_SECURITY_STANDARD.md (auth/secrets/validation triggers); no secrets in code/logs; Zod-validate input; keep changes surgical; skip the workflow-reformat and `_OLD/` edits entirely. Do NOT touch thesis-lockstep files or public-site folders.
Commit on a fresh `claude/agent-toolsafety-v2` branch + open PR.


---

# Redo of PR #1385 (head: cursor/fix-dgx-runner-workflows-0d84) against current main

Make CI resilient when the DGX Spark self-hosted runner is offline, without the whole-file CRLF/quote churn the old PR carried.

- In the 4 workflows (`test-on-pr.yml`, `ci-audit-verify.yml`, `claude-auto-fix.yml`, `security-check-pr.yml`) change ONLY the `runs-on:` line to: `${{ vars.CI_RUNNER_LABEL && fromJSON(vars.CI_RUNNER_LABEL) || 'ubuntu-latest' }}`. Leave quoting/line-endings untouched.
- Harden `infrastructure/dgx-spark/setup-github-runner.sh`: add a `whoami != admin100` guard, replace hardcoded `/home/admin100` + `~` with `RUNNER_USER`/`RUNNER_DIR` vars in the systemd unit.
- Document the `CI_RUNNER_LABEL` repo-variable opt-in near the runner setup docs.

Constraints: follow CLAUDE.md; keep diff surgical (Rule 3/9) — no reformatting of untouched lines; gcloud examples CMD-syntax; do NOT touch the 4 thesis-lockstep files or any public-site folder. Verify `npx vitest run` still passes.
Commit on a fresh `claude/ci-runner-fallback` branch + open PR.


---

# Redo of PR #1389 (branch: claude/dgx-spark-scaling-x4bHU) against current main

Re-record the Control Room hardware-scaling doctrine. Old branch is ~2 months stale and edits the 4 thesis-lockstep files, which have since drifted.

Goal:
- Author field note `docs/field-notes/2026-07-26-control-room-scaling-spark-thor-orin.md`: three-tier Blackwell stack (2× DGX Spark + 1× Jetson Thor T5000 + N× Jetson Orin), Control Room vs Situation Room asymmetry, and the scale-out doctrine (per-tenant appliance replication, never multi-node sharding — answers "cross-node overhead?").
- Add the topology as a short subsection to current `DWS7_ROADMAP.md` (read current version first).
- Only if the PhD-thesis market/scientific framing genuinely needs it: apply the doctrine to the 4 thesis-lockstep files TOGETHER in lockstep and regenerate `Learn/` HTML; otherwise leave them and note N/A.

Constraints (CLAUDE.md): thesis rule = all 4 files together or none; Document Standard `***` history delimiter; do NOT touch public-site folders; sender identity Risto Anton Päärni.
Commit on a fresh `claude/control-room-scaling-note` branch + open PR.


---

# Redo of PR #1392 (branch: claude/kg-entity-resolution-dedup-Y5dEn) against current main

Rebuild the KG entity-normalization module. Old branch is ~2 months stale and its migration 069 number now collides with main.

Goal:
- Two-stage algorithm in `src/kg/`: Resolution (per-type exact→fuzzy→semantic to canonical_name) and Deduplication (embed full context + hybrid search; gate ≥0.95 auto-merge, >0.85 human-review, ≤0.85 new node). Same-name-different-type must never merge (always filter by entity_type).
- Pure-TS core with pluggable Embedder + EntityStore interfaces; `supabase-store.ts` adapter; barrel `index.ts`.
- Migration for `kg_entities`, `kg_entity_aliases`, `kg_entity_review_queue` + `kg_dedup_search` RPC — use the NEXT free number in `supabase/migrations/`, include GRANT to service_role/authenticated + ENABLE RLS.
- Port `src/__tests__/kg-normalize.test.ts` (16 tests: match primitives, resolve fall-through, 3 dedup gates, cross-type isolation, end-to-end).

Constraints (CLAUDE.md): parameterized queries, RLS intact, no secrets; do NOT touch thesis-lockstep files or public-site folders.
Commit on a fresh `claude/kg-entity-normalization` branch + open PR.


---

# Redo of PR #1404 (branch: claude/playwright-webwright-agents-ECD0R) against current main

Re-codify the three-layer CIO wedge positioning. Old branch is ~2 months stale; its skill-count references in the skills guide have drifted.

Goal:
- Add `skills/stack-wedge/SKILL.md`: parameterized COMPANY × STACK × INDUSTRY × ROLE × FORMAT procedure mapping Layer-2 industry tooling (Playwright/Webwright, Claude on Azure OpenAI, Postgres, OIDC/Entra) to the buyable Layer-3 Firehorse line item.
- Register skill in `skills/manifest.json` and re-sync `docs/DWS_SKILLS_GUIDE.md` (read the CURRENT skill/slash counts, do not reuse old 35→36 numbers).
- Make `DWS_MARKET_RESEARCH_STANDARD.md` §12 the canonical home for the positioning.
- Reproduce briefs: Outokumpu (HTML one-slide), SSAB + Wärtsilä markdown.

Constraints (CLAUDE.md): load DWS_MARKET_RESEARCH_STANDARD before editing; Document Standard header; do NOT touch thesis-lockstep files or public-site folders; no deprecated "GodAgent" wording; sender identity Risto Anton Päärni.
Commit on a fresh `claude/stack-wedge-positioning` branch + open PR.


---

# Redo of PR #1407 (branch: claude/ratte-oy-outreach-rWxKE) against current main

Re-ship the Lifetime Oy pk-yritys product launch. Old branch is ~2 months stale, 72 files, +15.9k/-7.4k — too large/conflicted to rebase. Touching public-site folders IS the intent here.

Goal:
- Two FI products: ATK-Tuki Pk-yrityksille (750 € tuntipankki, 75 €/h) and Henkilövuokraus–Kuljetuspalvelut (49 €/h). Marketing pages on lifetime.fi, purchase on dws10.com.
- Update `dws10.com/config/products.json` (single pricing source) + sync `landing-pages/dws10-com/config/products.json` same commit; no hardcoded prices.
- Iron-clad nav: pin both FI products atop Products ▾ across dws10.com/lifetime.fi/onelifetime.world/dws6.com; store link absolute `https://dws10.com/buy/`; sync all 4 mirrors.
- Rätte Oy outreach pack in `sales-outreach/` (intro, confirmation letter, IT tarjous MD+HTML, A4 flyer). Bump DWS_PRODUCT_STANDARD.

Constraints (CLAUDE.md): dual-folder mirror sync same commit; never publish `.md` in public-site folders; sender identity Risto Anton Päärni / risto.paarni@lifetime.fi (sales) — never the ...2024@ login; do NOT touch thesis-lockstep files.
Commit on a fresh `claude/pk-yritys-products` branch + open PR.


---

# Redo of PR #1412 (branch: claude/enterprise-deployment-improvements-XzTzq) against current main

Rebuild the Apollo Primitives deployment-orchestration layer. Old branch is ~2 months stale, 42 files, and its migration 069/070 numbers now collide with main.

Goal:
- Implement `src/apollo/` verbs deploy/patch/rollback/validate/govern as async fns + `src/apollo/cli.ts`; orchestrate existing runners (gcloud, Scaleway, Aegis, hardware), do not reimplement them.
- Sovereignty-tier → component stack derivation, per-surface SLO watcher with tier-aware auto-rollback, report-only sovereignty gates.
- Typed audit chain to a Supabase `apollo_deploy_audit` table — pick the NEXT free migration number in `supabase/migrations/`; include GRANT + RLS block per CLAUDE.md.
- Read-only `src/routes/apollo.routes.ts` + dashboard `dws6.com/dashboard/apollo/` (mirror to `landing-pages/dws6-com/`). Add vitest tests.

Constraints (CLAUDE.md): validate input (Zod), parameterized queries, RLS intact; dual-folder sync same commit; do NOT touch thesis-lockstep files or public marketing site copy. gcloud examples = CMD syntax.
Commit on a fresh `claude/apollo-primitives` branch + open PR.


---

# Redo: Outokumpu CBAM demo portal

Source PR #1413 (branch claude/outokumpu-onboarding-demo-hUbZj), ~2mo stale, 2543 additions, 3 files.

Goal:
- Rebuild self-contained single-file demo `dws6.com/demo/outokumpu/index.html` (interactive CBAM scenario builder: grade/tonnage/fabricator selectors, side-by-side PCF vs non-EU cards, declaration preview).
- Re-verify all hardcoded numbers (PCF 1.60 tCO2e/t 304L, EU benchmark 1.231, CBAM rates, savings EUR 37k-449k) against current carbon-analysis/compliance canon.
- Add runbook `Firehorse/Omnichannel/Partners/OUTOKUMPU_DEMO_RUNBOOK.md`.

Key files: dws6.com/demo/outokumpu/index.html, landing-pages mirror, runbook.

Constraints (CLAUDE.md): dual-folder sync — mirror to landing-pages/dws6-com/demo/outokumpu/ same commit; no .md in public-site folders (runbook lives under Firehorse, OK); mock auth only, NO secrets/API keys; Päärni identity if any contact shown; brand tone per DWS_BRAND_STANDARD.

Commit on fresh claude/<slug> branch + open PR.


---

# Redo of PR #1417 (branch: claude/dws7-roadmap-planning-gnvsm) against current main

Re-derive the "Company Brain Operating Map" audit of the DWS7 roadmap. The old branch is ~2 months stale and its roadmap version bump conflicts.

Goal:
- Read current `DWS7_ROADMAP.md` (do NOT assume old version numbers) before editing.
- Add field note `docs/field-notes/2026-07-26-company-brain-operating-map-dws7-gaps.md`: 6-stage map (Capture→Retrieval→Source Truth→Permissions→Feedback→Execution), gaps G1–G4, NOT-DOs N1–N5 with EU-law anchors (GDPR/NIS2/CLOUD Act/EU AI Act).
- Update roadmap: pin Supabase→Aiven sovereign migration as a Phase 3 P0 deliverable; bump version per current history block.
- Regenerate `Learn/DWS7_ROADMAP_*.html` via `scripts/gen-roadmap-html.cjs`.

Constraints (CLAUDE.md): Document Standard header + `***` history delimiter; Rule 4 = Amazon SES not Resend; do NOT touch the 4 thesis-lockstep files or public-site folders; sender identity = Risto Anton Päärni, Founder CEO, Lifetime Oy.
Commit on a fresh `claude/dws7-brain-map-audit` branch + open PR.


---

# Redo of PR #1424 — EU Tech Sovereignty Package / CADA → Aegis fit

Source: PR #1424, head branch `claude/eu-sovereignty-aegis-fit-ONrhX` (22,194 additions, too large to rebase). Re-achieve intent on CURRENT main. NOTE: overlaps PR #1437 — dedupe first.

Goal:
- Field note `docs/field-notes/2026-06-03-eu-tech-sovereignty-package-cada-aegis-fit.md` — opportunities, obligations Aegis must prove (control-plane purity, hardware diversification, AI-Act/CADA evidence); `***` delimiters + ontology tags (DWS_DOCUMENT_STANDARD).
- regulatory-radar scoring `reports/regulatory-radar/eu-aegis_2026-06-03.json` (CADA urgency 12mo × risk high, procurement window).
- PhD thesis: add CADA-as-public-procurement-selection-criterion contribution (PhD = market-signal/scientific per thesis-scope split).
- Landing: "EU Tech Sovereignty Package fit" section in `dws10.com/aegis/index.html` + landing-pages mirror (dual-folder, same commit).

Constraints: thesis lockstep IS intent — ALL 4 files + Learn HTML, keep old HTML; public-site edits intended. No secrets.
Commit on fresh `claude/eu-sovereignty-cada-v2` branch + open PR.


---

# Redo of PR #1437 — Aegis v3.62 refresh + truth registry + onboarding

Source: PR #1437, head branch `claude/zealous-rubin-RHL5g` (115 files, too large to rebase). Re-achieve intent on CURRENT main. NOTE: overlaps PR #1424 (same Aegis/sovereignty v3.62 theme) — dedupe/coordinate before writing.

Goal:
- Supabase migration: queryable truth-registry mirror of `DWS_TRUTH_STANDARD.md` — MUST add `GRANT` service_role/authenticated + `ENABLE RLS` (CLAUDE.md Supabase rule).
- Add `docs/playbooks/AEGIS_ONBOARDING_PLAYBOOK.md` + `docs/AEGIS_SOVEREIGNTY_WHITEPAPER.md`.
- Refresh `Store/PRODUCT_AEGIS.md` + `dws10.com/products/aegis.html` + aegis pages; keep `dws10.com/` ↔ `landing-pages/dws10-com/` synced same commit; prices only via `config/products.json`.
- Investor one-pager (sender identity: Risto Anton Päärni; never `...2024@`).

Constraints: public-site edits ARE intended here (dual-folder sync). If bumping thesis to v3.62, do ALL 4 lockstep + Learn HTML; else leave thesis untouched. No secrets.
Commit on fresh `claude/aegis-v362-v2` branch + open PR.


---

# Redo of PR #1441 — Data-credible subcontractor segment

Source: PR #1441, head branch `claude/pvs-instalacje-subcontractor-j105xs` (stale, 6 files, mixed concerns). Re-achieve intent on CURRENT main.

Goal:
- Capture the "data-credible subcontractor" market segment (the durable value, not just the lead).
- Add `DWS_ROLES_REGISTRY.md` §4 "Industrial subcontractor (piping/welding/steel fab)" variant row + persona-tier note (door #1 R12; reuse R12/R09/R17/R20); version-bump per DWS_DOCUMENT_STANDARD.
- Add partner record `Partners/outreach/2026-06-09-pvs-instalacje.md` — inbound treated as UNTRUSTED (DWS_SECURITY_STANDARD), RED-zone: draft reply only, no send.
- Optional: free-tier hypothesis audit (verdict: prime-sponsored supplier module, NOT self-serve sub freemium).

Constraints: CLAUDE.md; outreach sender = `risto.paarni@lifetime.fi`; do NOT touch thesis/public-site folders; NEVER commit PII (Rätte Oy henkilötunnus/address) — drop the employment-contract review/letters unless user explicitly wants them. No secrets.
Commit on fresh `claude/subcontractor-segment-v2` branch + open PR.


---

# Redo of PR #1443 — VTV 10/2026 AI-in-government PhD summary

Source: PR #1443, head branch `claude/ai-report-phd-summary-2057ef` (12,999 additions, too large to rebase). Re-achieve intent on CURRENT main.

Goal:
- Add FI source-based summary of VTV Tarkastus 10/2026 "Tekoälyn hyödyntäminen valtionhallinnossa" for PhD/Firehorse research.
- New docs: `docs/PHD_VTV_TEKOALY_VALTIONHALLINTO_YHTEENVETO.md`, `docs/PHD_VTV_LAINSAADANTO_SYVALUKU.md`, `docs/PHD_VTV_RAHOITUSOHJELMA_ANALYYSI.md` — numbered citations to VTV/Valtioneuvosto/VM/OM; flag in-PDF figures "to verify".
- Fold market-signal/scientific findings into PhD thesis only (thesis-scope split: PhD = market signals, NOT master's implementation detail).

Constraints: thesis lockstep IS the intent — update ALL 4 thesis files + regenerate `Learn/` HTML per CLAUDE.md thesis rule; never delete old HTML versions. Sender identity = Risto Anton Päärni. No secrets.
Commit on fresh `claude/vtv-phd-summary-v2` branch + open PR.


---

# Redo of PR #1448 — Loop Engineering agent subsystem

Source: PR #1448, head branch `claude/loop-engineering-agents-xxtqar` (too large/stale to rebase). Re-achieve intent on CURRENT main.

Goal:
- Re-implement `src/agents/loop-engineering/*`: orchestrator, container-executor, git-delivery, CAS, mutation-ledger, exit-condition, checkers (shell/llm), tools/write-file.
- Expose via MCP: `src/mcp/loop-mcp-tool.ts`, register in `src/mcp/agent-server.ts` + `src/mcp/security/tool-colors.ts`; wire `skills/loop/SKILL.md` + `docs/LOOP_ENGINEERING_ARCHITECTURE.md`.
- EU AI Act Art.12 audit: `article12-sync.ts` + migration `supabase/migrations/NNN_article12_loop_cycles.sql` — MUST add `GRANT` to service_role/authenticated + `ENABLE RLS` (CLAUDE.md Supabase rule).
- Add tests `src/__tests__/loop-*.test.ts` asserting intent (Rule 9).

Constraints: follow CLAUDE.md 12 rules + `AI_AGENT_GUIDELINES.md` BaseAgent/autonomy-tier; validate input; no `exec()` string interpolation; do NOT touch the 4 thesis-lockstep files or public-site folders; no secrets.
Commit on fresh `claude/loop-engineering-v2` branch + open PR.


---

# Redo of PR #1453 (branch claude/dependabot-vulnerabilities-x9obp3) — stale lockfiles, re-patch fresh

Re-assess and patch CURRENT critical Dependabot vulnerabilities against CURRENT main (lockfiles have moved; re-derive versions). Goal:
- Re-run the vuln audit; identify current critical advisories (originals: vitest/@vitest/ui UI-server RCE; shell-quote quote() newline escaping, transitive in mobile-dashboard).
- Bump root `vitest` + `@vitest/ui` to a safe current release (dev-only test runner).
- Pin `shell-quote` >=1.8.4 via `overrides` in `mobile-dashboard` (transitive via RN cli-tools / launch-editor / react-devtools-core).
- Stay within accepted semver, no breaking changes; verify criticals drop to 0 in root and mobile-dashboard.
Key areas: `package.json` + `package-lock.json` (root), `mobile-dashboard/package.json` + lock. Do NOT bundle the unrelated infrastructure/dgx-spark bumblebee changes that were in the old branch.
Constraints: obey CLAUDE.md; regenerate lockfiles cleanly; do NOT touch the 4 thesis-lockstep files or public-site folders; Päärni sender identity if authored line needed; no secrets/tokens in diffs.
Commit on a fresh claude/<slug> branch and open a PR.


---

# Redo of PR #1464 (branch claude/loop-library-research-rf6jes) — 227-file sweep, too large to rebase

Re-produce ONLY the research deliverable against CURRENT main (drop the accidental 227-file nav/site sweep). Goal:
- Review all 45 loops in the Forward-Future/loop-library catalog; map each against existing DWS6 skills, scheduled scripts, and agents.
- Emit `docs/LOOP_LIBRARY_RESEARCH.md`: a full 45-row Adopt/Have/Skip table plus a ~9-loop adoption shortlist that fills real gaps.
- Lead the shortlist with the Propagation Compliance loop (033) hardening single-source-of-truth + dual-folder-sync rules.
- Register the doc in `DWS_STANDARDS_LIBRARY.md`/skills guide if appropriate; no cross-cutting refactors.
Key areas: `docs/LOOP_LIBRARY_RESEARCH.md` (new), optionally `docs/DWS_SKILLS_GUIDE.md`.
Constraints: obey CLAUDE.md; this is a docs-only deliverable — do NOT touch public-site folders (dws10.com/dws6.com/onelifetime.world/lifetime.fi and their landing-pages mirrors), nav assets, or the 4 thesis-lockstep files; Päärni sender identity if authored line needed; no secrets.
Commit on a fresh claude/<slug> branch and open a PR.


---

# Redo of PR #1474 (branch claude/agent-swarm-verification-loop-3zn9o7) — too large to rebase

Add a self-verifying agent swarm loop against CURRENT main. Goal:
- Loop that plans deterministically, fans out a parallel swarm, verifies every record against its cited live source, and requeues failures until the verify pass rejects nothing (or a budget/cycle cap stops it).
- Compose EXISTING Loop primitives (LoopBudget, runSafetyGate, disk-persisted state); do NOT add a new loop framework; leave the shared model catalog untouched.
- Deterministic verification only (URL resolves, tolerance compare, empty-field); confine model use to an optional Spark research worker. EU-sovereign model mapping via OLLAMA_MODEL/_FAST env vars.
- Source adapters: world-bank, eur-lex, http-json, in-memory.
Key areas: `src/agents/swarm-loop/` (types, source-adapters, verify-task, spark-worker, orchestrator, CLI), `src/__tests__/swarm-loop.test.ts` (assert seeded faults rejected+requeued, converges to zero, unhealed fault reported not shipped), `skills/swarm-loop/SKILL.md`, `.claude/commands/swarm-loop.md`, register in `docs/DWS_SKILLS_GUIDE.md`.
Constraints: obey CLAUDE.md; skip the dashboard viz (dws6.com + landing-pages mirror) unless trivial — keep public-site folders out of scope; do NOT touch the 4 thesis-lockstep files; Päärni sender identity; no secrets.
Commit on a fresh claude/<slug> branch and open a PR.


---

# Redo of PR #1476 (branch claude/kb-solution-audit-uu9qhl) — too stale/large to rebase

Bootstrap and wire the dormant DWS knowledge base against CURRENT main. Goal:
- First real KB compile: emit OKF v0.1 articles from raw sources + ingested field/lab notes; update `kb.json` (articleCount, health, okfVersion 0.1).
- Adopt Open Knowledge Format: YAML frontmatter with required `type`, standard markdown links (no wikilinks), reserved `index.md`/`log.md`; rewrite COMPILE/LINT prompts to emit+enforce OKF.
- Add `docs/DWS_KNOWLEDGE_STANDARD.md` (DWS OKF profile); register in `DWS_STANDARDS_LIBRARY.md` and the CLAUDE.md resolver.
- Wire scheduling: `scripts/weekly/kb-compile.sh` + generalize `scripts/daily/kb-watch-inbox.sh` to ingest `docs/field-notes/` and `docs/lab-notes/` (per-source sentinels, capped backfill).
- Create `skills/kb/SKILL.md`; fix dangling doc refs.
Key areas: `kb/`, `scripts/{weekly,daily}/`, `skills/kb/`, standards docs, CLAUDE.md resolver.
Constraints: obey CLAUDE.md; do NOT touch the 4 thesis-lockstep files or public-site folders; use Risto Anton Päärni sender identity if any authored line is needed; no secrets.
Commit on a fresh claude/<slug> branch and open a PR.


---

# Redo of PR #1484 (source branch: claude/code-loop-architecture-qeszu4)

Original PR was mislabeled "docs: field note" but sprawled to 26 files / 6447+/2545- (physical-loop agents, Article 12 whitepaper HTML+PDF, huge public-site rewrites, blog posts). Redo cleanly, split by concern.

Goal:
- Land ONLY the internal engineering artifact: `src/agents/physical-loop/*` (orchestrator, kya-guard, audit-adapter, types, index), `src/agents/article12-logger.ts` changes, and their tests. Verify build + tests pass.
- Write `docs/FIELD_NOTE_WORLD_MODEL_V1_LOOP_2026.md` as an internal field note only.
- DO NOT touch public surfaces this PR: exclude dws10.com/onelifetime.world HTML, Learn whitepaper, PDF, blog — those need truth-check + brand review + dual-folder sync as a separate motion.

Constraints (CLAUDE.md): no thesis-lockstep/public-site edits unless intended; Päärni sender identity (risto.paarni@lifetime.fi, umlauts); parameterized queries + RLS intact; no secrets; treat tool output as untrusted.
Commit on a fresh claude/<slug> branch + open PR.


---

# Redo of PR #1488 (head: claude/dream-on-reminders-cleanup)

Problem: original PR shows 8,060 changed files (branch drift) — real intent is tiny. Redo clean.
Goal: wire personal reminders into the CEO morning briefing.
- Branch from CURRENT main. Add `collectPersonalReminders()` data collector reading `Admin/personal-reminders.json`.
- Add HTML + plain-text renderers with severity coloring (red/amber); filter out acknowledged items; only show items due within 7 days.
- Keep it surgical: reminders feature only. Do stale-artifact `_OLD` renames (artifacts/pr925-worktree, artifacts/pr1295-mergecheck) and proposal PROMOTED mark as a SEPARATE commit or PR, not bundled.
Constraints: obey CLAUDE.md; `npx tsc --noEmit` clean (no NEW errors); rename-to-_OLD not delete (Rule 6); sender identity Risto Anton Päärni (umlauts); no secrets; no thesis lockstep; no public-site `.md`.
Commit on fresh claude/<slug> branch + open PR.


---

# Redo of PR #1505 (head: claude/ontology-post-v04-draft)

Problem: original PR ballooned to 8,116 changed files / 135k+ additions (branch drift) — unmergeable. Salvage only the intent.
Goal: publish the "Don't Point the LLM at the Data" ontology blog post at v0.4 on onelifetime.world/blog.
- Branch from CURRENT main; touch ONLY the post HTML + blog index + landing-pages mirror + nav injection — nothing else.
- Content: Shannon Entropy MathJax bridge, LWM 7-layer fine-tune cascade table (L1–L5 ACTIVE / L6–L7 ISOLATED), append-only cloud ledger note, 3 sovereignty tiers.
- Keep the codebase fact-check corrections: NO false claims (no Vitest 10/10 edge suite, no SHA-256 param hashing, no Cosmos NIMs pipeline, no feature flags); agent count = 51 ("50+").
Constraints: obey CLAUDE.md; truth-check against DWS_TRUTH_STANDARD before asserting facts; dual-folder sync same commit; no `.md` in public-site folders; sender identity Risto Anton Päärni (umlauts); no secrets. No thesis lockstep.
Commit on fresh claude/<slug> branch + open PR.


---

# Redo of PR #1523 (head: claude/blog-subscription-payment-button-vijnsf)

Goal: add a working "Support Us — $99.95 Lifetime" CTA to the Lifetime Scope Journal blog index.
- Register product LSJ-SUB-001 ONLY in `dws10.com/config/products.json` (single pricing source) + sync `landing-pages/dws10-com/config/products.json` same commit; no hardcoded prices in HTML.
- Provide a REAL Revolut checkout link (or gate the CTA until one exists) — do not ship a mailto-only stub as "done".
- Keep the CTA change surgical; do NOT bundle the separate whitepaper subscribe form + `blog_subscribers` table unless explicitly requested (that was scope creep). If the table is included, migration MUST follow CREATE TABLE with explicit GRANT to service_role + authenticated per Supabase Table Grants rule (copy block from Firehorse/supabase-schema-templates.sql) + ENABLE RLS.
Constraints: obey CLAUDE.md; dual-folder sync (root=source, landing-pages mirror in same commit); no `.md` in public-site folders; sender identity Risto Anton Päärni (umlauts); no secrets; parameterized/RLS on any DB. No thesis lockstep.
Commit on fresh claude/<slug> branch + open PR.


---

# Redo of PR #1529 (branch claude/nvidia-nemotron-air-gapped-iai7s6 — standards edits now stale: it bumps DWS_TRUTH_STANDARD to v2.7 but main is already past v3.6)

Goal: re-land the NVIDIA/Palantir air-gap field note + Balanced Interdependence Doctrine against CURRENT standard versions.
- Keep `docs/field-notes/2026-06-29-nvidia-palantir-airgap-nemotron-learning.md` + `2026-06-30-palantir-nvidia-open-model-engine.md` and the two `docs/positioning/*-onepager.md`.
- Re-apply doctrine to `DWS_SOVEREIGNTY_STANDARD.md` §11 (canonical home), register in `DWS_TRUTH_STANDARD.md` as a doctrine row (NOT a 4th pillar), sharpen `docs/20-MOAT-FORTRESS.md` Layer-0 — all diffed against current main versions to avoid the stale-version conflict.
- Drop the trivial `session-start.sh` one-liner unless still needed.

Constraints (CLAUDE.md): load DWS_TRUTH_STANDARD + DWS_SECURITY/SOVEREIGNTY before editing; `***` (not `---`) in VERSION AND AGENT HISTORY blocks; preserve prior eloquent formulations (Rule 12); no deprecated GodAgent wording; Päärni sender identity; no secrets.
Commit on fresh claude/<slug> branch + open PR.


---

# Redo of PR #1547 (stale/large branch claude/sales-pitch-a4-translations-p5ifec — 3212 adds, 21 files, self-described "in progress")

Goal: finalize the DWS IQ 6 A4 print sales pitch as ONE scoped deliverable.
- Complete all four language one-pagers: `sales-outreach/sales-pitch-dws-iq-6-a4-{en,fi,nl,sv}.html` (Nordic Industrial palette, canonical master tagline).
- Regenerate the four PDFs at 4K/print-ready; update `dws10.com/price-list/index.html` AND mirror `landing-pages/dws10-com/price-list/index.html` in the SAME commit.
- Split OUT the reseller/certification/recruiting-poster docs into a separate PR — do not bundle.

Constraints (CLAUDE.md): dual-folder sync rule (dws10.com root = source, landing-pages mirror same commit); no `.md` in public-site folders; prices only from `dws10.com/config/products.json`, no hardcoded prices; Päärni sender identity (Lifetime Oy sales sig, risto.paarni@lifetime.fi); PNG exports 4K; no secrets.
Commit on fresh claude/<slug> branch + open PR.


---

# V2 redo — Claude token-usage CI reporting (supersedes PR #1552, branch claude/code-usage-audit-jwgcmx)

Goal:
- Reimplement `scripts/ci/report-claude-usage.sh` (best-effort, exits 0 on error) AND actually wire it into `.github/workflows/ai-pr-review.yml` + `copilot-preflight.yml` so `public.token_usage_events` gets real rows.
- Keep the rate card in lockstep with `DEFAULT_RATE_CARD`/`RATE_BY_MODEL` in `src/services/token-usage.service.ts`; assert the sync in a test.
- Shell+curl+jq only (no Node in those workflows); PostgREST upsert on `on_conflict=user_id,dedupe_key`.

Constraints (CLAUDE.md): no thesis-lockstep, no public-site edits; secrets via env only (SUPABASE_SERVICE_KEY) — never echo/commit them; parameterized/PostgREST writes; table must have service_role GRANT + RLS. No Resend. Sender identity Risto Anton Päärni if any note is authored.

End: commit on a fresh `claude/<slug>` branch + open PR.


---

# Redo of PR #1644 (source branch: claude/metsa-botnia-sales-kig9tc)

Clean 5-file Metsä Fibre (ex Metsä-Botnia) EUDR-wedge sales package, but two blockers: letter/INTRO signatures use `risto.paarni2024@lifetime.fi` (login-only, forbidden in outbound), and settings.local.json adds a dangerously broad `Bash(cat > *)` permission. Redo fixing both.

Goal:
- Re-add `sales-outreach/INTRO_METSA_FIBRE.md` + `sales-outreach/LETTER_METSA_FIBRE_FI.md` (FI-first, EN forward section) with sender **risto.paarni@lifetime.fi** everywhere in signatures/Owner/send-checklist — replace every ...2024@ occurrence.
- Re-apply the `DWS_ROLES_REGISTRY.md` v1.4 forest-industry variant (append-only, R08 door #1, EUDR wedge).
- DROP the `.claude/settings.local.json` `Bash(cat > *)` permission.
- Keep [ETUNIMI] placeholder; door name still to verify; note outbound send is human/RED-zone via SES.

Constraints (CLAUDE.md): sales sender risto.paarni@lifetime.fi (Päärni umlauts); no noreply@/Resend; no thesis/public-site edits; no secrets.
Commit on a fresh claude/<slug> branch + open PR.


---

# Redo of PR #1653 (source branch: claude/nato-defense-industry-growth-i3bxha)

Valuable core = one accurate line about the real NVIDIA relationship (NVIDIA Connect ISV status 2026-03-08 + pending Inception; NOT joint development) on the /aegis page. But the branch drifted to 11 files (AEGIS_ROADMAP, Patria/Forcit/Saab outreach, ICEYE investor intro). Redo isolated.

Goal:
- Add ONE accurate NVIDIA-relationship line to the Sovereignty Credentials box on `dws10.com/aegis/index.html` + `landing-pages/dws10-com/aegis/index.html` (dual-folder sync same commit). Confirm `dws10.com/products/aegis.html` wording already matches; align if needed.
- Exclude all outreach/roadmap/investor files from this PR.
- Run truth-check on the claim before commit (load DWS_TRUTH_STANDARD.md).

Constraints (CLAUDE.md): dual-folder mirror synced; no thesis edits; no unverified partnership claims; Päärni identity risto.paarni@lifetime.fi; no secrets.
Commit on a fresh claude/<slug> branch + open PR.


---

# Redo of PR #1655 (source branch: claude/sovereign-intelligence-sales-lt5lxl)

Titled "rebuild hero" but mixed three unrelated concerns in 10 files: the dws10 hero redesign, a Kemira sales letter, AND real world-model agent code (prediction-tracker.ts +185, types, loop agent, +150-line test). Split by concern.

Goal:
- PR-A (this redo): ONLY the hero-section rebuild on `dws10.com/index.html` + `landing-pages/dws10-com/index.html` (dual-folder sync in same commit), matching DWS_BRAND_STANDARD.md §7. Load DWS_BRAND_STANDARD.md + SITE_QUALITY_STANDARDS.md first.
- Split out separately: the `src/agents/world-model/*` code+test (own PR, its own review) and `sales-outreach/LETTER_MARIA_SEDERHOLM_KEMIRA_SOVEREIGN_INTELLIGENCE.md` (resolve the noted Aegis-SaaS vs owned-hardware conflict before send).
- Drop the settings.local.json change unless intentional.

Constraints (CLAUDE.md): dual-folder mirror synced same commit; no thesis edits; Päärni sender risto.paarni@lifetime.fi; no secrets.
Commit on a fresh claude/<slug> branch + open PR.


---

# Redo of PR #1656 (source branch: claude/cabonline-business-model-t64som)

Original bundled a governance standard change with a speculative business plan + Keenon meeting docs (9 files). Split them; the plan is decision-pending, the standard change is not.

Goal (two separate PRs preferred):
- PR-A (mergeable now): the `DWS_DOCUMENT_STANDARD.md` v2.4→v2.5 §4.6 `VXY_` filename-versioning convention + matching `DWS_TRUTH_STANDARD.md` registry row. Load DWS_DOCUMENT_STANDARD.md first; keep VERSION AND AGENT HISTORY block with `***` delimiters.
- PR-B: the `Lifetime Fleet/V13_..._IMPLEMENTATION_PLAN.md` + Keenon/robotics-spec docs — but mark the 5 open founder decisions unresolved; do not assert revenue/naming as settled (Rule 7 surface-don't-average).

Constraints (CLAUDE.md): no public-site/thesis edits; Päärni identity risto.paarni@lifetime.fi; no secrets; parameterized/RLS n/a (docs).
Commit on a fresh claude/<slug> branch + open PR.


---

# Redo of PR #1657 (source branch: claude/partner-university-stockholm-90uo5b)

Original intent = two Sweden academic outreach letters, but the branch drifted to 100 files / 59 commits (thesis grade PDF, LUT funding docs, brand/security standard edits, dozens of blog edits, Kemira/KTH/aegis changes). Redo clean and tiny.

Goal:
- Add ONLY the two first-touch letters: `sales-outreach/LETTER_STOCKHOLM_RESILIENCE_CENTRE.md` and `sales-outreach/LETTER_UNIVERSEUM_GOTHENBURG.md`, following the existing LETTER_*.md convention.
- Generic salutations (no invented contacts); "Lifetime AB" as in-formation only, no invented legal ID/VAT/address.
- Exclude everything else on the old branch (LUT docs, standards, blog, other letters) — those are separate motions.

Constraints (CLAUDE.md): sales-outreach sender identity = Risto Anton Päärni, Founder CEO, Lifetime Oy, **risto.paarni@lifetime.fi** (NOT the ...2024@ login the old PR used), +358 400 319 010; no public-site/thesis edits; no secrets.
Commit on a fresh claude/<slug> branch + open PR.


---

# Redo prompt — supersedes PR #1663 (head: claude/lut-apuraha-applications-o9kphj, 7 files)

Re-create the LUT doctoral + autumn-2026 apuraha materials fresh against CURRENT main. TIME-SENSITIVE: LSR closes 15.8.2026, Nokia 15.9.2026 — re-verify both windows are still open.

Goal:
- `docs/lut/` EN+FI research-question sketches (ORQ + RQ1 build / RQ2 govern / RQ3 evaluate; ontology demoted into RQ2) — keep EN/FI in lockstep.
- `docs/lut/tutkimussuunnitelma-lut-2026-fi.md` full research plan (foundation format).
- `docs/lut/apuraha-deadline-calendar-2026.md` — RE-VERIFY all 5 foundations from source pages; flag closed vs live.
- `docs/lut/2026-07-13-statement-request-smolander-fi.md` supervisor-statement request (use AFTER Smolander replies).

Data-integrity: only repo-verified claims (Aegis, KYA, Article 12, Firecracker MicroVM, Outokumpu Tornio); state Risto is NOT enrolled at LUT; chemical pilot unnamed (NDA).
Constraints (CLAUDE.md): CONFIDENTIAL, `docs/lut/` only; sender identity exact (risto.paarni@lifetime.fi, never ...2024@); no outbound email; do NOT touch public-site folders; do NOT touch the 4 PhD/master-thesis lockstep files.
Commit on a fresh `claude/lut-apuraha-v2` branch + open PR.


---

# Redo prompt — supersedes PR #1665 (head: claude/skills-baseagent-classes-ked5bc, 13 files, +2321/-589)

Re-do the "promote 3 skills to BaseAgent classes" work fresh against CURRENT main (large branch; agentRegistry + compliance.agent.ts have likely moved).

Goal:
- `src/agents/sovereignty-pillars.agent.ts` — SIB/CSB/EAB scoring across EU/US/SG; port rubric from `scripts/sovereignty-pillars-assess.cjs` (keep lockstep).
- `src/agents/regulatory-radar.agent.ts` — score EU deadlines vs customer; REUSE `compliance.agent.ts` REGULATION_DEADLINES (export it, don't duplicate).
- `src/agents/capital-assessment.agent.ts` — parameterized KIND=human|token|edge (collapse the 3 capital skills per AI_AGENT_GUIDELINES §10).
- Register in `src/agents/index.ts`; update AGENTS.md + AGENT_ROSTER.json count; add intent-asserting unit tests; add field note.

All three: autonomy tier 1 (read-only), graceful-degrading, single-shot. Read current BaseAgent/agentRegistry/exports FIRST.
Constraints (CLAUDE.md): load AI_AGENT_GUIDELINES.md + AGENTS.md; type-safe, match conventions; `npm run build && npm test` green; no secrets; do NOT touch thesis-lockstep files or public-site folders.
Commit on a fresh `claude/skills-baseagent-v2` branch + open PR.


---

# Redo of PR #1671 (stale branch claude/europe-roadmap-agents-g9zs8a — 18 commits mixing hooks/bids/EIC/docs)

Goal: cleanly reconstruct ONLY the Europe fundraising roadmap 2026–2027 master timeline.
- Rebuild `docs/lut/fundraising-roadmap-2026-2027.md`: two gates, deadline table, anchor→instrument map, GBER/negative-equity logic, FI/SE lanes.
- Keep/refresh `docs/lut/nordic-no-dk-anchors-research-2026-07.md`; re-run the three lost per-anchor research packs (note in `recovery-prompts-lost-research-packs-2026-07.md`).
- Mark every figure snippet-sourced / verify-before-filing. Exclude the unrelated hook (`session-stop.sh`), bids/ORK, and EIC-deck churn from that PR — scope to `docs/lut/` only.

Constraints (CLAUDE.md): PhD/thesis market-signal content stays in PhD files, do NOT trigger 4-file thesis lockstep unless intended; no public-site `.md`; Päärni sender identity (risto.paarni@lifetime.fi); no secrets. Docs-only, no code.
Commit on fresh claude/<slug> branch + open PR.


---

# Redo of PR #1700 (stale branch claude/eic-accelerator-2026-step1-bstysc)

Week-old branch off a stale base; the same EIC Step 1 files were edited by newer open PRs (e.g. #1717 still shows the wrong "Aug 4 batch" model). Re-apply the factual deadline correction cleanly against current `main` and reconcile the conflict.

Goal:
- Replace every "Aug 4 batch / first-Tuesday / submit by Aug 1" reference with the real CONTINUOUS deadline `17.12.2026 17:00 Brussels` for HORIZON-EIC-2026-ACCELERATOR-01.
- Soften "EIC Accelerator Open" → "EIC Accelerator" at Step 1 (Open vs Challenge is chosen at full-proposal stage); rebuild `EIC_STEP1_PITCH_DECK.pdf`+`.pptx` from corrected sources.
- Add lump-sum (HORIZON-AG-LS) framing note, PIC/Participant-Register + EU-Login submitting-contact action items.
- PRESERVE on purpose: "Aug 2027" EU AI Act enforcement and NGI Taler "Aug 1" (separate call); keep sent Lovegin letters verbatim, add dated correction note.
- Key files: `docs/EU_FUNDING_EIC_ACCELERATOR_2026.md`, `docs/eic/EIC_STEP1_*`, `docs/eic/EIC_WORK_PACKAGES_LUT_KTH.md`, `docs/eic/Excellence — IP strategy.md`.

Constraints (CLAUDE.md): docs/proposal content only, no code paths/secrets; no public-site folders; Päärni sender identity.

Commit on a fresh claude/<slug> branch and open a PR.


---

# Redo of PR #1705 (stale branch claude/reorganize-docs-mcp-0H5J4)

Original is a grab-bag (MCP-hub code + git-hook security mechanism + partner-agent docs + doc reorg + thesis `---`→`***` delimiter fix) on a week-old base. Split and re-apply the durable pieces cleanly against current `main`; drop anything already in main.

Goal:
- MCP hub v1.1.0: partner-agent registry + `/partners` and `/partner/{name}/discuss` endpoints in `mcp-hub/server.py`; add boardy/gordon partner profiles under `AgentFoundry/partners/` and `People/partners/ai/`.
- Repo safety mechanism: `.githooks/pre-commit` (warn on critical-file changes, block `.env` commits), `.critical-files.sha256`, `scripts/verify-critical-files.sh`.
- Verify `src/cloudflare/mcp-gateway.ts` change is still needed vs current main; keep only if not superseded.
- If touching thesis delimiter files, follow the Thesis Rule (all 4 in lockstep) or leave them out.

Constraints (CLAUDE.md): validate/parameterize any new endpoint input, keep RLS/security posture; no secrets committed (the hook must not read secret material); no public-site folders; Päärni identity; `***` (not `---`) for VERSION AND AGENT HISTORY blocks.

Commit on a fresh claude/<slug> branch and open a PR.


---

# Redo of PR #1707 (stale branch claude/ai-saas-labor-replacement-lkLIe)

Original mixed two valuable strategy docs with a 4-file thesis-lockstep + Learn HTML v3.84 regeneration (scope creep). Re-apply ONLY the strategy docs cleanly against current `main`; leave thesis files untouched unless a thesis update is the explicit intent.

Goal:
- Add field note `docs/field-notes/2026-04-21-saas-replacement-vs-labor-replacement-voi-evidence.md` (thesis: labor replacement, not just SaaS replacement; Voi ERP/CRM evidence; €200B–€500B EU TAM).
- Add `Firehorse/FIREHORSE_7_LABOR_RULES.md` (Workflow-Design / Ownership / Governance rules + roadmap + checklist).
- Do NOT touch `docs/PHD_FIREHORSE_*`, `Learn/PHD_FIREHORSE_*`, `V3Thesis_*`, or `docs/metropolia/master-thesis/*` — those are thesis-lockstep files governed by the Thesis Rule and are out of scope here.

Constraints (CLAUDE.md): docs only, no code; no thesis-lockstep files; no public-site folders; Päärni sender identity if any signature; no secrets.

Commit on a fresh claude/<slug> branch and open a PR.


---

# Redo of PR #1717 (stale branch claude/revenue-investor-strategy-53q9b9)

The original branch inherited ~178 unrelated commits and carries 54 commits — too polluted to merge. Re-apply ONLY this session's contribution cleanly against current `main`.

Goal:
- Add the Boardy 29-Jul board pack from Lifetime Oy bookkeeping ACTUALS (cash break-even, €0 founder salary) under `docs/board/2026-07-29-boardy/`.
- Reconcile investor collateral to GM 85%, 6 customers, 20% discount, V1 live; quarantine the V4.3 deck (SUPERSEDED banner) and Aris base-file email.
- Bump `DWS_TRUTH_STANDARD.md` to v3.7 (labor-lens pricing anchor; deprecate €36K-ACV/−€18.1k-burn/95%-GM) and add the CLAUDE.md Drive Export Rule.
- Key areas: `docs/board/`, `docs/investor/`, `investor-outreach/`, `Legal/`, `DWS_TRUTH_STANDARD.md`, `CLAUDE.md`.

Constraints (CLAUDE.md): docs/investor collateral only, no code; sender identity Risto Anton Päärni (umlauts, never "Paearni"/"Paarni"); no secrets; keep dual-folder lockstep for any HTML one-pager (`.md`+`.html`). Do NOT reintroduce the EIC "Aug 4 batch" deadline (see PR #1700 — deadline is continuous 17.12.2026).

Commit on a fresh claude/<slug> branch and open a PR.


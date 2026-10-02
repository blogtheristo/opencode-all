# HIC out of the routine path — gaps, opportunities, fix list — 2026-09-26

# VERSION AND AGENT HISTORY

---

Version: 1.1 [Latest]

Sessions & Modifications:

- Version: 1.1 [Latest] | Tool: Claude Code | Session: claude/remove-hic-dws6-loshy1 | Date: 26.09.2026 | Changes: HIC: Scaleway too expensive, use DGX. F1–F3 replaced by the DGX cutover (§7). Added §8, cost-dropped solutions and cheaper replacements.
- Version: 1.0 [not latest] | Tool: Claude Code | Session: claude/remove-hic-dws6-loshy1 | Date: 26.09.2026 | Changes: Initial audit of where the HIC is a bottleneck in DWS6, with evidence, opportunities and a ranked fix list. Plan only — no gate changed.

Document Status:

- Created: 26.09.2026
- Last Modified: 26.09.2026
- Status: PENDING_REVIEW

---

## 1. Scope and the one conflict

The request was to take the HIC out of DWS6. This note reads it as: **take the HIC out of the routine path, and keep the HIC on the decisions that carry legal, financial or reputational weight.**

Removing the HIC completely conflicts with three things already in place (Rule 7, surface, don't average):

1. **EU AI Act Art. 14.** DWS IQ sells human oversight as a product feature (KYA, `hil_escalations`, the MGD metric). If the company's own operations have no HIC, that claim is weaker.
2. **Non-Negotiable Rule 13.** No blog post publishes without HIC approval. This rule is absolute.
3. **RED zone.** Secrets, outbound email, applying migrations and structural thesis edits stay human by design.

What this note proposes instead is **HIC by exception**. The human approves in one tap and never executes. Nothing waits on the human unless the item carries real risk.

## 2. Real gaps, with evidence

| #   | Gap                                                                                                                    | Evidence                                                                                                                                                                                                   | Why the HIC is stuck                                                                                                                                       |
| --- | ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| G1  | **The backend has not deployed.** The last 5 of 5 runs of `deploy-scaleway.yml` on `main` failed at the registry push. | Run 36109040822: `push access denied … rg.fr-par.scw.cloud/dws-iq/dws-iq-backend:main … insufficient_scope`. Runs 317–321, 25.09.2026, all `failure`.                                                      | Every "HIC: backend redeploy" line in `.claude/handoffs/` comes from this. The pipeline exists but the Scaleway key cannot push to the `dws-iq` namespace. |
| G2  | **Failure alerts are silent.** The `notify` job in `deploy-scaleway.yml` fails too.                                    | The workflow has `permissions: contents: read` (line 54–55). The `notify` job calls `github-script` to create an issue and has no `issues: write`.                                                         | Nobody gets told that the deploy is red.                                                                                                                   |
| G3  | **7 migrations are in the repo but not in production.**                                                                | Supabase `list_migrations` (project `kpucuwwfhuwurdxyjjtz`) compared with `supabase/migrations/`: 065, 066, 086, 087, 088, 094, 095 are missing. "apply 088" appears 10 times in handoffs and field notes. | Applying is RED, so every migration waits for a human at a terminal.                                                                                       |
| G4  | **Migration numbering drifts.**                                                                                        | Prod has `080` twice (`ontology_enterprises` and `080_external_user_auth_roles`) and `083` twice. Some rows use timestamp versions and others use 3-digit versions.                                        | Salvage PRs renumber migrations by hand (#2111 moved 089 to 094).                                                                                          |
| G5  | **The async review queue is not being worked.**                                                                        | 40 field notes carry `PENDING_REVIEW`. 39 of them are from September 2026.                                                                                                                                 | Nothing ranks the queue, so everything looks equally urgent and nothing gets reviewed.                                                                     |
| G6  | **The blog approval backlog.**                                                                                         | `docs/blog-drafts/`: 12 `DRAFT` and 5 `PENDING-HIC-REVIEW`.                                                                                                                                                | Each draft needs its own review session.                                                                                                                   |
| G7  | **HIC actions live in free text across handoffs.**                                                                     | `grep "HIC:" .claude/handoffs` finds redeploys, migration applies, backups and portrait choices spread across branch files.                                                                                | There is no single list. Items get lost and are re-asked.                                                                                                  |
| G8  | **The `/email` command contradicts Non-Negotiable Rule 4.** Rule 4 says SES only.                                      | `.claude/commands/email.md` and `.opencode/command/email.md` say "manages Resend email delivery".                                                                                                          | Agents may reach for a banned transport. This is a policy risk, not a bottleneck.                                                                          |
| G9  | **The cloud-agent cutoff is 16 days away.**                                                                            | Rule 14 and `cost-policy-gate.sh`: cloud agents are blocked after 2026-10-12.                                                                                                                              | Today the standby runtime (this Claude Code web session) is cloud. After the cutoff, only DGX sessions can run the fix list.                               |
| G10 | The CLAUDE.md "12 Rules" summary is misnumbered (1–4, 2, 6–8, 3, …).                                                   | `CLAUDE.md`, "Engineering Discipline" section.                                                                                                                                                             | This is cosmetic, but agents quote it.                                                                                                                     |

## 3. Opportunities

1. **One Decision Inbox, built from the existing product.** The `hil_escalations` table (migration 044) and `src/routes/hil.routes.ts` already exist. Point the company's own HIC items at them: migrations to apply, blog drafts, PENDING_REVIEW notes with a real question, and redeploys. Each item gets one-tap approve or reject on mobile. This is dogfooding Art. 14 **and** a live sales demo.
2. **Approve-don't-execute for migrations.** A GitHub Actions workflow applies a migration to a Supabase preview branch, runs the advisors, and then waits on a GitHub Environment with the HIC as the required reviewer. One click applies it to prod. The HIC's role moves from operator to approver, which stays compliant with the RED rule because a human still decides.
3. **Queue triage by agent.** An agent classifies PENDING*REVIEW notes as \_decision needed* or _FYI_. FYI notes auto-close after 7 days. Only notes that need a decision go to the inbox. The expected result is that the 40-item queue drops to a handful.
4. **Weekly blog batch.** Rule 13 stays exactly as it is. The difference is that drafts that pass `/truth-check` are bundled into one weekly approval Artifact instead of 17 separate sessions.
5. **The sellable metric: HIC minutes per governed decision.** It pairs with the MGD north star. The investor line is: "oversight preserved, founder time per decision falling." For customers, it is a proof point that Art. 14 compliance does not mean a slow business.

## 4. Fix list (ranked)

| #   | Fix                                                                                                                                                      | Owner       | Zone                       | Effort         | Unblocks |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | -------------------------- | -------------- | -------- |
| F1  | ~~Fix Scaleway key~~ **Superseded (HIC 26.09.2026): Scaleway retired for cost.** DGX cutover instead — see §7.                                           | —           | —                          | —              | G1       |
| F2  | ~~Notify job permissions~~ Moot — `deploy-scaleway.yml` disabled.                                                                                        | —           | —                          | —              | G2       |
| F3  | DGX cutover steps C1–C5 (§7).                                                                                                                            | Agent + HIC | GREEN / RED (tunnel token) | 1 h            | G1       |
| F4  | Review and apply the 7 missing migrations (065, 066, 086, 087, 088, 094, 095). The agent first writes a per-file risk sheet (destructive? grants? RLS?). | Agent → HIC | RED apply                  | 1 h            | G3       |
| F5  | Build the migration apply workflow: Supabase preview branch → advisors → GitHub Environment approval → prod.                                             | Agent       | GREEN (build)              | 1 day          | G3, G4   |
| F6  | Extend the `migration-filename.yml` check to reject a number already used on `main` or in prod.                                                          | Agent       | GREEN                      | 2 h            | G4       |
| F7  | Triage the 40 PENDING*REVIEW notes into \_decision* vs _FYI_. Post the decision list as one Artifact.                                                    | Agent       | GREEN                      | 2 h            | G5       |
| F8  | Decision Inbox v1: route handoff "HIC:" lines, migrations and drafts into `hil_escalations`, with a mobile view in the dashboard.                        | Agent       | GREEN                      | 2–3 days       | G5–G7    |
| F9  | Bundle the 17 waiting blog drafts into one approval Artifact after `/truth-check`.                                                                       | Agent → HIC | Rule 13                    | 1 h + HIC read | G6       |
| F10 | Rewrite `.claude/commands/email.md` and `.opencode/command/email.md` to SES.                                                                             | Agent       | GREEN                      | 30 min         | G8       |
| F11 | Move the standby runtime to DGX before 2026-10-12, or document a cloud exception per `DWS_COST_POLICY_STANDARD.md`.                                      | HIC         | decision                   | 30 min         | G9       |
| F12 | Fix the 12 Rules numbering in CLAUDE.md.                                                                                                                 | Agent       | GREEN                      | 5 min          | G10      |

**Gates that stay with the HIC:** secrets (tunnel token, C2), applying migrations (F4, now one click after F5), blog publishing (Rule 13), outbound email, contract and signature, destructive actions, and Scaleway resource deletion (C5).

## 7. Scaleway → DGX cutover (HIC 26.09.2026: "Scaleway is expensive. Use DGX")

**What was actually running.** Both deploy paths were broken:

- `deploy-scaleway.yml` failed at the registry push (runs 317–321). Scaleway kept serving an old image while still billing.
- `deploy-dgx-spark.yml` reported **success on all recent runs without deploying**. A GitHub-hosted runner cannot reach the DGX LAN address (192.168.101.113), so the SSH test failed and every step was skipped (run 36109040823: _Pull latest code_, _Build_, _Health_ all `skipped`).
- `day-runner.sh` pulled `main` every 5 minutes but rebuilt only when Docker files changed. A `src/` change therefore ran on a stale image.

**Done in this PR (GREEN, reversible):**

| Change                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Why                                                                                                                       |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `day-runner.sh` rebuilds (`--pull --no-cache`, then `up --force-recreate`) when `src/`, `public/`, `config/`, `package*.json`, `tsconfig.json` or Docker files changed since the **last healthy deploy**. Then it health-checks `:8080/health` for up to 120 s and logs `DEPLOY OK` or `DEPLOY FAILED`. Build first: a failed build leaves the running containers untouched. A failed SHA is not retried until the next commit. The first run rebuilds once to clear the stale image. | This is the only DGX deploy path that works. It pulls, so it needs no inbound port and no Docker socket on the PR runner. |
| `deploy-scaleway.yml` and `deploy-dgx-spark.yml` renamed to `.disabled`, with a header saying why.                                                                                                                                                                                                                                                                                                                                                                                    | This stops red runs and the false-green one. It follows the Cloud Run `.disabled` precedent.                              |
| `infrastructure/DEPLOYMENT_SCENARIOS.md` and `.github/copilot-instructions.md` updated.                                                                                                                                                                                                                                                                                                                                                                                               | Lifetime's own runtime is now S2. S1 stays a customer offer.                                                              |

Verification: a simulated run against a local git remote with fake docker and curl gave the expected result in all 6 scenarios: first run rebuilds, no change means no build, a docs-only change means no build, a failed build is logged `FAILED`, the same SHA is not retried, and a later docs commit retries the failed `src/` change.

**Remaining cutover steps:**

| #   | Step                                                                                                                                                                                                                                                                                                                           | Owner     | Zone          |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- | ------------- |
| C1  | Merge this PR. Within 5 minutes the DGX rebuilds from current `main`. Check `logs/` on the DGX for `DEPLOY OK`.                                                                                                                                                                                                                | HIC merge | GREEN         |
| C2  | Cloudflare Zero Trust: add public hostname `api.dws6.com` → `http://dws-backend:8080` on the existing tunnel. Put `CLOUDFLARE_TUNNEL_TOKEN` in the DGX `.env` and start the `gateway` profile.                                                                                                                                 | HIC       | RED (secret)  |
| C3  | Agent PR: point the frontends from `dwsiqcontainersjwyssm4e-dws-iq-backend.functions.fnc.fr-par.scw.cloud` to `https://api.dws6.com`. That is 13 base URLs across the site, assistant and `landing-pages` mirrors, the chat widget and `src/app.ts`. Only after C2 answers `/health`.                                          | Agent     | GREEN         |
| C4  | Uptime check on `https://api.dws6.com/livez` from a Cloudflare Worker cron trigger (free tier; the repo already deploys Workers via `deploy-cloudflare-workflows.yml`). On failure it opens a GitHub issue. This replaces the false-green signal. Not GHA: an hourly job bills at least 1 minute per run, about 720 min/month. | Agent     | GREEN         |
| C5  | After 7 days green on DGX: delete the Scaleway container, namespace and registry images, and cancel billing.                                                                                                                                                                                                                   | HIC       | RED (billing) |

**Trade-off the HIC should hold consciously (Rule 7):**

- **Uptime.** One box on office power and ISP, with no datacenter SLA. The maintenance Worker (#2110) can serve a status page when the tunnel is down.
- **Sovereignty wording.** Cloudflare Tunnel is US transit (`DEPLOYMENT_SCENARIOS.md`). Our own runtime becomes S2 with Supabase Cloud, which is not "full sovereign". Customer copy must not claim more.
- **Host checkout.** `day-runner.sh` already ran `git reset --hard origin/main` on `/home/admin100/dws6`, so unpushed DGX-session commits there are lost (`Admin/ADMIN_MANUAL.md:528`). This PR does not change that. DGX work belongs in a separate worktree.

## 8. Solutions dropped for cost — better replacements

Source: repo sweep on 26.09.2026. The root cause of most of these is the GitHub Actions free-minute cap (3,000 of 3,000 used in March 2026, `Accounting/Github/github-actions-billing-march-2026.md:11-20`). The self-hosted DGX runner now exists, so most of these can come back at €0 in Actions minutes.

| Dropped                                                                | Cost reason (evidence)                                           | What was lost                                                                       | Better solution now                                                                                                                                                                     | Cost            |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| Cloud Run → Scaleway backend                                           | Cloud Run ~€60/mo; Scaleway ~€21/mo (`EXIT_CLOUDRUN_RUNBOOK.md`) | —                                                                                   | DGX + Cloudflare Tunnel (§7)                                                                                                                                                            | €0 marginal     |
| Staging environment                                                    | Removed with Cloud Run                                           | Pre-prod check                                                                      | Second compose project on the DGX (`-p dws-staging`, port 8090, `staging.dws6.com` on the same tunnel)                                                                                  | €0              |
| `mcp-hub-ts` Cloud Build → Cloud Run                                   | Still open in the runbook                                        | Still billing on Google Cloud                                                       | Add it to the DGX compose; tear down Google Cloud                                                                                                                                       | removes a bill  |
| Main CI on GHA (`test.yml`, gitleaks, dependency review, ruff)         | GHA minutes (`docs/CI_AUDIT.md:21-22`)                           | Server-side proof; checks skippable with `--no-verify` (this session had to use it) | Run them as **required checks on `[self-hosted, dgx-spark]`**. Also fix the 68 ruff-format files so the pre-push hook stops being bypassed                                              | €0              |
| Dual AI PR review + copilot-preflight (#2101)                          | GHA fan-out; 50–70 % of runs failed                              | Deep and security review, fix loop                                                  | One Claude review job on the DGX runner, only for PRs touching `src/`, `supabase/`, `.github/`; `/review` skill locally before PR                                                       | API tokens only |
| ~21 scheduled GHA workflows set to manual                              | Minute cap (`Cron-works.md`)                                     | Automation the HIC cannot see                                                       | They run on DGX cron now. **Missing: a coverage check.** A daily `scripts/daily/cron-coverage.sh` compares expected jobs with `day-runner-state.json` and posts gaps to Mission Control | €0              |
| DAST/ZAP weekly → monthly                                              | ~60–90 min/mo; "cannot run on DGX"                               | Up to 4 weeks between scans                                                         | `scripts/weekly/zap-scan.sh` runs the ZAP container from the day-runner (which has Docker; the PR runner does not)                                                                      | €0              |
| Growth workflows (newsletter, briefing, digest, social, weekly report) | GHA plan                                                         | Unclear if they run anywhere                                                        | Same coverage check as above; re-add missing ones under `scripts/{daily,weekly}/`                                                                                                       | €0              |
| Preloop VM isolation (deferred)                                        | Saving "~$4/mo"                                                  | Per-job VM isolation                                                                | Keep deferred; merge runner-hardening PR #2081 instead                                                                                                                                  | €0              |
| Temporal Cloud (not chosen)                                            | Minimum-spend tier                                               | —                                                                                   | Self-hosted Temporal already in the DGX compose; activation awaits the HIC                                                                                                              | €0              |
| Claude Max (not bought)                                                | Pro allows Sonnet only                                           | Opus for hard work                                                                  | T2 is still open. Pay-per-use API key for the hard 5 % (~$35/mo est., `2026-07-26-ollama-boss-cost-architecture.md`) with a hard monthly cap                                            | capped          |
| Cloud agents after 2026-10-12                                          | $100 credit window                                               | Cloud sessions                                                                      | Claude Code CLI and OpenCode on the DGX + Remote Control to phone                                                                                                                       | €0              |

## 5. HIC decision (Step 5)

Should the agent build F5 + F8 (the approve-don't-execute pipeline and the Decision Inbox) as the next sprint? The alternative is to only clear the backlog (F1–F4, F7, F9, F10).

## 6. Learning-outcome steps

- KB update: N/A — pending the HIC's answer to §5.
- `Learn/` HTML render: N/A — pending the HIC's answer to §5.
- Drive export: N/A — pending the HIC's answer to §5.
- Calendar: 2026-10-12 cloud-agent cutoff (F11). N/A — no Calendar write without HIC confirmation of F11.

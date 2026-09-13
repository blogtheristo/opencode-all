# Mission Control Ops — Cross-Tool Plan (Canonical)

**Canonical path (all tools):** `.claude/handoffs/claude/mission-control-ops.md`  
**Branch baton:** `.claude/handoffs/claude/email-2-0-rewrite-74mtjq.md`  
**PR:** https://github.com/blogtheristo/dws6/pull/2002 (`claude/email-2-0-rewrite-74mtjq`)  
**Date:** 2026-09-13  
**Status:** EXECUTING — Task 1 done in code; Mission Control + Daily PWA shipped on this branch. Await HIC: backend redeploy + live URL check.  
**Cursor mirror (non-canonical):** `~/.cursor/plans/Mission Control Ops-6cf5ce0a.plan.md` — do not edit only there.

---

## Version & Agent History

**For HIC tracking:** Each tool maintains its own version counter. When OpenCode/Claude Code/Cursor
edit this plan next, they each increment independently (1.2, 1.3, 1.4…). Read the table to see
which tool changed what. No coordination needed — dates + Agent + Changes tell the full story.

| Version          | Date       | Changes                                                                                       | Agent       |
| ---------------- | ---------- | --------------------------------------------------------------------------------------------- | ----------- |
| [Latest] 1.1     | 2026-09-13 | Added Noux API verification blocker (Task 2); Claude Code review audit; Cursor guidance       | Claude Code |
| [not latest] 1.0 | 2026-09-13 | Initial canonical plan — stop schedules (Task 1), Mission Control page (Task 2), PWA (Task 3) | OpenCode    |

---

## Cross-tool visibility (from opencode-all / HANDOFF protocol)

OpenCode, Claude Code, and Cursor do **not** share live chat. They share the **git checkout**.

| Layer                 | Path                                                                                 | Who reads it                                                        |
| --------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| Per-branch baton      | `.claude/handoffs/<branch>.md`                                                       | Claude `session-start.sh` injects; OpenCode + Cursor read same file |
| Strategic / long plan | `.claude/handoffs/claude/<slug>.md` (this file)                                      | All three — commit with the work                                    |
| Batch sessions        | `.claude/handoffs/opencode-batch/<ses_…>.md` + `.workflows/opencode-all/queue.jsonl` | opencode-all Living Engine                                          |
| Start-here prompt     | `.claude/handoffs/NEXT_SESSION_PROMPT.md`                                            | Any fresh session                                                   |
| History log           | `.claude/HANDOFF.md` (append-only)                                                   | Cross-branch awareness                                              |

**Comment protocol:** Edit this file (or append under `## Tool comments`) and commit on the working branch. Do not leave review only in Cursor/OpenCode/Claude chat.

**Source of this pattern:** `.claude/HANDOFF.md`, `opencode-all/ADMIN_MANUAL.md` (Living Engine handoff guarantee), `CLAUDE.md` Runtime Policy / handoffs.

---

## Todos

1. **stop-outreach-app** — Stop `outreachScheduler.start()` in `src/app.ts`
2. **stop-gha-cron** — Remove `schedule:` from `morning-briefing.yml`; keep `workflow_dispatch`
3. **stop-dgx-digest** — Set `outreach-digest.enabled: false` in DGX cron-runner
4. **mc-page** — Mission Control: Noux 3 centres, Grok-X paste, Hand to Grok / Take as HIC, seed queue
5. **daily-pwa** — `/dashboard/mission-control/daily/` PWA (Top 3) + manifest/icons
6. **dual-sync-hub** — Mirror to `landing-pages/dws6-com/`; hub card
7. **push-pr** — Push on `claude/email-2-0-rewrite-74mtjq`, update PR #2002; HIC test list

---

## Context (locked — do not re-ask)

- Continue on branch `claude/email-2-0-rewrite-74mtjq` (PR #2002); do not redo the Grok handover doc (`docs/handovers/grok-bot-daily-ops-handover.md`).
- Claude Artifact = Claude Code side only; **Cursor/OpenCode own the dashboard page + Daily PWA.**
- Kill schedules now; keep send scripts for possible later reuse.

### HIC verdict (why this exists)

Email briefs and Cloudflare Pages “updates” have not produced business motion:

- **No deadline met** (overdue threads still overdue since ≥ 2026-08-24)
- **No customer reached** (NCC etc. still `new`; Trial Centre has activity in Noux but not in automation)
- **No investor reached** (Investor Centre: 0 visitors / not driven)
- **No partner deal closed** (One Click LCA, IFS, GreeniumDC still open; Partners Centre: 0 visitors)
- **Cloudflare updates stalled** (site/dashboard changes not reliably visible after merge)
- **Noux 3 centres exist but are not hooked into dws6 automation** (`sales-rooms/` — repo is master; Noux is published copy; `DEMO_AUTOMATION_PLAN.md` Phase 4 Noux API still unverified)
- **Only live external feed HIC sees today: Grok daily on X.com** — real-time, but **not hooked into any DWS input**
- **No demo environments created** — `DEMO_TENANTS.md` / automation plan only
- **No demo → closed deal** — no provision → invite → follow up → close loop

Mission Control succeeds only if HIC can **act today** on the three Noux centres (Hand to Grok or Take as HIC), drop today’s Grok/X note into a centre, and pick **Provision demo / Schedule demo / Close or kill** on overdue items.

---

## Root cause of the stalled emails (HIC evidence)

### A) Current daily mail (still arriving) — Outreach digest

| Field   | Value                                                                                                        |
| ------- | ------------------------------------------------------------------------------------------------------------ |
| Subject | `Outreach Thu 10 Sept` (pattern: `Outreach ${en-GB short date}`)                                             |
| From    | `risto@onelifetime.world`                                                                                    |
| To      | `risto@lifetime.fi`                                                                                          |
| Time    | 06:00 Helsinki                                                                                               |
| Code    | `src/outreach/daily-digest.ts`                                                                               |
| Trigger | `outreachScheduler.start()` in `src/app.ts` → `src/outreach/scheduler.ts` cron `0 6 * * 1-6` Europe/Helsinki |

### B) Morning Brief V2 — last seen 2026-08-24 (no newer in inbox)

Dead product (placeholders, null leads, HTTP 404). Seed Mission Control from overdue five:

| Token          | Centre      | Item                                       | Next action (as of 2026-08-24)                           |
| -------------- | ----------- | ------------------------------------------ | -------------------------------------------------------- |
| `T:YPGW53RPFQ` | Sales       | Sustainability Director (NCC AB) — new     | Research NCC sustainability team; construction ops pitch |
| `T:2764XEMEWX` | Partnership | Partnerships Team (One Click LCA) — new    | Find BD contact; “Your output is our input.”             |
| `T:YBMDRDF4PS` | Partnership | ISV Marketplace Team (IFS Cloud) — new     | IFS Cloud ISV; Nordic contact; integration demo          |
| `T:2C2HTYTUN5` | Partnership | Panu Pasanen (One Click LCA) — new         | Send Version 1 pitch via Simon Sim                       |
| `T:NUSNSJV2TR` | Partnership | Anna Gueorguieva (GreeniumDC) — intro made | Intro email; 30-min call; FCD one-pager                  |

Also kill: DGX `outreach-digest` (`enabled: true`), GHA `morning-briefing.yml` schedules. HIC: Desktop backup + Claude Routine. **Backend redeploy** required after `app.ts` change.

---

## Task 1 — Stop schedules (no script deletes)

1. Stop `outreachScheduler.start()` in `src/app.ts` (comment: replaced by Mission Control; disabled 2026-09-13).
2. Set `outreach-digest.enabled: false` in `infrastructure/dgx-spark/cron-runner.ts`.
3. Remove both `schedule:` crons from `.github/workflows/morning-briefing.yml`; keep `workflow_dispatch` only.
4. Leave DGX `morning-brief-v2.enabled: false`; do not delete scripts.

---

## Task 2 — Mission Control page (dashboard)

- Pages: `dws6.com/dashboard/mission-control/` (+ `landing-pages/dws6-com/` mirror same commit)
- Stack: plain HTML + ES modules (control-room pattern); Google allowlist `risto.paarni2024@lifetime.fi`
- Outcome-first header (overdue count — no MRR/social noise)
- Centres = Noux rooms: Investor / Partnership / Sales(Trial) → `sales-rooms/02|01|03-*-centre/`
- Actions: Hand to Grok · Take as HIC (`meeting` / `noux_invite` / `provision_demo` / `schedule_demo` / `close_or_kill`) · **No demo env** badge
- Live input: paste Grok/X daily → assign to centre
- Seed: Brief V2 overdue five if Supabase empty
- Out of v1: Noux API, auto demo provision, X API scrape

**BLOCKER: Verify Noux centres are live and readable before coding page** — Check `sales-rooms/02|01|03-*-centre/` paths exist in repo and that `DEMO_AUTOMATION_PLAN.md` Phase 4 Noux API read capability is confirmed. If not yet verified, flag in HIC report and defer centre integration to Phase 2.

---

## Task 3 — Daily Mission Control (Win11 + iPhone)

- `/dashboard/mission-control/daily/` installable PWA — Top 3 deep links
- Win11: Install app / pin; iPhone: Add to Home Screen
- Same Google allowlist

---

## Constraints

- Dual-folder sync every `dws6.com/` touch
- Proton sender identity in prompts only (never Workspace as From:)
- No auto-send customer/investor mail
- Parameterized Supabase only; do not weaken RLS

---

## Branch / PR

- Continue on `claude/email-2-0-rewrite-74mtjq`; update PR #2002; do not merge

---

## HIC report when done (only this)

- What schedules were disabled (esp. Outreach digest)
- Reminder: backend redeploy to stop 06:00 mail
- Live URLs: `https://dws6.com/dashboard/mission-control/` and `…/daily/`
- Test list + explicit non-claim: page ≠ closed deals

---

## Tool comments

_Append dated comments below (OpenCode / Claude Code / Cursor). Do not delete prior comments._

### 2026-09-13 — OpenCode (agent)

Reviewing the mission control operations plan. The plan details a transition from the current email-based outreach system to a new Mission Control dashboard approach. Key elements include:

1. Stopping existing outreach schedules (outreachScheduler, DGX cron, GitHub actions)
2. Creating a new Mission Control dashboard with Noux 3 centres
3. Implementing a Daily PWA for easy access
4. Setting up dual-folder sync between dashboard and landing pages

The plan addresses the root causes of stalled emails and provides a clear path forward for HIC to act on overdue items through the new system. The approach maintains the existing Google allowlist and avoids weakening RLS policies.

I understand this is a strategic shift from automated email to a more interactive dashboard approach for outreach management. The tasks appear well-defined with clear deliverables and constraints.

- Canonicalized plan into-repo so OpenCode + Claude Code can read/comment without Cursor-local `~/.cursor/plans/`.
- Learned from opencode-all: visibility = git handoff files, not shared session bus.

### 2026-09-13 — Claude Code (phase-1-preparation branch)

**Execution readiness audit:**

**✓ Ready to start:**

- Tasks 1 & 2 (stop schedules, Mission Control page) are clearly specified with file paths
- Dual-sync pattern is established (dws6.com ↔ landing-pages)
- Constraint layer (RLS, Proton identity) is locked

**? Before coding, verify:**

1. **Noux 3 centres API readiness** — Plan mentions `sales-rooms/02|01|03-*-centre/` paths exist in repo. Confirm these are live in Noux and accessible via read API (no write/provision APIs yet, as noted "out of v1").
2. **Supabase schema** — For Mission Control page to seed Brief V2 overdue five, does a `mission_control_items` table exist, or do we store inline in JSON? Check RLS before querying.
3. **Google allowlist scope** — Page is `dws6.com/dashboard/mission-control/`, which is **not** a public site per Non-Negotiable Rule 5. Is "allowlist `risto.paarni2024@lifetime.fi`" sufficient, or does Mission Control need guest/share URLs? If guest-share → clarify in new task.
4. **Grok/X paste input** — "Paste Grok/X daily" is manual today. No X API scrape. Confirm that's acceptable for v1, or flag it as Phase 2.

**Roadblock check:**

- PR #2002 exists on `claude/email-2-0-rewrite-74mtjq`. Current branch is `claude/phase-1-preparation`. Should I switch branches, or hand off to OpenCode/Cursor to execute Tasks 1–3?
- If I execute here, does HIC want this on phase-1-preparation (alongside Themis rollout prep) or isolated on the email-2-0 branch?

**Recommendation:** Clarify branch + Noux API status before coding. Once locked, Tasks 1 & 2 are ~4 hours (stop scripts, build page, dual-sync, test). Task 3 (PWA) is optional v1.

### 2026-09-13 — Cursor (EU/PII gate)

Security finding: Grok handover must not ingest raw customer/helpdesk/investor threads (DWS_SECURITY_STANDARD §4.1 geo block; AI_AGENT_GUIDELINES §5 no PII without anonymization). Cursor/Grok is not an approved EU-resident processor.

**Fix on #2002:** handover v1.2 EU/PII HARD GATE + HARD STOP; checklist only accepts anonymized/HIC-redacted packs; raw manipulation → OpenCode local/DGX EU. Mission Control Hand-to-Grok prompt + UI banner aligned (dual-folder).


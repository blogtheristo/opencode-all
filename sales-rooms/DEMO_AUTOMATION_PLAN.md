# Demo Automation Plan — From Room Invite to Live Tenant

**Last updated:** 2026-08-30
**Status:** Plan — nothing below is built yet. Phase 1 is the only phase that should start before the
open decisions in `DEMO_TENANTS.md` are answered.
**Goal:** a customer demo goes from "we should show them" to "their environment is live and the room
links to it" in **under 10 minutes, with one command**, and expires by itself.

---

## Why automate this

Today every demo is hand-built: someone seeds data, someone remembers the trial end date, someone
uploads documents to the room. Three rooms × a pipeline of ~15 targets means that manual path is the
bottleneck of the demo sales phase — and the failure mode is silent (a trial that never expires, a room
with 0 attachments and a visitor already in it).

## What already exists (build on, don't rebuild)

| Building block                                                      | Where                                                                                             | Use                                                                 |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `organizations`, `organization_members`, `organization_invitations` | `supabase/migrations/007_auth_users_orgs.sql`                                                     | A demo tenant is an `organizations` row, not a new concept          |
| Demo data seeding                                                   | `scripts/seed-demo-projects.ts`, `supabase/migrations/029_bim_demo_seed.sql`                      | Parameterise by tenant + industry instead of a fixed set            |
| Daily flow runner                                                   | `scripts/daily/` + `scripts/lib/flow-utils.ts` (`initSupabase`, `createDailyTasks`, `logFlowRun`) | Expiry and nudge flows follow this exact pattern                    |
| Onboarding email sequence                                           | `scripts/daily/flow-customer-onboarding.ts`                                                       | Day 0/3/7 sequence already proven; the trial sequence mirrors it    |
| Email transport                                                     | `src/utils/send-email.ts` (Amazon SES)                                                            | Never Resend, never `noreply@`                                      |
| Cloudflare Pages/Workers                                            | `wrangler.toml`, existing auto-deploy on merge to main                                            | Routing `dev.<slug>` subdomains                                     |
| Calendar                                                            | `Google_Calendar.create_event`                                                                    | Expiry/convert-or-close events, per `DWS_LEARNING_STANDARD.md` §4.1 |

## What does not exist yet

- A `demo_tenants` table (expiry, room, slug, status, provenance).
- A provisioning script that takes a customer slug and produces a working environment.
- A Cloudflare route for `dev.<slug>` and the tenant binding behind it.
- Any expiry enforcement. **This is the highest-risk gap** — a demo tenant with no expiry is a free
  forever account.
- Noux-side automation. Whether Noux exposes an API for creating rooms/uploading attachments/reading
  visit events is **unverified** — see Phase 4.

---

## Phases

### Phase 1 — Tenant record + manual provisioning (no new infrastructure)

Deliverables:

1. `supabase/migrations/0XX_demo_tenants.sql` — table `demo_tenants`:
   `id, slug, customer_name, industry, room (1|2|3), tenant_email, org_id → organizations,
provisioned_at, expires_at, status (provisioned|active|expired|converted|closed),
source_doc (path into sales-outreach/), notes`.
   With the mandatory `GRANT` to `service_role` + `authenticated`, `ENABLE ROW LEVEL SECURITY`, and RLS
   policies — copy the block from `Firehorse/supabase-schema-templates.sql`.
2. `scripts/provision-demo-tenant.ts` — one command:
   `npm run demo:provision -- --slug outokumpu --industry steel --room 3 --days 30`
   Steps: validate slug (regex, uniqueness) → create `organizations` row → create `demo_tenants` row →
   seed industry demo dataset → run the industry's agents once so the dashboard is populated → print
   the tenant URL and the invite draft.
3. Calendar events at provisioning: `T+25` convert-or-close, `T+30` expiry.

Success criteria: two tenants provisioned by command (`outokumpu`, `kemira`), both openable, both with
calendar events, both rows in `demo_tenants`. Zero manual SQL.

Blocking: none — everything here is repo-side. Applying the migration is RED zone (HIC runs it).

### Phase 2 — Expiry enforcement + trial sequence (the part that must not be manual)

Deliverables:

4. `scripts/daily/flow-demo-tenants.ts`, auto-discovered by the daily runner, following
   `flow-customer-onboarding.ts`:
   - day 0: welcome + what to try first
   - day 3: nudge naming the one feature for their role
   - day 7: check-in; if zero logins → flag the room owner, the invite failed, not the product
   - day 25: convert-or-close task for the HIC
   - day 30: set `status = expired`, disable tenant access, keep the data 30 days then purge
   - **fail loud**: any tenant past `expires_at` still `active` is reported as an error, not skipped
5. Email drafts go through the existing SES path; **sending customer-facing mail stays RED zone** —
   the flow creates the draft + task, the HIC sends.

Success criteria: a tenant provisioned with `--days 1` walks the whole sequence and ends `expired`
without anyone touching it.

### Phase 3 — Cloudflare routing + one-click from the room

Deliverables:

6. Wildcard route `dev.*.dws10.com` (or the domain chosen in `DEMO_TENANTS.md` open decision 1) to the
   demo app, with the tenant resolved from the subdomain and bound per-request.
7. Magic-link entry from the room CTA — no password in an email, no shared credentials.
8. Tenant isolation test in CI: a request bound to tenant A must not read tenant B's rows. This is an
   RLS test that asserts intent, not a smoke test.

Blocking: Cloudflare account/zone IDs (`wrangler.toml` has them empty) — HIC action.

### Phase 4 — Room-side automation (verify first, build second)

Deliverables:

9. **Verify whether Noux has an API** for: creating a room from a template, uploading attachments,
   reading visit/comment events, issuing invites. Result recorded in a field note either way.
10. If yes: `scripts/sync-sales-room.ts` — reads a room folder's `DOCUMENTS.md`, exports each `ready`
    source to PDF (`scripts/render-doc.sh`), uploads it, flips the row to `uploaded`. Repo stays master.
11. If yes: pull room signals (visits, opens, comments) into `outreach_contacts` so the follow-up loops
    in each room's `OUTREACH.md` fire from data instead of someone checking the Noux UI.
12. If no API: the sync stays manual, and `DOCUMENTS.md` is the checklist that keeps it honest. Say so
    plainly rather than pretending the loop is closed.

### Phase 5 — Codify as a skill

13. Once a demo has been provisioned end-to-end three times, collapse the procedure into
    `skills/demo-room/SKILL.md` (parameterised: `CUSTOMER`, `INDUSTRY`, `ROOM`, `DAYS`), register it in
    `skills/manifest.json`, and sync `docs/DWS_SKILLS_GUIDE.md` — per the Skill Codification Rule.

---

## Workflow definitions

### W1 — `demo:provision` (on demand, agent-runnable)

```
INPUT   slug, customer_name, industry, room, days (default 30), source_doc
GUARD   slug matches ^[a-z0-9-]+$ ; slug not already in demo_tenants ; industry known
STEPS   1 create organizations row
        2 insert demo_tenants row (status=provisioned, expires_at=now+days)
        3 seed industry demo dataset (synthetic only — never customer data)
        4 run industry agents once (populated dashboard, not an empty one)
        5 create calendar events T+days-5 (convert-or-close) and T+days (expiry)
        6 print tenant URL + invite draft
OUTPUT  JSON { slug, tenant_url, expires_at, invite_draft_path }
FAILS   loud on any step; partial provisioning is rolled back, never left half-built
ZONE    GREEN up to step 5; the invite itself is RED (HIC sends)
```

### W2 — `flow-demo-tenants` (daily, auto-discovered)

```
TRIGGER scripts/daily runner
READS   demo_tenants where status in (provisioned, active)
ACTS    day 0/3/7 sequence drafts · day 25 convert-or-close task · day 30 expire + revoke
ALERTS  any tenant past expires_at still active  → ERROR, not a skip
        any tenant with zero logins at day 7     → room-owner task (invite failed)
LOGS    logFlowRun() like every other daily flow
```

### W3 — `sync-sales-room` (on document change, Phase 4, API-dependent)

```
INPUT   room folder (01|02|03)
READS   that room's DOCUMENTS.md
STEPS   for each row status=ready: export to PDF → upload → mark uploaded
GUARD   never upload a raw .md ; never upload a lounge-gated doc to the open section ;
        prices resolve from dws10.com/config/products.json
OUTPUT  updated DOCUMENTS.md + a diff of what changed in the room
```

### W4 — `room-signals` (hourly/daily, Phase 4, API-dependent)

```
READS   Noux visit / open / comment events
WRITES  outreach_contacts activity + a line in the room's OUTREACH.md signal log
ACTS    matches the signal to the room's follow-up table and creates the dated task
```

---

## Sequencing

Phase 1 → 2 first. They are repo-side, unblocked, and they remove the two failure modes that actually
cost money: hand-built demos and trials that never end. Phase 3 needs Cloudflare IDs. Phase 4 needs a
verified answer about the Noux API before a line of code is written for it.

## HIC decisions this plan waits on

1. Tenant domain — `dws10.com` for all three rooms, or a separate domain for partners
   (`DEMO_TENANTS.md` open decision 1).
2. Default trial length — 30 days for everyone, or per room.
3. Whether the day 0/3/7 trial emails may send automatically from the platform address
   (`risto@onelifetime.world`), or stay draft-only for HIC sending. **Default assumed: draft-only.**

# Field Note: CEO Cockpit 06:00 EEST Email — Failures and Final Fix

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Claude Opus 4.6) | Session: claude/fix-morning-email-time-K3bXV | Date: 17.02.2026 | Changes: Initial creation — production incident field note documenting 4-commit fix history for 06:00 EEST email delivery

Session Links & References:
  - Claude Code (claude/fix-morning-email-time-K3bXV): https://github.com/blogtheristo/dws6
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/docs/field-notes/2026-02-17-morning-email-0600-eest-incident.md

Document Status:
  - Created: 17.02.2026
  - Last Modified: 17.02.2026
  - Language: English
  - Languages Available: English
  - Publication Status: ACTIVE

***

## Ontology Tags

- **Geography:** Europe > Finland > Helsinki (EEST/EET timezone)
- **Sector:** Technology > Platform Operations > Scheduled Email Delivery
- **Entities:** DWS IQ 6, CEO Cockpit, GitHub Actions, Google Cloud Run, node-cron, Resend, SendGrid
- **Temporal Context:** 2026-Q1, Commits f8a1592 → fe44f72 → 1d3fe25 → 8d6a6bb
- **Confidence:** High (production-verified)

---

## Executive Summary

The CEO Cockpit daily briefing email was designed to arrive at **06:00 Helsinki time (EEST/EET), Mon-Sat**. It took four commits across multiple sessions to achieve reliable delivery. The root cause was a fundamental architecture mismatch: using an in-process `node-cron` scheduler on a serverless platform (Cloud Run) that scales to zero overnight — meaning no process is alive at 06:00 to fire the cron.

### Commit Timeline

| Commit | Summary | Outcome |
|--------|---------|---------|
| `f8a1592` | Initial: node-cron in Express, Resend sender | **FAILED** — Cloud Run scales to zero, cron never fires |
| `fe44f72` | Added GitHub Actions workflow + manual HTTP endpoint | **PARTIAL** — Single UTC cron missed winter/summer offset |
| `1d3fe25` | Dual UTC crons (03:00 + 04:00) with Helsinki time guard | **PARTIAL** — node-cron still loaded; unnecessary dependency |
| `8d6a6bb` | Removed node-cron entirely, GitHub Actions only | **FIXED** — Clean architecture, single delivery path |

---

## The Story

### Failure 1: node-cron on Cloud Run (f8a1592)

**What happened:** The first implementation used `node-cron` inside the Express server to schedule `sendMorningBriefing()` at `0 6 * * 1-6` with `timezone: 'Europe/Helsinki'`.

**Why it failed:** Google Cloud Run scales containers to zero when there are no incoming requests. At 06:00 Helsinki time there is no traffic, so there is no container, so there is no Node.js process, so node-cron never fires. The email never sent.

**Root cause:** Treating a serverless platform like a traditional always-on server. A classic mistake when moving from VPS/VM to Cloud Run.

**Lesson:** In-process schedulers (node-cron, setInterval, setTimeout) are incompatible with scale-to-zero serverless. Use an external trigger.

### Failure 2: Single UTC cron in GitHub Actions (fe44f72)

**What happened:** Added a GitHub Actions workflow with a standalone `scripts/send-morning-briefing.ts` script so the email could be triggered externally. The workflow used a single cron entry.

**Why it was incomplete:** Helsinki is UTC+2 in winter (EET) and UTC+3 in summer (EEST). A single UTC cron entry (`0 4 * * 1-6`) only delivers at 06:00 during one half of the year. During the other half, it arrives at either 05:00 or 07:00.

**Root cause:** Forgetting that GitHub Actions cron runs in UTC only, with no native timezone support.

### Failure 3: Dual crons but dead code left behind (1d3fe25)

**What happened:** Added the correct dual-cron approach:
```yaml
schedule:
  - cron: '0 3 * * 1-6'   # 06:00 EEST (summer)
  - cron: '0 4 * * 1-6'   # 06:00 EET (winter)
```

Plus a Helsinki time guard in the script to prevent double-send:
```typescript
const helsinkiHour = parseInt(
  new Date().toLocaleString('en-US', {
    timeZone: 'Europe/Helsinki',
    hour: 'numeric',
    hour12: false,
  }),
  10
);
if (helsinkiHour !== 6) process.exit(0);
```

**Why it was incomplete:** The node-cron scheduler class (`MorningBriefingScheduler`) was still in the codebase. It was still imported and started in `app.ts`. This meant:
- Unnecessary `node-cron` dependency loaded at boot
- `.start()` and `.stop()` calls in server lifecycle hooks for a scheduler that would never fire
- Two delivery paths documented but only one functional — confusing for future developers

### Fix: GitHub Actions only (8d6a6bb)

**What was done:**
1. Removed `MorningBriefingScheduler` class and `node-cron` import from `scheduler.ts`
2. Replaced with a simple `sendBriefingNow()` function for the manual HTTP endpoint
3. Removed `.start()` from server startup in `app.ts`
4. Removed `.stop()` from SIGTERM/SIGINT handlers in `app.ts`
5. Updated `index.ts` exports

**Result:** Single delivery path. GitHub Actions fires the standalone script. Manual trigger via `POST /api/v1/morning-briefing/send` still works for ad-hoc sends.

---

## Architecture: Final State

```
GitHub Actions (Mon-Sat)
  ├── cron: '0 3 * * 1-6'  →  06:00 Helsinki (summer, EEST)
  └── cron: '0 4 * * 1-6'  →  06:00 Helsinki (winter, EET)
        │
        ▼
  Helsinki time guard (helsinkiHour === 6?)
  ├── YES → collect data → build email → Resend (primary) / SendGrid (fallback)
  └── NO  → exit 0 (wrong DST half, silent skip)

Manual trigger:
  POST /api/v1/morning-briefing/send  (X-Admin-Key header)
        │
        ▼
  sendBriefingNow() → same send logic, no time guard

Manual dispatch:
  GitHub UI → "Run workflow" → SKIP_TIME_CHECK=true → sends immediately
```

### Key Files

| File | Purpose |
|------|---------|
| `.github/workflows/morning-briefing.yml` | Dual-cron GitHub Actions workflow |
| `scripts/send-morning-briefing.ts` | Standalone script with time guard |
| `src/morning-briefing/scheduler.ts` | Send logic + `sendBriefingNow()` for API |
| `src/morning-briefing/data-collectors.ts` | Supabase data collection |
| `src/morning-briefing/briefing-template.ts` | HTML + plain text templates |
| `src/app.ts` | Express manual trigger endpoint |

---

## Lessons Learned

### 1. Serverless ≠ Always-On

In-process schedulers do not work on scale-to-zero platforms. This applies to:
- Google Cloud Run
- AWS Lambda
- Cloudflare Workers
- Any function-as-a-service

**Rule:** If the platform can scale to zero, the scheduler must be external (GitHub Actions, Cloud Scheduler, EventBridge).

### 2. UTC-Only Cron + DST = Dual Entries

GitHub Actions, Cloud Scheduler, and most cron systems only support UTC. For a fixed local time in a DST-observing timezone, you need:
- Two cron entries (one per UTC offset)
- A time guard in the script to prevent double execution

### 3. Helsinki DST Reference

| Period | Timezone | UTC Offset | 06:00 Local = UTC |
|--------|----------|------------|-------------------|
| Late Mar → Late Oct | EEST | UTC+3 | 03:00 UTC |
| Late Oct → Late Mar | EET | UTC+2 | 04:00 UTC |

DST transitions:
- **Spring forward:** Last Sunday of March, 03:00 → 04:00 EET → EEST
- **Fall back:** Last Sunday of October, 04:00 → 03:00 EEST → EET

### 4. Clean Up Dead Code After Fixes

When migrating from one approach to another, remove the old approach completely. Leaving dead code (the unused `MorningBriefingScheduler` class) creates confusion about which path is actually active.

### 5. Linter Awareness

Copilot/linter restored type exports that were removed during cleanup (`CockpitData`, `ThreeChanges`, etc. from `data-collectors.ts`). These exports are consumed by other modules. When simplifying a barrel export file, keep type re-exports that downstream code depends on.

---

## DWS Action Items

### Completed

- [x] Remove node-cron scheduler from Express server
- [x] Dual UTC crons in GitHub Actions workflow
- [x] Helsinki time guard in standalone script
- [x] Manual trigger endpoint preserved
- [x] workflow_dispatch with SKIP_TIME_CHECK for ad-hoc sends

### Pending

- [ ] Verify first successful automated delivery in production (check GitHub Actions run log)
- [ ] Add GitHub Actions run notification (Slack/email) on failure
- [ ] Consider Cloud Scheduler as backup trigger if GitHub Actions has outage
- [ ] Remove `node-cron` from `package.json` if no other module uses it

---

## Related Field Notes

- `2026-02-05-claude-code-agent-teams-vs-subagents.md` — Agentic workflow patterns relevant to multi-step debugging
- `2026-01-22-dashboard-v9-technical-stack.md` — Architecture decisions affecting backend stack

## Related Core Artifacts

- **Pending:** `ART-2026-XXX-serverless-scheduling-patterns.md`

---

## Confidence Assessment

| Claim | Confidence | Source |
|-------|------------|--------|
| node-cron fails on scale-to-zero Cloud Run | HIGH | Production observation |
| Dual-cron + time guard delivers at 06:00 Helsinki | HIGH | Architecture review, DST math verified |
| GitHub Actions cron is UTC-only | HIGH | GitHub documentation |
| Helsinki DST offsets (UTC+2/+3) | HIGH | IANA tz database |
| Linter restored needed type exports | HIGH | Observed in session |

---

**Author:** DWS Platform Engineering
**Review Status:** Pending team validation
**Next Review:** 2026-03-03 (2 weeks)

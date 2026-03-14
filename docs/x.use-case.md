# X.com API Use Case — DWS IQ 6 Platform

***
# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:
  - Version: 1.1 | Tool: Claude Code (Opus 4.6) | Session: claude/add-autosend-x-agent-YOdoQ | Date: 14.03.2026 | Changes: Integrated xurl (official X CLI v1.0.3) as primary transport with native OAuth fallback
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/add-autosend-x-agent-YOdoQ | Date: 14.03.2026 | Changes: Initial creation — X API v2 use case documentation for developer portal application

Session Links & References:
  - Claude Code (claude/add-autosend-x-agent-YOdoQ): https://github.com/blogtheristo/dws6/commits/claude/add-autosend-x-agent-YOdoQ
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/docs/x.use-case.md

Document Status:
  - Created: 14.03.2026
  - Last Modified: 14.03.2026 (v1.1)
  - Language: English
  - Languages Available: English
  - Publication Status: ACTIVE

***

## 1. Platform Overview

**DWS IQ 6** is an enterprise AI agent platform for EU-regulated industries. The platform trains and runs industrial agent swarms safely across 20 EU-regulated sectors with hardware-attested isolation, court-defensible audit trails, and governed self-optimization.

**Operator:** Lifetime Oy (Finland)
**Websites:** dws6.com, dws10.com, onelifetime.world

## 2. X API v2 Use Cases

### 2.1 Automated Tweet Publishing

We use the X API v2 `POST /2/tweets` endpoint for automated publishing of:

- **Product updates** — New features, platform metrics, and release announcements
- **Industry insights** — AI agent performance data, compliance milestones, EU regulatory updates
- **Platform metrics** — Agent Harness Index scores, system health announcements

Posts originate from approved content queues with a CEO approval workflow. The social scheduler agent (`src/social-scheduler/`) manages a Supabase-backed queue where posts are drafted, reviewed, approved, and then published automatically.

**Approval flow:**
1. Agent or human creates draft post → stored in `social_posts` table
2. CEO receives daily email digest with pending posts for review
3. CEO approves/rejects via email link
4. Approved posts are published at scheduled time via X API v2

**Email accounts involved in approval workflow:**
- dws6.com domain accounts
- dws10.com domain accounts
- onelifetime.world domain accounts

### 2.2 Account Mentions

We reference our business accounts in product announcements:

| Account | Type | Purpose |
|---------|------|---------|
| @LifetimeOy | Business | Lifetime Oy company account |
| @DWS10_com | Business | DWS 10 product/store account |
| @blogtheristo | Personal | CEO/founder personal account — primary tweet sender |

Mentions are used exclusively in our own outbound posts to tag our affiliated accounts. We do not monitor, scrape, or collect mentions of other users' accounts.

## 3. Data We Do NOT Collect or Use

We do **NOT**:

- Scrape user data or timelines
- Perform sentiment analysis on other users
- Collect personal data from X users
- Build user profiles or audience graphs
- Resell, redistribute, or sublicense any X data
- Perform mass following, liking, or retweeting
- Use the API for advertising, marketing automation targeting other users, or spam
- Access Direct Messages or user lists

**All posts are outbound-only** from our verified business accounts.

## 4. Data Handling & Storage

| Data Element | Stored | Purpose | Retention |
|-------------|--------|---------|-----------|
| Our tweet IDs | Yes | Audit trail, post status tracking | 2 years |
| Tweet text (our own) | Yes | Content queue, approval history | 2 years |
| X user data | No | N/A | N/A |
| Other users' tweets | No | N/A | N/A |
| Analytics/metrics | No | N/A | N/A |

**Infrastructure:** GDPR-compliant, hosted in EU (Finland)
- Database: Supabase PostgreSQL (europe-north1, Finland)
- Backend: Google Cloud Run (europe-north1)
- Row Level Security (RLS) enabled on all tables
- Encrypted at rest and in transit

## 5. Technical Implementation

### 5.1 API Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/2/tweets` | POST | Publish tweets |

We use **only** the tweet creation endpoint. No read, search, or user endpoints are used.

### 5.2 Authentication & CLI Tooling

**Primary transport:** `xurl` — official X API CLI by @xdevplatform (v1.0.3)
- Handles OAuth 1.0a and OAuth 2.0 PKCE automatically
- Credential storage in `~/.xurl` (YAML, multi-app)
- Installed as pinned devDependency: `@xdevplatform/xurl@1.0.3`
- GitHub: https://github.com/xdevplatform/xurl

**Fallback transport:** Native OAuth 1.0a HMAC-SHA1 signing (built-in, no external deps)

- Read and Write permissions
- Single authorized user context (@blogtheristo)

### 5.3 Rate Limits & Volume

- Estimated volume: 1–5 tweets per day
- All posts go through human approval before publishing
- No bulk operations or high-frequency posting

### 5.4 Source Code References

| Component | File |
|-----------|------|
| X Publisher (xurl + native fallback) | `src/social-scheduler/x-publisher.ts` |
| CLI Script | `scripts/autosend-x.ts` |
| Post Queue | `src/social-scheduler/queue.ts` |
| Types | `src/social-scheduler/types.ts` |
| DB Migration | `supabase/migrations/034_social_posts.sql` |
| xurl devDependency | `package.json` (`@xdevplatform/xurl@1.0.3`) |

## 6. Compliance

| Regulation | Status |
|------------|--------|
| GDPR (EU 2016/679) | Compliant — no personal data collected from X users |
| EU AI Act | Compliant — AI agent posts require human approval |
| X Developer Agreement | Compliant — outbound posting only, no data collection |
| X Automation Rules | Compliant — no spam, no bulk actions, human oversight |

## 7. Contact

**Data Controller:** Lifetime Oy
**Contact:** risto@onelifetime.world
**Location:** Finland, EU
**Website:** https://onelifetime.world

# onelifetime.world Cloudflare Pages deploy gap

***

## VERSION AND AGENT HISTORY

| Field          | Value                                                              |
| -------------- | ------------------------------------------------------------------ |
| Version        | 1.1                                                                |
| Date           | 2026-05-23                                                         |
| Author         | Claude (Opus 4.7) on behalf of risto.paarni2024@lifetime.fi        |
| Location       | Repo-wide infrastructure — Cloudflare Pages projects + GitHub CI  |
| Context        | DWS IQ 6 monorepo, blogtheristo/dws6, PR #1376 CI gate audit       |
| Owner          | risto-001                                                          |
| Status         | Open — needs Cloudflare admin                                       |
| Classification | Internal                                                           |
| Introduced-In  | PR-TBD                                                              |
| Branch         | claude/cf-pages-onelifetime-world-add                              |
| Trigger        | PR #1376 CI gate audit revealed missing Cloudflare Pages project   |

***

## Ontology Tags

- **Geography:** Europe > Finland > Espoo (Lifetime Oy HQ); deploys target Cloudflare's global edge.
- **Sector:** Software > DevOps / CI-CD > Deploy Infrastructure
- **Entities:** Cloudflare Pages, GitHub Actions, onelifetime.world, blogtheristo/dws6, PR #1376, PR #1377, PR #1380, Lifetime Oy, DWS IQ 6
- **Temporal Context:** 2026-Q2, post-PR-1376 audit (audit performed 2026-05-22 / 23)
- **Confidence:** High — gap directly observable in GitHub check_runs API across multiple recent PRs.

***

## 1. The Story

While auditing CI gates on PR #1376 (the EU funding brief PR), the `mcp__github__pull_request_read get_check_runs` call returned only 6 checks. Cross-checking against PR #1377 (`fix: restore AgentContext tool safety`, merged 2026-05-22) showed that #1377 ran 12 checks — but **neither PR included a `Cloudflare Pages: onelifetime-world` check**.

The site folder exists at both `onelifetime.world/` (root) and `landing-pages/onelifetime-world/` (mirror) per the Dual Folder Structure Rule in `CLAUDE.md`. The content is there. The PR-time deploy signal is not.

| Cloudflare Pages project | Appears on PR #1376 | Appears on PR #1377 |
| ------------------------ | ------------------- | ------------------- |
| `dws6`                   | ✓                   | ✓                   |
| `dws6-dashboard`         | ✓                   | ✓                   |
| `dws10-com`              | ✓                   | ✓                   |
| `lifetime-fi`            | ✓                   | (path-filtered out) |
| **`onelifetime-world`**  | **✗ (missing)**     | **✗ (missing)**     |

A grep across `.github/workflows/*.yml` confirmed that none of the four working projects have an explicit deploy workflow file. They are all configured through Cloudflare's native GitHub integration (dashboard-side). Therefore the gap for onelifetime.world is also dashboard-side, not a missing workflow.

***

## 2. The Insight

**Cloudflare Pages connections live outside the repo.** This means:

- A repo audit alone can never close this kind of gap — `grep` across `.github/workflows/` will show the four working projects as having *no* workflow, identical to the missing fifth. The absence is invisible from inside the codebase.
- The DWS "audit chain" framing (`.ci-audit/runs/`) only covers what the repo can observe. Deploy gates that exist *exclusively* in third-party dashboards (Cloudflare, Vercel, Render, etc.) need their own discovery path.
- Stop-hook claims like "all green" become misleading. PR #1376's 6/6 green were genuine, but the universe of *required* gates was implicitly under-counted by the same dashboard that doesn't show its absence.

This is a class of bug, not a one-off: **any** new public-site folder added under root + `landing-pages/` mirror needs a corresponding Cloudflare Pages project registration. We do not currently have an automated way to verify that mapping.

***

## 3. How Existing Cloudflare Pages Deploys Are Wired

None of the four working projects (`dws6`, `dws6-dashboard`, `dws10-com`, `lifetime-fi`) have an explicit workflow file under `.github/workflows/`. They are configured via Cloudflare's GitHub integration:

```
Cloudflare Dashboard → Pages → Projects → <project-name> → Settings
  → Builds & deployments
    → Production branch:   main
    → Preview branches:    All
    → Watch paths:         <site-folder>/**
```

Cloudflare's app polls the repo via GitHub webhooks; when a PR touches a watched path, Cloudflare runs the build and posts a check_run back to the PR. Zero repo-side code required.

***

## 4. Fix Options

### Option A — Native Cloudflare integration (recommended)

**Owner:** Risto (Cloudflare admin).
**Steps:**

1. Open https://dash.cloudflare.com/?to=/{account-id}/pages
2. Click **Create application** → **Pages** → **Connect to Git**
3. Select repo `blogtheristo/dws6`
4. Configure:
   - Project name: `onelifetime-world`
   - Production branch: `main`
   - Build command: (empty — static site)
   - Build output directory: `onelifetime.world` (or `landing-pages/onelifetime-world` if that's the canonical deploy source)
   - Watch paths: `onelifetime.world/**` and `landing-pages/onelifetime-world/**`
5. Save and trigger a test deploy

**Cost:** Zero (Cloudflare Pages free tier covers static sites).
**Repo change:** None.

### Option B — GitHub Actions workflow

Add `.github/workflows/deploy-onelifetime-world.yml` using `cloudflare/pages-action@v1`:

```yaml
name: Deploy onelifetime.world
on:
  push:
    branches: [main]
    paths: ['onelifetime.world/**', 'landing-pages/onelifetime-world/**']
  pull_request:
    paths: ['onelifetime.world/**', 'landing-pages/onelifetime-world/**']
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: onelifetime-world
          directory: onelifetime.world
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

**Requires:** `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` repo secrets and a Cloudflare Pages project named `onelifetime-world` already created (so still depends on Option A step 4, minus the GitHub connection).
**Repo change:** New workflow file.

### Recommendation

Use **Option A**. Matches the existing pattern (zero repo files for four other projects), avoids token management, and lets Cloudflare's native UI handle preview-branch rules. Option B is only useful if you want path-filter granularity the Cloudflare dashboard doesn't give you.

***

## 5. Next Steps

| # | Action                                                                                            | Owner    | Target date |
| - | ------------------------------------------------------------------------------------------------- | -------- | ----------- |
| 1 | Decide Option A vs B                                                                              | Risto    | 2026-05-30  |
| 2 | Execute chosen option (most likely: connect `onelifetime-world` in Cloudflare dashboard)          | Risto    | 2026-06-06  |
| 3 | Open a small test PR touching `onelifetime.world/*` and verify `Cloudflare Pages: onelifetime-world` appears in check_runs | Risto    | 2026-06-06  |
| 4 | Mark this field note `Status: Closed` in the VERSION AND AGENT HISTORY block                      | Risto    | 2026-06-06  |
| 5 | Open a follow-up to audit *every* public-site folder (`dws6.com/`, `dws10.com/`, `onelifetime.world/`, `lifetime.fi/`) against its Cloudflare project registration so this class of bug stops recurring | Risto    | 2026-06-15  |

***

## 6. Verification Once Fixed

After Cloudflare project is connected, open the next PR that touches `onelifetime.world/*` and confirm:

1. `mcp__github__pull_request_read get_check_runs` on the PR returns a check named `Cloudflare Pages: onelifetime-world`.
2. The check completes successfully (`conclusion: "success"`).
3. The check posts a preview URL comment on the PR.

If any of those fail, the watch path filter or build output directory is wrong — adjust in Cloudflare dashboard.

***

**End of field note.**

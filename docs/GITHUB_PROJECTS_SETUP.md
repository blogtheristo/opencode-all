# GitHub Projects Setup Guide
**DWS6 Kanban Board Organization**

---

## Overview

This guide explains how to set up GitHub Projects (Kanban boards) for tracking DWS6 development across all roadmaps.

**Goal:** Turn roadmaps into actionable tasks tracked in Kanban boards, enabling weekly progress reporting and MVP % completion calculations.

---

## Project Structure

### Recommended Projects

Create **4 GitHub Projects** (one per major roadmap/product):

1. **DWS6 Construction V1** (MVP → Alpha → V1 for Construction vertical)
2. **Corporate Cloud Agents 2026** (8-vertical agent system)
3. **SiteSense Edge AI** (NVIDIA Jetson deployment)
4. **AgentFoundry Platform** (Core infrastructure and tooling)

---

## GitHub Projects Creation

### Step 1: Create New Project

1. Go to: https://github.com/blogtheristo/dws6
2. Click **Projects** tab
3. Click **New project**
4. Choose **Board** view (Kanban style)
5. Name: e.g., "DWS6 Construction V1"
6. Description: e.g., "MVP → V1 roadmap for Construction vertical (Customer Sat + Viability agents)"
7. Click **Create project**

### Step 2: Configure Columns

**Standard columns (create in this order):**

| Column | Purpose | WIP Limit |
|--------|---------|-----------|
| **Backlog** | All planned tasks not yet started | None |
| **Research** | Investigation, spike work, prototyping | 3 |
| **This Week** | Tasks planned for current week | 5 |
| **In Progress** | Actively being worked on | 2 |
| **Done** | Completed and shipped | None |

**How to add columns:**
1. Click **+ Add column** on the right side
2. Name the column (e.g., "Research")
3. Optional: Set WIP (Work In Progress) limit
4. Click **Create column**

### Step 3: Add Custom Fields (Optional but Recommended)

**Useful fields for tracking:**

| Field Name | Type | Purpose |
|------------|------|---------|
| **Priority** | Single select | High / Medium / Low |
| **Phase** | Single select | MVP / Alpha / V1 |
| **Vertical** | Single select | Construction / Manufacturing / Energy |
| **Estimate** | Number | Hours to complete |
| **Owner** | Single select | Team member assigned |

**How to add fields:**
1. Click **⚙️ Settings** (top right)
2. Go to **Fields** tab
3. Click **+ New field**
4. Configure field type and options
5. Click **Save**

---

## Populating Projects with Tasks

### Example: DWS6 Construction V1 Project

#### From ROADMAP_MVP.md (Month 1-3)

**Infrastructure tasks:**
- [ ] Deploy Groq API router to Cloud Run
- [ ] Set up Supabase free tier (database + auth)
- [ ] Configure Google Secret Manager
- [ ] Set up Sentry error tracking
- [ ] Configure Uptime Robot monitoring

**Agent development tasks:**
- [ ] Create Customer Satisfaction Agent YAML config
- [ ] Implement Customer Sat Agent Groq API integration
- [ ] Write unit tests for Customer Sat Agent
- [ ] Create Viability Agent YAML config
- [ ] Implement Viability Agent Groq API integration
- [ ] Write unit tests for Viability Agent

**Customer onboarding tasks:**
- [ ] Create customer onboarding workflow
- [ ] Design onboarding email templates
- [ ] Set up Typeform for customer feedback
- [ ] Recruit 5 pilot customers (Construction)
- [ ] Onboard Customer 1
- [ ] Onboard Customer 2
- [ ] Onboard Customer 3
- [ ] Onboard Customer 4
- [ ] Onboard Customer 5

**Documentation tasks:**
- [ ] Write MVP Quick Start guide
- [ ] Create deployment playbook (Construction)
- [ ] Document agent configuration process
- [ ] Create troubleshooting guide

**Reporting tasks:**
- [ ] Set up cost tracking Google Sheet
- [ ] Create weekly report template
- [ ] Generate Week 1 report
- [ ] Generate Week 2 report
- [ ] ... (12 weeks total)

#### How to Create Issues from Tasks

**Method 1: Manual (for MVP phase)**

1. Click **+ Add item** in Backlog column
2. Choose **Create new issue**
3. Title: e.g., "Deploy Groq API router to Cloud Run"
4. Body (use template):
```md
## Description
Deploy FastAPI service (AgentFoundry/services/groq-router-mvp/) to Google Cloud Run.

## Acceptance Criteria
- [ ] Dockerfile builds successfully
- [ ] Service deployed to Cloud Run
- [ ] `/health` endpoint returns 200 OK
- [ ] `/v1/agents/{agent_id}/invoke` endpoint works
- [ ] Cost is €0 (within free tier)

## Related Documents
- [MVP_QUICK_START.md](docs/AgentFoundry/MVP_QUICK_START.md)
- [ROADMAP_MVP.md](docs/roadmaps/ROADMAP_MVP.md)

## Estimate
2 hours

## Phase
MVP

## Vertical
Infrastructure
```
5. Click **Create**
6. Drag to appropriate column (e.g., "This Week" if starting soon)

**Method 2: Bulk Import (for Alpha/V1)**

Use GitHub's issue template feature:
1. Create `.github/ISSUE_TEMPLATE/agent-task.md`
2. Populate with fields (Title, Phase, Vertical, Estimate)
3. Create issues in bulk using GitHub CLI:
```bash
gh issue create --title "Deploy Energy Optimization Agent" \
  --body-file .github/ISSUE_TEMPLATE/agent-task.md \
  --label "alpha,energy" \
  --project "Corporate Cloud Agents 2026"
```

---

## Labeling Strategy

### Recommended Labels

**By Phase:**
- `mvp` (Month 1-3)
- `alpha` (Month 4-6)
- `v1` (Month 7-12)

**By Vertical:**
- `construction`
- `manufacturing`
- `energy`
- `logistics`
- `agriculture`
- `infrastructure` (core platform work)

**By Type:**
- `agent-development`
- `documentation`
- `testing`
- `deployment`
- `customer-onboarding`
- `research`

**By Priority:**
- `p0-critical` (blocks MVP launch)
- `p1-high` (needed for roadmap milestone)
- `p2-medium` (nice to have)
- `p3-low` (future consideration)

**By Status:**
- `blocked` (cannot proceed, needs resolution)
- `bug` (something broken)
- `technical-debt` (needs refactoring)

### How to Add Labels to Issues

1. Open issue
2. Click **Labels** on right sidebar
3. Select relevant labels
4. Labels auto-sync to Project view

---

## Weekly Workflow

### Monday Morning: Plan the Week

1. **Product & Reporting Agent** (or Risto manually) reviews Backlog
2. Move 5 tasks from **Backlog → This Week**
3. Assign each task to team member (or self)
4. Set priority (p0, p1, p2, p3)

### During the Week: Track Progress

1. When starting a task: Move **This Week → In Progress**
2. Update issue with progress notes (blockers, questions)
3. When stuck: Add `blocked` label, write comment explaining why
4. When complete: Move **In Progress → Done**, close issue

### Friday Afternoon: Generate Report

1. **Product & Reporting Agent** (or Risto manually) counts tasks:
   - Backlog → This Week: X tasks
   - This Week → In Progress: Y tasks
   - In Progress → Done: Z tasks
2. Calculate completion %:
   - Total tasks in project: Count all issues (open + closed)
   - Done tasks: Count issues in "Done" column
   - Completion % = (Done / Total) × 100
3. Use data to fill in weekly report template (`docs/Reports/en/`)

---

## Calculating MVP Completion %

### Formula

```
MVP Completion % = (Tasks in "Done" column) / (Total tasks for MVP) × 100
```

### Example Calculation

**DWS6 Construction V1 (MVP Phase):**
- Total MVP tasks: 43 (from ROADMAP_MVP.md)
- Tasks in "Done": 15
- Completion %: 15 / 43 × 100 = **35%**

### Tracking Over Time

**Google Sheets tracker:**

| Week | Total Tasks | Done | Completion % | Change from Last Week |
|------|-------------|------|--------------|----------------------|
| Week 1 | 43 | 3 | 7% | +7% |
| Week 2 | 45 | 8 | 18% | +11% (2 new tasks added) |
| Week 3 | 45 | 15 | 33% | +15% |
| Week 4 | 47 | 23 | 49% | +16% (2 new tasks added) |

**Velocity metric:**
- Average tasks completed per week: (23 - 3) / 4 = 5 tasks/week
- Estimated weeks to 100%: (47 - 23) / 5 = 4.8 weeks

---

## GitHub Projects API (for Automation)

### Fetching Project Data via API

**Prerequisites:**
- GitHub Personal Access Token (PAT) with `repo` and `project` scopes

**Example: Get all tasks in project**

```bash
# 1. Get project ID
gh project list --owner blogtheristo

# 2. Get project items
gh project item-list <PROJECT_ID> --format json

# 3. Parse JSON to count tasks by column
gh project item-list <PROJECT_ID> --format json | \
  jq '[.items[] | select(.fieldValues.status == "Done")] | length'
```

### Automating Weekly Reports

**Python script (example):**

```python
import os
import requests
from datetime import datetime

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
PROJECT_ID = "PVT_kwDON..."  # Your project ID

def get_project_stats(project_id):
    headers = {"Authorization": f"Bearer {GITHUB_TOKEN}"}
    url = f"https://api.github.com/graphql"

    query = """
    query($projectId: ID!) {
      node(id: $projectId) {
        ... on ProjectV2 {
          items {
            totalCount
            nodes {
              fieldValues(first: 10) {
                nodes {
                  ... on ProjectV2ItemFieldSingleSelectValue {
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
    """

    response = requests.post(url, json={"query": query, "variables": {"projectId": project_id}}, headers=headers)
    data = response.json()

    total = data["data"]["node"]["items"]["totalCount"]
    # Parse "Done" count from fieldValues
    done = sum(1 for item in data["data"]["node"]["items"]["nodes"]
               if any(fv.get("name") == "Done" for fv in item["fieldValues"]["nodes"]))

    return {
        "total": total,
        "done": done,
        "completion_pct": round((done / total) * 100, 1) if total > 0 else 0
    }

stats = get_project_stats(PROJECT_ID)
print(f"DWS6 Construction V1: {stats['completion_pct']}% complete ({stats['done']}/{stats['total']})")
```

**Integrate with Product & Reporting Agent:**
- Agent calls this script weekly
- Populates `## 3. MVP Build Percentage` section of report
- Stores historical data in Google Sheets for trend analysis

---

## Best Practices

### 1. Keep Tasks Small & Actionable

**Bad:** "Build Customer Satisfaction Agent"
- Too vague, unclear when "done"

**Good:** "Implement Customer Sat Agent Groq API integration"
- Specific, testable, estimable

### 2. Use Acceptance Criteria

Every task should have clear "done" conditions:
- [ ] Unit tests pass
- [ ] Deployed to staging
- [ ] Documentation updated
- [ ] Code reviewed and merged

### 3. Update Tasks Daily

- Add progress comments (what was done, what's blocked)
- Move cards as soon as status changes (don't wait until Friday)
- Tag others if you need help (@ristopaarni)

### 4. Archive Old Projects

After V1 launch:
- Close all MVP/Alpha issues
- Archive "DWS6 Construction V1" project
- Create new project for next phase (e.g., "DWS7 Expansion 2027")

### 5. Link Issues to PRs

When creating a PR, reference the issue:
```
fix: Deploy Groq API router to Cloud Run

Closes #42

- Added Dockerfile
- Configured Cloud Run YAML
- Updated deployment docs
```

GitHub auto-moves the issue to "Done" when PR merges.

---

## Integration with Weekly Reports

### Manual Process (MVP Phase)

**Friday workflow:**
1. Risto opens each GitHub Project
2. Manually counts tasks in each column
3. Fills in weekly report template:
```md
## 2. Progress by Kanban category
- Backlog → This Week: 8 tasks moved
- This Week → In Progress: 5 tasks started
- In Progress → Done: 7 tasks completed
```

### Semi-Automated (Alpha Phase)

**Python script generates draft report:**
1. Script fetches data from GitHub Projects API
2. Populates report template with task counts, completion %
3. Risto reviews, adds narrative, publishes

### Fully Automated (V1 Phase)

**Product & Reporting Agent (Claude) generates full report:**
1. Agent fetches GitHub Projects data
2. Agent reads Slack messages for customer feedback
3. Agent reads cost dashboard for infrastructure costs
4. Agent generates draft report using template
5. Risto reviews, edits, approves
6. Agent publishes to `docs/Reports/en/` and `docs/Reports/fi/`

---

## Troubleshooting

### Issue: Can't see GitHub Projects tab

**Solution:**
- Projects tab only visible to repo owners/admins
- If you don't see it, check repo permissions
- Alternative: Use organization-level projects (https://github.com/orgs/Lifetime-oy/projects)

### Issue: Tasks not auto-moving to "Done" when PR merges

**Solution:**
- Make sure PR description includes "Closes #123" (not "Fixes #123" or "Resolves #123")
- GitHub only auto-closes issues in the same repo
- If using multiple repos, manually close issue after PR merge

### Issue: Completion % doesn't match roadmap progress

**Solution:**
- Roadmaps are estimates, projects are reality
- New tasks discovered during implementation (always add to project)
- Some tasks removed as no longer relevant (mark as "Won't do" and close)
- Completion % based on actual work, not original estimate

---

## Roadmap → GitHub Project Mapping

| Roadmap File | GitHub Project | Task Count (Estimate) |
|--------------|----------------|----------------------|
| [ROADMAP_MVP.md](../roadmaps/ROADMAP_MVP.md) | DWS6 Construction V1 | 43 tasks |
| [ROADMAP_ALPHA.md](../roadmaps/ROADMAP_ALPHA.md) | Corporate Cloud Agents 2026 | 52 tasks |
| [ROADMAP_V1.md](../roadmaps/ROADMAP_V1.md) | SiteSense Edge AI | 38 tasks |
| [AgentFoundry/](../../AgentFoundry/) | AgentFoundry Platform | 28 tasks |
| **TOTAL** | **All Projects** | **161 tasks** |

---

## Next Steps

1. ☐ Create 4 GitHub Projects (Construction V1, Corporate Cloud Agents, SiteSense, AgentFoundry)
2. ☐ Configure columns (Backlog, Research, This Week, In Progress, Done)
3. ☐ Add custom fields (Priority, Phase, Vertical, Estimate)
4. ☐ Create labels (mvp, alpha, v1, construction, etc.)
5. ☐ Populate "DWS6 Construction V1" project with 43 MVP tasks
6. ☐ Move first 5 tasks to "This Week" (Week 1 priorities)
7. ☐ Test weekly workflow (Friday report generation)

---

**Document Status:** v1.0
**Last Updated:** December 3, 2025
**Owner:** Risto Anton Päärni
**Next Review:** After first weekly report (Week 1)

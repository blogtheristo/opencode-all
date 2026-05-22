# 🔐 Security Workflow: Snyk & Aikido Integration

**Location:** `Admin/Security/SECURITY_WORKFLOW_SNYK_AIKIDO.md`  
**Created:** December 22, 2025  
**Updated:** January 3, 2026  
**Purpose:** Automated security workflow for continuous vulnerability scanning and management  
**Status:** ✅ ACTIVE

> ⚠️ **2026 Update:** All GitHub Actions updated to v4. Command syntax for `safety` and `cyclonedx-py` corrected.

---

## 📋 Overview

This document outlines the integrated security workflow that combines **Snyk** (Software Composition Analysis + SAST) and **Aikido** (AI-powered threat detection) to provide comprehensive security monitoring and automated bug tracking.

---

## 🏗️ Workflow Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│              CODE COMMIT & PUSH                             │
└────────────────┬──────────────────────────────────────────┘
                 │
                 ▼
        ┌─────────────────┐
        │ GitHub Webhook  │
        └────────┬────────┘
                 │
        ┌────────┴──────────┐
        │                   │
        ▼                   ▼
    ┌─────────┐         ┌─────────┐
    │  SNYK   │         │ AIKIDO  │
    └────┬────┘         └────┬────┘
         │                   │
         ├─ SCA Scan        │
         ├─ SAST Scan       ├─ Threat Detection
         ├─ Container Scan  │
         └─ Dependency Audit│
         │                   │
         └────────┬──────────┘
                  │
                  ▼
        ┌─────────────────┐
        │ Parse Results   │
        │ (JSON)          │
        └────────┬────────┘
                 │
        ┌────────┴────────────┐
        │                     │
        ▼                     ▼
   ┌─────────┐            ┌──────────┐
   │ Issues  │            │ Create   │
   │Found?   │            │ Issues   │
   │         │            │on GitHub │
   └────┬────┘            └──────────┘
        │
        ▼
  ┌─────────┐
  │ Update  │
  │ Backlog │
  └─────────┘
```

---

## 🔧 Setup Instructions

### 1. Snyk Configuration

#### 1.1 Snyk Token Setup

```bash
# Authenticate with Snyk
snyk auth

# Get your API token from https://app.snyk.io/account/api-token
# Set environment variable
export SNYK_TOKEN="your_token_here"

# Verify authentication
snyk --version
snyk auth --check
```

#### 1.2 GitHub Integration

```bash
# Add Snyk to GitHub App integrations
# 1. Go to https://github.com/settings/apps
# 2. Create new GitHub App or add Snyk app
# 3. Grant permissions:
#    - Repository contents (read)
#    - Pull requests (read & write)
#    - Issues (read & write)
#    - Checks (read & write)
# 4. Connect to your repository

# Test connection
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/owner/dws6/status
```

#### 1.3 Snyk Organization Setup

```bash
# Create Snyk organization
snyk config set org=my-organization

# Link repository
snyk monitor --project-name=dws6

# View dashboard
# https://app.snyk.io/org/my-organization/projects
```

---

### 2. Aikido Configuration

#### 2.1 Aikido Registration

```bash
# 1. Sign up at https://aikido.dev
# 2. Create workspace
# 3. Add integration:
#    - GitHub integration
#    - Select repositories (dws6)
#    - Grant permissions
```

#### 2.2 Aikido API Configuration

```bash
# Get API token from Aikido dashboard
export AIKIDO_API_TOKEN="your_token_here"

# Set API endpoint
export AIKIDO_API_ENDPOINT="https://api.aikido.dev"

# Verify connection
curl -H "Authorization: Bearer $AIKIDO_API_TOKEN" \
  $AIKIDO_API_ENDPOINT/api/v1/status
```

#### 2.3 Aikido Webhook Setup

```bash
# Configure webhook in Aikido dashboard
# Webhook URL: https://your-webhook-endpoint/aikido/webhook
# Events to trigger:
#   - vulnerability_found
#   - scan_complete
#   - threat_detected

# Verify webhook (test payload)
curl -X POST https://your-webhook-endpoint/aikido/webhook \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AIKIDO_API_TOKEN" \
  -d '{"event":"test","timestamp":"2025-12-22T00:00:00Z"}'
```

---

## 🚀 Automated Workflow

### Workflow 1: Daily Security Scan

**Trigger:** Daily at 2 AM UTC  
**Duration:** ~15 minutes

```yaml
name: Daily Security Scan (Snyk + Aikido)

on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM UTC
  workflow_dispatch:

jobs:
  security-scan:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      security-events: write
      issues: write
      pull-requests: write

    steps:
      # Step 1: Checkout code
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      # Step 2: Run Snyk SCA (Software Composition Analysis)
      - name: Run Snyk SCA Scan
        uses: snyk/actions/python@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=medium --json > snyk-sca.json

      # Step 3: Run Snyk SAST (Static Application Security Testing)
      - name: Run Snyk Code Scan
        uses: snyk/actions/python@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        continue-on-error: true
        with:
          command: code test
          args: --severity-threshold=medium --json > snyk-sast.json

      # Step 4: Run Snyk Container Scan
      - name: Run Snyk Container Scan
        uses: snyk/actions/docker@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        continue-on-error: true
        with:
          image: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ env.IMAGE_TAG }}
          args: --severity-threshold=medium --json > snyk-container.json

      # Step 5: Fetch Aikido Results
      - name: Fetch Aikido Scan Results
        run: |
          curl -X GET "https://api.aikido.dev/v1/scans/latest" \
            -H "Authorization: Bearer ${{ secrets.AIKIDO_API_TOKEN }}" \
            -o aikido-results.json

      # Step 6: Parse and Merge Results
      - name: Parse Security Results
        run: |
          python scripts/parse_security_results.py \
            --snyk-sca snyk-sca.json \
            --snyk-sast snyk-sast.json \
            --snyk-container snyk-container.json \
            --aikido aikido-results.json \
            --output merged-results.json

      # Step 7: Create GitHub Issues for Critical Vulnerabilities
      - name: Create GitHub Issues
        run: |
          python scripts/create_github_issues.py \
            --results merged-results.json \
            --repo ${{ github.repository }} \
            --token ${{ secrets.GITHUB_TOKEN }}

      # Step 8: Update Security Backlog
      - name: Update Security Backlog
        run: |
          python scripts/update_security_backlog.py \
            --results merged-results.json \
            --backlog-file Admin/Security/SECURITY_BACKLOG_BUG_FIXES.md \
            --token ${{ secrets.GITHUB_TOKEN }}

      # Step 9: Comment on Recent PRs with Security Warnings
      - name: Comment on PRs with Warnings
        run: |
          python scripts/comment_on_prs.py \
            --results merged-results.json \
            --repo ${{ github.repository }} \
            --token ${{ secrets.GITHUB_TOKEN }}

      # Step 10: Upload Results as Artifacts
      - name: Upload Security Reports
        uses: actions/upload-artifact@v4  # Updated Jan 2026 (v3 deprecated Apr 2024)
        with:
          name: security-scan-results
          path: |
            snyk-sca.json
            snyk-sast.json
            snyk-container.json
            aikido-results.json
            merged-results.json
          retention-days: 90

      # Step 11: Send Microsoft Teams notification (Incoming Webhook)
      - name: Send Teams notification
        if: always()
        env:
          TEAMS_WEBHOOK_URL: ${{ secrets.TEAMS_WEBHOOK_URL }}
        run: |
          # Post MessageCard JSON to TEAMS_WEBHOOK_URL (see monthly-security-audit-enhanced.yml)
          echo "Configure TEAMS_WEBHOOK_URL secret for Teams alerts"
```

---

### Workflow 2: On Pull Request - Security Check

**Trigger:** On PR creation/update  
**Duration:** ~10 minutes

```yaml
name: PR Security Check (Snyk + Aikido)

on:
  pull_request:
    types: [opened, synchronize, reopened]
    paths:
      - '**.py'
      - '**.ts'
      - '**.js'
      - '**.yaml'
      - '**.yml'
      - 'requirements.txt'
      - 'package.json'
      - 'Dockerfile'

jobs:
  security-check:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      security-events: write
      checks: write
      pull-requests: write

    steps:
      - name: Checkout PR Code
        uses: actions/checkout@v4
        with:
          ref: ${{ github.head_ref }}

      - name: Run Snyk Test (PR)
        uses: snyk/actions/python@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        continue-on-error: true
        with:
          args: --severity-threshold=high

      - name: Run Snyk Code Test (PR)
        run: |
          npm install -g snyk
          snyk code test --severity-threshold=high

      - name: Get Aikido PR Recommendations
        run: |
          curl -X POST "https://api.aikido.dev/v1/pr-check" \
            -H "Authorization: Bearer ${{ secrets.AIKIDO_API_TOKEN }}" \
            -H "Content-Type: application/json" \
            -d '{
              "repo": "${{ github.repository }}",
              "pr_number": ${{ github.event.pull_request.number }},
              "head_sha": "${{ github.event.pull_request.head.sha }}",
              "base_sha": "${{ github.event.pull_request.base.sha }}"
            }' > aikido-pr-check.json

      - name: Comment PR with Security Review
        uses: actions/github-script@v7  # Updated Jan 2026
        with:
          script: |
            const fs = require('fs');
            const aikidoResults = JSON.parse(fs.readFileSync('aikido-pr-check.json', 'utf8'));
            
            let comment = '## 🔐 Security Review\n\n';
            
            if (aikidoResults.issues.length === 0) {
              comment += '✅ No security issues detected\n';
            } else {
              comment += `⚠️ Found ${aikidoResults.issues.length} potential security issue(s):\n\n`;
              aikidoResults.issues.forEach(issue => {
                comment += `- **${issue.severity}**: ${issue.title}\n`;
                comment += `  ${issue.description}\n`;
              });
            }
            
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: comment
            });
```

---

### Workflow 3: On-Demand Full Security Audit

**Trigger:** Manual (workflow_dispatch)  
**Duration:** ~30 minutes

```yaml
name: Full Security Audit (Manual)

on:
  workflow_dispatch:
    inputs:
      include_container_scan:
        description: 'Include container scan'
        required: false
        type: boolean
        default: true
      severity_threshold:
        description: 'Severity threshold'
        required: false
        type: choice
        options:
          - critical
          - high
          - medium
          - low
        default: 'medium'

jobs:
  full-audit:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run Full Snyk Audit
        run: |
          npm install -g snyk
          snyk test \
            --severity-threshold=${{ github.event.inputs.severity_threshold }} \
            --json > snyk-full-audit.json

      - name: Run Snyk License Check
        run: |
          snyk test --license \
            --json > snyk-license-check.json

      - name: Run Full Aikido Threat Assessment
        run: |
          curl -X POST "https://api.aikido.dev/v1/full-audit" \
            -H "Authorization: Bearer ${{ secrets.AIKIDO_API_TOKEN }}" \
            -d '{"repo":"${{ github.repository }}"}' \
            > aikido-full-audit.json

      - name: Generate Audit Report
        run: |
          python scripts/generate_audit_report.py \
            --snyk-audit snyk-full-audit.json \
            --snyk-license snyk-license-check.json \
            --aikido aikido-full-audit.json \
            --output SECURITY_AUDIT_REPORT.md

      - name: Upload Report
        uses: actions/upload-artifact@v4  # Updated Jan 2026 (v3 deprecated)
        with:
          name: full-security-audit
          path: SECURITY_AUDIT_REPORT.md

      - name: Create Issue with Report
        uses: actions/github-script@v7  # Updated Jan 2026
        with:
          script: |
            const fs = require('fs');
            const report = fs.readFileSync('SECURITY_AUDIT_REPORT.md', 'utf8');
            
            github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: `🔐 Full Security Audit Report - ${new Date().toISOString().split('T')[0]}`,
              body: report,
              labels: ['security', 'audit']
            });
```

---

## 📊 Integration Points

### GitHub Integration

1. **Issues Creation**
   - Auto-create issues for critical vulnerabilities
   - Label: `security`, `snyk`, `aikido`
   - Link to security backlog

2. **PR Comments**
   - Comment on PRs with security warnings
   - Block merge if critical issues found
   - Link to detailed reports

3. **Branch Protection**
   - Require security checks to pass
   - Status checks: `snyk/test`, `aikido/check`

### Slack Integration

```yaml
Send notifications:
- Daily scan summary
- Critical findings
- PR security violations
- Audit completion
```

### Email Integration

```yaml
Send alerts for:
- Critical vulnerabilities
- Zero-day threats (Aikido)
- Scan failures
- Audit overdue
```

---

## 📝 Python Scripts Required

### 1. parse_security_results.py

```python
#!/usr/bin/env python3
"""Parse and merge security scan results from Snyk and Aikido"""

import json
import argparse
from datetime import datetime

def merge_results(snyk_sca, snyk_sast, snyk_container, aikido):
    """Merge results from all security tools"""
    merged = {
        "timestamp": datetime.now().isoformat(),
        "tools": {
            "snyk_sca": snyk_sca,
            "snyk_sast": snyk_sast,
            "snyk_container": snyk_container,
            "aikido": aikido
        },
        "summary": {
            "total_critical": 0,
            "total_high": 0,
            "total_medium": 0
        },
        "issues": []
    }
    
    # Aggregate issues by severity
    for issue in snyk_sca.get("vulnerabilities", []):
        merged["issues"].append({
            "source": "snyk-sca",
            "severity": issue.get("severity"),
            "title": issue.get("title"),
            "id": issue.get("id")
        })
    
    # ... similar for other tools
    
    return merged
```

### 2. create_github_issues.py

```python
#!/usr/bin/env python3
"""Create GitHub issues for security findings"""

import json
import argparse
import github

def create_issues(results, repo_name, token):
    """Create GitHub issues for critical/high severity findings"""
    g = github.Github(token)
    repo = g.get_repo(repo_name)
    
    for issue in results["issues"]:
        if issue["severity"] in ["critical", "high"]:
            body = f"""
## Security Finding

**Source:** {issue['source']}
**Severity:** {issue['severity']}
**ID:** {issue['id']}

### Details
{issue['description']}

### Remediation
{issue.get('fix', 'See referenced security backlog')}

### Reference
- Security Backlog: Admin/Security/SECURITY_BACKLOG_BUG_FIXES.md
- Workflow: Admin/Security/SECURITY_WORKFLOW_SNYK_AIKIDO.md
"""
            
            repo.create_issue(
                title=f"🔐 [{issue['severity'].upper()}] {issue['title']}",
                body=body,
                labels=["security", issue["source"]]
            )
```

### 3. update_security_backlog.py

```python
#!/usr/bin/env python3
"""Update security backlog with new findings"""

import json
from datetime import datetime

def update_backlog(results, backlog_file):
    """Add new findings to security backlog"""
    
    with open(backlog_file, 'a') as f:
        f.write(f"\n## Security Scan - {datetime.now().isoformat()}\n\n")
        
        for issue in results["issues"]:
            f.write(f"### {issue['severity'].upper()}: {issue['title']}\n\n")
            f.write(f"- **Source:** {issue['source']}\n")
            f.write(f"- **Severity:** {issue['severity']}\n")
            f.write(f"- **Description:** {issue['description']}\n")
            f.write(f"- **Timestamp:** {datetime.now().isoformat()}\n\n")
```

---

## 🔐 Security Best Practices

### 1. Token Management

```bash
# Store tokens in GitHub Secrets
SNYK_TOKEN
AIKIDO_API_TOKEN
GITHUB_TOKEN (auto-provided)
TEAMS_WEBHOOK_URL

# Rotate tokens quarterly
# Review access in both services
```

### 2. Data Handling

```bash
# Scan results are:
# - Stored in artifacts (90-day retention)
# - Logged for audit trail
# - Never committed to git
# - Encrypted in transit (HTTPS)
```

### 3. Access Control

```bash
# Limit workflow permissions:
contents: read
security-events: write
issues: write
pull-requests: write

# Don't grant unnecessary permissions
```

---

## 📊 Workflow Monitoring

### Health Checks

```bash
# Monitor workflow execution
curl -H "Authorization: token $GITHUB_TOKEN" \
  "https://api.github.com/repos/owner/dws6/actions/runs?event=schedule" \
  | jq '.workflow_runs[] | {status, conclusion, created_at, updated_at}'

# Check scan frequency
# Verify results are being generated
# Monitor for failed runs
```

### Metrics to Track

1. **Vulnerability Metrics**
   - Critical/High/Medium/Low counts
   - Trend over time
   - Mean time to fix (MTTR)

2. **Workflow Metrics**
   - Execution time
   - Success rate
   - Alert response time

3. **Coverage Metrics**
   - % of codebase scanned
   - Language coverage
   - Container scan rate

---

## 🚨 Alert Configuration

### Critical Alert Triggers

| Trigger | Action | Recipient |
|---------|--------|-----------|
| Critical vulnerability found | Create issue, Slack alert | Security team |
| Zero-day threat detected (Aikido) | Page on-call | Security team |
| Scan failure (3x in a row) | Create incident | DevOps team |
| License violation | Create issue, notify legal | Legal + Security |

---

## 📖 Related Documentation

- **Snyk Integration:** [Snyk Docs](https://docs.snyk.io)
- **Aikido Integration:** [Aikido Docs](https://aikido.dev/docs)
- **GitHub Actions:** [GitHub Actions Docs](https://docs.github.com/en/actions)
- **Security Backlog:** `Admin/Security/SECURITY_BACKLOG_BUG_FIXES.md`
- **CVE Tracking:** `Admin/Security/CVE_2025_43859_RESOLUTION_CHECKLIST.md`

---

**Workflow Version:** 1.1  
**Last Updated:** January 3, 2026  
**Status:** ✅ ACTIVE & IMPLEMENTED

### 2026 Updates Applied:
- ✅ `actions/upload-artifact@v3` → `v4` (deprecated Apr 2024)
- ✅ `actions/github-script@v6` → `v7`
- ✅ Command syntax fixes for `safety` and `cyclonedx-py`
- ✅ Added Ruff linter integration for Python security scanning  

---

*This workflow provides continuous security monitoring and automated vulnerability management.*


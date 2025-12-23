# 🖱️ Cursor.ai Best Practices - DWS6 Project

---
# VERSION AND AGENT HISTORY
# (Näyttää kuka teki ja milloin, linkit sessioon)

Version: 0.2

Sessions & Modifications:
  - Version: 0.1 | Tool: Claude Code | Session: QVvDX | Commit: 050a2b6 | Date: 16.12.2025 15:10
  - Version: 0.2 | Tool: Claude Code | Session: QVvDX | Commit: (pending) | Date: 16.12.2025 16:05 | Changes: Added Language/Kieli field in Document Status

Session Links & References:
  - Claude Code (QVvDX): https://github.com/blogtheristo/dws6/commits/claude/review-thesis-plan-QVvDX
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/CURSOR_BEST_PRACTICES.md

Document Status:
  - Created: 16.12.2025 15:10
  - Last Modified: 16.12.2025 15:10
  - Language: English
  - Languages Available: English
  - Publication Status: Active

---

**Version:** 0.2
**Primary Tool:** Claude Code
**Session ID:** QVvDX
**Created:** 16.12.2025
**Last Modified:** 16.12.2025 16:05
**Status:** ✅ ACTIVE
**Language:** English

---

## 📋 Overview

This document provides best practices for using Cursor.ai in the DWS6 project. It distinguishes between two types of work and explains how workflows interact with different file types.

**Key Focus:**
- ✅ UI/Code modifications (like carousel changes)
- ✅ Documentation modifications (like Progress Reports)
- ✅ Automated workflow triggers
- ✅ Session tracking and versioning

---

## 🎯 CRITICAL DISTINCTION: CODE vs DOCUMENTATION

### Type 1: UI/CODE MODIFICATIONS (No Workflows Triggered)

**Examples:**
- `dws10.com/index.html` (carousel, styling, layout)
- React/Next.js components
- CSS files
- JavaScript/TypeScript files
- Configuration files (not Reports)

**Process:**
```
1. Cursor.ai modifies: dws10.com/index.html
2. Git commit message: "Fix carousel display - Cursor.ai session [YOUR_SESSION_ID]"
3. Push to branch: cursor/[task]-[YOUR_SESSION_ID]
4. NO version numbering needed (these are code, not docs)
5. NO workflow triggers (workflows watch Reports/ directory only)
```

**Example Commit:**
```bash
git commit -m "Improve carousel styling - responsive mobile design - Cursor.ai session R7k9M"
```

**Versioning:** ❌ NOT NEEDED
- Code changes use git commits for history
- No semantic versioning (0.1, 0.2) needed
- No metadata headers needed

---

### Type 2: DOCUMENTATION MODIFICATIONS (Workflows May Trigger)

**Examples:**
- `Reports/en/WEEKLY_REPORT.md`
- `Reports/fi/WEEKLY_REPORT_FI.md`
- Other `.md` files meant to be published

**Process:**
```
1. Cursor.ai modifies: Reports/en/WEEKLY_REPORT.md
2. Update version: 0.1 → 0.2 (in filename AND metadata)
3. Git commit message: "Update Progress Report - Versio 0.2 - Cursor.ai session [YOUR_SESSION_ID]"
4. Push to branch: cursor/[task]-[YOUR_SESSION_ID]
5. Next Monday 08:00 UTC → Workflow AUTOMATICALLY:
   - Generates PDF (generate_pdf.py)
   - Uploads to Google Drive (upload_to_drive.py)
   - Sends email with PDF (send_weekly_report.py)
```

**Example Commit:**
```bash
git commit -m "Update Progress Report - Versio 0.2 - Carousel improvements documented - Cursor.ai session R7k9M"
```

**Versioning:** ✅ REQUIRED
- Follow AI_AGENT_GUIDELINES: 0.1 → 0.2 → 0.3 → 1.0
- Update both filename AND metadata
- Document changes in Change Log
- Increment time stamp: 16.12.2025 15:10

---

## 🔄 WORKFLOW CATEGORIES - QUICK REFERENCE

### Category A: UI/CODE (No Workflow Impact)

| File Type | Location | Versioning | Workflows | Session ID |
|-----------|----------|-----------|-----------|-----------|
| HTML | `dws10.com/*.html` | ❌ No | None | ✅ In commit msg |
| CSS | `dws10.com/*.css` | ❌ No | None | ✅ In commit msg |
| JavaScript | `dws10.com/*.js` | ❌ No | None | ✅ In commit msg |
| React/Next | `sites/*/*.tsx` | ❌ No | None | ✅ In commit msg |

**Workflow Risk:** 🟢 **ZERO** (Workflows don't watch these files)

---

### Category B: REPORTS (Weekly Report Automation)

| File Type | Location | Versioning | Workflows | Session ID |
|-----------|----------|-----------|-----------|-----------|
| Markdown | `Reports/en/WEEKLY_REPORT.md` | ✅ Yes | weekly-report.yml | ✅ In commit msg |
| Markdown | `Reports/fi/WEEKLY_REPORT_FI.md` | ✅ Yes | weekly-report.yml | ✅ In commit msg |
| PDF | `Reports/en/WEEKLY_REPORT.pdf` | ❌ Auto-generated | N/A | N/A |
| PDF | `Reports/fi/WEEKLY_REPORT_FI.pdf` | ❌ Auto-generated | N/A | N/A |

**Workflow Risk:** 🟡 **MEDIUM** (Workflows auto-trigger Monday 08:00 UTC)

**Action:** Don't manually edit PDFs—they're auto-generated from markdown!

---

## 🚀 SCENARIO-BASED GUIDE

### SCENARIO 1: "I'm fixing carousel styling"

```
File: dws10.com/index.html
Task: Fix carousel CSS positioning

✅ DO:
1. Edit: dws10.com/index.html
2. Make CSS changes
3. Git commit: "Fix carousel display - absolute positioning - Cursor.ai session ABC123"
4. Git push
5. No versioning, no documentation needed

❌ DON'T:
- Don't add versioning (0.1, 0.2)
- Don't create metadata block
- Don't worry about workflow triggers
- Don't manually update Reports/
```

**Result:** Code change, no workflows affected, session tracked in commit.

---

### SCENARIO 2: "I'm updating the weekly progress report"

```
File: Reports/en/WEEKLY_REPORT.md
Task: Add carousel improvements to week summary

✅ DO:
1. Edit: Reports/en/WEEKLY_REPORT.md
2. Update version in filename: WEEKLY_REPORT.md (keep as is, version in metadata)
3. In file, update metadata:
   Version: 0.2
   LastModified: 16.12.2025 15:15
4. Add new content about carousel
5. Git commit: "Update Progress Report - Versio 0.2 - Added carousel UI improvements - Cursor.ai session ABC123"
6. Git push
7. Next Monday 08:00 UTC: Workflow auto-triggers → PDF generated + emailed

❌ DON'T:
- Don't manually edit WEEKLY_REPORT.pdf (auto-generated!)
- Don't skip version increment
- Don't forget to update metadata timestamp
- Don't commit without session ID reference
```

**Result:** Report updated, workflow queued for Monday, PDF auto-generated.

---

### SCENARIO 3: "I modified carousel, should I update the report?"

```
You changed: dws10.com/index.html (carousel CSS)
Question: Should I update Reports/en/WEEKLY_REPORT.md?

DECISION TREE:
├─ Is this a significant feature? YES → Add to next week's report
├─ Should it go in THIS week's report? MAYBE → Ask yourself:
│  ├─ Monday already passed? NO → You can update it
│  ├─ Monday already passed? YES → Save for next week's report
│  └─ It's Sunday night? UPDATE NOW before workflow runs
└─ Unsure? → Document it in a separate task

BEST PRACTICE:
→ Keep carousel code changes in git commits
→ Summarize weekly in Reports/ BEFORE Monday 08:00 UTC
→ Workflow handles PDF generation automatically
```

---

## 📊 WORKFLOW AUTOMATION DETAILS

### Weekly Report Workflow: `.github/workflows/weekly-report.yml`

**Trigger:**
- 🕐 Every Monday 08:00 UTC (10:00 Helsinki time)
- 📧 Or manual: GitHub UI → "Run workflow"

**Process:**
```
Monday 08:00 UTC
    ↓
Checkout Reports/ directory
    ↓
Run generate_pdf.py
    ├─ Read: Reports/en/WEEKLY_REPORT.md
    ├─ Read: Reports/fi/WEEKLY_REPORT_FI.md
    ├─ Generate: Reports/en/WEEKLY_REPORT.pdf (with Lifetime branding)
    ├─ Generate: Reports/fi/WEEKLY_REPORT_FI.pdf (with Lifetime branding)
    └─ Save with timestamp
    ↓
Run upload_to_drive.py
    ├─ Upload PDFs to Google Drive
    ├─ Store in GDRIVE_FOLDER_ID
    └─ Create timestamped versions
    ↓
Run send_weekly_report.py
    ├─ Send email with PDF attachment
    ├─ Recipients from SMTP settings
    └─ Include summary text
    ↓
Status: ✅ or ❌
```

**Important:** Workflow runs ONCE per week (Monday only!)

### Secrets Required (GitHub Settings → Secrets)

```yaml
SMTP_SENDER: your-email@example.com
SMTP_PASSWORD: app-specific-password
SMTP_SERVER: smtp.gmail.com (default)
SMTP_PORT: 587 (default)
GOOGLE_APPLICATION_CREDENTIALS: [JSON credentials]
GDRIVE_FOLDER_ID: [Google Drive folder ID]
```

---

## 🎯 CURSOR.AI SESSION TRACKING

### When to Use Session ID

**ALWAYS include your Cursor session ID in:**
- ✅ Git commit messages: `git commit -m "Fix carousel - Cursor.ai session ABC123"`
- ✅ Branch names: `cursor/carousel-fix-ABC123`
- ❌ NOT in filenames for code (only for docs)

### Example Commit Messages

**UI/Code Changes:**
```bash
git commit -m "Fix carousel absolute positioning - Cursor.ai session R7k9M"
git commit -m "Add mobile responsiveness to report carousel - Cursor.ai session R7k9M"
git commit -m "Update button styling for carousel - Cursor.ai session R7k9M"
```

**Documentation Changes:**
```bash
git commit -m "Update Progress Report - Versio 0.2 - Carousel improvements - Cursor.ai session R7k9M"
git commit -m "Create CURSOR_BEST_PRACTICES - Claude Code - QVvDX - Versio 0.1"
```

---

## ⚠️ COMMON PITFALLS - AVOID THESE

### ❌ Pitfall 1: Manually Editing PDFs

```
WRONG:
1. Edit Reports/en/WEEKLY_REPORT.pdf directly
2. Push to repo
3. Workflow overwrites your changes on Monday

CORRECT:
1. Edit Reports/en/WEEKLY_REPORT.md (markdown)
2. Push to repo
3. Workflow auto-generates PDF on Monday
```

**Why:** PDFs are OUTPUT, not source. Markdown is source.

---

### ❌ Pitfall 2: Forgetting Version Numbers

```
WRONG:
1. Edit Reports/en/WEEKLY_REPORT.md
2. Make changes
3. Commit: "Update report"
4. Nobody knows what changed or which version

CORRECT:
1. Edit Reports/en/WEEKLY_REPORT.md
2. Update version: 0.1 → 0.2
3. Update timestamp: 16.12.2025 15:10
4. Commit: "Update Progress Report - Versio 0.2 - Added carousel section"
5. Clear history and audit trail
```

**Why:** Versioning enables traceability and compliance.

---

### ❌ Pitfall 3: Workflow Timing Confusion

```
WRONG:
1. Edit Reports/ file on Monday at 08:05 UTC
2. Push to repo
3. Wonder why PDF isn't updated
4. Workflow already ran at 08:00 UTC!

CORRECT:
1. Edit Reports/ file BEFORE Monday 08:00 UTC (e.g., Sunday)
2. Push to repo
3. Workflow runs Monday 08:00 UTC and picks up your changes
4. PDF generated with latest content
```

**Why:** Workflows run on schedule, not on push.

**Manual Trigger:** If you need immediate PDF:
```
GitHub → Actions → Weekly Report Email Automation → Run workflow
```

---

### ❌ Pitfall 4: Not Tracking Session

```
WRONG:
1. Edit carousel with Cursor
2. Commit: "Fix carousel"
3. Later: "Who made this change? When? In which Cursor session?"
4. Cannot reproduce or find context

CORRECT:
1. Edit carousel with Cursor
2. Commit: "Fix carousel - Cursor.ai session R7k9M"
3. Later: Can find your session ID and all related work
4. Full audit trail and traceability
```

**Why:** Session tracking is critical for compliance and debugging.

---

## 📋 CURSOR CHECKLIST BEFORE COMMITTING

### For UI/Code Changes (carousel, styling, etc.)

- [ ] Changes are in correct file (HTML, CSS, JS, not Reports/)
- [ ] Git commit message includes Cursor session ID
- [ ] Branch name follows: `cursor/[task]-[SESSION_ID]`
- [ ] No version numbering added to code files
- [ ] No metadata block in code files
- [ ] Ready to push without triggering workflows

### For Documentation Changes (Progress Report, etc.)

- [ ] Changes are in Reports/ markdown files (not PDFs)
- [ ] Version updated: 0.1 → 0.2 (in filename AND metadata)
- [ ] Timestamp updated: `16.12.2025 15:10` (date hh:mm)
- [ ] Change log entry added
- [ ] Git commit message includes version and session ID
- [ ] Branch name follows: `cursor/[task]-[SESSION_ID]`
- [ ] Aware that workflow runs Monday 08:00 UTC

---

## 🔗 RELATED DOCUMENTATION

- **AI_AGENT_GUIDELINES.md:** General guidelines for all AI agents
- **LEGAL_COMPLIANCE.md:** Compliance and retention requirements
- **AI_TOOL_INTEGRATION_GUIDE.md:** Integration steps for all tools
- **.github/workflows/weekly-report.yml:** Workflow automation config

---

## 📈 VERSION HISTORY

| Version | Date | Changes | Tool/SessionID |
|---------|------|---------|---|
| 0.1 | 16.12.2025 15:10 | Initial Cursor best practices guide - UI vs Documentation distinction | Claude Code / QVvDX |
| 0.2 | 16.12.2025 16:05 | Added Language/Kieli field in Document Status for tracking locale versions | Claude Code / QVvDX |

---

**Last Updated:** 16.12.2025 16:05
**Status:** ✅ ACTIVE & READY FOR USE
**Audience:** Cursor.ai users in DWS6 project
**Language Support:** English (Suomi version planned)
**Next Review:** 16.01.2026

---

*This guide helps Cursor.ai users understand the difference between code changes and documentation changes, and how they interact with DWS6 project workflows.*

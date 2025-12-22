# 📋 VERSION AND AGENT HISTORY TEMPLATE

**Version:** 0.3
**Primary Tool:** Claude Code
**Session ID:** QVvDX
**Created:** 16.12.2025
**Last Modified:** 16.12.2025 16:05
**Status:** ✅ ACTIVE
**Language:** English

---

## 📖 Overview

This template shows the recommended format for tracking document versions and the agents/tools that created or modified them. This ensures full traceability and enables finding the original session context.

**Use this template in:**
- All new .md documents created by AI agents
- Documentation that will be published/archived
- Documents modified in version control workflow

---

## 🔧 TEMPLATE: VERSION AND AGENT HISTORY

Copy this section to the **beginning of every document** (after title):

```yaml
---
# VERSION AND AGENT HISTORY
# (Näyttää kuka teki ja milloin, linkit sessioon)

Version: 0.1

Sessions & Modifications:
  - Version: 0.1 | Tool: Claude Code | Session: QVvDX | Commit: 7d0b46c | Date: 16.12.2025

Session Links & References:
  - Claude Code (QVvDX): https://github.com/blogtheristo/dws6/commits/claude/review-thesis-plan-QVvDX
  - Cursor.ai (R7k9M): Search commits with "session R7k9M"
  - Linear Issue: [If applicable: https://linear.app/dws6/issue/DWS-XXX]
  - Gemini Session: [If applicable: gemini.google.com/app/ABC123]
  - GitHub Status: https://github.com/blogtheristo/dws6/blob/main/[file-path]

Document Status:
  - Created: 16.12.2025
  - Last Modified: 16.12.2025 15:30
  - Language: English | Kieli: Suomi
  - Languages Available: [English, Suomi, other versions]
  - Publication Status: Draft | Review | Approved | Published | Archived

Repository Status:
  - GitHub: ✅ Committed & Pushed | ⏳ Local only | 🔐 Protected
  - Location: /path/in/repo/ | Admin folder with restricted access
  - .gitignore: [If excluded] YES - Reason: [confidential/private/auto-generated]
  - Workflows: ⚙️ Auto-updated via [workflow-name] every [schedule]
  - Access Level: 🟢 Public | 🟡 Internal | 🔴 Restricted/Protected

Update Process:
  - Manual edits: [Who can edit - Risto only | Anyone]
  - Automated updates: [Workflow name triggers this]
  - Approval required: [Yes/No] - [Who approves]
  - Publishing: Via [workflow | manual merge | both]
---
```

---

## 📝 HOW TO UPDATE THIS SECTION

### When Creating NEW Document

```yaml
Version: 0.1

Sessions & Modifications:
  - Version: 0.1 | Tool: [Your Tool] | Session: [Your SessionID] | Commit: [git hash] | Date: 16.12.2025

Session Links & References:
  - [Your Tool] ([SessionID]): [Link or search instructions]
```

**Example:**
```yaml
Version: 0.1

Sessions & Modifications:
  - Version: 0.1 | Tool: Cursor.ai | Session: R7k9M | Commit: abc1234 | Date: 16.12.2025

Session Links & References:
  - Cursor.ai (R7k9M): git log --all --grep="session R7k9M"
```

---

### When UPDATING Existing Document

```yaml
Version: 0.3

Sessions & Modifications:
  - Version: 0.1 | Tool: Claude Code | Session: QVvDX | Commit: 7d0b46c | Date: 16.12.2025
  - Version: 0.2 | Tool: Cursor.ai | Session: R7k9M | Commit: 347a754 | Date: 16.12.2025 14:45
  - Version: 0.3 | Tool: Claude Code | Session: QVvDX | Commit: 050a2b6 | Date: 16.12.2025 15:15

Session Links & References:
  - Claude Code (QVvDX): https://github.com/blogtheristo/dws6/commits/claude/review-thesis-plan-QVvDX
  - Cursor.ai (R7k9M): git log --all --grep="session R7k9M"
```

---

## 🔗 SESSION LINKS BY TOOL

### Claude Code

**Format:** Branch-based tracking

```
Branch: claude/[task]-[SESSION_ID]
Link: https://github.com/blogtheristo/dws6/commits/[branch-name]

Example:
  Branch: claude/review-thesis-plan-QVvDX
  Link: https://github.com/blogtheristo/dws6/commits/claude/review-thesis-plan-QVvDX

In document:
  - Claude Code (QVvDX): https://github.com/blogtheristo/dws6/commits/claude/review-thesis-plan-QVvDX
```

### Cursor.ai

**Format:** Session ID in commit messages

```
Commit message: "... - Cursor.ai session R7k9M"
Search: git log --all --grep="session R7k9M"

In document:
  - Cursor.ai (R7k9M): git log --all --grep="session R7k9M"
  - Or: Search GitHub commits for "session R7k9M"
```

### Linear

**Format:** Direct issue link

```
Issue URL: https://linear.app/dws6/issue/DWS-123
View all commits linked to issue

In document:
  - Linear Issue (DWS-123): https://linear.app/dws6/issue/DWS-123
```

### Gemini.app

**Format:** Optional session URL (if shareable)

```
Session URL: gemini.google.com/app/[SESSION_ID]
Note: Privacy considerations - include only if appropriate

In document:
  - Gemini Session (ABC123): gemini.google.com/app/ABC123 [Optional]
```

---

## 📊 COMPLETE EXAMPLE

### Example 1: Single Author (Claude Code) - Public Document

```yaml
---
# VERSION AND AGENT HISTORY

Version: 0.1

Sessions & Modifications:
  - Version: 0.1 | Tool: Claude Code | Session: QVvDX | Commit: 7d0b46c | Date: 16.12.2025

Session Links & References:
  - Claude Code (QVvDX): https://github.com/blogtheristo/dws6/commits/claude/review-thesis-plan-QVvDX
  - GitHub: https://github.com/blogtheristo/dws6/blob/main/AI_AGENT_GUIDELINES.md

Document Status:
  - Created: 16.12.2025
  - Last Modified: 16.12.2025
  - Language: English
  - Languages Available: English
  - Publication Status: Published

Repository Status:
  - GitHub: ✅ Committed & Pushed
  - Location: Root directory
  - .gitignore: NO
  - Workflows: None (manual documentation)
  - Access Level: 🟢 Public
  - Update Process: Manual edits by AI agents | No workflow | Approval by Risto required
---
```

---

### Example 2: Multiple Authors (Claude → Cursor → Claude) - Public Documentation

```yaml
---
# VERSION AND AGENT HISTORY

Version: 0.3

Sessions & Modifications:
  - Version: 0.1 | Tool: Claude Code | Session: QVvDX | Commit: 7d0b46c | Date: 16.12.2025
  - Version: 0.2 | Tool: Cursor.ai | Session: R7k9M | Commit: 347a754 | Date: 16.12.2025 14:45 | Changes: Added examples
  - Version: 0.3 | Tool: Claude Code | Session: QVvDX | Commit: 050a2b6 | Date: 16.12.2025 15:15 | Changes: Final review & publishing prep

Session Links & References:
  - Claude Code (QVvDX): https://github.com/blogtheristo/dws6/commits/claude/review-thesis-plan-QVvDX
  - Cursor.ai (R7k9M): git log --all --grep="session R7k9M"
  - GitHub: https://github.com/blogtheristo/dws6/blob/main/AI_AGENT_GUIDELINES.md

Document Status:
  - Created: 16.12.2025
  - Last Modified: 16.12.2025 15:15
  - Language: English
  - Languages Available: English
  - Publication Status: Published

Repository Status:
  - GitHub: ✅ Committed & Pushed
  - Location: Root directory (Public)
  - .gitignore: NO
  - Workflows: None
  - Access Level: 🟢 Public
  - Update Process: Manual by multiple agents | Approval by Risto before publishing
---
```

---

### Example 3: With Linear Tracking

```yaml
---
# VERSION AND AGENT HISTORY

Version: 0.2

Sessions & Modifications:
  - Version: 0.1 | Tool: Gemini.app | Session: ABC123 | Commit: abc1234 | Date: 16.12.2025
  - Version: 0.2 | Tool: Cursor.ai | Session: R7k9M | Commit: def5678 | Date: 16.12.2025 14:30

Session Links & References:
  - Gemini Session (ABC123): gemini.google.com/app/ABC123
  - Cursor.ai (R7k9M): git log --all --grep="session R7k9M"
  - Linear Issue (DWS-456): https://linear.app/dws6/issue/DWS-456
  - GitHub: https://github.com/blogtheristo/dws6/blob/main/DOCUMENTATION.md

Document Status:
  - Created: 16.12.2025
  - Last Modified: 16.12.2025 14:30
  - Language: English
  - Languages Available: English
  - Publication Status: In Review

Repository Status:
  - GitHub: ✅ Committed & Pushed
  - Location: Internal documentation folder
  - .gitignore: NO
  - Workflows: None
  - Access Level: 🟡 Internal (Team review)
  - Update Process: Manual edits tracked in Linear | Linear approvals required
---
```

---

### Example 4: Automated Workflow (Weekly Reports)

```yaml
---
# VERSION AND AGENT HISTORY

Version: 0.2

Sessions & Modifications:
  - Version: 0.1 | Tool: Claude Code | Session: QVvDX | Commit: abc1234 | Date: 16.12.2025 | Source: Markdown
  - Version: 0.2 | Tool: Claude Code | Session: QVvDX | Commit: def5678 | Date: 16.12.2025 15:00 | Changes: Updated progress data

Session Links & References:
  - Claude Code (QVvDX): https://github.com/blogtheristo/dws6/commits/claude/review-thesis-plan-QVvDX
  - GitHub Source (Markdown): https://github.com/blogtheristo/dws6/blob/main/Reports/en/WEEKLY_REPORT.md
  - GitHub Output (PDF): https://github.com/blogtheristo/dws6/blob/main/Reports/en/WEEKLY_REPORT.pdf

Document Status:
  - Created: 16.12.2025
  - Last Modified: 16.12.2025 15:00
  - Language: English
  - Languages Available: English, Suomi
  - Publication Status: Published & Auto-distributed

Repository Status:
  - GitHub: ✅ Committed & Pushed (Markdown source)
  - Location: Reports/en/ (source) + Reports/en/WEEKLY_REPORT.pdf (auto-generated)
  - .gitignore: PDF files ARE tracked (auto-generated outputs)
  - Workflows: ⚙️ Auto-updated via "weekly-report.yml" every Monday 08:00 UTC
  - Access Level: 🟢 Public (reports) + 🔐 Protected (automated distribution list)

Update Process:
  - Manual: Edit Reports/en/WEEKLY_REPORT.md before Monday 08:00 UTC
  - Automated:
    * Workflow runs Monday 08:00 UTC
    * Generates PDF with Lifetime branding
    * Uploads to Google Drive (automated)
    * Sends email to distribution list (automated)
  - Approval: Risto reviews before publishing (optional)
  - Note: ⚠️ PDF is auto-generated - NEVER edit .pdf files directly! Edit .md source only!
---
```

---

## ✅ IMPLEMENTATION CHECKLIST

When creating a new document, include this section:

- [ ] **Title** of document (# Title)
- [ ] **VERSION AND AGENT HISTORY** metadata block (copy from above)
- [ ] **Version** number (0.1 for new)
- [ ] **Tool** name (Claude Code, Cursor.ai, etc.)
- [ ] **Session ID** (from your tool settings)
- [ ] **Commit hash** (from git after first commit)
- [ ] **Date** in format pv.kk.vvvv (16.12.2025)
- [ ] **Session Links** section with appropriate tool link
- [ ] **Document Status** (Draft/Review/Approved/Published)
- [ ] Content starts AFTER this metadata block

---

## 🔄 UPDATING PROCESS (For Cursor, Gemini, Linear users)

### Step 1: Open Document
```
Open: [Document_Name].md
```

### Step 2: Update VERSION AND AGENT HISTORY
```yaml
Version: [increment: 0.1 → 0.2]

Sessions & Modifications:
  [Keep existing entries]
  - Version: 0.2 | Tool: [Your Tool] | Session: [Your ID] | Commit: [new hash] | Date: [today] hh:mm | Changes: [what you changed]
```

### Step 3: Update Document Status
```yaml
Document Status:
  - Created: [original date]
  - Last Modified: [today with hh:mm]
  - Publication Status: [current status]
```

### Step 4: Commit
```bash
git commit -m "Update [Document Name] - Versio 0.2 - [Tool] session [SessionID]"
```

### Step 5: Verify on GitHub
```
https://github.com/blogtheristo/dws6/commits/main
Look for your commit → view file
Check that VERSION AND AGENT HISTORY was updated
```

---

## 🚀 BEST PRACTICES

### DO ✅

- ✅ **Always include** VERSION AND AGENT HISTORY in new docs
- ✅ **Update** when version number changes
- ✅ **Include** git commit hash (first 7 characters)
- ✅ **Link to** GitHub branch or commits
- ✅ **Document** what changed in each version
- ✅ **Use consistent** date format: pv.kk.vvvv hh:mm
- ✅ **Keep timestamps** accurate

### DON'T ❌

- ❌ **Don't** leave placeholder values [like this]
- ❌ **Don't** forget to update on version increment
- ❌ **Don't** include broken links
- ❌ **Don't** mix date formats
- ❌ **Don't** skip session information
- ❌ **Don't** make links to private/internal systems

---

## 📞 QUESTIONS?

Refer to:
- **AI_AGENT_GUIDELINES.md** - General agent guidelines
- **DOCUMENTATION_PUBLISHING_CHECKLIST.md** - Publishing process
- **GitHub Commits** - Verify session links work

---

## 📈 VERSION HISTORY

| Version | Date | Changes | Tool/SessionID |
|---------|------|---------|---|
| 0.1 | 16.12.2025 15:30 | Initial template creation | Claude Code / QVvDX |
| 0.2 | 16.12.2025 15:50 | Added Repository Status section (GitHub links, Protected status, .gitignore, Workflows); added Example 4 for automated workflows | Claude Code / QVvDX |
| 0.3 | 16.12.2025 16:05 | Added Language/Kieli field in Document Status for version tracking across locales (English, Suomi, etc.) | Claude Code / QVvDX |

---

**Last Updated:** 16.12.2025 16:05
**Status:** ✅ ACTIVE & READY FOR USE
**Audience:** All AI agents creating/modifying documents
**Language Support:** English, Suomi (templates ready for localization)
**Next Review:** 16.01.2026

---

*This template ensures full traceability of all document versions and their creation/modification history.*

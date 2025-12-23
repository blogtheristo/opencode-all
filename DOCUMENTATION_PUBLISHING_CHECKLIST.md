# 📋 DOCUMENTATION PUBLISHING CHECKLIST

---
# VERSION AND AGENT HISTORY
# (Näyttää kuka teki ja milloin, linkit sessioon)

Version: 0.2

Sessions & Modifications:
  - Version: 0.1 | Tool: Claude Code | Session: QVvDX | Commit: f7f7f7e | Date: 16.12.2025 15:35
  - Version: 0.2 | Tool: Claude Code | Session: QVvDX | Commit: (pending) | Date: 16.12.2025 16:05 | Changes: Added Language/Kieli field in Document Status

Session Links & References:
  - Claude Code (QVvDX): https://github.com/blogtheristo/dws6/commits/claude/review-thesis-plan-QVvDX
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/DOCUMENTATION_PUBLISHING_CHECKLIST.md

Document Status:
  - Created: 16.12.2025
  - Last Modified: 16.12.2025 16:05
  - Language: English
  - Languages Available: English
  - Publication Status: ✅ ACTIVE

---

**Version:** 0.2
**Primary Tool:** Claude Code
**Session ID:** QVvDX
**Created:** 16.12.2025
**Last Modified:** 16.12.2025 16:05
**Status:** ✅ ACTIVE
**Language:** English

---

## 📖 Overview

This document outlines the complete process for publishing documentation in the DWS6 project. When any new .md file is created or significant updates are made, the ENTIRE documentation ecosystem must be updated to maintain consistency and compliance.

**Key Principle:** Documentation is not published until ALL related documents are updated and Risto has approved via Keep/Edit process.

---

## 🎯 PUBLISHING WORKFLOW OVERVIEW

```
Document Created/Updated
    ↓
Developer (Claude Code, Cursor, Gemini)
    ├─ Creates/updates .md file with VERSION AND AGENT HISTORY
    ├─ Commits to feature branch
    ├─ Pushes to GitHub
    └─ Notifies: "Documentation ready for publishing"
    ↓
CHECKLIST PREPARATION
    ├─ Identify all affected documents
    ├─ List required updates
    ├─ Prepare KEEP/EDIT questions for Risto
    └─ Present to Risto for decision
    ↓
RISTO REVIEW & APPROVAL
    ├─ Review changes
    ├─ Decide: Keep existing | Edit content
    ├─ Approve or suggest modifications
    └─ Return to developer with decisions
    ↓
IMPLEMENTATION
    ├─ Update ADMIN_MANUAL.md
    ├─ Update INSTALLATION_MANUAL.md
    ├─ Update WEEKLY_REPORT (en + fi)
    ├─ Update DOCUMENTATION_INDEX.md
    ├─ Update all related workflow files
    ├─ Update related .github/workflows files
    └─ Verify all links work
    ↓
FINAL VERIFICATION
    ├─ All documents updated
    ├─ All links valid
    ├─ VERSION AND AGENT HISTORY complete
    ├─ Cross-references accurate
    └─ Approval from Risto confirmed
    ↓
PUBLISH (Merge to Main)
    └─ Ready for production
```

---

## 📊 DOCUMENTS THAT REQUIRE UPDATES

When publishing NEW or MODIFIED documentation:

### **Tier 1: ALWAYS UPDATE** (Critical)

- [ ] **DOCUMENTATION_INDEX.md** - Add/update entry + link
- [ ] **AI_AGENT_GUIDELINES.md** - If changes affect AI processes
- [ ] **LEGAL_COMPLIANCE.md** - If compliance aspects changed
- [ ] **VERSION_AND_AGENT_HISTORY_TEMPLATE.md** - Update examples if new pattern
- [ ] **CURSOR_BEST_PRACTICES.md** - If affects Cursor workflows

### **Tier 2: UPDATE IF RELEVANT** (Important)

- [ ] **ADMIN_MANUAL.md** - If operational procedures changed
- [ ] **INSTALLATION_MANUAL.md** - If setup/installation affected
- [ ] **Reports/en/WEEKLY_REPORT.md** - If new feature/process
- [ ] **Reports/fi/WEEKLY_REPORT_FI.md** - Finnish equivalent
- [ ] **QUICKSTART.md** - If getting started process changed
- [ ] **.github/workflows/*.yml** - If automation affected

### **Tier 3: REFERENCE & ARCHIVE** (Compliance)

- [ ] **_archive/** - Previous versions (if v1.0+)
- [ ] **LEGAL_COMPLIANCE.md** - Retention & archival rules
- [ ] **Git commit history** - All changes tracked

---

## 🤔 KEEP/EDIT QUESTIONS FOR RISTO

Before publishing, prepare decision questions for Risto. Use this template:

### **DOCUMENTATION PUBLISHING DECISION FORM**

**Document Being Published:**
```
Title: [Document Name]
Version: 0.X
Tool: [Claude Code | Cursor.ai | Gemini.app]
Changes Summary: [What changed]
```

**QUESTION SET 1: Content Review**

```
Q1: ADMIN_MANUAL.md
   Current Status: [Describe current content]
   New Documentation: [What needs to be added]
   KEEP or EDIT?
   ☐ KEEP - Existing content is sufficient
   ☐ EDIT - Please modify with: [specific request]
   ☐ ADD - Please add new section: [describe]

Q2: INSTALLATION_MANUAL.md
   Current Status: [Describe]
   Changes from new doc: [What's different]
   KEEP or EDIT?
   ☐ KEEP
   ☐ EDIT - Modification needed: [describe]
```

**QUESTION SET 2: Workflow Updates**

```
Q3: WEEKLY_REPORT (en/fi versions)
   Should we include this in next week's report?
   ☐ YES - Add to Monday's automated report
   ☐ NO - Keep separate from weekly reports
   ☐ CONDITIONAL - Only if [condition]

Q4: GitHub Workflows (.github/workflows/)
   Do these automation rules need updating?
   ☐ YES - Update: [specify which]
   ☐ NO - Current workflows OK
   ☐ NEW - Create new workflow for: [purpose]
```

**QUESTION SET 3: Archival & Retention**

```
Q5: Archive Requirements
   When should this documentation be archived?
   ☐ Immediately after v1.0
   ☐ After [time period]
   ☐ Keep indefinitely
   ☐ Archive location: [specify]

Q6: Compliance & Legal
   Does this documentation require:
   ☐ Legal review (GDPR/NIS2)?
   ☐ Compliance sign-off?
   ☐ Audit trail? (If yes, already documented)
   ☐ None of above
```

---

## ✅ PUBLICATION CHECKLIST - STEP BY STEP

### PHASE 1: PREPARATION (Before asking Risto)

- [ ] **New document created** with:
  - [ ] VERSION AND AGENT HISTORY metadata block
  - [ ] Proper version number (0.1 if new)
  - [ ] Session ID and tool tracked
  - [ ] Git commit hash included
  - [ ] Timestamp with date + time

- [ ] **Identify all affected documents** (Tier 1 & 2 above)

- [ ] **Create KEEP/EDIT form** (see template above)

- [ ] **Prepare summary email/message** for Risto:
  ```
  Subject: Documentation Publishing Decision Needed - [Document Name]

  New document: [Name]
  Version: 0.1 (initial) / 0.X (update)
  Created by: [Tool] session [SessionID]
  Changes: [Brief summary]

  Please review and answer KEEP/EDIT questions below:
  [Include KEEP/EDIT form]
  ```

---

### PHASE 2: RISTO REVIEW

⏸️ **WAIT FOR RISTO'S RESPONSE** - Do NOT proceed until decisions received

Risto will provide:
- ✅/❌ on each KEEP/EDIT question
- 📝 Modification requests if EDIT selected
- 📋 New content or links to reference
- ⏰ Timeline for implementation

---

### PHASE 3: IMPLEMENTATION (After Risto Approves)

#### **3.1 Update DOCUMENTATION_INDEX.md**

```markdown
| Document | Purpose | Status | Version |
|----------|---------|--------|---------|
| [New Doc] | [Purpose] | ✅ [Status] | 0.1 |
```

- [ ] Entry added with link
- [ ] Category assigned
- [ ] Read time estimated
- [ ] Cross-references added

#### **3.2 Update ADMIN_MANUAL.md**

- [ ] New operational procedures added (if applicable)
- [ ] Updated with section: "As of [date], [new process]..."
- [ ] VERSION AND AGENT HISTORY added
- [ ] Linked to new documentation
- [ ] Version bumped: 0.X → 0.Y

#### **3.3 Update INSTALLATION_MANUAL.md**

- [ ] Installation steps updated (if applicable)
- [ ] New dependencies listed (if applicable)
- [ ] Setup procedures clarified
- [ ] VERSION AND AGENT HISTORY added
- [ ] Troubleshooting section updated

#### **3.4 Update WEEKLY_REPORT (en)**

```
## NEW: [Feature/Documentation Name]
Added: [Date]
Details: [Link to documentation]
Status: [Live | In Testing | Planned]
Impact: [Brief description]
```

- [ ] New entry added (if Risto approved)
- [ ] English version updated
- [ ] VERSION AND AGENT HISTORY updated

#### **3.5 Update WEEKLY_REPORT (fi)**

- [ ] Finnish translation of above
- [ ] Maintained parity with English version
- [ ] VERSION AND AGENT HISTORY updated

#### **3.6 Update Related Workflows**

- [ ] Check `.github/workflows/*.yml` for affected automations
- [ ] Update trigger conditions if needed
- [ ] Update documentation references
- [ ] Test workflows locally (if applicable)

#### **3.7 Verify All Links**

```bash
# Check all links in documentation
grep -r "https://" *.md | sort | uniq

# Verify GitHub links work
# Verify Linear links (if applicable)
# Verify internal file paths
```

- [ ] All GitHub links valid
- [ ] All Linear links (if used) valid
- [ ] All file paths correct
- [ ] All broken links fixed

#### **3.8 Update VERSION AND AGENT HISTORY EVERYWHERE**

All modified documents must have updated:

```yaml
Version: 0.Y (incremented)
Last Modified: [today] hh:mm
Sessions & Modifications: [add new entry]
Session Links: [add if new tool involved]
```

- [ ] DOCUMENTATION_INDEX.md
- [ ] ADMIN_MANUAL.md
- [ ] INSTALLATION_MANUAL.md
- [ ] WEEKLY_REPORT (en)
- [ ] WEEKLY_REPORT (fi)
- [ ] Any workflow files touched
- [ ] Any template files updated

---

### PHASE 4: FINAL VERIFICATION

Before merging to main branch:

- [ ] **Git status clean** - All changes staged
- [ ] **Git diff reviewed** - Changes as expected
- [ ] **All documents updated** - No orphaned references
- [ ] **VERSION AND AGENT HISTORY** complete in all modified files
- [ ] **Links verified** - No broken references
- [ ] **DATE/TIME stamps** current - Using pv.kk.vvvv hh:mm format
- [ ] **Commit messages clear** - Describe what was updated
- [ ] **Risto final approval** - "Ready to merge" confirmation

---

### PHASE 5: PUBLISH (Merge to Main)

```bash
# Final checklist before merge
git status                    # Should be clean
git log -5 --oneline         # Last 5 commits look good
git diff main..HEAD          # Review all changes

# If all good:
git checkout main
git pull origin main
git merge --no-ff [feature-branch]
git push origin main

# Create release tag (if v1.0+)
git tag -a v1.0 -m "Documentation Release v1.0"
git push origin v1.0
```

- [ ] Merged to `main` branch
- [ ] Pushed to GitHub
- [ ] Release tag created (if applicable)
- [ ] Team notified of publishing

---

## 🚨 COMMON MISTAKES - AVOID THESE

### ❌ Mistake 1: Publishing Without Tier 1 Updates

```
WRONG:
1. Create new documentation
2. Commit to main
3. Forget to update DOCUMENTATION_INDEX.md
→ Result: Document exists but is undiscoverable

CORRECT:
1. Create new documentation
2. Update ALL Tier 1 documents
3. Ask Risto about Tier 2 updates
4. Get approval
5. Commit to main
```

---

### ❌ Mistake 2: Skipping Risto's Review

```
WRONG:
1. Create documentation
2. Assume what should be updated
3. Update everything yourself
4. Merge to main
→ Result: Duplicate/conflicting content, outdated procedures

CORRECT:
1. Create documentation
2. Prepare KEEP/EDIT questions
3. Wait for Risto's decisions
4. Implement according to decisions
5. Get final approval
6. Merge to main
```

---

### ❌ Mistake 3: Missing VERSION AND AGENT HISTORY

```
WRONG:
- ADMIN_MANUAL.md updated but no VERSION AND AGENT HISTORY
- INSTALLATION_MANUAL.md edited but timestamp missing
- Links updated but Session ID not tracked

CORRECT:
- Every modified file gets VERSION AND AGENT HISTORY
- Every file has current timestamp (pv.kk.vvvv hh:mm)
- Every version change tracked with session info
```

---

### ❌ Mistake 4: Broken Links After Publishing

```
WRONG:
1. Update DOCUMENTATION_INDEX.md
2. Add link to new document
3. New document is named differently later
4. Link now broken, nobody updates it

CORRECT:
1. Verify final filename BEFORE linking
2. Use consistent naming: [Name] - [Tool] - [SessionID] - Versio X.Y
3. Test all links after publishing
4. Verify links work from outside (not just local)
```

---

## 📞 WHEN TO CONTACT RISTO

| Situation | Action |
|-----------|--------|
| Creating NEW documentation | **Always ask** - KEEP/EDIT form |
| Major updates to existing docs | **Always ask** - might affect multiple docs |
| Minor fixes/typos | **No need to ask** - just update |
| Structural changes (headings, sections) | **Ask** - affects navigation |
| Adding new workflow/automation | **Always ask** - complex impacts |
| Updating only version numbers | **No need to ask** - routine |
| Unclear if change is "major" | **Ask first** - better safe |

---

## 📈 VERSION HISTORY

| Version | Date | Changes | Tool/SessionID |
|---------|------|---------|---|
| 0.1 | 16.12.2025 15:35 | Initial publishing checklist guide | Claude Code / QVvDX |
| 0.2 | 16.12.2025 16:05 | Added Language/Kieli field in Document Status for tracking locale versions; added full VERSION AND AGENT HISTORY metadata block | Claude Code / QVvDX |

---

**Last Updated:** 16.12.2025 16:05
**Status:** ✅ ACTIVE & READY FOR USE
**Audience:** All documentation publishers in DWS6 project
**Language Support:** English (Suomi version planned)
**Next Review:** 16.01.2026

---

*Use this checklist to ensure documentation publishing is complete, tracked, and approved before deployment to production.*

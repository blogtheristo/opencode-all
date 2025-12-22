# 🤖 AI Agent Guidelines - DWS6 Project

---
# VERSION AND AGENT HISTORY
# (Näyttää kuka teki ja milloin, linkit sessioon)

Version: 0.3

Sessions & Modifications:
  - Version: 0.1 | Tool: Claude Code | Session: QVvDX | Commit: 7d0b46c | Date: 16.12.2025
  - Version: 0.2 | Tool: Claude Code | Session: QVvDX | Commit: 347a754 | Date: 16.12.2025 14:45
  - Version: 0.3 | Tool: Claude Code | Session: QVvDX | Commit: 050a2b6 | Date: 16.12.2025 15:15 | Changes: Added Part 8 Cursor.ai Advanced Usage

Session Links & References:
  - Claude Code (QVvDX): https://github.com/blogtheristo/dws6/commits/claude/review-thesis-plan-QVvDX
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/AI_AGENT_GUIDELINES.md

Document Status:
  - Created: 16.12.2025
  - Last Modified: 16.12.2025 15:15
  - Language: English
  - Languages Available: English
  - Publication Status: Active

---

**Version:** 0.3
**Primary Tool:** Claude Code
**Session ID:** QVvDX
**Created:** 16.12.2025
**Last Modified:** 16.12.2025 15:15
**Status:** ✅ ACTIVE

---

## 📋 Overview

This document establishes standardized procedures for all AI agents and tools working on the DWS6 project. These guidelines ensure consistency, traceability, and compliance across different AI platforms.

**Applicable to:**
- ✅ Claude Code (Anthropic)
- ✅ Cursor.ai (Code Editor AI)
- ✅ Gemini.app (Google's Generative AI)
- ✅ Linear (AI-assisted project management)
- ✅ Other LLM-based tools

---

## 🏷️ Part 1: DOCUMENTATION NAMING CONVENTION

### Standard Format

All documents created or significantly modified by AI agents **MUST** follow this naming convention:

```
[Document Name] - [Tool] - [Session ID] - Versio X.Y
```

### Components

| Component | Description | Example |
|-----------|-------------|---------|
| **Document Name** | Clear, descriptive name | `Riston_Opinnäytetyön_Toteutussuunnitelma` |
| **Tool** | AI tool used | `Claude Code` / `Cursor.ai` / `Gemini.app` / `Linear` |
| **Session ID** | Unique session identifier | `QVvDX` |
| **Version** | Semantic versioning (X.Y) | `0.1` → `0.2` → `1.0` |

### Examples

✅ **CORRECT:**
```
DWS6_Authentication_System - Claude Code - QVvDX - Versio 0.1
API_Integration_Guide - Cursor.ai - R7k9M - Versio 0.2
Meeting_Notes_Q4_2025 - Gemini.app - PqXyZ - Versio 1.0
Project_Roadmap - Linear - GmW2L - Versio 0.3
```

❌ **INCORRECT:**
```
DWS6_Authentication_System.md  ← No tool/session info
API_Guide_v1.doc  ← No tool identifier
Meeting_Notes  ← Missing version tracking
```

### Metadata Block

Include metadata at the top or bottom of every document:

```yaml
---
Title: [Document Name]
Tool: [AI Agent/Tool]
SessionID: [Session ID]
Version: 0.1
Created: YYYY-MM-DD
LastModified: YYYY-MM-DD
CreatedBy: [Tool Name]
Repository: dws6
---
```

---

## 📈 Part 2: VERSIONING STRATEGY

### Version Numbering

**Format:** `X.Y` (Major.Minor)

- **X (Major):** Significant structural changes, complete rewrites
- **Y (Minor):** Incremental updates, additions, bug fixes

### Version Lifecycle

```
0.1 → First draft/creation
0.2 → First review, corrections
0.3 → Additional refinements
...
0.9 → Pre-release version
1.0 → Release/completion
1.1 → Post-release updates
```

### When to Increment Version

| Action | Version Change |
|--------|-----------------|
| Create new document | Start at 0.1 |
| Small fixes, typos, formatting | +0.1 (0.1 → 0.2) |
| Add sections or content | +0.1 (0.2 → 0.3) |
| Major restructuring | +0.1 (→ 0.9, then → 1.0 for release) |
| Release for production | → 1.0 |
| Post-release patches | +0.1 (1.0 → 1.1) |

### Version Increment Rules

**AI agents MUST:**
1. Increment version when modifying document
2. Update LastModified timestamp
3. Add change summary to git commit
4. Keep version in filename

**Example commit message:**
```
Update DWS6_Authentication_System - Claude Code - QVvDX - Versio 0.2
- Added OAuth2 flow diagrams
- Fixed authentication examples
- Clarified permission scopes
```

---

## 🔗 Part 3: SESSION TRACKING & TRACEABILITY

### Why Session IDs Matter

Session IDs enable:
- 🔍 Finding full context (git history)
- 🤝 Identifying collaborators
- 📊 Tracking document evolution
- 🛠️ Reproducing work or continuing mid-session

### Session ID Format

- **Length:** 5-6 characters
- **Pattern:** Alphanumeric (letters + numbers)
- **Examples:** `QVvDX`, `R7k9M`, `PqXyZ`, `GmW2L`

### Session ID Sources

| Tool | How to Find Session ID |
|------|------------------------|
| **Claude Code** | Check branch name: `claude/[description]-[SESSION_ID]` |
| **Cursor.ai** | Check Cursor settings → Session info |
| **Gemini.app** | Visible in browser console or app UI |
| **Linear** | Team settings → AI assistant sessions |

### Git Integration

**Every session should have a corresponding git branch:**

```bash
# Claude Code pattern
claude/feature-description-SESSIONID

# Example
claude/review-thesis-plan-QVvDX
claude/auth-implementation-R7k9M
```

---

## 📝 Part 4: METADATA REQUIREMENTS

### Mandatory Metadata

Every AI-generated or AI-modified document must include:

```yaml
---
# Document Identification
Title: [Descriptive Name]
DocumentID: [Auto-generated UUID or hash]
Tool: [Claude Code | Cursor.ai | Gemini.app | Linear]
SessionID: [Session Identifier]

# Versioning
Version: 0.1
Created: 2025-12-16
LastModified: 2025-12-16
VersionHistory:
  - "0.1: Initial creation"
  - "0.2: Added diagrams"

# Classification
Classification: Internal / Public / Confidential
Language: en / fi
Status: Draft / Review / Approved / Released

# Tracking
Repository: dws6
Branch: claude/review-thesis-plan-QVvDX
GitCommit: [Latest commit hash]
CreatedBy: [Tool Name]
LastModifiedBy: [Tool Name]

# Tags
Tags: [architecture, authentication, testing, etc.]
RelatedDocuments: [Link to related docs]
---
```

### Minimal Metadata (Minimum Required)

If full metadata is too verbose, use minimal version:

```yaml
---
Tool: Claude Code | Cursor.ai | Gemini.app | Linear
SessionID: XXXXX
Version: 0.1
---
```

---

## 🔄 Part 5: DOCUMENT LIFECYCLE WORKFLOW

### Phase 1: Creation

```
AI Agent creates document
    ↓
Name: [Title] - [Tool] - [SessionID] - Versio 0.1
    ↓
Add metadata block (minimal or full)
    ↓
Save to repository
    ↓
Commit with message including version
```

**Example commit:**
```
Create API_Integration_Guide - Claude Code - QVvDX - Versio 0.1
- Initial authentication flow documentation
- 5 code examples
- Ready for review
```

### Phase 2: Updates & Iterations

```
AI Agent reviews document
    ↓
Makes changes/additions
    ↓
Update Version: 0.1 → 0.2
    ↓
Update LastModified timestamp
    ↓
Update filename if needed
    ↓
Commit: "Update [Title] - Versio 0.2"
```

### Phase 3: Review & Approval

```
Document reaches maturity
    ↓
Increment to pre-release: Versio 0.9
    ↓
Mark Status: "Ready for Release"
    ↓
After approval: Versio 1.0
    ↓
Status: "Released"
```

### Phase 4: Maintenance

```
Document in production (Versio 1.0+)
    ↓
Bug fixes or minor updates: 1.0 → 1.1
    ↓
Major updates: Plan for 2.0
    ↓
Maintain backward compatibility info
```

---

## 🛠️ Part 6: TOOL-SPECIFIC INSTRUCTIONS

### Claude Code

```yaml
Tool: Claude Code
Session Identifier: Found in branch name
Branch Pattern: claude/[task]-[SESSION_ID]
Commit Prefix: Use descriptive + version
Document Storage: dws6 repository root or subdirectories
Metadata: Mandatory (minimal or full)
```

**Claude Code Workflow:**
1. ✅ Check session ID from branch name
2. ✅ Create/modify document with version 0.1
3. ✅ Include metadata block
4. ✅ Commit to named branch
5. ✅ Use `-u` flag on first push: `git push -u origin claude/...`

### Cursor.ai

```yaml
Tool: Cursor.ai
Session Identifier: Own unique ID per Cursor session (separate from other tools)
Integration: Works with local .git repository
Commit Prefix: Reference your session ID (not in filename for existing docs)
Document Storage: Same as project structure
Metadata: Only if creating NEW document
```

**Cursor.ai Workflow - Creating NEW document:**
1. ✅ Find your Cursor session ID in settings
2. ✅ Create document with version 0.1
3. ✅ Add minimal metadata with Tool: "Cursor.ai" + your SessionID
4. ✅ Commit: `git commit -m "Create [Document] - Cursor.ai - [YOUR_SESSION_ID] - Versio 0.1"`
5. ✅ Push to feature branch

**Cursor.ai Workflow - Updating EXISTING document:**
1. ✅ **Keep original tool & SessionID in filename** (unchanged)
2. ✅ **Increment version:** 0.1 → 0.2 → 0.3 (update in filename and file metadata)
3. ✅ **In commit message:** reference your session: `git commit -m "Update [Original Document Name] - Versio 0.2 - Cursor.ai session [YOUR_SESSION_ID]"`
4. ✅ **Don't add metadata** - keep original metadata intact

### Gemini.app

```yaml
Tool: Gemini.app
Session Identifier: Unique per Gemini conversation session
Integration: Manual git workflow (copy-paste friendly)
Format: Export as markdown first
Metadata: Only for NEW documents (don't modify existing)
Commit: Reference your session in message
```

**Gemini.app Workflow - Creating NEW document:**
1. ✅ Note your Gemini session ID
2. ✅ Create and refine content in Gemini
3. ✅ Export as markdown
4. ✅ Add minimal metadata with version 0.1 + your SessionID
5. ✅ Copy to repository with naming: [Name] - Gemini.app - [YOUR_SESSION_ID] - Versio 0.1.md
6. ✅ `git commit -m "Create [Name] - Gemini.app - [YOUR_SESSION_ID] - Versio 0.1"`
7. ✅ Push to feature branch

**Gemini.app Workflow - Updating EXISTING document:**
1. ✅ **Keep original tool & SessionID in filename** (unchanged)
2. ✅ **Increment version in filename and metadata only**
3. ✅ Commit: `git commit -m "Update [Original Document Name] - Versio 0.2 - Gemini.app session [YOUR_SESSION_ID]"`
4. ✅ **Don't modify metadata section** - keep it as is

### Linear

```yaml
Tool: Linear
Session Identifier: From Linear workspace or issue ID
Integration: Link to GitHub commits
Metadata: Include in issue description only (not in document files)
Tracking: Issues reference document versions and branch
```

**Linear Workflow:**
1. ✅ Create Linear issue for document task
2. ✅ Note the Linear issue ID/session identifier
3. ✅ Link issue to GitHub branch and commits
4. ✅ Reference Linear issue in git commits when applicable
5. ✅ **Don't add Linear metadata to document files** - keep in Linear only
6. ✅ Update version in issue description when document version changes
7. ✅ When done, reference final version number in Linear issue

---

## 📊 Part 7: ARCHIVAL & RETENTION REQUIREMENTS

### What to Archive

| Item | Retention | Format |
|------|-----------|--------|
| **Source Documents** | Indefinite | .md, .txt, .pdf |
| **Version History** | Indefinite | Git commits |
| **Metadata** | Indefinite | YAML headers |
| **Session Logs** | 90 days min | Text/JSON |
| **Audit Trail** | 7 years | Logs |
| **Sensitive Data** | Per GDPR/NIS2 | Encrypted |

### Archive Structure

```
dws6/
├── _archive/
│   ├── 2025-Q4/
│   │   ├── Claude_Code_Sessions/
│   │   ├── Cursor_Sessions/
│   │   └── Gemini_Sessions/
│   ├── 2025-Q3/
│   └── README.md (Archive guide)
├── docs/
├── .git/ (Full history preserved)
```

### How to Archive

```bash
# When document reaches version 1.0 or later
# Move to archive with timestamp
mv "Document_Name - Tool - SessionID - Versio 0.9" "_archive/2025-Q4/Document_Name_v0.9.md"

# Commit archival
git add _archive/
git commit -m "Archive Document_Name - SessionID - Versio 0.9"
```

---

## 🔐 Part 8: SECURITY & COMPLIANCE REQUIREMENTS

### What MUST NOT Be in Documents

❌ API keys, secrets, passwords
❌ Personal data (PII) without encryption
❌ Customer information without permission
❌ Proprietary algorithms without approval
❌ Credentials or authentication tokens

### What SHOULD Be in Documents

✅ Anonymized examples
✅ Architecture diagrams
✅ Process flows
✅ Code examples (without secrets)
✅ Decision rationales

### Compliance Checklist

- [ ] No secrets/credentials in document
- [ ] GDPR compliant (anonymized PII)
- [ ] NIS2 requirements met (if applicable)
- [ ] EU Cybersecurity Act aligned (if applicable)
- [ ] Audit trail maintained (git history)
- [ ] Version tracking complete
- [ ] Session ID documented
- [ ] Metadata included

---

## 📚 Part 9: INTEGRATION WITH DWS6 WORKFLOW

### Document Submission Process

```
1. Create/Modify Document
   ↓
2. Follow Naming Convention
   [Name] - [Tool] - [SessionID] - Versio X.Y
   ↓
3. Add Metadata Block
   ↓
4. Verify Security Compliance
   ↓
5. Commit to Git Branch
   git commit -m "Update [Name] - Tool - [SessionID] - Versio X.Y"
   ↓
6. Push to Feature Branch
   git push -u origin claude/task-SessionID
   ↓
7. Request Review (if required)
   ↓
8. Increment Version on Merge
   ↓
9. Link to DOCUMENTATION_INDEX.md
   ↓
10. Archive (Version 1.0+)
```

### Integration with DOCUMENTATION_INDEX.md

When document reaches version 1.0:

```markdown
## [Document Category]

| Document | Version | Tool | SessionID | Status |
|----------|---------|------|-----------|--------|
| [Name] - Claude Code | 1.0 | Claude Code | QVvDX | ✅ Released |
```

---

## 📋 Part 10: CHANGE LOG TEMPLATE

Include this in all documents for version tracking:

```markdown
## Change Log

| Version | Date | Changes | Tool/SessionID |
|---------|------|---------|---|
| 0.1 | 2025-12-16 | Initial creation | Claude Code / QVvDX |
| 0.2 | 2025-12-17 | Added examples | Cursor.ai / R7k9M |
| 1.0 | 2025-12-18 | Released | Claude Code / QVvDX |
```

---

## 🖱️ Part 8: CURSOR.AI ADVANCED USAGE - CODE vs DOCUMENTATION

### Important: Two Types of Work

Cursor.ai can work with two different file categories in DWS6. Each has different requirements:

#### **Type A: UI/CODE MODIFICATIONS**

**Applies to:**
- HTML files: `dws10.com/index.html`, `sites/*/pages/*.html`
- CSS/Styling: `dws10.com/*.css`, component styles
- JavaScript/TypeScript: `*.js`, `*.tsx`, `*.ts`
- Configuration files (not Reports/)

**No Workflows Triggered:**
- ✅ Git tracks changes normally
- ❌ No PDF generation
- ❌ No automated email
- ❌ No Google Drive upload
- **Action:** Just commit and push, no special handling needed

**Versioning:** NOT REQUIRED
- Use git commits for history (not semantic versioning)
- No metadata headers needed
- No filename versioning

**Session Tracking:**
```bash
git commit -m "Fix carousel display - Cursor.ai session [YOUR_SESSION_ID]"
```

**Example:**
```bash
git commit -m "Improve carousel mobile responsiveness - Cursor.ai session R7k9M"
git push origin cursor/carousel-mobile-R7k9M
```

---

#### **Type B: DOCUMENTATION MODIFICATIONS**

**Applies to:**
- Report markdown: `Reports/en/WEEKLY_REPORT.md`, `Reports/fi/WEEKLY_REPORT_FI.md`
- Documentation markdown: Files meant for publication/archival

**Workflows ARE Triggered:**
- ✅ Weekly Report Workflow (every Monday 08:00 UTC)
- ✅ Auto-generates PDFs with branding
- ✅ Auto-uploads to Google Drive
- ✅ Auto-sends via email
- **Action:** Version control required, include metadata

**Versioning:** REQUIRED
- Follow AI_AGENT_GUIDELINES versioning: 0.1 → 0.2 → 1.0
- Update both filename AND metadata
- Add timestamp with hh:mm if multiple updates same day

**Session Tracking:**
```bash
git commit -m "Update Progress Report - Versio 0.2 - Carousel improvements - Cursor.ai session R7k9M"
```

**Example:**
```bash
git commit -m "Update Progress Report - Versio 0.2 - Added carousel feature documentation - Cursor.ai session R7k9M"
git push origin cursor/progress-report-update-R7k9M
```

---

### Quick Decision: Which Type Am I Working On?

```
Is the file in Reports/ directory?
├─ YES → Type B (Documentation) → Use versioning + workflow aware
└─ NO → Type A (Code) → Standard git workflow

Is it a markdown (.md) meant for reporting?
├─ YES → Type B → Version it
└─ NO → Type A → Don't version it

Will this trigger a PDF generation?
├─ YES → Type B → Be aware of Monday 08:00 UTC schedule
└─ NO → Type A → No workflow concerns
```

---

### ⚠️ Critical: Don't Manually Edit Generated Files

```
❌ WRONG:
Reports/en/WEEKLY_REPORT.pdf ← Don't edit!
Reports/fi/WEEKLY_REPORT_FI.pdf ← Don't edit!

These are OUTPUT files from workflow. They're overwritten every Monday!

✅ CORRECT:
Reports/en/WEEKLY_REPORT.md ← Edit this (source file)
Reports/fi/WEEKLY_REPORT_FI.md ← Edit this (source file)

Workflow automatically generates PDFs from markdown.
```

---

### Full Documentation

**For detailed Cursor.ai best practices, see:**
- 📖 **CURSOR_BEST_PRACTICES.md** - Complete guide with scenarios and workflow details
  - UI/Code changes (no workflow impact)
  - Documentation changes (workflow triggered)
  - Workflow automation details
  - Common pitfalls to avoid
  - Checklist before committing

---

Before committing any document, verify:

### Documentation
- [ ] Document named: [Name] - [Tool] - [SessionID] - Versio X.Y
- [ ] Metadata block included
- [ ] Version number updated
- [ ] Change log entry added
- [ ] Timestamp updated (Created/LastModified)

### Security
- [ ] No secrets/credentials exposed
- [ ] No PII without anonymization
- [ ] GDPR compliant
- [ ] Audit trail preserved (git history)

### Git Process
- [ ] Branch named: `claude/[task]-[SessionID]`
- [ ] Commit message includes version
- [ ] Files staged: `git add [files]`
- [ ] Commit created: `git commit -m "..."`
- [ ] Push with `-u` on first push: `git push -u origin [branch]`

### Documentation Index
- [ ] Entry added to DOCUMENTATION_INDEX.md (when version 1.0)
- [ ] Links verified
- [ ] Category assigned
- [ ] Status updated

---

## 🎯 QUICK START FOR AI AGENTS

### 60-Second Setup

```bash
# 1. Identify session ID (from branch/tool settings)
SESSION_ID="QVvDX"

# 2. Create document with naming convention
FILENAME="My_Document_Name - Claude Code - $SESSION_ID - Versio 0.1.md"

# 3. Add metadata block (minimal)
cat > "$FILENAME" << 'EOF'
---
Tool: Claude Code
SessionID: QVvDX
Version: 0.1
---
# Document content here...
EOF

# 4. Commit and push
git add "$FILENAME"
git commit -m "Create My_Document_Name - Claude Code - QVvDX - Versio 0.1"
git push -u origin claude/task-QVvDX
```

---

## 📞 SUPPORT & QUESTIONS

For questions about these guidelines:
- 📧 Team communications
- 🔗 Reference: DOCUMENTATION_INDEX.md
- 📋 Template documents in `/templates/`
- 🤝 Ask AI agents using these guidelines

---

## 📜 VERSION HISTORY

| Version | Date | Changes | Tool/SessionID |
|---------|------|---------|---|
| 0.1 | 16.12.2025 | Initial guidelines creation | Claude Code / QVvDX |
| 0.2 | 16.12.2025 14:45 | Clarified Cursor/Gemini/Linear workflows; fixed session ID handoff rules; added date format guidelines | Claude Code / QVvDX |
| 0.3 | 16.12.2025 15:15 | Added Part 8: Cursor.ai Advanced Usage - UI/Code vs Documentation distinction; referenced CURSOR_BEST_PRACTICES | Claude Code / QVvDX |
| 0.4 | 16.12.2025 16:05 | Added Language/Kieli field in Document Status for tracking locale versions | Claude Code / QVvDX |

---

**Last Updated:** 16.12.2025 16:05
**Status:** ✅ ACTIVE & READY FOR USE
**Applicable To:** All AI agents in DWS6 project
**Language Support:** English (Suomi version planned)
**Next Review:** 16.01.2026

---

*These guidelines apply to: Claude Code, Cursor.ai, Gemini.app, Linear, and other LLM-based tools working on DWS6 project.*

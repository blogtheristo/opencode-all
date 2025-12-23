# 🔗 AI Tool Integration Guide - DWS6 Project

---
# VERSION AND AGENT HISTORY
# (Näyttää kuka teki ja milloin, linkit sessioon)

Version: 0.3

Sessions & Modifications:
  - Version: 0.1 | Tool: Claude Code | Session: QVvDX | Commit: 7d0b46c | Date: 16.12.2025
  - Version: 0.2 | Tool: Claude Code | Session: QVvDX | Commit: 347a754 | Date: 16.12.2025 14:55 | Changes: Updated date format and session tracking
  - Version: 0.3 | Tool: Claude Code | Session: QVvDX | Commit: (pending) | Date: 16.12.2025 16:05 | Changes: Added Language/Kieli field in Document Status

Session Links & References:
  - Claude Code (QVvDX): https://github.com/blogtheristo/dws6/commits/claude/review-thesis-plan-QVvDX
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/AI_TOOL_INTEGRATION_GUIDE.md

Document Status:
  - Created: 16.12.2025
  - Last Modified: 16.12.2025 14:55
  - Language: English
  - Languages Available: English
  - Publication Status: Active

---

**Version:** 0.3
**Primary Tool:** Claude Code
**Session ID:** QVvDX
**Created:** 16.12.2025
**Last Modified:** 16.12.2025 16:05
**Status:** ✅ ACTIVE
**Language:** English

---

## 📋 Overview

This guide provides step-by-step integration instructions for AI tools and agents to work seamlessly with DWS6 documentation standards.

**Covers:**
- ✅ Cursor.ai (Code Editor)
- ✅ Gemini.app (Google's Generative AI)
- ✅ Linear (Project Management)
- ✅ Claude Code (Already integrated)
- ✅ Other LLM-based tools

---

## 🔧 Part 1: CURSOR.AI INTEGRATION

### 1.1 Prerequisites

- Cursor.ai installed and configured
- Git repository cloned locally: `/home/user/dws6`
- Git configured: `git config user.name` and `git config user.email`
- SSH key set up for GitHub

### 1.2 Getting Session ID in Cursor.ai

```bash
# Method 1: From Cursor settings
1. Open Cursor
2. Go to Settings (Ctrl+, or Cmd+,)
3. Search: "Session" or "Debug"
4. Note the Session ID displayed

# Method 2: From console logs
1. Open Developer Tools (Ctrl+Shift+I or Cmd+Option+I)
2. Go to "Console" tab
3. Look for: "Session ID: ..." or "sessionId: ..."
4. Copy the ID (usually format: 5-6 characters)

# Method 3: From Cursor config file
~/.cursor/settings.json
Look for: "sessionId" or "session"
```

### 1.3 Cursor.ai Workflow for Documentation

**Step 1: Start Document Creation**
```
1. In Cursor, open dws6 project
2. Create new file: Cmd/Ctrl+N
3. Name it with convention:
   [Document_Name] - Cursor.ai - [SESSION_ID] - Versio 0.1.md
```

**Step 2: Add Metadata**
```markdown
---
Tool: Cursor.ai
SessionID: [Your SESSION_ID]
Version: 0.1
Created: 2025-12-16
---
# Your document content...
```

**Step 3: Write Content**
- Use Cursor's code generation features (`Cmd+K`)
- Let Cursor suggest and auto-complete
- Ask Cursor for examples using `@` symbol

**Step 4: Version & Commit**
```bash
# In Cursor's terminal
git add "[Document_Name] - Cursor.ai - [SESSION_ID] - Versio 0.1.md"
git commit -m "Create [Document_Name] - Cursor.ai - [SESSION_ID] - Versio 0.1"
git push -u origin cursor/[task]-[SESSION_ID]
```

**Step 5: Future Updates**
```bash
# When updating document, increment version
# Rename: Versio 0.1 → Versio 0.2
git add "[Document_Name] - Cursor.ai - [SESSION_ID] - Versio 0.2.md"
git commit -m "Update [Document_Name] - Versio 0.2"
git push origin cursor/[task]-[SESSION_ID]
```

### 1.4 Cursor.ai Rules File

Create `.cursor/rules.md` for consistent behavior:

```markdown
# Cursor Rules for DWS6 Project

## Documentation Naming
Always use format: [Name] - Cursor.ai - [SessionID] - Versio X.Y

## Metadata
Include at document top:
- Tool: Cursor.ai
- SessionID: [from settings]
- Version: [0.1 for new, increment for updates]

## Git Workflow
- Branch name: cursor/[task]-[SessionID]
- Commit message includes version
- Push with `-u` flag on first push

## Compliance
- No secrets in documents
- No PII without anonymization
- Include GDPR classification if needed
```

### 1.5 Cursor.ai Template

Create `.cursor/templates/dws6-document.md`:

```markdown
---
Tool: Cursor.ai
SessionID:
Version: 0.1
Created:
---

# [Document Title]

## Overview


## Contents

### Section 1


### Section 2


## References


---

**Change Log**

| Version | Date | Changes | SessionID |
|---------|------|---------|-----------|
| 0.1 | YYYY-MM-DD | Initial creation | [SessionID] |
```

---

## 🌐 Part 2: GEMINI.APP INTEGRATION

### 2.1 Prerequisites

- Gemini.app account created
- Access to dws6 repository (clone locally or view GitHub)
- Git installed locally for commits
- Text editor for markdown (VS Code, etc.)

### 2.2 Getting Session ID in Gemini.app

```
Method 1: From URL
1. Open Gemini conversation
2. Look at URL: gemini.google.com/app/[SESSION_ID]
3. Note or copy the SESSION_ID

Method 2: From browser console
1. Open Developer Tools (F12)
2. Go to "Network" or "Application" tab
3. Look for session cookies or storage keys
4. Find value starting with "gemini-session-" or similar

Method 3: From email/settings
1. Check if you saved session info
2. Gemini may show it in account settings
```

### 2.3 Gemini.app Workflow for Documentation

**Step 1: Start Conversation**
```
1. Open Gemini.app
2. Start new conversation
3. Describe what you want to document
4. Example: "Create documentation for DWS6 authentication system"
```

**Step 2: Generate Content**
```
Ask Gemini:
- "Generate comprehensive documentation with sections..."
- "Provide code examples for..."
- "Create a table summarizing..."
- "Write step-by-step instructions for..."
```

**Step 3: Export Content**
```
1. Highlight all generated content (Ctrl+A)
2. Copy (Ctrl+C)
3. Paste into text editor
4. Save as markdown: [Name].md
```

**Step 4: Add Metadata & Naming**
```bash
# After pasting into editor, add at top:
---
Tool: Gemini.app
SessionID: [Your SESSION_ID from Gemini URL]
Version: 0.1
Created: 2025-12-16
---

# Then rename file:
[Document_Name] - Gemini.app - [SESSION_ID] - Versio 0.1.md
```

**Step 5: Git Operations**
```bash
# Add to repository
cd /home/user/dws6
git add "[Document_Name] - Gemini.app - [SESSION_ID] - Versio 0.1.md"
git commit -m "Create [Document_Name] - Gemini.app - [SESSION_ID] - Versio 0.1"
git push -u origin gemini/[task]-[SESSION_ID]
```

**Step 6: For Updates**
```bash
# Regenerate in Gemini, export again
# Increment version: 0.1 → 0.2
# Rename file and commit

git add "[Document_Name] - Gemini.app - [SESSION_ID] - Versio 0.2.md"
git commit -m "Update [Document_Name] - Versio 0.2 - Added examples"
git push origin gemini/[task]-[SESSION_ID]
```

### 2.4 Gemini.app Tips for Better Documentation

```
Prompts that work well:

1. "Create a comprehensive README documenting [topic] with:
   - Overview section
   - Installation steps
   - Configuration guide
   - Troubleshooting section"

2. "Generate API documentation for [service] including:
   - Endpoint descriptions
   - Request/response examples
   - Error handling
   - Rate limits"

3. "Document the [process] workflow as a step-by-step guide with:
   - Prerequisites
   - Decision points
   - Example scenarios
   - Common issues"

4. "Create a compliance checklist for [topic] with:
   - Regulatory requirements
   - Implementation steps
   - Verification procedures
   - Approval sign-offs"
```

### 2.5 Gemini.app Limitations & Workarounds

| Limitation | Workaround |
|-----------|-----------|
| Can't directly access files | Export as markdown, add manually to git |
| Session info not always visible | Copy from URL or save separately |
| Large documents may truncate | Ask for sections, combine locally |
| No git integration | Use local git after content export |

---

## 📊 Part 3: LINEAR INTEGRATION

### 3.1 Prerequisites

- Linear account with access to DWS6 workspace
- GitHub connected to Linear (OAuth setup)
- Git repository cloned locally
- Administrative access to link GitHub commits

### 3.2 Linear Setup for Documentation

**Step 1: Create Issue for Documentation**
```
1. Open Linear
2. New Issue → Choose "Document" template (if available)
3. Title: "[Document Name] - Documentation Task"
4. Description template:

---
## Overview
[What this document is about]

## Tool & Session Info
- Tool: [Claude Code | Cursor.ai | Gemini.app]
- SessionID: [XXXXX]
- Version: 0.1

## Deliverables
- [ ] Draft content
- [ ] Review
- [ ] Final approval
- [ ] Commit to GitHub

## Related Links
- GitHub: [Link to repo]
- Branch: [feature-branch-name]

---
```

**Step 2: Link to GitHub**
```
In Linear issue:
1. Click "Link issue"
2. Select GitHub repository (dws6)
3. Link to branch: [feature-branch]
4. This creates automatic sync with commits
```

**Step 3: Track Document Creation**
```
Sub-tasks in Linear:
- [ ] Session ID identified
- [ ] Metadata prepared
- [ ] Content drafted
- [ ] Compliance review
- [ ] Final versioning
```

### 3.3 Linear Workflow for Documentation

```
Linear Status Flow:

Backlog
  ↓ (Plan)
Todo
  ↓ (Start work)
In Progress → [AI Agent creates document]
  ↓ (Request review)
In Review → [Manual review process]
  ↓ (Approve)
Done → [Version 1.0 released, archive plan made]
```

### 3.4 Linear Documentation Template

**Create reusable issue template:**

```
Title: [Document Name] - Documentation

Body:

## Summary
Brief description of what needs to be documented

## Scope
- [ ] Topic A
- [ ] Topic B
- [ ] Topic C

## Tool Assignment
- Primary Tool: [Claude Code | Cursor.ai | Gemini.app]
- Session ID: [XXXXX]
- Branch: [feature-branch-name]

## Documentation Requirements
- [ ] Follows naming convention
- [ ] Includes metadata
- [ ] GDPR/Compliance reviewed
- [ ] No secrets exposed
- [ ] Code examples included
- [ ] Cross-references linked

## Approval Chain
- [ ] Technical review: @[person]
- [ ] Compliance review: @[person]
- [ ] Final approval: @[person]

## Acceptance Criteria
- [ ] Document meets all requirements above
- [ ] Committed to GitHub with proper version
- [ ] Linked to DOCUMENTATION_INDEX.md
- [ ] Archive plan in place

## Related Documents
[List related documentation]

---
```

### 3.5 Linear & GitHub Sync

**Automatic updates:**
```
When you commit to GitHub with issue number:
git commit -m "Create document [name] - Version 0.1 - Fixes #DWS-123"

Linear automatically:
- Links commit to issue
- Updates issue status if message includes keywords:
  - "Fixes #DWS-123" → Moves to Done
  - "Progress #DWS-123" → Updates status
  - "Related to #DWS-123" → Links without moving
```

---

## 🔄 Part 4: CROSS-TOOL WORKFLOW

### 4.1 Typical Multi-Tool Documentation Process

```
Step 1: Planning (Linear)
├─ Create issue in Linear
├─ Set priority and assignee
└─ Link to GitHub

Step 2: Research & Generation (Gemini.app or Cursor.ai)
├─ Use AI to generate content
├─ Refine and enhance
└─ Export markdown

Step 3: Implementation (Claude Code or Cursor.ai)
├─ Add to repository
├─ Include proper naming & metadata
├─ Create feature branch
└─ Initial commit

Step 4: Review (Linear + GitHub)
├─ Request review in Linear
├─ Code review on GitHub
├─ Update version if changes needed
└─ Iterate if necessary

Step 5: Release (Claude Code or Manual)
├─ Final version bump (0.9 → 1.0)
├─ Update DOCUMENTATION_INDEX.md
├─ Archive metadata prepared
└─ Merged to main

Step 6: Archive (Scheduled)
├─ Move to _archive/
├─ Archive index updated
├─ Retention period set
└─ Expiry date calculated
```

### 4.2 Session ID Handoff Between Tools

When switching between tools for same document:

```
Tool 1 (Claude Code - Session: QVvDX)
└─ Creates: [Document] - Claude Code - QVvDX - Versio 0.1.md
   ↓ (needs enhancement)
Tool 2 (Cursor.ai - Session: R7k9M)
└─ Updates to: [Document] - Claude Code - QVvDX - Versio 0.2.md
   (NOTE: Keep original tool & SessionID, increment version)
   └─ Git commit: "Update [Document] - QVvDX - Versio 0.2
                   Enhancement by Cursor.ai session R7k9M"
   ↓ (final review)
Tool 3 (Gemini.app - Session: PqXyZ)
└─ Final version: [Document] - Claude Code - QVvDX - Versio 1.0.md
   (NOTE: Still references original tool & session)
   └─ Git commit: "Release [Document] - QVvDX - Versio 1.0
                   Final review by Gemini.app session PqXyZ"
```

**Important:** Document names always keep the **original tool and SessionID** of creation. Other tools note their involvement in commit messages.

---

## ✅ QUICK START: ONE DOCUMENT, MULTIPLE TOOLS

### Scenario: API Documentation

**1. Gemini.app (Content generation) - Session: ABC12**
```
Prompt: "Create comprehensive API documentation for DWS6 authentication
endpoints with request/response examples"
→ Output: Raw markdown content
```

**2. Copy to local file**
```bash
# Paste Gemini content into:
API_Documentation_DWS6 - Gemini.app - ABC12 - Versio 0.1.md

# Add metadata at top
---
Tool: Gemini.app
SessionID: ABC12
Version: 0.1
---
```

**3. Cursor.ai (Enhancement) - Session: XYZ99**
```
1. Open file in Cursor
2. Ask: "@file add error handling section and troubleshooting"
3. Update version metadata:
   Version: 0.2
   LastModified: [today]
4. Save and commit
```

**4. Claude Code (Final review & release) - Session: QVvDX**
```
1. Review document in Claude Code
2. Add diagrams or final polish
3. Update to Version 1.0
4. Commit: "Release API_Documentation_DWS6 - QVvDX - Versio 1.0"
5. Link to DOCUMENTATION_INDEX.md
6. Archive plan made
```

---

## 🔐 Part 5: SECURITY & COMPLIANCE FOR INTEGRATION

### 5.1 Sensitive Data Handling

**MUST comply with:**

| Tool | PII Handling | Encryption | Retention |
|------|-------------|-----------|-----------|
| **Cursor.ai** | Local only | TLS in transit | Up to your system |
| **Gemini.app** | Google servers | Encrypted | Per Google's terms |
| **Linear** | Cloud SaaS | Encrypted in transit | 30+ days |
| **Claude Code** | Local/Anthropic | Your control | Per your setup |

### 5.2 Before Sharing Content Between Tools

- [ ] No API keys, credentials, or secrets
- [ ] No real customer data
- [ ] No unencrypted PII
- [ ] No proprietary algorithms
- [ ] Anonymized examples only
- [ ] Third-party licenses checked

---

## 📞 TROUBLESHOOTING

### Issue: Can't find Session ID

**Solution:**
```bash
# Alternative: Use UUID or hash current timestamp
date +%s | sha256sum | cut -c1-6
# Result: a1b2c3
```

### Issue: Document naming gets too long

**Solution:** Shorten document name while keeping tool/SessionID/version
```
Instead of:
Very_Long_Document_Name_With_Many_Words - Tool - SessionID - Versio X.Y.md

Use:
Long_Doc_Name_Summary - Tool - SessionID - Versio X.Y.md
(Keep full name in Title metadata)
```

### Issue: Git conflicts between tools

**Solution:**
```bash
# If working on same document:
1. Communicate via Linear issue
2. Use feature branches with tool prefix:
   cursor/doc-update-ABC12
   gemini/doc-update-XYZ99
3. Merge through main branch sequentially
4. Both increment version on merge
```

---

## 📈 VERSION HISTORY

| Version | Date | Changes | Tool/SessionID |
|---------|------|---------|---|
| 0.1 | 16.12.2025 | Initial integration guide | Claude Code / QVvDX |
| 0.2 | 16.12.2025 14:55 | Updated date format to pv.kk.vvvv standard; clarified session ID usage per tool | Claude Code / QVvDX |
| 0.3 | 16.12.2025 16:05 | Added Language/Kieli field in Document Status for tracking locale versions | Claude Code / QVvDX |

---

**Last Updated:** 16.12.2025 16:05
**Status:** ✅ ACTIVE & READY FOR USE
**Applicable To:** Cursor.ai, Gemini.app, Linear, Claude Code
**Language Support:** English (Suomi version planned)

---

*This guide enables seamless integration of multiple AI tools with DWS6 documentation standards.*

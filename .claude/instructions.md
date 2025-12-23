# Claude Code - Development Instructions

**Päivitetty:** 16.12.2025 14:32  
**Version:** 1.0

---

## Overview

This file contains Claude Code session instructions for the DWS6 project. Follow these guidelines for consistency and proper tracking.

---

## 1. Documentation Naming Convention

### Format
```
[Document Name] - Claude Code - [Session ID] - Versio [X.Y]
```

### Example
```
Riston_Opinnäytetyö_Toteutussuunnitelma - Claude Code - QVvDX - Versio 0.1
```

### Where to find Session ID
- Look at the Claude Code session title
- It appears as `Session ID: QVvDX` or similar
- Use this exact ID in document names and commits

### Apply to NEW documents ONLY
- Don't rename existing documents
- Only new files created in this session

---

## 2. Versioning Rules

### Semantic Versioning (X.Y format)

| Change | Action | Example |
|--------|--------|---------|
| First creation | Use `Versio 0.1` | `Versio 0.1` |
| Content update | Increment Y | `0.1` → `0.2` → `0.3` |
| Major release | Increment X | `0.9` → `1.0` |
| Maintenance | Continue | `1.0` → `1.1` → `1.2` |

### Update metadata EVERY change
```markdown
**Versio:** 0.2  
**Päivitetty:** 16.12.2025 14:32
```

Time format: `pv.kk.vvvv hh:mm` (24h clock)

---

## 3. Git Commit Messages

### Format
```
Claude Code [Session ID] - [Short description in English/Finnish]

[Detailed description if needed]

Dokumentit: [filename and version]
```

### Examples

```
Claude Code QVvDX - Luo AI_AGENT_GUIDELINES.md

- Dokumenttien nimeämiskäytäntö
- Versionointi-ohjeet
- Git-branching standardi

Dokumentit: AI_AGENT_GUIDELINES.md (Versio 1.0)
```

```
Claude Code QVvDX - Päivitä V1_OPINNAYTETYO_FI.md luku 3

Lisätty nykytilan analyysi ja kilpailija-vertailu.

Dokumentit: V1_OPINNAYTETYO_FI.md (Versio 0.3)
```

### Branch naming
```
docs/[document-name]-[session-id]
```

Examples:
```
docs/ai-agent-guidelines-QVvDX
docs/master-thesis-opinnaytetyo-QVvDX
feature/mcp-hub-deployment-QVvDX
```

---

## 4. Documentation Metadata Template

Add to the beginning of every NEW document:

```markdown
# [Document Title]

**Versio:** 0.1  
**Päivitetty:** [pv.kk.vvvv hh:mm]  
**AI-lähde:** Claude Code  
**Session ID:** [Your Session ID]  
**Status:** 🟡 DRAFT  
**Audience:** [Internal/Public/Team]

---

[Content starts here]
```

---

## 5. Where to Store Documents

### Project Documentation
```
/Admin/[Subdirectory]/[Document Name] - Claude Code - [ID] - Versio X.Y.md
```

### Master Thesis Work
```
/Admin/Metropolia/master-thesis/fi/V1_OPINNAYTETYO_FI.md (versio X.Y in metadata)
/Admin/Metropolia/master-thesis/en/V1_MSTHESIS_EN.md (versio X.Y in metadata)
```

### Implementation Artifacts
```
/AgentFoundry/configs/[feature].yaml
/scripts/[automation].py
```

---

## 6. Key Project Rules

### ✅ DO:
- Include Session ID in document names and commits
- Update version number on EVERY change
- Update timestamp (pv.kk.vvvv hh:mm)
- Write descriptive commit messages
- Link to AI_AGENT_GUIDELINES.md for reference
- Check `.gitignore` before committing

### ❌ DON'T:
- Rename existing documents without reason
- Forget Session ID in commits
- Skip version increments
- Leave "TODO: fill in later"
- Commit without descriptive messages

---

## 7. Special Instructions for Master Thesis

### Files to Edit
- **Main work file:** `Admin/Metropolia/master-thesis/fi/V1_OPINNAYTETYO_FI.md`
- **Reference:** `Admin/Metropolia/master-thesis/fi/OPINNAYTETYO_SUUNNITELMA_FI.md`
- **Backup:** PDF versions exist in same directory

### Versioning for Thesis
```markdown
**Versio:** 0.2  
**Luku(u):** 2-3 päivitetty  
**Päivitetty:** 16.12.2025 14:32  
**Session ID:** QVvDX
```

### Important: Keep local only
- Do NOT commit Master Thesis work to main branch
- Check `.gitignore` - `Admin/Metropolia/` is protected
- Work locally and keep versions in Admin folder

---

## 8. .gitignore Compliance

### Protected Directories
```
Admin/              # Protected
Admin/Metropolia/   # Master thesis work - LOCAL ONLY
docs/metropolia/    # Thesis research - LOCAL ONLY
```

### Safe to Commit
```
AI_AGENT_GUIDELINES.md
DOCUMENTATION_INDEX.md (if updated)
README.md (if updated)
.claude/instructions.md (this file)
```

### Check before each commit
```bash
git status
# Verify only intended files appear
```

---

## 9. Session Tracking

### Log your work
Create or update `Admin/SESSION_LOG.md` (optional but recommended):

```markdown
| Date | Time | Document | Version | Changes |
|------|------|----------|---------|---------|
| 16.12.2025 | 14:32 | AI_AGENT_GUIDELINES.md | 1.0 | Created |
| 16.12.2025 | 15:00 | V1_OPINNAYTETYO_FI.md | 0.2 | Chapter 2-3 updated |
```

---

## 10. Quick Reference

### Before Starting
1. ✅ Check `.gitignore` to understand what's protected
2. ✅ Read `AI_AGENT_GUIDELINES.md` for standards
3. ✅ Note your Session ID from Claude Code title
4. ✅ Create document with proper naming convention

### While Working
1. ✅ Increment version on each save
2. ✅ Update timestamp (pv.kk.vvvv hh:mm)
3. ✅ Use consistent metadata format
4. ✅ Reference linked sections/documents

### Before Committing
1. ✅ Check `git status` output
2. ✅ Write descriptive commit message with Session ID
3. ✅ Include document names and versions in commit
4. ✅ Verify not committing protected files

### Commit Command Example
```bash
git add .
git commit -m "Claude Code QVvDX - Update V1_OPINNAYTETYO_FI.md luku 3

Lisätty nykytilan analyysi ja kilpailija-vertailu.

Dokumentit: V1_OPINNAYTETYO_FI.md (Versio 0.3)"
```

---

## 11. Troubleshooting

**Q: What's my Session ID?**  
A: Look at your Claude Code session title/window. Should show "Session ID: [value]"

**Q: Should I version every typo fix?**  
A: Yes. Typo fix → 0.2 becomes 0.3. Maintains audit trail.

**Q: Can I work on multiple documents?**  
A: Yes, but track each separately. Use commit messages to group changes.

**Q: What if I work across multiple sessions?**  
A: Each session gets its own Session ID. Document which session made which changes in commit messages.

**Q: Is Admin/Metropolia safe to commit?**  
A: NO. It's in `.gitignore`. Keep thesis work local only.

---

## Latest Updates

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 16.12.2025 | Initial creation |

---

**For more details, see:** [AI_AGENT_GUIDELINES.md](../AI_AGENT_GUIDELINES.md)

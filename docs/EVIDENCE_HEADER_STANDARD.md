# Evidence Header Standardization — EU AI Act Art. 12–14

**Version:** 1.0  
**Date:** 2026-09-19  
**Author:** Claude Code (Haiku 4.5)  
**Canonical Source:** CLAUDE.md §Code Evidence Layer

---

## Format Specification

**Required fields (all mandatory):**
- `Tool`: Authoring tool name + exact version (e.g., `OpenCode 1.18.21`, `Claude Code 1.0`, `Cursor Grok 4.6`)
- `Model`: Provider and model ID (e.g., `claude-haiku-4-5-20251001`, `gpt-5.6-luna`, `cursor-grok-4.6`)
- `Agent`: Agent or session name for traceability (e.g., `pair-network-utilization-p6zzg3`, `Cursor Agent`)
- `Date`: ISO 8601 date of last substantive change (YYYY-MM-DD)

**Template:** 
```
Evidence: Tool=<NAME> <VERSION> Model=<PROVIDER/MODEL> Agent=<SESSION-OR-AGENT-NAME> Date=YYYY-MM-DD
```

---

## File Type Implementation

### TypeScript / JavaScript (.ts, .js)

**Placement:** First 3 lines after shebang (if present), before any imports

```typescript
#!/usr/bin/env node
// Evidence: Tool=Claude Code 1.0 Model=claude-haiku-4-5-20251001 Agent=engineering-execution Date=2026-09-19
// Audit trail: git log -- <this-file>

import { foo } from './bar';
```

**Format:**
- Use `//` line comments, not JSDoc (`/** */`)
- Exactly 2 lines: Evidence line + Audit trail reference
- No decorations (`---`, `===`, etc.)

### Python (.py)

**Placement:** First 3 lines after shebang, before any imports

```python
#!/usr/bin/env python3
# Evidence: Tool=Claude Code 1.0 Model=claude-haiku-4-5-20251001 Agent=engineering-execution Date=2026-09-19
# Audit trail: git log -- <this-file>

import sys
```

**Format:**
- Use `#` line comments
- Exactly 2 lines: Evidence line + Audit trail reference

### SQL (.sql)

**Placement:** First statement in file (before any DDL/DML), as SQL comment

```sql
-- Evidence: Tool=OpenCode 1.18.22 Model=opencode/x-preview-f-free Agent=db-migration-bot Date=2026-09-19
-- Audit trail: git log -- <this-file>

CREATE TABLE public.some_table (...)
```

**Format:**
- Use `--` SQL line comments
- Exactly 2 lines: Evidence line + Audit trail reference
- Placed before first SQL statement (after file-level license/header if present)

### Markdown (.md)

**Placement:** HTML comment block at file start, before any H1 heading

```markdown
<!-- Evidence: Tool=Claude Code 1.0 Model=claude-haiku-4-5-20251001 Agent=documentation Session=zl8ts1 Date=2026-09-19 -->
<!-- Audit trail: git log -- <this-file> -->

# Document Title
```

**Format:**
- Use `<!-- -->` HTML comments (multiline or paired single-line)
- Exactly 2 lines: Evidence line + Audit trail reference
- Placed before first heading

### HTML (.html)

**Placement:** First element in `<head>`, or if no head, after `<!DOCTYPE>`

```html
<!DOCTYPE html>
<!-- Evidence: Tool=Claude Code 1.0 Model=claude-haiku-4-5-20251001 Agent=frontend-config Date=2026-09-19 -->
<!-- Audit trail: git log -- <this-file> -->
<html>
  <head>
    ...
  </head>
</html>
```

**Format:**
- Use `<!-- -->` HTML comments
- Exactly 2 lines: Evidence line + Audit trail reference
- Placed immediately after DOCTYPE (or at file start if no DOCTYPE)

### YAML (.yaml, .yml)

**Placement:** First line as YAML comment, before any keys

```yaml
# Evidence: Tool=Claude Code 1.0 Model=claude-haiku-4-5-20251001 Agent=config-bot Date=2026-09-19
# Audit trail: git log -- <this-file>

key: value
```

**Format:**
- Use `#` YAML comments
- Exactly 2 lines: Evidence line + Audit trail reference

### JSON (.json)

**Placement:** Not standard for JSON (lacks comment syntax). Skip Evidence headers for JSON files, but document via adjacent `.md` file if needed.

**Alternative:** Include metadata in a `_evidence.md` file in the same directory.

---

## Fields Guide

### Tool

- **Format:** `<NAME> <VERSION>` (space-separated, no `/` or `-`)
- **Examples:**
  - `OpenCode 1.18.22`
  - `Claude Code 1.0`
  - `Cursor Grok 4.6`
  - `Copilot CLI 1.0.83`
  - `GitHub Copilot CLI v1.8.0`

### Model

- **Format:** `<PROVIDER>/<MODEL-ID>` or `<PROVIDER-MODEL-ID>`
- **Examples:**
  - `claude-haiku-4-5-20251001` (Anthropic)
  - `gpt-5.6-luna` (OpenAI)
  - `cursor-grok-4.6` (Cursor/xAI)
  - `opencode/x-preview-f-free` (OpenCode variant)

### Agent

- **Format:** Alphanumeric + hyphens; 1–64 characters
- **Examples:**
  - `pair-network-utilization-p6zzg3` (session ID)
  - `Cursor Agent` (agent name, spaces OK)
  - `engineering-execution` (role-based)
  - `db-migration-bot` (tool-specific)

### Date

- **Format:** ISO 8601 `YYYY-MM-DD` (never `DD/MM/YYYY` or `MM-DD-YYYY`)
- **Standard:** UTC date of last substantive code change in the file
- **Examples:** `2026-09-19`, `2026-01-01`

---

## Compliance Rules

1. **Mandatory:** Every code file (`.ts`, `.js`, `.py`, `.sql`, `.md`, `.html`, `.yaml`) created or substantially modified by an AI agent must have an Evidence header.

2. **Placement:** Always at file start, before imports/content, after shebang (if present).

3. **No Secrets:** Tool/Model/Agent/Date fields only. Never include: API keys, tokens, credentials, DSNs, PII, internal emails.

4. **Accuracy:** Tool version must match exactly what produced the file. Date must be actual modification date, not commit date. Agent must be the active agent/session, not previous authors.

5. **Update on Substantive Changes:** If an AI agent makes a substantive change (not just formatting), update the Tool, Model, Agent, Date fields to current values. Keep Audit trail comment as-is (git log handles history).

6. **Audit Trail Reference:** The second line must always reference `git log -- <this-file>` for auditability. This is boilerplate and does not change.

---

## Verification

Run before commit:
```bash
node scripts/evidence-audit.mjs <file-paths>
```

Audit checks:
- ✓ Evidence header present (if file type requires it)
- ✓ Correct format for file type (comment style, placement)
- ✓ All four fields present and non-empty
- ✓ Tool version is valid (alphanumeric + dots/spaces)
- ✓ Model ID is valid (alphanumeric + hyphens/slashes)
- ✓ Date is ISO 8601 format
- ✓ No secrets exposed

---

## Exceptions

- **Generated Files:** Files auto-generated by build tools (e.g., `*.min.js`, compiled `.wasm`, bundled CSS) may skip Evidence headers if documented in a `.md` file in the same directory.
- **Third-Party Code:** Vendored dependencies and fully copied third-party code do not require Evidence headers (use `LICENSE` file instead).
- **JSON/Data:** Config or data files with no human-readable syntax (e.g., `*.json`, binary formats) may skip Evidence headers; document via `_evidence.md`.
- **Templates:** Files used as boilerplate/template stubs may have a generic Evidence header or skip if documented elsewhere.

---

## Examples

### ✅ Correct

**TypeScript:**
```typescript
// Evidence: Tool=Claude Code 1.0 Model=claude-haiku-4-5-20251001 Agent=engineering-execution Date=2026-09-19
// Audit trail: git log -- src/agents/example.ts

import { BaseAgent } from './base';
```

**SQL:**
```sql
-- Evidence: Tool=OpenCode 1.18.22 Model=opencode/x-preview-f-free Agent=db-migration Date=2026-09-19
-- Audit trail: git log -- supabase/migrations/001_init.sql

CREATE TABLE public.users (...);
```

**Markdown:**
```markdown
<!-- Evidence: Tool=Claude Code 1.0 Model=claude-haiku-4-5-20251001 Agent=documentation Date=2026-09-19 -->
<!-- Audit trail: git log -- docs/example.md -->

# Title
```

### ❌ Incorrect

**Missing Agent:**
```typescript
// Evidence: Tool=Claude Code 1.0 Model=claude-haiku-4-5-20251001 Date=2026-09-19
```

**Invalid Date Format:**
```typescript
// Evidence: Tool=Claude Code 1.0 Model=claude-haiku-4-5-20251001 Agent=example Date=09/19/2026
```

**Secrets Exposed:**
```typescript
// Evidence: Tool=Claude Code 1.0 Model=claude-haiku-4-5-20251001 Agent=example Date=2026-09-19 ApiKey=sk-1234
```

**Wrong Comment Style for SQL:**
```sql
// Evidence: Tool=... (using // instead of --)
```

---

## Tooling

- **Linter:** `scripts/evidence-audit.mjs` — checks compliance before commit (called by pre-commit hook)
- **Auto-Fixer (future):** `scripts/evidence-fix.mjs` — applies standardized headers to all files in a directory
- **CI Gate:** Pre-commit hook blocks commits with non-compliant Evidence headers

---

## References

- **Source:** CLAUDE.md §Code Evidence Layer
- **Regulation:** EU AI Act Articles 12–14 (transparency, documentation, human oversight)
- **Scope:** All AI-agent-generated code in this repository (DWS6)

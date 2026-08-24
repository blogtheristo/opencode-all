# Claude Code Managed Settings (L1 Org Policies)

***
# VERSION AND AGENT HISTORY
Version: 1.0
Sessions & Modifications:
  - Version: 1.0 | Tool: Cursor | Date: 10.03.2026 | Changes: Initial ClaudeCode/ — managed-settings migration docs, template, verification script
***

**Effective:** March 12, 2026 (legacy path stops being read)  
**Supported:** Claude Code 2.0.58+

## Overview

Organization-wide Claude Code settings that cannot be overridden by user or project config. Deployed via MDM or endpoint management.

| Platform | Path |
|----------|------|
| Windows | `C:\Program Files\ClaudeCode\managed-settings.json` |
| macOS | `/Library/Application Support/ClaudeCode/managed-settings.json` |
| Linux/WSL | `/etc/claude-code/managed-settings.json` |

**Legacy path (stops being read 2026-03-12):** `C:\ProgramData\ClaudeCode\` on Windows.

---

## Migration Steps

1. **Update MDM / endpoint management configuration**
   - Add deployment of `managed-settings.json` to the new path above
   - Remove any deployment to the old path (`C:\ProgramData\ClaudeCode\`)

2. **Deploy managed-settings.json**
   - Copy `managed-settings.json.example` from this folder
   - Customize for your org (permissions, env vars)
   - Deploy to `C:\Program Files\ClaudeCode\managed-settings.json` (Windows)
   - Ensure the `ClaudeCode` folder exists; create if needed
   - Set appropriate ACLs (e.g. readable by all users, writable by admins only)

3. **Verify on a test endpoint**
   ```powershell
   .\scripts\Test-ClaudeManagedSettings.ps1
   # Or with JSON validation:
   .\scripts\Test-ClaudeManagedSettings.ps1 -ValidateJson -JsonOnly
   ```

4. **Roll out to all endpoints** before the deadline

---

## Template

See `managed-settings.json.example` for a DWS-aligned template:

- Denies: `.env` reads, `sudo`, `curl`/`wget` (use WebFetch with domain allow)
- Asks: `git push`, `npm publish`
- Allows: `npm run`, `git commit/checkout/fetch/pull`, safe bash patterns
- `disableBypassPermissionsMode`: prevents bypassing permission prompts

---

## References

- [Claude Code Settings](https://code.claude.com/docs/en/settings)
- [Configure Permissions](https://code.claude.com/docs/en/permissions)
- `CLAUDE.md` — Worktree Workflow, Windows Managed Settings
- `docs/DWS_INFORMATION_LAYERING_STRATEGY.md` — Layer 1 (L1 Org Policies)

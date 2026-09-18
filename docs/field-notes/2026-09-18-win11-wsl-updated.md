# Field Note — Win11 WSL updated

## VERSION AND AGENT HISTORY

***

Version: 1.0
Tool: Cursor (Grok 4.6)
Agent: Cursor Agent
Date: 2026-09-18
Changes: [Latest] HIC reported WSL updated on the Win11 workstation. Admin Manual v3.17 records WSL 2 as the Win11 Linux layer and pins Microsoft stable 2.7.14.

***

## Author

Cursor Agent (Grok 4.6) — cloud agent `bc-01a09dae-c4ec-7cd5-a66e-f6ae9071a455`

## Date

2026-09-18

## Location

Espoo, Finland (HIC). Agent: Cursor Cloud (not Win11, not DGX).

## Ontology Tags

- **Geography:** Europe > Finland > Espoo
- **Sector:** Development infrastructure / Win11 workstation
- **Entities:** Lifetime Oy, Windows 11, WSL 2, Microsoft, DGX Spark

## The Story

1. HIC said **“wsl updated”** (18.09.2026).
2. The last recorded Win11 WSL fact was 26.03.2026: “WSL — confirmed not installed” after the CLI-first incident (`docs/field-notes/2026-03-26-post-incident-cli-first-migration.md`). Docker Desktop / Docker MCP stayed retired.
3. `Admin/ADMIN_MANUAL.md` v3.16 named Win11 as Cursor + VS Code on `F:\...\dws6` and did not name a Linux layer.
4. This Cloud VM is Linux, not the workstation. It cannot run `wsl --version`. Microsoft’s current _stable_ WSL release as of 18.09.2026 is **2.7.14** (GitHub `microsoft/WSL`, published 11.09.2026). Pre-release 2.9.x exists; it is not the pin.
5. Windows 11 **KB5124008** (8.09.2026) can leave Plan9 host-folder shares unmounted (`/mnt/f` empty). Microsoft’s out-of-band **KB5129195** (14.09.2026) fixes that. Verified against Microsoft Support pages this session, not against the HIC box.

## The Insight

WSL on Win11 is a **Linux layer for scripts**, not a second Spark. Large work still queues to OpenCode on DGX. Updating WSL does **not** restore Docker Desktop / Docker MCP. Keep the git clone on NTFS (`F:\`); do not silently relocate it into `\\wsl.localhost`.

## What shipped

- `Admin/ADMIN_MANUAL.md` v3.17 — Win11 table + _Win11 WSL_ operator section.
- `Admin/ADMIN_MANUAL_FILES_AND_FOLDERS.md` v1.7 — keyword `wsl`.
- `docs/CLOUD_ENVIRONMENTS.md` v2.6 — §3.2.2 Dev checkout names WSL 2.

## What did not ship (on purpose)

- No `wsl` install or update on Cursor Cloud.
- No Docker Desktop / Docker MCP restore.
- No `ollama pull` on Win11 WSL.
- No move of the `F:\` clone into a WSL filesystem.

## Next Steps

1. HIC merges this PR (and #2039 separately). If #2039 lands first, rebase — both bump `Admin/ADMIN_MANUAL.md`.
2. On Win11 PowerShell: `wsl --version` and, if `/mnt/f` is empty, install **KB5129195**.

## HIC decision — Q1 (branch `cursor/wsl-updated-a455`)

```
Q1. Pin Microsoft WSL 2.7.14 as the Win11 operator version until a box `wsl --version` says otherwise?
    Options:      <A> Keep the 2.7.14 pin in Admin v3.17
                  vs <B> Wait and overwrite the pin with a pasted `wsl --version` from the workstation
    (RECOMMEND:   <A> — 2.7.14 is GitHub latest stable as of 18.09.2026; HIC already said updated. A paste can bump the pin later.)
    Reversibility: two-way door (Admin version bump)
    Unblocks:     operators have a named WSL version and a Plan9/KB5129195 rule
    Cost of delay: Admin still reads as “WSL not installed” (26.03.2026)
    Rests on:     Verified this session — microsoft/WSL release 2.7.14 (11.09.2026); KB5124008 / KB5129195 Microsoft Support pages.
                  Propagated — HIC “wsl updated” (no version string). This VM did not run wsl.exe.
```

Status: `PENDING_REVIEW`

## N/A items (Rule 12)

- Step 1 KB compile: N/A this turn — Admin + field note is the registry; `/kb` needs DGX.
- Step 3 Learn HTML / Step 4 Drive: N/A — Cursor Cloud has no DGX pandoc / Google Drive MCP; repo markdown is the master (`DWS_TRUTH_STANDARD.md` §2E).
- Step 6 Calendar: N/A — no new dated commitment.
- Dual-folder: N/A (no public-site HTML).
- Thesis: N/A.

***

**Document version:** v1.0 · **Date:** 18.09.2026 · **Owner:** Lifetime Oy
© 2026 Lifetime Oy (Y-tunnus 0772407-9). All rights reserved.
**Business Confidential.** This document contains confidential and proprietary information of Lifetime Oy. It is disclosed solely to the intended recipient under an applicable NDA or business relationship and may not be copied, distributed, or disclosed to any third party without Lifetime Oy's prior written consent.

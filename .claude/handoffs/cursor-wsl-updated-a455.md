# Handoff — cursor/wsl-updated-a455

**Branch:** `cursor/wsl-updated-a455`  
**Task:** Record HIC Win11 WSL / Aspire CLI / Spark Docker / Win11 Docker pins in Admin + cloud-env docs  
**State:** READY-FOR-REVIEW  
**PR:** https://github.com/blogtheristo/dws6/pull/2040  
**Date:** 2026-09-18  
**Highest HIC question on this branch:** Q5 PENDING_REVIEW (Q1, Q3, Q4 still open; Q2 answered A)

***

# VERSION AND AGENT HISTORY

Version: 1.6

Sessions & Modifications:

- Version: 1.6 | Tool: Cursor Grok 4.6 | Session: cursor/wsl-updated-a455 | Date: 18.09.2026 | Changes: [Latest] HIC asked for DGX Docker bash upgrade. Admin v3.22 `apt-get install --only-upgrade docker-ce`. Not `docker update`. Q5 pending.
- Version: 1.5 | Tool: Cursor Grok 4.6 | Session: cursor/wsl-updated-a455 | Date: 18.09.2026 | Changes: [not latest] HIC Win11 `docker --version` **29.8.0** (`88096ef`). Admin v3.21. Split from Spark 29.2.1. Docker MCP stays retired. Q4 pending.
- Version: 1.4 | Tool: Cursor Grok 4.6 | Session: cursor/wsl-updated-a455 | Date: 18.09.2026 | Changes: [not latest] HIC “update Spark dashboard image at 13.4.2” — Admin v3.20 Spark pull recipe. Compose already 13.4.2 on main. This VM cannot SSH.
- Version: 1.3 | Tool: Cursor Grok 4.6 | Session: cursor/wsl-updated-a455 | Date: 18.09.2026 | Changes: [not latest] HIC Q2 A — keep Spark aspire-dashboard **13.4.2**. Did not bump to 13.5.4. Q1 and Q3 still open.
- Version: 1.2 | Tool: Cursor Grok 4.6 | Session: cursor/wsl-updated-a455 | Date: 18.09.2026 | Changes: [not latest] HIC Spark `docker --version` 29.2.1 (`a5c7197`). Admin v3.19. Bare `docker update` is not an upgrade. Q3 pending.
- Version: 1.1 | Tool: Cursor Grok 4.6 | Session: cursor/wsl-updated-a455 | Date: 18.09.2026 | Changes: [not latest] HIC Aspire CLI 13.5.4. Admin v3.18. Dashboard image stays 13.4.2. Q2 pending.
- Version: 1.0 | Tool: Cursor Grok 4.6 | Session: cursor/wsl-updated-a455 | Date: 18.09.2026 | Changes: [not latest] HIC “wsl updated”. Admin v3.17 WSL 2 pin 2.7.14; Files & Folders v1.7 keyword `wsl`; Cloud Environments v2.6; field note Q1 A.

| Version      | Date       | Changes                                                | Agent           |
| ------------ | ---------- | ------------------------------------------------------ | --------------- |
| [Latest] 1.6 | 2026-09-18 | Spark docker-ce apt upgrade recipe (not docker update) | Cursor Grok 4.6 |
| 1.5          | 2026-09-18 | [not latest] Win11 Docker client 29.8.0                | Cursor Grok 4.6 |
| 1.4          | 2026-09-18 | [not latest] Admin v3.20 Spark pull recipe 13.4.2      | Cursor Grok 4.6 |
| 1.3          | 2026-09-18 | [not latest] Q2 A — keep aspire-dashboard 13.4.2       | Cursor Grok 4.6 |
| 1.2          | 2026-09-18 | [not latest] Spark Docker Engine 29.2.1                | Cursor Grok 4.6 |
| 1.1          | 2026-09-18 | [not latest] Aspire CLI 13.5.4; dashboard stays 13.4.2 | Cursor Grok 4.6 |
| 1.0          | 2026-09-18 | [not latest] Win11 WSL 2 recorded; pin 2.7.14          | Cursor Grok 4.6 |

Document Status:

- Created: 18.09.2026
- Last Modified: 18.09.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE
- Classification: INTERNAL
- Document Type: Session handoff

***

## Task

HIC pasted Win11 WSL, Aspire CLI 13.5.4, Spark Docker 29.2.1, then Win11 Docker 29.8.0. Write those into operator docs without installing Docker on Cursor Cloud and without restoring Docker MCP.

## State

- **What's done:** Admin v3.22 Spark `docker-ce` apt upgrade recipe. Win11 29.8.0 vs Spark 29.2.1. Q2 A. Q1, Q3, Q4, Q5 pending.
- **What's in progress:** PR update.
- **What's blocked:** Exact `wsl --version`; Spark `docker version` server string; Win11 `Get-Command docker`.

## Next steps

1. HIC on `gn100-cb5d`: run Admin v3.22 `apt-get install --only-upgrade docker-ce…` (not `docker update`). Paste new `docker --version`.
2. Q5 — pin Spark to the new version after apt? Recommend **A** once the paste exists. Q1, Q3, Q4 still A.
3. If `/mnt/f` is empty: install KB5129195.
4. Merge #2040 independently of #2039; rebase Admin if #2039 lands first.

## Notes for next session

Do not treat WSL as DGX. Do not average Win11 Docker 29.8.0 into Spark 29.2.1. Do not restore Docker MCP. Do not treat `docker update` as an Engine upgrade.

# Field Note: Acer Veriton GN100 — NVIDIA AI Workbench GPG Key Expiration Fix

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Claude Opus 4.6) | Session: claude/optimistic-burnell | Date: 27.02.2026 | Changes: Initial creation — Installation note appendix for NVIDIA GPG key renewal on Acer Veriton GN100

Session Links & References:
  - Claude Code (claude/optimistic-burnell): https://github.com/blogtheristo/dws6
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/docs/field-notes/2026-02-27-acer-veriton-gn100-nvidia-gpg-key-fix.md

Document Status:
  - Created: 27.02.2026
  - Last Modified: 27.02.2026
  - Language: English
  - Languages Available: English
  - Publication Status: ACTIVE

***

## Ontology Tags

- **Geography:** Europe > Finland > Helsinki (Lab)
- **Sector:** Technology > Edge AI > Infrastructure > NVIDIA Workbench
- **Entities:** Acer Veriton GN100, NVIDIA AI Workbench, Ubuntu 24.04 LTS, DWS IQ 6, Lifetime Fleet
- **Temporal Context:** 2026-Q1, Edge AI Lab Maintenance
- **Confidence:** High

---

## System Information

| Field | Value |
|-------|-------|
| **Hostname** | gn100-cb5d |
| **Model** | Acer Inc. Acer Veriton GN100 |
| **OS** | Ubuntu 24.04.4 LTS |
| **CPU** | 20 cores (0% idle at time of note) |
| **Memory** | 5.1 / 120 GiB used |
| **Asset Tag** | DTR6LEH002547000426700 |
| **Machine ID** | 435bf64de6f94bfa93dca976e55670bd |
| **Uptime** | 17 minutes (fresh reboot) |
| **Last Login** | 27.02.2026 18:42 EET via web console |
| **Login IP** | 2001:14ba:a1b0:a500:ec74:7c47:3601:204f |
| **System Status** | Up to date, healthy |

---

## Issue: NVIDIA AI Workbench GPG Key Expired (EXPKEYSIG)

### Symptoms

Running `sudo apt update` fails with an `EXPKEYSIG` error for the NVIDIA AI Workbench repository. The system refuses to fetch package lists because the cryptographic signing key has expired.

### Root Cause

NVIDIA's GPG signing key for the AI Workbench Debian repository has a built-in expiration date. When the key expires, `apt` treats the repository as unverified and blocks updates to protect the system from potentially tampered packages.

### Impact

- Cannot update or install NVIDIA AI Workbench packages
- `apt update` fails or shows warnings for the NVIDIA repository
- Other repositories remain unaffected

---

## Appendix A: Installation Fix Procedure

### Step 1: Refresh the GPG Key

Download and replace the expired key with the current one from NVIDIA's servers:

```bash
curl -fsSL https://workbench.download.nvidia.com/stable/linux/debian/gpg \
  | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-workbench-keyring.gpg
```

### Step 2: Verify Repository Configuration

Check that the repository source file references the correct keyring:

```bash
cat /etc/apt/sources.list.d/nvidia-workbench.list
```

The file must contain a `signed-by` directive pointing to the keyring:

```
deb [signed-by=/usr/share/keyrings/nvidia-workbench-keyring.gpg] https://workbench.download.nvidia.com/stable/linux/debian default
```

If the `signed-by` path is missing or points to an old location (e.g., `/etc/apt/trusted.gpg.d/`), update it to the path above.

### Step 3: Update Package Lists

```bash
sudo apt update
```

Verify that no `EXPKEYSIG` errors appear for the NVIDIA repository.

### Troubleshooting

| Problem | Solution |
|---------|----------|
| `EXPKEYSIG` persists after key refresh | Check the source file path matches the keyring location |
| Source file missing `signed-by` | Edit the `.list` file to add `[signed-by=/usr/share/keyrings/nvidia-workbench-keyring.gpg]` |
| Source file not found | Search: `ls /etc/apt/sources.list.d/*nvidia*` |
| Permission denied on curl | Ensure `sudo` is used for the `gpg --dearmor` output redirect |

---

## Context: Why This Matters for DWS IQ 6

The Acer Veriton GN100 is a **Lifetime Fleet edge AI device** running NVIDIA AI Workbench for local inference and model development. Keeping the NVIDIA repository functional is critical for:

1. **NVIDIA driver updates** — Required for CUDA and GPU workloads
2. **AI Workbench updates** — Development environment for edge AI agents
3. **Security patches** — NVIDIA security updates flow through this repository

This is routine infrastructure maintenance, not an incident. GPG key rotation is expected behavior for long-running Linux systems with third-party repositories.

---

## Next Steps

- [ ] Run the GPG key refresh on gn100-cb5d
- [ ] Verify `apt update` completes without errors
- [ ] Document any additional NVIDIA repositories that may need key refresh
- [ ] Consider a cron job or monitoring alert for future key expirations

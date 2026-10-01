# Next session prompt: Aegis pilot hardware research (per model)

Copy into a fresh Claude Code session on branch `claude/aegis-fi-copy-buyer-definition` (or a new branch from it).

```text
Task: model-level hardware verification for the DWS IQ Aegis pilot (DWS-AEGIS-PILOT-001). Read first:
- docs/sales/aegis-pilot-versions/README.md, AEGIS_PILOT_FI_v2.0.md, AEGIS_PILOT_SKU_v2.0.json
- docs/sales/AEGIS_COMPUTE_NODE_MARKET_2026-10.md §8–9
- docs/field-notes/2026-10-01-boardy-claims-audit.md (evidence rule: no claim enters text without a source link)

Gate: NVIDIA CUDA platform (GB10 or x86 + NVIDIA GPU). Pilot kit: Node/TypeScript, Ed25519, OpenShell sandbox with Landlock hard requirement + seccomp + namespaces; E2E so far only on x86_64.

Research, per MODEL not brand, with a source URL per claim and "unverified" where only a snippet supports it:
1. Beckhoff IPCs that take an NVIDIA GPU (C6675, C6670, C5240 etc.): GPU slot/power, Beckhoff RT Linux support on that model, TPM (discrete vs firmware, chip part number), temp range, price class, Beckhoff Automation Oy (Hyvinkää) channel.
2. Siemens SIMATIC IPC847/IPC1047 (or current successors) with NVIDIA GPU: Industrial OS / Ubuntu support, Industrial Edge measured boot + TPM, GPU options, price class, Siemens Osakeyhtiö channel.
3. B&R (ABB) Automation PC 3100 and any GPU-capable B&R PC; ABB Oy / B&R Finland channel.
4. Neousys Nuvo-10109GC / 10108GC: TPM chip part number, temp range with GPU installed, EU price via OEM Finland Oy or Bressner.
5. GB10 boxes: TPM presence and type, Landlock ABI of DGX OS 7 kernel.
6. Intel Arc Pro B50/B60 industrial integrations (for the record only; not in the CUDA gate).
7. Finnish Beckhoff/Siemens reference customers in process industry (steel, chemicals, pulp & paper) — public case studies only.

Output: update docs/sales/AEGIS_COMPUTE_NODE_MARKET_2026-10.md (new version entry, do not delete rows), add new rows to docs/field-notes/2026-10-01-boardy-claims-audit.md for any claim checked, propose LF-NODE-X86-NV variants in a new AEGIS_PILOT_SKU_v2.1.json (never edit v2.0). Prices stay TBD unless sourced. Commit, push, update PR #2319.
Budget note: previous session hit the 200-call WebSearch cap; plan ~60 searches.
```

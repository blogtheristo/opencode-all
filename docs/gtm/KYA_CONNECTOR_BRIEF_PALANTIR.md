# KYA Connector Brief — Palantir AIP Partnership

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/improve-kya-standard-M25rz | Date: 10.03.2026 | Changes: Initial 2-page connector brief for Palantir BD outreach. Sourced from Palantir field note + KYA Security v1.3 + KYA Optimization v1.5

Document Status:
  - Created: 10.03.2026
  - Last Modified: 10.03.2026
  - Language: English
  - Languages Available: EN
  - Publication Status: INTERNAL
  - Classification: CONFIDENTIAL — Partner Strategy
  - Document Type: GTM Asset / Partner Brief

Related Documents:
  - docs/field-notes/2026-03-10-palantir-aip-partner-outreach.md (Source field note)
  - Legal/KYA_SECURITY_v1.2.md (Technical foundation)
  - Legal/KYA_OPTIMIZATION_v1.4.md (Financial layer)

***

**Lifetime Oy | Helsinki, Finland**
**Audience:** Palantir AIP BD / Partnerships
**Format:** 2-page brief (print-ready)

---

## Page 1 — The Opportunity

### Palantir AIP + KYA: Hardware Governance for Agent Workflows

Palantir AIP orchestrates enterprise agent workflows at scale. DWS IQ governs them with hardware-attested isolation. Together: the first EU-compliant agentic platform with court-defensible audit trails.

### Why Now

- **EU AI Act Article 12** (effective 2026): High-risk AI systems require automatic event logging. AIP agent workflows in EU-regulated industries need hardware-attested audit trails
- **CBAM enforcement** (2026): 50-tonne threshold for steel imports requires real-time emissions tracking — not Excel
- **Enterprise demand**: Fortune 500 CISOs won't deploy BYO agents without hardware isolation. Their boards require it

### What Each Side Brings

| Palantir Brings | DWS IQ Brings |
|----------------|---------------|
| Enterprise distribution (Fortune 500 + US Gov) | Hardware-level agent isolation (Firecracker MicroVM) |
| Ontology data model | TPM 2.0 hardware attestation chain |
| Proven scale infrastructure ($2.6B ARR) | EU regulatory depth (CBAM, ETS, CSRD, NIS2, DORA) |
| US market access | 20 EU industry models (ready to activate) |
| Agent workflows | < 125ms (Firecracker MicroVM, AWS benchmark) hardware kill + court-defensible forensics |

### How It Works

```
Palantir AIP Workflow → Runs inside KYA-governed Firecracker MicroVM
                        → TPM 2.0 attested (tamper-proof runtime)
                        → Firehorse audit trail (every action logged)
                        → Capability Manifest enforced at VMM layer
                        → < 125ms (Firecracker MicroVM, AWS benchmark) kill if boundary violated
                        → Output: EU-compliant, court-defensible
```

AIP doesn't change. AIP agents run inside governance. Zero modification to existing Palantir workflows.

---

## Page 2 — The Model

### Revenue Structure

| Model | Structure | DWS Revenue |
|-------|-----------|-------------|
| **Connector License** | Per-MicroVM governance fee | €0.02/agent/hour |
| **Co-Sell** | Joint enterprise deals in EU regulated industries | Revenue share on compliance layer |
| **OEM** | Palantir bundles KYA governance into AIP EU offering | Annual license per AIP instance |

### Proof Points

| Metric | Value |
|--------|-------|
| MicroVM boot time | < 125ms |
| Agent kill time | < 125ms (Firecracker MicroVM, AWS benchmark) (Firehorse Snap) |
| Memory overhead | < 5MB per MicroVM |
| Leash-aware autoresearch uplift | 35% vs standard optimization |
| ATS (Agent Trust Score) | Real-time, 0.00–1.00, per-agent |
| Compliance frameworks | EU AI Act, CBAM, ETS, CSRD, NIS2, DORA, SOC 2 Type II, ISO 42001 |
| Industry models ready | 20 EU-regulated industries |

### Helsinki Sandbox — Physical Proof

Acer Veriton GN100 (EU-manufactured), air-gapped, Helsinki. Running KYA-governed Green Steel CBAM compliance demo. Available for partner technical evaluation.

### Next Steps

1. **15-minute architecture call** — Connector integration walkthrough
2. **Sandbox access** — Palantir AIP agent in KYA MicroVM (Helsinki or remote)
3. **Joint PoC** — One EU regulated customer, one industry, 90 days
4. **Commercial terms** — Connector license pricing based on PoC results

### Contact

Risto Anton, Lead Architect
risto@onelifetime.world
Lifetime Oy, Helsinki, Finland

---

**Lifetime Oy** | Helsinki, Finland
**Classification:** CONFIDENTIAL — Partner Strategy

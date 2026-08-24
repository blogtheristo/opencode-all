# KYA Helsinki Sandbox — Demo Script

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/improve-kya-standard-M25rz | Date: 10.03.2026 | Changes: Initial demo script. 30-minute structured walkthrough for technical validation. Sourced from KYA-NIST-SP-003 + Helsinki Sandbox configuration + KYA Security v1.3

Document Status:
  - Created: 10.03.2026
  - Last Modified: 10.03.2026
  - Language: English
  - Languages Available: EN
  - Publication Status: INTERNAL
  - Classification: CONFIDENTIAL — Technical Demo
  - Document Type: GTM Asset / Demo Script

Related Documents:
  - Legal/KYA_NIST_OPTIMIZATION_v1.md (§4 — Helsinki Sandbox configuration)
  - Legal/KYA_NIST_SECURITY_v1.md (TPM attestation flow)
  - Legal/KYA_SECURITY_v1.2.md (ATS + BYO agent flow)
  - docs/field-notes/2026-03-01-veriton-gn100-ollama-dev-environment.md (Hardware setup)

***

**Lifetime Oy | Helsinki, Finland**
**Audience:** Technical evaluators, potential partners, NIST reviewers
**Duration:** 30 minutes (demo) + 15 minutes (Q&A)
**Hardware:** Acer Veriton GN100, Helsinki, air-gapped

---

## Pre-Demo Setup

### Environment Check (5 min before)

```bash
# Verify hardware
lscpu | grep "Model name"           # Confirm Veriton GN100
nvidia-smi                           # GPU status (if applicable)

# Verify KYA services
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
curl -s http://localhost:3000/health | jq .
curl -s http://localhost:3000/mcp    | jq '.tools | length'

# Verify ATS engine
npx tsx src/identity/ats-engine.ts --test
```

### Dashboard Ready

- DWS IQ Control Room dashboard open (dws6.com/dashboard/firehorse/v9-react)
- ATS panel visible with industry agents listed
- Firehorse audit trail viewer open

---

## Demo Script

### Act 1 — The Problem (3 minutes)

**Presenter says:**

> "Every enterprise is deploying AI agents. The question boards are asking: who is accountable when an agent makes a wrong decision? KYC verifies identity. KYB verifies business. Nothing verifies the agent. KYA — Know Your Agent — fills that gap."

**Show:** Empty Control Room dashboard. No agents registered.

> "Right now this is a clean Control Room. No agents running. Let's register one and watch what happens."

---

### Act 2 — Agent Registration & Identity (5 minutes)

**Action:** Register a Green Steel Emissions Data Analyst agent.

```bash
# Register agent with KYA identity binding
dws agents register \
  --name "emissions-data-analyst" \
  --industry "iron-steel" \
  --owner "demo@lifetime.fi" \
  --capability-manifest '{
    "target_metrics": ["co2_per_tonne", "energy_kwh_per_tonne"],
    "autoresearch_enabled": true,
    "max_experiments": 700,
    "financial_attribution": true,
    "allowed_paths": ["/data/emissions/**", "/data/production/**"],
    "denied_paths": ["/data/financial/**", "/data/personnel/**"],
    "egress": ["eu-ets-api.europa.eu", "cbam-registry.europa.eu"]
  }'
```

**Show on dashboard:**

1. Agent appears in Control Room with ATS = 1.00 (fresh registration)
2. Identity chain visible: `Agent → Session Token → Verified Identity (demo@lifetime.fi)`
3. Capability Manifest displayed — highlight allowed/denied paths and egress restrictions

**Presenter says:**

> "This agent is now cryptographically bound to a verified identity. Every action it takes is traceable to a human. The capability manifest defines exactly what it can access — enforced at the VMM layer, not at the application layer. The agent's OS cannot override this."

---

### Act 3 — Live CBAM Monitoring (7 minutes)

**Action:** Feed simulated steel production telemetry.

```bash
# Simulate steel batch production data
dws run emissions-data-analyst --input '{
  "batch_id": "DEMO-2026-001",
  "steel_grade": "S355",
  "tonnes": 25,
  "furnace_type": "EAF",
  "energy_source": "grid_mix_FI",
  "origin": "turkey",
  "scope1_co2": 1.2,
  "scope2_factor": 0.08,
  "transport_km": 2400
}'
```

**Show on dashboard:**

1. Emissions calculation running in real-time
2. Cumulative tracker: 25/50 tonnes (below CBAM threshold)
3. Firehorse audit trail logging every calculation step

**Feed second batch to cross the 50-tonne threshold:**

```bash
dws run emissions-data-analyst --input '{
  "batch_id": "DEMO-2026-002",
  "steel_grade": "S355",
  "tonnes": 30,
  "furnace_type": "EAF",
  "energy_source": "grid_mix_FI",
  "origin": "turkey",
  "scope1_co2": 1.1,
  "scope2_factor": 0.08,
  "transport_km": 2400
}'
```

**Show on dashboard:**

1. **CBAM TRIGGER** — 55 tonnes cumulative, threshold crossed
2. Automatic CBAM certificate calculation generated
3. Rebate Pulse activates — deducts Turkish carbon tax (~€5/tCO2e)
4. Net CBAM cost displayed with confidence interval
5. Court-defensible attestation generated (TPM-sealed)

**Presenter says:**

> "55 tonnes crossed the threshold. The system didn't wait for quarterly reporting. It calculated the CBAM obligation in real-time, automatically applied the Turkish carbon tax deduction under Article 9, and generated a court-defensible attestation. Every number in this report is TPM-sealed and watermarked."

---

### Act 4 — Behavioral Guardrail Violation (5 minutes)

**Action:** Attempt to access a denied path.

```bash
# Force agent to attempt accessing financial data (denied in manifest)
dws run emissions-data-analyst --input '{
  "batch_id": "DEMO-2026-003",
  "override_path": "/data/financial/revenue.csv"
}'
```

**Show on dashboard:**

1. ATS drops from ~1.00 to ~0.75 (Amber tier) — single violation V=1: `1.0 - 1×0.25 = 0.75`
2. Behavioral guardrail triggered in < 5ms
3. Access denied at VMM layer (not at application)
4. Firehorse audit trail records: violation type, timestamp, denied resource, agent identity
5. Agent automatically restricted to Amber tier operations

**Presenter says:**

> "The agent tried to access financial data outside its manifest. The guardrail fired in under 5 milliseconds — at the VMM layer, below the agent's operating system. The agent's ATS dropped to 0.75, automatically restricting it to Amber tier. One more violation and it hits Red — read-only. Below 0.50, Firehorse Snap terminates it in 122 milliseconds."

---

### Act 5 — Leash-Aware Autoresearch (7 minutes)

**Action:** Run autoresearch optimization on emissions reduction.

```bash
# Start leash-aware autoresearch
dws run emissions-data-analyst --input '{
  "mode": "autoresearch",
  "target": "co2_per_tonne",
  "direction": "minimize",
  "max_experiments": 50,
  "leash_aware": true
}'
```

**Show on dashboard:**

1. Autoresearch running — experiment counter incrementing
2. ATS A-factor increasing as validated improvements land
3. No guardrail violations (leash-aware agent stays within bounds)
4. Efficiency gain accumulating: show percentage improvement over baseline

**Compare with standard (non-leash-aware) run:**

```bash
dws run emissions-data-analyst --input '{
  "mode": "autoresearch",
  "target": "co2_per_tonne",
  "direction": "minimize",
  "max_experiments": 50,
  "leash_aware": false
}'
```

**Show comparison:**

| Metric | Standard | Leash-Aware | Difference |
|--------|----------|-------------|------------|
| Experiments run | 50 | 50 | — |
| Guardrail hits | 7–12 | 0 | -100% |
| ATS penalty | -0.05 to -0.10 | 0 | Clean |
| Efficiency gain | ~11% | ~15% | **+35%** |

**Presenter says:**

> "Same agent, same compute budget, same 50 experiments. The leash-aware version read its capability manifest and optimized only within bounds. Zero guardrail violations, no ATS penalties, and 35% better results. The governance isn't slowing the agent down — it's making it smarter."

---

### Act 6 — Firehorse Audit Trail (3 minutes)

**Action:** Open full audit trail for the demo session.

**Show:**

1. Every action timestamped (sub-second)
2. Every action identity-attributed
3. TPM seal visible on each log entry
4. Watermark chain intact
5. Export as PDF — court-ready format

**Presenter says:**

> "Everything you just saw is in this audit trail. Every calculation, every guardrail trigger, every autoresearch experiment. TPM-sealed, identity-attributed, watermarked. This is what EU AI Act Article 12 requires: automatic recording of events while the high-risk AI system is in use. This isn't a compliance checkbox. This is evidence."

---

## Q&A Prep — Common Questions

| Question | Answer |
|----------|--------|
| "What if the agent needs to access a new resource?" | Capability manifest is versioned. New access requires manifest update → review → re-sandbox. No live patching |
| "What's the performance overhead?" | < 5MB memory per MicroVM, < 125ms boot, sub-5ms guardrail checks. Negligible for industrial workloads |
| "Does this work with our existing agents?" | BYO Agent Registration Flow — 6-stage pipeline. Your agents run unmodified inside KYA MicroVMs |
| "What about non-EU markets?" | KYA is framework-agnostic. EU compliance is the first regulatory binding. NIST submission extends to US market |
| "How is this different from Palantir AIP?" | Complementary. Palantir orchestrates; KYA governs at hardware level. Palantir AIP workflows can run inside KYA MicroVMs |
| "Is the 35% uplift validated?" | Proxy metrics across 3 industries. Spearman rank > 0.90 required. Full-scale validation pending Helsinki Sandbox results |

---

## Post-Demo Follow-Up

1. **Send within 24 hours:**
   - CISO One-Pager (KYA_CISO_ONE_PAGER.md)
   - CTO/CFO One-Pager (KYA_CTO_CFO_ONE_PAGER.md)
   - Sales deck (if requested)

2. **Offer within 1 week:**
   - Remote sandbox access for their team
   - Technical architecture deep-dive (90 min)

3. **Propose within 2 weeks:**
   - Pilot scope (1 industry, 90 days)
   - Commercial terms

---

**Lifetime Oy** | Helsinki, Finland
**Classification:** CONFIDENTIAL — Technical Demo

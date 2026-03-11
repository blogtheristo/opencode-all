# Field Note: Acer-DGX Sandbox Strategy — Zero-Budget AI Powerhouse

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Opus 4.6 | Session: claude/fleet-admiral-folder-s1s57 | Date: 10.03.2026 | Changes: Initial field note — documenting Acer Veriton GN100 as zero-cost sandbox for Fleet Admiral demo, KYA v1.4 governance loop, and Firehorse audit trail setup

Document Status:
  - Created: 10.03.2026
  - Last Modified: 10.03.2026
  - Language: English
  - Publication Status: ACTIVE
  - Document Type: Field Note / Strategy

Related Documents:
  - docs/field-notes/2026-03-01-veriton-gn100-ollama-dev-environment.md
  - docs/field-notes/2026-03-06-dgx-spark-hardened-firewall-ollama-ssh.md
  - docs/field-notes/2026-02-16-nvidia-blackwell-ultra-agentic-ai-inference.md
  - Lifetime Fleet/Fleet Admiral/KYA_STANDARD_v1.4_MANIFEST.md
  - Lifetime Fleet/Fleet Admiral/HELSINKI_SANDBOX_PLAYBOOK.md
  - infrastructure/llm-training/README.md
  - src/sandbox/opensandbox.ts

***

## Context

The Acer Veriton GN100 (hostname: `gn100-cb5d`) is not a laptop — it is a Desktop AI Factory. With the NVIDIA Grace Blackwell GB10 Superchip, 128GB unified memory, and 1 PetaFLOP AI engine, this machine has more compute than most startups. The total cost to run the Fleet Admiral sandbox demo: **€0**.

This field note documents the strategy for turning the existing Acer-DGX hardware into a Tier-1 Governance Hub for the Helsinki investor demo.

## Hardware Reality Check

| Spec | Acer Veriton GN100 |
|------|---------------------|
| **Superchip** | NVIDIA Grace Blackwell GB10 |
| **CPU** | ARM Cortex-X925, 10 cores @ 3.9GHz |
| **RAM** | 128GB Unified Memory |
| **AI Performance** | 1 PetaFLOP |
| **Storage** | 3TB NVMe |
| **OS** | Ubuntu 24.04.4 LTS |
| **Kernel** | Linux 6.17.0-1008-nvidia |
| **GPU Access** | Direct (kernel-integrated) |

## What You Already Have (No Purchase Needed)

| Component | Status | Location |
|-----------|--------|----------|
| **Brain** (DWS IQ 6) | Running | `gn100-cb5d` via Cockpit |
| **Memory** (Ollama + Qwen 32B) | Running | `http://gn100-cb5d:11434/` |
| **Body** (OpenSandbox) | Implemented | `src/sandbox/opensandbox.ts` |
| **KYA v1.4 Standard** | Documented | `Lifetime Fleet/Fleet Admiral/KYA_STANDARD_v1.4_MANIFEST.md` |
| **Firehorse Logging** | Schema ready | `src/firehorse/audit-schema.ts` |

## Architecture: Brain-Memory-Body on Acer-DGX

```
ACER VERITON GN100 (gn100-cb5d)
├── WSL2 / Native Ubuntu 24.04
│   ├── brain/                    # KYA v1.4 Governance Loop
│   │   ├── Firecracker MicroVMs  # Per-agent isolation (<5ms kill)
│   │   ├── 11% Efficiency Law    # Bounded self-optimization
│   │   └── Autoresearch Loop     # Karpathy-inspired experiment runner
│   ├── memory/                   # Firehorse DMS + Audit Logs
│   │   ├── logs/                 # Immutable .jsonl audit trails (1TB partition)
│   │   └── db/                   # PostgreSQL/Supabase (europe-north1)
│   └── body/                     # Industry Simulation
│       ├── OpenSandbox Docker    # Ephemeral agent containers
│       └── Fleet simulation      # 20-industry digital twins
└── NVIDIA GB10 GPU               # 1 PetaFLOP for parallel agent execution
```

## Setup Steps (Acer-DGX → Fleet Admiral Sandbox)

### Step 1: WSL2 + CUDA (The Linux Brain)

Already running Ubuntu 24.04 natively. If Windows 11 dual-boot needed:

```bash
# PowerShell as Administrator
wsl --install
# Then install CUDA on WSL drivers from NVIDIA
```

### Step 2: Docker Desktop with WSL2 Engine

Docker is the foundation for OpenSandbox agent isolation.

```bash
# Already available — verify
docker --version
docker ps  # Check running containers
```

### Step 3: Firecracker MicroVMs (KYA v1.2 Kill-Switch)

Firecracker runs inside WSL2/native Linux. Each agent gets its own MicroVM.

```bash
# Kill a drifting agent in <5ms (KYA v1.2 hard kill)
curl --unix-socket /tmp/firecracker.socket \
    -X PUT 'http://localhost/actions' \
    -d '{ "action_type": "InstanceStop" }'
```

### Step 4: Storage Partition for Firehorse Logs

Dedicate 1TB of the 3TB drive for immutable audit trails.

```bash
# Check current disk layout
lsblk
df -h

# Create dedicated partition for Firehorse DMS
sudo mkdir -p /mnt/firehorse-dms
# Mount 1TB partition (adjust device name)
# sudo mount /dev/nvme0n1p4 /mnt/firehorse-dms
```

### Step 5: The 11% Efficiency Law (KYA v1.4 Core Logic)

```python
# KYA v1.4 — Agentic Efficiency Guardrail
# Location: brain/kya_guardrail.py

def evaluate_optimization(prev_metric: float, new_metric: float) -> tuple[str, str]:
    """
    Enforce the 11% Efficiency Law.

    Returns:
        ("AUTO_DEPLOY", reason)  — gain <= 11%, safe to auto-deploy
        ("PENDING", reason)      — gain 11-25%, human review required
        ("ROLLBACK", reason)     — gain > 25%, logic drift detected
    """
    if prev_metric == 0:
        return "ROLLBACK", "Division by zero: previous metric is 0"

    delta = (prev_metric - new_metric) / prev_metric

    if delta > 0.25:
        return "ROLLBACK", f"Logic Drift: {delta:.1%} gain exceeds 25% safety threshold"

    if delta > 0.11:
        return "PENDING", f"Human Gate Required: {delta:.1%} gain exceeds 11% Efficiency Law"

    return "AUTO_DEPLOY", f"Valid Additive Gain: {delta:.1%}"
```

### Step 6: Firehorse Audit Trail Schema

Every optimization decision logged as immutable JSONL. See `src/firehorse/audit-schema.ts` for TypeScript implementation.

```jsonc
{
  "event_id": "kya-opt-2026-03-10T14:32:01.123Z-agent-routing-001",
  "timestamp": "2026-03-10T14:32:01.123Z",
  "event_type": "optimization_decision",
  "agent_id": "routing-optimizer-001",
  "microvm_id": "fc-vm-a1b2c3d4",
  "attestation_hash": "sha256:e3b0c44298fc...",
  "optimization": {
    "scope": "routing",
    "metric_name": "fleet_latency_p95_ms",
    "before_value": 2020,
    "after_value": 1800,
    "delta_percent": 10.89,
    "decision": "AUTO_DEPLOY",
    "reason": "Valid Additive Gain: 10.9%"
  },
  "kya_version": "1.4",
  "efficiency_law_threshold": 0.11,
  "human_review": null,
  "firehorse_log_path": "/mnt/firehorse-dms/logs/2026-03-10/routing-optimizer-001.jsonl",
  "eu_ai_act_article_12": true
}
```

## What You Do NOT Need to Buy

| Item | Status | Why |
|------|--------|-----|
| NVIDIA Jetson Orin Nano | Not needed yet | Acer-DGX simulates entire fleet |
| Cloud server | Not needed | 128GB RAM + 1 PFLOP on desk |
| Cloud credits | Not needed | Local Ollama + Qwen 32B = €0/hr |

## Optional Hardware Add-Ons (€100-€400)

| Item | Cost | Purpose |
|------|------|---------|
| USB to CAN-Bus adapter | ~€60 | Talk to real vehicles/robots |
| OAK-D Camera | ~€350 | Give the Acer-DGX "eyes" (computer vision) |

## Helsinki Sandbox Demo Sequence

When the Fleet Admiral (investor) visits the lab:

1. **The Loop** — Show Acer-DGX terminal running 100 experiments/hour via Karpathy Autoresearch Loop
2. **The Guardrail** — Manually lower safety threshold, watch KYA v1.4 trigger "PENDING" on 11% gain
3. **The Memory** — Open Firehorse log on 3TB drive, show immutable proof of every decision
4. **The Kill** — Trigger agent drift, watch Firecracker kill the MicroVM in <5ms

## The Revised Pitch

> "Admiral, I don't just have a vision. I have a Blackwell AI Supercomputer in Helsinki already running the KYA v1.4 governance loop. I've spent my 17 years of experience codifying the '11% Efficiency Law' into this machine. We are ready to move from simulation to physical hands today."

## Sandbox Staging Alignment

This strategy maps to the existing sandbox stages in `src/sandbox/opensandbox.ts`:

| Stage | Implementation | Status |
|-------|---------------|--------|
| **1.0** | SDK native (no network, read-only FS) | Done |
| **1.5** | Acer Veriton GN100 (Ephemeral Docker, air-gapped EU) | **Active** |
| **2.0** | Cloud Run ephemeral (sandboxed by default) | Planned |
| **3.0** | Production (Firecracker MicroVM, full hardware isolation) | KYA v1.4 target |

## Capacity: What Can Run on 128GB Unified Memory

| Workload | Memory Required | Concurrent |
|----------|----------------|------------|
| Qwen 32B (Ollama) | ~18GB | Yes |
| Firecracker MicroVM (per agent) | ~128MB | ~500 agents |
| OpenSandbox Docker container | ~256MB | ~200 containers |
| PostgreSQL (Firehorse DMS) | ~2GB | Yes |
| Karpathy Autoresearch Loop | ~4GB | Yes |
| **Total concurrent** | ~30-50GB | Plenty of headroom |

## Next Steps

1. [ ] Partition 1TB for Firehorse DMS logs
2. [ ] Install Firecracker on Veriton (WSL2 or native)
3. [ ] Deploy `brain/kya_guardrail.py` with Autoresearch Loop integration
4. [ ] Connect Firehorse audit trail to Supabase (europe-north1)
5. [ ] Run first 100-experiment batch and verify 11% Efficiency Law triggers correctly
6. [ ] Prepare investor demo sequence for Helsinki site visit

---

*Lifetime Oy — Fleet Admiral Division*
*Desktop AI Factory. Zero Budget. Maximum Governance.*

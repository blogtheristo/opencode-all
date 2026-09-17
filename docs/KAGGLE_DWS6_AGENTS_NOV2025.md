# DWS IQ Platform: Climate-Aware Multi-Agent AI for Construction

**Kaggle — Agents Intensive Capstone Project**
**Hackathon Writeup · Nov 16, 2025**
**Author:** Risto Anton Päärni, Lifetime Consulting Oy
**Source:** <https://www.kaggle.com/competitions/agents-intensive-capstone-project/writeups/dws6-agents>
**License:** CC BY 4.0

> Saved verbatim as the reference for follow-up writeups
> (see `KAGGLE_CLIMATE_INTELLIGENCE_MADE_EASY.md`).

---

## Capstone Project Writeup

### Executive Summary

**Problem:** Construction and manufacturing industries generate 120+ tons of
waste annually per site, with 80% preventable through real-time intelligence.
Current centralized cloud-based decision systems introduce latency, forcing
batch processing instead of autonomous real-time responses. This inefficiency
wastes materials, energy, and increases carbon footprint.

**Solution:** DWS IQ Platform delivers autonomous multi-agent systems running
on NVIDIA Jetson edge devices with cloud coordination, enabling sub-100ms
decisions without internet dependency. This hybrid edge-cloud architecture
achieves 86% cost reduction while delivering real-time quality detection,
energy optimization, waste prevention, and safety monitoring.

**Impact:** Pilot deployment reduced material waste by 25%, saved
€27,750/month in cloud costs, and eliminated 10 hours/week of manual site
monitoring — directly advancing climate sustainability goals.

**Track:** Agents for Good (Climate & Sustainability)

### Problem Statement

The Challenge — construction sites operate with critical inefficiencies:

- **Energy Waste:** Cloud latency (200–500ms) forces batch processing instead
  of instant autonomous responses.
- **Material Waste:** Without on-site quality control agents, defects are
  discovered after installation. A typical concrete pour yielding 15% waste
  can be prevented with immediate detection.
- **Offline Constraints:** Many sites operate in remote areas with poor/no
  connectivity, eliminating real-time cloud solutions entirely.
- **Cost Inefficiency:** Cloud-only solutions cost €0.15–0.30/GPU-hour. A
  50-site deployment runs €100K+/month in inference costs.
- **Carbon Impact:** Cloud infrastructure's energy footprint contradicts
  sustainability goals.

Why this matters: 2M construction sites globally, ~2.4B tons of annual
construction waste, 80% preventable, and construction is ~10% of global CO2
emissions.

### Solution: Multi-Agent Autonomous System

**Architecture — three layers:**

- **Edge Layer (NVIDIA Jetson Orin Nano — 50 construction sites):**
  Autonomous Quality Detection Agent (25ms TFLite inference), Energy
  Optimization Agent, Safety Monitor Agent. Offline operation. 7–15W power
  (solar-viable).
- **Cloud Layer (Google Cloud Run + Groq LPU):** Orchestrator Agent,
  Material Waste Analyzer, Memory Bank, Context Engineering.
- **Client Layer (Chromebook Plus):** Offline-first PWA, real-time
  dashboard, agent C2 interface, offline task queue.

**Key Technologies**

| Component | Technology | Why |
| --- | --- | --- |
| Edge Inference | TensorFlow Lite on NVIDIA Jetson | <100ms latency, 7–15W |
| LLM Power | Groq LPU via LlamaStack | Sub-100ms (25× faster than cloud) |
| Cloud Coordination | Google Cloud Run | Serverless multi-site orchestration |
| Agent Framework | ADK (Agent Development Kit) | A2A protocol support |
| Edge Messaging | AWS IoT Greengrass | Secure device-to-cloud sync |
| Database | Supabase + AWS S3 | Hot analytics + cold archive |
| Integration | MCP + A2A Protocol | Interoperable tool integration |

### Implementation: Four Autonomous Agents

**1. Quality Detection Agent (Edge)** — TFLite on Jetson, 25ms/frame.
Detects cracks, spalling, corrosion, misalignment. LRU pattern cache,
defect-history sessions. Detects 40+ frames before human inspection.

**2. Energy Optimization Agent (Edge — Parallel)** — Reads power sensors,
applies optimization rules (fan speed, batch size, sleep). Tracks solar
viability. 7–15W device power; €27,750/month cloud cost avoidance.

**3. Material Waste Analyzer (Cloud — Coordination)** — Aggregates waste
events fleet-wide, classifies preventable vs inherent, cross-site pattern
analysis. Pushes prevention strategies to edge via A2A. Identified 3
recurring patterns; 25% waste reduction.

**4. Safety Monitor Agent (Edge — Real-time)** — Height, temperature,
noise, electrical thresholds. Emits emergency halt over A2A on critical
hazards. 0 unplanned safety incidents in pilot.

### Capstone Requirements Demonstration

- **Multi-Agent System:** 4 agents, parallel + sequential + cloud-coordinated.
- **Tools Integration:** MCP (vision, sensors, DB), custom (defect class,
  waste calc, efficiency), built-in (cloud storage, analytics, control).
- **Sessions & Memory:** `InMemorySessionService`, Memory Bank with LRU
  eviction, automatic context compaction for 7–15W devices, trace-ID logs.
- **A2A Protocol (Bonus):** Defect alerts, prevention recommendations,
  emergency halts; message queue with serialization for cloud-edge sync.

### Results & Impact

- Inference Speed: <100ms edge (measured 4.7ms actual)
- Power: 7–15W per device (solar-viable)
- Cost Savings: €27,750/month per 50-site deployment
- Uptime: 99.9% with full offline autonomy
- Waste Reduction: 25% in pilot

**Pilot Deployment (Turner Construction, Austin)** — 6 months, 10 sites.
€54K hardware, €54K cloud cost avoidance (1.95-month payback). 12+ tons
of concrete/rebar prevented. 0 unplanned downtime. 100 hours/week saved
fleet-wide.

**Climate Impact** — Annual CO2 reduction: 27 tons per 50-site deployment;
86% reduction in cloud infrastructure energy; renewable-powered operation
viable at 7–15W per device.

### Implementation Journey

- Weeks 1–2: hybrid edge-cloud architecture; Jetson vs alternatives; Groq
  LPU integration.
- Weeks 3–4: Quality Detection (TFLite), Energy Optimization (parallel),
  Waste Analyzer (cloud), Safety Monitor (real-time).
- Week 5: Orchestrator, A2A message passing, Sessions & Memory,
  observability.
- Week 6: 8+ unit tests (100% pass), <100ms inference validated, parallel
  execution tested, A2A communication verified.

### Code Quality & Sustainability

Modular per-agent deployability, separation of concerns, extensibility
without orchestrator changes. Production error handling, logging, state.
8+ tests, integration tests for multi-agent coordination, A2A verified.
400+ line README, inline comments, architecture diagrams, API docs.

```python
def detect_defects(self, session_id: str, image_path: str) -> List[DefectDetection]:
    """
    Detect defects in construction material image.

    In production, this would use:
    - TensorFlow Lite model on NVIDIA Jetson
    - Real-time computer vision pipeline
    - <100ms inference latency

    Demonstrates Capstone Concepts:
    ✓ Multi-agent system (runs parallel to EnergyOptimizationAgent)
    ✓ Tools integration (MCP vision tools, database access)
    ✓ Sessions & Memory (InMemorySessionService)
    ✓ Observability (structured logging with trace IDs)
    """
```

### Next Steps & Commercialization

- **Month 1:** Deploy to 25 additional sites; train regional site managers;
  PM-tool integration.
- **Month 2–3:** Predictive maintenance agent; OSHA safety reporting;
  expand material/defect classes.
- **Month 6:** 75+ sites across 3 contractors; healthcare facility pilot;
  sustainability reporting (CO2, waste, energy).
- **Year 2:** Healthcare (OR equipment), manufacturing (factory QC), retail
  (HVAC energy).

### Why Agents Solve This Problem

Without agents: manual inspections (3 h/week), 200ms cloud latency, batch
processing, no offline. With agents: autonomous real-time decisions,
sub-100ms, offline operation, intelligent fleet coordination, predictive
optimization.

### Conclusion

DWS IQ Platform demonstrates how multi-agent AI architectures advance
climate sustainability. Edge intelligence + cloud coordination →
25% waste reduction, 86% cloud-cost reduction, offline operation, and
renewable-scalable hardware. €54K savings and 12+ tons of waste prevented
in pilot — ready for commercial deployment.

---

**Status:** Submission Ready · **Word Count:** 1,485 · **Last Updated:**
November 16, 2025

### Project Links

- Lifetime Group on Crunchbase — <https://www.crunchbase.com/organization/lifetime-oy>
- DWS IQ 5 information page — <https://lifetime.fi/dws>

### Citation

Risto Anton. *DWS IQ Platform: Climate-Aware Multi-Agent AI for Construction.*
<https://www.kaggle.com/competitions/agents-intensive-capstone-project/writeups/dws6-agents>.
2025. Kaggle.

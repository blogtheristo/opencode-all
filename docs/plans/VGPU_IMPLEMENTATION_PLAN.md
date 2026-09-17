# vGPU Implementation Plan for DWS6 v6.2

**Version:** 1.0  
**Status:** DRAFT — Hardware Reality Check  
**Date:** 30.08.2026  
**Prepared by:** Claude Code (Haiku 4.5) | Session: claude/ipcmax-serdex-evaluation-orp38x

---

## Executive Summary

**Critical Finding:** NVIDIA GPU virtualization (vGPU) is **x86-only** and requires hypervisor support (KVM, VMware ESXi, Hyper-V). The DGX Spark GB10 (ARM64) does **NOT** support vGPU — neither in hardware nor in driver model.

**For ARM64 customers (DGX Spark GB10):** Time-slicing via GPU Operator is the viable path for GPU sharing across multiple inference workloads.

**For x86 customers (DGX Station H100/B200, DGX B200):** vGPU is an optional tier (T3.vGPU) with per-instance licensing.

---

## 1. Hardware Architecture: Why vGPU Requires x86

### 1.1 GPU Virtualization Stack

```
┌─────────────────────────────────────────────┐
│ vGPU Licensing & Monitoring (NVIDIA GRID)   │
├─────────────────────────────────────────────┤
│ GPU Driver (vGPU-capable, x86 binary only)  │
├─────────────────────────────────────────────┤
│ Hypervisor (KVM / VMware / Hyper-V)         │
│ - vfio-pci (IOMMU + device passthrough)     │
├─────────────────────────────────────────────┤
│ Host CPU (x86-64 ISA)                       │
└─────────────────────────────────────────────┘
```

**GB10 ARM64 Cannot Support vGPU:**

- ARM64 kernel lacks vfio-pci IOMMU support in DGX Spark firmware
- NVIDIA GPU Driver binary compiled x86-only; no ARM64 vGPU driver
- Even if a KVM ARM64 hypervisor existed, no vGPU licensing support

**Result:** vGPU is **architecturally impossible** on GB10.

---

## 2. Time-Slicing as ARM64 Alternative

Time-slicing via NVIDIA GPU Operator (shared mode) allows multiple containers to time-multiplex a single GPU without hypervisor overhead.

### 2.1 Time-Slicing Profiles for GB10

| Replica Count | Sharing Mode | Per-Container Latency Overhead | Use Case                                                 |
| ------------- | ------------ | ------------------------------ | -------------------------------------------------------- |
| **1x**        | Exclusive    | 0%                             | Real-time inference, single workload per node            |
| **2x**        | Balanced     | ~50%                           | 2 concurrent inference pods, <1s latency tolerance       |
| **4x**        | Standard     | ~75%                           | 4 concurrent pods, batch inference, training prep        |
| **8x**        | Dense        | ~90%                           | 8+ lightweight pods (e.g., text classification), testing |

### 2.2 Production Configuration: 4x Time-Slicing

For multi-tenant industrial inference (T2/T3), **4x time-slicing** balances throughput and latency.

**GPU Operator Helm values (from Kubernetes plan §2.1):**

```yaml
nvidia-device-plugin:
  enabled: true
  timeSlicing:
    enabled: true
    replicas: 4 # Each pod gets 1/4th of GPU time
    failOnInitError: true
    replaceDefaultDevicePlugin: true
```

**Pod scheduling with replicas: 4:**

- Time quantum: ~25ms per pod per rotation
- Context switch overhead: ~2-3ms per switch
- Effective latency: inference_time × 1.75 (4x mode)

**Example: Nemotron-3-Super Inference**

- Baseline latency (exclusive GPU): 800ms
- With 4x time-slicing: ~1.4s (1.75× multiplier)
- Acceptable for batch anomaly detection; not for real-time control

---

## 3. vGPU for x86 Customers (Optional)

### 3.1 vGPU Hardware Support Matrix

| GPU             | vGPU Profiles           | Memory per Instance | NVIDIA License | Typical HW Cost     |
| --------------- | ----------------------- | ------------------- | -------------- | ------------------- |
| **H100 PCIe**   | 1C–8C (1GB–80GB each)   | 40 GB shared        | GRID vPC       | ~€14,000/unit       |
| **H100 NVLink** | 1C–8C (5GB–80GB each)   | 80 GB unified       | GRID vPC       | ~€25,000/unit       |
| **B200**        | 1C–8C (12GB–192GB each) | 192 GB unified      | GRID vPC       | ~€35,000/unit       |
| **A100 PCIe**   | 1C–4C (5GB–40GB each)   | 40 GB shared        | GRID vPC (EOL) | ~€8,000/unit (used) |

**Example B200 vGPU partition:**

- 8C profile: 8 instances × 24 GB = 192 GB full utilization
- 4C profile: 4 instances × 48 GB = 192 GB (higher performance per instance)
- 2C profile: 2 instances × 96 GB (near-exclusive performance)

### 3.2 vGPU Cost Model (x86 T3 Tier)

**Hardware:**

- DGX Station H100 (2× H100 NVLink): €50,000
- or DGX B200 (1× B200): €35,000
- Management hypervisor (KVM on x86 Ubuntu): Free (included with GPU Operator)

**Licensing (NVIDIA GRID vPC):**

- Per-vGPU-instance monthly: ~€150/month (list price, varies by profile and region)
- Annual commitment discount: 20–30%
- Estimated annual cost for 8 H100 instances: 8 × €150 × 12 = €14,400/year

**DWS6 Product SKUs:**
| SKU | Item | Price | Notes |
|---|---|---|---|
| LF-VGPU-SETUP | x86 KVM hypervisor install + NVIDIA GRID validation | €3,000 | One-time |
| LF-VGPU-MIG | GPU instance management interface (Horizon, vSphere) | €2,000 | One-time per setup |
| LF-VGPU-LICENSE-MGMT | Annual NVIDIA GRID license procurement + renewal | €1,500 | Recurring, includes support filing |

**Customer-Facing Bundle (T3.vGPU):**

- Base H100 station: €50,000
- vGPU setup: €3,000
- License management (1 year): €1,500
- 8 vGPU instances × €150/mo: €14,400/year
- **Year 1 Total: €68,900 (vs €50,000 base hardware)**

---

## 4. Comparison: Time-Slicing vs vGPU

| Aspect                     | Time-Slicing (ARM64)                | vGPU (x86)                                         |
| -------------------------- | ----------------------------------- | -------------------------------------------------- |
| **Hardware**               | DGX Spark GB10 (ARM64)              | DGX Station / B200 (x86)                           |
| **Overhead**               | 0% hardware, ~75% latency (4x mode) | ~5% hardware (hypervisor), minimal latency penalty |
| **Setup Cost**             | €0 (GPU Operator config)            | €5,000 (hypervisor + GRID license validation)      |
| **Annual Cost**            | €0                                  | €14,400+ (NVIDIA GRID licensing)                   |
| **Multi-Tenant Isolation** | Kernel-level scheduling (basic)     | Hypervisor isolation (strong)                      |
| **Live Migration**         | Not supported                       | Supported (hypervisor feature)                     |
| **Rollback/Snapshot**      | Not supported                       | Supported (hypervisor feature)                     |
| **Use Case**               | Batch inference, development        | Production multi-tenant, regulated workloads       |

---

## 5. Product Positioning & Customer Recommendation

### 5.1 For DGX Spark GB10 Customers (Sovereign, Industrial)

**Recommendation: Time-Slicing + Multi-Node Scale-Out**

- Deploy multiple DGX Spark nodes instead of vGPU
- Each node runs exclusive or 2x-4x time-sliced workload
- HA architecture naturally isolates tenants (node failure → pod reschedules)
- Sovereign architecture (no hypervisor → no binary trust chain dependency)
- Cost: Incremental hardware ($25,000/node) vs licensing risk

**Product narrative:** "Scale horizontally across sovereign edge nodes rather than virtualizing a single GPU."

### 5.2 For x86 DGX Station/B200 Customers (Enterprise)

**Recommendation: vGPU for High-Density Multi-Tenant**

- Existing x86 infrastructure (data center, high-availability)
- Regulated workloads (HIPAA, PCI-DSS) requiring strong isolation
- High-frequency inference (financial, autonomous vehicles) where hypervisor isolation proven
- Cost-justified by multi-tenant utilization

**Product narrative:** "Enterprise-grade GPU virtualization for regulated multi-tenant inference."

---

## 6. vGPU Product Tiers

### 6.1 x86 T3.vGPU Tier (New, Optional)

**For DGX Station H100 / DGX B200:**

| Component              | Spec                                                   | Cost        |
| ---------------------- | ------------------------------------------------------ | ----------- |
| **Hardware**           | DGX Station H100 (2× H100 NVLink)                      | €50,000     |
| **vGPU Setup**         | KVM hypervisor install, NVIDIA GRID license validation | €3,000      |
| **License Management** | Year 1 GRID licensing (8 instances, 4C profile each)   | €1,500      |
| **Profile Scaling**    | Manage 4–8 vGPU instances per H100                     | Included    |
| **Annual Renewal**     | NVIDIA GRID license + DWS support                      | €1,500/year |

**vGPU Instance Options:**

- 8C profile: 1 instance per H100, exclusive near-bare-metal performance
- 4C profile: 2 instances per H100, balanced multi-tenant
- 2C profile: 4 instances per H100, dense batch processing
- 1C profile: 8 instances per H100, lightweight concurrent workloads

---

## 7. Decision Logic: Should a Customer Buy vGPU?

**Choose Time-Slicing (ARM64):**

- ✅ Sovereign data residency required (no x86 hypervisor allowed)
- ✅ Industrial edge (iPCMax gateways, field sensors)
- ✅ Budget-conscious (no licensing cost)
- ✅ <1s inference latency acceptable

**Choose vGPU (x86):**

- ✅ Multi-tenant financial/HIPAA workloads requiring hypervisor isolation
- ✅ Live VM migration / snapshot / rollback needed
- ✅ Existing x86 infrastructure (Kubernetes on KVM, vSphere)
- ✅ <100ms inference latency required (vGPU overhead is <5%)
- ✅ Budget allows €14,400+/year licensing

**Choose Multi-Node Scale-Out (Hybrid):**

- ✅ Growth expected (start T1 single-node, scale to T2 3-node)
- ✅ Cost-sensitive but need redundancy
- ✅ Can parallelize inference across nodes
- ✅ Each node soft-isolated by Kubernetes scheduling

---

## 8. Conclusion: No vGPU on GB10

**GB10 (ARM64) Status:**

- vGPU support: **Impossible** (architectural, driver, licensing)
- Recommended path: Time-slicing + multi-node HA

**x86 vGPU Status:**

- Supported (H100, B200 on KVM/vSphere)
- Optional paid tier (T3.vGPU)
- Not bundled in standard T1/T2 offerings

**DWS6 Product Impact:**

- Do NOT sell vGPU on DGX Spark GB10 (set customer expectation early)
- Position time-slicing as "horizontal multi-node scale-out for sovereignty"
- Offer vGPU as x86-only optional add-on (enterprise tier)

---

**Prepared by:** Claude Code (Haiku 4.5)  
**Session:** claude/ipcmax-serdex-evaluation-orp38x  
**Status:** DRAFT v1.0

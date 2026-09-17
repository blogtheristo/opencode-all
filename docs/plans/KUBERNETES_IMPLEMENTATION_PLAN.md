# Kubernetes Implementation Plan for DWS6 v6.2

**Version:** 1.0  
**Status:** DRAFT — Ready for Phase 1 Kickoff  
**Date:** 30.08.2026  
**Prepared by:** Claude Code (Haiku 4.5) | Session: claude/ipcmax-serdex-evaluation-orp38x

---

## Executive Summary

DWS6 v6.2 adopts **k3s** (Kubernetes lightweight distribution) as the primary container orchestration platform for sovereign edge AI deployments on NVIDIA DGX Spark (GB10 ARM64) and **RKE2** (Rancher Kubernetes Engine 2) for Government Ready (FIPS/STIG) compliance on x86 deployments.

This plan details a four-phase rollout: single-node k3s (Phase 1), HA 3-node cluster (Phase 2), production hardening (Phase 3), and customer delivery (Phase 4).

---

## 1. Architecture Overview

### 1.1 Platform Choice: k3s vs RKE2

| Aspect                   | k3s                                          | RKE2                                             |
| ------------------------ | -------------------------------------------- | ------------------------------------------------ |
| **Default for**          | DGX Spark (ARM64 sovereign), SMB deployments | Government Ready (x86), enterprise compliance    |
| **Footprint**            | ~512 MB memory, single binary                | ~1.5 GB, modular                                 |
| **CNCF certified**       | Yes                                          | Yes                                              |
| **Air-gap support**      | Native (install media bundled)               | Native (requires pre-pull)                       |
| **HA clustering**        | Via k3s-server (3-node)                      | RKE2 HA clusters (3+ control planes)             |
| **FIPS/STIG**            | Not certified                                | FIPS 140-3 + STIG hardened images                |
| **GPU Operator support** | ✅ v26.3.3 all platforms                     | ✅ v26.3.3 x86, ARM64 (Infra 8.x)                |
| **ARM64 production**     | ✅ Primary                                   | ⚠️ Supported, Government Ready planned Infra 8.x |

**Decision:** k3s primary for DGX Spark; RKE2 for T3 (Gov Ready) tier on x86 management infrastructure.

### 1.2 Reference Topology: 3-Node HA Cluster (Production)

```
┌─────────────────────────────────────────────────────────────┐
│ Kubernetes 1.28.5 (k3s or RKE2)                             │
├─────────────────┬──────────────────┬────────────────────────┤
│ Control Plane   │ Worker Node 1    │ Worker Node 2          │
│ (GB10 master)   │ (GB10 + GPU)     │ (GB10 + GPU)           │
│                 │                  │                        │
│ - API Server    │ - kubelet        │ - kubelet              │
│ - etcd          │ - containerd     │ - containerd           │
│ - Controller    │ - GPU Operator   │ - GPU Operator         │
│                 │ - NIM Operator   │ - NIM Operator         │
└─────────────────┴──────────────────┴────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────┐
│ Industrial Ethernet Switch (e.g., Siemens Scalance)         │
│ - Time-Sensitive Networking (TSN) for <10ms sensor latency  │
│ - VLAN segmentation (mgmt, compute, data)                   │
└─────────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────┐
│ iPCMax DIN-rail Gateways (Protocol Bridge)                  │
│ - Modbus RTU/TCP, CAN, IO-Link → MQTT/OPC UA               │
└─────────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────┐
│ Industrial Field Sensors                                    │
│ (Vibration, Temperature, Pressure, Energy Meters)           │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Four-Phase Rollout Schedule

### Phase 1: Single-Node k3s Validation (Weeks 1–3, ~2 FTE weeks)

**Goal:** Proof-of-concept k3s deployment on DGX Spark; GPU Operator and NIM integration.

**Deliverables:**

- k3s 1.28.5 installed on DGX Spark (master + worker single node)
- GPU Operator 26.3.3 helm chart deployed; GPU detected and available to pods
- NIM Operator 3.1.2 running Nemotron inference workload
- Network Operator 26.4.1 basic networking (no DPU yet)
- Basic monitoring: kube-state-metrics, kubelet metrics exposed
- Air-gap validation: all images pre-pulled from NGC, offline deployment tested

**Helm Charts & Values:**

```yaml
# GPU Operator values.yaml
nvidia:
  driver:
    version: 580.178.04
  operator:
    defaultRuntime: containerd
    gds:
      enabled: false
    gdrcopy:
      enabled: false
    nvidiaContainerRuntime:
      enabled: true
nvidia-device-plugin:
  enabled: true
  replicas: 1
  timeSlicing:
    enabled: true
    replicas: 4 # 4x time-slicing on GB10 unified memory (not vGPU)
```

```yaml
# NIM Operator values.yaml
nim:
  models:
    - name: nemotron-3-super
      imageID: nv-nemotron-3-super
      containerPort: 8000
      replicas: 1
  resources:
    requests:
      nvidia.com/gpu: 1
    limits:
      nvidia.com/gpu: 1
```

**Success Criteria:**

- `kubectl get nodes` shows 1 ready node
- `nvidia-smi` inside pod returns GPU 0 (1–4 time-sliced replicas)
- NIM pod inference latency <2s for Nemotron-3-Super
- All pods in `Running` state; no errors in logs

**Test Workload:**

```bash
kubectl run test-gpu \
  --image=nvcr.io/nvidia/cuda:12.4.0-runtime-ubuntu24.04 \
  --overrides='{"spec":{"containers":[{"name":"test-gpu","resources":{"limits":{"nvidia.com/gpu":"1"}}}]}}'
# Inside pod: nvidia-smi should show GPU 0
```

---

### Phase 2: HA 3-Node k3s Cluster (Weeks 4–6, ~3 FTE weeks)

**Goal:** Production-ready HA cluster with MetalLB VIP, persistent storage (Longhorn), and workload distribution.

**New Components:**

- MetalLB 0.14.x for LoadBalancer services (VIP 10.0.0.1 for demo, customer sets CIDR)
- Longhorn 1.6.x for distributed block storage (3-node replication)
- kube-state-metrics + Prometheus scraping
- CoreDNS (implicit in k3s HA)

**Cluster Topology:**

- 1 k3s-server (control plane + etcd, workload-capable)
- 2 k3s-agents (workers, GPU-enabled)

**Deployment Script Fragment:**

```bash
#!/bin/bash

# Node 1 (master, static IP 192.168.1.100)
curl -sfL https://get.k3s.io | \
  K3S_TOKEN=dws6-phase2 \
  K3S_VERSION=v1.28.5+k3s1 \
  sh -s - server \
    --cluster-init \
    --write-kubeconfig-mode 0644 \
    --disable traefik \
    --disable local-storage

# Nodes 2–3 (workers, IPs 192.168.1.101, 192.168.1.102)
curl -sfL https://get.k3s.io | \
  K3S_TOKEN=dws6-phase2 \
  K3S_URL=https://192.168.1.100:6443 \
  K3S_VERSION=v1.28.5+k3s1 \
  sh -s - agent

# Install MetalLB
helm repo add metallb https://metallb.universe.tf
helm install metallb metallb/metallb \
  -n metallb-system --create-namespace \
  --set controller.replicas=2 \
  --set speaker.enabled=true

# MetalLB IP pool (customer adjusts CIDR)
cat <<EOF | kubectl apply -f -
apiVersion: metallb.io/v1beta1
kind: IPAddressPool
metadata:
  name: default
  namespace: metallb-system
spec:
  addresses:
  - 10.0.0.1-10.0.0.100
---
apiVersion: metallb.io/v1beta1
kind: L2Advertisement
metadata:
  name: default
  namespace: metallb-system
spec:
  ipAddressPools:
  - default
EOF

# Install Longhorn
helm repo add longhorn https://charts.longhorn.io
helm install longhorn longhorn/longhorn \
  -n longhorn-system --create-namespace \
  --set persistence.defaultClass=true \
  --set persistence.defaultClassReplicaCount=3
```

**NIM Auto-Scaling Example:**

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: nim-nemotron-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: nem-nemotron
  minReplicas: 1
  maxReplicas: 3
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

**Success Criteria:**

- 3 nodes ready: 1 control plane + 2 workers
- MetalLB VIP pingable from external network
- Longhorn replication status: 3/3 for all volumes
- NIM pod distributed across workers with affinity rules
- Prometheus scraping all 3 nodes' metrics

---

### Phase 3: Production Hardening (Weeks 7–9, ~2.5 FTE weeks)

**Additions:**

- kube-prometheus-stack (Prometheus, Grafana, Alertmanager)
- loki-stack (log aggregation, Loki + Promtail)
- Velero backup/restore (daily snapshots)
- RBAC policies per namespace (admin, developer, viewer roles)
- NetworkPolicy: deny-all + allow specific (E2E, ingress rules)
- Pod Security Standards (baseline enforcement)
- Readiness + liveness probes on all workloads

**Monitoring Stack Helm Install:**

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install kube-prometheus-stack prometheus-community/kube-prometheus-stack \
  -n monitoring --create-namespace \
  --set prometheus.prometheusSpec.retention=30d \
  --set grafana.adminPassword='${GRAFANA_ADMIN_PASSWORD}'

helm repo add grafana https://grafana.github.io/helm-charts
helm install loki grafana/loki-stack \
  -n logging --create-namespace \
  --set promtail.config.clients[0].url=http://loki:3100/loki/api/v1/push
```

**Velero Backup:**

```bash
helm repo add vmware-tanzu https://vmware-tanzu.github.io/helm-charts
helm install velero vmware-tanzu/velero \
  -n velero --create-namespace \
  --set backupStorageLocation.bucket=dws6-backups \
  --set schedules.daily.schedule="0 2 * * *"
```

**Success Criteria:**

- Prometheus + Grafana dashboards live (CPU, GPU memory, NIM latency)
- Loki queries pod logs across all 3 nodes
- Daily backup snapshots confirmed in S3/Longhorn
- RBAC audit: rbac.authorization.k8s.io events logged
- NetworkPolicy enforced; test communication allowed, denied by default

---

### Phase 4: Customer Delivery Preparation (Weeks 10–12, ~2 FTE weeks)

**Deliverables:**

- **Deployment Runbook:** OS setup → k3s install → GPU Operator → NIM → monitoring (90 min end-to-end)
- **Customer Runbook:** How to scale nodes, add GPU, update NIM models, interpret Grafana
- **Bill of Materials:** DGX Spark unit count, Industrial Ethernet Switch, iPCMax gateways, BlueField DPU (optional)
- **Pricing & SKUs:** T1/T2/T3/T4 tier selections, per-customer optional features
- **Handoff Document:** Monitoring dashboard access, on-call playbook, escalation contacts

---

## 3. Optional Customer Tiers (T0–T4)

All tiers assume DGX Spark (ARM64) as baseline. x86 variants (DGX Station, B200) adjust GPU Operator per architecture; vGPU not supported on ARM64 (see vGPU plan).

| Tier   | Name                    | Components                                              | Cost (Base DGX) | Timeline                          |
| ------ | ----------------------- | ------------------------------------------------------- | --------------- | --------------------------------- |
| **T0** | Docker Compose (no K8s) | Docker, NIM standalone, manual scaling                  | €0 (reference)  | Same-day (Docker only)            |
| **T1** | Single-Node k3s         | k3s, GPU Operator, NIM, basic monitoring                | +€1,500 setup   | 2 hours                           |
| **T2** | HA 3-Node Cluster       | 3× DGX, MetalLB, Longhorn, Prometheus, Loki             | +€4,500 setup   | 1 day (3 nodes)                   |
| **T3** | Government Ready (RKE2) | RKE2 on x86 mgmt + ARM64 workers, STIG/FIPS, audit      | +€7,500 setup   | 2 days (validation+hardening)     |
| **T4** | Full Stack + DPU        | T2 + BlueField DPU, DOCA services, SNAP (storage accel) | +€12,000 setup  | 3 days (DPU firmware+integration) |

**Optional Add-ons** (apply to any tier):

- **NIM Profile Selection** (Nemotron-3-Super 405B, Nemotron-Mini 8B, Qwen3-Coder): +€500/profile
- **DOCA Services** (Telemetry, Firefly, Argus, HBN, SNAP): T4 includes Essential; +€2,000 for Security, +€3,000 for Networking
- **Support SLA** (8×5 weekday support): +€2,000/year; 24×7 critical: +€6,000/year
- **Air-gap Bundle** (per release, offline image repo): +€1,500/release
- **Government Ready Annual Recertification** (STIG/FIPS): +€3,000/year

---

## 4. GPU Memory Management

### 4.1 GB10 Unified Memory Characteristics

DGX Spark GB10 (ARM64):

- **GPU Memory:** 192 GB unified (shared CPU+GPU)
- **vGPU Support:** ❌ Not supported (hardware limitation)
- **MIG (Multi-Instance GPU):** ❌ Not supported on GB10 (hardware limitation)
- **Time-Slicing:** ✅ Supported via GPU Operator (1x, 2x, 4x, 8x replicas)

### 4.2 Time-Slicing Configuration

**Replica profiles:**

- **1x (exclusive):** Full GPU, one pod at a time. Lowest latency, highest throughput.
- **2x (balanced):** 2 pods share GPU with context switching. ~50% latency overhead.
- **4x (standard):** 4 pods, ~75% latency overhead. Recommended for inference serving.
- **8x (dense):** 8 pods, high switching overhead. Only for lightweight workloads.

**Production setting for NIM inference on T2/T3 clusters: 4x (standard).**

---

## 5. Network Configuration

### 5.1 Industrial Ethernet Switch (TSN-capable)

Example: **Siemens Scalance XC200-4G**

- 4× Gigabit Ethernet ports (field devices, iPCMax gateways)
- 2× 10 Gigabit uplink (DGX Spark cluster, redundant)
- Time-Sensitive Networking (TSN) profiles (IEC 62439)
- VLAN support, QoS queuing

**Network Segmentation (Recommended):**
| VLAN | Subnet | Devices | QoS Priority |
|------|--------|---------|-----|
| 10 (mgmt) | 192.168.1.0/24 | k3s control plane, Prometheus, SSH | Best effort |
| 20 (compute) | 10.0.0.0/24 | NIM pods, GPU Operator, MetalLB VIP | High (6) |
| 30 (data) | 172.16.0.0/24 | iPCMax gateways, field sensors | Highest (7, time-critical) |

### 5.2 Pod-to-Field Data Flow

```
Field Sensor (e.g., vibration 4–20 mA)
       ↓
iPCMax DIN-rail Gateway (Modbus RTU → MQTT)
       ↓
Industrial Switch (VLAN 30, TSN scheduling)
       ↓
Kubernetes Service (type: LoadBalancer, VIP)
       ↓
NIM Operator Pod (inference Nemotron model)
       ↓
Result (anomaly flag, confidence score)
       ↓
Back to iPCMax → customer dashboard / alert system
```

**Latency Budget (Target: <20ms sensor-to-response):**

- Sensor → iPCMax conversion: 2 ms (Modbus RTU over industrial switch)
- iPCMax → MQTT broker: 1 ms (local network)
- MQTT → NIM pod subscription: 1 ms
- NIM inference: 10 ms (Nemotron-3-Super GPU forward pass)
- NIM → result → iPCMax: 2 ms
- **Total: ~16 ms** ✅ Within 20 ms budget

---

## 6. Kubernetes Operators & Versions (v6.2 Baseline)

| Operator         | Version | Status | Supported Platforms                                        |
| ---------------- | ------- | ------ | ---------------------------------------------------------- |
| GPU Operator     | 26.3.3  | GA     | x86, ARM64 (both non-Gov Ready; Gov Ready x86 only in 7.8) |
| NIM Operator     | 3.1.2   | GA     | x86, ARM64                                                 |
| Network Operator | 26.4.1  | GA     | x86, ARM64                                                 |
| DPU Operator     | 26.4.0  | GA     | x86, ARM64 (requires BlueField hardware)                   |

All operators are NVIDIA AI Enterprise Infra 7.8 certified.

---

## 7. Testing & Validation Checklist

**Pre-Deployment (T1):**

- [ ] DGX Spark powered on, OS verified (Ubuntu 24.04 or similar)
- [ ] Network connectivity tested (ping all 3 nodes, if HA)
- [ ] Air-gap images pre-pulled (if offline environment)
- [ ] Storage capacity verified (Longhorn requires 50 GB/node minimum)

**Deployment (T1):**

- [ ] k3s install completes without errors
- [ ] `kubectl get nodes` shows all nodes `Ready`
- [ ] GPU Operator pod deployment succeeds
- [ ] NIM pod reaches `Running` state

**Post-Deployment (T1+):**

- [ ] `nvidia-smi` inside NIM pod shows GPU 0
- [ ] NIM inference <2s cold start, <500ms warm
- [ ] Prometheus scraping metrics from all nodes
- [ ] Grafana dashboard loads and displays GPU memory, pod CPU/memory
- [ ] Test workload: Send 10 requests to NIM endpoint, measure latency and throughput

**Scale-Out (T2):**

- [ ] Add 2 worker nodes using Phase 2 scripts
- [ ] All 3 nodes sync etcd and reach `Ready` state
- [ ] MetalLB VIP assigned and reachable
- [ ] Longhorn replication status 3/3 for all PVCs
- [ ] HPA scales NIM replicas as CPU exceeds 70%

---

## 8. Rollback & Recovery

**Single-Node Rollback (T1):**

```bash
# If k3s becomes unstable, remove and reinstall:
/usr/local/bin/k3s-uninstall.sh
curl -sfL https://get.k3s.io | sh -
```

**HA Cluster Recovery (T2/T3):**

- **If 1 worker fails:** Longhorn automatically rebalances replicas to other nodes.
- **If control plane fails:** Use Velero to restore etcd from daily backup.
- **If all nodes lost:** Restore from Velero backup to new hardware (48h RTOs typical).

---

## 9. Known Limitations & Workarounds

| Issue                  | Limitation                               | Workaround                                                                            |
| ---------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------- |
| vGPU on ARM64          | Not hardware-supported (GB10 limitation) | Use 4x time-slicing; scale nodes for multi-tenant                                     |
| Gov Ready ARM64 GPU Op | Infra 7.8 x86-only; ARM64 in 8.x         | Use x86 management node for GPU Operator Gov Ready; ARM64 workers for NIM/Network ops |
| MIG on GB10            | Not hardware-supported                   | Not applicable; GB10 unified memory not suitable for MIG                              |
| Air-gap image pull     | NGC requires auth token even offline     | Pre-pull images during setup; store locally in registry mirror                        |

---

## 10. Success Metrics (Target)

- **Deployment Time (T1):** <2 hours single-node k3s + GPU Operator + NIM
- **Deployment Time (T2):** <1 day for 3-node HA cluster + MetalLB + Longhorn
- **NIM Cold-Start Latency:** <2 seconds (Nemotron-3-Super)
- **NIM Warm Latency:** <500 ms
- **GPU Utilization (Steady State):** >70% for production workloads
- **Uptime SLA (T2/T3):** 99.5% (max 3.6 hours downtime/month)
- **Monitoring Dashboard Availability:** 99% (Prometheus + Grafana)
- **Backup RTO:** <48 hours from Velero snapshot

---

## 11. Next Steps

1. **Week 1 (Phase 1 kick-off):** Assign DWS engineer; set up DGX Spark test hardware.
2. **Week 3 (Phase 1 complete):** GPU Operator + NIM validated; present results to HIC.
3. **Week 6 (Phase 2 complete):** HA cluster and MetalLB tested; readiness for customer T2 deployments.
4. **Week 9 (Phase 3 complete):** Monitoring stack live; Velero backups validated.
5. **Week 12 (Phase 4 complete):** Runbooks finalized; first customer T1/T2 pilot commences.

---

**References:**

- NVIDIA AI Enterprise Infra 7.8: https://docs.nvidia.com/ai-enterprise/
- k3s: https://docs.k3s.io/
- RKE2: https://docs.rke2.io/
- GPU Operator Helm Chart: https://github.com/NVIDIA/gpu-operator/tree/master/deployments/gpu-operator
- MetalLB: https://metallb.universe.tf/
- Longhorn: https://longhorn.io/docs/

---

**Prepared by:** Claude Code (Haiku 4.5)  
**Session:** claude/ipcmax-serdex-evaluation-orp38x  
**Status:** DRAFT v1.0 (ready for Phase 1 HIC review)

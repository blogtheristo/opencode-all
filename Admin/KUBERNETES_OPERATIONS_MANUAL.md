# Kubernetes Operations Manual — DWS IQ Sovereign Edge

**Version:** 1.0
**Effective:** 2026-08-30
**Owner:** Platform Team, Lifetime Oy
**Classification:** Internal — Operational Runbook

---

## 1. Overview

This manual covers day-to-day operations for DWS IQ Kubernetes clusters running on NVIDIA DGX Spark / Acer Veriton GN100 hardware (ARM64 Grace Blackwell GB10). It applies to orchestration tiers T1–T4 as defined in `docs/plans/KUBERNETES_IMPLEMENTATION_PLAN.md`.

### 1.1 Scope

| Tier | Distribution | Nodes | Use Case |
|------|--------------|-------|----------|
| **T1** | k3s single-node | 1 | Single DGX, K8s API, future scale |
| **T2** | k3s HA (embedded etcd) | 3 | Production HA, multi-node NIM scaling |
| **T3** | RKE2 Gov Ready | 3+ (x86 mgmt) | Defence/regulated, FIPS 140-3, STIG |
| **T4** | T3 + DPU Operator + DOCA | 3+ | Large-scale, BlueField-3, north-south |

### 1.2 Key References

- Implementation Plan: `docs/plans/KUBERNETES_IMPLEMENTATION_PLAN.md`
- Version Compatibility: `docs/plans/DWS_VERSION_COMPATIBILITY_TABLE.md`
- Themis Impact: `docs/plans/THEMIS_CONTROL_PLANE_IMPACT.md`
- Product SKUs: `dws10.com/config/products.json` (LF-K8S-T1 through LF-K8S-T4)

---

## 2. Cluster Architecture

### 2.1 T1 — Single-Node k3s (Control Room / DGX Spark)

```
┌─────────────────────────────────────────────────────────────┐
│                    DGX Spark (ARM64 GB10)                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ k3s Server (Control Plane + Worker)                 │    │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │    │
│  │  │ GPU Op  │ │ NIM Op  │ │ DWS Bknd │ │ DWS Cron │   │    │
│  │  │ 26.3.3  │ │ 3.1.2   │ │  (Pod)   │ │ (CronJob)│   │    │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘   │    │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐               │    │
│  │  │ Supabase│ │  Redis  │ │ Aspire  │               │    │
│  │  │ (Stateful│ │ (Stateful│ │ Dashboard│              │    │
│  │  │  Set)   │ │  Set)   │ │ (Svc)   │               │    │
│  │  └─────────┘ └─────────┘ └─────────┘               │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 T2 — 3-Node HA k3s (Situation Room / Multi-DGX)

```
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│ DGX #1       │   │ DGX #2       │   │ DGX #3       │
│ k3s Server   │   │ k3s Agent    │   │ k3s Agent    │
│ + Worker     │   │ (Worker)     │   │ (Worker)     │
│ etcd leader  │   │ etcd follower│   │ etcd follower│
└──────┬───────┘   └──────┬───────┘   └──────┬───────┘
       │                  │                  │
       └──────────────────┼──────────────────┘
                          ▼
              ┌───────────────────────┐
              │   MetalLB (L2)        │
              │   NGINX Ingress       │
              │   Longhorn (RWX)      │
              └───────────────────────┘
```

### 2.3 T3 — RKE2 Gov Ready (x86 Management + ARM64 Workers)

```
┌─────────────────────────────────────────────────────────────┐
│              x86 Management Node (Gov Ready)                │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ RKE2 Server (FIPS, STIG, CIS-1.23)                  │    │
│  │  GPU Operator Gov Ready (x86)                       │    │
│  │  Network Operator Gov Ready                         │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              ARM64 Worker Nodes (DGX Spark / GN100)         │
│  RKE2 Agent (Standard GPU Operator, NIM Operator Gov Ready) │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Installation & Bootstrap

### 3.1 Prerequisites

| Item | T1 | T2 | T3 | T4 |
|------|----|----|----|----|
| DGX Spark / GN100 hardware | 1 | 3 | 3+ | 3+ |
| x86 management node | — | — | ✅ | ✅ |
| BlueField-3 DPU per node | — | — | — | ✅ |
| NVIDIA AI Enterprise subscription | 1 GPU | 3 GPU | 3+ GPU | 3+ GPU |
| Ubuntu 24.04 LTS (STIG for T3/T4) | ✅ | ✅ | ✅ | ✅ |
| Internet access (or air-gap bundle) | ✅ | ✅ | ✅ | ✅ |

### 3.2 Bootstrap Scripts

All installation is automated via scripts in `infrastructure/kubernetes/`:

```bash
# T1: Single-node k3s on DGX Spark
sudo bash infrastructure/kubernetes/k3s-install.sh \
  --tier T1 \
  --gpu-operator-version 26.3.3 \
  --nim-operator-version 3.1.2

# T2: 3-node HA k3s
sudo bash infrastructure/kubernetes/k3s-ha-setup.sh \
  --control-plane gn100-01 \
  --workers gn100-02,gn100-03 \
  --storage longhorn \
  --ingress nginx

# T3: RKE2 Gov Ready (run on x86 mgmt node)
sudo bash infrastructure/kubernetes/rke2-gov-setup.sh \
  --mgmt-node mgmt-01 \
  --workers gn100-01,gn100-02,gn100-03 \
  --fips --stig

# T4: Full stack (run after T3)
sudo bash infrastructure/kubernetes/deploy-full-stack.sh \
  --dpf-operator-version 26.4.0 \
  --doca-version 3.4.0 \
  --bcm-version 11.33.1 \
  --runai-version 2.26
```

### 3.3 Post-Install Validation

```bash
# Run validation script
bash scripts/k8s-validate.sh --tier T2

# Expected checks:
# ✅ k3s/RKE2 cluster healthy
# ✅ GPU Operator: 1 GPU per node detected (GB10)
# ✅ NIM Operator: Starter profile deployed
# ✅ Network Operator: CNI ready (T2+)
# ✅ DPU Operator: BlueField-3 detected (T4)
# ✅ Supabase: StatefulSet ready, pgvector enabled
# ✅ DWS Backend: Deployment healthy, MCP Gateway reachable
# ✅ Monitoring: Prometheus scraping DCGM metrics
# ✅ Logging: Loki collecting pod logs
# ✅ Themis: ClusterRegistry CRD registered
```

---

## 4. Day-to-Day Operations

### 4.1 Cluster Health Checks

| Check | Frequency | Command | Alert Threshold |
|-------|-----------|---------|-----------------|
| Node Ready | 5 min | `kubectl get nodes` | Any NotReady > 2 min |
| GPU Operator | 15 min | `kubectl get gpu -A` | GPU not allocated > 10 min |
| NIM Services | 15 min | `kubectl get nimservices -A` | Any not Running > 5 min |
| Supabase | 5 min | `kubectl exec supabase-db -- pg_isready` | Connection failed |
| DWS Backend | 1 min | `curl -sf http://backend:8080/health` | HTTP != 200 |
| Disk Space | 1 hr | `df -h /var/lib/longhorn` | > 80% used |
| Memory Pressure | 15 min | `kubectl top nodes` | > 85% allocatable |
| Certificate Expiry | Daily | `kubeadm certs check-expiration` | < 30 days |

### 4.2 Common Operational Tasks

#### Add Worker Node (T2/T3/T4)

```bash
# On new DGX node:
sudo bash infrastructure/kubernetes/k3s-join.sh \
  --server https://control-plane:6443 \
  --token $(cat /var/lib/rancher/k3s/server/node-token)

# Verify
kubectl get nodes -o wide
kubectl label node <new-node> nvidia.com/gpu.present=true
```

#### Remove Worker Node (Graceful Drain)

```bash
# Cordon and drain
kubectl cordon <node-name>
kubectl drain <node-name> --ignore-daemonsets --delete-emptydir-data

# Remove from cluster (T2)
kubectl delete node <node-name>
# On node: sudo k3s-agent-uninstall.sh

# Remove from cluster (T3/T4)
kubectl delete node <node-name>
# On node: sudo rke2-uninstall.sh
```

#### Update NIM Profile

```bash
# Switch to Retrieval profile
kubectl apply -f - <<EOF
apiVersion: apps.nvidia.com/v1alpha1
kind: NIMCache
metadata:
  name: retrieval-cache
  namespace: nim-operator
spec:
  models:
    - name: bge-m3
    - name: bge-large-zh-v1.5
    - name: nemo-retriever-paddleocr
EOF

# Verify
kubectl get nimcache -n nim-operator
kubectl get nimservices -n nim-operator
```

#### GPU Time-Slicing Reconfiguration

```bash
# Edit GPU Operator ConfigMap
kubectl edit configmap gpu-operator-config -n gpu-operator

# Update devicePlugin.config:
# devices:
#   - name: gb10
#     replicas: 2  # Change from 4 to 2 for heavier workloads

# Restart device plugin pods
kubectl rollout restart daemonset/nvidia-device-plugin-daemonset -n gpu-operator
```

---

## 5. NVIDIA Operator Management

### 5.1 Version Compatibility Matrix

| DWS Version | GPU Operator | NIM Operator | Network Operator | DPU Operator | GPU Driver |
|-------------|--------------|--------------|------------------|--------------|------------|
| **6.2** (Infra 7.8) | 26.3.3 | 3.1.2 | 26.4.1 | 26.4.0 | 580.178.04 |
| **6.3** (Infra 8.x) | 26.3.3+ | 3.2+ | 26.4.1+ | 26.4.0+ | 595.x |

### 5.2 Operator Upgrade Procedure

```bash
# 1. Pre-flight checks
bash scripts/k8s-pre-upgrade-check.sh --from 7.8 --to 8.0

# 2. Backup cluster state
bash scripts/k8s-backup.sh --destination s3://dws-backups/k8s-$(date +%Y%m%d)

# 3. Upgrade GPU Operator (Helm)
helm upgrade gpu-operator nvidia/gpu-operator \
  --namespace gpu-operator \
  --version 26.3.3 \
  -f infrastructure/kubernetes/helm-values/gpu-operator-dgx-spark.yaml

# 4. Upgrade NIM Operator
helm upgrade nim-operator nvidia/k8s-nim-operator \
  --namespace nim-operator \
  --version 3.1.2 \
  -f infrastructure/kubernetes/helm-values/nim-operator-dgx-spark.yaml

# 5. Upgrade Network Operator (T2+)
helm upgrade network-operator nvidia/network-operator \
  --namespace network-operator \
  --version 26.4.1

# 6. Upgrade DPU Operator (T4)
helm upgrade dpf-operator nvidia/dpf-operator \
  --namespace dpf-operator \
  --version 26.4.0

# 6. Post-upgrade validation
bash scripts/k8s-validate.sh --tier T2
```

### 5.3 GPU Driver Update (Host-Level)

```bash
# On each DGX node:
# 1. Drain node
kubectl cordon <node>
kubectl drain <node> --ignore-daemonsets --delete-emptydir-data

# 2. Update driver (host)
sudo apt update && sudo apt install nvidia-driver-580.178.04

# 3. Reboot
sudo reboot

# 3. Uncordon
kubectl uncordon <node>

# 4. Validate
kubectl get nodes -o wide | grep <node>
nvidia-smi  # Verify driver version
```

---

## 6. DOCA Microservices Operations (T2+)

### 6.1 Service Status

```bash
# Check DOCA services on BlueField DPU
ssh root@<dpu-ip> "crictl ps | grep doca"

# Expected services (Essential package):
# - doca-telemetry
# - doca-firefly
# - doca-blueman

# Security package (T3+):
# - doca-argus
# - doca-flow-inspector

# Network+Storage (T4):
# - doca-hbn
# - doca-snap
# - ovs-doca
```

### 6.2 DOCA Service Restart

```bash
# On DPU:
sudo systemctl restart kubelet  # Restarts all kubelet-managed pods

# Or restart specific service:
sudo crictl stop <container-id>
sudo crictl rm <container-id>
# Kubelet will recreate from YAML in /etc/kubelet.d/
```

### 6.3 Telemetry Validation

```bash
# Verify Prometheus scraping
curl -s http://prometheus:9090/api/v1/targets | jq '.data.activeTargets[] | select(.labels.job=="doca-telemetry")'

# Check metrics in Aspire Dashboard
open http://dgx-spark:18888  # Navigate to Metrics → doca_*
```

---

## 6. Government Ready Operations (T3/T4)

### 6.1 Quarterly STIG Scan

```bash
# Run OpenSCAP scan on all nodes
bash scripts/gov-ready-stig-scan.sh --all-nodes

# Expected output:
# - HTML report: stig-report-$(date +%Y%m%d).html
# - XML results: stig-results-$(date +%Y%m%d).xml
# - Pass rate: > 95% (remediate failures within 7 days)
```

### 6.2 FIPS Validation

```bash
# Verify FIPS mode on all nodes
kubectl get nodes -o jsonpath='{.items[*].status.nodeInfo.osImage}' | tr ' ' '\n' | while read node; do
  ssh $node "cat /proc/sys/crypto/fips_enabled"
done
# All must return "1"

# Verify crypto modules
kubectl exec -n gpu-operator <gpu-operator-pod> -- fipscheck --verify
```

### 6.3 Evidence Package Refresh

```bash
# Generate quarterly evidence package
bash scripts/gov-ready-evidence-package.sh --cluster <cluster-id>

# Package includes:
# - STIG scan reports (HTML + XML)
# - FIPS 140-3 module certificates
# - SPDX 2.3 SBOM for all Gov Ready containers
# - Trivy vulnerability scans (SARIF)
# - Signed deployment attestation
# - Article 12 audit trail export
```

---

## 7. Backup & Disaster Recovery

### 7.1 Backup Schedule

| Component | Frequency | Retention | Destination |
|-----------|-----------|-----------|-------------|
| etcd (T2/T3/T4) | 6 hours | 30 days | S3 (encrypted) |
| Longhorn volumes | Daily | 90 days | S3 (encrypted) |
| Supabase (PostgreSQL) | Daily | 90 days | S3 (encrypted) |
| Themis ClusterRegistry | On change | 365 days | Git + S3 |
| DOCA configs | On change | 365 days | Git |

### 7.2 Restore Procedures

#### etcd Restore (T2/T3/T4)

```bash
# 1. Stop k3s/RKE2 on all control plane nodes
sudo systemctl stop k3s  # or rke2-server

# 2. Restore etcd snapshot
sudo etcdctl snapshot restore /backup/etcd-snapshot-<timestamp>.db \
  --name <node-name> \
  --initial-cluster <cluster-def> \
  --initial-cluster-token <token> \
  --initial-advertise-peer-urls https://<ip>:2380

# 3. Start k3s/RKE2
sudo systemctl start k3s

# 4. Verify
kubectl get nodes
kubectl get pods -A
```

#### Full Cluster DR (RTO: 4 hours, RPO: 6 hours)

```bash
# 1. Provision new hardware (DGX nodes + x86 mgmt for T3/T4)
# 2. Run bootstrap scripts (Section 3.2)
# 3. Restore etcd from latest snapshot
# 4. Restore Longhorn volumes
# 5. Restore Supabase from pg_dump
# 6. Restore Themis ClusterRegistry from Git
# 7. Validate all health checks (Section 4.1)
# 8. Update DNS/MetalLB IPs if changed
```

---

## 8. Monitoring & Alerting

### 8.1 Key Dashboards

| Dashboard | URL | Purpose |
|-----------|-----|---------|
| **Aspire Dashboard** | `http://dgx-spark:18888` | Traces, metrics, logs, service map |
| **Grafana** | `http://grafana:3000` | Cluster, GPU, NIM, DOCA dashboards |
| **Longhorn UI** | `http://longhorn:8000` | Volume health, backup status |
| **Supabase Studio** | `http://supabase-studio:3000` | Database admin (localhost only) |

### 8.2 Critical Alerts (PagerDuty / Email)

| Alert | Condition | Severity | Runbook |
|-------|-----------|----------|---------|
| NodeNotReady | Node NotReady > 2 min | Critical | `runbooks/node-not-ready.md` |
| GPUOperatorDegraded | GPU Operator pods not Running | Critical | `runbooks/gpu-operator-degraded.md` |
| NIMServicesDown | > 1 NIM service not Ready | High | `runbooks/nim-services-down.md` |
| SupabaseUnhealthy | pg_isready fails | Critical | `runbooks/supabase-unhealthy.md` |
| DiskSpaceCritical | > 85% Longhorn usage | High | `runbooks/disk-space-critical.md` |
| CertExpiringSoon | < 30 days | Warning | `runbooks/cert-expiring.md` |
| STIGScanFailed | Quarterly scan < 95% pass | High | `runbooks/stig-scan-failed.md` |
| FIPSModeDisabled | fips_enabled != 1 | Critical | `runbooks/fips-disabled.md` |

---

## 9. Security Operations

### 9.1 Image Security

```bash
# Verify all images signed (cosign)
cosign verify --key <pubkey> nvcr.io/nvidia/gpu-operator:26.3.3

# Scan for vulnerabilities (Trivy)
trivy image --severity HIGH,CRITICAL nvcr.io/nvidia/gpu-operator:26.3.3
```

### 9.2 Network Policies

```bash
# Apply default deny-all, then allow required
kubectl apply -f infrastructure/kubernetes/security/network-policies.yaml

# Key policies:
# - DWS Backend ↔ Supabase (port 5432)
# - DWS Backend ↔ Redis (port 6379)
# - NIM Services ↔ Model Cache (PVC)
# - DOCA Telemetry → Prometheus (port 9090)
# - Aspire Dashboard ingress only
```

### 9.3 Secret Rotation

| Secret | Rotation | Method |
|--------|----------|--------|
| Supabase JWT | 90 days | `scripts/rotate-supabase-jwt.sh` |
| NVAIE NGC API Key | 365 days | Update in NGC, restart operator pods |
| DOCA Service Certs | 90 days | `scripts/rotate-doca-certs.sh` |
| Themis KYA Signing Key | 7 days (T0-T2), 1 day (T3/T4) | Auto-rotated by Themis |

---

## 10. Troubleshooting Quick Reference

| Symptom | Likely Cause | Resolution |
|---------|--------------|------------|
| GPU not detected by GPU Operator | Driver version mismatch | Update host driver to 580.178.04, restart GPU Operator |
| NIM Service stuck Pending | Insufficient GPU memory | Reduce replicas, switch to smaller NIM profile, add node |
| Supabase StatefulSet not Ready | PVC not bound | Check Longhorn volume status, ensure RWX storageclass |
| MetalLB IP not assigned | L2 mode, no free IPs | Expand MetalLB address pool, check speaker pods |
| Longhorn volume detached | Node reboot, disk pressure | `kubectl delete pod -n longhorn-system <volume-controller>` |
| DOCA Telemetry not scraping | DPU network unreachable | Check DPU IP, VLAN, kubelet YAML in `/etc/kubelet.d/` |
| FIPS mode disabled after reboot | Kernel cmdline missing `fips=1` | Add `fips=1` to GRUB, rebuild initramfs, reboot |
| Themis ClusterRegistry not synced | Themis pod crash | Check Themis logs, restart Themis deployment |

---

## 11. Escalation Contacts

| Role | Name | Contact | Escalation Level |
|------|------|---------|------------------|
| Platform Lead | — | platform-lead@lifetime.fi | L1 |
| Kubernetes Admin | — | k8s-admin@lifetime.fi | L2 |
| NVIDIA Enterprise Support | — | enterprise-support@nvidia.com | L3 (NVAIE sub) |
| Acer GN100 Hardware | — | acer-support@serdex.fi | L3 (hardware) |
| iPCMax Hardware | — | kalle@ipcmax.com | L3 (gateways) |
| Beckhoff Support | — | support@beckhoff.fi | L3 (TwinCAT/EtherCAT) |
| Siemens Support | — | siemens-support@siemens.fi | L3 (S7/PROFINET) |
| ABB/Asennustuotteet | — | asennustuotteet@asennustuotteet.fi | L3 (KNX/BACnet) |

---

## 12. Change Log

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| 2026-08-30 | 1.0 | Platform Team | Initial creation from Infra 7.8 operationalization |

---

## Appendix A: Useful Commands Cheat Sheet

```bash
# Cluster info
kubectl cluster-info
kubectl get nodes -o wide
kubectl version --short

# GPU Operator
kubectl get gpu -A
kubectl get nvidiaruntime -A
kubectl logs -n gpu-operator -l app=gpu-operator

# NIM Operator
kubectl get nimcache,nimservices,nimpipelines -A
kubectl logs -n nim-operator -l app=nim-operator

# Network Operator (T2+)
kubectl get network -A
kubectl logs -n network-operator -l app=network-operator

# DPU Operator (T4)
kubectl get dpu -A
kubectl logs -n dpf-operator -l app=dpf-operator

# DOCA Services (on DPU)
ssh root@<dpu> "crictl ps | grep doca"
ssh root@<dpu> "journalctl -u kubelet -f"

# Monitoring
kubectl top nodes
kubectl top pods -A --sort-by=memory
kubectl get events --sort-by=.metadata.creationTimestamp

# Themis
kubectl get clusterregistry -A
kubectl get deploymentcontract -A
kubectl logs -n themis -l app=themis
```

---

**End of Manual**

*This manual is a living document. Update on every cluster change, operator upgrade, or procedural improvement. Source of truth: `Admin/KUBERNETES_OPERATIONS_MANUAL.md` in the dws6 repository.*
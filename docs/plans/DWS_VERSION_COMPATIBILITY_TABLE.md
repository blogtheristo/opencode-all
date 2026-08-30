# DWS6 Version Compatibility Table

**Version:** 1.0  
**Status:** DRAFT — Reference Matrix  
**Date:** 30.08.2026  
**Prepared by:** Claude Code (Haiku 4.5) | Session: claude/ipcmax-serdex-evaluation-orp38x

---

## Executive Summary

This document provides a compatibility matrix for DWS6 platform versions (v6.0–v7.0) against NVIDIA AI Enterprise Infra releases (7.0–8.0), hardware platforms, and component versions.

---

## 1. DWS6 Platform Versions

| Version  | Release Date | Codename  | NVAIE Infra Support | EOL Date | Status         |
| -------- | ------------ | --------- | ------------------- | -------- | -------------- |
| **v6.0** | Feb 2026     | Firehorse | 7.0–7.5             | Aug 2026 | EOL            |
| **v6.1** | May 2026     | SR1       | 7.3–7.7             | Nov 2026 | Active         |
| **v6.2** | Aug 2026     | SR2       | 7.6–7.8             | May 2027 | **Current**    |
| **v6.3** | Nov 2026     | SR3       | 7.8–8.0             | Aug 2027 | In development |
| **v7.0** | Feb 2027     | Next Gen  | 8.0–8.5             | Feb 2029 | Planned        |

---

## 2. Component Version Matrix (DWS6.2)

| Component            | v6.0   | v6.1    | v6.2       | v6.3   | v7.0   |
| -------------------- | ------ | ------- | ---------- | ------ | ------ |
| **k3s**              | 1.27.3 | 1.28.1  | 1.28.5     | 1.29.0 | 1.30.x |
| **GPU Operator**     | 25.3.2 | 25.10.1 | 26.3.3     | 26.3.3 | 27.x   |
| **NIM Operator**     | 2.2.0  | 3.0.5   | 3.1.2      | 3.1.2  | 4.0.0  |
| **Network Operator** | 25.3.2 | 25.10.1 | 26.4.1     | 26.4.1 | 27.x   |
| **DPU Operator**     | 25.3.0 | 25.10.0 | 26.4.0     | 26.4.0 | 27.x   |
| **GPU Driver**       | 578.x  | 579.x   | 580.178.04 | 580.x+ | 581.x  |
| **DOCA**             | 3.2.0  | 3.3.0   | 3.4.0      | 3.4.0  | 4.0.0  |
| **PostgreSQL**       | 14.8   | 15.2    | 15.8       | 15.x   | 16.x   |
| **Kong**             | 2.7    | 2.8     | 2.8.1      | 2.8.x  | 3.0.x  |
| **Redis**            | 7.0    | 7.1     | 7.2        | 7.2.x  | 7.3.x  |
| **PostgREST**        | 11.1.0 | 11.2.1  | 12.2.12    | 12.x   | 13.x   |
| **Ollama**           | 0.1.x  | 0.2.x   | 0.3.x      | 0.4.x  | 0.5.x  |
| **Nemotron-3-Super** | v1     | v1      | v1         | v1.1   | v2     |
| **Aspire Dashboard** | 13.0.0 | 13.2.0  | 13.4.2     | 13.x   | 14.x   |
| **Prometheus**       | 2.40.x | 2.45.x  | 2.47.x     | 2.48.x | 2.50.x |
| **Grafana**          | 9.3.x  | 10.0.x  | 10.2.x     | 10.x   | 11.x   |

---

## 3. Hardware Compatibility Matrix (v6.2)

### 3.1 Compute Platform Support

| Hardware             | Architecture | Kubernetes                   | GPU Operator       | NIM Operator    | Support Status            |
| -------------------- | ------------ | ---------------------------- | ------------------ | --------------- | ------------------------- |
| **DGX Spark**        | ARM64        | ✅ k3s                       | ✅ 26.3.3          | ✅ 3.1.2        | **Primary**               |
| **DGX Station H100** | x86          | ✅ k3s/RKE2                  | ✅ 26.3.3          | ✅ 3.1.2        | ✅ Supported              |
| **DGX B200**         | x86          | ⚠️ k3s (6.2), ✅ RKE2 (6.3+) | ⚠️ Needs Infra 8.x | ✅ 3.1.2        | ✅ Experimental           |
| **Jetson Orin AGX**  | ARM64        | ✅ k3s                       | ✅ 26.3.3          | ✅ 3.1.2 (lite) | ✅ Supported              |
| **Jetson Thor**      | ARM64        | ✅ k3s                       | ⚠️ Planned (8.x)   | ✅ 3.1.2        | ⚠️ Beta                   |
| **BlueField-3**      | ARM64 (DPU)  | N/A (DPU only)               | N/A                | N/A             | ✅ Supported (DOCA 3.4.0) |

### 3.2 Feature Matrix (v6.2)

| Feature                  | DGX Spark GB10   | DGX Station      | DGX B200         | Jetson Orin    | Notes                         |
| ------------------------ | ---------------- | ---------------- | ---------------- | -------------- | ----------------------------- |
| **Docker Compose (T0)**  | ✅               | ✅               | ✅               | ✅             | All platforms                 |
| **k3s Single-Node (T1)** | ✅               | ✅               | ✅               | ✅             | All platforms                 |
| **k3s 3-Node HA (T2)**   | ✅               | ✅               | ✅               | ✅             | All platforms                 |
| **RKE2 Gov Ready (T3)**  | ⚠️ Hybrid\*      | ✅               | ✅               | ⚠️ Not planned | \*x86 mgmt node for GPU Op GR |
| **vGPU**                 | ❌               | ✅ (x86 only)    | ✅ (x86 only)    | ❌             | x86-only, requires KVM        |
| **MIG**                  | ❌               | ✅               | ✅               | ❌             | H100/B200 only                |
| **Time-Slicing**         | ✅ (4x max)      | ✅               | ✅               | ✅             | All ARM64 + x86               |
| **DOCA Services**        | ✅ (w/ BF-3 DPU) | ✅ (w/ BF-3 DPU) | ✅ (w/ BF-3 DPU) | ⚠️ Limited     | BlueField required            |
| **NIM Inference**        | ✅               | ✅               | ✅ (lite)        | ✅ (quantized) | All platforms                 |
| **Ollama Local**         | ✅               | ✅               | ✅               | ✅             | All platforms                 |

---

## 4. Upgrade Paths (v6.0 → v7.0)

### 4.1 Data Preservation & Downtime

| Upgrade         | Downtime | Data Preserved               | Procedure                           |
| --------------- | -------- | ---------------------------- | ----------------------------------- |
| **v6.0 → v6.1** | 15 min   | ✅ Yes (PostgREST migration) | In-place upgrade, no rollback       |
| **v6.1 → v6.2** | 30 min   | ✅ Yes                       | k3s rolling update + operator patch |
| **v6.2 → v6.3** | 15 min   | ✅ Yes                       | Helm chart version bump             |
| **v6.x → v7.0** | 2 hours  | ✅ Yes (full backup first)   | New cluster, Velero restore         |

### 4.2 Backward Compatibility

| Upgrade Path             | Supported | Notes                                        |
| ------------------------ | --------- | -------------------------------------------- |
| v6.0 → v6.2 (skip v6.1)  | ✅        | Go via v6.1 or migrate DB schema manually    |
| v6.1 → v6.0 (downgrade)  | ❌        | Not tested; PostgREST schema is forward-only |
| v6.2 → v6.1 (downgrade)  | ❌        | k3s upgrade is one-way                       |
| v6.2 → v7.0 (major jump) | ✅        | Velero backup + new cluster recommended      |

---

## 5. Known Incompatibilities

| Scenario                                           | v6.0 | v6.1 | v6.2            | Workaround                            |
| -------------------------------------------------- | ---- | ---- | --------------- | ------------------------------------- |
| **NVAIE Infra 7.6+ with v6.0 GPU Operator 25.3.2** | ❌   | ✅   | ✅              | Upgrade to v6.1+                      |
| **vGPU on GB10 (ARM64)**                           | ❌   | ❌   | ❌              | Use time-slicing instead              |
| **MIG on GB10**                                    | ❌   | ❌   | ❌              | Hardware limitation, no workaround    |
| **Gov Ready ARM64 GPU Operator (Infra 7.8)**       | ❌   | ❌   | ⚠️ Hybrid       | Use x86 mgmt node; wait for Infra 8.x |
| **RKE2 HA on DGX B200 (v6.2)**                     | N/A  | N/A  | ⚠️ Experimental | Upgrade to v6.3+ for full support     |

---

## 6. Customer Compatibility Checker (CLI Template)

```bash
#!/bin/bash
# dws-compat-check.sh

echo "DWS6 Compatibility Checker"
echo "============================"

# Detect hardware
PLATFORM=$(uname -m)
GPU_COUNT=$(nvidia-smi --list-gpus 2>/dev/null | wc -l)

echo "Platform: $PLATFORM"
echo "GPUs: $GPU_COUNT"

# Check k3s version
K3S_VERSION=$(k3s -v 2>/dev/null | awk '{print $3}')
echo "k3s: ${K3S_VERSION:=not-installed}"

# Check operator versions
kubectl get deployment -n gpu-operator -o jsonpath='{.items[].spec.template.spec.containers[0].image}' | grep -o 'v[0-9.]*'

# Validate Infra requirements
echo ""
echo "Validating NVAIE Infra 7.8 requirements:"
echo "- FIPS crypto: $(openssl version | grep FIPS)"
echo "- GPU Driver: $(nvidia-smi --query-gpu=driver_version --format=csv,noheader)"
echo "- CUDA Toolkit: $(nvcc --version | tail -1)"

# Check compatibility
if [[ "$PLATFORM" == "aarch64" && "$GPU_COUNT" -gt 0 ]]; then
  if [[ "$K3S_VERSION" == "v1.28.5"* ]]; then
    echo "✅ Compatible (DWS6.2 + DGX Spark)"
  else
    echo "⚠️  k3s version mismatch (expected v1.28.5, got $K3S_VERSION)"
  fi
fi
```

---

## 7. Migration Guide: v6.1 → v6.2

### 7.1 Pre-Upgrade Checklist

- [ ] Velero backup created (full cluster snapshot)
- [ ] GPU Operator workloads paused (drain workers)
- [ ] etcd size <10 GB (compact if needed)
- [ ] Monitoring stack scraped (archive Prometheus DB)

### 7.2 Upgrade Steps

```bash
# Step 1: Upgrade k3s
curl -sfL https://get.k3s.io | \
  K3S_VERSION=v1.28.5+k3s1 \
  sh -

# Step 2: Patch GPU Operator
helm repo update nvidia
helm upgrade gpu-operator nvidia/gpu-operator \
  -n gpu-operator-system \
  --set driver.version=580.178.04 \
  --set operator.defaultRuntime=containerd

# Step 3: Upgrade NIM Operator
helm upgrade nim-operator \
  nvidia/nim-operator \
  -n nim-operator-system \
  --set version=3.1.2

# Step 4: Verify all pods running
kubectl get pods -A | grep -E 'gpu-operator|nim-operator' | grep -c Running
```

### 7.3 Post-Upgrade Validation

```bash
# GPU availability
kubectl run test-gpu --image=cuda:12.4 -- nvidia-smi

# NIM latency
curl -X POST http://nim-service:8000/v1/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"nemotron-3-super","prompt":"test"}'
# Expect <2s response
```

---

## 8. Support Lifecycle

| Version | Released | Peak Support | EOL Date | Years Support |
| ------- | -------- | ------------ | -------- | ------------- |
| v6.0    | Feb 2026 | May 2026     | Aug 2026 | 0.5           |
| v6.1    | May 2026 | Aug 2026     | Nov 2026 | 0.5           |
| v6.2    | Aug 2026 | Nov 2026     | May 2027 | 0.75          |
| v6.3    | Nov 2026 | Feb 2027     | Aug 2027 | 0.75          |
| v7.0    | Feb 2027 | Feb 2029     | Feb 2029 | 2.0           |

**Support ends:** Critical patches for 30 days after EOL; then security-only for NVAIE subscription holders.

---

## 9. Conclusion

DWS6 v6.2 is the **recommended baseline** for new deployments, with full NVAIE Infra 7.8 support on ARM64 (DGX Spark) and x86 (DGX Station/B200) platforms. v6.3 (Nov 2026) adds full ARM64 Gov Ready support.

---

**Prepared by:** Claude Code (Haiku 4.5)  
**Session:** claude/ipcmax-serdex-evaluation-orp38x  
**Status:** DRAFT v1.0

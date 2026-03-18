# Field Note: Acer Veriton GN100 — Docker + CUDA Validation

***
# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:
  - Version: 1.1 | Tool: Claude Code | Date: 11.03.2026 | Changes: Added successful NVIDIA PyTorch ARM64 container validation on GN100, documented GB10 support warning, and updated PyTorch baseline recommendation
  - Version: 1.0 | Tool: Claude Code | Date: 11.03.2026 | Changes: Initial creation — document GN100 Docker GPU validation, ARM64 host confirmation, PyTorch image architecture mismatch, and ARM64-first container policy

Session Links & References:
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/docs/field-notes/2026-03-11-veriton-gn100-docker-cuda-validation.md

Document Status:
  - Created: 11.03.2026
  - Last Modified: 11.03.2026
  - Language: English
  - Languages Available: English
  - Publication Status: ACTIVE
  - Document Type: Field Note / Lab Validation

***

## Ontology Tags

- **Geography:** Europe > Finland > Helsinki (Lab)
- **Sector:** Technology > Edge AI > Infrastructure > Docker/CUDA Validation
- **Entities:** Acer Veriton GN100, NVIDIA GB10, Docker, NVIDIA Container Toolkit, CUDA, PyTorch, DWS IQ 6
- **Temporal Context:** 2026-Q1, GN100 runtime validation
- **Confidence:** High

## Related Documents

- `Admin/Acer-Veriton-GN100/README.md`
- `docs/field-notes/2026-03-01-veriton-gn100-ollama-dev-environment.md`
- `docs/field-notes/2026-02-27-acer-veriton-gn100-nvidia-gpg-key-fix.md`
- `DWS_SECURITY_STANDARD.md`

## Context

This field note records a GN100 validation session focused on Docker GPU runtime readiness, CUDA container execution, and the correct container strategy for PyTorch on this host.

The immediate trigger was a failed Docker GPU container launch that initially reported:

```text
nvidia-container-cli: detection error: nvml error: gpu requires reset
```

The later validation sequence showed that the problem was transient. The host GPU recovered, Docker GPU passthrough worked, and the remaining PyTorch issue turned out to be an image architecture mismatch rather than a runtime failure.

## Hardware and Platform Findings

### Live host verification

The following commands established the actual host platform:

```bash
docker info --format '{{.OSType}}/{{.Architecture}}'
uname -m
```

Observed result:

```text
linux/aarch64
aarch64
```

This confirms GN100 must be treated as an **ARM64 / aarch64** machine for container selection.

### GPU verification

The host `nvidia-smi` output showed:

- `NVIDIA-SMI 580.126.09`
- `Driver Version: 580.126.09`
- `CUDA Version: 13.0`
- GPU name: `NVIDIA GB10`
- Kernel family already documented elsewhere as `6.17.0-1008-nvidia`

The full `nvidia-smi` table rendered successfully, which confirms that the GPU was healthy at the time of verification.

## Docker Validation Steps

### Step 1: CUDA base image validation

This command succeeded:

```bash
docker run --rm --gpus all nvidia/cuda:12.8.0-runtime-ubuntu24.04 nvidia-smi
```

### Result

The container printed a full `nvidia-smi` table from inside Docker.

### Interpretation

This validates all of the following on GN100:

- Docker can access the NVIDIA GPU
- NVIDIA Container Toolkit handoff is working
- CUDA userspace from the container can talk to the host driver
- GN100 is usable as a Docker-based GPU runtime for local workloads

## PyTorch Test and Validation

### Attempt 1: Generic PyTorch image failure

This command failed:

```bash
docker run --rm --gpus all pytorch/pytorch:2.7.1-cuda12.8-cudnn9-runtime python -c "import torch; print(torch.cuda.is_available()); print(torch.cuda.get_device_name(0))"
```

### Failure

The relevant output was:

```text
WARNING: The requested image's platform (linux/amd64) does not match the detected host platform (linux/arm64/v8) and no specific platform was requested
exec /opt/conda/bin/python: exec format error
```

### Root cause

This was **not** a CUDA or Docker GPU runtime problem.

It was an **image architecture mismatch**:

- Host platform: `linux/aarch64`
- Pulled image platform: `linux/amd64`

The `exec format error` is the expected failure when an x86_64 container lands on an ARM64 host without the right execution path.

### Attempt 2: NVIDIA PyTorch container success

This command succeeded with an NVIDIA NGC image that publishes an ARM64 variant:

```bash
docker run --rm --gpus all nvcr.io/nvidia/pytorch:25.02-py3 python3 -c "import torch; print(torch.__version__); print(torch.cuda.is_available()); print(torch.cuda.get_device_name(0)); print(torch.version.cuda)"
```

Observed result:

```text
WARNING: Detected NVIDIA GB10 GPU, which may not yet be supported in this version of the container
2.7.0a0+ecf3bae40a.nv25.02
True
NVIDIA GB10
12.8
```

### Interpretation

This confirms the practical PyTorch baseline on GN100:

- `nvcr.io/nvidia/pytorch:25.02-py3` runs on this ARM64 host
- PyTorch can see CUDA successfully
- PyTorch can see the `NVIDIA GB10` device from inside the container
- Container CUDA userspace version is `12.8`

The container emits a compatibility warning for `NVIDIA GB10`, so this result should be treated as **working with caution** rather than full formal support. The warning did not block PyTorch CUDA detection or device access during this session.

## Manifest Inspection and Container Strategy

During the session, manifest inspection was used to confirm that candidate images must publish an ARM64 variant before they are considered valid for GN100.

The working policy from this session is:

1. Validate new GPU/container work first with a known-good CUDA base image.
2. Verify image manifests before adopting framework containers.
3. Prefer native `linux/arm64` images on GN100.
4. Do not treat `pytorch/pytorch` tags as safe by default on this machine.
5. Prefer validated NVIDIA NGC PyTorch images over generic upstream PyTorch images on GN100.

## Engineering Decision

### Standard runtime decision

For GN100, **Docker is the standard local runtime** for:

- GPU validation
- Edge agent isolation
- Local CUDA workload testing
- Future model-serving and framework experiments

### ARM64-first container policy

For this host:

- Prefer images with a native `linux/arm64` manifest
- Check uncertain images with:

```bash
docker manifest inspect <image>:<tag>
```

- Avoid `--platform linux/amd64` for real CUDA/PyTorch work on GN100
- Treat `nvidia/cuda:12.8.0-runtime-ubuntu24.04` as the known-good baseline image

### PyTorch strategy for GN100

Validated baseline:

1. `nvcr.io/nvidia/pytorch:25.02-py3` is confirmed working on GN100 for basic CUDA/PyTorch detection.
2. Keep the GB10 warning in mind when testing performance-sensitive or advanced features.

Preferred order going forward:

1. Use `nvcr.io/nvidia/pytorch:<tag>` when the tag includes an ARM64 manifest.
2. If suitable NVIDIA PyTorch images are unavailable, build from `nvidia/cuda:12.8.0-runtime-ubuntu24.04`.
3. Avoid generic `pytorch/pytorch` images unless manifest inspection confirms ARM64 support.

## Note on Repository Drift

This session also exposed a documentation drift issue: older GN100 notes included generic or conflicting hardware summaries, such as `CPU: 20 cores`, which are not specific enough for platform-sensitive engineering work.

For GN100, the authoritative source order is now:

1. Live host verification from the device
2. `docs/field-notes/2026-03-01-veriton-gn100-ollama-dev-environment.md`
3. `Admin/Acer-Veriton-GN100/README.md`

## Operational Notes

- `nvidia-ctk runtime configure --runtime=docker` requires `sudo` to modify `/etc/docker/daemon.json`
- A temporary `gpu requires reset` state can clear without permanent Docker reconfiguration if the host GPU returns to a healthy state
- Container-local timestamps may differ from host local time if the container defaults to UTC

## Next Steps

- [x] Test an ARM64-capable NVIDIA PyTorch image on GN100
- [ ] If needed, build a GN100-specific PyTorch image from the known-good CUDA base
- [ ] Keep GN100 architecture notes synchronized between this field note and the admin README

## Summary

The GN100 Docker/CUDA session ended with a positive infrastructure result:

- The host is confirmed as `aarch64 / ARM64`
- Docker GPU passthrough works
- CUDA base image execution works
- `nvcr.io/nvidia/pytorch:25.02-py3` works on GN100 for basic CUDA/PyTorch validation
- The generic `pytorch/pytorch` failure was caused by an `amd64` image on an ARM64 host
- Current caveat: the NVIDIA container warns that `GB10` may not yet be fully supported in this release
- GN100 should follow an ARM64-first Docker image policy going forward

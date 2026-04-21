# Python CUDA GPU Management — Wheel Variants & Packaging

VERSION AND AGENT HISTORY
- Version: 1.0
- Date: 2026-03-08
- Author: Claude Code (Opus 4.6)
- Agent: claude/python-cuda-gpu-learning-uk2LZ
- Status: Active Learning Document

---

## 1. The Problem: GPU Package Hell

Installing NVIDIA GPU-accelerated Python packages has historically been painful:

- Navigate to pytorch.org / jax.dev / rapids.ai to find your CUDA version
- Copy a custom `pip` or `uv` command with a special index URL
- Use special package names like `nvidia-<package>-cu{11|12}`
- Different packages use different naming conventions (`xgboost` vs `xgboost-cpu`)
- Overlapping file installs between CPU and GPU variants cause unpredictable behavior

**Security risk:** Suffixed variant packages (e.g. `numpy-cuda`) enable name-squatting supply chain attacks.

**Scale of the problem:** As of 2025-12-05, 552 out of 8,136 (6.8%) of issues on uv's issue tracker contained the term "torch" — largely installation confusion.

---

## 2. The Solution: Wheel Variants (PEP 817 + PEP 825)

### What Are Wheel Variants?

An extension to the Python binary distribution format that allows:

- Package maintainers to declare **multiple build variants** for the same package version
- Installers to **automatically select** the most appropriate variant based on system hardware/software

### Three Pillars

| Pillar | Description |
|--------|-------------|
| **Wheel Variant System** | Multiple wheels for same package version, distinguished by hardware attributes |
| **Provider Plugin System** | Vendor-shipped packages that detect system capabilities (CUDA version, CPU features) |
| **Hash-based Identification** | Ensures compatibility while maintaining clarity in package naming |

### The WheelNext Initiative

NVIDIA initiated the **WheelNext** open source project to fix Python packaging for scientific computing, AI, and HPC. Collaborators: **NVIDIA, Meta, Astral (uv), Quansight, PyTorch team**.

- Website: wheelnext.dev
- PEP 817: Wheel Variants — Beyond Platform Tags
- PEP 825: Wheel Variants — Package Format (split from PEP 817)

---

## 3. How It Works — Architecture

### Variant Metadata Format

Wheels encode "properties" declaring hardware requirements using a declarative format:

```
nvidia :: cuda_version_lower_bound :: 12.8
x86_64 :: microarchitecture :: v3
```

The syntax uses a **3-element tuple**: `namespace :: feature_name :: value`

### Provider Plugins

Provider plugins are purpose-specific modules that:

1. **Detect** local software and hardware capabilities
2. **Filter** incompatible wheel variants
3. **Rank** remaining variants by preference

Example flow with `uv pip install torch`:
1. uv queries available PyTorch variants from the index
2. NVIDIA provider plugin detects local GPU state (CUDA driver version, compute capability)
3. uv cross-references variants with detected capabilities
4. Best-fitting variant is installed automatically

### Sorting Priority (Three Layers)

1. **Provider plugin** — default priority defined by the plugin itself
2. **Package** — variant information embedded in the wheel
3. **User** — explicit override via install command

If `nvidia` namespace has higher priority than `x86_64`, a CUDA variant is preferred over an x86-64-v3 variant.

### PyTorch Variant Example (as of October 2025)

PyTorch publishes **7 variants** per release:

| Variant | Description |
|---------|-------------|
| CPU-only | Null variant (always supported, fallback) |
| CUDA ≥12.1 | Older CUDA runtime |
| CUDA ≥12.6 | Mid-range CUDA |
| CUDA ≥12.8 | Latest CUDA |
| ROCm (×2) | AMD GPU variants |
| XPU (Linux) | Intel GPU variant |

---

## 4. Installation — The New Way

### Install Variant-Enabled uv

```bash
# Install experimental variant-enabled uv build
curl -LsSf https://astral.sh/uv/install.sh | \
  INSTALLER_DOWNLOAD_URL=https://wheelnext.astral.sh sh
```

### Install PyTorch (Automatic Detection)

```bash
# The dream: this just works now
uv pip install torch

# Explicitly select a variant label
uv pip install torch#cu128    # Force CUDA 12.8 variant
uv pip install torch#sm120    # Target specific GPU architecture
```

The `#` syntax allows explicit variant label selection.

### Backward Compatibility

- Older pip versions that don't understand variants **simply ignore them**
- Variant wheel filenames never match the previous Wheel Regex
- Existing infrastructure continues to work unchanged

---

## 5. Beyond GPUs — Other Use Cases

Wheel variants aren't just for CUDA:

| Use Case | Example |
|----------|---------|
| **Linear Algebra** | SciPy with OpenBLAS vs Intel MKL vs Apple Accelerate |
| **MPI** | mpi4py targeting OpenMPI vs MPICH vs Intel MPI |
| **Graphics** | Game dev libraries with Vulkan vs DirectX vs Metal |
| **CPU Extensions** | Packages optimized for AVX-512, AMX, etc. |

---

## 6. DWS6 Context — Acer GPU & Edge Devices

### Current Hardware Stack

| Device | GPU | CUDA | Role |
|--------|-----|------|------|
| **Acer laptop** | NVIDIA GeForce/RTX | CUDA 12.x | Development workstation |
| **NVIDIA Jetson Orin Nano** | Integrated (1024 CUDA cores) | CUDA 12.6 (JetPack 6.x) | Edge AI (Lifetime Fleet) |

### Setting Up Python CUDA on Acer

```bash
# 1. Verify NVIDIA driver and CUDA
nvidia-smi
nvcc --version

# 2. Install variant-enabled uv (recommended over pip for CUDA)
curl -LsSf https://astral.sh/uv/install.sh | \
  INSTALLER_DOWNLOAD_URL=https://wheelnext.astral.sh sh

# 3. Create virtual environment
uv venv .venv --python 3.12
source .venv/bin/activate

# 4. Install PyTorch (auto-detects your GPU)
uv pip install torch torchvision torchaudio

# 5. Verify CUDA is available
python -c "import torch; print(f'CUDA: {torch.cuda.is_available()}, Device: {torch.cuda.get_device_name(0)}')"
```

### Setting Up Python CUDA on Jetson Orin Nano

```bash
# JetPack pre-installs CUDA toolkit
# Use NVIDIA's PyTorch wheel for Jetson
pip install --no-cache \
  https://developer.download.nvidia.com/compute/redist/jp/v60/pytorch/torch-2.5.0a0+872d972e41.nv24.08-cp312-cp312-linux_aarch64.whl

# Install supporting packages
sudo apt install python3-tensorrt python3-pip git cmake
pip install numpy cupy-cuda12x
```

### Key Packages for GPU Development

| Package | Purpose | Install |
|---------|---------|---------|
| **PyTorch** | Deep learning | `uv pip install torch` |
| **CuPy** | NumPy-compatible GPU arrays | `uv pip install cupy-cuda12x` |
| **RAPIDS cuDF** | GPU DataFrames | `uv pip install cudf-cu12` |
| **RAPIDS cuML** | GPU Machine Learning | `uv pip install cuml-cu12` |
| **TensorRT** | Inference optimization | `pip install tensorrt` |
| **Triton** | GPU kernel compiler | `uv pip install triton` |

---

## 7. Best Practices for Python CUDA Management

### Environment Management

1. **Use `uv` over `pip`** — faster, better dependency resolution, variant support
2. **One venv per project** — never install GPU packages globally
3. **Pin CUDA version** — match your driver's maximum supported CUDA version
4. **Use `.python-version`** — lock Python version per project

### CUDA Version Compatibility

```
Driver Version → Maximum CUDA Toolkit Version
≥ 555.42       → CUDA 12.5
≥ 560.28       → CUDA 12.6
≥ 565.57       → CUDA 12.8
```

Check your driver: `nvidia-smi` (top right shows max CUDA version)

### Troubleshooting

```bash
# Check if CUDA is visible
python -c "import torch; print(torch.cuda.is_available())"

# Check CUDA version PyTorch was built with
python -c "import torch; print(torch.version.cuda)"

# List GPU devices
python -c "import torch; [print(f'{i}: {torch.cuda.get_device_name(i)}') for i in range(torch.cuda.device_count())]"

# Monitor GPU usage
watch -n 1 nvidia-smi
```

---

## 8. Key Takeaways

1. **Wheel Variants (PEP 817/825)** solve the GPU package installation mess
2. **`uv pip install torch` will "just work"** — no more manual CUDA version matching
3. **Provider plugins** auto-detect your hardware and select the right binary
4. **Backward compatible** — existing tools continue to work
5. **Security improvement** — eliminates the name-squatting attack vector
6. **Multi-vendor** — supports NVIDIA CUDA, AMD ROCm, Intel XPU, and more
7. **Experimental today** — PyTorch 2.8+ supports it; expect broad adoption in 2026

---

## Sources

- NVIDIA Technical Blog: Streamline CUDA-Accelerated Python Install and Packaging Workflows with Wheel Variants
  https://developer.nvidia.com/blog/streamline-cuda-accelerated-python-install-and-packaging-workflows-with-wheel-variants
- PEP 817: Wheel Variants — Beyond Platform Tags
  https://peps.python.org/pep-0817/
- PEP 825: Wheel Variants — Package Format
  https://peps.python.org/pep-0825/
- WheelNext Project
  https://wheelnext.dev/
- Astral (uv): An experimental, variant-enabled build of uv
  https://astral.sh/blog/wheel-variants
- PyTorch Blog: PyTorch Wheel Variants, the Frontier of Python Packaging
  https://pytorch.org/blog/pytorch-wheel-variants/
- Quansight Labs: Python Wheels — from Tags to Variants
  https://labs.quansight.org/blog/python-wheels-from-tags-to-variants
- AMD: PyTorch 2.9 Wheel Variant support expands to ROCm
  https://www.amd.com/en/developer/resources/technical-articles/2025/pytorch-2-9-wheel-variant-support-expands-to-rocm.html

# LWM Training Manual - Part 1: Infrastructure Setup
## Acer Veriton GN-100 Configuration Lab Notes

**Document ID:** DWS-LWM-TRAIN-001-PART1
**Version:** 1.0
**Classification:** Internal Lab Notebook
**Author:** Lifetime Oy
**Date:** 2026-01-24

**Execution Time:** 4-6 hours
**Prerequisites:** Physical access to Acer Veriton GN-100, sudo privileges

---

## Lab Session Overview

This lab configures the Acer Veriton GN-100 from Debian installation to a fully operational LWM training environment.

**What You'll Build:**
- NVIDIA GPU drivers + CUDA 12.4
- Python 3.11 virtual environment with PyTorch
- Anthropic Claude API integration
- Hugging Face model access
- Llama 3.1 8B base model downloaded

**Verification Criteria:**
- ✅ `nvidia-smi` shows GPU stats
- ✅ PyTorch detects CUDA
- ✅ Claude API responds to test query
- ✅ Llama 3.1 8B model files present (~16GB)

### Järjestelmätiedot (Device reference — lab instance)

| Field | FI | Value |
|-------|-----|------|
| **Model** | Malli | Acer Inc. Acer Veriton GN100 |
| **Machine ID** | Koneen ID | `435bf64de6f94bfa93dca976e55670bd` |
| **Uptime** | Toiminta-aika | 5 päivää |

*(Update Toiminta-aika when documenting a lab session; use `uptime` or `cat /proc/uptime` on the device.)*

---

## Section 1: Hardware Verification (15 minutes)

### 1.0 SSH key-based access (connect without login)

Set up passwordless SSH so you can connect without an interactive login prompt (required for scripts, CI, and agents).

**On your client machine (Win11, Mac, or dev box):**

```bash
# If you don't have a key yet
ssh-keygen -t ed25519 -C "dws-gn100" -f ~/.ssh/id_ed25519_dws -N ""

# Copy public key to the GN100 (one-time; you'll type the password this once)
ssh-copy-id -i ~/.ssh/id_ed25519_dws.pub admin100@gn100-cb5d
# Or: ssh-copy-id -i ~/.ssh/id_ed25519_dws.pub admin100@gn-100.local
# Or use IP: ssh-copy-id -i ~/.ssh/id_ed25519_dws.pub admin100@192.168.1.XXX
```

**Optional — `~/.ssh/config` on the client** (use host alias and key; no password next time):

```bash
Host gn100 gn100-cb5d gn-100.local
    HostName gn100-cb5d
    User admin100
    IdentityFile ~/.ssh/id_ed25519_dws
    ServerAliveInterval 60
    ServerAliveCountMax 120
```

**Test (no login prompt):**

```bash
ssh gn100-cb5d "hostname; uptime"
# Or: ssh admin100@gn100-cb5d "hostname"
```

*VPN required:* hostname `gn100-cb5d` resolves only when connected to DNA Tietoturva (F-Secure) VPN. Use IP or `gn-100.local` on local LAN if different.

### 1.1 Initial System Check

SSH into the GN-100:

```bash
ssh admin100@gn100-cb5d
# Or: ssh admin100@gn-100.local
# Or use IP address: ssh admin100@192.168.1.XXX
```

Run the hardware diagnostic script:

```bash
#!/bin/bash
# Save as: ~/hw-check.sh
# Run: bash ~/hw-check.sh > ~/hw-check-results.txt

echo "=== Acer Veriton GN-100 Hardware Assessment ==="
echo "Date: $(date)"
echo "Hostname: $(hostname)"
echo ""

# GPU Check
echo "[1/6] GPU Configuration"
lspci | grep -i nvidia
if [ $? -eq 0 ]; then
    echo "✅ NVIDIA GPU detected"
else
    echo "❌ No NVIDIA GPU found - check PCIe connection"
    exit 1
fi

# CPU Check
echo ""
echo "[2/6] CPU Specifications"
lscpu | grep -E "Model name|CPU\(s\):|Thread|Core\(s\)|Socket"
CORES=$(lscpu | grep "^CPU(s):" | awk '{print $2}')
echo "Total CPU cores: $CORES"

# Memory Check
echo ""
echo "[3/6] Memory Configuration"
free -h
TOTAL_RAM=$(free -g | awk '/^Mem:/{print $2}')
echo "Total RAM: ${TOTAL_RAM}GB"
if [ "$TOTAL_RAM" -lt 32 ]; then
    echo "⚠️  WARNING: Less than 32GB RAM detected"
fi

# Storage Check
echo ""
echo "[4/6] Storage Configuration"
df -h / /home
AVAIL_HOME=$(df -h /home | awk 'NR==2 {print $4}' | sed 's/G//')
echo "Available /home space: ${AVAIL_HOME}GB"
if (( $(echo "$AVAIL_HOME < 500" | bc -l) )); then
    echo "⚠️  WARNING: Less than 500GB free in /home"
fi

# Network Check
echo ""
echo "[5/6] Network Configuration"
ip addr show | grep -E "inet " | grep -v "127.0.0.1"
ping -c 2 8.8.8.8 > /dev/null 2>&1 && echo "✅ Internet: Connected" || echo "❌ Internet: No connection"
curl -s --connect-timeout 5 https://huggingface.co > /dev/null && echo "✅ HuggingFace: Accessible" || echo "❌ HuggingFace: Blocked"
curl -s --connect-timeout 5 https://api.anthropic.com > /dev/null && echo "✅ Anthropic API: Accessible" || echo "❌ Anthropic API: Blocked"

# OS Check
echo ""
echo "[6/6] Operating System"
cat /etc/os-release | grep -E "NAME|VERSION"
KERNEL=$(uname -r)
echo "Kernel: $KERNEL"

echo ""
echo "=== Hardware Check Complete ==="
echo "Results saved to: ~/hw-check-results.txt"
```

**Execute:**

```bash
bash ~/hw-check.sh | tee ~/hw-check-results.txt
```

**Expected Output:**
```
✅ NVIDIA GPU detected
Total CPU cores: 8-16
Total RAM: 64GB
Available /home space: 800GB
✅ Internet: Connected
✅ HuggingFace: Accessible
✅ Anthropic API: Accessible
```

**❌ If any checks fail:**
- No NVIDIA GPU → Check BIOS settings, PCIe seating
- No internet → Check network cable, firewall
- Blocked APIs → Check corporate proxy settings

---

## Section 2: System Preparation (30 minutes)

### 2.1 Update System Packages

```bash
# Update package lists
sudo apt update

# Upgrade existing packages (may take 10-15 minutes)
sudo apt upgrade -y

# Install build essentials
sudo apt install -y \
    build-essential \
    git \
    curl \
    wget \
    tmux \
    htop \
    python3.11 \
    python3.11-venv \
    python3-pip \
    software-properties-common \
    jq \
    unzip

# Verify installations
which git && echo "✅ git installed"
which python3.11 && echo "✅ Python 3.11 installed"
which tmux && echo "✅ tmux installed"
```

### 2.2 Configure SSH for Long Sessions

Add to `~/.ssh/config`:

```bash
cat >> ~/.ssh/config << 'EOF'
Host gn100 gn-100 gn-100.local
    ServerAliveInterval 60
    ServerAliveCountMax 120
    TCPKeepAlive yes
EOF

chmod 600 ~/.ssh/config
```

**Test:** SSH session should now survive 2+ hours of inactivity

### 2.3 Create Project Directory Structure

```bash
# Create main project directory
mkdir -p ~/dws-lwm

# Create subdirectories
cd ~/dws-lwm
mkdir -p configs/{base,industries}
mkdir -p data/{raw,processed,synthetic}
mkdir -p models/{base,finetuned,merged,.cache}
mkdir -p scripts
mkdir -p logs
mkdir -p evaluation
mkdir -p checkpoints

# Verify structure
tree -L 2 ~/dws-lwm

# Expected output:
# dws-lwm/
# ├── checkpoints/
# ├── configs/
# │   ├── base/
# │   └── industries/
# ├── data/
# │   ├── processed/
# │   ├── raw/
# │   └── synthetic/
# ├── evaluation/
# ├── logs/
# ├── models/
# │   ├── base/
# │   ├── finetuned/
# │   ├── merged/
# │   └── .cache/
# └── scripts/
```

### 2.4 Set Environment Variables

```bash
cat >> ~/.bashrc << 'EOF'

# ============================================
# DWS LWM Training Environment
# ============================================
export DWS_HOME="$HOME/dws-lwm"
export CUDA_HOME="/usr/local/cuda"
export PATH="$CUDA_HOME/bin:$PATH"
export LD_LIBRARY_PATH="$CUDA_HOME/lib64:$LD_LIBRARY_PATH"

# Hugging Face cache
export HF_HOME="$DWS_HOME/models/.cache"
export TRANSFORMERS_CACHE="$DWS_HOME/models/.cache"

# Prevent tokenizers parallelism warnings
export TOKENIZERS_PARALLELISM=false

# Aliases
alias dws='cd $DWS_HOME'
alias logs='tail -f $DWS_HOME/logs/*.log'
alias gpu='watch -n 1 nvidia-smi'

echo "DWS LWM environment loaded"
EOF

# Apply changes
source ~/.bashrc

# Verify
echo $DWS_HOME
# Should print: /home/user/dws-lwm
```

---

## Section 3: NVIDIA Driver & CUDA Installation (45 minutes)

### 3.1 Check Current Driver Status

```bash
# Check if NVIDIA driver is already installed
nvidia-smi 2>/dev/null

# If command not found, proceed with installation
# If driver exists, note the version and skip to 3.3
```

### 3.2 Clean Install of NVIDIA Drivers

**⚠️ WARNING:** This will reboot the system

```bash
# Remove any existing NVIDIA packages
sudo apt purge nvidia-* -y
sudo apt autoremove -y
sudo apt autoclean

# Add NVIDIA PPA
sudo add-apt-repository ppa:graphics-drivers/ppa -y
sudo apt update

# Check recommended driver
ubuntu-drivers devices

# Install recommended driver (usually 535 or newer)
sudo ubuntu-drivers autoinstall

# Reboot required
echo "System will reboot in 10 seconds..."
sleep 10
sudo reboot
```

**After Reboot:**

```bash
# SSH back into GN-100
ssh admin100@gn-100.local

# Verify driver installation
nvidia-smi

# Expected output:
# +-----------------------------------------------------------------------------+
# | NVIDIA-SMI 535.xx.xx    Driver Version: 535.xx.xx    CUDA Version: 12.2   |
# |-------------------------------+----------------------+----------------------+
# | GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
# | Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
# |===============================+======================+======================|
# |   0  NVIDIA ...          Off  | 00000000:01:00.0 Off |                  N/A |
# | 30%   35C    P0    25W / 350W |      0MiB / 24576MiB |      0%      Default |
# +-------------------------------+----------------------+----------------------+
```

**✅ Success Criteria:**
- `nvidia-smi` runs without errors
- GPU name and memory shown
- Driver version ≥ 535

### 3.3 Install CUDA Toolkit 12.4

```bash
# Download CUDA keyring
cd ~/Downloads
wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64/cuda-keyring_1.1-1_all.deb

# Install keyring
sudo dpkg -i cuda-keyring_1.1-1_all.deb

# Update package list
sudo apt update

# Install CUDA Toolkit 12.4 (takes 10-15 minutes)
sudo apt install -y cuda-toolkit-12-4

# Verify CUDA installation
/usr/local/cuda-12.4/bin/nvcc --version

# Expected output:
# nvcc: NVIDIA (R) Cuda compiler driver
# Cuda compilation tools, release 12.4, V12.4.xxx
```

### 3.4 Verify CUDA Environment

```bash
# Check CUDA path
echo $CUDA_HOME
# Should show: /usr/local/cuda

# Check nvcc is in PATH
which nvcc
# Should show: /usr/local/cuda/bin/nvcc

# Test CUDA compilation
cd ~/dws-lwm
cat > test_cuda.cu << 'EOF'
#include <stdio.h>

__global__ void hello_cuda() {
    printf("Hello from GPU thread %d!\n", threadIdx.x);
}

int main() {
    hello_cuda<<<1, 5>>>();
    cudaDeviceSynchronize();
    return 0;
}
EOF

nvcc test_cuda.cu -o test_cuda
./test_cuda

# Expected output:
# Hello from GPU thread 0!
# Hello from GPU thread 1!
# Hello from GPU thread 2!
# Hello from GPU thread 3!
# Hello from GPU thread 4!

rm test_cuda test_cuda.cu
```

---

## Section 4: Python Environment Setup (30 minutes)

### 4.1 Create Virtual Environment

```bash
cd ~/dws-lwm

# Create virtual environment with Python 3.11
python3.11 -m venv venv

# Activate environment
source venv/bin/activate

# Upgrade pip
pip install --upgrade pip setuptools wheel

# Verify Python version
python --version
# Should show: Python 3.11.x

# Add activation to bashrc for convenience
echo "alias dws-env='source ~/dws-lwm/venv/bin/activate'" >> ~/.bashrc
source ~/.bashrc
```

### 4.2 Install PyTorch with CUDA Support

```bash
# Ensure venv is activated
source ~/dws-lwm/venv/bin/activate

# Install PyTorch with CUDA 12.4 support (takes 5-10 minutes)
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu124

# Verify PyTorch installation
python << 'EOF'
import torch

print(f"PyTorch version: {torch.__version__}")
print(f"CUDA available: {torch.cuda.is_available()}")
print(f"CUDA version: {torch.version.cuda}")
print(f"cuDNN version: {torch.backends.cudnn.version()}")

if torch.cuda.is_available():
    print(f"GPU device: {torch.cuda.get_device_name(0)}")
    print(f"GPU memory: {torch.cuda.get_device_properties(0).total_memory / 1e9:.1f} GB")

    # Test GPU computation
    x = torch.rand(1000, 1000).cuda()
    y = torch.rand(1000, 1000).cuda()
    z = torch.mm(x, y)
    print(f"✅ GPU computation successful: {z.shape}")
else:
    print("❌ CUDA not available - check installation")
EOF
```

**Expected Output:**
```
PyTorch version: 2.x.x+cu124
CUDA available: True
CUDA version: 12.4
cuDNN version: 90100
GPU device: NVIDIA ...
GPU memory: 24.0 GB
✅ GPU computation successful: torch.Size([1000, 1000])
```

### 4.3 Install Core Training Libraries

```bash
# Install transformers and related libraries
pip install \
    transformers>=4.45.0 \
    datasets>=2.18.0 \
    accelerate>=0.30.0 \
    peft>=0.10.0 \
    trl>=0.8.0 \
    bitsandbytes>=0.43.0 \
    scipy \
    protobuf

# Install Anthropic SDK
pip install anthropic>=0.25.0

# Install evaluation & monitoring tools
pip install \
    wandb \
    tensorboard \
    rouge-score \
    sacrebleu \
    sentencepiece \
    tiktoken \
    ninja

# Install Flash Attention 2 (if supported - may fail on older GPUs)
pip install flash-attn --no-build-isolation 2>&1 | tee flash-attn-install.log

# Check if flash-attn installed
python -c "import flash_attn; print(f'✅ Flash Attention {flash_attn.__version__}')" 2>/dev/null || echo "⚠️  Flash Attention not installed (optional)"

# Create requirements.txt for reproducibility
pip freeze > requirements.txt

echo "✅ Core libraries installed. Total packages: $(pip list | wc -l)"
```

### 4.4 Verify Installation

```bash
python << 'EOF'
import sys
print("=== Package Verification ===\n")

packages = {
    'torch': 'PyTorch',
    'transformers': 'Transformers',
    'datasets': 'Datasets',
    'peft': 'PEFT',
    'trl': 'TRL',
    'bitsandbytes': 'BitsAndBytes',
    'anthropic': 'Anthropic SDK',
    'wandb': 'Weights & Biases'
}

for module, name in packages.items():
    try:
        mod = __import__(module)
        version = getattr(mod, '__version__', 'unknown')
        print(f"✅ {name:20s} {version}")
    except ImportError as e:
        print(f"❌ {name:20s} NOT INSTALLED")
        sys.exit(1)

print("\n=== All required packages installed ===")
EOF
```

---

## Section 5: Anthropic API Configuration (15 minutes)

### 5.1 Create Secure Credentials Storage

```bash
# Create credentials directory
mkdir -p ~/.config/anthropic
chmod 700 ~/.config/anthropic

# Store API key (replace with your actual key)
echo "Enter your Anthropic API key:"
read -s API_KEY

cat > ~/.config/anthropic/credentials << EOF
ANTHROPIC_API_KEY=$API_KEY
EOF

chmod 600 ~/.config/anthropic/credentials

# Add to bashrc
cat >> ~/.bashrc << 'EOF'
# Load Anthropic API credentials
if [ -f ~/.config/anthropic/credentials ]; then
    export $(cat ~/.config/anthropic/credentials | xargs)
fi
EOF

source ~/.bashrc

# Verify key is loaded
echo "API Key loaded: ${ANTHROPIC_API_KEY:0:20}..."
```

### 5.2 Test Claude API Connection

Create test script:

```bash
cat > ~/dws-lwm/scripts/test_claude_api.py << 'EOF'
#!/usr/bin/env python3
"""Test Anthropic Claude API connectivity"""

import anthropic
import os
import sys

def test_api():
    # Check if API key is set
    api_key = os.getenv('ANTHROPIC_API_KEY')
    if not api_key:
        print("❌ ANTHROPIC_API_KEY not set in environment")
        print("Run: export ANTHROPIC_API_KEY=your-key-here")
        sys.exit(1)

    print(f"✅ API Key found: {api_key[:20]}...\n")

    # Initialize client
    client = anthropic.Anthropic(api_key=api_key)

    # Test request
    print("Testing Claude API with simple query...")

    try:
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=100,
            messages=[{
                "role": "user",
                "content": "Say 'DWS LWM Training Environment Ready' if you can read this. Then list 3 industries LWM will target."
            }]
        )

        # Print response
        print("\n=== Claude Response ===")
        print(response.content[0].text)
        print("\n=== API Details ===")
        print(f"Model: {response.model}")
        print(f"Tokens used: {response.usage.input_tokens} input + {response.usage.output_tokens} output")
        print(f"Stop reason: {response.stop_reason}")

        print("\n✅ Claude API connection successful!")
        return True

    except Exception as e:
        print(f"\n❌ API Error: {e}")
        return False

if __name__ == "__main__":
    success = test_api()
    sys.exit(0 if success else 1)
EOF

chmod +x ~/dws-lwm/scripts/test_claude_api.py

# Run test
python ~/dws-lwm/scripts/test_claude_api.py
```

**Expected Output:**
```
✅ API Key found: sk-ant-api03-xxxxxx...

Testing Claude API with simple query...

=== Claude Response ===
DWS LWM Training Environment Ready

The three industries LWM will target are:
1. Logistics
2. Construction
3. Manufacturing

=== API Details ===
Model: claude-sonnet-4-20250514
Tokens used: 25 input + 45 output
Stop reason: end_turn

✅ Claude API connection successful!
```

---

## Section 6: Hugging Face Setup (30 minutes)

### 6.1 Install Hugging Face CLI

```bash
# Install CLI (already included in transformers, but explicit install)
pip install huggingface_hub[cli]

# Verify installation
huggingface-cli --version
```

### 6.2 Login to Hugging Face

```bash
# Interactive login
huggingface-cli login

# You'll be prompted:
# Token: [paste your HF token here]
# Add token as git credential? (Y/n) Y

# Verify login
huggingface-cli whoami

# Expected output:
# username: your-hf-username
# email: your-email@example.com
```

### 6.3 Request Access to Llama Models

**Manual Step:**
1. Visit: https://huggingface.co/meta-llama/Llama-3.1-8B
2. Click "Request Access"
3. Accept license agreement
4. Wait for approval (usually instant to 24 hours)

**Verify access:**

```bash
python << 'EOF'
from huggingface_hub import HfApi

api = HfApi()

# Check if you have access to Llama 3.1
try:
    model_info = api.model_info("meta-llama/Llama-3.1-8B")
    print(f"✅ Access granted to {model_info.modelId}")
    print(f"   Model size: {model_info.safetensors['total'] / 1e9:.1f} GB")
except Exception as e:
    print(f"❌ No access yet: {e}")
    print("   Request access at: https://huggingface.co/meta-llama/Llama-3.1-8B")
EOF
```

### 6.4 Download Llama 3.1 8B Base Model

**⚠️ This downloads ~16GB and takes 30-60 minutes on typical connections**

Create download script:

```bash
cat > ~/dws-lwm/scripts/download_llama.py << 'EOF'
#!/usr/bin/env python3
"""Download Llama 3.1 8B base model"""

from transformers import AutoModelForCausalLM, AutoTokenizer
import os
from pathlib import Path

def download_model():
    model_id = "meta-llama/Llama-3.1-8B"
    save_dir = Path(os.path.expanduser("~/dws-lwm/models/base/llama-3.1-8b"))

    print(f"Downloading {model_id}...")
    print(f"Save location: {save_dir}")
    print("This will take 30-60 minutes on typical connections...\n")

    # Create save directory
    save_dir.mkdir(parents=True, exist_ok=True)

    # Download tokenizer (fast)
    print("[1/2] Downloading tokenizer...")
    tokenizer = AutoTokenizer.from_pretrained(model_id)
    tokenizer.save_pretrained(save_dir)
    print("✅ Tokenizer saved\n")

    # Download model (slow - ~16GB)
    print("[2/2] Downloading model weights...")
    print("Progress will be shown below:")
    model = AutoModelForCausalLM.from_pretrained(
        model_id,
        torch_dtype="auto",
        device_map="auto"
    )
    model.save_pretrained(save_dir)
    print("✅ Model saved\n")

    # Verify
    print("=== Download Complete ===")
    print(f"Model location: {save_dir}")

    # Check file sizes
    total_size = sum(f.stat().st_size for f in save_dir.rglob('*') if f.is_file())
    print(f"Total size: {total_size / 1e9:.2f} GB")

    # List files
    print("\nFiles downloaded:")
    for f in sorted(save_dir.rglob('*')):
        if f.is_file():
            size_mb = f.stat().st_size / 1e6
            print(f"  {f.name:40s} {size_mb:8.1f} MB")

if __name__ == "__main__":
    download_model()
EOF

chmod +x ~/dws-lwm/scripts/download_llama.py

# Run download
# NOTE: This is a long-running process - use tmux!
tmux new-session -d -s llama-download "python ~/dws-lwm/scripts/download_llama.py 2>&1 | tee ~/dws-lwm/logs/llama-download.log"

# Attach to watch progress
tmux attach -t llama-download

# Detach: Ctrl+B, then D
# Reattach anytime: tmux attach -t llama-download
```

**Monitor download:**

```bash
# Check log file
tail -f ~/dws-lwm/logs/llama-download.log

# Check disk usage
watch -n 10 'du -sh ~/dws-lwm/models/base/llama-3.1-8b'
```

**After download completes:**

```bash
# Verify model files
ls -lh ~/dws-lwm/models/base/llama-3.1-8b/

# Expected files:
# config.json
# generation_config.json
# model-00001-of-00004.safetensors (~4GB)
# model-00002-of-00004.safetensors (~5GB)
# model-00003-of-00004.safetensors (~5GB)
# model-00004-of-00004.safetensors (~2GB)
# model.safetensors.index.json
# special_tokens_map.json
# tokenizer.json
# tokenizer_config.json

# Test model loading
python << 'EOF'
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

model_path = "~/dws-lwm/models/base/llama-3.1-8b"

print("Loading tokenizer...")
tokenizer = AutoTokenizer.from_pretrained(model_path)
print(f"✅ Tokenizer loaded. Vocab size: {tokenizer.vocab_size}")

print("\nLoading model (this takes 30-60 seconds)...")
model = AutoModelForCausalLM.from_pretrained(
    model_path,
    torch_dtype=torch.bfloat16,
    device_map="auto"
)
print(f"✅ Model loaded. Parameters: {model.num_parameters() / 1e9:.1f}B")

# Test inference
print("\nTesting inference...")
inputs = tokenizer("Hello, my name is", return_tensors="pt").to(model.device)
outputs = model.generate(**inputs, max_new_tokens=20)
result = tokenizer.decode(outputs[0], skip_special_tokens=True)
print(f"Model output: {result}")
print("\n✅ Model inference successful!")
EOF
```

---

## Section 7: Final Verification & Health Check (15 minutes)

### 7.1 Run Complete System Test

Create comprehensive test script:

```bash
cat > ~/dws-lwm/scripts/system_health_check.py << 'EOF'
#!/usr/bin/env python3
"""Complete DWS LWM system health check"""

import os
import sys
import subprocess
from pathlib import Path

def check(name, condition, error_msg=""):
    """Print check result"""
    if condition:
        print(f"✅ {name}")
        return True
    else:
        print(f"❌ {name}")
        if error_msg:
            print(f"   → {error_msg}")
        return False

def main():
    print("=== DWS LWM System Health Check ===\n")

    all_pass = True

    # Environment checks
    print("[1] Environment Variables")
    all_pass &= check("DWS_HOME set", os.getenv('DWS_HOME'))
    all_pass &= check("CUDA_HOME set", os.getenv('CUDA_HOME'))
    all_pass &= check("ANTHROPIC_API_KEY set", os.getenv('ANTHROPIC_API_KEY'))
    print()

    # Directory structure
    print("[2] Directory Structure")
    dws_home = Path(os.path.expanduser("~/dws-lwm"))
    all_pass &= check("DWS home exists", dws_home.exists())
    all_pass &= check("configs/ exists", (dws_home / "configs").exists())
    all_pass &= check("data/ exists", (dws_home / "data").exists())
    all_pass &= check("models/ exists", (dws_home / "models").exists())
    all_pass &= check("scripts/ exists", (dws_home / "scripts").exists())
    print()

    # NVIDIA/CUDA
    print("[3] NVIDIA & CUDA")
    try:
        result = subprocess.run(['nvidia-smi'], capture_output=True, text=True)
        all_pass &= check("nvidia-smi works", result.returncode == 0)
    except:
        all_pass &= check("nvidia-smi works", False, "nvidia-smi not found")

    try:
        result = subprocess.run(['nvcc', '--version'], capture_output=True, text=True)
        all_pass &= check("nvcc works", result.returncode == 0)
    except:
        all_pass &= check("nvcc works", False, "nvcc not found")
    print()

    # Python packages
    print("[4] Python Packages")
    try:
        import torch
        all_pass &= check(f"PyTorch {torch.__version__}", True)
        all_pass &= check("CUDA available", torch.cuda.is_available(), "PyTorch cannot see CUDA")

        import transformers
        all_pass &= check(f"Transformers {transformers.__version__}", True)

        import peft
        all_pass &= check(f"PEFT {peft.__version__}", True)

        import trl
        all_pass &= check(f"TRL {trl.__version__}", True)

        import anthropic
        all_pass &= check(f"Anthropic {anthropic.__version__}", True)

    except ImportError as e:
        all_pass &= check(str(e), False)
    print()

    # Model files
    print("[5] Model Files")
    model_dir = Path(os.path.expanduser("~/dws-lwm/models/base/llama-3.1-8b"))
    all_pass &= check("Llama 3.1 8B directory exists", model_dir.exists())

    if model_dir.exists():
        config_file = model_dir / "config.json"
        all_pass &= check("config.json exists", config_file.exists())

        safetensors = list(model_dir.glob("*.safetensors"))
        all_pass &= check(f"Model weights exist ({len(safetensors)} files)", len(safetensors) > 0)
    print()

    # API connectivity
    print("[6] API Connectivity")
    try:
        import anthropic
        client = anthropic.Anthropic()
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=10,
            messages=[{"role": "user", "content": "test"}]
        )
        all_pass &= check("Claude API responds", True)
    except Exception as e:
        all_pass &= check("Claude API responds", False, str(e))
    print()

    # Summary
    print("=" * 50)
    if all_pass:
        print("✅ ALL CHECKS PASSED - System ready for training!")
        return 0
    else:
        print("❌ SOME CHECKS FAILED - Review errors above")
        return 1

if __name__ == "__main__":
    sys.exit(main())
EOF

chmod +x ~/dws-lwm/scripts/system_health_check.py

# Run health check
python ~/dws-lwm/scripts/system_health_check.py
```

### 7.2 Create Environment Snapshot

```bash
# Document current environment
cat > ~/dws-lwm/ENVIRONMENT_SNAPSHOT.md << EOF
# DWS LWM Environment Snapshot
**Date:** $(date)
**Hostname:** $(hostname)

## System Info
- **OS:** $(cat /etc/os-release | grep PRETTY_NAME | cut -d'"' -f2)
- **Kernel:** $(uname -r)
- **CPU:** $(lscpu | grep "Model name" | cut -d':' -f2 | xargs)
- **RAM:** $(free -h | awk '/^Mem:/{print $2}')

## GPU
$(nvidia-smi --query-gpu=name,driver_version,memory.total --format=csv,noheader)

## CUDA
- **CUDA Version:** $(nvcc --version | grep "release" | awk '{print $5}' | cut -d',' -f1)

## Python Environment
- **Python:** $(python --version)
- **Virtual Env:** ~/dws-lwm/venv
- **Packages:** $(pip list | wc -l) installed

## Key Package Versions
$(pip list | grep -E "torch|transformers|peft|trl|anthropic" | column -t)

## Model Files
- **Llama 3.1 8B:** $(du -sh ~/dws-lwm/models/base/llama-3.1-8b 2>/dev/null | cut -f1 || echo "Not downloaded")

## Disk Usage
$(df -h ~/dws-lwm | tail -1)

---
Environment configured successfully.
Ready for Part 2: Data Generation & Training
EOF

cat ~/dws-lwm/ENVIRONMENT_SNAPSHOT.md
```

---

## Section 8: Backup & Documentation (10 minutes)

### 8.1 Create Backup Script

```bash
cat > ~/dws-lwm/scripts/backup_environment.sh << 'EOF'
#!/bin/bash
# Backup critical configuration files

BACKUP_DIR=~/dws-lwm/backups/$(date +%Y%m%d-%H%M%S)
mkdir -p $BACKUP_DIR

echo "Creating backup in $BACKUP_DIR..."

# Copy configurations
cp -r ~/dws-lwm/configs $BACKUP_DIR/
cp ~/dws-lwm/requirements.txt $BACKUP_DIR/
cp ~/.bashrc $BACKUP_DIR/bashrc
cp ~/.config/anthropic/credentials $BACKUP_DIR/anthropic_credentials

# Create manifest
cat > $BACKUP_DIR/MANIFEST.txt << MANIFEST
Backup created: $(date)
Hostname: $(hostname)
Python: $(python --version)
PyTorch: $(python -c "import torch; print(torch.__version__)")
CUDA: $(nvcc --version | grep release)
MANIFEST

echo "✅ Backup complete: $BACKUP_DIR"
ls -lh $BACKUP_DIR
EOF

chmod +x ~/dws-lwm/scripts/backup_environment.sh

# Create initial backup
~/dws-lwm/scripts/backup_environment.sh
```

### 8.2 Create Quick Reference Card

```bash
cat > ~/dws-lwm/QUICK_REFERENCE.md << 'EOF'
# DWS LWM Quick Reference

## Activation
```bash
source ~/dws-lwm/venv/bin/activate
source ~/.bashrc
```

## Common Commands
```bash
dws                    # cd to ~/dws-lwm
dws-env                # activate venv
gpu                    # watch nvidia-smi
logs                   # tail all logs
```

## Health Check
```bash
python ~/dws-lwm/scripts/system_health_check.py
```

## Monitoring
```bash
# GPU usage
nvidia-smi

# Continuous monitoring
watch -n 1 nvidia-smi

# Detailed GPU stats
nvidia-smi --query-gpu=name,temperature.gpu,utilization.gpu,memory.used,memory.total --format=csv
```

## Troubleshooting
```bash
# Check CUDA
nvcc --version
python -c "import torch; print(torch.cuda.is_available())"

# Check Claude API
python ~/dws-lwm/scripts/test_claude_api.py

# Disk space
df -h ~/dws-lwm
du -sh ~/dws-lwm/*
```

## Session Management
```bash
# Start long-running job in tmux
tmux new-session -s training

# Detach: Ctrl+B, then D
# Reattach: tmux attach -t training
# List sessions: tmux ls
```
EOF

cat ~/dws-lwm/QUICK_REFERENCE.md
```

---

## Section 8: Docker Environment — Full DWS6 Stack (2-3 hours)

The GN-100 must be **as capable as the Win11 development machine** — not just a bare-metal training box. This means Docker with MCP servers, Claude Code with worktree support, and the full training infrastructure.

### 8.1 What We're Building

Two Docker Compose stacks running on the GN-100:

| Stack | File | Services | Purpose |
|-------|------|----------|---------|
| **MCP Services** | `docker-compose.hybrid.yml` | Supabase MCP, MCP Hub, GitHub MCP, Gemini MCP, Redis, Temporal | Claude Code tool access |
| **Training** | `docker-compose.training.yml` | Orchestrator, Dataset Processor, MLflow, Jupyter, vLLM, Quantizer | LWM fine-tuning |

Both stacks share the same Docker network so training containers can log to Supabase and MCP Hub can orchestrate training workflows.

### 8.2 Install Docker Engine + NVIDIA Container Toolkit

```bash
# Docker Engine (not Docker Desktop — this is headless Linux)
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker

# NVIDIA Container Toolkit (enables --runtime=nvidia)
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | \
  sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg
curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \
  sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
  sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list
sudo apt-get update
sudo apt-get install -y nvidia-container-toolkit
sudo nvidia-ctk runtime configure --runtime=docker
sudo systemctl restart docker

# Verify GPU access in Docker
docker run --rm --gpus all nvidia/cuda:12.4.0-base-ubuntu22.04 nvidia-smi
```

**Verification:** You should see your GB10 GPU stats inside the container.

### 8.3 Clone DWS6 Repository

```bash
# Clone main repo
cd ~
git clone https://github.com/lifetime-oy/dws6.git
cd dws6

# Install Claude Code
npm install -g @anthropic-ai/claude-code

# Copy environment files (get these from Win11 machine securely)
# NEVER transfer .env files over unencrypted channels
scp user@win11-machine:/path/to/dws6/.env ~/dws6/.env
scp user@win11-machine:/path/to/dws6/.mcp.json ~/dws6/.mcp.json
scp user@win11-machine:/path/to/dws6/.env.mcp ~/dws6/.env.mcp
scp -r user@win11-machine:/path/to/dws6/.claude ~/dws6/.claude
```

### 8.4 Start MCP Services Stack

```bash
cd ~/dws6

# Start the MCP services (same as Win11)
docker compose -f docker-compose.hybrid.yml up -d

# Verify all services are healthy
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

Expected output:
```
NAMES               STATUS                 PORTS
dws-supabase-mcp    Up 30s (healthy)       0.0.0.0:8766->8766/tcp
dws-mcp-hub         Up 30s (healthy)       0.0.0.0:8765->8765/tcp
dws-github-mcp      Up 30s (healthy)       0.0.0.0:8767->8767/tcp
dws-gemini-mcp      Up 30s (healthy)       0.0.0.0:8768->8768/tcp
dws-mcp-redis       Up 30s (healthy)       0.0.0.0:6380->6379/tcp
dws-temporal         Up 30s                 0.0.0.0:7233->7233/tcp
dws-temporal-ui      Up 30s                 0.0.0.0:8088->8080/tcp
```

### 8.5 Start Training Stack

```bash
cd ~/dws6/infrastructure/llm-training/local

# Create training environment file
cp .env.training.example .env.training
# Edit with your tokens:
#   HF_TOKEN=hf_xxxxx
#   WANDB_API_KEY=xxxxx (optional)
nano .env.training

# Start training infrastructure
docker compose -f docker-compose.training.yml up -d

# Verify training services
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep llm
```

Expected:
```
NAMES                      STATUS                 PORTS
llm-training-orchestrator  Up 30s                 0.0.0.0:8890->8890/tcp, 0.0.0.0:6006->6006/tcp
llm-training-jupyter       Up 30s                 0.0.0.0:8888->8888/tcp
llm-mlflow                 Up 30s (healthy)       0.0.0.0:5000->5000/tcp
llm-training-postgres      Up 30s (healthy)       0.0.0.0:5433->5432/tcp
llm-training-minio         Up 30s (healthy)       0.0.0.0:9000->9000/tcp, 0.0.0.0:9001->9001/tcp
llm-training-redis         Up 30s (healthy)       0.0.0.0:6379->6379/tcp
```

### 8.6 Claude Code + Worktree Setup

```bash
# Verify Claude Code can see MCP tools
cd ~/dws6
claude

# Inside Claude Code, verify:
# - Supabase MCP tools appear (query, list_tables, etc.)
# - GitHub MCP tools appear
# - Can create worktrees using the script
```

Worktree creation on GN-100 (Linux):
```bash
./scripts/new-claude-worktree.sh feature-lwm-training --launch-claude
```

The script will:
1. Create worktree in `~/.claude-worktrees/dws6/feature-lwm-training`
2. Copy `.mcp.json`, `.env`, `.claude/` from main repo
3. Validate MCP servers configured
4. Ping Docker containers and confirm all healthy
5. Launch Claude Code with full MCP tool access

### 8.7 VS Code / Cursor Remote Access (from Win11)

```powershell
# From Win11, connect to GN-100 via SSH Remote
# VS Code:
code --remote ssh-remote+admin100@gn-100.local ~/dws6

# Cursor:
cursor --remote ssh-remote+admin100@gn-100.local ~/dws6
```

Add to `~/.ssh/config` on Win11:
```
Host gn-100
    HostName 192.168.1.XXX
    User admin100
    ForwardAgent yes
    # Forward MCP ports for local browser access
    LocalForward 8888 localhost:8888   # Jupyter
    LocalForward 5000 localhost:5000   # MLflow
    LocalForward 9001 localhost:9001   # MinIO
    LocalForward 6006 localhost:6006   # TensorBoard
    LocalForward 8088 localhost:8088   # Temporal UI
```

### 8.8 Environment Parity Checklist

The GN-100 must match Win11 on ALL of these:

| Capability | Win11 | GN-100 | How |
|------------|-------|--------|-----|
| Claude Code | ✅ Native | ✅ Native | `npm install -g @anthropic-ai/claude-code` |
| MCP: Supabase | ✅ Docker :8766 | ✅ Docker :8766 | `docker-compose.hybrid.yml` |
| MCP: Hub | ✅ Docker :8765 | ✅ Docker :8765 | `docker-compose.hybrid.yml` |
| MCP: GitHub | ✅ Docker :8767 | ✅ Docker :8767 | `docker-compose.hybrid.yml` |
| MCP: Gemini | ✅ Docker :8768 | ✅ Docker :8768 | `docker-compose.hybrid.yml` |
| MCP: Redis | ✅ Docker :6380 | ✅ Docker :6380 | `docker-compose.hybrid.yml` |
| Temporal | ✅ Docker :7233 | ✅ Docker :7233 | `docker-compose.hybrid.yml` |
| Groq Router | ✅ Docker :8083 | ✅ Docker :8083 | `docker-compose.hybrid.yml` |
| Worktree scripts | ✅ PS1 + bash | ✅ bash | `new-claude-worktree.sh` |
| `.mcp.json` auto-copy | ✅ Fixed | ✅ Fixed | Step 4 of 7-step script |
| Docker ping on worktree | ✅ Step 6 | ✅ Step 6 | Health checks in script |
| Git | ✅ | ✅ | `apt install git` |
| Node.js | ✅ | ✅ | `apt install nodejs npm` |
| Python 3.11+ | ✅ | ✅ | Section 4 of this manual |
| **EXTRA: GPU Training** | ❌ No GPU | ✅ GB10 Blackwell | `docker-compose.training.yml` |
| **EXTRA: Jupyter** | ❌ | ✅ :8888 | Training stack |
| **EXTRA: MLflow** | ❌ | ✅ :5000 | Training stack |
| **EXTRA: vLLM** | ❌ | ✅ :8000 | Inference profile |

### 8.9 Ollama for Quick Inference (Optional)

Ollama runs alongside Docker for quick model testing without the full vLLM stack:

```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull models
ollama pull llama3.1:8b
ollama pull llama3.1:70b    # If 128GB unified memory allows

# Test
ollama run llama3.1:8b "What is Fit for 55?"

# Ollama serves on port 11434 by default
# Can be used as inference backend for Claude Code agents
```

**When to use Ollama vs vLLM:**
- **Ollama:** Quick testing, prototyping, single-prompt inference
- **vLLM:** Production inference, high throughput, OpenAI-compatible API, batched requests

---

## Lab Complete! 🎉

### Checklist

Verify all items before proceeding to Part 2:

**Bare Metal:**
- [ ] `nvidia-smi` shows GPU stats
- [ ] PyTorch CUDA available: `python -c "import torch; print(torch.cuda.is_available())"`
- [ ] Claude API responds: `python ~/dws-lwm/scripts/test_claude_api.py`
- [ ] Llama 3.1 8B downloaded: `ls ~/dws-lwm/models/base/llama-3.1-8b/`
- [ ] Virtual environment activates: `source ~/dws-lwm/venv/bin/activate`
- [ ] All checks pass: `python ~/dws-lwm/scripts/system_health_check.py`

**Docker + MCP (Section 8):**
- [ ] Docker GPU access: `docker run --rm --gpus all nvidia/cuda:12.4.0-base-ubuntu22.04 nvidia-smi`
- [ ] MCP services healthy: `docker ps` shows dws-supabase-mcp, dws-mcp-hub, etc.
- [ ] Training services healthy: `docker ps` shows llm-training-orchestrator, llm-mlflow, etc.
- [ ] Claude Code sees MCP tools: launch `claude` and verify Supabase tools available
- [ ] Worktree script works: `./scripts/new-claude-worktree.sh test-gn100`
- [ ] VS Code/Cursor SSH remote works from Win11

### Next Steps

**Proceed to Part 2:** `training-manual-part2-data-training.md`

Part 2 covers:
- Industry-specific data generation with Claude
- QLoRA fine-tuning configuration
- Training execution and monitoring
- Checkpoint management

### Troubleshooting

If any checks failed:

| Issue | Solution |
|-------|----------|
| CUDA not available | Reboot system, verify `nvidia-smi` |
| Claude API fails | Check API key in `~/.config/anthropic/credentials` |
| Model not found | Re-run download script |
| Disk space low | Clean cache: `rm -rf ~/.cache/huggingface` |

### Support

- **Training Manual:** `/home/user/dws6/product-catalog/LWM/training-manual.md`
- **Admin Manual:** `/home/user/dws6/Admin/ADMIN_MANUAL.md`
- **Health Check:** `python ~/dws-lwm/scripts/system_health_check.py`

---

---

## Section 9: Ollama Installation for Code Review (30 minutes)

### 9.1 Install Ollama

Ollama enables self-hosted open-source LLM inference on the GN-100 — used for **Level 5** of the automated PR review pipeline (sovereign, zero-cost code review).

```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Verify installation
ollama --version
# Expected: ollama version 0.x.x

# Start Ollama service
sudo systemctl enable ollama
sudo systemctl start ollama

# Verify service is running
systemctl status ollama
curl http://localhost:11434/api/tags
# Expected: {"models":[]}
```

### 9.2 Pull Code Review Model

```bash
# Pull Qwen3-Coder 30B (MoE 30B total / 3.3B active — recommended for code review)
ollama pull qwen3-coder:30b

# Alternative smaller models:
# ollama pull qwen3:8b               # Smaller dense model, lower VRAM
# ollama pull codellama:13b          # Meta's code model
# ollama pull deepseek-coder-v2:16b  # DeepSeek code model

# Verify model is available
ollama list
# Expected: qwen3-coder:30b   ~19GB (MoE, 3.3B active per token)

# Test inference
ollama run qwen3-coder:30b "Review this Python code for security issues: import os; os.system(input('cmd: '))"
```

### 9.3 Configure Ollama for Network Access

The GN-100 must be reachable from GitHub Actions (via self-hosted runner or tunnel).

```bash
# Option A: Expose on local network
sudo tee /etc/systemd/system/ollama.service.d/override.conf << 'EOF'
[Service]
Environment="OLLAMA_HOST=0.0.0.0:11434"
EOF

sudo systemctl daemon-reload
sudo systemctl restart ollama

# Verify remote access
curl http://gn-100.local:11434/api/tags

# Option B: Use Cloudflare Tunnel (recommended for GitHub Actions)
# Install cloudflared
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared.deb

# Create tunnel (requires Cloudflare account)
cloudflared tunnel login
cloudflared tunnel create gn100-ollama
cloudflared tunnel route dns gn100-ollama gn100-ollama.yourdomain.com

# Run tunnel
cloudflared tunnel run --url http://localhost:11434 gn100-ollama
```

**Option C: SSH local port forward (client → GN100 Ollama)**

From your client machine (Win11, Mac, etc.), open an SSH session that forwards local port 11435 to Ollama (11434) on the GN100. Then Cline, Cursor, or any local tool can use `http://localhost:11435/v1` as an OpenAI-compatible baseUrl.

```bash
# One-time: keep this session open while using Cline/Cursor
ssh -L 11435:localhost:11434 admin100@192.168.101.113
```

- **Local:** `localhost:11435` → **Remote:** `localhost:11434` (Ollama on GN100)
- **User:** `admin100` | **Host:** `192.168.101.113` (use `gn100-cb5d` if DNS resolves, or your GN100 IP)
- In Cline/Cursor: set provider baseUrl to `http://localhost:11435/v1` (no API key for local Ollama).

**Workflow: When opening a terminal to work with Cline + Qwen on Acer**

So that your terminal (and Cline) has access to the Acer’s Qwen/Ollama:

1. **Start the SSH tunnel** (in a terminal; leave it open):
   ```bash
   ssh -L 11435:localhost:11434 admin100@192.168.101.113
   ```
2. **Configure Cline** (or Cursor):
   - **baseUrl:** `http://localhost:11435/v1` (OpenAI-compatible, points at Ollama on the Acer via the tunnel).
   - **API key:** Local Ollama does not require a key — you can leave it blank or use a placeholder (e.g. `ollama`). If Cline’s UI requires a value, any string is fine; Ollama will ignore it.
   - **If you use Cline with the DWS backend** (our API, not Ollama): generate a token and paste it as the API key: `node scripts/generate-cline-api-key.cjs` (from repo root; requires `JWT_SECRET` in `.env`). Use that token as the provider API key when baseUrl points at the DWS endpoint.
- **If Cline’s UI has no Base URL field:** Use **Cursor** instead (see **Cursor setup** below). Same tunnel; Cursor exposes Base URL / override in Settings → Models → OpenAI.
3. **Use the same terminal** (or a new one) for your project; Cline will reach Qwen on the Acer via the tunnel.

Once the tunnel is running, any terminal session on your machine can use `http://localhost:11435` (e.g. `curl http://localhost:11435/api/tags`).

**Cursor setup (local Qwen on Acer) — do this now**

1. Start tunnel: `ssh -L 11435:localhost:11434 admin100@192.168.101.113` (leave the terminal open).
2. **Cursor** → **File** → **Preferences** → **Settings** (Mac: **Cursor** → **Settings**).
3. Left sidebar → **Models**.
4. Under **OpenAI**: set **Override OpenAI Base URL** to `http://localhost:11435/v1`. **API Key:** leave empty if Cursor allows; if it requires a value, use a placeholder (e.g. `ollama`).
5. Click **Verify**. If it succeeds, Cursor is using Qwen on the Acer.
6. **Add custom model:** In Cursor, add a custom model with name `qwen3-coder:30b` (Cursor accepts it). Or use `qwen3-coder:latest` to match what `ollama list` shows on the Acer.
7. Use Chat or Composer; requests go to Qwen via the tunnel.

If you get “Problem reaching OpenAI”, Cursor may be routing via their backend (which cannot reach localhost). Then use **ngrok** to expose port 11435 and put the ngrok HTTPS URL in Base URL, or use **Continue.dev** / **Open WebUI** pointed at `http://localhost:11435` (they talk directly to localhost). Full steps: `docs/field-notes/2026-03-01-veriton-gn100-ollama-dev-environment.md`.

### 9.4 Test Code Review via API

```bash
# Test the Ollama code review API call (same format as Level 5 workflow)
curl -s -X POST http://localhost:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen3-coder:30b",
    "prompt": "Review this TypeScript code for security issues:\n\nconst query = `SELECT * FROM users WHERE id = ${req.params.id}`;\nconst result = await db.query(query);",
    "stream": false,
    "options": {
      "temperature": 0.1,
      "num_predict": 500
    }
  }' | jq '.response'

# Expected: Identifies SQL injection vulnerability
```

### 9.5 GitHub Actions Integration

Add these secrets to your GitHub repository:

| Secret | Value | Purpose |
|--------|-------|---------|
| `OLLAMA_HOST` | `https://gn100-ollama.yourdomain.com` or `http://gn-100.local:11434` | Ollama API endpoint |
| `OLLAMA_MODEL` | `qwen3-coder:30b` | Model to use for Level 5 review |

The Level 5 step in `.github/workflows/ai-pr-review.yml` will automatically call this endpoint when the secrets are configured.

### 9.6 Verify Level 5 Checklist

- [ ] `ollama --version` shows version
- [ ] `ollama list` shows `qwen3-coder:30b`
- [ ] `curl http://localhost:11434/api/tags` returns model list
- [ ] Code review test produces meaningful output
- [ ] Network access configured (local or Cloudflare Tunnel)
- [ ] GitHub secrets `OLLAMA_HOST` and `OLLAMA_MODEL` set

---

**Document Control:**
- **Part:** 1 of 3
- **Version:** 1.1
- **Status:** Lab-tested executable
- **Execution Time:** 5-7 hours (added Ollama setup)
- **Next:** Part 2 - Data Generation & Training

---

*Lifetime Oy - Internal Use Only*

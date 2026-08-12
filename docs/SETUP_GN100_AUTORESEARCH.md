# GN100 Autoresearch Setup — Mobile Power Trio

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/setup-autoresearch-gn100-oemQQ | Date: 20.06.2026 | Changes: Initial creation — 3-device workflow (DGX Spark + Win11 + iPhone), autoresearch installation on GN100, SSH/Mosh/Tailscale configuration, overnight research patterns

Session Links & References:

- Claude Code: https://github.com/blogtheristo/dws6/tree/claude/setup-autoresearch-gn100-oemQQ
- Karpathy autoresearch: https://github.com/karpathy/autoresearch
- Autoresearch skill (Ole Lehmann): https://github.com/olelehmann1337/autoresearch-skill
- DWS autoresearch fork: https://github.com/blogtheristo/autoresearch
- Existing analysis: docs/compare-openclaw-autoresearch.md

Document Status:

- Created: 20.06.2026
- Last Modified: 20.06.2026
- Language: EN
- Languages Available: EN
- Publication Status: ACTIVE

---

## 1. The Mobile Power Trio

| Device                             | Role                                                   | OS           | Best Tool                  |
| ---------------------------------- | ------------------------------------------------------ | ------------ | -------------------------- |
| **Acer Veriton GN100 (DGX Spark)** | The Brain — runs Ollama, Claude Code, autoresearch     | Ubuntu 24.04 | Host (stationary)          |
| **Windows 11 Laptop**              | The Console — high-speed coding via VS Code Remote SSH | Windows 11   | Windows Terminal / VS Code |
| **iPhone**                         | The Remote — monitoring agents, quick fixes on the go  | iOS          | Blink Shell (SSH/Mosh)     |

### Why This Setup Works

- **GN100** has 128GB unified memory (GB10 Superchip) — runs 200B parameter models locally, ~20–30 autoresearch experiments/hour
- **Win11 Laptop** gives full VS Code IDE experience over SSH, no local GPU needed
- **iPhone** with Blink Shell gives biometric SSH (Secure Enclave key + FaceID) and Mosh persistence across network changes

---

## 2. GN100 Setup (Ubuntu 24.04)

### 2.1 Base Prerequisites

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Essential tools
sudo apt install -y git tmux mosh curl build-essential python3-pip

# Node.js 22+ (for Claude Code)
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# uv (Python project manager — Karpathy's choice)
curl -LsSf https://astral.sh/uv/install.sh | sh
source ~/.bashrc
```

### 2.2 Claude Code CLI

```bash
npm install -g @anthropic-ai/claude-code

# Verify
claude --version

# Set API key (store securely)
export ANTHROPIC_API_KEY="sk-ant-..."
echo 'export ANTHROPIC_API_KEY="sk-ant-..."' >> ~/.bashrc
```

### 2.3 Karpathy Autoresearch

```bash
# Clone the DWS fork
cd ~/projects
git clone https://github.com/blogtheristo/autoresearch.git
cd autoresearch

# Install dependencies
uv sync

# Download data + train tokenizer (one-time, ~2 min)
uv run prepare.py

# Test single training experiment (~5 min)
uv run train.py
```

### 2.4 Ollama (Local LLMs)

```bash
# Should already be installed on DGX Spark — verify:
ollama list

# If not installed:
curl -fsSL https://ollama.ai/install.sh | sh

# Pull models for eval
ollama pull llama3.1:70b
ollama pull qwen3:32b
```

### 2.5 Tailscale (Mesh Networking)

```bash
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up

# Note the Tailscale IP (e.g., 100.x.y.z)
tailscale ip -4
```

### 2.6 Mosh (Mobile Shell)

```bash
# Already installed above — verify:
mosh --version

# Ensure firewall allows Mosh UDP ports
sudo ufw allow 60000:61000/udp
```

### 2.7 DWS6 Repository

```bash
cd ~/projects
git clone https://github.com/blogtheristo/dws6.git
cd dws6
npm install
```

---

## 3. Windows 11 Laptop Setup

### 3.1 Tailscale

Download from [tailscale.com/download](https://tailscale.com/download) and sign in with the same account as GN100.

### 3.2 VS Code Remote SSH

1. Install VS Code + Remote-SSH extension
2. Add to `~/.ssh/config`:

```
Host dgx-spark
    HostName 100.x.y.z          # Tailscale IP of GN100
    User risto
    ForwardAgent yes
    ServerAliveInterval 60
    ServerAliveCountMax 3
```

3. In VS Code: `Ctrl+Shift+P` → "Remote-SSH: Connect to Host" → `dgx-spark`
4. Open `/home/risto/projects/dws6`

### 3.3 Windows Terminal

```powershell
# SSH directly
ssh dgx-spark

# Or with Mosh (install via WSL or scoop)
scoop install mosh
mosh dgx-spark
```

### 3.4 Power Settings

Prevent sleep from killing SSH bridges:

```powershell
# When plugged in: never sleep
powercfg /change standby-timeout-ac 0
```

With Tailscale, your iPhone can reach GN100 directly even if the laptop is asleep.

---

## 4. iPhone Setup (Blink Shell)

### 4.1 Install

- [Blink Shell](https://apps.apple.com/app/blink-shell-build-code/id1594898306) from App Store
- [Tailscale](https://apps.apple.com/app/tailscale/id1470499037) from App Store

### 4.2 SSH Key (Secure Enclave)

In Blink Shell:

```
config → Keys → + → Generate in Secure Enclave
```

Copy the public key to GN100:

```bash
# On GN100:
echo "ecdsa-sha2-nistp256 AAAA..." >> ~/.ssh/authorized_keys
```

Now SSH requires FaceID — biometric authentication to your server.

### 4.3 Host Configuration

In Blink Shell → Hosts → Add:

```
Name: dgx-spark
Host: 100.x.y.z          # Tailscale IP
Port: 22
User: risto
Key: [Secure Enclave key]
Mosh: ON
```

One tap to connect. FaceID authenticates. Mosh survives Wi-Fi ↔ 5G transitions.

### 4.4 Teleport (Resume Claude Sessions)

```bash
# Start on laptop:
claude --teleport dev-session

# Close laptop. Open Blink on iPhone:
ssh dgx-spark
claude --teleport dev-session
# Resumes exactly where you left off
```

---

## 5. Running Autoresearch on GN100

### 5.1 Skill Optimization (DWS Skills)

```bash
# SSH into GN100 (from any device)
ssh dgx-spark
cd ~/projects/dws6

# Interactive Claude Code session
claude

# Then invoke:
# /autoresearch TARGET=sitesense CYCLES=10
# /autoresearch TARGET=compliance CYCLES=15 BUDGET_EUR=2.00
```

### 5.2 Overnight Mode (Karpathy-style)

```bash
ssh dgx-spark
tmux new -s overnight-research

# Option A: Karpathy autoresearch (LLM training)
cd ~/projects/autoresearch
claude  # Then: "Let's look at program.md and start a new experiment."

# Option B: DWS skill optimization
cd ~/projects/dws6
claude --print '/autoresearch TARGET=material-oracle CYCLES=20'

# Detach: Ctrl-B D
# Resume from any device: ssh dgx-spark && tmux attach -t overnight-research
```

### 5.3 Monitoring from iPhone

```bash
# Quick status check via Blink Shell:
ssh dgx-spark "cat ~/projects/dws6/autoresearch-*/results.tsv | tail -5"

# Or attach to tmux:
ssh dgx-spark
tmux attach -t overnight-research
```

---

## 6. SSH Config (All-in-One)

Add to `~/.ssh/config` on all devices:

```
Host dgx-spark
    HostName 100.x.y.z
    User risto
    ForwardAgent yes
    ServerAliveInterval 60
    ServerAliveCountMax 3
    # Mosh: connect with `mosh dgx-spark` instead of `ssh`
```

Replace `100.x.y.z` with the actual Tailscale IP from `tailscale ip -4` on GN100.

---

## 7. Security Checklist

- [ ] Tailscale ACLs configured (restrict who can reach GN100)
- [ ] SSH key-only auth (disable password login in `/etc/ssh/sshd_config`)
- [ ] Firewall: only SSH (22), Mosh (60000–61000/udp), Tailscale
- [ ] ANTHROPIC_API_KEY in env var, not in any file
- [ ] KYA governance active for agent sessions on GN100
- [ ] Firehorse audit trail logging to Supabase

---

## 8. Expected Performance

| Metric                         | Value                                 |
| ------------------------------ | ------------------------------------- |
| GPU                            | GB10 Superchip (128GB unified memory) |
| Autoresearch experiments/hour  | 20–30 (with 2.5x firmware boost)      |
| Overnight experiments (10h)    | 200–300                               |
| Ollama model capacity          | Up to 200B parameters                 |
| Skill optimization cycles/hour | 6–12 (depends on skill complexity)    |
| Network                        | Tailscale mesh (encrypted WireGuard)  |

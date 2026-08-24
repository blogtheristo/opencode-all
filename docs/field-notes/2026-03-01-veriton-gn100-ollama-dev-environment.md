# Field Note: Acer Veriton GN100 — Ollama + Dev Environment Setup

***
# VERSION AND AGENT HISTORY

Version: 1.3

Sessions & Modifications:
  - Version: 1.3 | Tool: Claude Code | Date: 04.03.2026 | Changes: Added Cline CLI → Qwen (Ollama) section: OpenAI-compatible API, baseUrl config, checklist (Qwen via Ollama, endpoint, Veriton reachable, Cline baseUrl)
  - Version: 1.2 | Tool: Claude Code (Opus 4.6) | Session: claude/condescending-bouman | Date: 02.03.2026 | Changes: Removed code-server (VS Code Server) — Continue+Ollama chat incompatible with code-server. Primary workflow now Claude Code CLI via Cockpit terminal. Issue reported to VS Code team.
  - Version: 1.1 | Tool: Claude Code (Opus 4.6) | Session: claude/condescending-bouman | Date: 02.03.2026 | Changes: Updated with Continue extension config fix (config.yaml AUTODETECT), secure context notes, complete setup script, and remaining commands
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/condescending-bouman | Date: 01.03.2026 | Changes: Initial field note — documenting Veriton GN100 edge server setup with Ollama, Claude Code CLI, VS Code Server, and GitHub CLI

Session Links & References:
  - Claude Code (claude/condescending-bouman): https://github.com/blogtheristo/dws6/commits/claude/condescending-bouman
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/docs/field-notes/2026-03-01-veriton-gn100-ollama-dev-environment.md

Document Status:
  - Created: 01.03.2026
  - Last Modified: 04.03.2026
  - Language: English
  - Languages Available: English
  - Publication Status: ACTIVE
  - Document Type: Field Note / Lab Setup

Related Documents:
  - product-catalog/LWM/training-manual-part1-infrastructure.md (Section 9: Ollama)
  - product-catalog/LWM/training-manual-part3-evaluation-deployment.md (Section 6: Ollama Deployment)
  - docs/field-notes/2026-02-04-qwen3-coder-next-agentic-llm.md
  - CLAUDE.md (AI Agent Behavior Guidelines)

***

## Context

The Acer Veriton GN100 (`gn100-cb5d`) is the DWS edge AI server. On 01.03.2026, we set up a complete local AI development environment to reduce dependency on paid cloud APIs (Claude Sonnet 4.6, GitHub Copilot) for routine coding tasks.

**Goal:** Run open-source LLMs locally for code generation and review, keeping Claude Opus 4.6 only for complex architecture decisions.

## Hardware Specifications

| Spec | Value |
|------|-------|
| **Model** | Acer Veriton GN100 |
| **Hostname** | gn100-cb5d |
| **CPU** | ARM Cortex-X925, 10 cores @ 3.9GHz |
| **Architecture** | aarch64 (ARM64) |
| **RAM** | 119GB total |
| **OS** | Ubuntu 24.04.4 LTS |
| **Kernel** | Linux 6.17.0-1008-nvidia |
| **Firmware** | 5.36_0ACUM05 (2025-11-17) |
| **Chassis** | Server |
| **GPU** | NVIDIA (integrated, detected by kernel) |

## Network Access

- **Cockpit (admin + terminal):** `https://gn100-cb5d:9090/`
- **Cockpit terminal:** `https://gn100-cb5d:9090/system/terminal`
- **Ollama API:** `http://gn100-cb5d:11434/`
- **VPN Required:** Yes — hostname resolves only through DNA Tietoturva (F-Secure) VPN. Without VPN, DNS returns "Non-existent domain" via local ISP router (`dna.wifi`).

## Software Installed (01.03.2026)

### Ollama (v0.17.4)

```bash
curl -fsSL https://ollama.com/install.sh | sh
# Auto-detected ARM64, installed to /usr/local
# NVIDIA GPU detected automatically
# systemd service enabled
```

- Installed model: `qwen2.5-coder:32b` (~18GB)
- API endpoint: `http://localhost:11434`
- Service: `ollama.service` (systemd, auto-start on boot)

### Node.js (v22.x)

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Claude Code CLI

```bash
sudo npm install -g @anthropic-ai/claude-code
```

To use with local Ollama backend (zero API cost):
```bash
export ANTHROPIC_BASE_URL="http://localhost:11434"
export ANTHROPIC_AUTH_TOKEN="ollama"
export ANTHROPIC_API_KEY=""
```

### ~~VS Code Server (code-server v4.109.2)~~ — REMOVED

**Status:** Removed on 02.03.2026. The code-server chat panel requires GitHub Copilot Chat extension, which is not available for code-server. The Continue extension (v1.2.16) was installed and configured with Ollama AUTODETECT, but could not connect to the chat panel — code-server's VS Code API does not fully support the Continue chat provider interface.

**Issue reported to VS Code team.** May revisit if code-server adds native Ollama/local LLM chat support.

**Primary workflow now:** Claude Code CLI via Cockpit terminal (`https://gn100-cb5d:9090/system/terminal`).

### GitHub CLI (gh v2.45.0)

```bash
sudo apt install gh -y
gh auth login  # GitHub.com → HTTPS → Web browser
```

## Target Workflow

```
Cursor + Qwen 32B (DGX Spark via SSH, FREE)  →  routine coding, first draft
         ↓ complex issues only
Claude Code + Opus 4.6 (Win11, paid)         →  architecture, hard problems
         ↓
GitHub Copilot Codex (Cursor, paid)           →  inline polish, final review
```

### Cost Savings Model

| Task Type | Before (paid) | After (local) |
|-----------|---------------|---------------|
| Routine code generation | Claude Sonnet 4.6 (~$0.50-1.00/task) | Qwen 32B on Veriton ($0) |
| Code review | GitHub Copilot | Qwen 32B on Veriton ($0) |
| Complex architecture | Claude Opus 4.6 | Claude Opus 4.6 (no change) |
| Inline autocomplete | GitHub Copilot | GitHub Copilot (no change) |

## Failed Approaches (VS Code + Ollama Chat)

### Attempt 1: code-server + Continue extension — FAILED

- Installed code-server v4.109.2 with Continue extension v1.2.16
- Continue configured with `config.yaml` AUTODETECT mode for Ollama
- **Result:** code-server chat panel requires GitHub Copilot Chat (not available on code-server). Continue extension installed but chat could not connect to Ollama through the VS Code chat interface.
- **Root cause:** code-server's VS Code API does not fully support third-party chat providers
- **Status:** Issue reported to VS Code team. code-server removed from Veriton.

### Attempt 2: SSH tunnel to Cursor + Qwen — setup steps

Cursor can use the same SSH tunnel to talk to Qwen on the Acer. **Important:** Cursor’s docs say requests may be routed via their backend; if your client sends directly to the override URL, localhost works. If you get “Problem reaching OpenAI” when using a local URL, Cursor is routing via their servers (which cannot reach your localhost); see fallback below.

**Setup (do this now):**

1. **Start the SSH tunnel** (in a terminal; leave it open):
   ```bash
   ssh -L 11435:localhost:11434 admin100@192.168.101.113
   ```
   *(Or use `admin100@gn100-cb5d` if DNS resolves.)*

2. **Open Cursor Settings**
   - **Windows/Linux:** `File` → `Preferences` → `Settings`
   - **Mac:** `Cursor` → `Settings`

3. **Go to Models**
   - In the left sidebar, click **Models**.

4. **Configure OpenAI**
   - Find **OpenAI** in the provider list.
   - **Override OpenAI Base URL:** set to `http://localhost:11435/v1`
   - **API Key:** leave empty if Cursor allows; if the field is required, use a placeholder (e.g. `ollama`). Ollama does not validate it.
   - Click **Verify**. If verification succeeds, Cursor is reaching your local Ollama via the tunnel.

5. **Add custom model**
   - In Cursor, add a custom model with name `qwen2.5-coder:32b` — Cursor accepts it. Alternatives: `qwen2.5-coder:latest`, `qwen:32b` (match `ollama list` on the Acer).

6. **Use Chat/Composer**
   - Start a chat or composer; it should use Qwen on the Acer via the tunnel.

**If you get “Problem reaching OpenAI” or verification fails:** Cursor may be sending requests through their backend, which cannot reach `localhost`. Then either: (a) expose your tunnel with **ngrok** so the URL is public (`ngrok http 11435` → use the HTTPS URL in Cursor’s Base URL), or (b) use **Continue.dev** (VS Code extension) or **Open WebUI** in the browser pointed at `http://localhost:11435` — they talk directly to localhost.

**Note:** Port 11435 is used on the client so local Ollama (if any) can keep using 11434.

### Attempt 3: Claude Code CLI + Ollama — FAILED (tool API incompatible)

- Claude Code requires Anthropic tool use API format
- Ollama's Qwen models return "does not support tools" error
- **Root cause:** Claude Code's tool calls (file read, bash, edit) require API compatibility that Ollama doesn't provide
- Claude Code only works with Anthropic's own API

### Working Approach: Cursor (Win11) + SSH tunnel to DGX Spark Ollama

The working path is Cursor IDE on Win11 connected to Qwen 32B on the DGX Spark via SSH tunnel. Claude Code CLI remains on Win11 with Anthropic API for complex tasks.

### Cline CLI → Qwen on Acer Veriton (Ollama)

**Yes** — if the Qwen instance on the Acer Veriton is served via **Ollama**, it exposes an **OpenAI-compatible HTTP API**. Cline (and other tools) can connect to it by pointing at that endpoint.

**Why:** Cline and similar IDEs connect to local/self-hosted models when they expose an OpenAI-compatible API. Ollama does exactly that (see [Qwen + Ollama](https://qwenlm.github.io) and [Ollama OpenAI API](https://github.com/ollama/ollama/blob/main/docs/api.md)).

**Requirements:**

| Check | Description |
|-------|-------------|
| ✅ Qwen model running via Ollama | e.g. `ollama run qwen2.5-coder:32b` or service on Veriton |
| ✅ OpenAI-compatible API | Ollama serves `/v1/chat/completions` etc. on port 11434 by default |
| ✅ Veriton IP + port reachable | From the machine where Cline runs (VPN or same LAN; expose with `OLLAMA_HOST=0.0.0.0:11434` if needed) |
| ✅ Cline configured with baseUrl | In Cline settings: set **baseUrl** to the Ollama endpoint (e.g. `http://gn100-cb5d:11434/v1` or `http://<veriton-ip>:11434/v1`) |

**Steps:**

1. On the Veriton: run Qwen via Ollama (see Section "Expose Ollama on network" below).
2. Ensure Ollama is bound to `0.0.0.0:11434` so Cline’s machine can reach it.
3. In Cline: add/set the model provider to use an **OpenAI-compatible** endpoint with **baseUrl** = `http://<veriton-ip-or-hostname>:11434/v1` (no API key required for local Ollama, or use a placeholder if the UI requires one).

If the Veriton is only reachable via VPN, use the Veriton hostname (e.g. `gn100-cb5d`) or its VPN IP. If Cline runs on another machine, use the Veriton’s IP on your network (or an SSH tunnel to `localhost:11434` and then `baseUrl: http://localhost:11434/v1`).

**DWS API key for Cline (when using a DWS backend endpoint):** To use Cline with a DWS-hosted OpenAI-compatible or agent endpoint that requires auth, generate a long-lived JWT and paste it as the API key in Cline. From the repo root: `node scripts/generate-cline-api-key.cjs` — outputs a 90-day token. Set it in Cline as the provider API key, or use as `DWS_API_TOKEN` for the `dws` CLI. Do not commit the token.

## Remaining Setup Commands

Run these on the Veriton (Cockpit terminal):

### 1. Expose Ollama on network (for Win11 access)

```bash
sudo mkdir -p /etc/systemd/system/ollama.service.d
sudo tee /etc/systemd/system/ollama.service.d/override.conf << 'EOF'
[Service]
Environment="OLLAMA_HOST=0.0.0.0:11434"
EOF
sudo systemctl daemon-reload
sudo systemctl restart ollama
```

### 3. Configure Claude Code to use local Ollama

```bash
cat >> ~/.bashrc << 'EOF'

# Claude Code + Ollama (local Qwen 32B, zero API cost)
export ANTHROPIC_BASE_URL="http://localhost:11434"
export ANTHROPIC_AUTH_TOKEN="ollama"
export ANTHROPIC_API_KEY=""
EOF
source ~/.bashrc
```

### 4. Test Claude Code with Qwen

```bash
cd ~/dws6
claude "Explain the project structure in 3 sentences"
```

## Completed Setup Tasks

- [x] Install Ollama v0.17.4 (ARM64 auto-detected)
- [x] Pull `qwen2.5-coder:32b` model (19GB)
- [x] Install Node.js v22.x
- [x] Install Claude Code CLI
- [x] ~~Install VS Code Server (code-server v4.109.2)~~ — removed, chat incompatible with Ollama
- [x] Install GitHub CLI (gh v2.45.0)
- [x] Authenticate `gh auth login`
- [x] Clone `dws6` repo to `~/dws6`

## Remaining Setup Tasks

- [ ] Expose Ollama on network (Section above — #1)
- [ ] Configure Claude Code Ollama env vars (Section above — #2)
- [ ] Test Claude Code + Qwen 32B end-to-end (Section above — #3)
- [ ] Capture `nvidia-smi` output to confirm GPU model and VRAM
- [ ] Set up SSH access as alternative to Cockpit terminal

## Observations

1. **ARM64 compatibility** — Ollama install script auto-detected `arm64` and pulled correct binary (`ollama-linux-arm64.tar.zst`). No manual intervention needed.
2. **NVIDIA kernel** — The `6.17.0-1008-nvidia` kernel indicates deep GPU integration. `nvidia-smi` output not yet captured — needed to confirm GPU model and VRAM.
3. **119GB RAM** — Sufficient to run multiple 32B parameter models simultaneously. Could run Qwen 32B + a second model for multi-model review pipeline.
4. **VPN dependency** — The Veriton is only accessible via VPN. Consider Cloudflare Tunnel as backup access path (documented in training-manual-part1, Section 9.3).
5. **code-server removed** — Could not get Ollama chat working via Continue extension or native VS Code chat. SSH tunnel to Cursor also failed. Claude Code CLI via Cockpit terminal is the working path.
6. **VS Code team notified** — Issue reported. May revisit if code-server or Cursor adds native local LLM chat support.

## References

- Training Manual Part 1: `product-catalog/LWM/training-manual-part1-infrastructure.md`
- Training Manual Part 3: `product-catalog/LWM/training-manual-part3-evaluation-deployment.md`
- Ollama Anthropic API compatibility: https://ollama.com/blog/claude
- Claude Code + Ollama integration: https://docs.ollama.com/integrations/claude-code
- Continue Ollama Guide (attempted, not working on code-server): https://docs.continue.dev/guides/ollama-guide
- Qwen (Ollama): https://qwenlm.github.io — run Qwen via Ollama for an OpenAI-compatible server

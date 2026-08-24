# Field Note: DGX Spark — Hardened Unit, Firewall & Rejecting SSH/Ollama Calls

***
# VERSION AND AGENT HISTORY

Version: 1.2

Sessions & Modifications:
  - Version: 1.0 | Tool: Cursor AI | Date: 06.03.2026 | Changes: Initial note — DGX Spark hardened unit; whether SSH/Ollama calls can be rejected; terminal commands to check if firewall is installed
  - Version: 1.1 | Tool: Cursor AI | Date: 06.03.2026 | Changes: Grep summary of NVIDIA/DGX Spark hardening from repo; added "What is needed for tunnel Qwen start to work" (SSH, Ollama, Qwen, port forward, Cursor config)
  - Version: 1.2 | Tool: Cursor AI | Date: 06.03.2026 | Changes: Added troubleshooting "firewall-cmd --state says no firewall but SSH/Ollama still refused" — iptables/nftables, ufw, sshd, Ollama binding, SELinux, network

Document Status:
  - Created: 06.03.2026
  - Last Modified: 06.03.2026
  - Language: English
  - Publication Status: ACTIVE
  - Document Type: Field Note / Infrastructure

***

## Context

**DGX Spark** is a hardened unit. Question: is it possible to reject SSH and Ollama API calls from unwanted sources? This note records how to check for an installed firewall and options to restrict access.

---

## NVIDIA / DGX Spark hardening (from repo)

| Source | What the repo says |
|--------|--------------------|
| This note | DGX Spark = hardened unit; reject SSH/Ollama via firewall, sshd_config, or Ollama bound to 127.0.0.1 + SSH tunnel. |
| `2026-03-01-veriton-gn100-ollama-dev-environment.md` | Working path: **Cursor (Win11) + SSH tunnel to DGX Spark Ollama**; Qwen 32B on DGX Spark; Claude Code stays on Win11 with Anthropic API. |
| `training-manual-part1-infrastructure.md` | Option C: SSH local port forward — client runs `ssh -L 11435:localhost:11434 user@host`; Cline/Cursor use `http://localhost:11435/v1`. Ollama can stay on 127.0.0.1 on host. |
| `sales-outreach/enterprise-sales.md` | “NVIDIA Jetson security hardening” as DWS-specific. |
| `Admin/Security/*`, `DWS7_ROADMAP.md` | General “security hardening” (not DGX-specific). |
| `NVIDIA_INCEPTION_IMPROVEMENTS.md`, `V1_LWM.md` | DGX Cloud for training (H100); DGX Spark in this note = edge/hardened unit for local inference. |

**Takeaway:** On a hardened DGX Spark, use firewall + (optionally) Ollama bound to localhost; allow only SSH from trusted IPs; use SSH tunnel for “tunnel Qwen start” so Ollama never needs to be exposed on the network.

---

## Is it possible to reject SSH / Ollama calls?

**Yes.** Options on a hardened DGX Spark (or similar RHEL/Cockpit host):

1. **Firewall (firewalld)** — Allow only specific source IPs or interfaces for SSH (22) and/or Ollama (11434); drop or reject everything else.
2. **sshd_config** — Restrict SSH (e.g. `AllowUsers`, `AllowGroups`, `ListenAddress` to a specific IP).
3. **Ollama binding** — Run Ollama listening only on `127.0.0.1` so it is not reachable from the network; use SSH port-forwarding for remote Ollama access (e.g. `ssh -L 11434:localhost:11434 user@dgx-spark`).

Using firewall + binding Ollama to localhost gives strongest isolation: SSH can be restricted by IP, and Ollama is only reachable via SSH tunnel.

---

## Terminal commands: is a firewall installed?

On **RHEL / CentOS / Fedora** (firewalld):

```bash
# Is firewalld installed and running?
systemctl status firewalld

# Or one-line state
firewall-cmd --state
```

- **`active`** = firewall is running.  
- **`inactive`** or **`not running`** = firewalld is not active (but something else may still be blocking — see below).

Check if the **firewalld** package is installed:

```bash
rpm -q firewalld
# or
which firewall-cmd
```

On **Ubuntu/Debian** (often ufw, or iptables):

```bash
# UFW
sudo ufw status

# Or check if ufw is installed
dpkg -l | grep ufw
which ufw
```

On **any Linux** (generic):

```bash
# See if iptables/nftables has rules (kernel firewall)
sudo iptables -L -n 2>/dev/null | head -20
# or
sudo nft list ruleset 2>/dev/null | head -30
```

---

## “firewall-cmd --state” says no firewall but SSH/Ollama is still refused

If **firewall-cmd --state** shows no firewall (inactive or not installed) and the host is still **refusing SSH or Ollama**, the block is coming from somewhere else. Check the following **on the DGX Spark (or Veriton) host**:

| Check | Command | What to look for |
|-------|---------|-------------------|
| **1. Kernel firewall (iptables/nftables)** | `sudo iptables -L -n -v` and/or `sudo nft list ruleset` | Any DROP/REJECT for port 22 or 11434. Even with firewalld off, iptables/nftables can have rules. |
| **2. UFW (Ubuntu)** | `sudo ufw status verbose` | UFW can be active on Ubuntu while firewalld is absent. |
| **3. SSH daemon** | `systemctl status sshd` or `systemctl status ssh` | Must be **active**. If not: `sudo systemctl start sshd` and `sudo systemctl enable sshd`. |
| **4. SSH listening** | `ss -tlnp \| grep 22` or `sudo netstat -tlnp \| grep 22` | Should show sshd on port 22. If `ListenAddress` in sshd_config is set to a specific IP, you must use that IP. |
| **5. Ollama service** | `systemctl status ollama` | Must be **active**. If not: `sudo systemctl start ollama`. |
| **6. Ollama listening** | `ss -tlnp \| grep 11434` or `curl -s http://127.0.0.1:11434/api/tags` (on host) | If Ollama is bound to **127.0.0.1 only**, it will not accept connections from the network — use **SSH tunnel** from the client and point Cursor at `http://localhost:11435/v1`. |
| **7. SELinux** | `getenforce` | If **Enforcing**, SELinux can block sshd or network binding. Try `sudo setenforce 0` temporarily to test (revert with `sudo setenforce 1`); if that fixes it, add a proper SELinux rule or boolean instead of leaving permissive. |
| **8. Network / routing** | From client: `ping <host-ip>`; `telnet <host-ip> 22` or `nc -zv <host-ip> 22` | If ping or TCP 22 fails, the host is unreachable (wrong VLAN, VPN, or host firewall on another interface). |

**Typical case:** Firewalld is off but **iptables/nftables** has leftover rules, or **Ollama is bound to 127.0.0.1** and you’re trying to hit the host IP:11434 from the client (that will always fail until you use the SSH tunnel and `localhost:11435` on the client).

**Reading iptables output:** If **Chain INPUT (policy ACCEPT)** and there are no rules in INPUT that DROP/REJECT port 22 or 11434, then iptables is **not** blocking SSH or Ollama to this host. The DOCKER-* chains affect **forwarded** traffic (container networking), not traffic destined to the host. So if you see INPUT ACCEPT and no blocking rules there, look next at: **sshd** (running? listening on 22?), **Ollama** (running? bound to 0.0.0.0 or only 127.0.0.1?), and **SELinux** (`getenforce`).

---

## Summary

| Question | Answer |
|----------|--------|
| Can we reject SSH/Ollama calls? | Yes — firewall rules, sshd_config, and/or binding Ollama to 127.0.0.1. |
| Command to see if firewall is installed (RHEL) | `firewall-cmd --state` or `systemctl status firewalld` |
| Command to see if firewall is installed (Ubuntu) | `sudo ufw status` or `dpkg -l \| grep ufw` |

---

## What is needed for “tunnel Qwen start” to work

For **Cursor (Win11) + SSH tunnel → Qwen on DGX Spark / Ollama** to work, all of the following are required:

| # | Requirement | Where / How |
|---|-------------|--------------|
| 1 | **SSH access** to the DGX Spark (or Veriton GN100) | SSH server enabled; user/key (e.g. `admin100@192.168.101.113` or `admin100@gn100-cb5d`). Firewall must allow SSH (port 22) from your client IP if the unit is hardened. |
| 2 | **Ollama running on the remote host** | `systemctl status ollama`; Ollama can listen on `127.0.0.1:11434` only (no need to expose 11434 on the network when using tunnel). |
| 3 | **Qwen model available in Ollama** | On the host: `ollama list` shows e.g. `qwen2.5-coder:32b`; `ollama run qwen2.5-coder:32b "test"` works. |
| 4 | **SSH local port forward** (tunnel) | From the client machine, run and leave open: `ssh -L 11435:localhost:11434 admin100@192.168.101.113` (replace with your user@host). Then `localhost:11435` on the client = Ollama on the remote host. |
| 5 | **Cursor (or Cline) configured** | **Override OpenAI Base URL** = `http://localhost:11435/v1`; **API Key** = empty or placeholder `ollama`. Add custom model name to match Ollama (e.g. `qwen2.5-coder:32b`). Click **Verify**. |
| 6 | **No firewall blocking loopback on client** | Client must allow localhost:11435; normally no change needed. |

**One-line “tunnel Qwen start” (run on your Windows/Linux client, leave terminal open):**

```bash
ssh -L 11435:localhost:11434 admin100@192.168.101.113
```

Then in **Cursor (the IDE)**: Base URL `http://localhost:11435/v1` → Qwen runs on the DGX Spark; no need to open Ollama port 11434 on the firewall when using this tunnel.

**Cursor IDE vs terminal cursor:** If you ask “Cursor has difficulties to use Ollama over SSH”, some LLMs interpret “cursor” as the terminal caret and suggest `ssh -t`, TERM, or tmux — that’s the wrong meaning. Here we mean **Cursor the IDE**: it must call Ollama’s **HTTP API** via the tunnel. Fix: (1) run the SSH tunnel above, (2) Cursor → Settings → Models → Override OpenAI Base URL = `http://localhost:11435/v1`, model e.g. `qwen2.5-coder:32b`. No terminal options needed.

---

## Testing the tunnel and Ollama API

**Ports:** On the **host** (Cockpit/SSH session on the server), Ollama listens on **11434**. Port **11435** exists only on your **client** (Windows) as the tunnel’s local end.

| Where you run the command | Correct URL | Wrong URL |
|--------------------------|-------------|-----------|
| **On the host** (Cockpit terminal, or SSH session on 192.168.101.113) | `curl -s http://localhost:11434/api/tags` | `localhost:11435` — nothing listens on 11435 on the host |
| **On the client** (Windows, with tunnel open) | `curl -s http://localhost:11435/api/tags` | `localhost:11434` — that’s your local machine, not the host |

- **On the host:** If `curl -s http://localhost:11434/api/tags` returns JSON (e.g. `{"models":[...]}` or `{"models":[]}`), Ollama is running and the API is correct. If it fails or “connection refused”, run `systemctl status ollama` and `ss -tlnp | grep 11434`. To confirm the model works interactively: `ollama run qwen2.5-coder:32b` then type e.g. `hello` — you should get a reply.
- **On the client:** With the SSH tunnel open, `curl -s http://localhost:11435/api/tags` should return the same as on the host. If it’s empty or fails, the tunnel may not be forwarding (e.g. restart the SSH session and try again, or use `ssh -v -L 11435:127.0.0.1:11434 admin100@192.168.101.113` to see tunnel bind).

---

## What's actually wrong when Cursor doesn't use Ollama

1. **Tunnel not working from client** — Run `.\scripts\test-ollama-tunnel.ps1` (or `curl -s http://localhost:11435/api/tags`) on Windows with the tunnel open. If it fails, fix SSH/Ollama first; Cursor can't work until this passes.

2. **Tunnel works but Cursor still doesn't use Ollama** — Cursor may send requests via their backend, which cannot reach your localhost. **Fixes:** (A) **ngrok** — run `ngrok http 11435`, then set Cursor Base URL to the HTTPS URL ngrok gives (e.g. `https://xxxx.ngrok.io/v1`). (B) Use **Continue.dev** or **Open WebUI** pointed at `http://localhost:11435`; they talk directly to localhost. The repo has `.cursor/settings.json` with `openai.baseUrl`; if the tunnel test passes but Cursor fails, the limit is Cursor backend routing — use ngrok or Continue/Open WebUI.

---

## Related

- Cockpit on same host: HTTP only, port 9090, opened with `firewall-cmd --add-service=cockpit --permanent` and `firewall-cmd --reload`.
- docs/field-notes/2026-03-01-veriton-gn100-ollama-dev-environment.md — Ollama on Veriton GN100; Cursor + SSH tunnel to DGX Spark Ollama; Cline + Qwen.
- product-catalog/LWM/training-manual-part1-infrastructure.md — Section 9 (Ollama), Option C (SSH tunnel), workflow “When opening a terminal to work with Cline + Qwen on Acer”.

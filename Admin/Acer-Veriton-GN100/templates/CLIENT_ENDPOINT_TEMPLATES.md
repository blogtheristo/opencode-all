# Client Endpoint Templates for Veriton-Hosted Services

Use these templates when connecting client-side tools to a Veriton-hosted inference or sandbox service.

---

## 1. Cursor

### Tunnel mode

- Start tunnel:

```bash
ssh -L 11435:localhost:11434 admin100@<veriton-host>
```

- Base URL:

```text
http://localhost:11435
```

- If the client requires an OpenAI-compatible path, use:

```text
http://localhost:11435/v1
```

- API key:

```text
ollama
```

### Direct private-network mode

- Base URL:

```text
http://<veriton-host>:11434
```

or:

```text
http://<veriton-host>:11434/v1
```

---

## 2. Continue

Use one of these files directly:

- `templates/continue-ollama-tunnel.yaml`
- `templates/continue-ollama-direct.yaml`

---

## 3. Cline / OpenAI-compatible clients

### Tunnel mode

```text
Base URL: http://localhost:11435/v1
API Key: ollama
Model: qwen3-coder:30b
```

### Direct mode

```text
Base URL: http://<veriton-host>:11434/v1
API Key: ollama
Model: qwen3-coder:30b
```

---

## 4. OpenSandbox

Backend or MCP-side integration template:

```text
SANDBOX_STAGE=opensandbox
OPENSANDBOX_HOST=http://<veriton-host>:8080
OPENSANDBOX_API_KEY=<secret-if-enabled>
```

---

## 5. MCP Hub / DWS Backend

App-layer connectivity should prefer:

```text
DWS_API_URL=https://your-dws-backend.example.com
MCP_HUB_URL=https://your-mcp-hub.example.com
SUPABASE_URL=https://your-project.supabase.co
```

See also:

- `templates/veriton-edge-config.example`
- `Admin/Acer-Veriton-GN100/VERITON_EDGE_STACK_RUNBOOK.md`

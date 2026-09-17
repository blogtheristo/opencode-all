#!/usr/bin/env bash
set -euo pipefail

echo "[1/8] Installing base packages..."
sudo apt update
sudo apt install -y git curl jq python3 python3-pip ripgrep

echo "[2/8] Creating workspace layout..."
mkdir -p "$HOME/workspace"/{open,sovereign,tools,logs}

echo "[3/8] Writing VS Code workspace policy files..."
cat > "$HOME/workspace/open/open.code-workspace" << 'JSON'
{
  "folders": [{ "path": "." }],
  "settings": {
    "github.copilot.enable": {
      "*": true,
      "plaintext": false,
      "markdown": true,
      "scminput": false
    },
    "github.copilot.chat.agent.enabled": true,
    "editor.inlineSuggest.enabled": true
  }
}
JSON

cat > "$HOME/workspace/sovereign/sovereign.code-workspace" << 'JSON'
{
  "folders": [{ "path": "." }],
  "settings": {
    "github.copilot.enable": { "*": false },
    "github.copilot.chat.agent.enabled": false,
    "github.copilot.editor.enableAutoCompletions": false,
    "editor.inlineSuggest.enabled": false
  }
}
JSON

echo "[4/8] Installing pre-commit..."
python3 -m pip install --user --upgrade pre-commit

echo "[5/8] Installing gitleaks..."
TMPDIR="$(mktemp -d)"
cd "$TMPDIR"
curl -sSL https://github.com/gitleaks/gitleaks/releases/latest/download/gitleaks_linux_x64.tar.gz | tar -xz
sudo install -m 0755 gitleaks /usr/local/bin/gitleaks
cd - >/dev/null
rm -rf "$TMPDIR"

echo "[6/8] Creating global gitignore..."
touch "$HOME/.gitignore_global"
grep -qxF '.env' "$HOME/.gitignore_global" || cat >> "$HOME/.gitignore_global" << 'EOG'
.env
*.pem
*.key
secrets.*
EOG
git config --global core.excludesfile "$HOME/.gitignore_global"

echo "[7/8] Writing local policy router..."
cat > "$HOME/workspace/tools/policy_router.py" << 'PY'
#!/usr/bin/env python3
import argparse, json, os, re, subprocess
from pathlib import Path

SOVEREIGN_ROOT = str(Path.home() / "workspace" / "sovereign")
DEFAULT_LOCAL_MODEL = os.getenv("LOCAL_MODEL", "qwen2.5-coder:14b")

SENSITIVE_PATTERNS = [
    r"\b(secret|token|apikey|api_key|password|private key)\b",
    r"\b(itar|ear|sovereign|classified|cui|export control)\b",
    r"\b(ssn|phi|hipaa|pci|pii|gdpr)\b",
    r"\b(customer data|production dump|regulated)\b",
]

def is_sensitive(text: str) -> bool:
    return any(re.search(p, text, re.IGNORECASE) for p in SENSITIVE_PATTERNS)

def path_is_sovereign(path: str) -> bool:
    if not path:
        return False
    return str(Path(path).resolve()).startswith(str(Path(SOVEREIGN_ROOT).resolve()))

def run_ollama(prompt: str, model: str):
    payload = {"model": model, "messages": [{"role":"user","content":prompt}], "stream": False}
    out = subprocess.check_output(
        ["curl","-sS","http://127.0.0.1:11434/api/chat","-d",json.dumps(payload)],
        text=True
    )
    data = json.loads(out)
    print(data.get("message",{}).get("content","").strip())

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--prompt", required=True)
    ap.add_argument("--repo-path", default="")
    ap.add_argument("--force-local", action="store_true")
    ap.add_argument("--model", default=DEFAULT_LOCAL_MODEL)
    args = ap.parse_args()

    if args.force_local or path_is_sovereign(args.repo_path) or is_sensitive(args.prompt):
        print("[ROUTE] local-ollama")
        run_ollama(args.prompt, args.model)
    else:
        print("[ROUTE] copilot-allowed")
        print("Use Copilot CLI for non-sensitive tasks.")
PY
chmod +x "$HOME/workspace/tools/policy_router.py"

echo "[8/8] Installing sovereign shell helpers..."
if ! grep -q "sovereign_on ()" "$HOME/.bashrc"; then
cat >> "$HOME/.bashrc" << 'EOS'

sovereign_on () {
  export SOVEREIGN_MODE=1
  export NO_CLOUD_LLM=1
  echo "[mode] sovereign enabled (local models only)"
}
sovereign_off () {
  unset SOVEREIGN_MODE
  unset NO_CLOUD_LLM
  echo "[mode] sovereign disabled"
}
EOS
fi

echo
echo "Bootstrap complete."
echo "Next:"
echo "  chmod +x ~/bootstrap_dgx_sovereign.sh"
echo "  ~/bootstrap_dgx_sovereign.sh"
echo "  source ~/.bashrc"
echo "  ollama pull qwen2.5-coder:14b"
echo "  ~/workspace/tools/policy_router.py --repo-path ~/workspace/sovereign --prompt 'review regulated pipeline'"

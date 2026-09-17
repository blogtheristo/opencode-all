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

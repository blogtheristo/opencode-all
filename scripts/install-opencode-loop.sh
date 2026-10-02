#!/usr/bin/env bash
# Evidence: Tool=Claude Code Model=anthropic/claude-opus-5-5 Agent=install-opencode-loop Date=2026-09-30
# Audit trail: git log -- scripts/install-opencode-loop.sh
# One-time (idempotent) DGX setup: the opencode loop (tmux oc-loop) starts at boot and is re-checked
# every 15 min (crash recovery + open-PR queue refresh), `hic` and `opencode-all` are on PATH, and the login banner shows the HIC digest.
# Run on the DGX from ~/dws6:   bash scripts/install-opencode-loop.sh [--uninstall]
set -euo pipefail

REPO="$(cd "$(dirname "$0")/.." && pwd)"
UNITS="$REPO/infrastructure/dgx-spark/opencode-loop"
UDIR="$HOME/.config/systemd/user"
BIN="$HOME/.local/bin"
MARK="# >>> dws6 hic banner >>>"
ENDMARK="# <<< dws6 hic banner <<<"

if [[ "${1:-}" == "--uninstall" ]]; then
  systemctl --user disable --now opencode-loop.timer 2>/dev/null || true
  for f in opencode-loop.service opencode-loop.timer; do
    [[ -e "$UDIR/$f" ]] && mv "$UDIR/$f" "$UDIR/$f._OLD"   # repo rule: rename, never delete
  done
  systemctl --user daemon-reload
  echo "uninstalled (units renamed to *._OLD; ~/.bashrc banner block left — remove between the dws6 hic markers)"
  exit 0
fi

command -v systemctl >/dev/null || { echo "systemctl not found — this is for the DGX"; exit 1; }
command -v node >/dev/null || { echo "node not on PATH"; exit 1; }
command -v gh >/dev/null || echo "WARN: gh not found — hic and --prs need it"
gh auth status >/dev/null 2>&1 || echo "WARN: gh is not authenticated — run: gh auth login"

mkdir -p "$UDIR" "$BIN"
for f in opencode-loop.service opencode-loop.timer; do
  cp "$UNITS/$f" "$UDIR/$f"
done

# Commands: hic, opencode-all
printf '#!/usr/bin/env bash\nexec node "%s/scripts/hic.mjs" "$@"\n' "$REPO" > "$BIN/hic"
printf '#!/usr/bin/env bash\ncd "%s" && exec bash scripts/opencode-open-all.sh "$@"\n' "$REPO" > "$BIN/opencode-all"
chmod +x "$BIN/hic" "$BIN/opencode-all"

# Login banner (idempotent block; --brief is one line and never fails the login)
if ! grep -qF "$MARK" "$HOME/.bashrc" 2>/dev/null; then
  {
    echo "$MARK"
    echo 'case ":$PATH:" in *":$HOME/.local/bin:"*) ;; *) export PATH="$HOME/.local/bin:$PATH" ;; esac'
    echo '[[ $- == *i* ]] && command -v hic >/dev/null && timeout 15 hic --brief 2>/dev/null || true'
    echo "$ENDMARK"
  } >> "$HOME/.bashrc"
fi

# Survive logout/reboot without an open session
loginctl enable-linger "$USER" 2>/dev/null || echo "WARN: enable-linger failed — services stop at logout (run: sudo loginctl enable-linger $USER)"

systemctl --user daemon-reload
systemctl --user enable --now opencode-loop.timer
systemctl --user start opencode-loop.service || true

echo
systemctl --user --no-pager --lines=0 status opencode-loop.timer | grep -E "●|Active:" || true
echo
echo "Done. Open a new shell (or: source ~/.bashrc), then:  hic"
echo "Optional env (model, timeouts): ~/.config/opencode-loop.env  e.g. OPENCODE_LOOP_MODEL=ollama-local/qwen3-coder-next:latest"

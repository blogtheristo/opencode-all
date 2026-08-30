#!/bin/bash
#
# tmux-opencode-image.sh — Send an image or tmux pane content to OpenCode.
#
# Modes:
#   screenshot [region|window|full]   Capture screen → send to OpenCode
#   pane                             Capture active tmux pane text → send to OpenCode
#   file <path>                      Send an existing image/text file to OpenCode
#
# Usage:
#   ./tmux-opencode-image.sh screenshot [region|window|full] ["prompt"]
#   ./tmux-opencode-image.sh pane ["prompt"]
#   ./tmux-opencode-image.sh file ~/Pictures/bug.png ["prompt"]
#
# Examples:
#   ./tmux-opencode-image.sh screenshot region "what's wrong here"
#   ./tmux-opencode-image.sh pane "review this code"
#   ./tmux-opencode-image.sh file /tmp/error.png "explain this error"
#
# Tmux keybindings (add to ~/.tmux.conf):
#   bind-key I capture-pane -p | bash ~/dws6/scripts/tmux-opencode-image.sh pane "review"
#   bind-key S run-shell 'bash ~/dws6/scripts/tmux-opencode-image.sh screenshot full "describe"'
#

set -euo pipefail

# ---- Config -----------------------------------------------------------------
MODEL="${OPENCODE_MODEL:-opencode/mimo-v2.5-free}"
TMPDIR="${TMPDIR:-/tmp}"
CODE_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# ---- Colors -----------------------------------------------------------------
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'
info()  { echo -e "${GREEN}[opencode-img]${NC} $1"; }
warn()  { echo -e "${YELLOW}[opencode-img]${NC} $1"; }
error() { echo -e "${RED}[opencode-img]${NC} $1" >&2; exit 1; }

# ---- Dependency check --------------------------------------------------------
check_deps() {
    local missing=()
    for cmd in "$@"; do
        command -v "$cmd" &>/dev/null || missing+=("$cmd")
    done
    if [[ ${#missing[@]} -gt 0 ]]; then
        error "Missing: ${missing[*]}"
    fi
}

# ---- Screenshot (requires display) -------------------------------------------
capture_screenshot() {
    local mode="${1:-region}"
    local outfile="$TMPDIR/opencode-screenshot-$(date +%s).png"

    if [[ -z "${DISPLAY:-}" && -z "${WAYLAND_DISPLAY:-}" ]]; then
        error "No display server detected (DISPLAY/WAYLAND_DISPLAY unset). Use 'pane' or 'file' mode on headless servers."
    fi

    case "$mode" in
        full)
            if command -v gnome-screenshot &>/dev/null; then
                gnome-screenshot -f "$outfile"
            elif command -v scrot &>/dev/null; then
                scrot "$outfile"
            elif command -v import &>/dev/null; then
                import -window root "$outfile"
            elif command -v xwd &>/dev/null; then
                xwd -root -out "$TMPDIR/opencode-screenshot.xwd"
                convert "$TMPDIR/opencode-screenshot.xwd" "$outfile" 2>/dev/null || error "xwd needs ImageMagick convert"
            else
                error "No screenshot tool found. Install: sudo apt install gnome-screenshot scrot imagemagick"
            fi
            ;;
        window)
            if command -v gnome-screenshot &>/dev/null; then
                gnome-screenshot -w -f "$outfile"
            elif command -v scrot &>/dev/null; then
                scrot -u "$outfile"
            else
                error "Install gnome-screenshot or scrot for window capture"
            fi
            ;;
        region)
            if command -v gnome-screenshot &>/dev/null; then
                gnome-screenshot -a -f "$outfile"
            elif command -v scrot &>/dev/null; then
                scrot -s "$outfile"
            elif command -v import &>/dev/null; then
                import "$outfile"
            else
                error "Install gnome-screenshot, scrot, or imagemagick for region capture"
            fi
            ;;
        *)
            error "Unknown screenshot mode: $mode (use: region, window, full)"
            ;;
    esac

    if [[ ! -f "$outfile" ]]; then
        error "Screenshot failed — no output file"
    fi

    local size
    size=$(stat -c%s "$outfile" 2>/dev/null || stat -f%z "$outfile" 2>/dev/null)
    info "Captured: $outfile ($size bytes)"
    echo "$outfile"
}

# ---- Capture tmux pane text --------------------------------------------------
capture_pane() {
    local outfile="$TMPDIR/opencode-pane-$(date +%s).txt"

    if [[ -z "${TMUX:-}" ]]; then
        error "Not inside a tmux session"
    fi

    tmux capture-pane -p -S - > "$outfile"

    if [[ ! -s "$outfile" ]]; then
        error "Captured pane is empty"
    fi

    local lines
    lines=$(wc -l < "$outfile")
    info "Captured pane: $outfile ($lines lines)"
    echo "$outfile"
}

# ---- Send to OpenCode --------------------------------------------------------
send_to_opencode() {
    local file="$1"
    local prompt="${2:-Analyze this image and describe what you see.}"

    if [[ ! -f "$file" ]]; then
        error "File not found: $file"
    fi

    local ext="${file##*.}"
    case "$ext" in
        png|jpg|jpeg|gif|webp|bmp|tiff)
            info "Sending image to OpenCode (model: $MODEL)..."
            ;;
        txt|md|log|json|csv|html|xml|yaml|yml)
            info "Sending text file to OpenCode (model: $MODEL)..."
            ;;
        *)
            warn "Unknown file type: $ext — sending anyway"
            ;;
    esac

    info "Prompt: $prompt"
    echo "---"

    if command -v opencode &>/dev/null; then
        opencode run -m "$MODEL" -f "$file" "$prompt"
    else
        # Fallback: check if opencode is available via npx
        if command -v npx &>/dev/null; then
            npx opencode run -m "$MODEL" -f "$file" "$prompt"
        else
            error "opencode not found in PATH. Install: npm install -g opencode"
        fi
    fi

    # Clean up temp file after 5 minutes (in case user wants to re-use)
    ( sleep 300 && rm -f "$file" ) &
}

# ---- Main --------------------------------------------------------------------
MODE="${1:-help}"
PROMPT="${2:-}"

case "$MODE" in
    screenshot)
        SCREENSHOT_MODE="${2:-region}"
        shift 2 2>/dev/null || shift 1 2>/dev/null || true
        PROMPT="${1:-Analyze this screenshot and describe what you see.}"
        FILE=$(capture_screenshot "$SCREENSHOT_MODE")
        send_to_opencode "$FILE" "$PROMPT"
        ;;
    pane)
        shift 1 2>/dev/null || true
        PROMPT="${1:-Review the content of this tmux pane.}"
        FILE=$(capture_pane)
        send_to_opencode "$FILE" "$PROMPT"
        ;;
    file)
        shift 1 2>/dev/null || true
        FILE="${1:?Usage: $0 file <path> [prompt]}"
        PROMPT="${2:-Analyze this file and describe what you see.}"
        send_to_opencode "$FILE" "$PROMPT"
        ;;
    help|--help|-h)
        echo "Usage: $0 <mode> [args...]"
        echo ""
        echo "Modes:"
        echo "  screenshot [region|window|full] [prompt]   Capture screen → OpenCode"
        echo "  pane [prompt]                               Capture tmux pane → OpenCode"
        echo "  file <path> [prompt]                        Send file → OpenCode"
        echo ""
        echo "Examples:"
        echo "  $0 screenshot region 'what is wrong here'"
        echo "  $0 pane 'review this code for bugs'"
        echo "  $0 file ~/error.png 'explain this error'"
        echo ""
        echo "Env vars:"
        echo "  OPENCODE_MODEL   Model to use (default: opencode/mimo-v2.5-free)"
        echo ""
        echo "Tmux keybindings (add to ~/.tmux.conf):"
        echo "  bind-key I run-shell '$0 pane \"review this\"'"
        echo "  bind-key S run-shell '$0 screenshot full \"describe\"'"
        ;;
    *)
        error "Unknown mode: $MODE (use: screenshot, pane, file, help)"
        ;;
esac

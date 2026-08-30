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

# ---- Colors -----------------------------------------------------------------
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'
info()  { echo -e "${GREEN}[opencode-img]${NC} $1"; }
warn()  { echo -e "${YELLOW}[opencode-img]${NC} $1"; }
error() { echo -e "${RED}[opencode-img]${NC} $1" >&2; exit 1; }

# ---- Temp file management (cleanup on EXIT, no background orphans) -----------
TMPFILE=""
cleanup() { [[ -n "${TMPFILE:-}" && -f "$TMPFILE" ]] && rm -f "$TMPFILE"; }
trap cleanup EXIT

make_tmpfile() {
    local ext="${1:-txt}"
    TMPFILE="/tmp/opencode-img-$(date +%s%N)-$$.$ext"
    touch "$TMPFILE"
}

# ---- Screenshot (requires display) -------------------------------------------
capture_screenshot() {
    local mode="${1:-region}"
    make_tmpfile "png"

    if [[ -z "${DISPLAY:-}" && -z "${WAYLAND_DISPLAY:-}" ]]; then
        error "No display server detected. Use 'pane' or 'file' mode on headless servers."
    fi

    case "$mode" in
        full)
            if command -v gnome-screenshot &>/dev/null; then
                gnome-screenshot -f "$TMPFILE"
            elif command -v scrot &>/dev/null; then
                scrot "$TMPFILE"
            elif command -v import &>/dev/null; then
                import -window root "$TMPFILE"
            else
                error "No screenshot tool found. Install: sudo apt install gnome-screenshot scrot imagemagick"
            fi
            ;;
        window)
            if command -v gnome-screenshot &>/dev/null; then
                gnome-screenshot -w -f "$TMPFILE"
            elif command -v scrot &>/dev/null; then
                scrot -u "$TMPFILE"
            else
                error "Install gnome-screenshot or scrot for window capture"
            fi
            ;;
        region)
            if command -v gnome-screenshot &>/dev/null; then
                gnome-screenshot -a -f "$TMPFILE"
            elif command -v scrot &>/dev/null; then
                scrot -s "$TMPFILE"
            elif command -v import &>/dev/null; then
                import "$TMPFILE"
            else
                error "Install gnome-screenshot, scrot, or imagemagick for region capture"
            fi
            ;;
        *)
            error "Unknown screenshot mode: $mode (use: region, window, full)"
            ;;
    esac

    [[ -f "$TMPFILE" ]] || error "Screenshot failed — no output file"

    local size
    size=$(stat -c%s "$TMPFILE" 2>/dev/null || stat -f%z "$TMPFILE" 2>/dev/null)
    info "Captured: $TMPFILE ($size bytes)"
}

# ---- Capture tmux pane text --------------------------------------------------
capture_pane() {
    if [[ -z "${TMUX:-}" ]]; then
        error "Not inside a tmux session"
    fi

    warn "Pane capture may include credentials/terminal output visible on screen."
    make_tmpfile "txt"

    tmux capture-pane -p -S -2000 > "$TMPFILE"

    [[ -s "$TMPFILE" ]] || error "Captured pane is empty"

    local lines
    lines=$(wc -l < "$TMPFILE")
    info "Captured pane: $TMPFILE ($lines lines, last 2000 lines of scrollback)"
}

# ---- Send to OpenCode --------------------------------------------------------
send_to_opencode() {
    local prompt="${1:-Analyze this and describe what you see.}"

    [[ -f "$TMPFILE" ]] || error "No file to send"

    local ext="${TMPFILE##*.}"
    case "$ext" in
        png|jpg|jpeg|gif|webp|bmp|tiff)
            info "Sending image to OpenCode (model: $MODEL)..."
            ;;
        txt|md|log|json|csv|html|xml|yaml|yml)
            info "Sending text to OpenCode (model: $MODEL)..."
            ;;
        *)
            warn "Unknown file type: $ext — sending anyway"
            ;;
    esac

    info "Prompt: $prompt"
    echo "---"

    if command -v opencode &>/dev/null; then
        opencode run -m "$MODEL" -f "$TMPFILE" "$prompt"
    elif command -v npx &>/dev/null; then
        npx opencode run -m "$MODEL" -f "$TMPFILE" "$prompt"
    else
        error "opencode not found. Install: npm install -g opencode"
    fi
}

# ---- Main --------------------------------------------------------------------
MODE="${1:-help}"

case "$MODE" in
    screenshot)
        SCREENSHOT_MODE="${2:-region}"
        PROMPT="${3:-Analyze this screenshot and describe what you see.}"
        capture_screenshot "$SCREENSHOT_MODE"
        send_to_opencode "$PROMPT"
        ;;
    pane)
        PROMPT="${2:-Review the content of this tmux pane.}"
        capture_pane
        send_to_opencode "$PROMPT"
        ;;
    file)
        FILE="${2:?Usage: $0 file <path> [prompt]}"
        PROMPT="${3:-Analyze this file and describe what you see.}"
        [[ -f "$FILE" ]] || error "File not found: $FILE"
        TMPFILE="$FILE"
        send_to_opencode "$PROMPT"
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
        ;;
    *)
        error "Unknown mode: $MODE (use: screenshot, pane, file, help)"
        ;;
esac

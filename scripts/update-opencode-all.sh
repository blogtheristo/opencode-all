#!/usr/bin/env bash
# Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=openai/gpt-6-sol Agent=copilot Date=2026-09-27
# Audit trail: git log -- scripts/update-opencode-all.sh
set -euo pipefail

repo="$(git rev-parse --show-toplevel)"
submodule="$repo/opencode-all"
if [[ ! -f "$submodule/.git" ]]; then
  echo 'opencode-all is not initialized: run git submodule update --init opencode-all' >&2
  exit 1
fi
if [[ -n "$(git -C "$submodule" status --porcelain)" ]]; then
  echo 'opencode-all has local changes; refusing to update' >&2
  exit 1
fi

git -C "$submodule" fetch origin dev
if ! git -C "$submodule" merge-base --is-ancestor HEAD origin/dev; then
  echo 'Pinned opencode-all commit is not an ancestor of origin/dev; manual review required' >&2
  exit 1
fi
git -C "$submodule" merge --ff-only origin/dev
printf 'opencode-all advanced. Review and commit the gitlink in the parent repository.\n'

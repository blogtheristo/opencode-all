---
description: How to edit and deploy site content
---

# Site Content & Deployment Workflow

## ⚠️ CRITICAL: Folder Structure

This repository uses a **Sync Pipeline**. 

*   **SOURCE OF TRUTH**: The root folders `dws10.com/` and `onelifetime.world/`.
    *   ✅ **EDIT THESE FILES**. Agents should always read and write to these root directories.
*   **DEPLOYMENT TARGET**: The `landing-pages/` directory.
    *   ❌ **DO NOT EDIT MANUALLY**. This folder is automatically updated by GitHub Actions.

## 🤖 Automation

A GitHub Action (`.github/workflows/sync-site-content.yml`) automatically runs on every push.
It copies content from:
*   `dws10.com/` -> `landing-pages/dws10-com/`
*   `onelifetime.world/` -> `landing-pages/onelifetime-world/`

## 📝 Instructions for Agents

1.  **Make Changes**: Edit files in the root `dws10.com` or `onelifetime.world` directories.
2.  **Commit & Push**: Simply commit your changes to the root files.
3.  **Verification**: The GitHub Action will handle the sync to the deployment folder.

## // turbo-all
# If you need to force a sync locally (e.g. before a critical deploy), run:
rsync -av --exclude='.*' dws10.com/ landing-pages/dws10-com/ --delete
rsync -av --exclude='.*' onelifetime.world/ landing-pages/onelifetime-world/ --delete

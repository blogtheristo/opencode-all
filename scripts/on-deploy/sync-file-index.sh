#!/usr/bin/env bash
# Wrapper: rebuild search index after code changes
cd "$(dirname "$0")/../.." && exec npx tsx scripts/sync-file-index.ts

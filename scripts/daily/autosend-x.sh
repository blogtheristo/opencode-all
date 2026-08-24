#!/usr/bin/env bash
# Wrapper: auto-post to X/Twitter
cd "$(dirname "$0")/../.." && exec npx tsx scripts/autosend-x.ts

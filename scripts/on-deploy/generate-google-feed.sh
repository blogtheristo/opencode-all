#!/usr/bin/env bash
# Wrapper: regenerate Google product feed after product changes
cd "$(dirname "$0")/../.." && exec node scripts/generate-google-feed.cjs

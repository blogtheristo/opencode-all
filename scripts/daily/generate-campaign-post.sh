#!/usr/bin/env bash
# Wrapper: generate daily campaign social post
cd "$(dirname "$0")/../.." && exec npx tsx scripts/generate-campaign-post.ts

#!/usr/bin/env bash
# Wrapper: inject navigation into blog templates after changes
cd "$(dirname "$0")/../.." && exec node scripts/inject-blog-nav.cjs

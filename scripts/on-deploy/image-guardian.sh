#!/usr/bin/env bash
# Wrapper: validate image consistency across sites after changes
cd "$(dirname "$0")/../.." && exec node scripts/image-guardian.cjs

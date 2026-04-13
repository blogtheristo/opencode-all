#!/usr/bin/env bash
# Wrapper: backup all site directories
exec bash "$(dirname "$0")/../backup-sites.sh"

#!/usr/bin/env bash
# Wrapper: restore latest backup to local PG and verify integrity
exec bash "$(dirname "$0")/../db-restore-local.sh"

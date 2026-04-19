#!/usr/bin/env bash
# Wrapper: runs the existing db-daily-backup.sh
exec bash "$(dirname "$0")/../db-daily-backup.sh"

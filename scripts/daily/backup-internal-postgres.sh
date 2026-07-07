#!/usr/bin/env bash
# Wrapper: runs the DGX Spark internal-Postgres offsite backup
exec bash "$(dirname "$0")/../dgx-spark/backup-internal-postgres-to-aiven.sh"

#!/usr/bin/env bash
# Wrapper: runs all 7 morning email digests
exec bash "$(dirname "$0")/../run-morning-emails.sh"

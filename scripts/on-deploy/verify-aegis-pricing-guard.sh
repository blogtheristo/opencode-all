#!/usr/bin/env bash
# Wrapper: assert the Aegis pilot/implementation pricing guard after every deploy.
# The runner discovers only *.ts and *.sh here, hence this shim over the .py.
cd "$(dirname "$0")/../.." && exec python3 scripts/verify-aegis-pricing-guard.py

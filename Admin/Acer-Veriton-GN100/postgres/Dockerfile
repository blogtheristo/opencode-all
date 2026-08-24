# =============================================================================
# DWS Edge PostgreSQL — TimescaleDB + pg_duckdb + pgvector
# =============================================================================
# Target: Acer Veriton GN100 (ARM64/aarch64)
# Base: Official TimescaleDB image (Aiven-parity, multi-arch ARM64 + AMD64)
#
# Strategy (Aiven-first mandate, March 2026):
#   - Base image: timescale/timescaledb:2.25.2-pg16 (exact Aiven parity)
#   - pg_duckdb: Multi-stage copy from pgduckdb/pgduckdb:16-v1.1.1
#   - pgvector: Built from source (ARM64 reliable)
#
# Autoresearch validation (2026-03-13):
#   - TimescaleDB ARM64: CONFIRMED (official multi-arch image)
#   - pg_duckdb ARM64: CONFIRMED (multi-arch Docker image, multi-stage copy)
#   - pgvector ARM64: CONFIRMED (builds from source on ARM64)
#
# Usage:
#   docker build -t dws-edge-postgres:16 .
#   docker compose up -d
#
# Version: 2.0.0
# License: Proprietary — Lifetime Oy
# =============================================================================

# =============================================================================
# Stage 1: Extract pg_duckdb extension from official multi-arch image
# =============================================================================
# pg_duckdb is NOT available on Aiven (whitelist blocks it). It lives on the
# edge only. The pgduckdb/pgduckdb image is confirmed multi-arch (ARM64 + AMD64).
FROM pgduckdb/pgduckdb:16-v1.1.1 AS pgduckdb-source

# =============================================================================
# Stage 2: Build the final image on TimescaleDB base (Aiven parity)
# =============================================================================
# Using the official TimescaleDB image gives us:
#   - TimescaleDB 2.25.x pre-installed (no APT install needed)
#   - Exact same version as Aiven managed PostgreSQL
#   - Multi-arch support (ARM64 + AMD64)
#   - shared_preload_libraries already configured
FROM timescale/timescaledb:2.25.2-pg16

LABEL maintainer="risto@onelifetime.world"
LABEL description="DWS Edge PostgreSQL: TimescaleDB (Aiven parity) + pg_duckdb (edge analytics) + pgvector (RAG)"
LABEL org.opencontainers.image.source="https://github.com/blogtheristo/dws6"

# Build arguments for version pinning
ARG PGVECTOR_VERSION=0.8.0

# =============================================================================
# 1. Copy pg_duckdb extension from official multi-arch Docker image
# =============================================================================
# Multi-stage copy — the only reliable ARM64 install method.
# pg_duckdb adds DuckDB's 50-600× vectorized OLAP engine to PostgreSQL.
# This is the edge-only extension (blocked on Aiven whitelist).
COPY --from=pgduckdb-source /usr/share/postgresql/16/extension/duckdb* /usr/share/postgresql/16/extension/
COPY --from=pgduckdb-source /usr/lib/postgresql/16/lib/duckdb*.so /usr/lib/postgresql/16/lib/

# =============================================================================
# 2. Install pgvector from source (reliable ARM64 build)
# =============================================================================
# The timescale/timescaledb image is Alpine-based — use apk for dependencies
RUN apk add --no-cache --virtual .build-deps \
        build-base \
        clang15 \
        git \
        llvm15-dev \
        postgresql16-dev \
    && cd /tmp \
    && git clone --branch v${PGVECTOR_VERSION} --depth 1 https://github.com/pgvector/pgvector.git \
    && cd pgvector \
    && make OPTFLAGS="" \
    && make install \
    && cd / && rm -rf /tmp/pgvector \
    && apk del .build-deps

# =============================================================================
# 3. Copy initialization SQL
# =============================================================================
COPY init.sql /docker-entrypoint-initdb.d/001-init.sql

# Standard PostgreSQL port
EXPOSE 5432

# Health check
HEALTHCHECK --interval=10s --timeout=5s --retries=5 \
    CMD pg_isready -U ${POSTGRES_USER:-dws_edge} -d ${POSTGRES_DB:-dws_edge}

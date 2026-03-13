# =============================================================================
# DWS Edge PostgreSQL — TimescaleDB + pg_duckdb + pgvector
# =============================================================================
# Target: Acer Veriton GN100 (ARM64/aarch64)
# Base: Official PostgreSQL 16 (Debian Bookworm — multi-arch ARM64 + AMD64)
#
# Extensions:
#   - TimescaleDB 2.x  — Time-series hypertables, compression, continuous aggregates
#   - pg_duckdb 1.x    — DuckDB-powered OLAP analytics inside PostgreSQL
#   - pgvector 0.8.x   — Vector similarity search (matches Supabase stack)
#
# Autoresearch validation (2026-03-13):
#   - TimescaleDB ARM64: CONFIRMED via PGDG apt.postgresql.org (v2.21.1)
#   - pg_duckdb ARM64: CONFIRMED via multi-arch Docker image (v1.1.1)
#   - pgvector ARM64: CONFIRMED builds from source on ARM64
#
# Usage:
#   docker build -t dws-edge-postgres:16 .
#   docker compose up -d
#
# Version: 1.1.0
# License: Proprietary — Lifetime Oy
# =============================================================================

# =============================================================================
# Stage 1: Extract pg_duckdb extension from official multi-arch image
# =============================================================================
# The pgduckdb/pgduckdb image is confirmed multi-arch (ARM64 + AMD64).
# This avoids reliance on DEB packages whose ARM64 availability is uncertain.
FROM pgduckdb/pgduckdb:16-v1.1.1 AS pgduckdb-source

# =============================================================================
# Stage 2: Build the final image
# =============================================================================
FROM postgres:16-bookworm

LABEL maintainer="risto@onelifetime.world"
LABEL description="DWS Edge PostgreSQL with TimescaleDB + pg_duckdb + pgvector for Acer Veriton GN100"
LABEL org.opencontainers.image.source="https://github.com/blogtheristo/dws6"

# Build arguments for version pinning
ARG PGVECTOR_VERSION=0.8.0

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    ca-certificates \
    curl \
    git \
    gnupg \
    lsb-release \
    postgresql-server-dev-16 \
    && rm -rf /var/lib/apt/lists/*

# =============================================================================
# 1. Install TimescaleDB from Timescale PackageCloud APT repository
# =============================================================================
# Confirmed ARM64 availability: timescaledb-2-postgresql-16 on Bookworm arm64
# Fallback: PGDG repository (apt.postgresql.org) also carries arm64 builds
RUN echo "deb https://packagecloud.io/timescale/timescaledb/debian/ $(lsb_release -cs) main" \
    > /etc/apt/sources.list.d/timescaledb.list \
    && curl -fsSL https://packagecloud.io/timescale/timescaledb/gpgkey | gpg --dearmor -o /etc/apt/trusted.gpg.d/timescaledb.gpg \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
       timescaledb-2-postgresql-16 \
    || ( \
       echo "PackageCloud install failed, trying PGDG repository..." \
       && echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" \
          > /etc/apt/sources.list.d/pgdg.list \
       && curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc | gpg --dearmor -o /etc/apt/trusted.gpg.d/pgdg.gpg \
       && apt-get update \
       && apt-get install -y --no-install-recommends postgresql-16-timescaledb \
    ) \
    && rm -rf /var/lib/apt/lists/*

# =============================================================================
# 2. Copy pg_duckdb extension from official multi-arch Docker image
# =============================================================================
# Multi-stage copy avoids DEB package availability uncertainty on ARM64.
# The pgduckdb/pgduckdb:16-v1.1.1 image is built with docker buildx bake
# and publishes native ARM64 + AMD64 manifests.
COPY --from=pgduckdb-source /usr/share/postgresql/16/extension/duckdb* /usr/share/postgresql/16/extension/
COPY --from=pgduckdb-source /usr/lib/postgresql/16/lib/duckdb*.so /usr/lib/postgresql/16/lib/

# =============================================================================
# 3. Install pgvector from source (reliable ARM64 build)
# =============================================================================
RUN cd /tmp \
    && git clone --branch v${PGVECTOR_VERSION} --depth 1 https://github.com/pgvector/pgvector.git \
    && cd pgvector \
    && make OPTFLAGS="" \
    && make install \
    && cd / && rm -rf /tmp/pgvector

# =============================================================================
# 4. Clean up build dependencies to reduce image size
# =============================================================================
RUN apt-get purge -y --auto-remove \
    build-essential \
    git \
    postgresql-server-dev-16 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# =============================================================================
# 5. Configure shared_preload_libraries
# =============================================================================
RUN echo "shared_preload_libraries = 'timescaledb'" >> /usr/share/postgresql/postgresql.conf.sample

# Copy initialization SQL
COPY init.sql /docker-entrypoint-initdb.d/001-init.sql

# Standard PostgreSQL port
EXPOSE 5432

# Health check
HEALTHCHECK --interval=10s --timeout=5s --retries=5 \
    CMD pg_isready -U ${POSTGRES_USER:-dws_edge} -d ${POSTGRES_DB:-dws_edge}

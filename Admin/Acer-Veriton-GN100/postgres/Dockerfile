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
# Usage:
#   docker build -t dws-edge-postgres:16 .
#   docker compose up -d
#
# Version: 1.0.0
# License: Proprietary — Lifetime Oy
# =============================================================================

FROM postgres:16-bookworm

LABEL maintainer="risto@onelifetime.world"
LABEL description="DWS Edge PostgreSQL with TimescaleDB + pg_duckdb + pgvector for Acer Veriton GN100"
LABEL org.opencontainers.image.source="https://github.com/blogtheristo/dws6"

# Build arguments for version pinning
ARG TIMESCALEDB_VERSION=2
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
# 1. Install TimescaleDB from official APT repository
# =============================================================================
RUN echo "deb https://packagecloud.io/timescale/timescaledb/debian/ $(lsb_release -cs) main" \
    > /etc/apt/sources.list.d/timescaledb.list \
    && curl -fsSL https://packagecloud.io/timescale/timescaledb/gpgkey | gpg --dearmor -o /etc/apt/trusted.gpg.d/timescaledb.gpg \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
       timescaledb-${TIMESCALEDB_VERSION}-postgresql-16 \
    && rm -rf /var/lib/apt/lists/*

# =============================================================================
# 2. Install pg_duckdb from official APT repository
# =============================================================================
RUN curl -fsSL https://install.pgduck.db/#TODO > /dev/null 2>&1 || true
# pg_duckdb: install from GitHub releases (DEB package for PG16 + ARM64/AMD64)
RUN ARCH=$(dpkg --print-architecture) \
    && PGDUCKDB_VERSION=$(curl -fsSL https://api.github.com/repos/duckdb/pg_duckdb/releases/latest | grep '"tag_name"' | sed 's/.*"v\(.*\)".*/\1/') \
    && echo "Installing pg_duckdb v${PGDUCKDB_VERSION} for ${ARCH}" \
    && curl -fsSL "https://github.com/duckdb/pg_duckdb/releases/download/v${PGDUCKDB_VERSION}/pg_duckdb-v${PGDUCKDB_VERSION}-pg16-${ARCH}.deb" \
       -o /tmp/pg_duckdb.deb \
    && dpkg -i /tmp/pg_duckdb.deb || apt-get install -f -y \
    && rm /tmp/pg_duckdb.deb

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

# Wärtsilä's Public Data Stack × Aiven × DWS IQ 6 — Compatibility Assessment

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: claude/aiven-partnership-intro-vm1fgk | Date: 06.07.2026 | Changes: Researched the three platforms Wärtsilä publicly references in its data work (Pega, Dataddo, GEMS/GEMS Pulse) and assessed their compatibility with the Aiven portfolio (PostgreSQL/Kafka/OpenSearch/Cassandra) and with DWS IQ 6. Web-verified 2026-07-06

Document Status:

- Created: 06.07.2026
- Last Modified: 06.07.2026
- Language: English
- Publication Status: ACTIVE

---

## Context

On the 2026-07-06 call, Leevi Lindfors (Aiven) named Wärtsilä as an Aiven public
reference customer (still unverified from Aiven's public materials — see
`Partners/outreach/2026-04-18-aiven.md` §2). Independently, Wärtsilä's public
data-platform footprint includes three third-party-documented systems. This note
assesses how each fits the Aiven portfolio and where DWS IQ 6 attaches.

## 1. Pega Platform (IoT engine data / service support) — HIGH compatibility

Wärtsilä's Pega case study describes IoT engine-data-driven service support on
the Pega Platform. Pega's own externalized-services architecture (Pega Platform
'23+) runs on exactly the stack Aiven sells:

- **PostgreSQL** — Pega's backing database on EKS/GKE deployments.
- **Apache Kafka** — Pega's stream service; Kafka is _required_ for all Pega
  installations and Pega explicitly supports "any external Kafka" (MSK,
  Confluent, generic) — an Aiven for Apache Kafka endpoint qualifies.
- **OpenSearch + Cassandra** — Pega's search and decisioning stores; both in
  Aiven's managed portfolio.

**Competitive precedent:** NetApp Instaclustr already markets a managed
open-source support package specifically for Pega's externalized services —
proof the "run Pega's data layer on managed OSS" slot exists commercially, and
that Aiven has a competitor in it (Instaclustr).

**DWS IQ 6 attach:** if a Pega shop externalizes to Aiven PG/Kafka, the DWS
compliance layer can consume the same Kafka topics / PG tables for CSRD/ETS/CBAM
reporting without touching Pega itself — this is the concrete version of the
"agent backplane on Aiven PostgreSQL + Kafka" line in the partner record §3.

## 2. Dataddo (marketing ETL → AWS) — COMPATIBLE, minor config

Dataddo (Czech, EU-based ETL SaaS) supports PostgreSQL as both source and
destination: standard port 5432, TLS `PREFER`/`REQUIRED`, optional SSH tunnel,
requires network reachability from Dataddo IPs. Aiven PostgreSQL is public-
hostname + enforced-TLS by default, so an Aiven PG works as a Dataddo
destination with an IP allowlist entry on the Aiven service. Low ceremony,
low strategic value — marketing data, not the industrial core.

## 3. GEMS / GEMS Pulse + Eniram (Wärtsilä in-house) — INDIRECT only

GEMS is Wärtsilä's proprietary energy-storage control platform (100k data
points/sec, IEC 62443-4 + SOC 2 certified, ISO 27001 ISMS; GEMS 7 controls
multi-GWh BESS; GEMS Pulse adds cloud battery analytics on a proprietary "GEMS
Data Schema"). Eniram is the equivalent in-house marine analytics line.
Wärtsilä has publicly chosen **in-house control** over battery-storage data
analytics — its DB/streaming internals are not a third-party integration
surface. Neither Aiven nor DWS plugs into GEMS directly.

**DWS IQ 6 attach (indirect):** the opportunity is downstream of GEMS exports —
CSRD / EU-taxonomy / ETS reporting on energy-storage and marine operations data
that Wärtsilä (or its customers) pull _out_ of GEMS/Eniram via their APIs.
Speculative until a real export surface is confirmed; do not pitch as an
integration.

## Verdict

| Wärtsilä-referenced product | Aiven fit                                                                                                                                     | DWS IQ 6 fit                                                                       |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Pega Platform               | **High** — Pega's externalized services (PG, Kafka, OpenSearch, Cassandra) are Aiven's exact portfolio; Instaclustr precedent proves the slot | **Good** — compliance agents consume the same PG/Kafka layer without touching Pega |
| Dataddo                     | Compatible — PG destination over TLS, allowlist needed                                                                                        | Marginal — marketing data, not compliance-relevant                                 |
| GEMS / GEMS Pulse / Eniram  | None directly — deliberately in-house                                                                                                         | Indirect — compliance reporting on exported data only                              |

**Use in the Aiven track:** the Pega finding is the actionable one. If the
Wärtsilä reference is confirmed, the joint pitch to Wärtsilä-class industrials
is: Pega (or comparable industrial platform) data layer on Aiven managed OSS in
an EU region + DWS IQ 6 compliance agents on the same backplane. Also worth
asking Leevi directly: does Aiven position against Instaclustr's Pega package?

## Sources (fetched 2026-07-06)

- Pega: docs.pega.com (platform-23 embedded/external Kafka, stream service), pegasystems.github.io helm charts (EKS/GKE PostgreSQL requirement), support.pega.com externalized-services FAQ, instaclustr.com NetApp–Pega support package
- Dataddo: docs.dataddo.com (postgres destination, data-destinations), dataddo.com/storage/pgsql, dataddo.com/case-studies/wartsila
- Wärtsilä: wartsila.com GEMS platform pages, 2024-08 GEMS 7 press release, energy-storage.news ("in-house control over battery storage data analytics"), pega.com/customers/wartsila-platform

## Related

- `Partners/outreach/2026-04-18-aiven.md` — partner record (Wärtsilä reference signal, §2)
- `docs/field-notes/2026-07-06-dgx-edb-vs-aiven-upcloud-comparison.md` — positioning frame

---

(c) 2026 Lifetime Oy — Field Note

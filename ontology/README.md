# LWM Ontology V1 — 25 Industry Ontologies from 5,000 European Enterprises

This directory contains the per-industry ontologies that feed the LWM V1 sovereign training cascade (Stage 2: Industry Fine-Tune).

## Structure

```
ontology/
├── industries/              Per-industry ontology (7-layer JSON-LD + OWL/RDF)
│   ├── 01-steel-metallurgy.json
│   ├── 02-forestry-pulp-paper.json
│   └── ... (25 total)
├── enterprises/
│   ├── enterprise-registry.json     Master list of all 5,000 enterprises (v2.1)
│   └── per-industry/               Raw enterprise data by industry
│       ├── 01-steel-metallurgy.json
│       └── ... (200 records each)
├── synthetic-seeds/                 Training seed examples per industry
│   ├── 01-steel-metallurgy-seeds.json
│   └── ...
└── README.md                        This file
```

## 7-Layer Ontology Structure

Each industry ontology contains seven layers:

| Layer | Name                    | Purpose                                               |
| ----- | ----------------------- | ----------------------------------------------------- |
| 1     | Domain Concepts         | Industry terminology, equipment types, process names  |
| 2     | Regulatory Terms        | CSRD, EU ETS, CBAM, industry-specific directives      |
| 3     | Operational Vocabulary  | Site-level language, shift patterns, KPIs             |
| 4     | Process Taxonomy        | Manufacturing workflows, value chains, I/O mappings   |
| 5     | Compliance Requirements | Reporting obligations, audit trails, certifications   |
| 6     | Commercial Intelligence | Buying roles (R01-R25), pain points, sales wedges     |
| 7     | Investor Positioning    | TAM/SAM, regulatory tailwinds, 6 investor wedge types |

Layers 1-5 feed sovereign fine-tuning. Layers 6-7 feed sales-outreach and investor-outreach pipelines.

## 3-Stage Pipeline

1. **Local preprocessing** — Nemotron-TwoTower 30B-A3B (NVIDIA) on DGX Spark via AI Workbench extracts domain terms from enterprise documents (replaces Qwen3-Coder 30B as of 05.07.2026 — see `docs/field-notes/2026-07-05-nemotron-twotower-stage1-production-switch.md`; validation gate in the plan's §11.4)
2. **Claude API synthesis** — JSON-LD ontology generation with OWL/RDF validation, cross-enterprise deduplication
3. **Sovereign fine-tuning** — QLoRA on GB10 (NVFP4 quantization), ~2000 synthetic training examples per industry
4. **Deploy** — Customer gets an LWM fine-tuned for their industry on Day 0

## Plan

Full plan: [`docs/plans/2026-06-22-lwm-ontology-v1-500-enterprises.md`](../docs/plans/2026-06-22-lwm-ontology-v1-500-enterprises.md)

Branch: `claude/lwm-ontology-v1-500-enterprises`

## 25 Industries (Revised Manufacturing Taxonomy)

Source: `ontology/enterprises/enterprise-registry.json` (v2.0, 25 × 200 = 5,000 enterprises)

| ID  | Industry                             | Target |
| --- | ------------------------------------ | ------ |
| 1   | Steel & Metallurgy                   | 200    |
| 2   | Forestry, Pulp & Paper               | 200    |
| 3   | Automotive & Heavy Transport Mfg     | 200    |
| 4   | Aerospace & Defence                  | 200    |
| 5   | Chemical Processing                  | 200    |
| 6   | Pharmaceutical & Bio-Manufacturing   | 200    |
| 7   | Maritime & Shipbuilding              | 200    |
| 8   | Power Generation & Nuclear           | 200    |
| 9   | Renewable Energy Infrastructure      | 200    |
| 10  | Mining & Mineral Extraction          | 200    |
| 11  | Industrial Automation & Robotics     | 200    |
| 12  | Construction & Civil Infrastructure  | 200    |
| 13  | Food & Beverage Manufacturing        | 200    |
| 14  | Glass, Ceramics & Building Materials | 200    |
| 15  | Electronics & Semiconductor Fab      | 200    |
| 16  | Oil & Gas Refining                   | 200    |
| 17  | Textiles & Industrial Fabrics        | 200    |
| 18  | Water Treatment & Waste Management   | 200    |
| 19  | Agricultural Machinery Manufacturing | 200    |
| 20  | Telecom Infrastructure               | 200    |
| 21  | Medical Devices Manufacturing        | 200    |
| 22  | High-Speed Rail & Transport Infra    | 200    |
| 23  | Datacenter Infra & Thermal Mgmt      | 200    |
| 24  | Battery & Energy Storage Cell Mfg    | 200    |
| 25  | Marine & Offshore Subsea Engineering | 200    |

# AI/DS Workflow Accelerator

**From raw data to boardroom-ready decisions in under 15 minutes.**

Part of DWS IQ 6 — Enterprise Climate Intelligence Platform.

---

## Quick Start (5 minutes)

### Prerequisites

- Python 3.10+
- An Anthropic API key (optional — `--dry-run` works without one)

### Setup

```bash
# From the dws6 repo root:
python3 -m venv .venv
source .venv/bin/activate          # Linux/macOS
# .venv\Scripts\activate           # Windows

pip install -r workflow/requirements.txt
```

### Run (Offline Demo)

```bash
# No API key needed — uses rule-based fallbacks
python run_pipeline.py --dry-run
```

### Run (Full Pipeline)

```bash
# Set your API key
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY

python run_pipeline.py
```

---

## What It Does

| Stage | Script | Output |
|-------|--------|--------|
| 1. Data Ingestion | `workflow/01_ingest.py` | `data/raw_dataset.csv` |
| 2. Clean + EDA | `workflow/02_clean_and_eda.py` | `data/cleaned_dataset.csv`, 3 plots in `reports/figures/` |
| 3. Model Training | `workflow/03_model_train.py` | `models/best_model.pkl`, `reports/metrics.json` |
| 4. AI Interpretation | `workflow/04_ai_interpreter.py` | `reports/stakeholder_emails.md`, `reports/interpretation.json` |

Each script runs independently:

```bash
source .venv/bin/activate
python workflow/01_ingest.py
python workflow/02_clean_and_eda.py
python workflow/03_model_train.py
python workflow/04_ai_interpreter.py          # requires API key
python workflow/04_ai_interpreter.py --dry-run # no API key needed
```

---

## Project Structure

```
dws6/
├── run_pipeline.py              # Master orchestrator
├── workflow/
│   ├── 01_ingest.py             # Synthetic data generation
│   ├── 02_clean_and_eda.py      # Auto-clean + visualizations
│   ├── 03_model_train.py        # Model comparison + selection
│   └── 04_ai_interpreter.py     # AI-powered interpretation
├── data/
│   ├── raw_dataset.csv          # Generated (500 rows, with quality issues)
│   └── cleaned_dataset.csv      # After auto-cleaning
├── models/
│   └── best_model.pkl           # Best model (auto-selected)
├── reports/
│   ├── metrics.json             # Model performance metrics
│   ├── interpretation.json      # AI analysis results
│   ├── actions.json             # Recommended actions
│   ├── stakeholder_emails.md    # Email drafts (technical + executive)
│   ├── pipeline_run.json        # Run timing and status
│   └── figures/
│       ├── correlation_heatmap.png
│       ├── target_distribution.png
│       └── feature_importance_preview.png
└── docs/
    ├── problem_analysis.md      # The 4-week problem quantified
    └── 2026_ai_ds_roadmap.md    # Practitioner's guide
```

---

## Key Design Decisions

- **Zero paid dependencies** beyond the Anthropic API — scikit-learn handles all ML
- **Graceful degradation** — every API call has a rule-based fallback
- **`--dry-run` mode** — full demo without any API key
- **Standalone scripts** — each stage runs independently for debugging
- **EU compliance built-in** — AI Act transparency, GDPR synthetic data, NIS2 audit trails

---

## Documentation

- [Problem Analysis](docs/problem_analysis.md) — Why traditional analytics takes 4 weeks
- [2026 AI/DS Roadmap](docs/2026_ai_ds_roadmap.md) — Practitioner's guide with ROI framework

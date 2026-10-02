---
title: "MS-2026-09-005 — The search box is an Observation Sensor"
signal_id: MS-2026-09-005
learning_delta: LD-2026-09-005
world_model_version: 1.5.0
hic_decision: APPLY
approved_at: 2026-09-24
applies_to: [dws10.com, dws10.com/buy, workflows]
excluded: [lifetime.fi, investor-centre]
source: docs/market-signals/2026-09-24-hakukentta-on-observation-sensor.md
---

# Applied learning (world model 1.5.0)

**Old assumption.** A search box is search; `search_term` is enough for analytics.

**New learning.** The front-page field "Which decision is hard to make right now?" is the largest
sensor for what customers are trying to achieve. Each submission is a Chapter 14 CAPTURE
observation carrying `query · industry · page · ontology_guess · recommended_path ·
selected_path · result`, anonymised before storage. The gap between recommended and selected
path is the ontology's error signal. Chapter 14 starts on the front page.

**How agents must use this.** Never answer the field with search results or products; answer
with "Did I understand correctly? … which best describes it?" and continue into the choice path.
Weekly: cluster observations per industry and feed them to CLASSIFY.

# Task — propagate the LWM build→adopt reframe into investor materials + product pages

Decision (HIC, 2026-07-26): **REFRAME, not retire.** Position = "we do NOT pretrain base
models; we build the owned evidence/adaptation layer (KYA loop) on ready sovereign
components." Sources: docs/field-notes/2026-07-26-cosmos-3-edge-lwm-build-adopt-inflection.md,
docs/field-notes/2026-07-26-lwm-training-hardware-reality.md, PHD_FIREHORSE §14.44.

Golden narrative (use verbatim-ish):
> DWS does not train base models. We build a sovereign, owned evidence layer — KYA
> governance, private evals, an RL loop on fleet data, Article-12 audit — on ready open
> sovereign components: **Cosmos 3 Edge** (physical/fleet/Control-Room world model,
> on-prem, DGX-Spark-native) and an NVIDIA-NIM compliance LLM tier. The base model is a
> commodity; the moat is the loop, which no competitor can copy. This is a cleaner capital
> story than "train a 55B on a micro-budget": lower CAPEX, sovereign-by-data, and the
> defensible asset is the part we actually own.

Also carry: the two-optimisation-problems point (fleet/Control-Room vs compliance-evidence
are different problems; one 55B compromises both) and the supply-risk mitigation (open
weights + a non-NVIDIA testbed fallback = managed dependency, not lock-in; §14.44 Finding 3).

Do, WITH discipline (each is outward-facing — review before publish):

1. **Investor materials (canonical only — do NOT touch superseded/quarantined V4.3 deck):**
   investor-outreach/INVESTOR_MEMO.md, INVESTOR_MEMO_AEGIS.md, INVESTOR_MEMO_ONE_PAGER.md
   (+ the .md↔.html one-pager lockstep). Replace any "we train a 55B / pretrain the LWM"
   framing with the golden narrative. Keep GM/pricing/customer figures unchanged (they
   were reconciled in #1717). `/truth-check` before done. Sender identity per CLAUDE.md.

2. **Store SKUs (reframe, keep as products):** Store/PRODUCT_ENTERPRISE_MODEL_TRAINING.md,
   Store/PRODUCT_TRAIN_MODEL.md → reframe "we pretrain your base model" → "sovereign model
   **adaptation** + evidence loop: fine-tune + private evals + KYA on your data, on an open
   sovereign base (Cosmos 3 Edge / NIM)". Keep YAML frontmatter, NO Document-Standard header
   block (Store rule). Prices only via dws10.com/config/products.json (+ landing-pages mirror
   same commit) — never hardcode.

3. **product-catalog/LWM/*:** README already has the correction banner. Propagate the same
   reframe into V1/product-specification.md, training-manual-part1/2/3 (adopt Cosmos + own
   loop; physical-AI scope; QLoRA fine-tune fits GN-100, 55B pretrain does not). Keep V1
   history (Rule 12).

4. **Public industry pages (dual-folder — sync in same commit):** dws10.com/<industry>/index.html
   (energy, waste, construction, mining, manufacturing, logistics, real-estate, healthcare,
   shipbuilding, financial-services, public-sector, ...) + their landing-pages/dws10-com/
   mirrors. Soften "a **trained** Lifetime World Model" → "an **adopted sovereign** world
   model + an owned learning layer that fine-tunes your data". Do NOT imply DWS pretrains a
   base. `/truth-check` each; no .md in public-site folders (Rule 5).

Constraints: dual-folder sync every public edit; `/truth-check` all outward claims; don't
touch superseded decks; commit on branch claude/ollama-orchestration-merge-047pj7 (DGX sole
writer); no secrets. Deliverable: the reframe applied + a short changelog of every file touched.

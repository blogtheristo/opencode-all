# Handoff: ipcmax-serdex-evaluation-orp38x

**Branch:** claude/ipcmax-serdex-evaluation-orp38x  
**Status:** READY FOR HIC REVIEW & DECISION  
**Last Updated:** 30.08.2026  
**Session:** claude/ipcmax-serdex-evaluation-orp38x

---

## What This Branch Contains

A comprehensive technical evaluation of **iPCMax/Serdex** as a hardware partner for dws10.com, covering:

1. **Evaluation Document** (`docs/lut/ipcmax-serdex-hardware-partner-evaluation-2026-08.md`)
   - 8 sections covering architectural fit, NGC Helm Charts integration, risk analysis, and 3-phase go-to-market strategy
   - Version 1.0, ready for HIC review
   - Weighted scoring: 4.0/5.0 (Strategic Partner — Recommended)

2. **Field Note** (`docs/field-notes/2026-08-30-ipcmax-serdex-partnership-evaluation.md`)
   - Executive summary for HIC decision-making
   - Outstanding questions and next steps
   - Checkpoint checklist for follow-up

3. **Reference Architecture** (embedded in evaluation doc, image at `docs/assets/images/ipcmax-dgx-spark-reference-architecture-2026-08.png`)
   - Kubernetes cluster topology
   - Data flow diagrams
   - Bill of Materials for 3 product tiers

---

## Key Findings

### Strategic Fit: **4.0 / 5.0**

**Strengths:**

- Hardware breadth (modular OEM partnerships) → 5/5
- EU supply chain readiness → 4/5
- Sovereign/air-gap capability → 5/5

**Mitigated Risks:**

- Kubernetes compatibility (NGC Helm Charts) → 3/5, mitigated by Phase 1 validation
- Thermal + power management → addressed in cabinet design
- Support SLA alignment → negotiate iPCMax addendum
- Liability boundaries → clear responsibility split in terms-of-service

### Market Opportunity

**Three-Tier Bundle for dws10.com:**

- Tier 1 (Smart Sensor Gateway): €8,499 → SMB manufacturers, facilities
- Tier 2 (Anomaly Detection Cluster): €19,999 → mid-market manufacturing, utilities, smart buildings
- Tier 3 (Enterprise Platform): €49,999 → critical infrastructure, large enterprises

**Payback Period:** 12–18 months via downtime avoidance + operational cost savings (capex model, not SaaS).

### Competitive Positioning

**Unique Value:** Only bundled sovereign industrial AI stack combining field-level hardware bridging + LLM inference on-premise. Differentiates from cloud-only competitors (Anthropic + AWS, Hugging Face + Azure).

---

## Decisions Pending from HIC

### 1. Phase 1 Approval (Reference Architecture)

**Timeline:** 4–8 weeks  
**Cost:** ~€15K internal labor  
**Effort:** 1 FTE engineer + 1 iPCMax liaison  
**Outcome:** Joint whitepaper + NGC integration guide (ready for pilot customer outreach)  
**Recommendation:** ✓ **APPROVED**

### 2. Executive Outreach to iPCMax

**Scope:** CEO-level introduction to iPCMax/Serdex product & BD leadership  
**Framing:** "Joint market opportunity in EU sovereign industrial AI"  
**Goal:** NDA + technical collaboration framework  
**Timeline:** Kickoff within 2 weeks  
**Recommendation:** ✓ **APPROVED**

### 3. Phase 2 Pilot Budget

**Total:** €38K (3 pilots: manufacturing €11K, utilities €17K, smart building €10K)  
**Timeline:** 6 months  
**Success Metric:** All 3 pilots run 30+ days without downtime; NGC Helm Charts compatibility confirmed  
**Recommendation:** ✓ **CONDITIONAL** (subject to Phase 1 validation)

---

## Outstanding Questions for HIC

1. **Partner Contact Strategy:** Direct iPCMax executive, or EU distributor channel?
2. **Liability Model:** Is DWS comfortable with joint hardware + software responsibility?
3. **Branding:** "DWS IQ Industrial" or co-branded "DWS IQ + iPCMax Sovereign AI"?
4. **Support Tier:** DWS-provided support, or resell iPCMax + DWS software layer?

---

## What's Left to Do

### If HIC Approves Phase 1:

1. **Assign DWS Engineer** (target: week of Sept 6)
   - Own the whitepaper writing
   - Coordinate with iPCMax technical team
   - Validate Kubernetes/NGC Helm Chart compatibility

2. **Schedule Kickoff Call** with iPCMax (by Sept 13)
   - Introduce Phase 1 scope
   - Discuss technical collaboration
   - Clarify BoM + pricing for product tiers

3. **Identify Pilot Customer Prospects** (by mid-Sept)
   - Manufacturing facility (EU-based, 50–500 employees)
   - Utility company (power grid, load forecasting use case)
   - Smart building operator (HVAC + occupancy optimization)

4. **Phase 1 Deliverables** (by mid-October)
   - Joint whitepaper: "Sovereign Industrial AI Reference Architecture"
   - NGC Helm Charts integration guide + deployment scripts
   - Validated Bill of Materials (all 3 tiers)
   - First pilot customer pitch deck

### Checkpoint (Week 6–8 of Phase 1)

- HIC review of draft whitepaper
- Kubernetes compatibility test results confirmed
- Decision on Phase 2 pilot budget commitment
- Identification of 1–2 final Phase 2 customer pilots

---

## Repository State

### Files Created This Session

1. **Evaluation Document:**
   - Path: `docs/lut/ipcmax-serdex-hardware-partner-evaluation-2026-08.md`
   - Version: 1.0
   - Status: Complete, ready for review
   - Size: ~12KB

2. **Field Note:**
   - Path: `docs/field-notes/2026-08-30-ipcmax-serdex-partnership-evaluation.md`
   - Version: 1.0
   - Status: Complete, ready for review
   - Size: ~4KB

3. **Reference Architecture Image:**
   - Path: `docs/assets/images/ipcmax-dgx-spark-reference-architecture-2026-08.png`
   - Status: To be embedded/saved
   - Note: Kubernetes cluster topology + data flow diagram

### No Changes to Existing Files

- No modifications to dws10.com product config
- No pricing updates (awaiting HIC approval)
- No integration yet (Phase 1 is evaluational, not implementational)

---

## How to Continue This Work

### If HIC Approves:

1. **Next Session Should:**
   - Confirm HIC approval decisions (Phase 1, partner outreach, pilot budget)
   - Assign DWS engineer to Phase 1 whitepaper
   - Draft partnership outreach email to iPCMax/Serdex
   - Create Phase 1 project plan + detailed BoM

2. **Push Changes:**

   ```bash
   git add docs/lut/ipcmax-serdex-hardware-partner-evaluation-2026-08.md
   git add docs/field-notes/2026-08-30-ipcmax-serdex-partnership-evaluation.md
   git add docs/assets/images/ipcmax-dgx-spark-reference-architecture-2026-08.png
   git commit -m "evaluate: iPCMax/Serdex as hardware partner for dws10.com — Phase 1 reference architecture (HIC decision pending)"
   git push -u origin claude/ipcmax-serdex-evaluation-orp38x
   ```

3. **Create Pull Request:**
   - Title: "Evaluate iPCMax/Serdex as hardware partner for dws10.com"
   - Description: Link to evaluation doc + field note, summarize key decisions for HIC
   - Mark as **DRAFT** until HIC approves Phase 1 (then convert to READY FOR REVIEW)

### If HIC Rejects:

1. Archive this branch (no further work)
2. Close any associated PR as "not proceeding"
3. Document rationale in field note

---

## Reference Materials

### Key Documents in This Branch

- **Evaluation:** `docs/lut/ipcmax-serdex-hardware-partner-evaluation-2026-08.md` (8 sections, 12KB, v1.0)
- **Field Note:** `docs/field-notes/2026-08-30-ipcmax-serdex-partnership-evaluation.md` (executive summary, 4KB, v1.0)
- **Architecture Diagram:** `docs/assets/images/ipcmax-dgx-spark-reference-architecture-2026-08.png` (Kubernetes topology)

### External References

- NVIDIA NGC Helm Charts: https://docs.nvidia.com/cuda/container-toolkit/
- NVIDIA DGX Spark: https://www.nvidia.com/en-us/data-center/dgx-spark/ (dws10.com/price-list)
- iPCMax: https://www.ipcmax.eu/
- GDPR Article 32: https://gdpr-info.eu/art-32-gdpr/
- EU AI Act Article 14: https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:52021PC0206

### Related DWS Standards

- `CLAUDE.md` § "Source-of-Truth Rules" (pricing, product config)
- `DWS_TRUTH_STANDARD.md` (canonical product facts for dws10.com)
- `DWS_MARKET_RESEARCH_STANDARD.md` (partner evaluation framework)

---

## Session Metadata

- **Tool:** Claude Code (Haiku 4.5)
- **Session ID:** claude/ipcmax-serdex-evaluation-orp38x
- **Created:** 30.08.2026
- **Branch:** claude/ipcmax-serdex-evaluation-orp38x
- **Status:** Ready for HIC review
- **Confidentiality:** Business Confidential — Lifetime Oy

---

## Next Handoff Notes

For the next session (whether continuing Phase 1 or closing this work):

- HIC decision on all three approval gates (Phase 1, partner outreach, pilot budget)
- DWS engineer assignment (if approved)
- iPCMax contact introduction (if approved)
- Phase 1 project timeline confirmation
- First milestone: whitepaper outline + partner kickoff call

---

**Prepared by:** Claude Code (Haiku 4.5)  
**For:** Risto Anton Päärni, Founder, CEO  
**Contact:** risto.paarni@lifetime.fi · +358 400 319 010

---

_This handoff file is the working memory for the `claude/ipcmax-serdex-evaluation-orp38x` branch. Update it before ending any continuation session._

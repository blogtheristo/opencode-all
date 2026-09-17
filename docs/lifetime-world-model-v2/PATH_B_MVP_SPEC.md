# Lifetime World Model v2 — Path B MVP Engineering Specification

**Status**: Engineering execution ready  
**Timeline**: 90 days (3 × 4-week sprints)  
**Budget**: €682K  
**Team**: 12 FTE  
**Success Gate**: Week 12 pilot customer contract signed

---

## Sprint 1: World Model Training (Weeks 1–4)

### Objectives

- Acquire 1000+ hours warehouse AMR telemetry
- Train spatial physics prediction model (3-frame future)
- Validate 24-language tokenizer (DE, EN, SV priority)
- Gate: Model achieves >85% accuracy on collision/obstacle prediction

### Deliverables

#### 1.1 Telemetry Dataset Acquisition

- **Sources**:
  - DWS IQ existing fleet (if available)
  - Partner logistics operator (Helsinki or EU hub)
  - Synthetic simulation (if real data insufficient)
- **Data format**: Jetson Orin sensor logs (camera, lidar, IMU, motor telemetry)
- **Volume target**: 1000+ hours continuous driving
- **Quality check**: Remove corrupted/null frames; validate timestamp continuity
- **Storage**: DGX Spark local NVMe (temporary); archive to EU-sovereign storage post-training

#### 1.2 Tokenizer Development (Multilingual)

- **Base**: Llama 3.1 tokenizer (90+ language support)
- **Customization**: Add AMR-specific tokens
  - Safety commands: "STOP_IMMEDIATE", "RETURN_HOME", "COLLISION_RISK"
  - Sensor labels: "lidar_front_3m", "motor_temp_critical", "battery_low"
  - ERP transaction fields: "part_id", "urgency_level", "vendor_cbam_score"
- **Languages (MVP)**: German (DE), English (EN), Swedish (SV) as Tier 1
  - Test on 5,000 safety-command examples per language
  - Measure: inference latency <50ms on Jetson Orin, token efficiency >0.95 tokens/word
- **Test harness**:
  ```typescript
  // Validate tokenizer on multilingual safety corpus
  const safetyCommands = [
    { de: "Sofort stoppen", en: "Stop immediately", sv: "Stoppa omedelbar" },
    { de: "Hindernis erkannt", en: "Obstacle detected", sv: "Hinder upptäckt" },
  ];
  for (const cmd of safetyCommands) {
    for (const [lang, text] of Object.entries(cmd)) {
      const tokens = tokenizer.encode(text);
      assert(tokens.length < 10, `${lang} tokenization too long`);
    }
  }
  ```

#### 1.3 World Model Architecture

- **Base**: Llama 3.1 ~55B parameter model (or smaller if compute-constrained)
- **Fine-tuning approach**: LoRA (8-12B adapter) on AMR-specific data
- **Training data composition**:
  - 70% telemetry → physics prediction (3-frame future: given frame N, predict N+1, N+2, N+3)
  - 20% safety commands → language grounding (parse commands in 24 languages)
  - 10% synthetic simulation → regularization
- **Physics objective**: Predict next 3 frames of camera/lidar data
  - Loss: L2 distance on visual features + collision probability
  - Metric: Accuracy on held-out test set >85%
- **Regulatory tensor (MVP scope)**:
  - GDPR constraint: No personal data (faces, license plates) in stored telemetry
  - EN 15978 constraint: Emissions accounting disabled at MVP (Phase 2)
- **Training schedule**:
  - Week 1: Data preparation + tokenizer validation
  - Week 2-3: LoRA fine-tuning on DGX Spark (8× H100, ~8-12 days training time)
  - Week 4: Evaluation + validation on held-out set

#### 1.4 Gate 1 Validation (Week 4)

**Success criteria** (all must pass):

- [ ] Tokenizer: <50ms latency on Jetson Orin, all 3 languages >95% parse rate
- [ ] Physics model: >85% accuracy predicting 3-frame future on collision/obstacle scenarios
- [ ] Safety commands: Model correctly parses emergency stop in DE/EN/SV with <5% error rate
- [ ] Data quality: 1000+ hours telemetry validated, no NaN/corrupted frames

**Decision**: Proceed to Sprint 2 (Edge integration) or debug/retrain

---

## Sprint 2: Edge-to-Cloud Integration & ERP Binding (Weeks 5–8)

### Objectives

- Deploy Jetson Orin nodes on 3-5 pilot AMRs
- Validate sub-100ms latency (DGX Spark → Jetson inference round-trip)
- Bind single ERP (IFS Cloud or Visma) for RFQ creation
- Gate: First autonomous RFQ issued and recorded

### Deliverables

#### 2.1 Jetson Orin Deployment

- **Hardware**: NVIDIA Jetson Orin Nano or NX (2-8 TOPS per device)
- **Nodes**: 3-5 deployed on pilot warehouse AMRs
- **OS**: Ubuntu 22.04 LTS (official Jetson image)
- **Dependencies**: CUDA 12.x, cuDNN, TensorRT for model inference
- **Model format**: Convert Llama LoRA weights to TensorRT (int8 quantization for speed)
  - Target latency: <100ms per inference on Jetson (including tokenization + forward pass + detokenization)
- **Networking**: Isolated mesh (no direct internet; DGX Spark acts as gateway)
  - Sync protocol: Encrypted latent vectors only (compressed <1MB per decision)
  - Fallback: If network latency >150ms, Jetson reverts to local deterministic safety profile

#### 2.2 Edge-to-Cloud Latent Sync Protocol

- **Architecture**:
  ```
  Jetson (edge) inference
    ↓
  Extract spatial latents (compressed, ~100KB)
  ↓
  Encrypt with session key
  ↓
  Send to DGX Spark (gateway)
  ↓
  Log to Aegis (immutable, Article 13)
  ↓
  (Optional) Update world model with new observations
  ```
- **Compression**: Use attention-based summarization
  - Keep only decision-relevant features (collision risk, wear indicators)
  - Discard ambient video data
  - Target: <1MB per decision (<100ms round-trip on 10Mbps edge link)
- **Encryption**: AES-256-GCM (NIST-approved)
- **Resilience**:
  - Retry logic: Exponential backoff (2s, 4s, 8s, 16s)
  - Circuit breaker: If 3 consecutive failures, switch to local fallback
  - Logging: Every network event (latency, failure reason, fallback trigger)

#### 2.3 ERP Integration (Single: IFS Cloud or Visma)

- **Choice decision** (Week 5):
  - **IFS Cloud**: Modern REST APIs, 3-4 week integration
  - **Visma**: Faster setup, Nordic focus, 2-3 week integration
  - **Recommendation**: Visma (MVP speed priority); add IFS/SAP in Phase 2
- **Integration scope** (MVP):
  - **Trigger**: When spatial model detects X% motor wear (configurable threshold)
  - **Action**: Create RFQ in ERP
  - **Payload**:
    ```json
    {
      "part_id": "MOTOR_DRIVE_24V_500W",
      "location": "warehouse_aisle_A3",
      "urgency": "high",
      "quantity": 1,
      "requested_delivery_days": 2,
      "cbam_required": false,
      "note_for_procurement": "Predictive maintenance, wear detected on AMR unit #001"
    }
    ```
  - **Response handling**: RFQ created → logged to Aegis with ERP transaction ID
- **API binding**:
  - Use OAuth 2.0 for authentication
  - Validate API rate limits (safety threshold: 10 RFQs/minute max)
  - Retry on transient errors (5xx, timeout)
  - Dead-letter queue for failed RFQs (manual intervention)
- **Testing**:
  - Unit test: Mock ERP API, verify RFQ JSON schema
  - Integration test: Deploy to IFS/Visma sandbox, execute 5 end-to-end RFQs
  - Load test: 50 RFQs/minute burst (verify no queue overflow)

#### 2.4 Gate 2 Validation (Week 8)

**Success criteria** (all must pass):

- [ ] Jetson Orin latency: Measured <100ms end-to-end (tokenize + infer + compress + encrypt)
- [ ] Network resilience: Fallback triggered on 150ms+ latency, AMR safely reverts to stop-in-place
- [ ] First RFQ issued: Autonomous trigger → ERP RFQ created → Aegis logged
- [ ] ERP API binding: 5+ test RFQs completed, all POs created in sandbox

**Decision**: Proceed to Sprint 3 (Pilot operations) or debug integration issues

---

## Sprint 3: Pilot Operations & Audit Readiness (Weeks 9–12)

### Objectives

- 3-5 AMRs live in warehouse, executing autonomous decisions
- 20+ spatial predictions logged (collision avoidance, wear indicators)
- 5+ commerce triggers executed (RFQs issued)
- Article 13 compliance verified
- Pilot customer contract signed
- Gate: All audit records complete, externally verified

### Deliverables

#### 3.1 Pilot Operations

- **Location**: Helsinki warehouse (partner site identified in Week 5)
- **AMR deployment**: 3-5 units, 8-hour operational window daily
- **Safety supervision**: On-site human operator (fallback authority)
- **Monitoring dashboard**:
  - Real-time latency (Jetson → DGX Spark)
  - Spatial prediction confidence scores
  - Safety override triggers (network latency, model uncertainty)
  - RFQ creation log
- **Success metric**: 20+ spatial decisions logged, zero safety incidents

#### 3.2 Aegis Audit Logging (Article 13 Compliance)

- **Log format** (immutable, append-only):
  ```json
  {
    "audit_id": "audit_2026w12_001",
    "timestamp_utc": "2026-09-15T14:32:15Z",
    "asset_id": "amr_warehouse_001",
    "decision_type": "spatial_prediction",
    "input": {
      "sensor_modalities": ["lidar", "camera", "imu"],
      "compressed_latent_hash": "sha256_7a4d...",
      "model_version": "world_model_v2_amr_lora_1.0"
    },
    "prediction": {
      "collision_risk": 0.23,
      "wear_indicator": 0.67,
      "confidence": 0.91
    },
    "regulatory_checks": [
      { "rule": "gdpr_data_residency", "status": "passed" },
      { "rule": "en_15978_local_scope", "status": "passed" }
    ],
    "action_taken": "predict_next_frame",
    "action_logged_to": "commerce_trigger_queue",
    "approval_timestamp": "2026-09-15T14:32:16Z",
    "human_reviewer": null,
    "immutable_hash": "sha256_9f2c..."
  }
  ```
- **Storage**: PostgreSQL (EU-sovereign Aiven instance)
- **Access control**: Read-only for pilot customer + external auditor
- **Retention**: 10 years (regulatory requirement for industrial autonomy)

#### 3.3 Article 13 Transparency Report (Weekly)

- **Audience**: Pilot customer + external auditor
- **Content**:
  - Count of spatial decisions (pass/fail)
  - Count of commerce triggers (RFQs issued)
  - Safety violations: 0
  - Model version + training data hash
  - All regulatory checks passed/failed
  - Incident log (network failures, fallback activations)
- **Example**:

  ```
  ARTICLE 13 TRANSPARENCY — Week 12 (2026-09-15)
  ════════════════════════════════════════════════

  Autonomous Decisions:
    • Spatial predictions: 247 (collision avoidance, path planning)
    • Commerce triggers: 8 (RFQs issued)
    • Safety violations: 0
    • Fallback activations: 2 (network latency >150ms, recovered)

  Regulatory Compliance:
    • GDPR data residency: 100% pass
    • EN 15978 scope: 100% pass
    • Model transparency: All decisions logged + auditable

  Model Provenance:
    • Model version: world_model_v2_amr_lora_1.0
    • Training data: 1247 hours warehouse telemetry
    • Training date: 2026-09-08
    • Last update: 2026-09-14

  Auditor Notes:
    • All logs verified immutable (hash chain intact)
    • No unauthorized modifications detected
    • Ready for regulatory inspection
  ```

#### 3.4 Gate 3 Validation (Week 12)

**Success criteria** (all must pass):

- [ ] 3-5 AMRs live, 100+ hours operational
- [ ] 20+ spatial predictions logged, 5+ commerce triggers executed
- [ ] Article 13 report generated, no audit findings
- [ ] Zero safety incidents
- [ ] Pilot customer signed contract (referenceable)

**Decision**: Lock Path B success; greenlight Phase 2 expansion

---

## Critical Dependencies & Risk Mitigation

| Risk                                  | Mitigation                                                                 |
| ------------------------------------- | -------------------------------------------------------------------------- |
| Telemetry acquisition delays          | Identify backup partner by Week 1; use simulation if real data unavailable |
| Model convergence slow                | Have pre-trained baseline ready; early stop if validation loss plateaus    |
| Jetson latency exceeds 100ms          | Profile inference on device; optimize with TensorRT int8 quantization      |
| ERP API integration blockers          | Contact ERP vendor Week 3; have sandbox access confirmed Week 4            |
| Network instability in pilot location | Deploy local WiFi mesh; test fallback mechanism extensively in Week 8      |
| Regulatory audit findings             | Engage external auditor Week 10; fix findings before Week 12 gate          |

---

## Files to Create

1. `/src/world-model/v2-amr-tokenizer.ts` — Tokenizer + validation
2. `/src/world-model/v2-amr-physics-training.ts` — Training loop (LoRA)
3. `/src/world-model/v2-edge-inference.ts` — Jetson inference + latent sync
4. `/src/compliance/article-13-amr-logger.ts` — Aegis audit logging
5. `/infrastructure/jetson-orin/deployment-manifest.yml` — Jetson deployment config
6. `.claude/hooks/world-model-v2-gate-checks.sh` — Automated gate validation

---

## Success Metrics (End of Sprint 3)

- ✅ World model accuracy: >85% on 3-frame physics prediction
- ✅ Edge latency: <100ms Jetson → DGX Spark round-trip
- ✅ Regulatory: Article 13 audit 100% pass, zero findings
- ✅ Commerce: 5+ RFQs issued, POs created in ERP
- ✅ Safety: Zero incidents, zero unauthorized fallback activations
- ✅ Customer: Pilot contract signed, referenceable

---

**Document Version**: 1.0  
**Status**: Ready for Week 1 execution  
**Next Review**: Week 4 (Model Validation Gate)

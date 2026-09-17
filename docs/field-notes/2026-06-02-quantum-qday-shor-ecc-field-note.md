# Field Note #3: Q-Day Just Got Closer — Shor-on-ECC, ZK Censorship, Neutral Atoms, and the Race to Post-Quantum

***

# VERSION AND AGENT HISTORY

Version: 1.5

Sessions & Modifications:

- Version: 1.5 | Tool: Claude Code | Session: claude/quantum-cryptography-qday-jSxZl | Date: 02.06.2026 | Changes: Added source leanSpec (`github.com/leanEthereum/leanSpec`) — the Python specification + test-vector framework encoding lean Ethereum's post-quantum consensus, Poseidon1, and hash-based signatures as executable spec. Cited in §4 alongside leanVM + appendix.
- Version: 1.4 | Tool: Claude Code | Session: claude/quantum-cryptography-qday-jSxZl | Date: 02.06.2026 | Changes: Added new source — Ethereum Research thread 25040 "Exploring the Design Space for a Post-Quantum Public Key Registry for Ethereum Validators" (Coratger, Wambsgans, Ladislaus, Thiery, Drake): leanXMSS hash-based validator keys (52-byte Merkle root + 20-byte param; ~52 MiB consensus-state growth for ~1M validators), and multi-hash registration (Poseidon1/BLAKE3/SHA-3) as crypto-agility — the first concrete Ethereum PQC migration step and direct validation of the DWS9 multi-hash thesis. Added to §4 + appendix.
- Version: 1.3 | Tool: Claude Code | Session: claude/quantum-cryptography-qday-jSxZl | Date: 02.06.2026 | Changes: Pinned the concrete primary-source video for the neutral-atom claim — Drake's ZKProof talk "Justin Drake on Neutral Atoms, Quantum Cryptanalysis, Google 2029, with ZKProof.org cryptographers" (youtu.be/XEGK0Ot1m-A) — replacing the generic "search zkproof neutral atom" pointer.
- Version: 1.2 | Tool: Claude Code | Session: claude/quantum-cryptography-qday-jSxZl | Date: 02.06.2026 | Changes: Caught additional verified detail from Justin Drake's X thread (corroborated across Decrypt, The Block, CryptoTimes, Protos, Quantum Insider): hard resource estimates (~1,200 logical qubits / <90M Toffoli, or 1,450 / 70M; ~20× cut vs prior), attack time "in minutes" on a superconducting machine, the narrower "10% by 2032 recovers a secp256k1 ECDSA key from an exposed BTC public key" claim, the ~6.7M BTC / >$462B exposed-public-key exposure figure, and Google's own cryptocurrency whitepaper as a primary source. Added §1.4 (resource estimates) and the exposed-key risk line.
- Version: 1.1 | Tool: Claude Code | Session: claude/quantum-cryptography-qday-jSxZl | Date: 02.06.2026 | Changes: Corrected source provenance — the underlying external narrative is authored by Justin Drake (Ethereum Foundation researcher; co-author of the Google Quantum AI paper and a lead on the lean-Ethereum post-quantum migration). Named the source throughout instead of an anonymous "self-described co-author."
- Version: 1.0 | Tool: Claude Code | Session: claude/quantum-cryptography-qday-jSxZl | Date: 02.06.2026 | Changes: Initial research field note (DWS8-era) digesting the 2026 quantum-cryptanalysis wave — Google Quantum AI's Shor-on-secp256k1 paper and its zero-knowledge "academic censorship", Schrottenloher's rediscovery, the ecdsa.fail Shor-at-home challenge, Oratomic's 10K-physical-qubit neutral-atom claim, revised q-day odds, and the Ethereum post-quantum migration (leanVM). Maps every signal onto the DWS post-quantum posture established in Field Note #2.

Session Links & References:

- Claude Code (claude/quantum-cryptography-qday-jSxZl): https://github.com/blogtheristo/dws6/tree/claude/quantum-cryptography-qday-jSxZl

Document Status:

- Created: 02.06.2026
- Last Modified: 02.06.2026
- Language: English
- Languages Available: EN
- Publication Status: ACTIVE — internal research field note
- Document Type: Field Note / Quantum Security Research / Competitive-Regulatory Signal

Related Documents:

- `docs/field-notes/2026-05-28-three-pillars-sovereignty-global.md` — Field Note #2 (post-quantum cryptographic overlay; HNDL; NIST FIPS 203/204/205; Rightful Oy R-Sac²)
- `docs/field-notes/2026-02-06-ai-safety-report-2026-field-note.md` — Field Note (AI capability acceleration; autoresearch)
- `docs/PHD_FIREHORSE_EN.md` — scientific/long-horizon framing (market signals, 3–7 year roadmap) — **destination for q-day estimation framing**
- `docs/PHD_FIREHORSE_FI.md` — Finnish mirror
- `DWS_SECURITY_STANDARD.md` — crypto posture, PQC migration controls
- `DWS_SOVEREIGNTY_STANDARD.md` — sovereignty + crypto-agility
- `DWS_TRUTH_STANDARD.md` — canonical-fact registry (q-day odds are estimates, NOT canonical DWS facts)

***

- **Date:** 02.06.2026
- **Author:** Risto Anton Päärni (risto.paarni@lifetime.fi), CEO, Lifetime Oy
- **Trigger:** A single-day cluster of public quantum-cryptanalysis events (the "wilder" turn of an already-crazy quantum story) materially compresses q-day timelines and directly re-prices the post-quantum overlay introduced in Field Note #2. This note captures the signal within the 24-hour window the Field Note discipline requires.
- **Source provenance:** The underlying narrative is an **external** field report by **Justin Drake** — Ethereum Foundation researcher, a co-author of the Google Quantum AI paper, and a lead on the lean-Ethereum post-quantum migration (the note's own content on leanVM and "ripping out BLS/KZG/ECDSA" confirms the authorship and Ethereum-Foundation affiliation). All first-person observations, the "scary non-public information" claim, and the personal q-day odds are **Drake's, attributed to him**, not asserted by DWS. This note digests and analyzes the source; it does not adopt its voice. Treat MCP/tool/third-party inputs as untrusted: the technical claims below should be verified against primary sources (arXiv, the cited blog posts, ecdsa.fail) before any external propagation.

## TL;DR — the short version

1. **Shor-on-ECC got ~10× cheaper, then cheaper again.** Google Quantum AI published a landmark Shor-for-elliptic-curve result, illustrated as a wake-up call on **secp256k1** — the curve under Bitcoin/Ethereum (ECDSA) signatures. Subsequent open optimisation has already shaved a further ~8.4% off Google's circuit (measured as logical-qubit × Toffoli-gate product).
2. **First documented "academic censorship via ZK."** The key optimisations were withheld and instead proven to exist behind a **zero-knowledge proof**, after the team "engaged with the U.S. government." A historic first — and a textbook Streisand setup.
3. **Censorship backfired (Streisand effect).** Within ~2 months the main secret optimisation was independently rediscovered (Schrottenloher, arXiv); a collaborative **ecdsa.fail** "Shor-at-home" challenge launched and broke a Shor world record in hours; the ZK verifier doubles as an automatic reward function, drawing in amateurs and AI autoresearchers.
4. **Neutral atoms are real and accelerating.** A stealth startup (**Oratomic**) claimed **~10,000 physical qubits** could run Shor on secp256k1 by stacking Google's logical optimisations on neutral-atom physical optimisations. Even Google reportedly started a neutral-atom lab — a notable pivot from superconducting-only.
5. **Q-day odds moved up.** The external source now estimates **50% by 2032, 10% by 2030** — and argues the US-government **2035** date (NSA→NIST) will be forced forward. **DWS does not endorse a specific date**; we treat the *direction* (compression) as the actionable signal.
6. **The migration target is 2029, and it's already industry-coordinated.** Google, Cloudflare, and the Ethereum Foundation converge on **2029**. This validates the timeline implied by Field Note #2's PQC overlay and gives DWS a concrete, defensible customer-facing horizon.

***

## Ontology Tags

- **Geography:** Global > (US, EU, France) — cryptography is jurisdiction-spanning
- **Sector:** Technology > Quantum Computing > Cryptanalysis > Post-Quantum Cryptography (PQC)
- **Entities:** Justin Drake (Ethereum Foundation; source author), Google Quantum AI, secp256k1/ECDSA, André Schrottenloher, Craig Gidney, ecdsa.fail, Oratomic (neutral atoms), NSA, NIST, Cloudflare, Ethereum Foundation, leanVM/leanEthereum, DWS IQ, Lifetime Oy
- **Temporal Context:** 2026-Q2 (event cluster ~2026-06-02); q-day horizon 2030–2035; migration target 2029
- **Confidence:** Medium-High on the *direction* of travel (timeline compression); Medium on specific figures (single-source, pre-replication on some claims); **estimates, not canonical facts**
- **Regulatory Context:** NIST FIPS 203/204/205 (selected PQC standards), NSA CNSA 2.0 / 2035 deadline, EU NIS2/DORA crypto-agility expectations, GDPR (HNDL re-identification risk)

***

## §1. What happened — the technical wave

### 1.1 Google's Shor-on-secp256k1 paper

Google Quantum AI published a landmark optimisation of **Shor's algorithm for elliptic-curve discrete logarithms** — a claimed **~10× improvement** over the prior state of the art. As a deliberate "stunt and wake-up call" to the blockchain space, the optimisations were illustrated on **secp256k1**, the curve underlying Bitcoin and Ethereum ECDSA signatures. The headline is not "Bitcoin is broken today" — it is that the *cost of the eventual break dropped sharply*, and the resource curve is steepening.

### 1.2 The sociological bombshell: ZK "academic censorship"

The most unusual aspect was procedural, not mathematical. Rather than following normal academic disclosure, the key optimisations were **kept secret and wrapped behind a zero-knowledge (ZK) proof** that demonstrates the *existence* of the improvements without leaking their details. Google's blog noted the team "engaged with the U.S. government." Per the source, world expert Craig Gidney had been sitting on the central optimisation for ~a year under censorship pressure.

**Why DWS cares:** This is a new *governance* primitive — proving capability while withholding method, negotiated with a state actor. It signals that (a) the offensive cryptanalytic frontier is now considered sensitive enough for prior restraint, and (b) public q-day estimates systematically *understate* private capability. For threat modeling, assume the public number is a floor.

### 1.3 Streisand: rediscovery + crowd-sourced acceleration

Censorship backfired predictably:

- **Independent rediscovery.** ~2 months later, French quantum expert **André Schrottenloher** published *"Optimized Point Addition Circuits for Elliptic Curve Discrete Logarithms"* (arXiv), reconstructing the main secret optimisation.
- **Shor-at-home.** A collaborative **ecdsa.fail** challenge launched and **broke a Shor world record within hours**. The ZK **verifier program does double duty as an automatic submission filter / reward function**, so dozens of compounding micro-optimisations are rolling in — already an **~8.4% improvement** over Google's circuit (logical-qubit × Toffoli-gate product).
- **AI autoresearch lowers the barrier.** Karpathy-style autoresearch turned AI loose on Shor: the ZK verifier is an ideal reward function. Non-experts — reportedly even a teenager — are finding valid optimisations. This is the AI-capability acceleration of Field Note (2026-02-06) showing up directly inside cryptanalysis.

**Verification flag:** Schrottenloher's paper, Gidney's blog, and the ecdsa.fail leaderboard are the primary sources. The 8.4% figure is a moving target — cite as "as of early June 2026" and re-check before any external use.

### 1.4 The resource estimate — what "cheaper" means in numbers

Press coverage of Drake's thread, cross-checked against Google's own cryptocurrency whitepaper, puts concrete numbers on the break:

- **~1,200 logical qubits and under 90M Toffoli gates** — or an alternative profile of **~1,450 logical qubits and ~70M Toffoli gates** — to solve the 256-bit elliptic-curve discrete-log on secp256k1.
- A **~20× cut** in prior logical-qubit estimates.
- **Attack time "in minutes"** on a superconducting machine (once the qubits exist).
- **Exposure framing:** Drake's narrower, more conservative claim is **"at least a 10% chance that by 2032 a quantum computer recovers a secp256k1 ECDSA private key from an exposed public key."** Coverage estimates **~6.7M BTC (>$462B at quote-time)** sit in addresses with exposed public keys and are therefore in scope of this specific risk.

**Note the two-tier estimate.** Drake's general q-day odds (§3, 50%/2032 · 10%/2030) and this narrower **10%/2032 "actual secp256k1 key recovery from an exposed pubkey"** figure are *different statements at different specificity* — the narrower one is the more directly falsifiable, asset-at-risk number. Keep them distinct when citing.

## §2. Neutral atoms and the q-day curve

On the same day as Google, stealth startup **Oratomic** published a coordinated Shor paper (reportedly the most-upvoted on scirate). Its claim: by combining **Google's logical optimisations** with **neutral-atom physical optimisations**, **~10,000 physical qubits** suffice to run Shor on secp256k1 — an astonishingly low number versus the millions long assumed for superconducting paths.

Drake reports spending ~hundreds of hours diligencing the technology and concluded the tech is "very real," noting Google itself reportedly opened a **neutral-atom lab** — a strategic pivot from its superconducting-only focus. Drake's ~30-minute ZKProof talk lays this out: **"Justin Drake on Neutral Atoms, Quantum Cryptanalysis, Google 2029, with ZKProof.org cryptographers"** (YouTube `XEGK0Ot1m-A` — https://youtu.be/XEGK0Ot1m-A).

**DWS read:** Neutral atoms are the variable that could pull q-day left of every superconducting-extrapolation roadmap. We should **add a neutral-atom track** to our quantum-threat monitoring (qubit-count milestones, error-correction thresholds, lab announcements), independent of superconducting progress.

## §3. Q-day estimation — and the silence

Neither Google nor Oratomic stated **q-day implications** — no timelines. Drake fills the gap (echoing Scott Aaronson's late-April post) with personal estimates:

| Estimate | Source / Status |
|----------|-----------------|
| **50% chance of q-day by 2032** | Justin Drake's personal estimate (incl. claimed non-public info) — **NOT a DWS figure** |
| **10% by 2030** | Justin Drake's personal estimate — **NOT a DWS figure** |
| **2035** | US-government (NSA→NIST / CNSA 2.0) deadline for retiring quantum-vulnerable crypto; source argues it will be pulled forward |
> **DWS position (canonical-fact discipline, per `DWS_TRUTH_STANDARD.md`):** DWS does **not** publish a specific q-day date or probability as a canonical fact. These are third-party estimates. What DWS treats as actionable is the **direction**: multiple independent 2026 signals compress the timeline and converge on the **2030–2035** window already named in Field Note #2. The defensible customer-facing migration target remains **2029**.

## §4. Post-quantum migration — the constructive half

Drake's prescription matches DWS's: **do not panic; do migrate deliberately.** Rushing into immature PQC is its own failure mode.

- **Target date 2029** (~3.5 years out) — coordinated across **Google, Cloudflare, and the Ethereum Foundation**.
- **Ethereum's "lean" PQC migration** is replacing BLS signatures (consensus), KZG commitments (data), and ECDSA (execution) with **hash-based cryptography**, built on **leanVM** (`github.com/leanEthereum/leanVM`) — a minimal zkVM (hash-based SNARKs) crafted for end-to-end formal verification. The protocol itself is pinned in **leanSpec** (`github.com/leanEthereum/leanSpec`), the Python specification + test-vector framework that encodes the post-quantum consensus, Poseidon1, and hash-based-signature design as executable spec — i.e. the migration is being formally specified, not just prototyped.
- **Two $1M open prizes** signal where the hard problems sit: the **Proximity Prize** (coding-theory conjecture / better hash-based SNARKs) and the **Poseidon Initiative** ($1M to break the SNARK-friendly Poseidon hash).
- **First concrete migration step (June 2026):** an Ethereum Research post, *"Exploring the Design Space for a Post-Quantum Public Key Registry for Ethereum Validators"* (Coratger, Wambsgans, Ladislaus, Thiery, **Drake**), proposes replacing BLS12-381 validator keys with **leanXMSS** (hash-based XMSS). Each key becomes a **52-byte Merkle root + 20-byte public parameter** (vs today's 48-byte BLS key) — registering ~1M validators expands consensus state by ~**52 MiB**. Critically, it treats the **hash function as open design space**: with Poseidon2 under cryptanalytic pressure, the authors weigh **registering validators under multiple hash functions up front (Poseidon1, BLAKE3, SHA-3)** to preserve agility. **This is crypto-agility implemented as a registry — direct validation of the DWS9 "multi-hash / swap-under-load" thesis.**

**Why this matters to DWS:** Hash-based + formally-verified-zkVM is exactly the "crypto-agility with conservative primitives" posture our sovereignty thesis demands. It is strong external validation of the Field Note #2 claim that *"sovereignty without crypto-agility is sovereignty with an expiry date."*

***

## §5. DWS Relevance & Insight

1. **Field Note #2's PQC overlay is now validated by events, not just argued.** HNDL is no longer a theoretical "in 7–15 years" risk — the *cost-of-break curve is visibly bending this quarter*. Every customer harvesting RSA/ECC traffic today should be modeled as already exposed.
2. **The public number is a floor, not a ceiling.** The ZK-censorship episode is direct evidence that state actors consider these capabilities sensitive. Threat models must assume private capability exceeds public disclosure.
3. **AI autoresearch compresses *all* cryptanalytic timelines.** The same capability acceleration we sell around (Firehorse, agentic research) is now a generic accelerant for *offensive* cryptanalysis. This belongs in our risk narrative, not just our growth narrative.
4. **Neutral atoms deserve their own monitoring track.** Superconducting-roadmap extrapolations may understate q-day. Watch lab announcements and physical-qubit milestones separately.
5. **2029 is a defensible, non-alarmist migration target.** It aligns DWS with Google/Cloudflare/Ethereum Foundation — credible company for any enterprise or regulator conversation, and it avoids the discredited 2035 anchor.
6. **Crypto-agility is the product requirement, not "more qubits."** Customers cannot predict q-day; they *can* be made algorithm-replaceable. That is the sellable, controllable deliverable — and the Rightful Oy R-Sac² instrument (Field Note #2) is the EU-origin path to it.

## §6. Next Steps (follow-up actions)

- [ ] **Cross-link into the PhD thesis, not the master's thesis.** Per the Thesis Content Scope Rule, q-day estimation, competitor/market signals, and standardization-body activity (NIST/NSA) belong in `docs/PHD_FIREHORSE_EN.md` / `_FI.md` (scientific, 3–7 year horizon) — **not** the implementation-focused Metropolia master's thesis. Add a "Quantum threat timeline / PQC migration" subsection referencing this field note. *(Separate change; keep EN+FI in lockstep per the Thesis Rule.)*
- [ ] **Add a quantum-threat monitoring track** under regulatory-radar / competitor-surveillance: superconducting milestones, **neutral-atom milestones**, NIST/NSA deadline movements, and the ecdsa.fail leaderboard. Codify as a recurring scan (Script Automation Rule) rather than ad-hoc reading.
- [ ] **Update `DWS_SECURITY_STANDARD.md`** to state the **2029 PQC migration target** and a crypto-agility requirement (algorithm-replaceability) explicitly, with NIST FIPS 203/204/205 as the baseline. *(Separate, reviewed change.)*
- [ ] **Customer-facing posture line** for sales/sovereignty decks: *"You cannot time q-day; you can become algorithm-replaceable. Target 2029 — the same date as Google, Cloudflare, and the Ethereum Foundation."* — route via Brand Standard before external publication.
- [ ] **Verify before propagating.** Confirm the secp256k1 framing, the ~10× and ~8.4% figures, the ~10K-qubit Oratomic claim, and the 2029 coordination against primary sources (arXiv, the cited blogs, ecdsa.fail). Per `DWS_TRUTH_STANDARD.md`, none of these become DWS "canonical facts" without a canonical source.

***

## Appendix — Source map (verify before external use)

| Claim | Where to verify | Status |
|-------|-----------------|--------|
| ~10× Shor-on-ECC improvement; secp256k1 illustration; ZK censorship; US-gov engagement | Google Quantum AI paper + blog (publicly dated ~31 March) | External, single-narrative — verify |
| Resource estimate ~1,200 logical qubits / <90M Toffoli (or 1,450 / 70M); ~20× cut; minutes on superconducting | Google cryptocurrency whitepaper (quantumai.google); Decrypt/The Block/CryptoTimes/Quantum Insider coverage of Drake thread | Corroborated across ≥3 secondary sources — verify against the whitepaper PDF |
| 10% by 2032 recovers secp256k1 ECDSA key from exposed pubkey; ~6.7M BTC / >$462B exposed | Drake X thread; Protos / CryptoTimes coverage | Drake estimate — **opinion + market-priced figure, verify** |
| Rediscovery of main optimisation | Schrottenloher, *Optimized Point Addition Circuits for ECDL*, arXiv | Primary source available — verify |
| Gidney sat on optimisation ~1 year | Gidney blog post | External — verify |
| ecdsa.fail challenge; ZK verifier as reward function; ~8.4% gain | ecdsa.fail leaderboard | Live, moving target — date-stamp any citation |
| Oratomic ~10K physical qubits via neutral atoms; scirate top paper | Oratomic paper; scirate | External — verify |
| Q-day 50%/2032, 10%/2030 | Justin Drake's personal estimate | **Opinion, not DWS fact** |
| US-gov 2035 deadline (NSA→NIST) | NSA CNSA 2.0 / NIST guidance | Verifiable policy date |
| 2029 migration coordination (Google/Cloudflare/Ethereum Foundation) | leanEthereum / public roadmaps | Verify |
| leanVM hash-based zkVM; leanSpec executable spec (Poseidon1, hash-based sigs, PQ consensus); Proximity Prize; Poseidon Initiative | `github.com/leanEthereum/leanVM`; `github.com/leanEthereum/leanSpec`; proximityprize.org; poseidon-initiative.info | Verify |
| PQ validator key registry; leanXMSS; 52-byte Merkle root + 20-byte param; ~52 MiB state; multi-hash agility (Poseidon1/BLAKE3/SHA-3) | ethresear.ch thread 25040 (Coratger, Wambsgans, Ladislaus, Thiery, Drake); The Defiant coverage | Primary source available — verify author spellings + figures |

*End of Field Note #3.*

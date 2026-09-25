# Application Letter — Doctoral Student in Networked Systems Security (KTH job ID 939588)

---

# VERSION AND AGENT HISTORY

Version: 2.1

Sessions & Modifications:

- Version: 2.1 | Tool: Claude Code | Session: claude/nato-diana-test-centers-ilezh9 | Date: 05.08.2026 | Changes: **Eligibility risk substantially de-risked.** Metropolia's study counsellor (Hanna Järvinen) confirmed directly, 05.08.2026, that the thesis and coursework are complete in OMA — only the administrative graduation notification (valmistumisilmoitus) and subsequent certificate issuance remain. Logged verbatim: `docs/metropolia/graduation-2026-08.md`. This changes the §"Read this before doing anything else" section from "wait or argue equivalent-knowledge" to "file the notification now, then check the certificate-issuance timeline against 23.08.2026." **Still not fully resolved** — timeline from notification to actual tutkintotodistus (needed for document 1 of 5) is unknown.
- Version: 2.0 | Tool: Claude Code | Session: claude/nato-diana-test-centers-ilezh9 | Date: 05.08.2026 | Changes: **Rewritten against the real job posting** (HIC pasted the full text, 05.08.2026) — this session's v1.0 was built on triangulated search snippets and got several things wrong or incomplete: (1) the letter prompt is "why you want to pursue research studies... academic interests and how they relate to previous studies and future goals," not a fit-pitch to the group's agenda — rewritten to that brief, and trimmed to the **hard 2-page maximum** the ad states; (2) the ad names **security and resilience of positioning/localization, including GNSS, as NSS's area of primary interest** — new section added, a genuine connection, not forced; (3) the application requires **five elements**, not two — certified diploma/grade copies + language certificate, CV, this letter, representative publications/technical reports, and **two reference letters with contact details** — none of the last three exist in this repo and none are fabricated here; (4) **flagged a real eligibility risk**: the founder's CV file (under `CV/`) lists a Metropolia UAS M.Sc. (Industrial Management) with the thesis **still in DRAFT** (`docs/metropolia/master-thesis/fi/V3Thesis_FI.md`, Publication Status: DRAFT as of this session) — KTH's admission requirement is a **passed** second-cycle degree; whether a not-yet-completed thesis satisfies this, or whether the ad's "substantially equivalent knowledge" clause is the applicable path instead, is asked of the HIC directly, not assumed either way.

Document Status:

- Created: 05.08.2026
- Last Modified: 05.08.2026
- Language: English
- Publication Status: **DRAFT — not submitted. Eligibility risk lowered 05.08.2026, timeline to certificate issuance still unconfirmed.**
- Classification: CONFIDENTIAL — Doctoral application

Related Documents:

- `People/partners/academic/panagiotis-papadimitratos.md` — supervisor/position profile, sourcing
- `docs/phd/PHD_DOCTORAL_HOME_DECISION_PROCESS_2026-08.md` — updated to name this as the concrete near-term route
- `docs/gtm/TECOSA_TORNGREN_CONCEPT_NOTE_2026-08.md` v2.2 — the parallel TECoSA/Törngren thread, cited here as existing context
- The founder's CV file under `CV/` — education section this letter's eligibility question is checked against
- `docs/metropolia/master-thesis/fi/V3Thesis_FI.md` — the thesis (content complete; repo's Publication Status field is stale, see below)
- `docs/metropolia/graduation-2026-08.md` — Hanna Järvinen's confirmation, logged verbatim

---

## ⚠️ Read this before doing anything else with this letter

**Eligibility risk substantially lowered, 05.08.2026 — but not fully closed.** KTH's admission requirement (per the actual posting) is:

> passed a second cycle degree (for example a master's degree), OR completed course requirements of at least 240 higher education credits, of which at least 60 second-cycle higher education credits, OR acquired, in some other way within or outside the country, substantially equivalent knowledge

**Update:** Metropolia's study counsellor confirmed directly that the M.Sc. thesis and coursework are complete in OMA — only the **graduation notification** (valmistumisilmoitus) is outstanding, followed by certificate preparation (`docs/metropolia/graduation-2026-08.md`). The repo's thesis file still shows Publication Status: DRAFT, but per this confirmation that field is now stale relative to the degree's actual academic completion — content-complete and administratively pending, not still being written.

**What is still open, and blocks finalizing this letter:**

1. **The graduation notification has not been filed yet** (HIC action, in OMA — this session cannot do it).
2. **The timeline from filing → certificate issuance is unknown.** KTH's document 1 (certified diploma/grade copies) needs an actual issued tutkintotodistus, or a substitute Metropolia is willing to issue faster (e.g. an official transcript / completion letter) — whether that timeline fits before 23.08.2026 has not been checked.

**No longer necessary:** arguing the "substantially equivalent knowledge" fallback path — the standard "passed degree" path is realistic once the notification is filed and processed in time.

---

## What this letter's format actually requires (per the real posting, not assumed)

The advertisement asks for **five separate elements**, only one of which is this document:

1. Certified copies of diplomas/grades + language-requirement certificates (English B/6 equivalent) — **not held by this session; a founder/registrar action.** Metropolia degree now content-complete pending the graduation notification (`docs/metropolia/graduation-2026-08.md`) — certificate timeline vs. 23.08.2026 still unconfirmed.
2. CV — exists, needs a KTH-application-specific version/format check, not drafted here.
3. **This letter** — max **2 pages**, on _why you want to pursue research studies, what your academic interests are, and how they relate to your previous studies and future goals_ (not, as v1.0 assumed, a pitch on fit to NSS's agenda — that belongs in the letter but is not the literal prompt).
4. **Representative publications or technical reports** (abstract + link if long) — **none exist to submit.** The closest candidates in this repo are internal standards (`Legal/KYA_STANDARD_v1.md`, `DWS_ARTICLE_12_LOGGING_STANDARD.md`) and the in-progress thesis — none are peer-reviewed publications, and whether an internal standard document is an acceptable "technical report" is itself a question for the founder to judge, not this session.
5. **Two reference letters, with detailed contact information** — **not sourced by this session.** Needs two people willing to be named as references, contacted directly by the founder.

**Items 1, 4 and 5 cannot be produced by this session under any circumstance — they require documents this repo does not hold and people this session has no relationship with.** Listing them here is not deferral for convenience; there is no tool or information path to complete them.

---

## Application letter (draft, ≤2 pages, per the real prompt)

Dear Professor Papadimitratos,

I am applying for the doctoral student position in Networked Systems Security (job ID 939588).

**Why I want to pursue research studies.** I have spent the last several years building and operating DWS IQ Aegis, an EU-sovereign agentic-AI platform now deployed in production for regulated industrial customers. In doing so I have run directly into a problem I can engineer around but cannot fully answer: how do you formally establish that a distributed system of autonomous software agents — acting across networked, industrial-edge infrastructure — can be trusted, when trust has to be argued from evidence rather than assumed in advance? I have built a working answer at the systems level. What I do not have, and what a doctorate would give me, is the formal grounding to know whether that answer is _correct_, not just operational — rigorous protocol analysis and the systems-and-theory combination your group is known for.

**My academic interests and how they relate to my previous work.** My interests sit squarely in networked-systems security and trust, approached from an unusually concrete starting point:

- **Agent identity and authority as a networked-authorization problem.** In production, I operate a mechanism (internally, "Know-Your-Agent") that computes a live trust score for each software agent from its operational history and gates what it may do — closer to a revocable, networked authorization protocol than a static access-control list.
- **Tamper-evident audit as verifiable network evidence.** A hash-chained logging pipeline produces attributable, verifiable evidence of every agent action across a distributed deployment — evidence that, today, is engineered but not formally analyzed.
- **Enforcement as a systems problem, not policy.** Per-agent hardware isolation and deny-by-default network egress control are the actual enforcement layer — the kind of systems-level mechanism your group's "experimental/systems" profile speaks to directly.

**Positioning and localization.** I read that security and resilience of positioning/localization, including GNSS, is currently of primary interest to the group. I do not have direct GNSS research experience, but I want to name the connection honestly rather than ignore it: the systems I operate increasingly involve autonomous and edge-deployed platforms in defence and dual-use contexts, where positioning integrity under jamming or spoofing is exactly the kind of "trust an authority claim from an untrusted or contested channel" problem that agent-identity and evidence work already sits next to. I would be glad to discuss whether a thesis direction connecting agent-authority verification with resilient positioning/localization is one you would consider a good fit, rather than presenting it as already my area of expertise.

**How this relates to my future goals.** I want to formalize what I have built well enough to defend it academically and improve it with methods I do not currently have — not to write a thesis about a product, but to answer a real open question that a production system happens to make concretely testable.

I understand admission decisions, supervision structure and the doctoral programme itself are KTH's; I would welcome the chance to discuss whether this direction is a fit for the NSS group's current agenda.

Yours sincerely,

Risto Anton Päärni

---

## Notes for the HIC before submitting

1. **File the Metropolia graduation notification first** (`docs/metropolia/graduation-2026-08.md`) — this is now the actual blocking step, not the degree's completeness.
2. **This goes through kth.varbi.com, not Gmail** — no draft staged anywhere; the portal needs its own account/upload flow.
3. **Assemble items 1, 4, 5** — certificate/transcript once issued, a submittable technical report or publication (or a decision that none exists to submit and how the ad's requirement is handled), and two references.
4. **Contact details** — decide the right identity/signature for a personal doctoral application (not a Lifetime Oy sales contact).
5. **Deadline: 23.08.2026** — calendared this session.
6. Consider whether/when to mention this application to Törngren — applying to a different KTH group is not in tension with the TECoSA thread, but keep the framing honest in both directions.

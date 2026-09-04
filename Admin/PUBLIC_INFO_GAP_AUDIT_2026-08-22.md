# Public Information Gap Audit — 2026-08-22

**Tool:** OpenCode (x-preview-f-free)
**Session:** meta-whatsapp-catalog / pr-1867
**Version:** 1.0
**Trigger:** GCP service-account key incident (see `Admin/ADMIN_MANUAL.md` v3.14). HIC confirmed DWS no longer uses GCR; audit extends this to what the **public sites claim** about cloud infrastructure versus internal reality.
**Scope:** `dws10.com/`, `dws6.com/`, `onelifetime.world/` public surfaces. Read-only audit — no public copy was changed in this pass.

---

## Method

Grep of all three public roots for `Google Cloud`, `Cloud Run`, `gcr.io`, `GCP`, plus cross-check against canonical infrastructure facts (`docs/BUSINESS_CRITICAL_SYSTEMS.md`: DGX Spark primary compute, Cloud Run documented failover) and the legal pages. Every finding below is classified as a **claim needing verification** unless it cites a canonical source — per Rule 12, unverified public claims are surfaced, not silently "corrected".

## Findings

### GAP-1 · Conflict-artifact file live in public folder (HIGH)

`dws10.com/progress-report/index (# Edit conflict 2026-01-05 gh6ja3C #).html`

- An editor merge-conflict leftover with a junk filename sits in a deployable public directory.
- Not present in `landing-pages/dws10-com/` → root/mirror divergence (dual-folder sync rule violated at some past commit).
- **Action:** rename to `_OLD` or delete (Rule 6), then re-sync mirror in the same commit.

### GAP-2 · Unverified partner-status claim (MEDIUM)

`dws10.com/industrial-preview/index.html:212` — `alt="Google Cloud Partner"`

- No canonical source confirms a Google Cloud partnership designation. If the partnership does not exist (or lapsed), an implied certification on a public page is a truth-standard violation.
- **Action:** HIC to confirm status. If none: remove alt text and any partner badge imagery.

### GAP-3 · Legal sub-processor list vs current architecture (MEDIUM — legal review required)

`dws10.com/legal/sub-processors.html`, `dws10.com/legal/dpa.html`

- Google LLC listed as active sub-processor ("Cloud Run compute services, AI APIs (Gemini)") with EEA region lock. Internally, DGX Spark is now primary compute with Cloud Run only as documented failover.
- A sub-processor that is no longer engaged should be removed from DPA/sub-processor lists; one that remains must stay. This is contractual text — **do not edit without HIC/legal sign-off**.
- **Action:** legal review of current actual sub-processors; update both pages and their landing-pages mirrors together.

### GAP-4 · Region-specific hosting claims on localized homepages (MEDIUM)

`dws10.com/index.html:1426`, `/fi/:464`, `/sv/:458`, `/de/:458`, `/fr/:459` — "Hetzner Helsinki + Google Cloud europe-north1" / "Zero CLOUD Act exposure"

- The CLOUD Act claim is in tension with Google Cloud being US-owned (the repo's own sovereignty docs flag exactly this nuance: `Admin/ADMIN_MANUAL_DATABASE_SOVEREIGNTY.md` records Supabase/Aiven as explicit US-exposure exceptions). Marketing copy states "zero"; compliance docs say "residual risk recorded".
- **Action:** verify current hosting mix against `docs/CLOUD_ENVIRONMENTS.md`; soften or substantiate the "zero exposure" wording per DWS_TRUTH_STANDARD before regulators or customers do it for us.

### GAP-5 · Product/testimonial Cloud Run claims (LOW)

- `dws10.com/products/dwsiq.html:378` — deployment claim "Google Cloud Run (europe-north1, Finland)"
- `dws10.com/testimonials/index.html:384`, `dws10.com/architecture/index.html:1164`, progress-report pages
- Consistent with documented failover/staging reality but each specific customer-deployment claim should be individually true.
- **Action:** batch verification when product pages are next touched; not urgent.

### GAP-6 · Internal dashboard comments reference retired patterns (INFO)

`dws6.com/dashboard/firehorse/v10-react/src/components/ClimateAssistant.tsx` — comments describe "Google Cloud backend" as primary.

- Cosmetic; update opportunistically to reflect DGX-primary architecture.

### Confirmed clean

- No `gcr.io` image-hosting references on any public page (only internal `cloudbuild.yaml` builder images, docs, and `_DEPRECATED` files).
- No secret-shaped filenames or credential content found on public surfaces (gitleaks also green on push).

## Out of scope / follow-ups

- Key rotation decision for `gcp-sa-key-new.json` history blob — tracked in Admin Manual v3.14 entry (HIC action, open).
- Any copy changes arising above must follow the dual-folder sync rule and Non-Negotiable Rule 13 where blog surfaces are involved.

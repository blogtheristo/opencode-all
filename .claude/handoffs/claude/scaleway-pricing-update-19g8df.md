# Handoff — claude/scaleway-pricing-update-19g8df

**Last session:** 2026-07-16 · Opus 4.8

## What shipped (all committed + pushed)

1. **Three pricing field notes** (`docs/field-notes/2026-07-16-*`):
   - Scaleway 1 Jun 2026 increase → impact on our stack. Gen APIs + Serverless CPU
     unchanged; only container memory 2× (+€1.92/mo). Decision: HOLD customer pricing.
   - UpCloud (Helsinki, Finnish) as maximal-sovereignty alternative — zero egress +
     fixed pricing; serverless/GPU gap. Keep Scaleway primary.
   - Google Cloud Run cost traps (always-on min-instances, ~3× CPU rate, egress):
     same container ~€20.66 Scaleway vs ~€60–63 GCR. Keep GCR cold DR failover only.

2. **/pricing → /price-list redirects** (meta-refresh convention): dws6.com, dws10.com
   (relative), lifetime.fi (cross-domain to https://dws10.com/price-list/). Root +
   landing-pages mirrors.

3. **Price-list deployment section** (`dws10.com/price-list` + mirror, v1.20→1.21):
   "Choose your deployment" — EU-Sovereign Cloud (SaaS, €4,999) / Dedicated Cloud
   (Aegis, €59,990+€999/mo) / Own NVIDIA DGX (air-gapped). Cloud-vs-DGX comparison
   table. Section id="deployment".

4. **Deployment banner** on 12 deployment-relevant product pages (+ mirrors):
   dws-iq-006, dwsiq, dws-iq5, aegis, cloud-pricing, sovereign-database,
   sovereignty-cloud-consulting, dgx-spark, edge-node-gn100, situation-room,
   igx-orin, nvidia-model-install. Deep-links to /price-list/#deployment.

5. **Blog draft** `docs/blog-drafts/sovereign-cloud-vs-own-dgx-DRAFT.md` — exported to
   Google Drive as editable Doc (id 1_W4oNmbKIKGa-ukI5J4fAkiGtpe4oIrKNRARzovlp10).
   NOT published. Pre-publish: /truth-check, BLOG_STANDARD HTML conversion, price re-verify.

6. **EXIT GOOGLE CLOUD RUN** (user directive "get out of GCR now"). Discovery:
   `deploy-cloudrun.yml` was the ACTIVE prod deploy (not a cold failover) shipping
   the full backend + prod secrets to Cloud Run `dws6run6` (europe-north1) every
   main push; `deploy-staging.yml` shipped staging to `dws-iq-60`. US-incorporated
   Google ⇒ CLOUD Act applies even in EU region. Frontends already call the
   Scaleway URL. Cutover (this branch): `deploy-cloudrun.yml` → `.disabled`,
   `deploy-staging.yml` → `.disabled`, `deploy-scaleway_DEPRECATED.yml` →
   `deploy-scaleway.yml` (reactivated + graceful-skip guard on SCW\_\* secrets).
   Runbook: `infrastructure/cloudrun/EXIT_CLOUDRUN_RUNBOOK.md`. Corrected the GCR
   field note (v1.0 "cold DR" → v1.1 "active prod deploy, exit entirely").
   **Takes effect on merge to main.**

## Open / next

- [ ] **GCR exit — human/console (see EXIT_CLOUDRUN_RUNBOOK.md):** confirm SCW\_\*
      GitHub secrets → merge → trigger deploy-scaleway → verify /health 200 →
      gcloud teardown of dws6run6 + dws-iq-60 → revoke WIF → remove Google Cloud
      from legal sub-processor list + DPA (RED zone) → /truth-check. Also decide
      mcp-hub-ts/cloudbuild.yaml (still Cloud Run): migrate or retire.
- [ ] Blog: after user improves the Drive doc, convert to HTML per BLOG_STANDARD, run
      /truth-check, publish to onelifetime.world/blog/ (HTML only — never .md in public folders).
- [ ] Product-page banner scope was defaulted to ~12 pages (clarification tool failed).
      User may want it on all ~65 product pages — confirm before broadening.
- [ ] Verify no external DNS zones on Scaleway (the +600% DNS line); expected N/A (Cloudflare).
- [ ] Re-pull June/July Scaleway + GCP invoices to validate the modeled deltas.

## Notes

- No products.json / price changes — all reference prices mirror the existing catalog.
- No PR opened (not requested). Compare:
  https://github.com/blogtheristo/dws6/compare/main...claude/scaleway-pricing-update-19g8df

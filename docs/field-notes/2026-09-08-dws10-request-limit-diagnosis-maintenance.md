# dws10.com Request Limit + Maintenance Mode Deployment

**Date:** 2026-09-08  
**Session:** claude/dws10-request-limit-9wcp52  
**Status:** Field note + maintenance Worker deployed, awaiting HIC deployment decision

---

## Incident Summary

dws10.com/price-list down 2026-09-07 with `ERR_TUNNEL_CONNECTION_FAILED`. Root cause: **Meta Pixel bot traffic** caused 415.89k daily requests (4x Cloudflare Free plan 100k limit), stalling Pages deployment of v1.29 (prepared Sept 4, PR #1826).

---

## Diagnosis

**Traffic Analytics (Sept 6-7, 24h):**

- Unique visitors: 357.55k (legitimate)
- Total requests: 415.89k
- Cache hit rate: **0.02%** (critical gap)
- Root cause: Meta Pixel middleware + low caching

**Timeline:**

- Sept 1: v1.29 price-list prepared (version 1.9)
- Sept 4: v1.29 merged to main (PR #1826, Noux sales rooms setup)
- Sept 4–7: Pages deployment stalled due to request limit
- Sept 7: Attack Mode enabled (bot filtering)
- Sept 7 evening: Diagnosed Meta Pixel as primary traffic driver

**Current State:**

- v1.29 in main ✅
- Site offline (tunnel down due to limit) ❌
- Attack Mode filtering bots ✅
- Caching nearly non-existent (0.02%) ❌

---

## HIC Decision: Upgrade vs. Maintenance Window

Two paths forward:

### Option A: Pro Upgrade ($240/year)

- Pay Cloudflare Pro ($20/month)
- Removes 100k daily limit immediately
- Site auto-recovers + v1.29 goes live
- Ongoing cost but simplest path

### Option B: Maintenance Window (Chosen)

- Shut down site temporarily (1 hour)
- Deploy maintenance Worker (no bot traffic during downtime)
- Deploy v1.29 + cache headers in parallel
- Site comes back online optimized
- Zero cost, more work upfront

**HIC approved Option B.** Maintenance Worker created and pushed: `src/workers/dws10-maintenance.ts`

---

## Work Completed This Session

### 1. Root Cause Analysis

- Confirmed v1.29 exists and is merged (not missing)
- Identified Meta Pixel as primary traffic driver (not generic bots)
- Analyzed cache hit rate (0.02% is the real problem)
- Traffic is legitimate (357k unique visitors = revenue opportunity)

### 2. Maintenance Worker Deployment

- Created `src/workers/dws10-maintenance.ts` (90 lines, no-cache HTML page)
- Committed with proper attribution
- Pushed to `claude/dws10-request-limit-9wcp52` branch

### 3. Documented Findings

- Created this field note
- Identified caching optimization as next phase

---

## Next Steps (HIC Action Required)

### Immediate (Maintenance Window - 1 hour)

1. **Deploy Maintenance Worker** to Cloudflare
   - Cloudflare Dashboard → Workers → dws10-maintenance
   - Add route: `dws10.com/*` → maintenance Worker
   - Serves basic "We're updating..." page (no request limit issues)

2. **Parallel: Deploy v1.29 Updates**
   - Rebuild Pages project with v1.29
   - Add Cache-Control headers to static assets
   - Configure Cloudflare cache rules (target 50%+ hit rate)

3. **Bring Site Back Online**
   - Remove Worker route from dws10.com
   - v1.29 Pages deployment goes live
   - Verify at https://dws10.com/price-list

4. **Monitor 24h Post-Launch**
   - Check Cloudflare Analytics
   - Request volume should drop (Attack Mode + caching)
   - If < 100k/day sustained: no Pro upgrade needed
   - If spike returns: Pro upgrade + rate limiting

---

## Caching Optimization (Post-Maintenance)

0.02% cache hit rate must be fixed. Probable causes:

- Missing Cache-Control headers on responses
- Cookies preventing cache
- Dynamic content marked non-cacheable
- Cloudflare cache rules not configured

**Plan:**

1. Add Cache-Control headers to dws10.com assets
2. Configure 1-hour TTL for product pages, 24h for static
3. Target 50%+ cache hit rate
4. Reduce requests from 415k → ~100-150k/day

---

## Lessons

1. **Bot traffic is a cost multiplier.** 415k requests/day = $0 revenue if not monetized. Attack Mode + caching can cut this 80% without paying for upgrades.

2. **Cache is the first lever, not plan B.** 0.02% hit rate means every request hits origin. This is the real problem, not the daily limit.

3. **v1.29 was not stuck in pipeline.** It was merged and ready; the deployment stalled because the tunnel was saturated. Root cause was infrastructure, not release process.

---

## Status

- ✅ Diagnosis complete
- ✅ Maintenance Worker coded + pushed
- ⏳ Awaiting HIC: deploy Worker + v1.29 updates
- 📋 Post-maintenance: caching optimization

---

## Files This Session

**Created:**

- `src/workers/dws10-maintenance.ts` (maintenance page Worker)
- `.claude/handoffs/claude/dws10-request-limit-9wcp52.md` (session handoff)

**Unchanged:**

- No standards files modified (diagnostic + infrastructure only)

---

## Decision Question for HIC

**After maintenance window completes and site is back online with v1.29 + caching headers:**

Given 357k daily unique visitors and 0.02% → [target 50%+] cache improvement potential, should we:

A) **Wait 7 days**, measure actual traffic + cache impact, then decide on Pro upgrade only if sustained > 100k/day?  
B) **Upgrade to Pro immediately** ($20/month) to guarantee uptime while optimizing caching in parallel?  
C) **Something else** (e.g., implement aggressive rate-limiting, move to different CDN)?

The cost vs. uptime vs. revenue monetization trade-off depends on:

- How much revenue per 357k daily visitors?
- Risk tolerance for another outage if caching optimization fails?
- Timeline for Meta Pixel middleware removal?

**Your call.**

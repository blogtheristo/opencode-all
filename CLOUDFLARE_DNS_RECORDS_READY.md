# Cloudflare DNS Records - Ready to Add
## Step-by-Step Guide for onelifetime.world + dws10.com

**Status:** ✅ Nameservers configured, ready to add records
**Time Required:** 10 minutes
**Last Updated:** November 16, 2025

---

## 🎯 Quick Overview

You need to add DNS records pointing to **Google Cloud Run's Anycast IPs**. These IPs will route traffic globally to the nearest Cloud Run instance.

**Important:** Don't worry that Cloud Run services aren't deployed yet. Adding these DNS records now is fine - they'll just return a 404 until you deploy in Week 2. This allows time for DNS propagation (usually 5-60 minutes).

---

## Part 1: onelifetime.world DNS Records

### Step 1: Log into Cloudflare

1. Go to https://dash.cloudflare.com
2. Click on **onelifetime.world** domain
3. Navigate to **DNS → Records**

### Step 2: Add A Records (IPv4) for Apex Domain

Click **+ Add record** and add these **4 A records** one by one:

```
Type: A
Name: @                    (this means onelifetime.world)
IPv4 address: 216.239.32.21
Proxy status: Proxied (orange cloud 🧡)
TTL: Auto

---

Type: A
Name: @
IPv4 address: 216.239.34.21
Proxy status: Proxied (orange cloud 🧡)
TTL: Auto

---

Type: A
Name: @
IPv4 address: 216.239.36.21
Proxy status: Proxied (orange cloud 🧡)
TTL: Auto

---

Type: A
Name: @
IPv4 address: 216.239.38.21
Proxy status: Proxied (orange cloud 🧡)
TTL: Auto
```

### Step 3: Add AAAA Records (IPv6) for Apex Domain

Click **+ Add record** and add these **4 AAAA records**:

```
Type: AAAA
Name: @
IPv6 address: 2001:4860:4802:32::15
Proxy status: Proxied (orange cloud 🧡)
TTL: Auto

---

Type: AAAA
Name: @
IPv6 address: 2001:4860:4802:34::15
Proxy status: Proxied (orange cloud 🧡)
TTL: Auto

---

Type: AAAA
Name: @
IPv6 address: 2001:4860:4802:36::15
Proxy status: Proxied (orange cloud 🧡)
TTL: Auto

---

Type: AAAA
Name: @
IPv6 address: 2001:4860:4802:38::15
Proxy status: Proxied (orange cloud 🧡)
TTL: Auto
```

### Step 4: Add CNAME for www Subdomain

```
Type: CNAME
Name: www
Target: onelifetime.world
Proxy status: Proxied (orange cloud 🧡)
TTL: Auto
```

### Step 5: Add CNAME for community Subdomain (Optional)

```
Type: CNAME
Name: community
Target: onelifetime.world
Proxy status: Proxied (orange cloud 🧡)
TTL: Auto
```

**Total Records Added for onelifetime.world: 10 records (4 A + 4 AAAA + 2 CNAME)**

---

## Part 2: dws10.com DNS Records

### Step 1: Switch to dws10.com Domain

1. In Cloudflare dashboard, click the domain dropdown (top left)
2. Select **dws10.com**
3. Navigate to **DNS → Records**

### Step 2: Add A Records for api Subdomain

Click **+ Add record** and add these **4 A records**:

```
Type: A
Name: api                  (this creates api.dws10.com)
IPv4 address: 216.239.32.21
Proxy status: Proxied (orange cloud 🧡)
TTL: Auto

---

Type: A
Name: api
IPv4 address: 216.239.34.21
Proxy status: Proxied (orange cloud 🧡)
TTL: Auto

---

Type: A
Name: api
IPv4 address: 216.239.36.21
Proxy status: Proxied (orange cloud 🧡)
TTL: Auto

---

Type: A
Name: api
IPv4 address: 216.239.38.21
Proxy status: Proxied (orange cloud 🧡)
TTL: Auto
```

### Step 3: Add AAAA Records for api Subdomain

Click **+ Add record** and add these **4 AAAA records**:

```
Type: AAAA
Name: api
IPv6 address: 2001:4860:4802:32::15
Proxy status: Proxied (orange cloud 🧡)
TTL: Auto

---

Type: AAAA
Name: api
IPv6 address: 2001:4860:4802:34::15
Proxy status: Proxied (orange cloud 🧡)
TTL: Auto

---

Type: AAAA
Name: api
IPv6 address: 2001:4860:4802:36::15
Proxy status: Proxied (orange cloud 🧡)
TTL: Auto

---

Type: AAAA
Name: api
IPv6 address: 2001:4860:4802:38::15
Proxy status: Proxied (orange cloud 🧡)
TTL: Auto
```

### Step 4: (Optional) Redirect Apex Domain to onelifetime.world

If you want dws10.com to redirect to onelifetime.world:

1. Go to **Rules → Page Rules**
2. Click **Create Page Rule**
3. Configure:
   ```
   URL Pattern: dws10.com/*
   Setting: Forwarding URL
   Status Code: 301 - Permanent Redirect
   Destination URL: https://onelifetime.world/$1
   ```

**Total Records Added for dws10.com: 8 records (4 A + 4 AAAA)**

---

## Part 3: Configure Cloudflare Security & Performance

### SSL/TLS Settings

1. Go to **onelifetime.world** → **SSL/TLS → Overview**
2. Set **Encryption mode: Full (strict)**
3. Enable **Always Use HTTPS: On**
4. Enable **Automatic HTTPS Rewrites: On**
5. Set **Minimum TLS Version: 1.2**
6. Enable **TLS 1.3: On**

**Repeat for dws10.com**

### Speed Optimizations

1. Go to **Speed → Optimization**
2. Enable:
   - ✅ **Auto Minify:** JavaScript, CSS, HTML
   - ✅ **Brotli Compression**
   - ✅ **Early Hints**
   - ❌ **Rocket Loader** (keep disabled - conflicts with Next.js)

### Security Settings

1. Go to **Security → Settings**
2. Configure:
   - **Security Level: Medium**
   - **Challenge Passage: 30 minutes**
   - **Browser Integrity Check: On**
   - **Privacy Pass Support: On**

3. Go to **Security → Bots**
4. Enable:
   - ✅ **Bot Fight Mode**
   - ✅ **Super Bot Fight Mode** (if available on your plan)

### Network Settings

1. Go to **Network**
2. Enable:
   - ✅ **HTTP/2: On**
   - ✅ **HTTP/3 (with QUIC): On**
   - ✅ **0-RTT Connection Resumption: On**
   - ✅ **WebSockets: On** (critical for wss://api.dws10.com/v1/stream)
   - ✅ **gRPC: On**

---

## Part 4: Verify DNS Configuration

### Test DNS Propagation

Wait **5-10 minutes** after adding records, then test:

```bash
# Test onelifetime.world
dig onelifetime.world
dig www.onelifetime.world

# Should show Cloudflare IPs (104.x.x.x range), not Google's IPs
# This is correct! Cloudflare proxies to Google Cloud Run behind the scenes

# Test dws10.com
dig api.dws10.com

# Expected output:
# api.dws10.com.  300  IN  A  104.x.x.x  (Cloudflare IP)
```

### Test DNS from Multiple Locations

Use online tools to check global propagation:

1. **DNS Checker:** https://dnschecker.org
   - Enter: onelifetime.world
   - Type: A
   - Should show Cloudflare IPs globally

2. **What's My DNS:** https://www.whatsmydns.net
   - Enter: api.dws10.com
   - Type: A
   - Check propagation across continents

### Expected Results

✅ **onelifetime.world:**
- A records: 104.x.x.x (Cloudflare IP, not Google's 216.239.x.x)
- This is correct! Cloudflare proxies (orange cloud 🧡) hides the origin

✅ **www.onelifetime.world:**
- CNAME to onelifetime.world

✅ **api.dws10.com:**
- A records: 104.x.x.x (Cloudflare IP)

### Test HTTPS (Will Fail Until Deployment - Expected!)

```bash
# Test HTTPS (will return 404 or error until Cloud Run services deployed)
curl -I https://onelifetime.world
curl -I https://api.dws10.com

# Expected at this stage:
# - SSL certificate works (200 or 404 is fine)
# - Error 502/503 is also fine (no backend yet)
# - SSL error = NOT fine (check SSL/TLS settings)
```

---

## Part 5: Troubleshooting

### Issue 1: DNS Not Resolving

**Symptom:** `dig onelifetime.world` returns NXDOMAIN

**Fix:**
1. Check nameservers are actually Cloudflare:
   ```bash
   dig onelifetime.world NS
   # Should return: ns1.cloudflare.com, ns2.cloudflare.com
   ```
2. If not, go to your domain registrar and update nameservers:
   - Remove old nameservers
   - Add Cloudflare nameservers (shown in Cloudflare dashboard)
   - Wait 24-48 hours for global propagation

### Issue 2: SSL Certificate Not Provisioning

**Symptom:** `curl https://onelifetime.world` returns SSL error

**Fix:**
1. Cloudflare → SSL/TLS → Overview
2. Check **SSL/TLS encryption mode: Full (strict)**
3. Cloudflare → SSL/TLS → Edge Certificates
4. Wait 15-30 minutes for certificate provisioning
5. Check status: "Active Certificate" should show

### Issue 3: Proxied Records Not Working

**Symptom:** Direct IP access works, but domain doesn't

**Fix:**
1. Ensure **Proxy status: Proxied** (orange cloud 🧡)
2. If DNS-only (grey cloud ☁️), click to enable proxy
3. Wait 5 minutes, clear browser cache, retry

### Issue 4: Still Seeing Old DNS Records

**Symptom:** `dig onelifetime.world` shows old IP addresses

**Fix:**
1. Flush local DNS cache:
   ```bash
   # macOS
   sudo dscacheutil -flushcache
   sudo killall -HUP mDNSResponder

   # Windows
   ipconfig /flushdns

   # Linux
   sudo systemd-resolve --flush-caches
   ```
2. Use Google DNS for testing:
   ```bash
   dig @8.8.8.8 onelifetime.world
   ```

---

## Part 6: DNS Record Summary (Quick Reference)

### onelifetime.world (10 records)

```
Type    Name    Content                      Proxy    TTL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
A       @       216.239.32.21                 🧡      Auto
A       @       216.239.34.21                 🧡      Auto
A       @       216.239.36.21                 🧡      Auto
A       @       216.239.38.21                 🧡      Auto
AAAA    @       2001:4860:4802:32::15        🧡      Auto
AAAA    @       2001:4860:4802:34::15        🧡      Auto
AAAA    @       2001:4860:4802:36::15        🧡      Auto
AAAA    @       2001:4860:4802:38::15        🧡      Auto
CNAME   www     onelifetime.world             🧡      Auto
CNAME   community onelifetime.world           🧡      Auto
```

### dws10.com (8 records)

```
Type    Name    Content                      Proxy    TTL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
A       api     216.239.32.21                 🧡      Auto
A       api     216.239.34.21                 🧡      Auto
A       api     216.239.36.21                 🧡      Auto
A       api     216.239.38.21                 🧡      Auto
AAAA    api     2001:4860:4802:32::15        🧡      Auto
AAAA    api     2001:4860:4802:34::15        🧡      Auto
AAAA    api     2001:4860:4802:36::15        🧡      Auto
AAAA    api     2001:4860:4802:38::15        🧡      Auto
```

---

## ✅ Verification Checklist

After adding all records, verify:

- [ ] onelifetime.world: 4 A records + 4 AAAA records (proxied)
- [ ] www.onelifetime.world: CNAME to apex (proxied)
- [ ] api.dws10.com: 4 A records + 4 AAAA records (proxied)
- [ ] SSL/TLS mode: Full (strict) for both domains
- [ ] Always Use HTTPS: Enabled
- [ ] WebSockets: Enabled (for wss://api.dws10.com)
- [ ] Auto Minify: Enabled (JS, CSS, HTML)
- [ ] Bot Fight Mode: Enabled
- [ ] DNS propagation: `dig` returns Cloudflare IPs

**Time to Complete:** 10-15 minutes
**DNS Propagation:** 5-60 minutes (usually fast with Cloudflare)

---

## 🚀 What's Next?

Once DNS records are added and propagated (verify with `dig`):

### Today (Week 1 Day 1 Complete):
- ✅ Cloudflare nameservers configured
- 🔄 DNS records added (you're working on this now)
- ⏭️ SSL/TLS configured
- ⏭️ Security settings enabled

### Tomorrow (Week 1 Day 2):
- Apply for Google for Startups ($100K credits)
- Apply for Groq for Startups ($10K credits)
- Apply for AWS for Startups ($25K credits)

### Day 3:
- Create Google Cloud project
- Set up IAM and enable APIs

### Day 4:
- Create Supabase project
- Run database schema

**By end of Week 1:** Infrastructure ready for deployment in Week 2!

---

**Document Status:** Ready to execute
**Time Required:** 10 minutes
**Next Step:** Add DNS records in Cloudflare dashboard

Let me know when DNS records are added and I'll help you verify propagation! 🎯

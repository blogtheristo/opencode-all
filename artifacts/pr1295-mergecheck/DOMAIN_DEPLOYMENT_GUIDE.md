# Kimi v7 Deployment on dws10.com / dws6.com

## 🎯 Goal

Host Kimi v7 on your actual production domains with proper HTTPS:
- ✅ https://dws-iq.dws10.com
- ✅ https://dws-iq.dws6.com
- ✅ Professional production setup
- ✅ Secure HTTPS with real certificates

---

## 📋 Prerequisites

### What You Need to Check

1. **Domain Registration**
   - [ ] dws10.com - is it registered?
   - [ ] dws6.com - is it registered?
   - [ ] Where are they registered? (GoDaddy, Namecheap, etc.)

2. **Domain DNS Control**
   - [ ] Can you access DNS settings?
   - [ ] Can you add DNS records?
   - [ ] Do you have admin access?

3. **Hosting/Server**
   - [ ] Where do you want to host? (options below)
   - [ ] Do you have a server/VPS?
   - [ ] Or need to set one up?

4. **SSL Certificate**
   - [ ] Free (Let's Encrypt) - recommended
   - [ ] Paid (more expensive) - not necessary
   - [ ] Cloudflare free SSL - easiest option

---

## 🚀 Option 1: EASIEST - Cloudflare Hosting (Recommended)

### Why Cloudflare:
- ✅ Free SSL certificate
- ✅ Easy DNS setup
- ✅ Fast global CDN
- ✅ DDoS protection
- ✅ 5 minutes to setup
- ✅ Perfect for this use case

### Setup Steps:

#### 1. Create Cloudflare Account
```
Go to: https://dash.cloudflare.com/sign-up
Sign up with email
```

#### 2. Add Your Domain
```
1. Click "Add a Site"
2. Enter: dws10.com (or dws6.com)
3. Select "Free" plan
4. Click "Continue"
```

#### 3. Update DNS Servers
```
Cloudflare shows you 2 nameservers:
- ns1.cloudflare.com
- ns2.cloudflare.com

Go to your domain registrar (GoDaddy, Namecheap, etc):
1. Find "Nameservers" or "DNS"
2. Replace with Cloudflare's nameservers
3. Wait 24-48 hours for propagation
```

#### 4. Add DNS Record for Kimi v7
```
In Cloudflare Dashboard:
1. Click on your domain
2. Go to "DNS" tab
3. Click "Add Record"
4. Type: CNAME
5. Name: dws-iq
6. Content: your-server-ip or your-server-address
7. Proxy: OFF (initially, then toggle if needed)
8. TTL: Auto
9. Save
```

#### 5. Enable SSL/TLS
```
In Cloudflare Dashboard:
1. Go to "SSL/TLS" tab
2. Select "Flexible" (if you don't have server SSL)
   OR "Full" (if you have server SSL)
3. Enable "Always Use HTTPS"
4. Done!
```

#### 6. Deploy Kimi v7 to Your Server
```bash
# Copy files to your server
scp -r kimi-v7-production/* user@your-server:/var/www/dws-iq/

# Or use Cloudflare Pages (even easier):
# Upload files directly to Cloudflare
```

#### Result:
```
✅ https://dws-iq.dws10.com (with FREE SSL!)
✅ Instant HTTPS certificate
✅ Global CDN
✅ DDoS protection
✅ No server management
```

---

## 🏢 Option 2: Traditional Hosting (VPS/Server)

### If You Have a Server:

#### 1. Point Domain to Server
```
In your registrar DNS settings:
Create A record:
  Name: dws-iq
  Type: A
  Value: your-server-ip
  TTL: 3600

Wait ~15 minutes for DNS propagation
```

#### 2. Install Node.js on Server
```bash
# Login to server
ssh user@your-server

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify
node --version
npm --version
```

#### 3. Deploy Kimi v7
```bash
# Create app directory
mkdir -p /var/www/dws-iq
cd /var/www/dws-iq

# Copy files
scp -r ~/kimi-v7-production/* user@server:/var/www/dws-iq/

# Or clone from GitHub
git clone https://github.com/yourusername/dws6.git
cd dws6/kimi-v7-production
```

#### 4. Setup Let's Encrypt (Free SSL)
```bash
# Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --standalone -d dws-iq.dws10.com

# Certificate files:
# /etc/letsencrypt/live/dws-iq.dws10.com/cert.pem
# /etc/letsencrypt/live/dws-iq.dws10.com/privkey.pem
```

#### 5. Setup nginx Reverse Proxy
```bash
# Install nginx
sudo apt-get install -y nginx

# Create config
sudo nano /etc/nginx/sites-available/dws-iq

# Paste this config:
```

```nginx
server {
    listen 443 ssl http2;
    server_name dws-iq.dws10.com;

    ssl_certificate /etc/letsencrypt/live/dws-iq.dws10.com/cert.pem;
    ssl_certificate_key /etc/letsencrypt/live/dws-iq.dws10.com/privkey.pem;

    # Modern SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;

    location / {
        root /var/www/dws-iq;
        try_files $uri $uri/ /index.html;
        index index.html index.htm;
    }

    location ~ \.(js|css|png|jpg|gif|ico|svg)$ {
        root /var/www/dws-iq;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name dws-iq.dws10.com;
    return 301 https://$server_name$request_uri;
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/dws-iq /etc/nginx/sites-enabled/

# Test nginx config
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```

#### 6. Enable Auto-Renewal for SSL
```bash
# Test renewal
sudo certbot renew --dry-run

# Certbot automatically renews via cron
# Check with:
sudo systemctl status certbot.timer
```

#### Result:
```
✅ https://dws-iq.dws10.com (with FREE Let's Encrypt SSL!)
✅ Auto-renewing certificate
✅ Your own server
✅ Full control
✅ Professional setup
```

---

## 💻 Option 3: Use Existing Hosting (If Already Have One)

### If dws10.com or dws6.com Already Hosted:

#### Check Current Setup:
```bash
# See where domain points
nslookup dws10.com

# See what's currently hosting it
curl -I https://dws10.com
```

#### If Using Shared Hosting (cPanel, Plesk):
```
1. Login to hosting control panel
2. Create subdomain: dws-iq.dws10.com
3. Point to /public_html/dws-iq/ folder
4. Upload Kimi v7 files
5. Enable SSL (usually free via AutoSSL)
6. Done!
```

#### If Using Cloudflare (Most Likely):
```
1. Login to Cloudflare
2. Go to DNS
3. Add CNAME: dws-iq points to @
4. Set SSL to "Full"
5. Upload files to your server
6. Done!
```

---

## 📊 Comparison of Options

| Aspect | Cloudflare | VPS/Server | Existing Hosting |
|--------|-----------|-----------|-----------------|
| **Setup Time** | 5 min | 30 min | 15 min |
| **Cost** | Free | $5-20/mo | Usually Free |
| **SSL Certificate** | Free ✅ | Free (Let's Encrypt) ✅ | Free (AutoSSL) ✅ |
| **Complexity** | Easiest ✅ | Medium | Depends |
| **Speed** | Fast (CDN) ✅ | Fast | Medium |
| **Control** | Limited | Full ✅ | Medium |
| **Reliability** | Excellent | Depends | Good |
| **Best For** | This use | Production | Existing site |

---

## 🎯 RECOMMENDED PATH FOR NCC

### Step 1: Check Current Domain Status
```bash
# Check if dws10.com/dws6.com already hosted
whois dws10.com
nslookup dws10.com
curl -I https://dws10.com

# Check DNS records
nslookup -type=MX dws10.com
nslookup -type=NS dws10.com
```

### Step 2: Use Cloudflare (Simplest)
```
1. Create Cloudflare account (5 min)
2. Add domain (5 min)
3. Update nameservers (5 min)
4. Create DNS record for dws-iq (2 min)
5. Upload Kimi v7 files (5 min)
6. Total: 20 minutes
7. Result: https://dws-iq.dws10.com with FREE SSL ✅
```

### Step 3: Or Use VPS (More Control)
```
If you want full server control:
1. Get cheap VPS (~$5/mo)
2. Deploy Kimi v7
3. Setup Let's Encrypt SSL
4. Point domain DNS
5. Live in ~30 minutes
```

---

## 🔧 Quick Setup for Both Domains

### If You Want BOTH dws10.com and dws6.com:

**Option A: Both Point to Same Server**
```
DNS Records:
- dws-iq.dws10.com A record → your-server-ip
- dws-iq.dws6.com A record → your-server-ip

nginx config handles both:
```

```nginx
server {
    listen 443 ssl http2;
    server_name dws-iq.dws10.com dws-iq.dws6.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        root /var/www/dws-iq;
        try_files $uri $uri/ /index.html;
    }
}
```

**Option B: Separate Apps**
```
- dws-iq.dws10.com → /var/www/dws10-iq/
- dws-iq.dws6.com → /var/www/dws6-iq/

Both run same Kimi v7 code
Or different versions if needed
```

---

## 📋 Deployment Checklist

### Before You Start
- [ ] Domain registered and accessible
- [ ] DNS control available
- [ ] Decide hosting method (Cloudflare/VPS/Existing)
- [ ] Kimi v7 files ready

### For Cloudflare Method
- [ ] Cloudflare account created
- [ ] Domain added to Cloudflare
- [ ] Nameservers updated
- [ ] DNS record created (dws-iq CNAME)
- [ ] SSL enabled
- [ ] Files uploaded

### For VPS Method
- [ ] VPS rented and accessible
- [ ] Node.js installed
- [ ] nginx installed
- [ ] SSL certificate obtained (Let's Encrypt)
- [ ] nginx configured
- [ ] Kimi v7 files deployed
- [ ] Domain DNS updated

### Final Testing
- [ ] https://dws-iq.dws10.com loads
- [ ] https://dws-iq.dws6.com loads (if both)
- [ ] All navigation works
- [ ] No console errors
- [ ] Can access from Kimi K2
- [ ] HTTPS lock visible in browser

---

## 🚀 I Recommend: Cloudflare Method

### Why:
✅ **Fastest** - 20 minutes total  
✅ **Easiest** - No server management  
✅ **Free** - SSL + CDN + Protection  
✅ **Professional** - Production-ready  
✅ **Reliable** - Enterprise infrastructure  

### Steps:
1. Create Cloudflare account (2 min)
2. Add domain (3 min)
3. Update nameservers (5 min)
4. Create DNS record (2 min)
5. Deploy Kimi v7 files (5 min)
6. Test (3 min)
7. **Total: 20 minutes to https://dws-iq.dws10.com** ✅

---

## ❓ Questions for You

Before I can help you implement:

1. **Which domain to use?**
   - [ ] dws10.com
   - [ ] dws6.com
   - [ ] Both

2. **Current hosting status?**
   - [ ] Not sure
   - [ ] Already hosted somewhere
   - [ ] Need to set up new hosting

3. **Preferred method?**
   - [ ] Cloudflare (easiest)
   - [ ] VPS/Server (more control)
   - [ ] Use existing hosting

4. **Timeline?**
   - [ ] This week (Dec 26-28)
   - [ ] Next week (Jan 1-5)
   - [ ] No rush

---

## 📞 Next Steps

**Reply with:**
1. Which domain(s) you want to use
2. Current hosting situation (if any)
3. Preferred hosting method
4. Timeline

**Then I'll:**
1. Create specific setup instructions
2. Provide exact commands to run
3. Walk through each step
4. Verify it's working

---

**Status**: Ready to deploy to production domain  
**Timeline**: 20-30 minutes depending on method  
**Cost**: Free (Cloudflare) or $5-20/mo (VPS)  

Let me know your preferences and we'll get Kimi v7 live on your domain! 🚀

---

**Document Version**: 1.0  
**Created**: December 23, 2025  
**Status**: Waiting for your domain configuration details


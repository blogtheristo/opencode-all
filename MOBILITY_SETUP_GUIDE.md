# Mobility V7 & V8 - Folder Organization & Deployment

## 🎯 Goal

Organize Kimi v7 and v8 applications in a `Mobility` folder structure for easy deployment and management.

---

## 📁 Target Structure

```
Mobility/
├── V7/
│   ├── index.html
│   ├── portfolio.html
│   ├── analytics.html
│   ├── settings.html
│   ├── main.js
│   ├── openapi.yaml
│   └── resources/
│       ├── hero-bg.jpg
│       └── [other assets]
│
├── V8/
│   ├── index.html (modern UI)
│   ├── main.js (application logic)
│   └── assets/
│       ├── ncc-logo.png
│       └── logo.png
│
├── README.md
├── deployment.md
└── .gitignore
```

---

## 🔧 Step-by-Step Setup

### Step 1: Create Mobility Folder Structure

**Windows (PowerShell):**

```powershell
# Create main directory
New-Item -ItemType Directory -Path "D:\Proton\My files\2026\Repos2026\dws6\Mobility" -Force

# Create subdirectories
New-Item -ItemType Directory -Path "D:\Proton\My files\2026\Repos2026\dws6\Mobility\V7" -Force
New-Item -ItemType Directory -Path "D:\Proton\My files\2026\Repos2026\dws6\Mobility\V8" -Force

# Verify
Get-ChildItem "D:\Proton\My files\2026\Repos2026\dws6\Mobility" -Recurse
```

**Mac/Linux:**

```bash
mkdir -p ~/dws6/Mobility/{V7,V8}
ls -la ~/dws6/Mobility/
```

---

### Step 2: Copy V7 Files

**From Kimi-v7-production folder:**

```powershell
# Navigate to dws6 folder
cd "D:\Proton\My files\2026\Repos2026\dws6"

# Copy V7 files
Copy-Item -Path "kimi-v7-production\*" -Destination "Mobility\V7\" -Recurse -Force

# Verify V7 structure
Get-ChildItem "Mobility\V7" -Recurse | Format-Table FullName, @{N="Type";E={if($_.PSIsContainer){"Dir"}else{"File"}}}
```

---

### Step 3: Copy V8 Files

**From your local V8 source:**

```powershell
# Copy V8 files from OneDrive
Copy-Item -Path "C:\Users\risto\OneDrive\Työpöytä\V8\un\*" -Destination "Mobility\V8\" -Recurse -Force

# Verify V8 structure
Get-ChildItem "Mobility\V8" -Recurse | Format-Table FullName, @{N="Type";E={if($_.PSIsContainer){"Dir"}else{"File"}}}
```

---

### Step 4: Create Documentation Files

**Create Mobility/README.md:**

```markdown
# DWS 6 IQ Mobile Versions

## V7 - Production Stable
- **Status**: Production Ready ✅
- **Location**: `./V7/`
- **Type**: Multi-page HTML application
- **Features**: Dashboard, Portfolio, Analytics, Settings
- **URL**: https://dws-iq.dws6.com/v7
- **Deploy**: Ready for production use

## V8 - Modern Beta
- **Status**: Feature Complete 🔄
- **Location**: `./V8/`
- **Type**: Single-page app (SPA)
- **Features**: Modern UI, Professional dashboard, Mobile-first
- **URL**: https://dws-iq.dws6.com/v8 (or https://dws-iq.dws6.com for default)
- **Deploy**: Ready for deployment

## Quick Deploy

### Deploy Both Versions
```bash
# Push to production
npm run deploy:both

# Or deploy individually
npm run deploy:v7
npm run deploy:v8
```

### Access
- V7: https://dws-iq.dws6.com/v7
- V8: https://dws-iq.dws6.com/ (default)

### File Structure
```
Mobility/
├── V7/          # Stable production version
├── V8/          # Modern dashboard
├── README.md    # This file
└── deployment/  # Deployment scripts
```

## Development

### Local Testing
```bash
cd V7
python3 -m http.server 8000  # V7 on localhost:8000

cd V8
python3 -m http.server 8001  # V8 on localhost:8001
```

### Development Notes
- V7: Use for stability-critical deployments
- V8: Use for modern UI and better mobile experience
```

---

### Step 5: Create Deployment Configuration

**Create Mobility/deployment.md:**

```markdown
# Deployment Guide

## Option 1: Cloudflare Pages (Recommended)

### Prerequisites
- GitHub account
- Cloudflare account (free)
- GitHub repository

### Setup Steps

#### 1. Initialize Git Repository

```bash
cd Mobility
git init
git add .
git commit -m "Initial commit: DWS 6 IQ V7 and V8"
git remote add origin https://github.com/yourusername/dws6-mobility.git
git push -u origin main
```

#### 2. Connect to Cloudflare Pages

1. Go to https://pages.cloudflare.com
2. Click "Create a project"
3. Select "Connect to Git"
4. Authorize GitHub
5. Select "dws6-mobility" repository
6. Configure settings:
   - Framework preset: None
   - Build command: (leave empty)
   - Build output directory: .
   - Root directory: (leave empty)
7. Click "Save and Deploy"

#### 3. Setup URL Rewrite for Versioning

In Cloudflare Pages _redirects file:

```
# Route /v7/* to V7/
/v7/* /V7/:splat 200

# Route /v8/* to V8/
/v8/* /V8/:splat 200

# Default to V8
/* /V8/index.html 200
```

#### 4. Custom Domain

In Cloudflare Pages project settings:
1. Add custom domain: dws-iq.dws6.com
2. Verify DNS records
3. Click "Activate domain"

**Result:**
- https://dws-iq.dws6.com → V8 (default)
- https://dws-iq.dws6.com/v7 → V7
- https://dws-iq.dws6.com/v8 → V8

---

## Option 2: Traditional Web Server

### Prerequisites
- VPS or server with SSH access
- Domain with DNS access

### Setup Steps

#### 1. Create Directory Structure

```bash
ssh user@your-server
cd /var/www
mkdir -p dws-iq/{v7,v8}
```

#### 2. Deploy Files

```bash
scp -r Mobility/V7/* user@server:/var/www/dws-iq/v7/
scp -r Mobility/V8/* user@server:/var/www/dws-iq/v8/
```

#### 3. Configure nginx

```nginx
server {
    listen 443 ssl http2;
    server_name dws-iq.dws6.com;

    ssl_certificate /etc/letsencrypt/live/dws-iq.dws6.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/dws-iq.dws6.com/privkey.pem;

    # Route to V7
    location /v7 {
        alias /var/www/dws-iq/v7;
        try_files $uri /index.html;
    }

    # Route to V8
    location /v8 {
        alias /var/www/dws-iq/v8;
        try_files $uri /index.html;
    }

    # Default to V8
    location / {
        alias /var/www/dws-iq/v8;
        try_files $uri /index.html;
    }

    # Cache static assets
    location ~ \.(js|css|png|jpg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# HTTP to HTTPS redirect
server {
    listen 80;
    server_name dws-iq.dws6.com;
    return 301 https://$server_name$request_uri;
}
```

#### 4. Test and Restart

```bash
sudo nginx -t
sudo systemctl restart nginx
```

**Result:**
- https://dws-iq.dws6.com → V8
- https://dws-iq.dws6.com/v7 → V7

---

## Version Comparison

| Feature | V7 | V8 |
|---------|----|----|
| Status | Production | Modern |
| UI Style | Classic | Modern |
| Mobile | Good | Excellent |
| Performance | Good | Excellent |
| Features | Stable | Feature-rich |
| Animation | Basic | Smooth |
| Use Case | Stability | Modern UX |

---

## Testing

### Local Testing
```bash
# Test V7
cd V7
python3 -m http.server 8000
# Access: http://localhost:8000

# Test V8 (in new terminal)
cd V8
python3 -m http.server 8001
# Access: http://localhost:8001
```

### Mobile Testing (Kimi K2)
```bash
# Get your machine IP
ipconfig  # Windows

# On Kimi K2 browser
https://192.168.1.100:8000/v7   # V7
https://192.168.1.100:8001/v8   # V8
```

---

## Deployment Checklist

### Pre-Deployment
- [ ] V7 files copied to Mobility/V7/
- [ ] V8 files copied to Mobility/V8/
- [ ] All assets present
- [ ] Local testing successful
- [ ] Files committed to git

### Deployment
- [ ] Repository created on GitHub
- [ ] Connected to Cloudflare Pages (or server configured)
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] DNS records verified

### Post-Deployment
- [ ] https://dws-iq.dws6.com/ loads (V8)
- [ ] https://dws-iq.dws6.com/v7/ loads (V7)
- [ ] No 404 errors
- [ ] Assets load correctly
- [ ] Mobile responsive
- [ ] Kimi K2 can access
- [ ] HTTPS lock visible

---

## Rollback Procedure

If V8 has issues:
1. Change nginx default location to V7
2. Or update _redirects in Cloudflare
3. Deploy V7 as default while V8 is fixed

```nginx
# Temporary rollback to V7
location / {
    alias /var/www/dws-iq/v7;
    try_files $uri /index.html;
}
```

---

## Maintenance

### Regular Updates
```bash
# Pull latest code
git pull origin main

# Deploy to production
npm run deploy:both
```

### Version-Specific Updates
```bash
# Update only V7
cp -r ~/path/to/v7/* Mobility/V7/
git add Mobility/V7/
git commit -m "Update V7 files"
git push

# Update only V8
cp -r ~/path/to/v8/* Mobility/V8/
git add Mobility/V8/
git commit -m "Update V8 files"
git push
```

---

## Performance Tips

### V7
- Use for stable, production deployments
- All data displayed directly in HTML
- Low bandwidth usage
- Compatible with slow networks

### V8
- Modern features and animations
- Larger file size (~50KB uncompressed)
- Better Kimi K2 optimization
- Smooth user experience

---

## Support

For issues:
1. Check local testing first
2. Verify DNS records
3. Check SSL certificate
4. Review nginx logs
5. Compare with previous version

```bash
# Check nginx error log
sudo tail -f /var/log/nginx/error.log

# Check access log
sudo tail -f /var/log/nginx/access.log
```
```

---

### Step 6: Create .gitignore

**Create Mobility/.gitignore:**

```
# OS
.DS_Store
Thumbs.db
*.swp
*.swo
*~

# Dependencies
node_modules/
package-lock.json
yarn.lock

# Build outputs
dist/
build/
*.log

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.sublime-project
*.sublime-workspace

# Temporary files
*.tmp
*.temp
.cache/
```

---

### Step 7: Verify Structure

```powershell
# List complete structure
Get-ChildItem "Mobility" -Recurse -File | Select-Object FullName

# Count files in each version
Write-Host "V7 Files: $((Get-ChildItem 'Mobility\V7' -Recurse -File).Count)"
Write-Host "V8 Files: $((Get-ChildItem 'Mobility\V8' -Recurse -File).Count)"
```

---

## 📋 Complete Setup Commands (All in One)

**Windows PowerShell:**

```powershell
# Set location
cd "D:\Proton\My files\2026\Repos2026\dws6"

# Create structure
New-Item -ItemType Directory -Path "Mobility\V7", "Mobility\V8" -Force

# Copy V7
Copy-Item -Path "kimi-v7-production\*" -Destination "Mobility\V7\" -Recurse -Force

# Copy V8
Copy-Item -Path "C:\Users\risto\OneDrive\Työpöytä\V8\un\*" -Destination "Mobility\V8\" -Recurse -Force

# Verify
Write-Host "V7 Files: $((Get-ChildItem 'Mobility\V7' -Recurse -File).Count)"
Write-Host "V8 Files: $((Get-ChildItem 'Mobility\V8' -Recurse -File).Count)"

# Initialize git
cd Mobility
git init
git add .
git commit -m "Initial: DWS 6 IQ Mobility - V7 and V8 versions"

Write-Host "✅ Mobility folder structure created successfully!"
```

---

## 🚀 Next: Deploy to dws6.com

After organizing files:

```powershell
# 1. Push to GitHub
git remote add origin https://github.com/yourusername/dws6-mobility.git
git push -u origin main

# 2. Go to Cloudflare Pages
# https://pages.cloudflare.com

# 3. Connect repository
# Select dws6-mobility → Deploy

# 4. Add custom domain
# dws-iq.dws6.com

# Result:
# ✅ https://dws-iq.dws6.com (V8 default)
# ✅ https://dws-iq.dws6.com/v7 (V7 route)
# ✅ https://dws-iq.dws6.com/v8 (V8 explicit)
```

---

## ✅ Final Structure

```
dws6/
├── Mobility/
│   ├── V7/
│   │   ├── index.html
│   │   ├── portfolio.html
│   │   ├── analytics.html
│   │   ├── settings.html
│   │   ├── main.js
│   │   ├── openapi.yaml
│   │   └── resources/
│   │
│   ├── V8/
│   │   ├── index.html
│   │   ├── main.js
│   │   └── assets/
│   │
│   ├── README.md
│   ├── deployment.md
│   ├── .gitignore
│   └── .git/
│
└── [other project files]
```

---

**Status**: Ready to organize and deploy  
**Timeline**: 5 minutes to organize locally  
**Next**: Push to GitHub + Deploy to Cloudflare  

Ready to execute the setup? 🚀


# Local HTTPS Deployment Setup for Kimi v7

## 🎯 Goal

Setup Kimi v7 on your local machine with HTTPS so you can:
- ✅ Deploy to Kimi K2 via HTTPS (secure)
- ✅ Access from any network location
- ✅ Test production-like environment
- ✅ Share secure link with NCC team

---

## 🛠️ Quick Setup (Windows/Mac/Linux)

### Step 1: Install Node.js & npm

**Windows:**
```bash
# Download from https://nodejs.org/ (LTS version)
# Or use Chocolatey:
choco install nodejs

# Verify:
node --version
npm --version
```

**Mac:**
```bash
# Using Homebrew:
brew install node

# Verify:
node --version
npm --version
```

**Linux:**
```bash
sudo apt-get install nodejs npm

# Verify:
node --version
npm --version
```

---

### Step 2: Create Simple HTTPS Server

Navigate to kimi-v7-production directory:

```bash
cd "D:\Proton\My files\2026\Repos2026\dws6\kimi-v7-production"
```

**Option A: Using Node.js (Recommended)**

Create `server.js`:

```javascript
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = 3443;
const publicDir = __dirname;

// Generate self-signed cert if it doesn't exist
const certPath = path.join(__dirname, 'cert.pem');
const keyPath = path.join(__dirname, 'key.pem');

const requestHandler = (req, res) => {
  console.log(`${req.method} ${req.url}`);
  
  // Default to index.html
  let filePath = path.join(publicDir, req.url);
  if (req.url === '/' || req.url === '') {
    filePath = path.join(publicDir, 'index.html');
  }
  
  // Handle hash routing
  if (!path.extname(filePath)) {
    filePath = path.join(publicDir, 'index.html');
  }
  
  // Read and serve file
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.end('File not found!');
      return;
    }
    
    const ext = path.extname(filePath);
    const mimeTypes = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml'
    };
    
    res.setHeader('Content-Type', mimeTypes[ext] || 'text/plain');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.end(data);
  });
};

// Create HTTPS server
const server = https.createServer(
  {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
  },
  requestHandler
);

server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   🚀 Kimi v7 HTTPS Server Running      ║
╠════════════════════════════════════════╣
║                                        ║
║  URL: https://localhost:3443           ║
║                                        ║
║  For Network Access:                   ║
║  https://<your-machine-ip>:3443        ║
║                                        ║
║  Get IP: ipconfig (Windows) or         ║
║          ifconfig (Mac/Linux)          ║
║                                        ║
║  Note: Browser will warn about         ║
║  self-signed certificate - click       ║
║  "Advanced" → "Proceed" to continue    ║
║                                        ║
╚════════════════════════════════════════╝
  `);
});

process.on('SIGTERM', () => {
  console.log('\nShutting down server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
```

**Option B: Using Python (Already Have It)**

```bash
# For Python 3 with SSL
python3 -m http.server --directory . --cgi 3443

# OR create python-ssl-server.py:
```

Create `python_ssl_server.py`:

```python
import http.server
import ssl
import os
import socket

PORT = 3443
CERT_FILE = 'cert.pem'
KEY_FILE = 'key.pem'

# Get machine IP
hostname = socket.gethostname()
ip_address = socket.gethostbyname(hostname)

print(f"""
╔════════════════════════════════════════╗
║   🚀 Kimi v7 HTTPS Server Running      ║
╠════════════════════════════════════════╣
║                                        ║
║  URL: https://localhost:{PORT}         ║
║                                        ║
║  For Network Access:                   ║
║  https://{ip_address}:{PORT}           ║
║                                        ║
║  Or Use Machine Name:                  ║
║  https://{hostname}:{PORT}             ║
║                                        ║
║  Note: Browser will warn about         ║
║  self-signed certificate - proceed     ║
║                                        ║
╚════════════════════════════════════════╝
""")

# Create context
context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
context.load_cert_chain(CERT_FILE, KEY_FILE)

# Create handler
Handler = http.server.SimpleHTTPRequestHandler

# Create server
with http.server.HTTPServer(("", PORT), Handler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped")
```

---

### Step 3: Generate Self-Signed SSL Certificate

**Option A: Using OpenSSL (Windows/Mac/Linux)**

```bash
# Generate self-signed certificate (valid for 365 days)
openssl req -x509 -newkey rsa:4096 -nodes \
  -out cert.pem -keyout key.pem -days 365 \
  -subj "/C=NO/ST=Oslo/L=Oslo/O=NCC/CN=localhost"

# Verify it was created
ls -la cert.pem key.pem
```

**What This Does:**
- Creates `cert.pem` (certificate)
- Creates `key.pem` (private key)
- Valid for 365 days
- Self-signed (browser will warn, but secure)

**Option B: Using Git Bash on Windows**

If OpenSSL not installed:

```bash
# Install OpenSSL through Git Bash, or
# Download from: https://slproweb.com/products/Win32OpenSSL.html

# Then run the openssl command above
```

---

### Step 4: Start the Server

**Using Node.js:**

```bash
# Install dependencies (none needed!)
# Just run:
node server.js

# Output:
# ╔════════════════════════════════════════╗
# ║   🚀 Kimi v7 HTTPS Server Running      ║
# ║                                        ║
# ║  URL: https://localhost:3443           ║
# ║                                        ║
# ║  For Network Access:                   ║
# ║  https://<your-machine-ip>:3443        ║
# ╚════════════════════════════════════════╝
```

**Using Python:**

```bash
python3 python_ssl_server.py

# Output shows your local IP and hostname
```

---

### Step 5: Access from Browser

**Local Machine:**
```
https://localhost:3443
```

**Other Machines on Network:**
```
https://192.168.x.x:3443    (your machine IP)
# or
https://your-machine-name:3443
```

**Browser Warning (Expected):**
- Click "Advanced"
- Click "Proceed to localhost" (or similar)
- This is normal for self-signed certificates

---

## 🔐 SSL Certificate Management

### Understanding Self-Signed Certificates

**What You Have:**
- ✅ Encryption (HTTPS)
- ✅ Secure data transmission
- ✅ Production-like environment
- ⚠️ Browser warns users (expected)
- ⚠️ Not from trusted authority

**Good For:**
- Development & testing
- Internal corporate use
- Kimi K2 testing
- Sharing with NCC team

**Not Good For:**
- Public app store
- Consumer users
- External public site

### Updating Certificate Later

When ready for production:

```bash
# Get proper certificate from Let's Encrypt (free)
# Or use Cloudflare free SSL
# Or buy from certificate authority

# For now, self-signed is perfect
```

---

## 📱 Access from Kimi K2

### Method 1: Same WiFi Network

1. **Get your machine IP:**
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   ```
   Look for IPv4 address (like 192.168.1.100)

2. **On Kimi K2 browser, enter:**
   ```
   https://192.168.1.100:3443
   ```

3. **Accept certificate warning**
   - Click "Advanced" or "Details"
   - Click "Proceed anyway"
   - App loads

### Method 2: USB Tunnel (If Network Issues)

```bash
# Create tunnel through USB
adb reverse tcp:3443 tcp:3443

# Then on Kimi K2:
https://localhost:3443
```

---

## 🚀 Production Setup (With Real Certificate)

### When Ready (After Jan 2026):

**Option 1: Let's Encrypt (Free)**

```bash
# Install Certbot
npm install -g certbot

# Get certificate
certbot certonly --standalone -d yourdomain.com

# Use certificate in your server
```

**Option 2: Cloudflare (Easy)**

1. Add domain to Cloudflare
2. Enable SSL/TLS
3. Get free certificate
4. Point domain to your server

**Option 3: Self-Hosted with nginx/Apache**

```bash
# Setup reverse proxy with proper SSL
# Your Node.js runs on localhost:3000
# nginx handles HTTPS on 443
```

---

## 📋 Complete Setup Script

Create `setup-local-https.sh`:

```bash
#!/bin/bash

echo "🔐 Setting up Kimi v7 HTTPS Server..."

# Check for OpenSSL
if ! command -v openssl &> /dev/null; then
    echo "❌ OpenSSL not found. Install it first."
    exit 1
fi

# Generate certificate if it doesn't exist
if [ ! -f "cert.pem" ] || [ ! -f "key.pem" ]; then
    echo "📜 Generating SSL certificate..."
    openssl req -x509 -newkey rsa:4096 -nodes \
        -out cert.pem -keyout key.pem -days 365 \
        -subj "/C=NO/ST=Oslo/L=Oslo/O=NCC/CN=localhost"
    echo "✅ Certificate created: cert.pem, key.pem"
else
    echo "✅ Certificate already exists"
fi

# Get IP address
if [[ "$OSTYPE" == "darwin"* ]]; then
    IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    IP=$(hostname -I | awk '{print $1}')
else
    IP="[Your IP]"
fi

echo ""
echo "╔════════════════════════════════════════╗"
echo "║  🚀 Ready to Start HTTPS Server        ║"
echo "╠════════════════════════════════════════╣"
echo "║                                        ║"
echo "║  Local:  https://localhost:3443        ║"
echo "║  Network: https://$IP:3443             ║"
echo "║                                        ║"
echo "║  Start with:                           ║"
echo "║  $ node server.js                      ║"
echo "║  or                                    ║"
echo "║  $ python3 python_ssl_server.py        ║"
echo "║                                        ║"
echo "╚════════════════════════════════════════╝"
```

Run it:
```bash
chmod +x setup-local-https.sh
./setup-local-https.sh
```

---

## ✅ Testing Checklist

- [ ] OpenSSL installed
- [ ] Certificate generated (cert.pem, key.pem)
- [ ] Server started (no errors)
- [ ] Can access https://localhost:3443
- [ ] Browser shows warning (expected)
- [ ] Can click through to app
- [ ] App loads correctly
- [ ] Navigation works
- [ ] Can access from Kimi K2 on network
- [ ] Can access via machine IP

---

## 🔧 Troubleshooting

### Port Already in Use

```bash
# Check what's using port 3443
# Windows:
netstat -ano | findstr :3443

# Mac/Linux:
lsof -i :3443

# Kill the process and restart
# Or use different port (3444, 3445, etc)
```

### Certificate Errors

```bash
# Regenerate certificate
rm cert.pem key.pem
openssl req -x509 -newkey rsa:4096 -nodes \
  -out cert.pem -keyout key.pem -days 365

# Restart server
```

### Can't Access from Kimi K2

```bash
# Test your IP
ipconfig (Windows) or ifconfig (Mac/Linux)

# Verify Kimi K2 on same network
# Try: ping <your-machine-ip> from Kimi K2

# If using USB tunnel:
adb reverse tcp:3443 tcp:3443
# Then use https://localhost:3443 on Kimi
```

### Navigation Not Working

```bash
# Make sure index.html loads for all routes
# Server should serve index.html for:
# - /
# - /portfolio
# - /analytics
# - /settings
# This enables hash-based routing
```

---

## 📊 Comparison: Local vs Cloud Deployment

| Aspect | Local HTTPS | Cloud Server |
|--------|-----------|--------------|
| **Setup Time** | 15 minutes | 1-2 hours |
| **Cost** | Free | $10-50/month |
| **Security** | Good (self-signed) | Best (CA cert) |
| **Availability** | While running | 24/7 |
| **For NCC Testing** | Perfect | Better |
| **For Development** | Perfect | Overkill |
| **Easy Updates** | Yes | Yes |

**Recommendation:** Start with local HTTPS, move to cloud when ready for production.

---

## 🎯 Next Steps

### This Week:

1. [ ] Install Node.js or confirm Python installed
2. [ ] Generate SSL certificate
3. [ ] Create server.js (or use Python server)
4. [ ] Start server
5. [ ] Test in browser
6. [ ] Test on Kimi K2

### Commands to Run:

```bash
# 1. Navigate to kimi-v7-production
cd "D:\Proton\My files\2026\Repos2026\dws6\kimi-v7-production"

# 2. Generate certificate (one time)
openssl req -x509 -newkey rsa:4096 -nodes \
  -out cert.pem -keyout key.pem -days 365

# 3. Create server.js (copy from above)
# ... paste the Node.js code ...

# 4. Start server
node server.js

# 5. Open browser
# https://localhost:3443
```

---

## 🎁 Benefits of Local HTTPS Setup

✅ **Complete Control** - Your machine, your rules  
✅ **Development Friendly** - Instant updates, no deploy delay  
✅ **Network Testing** - Test from Kimi K2 on same network  
✅ **Secure** - HTTPS encryption for local network  
✅ **No Vendor Lock-in** - Move to cloud anytime  
✅ **Testing Environment** - Exactly like production  
✅ **NCC Collaboration** - Easy to share secure link  

---

**Setup Time**: 15-30 minutes  
**Complexity**: Low (simple HTTP server with SSL)  
**Status**: Ready to implement  

Ready to set this up? 🚀

---

**Document Version**: 1.0  
**Created**: December 23, 2025  
**Status**: Implementation Ready


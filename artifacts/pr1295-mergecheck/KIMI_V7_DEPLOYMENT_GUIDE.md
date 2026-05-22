# Kimi v7 - Production Deployment Guide

## 📦 Overview

**Kimi v7** is a fully operational HTML/JavaScript application built for the Kimi K2 device, developed specifically for NCC Corporate construction project management.

**Status**: Production Ready  
**Version**: 7 (Final)  
**Build Date**: December 2025  
**Target Device**: Kimi K2 (Android-based)  

---

## 📂 Application Structure

```
kimi-v7/
├── index.html          Main dashboard/home screen
├── portfolio.html      Portfolio management view
├── analytics.html      Analytics & KPI dashboard
├── settings.html       User settings & configuration
├── main.js             Core application logic & event handlers
├── openapi.yaml        API specification (v1.0)
├── resources/
│   └── hero-bg.jpg     Background image asset
└── deployment/
    ├── deployment.md   (this file)
    └── setup-kimi.sh   Setup script
```

---

## 🎯 Key Screens

### 1. **index.html - Dashboard**
- Portfolio overview
- KPI snapshot (CPI, SPI, Budget)
- Project alerts
- Quick navigation

### 2. **portfolio.html - Projects**
- Active projects list
- Filtering & search
- Project KPI summary
- Link to project details

### 3. **analytics.html - Analytics**
- Detailed KPI analysis
- Charts & trends
- Performance metrics
- Export capabilities

### 4. **settings.html - Configuration**
- User preferences
- Theme settings
- Notification options
- Account management

### 5. **main.js - Application Logic**
- Navigation between screens
- API communication
- Data processing
- Event handling

---

## 🚀 Deployment Options

### **Option 1: Direct Installation (Simplest)**

#### Requirements:
- Kimi K2 device with Android
- USB cable (USB Type-C)
- ADB (Android Debug Bridge) installed
- Application file (index.html + supporting files)

#### Steps:

```bash
# 1. Connect Kimi K2 to computer
# 2. Enable USB Debugging on Kimi K2:
#    Settings → About → Tap Build Number 7 times
#    Settings → Developer Options → Enable USB Debugging

# 3. Verify connection
adb devices

# 4. Create app directory on device
adb shell mkdir -p /data/local/tmp/dws-iq

# 5. Push files to device
adb push index.html /data/local/tmp/dws-iq/
adb push portfolio.html /data/local/tmp/dws-iq/
adb push analytics.html /data/local/tmp/dws-iq/
adb push settings.html /data/local/tmp/dws-iq/
adb push main.js /data/local/tmp/dws-iq/
adb push openapi.yaml /data/local/tmp/dws-iq/
adb push resources/ /data/local/tmp/dws-iq/

# 6. Start web server on device
adb shell "cd /data/local/tmp/dws-iq && python3 -m http.server 8000"

# 7. Open in browser
# http://localhost:8000
```

---

### **Option 2: Web Server Integration**

#### For Production Deployment:

```bash
# 1. Copy files to web server
scp -r kimi-v7/* user@ncc-server:/var/www/dws-iq/

# 2. Update web server config (nginx/Apache)
# Point domain to /var/www/dws-iq/

# 3. Configure HTTPS (Let's Encrypt)
certbot certonly --webroot -w /var/www/dws-iq -d dws-iq.ncc.corp

# 4. Access from Kimi K2 browser
# https://dws-iq.ncc.corp
```

---

### **Option 3: Electron App (Desktop)**

Convert to standalone desktop app:

```bash
# Install Electron
npm install electron --save-dev

# Create main.js for Electron
# Package as executable
npm run build:electron

# Deploy .exe or .app to devices
```

---

## 🔧 Configuration

### Environment Setup

Create `config.js` file:

```javascript
const CONFIG = {
  // API Configuration
  API_BASE_URL: 'https://api.dws-iq.ncc.corp/v1',
  
  // App Configuration
  APP_NAME: 'DWS IQ v7',
  APP_VERSION: '7.0.0',
  
  // Feature Flags
  ENABLE_ANALYTICS: true,
  ENABLE_OFFLINE: false,
  
  // Timeout (ms)
  API_TIMEOUT: 30000,
  
  // Logging
  DEBUG: false,
  LOG_LEVEL: 'INFO'
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
```

### Database Configuration

If using local storage:

```javascript
// IndexedDB for caching
const DB_NAME = 'dws-iq-v7';
const DB_VERSION = 1;

const createDatabase = () => {
  const request = indexedDB.open(DB_NAME, DB_VERSION);
  
  request.onupgradeneeded = (e) => {
    const db = e.target.result;
    
    // Create object stores
    db.createObjectStore('projects', { keyPath: 'id' });
    db.createObjectStore('kpis', { keyPath: 'projectId' });
    db.createObjectStore('alerts', { keyPath: 'id' });
    db.createObjectStore('cache', { keyPath: 'url' });
  };
  
  return request;
};
```

---

## 📡 API Integration

### Endpoints Used (from openapi.yaml)

```yaml
GET /portfolio/summary          → Dashboard metrics
GET /projects                   → Projects list
GET /projects/{id}              → Project details
GET /projects/{id}/kpis         → KPI data
GET /projects/{id}/schedule     → Schedule info
GET /projects/{id}/safety       → Safety metrics
GET /projects/{id}/quality      → Quality data
GET /alerts                     → Alerts feed
POST /alerts/{id}/acknowledge   → Alert acknowledgment
```

### API Call Example (main.js)

```javascript
async function fetchPortfolioData() {
  try {
    const response = await fetch(
      `${CONFIG.API_BASE_URL}/portfolio/summary`,
      {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        },
        timeout: CONFIG.API_TIMEOUT
      }
    );
    
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    
    const data = await response.json();
    updateDashboard(data);
  } catch (error) {
    console.error('Portfolio fetch failed:', error);
    showErrorNotification('Failed to load portfolio data');
  }
}
```

---

## 🔐 Security Configuration

### HTTPS Setup

```bash
# 1. Generate self-signed cert (development only)
openssl req -x509 -newkey rsa:4096 -nodes \
  -out cert.pem -keyout key.pem -days 365

# 2. For production, use Let's Encrypt
certbot certonly --standalone -d dws-iq.ncc.corp
```

### Authentication

```javascript
// Store tokens securely
const storeAuthToken = (token) => {
  // Use sessionStorage (cleared on browser close)
  sessionStorage.setItem('auth_token', token);
  
  // Or use IndexedDB with encryption
  const encrypted = encryptToken(token);
  db.put('tokens', { key: 'auth', value: encrypted });
};

// Retrieve with validation
const getAuthToken = () => {
  const token = sessionStorage.getItem('auth_token');
  if (isTokenExpired(token)) {
    refreshAuthToken();
  }
  return token;
};
```

---

## 📊 Testing & Validation

### Pre-Deployment Checklist

```
Browser Compatibility:
□ Chrome/Chromium (Kimi K2 browser)
□ Firefox (if available on Kimi)
□ Safari (if iOS support needed)
□ Edge (if Windows tablets needed)

Functionality:
□ Dashboard loads correctly
□ All screens accessible via navigation
□ Data displays without errors
□ API calls return expected results
□ Authentication works
□ Alerts display & acknowledge
□ Settings persist across sessions

Performance:
□ Dashboard loads < 2 seconds
□ Page transitions < 300ms
□ API responses < 500ms
□ No console errors or warnings
□ Memory usage stable
□ No memory leaks after 1 hour use

Responsive Design:
□ Works on Kimi K2 screen size
□ Touch interactions responsive
□ Buttons/links easy to tap
□ Text readable on device
□ Images scale correctly
```

### Test Scenarios

#### 1. **Dashboard Loading**
```
Steps:
1. Open https://dws-iq.ncc.corp
2. Login with test credentials
3. Verify portfolio KPIs display
4. Check all alerts show
5. Confirm navigation works

Expected: 
- Page loads in < 2 seconds
- All data visible
- No errors in console
```

#### 2. **Portfolio Navigation**
```
Steps:
1. Click "Portfolio" in navigation
2. View projects list
3. Apply filter (e.g., region)
4. Search for project
5. Click project to view details

Expected:
- Projects load quickly
- Filters work correctly
- Search responsive
- Details page accurate
```

#### 3. **Analytics Viewing**
```
Steps:
1. Open Analytics section
2. View KPI charts
3. Check trend data
4. Verify metrics accuracy

Expected:
- Charts render correctly
- Data matches portfolio view
- Trends visible & interpretable
```

#### 4. **Offline Capability**
```
Steps:
1. Load dashboard (online)
2. Disconnect network
3. Refresh page
4. Verify cached data shows
5. Show "offline" indicator
6. Reconnect & sync

Expected:
- App remains usable
- Data doesn't disappear
- Offline clearly indicated
- Auto-syncs when online
```

---

## 🐛 Troubleshooting

### Common Issues

#### Issue: Page loads blank/white screen
**Solution:**
- Check browser console (F12 → Console)
- Look for JavaScript errors
- Verify API_BASE_URL in config.js
- Clear browser cache: Ctrl+Shift+Del

#### Issue: API calls fail with 401
**Solution:**
- Check authentication token
- Verify token not expired
- Ensure correct Authorization header
- Test with Postman: 
  ```
  GET https://api.dws-iq.ncc.corp/portfolio/summary
  Header: Authorization: Bearer <token>
  ```

#### Issue: Slow loading on Kimi K2
**Solution:**
- Check network speed
- Verify API latency
- Reduce data payload
- Enable caching
- Compress images

#### Issue: Touch not responsive
**Solution:**
- Increase button/link size (min 44px)
- Add longer touch timeout
- Use touch events instead of mouse
- Test with Chrome DevTools → Device emulation

### Debug Mode

Enable detailed logging:

```javascript
// In main.js
const DEBUG = true;

const log = (message, data) => {
  if (DEBUG) {
    console.log(`[${new Date().toISOString()}] ${message}`, data);
  }
};

// Usage
log('API Call', { method: 'GET', url: endpoint });
```

---

## 📈 Performance Optimization

### Load Time Optimization

```html
<!-- Critical CSS inline -->
<style>
  /* Essential styles for initial render */
</style>

<!-- Defer non-critical JavaScript -->
<script src="main.js" defer></script>

<!-- Lazy load images -->
<img src="hero-bg.jpg" loading="lazy" />
```

### Caching Strategy

```javascript
// Cache API responses
const cacheResponse = (url, data) => {
  localStorage.setItem(`cache_${url}`, JSON.stringify({
    data,
    timestamp: Date.now()
  }));
};

// Get from cache if fresh
const getCachedData = (url, maxAge = 5 * 60 * 1000) => {
  const cached = localStorage.getItem(`cache_${url}`);
  if (!cached) return null;
  
  const { data, timestamp } = JSON.parse(cached);
  if (Date.now() - timestamp > maxAge) return null;
  
  return data;
};
```

---

## 📱 Device Specific

### Kimi K2 Optimization

```javascript
// Detect device
const isKimiK2 = () => {
  return /Kimi|Android/.test(navigator.userAgent);
};

// Optimize for Kimi
if (isKimiK2()) {
  // Larger touch targets
  document.documentElement.style.fontSize = '18px';
  
  // Reduce animations
  document.body.style.animation = 'none';
  
  // Enable hardware acceleration
  document.body.style.transform = 'translate3d(0,0,0)';
  
  // Reduce color depth if needed
  CONFIG.ENABLE_ANIMATIONS = false;
}
```

---

## 🔄 Updates & Versioning

### Version Management

```javascript
const VERSION = {
  APP: '7.0.0',
  API: '1.0.0',
  BUILD_DATE: '2025-12-23'
};

// Check for updates
const checkForUpdates = async () => {
  const latest = await fetch('/version.json').then(r => r.json());
  if (latest.APP > VERSION.APP) {
    showUpdateNotification();
  }
};
```

### Update Process

```bash
# 1. Deploy new files to server
scp kimi-v7/* user@server:/var/www/dws-iq/

# 2. Update version.json
echo '{"APP":"7.1.0"}' > /var/www/dws-iq/version.json

# 3. Clear CDN cache (if applicable)
curl -X POST https://cdn.example.com/purge

# 4. Notify users
# App will detect update on next refresh
```

---

## 📋 Support & Maintenance

### Monitoring

Monitor these metrics:

```
✓ Error Rate: < 0.1%
✓ API Response Time: < 500ms
✓ Page Load Time: < 2s
✓ Availability: > 99.5%
✓ User Session Duration: Track trends
```

### Logging

Implement centralized logging:

```javascript
const sendLog = async (level, message, error) => {
  await fetch(`${CONFIG.API_BASE_URL}/logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      level,        // 'INFO', 'ERROR', 'WARN'
      message,
      error: error?.toString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    })
  });
};
```

### Backup & Recovery

```bash
# Daily backup
0 2 * * * tar -czf /backups/dws-iq-$(date +%Y%m%d).tar.gz /var/www/dws-iq/

# Weekly verification
0 3 * * 0 cd /var/www/dws-iq && npm run test:smoke
```

---

## 🎯 Next Steps

1. **This Week**
   - [ ] Extract Kimi v7 files
   - [ ] Setup deployment environment
   - [ ] Configure API endpoints
   - [ ] Test on Kimi K2

2. **Next Week**
   - [ ] Deploy to production
   - [ ] Conduct NCC UAT
   - [ ] Gather feedback
   - [ ] Plan v7.1 improvements

3. **Ongoing**
   - [ ] Monitor performance
   - [ ] Support NCC team
   - [ ] Log issues & improvements
   - [ ] Plan React Native migration

---

## 📞 Support

**For technical issues:**
- Check troubleshooting section
- Review browser console
- Test API endpoints directly
- Contact development team

**For feature requests:**
- Document requirements
- Prioritize with NCC
- Add to backlog
- Plan for v7.1+

---

**Deployment Guide Version**: 1.0  
**Last Updated**: December 23, 2025  
**Status**: Ready for Production Deployment


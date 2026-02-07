# Admin Manual: V8 Dashboard Management

---
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Cursor AI | Session: 2025-12-30 | Date: 30.12.2025 | Changes: Initial creation - V8 Dashboard admin manual

Session Links & References:
  - Cursor AI (2025-12-30): https://github.com/blogtheristo/dws6/pull/77
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/Admin/ADMIN_MANUAL_DASHBOARD_V8_EN_v1.md

Document Status:
  - Created: 30.12.2025
  - Last Modified: 30.12.2025
  - Language: English
  - Languages Available: English
  - Publication Status: ✅ ACTIVE

---

**Version:** 1.0  
**Purpose:** Administration and management guide for V8 Dashboard  
**Audience:** System Administrators, DevOps Engineers  
**Updated:** 30.12.2025

---

## Table of Contents

1. [Overview](#1-overview)
2. [System Requirements](#2-system-requirements)
3. [Installation and Deployment](#3-installation-and-deployment)
4. [Configuration](#4-configuration)
5. [Database Management](#5-database-management)
6. [Monitoring and Maintenance](#6-monitoring-and-maintenance)
7. [Troubleshooting](#7-troubleshooting)
8. [Security](#8-security)
9. [Backup and Recovery](#9-backup-and-recovery)
10. [Performance Optimization](#10-performance-optimization)

---

## 1. Overview

### 1.1 System Description

The V8 Dashboard is a mobile-first construction project management interface with real-time Supabase PostgreSQL integration. It provides portfolio management, project tracking, and alert monitoring capabilities.

**Key Features**:
- Real-time data from Supabase PostgreSQL
- Mobile-first responsive design
- Portfolio metrics calculation
- Project and alert management
- Debug panel for system monitoring

### 1.2 Repository Information

**Directory**: `dws6.com/dashboard/firehorse/v8/`

**Repository**: https://github.com/blogtheristo/dws6

**Live URL**: https://dws6.com/dashboard/firehorse/v8/

### 1.3 Architecture

```
User Browser
     ↓
Cloudflare CDN
     ↓
Static Files (HTML/CSS/JS)
     ↓
Supabase Client Library
     ↓
Supabase API (REST)
     ↓
PostgreSQL Database
```

---

## 2. System Requirements

### 2.1 Client Requirements

**Supported Browsers**:
- Chrome 120+
- Firefox 121+
- Safari 17+
- Edge 120+
- Opera 106+

**Minimum Device Specifications**:
- Screen: 320px width minimum
- RAM: 2GB
- Network: 3G or better

### 2.2 Server Requirements

**Hosting**:
- Platform: Cloudflare Pages
- CDN: Cloudflare CDN
- SSL: Automatic (Cloudflare)

**Database**:
- Provider: Supabase
- Database: PostgreSQL 15
- Plan: Free Tier (50K MAU, 500MB DB)

### 2.3 Dependencies

**External Libraries**:
- Supabase JS Client: 2.39.0
- Font Awesome: 6.4.0
- Google Fonts (Inter): Latest

---

## 3. Installation and Deployment

### 3.1 Local Development Setup

#### Step 1: Clone Repository

```bash
git clone https://github.com/blogtheristo/dws6.git
cd dws6/dws6.com/dashboard/firehorse/v8/
```

#### Step 2: Configure Supabase

Edit `main.js` with your Supabase credentials:

```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';
```

#### Step 3: Start Local Server

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server -p 8000

# Using PHP
php -S localhost:8000
```

#### Step 4: Access Dashboard

Open browser: `http://localhost:8000`

### 3.2 Production Deployment

#### Option 1: Cloudflare Pages

1. **Connect Repository**:
   - Go to Cloudflare Pages dashboard
   - Connect GitHub repository
   - Select `dws6` repository

2. **Configure Build**:
   ```
   Build command: (none - static site)
   Build output directory: dws6.com/dashboard/firehorse/v8
   ```

3. **Deploy**:
   - Click "Save and Deploy"
   - Wait for deployment to complete
   - Access via: `https://dws6.com/dashboard/firehorse/v8/`

#### Option 2: Manual Deployment

1. **Build Files**:
   ```bash
   # No build step required - static files
   ```

2. **Upload to Server**:
   ```bash
   rsync -avz dws6.com/dashboard/firehorse/v8/ user@server:/var/www/html/dashboard/v8/
   ```

3. **Configure Web Server** (Nginx example):
   ```nginx
   server {
       listen 443 ssl http2;
       server_name dws6.com;
       
       location /dashboard/firehorse/v8/ {
           root /var/www/html;
           index index.html;
           try_files $uri $uri/ =404;
       }
   }
   ```

---

## 4. Configuration

### 4.1 Supabase Configuration

**File**: `main.js` (lines 1-3)

```javascript
// Supabase Configuration
const SUPABASE_URL = 'https://kpucuwwfhuwurdxyjjtz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

**Configuration Steps**:

1. **Get Supabase Credentials**:
   - Login to Supabase dashboard
   - Go to Project Settings → API
   - Copy Project URL and anon/public key

2. **Update Configuration**:
   ```javascript
   const SUPABASE_URL = 'YOUR_PROJECT_URL';
   const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';
   ```

3. **Commit Changes**:
   ```bash
   git add main.js
   git commit -m "Update Supabase configuration"
   git push origin main
   ```

### 4.2 V7 Architecture Bundle Configuration

**File**: `scripts/dws-bundle.js`

**State Configuration** (lines 3-10):
```javascript
const state = {
  apiBase: 'https://api.dwsiq.example.com',  // Legacy API (not used in V8)
  token: localStorage.getItem('dws_token') || null,
  cacheTtlMs: { 
    portfolio: 300000,  // 5 minutes
    alerts: 120000,     // 2 minutes
    projects: 600000    // 10 minutes
  },
  websocket: null,
  lastFetch: {},
  isOnline: navigator.onLine
};
```

**Customization Options**:
- `cacheTtlMs`: Adjust cache duration per data type
- `apiBase`: Legacy API endpoint (not used with Supabase)
- `token`: Authentication token storage

### 4.3 UI Configuration

**Logo**: `assets/ncc-logo.png`
- Replace with your company logo
- Recommended size: 55x55px
- Format: PNG with transparency

**Colors**: Edit `index.html` CSS (lines 10-445)
```css
/* Primary colors */
--primary: #1e293b;
--secondary: #334155;
--accent: #3b82f6;
--success: #10b981;
--warning: #f59e0b;
--error: #ef4444;
```

---

## 5. Database Management

### 5.1 Database Schema

#### Projects Table

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  region TEXT,
  phase TEXT,
  spi NUMERIC(4,2),
  cpi NUMERIC(4,2),
  percent_complete INTEGER CHECK (percent_complete >= 0 AND percent_complete <= 100),
  safety_rag TEXT CHECK (safety_rag IN ('green', 'amber', 'red')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX idx_projects_region ON projects(region);
CREATE INDEX idx_projects_phase ON projects(phase);
```

#### Alerts Table

```sql
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_name TEXT NOT NULL,
  message TEXT NOT NULL,
  age_hours INTEGER DEFAULT 0,
  type TEXT CHECK (type IN ('schedule', 'cost', 'safety', 'quality', 'info')),
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by TEXT
);

CREATE INDEX idx_alerts_created_at ON alerts(created_at DESC);
CREATE INDEX idx_alerts_severity ON alerts(severity);
CREATE INDEX idx_alerts_type ON alerts(type);
```

### 5.2 Sample Data

#### Insert Sample Projects

```sql
INSERT INTO projects (name, region, phase, spi, cpi, percent_complete, safety_rag) VALUES
('HQ Expansion', 'Nordics', 'Execution', 0.94, 0.96, 58, 'amber'),
('Residential Complex', 'Nordics', 'Execution', 1.02, 0.98, 72, 'green'),
('Office Tower', 'Europe', 'Planning', 1.00, 1.00, 15, 'green'),
('Shopping Mall', 'Asia', 'Execution', 0.88, 0.92, 45, 'red');
```

#### Insert Sample Alerts

```sql
INSERT INTO alerts (project_name, message, age_hours, type, severity) VALUES
('HQ Expansion', 'Critical path slip: Steel erection delayed by 5 days', 2, 'schedule', 'high'),
('Office Tower', 'Budget variance detected: 3% over planned costs', 24, 'cost', 'medium'),
('Shopping Mall', 'Safety incident reported: Minor injury on site', 1, 'safety', 'critical');
```

### 5.3 Data Maintenance

#### Update Project Status

```sql
UPDATE projects 
SET percent_complete = 65, 
    spi = 0.96, 
    cpi = 0.97,
    updated_at = NOW()
WHERE name = 'HQ Expansion';
```

#### Resolve Alert

```sql
UPDATE alerts 
SET resolved_at = NOW(),
    resolved_by = 'admin@dws-iq.com'
WHERE id = 'alert-uuid-here';
```

#### Clean Old Resolved Alerts

```sql
DELETE FROM alerts 
WHERE resolved_at < NOW() - INTERVAL '30 days';
```

---

## 6. Monitoring and Maintenance

### 6.1 Health Checks

#### Dashboard Health Check

**URL**: `https://dws6.com/dashboard/firehorse/v8/`

**Expected Response**:
- HTTP 200 OK
- Page loads within 3 seconds
- No console errors
- Supabase connection successful

#### Supabase Health Check

**URL**: `https://kpucuwwfhuwurdxyjjtz.supabase.co/rest/v1/`

**Expected Response**:
- HTTP 200 OK
- JSON response
- Authentication header accepted

### 6.2 Monitoring Metrics

**Key Metrics to Monitor**:

| Metric | Target | Critical Threshold |
|--------|--------|-------------------|
| Page Load Time | < 3s | > 5s |
| Database Query Time | < 500ms | > 2s |
| Error Rate | < 1% | > 5% |
| Uptime | > 99.5% | < 99% |
| Active Users | - | Monitor trends |

### 6.3 Log Monitoring

**Browser Console Logs**:

```javascript
// Success logs
✅ Supabase connected
Projects loaded: 4
Alerts loaded: 3

// Error logs
❌ Supabase initialization failed: [error details]
Error loading projects: [error details]
```

**Supabase Logs**:
- Access via Supabase Dashboard → Logs
- Monitor query performance
- Check error rates
- Review authentication attempts

### 6.4 Maintenance Schedule

**Daily**:
- ✅ Check dashboard accessibility
- ✅ Review error logs
- ✅ Monitor performance metrics

**Weekly**:
- ✅ Review database performance
- ✅ Check disk usage
- ✅ Update dependencies (if needed)
- ✅ Review security alerts

**Monthly**:
- ✅ Database optimization (VACUUM, ANALYZE)
- ✅ Clean old data
- ✅ Review access logs
- ✅ Update documentation

---

## 7. Troubleshooting

### 7.1 Common Issues

#### Issue 1: Dashboard Not Loading

**Symptoms**:
- Blank page
- "Failed to load" error
- Infinite loading

**Solutions**:

1. **Check Browser Console**:
   ```
   F12 → Console tab
   Look for JavaScript errors
   ```

2. **Clear Browser Cache**:
   ```
   Ctrl+Shift+R (Windows)
   Cmd+Shift+R (Mac)
   ```

3. **Verify CDN Access**:
   ```bash
   curl -I https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.0
   ```

4. **Check Cloudflare Status**:
   - Visit: https://www.cloudflarestatus.com/

#### Issue 2: No Data Displayed

**Symptoms**:
- Projects list empty
- Alerts not showing
- Portfolio metrics show "--"

**Solutions**:

1. **Check Supabase Connection**:
   - Open Debug Panel (bug icon)
   - Verify "DB: ✓ Connected"

2. **Verify Database Has Data**:
   ```sql
   SELECT COUNT(*) FROM projects;
   SELECT COUNT(*) FROM alerts;
   ```

3. **Check Supabase Credentials**:
   - Verify `SUPABASE_URL` is correct
   - Verify `SUPABASE_ANON_KEY` is valid

4. **Check Row Level Security**:
   ```sql
   -- Ensure public read access
   SELECT * FROM pg_policies WHERE tablename = 'projects';
   ```

#### Issue 3: Slow Performance

**Symptoms**:
- Page loads slowly (> 5s)
- Database queries timeout
- UI feels sluggish

**Solutions**:

1. **Check Network Speed**:
   ```bash
   # Test download speed
   curl -o /dev/null https://dws6.com/dashboard/firehorse/v8/
   ```

2. **Optimize Database Queries**:
   ```sql
   -- Add missing indexes
   CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
   
   -- Analyze query performance
   EXPLAIN ANALYZE SELECT * FROM projects ORDER BY created_at DESC LIMIT 10;
   ```

3. **Enable Compression**:
   - Verify Cloudflare compression is enabled
   - Check Supabase API compression

4. **Reduce Data Volume**:
   - Limit query results to 10 records
   - Archive old data

### 7.2 Error Messages

| Error Message | Cause | Solution |
|--------------|-------|----------|
| "Supabase initialization failed" | Invalid credentials or network issue | Check credentials, verify network |
| "Failed to load projects" | Database query error | Check database schema, verify RLS policies |
| "Database connection timeout" | Network latency or Supabase down | Check Supabase status, retry connection |
| "No token" in debug panel | Authentication not implemented | Normal for V8 (auth coming in future) |

---

## 8. Security

### 8.1 Security Best Practices

**✅ Implemented**:
- HTTPS only (TLS 1.3)
- Row Level Security (RLS) in Supabase
- Input validation
- SQL injection prevention (parameterized queries)
- XSS protection (Content Security Policy)

**🚧 To Implement**:
- Authentication (Supabase Auth)
- Authorization (role-based access)
- Rate limiting
- CSRF protection

### 8.2 Supabase Security Configuration

#### Enable Row Level Security

```sql
-- Enable RLS on tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON alerts FOR SELECT USING (true);

-- Restrict write access (future)
CREATE POLICY "Allow authenticated write" ON projects 
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

#### API Key Management

**Anon Key**:
- Public key for read-only access
- Safe to expose in client code
- Limited by RLS policies

**Service Role Key**:
- Full database access
- NEVER expose in client code
- Use only in server-side code

### 8.3 Security Monitoring

**Monitor For**:
- Unusual query patterns
- High error rates
- Failed authentication attempts
- Suspicious IP addresses
- Large data exports

**Tools**:
- Supabase Dashboard → Logs
- Cloudflare Analytics
- Browser DevTools Network tab

---

## 9. Backup and Recovery

### 9.1 Database Backup

#### Automatic Backups (Supabase)

**Free Tier**:
- Daily backups (retained for 7 days)
- Point-in-time recovery not available

**Pro Tier** (if upgraded):
- Daily backups (retained for 30 days)
- Point-in-time recovery (7 days)

#### Manual Backup

```bash
# Export database
pg_dump -h db.kpucuwwfhuwurdxyjjtz.supabase.co \
        -U postgres \
        -d postgres \
        -F c \
        -f backup_$(date +%Y%m%d).dump

# Export specific table
pg_dump -h db.kpucuwwfhuwurdxyjjtz.supabase.co \
        -U postgres \
        -d postgres \
        -t projects \
        -F c \
        -f projects_backup_$(date +%Y%m%d).dump
```

### 9.2 Code Backup

**Git Repository**:
```bash
# Backup to GitHub
git add .
git commit -m "Backup: $(date +%Y-%m-%d)"
git push origin main

# Create tagged backup
git tag -a v8-backup-$(date +%Y%m%d) -m "V8 Dashboard backup"
git push origin v8-backup-$(date +%Y%m%d)
```

**Local Backup**:
```bash
# Create archive
tar -czf v8-dashboard-backup-$(date +%Y%m%d).tar.gz \
    dws6.com/dashboard/firehorse/v8/

# Copy to backup location
cp v8-dashboard-backup-*.tar.gz /backup/dws6/
```

### 9.3 Recovery Procedures

#### Restore Database

```bash
# Restore full database
pg_restore -h db.kpucuwwfhuwurdxyjjtz.supabase.co \
           -U postgres \
           -d postgres \
           -c \
           backup_20251230.dump

# Restore specific table
pg_restore -h db.kpucuwwfhuwurdxyjjtz.supabase.co \
           -U postgres \
           -d postgres \
           -t projects \
           projects_backup_20251230.dump
```

#### Restore Code

```bash
# Restore from Git
git checkout v8-backup-20251230

# Restore from archive
tar -xzf v8-dashboard-backup-20251230.tar.gz
```

---

## 10. Performance Optimization

### 10.1 Database Optimization

#### Query Optimization

```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_projects_region ON projects(region);
CREATE INDEX idx_projects_phase ON projects(phase);
CREATE INDEX idx_alerts_severity ON alerts(severity);

-- Analyze tables for query planner
ANALYZE projects;
ANALYZE alerts;

-- Vacuum tables to reclaim space
VACUUM ANALYZE projects;
VACUUM ANALYZE alerts;
```

#### Connection Pooling

Supabase automatically handles connection pooling:
- Default: 15 connections (Free Tier)
- Max: Configurable in Supabase settings

### 10.2 Frontend Optimization

#### CDN Optimization

**Cloudflare Settings**:
- ✅ Auto Minify: HTML, CSS, JS
- ✅ Brotli Compression
- ✅ HTTP/2 & HTTP/3
- ✅ Early Hints
- ✅ Rocket Loader (optional)

#### Asset Optimization

```bash
# Minify JavaScript
npx terser main.js -o main.min.js --compress --mangle

# Minify CSS (in index.html)
npx cssnano index.html -o index.min.html

# Optimize images
npx imagemin assets/*.png --out-dir=assets/optimized
```

### 10.3 Caching Strategy

**Browser Caching** (Cloudflare):
```
Cache-Control: public, max-age=31536000, immutable
```

**Application Caching** (V7 Bundle):
- Portfolio: 5 minutes
- Alerts: 2 minutes
- Projects: 10 minutes

---

## Contact and Support

**Technical Support**: support@dws-iq.com  
**Emergency Contact**: +358 XX XXX XXXX  
**Documentation**: https://github.com/blogtheristo/dws6

---

**Document Version**: 1.0  
**Last Updated**: 30. December 2025  
**Next Review**: Q2 2026

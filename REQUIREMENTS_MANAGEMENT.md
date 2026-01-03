# 📦 Requirements Management Guide

**Version:** 1.0  
**Date:** 03.01.2026  

---

## 📁 Requirements Files Structure

### Root Level
- **`requirements.txt`** - Consolidated dependencies for CI/CD and security scanning
- **`requirements-security.txt`** - Security-focused dependencies
- **`dev-requirements.txt`** - Development and testing tools

### Module-Specific
- **`mcp-hub/requirements.txt`** - MCP Hub dependencies
- **`Firehorse/requirements.txt`** - Firehorse Add-ons
- **`sites/onelifetime-world/requirements.txt`** - OneLifetime.world site
- **`sites/lifetime-fi/requirements.txt`** - Lifetime.fi site
- **`mcp-servers/supabase/requirements.txt`** - Supabase MCP server
- **`Reports/requirements.txt`** - Reporting tools

---

## 🎯 Usage Guidelines

### For Local Development

**Install all dependencies:**
```bash
pip install -r requirements.txt
```

**Install module-specific dependencies:**
```bash
pip install -r mcp-hub/requirements.txt
pip install -r Firehorse/requirements.txt
```

**Install development tools only:**
```bash
pip install -r dev-requirements.txt
```

### For CI/CD

The GitHub Actions workflow automatically:
1. Creates consolidated `requirements.txt` from all sources
2. Installs dependencies
3. Runs Snyk security scan

### For Production

Install only the specific module requirements needed:
```bash
pip install -r mcp-hub/requirements.txt
```

---

## 🔒 Security Scanning

### Snyk Integration

The security scan workflow (`.github/workflows/security_scan.yml`) automatically:
- Consolidates all requirements files
- Scans for vulnerabilities (medium severity and above)
- Reports to GitHub Security tab

### Manual Security Scan

**Using pip-audit:**
```bash
pip-audit -r requirements.txt
```

**Using safety:**
```bash
safety check -r requirements.txt
```

**Using Snyk CLI:**
```bash
snyk test --file=requirements.txt --severity-threshold=medium
```

---

## 📋 Maintenance

### Adding New Dependencies

1. **Add to appropriate file:**
   - Security-related → `requirements-security.txt`
   - Development tools → `dev-requirements.txt`
   - Module-specific → `module/requirements.txt`

2. **Update root `requirements.txt`:**
   ```bash
   # Add the dependency with version constraint
   new-package>=1.0.0
   ```

3. **Test locally:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Commit and push:**
   ```bash
   git add requirements*.txt
   git commit -m "deps: Add new-package for [purpose]"
   ```

### Updating Dependencies

**Check for outdated packages:**
```bash
pip list --outdated
```

**Update specific package:**
```bash
pip install --upgrade package-name
pip freeze | grep package-name >> requirements.txt
```

**Update all (use with caution):**
```bash
pip install --upgrade -r requirements.txt
pip freeze > requirements.txt
```

### Version Pinning Strategy

- **Security packages:** Use `>=` for latest security fixes
- **Core dependencies:** Pin exact versions for stability
- **Development tools:** Use `>=` for latest features

Example:
```txt
Flask==3.0.0          # Exact version (core dependency)
pytest>=7.4.0         # Minimum version (dev tool)
requests>=2.31.0      # Minimum version (security)
```

---

## 🚨 Troubleshooting

### Snyk Scan Fails

**Error:** "Could not find requirements.txt"

**Solution:** The workflow now auto-generates it. If still failing:
1. Check `.github/workflows/security_scan.yml`
2. Ensure `requirements-security.txt` exists
3. Verify GitHub Actions has proper permissions

### Dependency Conflicts

**Error:** "Conflicting dependencies"

**Solution:**
1. Create virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   venv\Scripts\activate     # Windows
   ```

2. Install dependencies one by one:
   ```bash
   pip install -r requirements-security.txt
   pip install -r dev-requirements.txt
   ```

3. Resolve conflicts manually

### Missing Dependencies

**Error:** "ModuleNotFoundError"

**Solution:**
1. Check which module needs the dependency
2. Add to appropriate requirements file
3. Reinstall:
   ```bash
   pip install -r requirements.txt
   ```

---

## 📊 CI/CD Integration

### GitHub Actions Workflow

The security scan runs:
- On push to `main`
- On pull requests to `main`
- Weekly (Monday 6 AM UTC)

### Workflow Steps

1. **Checkout code**
2. **Setup Python 3.11**
3. **Create consolidated requirements.txt**
4. **Install dependencies**
5. **Run Snyk scan**
6. **Upload results to GitHub Security**

### Viewing Results

**GitHub Security Tab:**
https://github.com/blogtheristo/dws6/security

**Snyk Dashboard:**
https://app.snyk.io/

---

## ✅ Best Practices

1. **Always specify versions** - Avoid unpinned dependencies
2. **Regular updates** - Check for security updates weekly
3. **Test before commit** - Install and test locally first
4. **Document changes** - Note why dependencies were added
5. **Minimal dependencies** - Only install what's needed
6. **Security first** - Prioritize security updates

---

## 📚 Related Documentation

- **Security Manual:** `Admin/Security/GITHUB_APP_SECURITY_ADMIN.md`
- **Snyk Setup:** `.github/workflows/security_scan.yml`
- **Environment Config:** `env.mcp.example`

---

**Maintained by:** DevOps Team  
**Next Review:** 03.04.2026

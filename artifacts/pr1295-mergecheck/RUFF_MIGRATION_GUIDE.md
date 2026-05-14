# 🐶 Ruff Migration Guide

**Version:** 1.0  
**Date:** 03.01.2026  
**Status:** 📋 Proposed  

---

## 🎯 Executive Summary

**Recommendation:** ✅ **ADOPT RUFF**

Ruff will replace Black, Flake8, isort, and pyupgrade with a single, blazingly fast tool written in Rust.

**Key Benefits:**
- ⚡ **10-100x faster** than current tools
- 🔧 **Auto-fix** for 800+ rules
- 🎯 **Single tool** replaces 4+ tools
- 🔒 **Security checks** included (flake8-bandit)
- 🚀 **CI/CD speedup** from ~60s to ~3s

---

## 📊 Current State vs. Ruff

### **Current Tools (4 tools)**
```bash
black>=23.7.0      # Code formatting
flake8>=6.1.0      # Linting
isort              # Import sorting (implicit)
pyupgrade          # Syntax upgrades (missing)
```

**CI/CD Time:** ~30-60 seconds  
**Configuration Files:** 3-4 files  
**Dependencies:** 4+ packages  

### **With Ruff (1 tool)**
```bash
ruff>=0.8.0        # Everything in one
```

**CI/CD Time:** ~1-3 seconds  
**Configuration Files:** 1 file (pyproject.toml)  
**Dependencies:** 1 package  

---

## 🚀 Migration Plan

### **Phase 1: Parallel Running (Week 1-2)**

**Goal:** Test Ruff alongside existing tools

1. **Install Ruff:**
   ```bash
   pip install ruff
   ```

2. **Run Ruff (non-blocking):**
   ```bash
   ruff check .
   ruff format --check .
   ```

3. **Compare results** with Black/Flake8
4. **Adjust configuration** in `pyproject.toml`

### **Phase 2: Gradual Adoption (Week 3-4)**

**Goal:** Use Ruff for new code

1. **Update pre-commit hooks** (if using)
2. **Run Ruff on new PRs** (GitHub Actions)
3. **Keep Black/Flake8** for existing code
4. **Fix Ruff issues** in new code only

### **Phase 3: Full Migration (Week 5-6)**

**Goal:** Replace all legacy tools

1. **Run Ruff auto-fix** on entire codebase:
   ```bash
   ruff check --fix .
   ruff format .
   ```

2. **Remove legacy tools:**
   ```bash
   # Remove from dev-requirements.txt
   # black>=23.7.0
   # flake8>=6.1.0
   ```

3. **Update CI/CD workflows**
4. **Update documentation**

---

## 📝 Configuration

### **pyproject.toml** (Already Created)

```toml
[tool.ruff]
line-length = 88
target-version = "py311"

[tool.ruff.lint]
select = [
    "E",   # pycodestyle errors
    "F",   # Pyflakes
    "W",   # pycodestyle warnings
    "I",   # isort
    "N",   # pep8-naming
    "UP",  # pyupgrade
    "S",   # flake8-bandit (security)
    "B",   # flake8-bugbear
    "C4",  # flake8-comprehensions
    "SIM", # flake8-simplify
]

[tool.ruff.format]
quote-style = "double"
indent-style = "space"
```

---

## 🔧 Usage

### **Local Development**

**Check for issues:**
```bash
ruff check .
```

**Auto-fix issues:**
```bash
ruff check --fix .
```

**Format code:**
```bash
ruff format .
```

**Check formatting only:**
```bash
ruff format --check .
```

### **Specific Directories**

```bash
ruff check mcp-hub/
ruff format sites/onelifetime-world/
```

### **Watch Mode (Development)**

```bash
ruff check --watch .
```

---

## 🎨 IDE Integration

### **VS Code**

Install extension: `charliermarsh.ruff`

**settings.json:**
```json
{
  "[python]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "charliermarsh.ruff",
    "editor.codeActionsOnSave": {
      "source.fixAll": true,
      "source.organizeImports": true
    }
  },
  "ruff.lint.args": ["--config=pyproject.toml"]
}
```

### **PyCharm**

1. Settings → Tools → External Tools
2. Add Ruff as external tool
3. Configure file watcher

---

## 📊 Performance Comparison

### **Current Setup (Black + Flake8)**

```bash
# Typical CI/CD run
black --check .           # ~15-20s
flake8 .                  # ~30-40s
Total: ~45-60s
```

### **With Ruff**

```bash
# Same checks with Ruff
ruff check .              # ~1-2s
ruff format --check .     # ~1s
Total: ~2-3s
```

**Speedup:** **15-30x faster!** ⚡

---

## 🔒 Security Benefits

### **Ruff Includes flake8-bandit (S rules)**

```python
# Ruff will catch these security issues:

# S101: Use of assert
assert user.is_admin  # ❌ Ruff warns

# S608: SQL injection risk
cursor.execute(f"SELECT * FROM users WHERE id={user_id}")  # ❌ Ruff warns

# S605: Shell injection risk
os.system(f"rm -rf {user_input}")  # ❌ Ruff warns
```

**Benefit:** Can potentially replace `bandit` entirely!

---

## 📋 Migration Checklist

### **Pre-Migration**
- [ ] Review current Black/Flake8 configuration
- [ ] Install Ruff: `pip install ruff`
- [ ] Create `pyproject.toml` with Ruff config
- [ ] Test Ruff on sample files
- [ ] Compare Ruff vs. Black/Flake8 results

### **Migration**
- [ ] Add Ruff to `dev-requirements.txt`
- [ ] Create `.github/workflows/ruff.yml`
- [ ] Run Ruff in parallel with existing tools (1 week)
- [ ] Fix Ruff issues in new code only
- [ ] Run `ruff check --fix .` on entire codebase
- [ ] Run `ruff format .` on entire codebase
- [ ] Verify all tests pass

### **Post-Migration**
- [ ] Remove Black from `dev-requirements.txt`
- [ ] Remove Flake8 from `dev-requirements.txt`
- [ ] Update CI/CD workflows (remove Black/Flake8)
- [ ] Update `REQUIREMENTS_MANAGEMENT.md`
- [ ] Update IDE configurations
- [ ] Update developer documentation
- [ ] Announce to team

---

## 🆘 Troubleshooting

### **Issue: Too many warnings**

**Solution:** Adjust `pyproject.toml`:
```toml
[tool.ruff.lint]
ignore = [
    "E501",  # Line too long
    "S101",  # Use of assert
]
```

### **Issue: Ruff format differs from Black**

**Solution:** Ruff is Black-compatible by default. If issues persist:
```bash
ruff format --config "format.quote-style='double'"
```

### **Issue: Import sorting differs from isort**

**Solution:** Configure isort compatibility:
```toml
[tool.ruff.lint.isort]
known-first-party = ["dws6", "firehorse", "mcp_hub"]
force-single-line = false
```

---

## 💰 Cost-Benefit Analysis

### **Costs**
- **Migration time:** 2-4 hours
- **Learning curve:** Minimal (similar to Black/Flake8)
- **Risk:** Low (can run in parallel first)

### **Benefits**
- **CI/CD speedup:** 15-30x faster
- **Developer productivity:** Instant feedback
- **Simplified tooling:** 4 tools → 1 tool
- **Better security:** Built-in security checks
- **Auto-fix:** Saves manual work

**ROI:** ✅ **Positive within first week**

---

## 🎯 Recommendation

### **✅ ADOPT RUFF - STRONGLY RECOMMENDED**

**Why:**
1. **Speed:** 15-30x faster CI/CD
2. **Simplicity:** Single tool, single config
3. **Security:** Built-in security checks
4. **Industry adoption:** Used by FastAPI, Pandas, Jupyter, Hugging Face, Microsoft, etc.
5. **Active development:** 44.9k GitHub stars, 768 contributors
6. **Zero risk:** Can run in parallel first

**When:**
- **Start:** This week (parallel running)
- **Full migration:** Within 2-4 weeks

**Who:**
- **Champion:** DevOps/Lead Developer
- **Stakeholders:** All Python developers

---

## 📚 Resources

- **Ruff Documentation:** https://docs.astral.sh/ruff
- **Ruff GitHub:** https://github.com/astral-sh/ruff
- **Ruff Playground:** https://play.ruff.rs/
- **Migration Guide:** https://docs.astral.sh/ruff/formatter/#migrating-from-black

---

## 📞 Support

**Questions?** Ask in:
- Team Slack: #dev-tools
- GitHub Discussions: dws6 repo
- Ruff Discord: https://discord.gg/astral-sh

---

**Status:** 📋 Awaiting Approval  
**Next Step:** Review and approve migration plan  
**Timeline:** 2-4 weeks for full migration

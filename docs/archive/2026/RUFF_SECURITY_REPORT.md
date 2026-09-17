# 🔒 Ruff Security Scan Report

**Date:** 03.01.2026  
**Scanner:** Ruff 0.14.10  
**Total Security Issues:** 18  

---

## 🚨 HIGH SEVERITY (5 issues)

### 1. S608: SQL Injection Risk (3 occurrences)
**File:** `src/database/secure_query_builder.py`  
**Lines:** 205, 213, 221  
**Risk:** SQL injection through string-based query construction  

**Issue:**
```python
# Line 205, 213, 221
query = f"SELECT * FROM {table} WHERE {condition}"  # ❌ Vulnerable
```

**Fix:**
```python
# Use parameterized queries
query = "SELECT * FROM %s WHERE %s"
cursor.execute(query, (table, condition))

# Or use SQLAlchemy
from sqlalchemy import text
query = text("SELECT * FROM :table WHERE :condition")
session.execute(query, {"table": table, "condition": condition})
```

**Action:** ⚠️ **CRITICAL - Fix immediately**

---

### 2. S105: Hardcoded Password (1 occurrence)
**File:** `src/mcp/oauth_dcr.py`  
**Line:** 49  
**Risk:** Possible hardcoded password  

**Issue:**
```python
# Line 49
token_type = "Bearer"  # ❌ Flagged as potential password
```

**Analysis:** This is a **FALSE POSITIVE**. `"Bearer"` is a standard OAuth token type, not a password.

**Fix:**
```python
# Add Ruff ignore comment
TOKEN_TYPE = "Bearer"  # noqa: S105 - OAuth token type, not a password
```

**Action:** ✅ **Low priority - False positive**

---

### 3. S307: Suspicious eval() Usage (1 occurrence)
**File:** `Firehorse/report_engine.py`  
**Line:** 374  
**Risk:** Code injection vulnerability  

**Issue:**
```python
# Line 374
result = eval(expression)  # ❌ Dangerous
```

**Fix:**
```python
# Use ast.literal_eval for safe evaluation
import ast
result = ast.literal_eval(expression)  # ✅ Safe for literals only

# Or use a safe expression parser
from simpleeval import simple_eval
result = simple_eval(expression)  # ✅ Safe for expressions
```

**Action:** ⚠️ **HIGH - Fix immediately**

---

## 🟡 MEDIUM SEVERITY (11 issues)

### 4. S607: Partial Path in Subprocess (5 occurrences)

**Files & Lines:**
- `docs/presentations/audio.py`: 45, 61
- `scripts/scan_critical_bugs.py`: 275
- `scripts/security_audit.py`: 29, 32

**Risk:** Command injection via PATH manipulation  

**Issue:**
```python
# Using partial paths
subprocess.run(["ffmpeg", "-i", input_file])  # ❌ Vulnerable
subprocess.run(["git", "status"])  # ❌ Vulnerable
```

**Fix:**
```python
import shutil

# Use absolute paths
ffmpeg_path = shutil.which("ffmpeg") or "/usr/bin/ffmpeg"
subprocess.run([ffmpeg_path, "-i", input_file])  # ✅ Safe

# Or for git
git_path = shutil.which("git") or "/usr/bin/git"
subprocess.run([git_path, "status"])  # ✅ Safe
```

**Action:** 🟡 **Medium priority - Fix when convenient**

---

### 5. S104: Bind All Interfaces (2 occurrences)

**Files & Lines:**
- `mcp-hub/server.py`: 353
- `mcp-servers/supabase/server.py`: 282

**Risk:** Service exposed on all network interfaces  

**Issue:**
```python
# Line 353, 282
app.run(host="0.0.0.0", port=8765)  # ❌ Binds to all interfaces
```

**Fix:**
```python
# Bind to localhost only (development)
app.run(host="127.0.0.1", port=8765)  # ✅ Safe for dev

# Or use environment variable (production)
host = os.getenv("MCP_HOST", "127.0.0.1")
app.run(host=host, port=8765)  # ✅ Configurable
```

**Action:** 🟡 **Medium priority - Review deployment context**

---

### 6. S318/S314: XML Parsing Vulnerabilities (2 occurrences)

**Files & Lines:**
- `scripts/build_store.py`: 406
- `scripts/import_wordpress.py`: 47

**Risk:** XML External Entity (XXE) attacks  

**Issue:**
```python
# Using standard xml library
import xml.etree.ElementTree as ET
tree = ET.parse(xml_file)  # ❌ Vulnerable to XXE
```

**Fix:**
```python
# Use defusedxml
from defusedxml.ElementTree import parse
tree = parse(xml_file)  # ✅ Safe from XXE

# Add to requirements.txt
# defusedxml>=0.7.1
```

**Action:** 🟡 **Medium priority - Add defusedxml**

---

### 7. S110: Try-Except-Pass (2 occurrences)

**Files & Lines:**
- `scripts/create_security_issues.py`: 299
- `zen_free.py`: 320

**Risk:** Silent error suppression  

**Issue:**
```python
try:
    risky_operation()
except Exception:
    pass  # ❌ Silently ignores errors
```

**Fix:**
```python
import logging

try:
    risky_operation()
except Exception as e:
    logging.warning(f"Operation failed: {e}")  # ✅ Log the error
    # Or re-raise if critical
```

**Action:** 🟡 **Low priority - Add logging**

---

## 🔧 SYNTAX ERRORS (2 issues)

### 8. Invalid F-String Syntax (2 occurrences)

**File:** `scripts/import_wordpress.py`  
**Lines:** 120 (2 errors)  
**Issue:** Backslash in f-string (Python 3.11 incompatible)  

**Issue:**
```python
# Line 120
f"Path: {path\with\backslash}"  # ❌ Invalid in Python 3.11
```

**Fix:**
```python
# Option 1: Use raw string
path_str = r"{path\with\backslash}"
f"Path: {path_str}"  # ✅ Works

# Option 2: Escape properly
f"Path: {path.replace(chr(92), '/')}"  # ✅ Works
```

**Action:** ⚠️ **HIGH - Fix immediately (breaks on Python 3.11)**

---

## 📊 Summary by Severity

| Severity | Count | Action Required |
|----------|-------|-----------------|
| 🔴 Critical | 4 | Immediate fix |
| 🟡 Medium | 11 | Fix when convenient |
| 🔵 Low | 1 | False positive |
| ⚠️ Syntax | 2 | Immediate fix |
| **Total** | **18** | |

---

## 🎯 Priority Action Plan

### **Immediate (Today)**

1. **Fix SQL Injection (S608)**
   - File: `src/database/secure_query_builder.py`
   - Lines: 205, 213, 221
   - Use parameterized queries

2. **Fix eval() Usage (S307)**
   - File: `Firehorse/report_engine.py`
   - Line: 374
   - Replace with `ast.literal_eval`

3. **Fix F-String Syntax Errors**
   - File: `scripts/import_wordpress.py`
   - Line: 120
   - Remove backslashes from f-strings

### **This Week**

4. **Add defusedxml**
   ```bash
   pip install defusedxml
   ```
   - Update `scripts/build_store.py`: 406
   - Update `scripts/import_wordpress.py`: 47

5. **Fix Bind All Interfaces (S104)**
   - Review deployment context
   - Use `127.0.0.1` for development
   - Use environment variable for production

### **Next 2 Weeks**

6. **Fix Subprocess Paths (S607)**
   - Use `shutil.which()` for absolute paths
   - 5 occurrences across 3 files

7. **Add Error Logging (S110)**
   - Replace `try-except-pass` with logging
   - 2 occurrences

8. **Fix False Positive (S105)**
   - Add `# noqa: S105` comment
   - 1 occurrence

---

## 🔧 Quick Fixes

### Install Security Dependencies

```bash
pip install defusedxml simpleeval
```

### Update requirements.txt

```txt
defusedxml>=0.7.1  # XML parsing security
simpleeval>=0.9.13  # Safe expression evaluation
```

---

## 📝 Ruff Configuration Updates

Add to `pyproject.toml`:

```toml
[tool.ruff.lint.per-file-ignores]
# OAuth token type, not a password
"src/mcp/oauth_dcr.py" = ["S105"]

# Development servers can bind to 0.0.0.0
"mcp-hub/server.py" = ["S104"]
"mcp-servers/supabase/server.py" = ["S104"]
```

---

## 🆘 Need Help?

**SQL Injection:**
- https://docs.python.org/3/library/sqlite3.html#sqlite3-placeholders
- https://docs.sqlalchemy.org/en/20/core/tutorial.html#using-textual-sql

**XML Security:**
- https://github.com/tiran/defusedxml

**Subprocess Security:**
- https://docs.python.org/3/library/shutil.html#shutil.which

---

## ✅ Verification

After fixes, run:

```bash
# Security scan
python -m ruff check --select S .

# Should show 0 high-severity issues
```

---

**Status:** 🔴 **4 Critical Issues - Action Required**  
**Next Review:** After fixes applied  
**Estimated Fix Time:** 2-4 hours

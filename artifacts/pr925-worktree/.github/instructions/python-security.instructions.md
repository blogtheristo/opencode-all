---
applyTo: "Firehorse/**/*.py,workflow/**/*.py,scripts/**/*.py"
---

# Python Code Security Instructions

## Formula Evaluation (CRITICAL)

**ALWAYS use simpleeval for mathematical formula evaluation:**

```python
from simpleeval import simple_eval

# ✅ CORRECT - Safe evaluation
result = simple_eval(user_formula, names=allowed_variables)  # nosec

# ❌ WRONG - Security vulnerability
result = eval(user_formula)              # NEVER DO THIS
result = ast.literal_eval(user_formula)  # NOT SAFE for formulas
```

**Why `# nosec` is used:** The `simple_eval()` function name contains "eval" which triggers Bandit warnings, but it's a security-hardened library specifically designed for safe evaluation.

## Input Sanitization

**ALWAYS validate and sanitize user inputs:**

```python
from html import escape

# For HTML output
safe_output = escape(user_input)

# For SQL queries (use parameterized queries)
cursor.execute("SELECT * FROM users WHERE email = %s", (email,))  # ✅ Safe
cursor.execute(f"SELECT * FROM users WHERE email = '{email}'")    # ❌ SQL Injection
```

## Security Scanning

**Before committing Python code:**

```bash
# 1. Run Bandit security scanner
bandit -r Firehorse/ workflow/ scripts/

# 2. Check dependencies for vulnerabilities
safety check

# 3. Lint with Ruff
ruff check .

# 4. Format code
ruff format .
```

## Common Security Pitfalls

### Issue: Bandit flags simple_eval() as dangerous
**Cause:** Function name contains "eval"  
**Fix:** Add `# nosec` comment ONLY if you've verified it's simpleeval library  
**Example:** See `Firehorse/report_engine.py:409`

### Issue: User-provided file paths
**Risk:** Path traversal attacks  
**Fix:** Use `pathlib` and validate against allowed directories:

```python
from pathlib import Path

def safe_file_access(user_path: str, base_dir: Path) -> Path:
    full_path = (base_dir / user_path).resolve()
    if not full_path.is_relative_to(base_dir):
        raise ValueError("Path traversal attempt detected")
    return full_path
```

## Type Hints (Required)

**All Python functions must have type hints:**

```python
def calculate_emissions(
    material: str,
    quantity: float,
    factors: dict[str, float]
) -> float:
    """Calculate total emissions for a material."""
    return quantity * factors.get(material, 0.0)
```

This is enforced by mypy in `pyproject.toml`.

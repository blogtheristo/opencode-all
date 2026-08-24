# 🤖 ARGUS CODE REVIEW - QUICK SETUP

## What You Need

1. **OPENAI_API_KEY** - For AI code review
2. **GITHUB_TOKEN** - Already available (automatic)

---

## Step 1: Get OpenAI API Key

1. Go to: https://platform.openai.com/api-keys
2. Click: **Create new secret key**
3. Copy the key (format: `sk-...`)

---

## Step 2: Add to GitHub Secrets

1. Go to: https://github.com/blogtheristo/dws6/settings/secrets/actions
2. Click: **New repository secret**
3. Name: `OPENAI_API_KEY`
4. Value: Paste your OpenAI API key
5. Click: **Add secret**

---

## Step 3: Verify Workflow File

✅ Already created: `.github/workflows/argus-code-review.yml`

Triggers on:
- Pull request opened
- Pull request updated (new commits)
- Pull request reopened

---

## Step 4: Test It

1. Create a PR to `main` branch
2. Argus automatically runs
3. Review comment appears in PR

---

## Configuration Options

**In `.github/workflows/argus-code-review.yml`:**

```yaml
review_type: "comprehensive"  # Change to: security, performance
language: "english"           # Change to: other languages
max_files: 20                # Increase/decrease based on needs
```

---

## What Argus Reviews

✅ Code quality  
✅ Security issues  
✅ Performance problems  
✅ Best practices  
✅ Naming conventions  

---

## Status

✅ Workflow created: `.github/workflows/argus-code-review.yml`  
⏳ Pending: Add OPENAI_API_KEY secret  
✅ Ready for first PR!

# Monthly Careers Review Automation - Setup Guide
## GitHub Actions Workflow for onelifetime.world

---

## 📋 Overview

This automated workflow creates a monthly review process for your careers page, asking Risto to review:
- Should we update the careers page?
- Current hiring situation
- Role status updates (filled/open/on-hold)
- Legal & compliance updates
- Marketing & messaging updates

**Schedule**: Runs automatically on the 23rd of every month at 9:00 AM Helsinki time (giving one week before month-end).

**Process Flow**:
```
Day 23 of month → Workflow creates GitHub Issue
                ↓
GitHub assigns issue to @ristopaarni
                ↓
Email/Slack notification sent (optional)
                ↓
Risto answers questions in issue
                ↓
Risto updates code locally
                ↓
Risto closes issue when done
                ↓
(Optional) Auto-comment with deployment reminder
```

---

## 🚀 Installation Steps

### Step 1: Add Workflow File (5 min)

```bash
# Navigate to your onelifetime.world repository
cd ~/projects/onelifetime-world

# Create GitHub Actions directory (if doesn't exist)
mkdir -p .github/workflows

# Copy the workflow file
cp /path/to/monthly-careers-review.yml .github/workflows/

# Or create it directly:
cat > .github/workflows/monthly-careers-review.yml << 'EOF'
[paste the workflow content here]
EOF

# Verify file exists
ls -la .github/workflows/monthly-careers-review.yml
```

### Step 2: Configure GitHub Repository Settings (3 min)

```bash
# Go to your GitHub repository:
# https://github.com/Lifetime-oy/onelifetime-world

# Settings → Actions → General → Workflow permissions
# ✓ Enable: Read and write permissions
# ✓ Enable: Allow GitHub Actions to create and approve pull requests

# Settings → Issues
# ✓ Enable: Issues (must be enabled)
```

### Step 3: Set Up Risto's GitHub Username (2 min)

The workflow assigns issues to `@ristopaarni`. Verify this is correct:

```bash
# If your GitHub username is different, update the workflow file:
# Line ~120: assignees: ['ristopaarni']  # Change to your GitHub username
```

### Step 4: Optional - Configure Email Notifications (5 min)

**If using SendGrid for email notifications**:

```bash
# Get your SendGrid API key from: https://sendgrid.com/
# Add it to GitHub repository secrets:

# GitHub repo → Settings → Secrets and variables → Actions → New repository secret
# Name: SENDGRID_API_KEY
# Value: [your SendGrid API key]

# Update "from" email in workflow (line ~230):
# from: 'noreply@lifetime.fi'  # Change to your verified SendGrid sender
```

**SendGrid Setup**:
1. Sign up: https://sendgrid.com/ (Free tier: 100 emails/day)
2. Create API key: Settings → API Keys → Create API Key
3. Verify sender: Settings → Sender Authentication → Verify email
4. Add API key to GitHub secrets (above)

### Step 5: Optional - Configure Slack Notifications (5 min)

**If using Slack for notifications**:

```bash
# Create Slack Incoming Webhook:
# 1. Go to: https://api.slack.com/apps
# 2. Create New App → From scratch
# 3. Name: "Careers Review Bot", Workspace: Your workspace
# 4. Features → Incoming Webhooks → Activate
# 5. Add New Webhook to Workspace → Select channel (e.g., #management)
# 6. Copy webhook URL

# Add to GitHub repository:
# Settings → Secrets and variables → Actions → New repository secret
# Name: SLACK_WEBHOOK_URL
# Value: [webhook URL from step 6]
```

### Step 6: Test the Workflow (5 min)

```bash
# First, commit and push the workflow file
git add .github/workflows/monthly-careers-review.yml
git commit -m "feat: add monthly careers review automation"
git push origin main

# Manual test (don't wait for scheduled run):
# 1. Go to: https://github.com/Lifetime-oy/onelifetime-world/actions
# 2. Click: "Monthly Careers Page Review & Update"
# 3. Click: "Run workflow" → "Run workflow" button
# 4. Wait ~30 seconds
# 5. Check: https://github.com/Lifetime-oy/onelifetime-world/issues
# 6. You should see a new issue: "📅 Monthly Careers Review - [Month Year]"
```

### Step 7: Verify Issue Creation (2 min)

After test run, check:
- [ ] Issue was created successfully
- [ ] Issue is assigned to you (@ristopaarni)
- [ ] Issue has correct labels (careers, monthly-review, risto-action-required)
- [ ] Issue content includes all 10 sections
- [ ] Email notification received (if configured)
- [ ] Slack notification received (if configured)

---

## 📅 How to Use the Workflow

### Automated Monthly Process

**Day 23 of Each Month (9:00 AM Helsinki time)**:
1. ✅ Workflow automatically runs
2. ✅ Creates GitHub issue with review questions
3. ✅ Assigns issue to you
4. ✅ Sends notifications (if configured)

**Your Action** (within 7 days):
1. 📝 Open the issue: https://github.com/Lifetime-oy/onelifetime-world/issues
2. 📋 Answer all 10 sections by checking boxes and filling in details
3. 💻 Make updates to code locally (if needed)
4. 🚀 Deploy via Git push (Cloudflare auto-deploys)
5. ✅ Close the issue when done

### Manual Trigger (Anytime)

You can also trigger the workflow manually:

```bash
# Via GitHub Web UI:
# 1. Go to: https://github.com/Lifetime-oy/onelifetime-world/actions
# 2. Click: "Monthly Careers Page Review & Update"
# 3. Click: "Run workflow" dropdown
# 4. Select branch: main
# 5. Click: "Run workflow" button

# Via GitHub CLI (if installed):
gh workflow run "Monthly Careers Page Review & Update" --repo Lifetime-oy/onelifetime-world
```

---

## 📊 Issue Template Sections

The automated issue includes 10 comprehensive sections:

### 1. Should We Update?
Simple yes/no checkbox with notes field

### 2. Current Hiring Situation
- Total headcount
- Target headcount
- Active recruitment status

### 3. Role Status Update
**Pre-configured roles**:
- Senior Full-Stack Developer (Next.js/TypeScript)
- Edge Computing Engineer (NVIDIA Jetson)
- AI/ML Engineer (LLM Integration)
- Sales Engineer (Climate Tech)
- Customer Success Manager

**For each role**:
- Status: Open / Filled / On Hold / Removed
- If filled: Name and start date
- Notes field

**Plus**: Section to add new roles

### 4. Legal & Compliance Updates
- Code of Conduct review
- GDPR/Employment law compliance
- Legal review scheduling

### 5. Marketing & Messaging Updates
- Company positioning changes
- Recent achievements to highlight
- Metrics updates
- Competitor landscape changes

### 6. Benefits & Compensation Updates
- Salary range competitiveness
- Benefits package updates

### 7. Technical Stack Updates
- Infrastructure changes
- New tools/platforms affecting job descriptions

### 8. Culture & Work Environment
- Remote work policy
- Office/workspace changes
- Team structure updates

### 9. Action Items
Checklist of concrete tasks based on answers

### 10. Deployment Checklist
Step-by-step deployment guide with bash commands

---

## 🔧 Customization Options

### Change Schedule

Edit the cron expression in the workflow file:

```yaml
on:
  schedule:
    # Current: 23rd of month at 9:00 AM Helsinki time
    - cron: '0 7 23 * *'
    
    # Examples:
    # First day of month, 9:00 AM: '0 7 1 * *'
    # Last Friday of month, 2:00 PM: '0 12 * * 5#4'
    # Every 2 weeks, Monday 10:00 AM: '0 8 * * 1/2'
```

**Cron Helper**: https://crontab.guru/

### Add More Roles

Edit the workflow file around line ~85:

```javascript
#### Engineering Roles
- [ ] **Senior Full-Stack Developer** (Next.js/TypeScript)
  - Status: [Open / Filled / On Hold / Removed]
  
// Add new roles here:
- [ ] **Your New Role Title**
  - Status: [Open / Filled / On Hold / Removed]
  - If filled: Name/Start date: ___
  - Notes: ___
```

### Change Assignee

If someone else should receive the issues:

```javascript
// Line ~120:
assignees: ['ristopaarni']  // Change to GitHub username(s)

// Multiple assignees:
assignees: ['ristopaarni', 'other-teammate']
```

### Customize Notification Messages

**Slack notification** (line ~145-180):
- Edit the message text
- Change emojis
- Modify button text/URL

**Email notification** (line ~195-230):
- Edit subject line
- Customize HTML template
- Change sender name/email

### Add Custom Labels

```javascript
// Line ~118:
labels: ['careers', 'monthly-review', 'risto-action-required'],

// Add more labels:
labels: ['careers', 'monthly-review', 'risto-action-required', 'high-priority'],
```

---

## 📁 File Structure

After setup, your repository should have:

```
onelifetime-world/
├── .github/
│   ├── workflows/
│   │   ├── monthly-careers-review.yml  ← New workflow
│   │   └── [other workflows]
│   └── archives/                        ← Auto-created by workflow
│       └── reviews.log                  ← Review history
├── app/
│   └── careers/
│       ├── page.tsx
│       └── components/
│           └── CodeOfConductCarousel.tsx
├── public/
│   └── documents/
│       └── code-of-conduct.pdf
└── [other files]
```

---

## 🔍 Monitoring & Troubleshooting

### Check Workflow Status

```bash
# Via GitHub Web:
# https://github.com/Lifetime-oy/onelifetime-world/actions

# Via GitHub CLI:
gh run list --repo Lifetime-oy/onelifetime-world --workflow "Monthly Careers Page Review & Update"
```

### Common Issues

#### Issue 1: Workflow Not Running

**Symptoms**: Scheduled run doesn't create issue

**Solutions**:
```bash
# 1. Check workflow is enabled
# GitHub repo → Actions → Workflows → "Monthly Careers Page Review & Update"
# Should show: "Active workflow" (not disabled)

# 2. Verify cron schedule is correct
# Use: https://crontab.guru/ to validate cron expression

# 3. Check repository activity
# GitHub may disable scheduled workflows if repo has no activity for 60 days
# Solution: Make a commit or manually trigger workflow once
```

#### Issue 2: Issue Not Created

**Symptoms**: Workflow runs but no issue appears

**Check logs**:
```bash
# 1. Go to: https://github.com/Lifetime-oy/onelifetime-world/actions
# 2. Click on latest workflow run
# 3. Click on "Create Monthly Review Issue" job
# 4. Look for error messages

# Common errors:
# - Permissions issue: Check Step 2 (Repository settings)
# - API rate limit: Wait 1 hour and try again
```

#### Issue 3: Notifications Not Sending

**Email not received**:
```bash
# 1. Verify SENDGRID_API_KEY secret is set
# GitHub repo → Settings → Secrets → SENDGRID_API_KEY

# 2. Check SendGrid sender is verified
# https://sendgrid.com/ → Settings → Sender Authentication

# 3. Check spam folder
# SendGrid emails might be flagged as spam initially

# 4. Check workflow logs for email sending errors
```

**Slack not received**:
```bash
# 1. Verify SLACK_WEBHOOK_URL secret is set
# 2. Test webhook manually:
curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"Test message"}' \
  YOUR_WEBHOOK_URL

# 3. Check webhook is active in Slack app settings
```

#### Issue 4: Wrong Timezone

**Symptoms**: Workflow runs at unexpected time

**Solution**:
```yaml
# The cron is in UTC. Convert your desired time:
# Helsinki (EET/EEST) = UTC+2 / UTC+3

# 9:00 AM Helsinki in winter (EET = UTC+2):
- cron: '0 7 * * *'  # 7:00 UTC = 9:00 EET

# 9:00 AM Helsinki in summer (EEST = UTC+3):
- cron: '0 6 * * *'  # 6:00 UTC = 9:00 EEST

# To avoid DST issues, pick one and accept 1-hour variation
```

---

## 💰 Cost Analysis

### GitHub Actions Usage

**Free tier** (included in all GitHub plans):
- 2,000 minutes/month for private repos
- Unlimited minutes for public repos

**This workflow usage**:
- ~2 minutes per monthly run
- Annual usage: 2 min × 12 months = 24 minutes
- **Cost**: €0 (well within free tier)

### Optional Service Costs

**SendGrid** (email notifications):
- Free tier: 100 emails/day
- This workflow: 1 email/month
- **Cost**: €0 (free tier sufficient)

**Slack** (notifications):
- Free tier: Unlimited messages
- **Cost**: €0

**Total Monthly Cost**: €0 ✅

---

## 📈 Benefits & ROI

### Time Savings

**Without automation**:
- Remember to review: 15 min/month
- Gather information: 30 min/month
- Document decisions: 15 min/month
- **Total**: 60 min/month = 12 hours/year

**With automation**:
- Review issue: 20 min/month
- Make updates: 15 min/month
- **Total**: 35 min/month = 7 hours/year

**Time saved**: 5 hours/year × €95/hour = **€475/year**

### Quality Improvements

✅ **Never forget** monthly reviews  
✅ **Consistent** review process  
✅ **Documented** decision history  
✅ **Trackable** via GitHub issues  
✅ **Auditable** for compliance  

### Compliance Benefits

- Regular legal/GDPR review reminders
- Documented review trail
- Quarterly review scheduling
- Annual compliance tracking

**Value**: Reduced legal risk, audit-ready documentation

---

## 🔄 Integration with Code of Conduct Update Process

The workflow integrates with your Code of Conduct carousel:

**When Code of Conduct needs updating**:
1. ✅ Monthly review issue flags it (Section 4)
2. 📝 You update `code-of-conduct.md` locally
3. 🔄 Regenerate carousel content if needed
4. 🧪 Test locally with `npm run dev`
5. 🚀 Deploy via Git push (Cloudflare auto-deploys)
6. ✅ Close issue when live

**Quarterly reminders** automatically included in the issue template for legal review scheduling.

---

## 📚 Additional Resources

**GitHub Actions Documentation**:
- Workflow syntax: https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions
- Scheduling: https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule
- Secrets: https://docs.github.com/en/actions/security-guides/encrypted-secrets

**Cron Expression Help**:
- Crontab Guru: https://crontab.guru/
- Examples: https://crontab.guru/examples.html

**Notification Services**:
- SendGrid: https://sendgrid.com/docs/
- Slack Incoming Webhooks: https://api.slack.com/messaging/webhooks

---

## 🎯 Next Steps

### Immediate (Today):
1. [ ] Install workflow file (Step 1)
2. [ ] Configure repository settings (Step 2)
3. [ ] Test workflow manually (Step 6)
4. [ ] Verify issue creation (Step 7)

### Optional (This Week):
5. [ ] Set up email notifications (Step 4)
6. [ ] Set up Slack notifications (Step 5)
7. [ ] Customize issue template (Customization section)

### Ongoing:
8. [ ] Respond to monthly review issues (within 7 days)
9. [ ] Archive completed reviews
10. [ ] Refine process based on experience

---

## 📞 Support

**Workflow Issues**:
- Check troubleshooting section above
- GitHub Actions status: https://www.githubstatus.com/
- Community forum: https://github.community/

**Integration Questions**:
- CEO: risto@lifetime.fi
- GitHub Enterprise: https://github.com/enterprises/Lifetime-oy

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-12-18 | Initial release |

---

**Total Setup Time**: ~25 minutes  
**Ongoing Maintenance**: ~35 minutes/month  
**Annual Time Savings**: 5 hours  
**Annual Cost Savings**: €475  
**ROI**: Immediate (first month)  

The workflow is production-ready and integrates seamlessly with your existing DWS6 Cloudflare deployment process! 🚀

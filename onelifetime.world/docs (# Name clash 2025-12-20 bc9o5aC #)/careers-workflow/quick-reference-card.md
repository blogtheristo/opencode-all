# Monthly Careers Review - Quick Reference Card
## onelifetime.world | Risto's Action Guide

---

## 🗓️ MONTHLY SCHEDULE

**Day 23 of Every Month (9:00 AM Helsinki Time)**:
```
GitHub Actions → Creates Review Issue → Assigns to @ristopaarni
       ↓
Email/Slack Notification Sent (if configured)
       ↓
⏰ YOU HAVE 7 DAYS TO COMPLETE REVIEW ⏰
```

---

## ✅ WHEN YOU RECEIVE THE NOTIFICATION

### Quick Actions (5 minutes):

1. **Open the issue**
   - Click link in email/Slack notification, OR
   - Visit: https://github.com/Lifetime-oy/onelifetime-world/issues
   - Look for: "📅 Monthly Careers Review - [Month]"

2. **Quick scan**
   - Read through all 10 sections
   - Mentally note what needs updating
   - Estimate time needed (usually 20-30 min)

3. **Schedule it**
   - Block 30-60 min in calendar
   - Do it within 7 days (before month-end)

---

## 📋 THE 10 SECTIONS (What to Answer)

### 1️⃣ Should we update? (1 min)
```
☐ Yes, we have updates
☐ No, everything is current
☐ Postpone to next month
```

### 2️⃣ Hiring Situation (3 min)
- Current headcount: ___
- Target headcount: ___
- Active recruitment: Yes/No

### 3️⃣ Role Status (10 min) ⭐ MOST IMPORTANT
For each role, mark:
```
Status: [Open / Filled / On Hold / Removed]
If filled: Name, Start date
Notes: Any context
```

**Pre-filled roles**:
- Senior Full-Stack Developer
- Edge Computing Engineer
- AI/ML Engineer
- Sales Engineer
- Customer Success Manager

### 4️⃣ Legal Updates (2 min)
- Code of Conduct changes needed?
- GDPR compliance OK?
- Legal review scheduled?

### 5️⃣ Marketing Updates (5 min)
- Company positioning changes?
- Recent achievements (customers, funding, etc.)
- Competitor landscape changes?
- Metrics to highlight?

### 6️⃣ Benefits & Compensation (2 min)
- Salary ranges competitive?
- Benefits package changes?

### 7️⃣ Tech Stack Updates (2 min)
- New tools/platforms to mention in job posts?

### 8️⃣ Culture & Work Environment (2 min)
- Remote work policy changes?
- Office/team structure updates?

### 9️⃣ Action Items (1 min)
Check boxes for tasks needed:
```
☐ Update Code of Conduct
☐ Update job descriptions
☐ Add new postings
☐ Remove filled positions
☐ Update company description
```

### 🔟 Deployment Checklist (at end)
Use this after making code changes

**Total Time**: 20-30 minutes

---

## 💻 IF UPDATES ARE NEEDED

### Quick Update Process (30 minutes):

```bash
# 1. NAVIGATE TO PROJECT
cd ~/projects/onelifetime-world

# 2. CREATE BRANCH
git checkout -b monthly-update-2024-12  # Use current month

# 3. MAKE UPDATES
# Edit files as needed:
# - app/careers/page.tsx (job descriptions, company info)
# - code-of-conduct.md (if legal updates needed)
# - public/documents/code-of-conduct.pdf (regenerate if needed)

# 4. TEST LOCALLY
npm run dev
# Visit: http://localhost:3000/careers
# Check everything looks good

# 5. BUILD
npm run build  # Must succeed

# 6. COMMIT & DEPLOY
git add .
git commit -m "feat(careers): monthly update - December 2024"
git push origin monthly-update-2024-12

# 7. MERGE TO MAIN
git checkout main
git merge monthly-update-2024-12
git push origin main

# ✅ Cloudflare auto-deploys in 2-3 minutes
```

---

## 🎯 COMMON SCENARIOS

### Scenario 1: No Updates Needed
```
Time: 5 minutes
Actions:
1. Open issue
2. Check "No, everything is current"
3. Verify all sections are still accurate
4. Close issue
Done! ✅
```

### Scenario 2: Just Hired Someone
```
Time: 15 minutes
Actions:
1. Open issue
2. Mark role as "Filled" in Section 3
3. Add name and start date
4. Update app/careers/page.tsx (remove that job post)
5. Test, commit, deploy
6. Close issue
```

### Scenario 3: New Achievement to Highlight
```
Time: 20 minutes
Actions:
1. Open issue
2. Add achievement in Section 5 (Marketing)
3. Update app/careers/page.tsx (add to company description)
4. Test, commit, deploy
5. Close issue
```

### Scenario 4: Code of Conduct Update
```
Time: 45 minutes
Actions:
1. Open issue
2. Note changes needed in Section 4
3. Update code-of-conduct.md
4. Regenerate carousel sections if major changes
5. Test, build, deploy
6. Close issue
7. Schedule legal review if needed
```

---

## 🚨 EMERGENCY: Urgent Update Needed

**Don't wait for monthly review!**

```bash
# Make update immediately:
cd ~/projects/onelifetime-world
git checkout -b urgent-careers-update

# Make your changes
# Test, build, deploy as usual

git add .
git commit -m "fix(careers): urgent update - [reason]"
git push origin urgent-careers-update
git checkout main && git merge urgent-careers-update && git push

# Create manual issue to document the change:
# https://github.com/Lifetime-oy/onelifetime-world/issues/new
# Title: "Emergency Careers Update - [Reason]"
# Label: careers, urgent
```

---

## 📊 TRACKING YOUR REVIEWS

### Review History

All reviews are tracked as GitHub issues:
```
https://github.com/Lifetime-oy/onelifetime-world/issues?q=label%3Amonthly-review
```

**Filter by**:
- Open reviews: `is:issue is:open label:monthly-review`
- Completed reviews: `is:issue is:closed label:monthly-review`
- This year's reviews: `is:issue label:monthly-review created:>2024-01-01`

### Metrics to Watch

**In Cloudflare Analytics**:
- Careers page views: https://dash.cloudflare.com/ → Analytics
- PDF downloads: Check `/documents/code-of-conduct.pdf` traffic

**In GitHub Issues**:
- How many roles filled per quarter?
- How often are updates needed?
- Average time to close review issues?

---

## 🔔 NOTIFICATION SETTINGS

### GitHub Notifications

**Via Web**:
- Always get notification when issue assigned to you
- Check: https://github.com/settings/notifications

**Via Email**:
- GitHub sends email when assigned
- Additional SendGrid email (if configured)

**Via Slack** (if configured):
- Message posted to configured channel
- @mention notification

### Adjust Notification Preferences

```
Don't want email notifications?
→ GitHub Settings → Notifications → Email preferences
→ Uncheck "Issues" but keep "Assigned"

Want SMS notifications?
→ Use Zapier or IFTTT to forward GitHub issue assignments to SMS
```

---

## 🎓 BEST PRACTICES

### ✅ DO:
- **Review within 7 days** (deadline provided in issue)
- **Be thorough** with role status updates (most important)
- **Document reasoning** in Notes fields
- **Test locally** before deploying updates
- **Close issue** when done (marks it complete)
- **Add comments** if you need to come back later

### ❌ DON'T:
- **Skip sections** - even if no changes, confirm "No changes"
- **Leave issue open indefinitely** - Close when done or no longer applicable
- **Rush deployment** - Always test locally first
- **Forget to commit** Code of Conduct PDF if you update .md

---

## 🆘 QUICK HELP

### Issue Not Created?
```bash
# Manually trigger workflow:
1. Go to: https://github.com/Lifetime-oy/onelifetime-world/actions
2. Click: "Monthly Careers Page Review & Update"
3. Click: "Run workflow"
```

### Can't Access Issue?
```bash
# Check if assigned to you:
https://github.com/issues/assigned

# Or search all issues:
https://github.com/Lifetime-oy/onelifetime-world/issues
```

### Deployment Failed?
```bash
# Check Cloudflare build logs:
1. Go to: https://dash.cloudflare.com/
2. Pages → onelifetime-world → Deployments
3. Click failed deployment → View build log
4. Fix errors shown, commit, push again
```

### Need to Change Schedule?
```bash
# Edit: .github/workflows/monthly-careers-review.yml
# Line ~5: Change cron expression
# Example: First Monday of month at 10am:
- cron: '0 8 1-7 * 1'
```

---

## 📞 CONTACTS

**Workflow Issues**: Check Actions tab or workflow logs  
**GitHub Support**: https://support.github.com/  
**Technical Issues**: risto@lifetime.fi (that's you! 😄)  

---

## 📅 CALENDAR INTEGRATION

### Add to Calendar

Create recurring calendar event:
- **Title**: "Monthly Careers Review Due"
- **Date**: 23rd of every month
- **Time**: 9:00 AM Helsinki time
- **Duration**: 1 hour
- **Reminder**: Day before (22nd) at 5:00 PM
- **Description**:
  ```
  Check GitHub for monthly careers review issue:
  https://github.com/Lifetime-oy/onelifetime-world/issues
  
  Allow 30-60 minutes to complete.
  Deadline: End of month (7 days from notification)
  ```

### Google Calendar Quick Add
```
Monthly Careers Review on the 23rd at 9am, 1 hour duration, remind me 1 day before
```

---

## 🎯 MONTHLY CHECKLIST (Print & Keep)

```
□ Received notification (GitHub/Email/Slack)
□ Opened review issue within 24 hours
□ Scheduled time to complete (within 7 days)
□ Answered all 10 sections thoroughly
□ Made necessary code updates (if any)
□ Tested locally: npm run dev ✓
□ Built successfully: npm run build ✓
□ Deployed: git push origin main ✓
□ Verified live: https://onelifetime.world/careers ✓
□ Closed GitHub issue ✓
□ (Optional) Logged metrics in separate tracking sheet
```

---

## 📊 SAMPLE TIMELINE

**Example: December 2024 Review**

| Date | Action | Time |
|------|--------|------|
| Dec 23, 9:00 AM | 🤖 Workflow creates issue | Auto |
| Dec 23, 9:01 AM | 📧 Notification sent | Auto |
| Dec 23, 2:00 PM | 👁️ Risto opens issue, quick scan | 5 min |
| Dec 24, 10:00 AM | ✍️ Risto completes review form | 25 min |
| Dec 24, 11:00 AM | 💻 Risto makes code updates | 30 min |
| Dec 24, 11:30 AM | 🧪 Local testing | 10 min |
| Dec 24, 11:40 AM | 🚀 Deploy (git push) | 5 min |
| Dec 24, 11:43 AM | ✅ Live on onelifetime.world | Auto |
| Dec 24, 11:45 AM | ✓ Risto closes issue | 1 min |
| **Total** | **Active time** | **~75 min** |

---

## 💡 PRO TIPS

1. **Batch similar updates**: If multiple roles are filled, update them all at once
2. **Use draft mode**: Add comments to issue as you work, close when final
3. **Link to docs**: Reference Notion/Confluence docs in issue for context
4. **Screenshot metrics**: Add Cloudflare Analytics screenshots to issue
5. **Archive reviews**: Save closed issues as PDFs for audit trail
6. **Set annual reminders**: Some items (legal review) are quarterly/annual
7. **Template responses**: Save common answers (e.g., "GDPR compliant, no changes")
8. **Mobile-friendly**: GitHub issues work on mobile if you need to respond on-the-go

---

## 🎉 YOU'RE READY!

This workflow will:
- ✅ Never let you forget monthly reviews
- ✅ Provide structured process
- ✅ Track all decisions
- ✅ Integrate with deployment
- ✅ Save time and reduce errors

**Just respond to the monthly issue when it appears, and you're golden!** 🌟

---

**Quick Access Links**:
- 🔗 Issues: https://github.com/Lifetime-oy/onelifetime-world/issues
- 🔗 Actions: https://github.com/Lifetime-oy/onelifetime-world/actions
- 🔗 Careers Page: https://onelifetime.world/careers
- 🔗 Cloudflare: https://dash.cloudflare.com/

**Print this page and keep it handy!** 📄

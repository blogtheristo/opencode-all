# Human-in-Loop (HIL) Email System

**Problem**: Templates don't work. Reading workflows doesn't lead to action.

**Solution**: One-command tools that generate ready-to-send emails.

---

## 🚀 THREE WAYS TO SEND 5 EMAILS TODAY

### Option 1: Browser (Easiest - No coding)

```bash
# Just open this file in your browser:
open send-emails-today.html
```

Then:
1. Click "GENERATE TODAY'S 5 EMAILS"
2. Click "Copy All" for each email
3. Paste into Gmail and send

**Time**: 10 minutes total

---

### Option 2: Command Line (Python)

```bash
# Run this one command:
python3 generate-5-emails-today.py
```

Outputs 5 ready-to-send emails in `emails-today/` folder.

Then copy-paste each email into Gmail.

**Time**: 12 minutes total

---

### Option 3: Shell Script (Mac/Linux)

```bash
# Make executable first time:
chmod +x SEND-5-EMAILS-TODAY.sh

# Then just run:
./SEND-5-EMAILS-TODAY.sh
```

Generates 5 emails, opens instructions.

**Time**: 10 minutes total

---

## ⚡ Why This Works (HIL Principles)

### Traditional Templates = 0 Action
```
Read template (5 min)
→ Find investors (15 min)
→ Customize each email (10 min × 5 = 50 min)
→ Send 5 emails
= 70 minutes total
= Too much friction
= Result: 0 emails sent
```

### HIL System = 5 Emails Sent
```
Run one command (1 min)
→ Copy-paste 5 times (2 min × 5 = 10 min)
→ Send 5 emails
= 11 minutes total
= Minimal friction
= Result: 5 emails sent ✅
```

---

## 📋 Setup (One-Time, 5 Minutes)

### 1. Update Investor List

Edit `contacts-angel-investors.csv` with real investors:

```csv
Name,Email,Focus Area,Contact Status
Chris Neuman,chris@example.com,Climate tech,not contacted
Simon Mantkelow,simon@example.com,Construction,not contacted
```

### 2. Update Your Details

**In HTML** (`send-emails-today.html`):
- Open file, fill in Quick Settings form:
  - Your Name
  - Your Email
  - Calendly Link

**In Python** (`generate-5-emails-today.py`):
- Edit lines 19-22:
  ```python
  CALENDLY_LINK = "https://calendly.com/your-link"
  YOUR_NAME = "Your Name"
  YOUR_EMAIL = "your@email.com"
  YOUR_PHONE = "+358 ..."
  ```

---

## 🎯 Daily Workflow (10 Minutes)

### Morning (8:30-9:00am)

```bash
# Step 1: Generate emails (choose one method)
open send-emails-today.html
# OR
python3 generate-5-emails-today.py
# OR
./SEND-5-EMAILS-TODAY.sh

# Step 2: Send 5 emails (10 min)
# Copy-paste each into Gmail and send

# Step 3: Track
# Mark investors as "contacted" in CSV
```

### Result
- ✅ 5 emails sent
- ✅ Took 10 minutes
- ✅ No overthinking
- ✅ No analysis paralysis

---

## 📊 The Math

**Daily**: 5 emails
**Weekly**: 25 emails (5/day × 5 days)
**10 weeks**: 250 emails

**Expected results** (20% response rate):
- 250 emails sent
- 50 responses
- 25 calls scheduled
- 12 meetings completed
- 3-5 commits
- **€500K Seed round closed** ✅

---

## 🔧 Troubleshooting

### "Python not found"
Install Python 3: https://www.python.org/downloads/

### "CSV file not found"
Create `contacts-angel-investors.csv` with headers:
```
Name,Email,LinkedIn,Phone,Location,Focus Area,Contact Status
```

### "Emails are too generic"
Edit EMAIL_VARIANTS in the Python/HTML files to customize.

### "I want to add personalization"
The scripts automatically add 1 sentence based on investor Focus Area.
To add more, edit the `add_personalization()` function.

---

## 🎯 Key Principle: **Captain/Vineyard Focus**

**ONE GOAL: €500K Seed**

**Not**:
- ❌ €150K SAFE + €500K Seed (shows you can't close)
- ❌ Multiple fundraising tracks simultaneously
- ❌ "We're flexible on amount" (shows desperation)

**Captain stays focused on one destination.**
**Vineyard tends one harvest at a time.**

All email templates reflect: **€500K Seed, closing Q2 2026**

---

## 📁 Files

- `send-emails-today.html` - Browser interface (easiest)
- `generate-5-emails-today.py` - Python script (most flexible)
- `SEND-5-EMAILS-TODAY.sh` - Shell script (Mac/Linux)
- `contacts-angel-investors.csv` - Your investor list
- `emails-today/` - Output folder (generated emails)

---

## ✅ Success Checklist

- [ ] Updated contacts-angel-investors.csv with 25+ investors
- [ ] Updated your name, email, Calendly link in scripts
- [ ] Ran script once to test
- [ ] Sent first 5 emails (Day 1)
- [ ] Marked investors as "contacted" in CSV
- [ ] Scheduled to run script again tomorrow morning
- [ ] Committed to 5 emails/day for next 10 weeks

---

## 📞 What Happens After Sending

### Responses (20% = 1-2 per day)

When someone replies:
1. **Positive** ("Let's chat") → Send Calendly link immediately
2. **Neutral** ("Tell me more") → Reply with 2-sentence traction + Calendly
3. **Negative** ("Not interested") → Reply: "Thanks! If you know anyone who might be interested, I'd appreciate an intro."

### Follow-ups (Day 5)

For non-responders:
```
Subject: Re: [Original Subject]

Hi {Name},

Quick follow-up on DWS IQ 6. We're closing €500K Seed in Q2.

Still interested in a quick call?

Best,
Risto
```

### Meetings

When call is scheduled:
1. Send calendar invite
2. Send deck 24h before call: "Looking forward to our call tomorrow. Here's our deck: [link]"
3. After call: "Thanks for the call! Next steps: [specific action]"

---

## 🚀 Start Now

**Right now, this second:**

```bash
# Browser:
open send-emails-today.html

# OR Python:
python3 generate-5-emails-today.py

# OR Shell:
./SEND-5-EMAILS-TODAY.sh
```

Then **send 5 emails before 10am**.

That's it. Do it again tomorrow.

**That's how you close €500K.**

---

**Last Updated**: February 12, 2026
**Status**: ✅ ACTIVE - One goal (€500K Seed), captain/vineyard focus

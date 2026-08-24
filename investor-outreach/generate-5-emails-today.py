#!/usr/bin/env python3
"""
HUMAN-IN-LOOP EMAIL GENERATOR
One command. Five emails. Ready to send.

Usage:
    python generate-5-emails-today.py

Output:
    - 5 pre-written emails in ./emails-today/ folder
    - Each email is ready to copy-paste into Gmail
    - Includes personalization based on investor data
    - Takes 2 minutes to run, 10 minutes to send all 5
"""

import csv
import os
from datetime import datetime
from pathlib import Path

# Configuration
CONTACT_CSV = "contacts-angel-investors.csv"
OUTPUT_DIR = Path("emails-today")
CALENDLY_LINK = "https://calendly.com/risto-lifetime/investor-15min"  # UPDATE THIS
YOUR_NAME = "Risto Päärni"
YOUR_EMAIL = "risto@lifetime.fi"
YOUR_PHONE = "+358 400 319 010"
DEMO_LINK = "https://j6prmljgpvnia.ok.kimi.link/"

# Email variants (rotated to avoid spam filters)
# ONE GOAL: €500K Seed (captain/vineyard focus - no dual €150K/500K)
EMAIL_VARIANTS = [
    {
        "subject": "DWS IQ 6 – €500K Seed closing Q2",
        "body": """Hi {first_name},

I'm raising €500K Seed for DWS IQ 6 (edge AI for EU carbon compliance).

Traction:
• €7K MRR (Uber Finland, Bolt, Kela)
• 100% retention over 9 months
• Clear path to €281K profit in 12 months

15-min call to share pilot results? {calendly_link}

Best,
{your_name}
{your_email}
{your_phone}"""
    },
    {
        "subject": "Quick question – DWS IQ 6 Seed round",
        "body": """Hi {first_name},

Raising €500K Seed for DWS IQ 6 (climate AI platform).

€7K MRR, 100% retention, government + enterprise customers.

Quick 15-min call? {calendly_link}

Best,
{your_name}"""
    },
    {
        "subject": "DWS IQ 6 – Nordic climate AI raising €500K",
        "body": """Hi {first_name},

DWS IQ 6: Edge AI for EU carbon compliance (CSRD, Fit for 55).

Traction: €7K MRR, zero churn, 100% gross margin.

Raising €500K Seed. 15 min to walk through? {calendly_link}

Best,
{your_name}
{your_phone}"""
    },
    {
        "subject": "Climate AI platform – €500K Seed round",
        "body": """Hi {first_name},

€500K Seed for DWS IQ 6 (edge AI for Nordic construction carbon compliance).

€7K MRR, 6 paying customers, path to profitability validated.

Call this week? {calendly_link}

Best,
{your_name}"""
    }
]


def load_investors():
    """Load investors from CSV who haven't been contacted yet"""
    investors = []

    if not os.path.exists(CONTACT_CSV):
        print(f"❌ ERROR: {CONTACT_CSV} not found!")
        print("Create it with columns: Name, Email, LinkedIn, Phone, Location, Focus Area, Contact Status")
        return []

    with open(CONTACT_CSV, encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Skip if already contacted
            status = row.get('Contact Status', '').lower()
            if status in ['contacted', 'responded', 'meeting scheduled', 'committed']:
                continue

            # Skip if no email
            if not row.get('Email') or row['Email'].strip() == '':
                continue

            investors.append(row)

    return investors


def get_first_name(full_name):
    """Extract first name from full name"""
    if not full_name:
        return "there"

    # Remove titles
    name = full_name.replace('Dr.', '').replace('Mr.', '').replace('Ms.', '').replace('Prof.', '').strip()

    # Get first word
    parts = name.split()
    return parts[0] if parts else "there"


def add_personalization(investor):
    """Add 1 sentence of personalization if data available"""
    focus = investor.get('Focus Area', '').strip()
    portfolio = investor.get('Portfolio Companies', '').strip()

    personalization = ""

    if focus and 'climate' in focus.lower():
        personalization = f"\nI noticed your focus on {focus}. DWS IQ 6 tackles construction (40% of EU CO₂) with edge AI that delivers <100ms inference."
    elif focus and 'construction' in focus.lower():
        personalization = f"\nI saw your focus on {focus}. We're building edge AI for carbon compliance in Nordic construction."
    elif portfolio:
        # Take first portfolio company name
        first_company = portfolio.split(',')[0].strip()
        personalization = f"\nI saw your investment in {first_company}. DWS IQ 6 targets similar market with climate compliance angle."

    return personalization


def generate_email(investor, variant_index):
    """Generate a ready-to-send email for one investor"""
    first_name = get_first_name(investor.get('Name', ''))
    personalization = add_personalization(investor)

    # Select email variant (rotate through variants)
    variant = EMAIL_VARIANTS[variant_index % len(EMAIL_VARIANTS)]

    # Fill in template
    subject = variant['subject']
    body = variant['body'].format(
        first_name=first_name,
        calendly_link=CALENDLY_LINK,
        your_name=YOUR_NAME,
        your_email=YOUR_EMAIL,
        your_phone=YOUR_PHONE,
        demo_link=DEMO_LINK
    )

    # Add personalization if available (insert after greeting)
    if personalization:
        body = body.replace(f"Hi {first_name},", f"Hi {first_name},{personalization}")

    return {
        'to': investor.get('Email'),
        'subject': subject,
        'body': body,
        'investor_name': investor.get('Name'),
        'investor_focus': investor.get('Focus Area', 'N/A')
    }


def save_email(email, index):
    """Save email to file"""
    OUTPUT_DIR.mkdir(exist_ok=True)

    filename = OUTPUT_DIR / f"email-{index+1}-{email['to'].replace('@', '-at-')}.txt"

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(f"TO: {email['to']}\n")
        f.write(f"SUBJECT: {email['subject']}\n")
        f.write("\n" + "="*60 + "\n\n")
        f.write(email['body'])
        f.write("\n\n" + "="*60 + "\n")
        f.write(f"\nINVESTOR: {email['investor_name']}\n")
        f.write(f"FOCUS: {email['investor_focus']}\n")

    return filename


def print_email_preview(email, index):
    """Print email to terminal for quick review"""
    print(f"\n{'='*60}")
    print(f"EMAIL #{index+1}")
    print(f"{'='*60}")
    print(f"TO: {email['to']}")
    print(f"SUBJECT: {email['subject']}")
    print(f"\n{email['body']}")
    print(f"\n(Investor: {email['investor_name']} | Focus: {email['investor_focus']})")
    print(f"{'='*60}\n")


def main():
    print("="*60)
    print("GENERATING TODAY'S 5 EMAILS")
    print("="*60)
    print(f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print(f"From: {YOUR_EMAIL}")
    print(f"Calendly: {CALENDLY_LINK}")
    print()

    # Load investors
    print(f"Loading investors from {CONTACT_CSV}...")
    investors = load_investors()

    if len(investors) == 0:
        print("\n❌ No investors found!")
        print("\nPossible reasons:")
        print("1. CSV file doesn't exist")
        print("2. All investors already contacted")
        print("3. No email addresses in CSV")
        print("\nCreate contacts-angel-investors.csv with:")
        print("Name, Email, LinkedIn, Phone, Location, Focus Area, Contact Status")
        return

    print(f"✅ Found {len(investors)} investors not yet contacted")

    # Generate 5 emails
    num_emails = min(5, len(investors))
    print(f"\nGenerating {num_emails} emails...\n")

    emails = []
    for i in range(num_emails):
        email = generate_email(investors[i], i)
        emails.append(email)

        # Save to file
        filename = save_email(email, i)

        # Print preview
        print_email_preview(email, i)
        print(f"💾 Saved to: {filename}")

    # Summary
    print("\n" + "="*60)
    print("✅ DONE! 5 EMAILS GENERATED")
    print("="*60)
    print(f"\nEmails saved in: {OUTPUT_DIR}/")
    print()
    print("NEXT STEPS:")
    print("1. Open Gmail (gmail.com) or your email client")
    print("2. For each email file in emails-today/:")
    print("   - Copy the TO address")
    print("   - Copy the SUBJECT line")
    print("   - Copy the BODY")
    print("   - Paste into Gmail and send")
    print()
    print("TIME REQUIRED: 10 minutes to send all 5")
    print()
    print("After sending, update contacts-angel-investors.csv:")
    print("- Set 'Contact Status' to 'contacted'")
    print("- Set 'Last Contact Date' to today")
    print()
    print("Then run this script again tomorrow for 5 more emails!")
    print("="*60)


if __name__ == "__main__":
    main()

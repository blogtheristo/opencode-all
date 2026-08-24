#!/bin/bash
#
# ONE-COMMAND EMAIL GENERATOR
# No thinking. No decisions. Just run this.
#
# Usage: ./SEND-5-EMAILS-TODAY.sh
#

set -e

echo "════════════════════════════════════════════════════════════"
echo "  TODAY'S 5 INVESTOR EMAILS - HUMAN-IN-LOOP EDITION"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "Date: $(date '+%Y-%m-%d %H:%M')"
echo ""

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ ERROR: Python 3 not found"
    echo "Install Python: https://www.python.org/downloads/"
    exit 1
fi

# Check if contact CSV exists
if [ ! -f "contacts-angel-investors.csv" ]; then
    echo "❌ ERROR: contacts-angel-investors.csv not found"
    echo ""
    echo "Creating sample CSV file..."
    cat > contacts-angel-investors.csv << 'EOF'
Name,Email,LinkedIn,Phone,Location,Focus Area,Check Size (EUR),Angel Network,Portfolio Companies,Personalization Notes,Warm Intro Path,Contact Status,Last Contact Date,Next Action
Chris Neuman,chris.neuman@example.com,,,Helsinki,Urban tech / Emissions reduction,25000-100000,The Assembly,,,,,not contacted,,
Simon Mantkelow,simon@example.com,,,UK,Sustainability / Methane detection,25000-50000,Green Angel Syndicate,,,,,not contacted,,
Test Investor,test@example.com,,,Finland,Climate tech,10000-50000,,,,,LinkedIn connection,not contacted,,
EOF
    echo "✅ Created sample CSV with 3 test investors"
    echo "Edit contacts-angel-investors.csv and add real investor emails"
    echo ""
fi

# Run Python generator
echo "Generating emails..."
echo ""
python3 generate-5-emails-today.py

# Check if emails were generated
if [ -d "emails-today" ] && [ "$(ls -A emails-today)" ]; then
    echo ""
    echo "════════════════════════════════════════════════════════════"
    echo "  OPEN GMAIL AND SEND THESE 5 EMAILS NOW"
    echo "════════════════════════════════════════════════════════════"
    echo ""
    echo "Files ready in: emails-today/"
    echo ""
    echo "Quick copy-paste workflow:"
    echo "  1. Open https://gmail.com"
    echo "  2. Click 'Compose'"
    echo "  3. Copy-paste from email-1-*.txt"
    echo "  4. Send"
    echo "  5. Repeat for email-2, 3, 4, 5"
    echo ""
    echo "Time: 10 minutes total"
    echo ""
    echo "════════════════════════════════════════════════════════════"
else
    echo ""
    echo "⚠️  No emails generated (all investors already contacted?)"
    echo "Add more investors to contacts-angel-investors.csv"
fi

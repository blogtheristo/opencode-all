# DWS6 Weekly Reports

Automated weekly progress reports in **professional PDF format** with Lifetime Group branding.
Reports in both **English and Finnish**, automatically emailed and backed up to Google Drive.

## 📁 Folder Structure

```
Reports/
├── en/                      # English reports
│   ├── WEEKLY_REPORT.md       # Markdown source
│   └── WEEKLY_REPORT.pdf      # Professional PDF
├── fi/                      # Finnish reports (Suomi)
│   ├── WEEKLY_REPORT_FI.md    # Markdown source
│   └── WEEKLY_REPORT_FI.pdf   # Professional PDF
├── assets/                  # Branding assets
│   └── lifetime_logo.svg      # Lifetime Group logo
├── generate_pdf.py          # PDF generator with branding
├── send_weekly_report.py    # Email automation script
├── upload_to_drive.py       # Google Drive backup
├── requirements.txt         # Python dependencies
└── README.md                # This file
```

## 🎨 PDF Features

Professional reports formatted for **universities, investors, and media**:

✓ **Lifetime Group logo** in header (top-right corner)
✓ **Company details** in footer
✓ **Introduction sections** - Lifetime World mission, DWS IQ, report purpose
✓ **Professional styling** - Tables, code blocks, status indicators
✓ **Page numbers** - Automatic pagination
✓ **Bilingual support** - English and Finnish

## 📧 Email Automation

Reports are automatically emailed every **Monday at 10:00 Helsinki time** to:
- **Recipient:** risto.paarni2024@lifetime.fi
- **Format:** Professional PDF attachments (EN + FI)
- **Automation:** GitHub Actions workflow
- **Backup:** Copies uploaded to Google Drive

### Workflow Schedule

- **Automatic:** Every Monday 08:00 UTC (10:00 Helsinki)
- **Manual:** Can be triggered via GitHub Actions interface

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
cd Reports
pip install -r requirements.txt
```

Dependencies:
- `weasyprint` - PDF generation
- `markdown` - Markdown to HTML conversion
- `Pygments` - Code syntax highlighting
- `google-api-python-client` - Google Drive API
- `google-auth-*` - Authentication

### 2. Configure Email Secrets

Add these secrets to your GitHub repository:

1. Go to **Settings → Secrets and variables → Actions**
2. Add the following secrets:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `SMTP_SENDER` | Sender email address | `noreply@dws6.com` |
| `SMTP_PASSWORD` | Email account password | `your_app_password` |
| `SMTP_SERVER` | SMTP server (optional) | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port (optional) | `587` |

### 3. Gmail Setup (if using Gmail)

If using Gmail as SMTP server:

1. Enable **2-Factor Authentication** on your Google account
2. Generate an **App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "DWS6 Reports"
   - Copy the 16-character password
3. Use this password as `SMTP_PASSWORD` secret

### 4. Configure Google Drive (Optional)

For automatic backup to Google Drive:

1. **Create Service Account:**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing
   - Enable Google Drive API
   - Create Service Account → Download JSON credentials

2. **Share Drive Folder:**
   - Create a folder in Google Drive for reports
   - Share folder with service account email (e.g., `dws6-reports@project.iam.gserviceaccount.com`)
   - Copy folder ID from URL: `https://drive.google.com/drive/folders/FOLDER_ID`

3. **Add GitHub Secrets:**
   - `GOOGLE_APPLICATION_CREDENTIALS` - Paste entire JSON credentials file content
   - `GDRIVE_FOLDER_ID` - The folder ID from step 2

### 5. Test Locally

```bash
cd Reports

# Generate PDFs
python generate_pdf.py

# Set environment variables
export SMTP_SENDER="your-email@gmail.com"
export SMTP_PASSWORD="your-app-password"
export SMTP_SERVER="smtp.gmail.com"
export SMTP_PORT="587"

# Test email (dry run without SMTP_PASSWORD)
python send_weekly_report.py

# Upload to Google Drive (if configured)
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/credentials.json"
export GDRIVE_FOLDER_ID="your-folder-id"
python upload_to_drive.py
```

### 6. Manual Trigger (GitHub)

1. Go to **Actions** tab in GitHub
2. Select **Weekly Report Email Automation**
3. Click **Run workflow**
4. Click **Run workflow** button

## 📊 Report Contents

Each weekly report includes:

- **Executive Summary** - Key metrics and achievements
- **Major Achievements** - Completed deliverables
- **Technical Architecture** - Stack and infrastructure
- **Cost Analysis** - Budget and savings
- **Development Metrics** - Code statistics and commits
- **Strategic Decisions** - Key choices and rationale
- **Pending Tasks** - Next steps and priorities
- **Risk Assessment** - Current risks and mitigation
- **Team Contributions** - Individual accomplishments
- **KPI Dashboard** - Performance indicators

## 🗓️ Report Naming Convention

Reports are named with date stamps for versioning:

```
WEEKLY_REPORT_2025-12-03.md       # English Markdown
WEEKLY_REPORT_2025-12-03.pdf      # English PDF
WEEKLY_REPORT_FI_2025-12-03.md    # Finnish Markdown
WEEKLY_REPORT_FI_2025-12-03.pdf   # Finnish PDF
```

## 📄 Manual PDF Generation

To generate PDFs from Markdown reports:

```bash
cd Reports
python generate_pdf.py
```

This will:
1. Find latest Markdown reports in `en/` and `fi/`
2. Convert to HTML with professional styling
3. Add Lifetime Group branding (logo, footer)
4. Generate PDFs in same directories

## 📤 Manual Google Drive Upload

To manually upload reports to Google Drive:

```bash
cd Reports
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/credentials.json"
export GDRIVE_FOLDER_ID="your-folder-id"
python upload_to_drive.py
```

## 🔍 Troubleshooting

### PDF generation fails?

1. **Install dependencies:**
   ```bash
   pip install weasyprint markdown Pygments
   ```

2. **WeasyPrint system dependencies:**
   - Linux: `apt-get install libpango-1.0-0 libpangocairo-1.0-0 libgdk-pixbuf2.0-0`
   - macOS: `brew install pango gdk-pixbuf`
   - Windows: Pre-compiled wheels should work

3. **Check Markdown files exist:**
   ```bash
   ls -la Reports/en/WEEKLY_REPORT.md
   ls -la Reports/fi/WEEKLY_REPORT_FI.md
   ```

### Email not sending?

1. **Check secrets** - Verify all SMTP secrets are set correctly
2. **Test locally** - Run script locally with debug output
3. **Check logs** - View GitHub Actions logs for error messages
4. **Gmail blocks** - Ensure "Less secure app access" or App Passwords enabled
5. **PDFs exist** - Email script requires PDFs, run `generate_pdf.py` first

### Google Drive upload fails?

1. **Check credentials:**
   ```bash
   cat $GOOGLE_APPLICATION_CREDENTIALS  # Should show JSON
   ```

2. **Verify folder sharing:**
   - Open folder in Google Drive
   - Check service account email has access
   - Verify folder ID is correct

3. **Test API access:**
   ```python
   from google.oauth2 import service_account
   credentials = service_account.Credentials.from_service_account_file(
       'credentials.json',
       scopes=['https://www.googleapis.com/auth/drive.file']
   )
   print("✅ Credentials valid")
   ```

### Reports not found?

```bash
# Verify all reports exist
ls -la Reports/en/
ls -la Reports/fi/

# Check file permissions
chmod +x Reports/*.py
```

## 📝 Complete Workflow

### Weekly Report Process

1. **Create Markdown reports** (manual or automated):
   ```bash
   # Edit reports
   vim Reports/en/WEEKLY_REPORT.md
   vim Reports/fi/WEEKLY_REPORT_FI.md
   ```

2. **Generate PDFs:**
   ```bash
   cd Reports
   python generate_pdf.py
   ```

3. **Upload to Google Drive:**
   ```bash
   python upload_to_drive.py
   ```

4. **Send via email:**
   ```bash
   python send_weekly_report.py
   ```

### Automated (GitHub Actions)

Every Monday at 10:00 Helsinki time:
1. ✅ Checkout repository
2. ✅ Install dependencies
3. ✅ Generate PDFs with branding
4. ✅ Upload to Google Drive
5. ✅ Email to risto.paarni2024@lifetime.fi

## 🎨 Customizing Branding

### Logo

Replace the logo in `Reports/assets/lifetime_logo.svg` with your own:

```bash
cp /path/to/your/logo.svg Reports/assets/lifetime_logo.svg
```

Logo requirements:
- Format: SVG (recommended) or PNG
- Dimensions: 120x40px optimal
- Transparent background recommended

### Company Details

Edit `generate_pdf.py` to customize footer:

```python
<div id="footer-left">
    Your Company Name<br>
    Your Product Name
</div>

<div id="footer-right">
    Confidential<br>
    {date}
</div>
```

### Introduction Text

Edit `INTRODUCTIONS` dictionary in `generate_pdf.py`:

```python
INTRODUCTIONS = {
    "en": """
    <div class="intro-section">
        <h2>About Your Company</h2>
        <p><strong>Mission:</strong> Your mission statement...</p>
    </div>
    """,
    "fi": """..."
}
```

## 🚀 Future Enhancements

- [x] PDF attachment generation ✅
- [x] Google Drive backup ✅
- [x] Professional branding ✅
- [ ] Multiple recipient support
- [ ] Slack/Teams integration
- [ ] Custom report templates
- [ ] Automated metrics collection
- [ ] Interactive charts in PDFs

---

**Last Updated:** December 3, 2025
**Maintained By:** Claude Code "The Lead"
**Team Lead:** Risto Anton Päärni
**Company:** Lifetime Group - DWS IQ Platform

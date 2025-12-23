#!/usr/bin/env python3
"""
Upload weekly reports to Google Drive
Requires Google Drive API credentials
"""

import os
import sys
from pathlib import Path
from datetime import datetime
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

# Google Drive folder ID for reports (set via environment variable)
DRIVE_FOLDER_ID = os.getenv('GDRIVE_FOLDER_ID', 'root')

def get_drive_service():
    """Authenticate and return Google Drive service"""

    # Check for service account credentials
    creds_file = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')

    if not creds_file:
        print("⚠️  GOOGLE_APPLICATION_CREDENTIALS not set")
        print("📝 See Reports/README.md for Google Drive setup instructions")
        return None

    if not Path(creds_file).exists():
        print(f"❌ Credentials file not found: {creds_file}")
        return None

    # Authenticate with service account
    SCOPES = ['https://www.googleapis.com/auth/drive.file']
    credentials = service_account.Credentials.from_service_account_file(
        creds_file, scopes=SCOPES
    )

    service = build('drive', 'v3', credentials=credentials)
    return service

def upload_file(service, file_path, folder_id='root'):
    """Upload a file to Google Drive"""

    file_metadata = {
        'name': Path(file_path).name,
        'parents': [folder_id]
    }

    media = MediaFileUpload(
        file_path,
        mimetype='application/pdf',
        resumable=True
    )

    try:
        file = service.files().create(
            body=file_metadata,
            media_body=media,
            fields='id, webViewLink'
        ).execute()

        print(f"✅ Uploaded: {Path(file_path).name}")
        print(f"🔗 View at: {file.get('webViewLink')}")
        return file

    except Exception as e:
        print(f"❌ Upload failed for {Path(file_path).name}: {e}")
        return None

def main():
    """Upload all PDF reports to Google Drive"""

    service = get_drive_service()

    if not service:
        print("\n🔧 To enable Google Drive upload:")
        print("1. Create a service account in Google Cloud Console")
        print("2. Download JSON credentials")
        print("3. Set GOOGLE_APPLICATION_CREDENTIALS environment variable")
        print("4. Set GDRIVE_FOLDER_ID to target folder")
        print("\nSee Reports/README.md for detailed instructions")
        return False

    script_dir = Path(__file__).parent

    # Find all PDF reports
    pdf_files = [
        script_dir / "en" / "WEEKLY_REPORT.pdf",
        script_dir / "fi" / "WEEKLY_REPORT_FI.pdf"
    ]

    uploaded = []

    for pdf_file in pdf_files:
        if pdf_file.exists():
            result = upload_file(service, pdf_file, DRIVE_FOLDER_ID)
            if result:
                uploaded.append(result)
        else:
            print(f"⚠️  PDF not found: {pdf_file}")

    if uploaded:
        print(f"\n✅ Successfully uploaded {len(uploaded)} file(s) to Google Drive")
        return True
    else:
        print("\n❌ No files uploaded")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)

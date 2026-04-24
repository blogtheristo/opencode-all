"""
SFTP Feed Upload Script (Failover Deployment)

Usage:
  python scripts/upload_feed_sftp.py

Purpose:
  Uploads google-products.xml to remote SFTP server when GitHub Actions deployment fails.

Requirements:
  - SFTP_SECRETS.py in same directory with SFTP_HOST, SFTP_USER, SFTP_PASS, SFTP_PORT
  - feed file generated: landing-pages/dws10-com/feeds/google-products.xml

Deployment Priority:
  1. GitHub Actions (automatic on merge to main) ← PRIMARY
  2. This SFTP script (manual failover) ← SECONDARY

Related Files:
  - .github/workflows/sync-dws6-landing-pages.yml (primary deployment)
  - dws10.com/feeds/generate-feed.cjs (feed generator)
  - dws10.com/config/products.json (product source)
"""

import os
import paramiko
import SFTP_SECRETS as secrets

# Configuration
LOCAL_FILE = "landing-pages/dws10-com/feeds/google-products.xml"
REMOTE_FILE = "feeds/google-products.xml"


def upload_feed():
    print(f"Connecting to {secrets.SFTP_HOST} on port {secrets.SFTP_PORT}...")

    transport = paramiko.Transport((secrets.SFTP_HOST, secrets.SFTP_PORT))

    try:
        transport.connect(username=secrets.SFTP_USER, password=secrets.SFTP_PASS)
        sftp = paramiko.SFTPClient.from_transport(transport)

        print(f"Uploading {LOCAL_FILE} to /{REMOTE_FILE}...")

        # Callback for progress
        def progress(transferred, total):
            print(
                f"Transferred: {transferred}/{total} bytes ({(transferred / total) * 100:.1f}%)",
                end="\r",
            )

        sftp.put(LOCAL_FILE, REMOTE_FILE, callback=progress)
        print("\nUpload complete!")

        sftp.close()

    except Exception as e:
        print(f"\nError: {e}")
    finally:
        transport.close()


if __name__ == "__main__":
    if not os.path.exists(LOCAL_FILE):
        print(f"Error: Local file {LOCAL_FILE} not found.")
    else:
        upload_feed()

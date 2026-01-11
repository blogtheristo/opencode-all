import os

import paramiko
import SFTP_SECRETS as secrets

# Configuration
LOCAL_FILE = "landing-pages/dws10-com/products.xml"
REMOTE_FILE = "products.xml"


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

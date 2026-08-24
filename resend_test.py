import os
from dotenv import load_dotenv
import resend

load_dotenv()

resend.api_key = os.getenv("RESEND_API_KEY")
from_email = os.getenv("EMAIL_FROM", "your-verified-email@example.com")
to_email = os.getenv("TEST_RECIPIENT_EMAIL", "recipient@example.com")

r = resend.Emails.send({
  "from": from_email,
  "to": to_email,
  "subject": "Resend test email",
  "html": "<p>Congrats on sending your <strong>first email</strong>!</p>"
})

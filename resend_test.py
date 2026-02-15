import os
from dotenv import load_dotenv
import resend

load_dotenv()

resend.api_key = os.getenv("RESEND_API_KEY")

r = resend.Emails.send({
  "from": "risto@onelifetime.world",
  "to": "risto.paarni@lifetime.fi",
  "subject": "Hello World",
  "html": "<p>Congrats on sending your <strong>first email</strong>!</p>"
})
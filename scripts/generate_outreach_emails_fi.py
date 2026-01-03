import csv
import os

CSV_PATH = "investor-outreach/leads_nordic_targets.csv"
TEMPLATE_PATH = "investor-outreach/04-sales-starter-bundle-fi.md"
OUTPUT_DIR = "investor-outreach/ready_to_send_fi"

os.makedirs(OUTPUT_DIR, exist_ok=True)


def generate_emails():
    # Read Template
    with open(TEMPLATE_PATH, encoding="utf-8") as f:
        template_content = f.read()

    # Read Leads
    with open(CSV_PATH, encoding="utf-8") as f:
        reader = csv.DictReader(f)

        count = 0
        for row in reader:
            company = row["Company"]
            # role = row['Potential_Contact_Role'] # Not used in FI template placeholders directly but good context

            # Personalize
            # FI Template uses [Etunimi] - we don't have first names in the generic list, so we leave it or put placeholder
            email_body = template_content.replace("[Etunimi]", "Etunimi")
            # Note: The user will fill in the First Name manually when sending.

            # Filename
            safe_company = company.replace(" ", "_").replace("/", "-")
            output_file = os.path.join(OUTPUT_DIR, f"Kirje_{safe_company}.txt")

            with open(output_file, "w", encoding="utf-8") as out:
                out.write(email_body)

            count += 1

    print(f"Generated {count} Finnish draft emails in '{OUTPUT_DIR}'")


if __name__ == "__main__":
    generate_emails()

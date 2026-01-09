import csv
import os

CSV_PATH = r"D:\Proton\My files\2026\Sales\Leads\leads_nordic_targets.csv"
TEMPLATE_PATH = "investor-outreach/04-sales-starter-bundle.md"
OUTPUT_DIR = r"D:\Proton\My files\2026\Sales\Drafts"

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
            role = row["Potential_Contact_Role"]

            # Personalize
            email_body = template_content.replace("[Company Name]", company)
            email_body = email_body.replace(
                "[CFO / Sustainability Director / COO]", role
            )
            email_body = email_body.replace(
                "[Name]", "Sustainability Leader"
            )  # Placeholder for actual name if unknown

            # Filename
            safe_company = company.replace(" ", "_").replace("/", "-")
            output_file = os.path.join(OUTPUT_DIR, f"Email_{safe_company}.txt")

            with open(output_file, "w", encoding="utf-8") as out:
                out.write(email_body)

            count += 1

    print(f"Generated {count} personalized emails in '{OUTPUT_DIR}'")


if __name__ == "__main__":
    generate_emails()

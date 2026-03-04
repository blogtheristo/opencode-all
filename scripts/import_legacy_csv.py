import csv
import os
import re

CSV_PATH = r"C:\Users\risto\Downloads\Store_2024\products_Dec-08_06-01-06PM.csv"
OUTPUT_DIR = "Store/Legacy_2024"

os.makedirs(OUTPUT_DIR, exist_ok=True)


def sanitize_filename(title):
    # Remove invalid chars and swap spaces for underscores
    name = re.sub(r"[^\w\s-]", "", title).strip().lower()
    return re.sub(r"[-\s]+", "_", name) + ".md"


def import_products():
    with open(CSV_PATH, encoding="utf-8") as f:
        reader = csv.DictReader(f)

        current_product = None

        for row in reader:
            # Check if this is a main product row (has Product ID and Title)
            if row["Product ID [Non Editable]"] and row["Title"]:
                # Save previous product if exists
                if current_product:
                    save_product(current_product)

                # Start new product
                current_product = {
                    "title": row["Title"],
                    "sku": row["SKU"]
                    or f"LEGACY-2024-{row['Product ID [Non Editable]']}",
                    "price": row["Price"],
                    "description": row["Description"],
                    "images": row["Hosted Image URLs"].split(" ")
                    if row["Hosted Image URLs"]
                    else [],
                    "variants": [],
                }
            elif current_product and (row["Option Name 1"] or row["Option Value 1"]):
                # This is a variant row
                variant = (
                    f"{row.get('Option Name 1', '')}: {row.get('Option Value 1', '')}"
                )
                if row.get("Price"):
                    variant += f" (€{row['Price']})"
                current_product["variants"].append(variant)

        # Save last product
        if current_product:
            save_product(current_product)


def save_product(p):
    filename = sanitize_filename(p["title"])
    filepath = os.path.join(OUTPUT_DIR, filename)

    # Create frontmatter
    md_content = f"""---
title: "{p["title"]} (2024)"
price: "{p["price"]}"
currency: "EUR"
sku: "{p["sku"]}"
availability: "out_of_stock"
images:
"""
    for img in p["images"]:
        if img:
            md_content += f"  - {img}\n"

    md_content += f"""---
# {p["title"]}

**Legacy 2024 Product**
**Price:** €{p["price"]}

"""

    if p["variants"]:
        md_content += "### Variants / Options\n"
        for v in p["variants"]:
            md_content += f"- {v}\n"
        md_content += "\n"

    md_content += "### Original Description\n\n"
    md_content += p["description"]

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(md_content)
    print(f"Imported: {p['title']}")


if __name__ == "__main__":
    import_products()

import argparse
import io
import os
import re
from datetime import datetime

# Use defusedxml to prevent XXE attacks when parsing external XML
import defusedxml.ElementTree as ET


def clean_content(content):
    if not content:
        return ""
    # Basic cleanup - more advanced conversion could be done with pypandoc
    return content


def parse_wordpress_xml(xml_path, output_dir):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Handle encoding errors by reading as binary and decoding with replacement
    with open(xml_path, "rb") as f:
        raw_data = f.read()

    # Decode with replacement to handle invalid characters
    xml_content = raw_data.decode("utf-8", errors="replace")

    # Basic XML cleanup: remove control characters that are invalid in XML 1.0
    xml_content = "".join(
        char for char in xml_content if ord(char) >= 32 or char in "\n\r\t"
    )

    try:
        tree = ET.parse(io.StringIO(xml_content))
    except ET.ParseError as e:
        print(f"❌ XML Parse Error: {e}")
        return

    root = tree.getroot()

    # WordPress XML usually uses namespaces
    namespaces = {
        "wp": "http://wordpress.org/export/1.2/",
        "content": "http://purl.org/rss/1.0/modules/content/",
        "dc": "http://purl.org/dc/elements/1.1/",
    }

    channel = root.find("channel")
    if channel is None:
        print("❌ Error: Invalid XML format (no channel found)")
        return

    title_node = channel.find("title")
    site_title = title_node.text if title_node is not None else "Squarespace Import"
    print(f"📦 Importing content from: {site_title}")

    count = 0
    for item in channel.findall("item"):
        title_node = item.find("title")
        title = title_node.text if title_node is not None else "Untitled"
        if title is None:  # Handle case where title tag exists but is empty/None
            title = "Untitled"

        # Get post date
        post_date_str = None
        post_date_node = item.find("wp:post_date", namespaces)
        if post_date_node is not None:
            post_date_str = post_date_node.text

        try:
            if post_date_str:
                post_date = datetime.strptime(post_date_str, "%Y-%m-%d %H:%M:%S")
            else:
                post_date = datetime.now()
        except:
            post_date = datetime.now()

        # Get content
        content_encoded = item.find("content:encoded", namespaces)
        content = content_encoded.text if content_encoded is not None else ""

        # Get post type
        post_type_node = item.find("wp:post_type", namespaces)
        post_type = post_type_node.text if post_type_node is not None else "post"

        if post_type == "post" or post_type == "page":
            # Create clean filename
            slug_node = item.find("wp:post_name", namespaces)
            slug = slug_node.text if slug_node is not None else ""

            if not slug:
                slug = re.sub(r"[^a-z0-9-]", "", title.lower().replace(" ", "-"))

            # Flatten slashes in slug to avoid directory creation issues
            # Squarespace often has slugs like '2008/1/15/title'
            slug = slug.replace("/", "-")

            # Truncate slug if too long
            if len(slug) > 100:
                slug = slug[:100]

            filename = f"{slug}.md"
            file_path = os.path.join(output_dir, filename)

            # Create Markdown with Frontmatter
            # Escape quotes in title (Python 3.11 compatible)
            escaped_title = title.replace('"', '\\"')
            markdown_content = f"""---
title: "{escaped_title}"
date: {post_date.strftime("%Y-%m-%d")}
slug: {slug}
type: {post_type}
---

{clean_content(content)}
"""

            try:
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(markdown_content)
                count += 1
                # Print progress every 50 items
                if count % 50 == 0:
                    print(f"  ... processed {count} items")
            except OSError as e:
                print(f"  ⚠️ Warning: Could not save {filename} - {e}")

    print(f"\n🎉 Import Complete! {count} items imported to {output_dir}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Import WordPress/Squarespace XML to Markdown"
    )
    parser.add_argument("xml_file", help="Path to the XML export file")
    parser.add_argument(
        "--output",
        default="sites/lifetime-fi/content/posts",
        help="Output directory for Markdown files",
    )

    args = parser.parse_args()

    if not os.path.exists(args.xml_file):
        print(f"❌ Error: File not found: {args.xml_file}")
    else:
        parse_wordpress_xml(args.xml_file, args.output)

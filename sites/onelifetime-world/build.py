import os
import shutil
from datetime import datetime

import frontmatter
import markdown
from jinja2 import Environment, FileSystemLoader

# Configuration
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CONTENT_DIR = os.path.join(BASE_DIR, "content")
TEMPLATE_DIR = os.path.join(BASE_DIR, "templates")
STATIC_DIR = os.path.join(BASE_DIR, "static")
OUTPUT_DIR = os.path.join(BASE_DIR, "public")


def build_site():
    # 1. Prepare Output Directory
    if os.path.exists(OUTPUT_DIR):
        shutil.rmtree(OUTPUT_DIR)
    os.makedirs(OUTPUT_DIR)

    # Copy static assets
    if os.path.exists(STATIC_DIR):
        shutil.copytree(STATIC_DIR, os.path.join(OUTPUT_DIR, "static"))

    # 2. Setup Jinja2 Environment with autoescape enabled (XSS prevention)
    env = Environment(
        loader=FileSystemLoader(TEMPLATE_DIR),
        autoescape=True,  # Prevents XSS by auto-escaping variables
    )
    post_template = env.get_template("post.html")
    index_template = env.get_template("index.html")
    blog_template = env.get_template("blog.html")
    policy_template = env.get_template("policy.html")
    buy_template = env.get_template("buy.html")

    # 2.5 Process Store Products (Shared Store Directory)
    # Assuming Store/ is at ../../../Store relative to this script
    STORE_DIR = os.path.join(BASE_DIR, "..", "..", "Store")
    products = []

    if os.path.exists(STORE_DIR):
        for filename in os.listdir(STORE_DIR):
            if (
                filename.endswith(".md")
                and filename
                not in [
                    "RETURN_POLICY.md",
                    "GOOGLE_MERCHANT_SETUP.md",
                    "PRIVACY_POLICY.md",
                ]
                and "GoogleLegal" not in filename
            ):
                path = os.path.join(STORE_DIR, filename)
                product = frontmatter.load(path)

                # Extract excerpt (first 150 chars of content)
                clean_desc = product.content[:200].replace("\n", " ") + "..."

                product_data = {
                    "title": product.get("title", "Untitled"),
                    "price": product.get("price", "0"),
                    "image": product.get(
                        "image_link", "/static/images/Firehorse_Store.jpg"
                    ),
                    "link": f"https://dws10.com/products/{filename.replace('.md', '.html').replace('_', '-')}",
                    "description": clean_desc,
                }
                products.append(product_data)
    else:
        print(f"⚠️ Warning: Store directory not found at {STORE_DIR}")

    # 3. Process Content
    posts = []
    for root, _dirs, files in os.walk(os.path.join(CONTENT_DIR, "posts")):
        for file in files:
            if file.endswith(".md"):
                path = os.path.join(root, file)
                post = frontmatter.load(path)

                # Convert Markdown to HTML
                html_content = markdown.markdown(post.content)

                post_data = {
                    "title": post.get("title", "Untitled"),
                    "date": post.get("date", datetime.now()),
                    "slug": file.replace(".md", ""),
                    "content": html_content,
                    "url": f"/posts/{file.replace('.md', '.html')}",
                    "tags": post.get("tags", []),
                }
                posts.append(post_data)

                # Render Post (in /posts/ subdirectory)
                output_path = os.path.join(
                    OUTPUT_DIR, "posts", file.replace(".md", ".html")
                )
                os.makedirs(os.path.dirname(output_path), exist_ok=True)

                # Pass root_path='..' because we are in /posts/
                with open(output_path, "w", encoding="utf-8") as f:
                    f.write(
                        post_template.render(
                            post=post_data,
                            site={"title": "OneLifetime.World"},
                            root_path="..",
                        )
                    )

    # Sort posts by date desc
    posts.sort(key=lambda x: x["date"], reverse=True)

    # 4. Render Pages
    # Render Homepage (index.html) - Root level
    with open(os.path.join(OUTPUT_DIR, "index.html"), "w", encoding="utf-8") as f:
        f.write(
            index_template.render(
                posts=posts[:3], site={"title": "OneLifetime.World"}, root_path="."
            )
        )

    # Render Blog Index (blog/index.html) - In /blog/ subdirectory
    blog_dir = os.path.join(OUTPUT_DIR, "blog")
    os.makedirs(blog_dir, exist_ok=True)
    with open(os.path.join(blog_dir, "index.html"), "w", encoding="utf-8") as f:
        f.write(
            blog_template.render(
                posts=posts, site={"title": "OneLifetime.World"}, root_path=".."
            )
        )

    # Helper to render policy/terms pages
    def render_legal_page(source_filename, output_subdir):
        source_path = os.path.join(
            BASE_DIR, "..", "..", "privacy-policy", source_filename
        )
        content = ""
        if os.path.exists(source_path):
            with open(source_path, encoding="utf-8") as f:
                raw_md = f.read()
                # Strip frontmatter if present
                if raw_md.startswith("---"):
                    parts = raw_md.split("---", 2)
                    if len(parts) >= 3:
                        raw_md = parts[2].strip()
                content = markdown.markdown(raw_md)
        else:
            print(f"⚠️ Warning: Legal file not found at {source_path}")
            return

        out_dir = os.path.join(OUTPUT_DIR, output_subdir)
        os.makedirs(out_dir, exist_ok=True)
        with open(os.path.join(out_dir, "index.html"), "w", encoding="utf-8") as f:
            f.write(
                policy_template.render(
                    content=content, site={"title": "OneLifetime.World"}, root_path=".."
                )
            )
        print(f"Generated {output_subdir}/index.html")

    # Render Legal Pages
    render_legal_page("privacy-policy_V1.md", "privacy-policy")
    render_legal_page("Agreement_Project_Terms.md", "terms")
    render_legal_page("Legal_Hub.md", "legal")
    render_legal_page("Regulatory_Notice_Investors.md", "regulatory-notice")
    render_legal_page("InvestmentSafety.md", "investment-safety")
    render_legal_page("TermsofServiceforDWSIQ.md", "terms-dws-iq")
    render_legal_page("TermsofServiceforFirehorse.md", "terms-firehorse")
    render_legal_page("TermsofServiceforLifetimeFleet.md", "terms-lifetime-fleet")
    render_legal_page("TermsofServiceforProfessional.md", "terms-professional")

    # Render Store Page (/buy/index.html)
    buy_dir = os.path.join(OUTPUT_DIR, "buy")
    os.makedirs(buy_dir, exist_ok=True)
    with open(os.path.join(buy_dir, "index.html"), "w", encoding="utf-8") as f:
        f.write(
            buy_template.render(
                products=products,
                site={"title": "Lifetime Firehorse™Store"},
                root_path="..",
            )
        )

    print(f"✅ Site built successfully in {OUTPUT_DIR}")

    # 5. Auto-sync to deployment folder
    sync_to_deployment()


def sync_to_deployment():
    """Automatically sync built site to deployment folder for GitHub Pages"""
    DEPLOYMENT_DIR = os.path.join(BASE_DIR, "..", "..", "onelifetime.world")

    if not os.path.exists(OUTPUT_DIR):
        print("⚠️ Warning: Public directory doesn't exist. Skipping sync.")
        return

    # Create deployment dir if it doesn't exist
    os.makedirs(DEPLOYMENT_DIR, exist_ok=True)

    # Remove old content (except .git and other hidden files)
    for item in os.listdir(DEPLOYMENT_DIR):
        if not item.startswith("."):
            item_path = os.path.join(DEPLOYMENT_DIR, item)
            if os.path.isfile(item_path):
                os.remove(item_path)
            elif os.path.isdir(item_path):
                shutil.rmtree(item_path)

    # Copy new content
    for item in os.listdir(OUTPUT_DIR):
        src = os.path.join(OUTPUT_DIR, item)
        dst = os.path.join(DEPLOYMENT_DIR, item)
        if os.path.isfile(src):
            shutil.copy2(src, dst)
        elif os.path.isdir(src):
            shutil.copytree(src, dst)

    print(f"✅ Site synced to deployment folder: {DEPLOYMENT_DIR}")
    print("   Push to GitHub to deploy to onelifetime.world")


if __name__ == "__main__":
    build_site()

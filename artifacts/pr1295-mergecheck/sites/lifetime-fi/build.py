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

    # Check if page template exists, otherwise use post template
    try:
        page_template = env.get_template("page.html")
    except:
        page_template = post_template  # Fallback

    # 3. Process Blog Posts
    posts = []
    posts_dir = os.path.join(CONTENT_DIR, "posts")
    if os.path.exists(posts_dir):
        for root, _dirs, files in os.walk(posts_dir):
            for file in files:
                if file.endswith(".md"):
                    path = os.path.join(root, file)
                    try:
                        post = frontmatter.load(path)

                        # Convert Markdown to HTML
                        html_content = markdown.markdown(post.content)

                        # Handle date
                        date_val = post.get("date", datetime.now())
                        if isinstance(date_val, str):
                            try:
                                date_val = datetime.strptime(date_val, "%Y-%m-%d")
                            except:
                                date_val = datetime.now()

                        post_data = {
                            "title": post.get("title", "Untitled"),
                            "date": date_val,
                            "slug": file.replace(".md", ""),
                            "content": html_content,
                            "url": f"/posts/{file.replace('.md', '.html')}",
                            "tags": post.get("tags", []),
                        }
                        posts.append(post_data)

                        # Render Post
                        output_path = os.path.join(
                            OUTPUT_DIR, "posts", file.replace(".md", ".html")
                        )
                        os.makedirs(os.path.dirname(output_path), exist_ok=True)

                        with open(output_path, "w", encoding="utf-8") as f:
                            f.write(
                                post_template.render(
                                    post=post_data, site={"title": "Lifetime World"}
                                )
                            )
                    except Exception as e:
                        print(f"⚠️ Error processing post {file}: {e}")

    # Sort posts by date desc
    posts.sort(key=lambda x: x["date"], reverse=True)

    # 4. Process Pages (Landing pages, About, etc.)
    pages_dir = os.path.join(CONTENT_DIR, "pages")
    if os.path.exists(pages_dir):
        for root, _dirs, files in os.walk(pages_dir):
            for file in files:
                if file.endswith(".md"):
                    path = os.path.join(root, file)
                    try:
                        page = frontmatter.load(path)
                        html_content = markdown.markdown(page.content)

                        page_data = {
                            "title": page.get("title", "Untitled"),
                            "content": html_content,
                            "url": f"/pages/{file.replace('.md', '.html')}",
                        }

                        # Render Page
                        output_path = os.path.join(
                            OUTPUT_DIR, "pages", file.replace(".md", ".html")
                        )
                        os.makedirs(os.path.dirname(output_path), exist_ok=True)

                        with open(output_path, "w", encoding="utf-8") as f:
                            f.write(
                                page_template.render(
                                    post=page_data, site={"title": "Lifetime World"}
                                )
                            )  # Reuse post layout for now

                        print(f"  ✅ Generated Page: {page_data['title']}")
                    except Exception as e:
                        print(f"⚠️ Error processing page {file}: {e}")

    # 5. Render Index
    with open(os.path.join(OUTPUT_DIR, "index.html"), "w", encoding="utf-8") as f:
        f.write(index_template.render(posts=posts, site={"title": "Lifetime World"}))

    print(f"🎉 Site built successfully in {OUTPUT_DIR}")


if __name__ == "__main__":
    build_site()

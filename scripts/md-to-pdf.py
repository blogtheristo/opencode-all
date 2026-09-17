#!/usr/bin/env python3
"""
scripts/md-to-pdf.py — render a Markdown file to a clean, professionally styled
HTML (and, via scripts/html-to-pdf.mjs / Chromium, a PDF).

Why this exists: sending a raw-markdown-derived PDF looks unprofessional to an
external reader (a supervisor, a partner). This wraps the content in the same
document CSS used for the Törngren memo so any DWS markdown deliverable renders
to a presentable A4 document with one command.

Usage:
    python3 scripts/md-to-pdf.py <input.md> <output.html> [--strip-frontmatter]

Then:
    node scripts/html-to-pdf.mjs <output.html> <output.pdf>

Supports: ATX headings, paragraphs, **bold**, _italic_/*italic*, `code`,
- / * bullet lists (one nesting level), N. ordered lists, > blockquotes,
| pipe tables |, and --- / *** horizontal rules. --strip-frontmatter removes the
DWS "VERSION AND AGENT HISTORY" header block (everything between the first two
*** / --- delimiter lines) while keeping the H1 title.
"""
import re
import sys
import html as _html

def esc(t):
    return _html.escape(t, quote=False)

def inline(t):
    t = esc(t)
    t = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", t)
    t = re.sub(r"(?<!\w)_(.+?)_(?!\w)", r"<em>\1</em>", t)
    t = re.sub(r"(?<!\*)\*(?!\s)(.+?)(?<!\s)\*(?!\*)", r"<em>\1</em>", t)
    t = re.sub(r"`(.+?)`", r"<code>\1</code>", t)
    t = re.sub(r"\[(.+?)\]\((.+?)\)", r'<a href="\2">\1</a>', t)
    return t

def strip_frontmatter(lines):
    delim = [i for i, l in enumerate(lines) if l.strip() in ("***", "---")]
    if len(delim) >= 2:
        return lines[: delim[0]] + lines[delim[1] + 1 :]
    return lines

def render_table(block):
    rows = [r for r in block if r.strip().startswith("|")]
    def cells(r):
        r = r.strip().strip("|")
        return [c.strip() for c in r.split("|")]
    out = ["<table>"]
    header = cells(rows[0])
    out.append("<thead><tr>" + "".join(f"<th>{inline(c)}</th>" for c in header) + "</tr></thead>")
    out.append("<tbody>")
    for r in rows[2:]:
        out.append("<tr>" + "".join(f"<td>{inline(c)}</td>" for c in cells(r)) + "</tr>")
    out.append("</tbody></table>")
    return "\n".join(out)

def convert(md):
    lines = md.split("\n")
    out, i = [], 0
    while i < len(lines):
        line = lines[i]
        s = line.strip()
        if not s:
            i += 1; continue
        # hr
        if s in ("---", "***", "___"):
            out.append("<hr/>"); i += 1; continue
        # heading
        m = re.match(r"^(#{1,6})\s+(.*)$", s)
        if m:
            lvl = len(m.group(1)); out.append(f"<h{lvl}>{inline(m.group(2))}</h{lvl}>"); i += 1; continue
        # table (current and next line look like a table with a separator row)
        if s.startswith("|") and i + 1 < len(lines) and re.match(r"^\s*\|?[\s:|-]+\|?\s*$", lines[i+1]):
            block = []
            while i < len(lines) and lines[i].strip().startswith("|"):
                block.append(lines[i]); i += 1
            out.append(render_table(block)); continue
        # blockquote
        if s.startswith(">"):
            buf = []
            while i < len(lines) and lines[i].strip().startswith(">"):
                buf.append(re.sub(r"^\s*>\s?", "", lines[i])); i += 1
            out.append(f"<blockquote>{inline(' '.join(x.strip() for x in buf))}</blockquote>"); continue
        # unordered list (with one nesting level via indent)
        if re.match(r"^\s*[-*]\s+", line):
            out.append(render_list(lines, i, ordered=False, level_indent=indent_of(line)))
            i = skip_list(lines, i); continue
        # ordered list
        if re.match(r"^\s*\d+\.\s+", line):
            out.append(render_list(lines, i, ordered=True, level_indent=indent_of(line)))
            i = skip_list(lines, i); continue
        # paragraph (gather until blank / block start)
        buf = []
        while i < len(lines) and lines[i].strip() and not is_block_start(lines[i]):
            buf.append(lines[i].strip()); i += 1
        out.append(f"<p>{inline(' '.join(buf))}</p>")
    return "\n".join(out)

def indent_of(line):
    return len(line) - len(line.lstrip(" "))

def is_block_start(line):
    s = line.strip()
    return (re.match(r"^#{1,6}\s", s) or s.startswith(("|", ">"))
            or re.match(r"^[-*]\s", s) or re.match(r"^\d+\.\s", s)
            or s in ("---", "***", "___"))

def is_list_line(line):
    return bool(re.match(r"^\s*([-*]|\d+\.)\s+", line))

def skip_list(lines, start):
    i = start
    while i < len(lines) and (is_list_line(lines[i]) or (lines[i].strip() == "" and i+1 < len(lines) and is_list_line(lines[i+1]))):
        if lines[i].strip() == "":
            break
        i += 1
    return i

def render_list(lines, start, ordered, level_indent):
    tag = "ol" if ordered else "ul"
    items, i = [], start
    base = level_indent
    cur = None
    html_items = []
    while i < len(lines) and is_list_line(lines[i]):
        ind = indent_of(lines[i])
        content = re.sub(r"^\s*([-*]|\d+\.)\s+", "", lines[i])
        if ind > base + 1:  # nested
            if cur is not None:
                cur.setdefault("children", []).append(content)
        else:
            cur = {"text": content, "children": []}
            html_items.append(cur)
        i += 1
    parts = [f"<{tag}>"]
    for it in html_items:
        if it["children"]:
            sub = "".join(f"<li>{inline(c)}</li>" for c in it["children"])
            parts.append(f"<li>{inline(it['text'])}<ul>{sub}</ul></li>")
        else:
            parts.append(f"<li>{inline(it['text'])}</li>")
    parts.append(f"</{tag}>")
    return "\n".join(parts)

CSS = """
@page { size: A4; margin: 22mm 20mm 20mm 20mm; }
* { box-sizing: border-box; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { font-family: Georgia, 'Times New Roman', serif; font-size: 11.4pt; line-height: 1.6; color:#1a1a1a; margin:0; }
h1 { font-family:'Helvetica Neue',Arial,sans-serif; font-size:19pt; color:#0b2a4a; margin:0 0 4px 0; }
h2 { font-family:'Helvetica Neue',Arial,sans-serif; font-size:13pt; color:#0b2a4a; margin:22px 0 8px 0; padding-bottom:4px; border-bottom:1px solid #c9d4e0; break-after:avoid; }
h3 { font-family:'Helvetica Neue',Arial,sans-serif; font-size:11pt; color:#12395f; margin:14px 0 4px 0; break-after:avoid; }
h4 { font-family:'Helvetica Neue',Arial,sans-serif; font-size:10.6pt; color:#12395f; margin:12px 0 3px 0; }
p { margin:0 0 10px 0; }
ul,ol { margin:5px 0 11px 0; padding-left:20px; }
li { margin:0 0 5px 0; }
strong { color:#0b2a4a; }
code { font-family:'SF Mono',Consolas,monospace; font-size:9.6pt; background:#eef3f8; padding:1px 4px; border-radius:3px; }
a { color:#0b5; }
table { border-collapse:collapse; width:100%; margin:10px 0 13px 0; font-size:9.8pt; }
th,td { border:1px solid #c9d4e0; padding:6px 9px; text-align:left; vertical-align:top; }
th { background:#eef3f8; font-family:'Helvetica Neue',Arial,sans-serif; color:#0b2a4a; }
blockquote { background:#f4f7fb; border-left:3px solid #0b2a4a; padding:8px 13px; margin:11px 0; }
hr { border:0; border-top:2px solid #0b2a4a; margin:10px 0 16px 0; }
"""

def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    flags = {a for a in sys.argv[1:] if a.startswith("--")}
    if len(args) < 2:
        print("Usage: md-to-pdf.py <input.md> <output.html> [--strip-frontmatter]"); sys.exit(1)
    src, dst = args[0], args[1]
    md = open(src, encoding="utf-8").read()
    lines = md.split("\n")
    if "--strip-frontmatter" in flags:
        lines = strip_frontmatter(lines)
    body = convert("\n".join(lines))
    doc = f"<!doctype html>\n<html lang='en'><head><meta charset='utf-8'/><style>{CSS}</style></head><body>\n{body}\n</body></html>\n"
    open(dst, "w", encoding="utf-8").write(doc)
    print("HTML written:", dst)

if __name__ == "__main__":
    main()

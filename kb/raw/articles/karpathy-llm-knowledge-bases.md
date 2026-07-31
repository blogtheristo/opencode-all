# LLM Knowledge Bases — Karpathy (April 2026)

Source: Andrej Karpathy, X thread, April 2026

## Core Workflow

Something I'm finding very useful recently: using LLMs to build personal
knowledge bases for various topics of research interest. A large fraction of
my recent token throughput is going less into manipulating code, and more into
manipulating knowledge (stored as markdown and images).

### Data Ingest

Index source documents (articles, papers, repos, datasets, images, etc.) into
a raw/ directory, then use an LLM to incrementally "compile" a wiki — a
collection of .md files in a directory structure. The wiki includes summaries
of all the data in raw/, backlinks, categorizes data into concepts, writes
articles for them, and links them all. Use the Obsidian Web Clipper extension
to convert web articles into .md files, plus a hotkey to download related
images to local.

### IDE

Use Obsidian as the IDE "frontend" to view raw data, compiled wiki, and
derived visualizations. The LLM writes and maintains all of the data of the
wiki — rarely touch it directly. Played with Marp for slides.

### Q&A

Once wiki is big enough (~100 articles, ~400K words), ask LLM agent complex
questions against the wiki. LLM goes off, researches answers, etc. Expected
to need fancy RAG, but the LLM has been pretty good about auto-maintaining
index files and brief summaries of all documents. Reads all important related
data fairly easily at this ~small scale.

### Output

Instead of text/terminal answers, render markdown files, slide shows (Marp
format), or matplotlib images, all viewed in Obsidian. Many visual output
formats depending on the query. Often, "filing" the outputs back into the
wiki enhances it for further queries. Explorations and queries always "add up"
in the knowledge base.

### Linting

LLM "health checks" over the wiki to find inconsistent data, impute missing
data (with web searchers), find interesting connections for new article
candidates, to incrementally clean up the wiki and enhance its overall data
integrity. LLMs are quite good at suggesting further questions to ask.

### Extra Tools

Developing additional tools to process the data — e.g. a small naive search
engine over the wiki, used directly (web UI) and handed off to LLM via CLI as
a tool for larger queries.

### Further Explorations

As the repo grows, the natural desire is synthetic data generation + finetuning
to have the LLM "know" the data in its weights instead of just context windows.

## Key Insight

No RAG needed at ~100 article scale. Auto-maintained index files + summaries
beat vector search when the LLM can read its own indexes on demand. The wiki IS
the retrieval system.

## Extended Idea: Ephemeral Wikis

Every question to a frontier LLM could spawn a team of LLMs that:
1. Iteratively construct an entire ephemeral wiki
2. Lint it
3. Loop a few times
4. Write a full report

Way beyond a simple `.decode()`.

## Tags

knowledge-base, wiki, LLM, RAG-alternative, Karpathy, markdown, Obsidian,
auto-maintained-indexes, ephemeral-wikis, synthetic-data, finetuning

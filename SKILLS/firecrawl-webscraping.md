---
name: firecrawl-webscraping
description: Add web scraping, crawling, search, and browser automation to any agent using Firecrawl. Use when the task requires extracting data from websites, crawling multiple pages, or interacting with web content programmatically.
---

# Firecrawl — Web Scraping & Crawling Skill

## When to Use
- Extracting structured data from one or many web pages
- Crawling a site to discover all URLs or content
- Web search with result filtering
- Interacting with JavaScript-rendered pages
- Any task that requires "go get this from the web"

## Available Capabilities
| Command | What It Does |
|---------|-------------|
| `scrape` | Extract content from a single URL (markdown, HTML, JSON) |
| `search` | Web search with filters, returns ranked results |
| `crawl` | Recursively crawl a site, collect all pages |
| `map` | Discover all URLs on a site without scraping content |
| `browse` | Interact with a page (click, fill, navigate) via cloud Chromium |

## Steps

### 1. Choose the Right Command
```
Single page, get content → scrape
Find all URLs on a site  → map
Get content from many pages → crawl
Need current web results → search
Need to click/interact   → browse
```

### 2. Authentication Setup
```bash
export FIRECRAWL_API_KEY=<your-key>
# Or: firecrawl auth login
```

### 3. Scrape a Page
```bash
firecrawl scrape "https://example.com/page" --format markdown
```
Returns clean markdown — strips nav, ads, boilerplate by default.

### 4. Crawl a Site
```bash
firecrawl crawl "https://docs.example.com" \
  --max-depth 3 \
  --include-paths "/docs/*" \
  --format markdown \
  --output ./scraped/
```

### 5. Search
```bash
firecrawl search "Claude Code SKILL.md 2026" --limit 10
```

### 6. Extract Structured Data
Use `--extract` with a schema to get structured JSON output instead of markdown:
```bash
firecrawl scrape "https://example.com" \
  --extract '{"title": "string", "price": "number", "description": "string"}'
```

## Quality Gates
- [ ] API key set in environment (not hardcoded)
- [ ] `--max-depth` set on crawls (prevent runaway crawls)
- [ ] Output path specified for multi-page crawls
- [ ] Rate limits respected (check Firecrawl plan limits)

## Anti-Patterns
| Anti-Pattern | Consequence |
|-------------|-------------|
| Crawling without max-depth | Hundreds of unexpected pages |
| Scraping when `search` would work | Slower, requires knowing the URL |
| Hardcoding API key in scripts | Credential leak |
| Scraping the full site when `map` + targeted `scrape` is enough | Wasted API calls |

## References
- [firecrawl/cli on GitHub](https://github.com/firecrawl/cli)
- [Firecrawl: Best Claude Code Skills 2026](https://www.firecrawl.dev/blog/best-claude-code-skills)
- [How to Create a Claude Code Skill with Firecrawl](https://www.firecrawl.dev/blog/claude-code-skill)

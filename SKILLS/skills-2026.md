# SKILL.md for LLMs — Top Ranked & Hidden Gems (2026)

> `SKILL.md` files are modular capability packages for AI coding agents (Claude Code, Codex, Gemini CLI, Cursor, Copilot, etc.).  
> Each skill = YAML frontmatter (trigger) + Markdown body (playbook).  
> Works cross-platform — same file, any agent that accepts system prompts or instruction files.

---

## How SKILL.md Works

```yaml
---
name: skill-name
description: One-line trigger — agent reads this to decide WHEN to load the skill
---

# Skill body — what the agent actually does
## Steps
1. ...
2. ...
```

**Loading levels:**
- **Trigger** — frontmatter description matched against user intent
- **Runbook** — markdown body executed as structured workflow
- **Reference** — linked files loaded on demand (templates, scripts, examples)

Install via Claude Code: `claude skills add <skill-url>`  
Browse: [skills.sh](https://skills.sh) · [SkillsMP Marketplace](https://skillsmp.com) · [VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills)

---

## Top Ranked SKILL.md Files (2026)

Ranked by install count, community stars, and cross-platform adoption.

### 1. `frontend-design` — Anthropic Official
**Installs:** 277,000+ (as of March 2026)  
**What it does:** Injects a design system, philosophy, and visual quality bar before Claude touches any frontend code. Prevents generic AI-looking output.  
**Source:** [Anthropic Skills Repo](https://github.com/anthropics/skills)  
**Why it's #1:** Most-installed skill by a large margin. Changes the default aesthetic output of every frontend task.

---

### 2. `claude-api` — Anthropic Official
**What it does:** Build, debug, and optimize Anthropic SDK apps with prompt caching baked in. Handles model migrations (4.5 → 4.6 → 4.7), tool use, batch processing, citations, and memory.  
**Source:** [anthropics/skills — claude-api](https://github.com/anthropics/skills/blob/main/skills/claude-api/SKILL.md)  
**Triggers on:** Any file importing `anthropic` or `@anthropic-ai/sdk`

---

### 3. `test-driven-development` — Anthropic Official
**What it does:** Forces red-green-refactor discipline. Agent writes failing tests first, then implementation. Prevents the default "write code, add tests as afterthought" behavior.  
**Why it matters:** AI agents default to the shortest path — TDD skill enforces the same discipline a senior engineer brings.

---

### 4. `systematic-debugging` — Anthropic Official
**What it does:** Structured hypothesis → evidence → fix loop. Blocks the agent from randomly mutating code hoping something works.  
**Triggers on:** Any bug, test failure, or unexpected behavior

---

### 5. `Shannon` — Autonomous AI Pen Testing
**What it does:** Executes real security exploits against web applications. 50+ vulnerability types across 5 OWASP categories.  
**Benchmark:** 96.15% exploit success rate on the XBOW benchmark  
**Source:** Via [VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills)  
**Warning:** Requires explicit authorization context before use

---

### 6. `Valyu` — Live Data Search Skill
**What it does:** Connects Claude Code to web search + 36 specialized data sources: SEC filings, PubMed, ChEMBL, ClinicalTrials.gov, FRED economic indicators, academic publishers.  
**Why it's powerful:** Turns a coding agent into a research agent without switching tools.  
**Source:** Via [VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills)

---

### 7. `addyosmani/agent-skills` — Production Engineering Pack
**What it does:** 22 lifecycle skills baked from Google's engineering culture (*Software Engineering at Google*). Covers spec → implementation → testing → review → deployment with quality gates at each stage.  
**Source:** [github.com/addyosmani/agent-skills](https://github.com/addyosmani/agent-skills)  
**Key insight:** Prevents agents from skipping specs, tests, and security review on the path to "working code"

---

### 8. `understand-anything` — Codebase Knowledge Graphs
**What it does:** Multi-agent LLM analysis that builds interactive knowledge graphs of any codebase. Maps dependencies, data flows, and call graphs visually.  
**Source:** [Lum1104/understand-anything](https://github.com/Lum1104/understand-anything)  
**Use case:** Onboarding to large unfamiliar repos

---

### 9. `ComposioHQ/awesome-claude-skills`
**What it does:** Curated library of skills covering integrations with external APIs, databases, and services. Bridge between Claude Code and the broader tool ecosystem.  
**Source:** [github.com/ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills)

---

### 10. `microsoft/skills` — Skill Explorer (174 skills)
**What it does:** Microsoft's official skill pack with 1-click install for 174 skills. Covers AGENTS.md templates, MCP server configs, and custom agent workflows.  
**Source:** [github.com/microsoft/skills](https://github.com/microsoft/skills)  
**Cross-platform:** Works with VS Code Copilot, Claude Code, Codex

---

## 10 Least Known but Powerful SKILL.md Skills

These exist and work — but almost nobody knows about them.

---

### 1. `skill-optimizer` — Diagnose Your Own Skill Files
**What it does:** Uses real session data and research-backed static analysis to diagnose and optimize your existing SKILL.md files. Finds ambiguous triggers, bloated runbooks, and conflicting instructions.  
**Source:** [hqhq1025/skill-optimizer](https://github.com/hqhq1025/skill-optimizer)  
**Why it's hidden:** Meta-skill for skill authors — most people don't know you can use a skill to improve your skills.

---

### 2. `receiving-code-review` — Rigorous Review Response
**What it does:** Forces technical verification before implementing review feedback. Prevents performative agreement — agent must verify that the reviewer's suggestion is actually correct before applying it.  
**Why it's hidden:** Counter-intuitive — you'd expect an agent to just do what reviewers say. This adds a verification gate that catches bad advice.

---

### 3. `verification-before-completion` — Evidence Before Assertions
**What it does:** Blocks the agent from claiming "tests pass" or "it's fixed" without actually running verification commands and reading the output. No success claims without evidence.  
**Why it's hidden:** Solves a core LLM failure mode (hallucinating success) but nobody ships it by default.

---

### 4. `dispatching-parallel-agents` — Multi-Agent Orchestration
**What it does:** Structured workflow for breaking a task into independent subtasks and running them in parallel sub-agents. Includes state isolation, result aggregation, and conflict resolution.  
**Why it's hidden:** Most people use LLMs single-threaded. Parallel agents 3-5x throughput on independent work.

---

### 5. `using-git-worktrees` — Isolated Feature Branches
**What it does:** Ensures isolated workspace exists via native git worktree before starting feature work. Prevents polluting the main workspace with in-progress agent changes.  
**Why it's hidden:** Git worktrees are underused by humans; even fewer know to encode it as an agent skill.

---

### 6. `context-engineering/prompt-engineering` — Structured Prompt Design
**What it does:** NeoLabHQ's SKILL.md for building and refining prompts systematically. Applies context engineering principles: role, task, format, constraints, examples.  
**Source:** [NeoLabHQ/context-engineering-kit](https://github.com/NeoLabHQ/context-engineering-kit/blob/master/plugins/customaize-agent/skills/prompt-engineering/SKILL.md)  
**Why it's hidden:** Buried inside a larger context engineering kit

---

### 7. `brainstorming` — Intent Exploration Before Building
**What it does:** Forces the agent to explore user intent, requirements, and design trade-offs *before* touching code. Prevents the default "just start coding" behavior on ambiguous requests.  
**Why it's hidden:** Looks like overhead. Actually prevents massive rework by aligning on *what* before *how*.

---

### 8. `finishing-a-development-branch` — Structured Integration Decision
**What it does:** When implementation is complete and tests pass, presents structured options for merge, PR, or cleanup — with criteria for each. Prevents "I'm done, now what?" drift.  
**Why it's hidden:** Most skill lists focus on building, not finishing. This closes the loop.

---

### 9. `forrestchang/andrej-karpathy-skills` — Behavioral Anti-Patterns Guard
**What it does:** Distills Andrej Karpathy's viral observations about LLM coding pitfalls into actionable CLAUDE.md behavioral rules. Blocks known failure modes before they happen.  
**Source:** Forrest Chang's repo (most popular behavioral guideline set for AI coding agents per 2026 community data)  
**Why it's hidden:** Framed as a CLAUDE.md, not a SKILL.md — often overlooked in skill directories.

---

### 10. `writing-skills` — Skills That Write Skills
**What it does:** Guides the agent through creating, editing, and verifying new SKILL.md files before deployment. Enforces frontmatter schema, trigger clarity, and runbook completeness.  
**Why it's hidden:** Most users consume skills. The ability to *produce* high-quality skills is the 10x multiplier.

---

## Quick Reference

| Skill | Category | Difficulty to Find | Impact |
|-------|----------|-------------------|--------|
| `frontend-design` | UI/UX | Easy (official) | High |
| `claude-api` | SDK/API | Easy (official) | High |
| `Shannon` | Security | Medium | Very High |
| `Valyu` | Research/Data | Medium | High |
| `addyosmani/agent-skills` | Engineering | Medium | Very High |
| `skill-optimizer` | Meta | Hard | High |
| `receiving-code-review` | Workflow | Hard | High |
| `verification-before-completion` | Quality | Medium | Very High |
| `dispatching-parallel-agents` | Orchestration | Hard | Very High |
| `context-engineering/prompt-engineering` | Prompting | Very Hard | High |
| `brainstorming` | Process | Medium | High |
| `writing-skills` | Meta | Hard | Very High |

---

## Local Inventory (28 skills installed)

All `.md` files currently in this directory, grouped by category.

### Engineering Process & Discipline

| File | Description |
|------|-------------|
| `brainstorming.md` | Explore intent, requirements, and design trade-offs before writing code |
| `test-driven-development.md` | Red-green-refactor enforcement — failing test must exist before implementation |
| `systematic-debugging.md` | Hypothesis-driven bug fixing — no random code mutations |
| `writing-plans.md` | Spec/requirements → written implementation plan before touching code |
| `verification-before-completion.md` | Evidence before success claims — run and read output before asserting "it works" |
| `receiving-code-review.md` | Technical verification gate before implementing review feedback |
| `dispatching-parallel-agents.md` | Break 2+ independent tasks into parallel sub-agents |
| `using-git-worktrees.md` | Isolated workspace setup via native tools or git worktree fallback |
| `finishing-a-development-branch.md` | Structured merge/PR/cleanup decision when implementation is complete |
| `andrej-karpathy-skills.md` | Guard against known LLM coding failure modes (overconfidence, scope creep, invented APIs) |

### AI / LLM Tooling

| File | Description |
|------|-------------|
| `claude-api.md` | Build/debug Anthropic SDK apps — prompt caching, tool use, model migrations |
| `context-engineering-prompt.md` | Systematic prompt design using role, task, format, constraints, examples |
| `langfuse-observability.md` | LLM tracing, evaluation, and cost monitoring via Langfuse |
| `llmops-deployment.md` | Canary deploys, rollback, and cost guardrails for AI systems in CI/CD |
| `mcp-builder.md` | Build MCP servers that expose tools, resources, and prompts to agents |
| `valyu-research.md` | Live web search + 36 specialized sources (SEC, PubMed, FRED, ClinicalTrials) |

### Frontend / Web

| File | Description |
|------|-------------|
| `frontend-design.md` | Production-grade UI — high design quality, avoids generic AI aesthetics |
| `webapp-testing.md` | Browser-based UI testing via Playwright |
| `firecrawl-webscraping.md` | Web scraping, crawling, and browser automation via Firecrawl |

### Backend / Infrastructure

| File | Description |
|------|-------------|
| `api-contract-first.md` | OpenAPI/AsyncAPI spec agreed upon before any implementation code |
| `database-migrations.md` | Safe schema migrations — column changes, type changes, data migrations |
| `incident-runbook.md` | On-call runbooks written before incidents happen |

### Security

| File | Description |
|------|-------------|
| `security-review.md` | OWASP Top 10, secrets, auth flaws, injection review before merge |
| `shannon-security.md` | Autonomous pen testing — 50+ vuln types, authorized/CTF/defensive use |

### Codebase Understanding

| File | Description |
|------|-------------|
| `understand-anything.md` | Multi-agent knowledge graph of any codebase — dependencies, data flows, call graphs |
| `addyosmani-agent-skills.md` | Google-culture engineering lifecycle — spec → impl → test → review → deploy |

### Skill Meta

| File | Description |
|------|-------------|
| `writing-skills.md` | Create, edit, and verify new SKILL.md files before deployment |
| `skill-optimizer.md` | Diagnose and improve existing skills using session data and static analysis |

---

## Key Repos & Directories

- [VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) — 1000+ skills, cross-platform
- [skillmatic-ai/awesome-agent-skills](https://github.com/skillmatic-ai/awesome-agent-skills) — modular capability focus
- [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) — production engineering pack
- [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) — integrations focus
- [microsoft/skills](https://github.com/microsoft/skills) — 174 skills with Skill Explorer
- [alirezarezvani/claude-skills](https://github.com/alirezarezvani/claude-skills) — 232+ skills across domains
- [anthropics/skills](https://github.com/anthropics/skills) — official Anthropic skills
- [Claude Code Skills Docs](https://code.claude.com/docs/en/skills) — official docs
- [Agent Skills Overview — Claude API](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
- [SKILL.md Pattern — GitBook](https://www.gitbook.com/blog/skill-md)
- [10 Must-Have Skills for Claude 2026 — Medium](https://medium.com/@unicodeveloper/10-must-have-skills-for-claude-and-any-coding-agent-in-2026-b5451b013051)
- [Best Claude Code Skills 2026 — Firecrawl](https://www.firecrawl.dev/blog/best-claude-code-skills)
- [Composio: Top Claude Skills 2026](https://composio.dev/content/top-claude-skills)
- [Benchmark: Agentic Skills in the Wild — arXiv](https://arxiv.org/html/2604.04323v1)
- [Scary Agent Skills — Embrace The Red (security)](https://embracethered.com/blog/posts/2026/scary-agent-skills/)

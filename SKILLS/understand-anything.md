---
name: understand-anything
description: Use when onboarding to a large or unfamiliar codebase, mapping dependencies between modules, or needing a visual knowledge graph of data flows and call graphs before making changes
---

# Understand Anything — Codebase Knowledge Graphs

## Overview

Build an interactive knowledge graph of any codebase using multi-agent LLM analysis. Maps dependencies, data flows, call graphs, and module relationships visually.

**Core principle:** Read broadly first, then generate structured maps. Never dive into implementation before understanding structure.

**Source:** [Lum1104/understand-anything](https://github.com/Lum1104/understand-anything)

## When to Use

- Onboarding to a large repo you've never seen
- Planning a refactor that touches multiple modules
- Debugging an issue with unknown blast radius
- Answering "where does X come from / go to?"

**Don't use for:** Single-file analysis, quick grep lookups, or repos under ~5 files.

## The Process

### Step 1: Entry Point Discovery

Identify the repo's top-level entry points:

```bash
# Find main/index files
find . -maxdepth 3 -name "main.*" -o -name "index.*" -o -name "app.*" | grep -v node_modules

# Find package/module manifests
ls package.json pyproject.toml Cargo.toml go.mod pom.xml 2>/dev/null
```

Read the manifest to understand declared dependencies and scripts before reading source.

### Step 2: Module Boundary Mapping

For each top-level directory, identify its purpose and public interface:

```bash
# List top-level structure
find . -maxdepth 2 -type d | grep -v "node_modules\|\.git\|__pycache__\|\.venv"
```

For each module, note:
- What it exports / exposes publicly
- What it imports from other modules
- What it imports from external packages

### Step 3: Dependency Graph Construction

Build an import/dependency map. Dispatch parallel agents for large repos — one per top-level module.

Each agent reports:
```
Module: <name>
Depends on: <internal-module-1>, <internal-module-2>
External deps: <package-1>, <package-2>
Exposes: <function/class list>
Key data flows: <input> → <transformation> → <output>
```

### Step 4: Call Graph Tracing (targeted)

For a specific feature or bug area, trace call chains:

```bash
# Find all callers of a function
grep -r "functionName(" --include="*.ts" --include="*.py" --include="*.go" -l

# Find all places a type is used
grep -r "TypeName" --include="*.ts" -n
```

Trace: entry point → intermediate calls → terminal side effects (DB writes, API calls, UI updates).

### Step 5: Produce the Knowledge Map

Output a structured summary:

```
## Architecture Overview
<2-3 sentences on overall shape>

## Module Map
| Module | Purpose | Key Dependencies |
|--------|---------|-----------------|
| auth/ | JWT validation, session management | crypto, db/users |
| api/ | HTTP routing, request handling | auth/, db/ |

## Critical Data Flows
1. User login: client → api/login → auth/validate → db/users → session store
2. <next flow>

## Dependency Clusters (things that change together)
- Cluster A: auth/ + db/users + middleware/
- Cluster B: api/ + serializers/ + types/

## Unknown / High Complexity Areas
- <module> — dense, needs deeper read before touching
```

### Step 6: Validate the Map

Before presenting, spot-check 2-3 claims by reading the actual files. Knowledge maps built from filenames and imports alone miss runtime wiring (dependency injection, dynamic requires, plugin systems).

Flag dynamic wiring explicitly: "This map is based on static imports — runtime registration patterns may add connections not shown."

## Quick Reference

| Goal | Step |
|------|------|
| Understand overall shape | Steps 1-2 |
| Find what depends on X | Step 3 (grep imports) |
| Trace a bug's blast radius | Step 4 (call graph) |
| Onboarding summary | All steps → Step 5 |

## Common Mistakes

**Starting with implementation files**
- Problem: Gets lost in details before understanding structure
- Fix: Always read manifests and top-level dirs first (Steps 1-2)

**Treating static import maps as complete**
- Problem: Misses plugin systems, DI containers, dynamic requires
- Fix: Flag dynamic wiring; validate with Step 6

**Mapping everything before scoping**
- Problem: Mapping a 500-file repo exhaustively is slow and rarely needed
- Fix: Scope to the area of interest. Full map only for onboarding.

**Skipping parallel agents on large repos**
- Problem: Sequential module analysis is slow
- Fix: Dispatch one agent per top-level module for Steps 2-3

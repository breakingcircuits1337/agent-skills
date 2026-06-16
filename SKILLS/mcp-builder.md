---
name: mcp-builder
description: Build Model Context Protocol (MCP) servers that expose tools, resources, and prompts to LLM agents. Use when creating integrations between AI agents and external systems, APIs, or data sources.
---

# MCP Builder Skill

## What Is MCP
Model Context Protocol (MCP) is the standard interface for connecting LLM agents to external capabilities. An MCP server exposes:
- **Tools** — functions the agent can call (read DB, send email, run query)
- **Resources** — data the agent can read (files, database records, API responses)
- **Prompts** — reusable prompt templates with parameters

**MCP vs. Skills:** MCP loads all tool definitions upfront (50K+ tokens for multi-server setups). Skills use progressive disclosure — names only until triggered. Use MCP for always-needed integrations; skills for occasional specialized workflows.

## Steps

### 1. Define the Interface First
Before writing code, specify:
```
Server name: my-database-server
Tools:
  - query_database(sql: string) → rows[]
  - get_schema(table: string) → schema
Resources:
  - database://tables → list of all tables
Prompts:
  - analyze_query(sql: string) → formatted analysis prompt
```

### 2. Scaffold the Server (Python)
```python
from mcp.server import Server
from mcp.server.stdio import stdio_server
import mcp.types as types

app = Server("my-server")

@app.list_tools()
async def list_tools() -> list[types.Tool]:
    return [
        types.Tool(
            name="query_database",
            description="Execute a read-only SQL query",
            inputSchema={
                "type": "object",
                "properties": {
                    "sql": {"type": "string", "description": "SQL SELECT statement"}
                },
                "required": ["sql"]
            }
        )
    ]

@app.call_tool()
async def call_tool(name: str, arguments: dict) -> list[types.TextContent]:
    if name == "query_database":
        results = await db.execute(arguments["sql"])
        return [types.TextContent(type="text", text=str(results))]
```

### 3. Scaffold the Server (TypeScript)
```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server({ name: "my-server", version: "1.0.0" });

server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [{
        name: "query_database",
        description: "Execute a read-only SQL query",
        inputSchema: { type: "object", properties: { sql: { type: "string" } }, required: ["sql"] }
    }]
}));
```

### 4. Register in Claude Config
```json
// ~/.claude/config.json or project .claude/settings.json
{
  "mcpServers": {
    "my-server": {
      "command": "python",
      "args": ["path/to/server.py"]
    }
  }
}
```

### 5. Security Checklist
- [ ] Tool descriptions accurately state what the tool does (agents trust descriptions)
- [ ] Read-only tools explicitly labeled as read-only
- [ ] Destructive tools require explicit confirmation
- [ ] No credentials passed through tool arguments (use environment variables)
- [ ] Input validation on all tool arguments before execution

## Quality Gates
- [ ] Tool descriptions are specific and accurate (agents make decisions based on them)
- [ ] All tools handle errors gracefully (return error text, don't crash the server)
- [ ] Server tested with `mcp inspect` or similar before connecting to agent
- [ ] Credentials in environment, not code
- [ ] Read vs. write tools clearly distinguished

## Anti-Patterns
| Anti-Pattern | Consequence |
|-------------|-------------|
| Vague tool descriptions | Agent calls wrong tool or calls tool for wrong purpose |
| No input validation | Injection, crashes, data corruption |
| All tools in one server | Hard to maintain; all-or-nothing loading |
| Synchronous blocking calls | Hangs the agent during long operations |

## References
- [MCP Documentation](https://modelcontextprotocol.io/docs)
- [Firecrawl: Best MCP Servers 2026](https://www.firecrawl.dev/blog/best-mcp-servers-for-developers)
- [VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills)

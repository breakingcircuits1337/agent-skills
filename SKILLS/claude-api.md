---
name: claude-api
description: Build, debug, and optimize Claude API / Anthropic SDK apps. Handles prompt caching, tool use, model migrations, batch processing, citations, memory, and streaming. Trigger on any file importing anthropic or @anthropic-ai/sdk.
---

# Claude API Skill

## When to Use
- File imports `anthropic` or `@anthropic-ai/sdk`
- User asks about Anthropic SDK usage, tool use, or model configuration
- Migrating between Claude model versions (4.5 → 4.6 → 4.7)
- Adding/tuning: caching, thinking, tool use, batch, files, citations, memory
- Questions about prompt caching or cache hit rates

## Skip When
- File imports `openai` or another provider SDK
- Filename contains `-openai.py` or `-generic.py`
- Provider-neutral or general ML code

## Current Model IDs (May 2026)
| Model | ID |
|-------|----|
| Claude Opus 4.7 | `claude-opus-4-7` |
| Claude Sonnet 4.6 | `claude-sonnet-4-6` |
| Claude Haiku 4.5 | `claude-haiku-4-5-20251001` |

**Default to the latest model unless the user specifies otherwise.**

## Steps

### 1. Prompt Caching (Always Include)
Every Anthropic SDK app should use prompt caching. Add `cache_control` to large, stable content:

```python
messages=[{
    "role": "user",
    "content": [
        {
            "type": "text",
            "text": large_stable_system_content,
            "cache_control": {"type": "ephemeral"}
        },
        {"type": "text", "text": user_message}
    ]
}]
```

Cache TTL is 5 minutes. Content must be 1024+ tokens to be eligible.

### 2. Tool Use Pattern
```python
tools = [{
    "name": "tool_name",
    "description": "Clear description of what this tool does",
    "input_schema": {
        "type": "object",
        "properties": {
            "param": {"type": "string", "description": "..."}
        },
        "required": ["param"]
    }
}]
```

### 3. Streaming
Use streaming for any response > ~500 tokens to improve perceived latency:
```python
with client.messages.stream(...) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```

### 4. Model Migration Checklist
- [ ] Update model ID string to current version
- [ ] Check for deprecated parameters (`max_tokens_to_sample` → `max_tokens`)
- [ ] Verify tool use schema format matches current API spec
- [ ] Test cache hit rate after migration (TTL resets)

## Quality Gates
- [ ] Prompt caching enabled on all large/stable content
- [ ] Error handling on `anthropic.APIError`, `anthropic.RateLimitError`
- [ ] No hardcoded model strings in library code — accept as parameter
- [ ] Streaming used for long-form generation

## References
- [Anthropic API Docs](https://platform.claude.com/docs)
- [anthropics/skills — claude-api SKILL.md](https://github.com/anthropics/skills/blob/main/skills/claude-api/SKILL.md)

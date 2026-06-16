---
name: langfuse-observability
description: Add LLM tracing, evaluation, and observability to AI agent applications using Langfuse. Use when building or debugging LLM pipelines, tracking costs, evaluating output quality, or setting up production monitoring for AI workflows.
---

# Langfuse — LLM Observability Skill

## When to Use
- Building any LLM-powered application going to production
- Debugging unexpected agent behavior
- Tracking token costs across runs
- Evaluating output quality at scale
- Setting up CI/CD quality gates for AI features
- Migrating or comparing prompts across model versions

## Core Concepts
| Concept | What It Is |
|---------|-----------|
| **Trace** | One complete user request (may contain many LLM calls) |
| **Span** | A single step in the trace (LLM call, tool use, retrieval) |
| **Generation** | The specific LLM call — model, prompt, response, tokens, cost |
| **Score** | Evaluation result attached to a trace (human or automated) |
| **Prompt** | Versioned, managed prompt stored in Langfuse |

## Steps

### 1. Install and Authenticate
```bash
pip install langfuse
# or
npm install langfuse
```
```python
from langfuse import Langfuse
langfuse = Langfuse(
    public_key="pk-...",
    secret_key="sk-...",
    host="https://cloud.langfuse.com"  # or self-hosted URL
)
```

### 2. Instrument Your LLM Calls
```python
from langfuse.decorators import observe, langfuse_context

@observe()
def run_agent(user_input: str) -> str:
    # All LLM calls inside @observe() are auto-traced
    response = llm.generate(user_input)
    return response
```

For manual instrumentation:
```python
trace = langfuse.trace(name="agent-run", user_id="user-123")
generation = trace.generation(
    name="main-llm-call",
    model="claude-sonnet-4-6",
    input=messages,
    output=response.content,
    usage={"input": response.usage.input_tokens, "output": response.usage.output_tokens}
)
```

### 3. Manage Prompts (Version Control for Prompts)
```python
# Fetch versioned prompt — enables A/B testing and rollback
prompt = langfuse.get_prompt("my-system-prompt", version=3)
compiled = prompt.compile(user_name="Alice", task="summarize")
```

### 4. Run Evaluations
```python
# Attach a score to a trace
trace.score(name="faithfulness", value=0.87, comment="Grounded in source docs")

# Or use LLM-as-judge for automated eval
langfuse.score(trace_id=trace.id, name="correctness", value=1.0)
```

### 5. Set Up CI/CD Quality Gates
```python
# In your test suite — fail if quality drops below threshold
scores = langfuse.get_scores(name="correctness", trace_ids=test_trace_ids)
avg_score = sum(s.value for s in scores) / len(scores)
assert avg_score >= 0.85, f"Quality gate failed: {avg_score:.2f} < 0.85"
```

## Quality Gates
- [ ] Every production LLM call has a trace
- [ ] Token usage and cost tracked per trace
- [ ] At least one automated eval running on new deployments
- [ ] Prompt versions managed in Langfuse (not hardcoded strings)
- [ ] Quality gate in CI blocks deploy if score regresses

## Anti-Patterns
| Anti-Pattern | Consequence |
|-------------|-------------|
| Tracing only in dev, not prod | Blind to production failures |
| No user_id on traces | Can't debug per-user issues |
| Evaluating only on happy-path examples | Misses edge case regressions |
| Hardcoded prompts in code | Can't iterate without deploys |

## References
- [Langfuse GitHub Skills](https://github.com/langfuse/skills)
- [Langfuse Docs](https://langfuse.com/docs)
- [Top 5 LLM Observability Tools 2026 — MLflow](https://mlflow.org/top-5-agent-observability-tools/)

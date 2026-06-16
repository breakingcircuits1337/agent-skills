---
name: llmops-deployment
description: Deploy LLM-powered applications using LLMOps best practices. Covers canary deployments for prompt/model changes, rollback strategies, cost guardrails, and quality gates in CI/CD pipelines for AI systems.
---

# LLMOps Deployment Skill

## What Makes LLM Deployments Different
Traditional code deployments fail or succeed. LLM deployments *degrade* — output quality drops gradually, costs spike, latency increases. Standard CI/CD doesn't catch this. LLMOps extends DevOps with AI-specific quality gates.

## When to Use
- Deploying a new model version (Sonnet 4.6 → Opus 4.7)
- Shipping a prompt change to production
- Rolling out a new agent workflow
- Investigating a production quality regression
- Setting up CI/CD for an AI feature

## Deployment Types

| Type | When to Use | Rollback Strategy |
|------|-------------|------------------|
| **Prompt-only change** | Prompt wording, system instructions | Revert in prompt management (Langfuse/PromptLayer) |
| **Model version bump** | New Claude model | Feature flag; A/B on traffic split |
| **Agent architecture** | New tools, workflow, memory | Blue/green; shadow mode first |
| **Full application** | New features | Standard canary + LLM-specific eval gates |

## Steps

### 1. Pre-Deploy Eval Suite
Before any LLM change ships, run your golden set:
```bash
# Run eval suite against new prompt/model
python evals/run_golden_set.py \
  --model claude-opus-4-7 \
  --prompt-version v2 \
  --dataset evals/golden_set.jsonl \
  --threshold 0.85
```

The eval suite must:
- Cover your top 20 real production use cases
- Include edge cases from past incidents
- Measure: correctness, faithfulness, format compliance, safety

### 2. Shadow Mode (New Agents Only)
Run new agent in parallel with production for 24-48 hours:
- Route 100% of traffic to old agent
- Also send to new agent (shadow)
- Compare outputs; don't serve new agent's responses yet
- Check for: unexpected tool calls, cost spikes, output format drift

### 3. Canary Rollout
```
5% traffic → monitor 1 hour → 
20% → monitor 2 hours → 
50% → monitor 4 hours → 
100%
```

Monitor at each step:
- **Quality**: eval scores on live traffic sample
- **Cost**: tokens per request vs. baseline
- **Latency**: p50/p95/p99 response time
- **Error rate**: failed completions, guardrail triggers

### 4. Cost Guardrails
```python
# Set hard cost ceiling per request
MAX_TOKENS_PER_REQUEST = 4096
MAX_DAILY_SPEND_USD = 500

# Alert at 80%, block at 100%
if daily_spend > MAX_DAILY_SPEND_USD * 0.8:
    alert("Cost approaching daily limit")
if daily_spend >= MAX_DAILY_SPEND_USD:
    raise CostLimitExceeded("Daily spend limit reached")
```

### 5. Rollback Trigger Criteria
Auto-rollback if any of:
- Eval score drops > 5% from baseline
- p95 latency increases > 50%
- Error rate > 2%
- Cost per request increases > 30%

```bash
# Automated rollback
if eval_score < (baseline_score * 0.95):
    deploy rollback --to-version previous
    alert("Auto-rollback triggered: quality regression")
```

## Quality Gates
- [ ] Golden eval set exists and covers top use cases
- [ ] Eval gate in CI blocks deploy if score < threshold
- [ ] Cost guardrails set with alert + block thresholds
- [ ] Rollback procedure documented and tested
- [ ] Shadow mode run before first production deploy of new agent architecture

## Anti-Patterns
| Anti-Pattern | Consequence |
|-------------|-------------|
| "Looks good in dev" deploy straight to 100% | Instant quality incident |
| No eval suite | No way to know quality changed |
| Cost alerts but no hard limits | Surprise $10k bill |
| Model version bump without eval | Output format/quality can shift unexpectedly |

## References
- [LLMOps is the New DevOps — LangWatch](https://langwatch.ai/blog/llmops-is-the-new-devops-here-s-what-every-developer-must-know)
- [Langfuse CI/CD Quality Gates](https://langfuse.com/docs/scores/overview)
- [Top 5 LLM Observability Tools 2026 — MLflow](https://mlflow.org/top-5-agent-observability-tools/)

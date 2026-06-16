---
name: skill-optimizer
description: Diagnose and optimize existing SKILL.md files using real session data and research-backed static analysis. Use when a skill is triggering incorrectly, producing poor output, or needs improvement after real-world use.
---

# skill-optimizer — Meta Skill for Skill Authors

## What This Does
Most people treat skills as write-once artifacts. This skill treats SKILL.md files as software — with bugs, performance issues, and technical debt that can be diagnosed and fixed.

## When to Use
- A skill triggers when it shouldn't (false positives)
- A skill doesn't trigger when it should (false negatives)
- Agent output quality is inconsistent despite having a skill installed
- You want to improve a skill based on real session data
- Preparing a skill for public release or community use

## Diagnostic Dimensions

### 1. Trigger Clarity (Frontmatter)
The `description` field is the only signal an agent uses to decide whether to load the skill. Diagnose:
- Is it specific enough to avoid false positives?
- Is it broad enough to catch all intended use cases?
- Does it conflict with other installed skills?

**Trigger quality rubric:**
| Score | Characteristic |
|-------|---------------|
| Poor | "Use for coding tasks" (too broad) |
| Fair | "Use when writing Python code" (better) |
| Good | "Use when implementing data pipelines with pandas or polars" (specific) |
| Excellent | Includes both positive and negative examples in the description |

### 2. Runbook Completeness (Body)
- Are all steps actionable (not vague)?
- Does each step have a clear completion condition?
- Are anti-patterns documented alongside patterns?
- Are quality gates checkable (yes/no), not subjective?

### 3. Anti-Rationalization Coverage
LLM agents will rationalize skipping steps. Good skills include:
- A table of common skip-rationalizations and why they're wrong
- Explicit "do not proceed without" gates
- Verification commands the agent must run and read

### 4. Session Data Analysis
If you have session logs:
- Count trigger rate vs. expected trigger rate
- Identify steps most often skipped
- Find outputs that diverged from skill intent

## Steps

### 1. Static Analysis
Read the skill and score each dimension above (1-5). Flag anything below 3.

### 2. Trigger Test
Write 5 prompts that *should* trigger the skill and 5 that *should not*. Test each. Adjust description until precision and recall are both high.

### 3. Step Audit
For each step in the runbook:
- Can an agent complete this step without ambiguity?
- Is the completion condition verifiable?
- Does skipping this step have a documented consequence?

### 4. Rewrite
Apply fixes. Keep changes minimal — over-engineering a skill makes it brittle.

### 5. Regression Test
Re-run the trigger tests from Step 2 after rewriting.

## Quality Gates
- [ ] Trigger tested against 10 prompts (5 positive, 5 negative)
- [ ] Every step has a checkable completion condition
- [ ] Anti-rationalization table present
- [ ] Skill tested in real session before declaring done

## References
- [hqhq1025/skill-optimizer](https://github.com/hqhq1025/skill-optimizer)
- [SKILL.md Pattern — GitBook](https://www.gitbook.com/blog/skill-md)
- [Anthropic: Writing Agent Skills](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)

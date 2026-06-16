---
name: context-engineering-prompt
description: Build and refine LLM prompts systematically using context engineering principles. Use when designing system prompts, agent instructions, or skill files. Applies role, task, format, constraints, and examples structure.
---

# Context Engineering / Prompt Engineering Skill

## Core Insight
Prompt quality is not about magic words — it's about **context completeness**. A model can only perform as well as the context it's given. Every gap in context is a gap in output quality.

## The 5-Layer Context Model

### Layer 1 — Role
Who is the model playing? A role primes the model's vocabulary, reasoning style, and domain knowledge.
```
"You are a senior security engineer with 10 years of experience in web application penetration testing."
```
Not: "You are a helpful assistant."

**Specificity matters:**
| Weak Role | Strong Role |
|-----------|------------|
| "You are an expert" | "You are a staff engineer at a fintech company who has shipped 3 payment systems" |
| "You are a writer" | "You are a technical writer who produces API documentation for developer audiences" |

### Layer 2 — Task
What exactly must be produced? Specify:
- The action verb (write, analyze, refactor, summarize, evaluate)
- The object (this function, this PR, this dataset)
- The constraint (in under 200 words, without changing the interface, for a junior audience)

```
"Analyze the authentication flow in the attached code and identify any session management vulnerabilities. Focus on OWASP A07:2021. Output a prioritized list of findings."
```

### Layer 3 — Format
How should the output be structured? Specify:
- Output format (markdown, JSON, bullet list, numbered steps)
- Length constraints (max tokens, sentences, or items)
- Sections required (e.g., "include: Summary, Findings, Recommendations")
- Examples of ideal output (few-shot)

### Layer 4 — Constraints
What must the model NOT do?
- Topics to avoid
- Assumptions to not make
- Styles to not use
- Information not available to it

Constraints prevent the model from filling context gaps with hallucinated content.

### Layer 5 — Examples (Few-Shot)
The highest-leverage layer. Show don't tell:
```
Input:  [example input]
Output: [ideal output]

Input:  [another example]
Output: [ideal output]

Input:  [actual input]
Output: ???
```

3 examples typically outperform any amount of instruction text.

## Steps

### 1. Draft the Core Task
Write one sentence: "Given [input], produce [output] for [audience]."

### 2. Add Role
Who needs to produce this output? Add the minimal role that activates the right domain knowledge.

### 3. Specify Format
What does success look like? Write the structure of the ideal output before writing the prompt.

### 4. Add Constraints
What would a model likely get wrong without explicit guidance? Add one constraint per failure mode.

### 5. Collect Examples
Find or write 2-3 input/output pairs that demonstrate the ideal behavior. Include edge cases.

### 6. Test and Iterate
Run the prompt. For each failure:
- Is it a role problem? (wrong domain)
- Is it a task problem? (wrong action)
- Is it a format problem? (wrong structure)
- Is it a constraints problem? (missing guardrails)
- Is it an examples problem? (wrong demonstrations)

Fix the layer that's failing, not the whole prompt.

## SKILL.md-Specific Application
When writing a SKILL.md:
- **Frontmatter description** = Layer 2 (task trigger) + Layer 1 (implicit role)
- **Steps section** = Layer 2 (tasks) + Layer 4 (constraints)
- **Anti-patterns table** = Layer 4 (constraints)
- **Quality gates** = Layer 3 (format/completion criteria)
- **References** = Layer 5 (examples via documentation)

## Quality Gates
- [ ] Role is specific to a domain, not generic
- [ ] Task includes action verb + object + constraint
- [ ] Output format specified with structure, not just type
- [ ] At least one constraint per common failure mode
- [ ] At least 2 examples if the output format is non-obvious

## References
- [NeoLabHQ/context-engineering-kit](https://github.com/NeoLabHQ/context-engineering-kit/blob/master/plugins/customaize-agent/skills/prompt-engineering/SKILL.md)
- [Prompt Engineering Guide](https://www.promptingguide.ai/techniques)
- [Lakera: Ultimate Guide to Prompt Engineering 2026](https://www.lakera.ai/blog/prompt-engineering-guide)

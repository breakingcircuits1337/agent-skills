---
name: writing-skills
description: Use when creating new SKILL.md files, editing existing skills, or verifying skills work before deployment. Enforces frontmatter schema, trigger precision, runbook completeness, and real-world testing before release.
---

# Writing Skills Skill

## Core Rule
A skill that hasn't been tested in a real session is a hypothesis, not a skill.

## When to Use
- Creating a new SKILL.md from scratch
- Editing an existing skill after identifying a failure
- Preparing a skill for public release or team sharing
- Auditing a skill library for quality

## SKILL.md Schema

### Required Frontmatter
```yaml
---
name: kebab-case-skill-name          # lowercase, hyphens, no spaces
description: [trigger sentence]      # how the agent decides to load this skill
---
```

**Description quality requirements:**
- Specific enough to avoid false positives
- Broad enough to catch all intended use cases
- Starts with an action verb ("Use when...", "Build...", "Diagnose...")
- Includes negative cases where useful ("Skip when...")

### Required Body Sections
1. **When to Use** — positive trigger conditions (specific)
2. **When NOT to Use / Skip When** — negative conditions (prevents false positives)
3. **Steps** — numbered, actionable, with completion conditions
4. **Anti-Patterns** — common failure modes as a table
5. **Quality Gates** — checkboxes, each yes/no verifiable
6. **References** — source links

### Optional Sections
- **Core Rule** — the one thing that must not be violated
- **Templates** — example output format
- **Quick Reference** — lookup table for common decisions

## Steps

### 1. Define the Trigger First
Write the `description` field before writing the body. If you can't write a crisp one-sentence trigger, the skill's scope is unclear.

Test the trigger:
- Write 5 prompts that should trigger this skill → will the description match them?
- Write 5 that should not → will the description avoid them?

### 2. Write Steps as Imperative Commands
Each step should be:
```
BAD:  "Consider the user's requirements"
GOOD: "List all user requirements as bullet points. Stop if any are ambiguous — ask one clarifying question."
```

The agent should be able to execute each step without judgment calls.

### 3. Write Anti-Patterns Before Quality Gates
Anti-patterns encode the failure modes you already know about. Write them first — they often reveal missing steps.

### 4. Write Quality Gates as Checklists
Each gate must be binary (done / not done). No subjective gates:
```
BAD:  "[ ] Code is good quality"
GOOD: "[ ] All functions have at least one test"
```

### 5. Test in a Real Session
Before publishing:
- Install the skill in Claude Code
- Run 3 real tasks that should trigger it
- Check: did it trigger? Did output follow the runbook? Did quality gates pass?
- Fix anything that failed. Repeat.

### 6. Version and Document
If modifying an existing skill, note what changed and why in a comment at the bottom (outside the frontmatter):

```markdown
<!-- v2: Added anti-rationalization table after observing agents skip Step 3 in production -->
```

## Anti-Patterns
| Anti-Pattern | Consequence |
|-------------|-------------|
| Vague trigger description | Triggers on everything or nothing |
| Steps without completion conditions | Agent doesn't know when to move on |
| No anti-patterns section | Known failures not prevented |
| Subjective quality gates | Agents self-report passing when they haven't |
| Publishing without real-session testing | Ships broken, used in production wrong |
| Skill body over 500 lines | Agents stop following it precisely past ~200 instructions |

## Skill Length Guidelines
| Section | Target Length |
|---------|--------------|
| Frontmatter description | 1-2 sentences |
| When to Use | 3-6 bullets |
| Steps | 4-8 steps, each 2-5 lines |
| Anti-patterns table | 4-8 rows |
| Quality gates | 4-6 checkboxes |
| Total body | Under 300 lines |

## Quality Gates
- [ ] Trigger tested against 10 prompts (5 positive, 5 negative)
- [ ] Every step is an imperative command with a completion condition
- [ ] Anti-patterns table has at least 4 rows
- [ ] All quality gates are binary (yes/no checkable)
- [ ] Skill tested in at least 3 real sessions before release
- [ ] Total length under 300 lines

## References
- Anthropic Official Skill (superpowers:writing-skills)
- [SKILL.md Pattern — GitBook](https://www.gitbook.com/blog/skill-md)
- [Deep Dive SKILL.md — Medium](https://abvijaykumar.medium.com/deep-dive-skill-md-part-1-2-09fc9a536996)
- [Agent Skills Overview — Anthropic](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
- [Claude Code Skills Docs](https://code.claude.com/docs/en/skills)

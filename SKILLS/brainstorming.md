---
name: brainstorming
description: Use before any creative work — creating features, building components, adding functionality, or modifying behavior. Explores user intent, requirements, and design trade-offs before implementation. Must be invoked before writing code on ambiguous requests.
---

# Brainstorming Skill

## Core Rule
**Never start implementing an ambiguous request without first aligning on intent.**

The fastest path to wrong code is writing it immediately. A 5-minute alignment step prevents hours of rework.

## When to Use
- User asks to "build X" or "add Y" without specifying how
- Multiple valid approaches exist with different trade-offs
- You're about to write more than 50 lines of new code
- The feature involves user-facing behavior (UX decisions)
- You're designing something that other code will depend on

## When to Skip
- Purely mechanical tasks ("rename this variable", "fix this syntax error")
- Clear, unambiguous bug fixes with an obvious cause
- Small isolated changes with no design surface

## Steps

### 1. Restate the Goal
In one sentence: what outcome is the user trying to achieve? Not what they said — what they *want*.

If unsure, ask:
- "Is the goal X or Y?" (two specific options)
- "Is this for [context A] or [context B]?"

Never ask open-ended "what do you want?" — offer specific choices.

### 2. Surface Constraints
Identify limits that narrow the solution space:
- **Technical**: existing stack, performance requirements, compatibility
- **Product**: user expectations, existing behavior to preserve
- **Time**: how much complexity is acceptable?
- **Scope**: what's in and out for this change?

### 3. Generate Options (Not Just One)
Produce 2-3 distinct approaches. For each:
```
Approach A: [Name]
- How it works: [1 sentence]
- Trade-offs: [pro vs. con]
- Best when: [specific condition where this is right]
```

Avoid presenting one option dressed up as "the approach."

### 4. Make a Recommendation
Pick one with reasoning:
```
Recommendation: Approach B
Because: [specific reason tied to the user's constraints]
Trade-off accepted: [what you're giving up]
```

### 5. Confirm Before Building
Surface the recommendation to the user. Give them a chance to redirect before investment. One sentence is enough — not a dissertation.

## Brainstorming Quality Rubric
| Dimension | Poor | Good |
|-----------|------|------|
| Goal clarity | Paraphrase of user's words | Independent restatement of outcome |
| Options | One option | 2-3 genuinely distinct approaches |
| Trade-offs | None listed | Explicit pros/cons per approach |
| Recommendation | None or vague | Specific with reasoning |
| Confirmation | Dive straight into code | One-line check-in with user |

## Anti-Patterns
| Anti-Pattern | Consequence |
|-------------|-------------|
| Starting to code as "exploration" | User sees half-built things and anchors on them |
| Listing 5+ options | Decision paralysis; shifts burden to user |
| Asking "what do you think?" | User has to do your job |
| Skipping if it "seems obvious" | Obvious to whom? |

## Quality Gates
- [ ] User's goal restated independently (not paraphrased)
- [ ] At least 2 approaches with trade-offs documented
- [ ] Recommendation made with specific reasoning
- [ ] User given chance to redirect before implementation begins

## References
- Anthropic Official Skill (superpowers:brainstorming)
- [Equipping Agents for the Real World — Anthropic Engineering](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)

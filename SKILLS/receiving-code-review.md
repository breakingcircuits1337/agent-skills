---
name: receiving-code-review
description: Use when receiving code review feedback before implementing suggestions. Requires technical verification — not performative agreement. Especially important when feedback seems unclear or technically questionable.
---

# Receiving Code Review Skill

## Core Rule
**Do not implement review feedback before verifying it is correct.**

This is counter-intuitive but critical. Reviewers are not always right. Blindly implementing all suggestions introduces bugs, regressions, and architectural drift.

## The Problem This Solves
Default agent behavior when receiving code review:
1. Read feedback
2. Say "Great point, I'll fix that"
3. Implement change
4. Claim success

This is performative agreement. The change may be wrong, the reviewer may have missed context, or the "fix" may introduce a new problem.

## Steps

### 1. Categorize Each Piece of Feedback
| Category | Description | Action |
|----------|-------------|--------|
| **Clear bug** | Reviewer found a definite error | Verify, then fix |
| **Style/preference** | Subjective formatting or naming | Discuss, then decide |
| **Design concern** | Architectural or pattern question | Investigate before changing |
| **Factual claim** | Reviewer asserts something about code behavior | Verify the claim first |
| **Misunderstanding** | Reviewer missed context | Clarify, don't change |

### 2. Verify Before Implementing
For any feedback that is a **factual claim** or **design concern**:
- Read the relevant code sections
- Run the affected tests
- Check if the concern actually applies to *this* codebase
- Look up referenced patterns or documentation

### 3. Disagree Constructively When Warranted
If verification shows the reviewer is wrong:
```
"I checked this and [specific evidence]. The current implementation is correct because [reason].
If I'm missing something, can you point to a specific case where this fails?"
```

### 4. Implement Verified Changes
Only implement changes that:
- [ ] You understand the *why*, not just the *what*
- [ ] You've verified won't break existing behavior
- [ ] You can explain to a third party

### 5. Test After Each Change
- Run the test suite
- Run linters
- Check for type errors
- Read the diff yourself as a new reviewer would

## Anti-Patterns
| Anti-Pattern | Why It's Harmful |
|-------------|-----------------|
| "LGTM, fixing everything" | Introduces unverified changes |
| Implementing conflicting suggestions from multiple reviewers | Creates inconsistent codebase |
| Changing code you don't understand to satisfy a reviewer | Moves bugs, doesn't remove them |
| Not running tests after applying review | Silent regressions |

## Quality Gates
- [ ] Every factual claim in the review verified against actual code
- [ ] No changes implemented that you can't explain
- [ ] Tests pass after each applied suggestion
- [ ] Disagreements documented with evidence, not dropped

## References
- Anthropic Official Skill (superpowers:receiving-code-review)
- [Google Engineering Practices — Code Review](https://google.github.io/eng-practices/review/)

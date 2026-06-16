---
name: systematic-debugging
description: Use when encountering any bug, test failure, or unexpected behavior before proposing fixes. Enforces hypothesis-driven debugging — no random code mutations allowed.
---

# Systematic Debugging Skill

## Core Rule
**No code changes without a confirmed hypothesis.**

Randomly changing code to see if it fixes a bug is not debugging — it's noise injection. Every change must be preceded by a specific, testable hypothesis about the root cause.

## When to Use
- Any bug report or test failure
- Unexpected runtime behavior
- "It was working before" situations
- Performance regressions
- Error messages you don't immediately understand

## The Debugging Loop

```
Observe → Hypothesize → Test Hypothesis → Confirm Root Cause → Fix → Verify
```

Never skip steps. Never go backwards (don't start fixing before confirming).

## Steps

### 1. Reproduce the Failure
Before anything else: can you reproduce it?
- Run the exact failing test or command
- Note the exact error message, stack trace, and context
- If you can't reproduce it, you can't fix it — stop and find repro steps first

### 2. Gather Evidence
Collect without interpreting yet:
- Full error message + stack trace
- What changed recently (git log, recent diffs)
- What environment this fails in vs. works in
- Any relevant logs

### 3. Narrow the Scope
Use binary search thinking:
- Is the failure in A or B? → Check A. If not A, it's B.
- Add logging at the midpoint of the call stack
- Comment out code to find the minimal failing case

### 4. Form a Hypothesis
One specific, falsifiable statement:
```
"The failure is caused by [specific thing] because [evidence]."
```

Not: "I think something is wrong with the auth module."
Yes: "The JWT is expiring before the request completes because the clock on the test server is 2 hours behind."

### 5. Test the Hypothesis
Design a test that would **disprove** the hypothesis if it's wrong:
- Add a targeted log statement
- Write a minimal reproduction script
- Check the specific condition the hypothesis claims

### 6. Confirm Root Cause
If the hypothesis test confirms it: you have the root cause. If not: back to step 3 with new evidence.

**Do not fix until root cause is confirmed.**

### 7. Fix
Make the minimal change that addresses the root cause. No opportunistic cleanup during bug fixes.

### 8. Verify
- Run the originally failing test/command → must pass now
- Run the full test suite → must not regress
- Confirm the fix addresses root cause, not just symptoms

## Anti-Patterns
| Anti-Pattern | Consequence |
|-------------|-------------|
| Changing multiple things at once | Can't tell what fixed it; may re-introduce bug later |
| "Let me try X and see if it helps" | Random walk; generates noise |
| Fixing before reproducing | May fix the wrong thing |
| Stopping after symptoms disappear | Root cause still present |
| Googling the error and copying a fix | Cargo-cult debugging |

## Quality Gates
- [ ] Failure reproduced before any code changes
- [ ] Hypothesis written as a specific falsifiable statement
- [ ] Hypothesis tested (not just assumed)
- [ ] Root cause confirmed before fix applied
- [ ] Originally failing test passes after fix
- [ ] Full test suite passes after fix

## References
- Anthropic Official Skill (superpowers:systematic-debugging)
- [Rubber Duck Debugging](https://en.wikipedia.org/wiki/Rubber_duck_debugging)

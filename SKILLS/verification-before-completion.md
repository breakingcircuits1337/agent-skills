---
name: verification-before-completion
description: Use before claiming work is complete, fixed, or passing — before committing or creating PRs. Requires running verification commands and reading actual output before any success claim. Evidence before assertions, always.
---

# Verification Before Completion Skill

## Core Rule
**Never claim success without evidence from actual command output.**

This skill exists because LLMs have a strong prior toward claiming completion. "The tests pass," "it's fixed," "the build succeeds" — these statements must be backed by real output, not inference.

## The Problem This Solves
Default completion behavior:
1. Write code
2. Reason that it *should* work
3. Claim "done" or "tests pass"

This hallucinates success. Code that looks right can fail for dozens of reasons: import errors, environment issues, logic bugs, type errors, missing files, network timeouts.

## Required Evidence by Claim Type

| Claim | Required Evidence |
|-------|------------------|
| "Tests pass" | Actual test runner output showing pass count and 0 failures |
| "Build succeeds" | Compiler/bundler output with no errors |
| "It's fixed" | The specific failure reproduced, then not reproduced after fix |
| "No type errors" | Type checker output (`mypy`, `tsc`, etc.) showing 0 errors |
| "Lint passes" | Linter output showing 0 violations |
| "PR is ready" | All of the above, plus diff reviewed |

## Steps

### 1. Identify All Verification Commands
Before claiming done, list every command that must pass:
```
□ Run: <test command>        Expected: 0 failures
□ Run: <build command>       Expected: exit code 0
□ Run: <type check command>  Expected: 0 errors
□ Run: <lint command>        Expected: 0 violations
```

### 2. Run Each Command
Do not skip. Do not assume. Run every command and read the output.

### 3. Read the Actual Output
- Check the exit code
- Count failures/errors (not just "no red text")
- Look for warnings that indicate future failures
- Check that the right tests ran (not zero tests passing)

### 4. If Anything Fails
Stop. Do not claim partial completion. Fix the failure, then restart verification from step 2.

### 5. Only Then Claim Done
After all commands pass and output is read, you may claim completion — and must include the evidence:
```
Tests: 47 passed, 0 failed (pytest output)
Build: exit 0 (webpack output)
Types: 0 errors (tsc output)
```

## Anti-Patterns
| Anti-Pattern | Reality |
|-------------|---------|
| "It should work based on the code" | Should ≠ does |
| "I didn't change that file, tests still pass" | Side effects exist |
| "The error was in a different area" | Run everything anyway |
| "Just a small fix, no need to test" | Most incidents are "small fixes" |
| Showing expected output without running | Fabricated evidence |

## Quality Gates
- [ ] Every verification command listed before running any
- [ ] Every command run and output read (not skimmed)
- [ ] Zero failures in all checks
- [ ] Actual output included in completion report

## References
- Anthropic Official Skill (superpowers:verification-before-completion)
- [arXiv: Benchmarking LLM Skill Usage in Realistic Settings](https://arxiv.org/html/2604.04323v1)

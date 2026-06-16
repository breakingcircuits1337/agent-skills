---
name: andrej-karpathy-skills
description: Use when starting any coding session to guard against known LLM coding failure modes - blocks overconfident claims, scope creep, skipped verification, and other anti-patterns distilled from Karpathy's observations about AI coding agents
---

# Andrej Karpathy Anti-Patterns Guard

## Overview

Blocks known LLM coding failure modes before they happen. Distilled from Andrej Karpathy's viral observations about how AI coding agents fail in practice.

**Source:** [forrestchang/andrej-karpathy-skills](https://github.com/forrestchang/andrej-karpathy-skills)

**Core principle:** AI agents are confident by default. Confidence without verification causes real damage. These rules exist to counteract default agent tendencies.

## The Anti-Patterns (and Their Counters)

### 1. Hallucinating Success

**The failure:** Agent claims "tests pass", "it's working", "the bug is fixed" without actually verifying.

**The counter:**
- Never claim success without running the command and reading the output
- If you can't run verification, say so explicitly — don't assume
- "It should work" is not "it works"

### 2. Scope Creep ("While I'm Here...")

**The failure:** Asked to fix a bug → rewrites the whole module. Asked to add a field → refactors the schema.

**The counter:**
- Do exactly what was asked. Nothing more.
- If you notice something worth fixing, mention it — don't silently fix it
- "The user would probably want me to..." is a rationalization, not a requirement

### 3. Confident Wrong Answers

**The failure:** Agent states incorrect facts about APIs, function signatures, or behavior with full confidence. No hedging. Wrong.

**The counter:**
- When uncertain about an API or signature, check it — don't guess
- Prefer "let me verify" over confidently stating something you're not sure about
- Hedging is not weakness. "I believe X, let me confirm" is correct behavior.

### 4. Skipping the Failing Test

**The failure:** Agent fixes a bug by making the symptom disappear, without verifying the root cause is gone.

**The counter:**
- Write a test that reproduces the bug first
- The fix isn't done until the test passes
- "It looks fixed" without a reproducing test is not fixed

### 5. Context Window Amnesia

**The failure:** In long sessions, agent forgets earlier constraints, decisions, or requirements. Contradicts its own prior work.

**The counter:**
- Re-read relevant prior decisions before making new ones in long sessions
- If you've drifted, say so: "Earlier we decided X — I want to make sure this is consistent"
- Don't assume you remember everything from 50+ messages ago

### 6. The Optimistic Diff

**The failure:** Agent makes a change, describes it as "small" or "minimal", but the actual diff is large and touches unrelated code.

**The counter:**
- Before saying a change is small, count what you actually touched
- List files modified in your summary — don't hide scope
- If a "small fix" became large, explain why

### 7. Inventing APIs

**The failure:** Agent uses library functions, CLI flags, or framework features that don't exist. The code looks plausible and won't fail until runtime.

**The counter:**
- When using a specific function or flag you're not certain about, verify it exists
- Check docs or grep the actual installed library — don't rely on training data for API details
- Libraries evolve. What existed in 2023 may not exist now.

### 8. Ignoring Error Output

**The failure:** Agent runs a command that fails, sees the error, and either ignores it or makes a guess about what went wrong without reading it carefully.

**The counter:**
- Read error messages completely before proposing a fix
- The error message usually contains the fix — read it first
- "I'm not sure why this failed but let me try X" without reading the error is guessing

### 9. Breaking Things Silently

**The failure:** Agent makes a change that passes the tests it runs, but breaks other tests it didn't run. Reports success.

**The counter:**
- Run the full test suite, not just the tests related to your change
- If the full suite is slow, say so and run it anyway — or flag that you only ran a subset
- "I only ran the relevant tests" is not "tests pass"

### 10. Premature Abstraction

**The failure:** Agent sees two similar functions and extracts an abstraction "to avoid duplication" — before the pattern is stable. The abstraction becomes wrong when requirements diverge.

**The counter:**
- Three instances before extracting
- If you're unsure whether the pattern is stable, leave it duplicated
- Duplication is cheaper than the wrong abstraction

## Quick Reference

| Anti-Pattern | Signal | Counter |
|-------------|--------|---------|
| Hallucinated success | "It should work now" | Run it. Read output. |
| Scope creep | "While I'm here..." | Do only what was asked |
| Confident wrong answer | No hedging on uncertain facts | Verify before stating |
| Skipped failing test | Bug "fixed" without test | Reproduce first |
| Context amnesia | Contradicts earlier decisions | Re-read prior constraints |
| Optimistic diff | "Small change" is large | Count files touched |
| Invented API | Plausible but fake function | Grep or check docs |
| Ignored error | Guessing fix without reading error | Read the error first |
| Silent breakage | Partial test run → "pass" | Run full suite |
| Premature abstraction | Two instances → abstract | Three instances minimum |

## Red Flags (Self-Check)

Stop and verify when you notice yourself thinking:

- "This should work"
- "I'll just quickly also..."
- "I'm pretty sure the API is..."
- "The relevant tests pass"
- "It's basically the same pattern so I'll abstract it"
- "I don't need to run it to know it's correct"

All of these are signals to slow down, verify, and be explicit about uncertainty.

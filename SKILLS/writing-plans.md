---
name: writing-plans
description: Use when given a spec or requirements for a multi-step task before touching code. Produces a written implementation plan with phases, files affected, decision points, and checkpoints for review.
---

# Writing Plans Skill

## Core Rule
**A plan that fits in one message is not a plan — it's a guess.**

A real implementation plan is specific enough that a different engineer (or agent) could execute it without asking questions.

## When to Use
- Multi-step feature implementation (3+ files touched)
- Architecture changes
- Migrations (schema, library, platform)
- Performance optimization with unknown root cause
- Any task where "how" is genuinely unclear

## When to Skip
- Bug with clear root cause and single-file fix
- Mechanical refactors (rename, reformat)
- Trivial CRUD additions to existing patterns

## Plan Structure

```markdown
# Plan: [Feature Name]

## Goal
One sentence: what does done look like?

## Scope
- IN: what this plan covers
- OUT: what this plan explicitly does not cover

## Phases
### Phase 1: [Name] — [estimated time]
**Why first:** [dependency reason]
Files touched:
- `path/to/file.py` — [what changes]
- `path/to/other.py` — [what changes]
Steps:
1. [specific action]
2. [specific action]
Checkpoint: [how to verify Phase 1 is done]

### Phase 2: [Name] — [estimated time]
...

## Decision Points
| Decision | Options | Recommendation | Why |
|----------|---------|---------------|-----|
| [choice needed] | A / B | A | [reason] |

## Risks
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| [risk] | Low/Med/High | Low/Med/High | [how to handle] |

## Verification
How to confirm the full plan succeeded:
- [ ] [specific check]
- [ ] [specific check]
```

## Steps

### 1. Restate the Goal
Write one sentence: "After this plan executes, [specific observable state] will be true."

If you can't write that sentence, the requirements aren't clear enough. Stop and clarify.

### 2. Identify All Files Affected
Grep and trace the codebase. List every file that will change, not just the main ones. Surprises in phase 3 that should have been in phase 1 are plan failures.

### 3. Sequence Phases by Dependencies
What must be true before each phase can start? That's your sequence:
- Database schema before API layer
- API layer before frontend
- Feature flag before rollout

### 4. Write Checkpoints
Each phase needs a checkpoint: a specific command or test that proves the phase is done before proceeding. Not "phase 1 feels complete" — "npm test passes and the `/api/v2/users` endpoint returns 200."

### 5. Surface Decisions
List every choice where reasonable engineers would disagree. Resolve them in the plan so the executor doesn't have to stop and ask.

### 6. Identify Risks
What could go wrong? For each risk: what's the likelihood, what's the impact, and what's the rollback/mitigation?

## Quality Gates
- [ ] Goal is a specific observable state (not a task description)
- [ ] Scope has both IN and OUT sections
- [ ] Every phase has a named checkpoint
- [ ] All files affected are listed (not just primary files)
- [ ] Decision points resolved (not deferred)
- [ ] Risks identified with mitigations

## Anti-Patterns
| Anti-Pattern | Consequence |
|-------------|-------------|
| "Phase 1: implement the feature" | Not a plan |
| No checkpoints between phases | Can't tell when a phase is done |
| Decisions left unresolved | Executor stops mid-implementation |
| Missing out-of-scope section | Scope creep during execution |

## References
- Anthropic Official Skill (superpowers:writing-plans)

---
name: addyosmani-agent-skills
description: Production-grade engineering lifecycle skills baked from Google's engineering culture. Enforces spec → implementation → testing → review → deployment discipline with quality gates at each stage. Use when working on any software feature from scratch to production.
---

# addyosmani/agent-skills — Production Engineering Pack

## Source
[github.com/addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) — 22 lifecycle skills

## Core Problem This Solves
AI coding agents default to the shortest path: skip specs, skip tests, skip security review, produce "working" code that fails in production. This skill pack enforces the same discipline a senior Google engineer brings to every task.

## The 22 Skill Lifecycle

### Phase 1 — Discovery & Spec
1. **requirements-clarification** — Ask the right questions before writing a line of code
2. **technical-spec** — Write a spec that could be reviewed and rejected (not just executed)
3. **architecture-decision** — Document trade-offs, not just the chosen approach
4. **api-contract** — Define interfaces before implementation

### Phase 2 — Implementation
5. **implementation-plan** — Break work into reviewable chunks
6. **code-generation** — Write code to the spec, not just to make tests pass
7. **dependency-management** — Explicit versioning, audit for vulnerabilities
8. **error-handling** — Fail loudly, fail safely, never silently swallow errors

### Phase 3 — Testing
9. **test-strategy** — Unit vs integration vs e2e — pick intentionally
10. **test-driven-development** — Red → Green → Refactor
11. **test-coverage** — Coverage is a proxy; test *behavior*, not lines
12. **performance-testing** — Measure before optimizing

### Phase 4 — Review
13. **self-review** — Read your own diff as a reviewer would
14. **security-review** — OWASP Top 10 checklist before merge
15. **accessibility-review** — WCAG AA at minimum
16. **code-documentation** — Document *why*, not *what*

### Phase 5 — Deployment
17. **deployment-readiness** — Health checks, rollback plan, feature flags
18. **observability** — Logging, metrics, and alerting wired before ship
19. **incident-response** — Runbook written before the incident happens

### Meta Skills
20. **using-agent-skills** — How to compose and sequence these skills
21. **skill-selection** — Which skill applies to which task
22. **retrospective** — What to change for next time

## Steps (Using This Skill)

### 1. Identify Phase
Where are you in the lifecycle?
- Starting fresh → Phase 1
- Have a spec → Phase 2
- Code written → Phase 3-4
- Ready to ship → Phase 5

### 2. Apply Quality Gates
Each phase has a verification checklist. **Do not advance without passing.**

### 3. Anti-Rationalization
The skill includes tables of common rationalizations agents use to skip steps:
| Rationalization | Reality |
|----------------|---------|
| "The tests are obvious, I'll add them later" | Later never comes |
| "It's a small change, no need for spec" | Small changes cause big incidents |
| "Security review is for big features" | Vulnerabilities don't check PR size |

## Quality Gates (Meta)
- [ ] Phase identified before starting
- [ ] No phase skipped without documented reason
- [ ] Quality gates checked, not assumed

## References
- [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills)
- [Software Engineering at Google](https://abseil.io/resources/swe-book)
- [Google Engineering Practices](https://google.github.io/eng-practices/)

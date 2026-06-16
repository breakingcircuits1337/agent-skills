---
name: dispatching-parallel-agents
description: Use when facing 2+ independent tasks that can be worked on without shared state or sequential dependencies. Structures work for parallel sub-agent execution to multiply throughput.
---

# Dispatching Parallel Agents Skill

## Core Principle
Single-threaded LLM execution is a bottleneck, not a constraint. When tasks are independent, run them in parallel. 2-5x throughput increase is common; 10x is possible on highly parallelizable work.

## When to Use
- 2+ tasks with no shared mutable state between them
- Research across multiple domains simultaneously
- Code changes in different files/modules that don't interact
- Testing multiple approaches or implementations in parallel
- Any work that would benefit from independent verification

## When NOT to Use
- Tasks that share state (one writes, another reads)
- Sequential dependencies (B needs output from A)
- Tasks under 5 minutes (coordination overhead > savings)
- Tasks requiring a single coherent context (refactoring a tightly coupled module)

## Steps

### 1. Decompose the Work
List all tasks. For each, answer:
- Does this task depend on output from any other task? → Sequential if yes
- Does this task write to state that another task reads? → Sequential if yes
- Can this task be verified independently? → Parallel if yes

### 2. Define Task Contracts
Each parallel task needs:
```
Task ID: <unique name>
Input:   <what it starts with>
Output:  <what it produces>
Success: <how to verify it worked>
Isolation: <what state it touches — must not overlap with other tasks>
```

### 3. Write Agent Prompts
Each sub-agent prompt must be **fully self-contained** — it gets zero context from the parent conversation:
- Include all relevant background
- Specify exact inputs and expected output format
- Tell it what to research vs. what to implement
- Tell it NOT to delegate further (prevent agent explosion)

### 4. Dispatch
Send all independent agents simultaneously. Do not wait for one before starting another.

### 5. Aggregate Results
When all agents complete:
- Verify each result against its success criterion
- Merge outputs
- Resolve any conflicts between parallel results
- Run integration verification (parallel work may interact at merge time even if it didn't during execution)

## Task Decomposition Template
```
PARENT TASK: [Overall goal]

PARALLEL BATCH:
┌─ Agent A ──────────────────────┐
│ Task: [specific task]          │
│ Reads: [files/state]           │
│ Writes: [files/state]          │
│ Done when: [verification]      │
└────────────────────────────────┘
┌─ Agent B ──────────────────────┐
│ Task: [specific task]          │  ← no overlap with Agent A's Reads/Writes
│ Reads: [files/state]           │
│ Writes: [files/state]          │
│ Done when: [verification]      │
└────────────────────────────────┘

SEQUENTIAL AFTER BOTH COMPLETE:
└─ Agent C: Merge and integrate
```

## Quality Gates
- [ ] State isolation verified (no two parallel agents touch the same mutable state)
- [ ] Every sub-agent prompt is fully self-contained
- [ ] Aggregation step planned before dispatching
- [ ] Integration verification runs after merge

## Anti-Patterns
| Anti-Pattern | Consequence |
|-------------|-------------|
| Parallel agents sharing a database without locking | Race conditions, data corruption |
| Agent prompts that reference "the conversation above" | Sub-agents have no parent context |
| Dispatching then not waiting for all to complete | Partial merges, silent failures |
| Parallel agents on tightly coupled code | Merge conflicts, logic contradictions |

## References
- Anthropic Official Skill (superpowers:dispatching-parallel-agents)
- [Anthropic: Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents)

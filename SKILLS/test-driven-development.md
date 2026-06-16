---
name: test-driven-development
description: Use when implementing any feature or bugfix before writing implementation code. Enforces red-green-refactor discipline — failing test must exist before implementation code is written.
---

# Test-Driven Development Skill

## Core Rule
**Tests first. Always. No exceptions.**

If you write implementation code before a failing test exists, you are not doing TDD. You are writing code and hoping it works.

## The Red-Green-Refactor Cycle

```
RED    → Write a failing test for the behavior you want
GREEN  → Write the minimal code to make it pass
REFACTOR → Clean up without changing behavior (tests still pass)
```

One cycle at a time. Do not write multiple failing tests before going green.

## Steps

### Phase 1 — RED (Write a Failing Test)

#### 1a. Define the Behavior
In plain English: "Given [context], when [action], then [outcome]."
```
Given a user with an expired session
When they make an authenticated request
Then they receive a 401 with a refresh token hint
```

#### 1b. Write the Test
```python
def test_expired_session_returns_401_with_refresh_hint():
    client = AuthenticatedClient(session_age=3601)  # 1 hour + 1 second
    response = client.get("/api/protected")
    
    assert response.status_code == 401
    assert "refresh_token" in response.json()
```

#### 1c. Run the Test — Confirm It Fails
```bash
pytest tests/test_auth.py::test_expired_session_returns_401_with_refresh_hint
```
**Must see a failure.** If it passes, the test is wrong or the behavior already exists.

### Phase 2 — GREEN (Minimal Implementation)

Write the **minimum** code to make the test pass. Not beautiful code. Not extensible code. Just enough:
- No extra features
- No error handling beyond what the test requires
- No abstraction not forced by the test

Run the test again → must pass.

### Phase 3 — REFACTOR (Improve Without Changing Behavior)

Now clean up:
- Extract shared logic
- Rename for clarity
- Remove duplication
- Add missing abstractions

After every change: run the full test suite. If anything breaks, undo the last change.

## What Makes a Good Test

| Property | Description |
|----------|-------------|
| **Fast** | Under 100ms; no network or disk unless necessary |
| **Isolated** | Doesn't depend on other tests or shared state |
| **Deterministic** | Same result every run |
| **Behavior-focused** | Tests *what*, not *how* |
| **Minimal** | One behavior per test |

## Test Naming Convention
```
test_[subject]_[condition]_[expected_result]
```
Example: `test_login_with_invalid_password_returns_401`

## Anti-Patterns
| Anti-Pattern | Consequence |
|-------------|-------------|
| Writing implementation first, tests after | Tests become documentation, not verification |
| Testing implementation details (private methods) | Tests break on refactors, not on bugs |
| One massive test for multiple behaviors | Can't tell which behavior failed |
| Mocking everything | Tests pass; production breaks |
| "I'll add tests later" | Later is never |

## Quality Gates
- [ ] Failing test written and confirmed failing before implementation
- [ ] Implementation is minimal (no features beyond what the test requires)
- [ ] Test passes after implementation
- [ ] Refactor complete and all tests still pass
- [ ] Test name describes behavior, not implementation

## References
- Anthropic Official Skill (superpowers:test-driven-development)
- [Kent Beck: Test-Driven Development by Example](https://www.oreilly.com/library/view/test-driven-development/0321146530/)

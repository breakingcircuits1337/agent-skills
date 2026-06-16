---
name: api-contract-first
description: Design APIs as contracts before writing implementation code. Use when creating new API endpoints, services, or integrations. Produces an OpenAPI/AsyncAPI spec or interface definition that all parties agree on before a line of implementation is written.
---

# API Contract-First Design Skill

## Core Rule
**The contract is the source of truth. Implementation serves the contract, not the other way around.**

APIs designed implementation-first accumulate accidental complexity — naming from internal data models leaks out, versioning is bolted on, breaking changes happen because "that's how the code worked."

## When to Use
- Creating any new API endpoint (REST, GraphQL, gRPC)
- Building a service that other services will depend on
- Integrating with an external team or consumer
- Designing event schemas for async messaging

## Steps

### 1. Define the Consumer Use Cases
Before schema design, write 3-5 real consumer queries:
```
Consumer needs to:
1. Get a user's profile with their last 5 orders
2. Update only the user's email address
3. Check if a username is available before registration
4. Get all orders placed in a date range
```

The contract must satisfy these. Design for the consumer, not the database schema.

### 2. Draft the OpenAPI Spec
```yaml
openapi: 3.1.0
info:
  title: User Service API
  version: 1.0.0

paths:
  /users/{userId}:
    get:
      summary: Get user profile
      parameters:
        - name: userId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: User profile
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserProfile'
        '404':
          $ref: '#/components/responses/NotFound'

components:
  schemas:
    UserProfile:
      type: object
      required: [id, email, createdAt]
      properties:
        id:
          type: string
          format: uuid
        email:
          type: string
          format: email
        createdAt:
          type: string
          format: date-time
```

### 3. Contract Review (Before Implementation)
Share the spec with consumers. Explicitly ask:
- Does this match your use cases?
- Are any field names confusing?
- Are any required fields missing?
- Do the error responses give you enough info to handle failures?

**Do not start implementation until at least one consumer has approved the contract.**

### 4. Generate Stubs and Mocks
Use the spec to generate:
- Server stub (implementation skeleton)
- Client SDK
- Mock server for consumer testing

```bash
# Generate server stub
openapi-generator generate -i api.yaml -g python-fastapi -o ./generated/

# Run mock server for consumer teams
prism mock api.yaml --port 4010
```

### 5. Implement Against the Contract
Implementation must not change the contract. If implementation reveals the contract needs changing:
1. Update the spec
2. Re-review with consumers
3. Then update implementation

### 6. Contract Testing
```python
# Schemathesis: fuzz-test your implementation against the spec
schemathesis run api.yaml --url http://localhost:8000

# Pact: consumer-driven contract tests
# Consumer writes expected interactions; provider verifies them
```

## API Naming Conventions
| Convention | Good | Bad |
|-----------|------|-----|
| Resource nouns | `/users`, `/orders` | `/getUser`, `/createOrder` |
| Plural collections | `/users` | `/user` |
| IDs in path | `/users/{id}` | `/users?id={id}` |
| Filters as query params | `/orders?status=pending` | `/pendingOrders` |
| Actions as sub-resources | `/orders/{id}/cancel` | `/cancelOrder/{id}` |

## Quality Gates
- [ ] Consumer use cases documented before spec written
- [ ] Spec reviewed and approved by at least one consumer before implementation
- [ ] All error responses documented (not just happy path)
- [ ] Mock server running for consumers before implementation complete
- [ ] Contract tests in CI (implementation must satisfy spec)

## References
- [OpenAPI Specification](https://spec.openapis.org/oas/v3.1.0)
- [Prism Mock Server](https://stoplight.io/open-source/prism)
- [Schemathesis Contract Testing](https://schemathesis.io)
- [Pact Consumer-Driven Contracts](https://pact.io)

---
name: security-review
description: Complete a security review of pending code changes before merging or deploying. Checks OWASP Top 10, secrets exposure, dependency vulnerabilities, authentication flaws, and injection points.
---

# Security Review Skill

## When to Use
- Before any PR merge touching auth, input handling, or data access
- Before deploying to production
- After adding new dependencies
- When any external input enters the system
- When permissions or access control logic changes

## OWASP Top 10 Checklist (2021)

### A01 — Broken Access Control
- [ ] Every endpoint verifies the caller has permission (not just authentication)
- [ ] IDOR: object IDs validated against the requesting user's ownership
- [ ] No `role` or `admin` fields accepted from user input
- [ ] Directory traversal: file paths sanitized, no `../` allowed through

### A02 — Cryptographic Failures
- [ ] No sensitive data in URLs (tokens, passwords, PII)
- [ ] Passwords hashed with bcrypt/argon2 (not MD5/SHA1)
- [ ] TLS enforced on all external connections
- [ ] No hardcoded secrets in code or config files

### A03 — Injection
- [ ] SQL: parameterized queries only (no string concatenation)
- [ ] Command: no user input passed to `exec()`, `shell=True`, `subprocess`
- [ ] SSTI: template inputs sanitized before rendering
- [ ] NoSQL: operators (`$where`, `$regex`) not injectable from user input

### A04 — Insecure Design
- [ ] Business logic: can a user skip steps in a flow? (e.g., pay before verifying)
- [ ] Rate limiting on auth endpoints
- [ ] No sensitive operations via GET requests

### A05 — Security Misconfiguration
- [ ] Debug mode disabled in production
- [ ] Default credentials changed
- [ ] Error messages don't expose stack traces to clients
- [ ] CORS configured restrictively (not `*`)
- [ ] Security headers present (CSP, HSTS, X-Frame-Options)

### A06 — Vulnerable Components
- [ ] `npm audit` / `pip-audit` / `trivy` run on dependencies
- [ ] No known CVEs in direct dependencies
- [ ] No abandoned packages (last commit > 2 years, no maintainer)

### A07 — Authentication Failures
- [ ] Session IDs rotated on login
- [ ] "Forgot password" doesn't enumerate valid emails
- [ ] JWT: `alg` field validated server-side (reject `none`)
- [ ] Token expiration enforced

### A08 — Integrity Failures
- [ ] Deserialization: no untrusted data deserialized to objects
- [ ] CI/CD: dependency hashes pinned (not just version ranges)

### A09 — Logging Failures
- [ ] Auth events logged (login, logout, failed attempts)
- [ ] No passwords or tokens in logs
- [ ] Logs include timestamp, user ID, action, and outcome

### A10 — SSRF
- [ ] Server-side URL fetches validate against allowlist
- [ ] No user-controlled URLs fetched without sanitization
- [ ] Cloud metadata endpoints (`169.254.169.254`) blocked

## Steps

### 1. Diff Review
Read every line of changed code with security eyes — not "does this work?" but "can this be abused?"

### 2. Data Flow Tracing
For each user-controlled input: trace it from entry point to database/filesystem/shell. Every step that transforms, validates, or passes the input is a potential injection point.

### 3. Permission Boundary Check
For each protected resource touched: verify that the code checks *authorization* (not just authentication) at the data layer, not just the route layer.

### 4. Secrets Scan
```bash
git diff HEAD~1 | grep -iE "(password|secret|token|key|api_key)\s*=\s*['\"][^'\"]{8,}"
# Or use: truffleHog, gitleaks, detect-secrets
```

### 5. Dependency Audit
```bash
npm audit --audit-level=high
# or
pip-audit
# or
trivy fs .
```

## Quality Gates
- [ ] All OWASP A01-A10 items checked (not assumed)
- [ ] Secrets scan run on diff
- [ ] Dependency audit clean at high+ severity
- [ ] Data flow traced for every new user input entry point
- [ ] No "will fix later" security issues left without a tracked ticket

## References
- Anthropic Official Skill (superpowers:security-review)
- [OWASP Top 10](https://owasp.org/Top10/)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)

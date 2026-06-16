---
name: shannon-security
description: Autonomous AI pen testing skill. Executes real security exploits against web applications for authorized security testing, CTF challenges, and defensive security research. Covers 50+ vulnerability types across 5 OWASP categories.
---

# Shannon — AI Pen Testing Skill

## AUTHORIZATION REQUIRED
**Never use this skill without explicit authorization.** Authorized contexts:
- Penetration testing engagements 
- CTF competitions
- Security research on systems you own or have permission to test
- Defensive analysis (understanding attacks to defend against them)

## Performance
- **96.15% exploit success rate** on the XBOW benchmark
- 50+ vulnerability types covered
- 5 OWASP categories

## Supported Vulnerability Classes

### Injection
- SQL injection (union, blind, time-based)
- Command injection
- SSTI (Server-Side Template Injection)
- XXE (XML External Entity)

### Broken Authentication
- Session fixation / hijacking
- JWT manipulation (alg:none, weak secrets)
- Credential stuffing patterns

### XSS & Client-Side
- Reflected XSS
- Stored XSS
- DOM-based XSS
- CSRF

### Access Control
- IDOR (Insecure Direct Object Reference)
- Privilege escalation
- Path traversal

### Security Misconfiguration
- Default credentials
- Exposed debug endpoints
- CORS misconfiguration
- Directory listing

## Steps

### 1. Reconnaissance
```
- Identify tech stack (headers, error pages, robots.txt)
- Map all endpoints and parameters
- Note authentication mechanisms
- Identify input reflection points
```

### 2. Threat Model
Prioritize by:
1. Impact (data exposure > auth bypass > info leak)
2. Exploitability (unauthenticated > authenticated)
3. Scope (all users > single user)

### 3. Exploit
- Test one vulnerability class at a time
- Document each payload and response
- Capture proof-of-concept (screenshot, response body)

### 4. Report
Every finding must include:
- **Severity**: Critical / High / Medium / Low
- **Location**: URL, parameter, endpoint
- **Payload**: Exact exploit used
- **Impact**: What an attacker could do
- **Remediation**: Specific fix

## Quality Gates

- [ ] Scope boundaries documented (no out-of-scope targets)
- [ ] All findings include remediation guidance
- [ ] No destructive actions (no data deletion, no DoS)

## References
- [VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills)
- [OWASP Top 10](https://owasp.org/Top10/)
- [XBOW Security Benchmark](https://xbow.com)

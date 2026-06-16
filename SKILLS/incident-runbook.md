---
name: incident-runbook
description: Write operational runbooks for services before incidents happen. Use when deploying a new service, adding a critical feature, or after any production incident to prevent recurrence. Produces a runbook that on-call engineers can execute under pressure.
---

# Incident Runbook Skill

## Core Rule
**A runbook written during an incident is a post-mortem, not a runbook.**

Runbooks must exist before the incident. Under pressure, engineers don't write — they execute. Give them something to execute.

## Runbook Template Structure

```markdown
# Runbook: [Service/Feature Name]

## Quick Reference
- Oncall: @team-name | #slack-channel
- Dashboard: [link]
- Logs: [link]
- Repo: [link]

## Alert → Runbook Map
| Alert Name | Runbook Section |
|-----------|----------------|
| HighErrorRate | Section 3.1 |
| SlowQueries   | Section 3.2 |
| DiskFull      | Section 3.3 |

## 1. Service Overview (60 seconds to understand)
What does this service do? Who depends on it? What breaks if it's down?

## 2. Health Checks
How do you know if the service is healthy?
```bash
# Check if service is up
curl -f https://api.example.com/health

# Check key metrics
kubectl get pods -n production | grep service-name
```

## 3. Common Failures and Fixes

### 3.1 High Error Rate (> 1%)
**Symptoms:** 5xx rate increasing in Datadog  
**Likely causes:**
1. Database connection pool exhausted
2. Upstream dependency down
3. Memory pressure causing OOM

**Steps:**
1. Check DB connections: `SELECT count(*) FROM pg_stat_activity;`
2. If > 80% of pool: restart connection pool `kubectl rollout restart deploy/service`
3. Check upstream: `curl -v https://upstream-service.example.com/health`
4. If upstream down: enable fallback mode `kubectl set env deploy/service FALLBACK_MODE=true`

**Escalate if:** Error rate > 5% and none of the above fixed it in 10 minutes.

### 3.2 Slow Queries
...
```

## Steps

### 1. Identify the Blast Radius
What breaks when this service fails? List:
- Services that depend on this one
- User-facing features that go down
- Data that could be lost or corrupted
- Revenue impact (rough estimate)

### 2. Map Alerts to Sections
For each alert that fires for this service, the runbook must have a matching section with:
- How to confirm this is actually the problem
- Step-by-step remediation
- Escalation criteria

### 3. Write Each Failure Mode
For each failure mode:
```
Symptoms: [what observability shows]
Likely causes: [ordered by likelihood, most common first]
Steps: [numbered, specific commands included]
Escalation: [when to wake up the team lead]
Rollback: [how to undo the fix if it makes things worse]
```

### 4. Include Every Command Verbatim
Don't write "restart the service." Write:
```bash
kubectl rollout restart deployment/my-service -n production
kubectl rollout status deployment/my-service -n production
```

An on-call engineer at 3am should be able to copy-paste, not think.

### 5. Test the Runbook
Before shipping:
- Walk through the runbook in staging
- Have someone who didn't write it execute it
- Fix every step they get confused on

## Quality Gates
- [ ] Alert → runbook section map exists at top
- [ ] Every production alert has a corresponding runbook section
- [ ] Every step has verbatim commands (no "restart the service")
- [ ] Rollback steps exist for every remediation
- [ ] Escalation criteria defined (who to call, when)
- [ ] Runbook tested by someone who didn't write it

## Anti-Patterns
| Anti-Pattern | Consequence |
|-------------|-------------|
| "Check the logs" without a query | Engineer wastes 20 min during incident |
| No escalation criteria | Every alert becomes a P0 |
| Runbook written in past tense after incident | Describes what happened, not what to do |
| Links to dashboards that require login setup | On-call can't access during incident |

## References
- [Google SRE Book: Incident Response](https://sre.google/sre-book/managing-incidents/)
- [PagerDuty Runbook Guide](https://www.pagerduty.com/resources/learn/what-is-a-runbook/)

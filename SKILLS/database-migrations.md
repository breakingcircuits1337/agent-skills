---
name: database-migrations
description: Safely design and execute database schema migrations. Use when adding/removing columns, changing types, renaming tables, or performing data migrations on production databases.
---

# Database Migrations Skill

## Core Rule
**Every migration must be reversible or have a documented point-of-no-return.**

A migration that can't be rolled back in an emergency is a liability, not a feature.

## The Three Migration Categories

| Category | Risk | Approach |
|----------|------|----------|
| **Additive** (add column, add table) | Low | Ship directly; old code ignores new columns |
| **Transformative** (rename, change type) | High | Expand → Migrate → Contract pattern |
| **Destructive** (drop column, drop table) | Very High | Only after all code stops referencing it |

## The Expand-Migrate-Contract Pattern (for Transformative Changes)

```
PHASE 1 — EXPAND:    Add new column alongside old one
                     Deploy code that writes to BOTH columns
                     
PHASE 2 — MIGRATE:   Backfill new column from old column
                     Verify all rows migrated
                     
PHASE 3 — CONTRACT:  Deploy code that reads from NEW column only
                     Drop old column (now safe — nothing reads it)
```

**Never rename a column directly in production** — do expand-migrate-contract.

## Steps

### 1. Classify the Migration
Is this additive, transformative, or destructive?
- Additive → single deployment
- Transformative → three-phase plan
- Destructive → only after codebase search confirms no references

### 2. Write the Migration File
```python
# Alembic example
def upgrade():
    op.add_column('users', sa.Column('email_verified', sa.Boolean(), 
                                     nullable=True,  # nullable first!
                                     server_default='false'))

def downgrade():
    op.drop_column('users', 'email_verified')
```

**Always write `downgrade()`.** Even if you never use it, the discipline matters.

### 3. Test on a Copy of Production Data
```bash
# Restore prod backup to staging
pg_restore -d staging_db prod_backup.dump

# Run migration on staging
alembic upgrade head

# Verify row counts, spot check data
SELECT COUNT(*) FROM users WHERE email_verified IS NULL;
```

### 4. Estimate Lock Duration
Large table migrations lock rows. Estimate time:
```sql
-- How many rows will be affected?
SELECT COUNT(*) FROM large_table;
-- At ~10k rows/second for backfills, 10M rows = ~17 minutes of locks
```

For tables > 1M rows, use batched backfills:
```sql
UPDATE large_table SET new_col = old_col 
WHERE id BETWEEN 0 AND 100000 AND new_col IS NULL;
-- repeat in batches of 100k
```

### 5. Deploy Strategy
- Migrations run *before* code deploy for additive changes
- Migrations run *after* code deploy for destructive changes (code stops using column first)
- Never run destructive migration and code deploy simultaneously

### 6. Verify Post-Migration
```sql
-- Confirm column exists and has expected type
\d table_name

-- Confirm no nulls in non-nullable columns
SELECT COUNT(*) FROM table WHERE new_col IS NULL;

-- Confirm indexes are valid (not invalid/pending)
SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'table_name';
```

## Quality Gates
- [ ] `downgrade()` function written and tested
- [ ] Migration tested on staging with production-scale data
- [ ] Lock duration estimated for tables > 100k rows
- [ ] Batched backfill used for tables > 1M rows
- [ ] Code deploy order confirmed (before vs. after migration)
- [ ] Post-migration verification queries run

## Anti-Patterns
| Anti-Pattern | Consequence |
|-------------|-------------|
| Renaming column directly | Breaks running instances; requires downtime |
| `NOT NULL` column without `DEFAULT` | Migration fails on existing rows |
| Dropping column same deploy as removing code | Race condition; errors during deploy |
| No `downgrade()` | Can't roll back on incident |
| Migrating without row count estimate | Unexpected multi-hour table lock in production |

## References
- [Strong Migrations (Rails)](https://github.com/ankane/strong_migrations)
- [Zero-Downtime Migrations — PlanetScale](https://planetscale.com/blog/zero-downtime-schema-migrations)
- [Expand-Contract Pattern](https://www.martinfowler.com/bliki/ParallelChange.html)

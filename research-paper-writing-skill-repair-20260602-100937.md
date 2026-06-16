# Research Paper Writing Skill Repair Report

Generated: 2026-06-02 10:09:37 local

## Target

- `/home/kbun/.hermes/skills/research/research-paper-writing/SKILL.md`

## Problem

The skill was structurally valid but exceeded Hermes' live `SKILL.md` size guideline/validator threshold:

- Before: 102,437 chars / 103,375 bytes
- Validation issue: `size > 100000`

## Repair performed

- Backed up the original file to:
  - `/home/kbun/.hermes/backups/skill-repair-20260602-100937/research-paper-writing/SKILL.md.original`
- Rewrote the live `SKILL.md` into a concise operational routing/checklist skill:
  - After: 12,685 chars / 12,701 bytes
- Preserved the original detailed runbook by splitting it into linked reference files:
  - `/home/kbun/.hermes/skills/research/research-paper-writing/references/pipeline-phases-0-4.md`
  - `/home/kbun/.hermes/skills/research/research-paper-writing/references/writing-review-submission-phases-5-7.md`
  - `/home/kbun/.hermes/skills/research/research-paper-writing/references/post-acceptance-and-hermes-reference.md`

## Verification

- `skill_view(name='research-paper-writing')` succeeds.
- Linked reference files are visible in `skill_view`.
- Full local skill validation now passes:
  - Checked: 249 `SKILL.md` files
  - Bad count: 0
- Hermes registry still reports:
  - `1 hub-installed, 85 builtin, 158 local — 226 enabled, 18 disabled`

## Rollback

Restore the original if needed:

```bash
cp /home/kbun/.hermes/backups/skill-repair-20260602-100937/research-paper-writing/SKILL.md.original /home/kbun/.hermes/skills/research/research-paper-writing/SKILL.md
```


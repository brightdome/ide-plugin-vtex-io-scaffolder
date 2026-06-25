---
name: bd-pre-merge
description: Run a read-only pre-PR gate across lint, tests, coverage, logging, and branch sync.
---

Goal:
- If `project-runtime-conventions.mdc` is missing, run `skills/localize-company-cursor-rules/SKILL.md` first.
- Execute `/bd-lint`, `/bd-test`, `/bd-coverage`, and `/bd-log-check` checks.
- Verify branch sync status with the base branch before PR creation.
- Produce a single pass/fail report with blocking items and next actions.
- Keep this command read-only.

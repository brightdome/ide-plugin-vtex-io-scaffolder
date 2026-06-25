---
name: bd-lint
description: Run lint and formatting checks using project runtime conventions.
---

Follow `rules/commit-message-and-workflow.mdc` and `rules/testing-and-coverage.mdc`.

Goal:
- If `project-runtime-conventions.mdc` is missing, run `skills/localize-company-cursor-rules/SKILL.md` first.
- Run lint/format commands defined by runtime conventions.
- Report all blocking diagnostics grouped by file.
- Keep this command read-only unless the lint tool itself applies automatic fixes by default.

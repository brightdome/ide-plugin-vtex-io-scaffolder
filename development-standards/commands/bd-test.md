---
name: bd-test
description: Run repository tests using runtime conventions and report results.
---

Follow `rules/testing-and-coverage.mdc`.

Goal:
- If `project-runtime-conventions.mdc` is missing, run `skills/localize-company-cursor-rules/SKILL.md` first.
- Use the repository test command(s) defined by runtime conventions.
- Run tests for the impacted scope and report failures with file:line context.
- Keep output focused on pass/fail status and blocking errors.

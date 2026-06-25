---
name: bd-coverage
description: Run coverage checks and enforce the project coverage gate.
---

Follow `rules/testing-and-coverage.mdc`.

Goal:
- If `project-runtime-conventions.mdc` is missing, run `skills/localize-company-cursor-rules/SKILL.md` first.
- Run coverage command(s) from runtime conventions.
- Enforce the configured threshold (default policy target is 95%).
- Report coverage deltas and failing modules in a concise checklist.

---
name: bd-review
description: Run a read-only review of current changes against Brightdome development rules.
---

Goal:
- Review the current diff against every rule in `rules/*.mdc`.
- Report findings grouped by severity and rule.
- Cite each issue with file:line and the corresponding rule file.
- Suggest corrective actions in prose only.
- Keep this command strictly read-only.

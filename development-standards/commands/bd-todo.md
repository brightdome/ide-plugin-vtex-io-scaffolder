---
name: bd-todo
description: List TODO, FIXME, and HACK markers in the current diff or repository.
---

Goal:
- Search TODO-like markers in the current diff when a diff exists.
- Fall back to repository-wide search when there is no current diff.
- Group results by file and marker type.
- Keep this command read-only.

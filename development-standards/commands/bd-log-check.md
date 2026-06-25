---
name: bd-log-check
description: Audit logging usage and sensitive-data safety against project rules.
---

Follow `rules/logging-and-data-safety.mdc`.

Goal:
- Audit changed code (or repository scope when requested) for logging policy violations.
- Flag direct printing, sensitive-data leaks, or bypasses of approved logging modules.
- Report violations with file:line and suggested compliant alternatives.
- Keep this command read-only.

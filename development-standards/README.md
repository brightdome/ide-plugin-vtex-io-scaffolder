# Dev Standards Plugin

Installable Cursor plugin with engineering rules, skills, and a full catalog of `/bd-*` slash commands for Git workflows, code quality, and documentation.

## Rules

- `branch-creation-and-naming` — branch naming standards and task ID linkage
- `commit-message-and-workflow` — Conventional Commits and atomic commit hygiene
- `testing-and-coverage` — test and 95% coverage gates
- `documentation-and-readmes` — README-per-folder policy and doc update requirements
- `logging-and-data-safety` — centralized logging and sensitive data safety
- `code-comments-and-documentation` — high-signal comment standards

## Skills

- `skills/localize-company-cursor-rules/` — bootstraps `project-runtime-conventions.mdc` by detecting language, test/lint/coverage/logging commands, and doc paths from the active repository
- `skills/grill-with-docs/` — relentless one-question-at-a-time design grilling session anchored to `CONTEXT.md` and ADRs; resolves decision branches sequentially and updates context docs as decisions are made

## Slash Commands

| Command | What it does |
| --- | --- |
| `/bd-branch` | Propose and create a branch name following naming rules |
| `/bd-commit` | Stage atomically and create Conventional Commits after lint and tests pass |
| `/bd-push` | Push current branch safely with an explicit confirmation step |
| `/bd-sync` | Rebase the current branch onto a base branch with explicit confirmation |
| `/bd-pr` | Draft and create a pull request from current commits |
| `/bd-diff` | Summarize staged and unstaged changes grouped by intent |
| `/bd-review` | Read-only review of current changes against all Brightdome dev rules |
| `/bd-lint` | Run lint and formatting checks using project runtime conventions |
| `/bd-test` | Run repository tests and report results |
| `/bd-coverage` | Run coverage checks and enforce the project coverage gate (default 95%) |
| `/bd-log-check` | Audit logging usage and sensitive-data safety |
| `/bd-pre-merge` | Full pre-PR gate: lint, tests, coverage, log-check, and branch sync |
| `/bd-changelog` | Draft and append a changelog entry from recent Conventional Commits |
| `/bd-readme` | Propose and apply README updates for impacted folders |
| `/bd-todo` | List TODO, FIXME, and HACK markers in the diff or repository |
| `/bd-describe` | Describe a symbol or file context in a concise technical explanation |
| `/bd-grill-with-docs` | Rigorous design grilling session grounded in project context docs |
| `/bd-localize` | Bootstrap project runtime conventions for commands, tests, lint, docs, and logging paths |

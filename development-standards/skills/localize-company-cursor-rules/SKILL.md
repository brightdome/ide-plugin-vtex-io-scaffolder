---
name: localize-company-cursor-rules
description: Bootstraps a per-repository Cursor overlay rule (project-runtime-conventions.mdc) by discovering language, test/coverage/lint commands, logging module locations, documentation and README paths, and task ID conventions from manifests and CI. Use for a new repository or bootstrap, to adapt company Cursor rules to a project, when the user asks to fill in test commands, documentation locations, or find the logging module, or when editing project-specific .cursor/rules.
---

# Localize Company Cursor Rules To This Repository

Company baseline rules in `.cursor/rules/` stay **generic** (policy only). This skill produces **one overlay file** with repo-specific facts so templates remain mergeable.

## Preconditions

- Baseline rules exist (for example `testing-and-coverage.mdc`, `logging-and-data-safety.mdc`, `commit-message-and-workflow.mdc`, `branch-creation-and-naming.mdc`, `code-comments-and-documentation.mdc`, `documentation-and-readmes.mdc`).
- Each baseline includes the static pointer line to [`project-runtime-conventions.mdc`](../../rules/project-runtime-conventions.mdc) (same text in every baseline file).

## Workflow

1. **Confirm scope:** Create or overwrite `.cursor/rules/project-runtime-conventions.mdc` only. Do not embed project-specific commands inside the four baseline files.
2. **Run discovery** using the checklist below (read manifests, Makefile/Taskfile, CI workflows, and all `README.md` files).
3. **Ask the user** for anything not discoverable: default Jira/issue prefix, internal service names, “no centralized logger yet,” or which folder owns docs for a major area.
4. **Fill the overlay template** (see below) with concrete commands and paths—no placeholders like “run tests” without the exact command.
5. **Validate:** Commands must match what CI or `Makefile` actually runs; note any gap versus company policy (for example 95% coverage if CI does not enforce `--cov-fail-under`). Documentation paths must match a real `glob **/README.md` (and `docs/**` if present).

## Discovery checklist

| Goal | Where to look |
|------|----------------|
| Language / package manager | `package.json`, `pyproject.toml`, `requirements.txt`, `go.mod`, `Cargo.toml`, `pom.xml`, `build.gradle`, etc. |
| Tests + coverage | `Makefile`, `Taskfile`, `justfile`, `scripts` in package.json, `pytest.ini`/`tox.ini`, Jest/Vitest config, `.github/workflows/*`, GitLab CI |
| Lint / format | ESLint/Ruff/Prettier, `mypy.ini`, Black/ruff in Makefile |
| Logging | Search for logger setup: `logging.getLogger`, `structlog`, `pino`, framework logging middleware |
| Correlation IDs | HTTP middleware, OpenTelemetry, `request_id` / `trace_id` |
| Task ID prefix | CONTRIBUTING, team docs, or ask the user |
| **Documentation / READMEs** | `glob **/README.md` from repo root; `docs/`, `mkdocs.yml`, `docusaurus.config.*`, `CONTRIBUTING.md`; align with [`documentation-and-readmes.mdc`](../../rules/documentation-and-readmes.mdc) (one README per folder; list each file and its role) |


## Overlay template

Create `.cursor/rules/project-runtime-conventions.mdc` with YAML frontmatter:

```yaml
---
description: <Project name> — project-specific commands, documentation locations, and paths (overlay)
alwaysApply: true
---
```

Then include these sections (adapt titles to your tone; keep content factual):

1. **Repository profile** — One short paragraph: stack, main source tree, test folder.
2. **Commands** — Table: install, test, coverage (with threshold if company policy requires it), lint, typecheck. Copy-paste exact shell lines.
3. **Testing** — Framework, config file paths, coverage scope (`--cov=…`), CI reference path.
4. **Logging** — Entry module(s) or “not yet centralized; use X pattern”; forbidden patterns (`print` in prod).
5. **Commit scope examples** — 3–5 lowercase scopes from real package/folder names.
6. **Branch examples** — 1–2 examples with the team’s task prefix.
7. **Default task ID prefix** — From user or docs.
8. **Documentation locations** — **REQUIRED** when the company uses [`documentation-and-readmes.mdc`](../../rules/documentation-and-readmes.mdc) or equivalent policy:
   - Table or bullet list of **every existing** `README.md` path (relative to repo root) and one line on what each covers.
   - List **major source folders without** a README (for example `app/`, `frontend/src/`) and state where contributors should document changes until a folder README exists (usually root `README.md`).
   - If the repo uses a site generator or `docs/` tree, list its entry point and how to preview.

## How the overlay complements each baseline rule

- **Testing and coverage:** Baseline sets the 95% and test-every-change policy; overlay lists **exact** `pytest`/`npm test`/etc. commands and where CI runs them.
- **Logging and data safety:** Baseline sets centralized logging and redaction rules; overlay names **which module** to import or where to add a shared logger.
- **Commit message and workflow:** Baseline defines Conventional Commits; overlay gives **real scopes** (`api`, `auth`, `pulumi`) for this repo.
- **Branch creation and naming:** Baseline defines the branch format and ID check; overlay gives the **default ticket prefix** and realistic examples.
- **Documentation and READMEs:** Baseline sets one-README-per-folder and update-with-changes; overlay lists **concrete paths** so agents know where to edit docs for this repository.

## Completion gate

- [ ] `project-runtime-conventions.mdc` exists under `.cursor/rules/` with `alwaysApply: true`
- [ ] Commands are verified against Makefile or CI
- [ ] **Documentation locations** section populated from discovered `README.md` (and optional `docs/`) paths
- [ ] User confirmed task ID prefix or “ask each time”
- [ ] No project-specific commands were added to the generic baseline `.mdc` files (only the overlay is project-specific)

## Additional reference

For framework-specific discovery hints, see [reference.md](reference.md).

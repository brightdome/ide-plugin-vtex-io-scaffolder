# Reference: discovery sources by ecosystem

Short hints for the agent when scanning an unfamiliar repo. Prefer reading actual files over guessing.

## Documentation and READMEs

- Run a recursive search for `README.md` (for example `**/README.md` from repo root) and record **path + first heading or first sentence** as the role summary for the overlay table.
- Check for `docs/`, `mkdocs.yml`, `docusaurus.config.js`, `vitepress`, or `README` at monorepo package roots.
- Read [`documentation-and-readmes.mdc`](../../rules/documentation-and-readmes.mdc): one README per folder; do not invent parallel `.md` guides unless strictly necessary.
- For folders with code but no README, note in the overlay **where** contributors should document (typically root `README.md`) until a folder README is added.

Optional: run `python scripts/discover-runtime.py` from the repo root when present; it may include a `readme_files` list for this repository.

## Python

- **Manifest:** `requirements.txt`, `pyproject.toml`, `Pipfile`
- **Tests:** `pytest.ini`, `tox.ini`, `conftest.py`, `tests/` or `test/`
- **Coverage:** `pytest --cov=`, `.coveragerc`, `pyproject.toml` `[tool.coverage]`
- **CI:** `.github/workflows/*.yml` searching for `pytest`, `ruff`, `mypy`, `black`

## Node / TypeScript

- **Manifest:** `package.json` — `scripts.test`, `scripts.lint`
- **Configs:** `jest.config.*`, `vitest.config.*`, `eslint.config.*`, `.eslintrc.*`

## Go

- **Manifest:** `go.mod`
- **Tests:** `go test`, `./...`, tags in CI

## JVM

- **Maven:** `pom.xml` — surefire, failsafe
- **Gradle:** `build.gradle[.kts]` — test tasks

## Logging patterns (search)

- Python: `logging.getLogger`, `structlog.get_logger`, `uvicorn` access log config
- Node: `pino`, `winston`, `console` (flag if used in prod)
- Go: `slog`, `log/slog`, `zerolog`

When multiple patterns exist, document the **primary** path new code should follow.

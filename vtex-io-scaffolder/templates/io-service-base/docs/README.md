# {{APP_TITLE}} - Docs

Index of in-repo documentation for this VTEX IO service. The full app
overview lives in the repository [README](../README.md); this folder
exists primarily to satisfy the `docs` builder declared in
[`manifest.json`](../manifest.json) (without it, `vtex link` fails with
`Missing docs folder in the project`).

## Where things live

- Service entry point and route registration:
  [`node/index.ts`](../node/index.ts).
- Middlewares (auth, logging, body parsing, error boundary):
  [`node/middlewares/`](../node/middlewares).
- Business logic (one file per use case):
  [`node/services/`](../node/services).
- HTTP clients (`JanusClient` for internal VTEX, `ExternalClient` for
  3rd party): [`node/clients/`](../node/clients).
- Pure payload transforms: [`node/builders/`](../node/builders).
- Shared constants: [`node/constants/`](../node/constants).
- Type definitions: [`node/typings/`](../node/typings).

## Conventions

See [`AGENTS.md`](../AGENTS.md) at the repo root for the mandatory
steps for any code change (CHANGELOG, docs, lint, tests) and the
VTEX/client style rules this repo follows.

## Adding more docs

Drop additional Markdown files in this folder as the service grows -
one per feature or per public API surface. Link them from this index.

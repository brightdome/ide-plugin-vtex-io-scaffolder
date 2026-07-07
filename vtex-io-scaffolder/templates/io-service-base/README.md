# {{APP_TITLE}}

{{APP_DESCRIPTION}}

## App identity

- **Vendor:** `{{APP_VENDOR}}`
- **Name:** `{{APP_NAME}}`
- **Version:** `{{APP_VERSION}}`
- **Builders:** `node@{{NODE_BUILDER_VERSION}}`, `docs@{{DOCS_BUILDER_VERSION}}`

## Folder structure

```
node/
  builders/      payload transformers (outbound to systems)
  clients/       JanusClient (internal VTEX) or ExternalClient (3rd party)
  constants/     shared constant values (only if needed)
  middlewares/   HTTP request pipeline (thin)
  models/        masterdata schemas + repository wrappers (when applicable)
  services/      business-logic layer composing clients + builders
  typings/       entity-driven *.d.ts files
  utils/         shared helpers (withTimeout, logging, etc.)
  index.ts       Service + route composition
```

## Client rules

- **Internal VTEX requests** must extend `JanusClient` from `@vtex/api`.
- **External (3rd party) requests** must extend `ExternalClient` from `@vtex/api`.

See `node/clients/exampleJanus.ts` and `node/clients/exampleExternal.ts` for reference implementations.

## Local development

```bash
cd node
yarn install
cd ..
vtex login <account>
vtex use <workspace>
vtex link
```

When you are done:

```bash
vtex unlink
```

## Testing

Tests live alongside source under `__tests__/` folders. Run from the repo root:

```bash
yarn test
```

## Release & deploy

This repo ships with two GitHub workflows that delegate to shared org workflows:

- `.github/workflows/release.yml` triggered on merged PRs to `main`/`master`.
- `.github/workflows/deploy.yml` triggered on pushes to the `deploy` branch.

Branch convention: `feat/<ticket>`, `fix/<ticket>`, `chore/...`, `hotfix/...`.

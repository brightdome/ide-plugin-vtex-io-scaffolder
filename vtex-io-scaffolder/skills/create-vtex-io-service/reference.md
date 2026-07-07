# Reference: VTEX IO Service Conventions

Read this file before generating any dynamic code in Phase 5.

## Canonical folder structure (`node/`)

```
node/
  builders/      pure payload transformers (no ctx, no I/O)
  clients/       JanusClient (internal VTEX) or ExternalClient (3rd party)
  constants/     shared constants only; one-offs stay next to their callsite
  middlewares/   HTTP request pipeline; thin, no business logic
  models/        Master Data repositories (when applicable)
  services/      business-logic layer composing clients + builders
  typings/       entity-driven *.d.ts files; one concern per file
  utils/         helpers (withTimeout, logging, etc.)
  index.ts       Service + route composition; State interface lives here
```

## Layer responsibilities

```
middlewares -> services -> { builders, clients, models }
```

- **Middlewares** only touch HTTP concerns: auth, params, response shape.
  They MUST stay short. Push business logic into services.
- **Services** take `(ctx, domainInput)`, orchestrate one or more clients
  (always through `withTimeout`), call builders for payload transforms,
  log failures via `logToMasterData`, and return a documented fallback.
- **Clients** extend `JanusClient` or `ExternalClient`. No business logic.
- **Builders** are pure functions. No `ctx`, no `await`, no `fetch`.
- **Models** wrap Master Data v2; one file per entity; extend
  `MasterDataModel<T>`.

## JanusClient vs ExternalClient (the hard rule)

```typescript
// Internal VTEX endpoint -> JanusClient
import { JanusClient } from '@vtex/api'

export default class Fulfillment extends JanusClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
      headers: {
        ...options?.headers,
        Accept: 'application/json',
        'Content-Type': 'application/json',
        VtexIdclientAutCookie: context.authToken,
      },
    })
  }

  public async simulation(payload: SimulationData): Promise<SimulationResponse> {
    return this.http.post('/api/fulfillment/pvt/orderForms/simulation', payload, {
      metric: 'simulation-fulfillment',
    })
  }
}
```

**`VtexIdclientAutCookie: context.authToken` is mandatory.** It tells
VTEX to authenticate the request using the **app's** credentials
(scoped by the policies declared in `manifest.json`). Omit it and the
upstream service treats the request as anonymous and 302s to the VTEX
login page; the redirect surfaces to the caller as an opaque 502 with
no usable error body. The header is required even on routes that are
themselves `public: true` - the route's auth and the *outbound* call's
auth are unrelated.

```typescript
// 3rd party endpoint -> ExternalClient (base URL via super())
import { ExternalClient } from '@vtex/api'

export default class KiboAPIClient extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super('https://api.example.com', context, {
      ...options,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  public async getSomething(id: string): Promise<unknown> {
    return this.http.get(`/resources/${id}`, { metric: 'external-get' })
  }
}
```

Then register the client in `node/clients/index.ts`:

```typescript
public get fulfillment() {
  return this.getOrSet('fulfillment', Fulfillment)
}
```

## Canonical service pattern

Every service that calls an external system must follow this shape:

```typescript
export async function runX(ctx: Context, input: XInput): Promise<XResult> {
  const { someClient } = ctx.clients
  const start = Date.now()

  try {
    const payload = buildXPayload(input)
    const response = await withTimeout(someClient.doIt(payload), TIMEOUT_MS)

    addPerformanceStats(start, 'someClient-doIt')

    return response
  } catch (error) {
    await logToMasterData(ctx, 'x-error', input.id ?? '', 'warn', error)

    return { /* documented fallback shape */ }
  }
}
```

Use `'error'` instead of `'warn'` only when the failure must page someone.

## Route composition in `index.ts`

Every route chain starts with `[setupLogger, errorHandler, ...]`. The
`errorHandler` boundary catches anything thrown downstream and shapes
a uniform JSON envelope, so callers never see HTML error pages or
empty bodies.

For routes that accept a request body (`POST`, `PATCH`, `PUT`), insert
`parseJsonBody` immediately after `errorHandler` - VTEX IO's stock
`Service` does not register a body parser, so without it
`ctx.state.parsedBody` is undefined.

Compose middleware chains via helper arrays so each route reads as data:

```typescript
const withAuth = (handler: RouteHandler): RouteHandler[] =>
  [setupLogger, errorHandler, tokenAuth, handler]

const withAuthAndBody = (handler: RouteHandler): RouteHandler[] =>
  [setupLogger, errorHandler, tokenAuth, parseJsonBody, handler]

const withAuthAndParams = (handler: RouteHandler): RouteHandler[] =>
  [setupLogger, errorHandler, tokenAuth, sendParamsToState, handler]

export default new Service({
  clients,
  routes: {
    getOrder: method({ GET: withAuthAndParams(getOrder) }),
    placeOrder: method({ POST: withAuthAndBody(placeOrder) }),
    healthCheck: method({ GET: [setupLogger, errorHandler, healthCheck] }),
  },
})
```

Mirror the route names in `service.json`:

```json
{
  "routes": {
    "getOrder": {
      "path": "/_v/<app-name>/orders/:orderId",
      "public": true
    }
  }
}
```

## State interface

Declare `State` (and `Context`) inside `node/index.ts` so adding a typed
state field is a single-file edit:

```typescript
declare global {
  type Context = ServiceContext<Clients, State>

  interface State extends RecorderState {
    appSettings: AppSettings
    sessionEmail?: string
    sessionUnitId?: string

    orderId?: string
    exampleModel: IMasterDataModel<ExampleEntity>
  }
}
```

## Master Data pattern

1. Declare the entity shape under `node/typings/masterDataEntities.d.ts`.
2. Write a model under `node/models/masterdata/<entity>Model.ts` extending
   `MasterDataModel<TEntity>`.
3. Add the schema body to `node/mdSchema.ts` (`schemaList(account)`).
4. Bind `configureApp` to the lifecycle events in `index.ts`:

   ```typescript
   events: {
     onAppInstalled: configureApp,
     onSettingsChanged: configureApp,
     onAppLinked: configureApp,
   }
   ```

5. Wire the model into `ctx.state` from `dependencyInjector` so
   middlewares/services consume it via `ctx.state.<entityModel>`.

## Outbound-access policies

`outbound-access` host wildcards are unreliable for VTEX-internal calls
that route through the `portal` account. Specifically, calls hitting
License Manager / portal endpoints on `vtexcommercestable.com.br`
sometimes 502 when only the `{{account}}.vtexcommercestable.com.br`
wildcard policy is declared, even though the wildcard is documented as
sufficient.

Always ship **both** entries for any service that talks to internal
VTEX APIs:

```json
{
  "name": "outbound-access",
  "attrs": {
    "host": "{{account}}.vtexcommercestable.com.br",
    "path": "/api/*"
  }
},
{
  "name": "outbound-access",
  "attrs": {
    "host": "portal.vtexcommercestable.com.br",
    "path": "/api/*"
  }
}
```

The first covers per-account calls; the second covers anything that
falls back to the shared `portal` account (License Manager, some
admin-side surfaces). The skill template ships both - leave them in
place even if you "only" call a single account-scoped endpoint.

## Auth patterns

- `tokenAuth` (io-fulfilment-service style): reads `?t=<token>`, compares
  against `appSettings.vtexCreds.VTEXToken` with constant-time comparison.
- `sessionAuth` (service-example style): calls `ctx.clients.session.getSession`
  and validates `profile.isAuthenticated === 'true'`.
- `none`: no auth middleware; index.ts composes routes with `[setupLogger, handler]` only.

The skill keeps both files in `templates/io-service-base/node/middlewares/auth/`
and the scaffolder deletes the unused one based on the selected pattern.

## Structured logging fields (optional upgrade)

`ctx.vtex.logger.{info,warn,error}` accepts a `fields` object that
flows into the colossus log line, which then drives funnel /
observability dashboards. For services that benefit from per-request
correlation (anything multi-step, anything fronting more than one
upstream), build a sanitised context block once in `setupLogger` and
attach it to every log line on the request:

```typescript
// node/utils/requestLogContext.ts
export interface RequestLogContext {
  account: string
  workspace: string
  requestId: string
  method: string
  route: string
  operation: string
}

export function buildRequestLogContext(ctx: Context): RequestLogContext {
  const route = ctx.path ?? 'unknown'

  return {
    account: ctx.vtex.account,
    workspace: ctx.vtex.workspace,
    requestId: ctx.vtex.requestId,
    method: ctx.method,
    route,
    operation: resolveOperation(route),
  }
}
```

```typescript
// node/middlewares/setupLogger.ts (excerpt)
const requestLogContext = buildRequestLogContext(ctx)

ctx.state.requestLogContext = requestLogContext
ctx.vtex.logger.info({
  message: 'request started',
  fields: requestLogContext,
})
```

Critical rules:

- **Never** put `ctx.vtex.authToken`, cookies, or PII in `fields`.
- Use `ctx.path` (not `ctx.route`, which is not on the VTEX `Context`
  type) to identify the route.
- Local `vtex link` does NOT print `ctx.vtex.logger.*` calls. They
  ship to colossus only. Run `vtex logs <vendor>.<app>` in a second
  terminal during development, or use a temporary `console.info`
  helper for short-lived debugging (and remove it before merging).

This pattern is opt-in. Do not generate it from the skill template -
the field names and `operation` resolver are project-specific. Add a
short note in the generated `README.md` pointing at this section so
the team can adopt it later.

## Jest conventions

- Test files live in `__tests__/<name>.test.ts` next to source.
- Mock collaborators with `jest.mock(...)`; never import the real
  `@vtex/api` clients in tests.
- For services: cover the success path AND the fallback path.
- For builders: cover the happy path AND an edge case (empty input).
- For middlewares: assert state mutation and that `next()` was called.
- Routes themselves are NOT unit-tested; that belongs to integration.

## GitHub workflows

Both workflow files in `.github/workflows/` are reusable-workflow callers
hosted under the `odp-ecom/` GitHub org. They contain no app-specific
tokens and are copied verbatim by the scaffolder.

- `release.yml`: triggered on merged PRs to `main`/`master` and via
  `workflow_dispatch`. Delegates to
  `odp-ecom/io-reusable-workflow/.github/workflows/release.yml@main`.
- `deploy.yml`: triggered on pushes to the `deploy` branch. Delegates to
  `odp-ecom/gha-workflows-glpi/.github/workflows/deploy.yml@main`.

## Dependency pinning (when targeting `@vtex/api` 6.x)

The default template pins `@vtex/api: ^7.0.0` + TypeScript `5.5.3`,
which is the modern, recommended combination. Some accounts / teams
are still on the `node` builder `6.x` line and deliberately stay on
`@vtex/api 6.50.x` + TypeScript `3.9.x`. In that case, transitive
types from `@types/koa` and `@opentelemetry/api` drift past what TS
3.9 can parse and `yarn lint` fails with `TS1005` / `TS1370` errors
that have nothing to do with the user's code.

The fix is a `resolutions` block in the **root** `package.json` that
pins the offending transitive types to the last versions compatible
with TS 3.9:

```json
"resolutions": {
  "@types/testing-library__dom": "6.12.1",
  "@types/express": "4.16.0",
  "@types/express-serve-static-core": "4.16.0",
  "node-releases": "2.0.14",
  "@opentelemetry/api": "1.8.0",
  "@types/koa": "2.15.2"
}
```

Mirror the same pins in `node/package.json` `resolutions` so the
`node/` install resolves identically. Do NOT add this block to the
default template - it should only appear when the user has explicitly
opted into `@vtex/api` 6.x.

## Branch and commit conventions

- Branches: `feat/<ticket>`, `fix/<ticket>`, `chore/...`, `hotfix/...`.
- Commits: `feat: ...`, `fix: ...`, `chore: ...` (conventional).
- New scaffold lands on `develop` (when `initGit: true` is selected).

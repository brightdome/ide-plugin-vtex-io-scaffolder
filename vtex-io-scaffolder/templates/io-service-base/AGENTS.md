## Project Rules for Cursor Agents and Developers

These rules are the source of truth for working in this repository.
Cursor Agents and humans should follow them for every change.

### Mandatory steps for any code change

- Update `CHANGELOG.md` following Keep a Changelog + SemVer.
- Update relevant docs: `docs/` and/or `README.md` when behaviour,
  APIs, flows, or configs change.
- Run lint in `node/`:
  - `yarn lint` (from `node/`)
  - `yarn lint` (from the repo root)
  Both must pass; `vtex link` will refuse to link a workspace with
  TypeScript errors.
- Run tests at the repository root (if tests exist):
  - `yarn test`
  - `yarn test:coverage` when verifying coverage gates.

### Pull Request expectations

- If code changed under `node/`, include edits to at least one of:
  `CHANGELOG.md`, files in `docs/`, or `README.md`.
- PR description should summarise the changes and link related tickets.

### Style/quality

- Prefer small, focused edits with clear commit messages.
- Keep comments high-signal; avoid obvious comments.
- No `any` in TypeScript. Define types up-front; if upstream payloads
  are uncertain, capture a sample in `docs/` and derive an interface
  from it.

### VTEX reference / good practices

- When needing to create connections to VTEX services, check first if
  the method is already available in the `@vtex/clients` SDK or the
  `@vtex/api` built-in clients before writing your own:
  https://developers.vtex.com/docs/guides/vtex-io-documentation-clients
- Use object destructuring.
- Prefer optional chaining and nullish coalescing for safe access /
  defaults.
- Provide payload examples when VTEX docs are insufficient so types
  can be defined (avoid `any`). Prefer adding sanitised real-world
  samples to `docs/` and derive TypeScript interfaces from them.

### Client rules

- Internal VTEX endpoints: extend `JanusClient` from `@vtex/api`.
- External (3rd-party) endpoints: extend `ExternalClient` from
  `@vtex/api`.
- Every `JanusClient` constructor MUST forward
  `VtexIdclientAutCookie: context.authToken` in its `headers`. Without
  it the call runs anonymously and VTEX redirects to login, which the
  caller sees as an opaque 502.

### Manifest / outbound-access rules

- Keep BOTH outbound-access policies for VTEX commerce-stable hosts:
  `{{account}}.vtexcommercestable.com.br /api/*` AND
  `portal.vtexcommercestable.com.br /api/*`. The wildcard alone is not
  always sufficient for License Manager / portal traffic.
- If the manifest declares the `docs` builder, the `docs/` folder must
  exist with at least a `README.md`. `vtex link` aborts with
  `Missing docs folder in the project` otherwise.

/**
 * Wires concrete dependencies (Master Data models, validators, etc.) into
 * `ctx.state`. Middlewares and services should always read collaborators
 * from `ctx.state` so they can be swapped in tests.
 *
 * Extend this stub when you add a model under `node/models/` or a
 * validation collaborator. The shape mirrors `service-example`'s pattern.
 */
export async function dependencyInjector(
  ctx: Context,
  next: () => Promise<void>
) {
  // Example wiring (uncomment and import once you add a model):
  //
  // ctx.state.exampleModel = new ExampleModel(
  //   ctx.clients.masterdata,
  //   ctx.vtex.logger,
  // )

  await next()
}

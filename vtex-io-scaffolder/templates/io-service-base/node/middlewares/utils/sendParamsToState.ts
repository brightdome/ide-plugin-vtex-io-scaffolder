/**
 * Promotes route parameters (`ctx.vtex.route.params`) onto `ctx.state` so
 * downstream middlewares can read them via typed `State` fields rather than
 * digging through the route context.
 */
export async function sendParamsToState(
  ctx: Context,
  next: () => Promise<void>
) {
  const params = ctx.vtex?.route?.params ?? {}

  for (const [key, value] of Object.entries(params)) {
    ;(ctx.state as Record<string, unknown>)[key] = value
  }

  await next()
}

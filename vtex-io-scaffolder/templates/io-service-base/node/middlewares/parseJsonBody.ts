import { json } from 'co-body'

/**
 * One-shot JSON body parser for VTEX IO routes.
 *
 * VTEX IO's stock `Service` does not register a body parser. Without
 * this middleware, `ctx.request.body` is undefined for any POST /
 * PATCH / PUT route and downstream handlers cannot read the payload.
 *
 * The parsed payload is exposed via `ctx.state.parsedBody` so each
 * route handler can pull a typed view of it without re-parsing.
 *
 * Wire this middleware into every route whose method list includes
 * `POST | PATCH | PUT`, immediately before the route's main handler:
 *
 *     createOrder: method({
 *       POST: [setupLogger, errorHandler, parseJsonBody, createOrder],
 *     }),
 */
const JSON_BODY_LIMIT = '1mb'

export async function parseJsonBody(
  ctx: Context,
  next: () => Promise<void>
): Promise<void> {
  try {
    ctx.state.parsedBody = await json(ctx.req, {
      strict: true,
      limit: JSON_BODY_LIMIT,
    })
  } catch (parseError) {
    const reason =
      parseError instanceof Error ? parseError.message : 'Invalid JSON body'

    ctx.vtex.logger.warn({
      message: 'parseJsonBody: invalid JSON body',
      error: reason,
    })

    ctx.status = 400
    ctx.body = { status: 'error', reason: 'Invalid JSON body' }

    return
  }

  await next()
}

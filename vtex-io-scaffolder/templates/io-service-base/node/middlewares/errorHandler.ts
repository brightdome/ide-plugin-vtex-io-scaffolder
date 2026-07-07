/**
 * Top-level error boundary for every route in this service.
 *
 * Catches anything thrown downstream, logs it with structured context,
 * and shapes a uniform JSON error envelope so callers always receive
 * valid JSON instead of an HTML error page or an empty response.
 *
 * Wire this middleware in second (right after `setupLogger`) on every
 * route chain:
 *
 *     myRoute: method({
 *       POST: [setupLogger, errorHandler, parseJsonBody, myRoute],
 *     }),
 *
 * Status code rules:
 *  - 400 if the downstream code threw with `status === 400` (validation).
 *  - 502 for everything else: the failure is from an upstream call or
 *    an unexpected runtime error and there is nothing the caller can
 *    do to retry.
 */
export async function errorHandler(
  ctx: Context,
  next: () => Promise<void>
): Promise<void> {
  try {
    await next()
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    const status = isHttpStatusError(error) && error.status === 400 ? 400 : 502

    ctx.vtex.logger.error({
      message: 'unhandled error in route',
      fields: { error: message, route: ctx.path },
    })

    ctx.status = status
    ctx.body = {
      status: 'error',
      reason: message,
    }
  }
}

interface HttpStatusError {
  status?: number
}

function isHttpStatusError(error: unknown): error is HttpStatusError {
  return typeof error === 'object' && error !== null && 'status' in error
}

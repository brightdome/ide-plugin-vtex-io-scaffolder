import { buildExamplePayload } from '../builders/example.builder'
import type { ExampleInput, ExampleResult } from '../typings/example'
import { withTimeout } from '../utils/functions'
import { addPerformanceStats, logToMasterData } from '../utils/logging'

const EXAMPLE_TIMEOUT_MS = 5000

/**
 * Business-logic layer between middlewares (HTTP boundary) and clients
 * (transport boundary). The canonical service pattern is:
 *
 *   1. Build the outbound payload via a builder.
 *   2. Race the client call against `withTimeout` so a slow upstream cannot
 *      stall the request beyond the agreed budget.
 *   3. Record performance stats for observability.
 *   4. On failure, log via `logToMasterData` and return a documented
 *      fallback so the caller never has to handle null/undefined.
 */
export async function runExample(
  ctx: Context,
  input: ExampleInput
): Promise<ExampleResult> {
  const { exampleExternal } = ctx.clients
  const start = Date.now()

  try {
    const payload = buildExamplePayload(input)
    const response = await withTimeout(
      exampleExternal.fetchSomething(payload.id),
      EXAMPLE_TIMEOUT_MS
    )

    addPerformanceStats(start, 'example-fetchSomething')

    return {
      ok: true,
      data: response,
    }
  } catch (error) {
    await logToMasterData(ctx, 'example-service-error', input.id, 'warn', error)

    return {
      ok: false,
      data: null,
    }
  }
}

import { LINKED } from '@vtex/api'

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const performanceStats: Array<{
  app: string
  method: string
  duration: number
}> = []

/**
 * Persists a structured log entry to Master Data (dataEntity "KL") and,
 * when present, mirrors it to a Dynatrace logger attached at `ctx.logger`.
 *
 * Falls back to no-op when neither sink is configured so a missing logger
 * never breaks a request.
 */
// eslint-disable-next-line max-params
export const logToMasterData = async (
  ctx: Context,
  step: string,
  identification: string,
  type: LogLevel,
  message: unknown = {}
): Promise<void> => {
  const stringMessage = serializeMessage(message)

  const fields = {
    step,
    identification,
    type,
    message: stringMessage,
  }

  switch (type) {
    case 'error':
      // eslint-disable-next-line no-console
      if (LINKED) console.error(`*** ${step}: ${identification}`, message)
      ctx.logger?.error?.(`${step}: ${identification}`, fields)
      break
    case 'warn':
      // eslint-disable-next-line no-console
      if (LINKED) console.warn(`*** ${step}: ${identification}`, message)
      ctx.logger?.warn?.(`${step}: ${identification}`, fields)
      break
    case 'info':
      // eslint-disable-next-line no-console
      if (LINKED) console.info(`*** ${step}: ${identification}`, message)
      ctx.logger?.info?.(`${step}: ${identification}`, fields)
      break
    case 'debug':
      // eslint-disable-next-line no-console
      if (LINKED) console.debug(`*** ${step}: ${identification}`, message)
      ctx.logger?.debug?.(`${step}: ${identification}`, fields)
      break
    default:
      return
  }

  try {
    await ctx.clients.masterdata.createDocument({
      dataEntity: 'KL',
      fields,
    })
  } catch (err) {
    ctx.vtex?.logger?.error?.({
      error: err,
      data: { fields },
      message: `Failed to log to Master Data in step: ${step}`,
    })
  }
}

function serializeMessage(message: unknown): string {
  if (typeof message === 'string') return message

  if (message && typeof message === 'object') {
    const possibleAxios = message as {
      isAxiosError?: boolean
      message?: string
      stack?: string
      response?: { data?: unknown }
      config?: Record<string, unknown>
    }

    if (possibleAxios.isAxiosError || possibleAxios.response?.data) {
      return JSON.stringify({
        message: possibleAxios.message,
        stack: possibleAxios.stack,
        response: possibleAxios.response?.data,
        config: possibleAxios.config,
      })
    }

    if (message instanceof Error) {
      return JSON.stringify({
        message: message.message,
        stack: message.stack,
        name: message.name,
      })
    }
  }

  return JSON.stringify(message ?? {})
}

/**
 * Records the wall-clock duration of a step so it can later be flushed by
 * `sendPerformanceStats`. Call right after an external request completes.
 */
export const addPerformanceStats = (startTime: number, methodName: string): void => {
  const duration = Date.now() - startTime

  performanceStats.push({
    app: process.env.VTEX_APP_ID ?? '{{APP_VENDOR}}.{{APP_NAME}}',
    method: methodName,
    duration,
  })
}

/**
 * Flushes accumulated performance stats as a single `PerformanceStats` event.
 * Stats are dropped silently when the feature flag is off so production never
 * pays the cost of an extra event by accident.
 */
export const sendPerformanceStats = (ctx: Context): void => {
  if (performanceStats.length === 0) return

  try {
    ctx.clients.events.sendEvent('', 'PerformanceStats', performanceStats)
  } finally {
    performanceStats.length = 0
  }
}

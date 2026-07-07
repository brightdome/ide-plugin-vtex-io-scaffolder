import { AuthenticationError } from '@vtex/api'

/**
 * Token-validation auth middleware (io-fulfilment-service style).
 *
 * Expects the request to carry a token in `?t=<token>` and compares it
 * against `appSettings.vtexCreds.VTEXToken`. Uses timing-safe comparison.
 */
export async function tokenAuth(ctx: Context, next: () => Promise<void>) {
  const {
    clients: { apps },
    query,
    vtex: { logger },
  } = ctx

  const token = query?.t as string | undefined

  if (!token) {
    logger.error('No authentication token provided')
    throw new AuthenticationError('Authentication token is required')
  }

  const appId = process.env.VTEX_APP_ID ?? ctx.vtex.account ?? ''

  if (!appId) {
    logger.error('No app ID found')
    throw new AuthenticationError('Application ID is not configured')
  }

  try {
    const appSettings = await apps.getAppSettings(appId)
    const expectedToken = appSettings?.vtexCreds?.VTEXToken

    if (!expectedToken) {
      logger.error('No VTEX token configured in app settings')
      throw new AuthenticationError('Authentication is not properly configured')
    }

    if (!secureCompare(token, expectedToken)) {
      logger.error('Invalid authentication token provided')
      throw new AuthenticationError('Invalid authentication token')
    }

    ctx.state.appSettings = appSettings
  } catch (error) {
    if (error instanceof AuthenticationError) throw error
    logger.error({ error, message: 'appSettings-error' })
    throw new AuthenticationError('Failed to verify authentication')
  }

  await next()
}

/**
 * Constant-time string comparison so brute-forcing the token cannot exploit
 * early-exit timing differences.
 */
function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false

  let result = 0

  for (let index = 0; index < a.length; index += 1) {
    // eslint-disable-next-line no-bitwise
    result |= a.charCodeAt(index) ^ b.charCodeAt(index)
  }

  return result === 0
}

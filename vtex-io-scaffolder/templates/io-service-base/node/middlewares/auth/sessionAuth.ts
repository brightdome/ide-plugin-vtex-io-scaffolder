import { AuthenticationError } from '@vtex/api'

/**
 * VTEX session validation middleware (service-example style).
 *
 * Reads the session via `ctx.clients.session.getSession`, asserts the user
 * is authenticated, then exposes `sessionEmail` and `sessionUnitId` on
 * `ctx.state` for downstream middlewares.
 */
export default async function sessionAuth(
  ctx: Context,
  next: () => Promise<unknown>
) {
  const {
    clients: { session },
    vtex: { sessionToken, logger },
  } = ctx

  const { sessionData } = await session.getSession(sessionToken as string, [
    'profile.id',
    'profile.email',
    'profile.isAuthenticated',
    'authentication.unitId',
    'authentication.unitName',
    'authentication.storeUserEmail',
  ])

  const isAuthenticated =
    sessionData?.namespaces?.profile?.isAuthenticated?.value === 'true'

  if (!isAuthenticated) {
    logger.error({
      headers: ctx.request.headers,
      message: 'sessionAuth - user not authenticated',
    })
    throw new AuthenticationError('User is not authenticated')
  }

  ctx.state.sessionEmail =
    sessionData?.namespaces?.authentication?.storeUserEmail?.value
  ctx.state.sessionUnitId =
    sessionData?.namespaces?.authentication?.unitId?.value

  await next()
}

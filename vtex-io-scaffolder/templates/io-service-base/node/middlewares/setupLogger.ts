/**
 * Lightweight logger bootstrapper. The fulfilment-service variant wires a
 * Dynatrace logger via `@odp-ecom/js-logger` here when present in app
 * settings. This baseline keeps the same shape (read app settings, attach a
 * logger to `ctx`) but does not require the external logger package.
 *
 * Extend this file to plug in your preferred logging backend.
 */
export async function setupLogger(ctx: Context, next: () => Promise<void>) {
  try {
    const appId = `${process.env.VTEX_APP_VENDOR}.${process.env.VTEX_APP_NAME}@${process.env.VTEX_APP_VERSION}`

    const cachedSettings = ctx.state?.appSettings
    const appSettings =
      cachedSettings ?? (await ctx.clients.apps.getAppSettings(appId))

    if (ctx.state) {
      ctx.state.appSettings = appSettings
    }
  } catch (error) {
    // Never block the request because the logger could not be initialised.
    // eslint-disable-next-line no-console
    console.warn('setupLogger failed to initialise', error)
  }

  await next()
}

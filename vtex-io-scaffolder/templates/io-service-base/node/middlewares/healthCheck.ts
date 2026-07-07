export async function healthCheck(ctx: Context, next: () => Promise<void>) {
  ctx.status = 200
  ctx.body = { status: 'ok', timestamp: new Date().toISOString() }
  await next()
}

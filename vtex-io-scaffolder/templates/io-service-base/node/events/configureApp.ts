import { createHash } from 'node:crypto'
import type { EventContext, IOClients } from '@vtex/api'

import { schemaList } from '../mdSchema'

/**
 * VTEX event handler that ensures every Master Data schema declared in
 * `mdSchema.ts` exists in the target account. The hashed schema list is
 * cached in vbase so the call is a no-op when nothing changed.
 *
 * Bind this to `onAppInstalled`, `onSettingsChanged`, and `onAppLinked`
 * in `index.ts` when the app uses Master Data.
 */
export default async function configureApp(ctx: EventContext<IOClients>) {
  const {
    clients: { masterdata, vbase },
  } = ctx

  const [appName] = String(process.env.VTEX_APP_ID).split('@')

  const config = (await vbase.getJSON(
    'app_configuration',
    appName,
    true
  )) as { adminSetup?: { schemaHash?: string | null } } | null

  const { schemaHash = '' } = config?.adminSetup ?? {}

  const schemas = schemaList(ctx.vtex.account)
  const currentHashSchema = createHash('md5')
    .update(JSON.stringify(schemas))
    .digest('hex')

  if (currentHashSchema === schemaHash) return

  await Promise.all(
    schemas.map((schema) =>
      masterdata
        .createOrUpdateSchema({
          dataEntity: schema.name,
          schemaBody: schema.body,
          schemaName: schema.version,
        })
        .catch((error: { response?: { status?: number } } | undefined) => {
          if (error?.response?.status !== 304) {
            throw new Error(
              `Failed to create/update schema for ${schema.name}@${schema.version}`
            )
          }
        })
    )
  )

  await vbase.saveJSON('app_configuration', appName, {
    adminSetup: { schemaHash: currentHashSchema },
  })
}

import type { Logger, MasterData } from '@vtex/api'

import { MasterDataModel } from './masterdataModel'

export const EXAMPLE_ENTITY_NAME = '{{APP_NAME}}_example'
export const EXAMPLE_ENTITY_SCHEMA = 'v1'
export const EXAMPLE_ENTITY_DEFAULT_FIELDS = [
  'id',
  'name',
  'createdIn',
  'updatedIn',
]

/**
 * Concrete repository for the example entity. Duplicate this file (and the
 * matching schema in `mdSchema.ts`) for each new Master Data entity.
 */
export default class ExampleModel extends MasterDataModel<ExampleEntity> {
  constructor(md: MasterData, logger: Logger) {
    super(
      md,
      EXAMPLE_ENTITY_NAME,
      EXAMPLE_ENTITY_DEFAULT_FIELDS,
      logger,
      EXAMPLE_ENTITY_SCHEMA
    )
  }
}

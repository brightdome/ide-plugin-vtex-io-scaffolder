import {
  EXAMPLE_ENTITY_NAME,
  EXAMPLE_ENTITY_SCHEMA,
} from './models/masterdata/exampleModel'

/**
 * Master Data schema definitions. Add one entry per entity. The
 * `configureApp` event handler hashes this list to decide whether the
 * remote schemas need to be (re)created.
 */
export const schemaList = (_account: string) => [
  {
    name: EXAMPLE_ENTITY_NAME,
    version: EXAMPLE_ENTITY_SCHEMA,
    body: {
      properties: {
        name: { type: 'string' },
      },
      'v-indexed': ['name'],
      'v-security': {
        allowGetAll: false,
        publicRead: [],
        publicWrite: [],
        publicFilter: [],
      },
      'v-default-fields': ['name'],
      'v-cache': false,
    },
  },
]

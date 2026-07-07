import type { Logger, MasterData } from '@vtex/api'

/**
 * Generic repository wrapper around the Master Data v2 client. Concrete
 * entity models (e.g. `ExampleModel`) extend this class and supply the
 * entity name, schema version, and default field projection.
 */
export class MasterDataModel<T extends object> implements IMasterDataModel<T> {
  // eslint-disable-next-line max-params
  constructor(
    private readonly md: MasterData,
    private readonly dataEntity: string,
    private readonly defaultFields: string[],
    private readonly logger: Logger,
    private readonly schema?: string
  ) {}

  public async getDocument(id: string, fields?: string[]) {
    this.logger.info({
      message: `[${this.dataEntity}] getDocument(${id})`,
      schema: this.schema,
    })

    return this.md.getDocument<T>({
      dataEntity: this.dataEntity,
      id,
      fields: fields ?? this.defaultFields,
    })
  }

  // eslint-disable-next-line max-params
  public async searchDocuments(
    where?: string,
    sort?: string,
    fields?: string[],
    page = 1,
    pageSize = 30
  ) {
    return this.md.searchDocuments<T>({
      dataEntity: this.dataEntity,
      schema: this.schema,
      fields: fields ?? this.defaultFields,
      where,
      sort,
      pagination: { page, pageSize },
    })
  }

  public async searchAllDocuments(
    where?: string,
    sort?: string,
    fields?: string[]
  ): Promise<T[]> {
    const allDocuments: T[] = []
    let page = 1
    const pageSize = 30

    // eslint-disable-next-line no-constant-condition
    while (true) {
      // eslint-disable-next-line no-await-in-loop
      const searchResult = await this.md.searchDocuments<T>({
        dataEntity: this.dataEntity,
        schema: this.schema,
        fields: fields ?? this.defaultFields,
        where,
        sort,
        pagination: { page, pageSize },
      })

      if (!searchResult || searchResult.length === 0) break

      allDocuments.push(...searchResult)
      page += 1
    }

    return allDocuments
  }

  public async createDocument(body: T) {
    return this.md.createDocument({
      dataEntity: this.dataEntity,
      schema: this.schema,
      fields: body,
    })
  }

  public async updatePartialDocument(
    id: string,
    body: Partial<T> & { forceUpdate?: string }
  ) {
    return this.md.updatePartialDocument({
      dataEntity: this.dataEntity,
      schema: this.schema,
      id,
      fields: body,
    })
  }

  public async createOrUpdatePartialDocument(body: Partial<T>, id?: string) {
    return this.md.createOrUpdatePartialDocument({
      dataEntity: this.dataEntity,
      schema: this.schema,
      id,
      fields: body,
    })
  }

  public async deleteDocument(id: string) {
    return this.md.deleteDocument({
      dataEntity: this.dataEntity,
      id,
    })
  }
}

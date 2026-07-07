/**
 * Master Data entity shapes. Add one interface per entity, mirroring the
 * properties declared in `node/mdSchema.ts`.
 */
interface ExampleEntity {
  id?: string
  name: string
  createdIn?: string
  updatedIn?: string
}

interface IMasterDataModel<T> {
  getDocument(id: string, fields?: string[]): Promise<T>
  searchDocuments(
    where?: string,
    sort?: string,
    fields?: string[],
    page?: number,
    pageSize?: number
  ): Promise<T[]>
  searchAllDocuments(
    where?: string,
    sort?: string,
    fields?: string[]
  ): Promise<T[]>
  createDocument(body: T): Promise<DocumentResponse>
  updatePartialDocument(
    id: string,
    body: Partial<T> & { forceUpdate?: string }
  ): Promise<void>
  createOrUpdatePartialDocument(
    body: Partial<T>,
    id?: string
  ): Promise<DocumentResponse>
  deleteDocument(id: string): Promise<IOResponse<void>>
}

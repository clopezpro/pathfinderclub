import type { Document, Model, Schema } from 'mongoose'

export interface QueryResult {
  results: Document[]
  page: number
  limit: number
  totalPages: number
  totalResults: number
}

export interface IOptions {
  sortBy?: string
  projectBy?: string
  populate?: string
  limit?: number
  page?: number
}

function paginate<T extends Document, U extends Model<U>>(schema: Schema<T>): void {
  /**
   * @typedef {Object} QueryResult
   * @property {Document[]} results - Results found
   * @property {number} page - Current page
   * @property {number} limit - Maximum number of results per page
   * @property {number} totalPages - Total number of pages
   * @property {number} totalResults - Total number of documents
   */
  /**
   * Query for documents with pagination
   * @param {Object} [filter] - Mongo filter
   * @param {Object} [options] - Query options
   * @param {string} [options.sortBy] - Sorting criteria using the format: sortField:(desc|asc). Multiple sorting criteria should be separated by commas (,)
   * @param {string} [options.populate] - Populate data fields. Hierarchy of fields should be separated by (.). Multiple populating criteria should be separated by commas (,)
   * @param {number} [options.limit] - Maximum number of results per page (default = 10)
   * @param {number} [options.page] - Current page (default = 1)
   * @param {string} [options.projectBy] - Fields to hide or include (default = '')
   * @returns {Promise<QueryResult>}
   */
  schema.static('paginate', async function (filter: Record<string, any>, options: IOptions): Promise<QueryResult> {
    let sort = ''
    if (options.sortBy) {
      const sortingCriteria: any = []
      options.sortBy.split(',').forEach((sortOption: string) => {
        const [key, order] = sortOption.split(':')
        sortingCriteria.push((order === 'desc' ? '-' : '') + key)
      })
      sort = sortingCriteria.join(' ')
    }
    else {
      sort = 'createdAt'
    }

    let project = ''
    if (options.projectBy && typeof options.projectBy === 'string') {
      const projectionCriteria: string[] = []
      options.projectBy.split(',').forEach((projectOption) => {
        const [key, include] = projectOption.split(':')
        projectionCriteria.push((include === 'hide' ? '-' : '') + key)
      })
      project = projectionCriteria.join(' ')
    }
    else {
      project = '-createdAt -updatedAt'
    }

    /* const limit = options.limit as number || 10 */

    const limit = options.limit ? Number.parseInt(options.limit.toString(), 10) : 0
    const page = options.page ? Number.parseInt(options.page.toString(), 10) : 0

    const skip = (page - 1) * limit

    // eslint-disable-next-line @typescript-eslint/no-invalid-this
    const countPromise = this.countDocuments(filter).exec()
    // eslint-disable-next-line @typescript-eslint/no-invalid-this
    let docsPromise = this.find(filter).sort(sort).skip(skip).limit(limit).select(project)

    if (options.populate) {
      options.populate.split(',').forEach((populateOption: any) => {
        docsPromise = docsPromise.populate(
          populateOption
            .split('.')
            .reverse()
            .reduce((a: string, b: string) => ({ path: b, populate: a })),
        )
      })
    }

    docsPromise = docsPromise.exec()

    return Promise.all([countPromise, docsPromise]).then((values) => {
      const [totalResults, results] = values
      const totalPages = Math.ceil(totalResults / limit)
      const result = {
        results,
        page,
        limit,
        totalPages,
        totalResults,
      }
      return Promise.resolve(result)
    })
  })
}

export default paginate

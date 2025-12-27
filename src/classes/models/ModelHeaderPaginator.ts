export interface IHeaderPaginatorModel<T> {
  limit: number
  offset: number
  items?: Array<T>
}

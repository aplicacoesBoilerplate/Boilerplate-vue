export interface IHeaderPaginatorModel<T> {
  limite: number
  offset: number
  totalPaginas: number
  totalRegistros: number
  registros?: Array<T>
}

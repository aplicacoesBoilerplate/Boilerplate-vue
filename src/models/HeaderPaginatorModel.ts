export interface HeaderPaginatorModel<T> {
  limite: number
  offset: number
  totalPaginas: number
  totalRegistros: number
  registros?: Array<T>
}

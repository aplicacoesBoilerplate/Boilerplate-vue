export interface HeaderPaginatorModel<T> {
  limite: number
  paginaAtual: number
  totalPaginas: number
  totalRegistros: number
  registros: Array<T>
}

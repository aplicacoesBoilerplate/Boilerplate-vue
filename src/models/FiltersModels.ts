// Utilizado principalmente no Paginaotr e nos services...
export interface FiltroPaginacao {
  limite: number
  offset: number
  totalPaginas?: number
  totalRegistros?: number
  orderBy?: string
  search?: string
}

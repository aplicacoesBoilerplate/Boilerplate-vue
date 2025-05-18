export interface FiltroPaginacao {
  limite: number
  offset: number
  orderBy?: string
  // Filtro para search
  search?: string
}

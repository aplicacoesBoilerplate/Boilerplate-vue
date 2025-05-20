export class PaginatorClass {
  limite: number
  offset: number
  totalPaginas?: number
  totalRegistros?: number
  orderBy?: string
  search?: string

  constructor({
    limite = 10,
    offset = 1,
    totalPaginas = 0,
    totalRegistros = 0,
    orderBy = '',
    search = '',
  }: Partial<PaginatorClass> = {}) {
    this.limite = limite
    this.offset = offset
    this.totalPaginas = totalPaginas
    this.totalRegistros = totalRegistros
    this.orderBy = orderBy
    this.search = search
  }

  atualizarDadosAPI(dados: Pick<PaginatorClass, 'totalPaginas' | 'totalRegistros'>) {
    this.totalPaginas = dados.totalPaginas
    this.totalRegistros = dados.totalRegistros
  }

  atualizarLimite(novoLimite: number) {
    this.limite = novoLimite
  }

  atualizarPagina(novaPagina: number) {
    this.offset = novaPagina
  }

  alterarOrdenacao(ordem: string) {
    const novaOrdem = ordem == 'ASC' ? 'DESC' : 'ASC'
    this.orderBy = novaOrdem
  }
  
}

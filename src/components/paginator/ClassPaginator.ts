export class PaginatorClass {
  limite: number
  offset: number
  totalPaginas?: number
  totalRegistros?: number
  orderBy?: string // Ordenação da exibição da lista
  search?: string // Parâmetro de busca
  apenasHoje?: boolean | null // Filtro para a portaria consutar apenas os registros do dia ou todos
  aprovacao?: boolean | null // Parâmetro de busca para autorizações de saídas por aprovação
  idFuncionarioResponsavel?: number | string

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

  alterarOrdenacao() {
    this.orderBy = this.orderBy == 'ASC' ? 'DESC' : 'ASC'
  }

  alterarFiltroAprovacao() {
    this.aprovacao = !this.aprovacao
  }

  alterarFiltroApenasHoje() {
    this.apenasHoje = !this.apenasHoje
  }
}

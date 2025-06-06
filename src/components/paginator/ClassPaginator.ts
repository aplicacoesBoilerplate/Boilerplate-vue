export class PaginatorClass {
  limite: number
  offset: number
  totalPaginas?: number
  totalRegistros?: number
  orderBy?: string // Ordenação da exibição da lista
  search?: string | null // Parâmetro de busca
  apenasHoje?: boolean | null // Filtro para a portaria consutar apenas os registros do dia ou todos
  aprovacao?: boolean | null // Parâmetro de busca para autorizações de saídas por aprovação
  alterarInput?: boolean | null // Campo para controlar a exibição de input de busca que podem receber mais de um parâmetro (Autorizações e Saídas)
  funcionarioResponsavel?: string | null // (Autorizações e Saídas)

  constructor({ limite = 10, offset = 1 }: Partial<PaginatorClass> = {}) {
    this.limite = limite
    this.offset = offset
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
    this.offset = 1
  }

  alterarFiltroApenasHoje() {
    this.apenasHoje = !this.apenasHoje
    this.offset = 1
  }

  limparFiltros() {
    this.apenasHoje = false
    this.aprovacao = false
    this.funcionarioResponsavel = null
    this.search = null
    this.alterarInput = false
    this.orderBy = this.orderBy
    this.limite = this.limite
    this.offset = this.offset
  }
}

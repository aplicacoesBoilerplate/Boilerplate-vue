export class PaginatorClass {
  limite: number
  offset: number
  totalPaginas?: number
  totalRegistros?: number
  orderBy?: string // Ordenação da exibição da lista
  search?: string | null // Parâmetro de busca
  apenasHoje?: boolean | true // Filtro para a portaria consutar apenas os registros do dia ou todos
  aprovacao?: boolean | null // Parâmetro de busca para autorizações de saídas por aprovação
  alterarInput?: boolean | null // Campo para controlar a exibição de input de busca que podem receber mais de um parâmetro (Autorizações e Saídas)
  funcionarioResponsavel?: string | null // (Autorizações e Saídas)
  autocomplete?: boolean | null // Utilizado quando precisamos buscar apenas as descrições de um registro para popular as options do select
  exibirSintetico?: boolean | null // Utilizado para filtrar as opções de relatório no dashboard para exibir ou não modelos sintéticos
  exibirAnalitico?: boolean | null // Utilizado para filtrar as opções de relatório no dashboard para exibir ou não modelos analíticos

  constructor({ limite = 10, offset = 1 }: Partial<PaginatorClass> = {}) {
    this.limite = limite
    this.offset = offset
    this.apenasHoje = true
  }

  atualizarDadosAPI(dados: Pick<PaginatorClass, 'totalPaginas' | 'totalRegistros'>) {
    this.totalPaginas = dados.totalPaginas
    this.totalRegistros = dados.totalRegistros
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

  alterarExibicaoSinteticos() {
    this.exibirSintetico = !this.exibirSintetico
  }

  alterarExibicaoAnaliticos() {
    this.exibirAnalitico = !this.exibirAnalitico
  }

  limparFiltros() {
    this.apenasHoje = true
    this.aprovacao = false
    this.funcionarioResponsavel = null
    this.search = null
    this.alterarInput = false
    this.orderBy = this.orderBy
    this.limite = this.limite
    this.offset = this.offset
    this.exibirSintetico = this.exibirSintetico
    this.exibirAnalitico = this.exibirAnalitico
  }
}

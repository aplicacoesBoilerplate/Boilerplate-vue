export class Paginator {
  limite: number
  offset: number
  totalPaginas?: number
  totalRegistros?: number

  constructor({
    limite = 10,
    offset = 1,
    totalPaginas = 0,
    totalRegistros = 0,
  }: Partial<Paginator> = {}) {
    this.limite = limite
    this.offset = offset
    this.totalPaginas = totalPaginas
    this.totalRegistros = totalRegistros
  }

  atualizarDadosAPI(dados: Pick<Paginator, 'totalPaginas' | 'totalRegistros'>) {
    this.totalPaginas = dados.totalPaginas
    this.totalRegistros = dados.totalRegistros
  }

  obterParametrosConsulta(): Pick<Paginator, 'limite' | 'offset'> {
    return {
      limite: this.limite,
      offset: this.offset,
    }
  }
}

import type { FiltrosDoRelatorio, Relatorios } from '@/models/relatoriosModels/relatoriosModels.ts'

export class DialogFiltrosRelatoriosClass {
  show: boolean
  relatorio: Relatorios
  filtros: Array<FiltrosDoRelatorio>

  constructor() {
    this.show = false
    this.relatorio = {
      tipoRelatorio: 'SINTETICO',
      modeloRelatorio: 'GERAL',
    }
    this.filtros = []
  }

  openDialog(infoRelatorio: Relatorios) {
    this.show = true
    this.relatorio = infoRelatorio
  }

  closeDialog() {
    this.show = false
    this.clearFields()
  }

  clearFields() {
    this.filtros = []
  }

  getFiltrosAplicados() {
    return this.filtros.filter(filtro => filtro.tabela != '')
  }

  setFiltro(filtro: FiltrosDoRelatorio) {
    this.filtros.push(filtro)
  }

  removeFiltro(index: number) {
    this.filtros.splice(index, 1);
  }

  //#region filtros
  filtrarFiltrosAplicadosPorTabela(tabela: string) {
    return this.filtros.filter(filtro => filtro.tabela === tabela)
  }
  //#endregion

}

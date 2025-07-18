import type { FiltrosDoRelatorio, Relatorios } from '@/models/relatoriosModels/relatoriosModels.ts'

export class DialogFiltrosRelatoriosClass {
  show: boolean
  relatorio: Relatorios
  filtros: FiltrosDoRelatorio[]

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

}

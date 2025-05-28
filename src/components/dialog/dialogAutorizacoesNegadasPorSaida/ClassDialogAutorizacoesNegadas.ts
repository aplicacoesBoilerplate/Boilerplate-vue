import type {AutorizacoesConsulta} from "@/models/saidasModels/saidasModels.ts";
import {autorizacoesServices} from "@/services/autorizacoesServices.ts";
import type {HeaderPaginatorModel} from "@/models/HeaderPaginatorModel.ts";

export class DialogAutorizacoesNegadasClass {
  show: boolean
  autorizacoesNegadas: HeaderPaginatorModel<AutorizacoesConsulta>

  constructor() {
    this.show = false
    this.autorizacoesNegadas = {
      limite: 0,
      offset: 0,
      totalPaginas: 0,
      totalRegistros: 0,
      registros: [{
        idAutorizacao: 0,
        idFuncionarioAutorizacao: 0,
        idSaida: 0,
        aprovacaoSaida: false,
        observacaoAutorizacao: '',
        dataAutorizacao: ''
      }]
    }
  }

  async openDialog(idSaida: number) {
    await this.getAutorizacoesNegadas(idSaida)
    this.show = true
  }

  closeDialog() {
    this.show = false
  }

  async getAutorizacoesNegadas(idSaida?: number) {
    if (idSaida)
      this.autorizacoesNegadas = await autorizacoesServices.getAutorizacoesNegadasPorSaida(idSaida)
  }

}

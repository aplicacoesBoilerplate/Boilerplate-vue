import type { SaidaConsulta } from '@/models/saidasModels/saidasModels'
import { saidasServices } from '@/services/saidasServices'

export class DialogSaidasClass {
  show: boolean
  isEditing: boolean
  visualizando: boolean
  saida: SaidaConsulta

  constructor() {
    this.show = false
    this.isEditing = false
    this.visualizando = false
    this.saida = {
      idSaida: 0,
      idFuncionarioResponsavelSaida: 0,
      numeroRegistroFuncionario: 0,
      nomeFuncionario: '',
      setorFuncionario: '',
      motivoSaida: 0,
      observacaoSaida: '',
      statusSaida: '',
      dataSolicitacaoSaida: '',
      dataAprovacaoSaida: '',
      dataPrevisaoSaidaFuncionario: '',
      dataSaidaFuncionario: '',
      confirmaRetorno: false,
      dataPrevisaoChegadaFuncionario: '',
      dataChegadaFuncionario: '',
      nomeFuncionarioResponsavelSaida: '',
      descricaoMotivo: '',
      categoriaMotivo: '',
    }
  }

  openDialog() {
    this.show = true
  }

  async getSaidaById(idSaida?: number) {
    if (idSaida) this.saida = await saidasServices.getSaidaById(idSaida)
  }

  clearFields() {
    if (this.isEditing) {
      this.getSaidaById(this.saida.idSaida)
    } else {
      this.saida = {
        idSaida: 0,
        idFuncionarioResponsavelSaida: 0,
        numeroRegistroFuncionario: 0,
        nomeFuncionario: '',
        setorFuncionario: '',
        motivoSaida: 0,
        observacaoSaida: '',
        statusSaida: '',
        dataSolicitacaoSaida: '',
        dataAprovacaoSaida: '',
        dataPrevisaoSaidaFuncionario: '',
        dataSaidaFuncionario: '',
        confirmaRetorno: false,
        dataPrevisaoChegadaFuncionario: '',
        dataChegadaFuncionario: '',
        nomeFuncionarioResponsavelSaida: '',
        descricaoMotivo: '',
        categoriaMotivo: '',
      }
    }
  }

  closeDialog() {
    this.show = false
    this.isEditing = false
    this.clearFields()
  }

  async completeForm(idSaida?: number) {
    this.show = true
    this.isEditing = true
    if (idSaida != null) await this.getSaidaById(idSaida)
  }

  async visualizarInformacoes(idSaida?: number) {
    this.show = true
    this.isEditing = false
    this.visualizando = true
    if (idSaida != null) await this.getSaidaById(idSaida)
  }
}

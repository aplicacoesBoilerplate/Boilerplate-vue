import type { funcionarioRegistradoDP } from '@/models/firebirdModels/firebirdModels'

export class DialogRegistroDPClass {
  show: boolean
  funcionarioRegistradoDP: funcionarioRegistradoDP

  constructor() {
    this.show = false
    this.funcionarioRegistradoDP = {
      registroDP: 0,
      codigoFuncionario: 0,
      nome: '',
      setor: 0,
      descricaoSetor: ''
    }
  }

  openDialog() {
    this.show = true
  }

  closeDialog() {
    this.show = false
  }

  getValues() {
    return this.funcionarioRegistradoDP
  }

  setValues(setRegistroDP: funcionarioRegistradoDP) {
    this.funcionarioRegistradoDP = {
      registroDP: setRegistroDP.registroDP,
      codigoFuncionario: setRegistroDP.codigoFuncionario,
      nome: setRegistroDP.nome,
      setor: setRegistroDP.setor,
      descricaoSetor: setRegistroDP.descricaoSetor
    }
  }
}

import type { funcionarioRegistradoDP } from '@/models/firebirdModels/firebirdModels'

export class DialogRegistroDPClass {
  show: boolean
  funcionarioRegistradoDP: funcionarioRegistradoDP

  constructor() {
    this.show = true
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
}

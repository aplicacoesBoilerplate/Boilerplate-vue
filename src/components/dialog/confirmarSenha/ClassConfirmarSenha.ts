export class ConfirmarSenhaClass {
  show: boolean
  email: string
  senha: string
  confirmarSenha: string
  novaSenha?: string
  confirmarNovaSenha?: string
  callback?: () => Promise<void> | null

  constructor() {
    this.show = false
    this.email = ''
    this.senha = ''
    this.confirmarSenha = ''
    this.callback = undefined
    this.novaSenha = ''
    this.confirmarNovaSenha = ''
  }

  openDialog() {
    this.show = true
  }

  clearFields() {
    this.senha = ''
    this.confirmarSenha = ''
  }

  closeDialog() {
    this.clearFields()
    this.show = false
    this.callback = undefined
  }

  setCallback(callback: () => Promise<void>) {
    this.callback = callback
  }

  async executeCallback() {
    if (this.callback) {
      await this.callback()
    }
  }
}

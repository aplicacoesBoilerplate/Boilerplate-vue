export class ConfirmarSenhaClass {
  show: boolean
  email: string
  senha: string
  confirmarSenha: string
  callback?: () => Promise<void> | null

  constructor() {
    this.show = false
    this.email = ''
    this.senha = ''
    this.confirmarSenha = ''
    this.callback = undefined
  }

  openDialog() {
    this.show = true
    console.log('Show confirmar senha:', this.show)
  }

  clearFields() {
    this.email = ''
    this.senha = ''
    this.confirmarSenha = ''
  }

  closeDialog() {
    this.clearFields()
    this.show = false
    this.callback = undefined
  }

  fecharDialogComReset() {
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

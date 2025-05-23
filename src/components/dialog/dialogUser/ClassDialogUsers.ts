import type { UsuarioConsulta } from '@/models/usersModels/UsuariosModels'
import { usuariosServices } from '@/services/usuariosService'

export class DialogUsersClass {
  show: boolean
  isEditing: boolean
  usuario: UsuarioConsulta

  constructor() {
    this.show = false
    this.isEditing = false
    this.usuario = {
      nome: '',
      email: '',
      permissao: 'EMITE_SAIDA',
    }
  }

  openDialog() {
    this.show = true
  }

  async getUsuarioById(idUsuario?: number) {
    if (idUsuario)
      this.usuario = await usuariosServices.getUserById(idUsuario)
  }

  clearFields() {
    if (this.isEditing) {
      this.getUsuarioById(this.usuario.idUsuario)
    } else {
      this.usuario = {
        nome: '',
        email: '',
        permissao: 'EMITE_SAIDA',
      }
    }
  }

  closeDialog() {
    this.show = false
    this.isEditing = false
    this.clearFields()
  }

  async completeForm(idUsuario: number) {
    this.show = true
    this.isEditing = true
    await this.getUsuarioById(idUsuario)
  }
}

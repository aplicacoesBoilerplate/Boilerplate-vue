import type { MotivoConsulta } from '@/models/motivosModels/MotivosModels'
import { motivosServices } from '@/services/motivosServices'

export class DialogMotivosClass {
  show: boolean
  isEditing: boolean
  motivo: MotivoConsulta

  constructor() {
    this.show = false
    this.isEditing = false
    this.motivo = {
      idMotivo: 0,
      idCategoria: 0,
      descricaoMotivo: '',
      descricaoCategoria: '',
      emergencial: false,
      abaterHoraExtra: false
    }
  }

  openDialog() {
    this.show = true
  }

  async getMotivoById(idMotivo?: number) {
    if (idMotivo) this.motivo = await motivosServices.getMotivoById(idMotivo)
  }

  clearFields() {
    if (this.isEditing) {
      this.getMotivoById(this.motivo.idMotivo)
    } else {
      this.motivo = {
        idMotivo: 0,
        idCategoria: 0,
        descricaoMotivo: '',
        descricaoCategoria: '',
        emergencial: false,
        abaterHoraExtra: false
      }
    }
  }

  closeDialog() {
    this.show = false
    this.isEditing = false
    this.clearFields()
  }

  async completeForm(idMotivo: number) {
    this.show = true
    this.isEditing = true
    await this.getMotivoById(idMotivo)
  }
}

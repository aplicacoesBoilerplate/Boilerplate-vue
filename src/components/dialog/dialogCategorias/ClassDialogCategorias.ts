import type { CategoriasMotivos } from '@/models/motivosModels/MotivosModels'
import { categoriasServices } from '@/services/categoriasServices'

export class DialogCategoriasClass {
  show: boolean
  isEditing: boolean
  categoria: CategoriasMotivos

  constructor() {
    this.show = false
    this.isEditing = false
    this.categoria = {
      idCategoria: 0,
      descricaoCategoria: '',
      emergencial: false
    }
  }

  openDialog() {
    this.show = true
  }

  async getCategoriaById(idCategoria?: number) {
    if (idCategoria) this.categoria = await categoriasServices.getCategoriaById(idCategoria)
  }

  clearFields() {
    if (this.isEditing) {
      this.getCategoriaById(this.categoria.idCategoria)
    } else {
      this.categoria = {
        idCategoria: 0,
        descricaoCategoria: '',
        emergencial: false
      }
    }
  }

  closeDialog() {
    this.show = false
    this.isEditing = false
    this.clearFields()
  }

  async completeForm(idCategoria: number) {
    this.show = true
    this.isEditing = true
    await this.getCategoriaById(idCategoria)
  }

}

export class DialogFiltrosRelatoriosClass {
  show: boolean
  // filtros:

  constructor() {
    this.show = false
  }

  openDialog() {
    this.show = true
  }

  closeDialog() {
    this.show = false
    this.clearFields()
  }

  clearFields() {
    this.show = false
  }

}

import { formatarData } from "@/utils/dataNowFormat"

export class DialogExibirRelatorioGeradoClass {
  show: boolean
  dataRelatorioGerado: string

  constructor() {
    this.show = false
    this.dataRelatorioGerado = ''
  }

  openDialog() {
    this.show = true
    this.dataRelatorioGerado = formatarData(new Date())
  }

  closeDialog() {
    this.show = false
  }

}

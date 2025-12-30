import { reactive } from "vue";
import type { IModelBaseDialog } from "./models/modelComponents/ModelBaseDialog"

export class ClassBaseDialog {
  private modelBaseDialog: IModelBaseDialog

  constructor(data?: Partial<IModelBaseDialog>) {
    this.modelBaseDialog = reactive({
      visualizar: data?.visualizar ?? false,
      persistente: data?.persistente ?? false,
      maxWidth: data?.maxWidth || 400,
      maxHeight: data?.maxHeight || 400,
    })
  }

  get model() {
    return this.modelBaseDialog;
  }

  toggleDialog() {
    this.modelBaseDialog.visualizar = !this.modelBaseDialog.visualizar
  }
}

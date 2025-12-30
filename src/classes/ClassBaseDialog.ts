import { reactive } from "vue";
import type { IModelBaseDialog } from "./models/modelComponents/ModelBaseDialog"

export class ClassBaseDialog<T = any> {
  private modelBaseDialog: IModelBaseDialog<T>

  constructor(data?: Partial<IModelBaseDialog<T>>) {
    this.modelBaseDialog = reactive({
      visualizar: data?.visualizar ?? false,
      persistente: data?.persistente ?? false,
      maxWidth: data?.maxWidth || 400,
      maxHeight: data?.maxHeight || 400,
      formModoEdicao: data?.formModoEdicao ?? false,
      itemEdicao: null
    })
  }

  get model() {
    return this.modelBaseDialog;
  }

  abrirNovo() {
    this.modelBaseDialog.formModoEdicao = false;
    this.modelBaseDialog.itemEdicao = null;
    this.modelBaseDialog.visualizar = true;
  }

  abrirEdicao(item: T) {
    this.modelBaseDialog.formModoEdicao = true;
    this.modelBaseDialog.itemEdicao = { ...item };
    this.modelBaseDialog.visualizar = true;
  }

  toggleDialog() {
    this.modelBaseDialog.visualizar = !this.modelBaseDialog.visualizar
  }
}

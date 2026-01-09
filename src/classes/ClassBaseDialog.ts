import { reactive } from "vue";
import type { IModelBaseDialog } from "./models/modelComponents/ModelBaseDialog"

export class ClassBaseDialog<T = any> {
  private modelBaseDialog: IModelBaseDialog<T>

  constructor(data?: Partial<IModelBaseDialog<T>>) {
    this.modelBaseDialog = this.getDefault(data)
  }

  get model() {
    return this.modelBaseDialog;
  }

  private getDefault(data?: Partial<IModelBaseDialog<T>>) {
    return reactive({
      view: data?.view ?? false,
      persistente: data?.persistent ?? false,
      maxWidth: data?.maxWidth || 400,
      maxHeight: data?.maxHeight || 400,
      formModoEdicao: data?.formEditingMode ?? false,
      itemEdicao: null
    }) as IModelBaseDialog<T>;
  }

  abrirNovo() {
    this.modelBaseDialog.formEditingMode = false;
    this.modelBaseDialog.itemEdition = null;
    this.modelBaseDialog.view = true;
  }

  abrirEdicao(item: T) {
    this.modelBaseDialog.formEditingMode = true;
    this.modelBaseDialog.itemEdition = { ...item };
    this.modelBaseDialog.view = true;
  }

  toggleDialog() {
    this.modelBaseDialog.view = !this.modelBaseDialog.view
  }
}

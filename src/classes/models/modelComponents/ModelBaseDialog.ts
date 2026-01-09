export interface IModelBaseDialog<T = any> {
  view: boolean
  persistent?: boolean
  maxWidth?: number
  maxHeight?: number
  formEditingMode?: boolean
  itemEdition?: T | null;
}

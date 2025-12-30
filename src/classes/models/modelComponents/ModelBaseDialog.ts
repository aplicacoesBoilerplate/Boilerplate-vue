export interface IModelBaseDialog<T = any> {
  visualizar: boolean
  persistente?: boolean
  maxWidth?: number
  maxHeight?: number
  formModoEdicao?: boolean
  itemEdicao?: T | null;
}

/**
 * @description Todos os métodos remetem a comportamentos do próprio BaseDialog.vue
 */
export interface IBaseDialogExpose {
  abrir: () => void;
  fechar: () => void;
  cancelar: () => void;
  salvar: () => void;
}

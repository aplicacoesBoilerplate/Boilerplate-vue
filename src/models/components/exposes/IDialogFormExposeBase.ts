/**
 * @description Essa interface define a base dos exposes que DialogsForms devem exportar.
 * Outras interfaces devem extender dessa quando existirem nova implementações para um componente DialogForm.
 * @property {(pItem: T) => void} exibicaoDialog Um método de exibição do dialog que pode carregar ou não um item.
 * @property {() => void} concluirSalvo Método que implementa qual deve ser a ação tomada quando concluir a utilização do form.
 * @template T O tipo do item para o formulário renderizar na abertura.
 */
export interface IDialogFormExposeBase<T> {
  exibicaoDialog: (pItem?: T) => void;
  concluirSalvo: () => void;
}

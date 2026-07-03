/**
 * @description Model utilizado para definicao de propriedades de Dialogs.
 *
 * @interface IPropsBaseDialog
 * @property {boolean} persistent - Impede que o dialog feche ao clicar fora (overlay).
 * @property {boolean} scrollable - Permite scroll na area de conteudo (`v-card-text`) enquanto cabecalho/rodape ficam fixos.
 * @property {boolean} fullscreen - Expande o dialog para ocupar 100% da tela.
 * @property {string|number} minWidth - Largura minima do dialog.
 * @property {string|number} width - Largura desejada do dialog.
 * @property {string|number} maxWidth - Largura maxima permitida do dialog.
 * @property {string|number} minHeight - Altura minima do dialog.
 * @property {string|number} height - Altura desejada do dialog.
 * @property {string|number} maxHeight - Altura maxima permitida do dialog.
 * @property {string|number} zIndex - Camada do eixo Z (z-index) do componente.
 * @property {string} titulo - Titulo exibido no cabecalho padrao do dialog.
 * @property {string} iconePrependTitulo - Icone que sera exibido no prepend do cabecalho padrao do dialog.
 * @property {boolean} mostrarSlotExtension - Controla a exibicao do slot extension abaixo do toolbar do cabecalho.
 * @property {boolean} mostrarAcoes - Controla a exibicao do card-actions no rodape (Botoes cancelar/salvar).
 * @property {boolean} loading - Estado de carregamento do botao Salvar e possivel interatividade.
 * @property {string} contentClass - Classe CSS customizada repassada diretamente para o slot de content (`v-card-text`).
 */
export interface IPropsBaseDialog {
  persistent?: boolean;
  scrollable?: boolean;
  fullscreen?: boolean;
  minWidth?: string | number;
  width?: string | number;
  maxWidth?: string | number;
  minHeight?: string | number;
  height?: string | number;
  maxHeight?: string | number;
  zIndex?: string | number;
  titulo?: string;
  iconePrependTitulo?: string;
  mostrarSlotExtension?: boolean;
  mostrarAcoes?: boolean;
  loading?: boolean;
  contentClass?: string;
}

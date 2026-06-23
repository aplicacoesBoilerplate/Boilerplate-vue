export interface IPropsBaseDialog {
  /** Impede que o dialog feche ao clicar fora (overlay). */
  persistent?: boolean;
  
  /** Permite scroll na area de conteudo (`v-card-text`) enquanto cabecalho/rodape ficam fixos. */
  scrollable?: boolean;
  
  /** Expande o dialog para ocupar 100% da tela. */
  fullscreen?: boolean;
  
  /** Largura minima do dialog. */
  minWidth?: string | number;
  
  /** Largura desejada do dialog. */
  width?: string | number;
  
  /** Largura maxima permitida do dialog. */
  maxWidth?: string | number;
  
  /** Altura minima do dialog. */
  minHeight?: string | number;
  
  /** Altura desejada do dialog. */
  height?: string | number;
  
  /** Altura maxima permitida do dialog. */
  maxHeight?: string | number;
  
  /** Camada do eixo Z (z-index) do componente. */
  zIndex?: string | number;

  /** Titulo exibido no cabecalho padrao do dialog. */
  title?: string;

  /** Controla a exibicao do slot extension abaixo do toolbar do cabecalho. */
  showExtension?: boolean;

  /** Controla a exibicao do card-actions no rodape (Botoes cancelar/salvar). */
  showActions?: boolean;

  /** Estado de carregamento do botao Salvar e possivel interatividade. */
  loading?: boolean;

  /** Classe CSS customizada repassada diretamente para o slot de content (`v-card-text`). */
  contentClass?: string;
}

export interface IHeader {
  title: string;
  key: string;
  align?: 'start' | 'center' | 'end';
  sortable?: boolean;
  width?: string | number;
  [key: string]: any;
}

export interface IPropsBaseDataTable<T = any> {
  /** Lista de registros genericos a serem renderizados nas linhas da tabela. */
  registros: T[];
  
  /** Definicao das colunas da tabela, mapeando chaves do objeto para os titulos. */
  headersMarcados: IHeader[] | any[];
  
  /** Array contendo as regras de ordenacao atuais (v-model:sort-by). */
  camposOrdenacao?: any[];
  
  /** Exibe uma barra de progresso linear no topo da tabela e escurece os itens. */
  loading?: boolean;
  
  /** Define o espacamento vertical das linhas da tabela (tamanho compacto ou expandido). */
  density?: 'default' | 'comfortable' | 'compact';
  
  /** Permite ao usuario clicar em multiplas colunas para ordernar por varios campos simultaneamente. */
  multiSort?: boolean;
  
  /** Fixa o cabecalho no topo enquanto o corpo da tabela rola verticalmente. */
  fixedHeader?: boolean;
  
  /** Oculta o rodape de paginacao (util para listas continuas ou carregadas integralmente). */
  disablePagination?: boolean;
  
  /** Texto exibido enquanto loading for true e a lista de registros estiver vazia. */
  loadingText?: string;
  
  /** Altura customizada da tabela (ex: '400px', 'calc(100vh - 50px)'). */
  height?: string | number;
  
  /** Classes CSS adicionais aplicadas diretamente no wrapper v-data-table. */
  customClass?: string;
}

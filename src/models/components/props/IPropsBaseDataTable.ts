type TOpcoesAlignHeader = 'start' | 'center' | 'end';
type TOpcoesDensidadeDataTable = 'default' | 'comfortable' | 'compact';

/**
 * @description Definição das propriedades do cabeçalho para as colunas do componente de tabela nativo do vuetify.
 * @property {string} title Título exibido no cabeçalho da coluna.
 * @property {string} key Chave do objeto de dados que corresponde ao valor desta coluna.
 * @property {TOpcoesAlignHeader} [align] Alinhamento do conteúdo na coluna.
 * @property {boolean} [sortable] Define se a coluna permite ordenação ao ser clicada.
 * @property {string | number} [width] Largura customizada para a coluna.
 * @property {any} [key: string] Permite a injeção de propriedades dinâmicas adicionais.
 */
export interface IHeader {
  title: string;
  key: string;
  align?: TOpcoesAlignHeader;
  sortable?: boolean;
  width?: string | number;
  [key: string]: any;
}

/**
 * @description Interface de propriedades base para o componente DataTable.
 * @template T - Interface do tipo dos registros da tabela.
 * @property {T[]} registros Lista de registros genéricos a serem renderizados nas linhas da tabela.
 * @property {IHeader[] | any[]} headersMarcados Definição das colunas da tabela, mapeando chaves do objeto para os títulos.
 * @property {any[]} [camposOrdenacao] Array contendo as regras de ordenação atuais (v-model:sort-by).
 * @property {boolean} [loading] Exibe uma barra de progresso linear no topo da tabela e escurece os itens.
 * @property {TOpcoesDensidadeDataTable} [density] Define o espaçamento vertical das linhas da tabela (tamanho compacto ou expandido).
 * @property {boolean} [multiSort] Permite ao usuário clicar em múltiplas colunas para ordernar por vários campos simultaneamente.
 * @property {boolean} [fixedHeader] Fixa o cabeçalho no topo enquanto o corpo da tabela rola verticalmente.
 * @property {boolean} [disablePagination] Oculta o rodapé de paginação (útil para listas contínuas ou carregadas integralmente).
 * @property {string} [loadingText] Texto exibido enquanto loading for true e a lista de registros estiver vazia.
 * @property {string | number} [height] Altura customizada da tabela (ex: '400px', 'calc(100vh - 50px)').
 * @property {string} [customClass] Classes CSS adicionais aplicadas diretamente no wrapper v-data-table.
 */
export interface IPropsBaseDataTable<T = any> {
  registros: T[];
  headersMarcados: IHeader[] | any[];
  camposOrdenacao?: any[];
  loading?: boolean;
  density?: TOpcoesDensidadeDataTable;
  multiSort?: boolean;
  fixedHeader?: boolean;
  disablePagination?: boolean;
  loadingText?: string;
  height?: string | number;
  customClass?: string;
}

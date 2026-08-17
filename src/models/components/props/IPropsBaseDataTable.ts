import type { DataTableHeader, DataTableSortItem } from 'vuetify';

type TOpcoesDensidadeDataTable = 'default' | 'comfortable' | 'compact';

/**
 * @description Interface de propriedades base para o componente DataTable.
 * @template T - Interface do tipo dos registros da tabela.
 * @property {T[]} registros Lista de registros genéricos a serem renderizados nas linhas da tabela.
 * @property {DataTableHeader<T>[]} headersMarcados Definição das colunas da tabela, mapeando chaves do objeto para os títulos.
 * @property {DataTableSortItem[]} [camposOrdenacao] Array contendo as regras de ordenação atuais (v-model:sort-by).
 * @property {boolean} [loading] Exibe uma barra de progresso linear no topo da tabela e escurece os itens.
 * @property {TOpcoesDensidadeDataTable} [density] Define o espaçamento vertical das linhas da tabela (tamanho compacto ou expandido).
 * @property {boolean} [multiSort] Permite ao usuário clicar em múltiplas colunas para ordernar por vários campos simultaneamente.
 * @property {boolean} [fixedHeader] Fixa o cabeçalho no topo enquanto o corpo da tabela rola verticalmente.
 * @property {boolean} [disablePagination] Oculta o rodapé de paginação (útil para listas contínuas ou carregadas integralmente).
 * @property {string} [loadingText] Texto exibido enquanto loading for true e a lista de registros estiver vazia.
 * @property {string | number} [height] Altura customizada da tabela (ex: '400px', 'calc(100vh - 50px)').
 * @property {string} [customClass] Classes CSS adicionais aplicadas diretamente no wrapper v-data-table.
 */
export interface IPropsBaseDataTable<T = unknown> {
  registros: T[];
  headersMarcados: DataTableHeader<T>[];
  camposOrdenacao?: DataTableSortItem[];
  loading?: boolean;
  density?: TOpcoesDensidadeDataTable;
  multiSort?: boolean;
  fixedHeader?: boolean;
  disablePagination?: boolean;
  loadingText?: string;
  height?: string | number;
  customClass?: string;
}

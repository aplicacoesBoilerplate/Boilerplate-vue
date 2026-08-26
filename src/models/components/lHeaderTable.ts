/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * @description Interface que define a estrutura de uma coluna de tabela. Os atributos foram nomeados como o esperado pelo componente.
 * @property {string} title O título de exibição visual que será renderizado no cabeçalho da coluna.
 * @property {string} key A chave associada ao objeto de dados iterado, atua como identificador único da coluna.
 * @property {'start' | 'end' | 'center'} [align] Controla o alinhamento horizontal do cabeçalho e do conteúdo das células desta coluna.
 * @property {string | number} [height] Determina a altura fixa aplicável ao cabeçalho desta coluna.
 * @property {string | number} [maxHeigth] Define a restrição de altura máxima para o cabeçalho desta coluna.
 * @property {string | number} [width] Define a largura base da coluna, afetando seu dimensionamento horizontal no componente.
 * @property {string | number} [maxWidth] Impõe um limite máximo de largura, muito útil para evitar expansões indesejadas com textos extensos.
 * @property {boolean} [sortable] Determina se a coluna suporta a ordenação dos dados através da interação com o cabeçalho.
 * @property {(item: any) => string} [value] Função opcional que processa o item inteiro para gerar um valor customizado a ser exibido e ordenado (frequentemente usado em vez do valor bruto lido via `key`).
 */
export interface IHeadersDataTable {
  title: string;
  key: string;
  align?: 'start' | 'end' | 'center';
  height?: string | number;
  maxHeigth?: string | number;
  width?: string | number;
  maxWidth?: string | number;
  sortable?: boolean;
  value?: (item: any) => string;
}

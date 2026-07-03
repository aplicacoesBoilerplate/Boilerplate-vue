/**
 * @description Interface genérica responsável por representar os itens de dados do gráfico.
 * @property {number} id - Identificador único do item no gráfico.
 * @property {string} titulo - Rótulo exibido no gráfico e na legenda.
 * @property {any} valorOriginal - Valor original antes de ser convertido para rótulo textual.
 * @property {number} valor - Valor numérico agregado para o gráfico.
 * @property {string} cor - Cor sugerida para renderização do gráfico.
 */
export interface IValorGrafico {
  id: number;
  titulo: string;
  valorOriginal?: unknown;
  valor: number;
  cor?: string;
}

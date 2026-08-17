/**
 * @description Item de dados para renderização de gráficos categóricos (pizza, donut, barras).
 * @property {number} id - Identificador único do item no gráfico.
 * @property {string} titulo - Rótulo exibido no gráfico e na legenda.
 * @property {unknown} valorOriginal - Valor original antes da formatação para exibição.
 * @property {number} valor - Valor numérico agregado usado na renderização.
 * @property {string} cor - Cor sugerida para renderização (hex ou token do tema).
 */
export interface IValorGrafico {
  id: number;
  titulo: string;
  valorOriginal?: unknown;
  valor: number;
  cor?: string;
}

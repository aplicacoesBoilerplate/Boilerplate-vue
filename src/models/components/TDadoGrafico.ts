/**
 * @description Dado simplificado para renderização de gráficos.
 * @property {string} rotulo - Rótulo exibido no gráfico e legenda.
 * @property {number} valor - Valor numérico agregado.
 * @property {string} agrupador - Nome do agrupador usado para agrupar dados.
 */
export type TDadoGrafico = {
  rotulo: string;
  valor: number;
  agrupador?: string;
};

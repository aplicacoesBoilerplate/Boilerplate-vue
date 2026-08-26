/**
 * @description Define a configuração de um campo utilizado como agrupamento em gráficos.
 * @property {string} chave - Chave do atributo agrupado nos registros consultados.
 * @property {string} titulo - Título exibido nas representações gráficas.
 * @property {'sum' | 'count'} [agregador] - Operação usada para consolidar os valores agrupados.
 * @property {(valor?: unknown) => string} [formatador] - Função usada para formatar os rótulos do gráfico.
 * @property {Record<string, string>} [cores] - Cores indexadas pelo valor original, com precedência sobre o mapeamento global.
 */
export interface IConfiguracaoGrafico {
  chave: string;
  titulo: string;
  agregador?: 'sum' | 'count';
  formatador?: (valor?: unknown) => string;
  cores?: Record<string, string>;
}

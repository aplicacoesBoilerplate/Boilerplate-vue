/**
 * @description Interface do Objeto de filtros para uma consulta.
 * @template T - Espera receber a interface do objeto filtrado.
 * 
 * @property {keyof T & string} campo - Só permite filtrar um campo se existir um atributo correspondente no objeto filtrado.
 * @property {string} condicao - Valor lógico da regra que será aplicada na consulta filtrada.
 * @property {unknown} valor - Valor que será utilizado na regra lógica para filtros dos registros.
 * @property {Date | string | null} dataInicio - Quando permitido utilizar filtros de data, início do range.
 * @property {Date | string | null} dataFinal - Quando permitido utilizar filtros de data, final do range. 
 * @property {unknown[]} valoresSelecionados - Quando permitido utilizar uma lista de valores. 
 */
export interface IFiltrosConsulta<T = object> {
  campo: keyof T & string;
  condicao: string;
  valor?: unknown;
  dataInicio?: Date | string | null;
  dataFinal?: Date | string | null;
  valoresSelecionados?: unknown[];
}

/**
 * @description Representa um filtro transitado entre componentes, store, URL e storage sem conhecer o registro da rota.
 * Usa chaves textuais para preservar a serialização; antes da requisição, a lista converte o filtro
 * para o contrato tipado do service consumidor.
 */
export type TFiltroConsultaSerializado = IFiltrosConsulta<Record<string, unknown>>;

/**
 * @description Type genérico responsável por configurar o payload da consulta auxiliar de registros disponível para um campo do filtro.
 * @template TRegistro - O tipo do registro que será consultado.
 * @property {keyof TRegistro & string} campo - O campo que será consultado.
 * @property {EOperadoresFiltro} condicao - O operador que será utilizado na consulta.
 * @property {number} limite - A quantidade de registros retornados por página.
 * @property {unknown} proximaEntrada - Cursor usado para buscar a próxima página.
 * @property {string} termoPesquisa - O termo de pesquisa utilizado na consulta.
 */
export interface IConsultaRegistrosFiltroPayload {
  campo: string;
  condicao?: string;
  limite: number;
  proximaEntrada?: unknown;
  termoPesquisa: string;
}

/**
 * @description Interface genérica responsável por configurar o resultado da consulta auxiliar de registros disponível para um campo do filtro.
 * @template TRegistro - O tipo do registro que será consultado.
 * @property {TRegistro[]} registros - Registros retornados pela consulta auxiliar.
 * @property {unknown} proximaEntrada - Cursor usado para buscar a próxima página.
 * @property {boolean} possuiMais - Indica se ainda existem registros para paginação.
 */
export interface IResultadoConsultaRegistrosFiltro<TRegistro extends object = Record<string, unknown>> {
  registros: TRegistro[];
  proximaEntrada?: unknown;
  possuiMais?: boolean;
}

/**
 * @description Type genérico responsável por configurar a função de busca de registros auxiliares disponível para um campo do filtro.
 * @template TRegistro - O tipo do registro que será consultado.
 * @property {IResultadoConsultaRegistrosFiltro<TRegistro> | TRegistro[]} buscarRegistros - A função responsável por consultar os registros auxiliares.
 */
export type TBuscarRegistrosFiltro<TRegistro extends object = Record<string, unknown>> = (
  pPayload: IConsultaRegistrosFiltroPayload,
) => Promise<IResultadoConsultaRegistrosFiltro<TRegistro> | TRegistro[]>;

/**
 * @description Interface genérica responsável por configurar a consulta auxiliar de registros disponível para um campo do filtro.
 * @template TRegistro - O tipo do registro que será consultado.
 * @property {keyof TRegistro & string} atributoValor - O atributo do registro usado como valor aplicado no filtro.
 * @property {keyof TRegistro & string} atributoDescricao - O atributo do registro usado como descrição visual na lista.
 * @property {TBuscarRegistrosFiltro<TRegistro>} buscarRegistros - A função responsável por consultar os registros auxiliares.
 * @property {number} limiteInicial - A quantidade inicial carregada por página.
 * @property {string} textoVazio - O texto exibido quando a consulta não retornar registros.
 */
export interface IConsultaRegistrosFiltro<TRegistro extends object = Record<string, unknown>> {
  atributoValor: keyof TRegistro & string;
  atributoDescricao: keyof TRegistro & string;
  buscarRegistros: TBuscarRegistrosFiltro<TRegistro>;
  limiteInicial?: number;
  textoVazio?: string;
}

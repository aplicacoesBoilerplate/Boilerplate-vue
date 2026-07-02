export interface IConsultaRegistrosFiltroPayload {
  /**
   * Campo atualmente selecionado no formulário de filtros.
   */
  campo: string;

  /**
   * Condição escolhida no filtro, usada pelo backend para ajustar a consulta auxiliar.
   */
  condicao?: string;

  /**
   * Quantidade máxima de registros retornados por página.
   */
  limite: number;

  /**
   * Cursor usado para buscar a próxima página da consulta auxiliar.
   */
  proximaEntrada?: unknown;

  /**
   * Termo digitado na barra de pesquisa da consulta auxiliar.
   */
  termoPesquisa: string;
}

export interface IResultadoConsultaRegistrosFiltro<TRegistro extends object = Record<string, unknown>> {
  /**
   * Registros retornados pela consulta auxiliar.
   */
  registros: TRegistro[];

  /**
   * Cursor usado para buscar a próxima página.
   */
  proximaEntrada?: unknown;

  /**
   * Indica se ainda existem registros para paginação.
   */
  possuiMais?: boolean;
}

export type TBuscarRegistrosFiltro<TRegistro extends object = Record<string, unknown>> = (
  pPayload: IConsultaRegistrosFiltroPayload,
) => Promise<IResultadoConsultaRegistrosFiltro<TRegistro> | TRegistro[]>;

export interface IConsultaRegistrosFiltro<TRegistro extends object = Record<string, unknown>> {
  /**
   * Atributo do registro usado como valor aplicado no filtro.
   */
  atributoValor: keyof TRegistro & string;

  /**
   * Atributo do registro usado como descrição visual na lista.
   */
  atributoDescricao: keyof TRegistro & string;

  /**
   * Função responsável por consultar os registros auxiliares.
   */
  buscarRegistros: TBuscarRegistrosFiltro<TRegistro>;

  /**
   * Quantidade inicial carregada por página.
   */
  limiteInicial?: number;

  /**
   * Texto exibido quando a consulta não retornar registros.
   */
  textoVazio?: string;
}

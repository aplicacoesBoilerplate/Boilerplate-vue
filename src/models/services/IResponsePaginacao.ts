// Interface para o contrato de paginação utilizado no backend.
export interface IResponsePaginacao<T> {
  /**
   * Quantidade máxima de registros solicitados na requisição.
   */
  limite: number;

  /**
   * Cursor usado para solicitar a próxima página.
   */
  proximaEntrada?: unknown;

  /**
   * Lista de registros retornados na requisição.
   */
  items: T[];

  /**
   * Indica se existem registros adicionais para a próxima página.
   */
  temMaisRegistros: boolean;
}

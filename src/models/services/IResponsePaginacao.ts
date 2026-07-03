// Interface para o contrato de paginação utilizado no backend.
export interface IResponsePaginacao<T> {
  /**
   * Quantidade máxima de registros solicitados na requisição.
   */
  limite: number

  /**
   * Cursor usado para solicitar a próxima página.
   */
  proximaEntrada: number

  /**
   * Lista de registros retornados na requisição.
   */
  items?: Array<T>
}

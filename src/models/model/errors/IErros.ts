/**
 * @description Interface para representar a consulta pelo registros de erros do sistema.
 * @property {number} idError - Identificador do registro de falha.
 * @property {string} mensagem - Mensagem de erro.
 * @property {string} arquivo - Arquivo onde o erro ocorreu.
 * @property {string} classe - Classe onde o erro ocorreu.
 * @property {string} metodo - Método onde o erro ocorreu.
 * @property {number} linha - Linha onde o erro ocorreu.
 * @property {number} httpStatusCode - Status HTTP do erro.
 * @property {number} idUsuario - Identificador do usuário que causou o erro quando existe.
 * @property {string} usuarioReferencia - E-mail de referência do usuário ou 'SISTEMA' quando não existe.
 * @property {Date} dataHora - Data e hora do erro.
 */
export interface IErros {
  idError: number;
  mensagem: string;
  arquivo: string;
  classe: string;
  metodo: string;
  linha: number;
  httpStatusCode: number;
  idUsuario?: number;
  usuarioReferencia: string;
  dataHora: Date;
}

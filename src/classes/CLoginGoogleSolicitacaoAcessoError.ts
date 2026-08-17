// Types e Interfaces
import type { ILoginGoogleSolicitacaoAcesso } from '@/models/model/core/autenticacao.model';

// Constantes
export const CODIGO_SOLICITACAO_ACESSO_GOOGLE = 'GOOGLE_ACCESS_REQUEST_REQUIRED';

/**
 * @description Erro lançado quando o login via Google exige uma solicitação de acesso prévia.
 * @property {readonly string} codigo - Código identificador do erro.
 * @property {readonly ILoginGoogleSolicitacaoAcesso} dados - Dados da conta do Google associada à solicitação de acesso.
 * @property {readonly string} message - Mensagem descritiva do erro.
 * @property {readonly string} stack - Stack trace do erro.
 * @property {readonly string} name - Nome do erro.
 * @constructor
 * @param pDados Dados da conta do Google associada à solicitação de acesso.
 * @param pMensagem Mensagem descritiva do erro.
 */
export class CLoginGoogleSolicitacaoAcessoError extends Error {
  public readonly codigo = CODIGO_SOLICITACAO_ACESSO_GOOGLE;
  public readonly dados: ILoginGoogleSolicitacaoAcesso;

  /**
   * @description Construtor da classe de erro de solicitação de acesso Google.
   * @param pDados Dados da conta retornados pelo backend para solicitar o acesso.
   * @param pMensagem Mensagem descritiva do erro.
   */
  public constructor(pDados: ILoginGoogleSolicitacaoAcesso, pMensagem: string) {
    super(pMensagem);
    this.name = 'CLoginGoogleSolicitacaoAcessoError';
    this.dados = pDados;
  }
}

/**
 * @description Verifica se um erro qualquer é uma instância de CLoginGoogleSolicitacaoAcessoError.
 * @param pErro O erro que será verificado.
 * @returns Retorna true se o erro for do tipo de solicitação de acesso do Google, caso contrário, false.
 */
export function isLoginGoogleSolicitacaoAcessoError(pErro: unknown): pErro is CLoginGoogleSolicitacaoAcessoError {
  return (
    typeof pErro === 'object' &&
    pErro !== null &&
    'codigo' in pErro &&
    (pErro as { codigo?: unknown }).codigo === CODIGO_SOLICITACAO_ACESSO_GOOGLE &&
    'dados' in pErro
  );
}

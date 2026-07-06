/**
 * @property {string} nome - Nome informado na solicitação de acesso.
 * @property {string} email - E-mail usado para criar a conta.
 * @property {string} senha - Senha inicial informada pelo usuário.
 * @property {string} confirmarSenha - Confirmação da senha inicial.
 */
export interface IUsuarioSolicitacaoAcesso {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
}

/**
 * Cria um novo objeto IUsuarioSolicitacaoAcesso com valores padrão.
 * @returns {IUsuarioSolicitacaoAcesso} Objeto com valores padrão.
 */
export function criarRegistroPadrao(): IUsuarioSolicitacaoAcesso {
  return {
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
  };
}

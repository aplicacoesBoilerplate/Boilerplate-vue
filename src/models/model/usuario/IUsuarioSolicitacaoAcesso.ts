export interface IUsuarioSolicitacaoAcesso {
  /**
   * Nome informado na solicitação de acesso.
   */
  nome: string;

  /**
   * E-mail usado para criar a conta.
   */
  email: string;

  /**
   * Senha inicial informada pelo usuário.
   */
  senha: string;

  /**
   * Confirmação da senha inicial.
   */
  confirmarSenha: string;
}

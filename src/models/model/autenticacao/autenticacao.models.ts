export interface ILogin {
  /**
   * E-mail usado na autenticação.
   */
  email: string;

  /**
   * Senha informada pelo usuário.
   */
  password: string;
}

export interface ILoginGoogle {
  /**
   * Credencial JWT retornada pelo Google Identity Services.
   */
  credential: string;
}

export interface IRespostaLogin {
  /**
   * Token JWT emitido pelo backend.
   */
  tokenJWT: string;
}

export interface IRespostaUsuarioAutenticado {
  /**
   * Identificador do usuário autenticado no backend.
   */
  idUsuario: number;
}

export interface ISolicitacaoRecuperacaoSenha {
  /**
   * E-mail que receberá o código de recuperação.
   */
  email: string;
}

export interface IVerificacaoCodigoRecuperacaoSenha extends ISolicitacaoRecuperacaoSenha {
  /**
   * Código OTP enviado para o e-mail informado.
   */
  codigo: string;
}

export interface IRedefinicaoSenhaRecuperacao extends IVerificacaoCodigoRecuperacaoSenha {
  /**
   * Nova senha escolhida pelo usuário.
   */
  senha: string;

  /**
   * Confirmação da nova senha escolhida pelo usuário.
   */
  confirmarSenha: string;
}

export interface IConfirmPassword extends ILogin {
  /**
   * Confirmação da senha atual.
   */
  confirmPassword: string;
}

export interface IAlterPassword {
  /**
   * E-mail do usuário que terá a senha alterada.
   */
  emailUser: string;

  /**
   * Senha atual do usuário.
   */
  passwordUser: string;

  /**
   * Nova senha desejada.
   */
  newPassword: string;

  /**
   * Confirmação da nova senha.
   */
  confirmNewPassword: string;
}

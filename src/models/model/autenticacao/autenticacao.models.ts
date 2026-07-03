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

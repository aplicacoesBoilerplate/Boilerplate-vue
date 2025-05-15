// Utilizar no login
export interface LoginModel {
  email_usuario: string
  senha_usuario: string
}

export interface ConfirmarSenha extends LoginModel {
  confirmar_senha: string
}

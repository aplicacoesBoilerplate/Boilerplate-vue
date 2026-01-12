export interface ILogin {
  email: string
  password: string
}

export interface IConfirmPassword extends ILogin {
  confirmPassword: string
}

export interface IAlterPassword {
  emailUser: string
  passwordUser: string
  newPassword: string
  confirmNewPassword: string
}

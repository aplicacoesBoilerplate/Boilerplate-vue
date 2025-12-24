export interface ILogin {
  emailUser: string
  passwordUser: string
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

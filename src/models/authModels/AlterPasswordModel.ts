// Utilizar no alter password em profile
export interface AlterPassword {
  emailUsuario: string
  senhaUsuario: string
  novaSenha: string
  confirmarNovaSenha: string
}

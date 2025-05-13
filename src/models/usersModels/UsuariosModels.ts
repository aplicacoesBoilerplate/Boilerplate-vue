// Novo usuário
export interface NovoUsuario {
  nome: string
  email: string
  senha: string
  permissao?: string
  autorizaSaida?: boolean
}

// Atualizar usuário
export interface AtualizarUsuario {
  idUsuario: number
  nome: string
  email: string
  permissao?: string
  autorizaSaida?: boolean
  ativo?: boolean
  contaBloqueada?: boolean
  contaExpiraEm?: Date
  senhaExpirada?: boolean
  tentativasFalhas?: number
}

// Consulta de usuário
export interface UsuarioConsulta {
  idUsuario: number
  nome: string
  email: string
  permissao: string
  autorizaSaida: boolean
  ativo: boolean
  contaBloqueada: boolean
  contaExpiraEm: Date
  senhaExpirada: boolean
  tentativasFalhas: number
}

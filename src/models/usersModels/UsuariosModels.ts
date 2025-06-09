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
  idUsuario?: number
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

// Informações confidenciais do usuário
export interface UsuarioDetais {
  usuario: UsuarioConsulta // Dados padrão do usuário
  enabled: boolean // Ativo com o valor invertido
  accountNonLocked: boolean // Bloqueado com o valor invertido
  username: string // E-mail
  authorities: [
    // Lista de roles com base na permissão
    {
      authority: string
    },
  ]
  accountNonExpired: boolean // Conta expirada
  credentialsNonExpired: boolean // Credenciais expiradas
}

export const PermissoesUsuarios = [
  'ADMINISTRADOR_AUTORIZADO',
  'ADMINISTRADOR',
  'EMITE_AUTORIZACAO',
  'EMITE_SAIDA',
  'PORTARIA',
]

// Lista de objetos com as permissões dos usuários com chave e valor
export const PermissoesUsuariosAutoComplete = [
  { texto: 'ADMINISTRADOR AUTORIZADO', valor: 'ADMINISTRADOR_AUTORIZADO' },
  { texto: 'ADMINISTRADOR', valor: 'ADMINISTRADOR' },
  { texto: 'EMITE AUTORIZACAO', valor: 'EMITE_AUTORIZACAO' },
  { texto: 'EMITE SAIDA', valor: 'EMITE_SAIDA' },
  { texto: 'PORTARIA', valor: 'PORTARIA' },
]

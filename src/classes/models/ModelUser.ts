export interface IUser {
  idUser?: number
  username: string
  email: string
  role: string
  phoneNumber?: string
  receiveNotifications?: boolean
  active?: boolean
  attemptsFailures?: number
}

// Informações confidenciais do usuário
export interface UsuarioDetais {
  usuario: IUser // Dados padrão do usuário
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

// Tipagem da lista
interface permissoesAutoComplete {
  chave: string
  valor: string
}

// Lista de objetos com as permissões dos usuários com chave e valor
export const PermissoesUsuariosAutoComplete: Array<permissoesAutoComplete> = [
  { chave: 'ADMINISTRADOR AUTORIZADO', valor: 'ADMINISTRADOR_AUTORIZADO' },
  { chave: 'ADMINISTRADOR', valor: 'ADMINISTRADOR' },
  { chave: 'EMITE AUTORIZACAO', valor: 'EMITE_AUTORIZACAO' },
  { chave: 'EMITE SAIDA', valor: 'EMITE_SAIDA' },
  { chave: 'PORTARIA', valor: 'PORTARIA' },
]

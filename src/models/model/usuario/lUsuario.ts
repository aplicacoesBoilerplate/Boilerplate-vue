// Tipos para representar os papéis válidos.
// IMPORTANTE: O enum deve estar em MAIÚSCULO para coincidir com o auth.service.
export const PAPEIS_VALIDOS = ['ADMIN', 'USER'] as const;
export type TPapel = (typeof PAPEIS_VALIDOS)[number];

// Mapeamento para os títulos de cada papel
export const DESCRICAO_PAPEL: Record<TPapel, string> = {
  ADMIN: 'Administrador',
  USER: 'Usuário',
};

// Mapeamento para os ícones de cada papel
export const ICONE_PAPEL: Record<TPapel, string> = {
  ADMIN: 'mdi-account-tie',
  USER: 'mdi-account',
};

// Extraído o tipo do papel para ser usado em input fixtures no form.
export type TPapelUsuario = {
  papel: TPapel;
};

export interface IUsuario extends TPapelUsuario {
  id?: number;
  nome: string;
  email: string;
  avatar?: string;
  telefone?: string;
  notificar?: boolean;
  ativo?: boolean;
}

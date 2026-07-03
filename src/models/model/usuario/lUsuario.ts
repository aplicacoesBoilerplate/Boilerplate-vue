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

type TMapeamentoPapeis = {
  valor: string;
  label: string;
  icone: string;
}

// Mapeamento para o autocomplete do SelectRole
export const MAPEAMENTO_PAPEIS: Record<TPapel, TMapeamentoPapeis> = {
  ADMIN: {
    valor: 'ADMIN',
    label: 'Administrador',
    icone: 'mdi-account-tie',
  },
  USER: {
    valor: 'USER',
    label: 'Usuário',
    icone: 'mdi-account',
  },
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

/**
 * @description
 * Função para criar um objeto usuário com dados padrão.
 * @param pDados - Objeto IUsuario com dados opcionais.
 * @returns Objeto IUsuario com dados padrão.
 */
export function criarUsuarioPadrao(pDados: Partial<IUsuario> = {}): IUsuario {
  return {
    id: pDados.id,
    nome: pDados.nome ?? '',
    email: pDados.email ?? '',
    papel: pDados.papel ?? 'USER',
    telefone: pDados.telefone ?? '',
    notificar: pDados.notificar ?? false,
    ativo: pDados.ativo ?? true,
  };
}

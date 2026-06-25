// Tipos para representar as roles válidas.
// IMPORTANTE: O enum deve estar em MAIÚSCULO para coincidir com o auth.service.
export const VALID_ROLES = ["ADMIN", "USER"] as const;
export type TRole = (typeof VALID_ROLES)[number];

// Mapeamento para os ícones de cada role
export const ROLE_ICONS: Record<TRole, string> = {
  ADMIN: "mdi-account-tie",
  USER: "mdi-account",
};

// Mapeamento para os títulos de cada role
export const ROLE_TITLES: Record<TRole, string> = {
  ADMIN: "Administrador",
  USER: "Usuário",
};

// Extraído o tipo da role para ser usado em input fixtures no form.
export type TUserRole = {
  role: TRole;
};

export interface IUser extends TUserRole {
  idUser?: number;
  username: string;
  email: string;
  avatar?: string;
  phoneNumber?: string;
  receiveNotifications?: boolean;
  active?: boolean;
}

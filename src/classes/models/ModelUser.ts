export const ValidRoles = [
  'ADMIN',
  'USER',
] as const;

export type RoleType = typeof ValidRoles[number];

export type UserRole = {
  role: RoleType;
}

export interface IUser extends UserRole {
  idUser?: number
  username: string
  email: string
  phoneNumber?: string
  receiveNotifications?: boolean
  active?: boolean
}

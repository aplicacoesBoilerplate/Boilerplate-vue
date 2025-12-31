export interface IUser {
  idUser?: number
  username: string
  email: string
  role: string
  phoneNumber?: string
  receiveNotifications?: boolean
  active?: boolean
}

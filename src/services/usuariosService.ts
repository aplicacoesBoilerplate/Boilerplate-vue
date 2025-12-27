// Models
import type { IHeaderPaginatorModel } from '@/classes/models/ModelHeaderPaginator'
import type { IUser } from '@/classes/models/ModelUser'
// Services
import http from './axios'

export const usersServices = {
  async getAllUsers(): Promise<IHeaderPaginatorModel<IUser>> {
    try {
      const { data } = await http.get('/usuarios/consulta')
      return data
    } catch (error) {
      throw error
    }
  },

  async searchUsuarios() {
    try {
      const { data } = await http.get('/usuarios/search', {
        // params: paginador,
      })
      return data
    } catch (error) {
      throw error
    }
  },

  async getUserById(idUsuario?: number): Promise<IUser> {
    if (idUsuario) {
    }
    try {
      const { data } = await http.get(`/usuarios/${idUsuario}`)
      return data.usuario
    } catch (error) {
      throw error
    }
  },

  async createUser(newUser: IUser): Promise<IUser> {
    try {
      const { data } = await http.post('/usuarios', newUser)
      return data
    } catch (error) {
      throw error
    }
  },

  async solicitarAcesso(newUser: IUser): Promise<IUser> {
    try {
      const { data } = await http.post('/usuarios/registrar', newUser)
      return data
    } catch (error) {
      throw error
    }
  },

  async updateUser(user: IUser): Promise<IUser> {
    await this.getUserById(user.idUser!)
    try {
      const { data } = await http.put(`/usuarios/${user.idUser}`, user)
      return data
    } catch (error) {
      throw error
    }
  },

  async deleteUser(id: number): Promise<void> {
    await this.getUserById(id)
    try {
      await http.delete(`/usuarios/${id}`)
    } catch (error) {
      throw error
    }
  },
}

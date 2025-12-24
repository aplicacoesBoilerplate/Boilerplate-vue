// Classes
import type { PaginatorClass } from '@/components/paginator/ClassPaginator'
// Store
// Models
import type { IHeaderPaginatorModel } from '@/classes/models/ModelHeaderPaginator'
import type { IUser } from '@/classes/models/ModelUser'
// Services
import http from './axios'

export const usuariosServices = {
  // Serviço para consumir o endpoint da API de consulta paginada dos usuários
  async getAllUsers(paginador: PaginatorClass): Promise<IHeaderPaginatorModel<IUser>> {
    try {
      const { data } = await http.get('/usuarios/consulta', {
        params: paginador,
      })
      return data
    } catch (error) {
      throw error
    }
  },

  // Serviço para consumir o endpoint da API de consulta paginada dos usuários de acordo com um campo de busca
  async searchUsuarios(paginador: PaginatorClass) {
    try {
      const { data } = await http.get('/usuarios/search', {
        params: paginador,
      })
      return data
    } catch (error) {
      throw error
    }
  },

  // Serviço para consumir o endpoint da API de consulta de um usuário pelo Id
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

  // Serviço para consumir o endpoint da API de cadastrar um usuário com senha padrão, sem bloqueio de conta e permissão, usado por adm's
  async createUser(newUser: IUser): Promise<IUser> {
    try {
      const { data } = await http.post('/usuarios', newUser)
      return data
    } catch (error) {
      throw error
    }
  },

  // Serviço para consumir o endpoint da API de cadastrar um usuário com senha definida no cadastro, com bloqueio de conta e permissão nula, usado por usuários comuns
  async solicitarAcesso(newUser: IUser): Promise<IUser> {
    try {
      const { data } = await http.post('/usuarios/registrar', newUser)
      return data
    } catch (error) {
      throw error
    }
  },

  // Serviço para consumir o endpoint da API de atualizar um usuário, usado no perfil e por adm's
  async updateUser(user: IUser): Promise<IUser> {
    await this.getUserById(user.idUser!)
    try {
      const { data } = await http.put(`/usuarios/${user.idUser}`, user)
      return data
    } catch (error) {
      throw error
    }
  },

  // Serviço para consumir o endpoint da API de deletar um usuário, função sensível, deve ser emitida como callback após confirmar senha
  async deleteUser(id: number): Promise<void> {
    await this.getUserById(id)
    try {
      await http.delete(`/usuarios/${id}`)
    } catch (error) {
      throw error
    }
  },
}

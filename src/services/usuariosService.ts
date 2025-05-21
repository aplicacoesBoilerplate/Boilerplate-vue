// Componentes
// Store
import { useSnackbarStore } from '@/stores/SnackbarStore'
// Models
import type { HeaderPaginatorModel } from '@/models/HeaderPaginatorModel'
import type { UsuarioConsulta } from '@/models/usersModels/UsuariosModels'
// Services
import http from './axios'
import { removerUndefineds } from '@/utils/removerUndefineds'
import type { PaginatorClass } from '@/components/paginator/ClassPaginator'

export const useServicesUsuario = {
  // Serviço para consumir o endpoint da API de consulta paginada dos usuários
  async getAllUsers(paginador: PaginatorClass): Promise<HeaderPaginatorModel<UsuarioConsulta>> {
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
  async getUserById(id: number | string): Promise<UsuarioConsulta> {
    try {
      const response = await http.get(`/usuarios/${id}`)

      return response.data.usuario
    } catch (error) {
      throw error
    }
  },

  // Serviço para consumir o endpoint da API de cadastrar um usuário com senha padrão, sem bloqueio de conta e permissão, usado por adm's
  async createUser(newUser: UsuarioConsulta): Promise<UsuarioConsulta> {
    try {
      const response = await http.post('/usuarios', newUser)
      // await this.getAllUsers()
      useSnackbarStore().showSnackbar('User created successfully!', 'success')
      return response.data
    } catch (error) {
      useSnackbarStore().showSnackbar('An error occurred while registering!', 'red')
      throw error
    }
  },

  // Serviço para consumir o endpoint da API de cadastrar um usuário com senha definida no cadastro, com bloqueio de conta e permissão nula, usado por usuários comuns
  async solicitarAcesso(newUser: UsuarioConsulta): Promise<UsuarioConsulta> {
    try {
      const response = await http.post('/usuarios/registrar', newUser)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Serviço para consumir o endpoint da API de atualizar um usuário, usado no perfil e por adm's
  async updateUser(user: UsuarioConsulta): Promise<UsuarioConsulta> {
    await this.getUserById(user.idUsuario!)
    try {
      const response = await http.put(`/usuarios/${user.idUsuario}`, user)
      // await this.getAllUsers()
      useSnackbarStore().showSnackbar('Record updated successfully!', 'success')
      return response.data
    } catch (error) {
      useSnackbarStore().showSnackbar('An error occurred while updating the record!', 'red')
      throw error
    }
  },

  // Serviço para consumir o endpoint da API de deletar um usuário, função sensível, deve ser emitida como callback após confirmar senha
  async deleteUser(id: number): Promise<void> {
    await this.getUserById(id)
    try {
      await http.delete(`/usuarios/${id}`)
      // await this.getAllUsers()
      useSnackbarStore().showSnackbar('Record deleted successfully!', 'success')
    } catch (error) {
      useSnackbarStore().showSnackbar('An error occurred while deleting the record!', 'red')
      throw error
    }
  },
}

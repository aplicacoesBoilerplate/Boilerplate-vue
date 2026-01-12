import type { IAlterPassword, IConfirmPassword, ILogin } from '@/classes/models/ModelLogin'
import http from './axios'
import type { IUser } from '@/classes/models/ModelUser'
import { usersServices } from './usersService'

export const authServices = {
  async login(loginData: ILogin): Promise<string> {
    try {
      const response = await http.post('/auth/login', loginData)
      const token = response.data.tokenJWT
      sessionStorage.setItem('token', token)
      return token
    } catch (error) {
      throw error
    }
  },

  async logout() {
    sessionStorage.removeItem('token')
  },

  async getByToken(): Promise<IUser> {
    try {
      const { data } = await http.get('/auth/me') // Consulta os dados do usuário autenticado
      const usuario = await usersServices.getUserById(data.idUsuario) // Pega o id que não muda e consulta o estado atual no banco
      return usuario // Retorna os dados do usuário autenticado com base no banco de dados (atualizado)
    } catch (error) {
      throw error
    }
  },

  async confirmarSenha(confirmar: IConfirmPassword): Promise<Boolean> {
    try {
      const usuarioToken = await this.getByToken() // Pega os dados do usuário autenticado
      const usuario = await usersServices.getUserById(usuarioToken.idUser) // Pega o id que não muda e consulta o estado atual no banco
      confirmar.email = usuario.email // Atribuir o e-mail para facilitar o preenchimento do formulário
      const { data } = await http.post('/auth/confirmar', confirmar)
      return data
    } catch (error) {
      throw error
    }
  },

  async alterarSenha(alter: IAlterPassword) {
    try {
      const { data } = await http.put('/auth/alter', alter)
      return data
    } catch (error) {
      throw error
    }
  },

  async resetarSenhaAoPadrao(emailUsuario: string) {
    try {
      await http.put(`/auth/resetar-senha?emailUsuario=${emailUsuario}`)
    } catch (error) {
      throw error
    }
  },
}

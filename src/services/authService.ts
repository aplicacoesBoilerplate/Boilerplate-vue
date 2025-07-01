import type { AlterarSenha, ConfirmarSenha, LoginModel } from '@/models/authModels/LoginModel'
import http from './axios'
import type { UsuarioConsulta } from '@/models/usersModels/UsuariosModels'
import { usuarioAutenticado } from '@/stores/usuarioAutenticado'
import { usuariosServices } from './usuariosService'

async function login(loginData: LoginModel): Promise<string> {
  try {
    const response = await http.post('/auth/login', loginData)
    const token = response.data.tokenJWT
    sessionStorage.setItem('token', token)
    return token
  } catch (error) {
    throw error
  }
}

function logout() {
  sessionStorage.removeItem('token')
}

async function getByToken(): Promise<UsuarioConsulta> {
  try {
    const { data } = await http.get('/auth/me') // Consulta os dados do usuário autenticado
    const usuario = await usuariosServices.getUserById(data.idUsuario) // Pega o id que não muda e consulta o estado atual no banco
    usuarioAutenticado().setUsuario(usuario) // Atualiza o estado global com os dados do usuário
    return usuario // Retorna os dados do usuário autenticado com base no banco de dados (atualizado)
  } catch (error) {
    throw error
  }
}

async function confirmarSenha(confirmar: ConfirmarSenha): Promise<Boolean> {
  try {
    const usuarioToken = await getByToken() // Pega os dados do usuário autenticado
    const usuario = await usuariosServices.getUserById(usuarioToken.idUsuario) // Pega o id que não muda e consulta o estado atual no banco
    confirmar.email_usuario = usuario.email // Atribuir o e-mail para facilitar o preenchimento do formulário
    const { data } = await http.post('/auth/confirmar', confirmar)
    return data
  } catch (error) {
    throw error
  }
}

async function alterarSenha(alter: AlterarSenha) {
  try {
    const { data } = await http.put('/auth/alter', alter)
    return data
  } catch (error) {
    throw error
  }
}

async function resetarSenhaAoPadrao(emailUsuario: string) {
  try {
    await http.put(`/auth/resetar-senha?emailUsuario=${emailUsuario}`)
  } catch (error) {
    throw error
  }
}

export function authServices() {
  return {
    login,
    logout,
    confirmarSenha,
    alterarSenha,
    getByToken,
    resetarSenhaAoPadrao,
  }
}

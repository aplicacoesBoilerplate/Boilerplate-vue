import type { AlterarSenha, ConfirmarSenha, LoginModel } from '@/models/authModels/LoginModel'
import http from './axios'
import type { UsuarioConsulta } from '@/models/usersModels/UsuariosModels'

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

async function confirmarSenha(confirmar: ConfirmarSenha): Promise<Boolean> {
  try {
    const email = await getByToken()
    confirmar.email_usuario = email.email
    const response = await http.post('/auth/confirmar', confirmar)
    return response.data
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

async function getByToken(): Promise<UsuarioConsulta> {
  try {
    const { data } = await http.get('/auth/me')
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

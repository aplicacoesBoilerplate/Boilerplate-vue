import type { ConfirmarSenha, LoginModel } from '@/models/authModels/LoginModel'
import http from './axios'
import axios from 'axios'

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

async function confirmarSenha(confirmar: ConfirmarSenha) {
  try {
    await http.post('/auth/confirmar', confirmar)
  } catch (error) {
    throw error
  }
}

export function authServices() {
  return {
    login,
    logout,
    confirmarSenha,
  }
}

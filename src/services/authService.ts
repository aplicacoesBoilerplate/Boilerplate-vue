import type { LoginModel } from '@/models/authModels/LoginModel'
import http from './axios'
import { useSnackbarStore } from '@/stores/SnackbarStore'
import axios from 'axios'

async function login(loginData: LoginModel): Promise<string> {
  try {
    const response = await http.post('/auth/login', loginData)

    const token = response.data.tokenJWT
    if (!token) throw new Error('Token JWT não encontrado na resposta.')

    sessionStorage.setItem('token', token)
    useSnackbarStore().showSnackbar('Welcome!', 'success')

    return token
  } catch (error) {
    let mensagemErro = 'Erro inesperado.'

    if (axios.isAxiosError(error) && error.response?.data)
      mensagemErro = error.response.data.erro || 'Erro interno não tratado.'

    useSnackbarStore().showSnackbar(mensagemErro, 'red')
    throw error
  }
}

function logout() {
  sessionStorage.removeItem('token')
}



export function authServices() {
  return {
    login,
    logout,
  }
}

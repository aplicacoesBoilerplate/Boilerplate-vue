import type { UsuarioConsulta } from '@/models/usersModels/UsuariosModels'
import { authServices } from '@/services/authService'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usuarioAutenticado = defineStore('logado', () => {
  const usuario = ref<UsuarioConsulta>({
    idUsuario: 0,
    nome: '',
    email: '',
    permissao: '',
    autorizaSaida: false,
    ativo: false,
    contaBloqueada: false,
    senhaExpirada: false,
  })

  return {
    usuario,
  }
})

import type { UsuarioConsulta } from '@/models/usersModels/UsuariosModels'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usuarioAutenticado = defineStore('logado', () => {
  // Modificar
  const usuario = ref<UsuarioConsulta>({
    idUsuario: 0,
    nome: '',
    email: '',
    permissao: '',
    celularUsuario: '',
    receberNotificacoes: false,
    autorizaSaida: false,
    ativo: false,
    contaBloqueada: false,
    contaExpiraEm: '',
    senhaExpirada: false,
    tentativasFalhas: 0,
  })

  // Função para atualizar o usuário autenticado
  function setUsuario(usuarioData: UsuarioConsulta) {
    usuario.value = usuarioData
  }

  return {
    usuario,
    setUsuario,
  }
})

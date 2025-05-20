import { type HeaderPaginatorModel } from '@/models/HeaderPaginatorModel'
import type { UsuarioConsulta } from '@/models/usersModels/UsuariosModels'
import { useServicesUsuario } from '@/services/usuariosService'
import { ref } from 'vue'

const showDialogUsers = ref(false)
const userToEdit = ref<UsuarioConsulta | null>(null)
const emptyUser: UsuarioConsulta = {
  nome: '',
  email: '',
  permissao: 'EMITE_SAIDA',
  contaBloqueada: true,
  ativo: false,
  idUsuario: 0,
  autorizaSaida: false,
  senhaExpirada: false,
  tentativasFalhas: 0,
}

var apiUsers = ref<HeaderPaginatorModel<UsuarioConsulta>>()
var isEditing = ref<Boolean>()

function startCreatingNewUser() {
  userToEdit.value = null
  isEditing.value = false
}

function closeUserDialog() {
  userToEdit.value = null
  isEditing.value = false
}

async function createNewUser(newUser: UsuarioConsulta) {
  isEditing.value = false
  await useServicesUsuario.createUser(newUser)
  apiUsers.value = await useServicesUsuario.getAllUsers()
  closeUserDialog()
}

async function updateUser(user: UsuarioConsulta) {
  isEditing.value = true
  await useServicesUsuario.updateUser(user)
  apiUsers.value = await useServicesUsuario.getAllUsers()
  closeUserDialog()
}

async function toggleBloqueioUsuario(user: UsuarioConsulta) {
  userToEdit.value = { ...user }
  userToEdit.value.contaBloqueada = !userToEdit.value.contaBloqueada
  await useServicesUsuario.updateUser(userToEdit.value)
  apiUsers.value = await useServicesUsuario.getAllUsers()
}

async function toggleUsuarioAtivo(user: UsuarioConsulta) {
  userToEdit.value = { ...user }
  userToEdit.value.ativo = !userToEdit.value.ativo
  await useServicesUsuario.updateUser(userToEdit.value)
  apiUsers.value = await useServicesUsuario.getAllUsers()
}

async function deleteUser(id: number) {
  await useServicesUsuario.deleteUser(id)
  closeUserDialog()
}

function completeFormEditUserDialog(user: UsuarioConsulta) {
  isEditing.value = true
  userToEdit.value = { ...user }
}

export function useDialogStoreUsers() {
  return {
    userToEdit,
    useServicesUsuario,
    emptyUser,
    apiUsers,
    isEditing,
    startCreatingNewUser,
    closeUserDialog,
    createNewUser,
    updateUser,
    toggleBloqueioUsuario,
    toggleUsuarioAtivo,
    deleteUser,
    completeFormEditUserDialog,
  }
}

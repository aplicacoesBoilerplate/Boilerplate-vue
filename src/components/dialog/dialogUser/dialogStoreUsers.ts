import { type HeaderPaginatorModel } from '@/models/HeaderPaginatorModel'
import type { Users } from '@/models/UsersModel'
import type { UsuarioConsulta } from '@/models/usersModels/UsuariosModels'
import { usersServices } from '@/services/usersService'
import { ref } from 'vue'

const showDialogUsers = ref(false)
const userToEdit = ref<UsuarioConsulta | null>(null)
const userService = usersServices()
const emptyUser: UsuarioConsulta = {
  nome: '',
  email: '',
  permissao: 'USER',
  contaBloqueada: true,
  ativo: false,
  idUsuario: 0,
  autorizaSaida: false,
  senhaExpirada: false,
  tentativasFalhas: 0
}

var apiUsers = ref<HeaderPaginatorModel<UsuarioConsulta>>()
var isEditing = ref<Boolean>()

function openUserDialog() {
  showDialogUsers.value = true
  isEditing.value = false
}

function startCreatingNewUser() {
  userToEdit.value = null
  isEditing.value = false
  openUserDialog()
}

function closeUserDialog() {
  showDialogUsers.value = false
  userToEdit.value = null
  isEditing.value = false
}

async function createNewUser(newUser: UsuarioConsulta) {
  isEditing.value = false
  await userService.createUser(newUser)
  apiUsers.value = await userService.getAllUsers()
  closeUserDialog()
}

async function updateUser(user: UsuarioConsulta) {
  isEditing.value = true
  await userService.updateUser(user)
  apiUsers.value = await userService.getAllUsers()
  closeUserDialog()
}

async function toggleBloqueioUsuario(user: UsuarioConsulta) {
  userToEdit.value = { ...user }
  userToEdit.value.contaBloqueada = !userToEdit.value.contaBloqueada
  await userService.updateUser(userToEdit.value)
  apiUsers.value = await userService.getAllUsers()
}

async function toggleUsuarioAtivo(user: UsuarioConsulta) {
  userToEdit.value = { ...user }
  userToEdit.value.ativo = !userToEdit.value.ativo
  await userService.updateUser(userToEdit.value)
  apiUsers.value = await userService.getAllUsers()
}

async function deleteUser(id: number) {
  await userService.deleteUser(id)
  closeUserDialog()
}

function completeFormEditUserDialog(user: UsuarioConsulta) {
  isEditing.value = true
  userToEdit.value = { ...user }
  showDialogUsers.value = true
}

export function useDialogStoreUsers() {
  return {
    showDialogUsers,
    userToEdit,
    userService,
    emptyUser,
    apiUsers,
    isEditing,
    openUserDialog,
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

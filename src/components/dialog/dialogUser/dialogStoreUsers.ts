import { type HeaderPaginatorModel } from '@/models/HeaderPaginatorModel'
import type { UsuarioConsulta } from '@/models/usersModels/UsuariosModels'
import { usuariosServices } from '@/services/usuariosService'
import { useSnackbarStore } from '@/stores/SnackbarStore'
import { ref } from 'vue'

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
  try {
    await usuariosServices.createUser(newUser)
    useSnackbarStore().showSnackbar('Usuário criado com sucesso!', 'success')
  } catch (error) {
    useSnackbarStore().showSnackbar(error, 'red')
    throw error
  }
  closeUserDialog()
}

async function updateUser(user: UsuarioConsulta) {
  isEditing.value = true
  try {
    await usuariosServices.updateUser(user)
    useSnackbarStore().showSnackbar('Usuário modificado com sucesso!', 'success')
  } catch (error) {
    useSnackbarStore().showSnackbar(error, 'red')
    throw error
  }
  closeUserDialog()
}

async function toggleBloqueioUsuario(user: UsuarioConsulta) {
  userToEdit.value = { ...user }
  userToEdit.value.contaBloqueada = !userToEdit.value.contaBloqueada
  await usuariosServices.updateUser(userToEdit.value)
}

async function toggleUsuarioAtivo(user: UsuarioConsulta) {
  userToEdit.value = { ...user }
  userToEdit.value.ativo = !userToEdit.value.ativo
  await usuariosServices.updateUser(userToEdit.value)
}

async function deleteUser(id: number) {
  await usuariosServices.deleteUser(id)
  closeUserDialog()
}

function completeFormEditUserDialog(user: UsuarioConsulta) {
  isEditing.value = true
  userToEdit.value = { ...user }
}

export function useDialogStoreUsers() {
  return {
    userToEdit,
    useServicesUsuario: usuariosServices,
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

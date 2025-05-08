import type { Users } from '@/models/UsersModel'
import { usersServices } from '@/services/usersService'
import { ref } from 'vue'

const showDialogUsers = ref(false)
const userToEdit = ref<Users | null>(null)
const userService = usersServices()
const emptyUser: Users = {
  username: '',
  email: '',
  senha: '',
  permissao: 'USER',
  bloqueado: true,
  ativo: false,
}

var apiUsers = ref<Users[]>([])
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

async function createNewUser(newUser: Users) {
  isEditing.value = false
  await userService.createUser(newUser)
  apiUsers.value = await userService.getAllUsers()
  closeUserDialog()
}

async function updateUser(user: Users) {
  isEditing.value = true
  await userService.updateUser(user)
  apiUsers.value = await userService.getAllUsers()
  closeUserDialog()
}

async function toggleBloqueioUsuario(user: Users) {
  userToEdit.value = { ...user }
  userToEdit.value.bloqueado = !userToEdit.value.bloqueado
  await userService.updateUser(userToEdit.value)
  apiUsers.value = await userService.getAllUsers()
}

async function toggleUsuarioAtivo(user: Users) {
  userToEdit.value = { ...user }
  userToEdit.value.ativo = !userToEdit.value.ativo
  await userService.updateUser(userToEdit.value)
  apiUsers.value = await userService.getAllUsers()
}

async function deleteUser(id: number) {
  await userService.deleteUser(id)
  closeUserDialog()
}

function completeFormEditUserDialog(user: Users) {
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
